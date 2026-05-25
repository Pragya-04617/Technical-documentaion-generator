import express, { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "healthy" as const,
    timestamp: new Date().toISOString(),
  });
});

export default router;
