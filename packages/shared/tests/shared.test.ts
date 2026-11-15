import assert from "node:assert/strict";
import test from "node:test";
import { Writable } from "node:stream";

import {
  commonConfigSchema,
  loadConfig,
  getOrCreateCorrelationId,
  createLogger,
  createRequestLogger,
} from "../src/index.js";

test("config converts the port and applies defaults", () => {
  const config = loadConfig(commonConfigSchema, {
    SERVICE_NAME: "auth",
    PORT: "3001",
  });

  assert.equal(config.PORT, 3001);
  assert.equal(config.NODE_ENV, "development");
  assert.equal(config.LOG_LEVEL, "info");
});

test("config rejects invalid ports", () => {
  for (const port of ["invalid", "", "0", "65536", "1.5"]) {
    assert.throws(
      () =>
        loadConfig(commonConfigSchema, {
          SERVICE_NAME: "auth",
          PORT: port,
        }),
      /PORT/,
    );
  }
});

test("config errors do not expose invalid values", () => {
  const secret = "sensitive-value-that-must-not-appear";

  try {
    loadConfig(commonConfigSchema, {
      SERVICE_NAME: secret + "!",
      PORT: "3001",
    });
    assert.fail("Expected configuration validation to fail");
  } catch (error) {
    assert.ok(error instanceof Error);
    assert.ok(!error.message.includes(secret));
  }
});

test("correlation IDs preserve valid input and replace invalid input", () => {
  assert.equal(getOrCreateCorrelationId("request-123"), "request-123");

  for (const incoming of [undefined, "", "bad\nid", "a".repeat(65), ["id"]]) {
    assert.match(
      getOrCreateCorrelationId(incoming),
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  }

  assert.notEqual(
    getOrCreateCorrelationId(undefined),
    getOrCreateCorrelationId(undefined),
  );
});

test("logger adds context and redacts sensitive fields", () => {
  let output = "";

  const destination = new Writable({
    write(chunk, _encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });

  const logger = createLogger({
    SERVICE_NAME: "auth",
    NODE_ENV: "test",
    LOG_LEVEL: "info",
  }, destination);

 const requestLogger = createRequestLogger(logger, "request-123");

  requestLogger.info(
    {
      password: "secret-password",
      user: { email: "private@example.test" },
    },
    "Test event",
  );

  const entry = JSON.parse(output);

  assert.equal(entry.service, "auth");
  assert.equal(entry.correlationId, "request-123");
  assert.equal(entry.password, "[REDACTED]");
  assert.equal(entry.user.email, "[REDACTED]");
  assert.ok(!output.includes("secret-password"));
  assert.ok(!output.includes("private@example.test"));
});