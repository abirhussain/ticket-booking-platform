import {
  commonConfigSchema,
  loadConfig,
  getOrCreateCorrelationId,
  createLogger,
  createRequestLogger,
} from "../src/index.js";

const config = loadConfig(commonConfigSchema);
const logger = createLogger(config);

const correlationId = getOrCreateCorrelationId(undefined);
const requestLogger = createRequestLogger(logger, correlationId);

requestLogger.info(
  { port: config.PORT },
  "Shared package demo started",
);

requestLogger.info(
  {
    user: {
      id: "user-123",
      email: "learning@example.test",
    },
  },
  "Redaction demonstration",
);