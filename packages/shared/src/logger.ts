import type { CommonConfig } from "./config.js";
import { pino, type DestinationStream, type Logger } from "pino";

type LoggerConfig = Pick<
  CommonConfig,
  "SERVICE_NAME" | "NODE_ENV" | "LOG_LEVEL"
>;

export function createLogger(config: LoggerConfig, destination?: DestinationStream,): Logger {
  return pino({
    level: config.LOG_LEVEL,

    base: {
      service: config.SERVICE_NAME,
      environment: config.NODE_ENV,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
      paths: [
        "password",
        "token",
        "accessToken",
        "refreshToken",
        "email",
        "user.password",
        "user.email",
        "headers.authorization",
        "headers.cookie",
        "req.headers.authorization",
        "req.headers.cookie",
      ],
      censor: "[REDACTED]",
    },
  }, destination);
}

export function createRequestLogger(
  logger: Logger,
  correlationId: string,
): Logger {
  return logger.child({ correlationId });
}