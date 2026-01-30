# ⚡ Quick Reference - Backend Integration

## 🚀 Start Both Servers (Copy & Paste)

```bash
# Terminal 1 - Backend (Strapi)
cd /home/youssef/Desktop/msp\ system/atendance-system
npm run develop

# Terminal 2 - Frontend (React)
cd /home/youssef/Desktop/msp\ system
npm run dev
```

**Then open:** http://localhost:5173

---

## 📱 What Works Now

| Feature                | Status             |
| ---------------------- | ------------------ |
| Load members from DB   | ✅                 |
| Add new member         | ✅ Saves to DB     |
| Edit member            | ✅ Saves to DB     |
| Delete member          | ✅ Removes from DB |
| Load sessions from DB  | ✅                 |
| Create new session     | ✅ Saves to DB     |
| Mark attendance        | ✅ Saves to DB     |
| View attendance report | ✅ From DB         |
| Search & filter        | ✅ Works           |
| Dark mode              | ✅ Works           |

---

## 🔌 API Endpoints

```
Members:
GET    http://localhost:1337/api/attendees
POST   http://localhost:1337/api/attendees
PUT    http://localhost:1337/api/attendees/:id
DELETE http://localhost:1337/api/attendees/:id

Sessions:
GET    http://localhost:1337/api/sessions
POST   http://localhost:1337/api/sessions
PUT    http://localhost:1337/api/sessions/:id
DELETE http://localhost:1337/api/sessions/:id

Attendance:
GET    http://localhost:1337/api/attendances
POST   http://localhost:1337/api/attendances
PUT    http://localhost:1337/api/attendances/:id
DELETE http://localhost:1337/api/attendances/:id
```

---

## 🧪 Test It

1. **Create a session:**
   - Click "New Session" button
   - Enter session name
   - Click add

2. **Add a member:**
   - Click "Add Member" button
   - Fill in details
   - Click save

3. **Mark attendance:**
   - Click "Present" or "Absent" button
   - Data saves automatically

4. **Refresh page:**
   - All data persists! ✅

---

## 📊 Database

Location: `atendance-system/.tmp/data.db` (SQLite)

Tables:

- `attendees` (members)
- `sessions`
- `attendances` (attendance records)

---

## ❌ Troubleshooting

### Backend won't start

```bash
cd atendance-system
rm -rf node_modules
npm install
npm run develop
```

### CORS error

✅ Already fixed - should work!

### Data not saving

1. Check backend is running on port 1337
2. Check browser console for errors
3. Check Strapi logs in terminal

### Collections missing

Restart Strapi:

```bash
# Stop: Ctrl+C
# Start again:
npm run develop
```

---

## 📚 Documentation

- **BACKEND_SETUP.md** - Detailed setup guide
- **INTEGRATION_COMPLETE.md** - What changed
- **ARCHITECTURE.md** - System diagram
- **INTEGRATION_FIXES.md** - All fixes applied

---

## 🎯 Key Changes in Code

### App.tsx

```typescript
// Load from backend instead of mock
useEffect(() => {
  const data = await memberService.getMembers();
  setMembers(data);
}, []);

// Save to backend
const handleAddMember = async (member) => {
  const saved = await memberService.addMember(member);
  setMembers([saved, ...members]);
};
```

### memberService.ts

```typescript
// All functions now call Strapi API
async getMembers() {
  const response = await fetch('http://localhost:1337/api/attendees')
  return response.json().data
}

async addMember(member) {
  return await api.post('/attendees', { data: member })
}
```

---

## 🔐 Security Note

Currently NO authentication (for testing only).

To add login in future:

1. Enable JWT in Strapi
2. Update memberService to send auth token
3. Protect routes in Strapi

---

## ✨ Features Enabled

- ✅ Real data persistence
- ✅ Multi-user ready (add login later)
- ✅ Scalable architecture
- ✅ RESTful API
- ✅ Error handling
- ✅ Loading states
- ✅ Role-based filtering
- ✅ Category filtering
- ✅ Search functionality
- ✅ Dark mode
- ✅ Attendance tracking per session
- ✅ Reports generation

---

## 🚀 You're Good to Go!

Everything is configured and ready to use.

**Just run both servers and start using it!**

Any issues? Check the console logs in both terminals. 📊
