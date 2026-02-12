# MSP Attendance Dashboard - Backend API

Node.js backend API for the MSP Attendance Dashboard application.

## Features

- ✅ **Members Management** - CRUD operations for members
- ✅ **Sessions Management** - Create and manage attendance sessions
- ✅ **Attendance Tracking** - Mark and track attendance for members in sessions
- ✅ **SQLite Database** - Lightweight, file-based database
- ✅ **RESTful API** - Clean REST API endpoints
- ✅ **TypeScript** - Fully typed for better development experience

## Quick Start

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Initialize the database**

```bash
npm run init-db
```

3. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Members

- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `GET /api/members/category/:category` - Get members by category (game/graphics)
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Sessions

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Attendance

- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/member/:member_id` - Get attendance for a member
- `GET /api/attendance/session/:session_id` - Get attendance for a session
- `GET /api/attendance/today` - Get today's attendance
- `POST /api/attendance` - Mark attendance (creates or updates)
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

## Database Schema

### Members Table

- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `category` (TEXT NOT NULL) - 'game' or 'graphics'
- `role` (TEXT NOT NULL) - 'attendee', 'member', or 'organizer'
- `email` (TEXT)
- `phone` (TEXT)
- `createdAt` (TEXT)

### Sessions Table

- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `date` (TEXT NOT NULL)
- `createdAt` (TEXT)

### Attendance Table

- `id` (INTEGER PRIMARY KEY)
- `member_id` (INTEGER NOT NULL) - Foreign key to members
- `session_id` (INTEGER NOT NULL) - Foreign key to sessions
- `status` (TEXT NOT NULL) - 'present' or 'absent'
- `notes` (TEXT)
- `createdAt` (TEXT)
- Unique constraint on (member_id, session_id)

## Development

- **Development mode**: `npm run dev` (uses tsx for hot reload)
- **Build**: `npm run build` (compiles TypeScript to JavaScript)
- **Production**: `npm start` (runs compiled JavaScript)

## Notes

- When a new session is created, members don't automatically have attendance records. Attendance must be marked manually.
- When a member or session is deleted, related attendance records are automatically deleted (CASCADE).
- The database file (`attendance.db`) is created automatically in the backend directory.
