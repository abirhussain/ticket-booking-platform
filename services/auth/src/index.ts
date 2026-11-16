import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";

const config = loadConfig();
const logger = createLogger(config);

const app = createApp(
  logger,
  () => true,
);

const server = app.listen(config.PORT, () => {
  logger.info(
    { port: config.PORT },
    "Auth service started",
  );
});

server.on("error", (error: NodeJS.ErrnoException) => {
  logger.fatal(
    { code: error.code },
    "Auth HTTP server failed",
  );

  process.exitCode = 1;
});