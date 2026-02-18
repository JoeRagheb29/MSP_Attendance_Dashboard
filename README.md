# MSP Attendance Dashboard

A professional admin dashboard and REST API for managing workshop/meetup attendance.

This repository includes a React + TypeScript frontend and an Express + TypeScript backend (SQLite for development). The project is intended for admin users to manage members, sessions, and attendance records.

---

## Quick overview

- Frontend: `Frontend/` — React, TypeScript, Vite, Tailwind
- Backend: `api/` (package.json present) and sources under `backend/src/` — Express, TypeScript, postgreSQL
- Purpose: CRUD for members/sessions, per-session attendance, role-based filtering, admin reporting

---

## Features

- Member management: add, edit, delete members
- Session management: create sessions, select active session
- Attendance: mark present/absent per session

# MSP Attendance Dashboard

A fast, clean admin dashboard for tracking attendance — built to help teams and event organizers record session attendance, manage members, and generate quick reports.

## Why this project matters

- Stop juggling spreadsheets. Mark attendance per session, filter by role, and get simple reports.
- Lightweight and extensible: React frontend, Express API, and SQLite for quick local setup.

## Ready to run in under 5 minutes

This README gives a concise, practical guide to get the app running locally and outlines the API and next steps.

## Tech stack

- Frontend: React 19 + TypeScript + Vite + Tailwind
- Backend: Node + Express + TypeScript
- DB: SQLite (development)
- Auth: JWT + bcrypt (optional; routes may need wiring)

## Quick start (development)

1. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open: http://localhost:5173

2. Backend

```bash
cd api
npm install
npm run dev
```

Default API base: http://localhost:3001/api

## Environment variables (backend)

Create `api/.env` with:

```env
PORT=3001
JWT_SECRET=replace-with-a-secret
NODE_ENV=development
```

## Essential scripts

- Frontend: `npm run dev`, `npm run build`, `npm run preview`
- Backend (api): `npm run dev`, `npm run build`, `npm run start`, `npm run init-db` (if provided)

## Core features

- CRUD members (name, phone, role)
- Create sessions and select active session
- Mark present/absent per member per session
- Role filtering (attendee | member | organizer)
- Dark mode and responsive UI

## API overview (common endpoints)

- GET /health or /api/health — service check
- POST /api/auth/login — login (JWT)
- POST /api/auth/register — register user
- GET /api/members — list members
- POST /api/members — create member
- PUT /api/members/:id — update member
- DELETE /api/members/:id — remove member
- GET /api/sessions — list sessions
- POST /api/sessions — create session
- GET /api/attendance?sessionId=<id> — attendance for session
- POST /api/attendance — mark/create attendance
- GET /api/admin/stats — aggregate stats

## Data model (summary)

- Member: { id, name, phone, role, createdAt }
- Session: { id, name, date, createdAt }

# MSP Attendance Dashboard

A practical admin dashboard and API for tracking event or workshop attendance. This repository is implemented with a React + TypeScript frontend and a modular Express + TypeScript backend that supports multiple databases (SQLite, PostgreSQL, Turso).

## Why this README was updated

You added PostgreSQL and an authentication system. This README documents the actual backend capability (Postgres support and JWT auth), how to run everything, and exact environment variables the code expects.

## Highlights

- Frontend: React + TypeScript + Vite + Tailwind (folder: `Frontend`)
- Backend: Node + Express + TypeScript (sources in `api/src` and `backend/src`)
- Database: supports SQLite (dev), PostgreSQL (production/remote), and Turso
- Auth: JWT-based login/register implemented in `api/src/routes/auth.ts` (bcrypt + jsonwebtoken)

## Quick start (development)

1. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open: http://localhost:5173

2. Backend (API)

```bash
cd api
npm install
npm run dev
```

Default API base: http://localhost:3001/api

## Switching the database

The backend includes a database loader (`api/src/database/db.ts`) that chooses the implementation at runtime based on environment variables:

- Use SQLite (default/dev): no special env is required (or use a local SQLITE file).
- Use PostgreSQL: set `DATABASE_URL` to a valid Postgres connection string (e.g., provided by Supabase, Heroku, or local Postgres).
- Use Turso: set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

Examples:

```bash
# Postgres (local)
export DATABASE_URL="postgresql://user:password@localhost:5432/msp"

# Turso
export TURSO_DATABASE_URL="..."
export TURSO_AUTH_TOKEN="..."
```

## Environment variables (backend)

Create an `.env` file in `api/` with:

```env
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname   # for Postgres
JWT_SECRET=replace-with-a-secret
NODE_ENV=development
# Optional for Turso:
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

- `DATABASE_URL` switches the DB to Postgres.
- `JWT_SECRET` is used to sign JSON Web Tokens returned by `/api/auth/login`.

## Useful npm scripts

- Frontend (`Frontend/package.json`): `dev`, `build`, `preview`.
- Backend (`api/package.json`): `dev`, `build`, `start`, `init-db` (if present).
- Root: helper scripts to install/build across the monorepo.

## Authentication (what's implemented)

- `api/src/routes/auth.ts` implements `/api/auth/register` and `/api/auth/login`.
- Passwords are hashed with `bcryptjs`.
- Tokens are issued using `jsonwebtoken` and the `JWT_SECRET` env variable.
- The frontend pages `Frontend/src/pages/Login.tsx` and `Frontend/src/pages/Register.tsx` already call these endpoints.

## API quick examples

Register a user (example):

```bash
curl -X POST http://localhost:3001/api/auth/register \
	-H 'Content-Type: application/json' \
	-d '{"email":"admin@example.com","password":"password123","name":"Admin"}'
```

Login and receive a token:

```bash
curl -X POST http://localhost:3001/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"admin@example.com","password":"password123"}'

# Response contains: { token: "<JWT>" }
```

Use the token for protected endpoints:

```bash
curl http://localhost:3001/api/members \
	-H "Authorization: Bearer <JWT>"
```

## Data model (summary)

- Member: { id, name, phone, role, createdAt }
- Session: { id, name, date, createdAt }
- Attendance: { id, member_id, session_id, status }

## Common issues & fixes

- If TypeScript complains about `jsonwebtoken` types, run inside `api/`:

```bash
cd api
npm i -D @types/jsonwebtoken
```

- Ensure `DATABASE_URL` or `TURSO_DATABASE_URL` is set when you expect Postgres/Turso behavior.
- If CORS prevents frontend requests, check `api/src/index.ts` / `backend/src/server.ts` to confirm allowed origins.

## Project structure (high level)

```
MSP_Attendance_Dashboard/
├─ Frontend/        # React + Vite app (UI)
│  ├─ src/
│  └─ package.json
├─ api/             # Backend package.json, entry files and routes
│  ├─ src/
│  │  ├─ routes/
│  │  └─ database/
│  └─ package.json
├─ backend/         # (alternative backend source location in some setups)
└─ package.json     # root helper scripts
```

## Recommended next steps (I can implement)

1. Add a Postgres DB init/seed script that creates tables and inserts a demo admin user.
2. Wire the frontend to store the JWT and attach it to API requests (Authorization header).
3. Add an OpenAPI spec / Postman collection for the API.
4. Add a small migration setup for Postgres (optional, recommended for production).

Tell me which of the above you'd like me to implement first and I'll update the README or code accordingly.
