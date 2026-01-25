# Deploying MSP Attendance Dashboard on Vercel

The project is configured for full-stack deployment on Vercel: Vite frontend + Express API as serverless functions.

## Prerequisites

1. **Turso database** (replaces SQLite on Vercel, since serverless has no persistent filesystem):
   - Create a free DB at [turso.tech](https://turso.tech) or via CLI: `turso db create msp-attendance`
   - Get the database URL and auth token:
     ```bash
     turso db show msp-attendance --url
     turso db tokens create msp-attendance
     ```

2. **Environment variables** (set in Vercel Project → Settings → Environment Variables):
   - `TURSO_DATABASE_URL` – your Turso database URL (e.g. `libsql://msp-attendance-xxx.turso.io`)
   - `TURSO_AUTH_TOKEN` – the token from the step above

## Deploy

1. Push the repo to GitHub and [import the project in Vercel](https://vercel.com/new).
2. Set **Root Directory** to `MSP_Attendance_Dashboard` if the repo root is above it.
3. Add the env vars above for Production (and Preview if you use them).
4. Deploy. The build runs `npm run install:all && npm run build:all`, then deploys the frontend and API.

## Local development

- **Backend only (SQLite):** `npm run dev:backend` in the project root, or `npm run dev` inside `backend/`.
- **Frontend only:** `npm run dev` (uses Vite proxy to `http://localhost:3001` for `/api` and `/health`).
- **Both:** `npm run dev:all`.

For **local Turso** (e.g. to test the same DB as Vercel), set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env` in the `backend/` folder (or in your environment) and run the backend as above. Without them, the backend uses SQLite and `backend/attendance.db`.

## Project structure (Vercel)

- **Frontend:** Vite app; build output in `dist/`.
- **API:** `api/[[...path]].ts` forwards all `/api/*` (and `/api/health`) to the Express app in `backend/`.
- **Database:** SQLite locally; Turso on Vercel when `TURSO_*` env vars are set.

## Troubleshooting

- **"Cannot find module '@libsql/client'"** – Run `npm run install:all` (installs root + backend deps).
- **API 500 or DB errors on Vercel** – Confirm `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set and valid.
- **Health check fails** – The app exposes `/api/health`. The frontend uses `/api/health`; `/health` is rewritten to `/api/health` via `vercel.json`.
