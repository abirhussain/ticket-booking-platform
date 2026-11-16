import express from "express";

import { createHealthRouter } from "./health.js";
import { createLogger } from "./logger.js";
import { requestContext } from "./middleware/request-context.js";

type AppLogger = ReturnType<typeof createLogger>;

export function createApp(
  logger: AppLogger,
  isReady: () => boolean,
) {
  const app = express();

  app.disable("x-powered-by");

  app.use(requestContext(logger));

  app.use("/health", createHealthRouter(isReady));

  return app;
}