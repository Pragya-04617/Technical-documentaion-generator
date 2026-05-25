const API_BASE_URL = "/api";

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function customFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}
