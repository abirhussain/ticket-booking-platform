import { randomUUID } from "node:crypto";

export const CORRELATION_ID_HEADER = "x-correlation-id";

const validCorrelationId = /^[A-Za-z0-9_-]{1,64}$/;

export function getOrCreateCorrelationId(
  incoming: unknown,
): string {
  if (
    typeof incoming === "string" &&
    validCorrelationId.test(incoming)
  ) {
    return incoming;
  }

  return randomUUID();
}