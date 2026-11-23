import assert from "node:assert/strict";

import { test } from "node:test";

import { loadConfig } from "../src/config.js";

test("loadConfig return default configuration when environment variables are missing", () => {
  const config = loadConfig();

  assert.deepEqual(config, {
    NODE_ENV: "development",
    PORT: 3001,
    LOG_LEVEL: "info",
  });
});

test("loadConfig converts PORT to number when PORT is provided as a string", () => {
  const config = loadConfig({ PORT: "3001" });

  assert.equal(config.PORT, Number(config.PORT));
});
