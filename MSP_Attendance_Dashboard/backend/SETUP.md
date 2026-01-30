# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Installation Steps

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database** (optional - database auto-initializes on server start)
   ```bash
   npm run init-db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001` and the database will be automatically initialized if it doesn't exist.

## Testing the API

Once the server is running, you can test it:

1. **Health check**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Get all members** (should return empty array initially)
   ```bash
   curl http://localhost:3001/api/members
   ```

3. **Create a member**
   ```bash
   curl -X POST http://localhost:3001/api/members \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","category":"game","role":"member","email":"john@example.com"}'
   ```

4. **Create a session**
   ```bash
   curl -X POST http://localhost:3001/api/sessions \
     -H "Content-Type: application/json" \
     -d '{"name":"Session 1","date":"2024-12-15T00:00:00.000Z"}'
   ```

5. **Mark attendance**
   ```bash
   curl -X POST http://localhost:3001/api/attendance \
     -H "Content-Type: application/json" \
     -d '{"memberId":1,"sessionId":1,"status":"present"}'
   ```

## Database

The database file (`attendance.db`) will be created automatically in the `backend` directory when the server starts for the first time.

## Production Build

To build for production:

```bash
npm run build
npm start
```

## Troubleshooting

- **Port already in use**: Change the PORT in `.env` or modify `server.ts`
- **Database errors**: Delete `attendance.db` and restart the server to recreate it
- **Module not found**: Run `npm install` again
