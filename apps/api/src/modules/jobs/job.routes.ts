import type { FastifyPluginAsync } from "fastify";

export const jobRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return { jobs: [] };
  });

  fastify.get("/:id", async (request, reply) => {
    return reply.status(501).send({ error: "Not implemented" });
  });
};
