import type { FastifyPluginAsync } from "fastify";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return { users: [] };
  });

  fastify.get("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.put("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });
};
