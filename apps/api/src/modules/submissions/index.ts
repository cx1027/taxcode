import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { filings, submissionRecords, auditLogs } from "../../db/schema";
import { irdClient } from "../ird-gateway/client";
import { jobProducers } from "../jobs/producers";

// ─── Submission State Machine ──────────────────────────────────────────────────

type SubmissionStatus =
  | "draft"
  | "ready_for_review"
  | "submitted"
  | "processing"
  | "accepted"
  | "rejected"
  | "notice_received"
  | "needs_correction";

const SUBMISSION_TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  draft: ["ready_for_review"],
  ready_for_review: ["submitted", "draft"],
  submitted: ["processing", "rejected"],
  processing: ["accepted", "rejected"],
  accepted: ["notice_received"],
  rejected: ["needs_correction"],
  notice_received: [],
  needs_correction: ["draft"],
};

function canTransition(from: SubmissionStatus, to: SubmissionStatus): boolean {
  return SUBMISSION_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Routes ────────────────────────────────────────────────────────────────────

export const submissionRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // Submit a filing
  app.post(
    "/:filingId/submit",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ filingId: Type.String() }),
        response: {
          200: Type.Object({
            success: Type.Boolean(),
            submission_id: Type.String(),
            status: Type.String(),
            message: Type.String(),
          }),
          400: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
          404: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
          409: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { filingId } = request.params;
      const userId = request.user.sub;

      // 1. Fetch filing
      const filing = await db.query.filings.findFirst({
        where: eq(filings.id, filingId),
      });

      if (!filing) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Filing not found",
        });
      }

      // 2. Check if filing is ready for submission
      if (filing.status !== "ready_for_review") {
        return reply.code(400).send({
          statusCode: 400,
          error: "BadRequest",
          message: `Filing must be in "ready_for_review" status to submit. Current status: ${filing.status}`,
        });
      }

      // 3. Check for existing successful submission
      const existingSubmission = await db.query.submissionRecords.findFirst({
        where: and(
          eq(submissionRecords.filingId, filingId),
          eq(submissionRecords.status, "accepted")
        ),
      });

      if (existingSubmission) {
        return reply.code(409).send({
          statusCode: 409,
          error: "Conflict",
          message: "This filing has already been submitted successfully",
        });
      }

      // 4. Calculate tax (mock - in production call Rust engine)
      const totalIncome = filing.totalIncome ?? 0;
      const totalDeductions = filing.totalDeductions ?? 0;
      const taxLiability = Math.max(0, (totalIncome - totalDeductions) * 0.2); // Simplified

      // 5. Get associated documents
      const { documents } = await import("../../db/schema");
      const filingDocs = await db
        .select({ id: documents.id })
        .from(documents)
        .where(eq(documents.filingId, filingId));

      const documentIds = filingDocs.map((d) => d.id);

      // 6. Submit to IRD
      let irdResult;
      try {
        irdResult = await irdClient.submitFiling({
          filingId,
          taxpayerId: filing.id, // In production: use actual taxpayer ID
          taxYear: filing.taxYear,
          income: totalIncome,
          deductions: totalDeductions,
          taxLiability,
          documentIds,
        });
      } catch (error) {
        // Record failed submission
        await db.insert(submissionRecords).values({
          filingId,
          status: "rejected",
          responseData: { error: error instanceof Error ? error.message : "Unknown error" },
        });

        await db.insert(auditLogs).values({
          userId,
          action: "filing.submit_failed",
          resourceType: "filing",
          resourceId: filingId,
          metadata: { error: error instanceof Error ? error.message : "Unknown" },
        });

        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: `Failed to submit to IRD: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }

      // 7. Update filing status
      await db
        .update(filings)
        .set({
          status: "submitted",
          filedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedTax: taxLiability,
        })
        .where(eq(filings.id, filingId));

      // 8. Save submission record
      await db.insert(submissionRecords).values({
        filingId,
        irasSubmissionId: irdResult.submission_id,
        status: irdResult.status === "accepted" ? "submitted" : "rejected",
        responseData: irdResult,
      });

      // 9. Audit log
      await db.insert(auditLogs).values({
        userId,
        action: "filing.submitted",
        resourceType: "filing",
        resourceId: filingId,
        metadata: {
          submissionId: irdResult.submission_id,
          status: irdResult.status,
        },
      });

      // 10. Enqueue notification
      await jobProducers.sendNotification({
        userId,
        type: "filing_submitted",
        title: "Filing Submitted",
        message: `Your filing ${filing.name} has been submitted to IRD.`,
      });

      return reply.send({
        success: true,
        submission_id: irdResult.submission_id,
        status: irdResult.status,
        message: irdResult.message ?? "Filing submitted successfully",
      });
    }
  );

  // Get submission status
  app.get(
    "/:filingId",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ filingId: Type.String() }),
        response: {
          200: Type.Object({
            filingId: Type.String(),
            submission_id: Type.String(),
            status: Type.String(),
            submitted_at: Type.String(),
            response_data: Type.Any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { filingId } = request.params;

      const submission = await db.query.submissionRecords.findFirst({
        where: eq(submissionRecords.filingId, filingId),
        orderBy: [desc(submissionRecords.createdAt)],
      });

      if (!submission) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "No submission found for this filing",
        });
      }

      return {
        filingId: submission.filingId,
        submission_id: submission.irasSubmissionId,
        status: submission.status,
        submitted_at: submission.submittedAt?.toISOString() ?? "",
        response_data: submission.responseData,
      };
    }
  );

  // List all submissions
  app.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        querystring: Type.Object({
          status: Type.Optional(Type.String()),
        }),
      },
    },
    async (request) => {
      const { status } = request.query;

      const conditions = [];
      if (status) {
        conditions.push(eq(submissionRecords.status, status as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(submissionRecords)
        .where(whereClause)
        .orderBy(desc(submissionRecords.createdAt));
    }
  );
};
