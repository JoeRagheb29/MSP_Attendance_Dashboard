# Troubleshooting Guide

## "Page isn't working" or Connection Errors

### 1. Check if the server is running

Open a terminal and run:

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

If you see errors, continue reading.

### 2. Check if port 3001 is available

**Windows:**

```bash
netstat -ano | findstr :3001
```

**Mac/Linux:**

```bash
lsof -i :3001
```

If something is using port 3001, either:

- Stop that process
- Change the port in `src/index.ts`: `const PORT = process.env.PORT || 3002;`

### 3. Install dependencies

Make sure all packages are installed:

```bash
cd backend
npm install
```

### 4. Check Node.js version

You need Node.js v18 or higher:

```bash
node --version
```

If it's lower, update Node.js from https://nodejs.org/

### 5. Common errors and fixes

#### "Cannot find module 'express'"

```bash
cd backend
npm install
```

#### "Error opening database"

- Delete `attendance.db` file in the backend folder
- Restart the server (it will recreate the database)

#### "EADDRINUSE: address already in use"

- Another process is using port 3001
- Find and close it, or change the port

#### "Cannot GET /"

- Make sure you're accessing `http://localhost:3001/` (not just `localhost:3001`)
- Make sure the server is actually running
- Check the terminal for error messages

### 6. Test the server step by step

1. **Test health endpoint:**

   ```
   http://localhost:3001/health
   ```

   Should return: `{"status":"ok","message":"MSP Attendance API is running"}`

2. **Test API info:**

   ```
   http://localhost:3001/api
   ```

   Should return JSON with endpoint information

3. **Test members endpoint:**

   ```
   http://localhost:3001/api/members
   ```

   Should return: `[]` (empty array)

4. **Test database viewer:**
   ```
   http://localhost:3001/
   ```
   Should show the database viewer HTML page

### 7. Check browser console

Open browser developer tools (F12) and check:

- Console tab for JavaScript errors
- Network tab to see if requests are failing

### 8. Verify file structure

Make sure these files exist:

```
backend/
  ├── src/
  │   ├── index.ts
  │   ├── routes/
  │   │   ├── admin.ts
  │   │   ├── members.ts
  │   │   ├── sessions.ts
  │   │   └── attendance.ts
  │   └── database/
  │       ├── db.ts
  │       └── init-index.ts
  └── public/
      └── index.html
```

### 9. Still not working?

1. **Check server logs** - Look at the terminal where you ran `npm run dev`
2. **Try a different browser** - Sometimes browser extensions interfere
3. **Clear browser cache** - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. **Check firewall** - Make sure your firewall isn't blocking port 3001

### 10. Get help

If nothing works, check:

- The terminal output for specific error messages
- Browser console (F12) for client-side errors
- Network tab to see what requests are failing
