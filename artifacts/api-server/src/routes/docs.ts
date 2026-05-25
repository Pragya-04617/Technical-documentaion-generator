import express, { Router } from "express";
import { GenerateDocsRequestSchema } from "@workspace/api-zod";
import { generateDocumentation, type DocFormat } from "@workspace/integrations-openai-ai-server";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const parsed = GenerateDocsRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        message: parsed.error.errors.map((e) => e.message).join(", "),
      });
      return;
    }

    const { content, format } = parsed.data;

    const documentation = await generateDocumentation(content, format as DocFormat);

    res.json({
      documentation,
      format,
    });
  } catch (error) {
    console.error("Error generating documentation:", error);
    res.status(500).json({
      error: "generation_error",
      message: error instanceof Error ? error.message : "Failed to generate documentation",
    });
  }
});

export default router;
