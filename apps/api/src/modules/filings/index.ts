import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../db";
import { filings, filingSections } from "../../db/schema";
import { FilingSchema, CreateFilingSchema, UpdateFilingSchema, FilingStatusEnum } from "@taxcode/shared-types";

export const filingRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // List filings
  app.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        querystring: Type.Object({
          status: Type.Optional(FilingStatusEnum),
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
      const { status, page = 1, pageSize = 20 } = request.query;
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
        body: CreateFilingSchema,
        response: {
          201: FilingSchema,
        },
      },
    },
    async (request, reply) => {
      const { taxYear, taxpayerType } = request.body;

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
        body: UpdateFilingSchema,
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
      const { data } = request.body;

      // Upsert section
      const [section] = await db
        .insert(filingSections)
        .values({
          filingId: id,
          sectionType,
          data: data as Record<string, unknown>,
          isComplete: true,
          completedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: [filingSections.filingId, filingSections.sectionType],
          set: {
            data: data as Record<string, unknown>,
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
