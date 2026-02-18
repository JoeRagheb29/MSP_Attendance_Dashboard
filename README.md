# MSP Attendance Dashboard

A professional admin dashboard and REST API for managing workshop/meetup attendance.

This repository includes a React + TypeScript frontend and an Express + TypeScript backend (SQLite for development). The project is intended for admin users to manage members, sessions, and attendance records.

---

## Quick overview

- Frontend: `Frontend/` — React, TypeScript, Vite, Tailwind
- Backend: `api/` (package.json present) and sources under `backend/src/` — Express, TypeScript, SQLite
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
- Attendance: { id, member_id, session_id, status }

## Common issues & fixes

- jsonwebtoken TypeScript warning: `npm i -D @types/jsonwebtoken` in `api/` fixes it.
- CORS: backend is configured to allow `localhost` origins in development; change `backend/src/server.ts` if needed.
- TypeScript/Vite build errors: run `npm run build` in `Frontend` and fix type errors highlighted by `tsc`.

## Project layout

```
MSP_Attendance_Dashboard/
├─ Frontend/      # React app (UI)
│  └─ src/
├─ api/           # Backend package.json and scripts
├─ backend/       # Backend TypeScript source (if used directly)
└─ package.json   # root helper scripts
```

## Next steps I can do for you

- Wire backend auth routes (`/api/auth/login`, `/api/auth/register`) with JWT + bcrypt
- Add DB init and seed scripts with demo data
- Produce a Postman collection or OpenAPI spec
- Add tests and CI pipeline

Tell me which one you want and I will implement it.

---

Short note: If you're unsure which backend folder to use (`api` or `backend`), tell me and I'll point the run commands to the correct one and wire any missing files.
