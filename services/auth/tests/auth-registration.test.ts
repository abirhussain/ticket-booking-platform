import assert from "node:assert/strict";
import { test } from "node:test";

import { registerUser } from "../src/services/auth-service.js";

test("registration normalizes email, stores a hash, and returns public fields", async () => {
  let savedUser:
    | { email: string; passwordHash: string }
    | undefined;

  const result = await registerUser(
    {
      email: " Alice@Example.com ",
      password: "correct horse battery staple",
    },
    {
      users: {
        findByEmail: async (email) => {
          assert.equal(email, "alice@example.com");
          return null;
        },
        create: async (user) => {
          savedUser = user;
          return { id: "user-1", email: user.email };
        },
      },
      hashPassword: async (password) => `argon2-hash:${password}`,
    },
  );

  assert.deepEqual(result, {
    id: "user-1",
    email: "alice@example.com",
  });
  assert.equal(
    savedUser?.passwordHash,
    "argon2-hash:correct horse battery staple",
  );
  assert.equal("passwordHash" in result, false);
});
