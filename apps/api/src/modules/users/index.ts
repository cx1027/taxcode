import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const userRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // Get current user profile
  app.get(
    "/me",
    {
      onRequest: [app.authenticate],
      schema: {
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
            firstName: Type.String(),
            lastName: Type.String(),
            organizationId: Type.Union([Type.String(), Type.Null()]),
            role: Type.String(),
            createdAt: Type.String(),
            updatedAt: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, request.user.sub),
      });

      if (!user) {
        throw { statusCode: 404, message: "User not found" };
      }

      return user;
    }
  );

  // Update user profile
  app.patch(
    "/me",
    {
      onRequest: [app.authenticate],
      schema: {
        body: Type.Object({
          firstName: Type.Optional(Type.String()),
          lastName: Type.Optional(Type.String()),
          phone: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
            firstName: Type.String(),
            lastName: Type.String(),
            organizationId: Type.Union([Type.String(), Type.Null()]),
            role: Type.String(),
            createdAt: Type.String(),
            updatedAt: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { firstName, lastName, phone } = request.body as { firstName?: string; lastName?: string; phone?: string };

      const [updated] = await db
        .update(users)
        .set({
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone && { phone }),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, request.user.sub))
        .returning();

      if (!updated) {
        return reply.code(404).send({
          statusCode: 404,
          error: "NotFound",
          message: "User not found",
        });
      }

      return updated;
    }
  );
};
