import { useMutation, useQuery } from "@tanstack/react-query";
import { customFetch } from "./fetcher";
import type {
  GenerateDocsRequest,
  GenerateDocsResponse,
  HealthResponse,
} from "@workspace/api-zod";

export function useGenerateDocs() {
  return useMutation<GenerateDocsResponse, Error, GenerateDocsRequest>({
    mutationFn: async (data) => {
      return customFetch<GenerateDocsResponse>("/docs/generate", {
        method: "POST",
        body: data,
      });
    },
  });
}

export function useHealthCheck() {
  return useQuery<HealthResponse, Error>({
    queryKey: ["health"],
    queryFn: () => customFetch<HealthResponse>("/health"),
  });
}

export { customFetch } from "./fetcher";
export type { GenerateDocsRequest, GenerateDocsResponse, HealthResponse };
