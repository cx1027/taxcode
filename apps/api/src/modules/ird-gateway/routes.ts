import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { irdClient } from "./client";
import { irdEnv } from "./config";

export const irdGatewayRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // Submit filing to IRD
  app.post(
    "/submit",
    {
      onRequest: [app.authenticate],
      schema: {
        body: Type.Object({
          filingId: Type.String(),
          taxpayerId: Type.String(),
          taxYear: Type.Number(),
          income: Type.Number(),
          deductions: Type.Number(),
          taxLiability: Type.Number(),
          documentIds: Type.Array(Type.String()),
        }),
        response: {
          200: Type.Object({
            submission_id: Type.String(),
            status: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await irdClient.submitFiling(request.body);
        return reply.send(result);
      } catch (error) {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: error instanceof Error ? error.message : "IRD submission failed",
        });
      }
    }
  );

  // Check submission status
  app.get(
    "/status/:submissionId",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ submissionId: Type.String() }),
        response: {
          200: Type.Object({
            submission_id: Type.String(),
            status: Type.String(),
            status_date: Type.String(),
            notice_number: Type.Optional(Type.String()),
            rejection_reason: Type.Optional(Type.String()),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await irdClient.getStatus(request.params.submissionId);
        return reply.send(result);
      } catch (error) {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: error instanceof Error ? error.message : "IRD status check failed",
        });
      }
    }
  );

  // Upload document to IRD
  app.post(
    "/document/upload",
    {
      onRequest: [app.authenticate],
      schema: {
        body: Type.Object({
          fileName: Type.String(),
          documentType: Type.String(),
          filingId: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            document_id: Type.String(),
            status: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        // In production: receive actual file from multipart
        // For demo: simulate with empty buffer
        const result = await irdClient.uploadDocument({
          fileName: request.body.fileName,
          documentType: request.body.documentType,
          filingId: request.body.filingId,
          content: Buffer.from("demo file content"),
        });
        return reply.send(result);
      } catch (error) {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: error instanceof Error ? error.message : "IRD document upload failed",
        });
      }
    }
  );

  // Get notices
  app.get(
    "/notices/:taxpayerId",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ taxpayerId: Type.String() }),
      },
    },
    async (request, reply) => {
      try {
        const notices = await irdClient.getNotices(request.params.taxpayerId);
        return reply.send(notices);
      } catch (error) {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: error instanceof Error ? error.message : "IRD notices fetch failed",
        });
      }
    }
  );

  // IRD health check
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: Type.Object({
            status: Type.String(),
            environment: Type.String(),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.send({
        status: "ok",
        environment: irdEnv.IRD_ENV,
      });
    }
  );
};
