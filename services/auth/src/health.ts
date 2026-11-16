import { Router } from "express";

export function createHealthRouter(
  isReady: () => boolean,
) {
  const router = Router();

  router.get("/live", (_req, res) => {
    res.status(200).json({
      status: "alive",
    });
  });

  router.get("/ready", (_req, res) => {
    const ready = isReady();

    res.status(ready ? 200 : 503).json({
      status: ready ? "ready" : "not_ready",
    });
  });

  return router;
}