import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { documents, filings } from "../../db/schema";
import { irdClient } from "../ird-gateway/client";
import { jobProducers } from "../jobs/producers";

// ─── IRD Document Upload Integration ───────────────────────────────────────────

export const irdDocumentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // Upload document to IRD (on-demand)
  app.post(
    "/:documentId/upload-to-ird",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ documentId: Type.String() }),
        response: {
          200: Type.Object({
            success: Type.Boolean(),
            iras_document_id: Type.String(),
            status: Type.String(),
          }),
          404: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { documentId } = request.params;

      // Fetch document
      const doc = await db.query.documents.findFirst({
        where: eq(documents.id, documentId),
      });

      if (!doc) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Document not found",
        });
      }

      // Check if already uploaded to IRD
      if (doc.url?.includes("ird-doc-")) {
        return reply.send({
          success: true,
          iras_document_id: doc.url,
          status: "already_uploaded",
        });
      }

      // Upload to IRD
      try {
        const result = await irdClient.uploadDocument({
          fileName: doc.fileName,
          documentType: doc.documentType,
          filingId: doc.filingId,
          content: Buffer.from("demo file content"), // In production: fetch from S3
        });

        // Update document with IRD reference
        await db
          .update(documents)
          .set({
            url: result.document_id,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(documents.id, documentId));

        return reply.send({
          success: true,
          iras_document_id: result.document_id,
          status: result.status,
        });
      } catch (error) {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: error instanceof Error ? error.message : "IRD upload failed",
        });
      }
    }
  );

  // Bulk upload all documents for a filing to IRD
  app.post(
    "/filing/:filingId/upload-all",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ filingId: Type.String() }),
        response: {
          200: Type.Object({
            total: Type.Number(),
            uploaded: Type.Number(),
            failed: Type.Number(),
            results: Type.Array(Type.Object({
              document_id: Type.String(),
              iras_document_id: Type.String(),
              status: Type.String(),
            })),
          }),
        },
      },
    },
    async (request, reply) => {
      const { filingId } = request.params;

      // Verify filing exists
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

      // Get all documents for this filing
      const filingDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.filingId, filingId));

      const results = [];
      let uploaded = 0;
      let failed = 0;

      for (const doc of filingDocs) {
        try {
          const result = await irdClient.uploadDocument({
            fileName: doc.fileName,
            documentType: doc.documentType,
            filingId,
            content: Buffer.from("demo file content"),
          });

          await db
            .update(documents)
            .set({ url: result.document_id, updatedAt: new Date().toISOString() })
            .where(eq(documents.id, doc.id));

          results.push({
            document_id: doc.id,
            iras_document_id: result.document_id,
            status: result.status,
          });
          uploaded++;
        } catch {
          results.push({
            document_id: doc.id,
            iras_document_id: "",
            status: "failed",
          });
          failed++;
        }
      }

      return reply.send({ total: filingDocs.length, uploaded, failed, results });
    }
  );

  // Get IRD document status
  app.get(
    "/:documentId/status",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ documentId: Type.String() }),
        response: {
          200: Type.Object({
            document_id: Type.String(),
            iras_document_id: Type.String(),
            status: Type.String(),
            uploaded_at: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { documentId } = request.params;

      const doc = await db.query.documents.findFirst({
        where: eq(documents.id, documentId),
      });

      if (!doc) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Document not found",
        });
      }

      return {
        document_id: doc.id,
        iras_document_id: doc.url ?? "",
        status: doc.status,
        uploaded_at: doc.uploadedAt?.toISOString() ?? "",
      };
    }
  );
};
