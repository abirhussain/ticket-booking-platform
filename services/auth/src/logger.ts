import {pino} from 'pino';
import type { AuthConfig } from './config.js';

type LoggerConfig = Pick <AuthConfig, "NODE_ENV" | "LOG_LEVEL">;

export function createLogger(config: LoggerConfig) {
    return pino({
        level: config.LOG_LEVEL,

        base: {
            service: "auth",
            environment: config.NODE_ENV,
        },

        timestamp: pino.stdTimeFunctions.isoTime,

        redact: {
            paths: [
                "password",
                "email",
                "accessToken",
                "refreshToken",
                "user.password",
                "user.email",
                "req.headers.authorization",
                "req.headers.cookie"
            ],
            censor: "[REDACTED]",
        },
    });
}


export function createRequestLogger(logger: ReturnType<typeof createLogger>, correlationId: string,) {
    return logger.child({correlationId});
}