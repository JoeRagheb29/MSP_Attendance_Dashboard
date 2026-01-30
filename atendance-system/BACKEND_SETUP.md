# 🚀 Full Backend Integration - Setup Guide

## ✅ What's Been Done:

### **Frontend (React App) - Updated:**

1. ✅ Loads members from `GET /api/attendees`
2. ✅ Loads sessions from `GET /api/sessions`
3. ✅ Loads attendance records on session selection
4. ✅ Creates members via `POST /api/attendees`
5. ✅ Updates members via `PUT /api/attendees/:id`
6. ✅ Deletes members via `DELETE /api/attendees/:id`
7. ✅ Creates sessions via `POST /api/sessions`
8. ✅ Marks attendance via `POST /api/attendances`
9. ✅ All with error handling and loading states

### **Backend (Strapi) - Ready:**

1. ✅ Attendees collection (members)
2. ✅ Sessions collection
3. ✅ Attendances collection
4. ✅ All CRUD endpoints open (no auth required)
5. ✅ CORS enabled for all ports

---

## 🎯 How to Run:

### **Terminal 1 - Start Strapi Backend:**

```bash
cd /home/youssef/Desktop/msp\ system/atendance-system
npm run develop
```

✅ Wait for: `Strapi development server listening on http://localhost:1337`

### **Terminal 2 - Start React Frontend:**

```bash
cd /home/youssef/Desktop/msp\ system
npm run dev
```

✅ Wait for: `Local: http://localhost:5173`

---

## 🧪 Testing the Integration:

### **1. Check Backend is Running:**

Visit in your browser:

- http://localhost:1337/api/attendees
- http://localhost:1337/api/sessions
- http://localhost:1337/api/attendances

You should see JSON responses (empty arrays if no data yet).

### **2. Create Test Data in Strapi Admin:**

1. Go to http://localhost:1337/admin
2. Create a **Session**:
   - Name: "Workshop Session 1"
   - Date: Today's date
3. Create an **Attendee**:
   - name: "John Doe"
   - category: "game"
   - role: "member"
   - email: "john@example.com"
   - phone: "123456789"

### **3. Test Frontend:**

1. Go to http://localhost:5173
2. You should see:
   - ✅ Members loaded from backend
   - ✅ Sessions loaded from backend
   - ✅ Can create new members (adds to backend)
   - ✅ Can mark attendance
   - ✅ Can create new sessions

---

## 📊 Data Flow:

```
Frontend (React)
       ↓
memberService.ts (API calls)
       ↓
Axios/Fetch
       ↓
http://localhost:1337/api/
       ↓
Strapi Backend
       ↓
Database (SQLite by default)
```

---

## 🛠️ Troubleshooting:

### **Issue: "Failed to load data from backend"**

**Solution:** Make sure Strapi is running:

```bash
cd atendance-system
npm run develop
```

### **Issue: CORS error in browser console**

**Solution:** CORS is already enabled. Check:

- Strapi running on `http://localhost:1337`
- Frontend running on `http://localhost:5173`

### **Issue: Collections not showing in Strapi Admin**

**Solution:** Restart Strapi (it auto-creates collections):

```bash
# Press Ctrl+C to stop
npm run develop  # Start again
```

### **Issue: Data not persisting**

**Solution:** Make sure SQLite database is created:

```bash
# Default location:
atendance-system/.tmp/data.db
```

---

## 📝 API Endpoints Reference:

### **Members (Attendees)**

```
GET    /api/attendees              # Get all members
POST   /api/attendees              # Create member
PUT    /api/attendees/:id          # Update member
DELETE /api/attendees/:id          # Delete member
```

### **Sessions**

```
GET    /api/sessions               # Get all sessions
POST   /api/sessions               # Create session
PUT    /api/sessions/:id           # Update session
DELETE /api/sessions/:id           # Delete session
```

### **Attendance Records**

```
GET    /api/attendances            # Get all records
POST   /api/attendances            # Create record
PUT    /api/attendances/:id        # Update record
DELETE /api/attendances/:id        # Delete record

# Filtering:
GET    /api/attendances?filters[memberId][$eq]=1
GET    /api/attendances?filters[sessionId][$eq]=1
```

---

## 💾 Database

Strapi uses SQLite by default (stored in `.tmp/data.db`).

To switch to PostgreSQL:

1. Install: `npm install pg`
2. Update `config/database.js`
3. Restart Strapi

---

## 🎉 You're All Set!

Your MSP Attendance Dashboard is now fully integrated with a real backend! 🚀

**What works:**

- ✅ Real data persistence
- ✅ Multi-user support (ready for future login)
- ✅ Scalable architecture
- ✅ Easy to deploy

**Next steps:**

- Add authentication
- Deploy to production
- Add more features (reports, exports, etc.)

---

**Need help?** Check the console logs in both frontend and backend terminals! 📊
