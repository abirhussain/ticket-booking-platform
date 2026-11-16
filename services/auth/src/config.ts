import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(65535),

  LOG_LEVEL: z
    .enum([
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
      "silent",
    ])
    .default("info"),
});

export type AuthConfig = z.infer<typeof configSchema>;

export function loadConfig(
  env: Record<string, string | undefined> = process.env,
): AuthConfig {
  const result = configSchema.safeParse(env);

  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues.map(
          (issue) => issue.path.join(".") || "configuration",
        ),
      ),
    ];

    throw new Error(
      `Invalid Auth configuration. Check: ${fields.join(", ")}`,
    );
  }

  return result.data;
}