import { z } from "zod";

export const DocFormat = z.enum([
  "readme",
  "api-reference",
  "changelog",
  "onboarding",
]);

export type DocFormat = z.infer<typeof DocFormat>;

export const GenerateDocsRequestSchema = z.object({
  content: z.string().min(1).max(100000),
  format: DocFormat,
});

export type GenerateDocsRequest = z.infer<typeof GenerateDocsRequestSchema>;

export const GenerateDocsResponseSchema = z.object({
  documentation: z.string(),
  format: z.string(),
});

export type GenerateDocsResponse = z.infer<typeof GenerateDocsResponseSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal("healthy"),
  timestamp: z.string().datetime(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
