import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../db";
import { filings, filingSections } from "../../db/schema";

const FilingSchema = Type.Object({
  id: Type.String(),
  organizationId: Type.Union([Type.String(), Type.Null()]),
  taxYear: Type.Number(),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("in_progress"),
    Type.Literal("needs_attention"),
    Type.Literal("ready_for_review"),
    Type.Literal("submitted"),
    Type.Literal("completed"),
    Type.Literal("rejected"),
    Type.Literal("error"),
  ]),
  taxpayerType: Type.Union([Type.Literal("individual"), Type.Literal("business")]),
  totalIncome: Type.Union([Type.Number(), Type.Null()]),
  totalDeductions: Type.Union([Type.Number(), Type.Null()]),
  estimatedTax: Type.Union([Type.Number(), Type.Null()]),
  filedAt: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const filingRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // List filings
  app.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        querystring: Type.Object({
          status: Type.Optional(Type.String()),
          page: Type.Optional(Type.Number({ minimum: 1 })),
          pageSize: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
        }),
        response: {
          200: Type.Object({
            items: Type.Array(FilingSchema),
            total: Type.Number(),
            page: Type.Number(),
            pageSize: Type.Number(),
          }),
        },
      },
    },
    async (request) => {
      const { status, page = 1, pageSize = 20 } = request.query as { status?: string; page?: number; pageSize?: number };
      const offset = (page - 1) * pageSize;

      const conditions = [];
      if (status) {
        conditions.push(eq(filings.status, status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(filings)
        .where(whereClause)
        .orderBy(desc(filings.updatedAt))
        .limit(pageSize)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(filings)
        .where(whereClause);

      return { items, total: Number(count), page, pageSize };
    }
  );

  // Get filing by ID
  app.get(
    "/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: {
          200: FilingSchema,
        },
      },
    },
    async (request, reply) => {
      const filing = await db.query.filings.findFirst({
        where: eq(filings.id, request.params.id),
      });

      if (!filing) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Filing not found",
        });
      }

      return filing;
    }
  );

  // Create filing
  app.post(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        body: Type.Object({
          taxYear: Type.Number(),
          taxpayerType: Type.Union([Type.Literal("individual"), Type.Literal("business")]),
        }),
        response: {
          201: FilingSchema,
        },
      },
    },
    async (request, reply) => {
      const { taxYear, taxpayerType } = request.body as { taxYear: number; taxpayerType: string };

      const [newFiling] = await db
        .insert(filings)
        .values({
          taxYear,
          taxpayerType,
          status: "draft",
          organizationId: null,
        })
        .returning();

      return reply.code(201).send(newFiling);
    }
  );

  // Update filing
  app.patch(
    "/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({ id: Type.String() }),
        body: Type.Object({
          status: Type.Optional(Type.String()),
          totalIncome: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
          totalDeductions: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
          estimatedTax: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
        }),
        response: {
          200: FilingSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      const [updated] = await db
        .update(filings)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(filings.id, id))
        .returning();

      if (!updated) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "Filing not found",
        });
      }

      return updated;
    }
  );

  // Save filing section
  app.put(
    "/:id/sections/:sectionType",
    {
      onRequest: [app.authenticate],
      schema: {
        params: Type.Object({
          id: Type.String(),
          sectionType: Type.String(),
        }),
        body: Type.Object({
          data: Type.Record(Type.String(), Type.Any()),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            filingId: Type.String(),
            sectionType: Type.String(),
            isComplete: Type.Boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id, sectionType } = request.params;
      const { data } = request.body as { data: Record<string, unknown> };

      // Upsert section
      const [section] = await db
        .insert(filingSections)
        .values({
          filingId: id,
          sectionType,
          data: data,
          isComplete: true,
          completedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: [filingSections.filingId, filingSections.sectionType],
          set: {
            data: data,
            isComplete: true,
            completedAt: new Date().toISOString(),
          },
        })
        .returning();

      return {
        id: section.id,
        filingId: section.filingId,
        sectionType: section.sectionType,
        isComplete: section.isComplete,
      };
    }
  );
};
