import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

export type AuthServiceConfig = z.infer<typeof configSchema>;

export function loadConfig(
  env: Record<string, unknown> = process.env,
): AuthServiceConfig {
  const parsedEnv = configSchema.safeParse(env);

  if (parsedEnv.success) {
    return parsedEnv.data;
  } else {
    const invalidFields = [
      ...new Set(
        parsedEnv.error.issues.map(
          (issue) => issue.path.join(".") || "Configuration",
        ),
      ),
    ];

    throw new Error(
      `Invalid configuration. Check : ${invalidFields.join(", ")}`,
    );
  }
}
