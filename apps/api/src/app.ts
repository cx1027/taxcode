import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { env } from "./config";
import { authPlugin } from "./plugins/auth";
import { errorHandler } from "./plugins/error-handler";
import { healthRoutes } from "./modules/health";
import { authRoutes } from "./modules/auth";
import { userRoutes } from "./modules/users";
import { filingRoutes } from "./modules/filings";
import { documentRoutes } from "./modules/documents";
import { taxEngineRoutes } from "./modules/tax-engine-gateway";
import { irdGatewayRoutes, irdWebhookRoutes, irdDocumentRoutes } from "./modules/ird-gateway";
import { submissionRoutes } from "./modules/submissions";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // ─── Plugins ─────────────────────────────────────────────────────────────────

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  await app.register(authPlugin);

  // Custom error handler
  app.setErrorHandler(errorHandler);

  // ─── Routes ──────────────────────────────────────────────────────────────────

  await app.register(healthRoutes, { prefix: "/api/health" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(userRoutes, { prefix: "/api/users" });
  await app.register(filingRoutes, { prefix: "/api/filings" });
  await app.register(documentRoutes, { prefix: "/api/documents" });
  await app.register(taxEngineRoutes, { prefix: "/api/tax" });
  await app.register(irdGatewayRoutes, { prefix: "/api/ird" });
  await app.register(irdWebhookRoutes, { prefix: "/api/ird" });
  await app.register(irdDocumentRoutes, { prefix: "/api/ird" });
  await app.register(submissionRoutes, { prefix: "/api/submissions" });

  return app;
}
