import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const authRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        body: Type.Object({
          email: Type.String({ format: "email" }),
          password: Type.String({ minLength: 8 }),
          firstName: Type.String({ minLength: 1 }),
          lastName: Type.String({ minLength: 1 }),
        }),
        response: {
          201: Type.Object({
            token: Type.String(),
            user: Type.Object({
              id: Type.String(),
              email: Type.String(),
              firstName: Type.String(),
              lastName: Type.String(),
              organizationId: Type.Union([Type.String(), Type.Null()]),
              role: Type.String(),
              createdAt: Type.String(),
              updatedAt: Type.String(),
            }),
          }),
          400: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { email, password, firstName, lastName } = request.body as { email: string; password: string; firstName: string; lastName: string };

      // Check if user exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existing) {
        return reply.code(400).send({
          statusCode: 400,
          error: "BadRequest",
          message: "Email already registered",
        });
      }

      // In production: hash password with bcrypt
      // For demo: create user directly
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: password, // TODO: hash
          firstName,
          lastName,
        })
        .returning();

      const token = app.jwt.sign({
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return reply.code(201).send({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          organizationId: newUser.organizationId,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      });
    }
  );

  app.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          email: Type.String({ format: "email" }),
          password: Type.String({ minLength: 8 }),
        }),
        response: {
          200: Type.Object({
            token: Type.String(),
            user: Type.Object({
              id: Type.String(),
              email: Type.String(),
              firstName: Type.String(),
              lastName: Type.String(),
              organizationId: Type.Union([Type.String(), Type.Null()]),
              role: Type.String(),
              createdAt: Type.String(),
              updatedAt: Type.String(),
            }),
          }),
          401: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user || user.passwordHash !== password) {
        return reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      const token = app.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          organizationId: user.organizationId,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }
  );
};
