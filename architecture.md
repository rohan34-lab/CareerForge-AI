# Architecture

- Frontend: Next.js App Router single-page dashboard (`src/app/page.tsx`)
- API: `/api/generate` route receives profile input and returns structured plan
- AI service: `src/lib/generator.ts`
  - Calls NVIDIA NIM chat completions when `NVIDIA_NIM_API_KEY` is set
  - Falls back to deterministic structured JSON for guaranteed demo success
- Data: `data/demoProfiles.json` seeded profiles for instant tryout
- State: client-side React state for onboarding, generated plan, and progress tracking
