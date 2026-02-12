# Troubleshooting Guide

## "Failed to load members. Make sure the server is running"

This error means the frontend cannot connect to the backend API. Follow these steps:

### Step 1: Check if Backend is Running

**Option A: Run Both Together (Easiest)**

```bash
npm run dev:all
```

**Option B: Run Backend Separately**

```bash
cd backend
npm run dev
```

You should see:

```
✅ Database tables initialized successfully!
🚀 Server is running on http://localhost:3001
📊 API available at http://localhost:3001/api
```

### Step 2: Verify Backend is Accessible

Open in your browser:

- http://localhost:3001/health

Should return: `{"status":"ok","message":"MSP Attendance API is running"}`

If this doesn't work, the backend isn't running properly.

### Step 3: Check Common Issues

#### Backend Not Starting

1. **Check if dependencies are installed:**

   ```bash
   cd backend
   npm install
   ```

2. **Check for port conflicts:**

   - Another app might be using port 3001
   - Check terminal for "EADDRINUSE" error
   - Change port in `backend/src/index.ts` if needed

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v18 or higher

#### Frontend Can't Connect

1. **Check browser console (F12):**

   - Look for CORS errors
   - Look for network errors
   - Check the Network tab to see if requests are failing

2. **Verify API URL:**

   - Check `src/api/memberService.ts`
   - Should be: `http://localhost:3001/api`

3. **Check if backend is on different port:**
   - If backend is on port 3002, update `API_BASE` in `memberService.ts`

### Step 4: Quick Fixes

#### Reinstall Dependencies

```bash
# Root directory
npm install

# Backend
cd backend
npm install
```

#### Clear Browser Cache

- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache manually

#### Restart Everything

1. Stop all running servers (Ctrl+C)
2. Close all terminals
3. Start fresh:
   ```bash
   npm run dev:all
   ```

### Step 5: Check Error Messages

The improved error handling will show:

- More specific error messages
- Troubleshooting steps in the UI
- Console logs with detailed information

### Still Not Working?

1. **Check terminal output** - Look for error messages when starting the backend
2. **Check browser console** - Press F12 and look at Console and Network tabs
3. **Verify both servers are running:**
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:5173

### Quick Test

Run this in your browser console (F12):

```javascript
fetch("http://localhost:3000/health")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

If this fails, the backend isn't running or isn't accessible.
