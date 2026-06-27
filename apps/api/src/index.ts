import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";

import { healthRoutes } from "./modules/health/health.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { filingRoutes } from "./modules/filings/filing.routes";
import { documentRoutes } from "./modules/documents/document.routes";
import { taxEngineRoutes } from "./modules/tax-engine/tax-engine.routes";
import { jobRoutes } from "./modules/jobs/job.routes";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: "info",
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: { colorize: true },
            }
          : undefined,
    },
  });

  await app.register(cors, {
    origin: process.env.APP_URL ?? "http://localhost:3000",
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" },
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(healthRoutes, { prefix: "/api/health" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(userRoutes, { prefix: "/api/users" });
  await app.register(filingRoutes, { prefix: "/api/filings" });
  await app.register(documentRoutes, { prefix: "/api/documents" });
  await app.register(taxEngineRoutes, { prefix: "/api/tax-engine" });
  await app.register(jobRoutes, { prefix: "/api/jobs" });

  return app;
}
