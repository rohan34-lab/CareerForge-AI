# Newcomer Guide

This guide explains how the codebase is organized, what matters most, and what to learn next.

## 1) High-level architecture

CareerForge AI is a Next.js App Router project with three practical layers:

- **UI layer (`src/app/page.tsx`)**: collects profile inputs, handles loading/error states, renders generated plan cards, and persists state in `localStorage`.
- **API layer (`src/app/api/generate/route.ts`)**: validates incoming JSON with Zod, enforces content type, returns structured validation errors, and calls plan generation.
- **Generation layer (`src/lib/generator.ts`)**: builds prompt + calls NVIDIA NIM when configured, then normalizes model output into the app's strict `PlanOutput` shape with deterministic fallback behavior.

The app is intentionally resilient: if live AI fails or is unavailable, users still get a usable plan.

## 2) Repository map

- `src/app/page.tsx` — main single-page experience and interaction flow.
- `src/app/api/generate/route.ts` — backend endpoint used by the page for plan generation.
- `src/lib/generator.ts` — prompt orchestration, model response parsing/sanitization, and fallback generation.
- `src/lib/types.ts` — core shared types (`ProfileInput`, `PlanOutput`, etc.).
- `data/demoProfiles.json` — demo profiles used for one-click testing.
- `README.md` — setup, deployment, and feature summary.

## 3) Important implementation details

1. **Validation-first API contract**
   - `POST /api/generate` expects `application/json`.
   - Payload is validated with Zod.
   - Invalid payload returns HTTP 400 with issue path/message details.

2. **Robust frontend error handling**
   - Handles non-2xx responses, malformed bodies, and network failures.
   - Shows actionable inline errors instead of failing silently.

3. **Model output hardening**
   - Generator can parse fenced JSON output.
   - Response is sanitized into expected output schema.
   - Missing/invalid sections are replaced with deterministic fallback content.

4. **Demo and persistence behavior**
   - Demo profiles accelerate local/prod testing.
   - Form, generated plan, and progress persistence reduce accidental data loss.

## 4) Local development workflow

```bash
npm install
cp .env.example .env.local
npm run dev
```

Useful checks:

```bash
npm run build
npm run lint
```

If you do not set `NVIDIA_NIM_API_KEY`, fallback mode still allows full UX validation.

## 5) What to learn next

1. **Trace one full request path**
   - Start at submit action in `page.tsx`.
   - Follow fetch call into `api/generate/route.ts`.
   - Follow `generateCareerPlan` in `src/lib/generator.ts`.

2. **Understand the data contracts**
   - Read shared types and Zod schema together.
   - Verify frontend payload shape always matches API expectations.

3. **Strengthen confidence with tests**
   - Add unit tests for generator sanitization/fallback behavior.
   - Add API route tests for validation and error responses.
   - Add UI smoke tests around loading/error states and persistence.

4. **Production-readiness upgrades**
   - Add request IDs + structured logging.
   - Add rate limiting on `/api/generate`.
   - Add observability around model latency/error rates.

## 6) Fast smoke test checklist

- Load demo profile.
- Generate a plan.
- Verify cards render.
- Force invalid input and verify readable validation errors.
- Refresh page and verify persisted state.
- Test with and without `NVIDIA_NIM_API_KEY`.
