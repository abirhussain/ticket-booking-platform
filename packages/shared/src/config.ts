import { z } from "zod";

export const commonConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  SERVICE_NAME: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),

  PORT: z.coerce.number().int().min(1).max(65535),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

export type CommonConfig = z.infer<typeof commonConfigSchema>;

export function loadConfig<T>(
  schema: z.ZodType<T>,
  env: Record<string, string | undefined> = process.env,
): T {
  const result = schema.safeParse(env);

  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues.map(
          (issue) => issue.path.join(".") || "configuration",
        ),
      ),
    ];

    throw new Error(
      `Invalid environment configuration. Check: ${fields.join(", ")}`,
    );
  }

  return result.data;
}