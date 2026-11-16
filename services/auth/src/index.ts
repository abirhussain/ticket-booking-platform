import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";

const config = loadConfig();
const logger = createLogger(config);

let shuttingDown = false;

const app = createApp(
  logger,
  () => !shuttingDown,
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

function shutdown(signal: string): void {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  logger.info(
    { signal },
    "Auth shutdown started",
  );

  const deadline = setTimeout(() => {
    logger.error("Auth shutdown deadline exceeded");

    server.closeAllConnections();
    process.exit(1);
  }, 10_000);

  deadline.unref();

  server.close((error) => {
    clearTimeout(deadline);

    if (error) {
      logger.error("Auth HTTP server shutdown failed");
      process.exitCode = 1;
      return;
    }

    logger.info("Auth shutdown completed");
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));