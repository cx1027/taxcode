import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  fastify.get("/ready", async () => {
    return {
      status: "ready",
      timestamp: new Date().toISOString(),
      services: {
        database: "unknown",
        redis: "unknown",
        taxEngine: "unknown",
      },
    };
  });
};
