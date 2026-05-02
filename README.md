# CareerForge AI

CareerForge AI is a submission-ready student career-prep copilot for the Octo-Universe Hackathon.

## Stack
- Next.js 14 + TypeScript + Tailwind
- Server route for AI generation (`/api/generate`)
- NVIDIA NIM integration with local fallback
- Zod request validation in API route
- Demo seed profiles in `data/demoProfiles.json`

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## Demo mode
If `NVIDIA_NIM_API_KEY` is missing or invalid, the app uses structured fallback output so judges can still test complete functionality.

## Deploy to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Set `NVIDIA_NIM_API_KEY` env var.
4. Deploy.

## Core features
- Landing hero
- Typed onboarding form + role targeting
- Personalized plan generation
- Skill-gap analysis
- Portfolio project ideas
- Interview prep questions
- Resume checklist
- Weekly execution plan
- Progress tracker
- One-click demo profile

## Reliability and validation improvements
- Frontend generation flow handles:
  - non-OK API responses,
  - malformed payloads,
  - and network failures with inline user-visible errors.
- API route validates `ProfileInput` payloads with Zod and returns structured `400` errors for invalid input.
- AI output from NVIDIA NIM is sanitized into the expected `PlanOutput` shape; if fields are missing or malformed, deterministic fallback sections are used.

## Judge submission checklist
- Load demo profile and click **Generate Plan**.
- Confirm plan cards render (skills, projects, interview prep, resume, weekly plan).
- Refresh the page and verify profile/plan/progress persistence.
- Optionally remove `NVIDIA_NIM_API_KEY` and verify deterministic fallback still returns a usable plan.
