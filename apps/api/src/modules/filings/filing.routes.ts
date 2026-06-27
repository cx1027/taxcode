import type { FastifyPluginAsync } from "fastify";

export const filingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return { filings: [] };
  });

  fastify.get("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.post("/", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.put("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.post("/:id/submit", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });
};
