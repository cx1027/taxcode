import type { FastifyPluginAsync } from "fastify";

export const taxEngineRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/calculate", async (request, reply) => {
    // TODO: proxy to Rust engine at TAX_ENGINE_URL
    return reply.status(501).send({ error: "Not implemented" });
  });

  fastify.post("/validate", async (request, reply) => {
    // TODO: proxy to Rust engine
    return reply.status(501).send({ error: "Not implemented" });
  });
};
