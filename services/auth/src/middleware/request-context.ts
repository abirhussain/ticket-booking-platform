import type { RequestHandler } from "express";

import {
  CORRELATION_ID_HEADER,
  getOrCreateCorrelationId,
} from "../correlation-id.js";

import { createLogger, createRequestLogger } from "../logger.js";

type AppLogger = ReturnType<typeof createLogger>;

export function requestContext(logger: AppLogger): RequestHandler {
  return (req, res, next) => {
    const correlationId = getOrCreateCorrelationId(
      req.headers[CORRELATION_ID_HEADER],
    );

    const requestLogger = createRequestLogger(logger, correlationId);

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    res.locals.correlationId = correlationId;
    res.locals.logger = requestLogger;

    const startedAt = performance.now();

    res.on("finish", () => {
      requestLogger.info(
        {
          method: req.method,
          statusCode: res.statusCode,
          durationMs: Math.round(performance.now() - startedAt),
        },
        "Request completed",
      );
    });

    next();
  };
}
