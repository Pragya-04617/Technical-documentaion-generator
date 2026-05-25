# DocForge

AI-powered technical documentation generator that turns code, OpenAPI specs, PR diffs, and deploy notes into clean Markdown instantly.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/docforge run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + TanStack Query
- API: Express 5
- AI: Replit OpenAI integration (`@workspace/integrations-openai-ai-server`, model `gpt-5.2`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas
- `lib/integrations-openai-ai-server/` — Replit-managed OpenAI SDK client
- `artifacts/api-server/src/routes/docs.ts` — docs generation endpoint
- `artifacts/docforge/src/App.tsx` — entire frontend UI
- `artifacts/docforge/src/index.css` — Midnight Indigo design system tokens

## Architecture decisions

- **TanStack Start → React SPA**: Original used TanStack Start (SSR/Cloudflare Workers) with Lovable's proprietary Vite config. Ported to a standard React + Vite SPA — simpler, no SSR complexity, runs fully on Replit.
- **Lovable AI gateway → Replit OpenAI integration**: Replaced `LOVABLE_API_KEY` / `ai.gateway.lovable.dev` with Replit-managed OpenAI credentials. No user API key required.
- **Server function → API route**: Replaced `createServerFn` (TanStack Start SSR primitive) with a standard Express `POST /api/docs/generate` route validated by the generated Zod schema.
- **Contract-first**: All API shapes defined in `lib/api-spec/openapi.yaml`; frontend uses generated hooks, backend uses generated Zod schemas — zero hand-written types.
- **No database**: This app is stateless — docs are generated on demand, never stored.

## Product

- Paste source code, OpenAPI specs, PR diffs, or deploy notes into the text area (or drag & drop files / .zip archives)
- Select output format: README, API Reference, Changelog, or Onboarding guide
- Click "Generate docs" — AI produces clean Markdown in seconds
- Copy to clipboard or download as `.md`

## User preferences

- Keep the Midnight Indigo dark design system (OKLCH palette, JetBrains Mono + Work Sans fonts)
- No Lovable branding anywhere

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- The Google Fonts `@import` must be the FIRST line of `index.css` (before Tailwind `@import`) to avoid PostCSS ordering errors
- `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` are auto-provisioned by Replit — do not set them manually

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
