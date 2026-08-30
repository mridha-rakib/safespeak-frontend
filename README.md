# Next Start (Frontend Only)

> [!IMPORTANT]  
> All branches have been updated to the latest patched version of React / Next.js as of 2025-12-05. Be sure to update your deployments as well. See the notes [here](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) and [here](https://nextjs.org/blog/CVE-2025-66478).

A lightweight Next.js starter that now ships without any backend pieces. All API routes, auth, database code, and server actions have been removed so you can plug in your own Express + TypeScript backend later.

- [Stack](#stack)
- [Branches](#branches)
- [Setup](#setup)
- [Notes for adding your backend](#notes-for-adding-your-backend)

## Stack

- Linting / Code Style
  - eslint, eslint-config-prettier, eslint-plugin-check-file, eslint-plugin-n
  - prettier, @trivago/prettier-plugin-sort-imports, prettier-plugin-tailwindcss
- Styles / UI
  - tailwindcss
  - @nextui-org/react
  - next-themes
  - @tabler/icons-react

## Branches

The main branch is now frontend-only (no auth, DB, or API routes). Historical branches in the upstream repo still show progressive additions:

- base – eslint / prettier settings
- nextui – layout / styles + theme toggle

## Setup

1) Install dependencies:

```sh
pnpm install
```

2) Run the app:

```sh
pnpm dev
```

3) Configure the frontend-to-backend connection:

```sh
cp .env.example .env.local
```

Default local integration values are already included:

- `NEXT_PUBLIC_API_BASE_URL=/api/v1`
- `SAFESPEAK_BACKEND_ORIGIN=http://127.0.0.1:8000`

The frontend now talks to same-origin `/api/...` paths and Next.js rewrites those requests to your backend services, including the backend AI and RAG endpoints. This keeps browser code free of hardcoded localhost or deployment URLs and removes the old separate AI-agent dependency for the timeline assistant flow.

## Notes for adding your backend

- The guestbook and profile pages are stubbed with client-side state; wire them to your Express API when ready.
- The `.env.example` file now includes the frontend API base and backend origin used by the rewrite layer. Add any other `NEXT_PUBLIC_*` variables you need for your API endpoints.
- Docker and Drizzle configs were removed. Reintroduce your own tooling as needed for your backend stack.

## SafeSpeak integration notes

- Dashboard home now routes to explicit SafeSpeak scope flows for reporting, support, ScamShield, resources, local-intelligence placeholder, and Smart Dialler.
- For Vercel or any hosted frontend, point both `NEXT_PUBLIC_API_BASE_URL` and `SAFESPEAK_BACKEND_ORIGIN` at your FastAPI backend origin, for example `https://your-fastapi-backend.example.com/api/v1` and `https://your-fastapi-backend.example.com`.
- Persistent dashboard safety controls include Quick Exit, 000, 1800RESPECT, language toggle, covert-mode state, and Smart Dialler access.
- Learn & Resources now uses `/dashboard?view=resources` as the main library entry, while micro-education remains separately reachable.
- Landing page internals were intentionally left unchanged in this task.
