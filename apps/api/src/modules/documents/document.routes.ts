import type { FastifyPluginAsync } from "fastify";

export const documentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return { documents: [] };
  });

  fastify.get("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.post("/", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.delete("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });
};
