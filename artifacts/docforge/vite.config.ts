import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@workspace/api-client-react": resolve(__dirname, "../../lib/api-client-react/src/index.ts"),
      "@workspace/api-zod": resolve(__dirname, "../../lib/api-zod/src/index.ts"),
    },
    conditions: ["workspace", "import", "module", "browser", "default"],
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ["@workspace/api-client-react", "@workspace/api-zod"],
  },
});
