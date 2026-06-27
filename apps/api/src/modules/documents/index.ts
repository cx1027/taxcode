import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { documents } from "../../db/schema";
import { DocumentSchema, UploadDocumentSchema, DocumentStatusEnum } from "@taxcode/shared-types";

export const documentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // List documents
  app.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        querystring: Type.Object({
          filingId: Type.Optional(Type.String()),
          status: Type.Optional(DocumentStatusEnum),
        }),
        response: {
          200: Type.Array(DocumentSchema),
        },
      },
    },
    async (request) => {
      const { filingId, status } = request.query;

      const conditions = [];
      if (filingId) conditions.push(eq(documents.filingId, filingId));
      if (status) conditions.push(eq(documents.status, status));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(documents)
        .where(whereClause)
        .orderBy(desc(documents.createdAt));
    }
  );

  // Get document by ID
  app.get(
    "/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: { 200: DocumentSchema },
      },
    },
    async (request, reply) => {
      const doc = await db.query.documents.findFirst({
        where: eq(documents.id, request.params.id),
      });

      if (!doc) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Document not found",
        });
      }

      return doc;
    }
  );

  // Create document (metadata only, file upload handled separately)
  app.post(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        body: UploadDocumentSchema,
        response: { 201: DocumentSchema },
      },
    },
    async (request, reply) => {
      const { filingId, type, name, size } = request.body;

      const [newDoc] = await db
        .insert(documents)
        .values({
          filingId,
          documentType: type,
          fileName: name,
          size,
          status: "pending",
        })
        .returning();

      return reply.code(201).send(newDoc);
    }
  );

  // Update document status
  app.patch(
    "/:id/status",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ id: Type.String() }),
        body: Type.Object({ status: DocumentStatusEnum }),
        response: { 200: DocumentSchema },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      const [updated] = await db
        .update(documents)
        .set({ status, updatedAt: new Date().toISOString() })
        .where(eq(documents.id, id))
        .returning();

      if (!updated) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Document not found",
        });
      }

      return updated;
    }
  );

  // Delete document
  app.delete(
    "/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: { 204: Type.Null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const deleted = await db
        .delete(documents)
        .where(eq(documents.id, id))
        .returning({ id: documents.id });

      if (deleted.length === 0) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Document not found",
        });
      }

      return reply.code(204).send();
    }
  );
};
