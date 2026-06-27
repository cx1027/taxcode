import type { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode ?? 500;
  const message = statusCode >= 500 ? "Internal Server Error" : error.message;

  request.log.error({ err: error }, "Request error");

  reply.code(statusCode).send({
    statusCode,
    error: error.name ?? "Error",
    message,
  });
}
