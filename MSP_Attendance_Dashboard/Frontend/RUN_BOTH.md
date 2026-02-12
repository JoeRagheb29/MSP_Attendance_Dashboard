# Running Frontend and Backend Together

## Quick Start

### Option 1: Run Both Together (Recommended)

From the **root directory** (MSP_Attendance_Dashboard), run:

```bash
npm run dev:all
```

This will start both:

- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173` (or another port if 5173 is taken)

### Option 2: Run Separately (Two Terminals)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

## First Time Setup

If you haven't installed dependencies yet:

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or manually:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

## Available Scripts

### Root Directory Scripts

- `npm run dev:all` - Run both frontend and backend together
- `npm run dev` - Run only frontend
- `npm run dev:backend` - Run only backend
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run build:all` - Build both frontend and backend for production

### Backend Scripts (in backend folder)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run init-db` - Initialize database manually

## What You'll See

When running `npm run dev:all`, you'll see output from both servers:

```
[backend] ✅ Database tables initialized successfully!
[backend] 🚀 Server is running on http://localhost:3001
[backend] 📊 API available at http://localhost:3001/api
[frontend] VITE v7.x.x  ready in xxx ms
[frontend] ➜  Local:   http://localhost:5173/
[frontend] ➜  Network: use --host to expose
```

## Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Database Viewer**: http://localhost:3001/

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

1. **Backend (3001)**: Change port in `backend/src/index.ts`
2. **Frontend (5173)**: Vite will automatically use the next available port

### Backend Not Starting

- Make sure you've run `npm install` in the `backend` folder
- Check for error messages in the terminal
- See `backend/TROUBLESHOOTING.md` for more help

### Frontend Can't Connect to Backend

- Make sure the backend is running on port 3001
- Check `src/api/memberService.ts` - the API_BASE should be `http://localhost:3001/api`
- Check browser console (F12) for CORS or connection errors

### Concurrently Not Found

If you get "concurrently not found" error:

```bash
npm install
```

This will install concurrently and other dev dependencies.

## Production Build

To build both for production:

```bash
npm run build:all
```

Then:

- Frontend: `npm run preview` (or serve the `dist` folder)
- Backend: `cd backend && npm start`
