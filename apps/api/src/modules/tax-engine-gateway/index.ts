import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { env } from "../../config";

export const taxEngineRoutes: FastifyPluginAsyncTypebox = async (app) => {
  // Proxy calculate request to Rust tax engine
  app.post(
    "/calculate",
    {
      onRequest: [app.authenticate],
      schema: {
        body: Type.Object({
          filing_id: Type.String(),
          tax_year: Type.Number(),
          income: Type.Number(),
          deductions: Type.Array(Type.Object({
            code: Type.String(),
            description: Type.Optional(Type.String()),
            amount: Type.Number(),
          })),
          taxpayer_type: Type.Enum({ individual: "individual", business: "business" }),
        }),
        response: {
          200: Type.Object({
            filing_id: Type.String(),
            taxable_income: Type.Number(),
            tax_liability: Type.Number(),
            effective_rate: Type.Number(),
            warnings: Type.Array(Type.String()),
            breakdowns: Type.Array(Type.Object({
              label: Type.String(),
              amount: Type.Number(),
            })),
          }),
          502: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const response = await fetch(`${env.TAX_ENGINE_URL}/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request.body),
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Tax engine responded with ${response.status}: ${errorBody}`);
        }

        const result = await response.json();
        return reply.send(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tax engine unavailable";
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message,
        });
      }
    }
  );

  // Health check for tax engine
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: Type.Object({ status: Type.String() }),
          502: Type.Object({ statusCode: Type.Number(), error: Type.String(), message: Type.String() }),
        },
      },
    },
    async (_, reply) => {
      try {
        const response = await fetch(`${env.TAX_ENGINE_URL}/health`, {
          signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }

        const result = await response.json();
        return reply.send(result);
      } catch {
        return reply.code(502).send({
          statusCode: 502,
          error: "BadGateway",
          message: "Tax engine is not reachable",
        });
      }
    }
  );
};
