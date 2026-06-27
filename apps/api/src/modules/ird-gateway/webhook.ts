import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createHmac, timingSafeEqual } from "crypto";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../db";
import { filings, submissionRecords } from "../../db/schema";
import { irdClient } from "../ird-gateway/client";
import { irdEnv } from "../ird-gateway/config";
import { jobProducers } from "../jobs/producers";

// ─── IRD Status → Internal FilingStatus Mapping ───────────────────────────────

const IRD_STATUS_MAP: Record<string, string> = {
  submitted: "submitted",
  processing: "submitted",
  accepted: "completed",
  rejected: "rejected",
  notice_received: "completed",
};

// ─── Webhook Signature Verification ────────────────────────────────────────────

function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!irdEnv.IRD_WEBHOOK_SECRET) {
    console.warn("[Webhook] No secret configured, skipping verification");
    return true;
  }

  const expected = createHmac("sha256", irdEnv.IRD_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

// ─── Routes ────────────────────────────────────────────────────────────────────

export const irdWebhookRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // IRD Webhook endpoint (no JWT auth, uses HMAC signature)
  app.post(
    "/webhook",
    {
      config: { rawBody: true },
      schema: {
        headers: Type.Object({
          "x-ird-signature": Type.String(),
          "x-ird-event": Type.String(),
        }),
        response: {
          200: Type.Object({ received: Type.Boolean() }),
          401: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const signature = request.headers["x-ird-signature"];
      const event = request.headers["x-ird-event"];
      const body = JSON.stringify(request.body);

      // Verify signature
      if (!verifyWebhookSignature(body, signature)) {
        return reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid webhook signature",
        });
      }

      const payload = request.body as {
        submission_id: string;
        status: string;
        notice_number?: string;
        rejection_reason?: string;
      };

      console.log(`[Webhook] Event: ${event}, Submission: ${payload.submission_id}, Status: ${payload.status}`);

      // Find submission record
      const submission = await db.query.submissionRecords.findFirst({
        where: eq(submissionRecords.irasSubmissionId, payload.submission_id)
      });

      if (!submission) {
        console.warn(`[Webhook] Submission not found: ${payload.submission_id}`);
        return reply.send({ received: true });
      }

      // Map IRD status to internal status
      const internalStatus = IRD_STATUS_MAP[payload.status] ?? submission.status;

      // Update submission record
      await db
        .update(submissionRecords)
        .set({
          status: internalStatus,
          responseData: {
            ...((submission.responseData as object) ?? {}),
            ...payload,
            last_webhook: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(submissionRecords.id, submission.id));

      // Update filing status
      await db
        .update(filings)
        .set({
          status: internalStatus,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(filings.id, submission.filingId));

      // Notify user
      await jobProducers.sendNotification({
        userId: "", // In production: get filing owner
        type: `ird_status_${internalStatus}`,
        title: `Filing Status Update`,
        message: `Your filing status has been updated to: ${internalStatus}`,
      });

      return reply.send({ received: true });
    }
  );

  // Manual status polling endpoint
  app.post(
    "/poll/:submissionId",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ submissionId: Type.String() }),
        response: {
          200: Type.Object({
            submission_id: Type.String(),
            status: Type.String(),
            changed: Type.Boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { submissionId } = request.params;

      const submission = await db.query.submissionRecords.findFirst({
        where: eq(submissionRecords.irasSubmissionId, submissionId),
      });

      if (!submission) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Submission not found",
        });
      }

      // Poll IRD for latest status
      try {
        const irdStatus = await irdClient.getStatus(submissionId);
        const internalStatus = IRD_STATUS_MAP[irdStatus.status] ?? submission.status;
        const changed = internalStatus !== submission.status;

        if (changed) {
          // Update records
          await db
            .update(submissionRecords)
            .set({
              status: internalStatus,
              responseData: {
                ...((submission.responseData as object) ?? {}),
                ...irdStatus,
                last_polled: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            })
            .where(eq(submissionRecords.id, submission.id));

          await db
            .update(filings)
            .set({
              status: internalStatus,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(filings.id, submission.filingId));

          // Notify user
          await jobProducers.sendNotification({
            userId: "",
            type: `ird_status_${internalStatus}`,
            title: `Filing Status Update`,
            message: `Your filing status has been updated to: ${internalStatus}`,
          });
        }

        return {
          submission_id: submissionId,
          status: internalStatus,
          changed,
        };
      } catch (error) {
        return {
          submission_id: submissionId,
          status: submission.status,
          changed: false,
        };
      }
    }
  );
};
