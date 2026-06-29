import type { FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["token", "user"],
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                required: ["id", "email", "firstName", "lastName", "organizationId", "role", "createdAt", "updatedAt"],
                properties: {
                  id: { type: "string" },
                  email: { type: "string", format: "email" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  organizationId: { type: ["string", "null"] },
                  role: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
          401: {
            type: "object",
            required: ["statusCode", "error", "message"],
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
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

      const token = fastify.jwt.sign({
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

  fastify.post(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
          },
        },
        response: {
          201: {
            type: "object",
            required: ["token", "user"],
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                required: ["id", "email", "firstName", "lastName", "organizationId", "role", "createdAt", "updatedAt"],
                properties: {
                  id: { type: "string" },
                  email: { type: "string", format: "email" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  organizationId: { type: ["string", "null"] },
                  role: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
          400: {
            type: "object",
            required: ["statusCode", "error", "message"],
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password, firstName, lastName } = request.body as { email: string; password: string; firstName: string; lastName: string };

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

      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: password,
          firstName,
          lastName,
        })
        .returning();

      const token = fastify.jwt.sign({
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

  fastify.get("/me", { onRequest: [fastify.authenticate] }, async (request) => {
    return { user: request.user };
  });

  fastify.post(
    "/google",
    {
      schema: {
        body: {
          type: "object",
          required: ["googleId", "email", "firstName", "lastName"],
          properties: {
            googleId: { type: "string" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            picture: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["token", "user"],
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                required: ["id", "email", "firstName", "lastName", "organizationId", "role", "createdAt", "updatedAt"],
                properties: {
                  id: { type: "string" },
                  email: { type: "string", format: "email" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  organizationId: { type: ["string", "null"] },
                  role: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { googleId, email, firstName, lastName, picture } = request.body as {
        googleId: string;
        email: string;
        firstName: string;
        lastName: string;
        picture?: string;
      };

      const existing = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      let user = existing;

      if (!user) {
        const [created] = await db
          .insert(users)
          .values({
            email,
            passwordHash: `google:${googleId}`,
            firstName,
            lastName,
          })
          .returning();
        user = created;
      }

      const token = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        googleId,
        picture,
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

declare module "fastify" {
  interface FastifyRequest {
    user: { sub: string };
  }
}
