import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { ZodError } from "zod";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
      },
    },
    async (request, reply) => {
      // TODO: validate credentials against DB
      const { email } = loginSchema.parse(request.body);
      const token = fastify.jwt.sign({ sub: email });
      return reply.send({ token });
    }
  );

  fastify.post("/register", async (request, reply) => {
    // TODO: implement registration
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.get("/me", {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    return { user: request.user };
  });
};

declare module "fastify" {
  interface FastifyRequest {
    user: { sub: string };
  }
}
