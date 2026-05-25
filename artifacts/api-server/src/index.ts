import express from "express";
import cors from "cors";
import docsRouter from "./routes/docs";
import healthRouter from "./routes/health";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/docs", docsRouter);
app.use("/api/health", healthRouter);

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "internal_error",
    message: "An unexpected error occurred",
  });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

export default app;
