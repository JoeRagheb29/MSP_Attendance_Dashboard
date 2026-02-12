# Quick Start Guide

## Step 1: Install Dependencies

Open a terminal in the `backend` folder and run:

```bash
npm install
```

This will install all required packages (express, sqlite3, cors, etc.)

## Step 2: Start the Server

Run the development server:

```bash
npm run dev
```

You should see:

```
✅ Database tables initialized successfully!
🚀 Server is running on http://localhost:3001
📊 API available at http://localhost:3001/api
```

## Step 3: Test the Server

Once the server is running, you can test it:

1. **Root endpoint**: http://localhost:3001/
   - Should show API information

2. **Health check**: http://localhost:3001/health
   - Should return: `{"status":"ok","message":"MSP Attendance API is running"}`

3. **Get members**: http://localhost:3001/api/members
   - Should return: `[]` (empty array initially)

## Common Issues

### "Cannot find module" errors

- Make sure you ran `npm install` in the `backend` folder
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### "Port 3001 already in use"

- Another process is using port 3001
- Close the other process or change the port in `src/index.ts`

### "Database error"

- The database will be created automatically
- If you see errors, delete `attendance.db` and restart the server

### Server not starting

- Check that Node.js is installed: `node --version` (should be v18+)
- Check that all dependencies are installed: `npm list`

## Next Steps

Once the server is running, your frontend should be able to connect to it at `http://localhost:3001/api`
