# 📊 MSP Attendance Management System

A professional attendance and member management dashboard for workshops and events. Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** on the frontend, with a custom **Express.js** backend using **SQLite** database.

---

## ✨ Features

### 👥 Member Management

- ✅ **View Members** - Display all members in a responsive table format
- ✅ **Add Members** - Add new members with name, email, phone, and role
- ✅ **Edit Members** - Modify member information seamlessly
- ✅ **Delete Members** - Remove members from the system with confirmation
- ✅ **Filter by Role** - Filter members by Attendee, Member, or Organizer
- ✅ **Search Members** - Find members by name, email, or phone number

### 📅 Session Management

- ✅ **Create Sessions** - Organize multiple workshops/events
- ✅ **Manage Sessions** - View all sessions with dates
- ✅ **Select Sessions** - Switch between different sessions to manage attendance
- ✅ **Session Details** - View session information and attendance overview

### 📋 Attendance Tracking

- ✅ **Mark Attendance** - Record Present/Absent for each member per session
- ✅ **Track History** - View attendance records across multiple sessions
- ✅ **Attendance Reports** - Generate comprehensive attendance statistics
- ✅ **Attendance Percentage** - Calculate and display attendance rates with visual indicators
- ✅ **Per-Session Indicators** - See attendance status for each session at a glance

### 🔍 Search & Filter

- ✅ **Search Members** - Find members by name, email, or phone
- ✅ **Filter by Role** - Filter by Attendee, Member, or Organizer
- ✅ **Combine Filters** - Use multiple filters together for precise results

### 🎨 User Interface

- ✅ **Dark Mode** - Full dark mode support with persistent storage
- ✅ **Light Mode** - Clean and professional light theme
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Instant feedback for all actions
- ✅ **Loading States** - Clear loading indicators for all operations
- ✅ **Error Handling** - Helpful error messages and recovery options

### 📊 Admin Features

- ✅ **Database Statistics** - View total members, sessions, and attendance records
- ✅ **Attendance Analytics** - Summary statistics across all members
- ✅ **Member Attendance Overview** - Detailed attendance for each member
- ✅ **Admin Panel** - Access to database management and statistics

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **SQLite3** (included with backend)

### Installation

#### 1. Clone or Navigate to Project

```bash
cd "/home/youssef/Desktop/msp system/MSP_Attendance_Dashboard"
```

#### 2. Install All Dependencies

```bash
npm run install:all
```

This will install:

- Frontend dependencies in the root directory
- Backend dependencies in the `backend/` folder

#### 3. Start Development Servers

**Option A: Start Both Servers Together**

```bash
npm run dev:all
```

**Option B: Start Backend & Frontend Separately**

Terminal 1 - Start Backend (Express.js on port 3001):

```bash
npm run dev:backend
```

Terminal 2 - Start Frontend (React on port 5173):

```bash
npm run dev
```

#### 4. Access the Application

- **Frontend:** Open `http://localhost:5173` in your browser
- **Backend Health Check:** Visit `http://localhost:3001/api/health`
- **API Endpoints:** `http://localhost:3001/api`

---

## 📁 Project Structure

```
MSP_Attendance_Dashboard/
│
├── Frontend/                         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── NavBar.tsx           # Navigation bar with search & filters
│   │   │   ├── MemberList.tsx       # Members table component
│   │   │   ├── AddMember.tsx        # Add/Edit member form modal
│   │   │   ├── AttendanceReport.tsx # Attendance report view
│   │   │   └── Footer.tsx           # Footer component
│   │   ├── context/                 # React Context for state management
│   │   │   ├── ThemeContext.tsx     # Dark mode context provider
│   │   │   └── useTheme.ts          # Theme custom hook
│   │   ├── api/                     # API service layer
│   │   │   └── memberService.ts     # API calls to backend
│   │   ├── types/                   # TypeScript interfaces
│   │   │   └── index.ts             # Type definitions
│   │   ├── utils/                   # Utility functions
│   │   │   └── apiHealthCheck.ts    # API health check utility
│   │   ├── data/                    # Static data
│   │   │   └── mockData.ts          # Mock data for development
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                       # Static assets
│   ├── index.html                   # HTML template
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Frontend dependencies
│   └── README.md                    # Frontend documentation
│
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── server.ts                # Express server setup
│   │   ├── database/
│   │   │   ├── db.ts                # SQLite database connection
│   │   │   ├── init.ts              # Database initialization script
│   │   │   └── init-server.ts       # Server startup database setup
│   │   ├── routes/
│   │   │   ├── members.ts           # Members API routes
│   │   │   ├── sessions.ts          # Sessions API routes
│   │   │   ├── attendance.ts        # Attendance API routes
│   │   │   └── admin.ts             # Admin API routes
│   │   └── types/
│   │       └── index.ts             # TypeScript types for backend
│   ├── attendance.db                # SQLite database file
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
│
└── public/                           # Public assets

```

---

## 🛠 Technology Stack

### Frontend

| Technology       | Purpose                 | Version |
| ---------------- | ----------------------- | ------- |
| **React**        | UI Framework            | 19.2.0  |
| **TypeScript**   | Type-safe JavaScript    | 5.9.3   |
| **Vite**         | Build tool & dev server | 7.2.4   |
| **Tailwind CSS** | Utility-first CSS       | 4.1.18  |
| **React Icons**  | Icon library            | 5.5.0   |
| **Axios**        | HTTP client             | 1.13.2  |

### Backend

| Technology     | Purpose              | Version |
| -------------- | -------------------- | ------- |
| **Express.js** | Web framework        | 4.18.2  |
| **TypeScript** | Type-safe JavaScript | 5.3.3   |
| **SQLite3**    | Database             | 5.1.7   |
| **CORS**       | Cross-origin support | 2.8.5   |
| **tsx**        | TypeScript execution | 4.7.0   |

---

## 📊 Data Models

### Member

```typescript
interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "attendee" | "member" | "organizer";
  createdAt: string;
}
```

### Session

```typescript
interface Session {
  id: number;
  name: string;
  date: string;
  createdAt: string;
}
```

### Attendance

```typescript
interface Attendance {
  id: number;
  memberId: number;
  sessionId: number;
  status: "present" | "absent";
  createdAt: string;
}
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Members Endpoints

```
GET    /api/members              # Get all members
GET    /api/members/:id          # Get single member
POST   /api/members              # Create new member
PUT    /api/members/:id          # Update member
DELETE /api/members/:id          # Delete member
```

### Sessions Endpoints

```
GET    /api/sessions             # Get all sessions
GET    /api/sessions/:id         # Get single session
POST   /api/sessions             # Create new session
PUT    /api/sessions/:id         # Update session
DELETE /api/sessions/:id         # Delete session
```

### Attendance Endpoints

```
GET    /api/attendance           # Get all attendance records
POST   /api/attendance           # Create attendance record
PUT    /api/attendance/:id       # Update attendance record
DELETE /api/attendance/:id       # Delete attendance record
GET    /api/attendance/session/:sessionId    # Get session attendance
GET    /api/attendance/member/:memberId      # Get member attendance
```

### Admin Endpoints

```
GET    /api/admin/database       # Get database statistics
GET    /api/admin/stats          # Get attendance statistics
GET    /api/admin/members-attendance  # Get detailed member attendance
```

### Health Check

```
GET    /health                   # Quick health check
GET    /api/health               # API health check
GET    /api                      # API info and endpoints list
```

---

## 💡 How to Use

### 🆕 Adding a New Member

1. Click the **"+ Add Member"** button in the navbar
2. Fill in the form:
   - **Name** (required) - Member's full name
   - **Email** (required) - Unique email address
   - **Phone** (optional) - Contact number
   - **Role** (required) - Select from:
     - 👤 Attendee (default)
     - 👥 Member
     - 🎖️ Organizer
3. Click **"Save"** to add the member to the database

### ✏️ Editing a Member

1. Find the member in the list
2. Click the **Edit** (✏️) button
3. Modify the information in the form
4. Click **"Save"** to update the changes

### 🗑️ Deleting a Member

1. Find the member in the list
2. Click the **Delete** (🗑️) button
3. Confirm the deletion when prompted
4. The member and all related attendance records are removed

### 📅 Creating a Session

1. Click the **"+ New Session"** button in the session selector
2. Enter the session name (e.g., "Workshop - React Basics")
3. The session is created with today's date
4. The new session becomes the selected session

### ✅ Marking Attendance

1. **Select the Session** you want to mark attendance for using the dropdown
2. For each member in the list:
   - Click **"Present"** (green button) to mark as present
   - Click **"Absent"** (red button) to mark as absent
3. Attendance is saved automatically to the database
4. Status badge updates in real-time

### 🔍 Searching & Filtering

- **Search:** Type in the search box to find members by:
  - Name
  - Email
  - Phone number
- **Filter by Role:** Use the role dropdown to filter by:
  - 👥 All Roles (default)
  - 👤 Attendee
  - 👥 Member
  - 🎖️ Organizer
- **Combine Filters:** Use search and role filter together for precise results

### 📊 Viewing Attendance Reports

1. Click the **"📊 Attendance Report"** tab or button in the navbar
2. View comprehensive attendance statistics:
   - **Summary Statistics:**
     - Total members
     - Total sessions
     - Total attendance marks
   - **Member Details Table:**
     - Member name and role
     - Total sessions attended
     - Per-session attendance status (✓ present, ✗ absent, — not marked)
     - Attendance percentage with color coding
   - **Color Coding:**
     - 🟢 Green (≥80%) - Excellent attendance
     - 🟡 Yellow (≥60%) - Good attendance
     - 🔴 Red (<60%) - Low attendance

### 🌙 Toggling Dark Mode

- Click the **Sun/Moon** icon (☀️/🌙) in the top-right corner of the navbar
- The theme preference is saved automatically to your browser
- All components adapt to the selected theme

---

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the `backend/` folder (optional):

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./attendance.db
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

The frontend is pre-configured to connect to the backend at `http://localhost:3001/api`.

To change the API base URL, edit `Frontend/src/api/memberService.ts`:

```typescript
const API_BASE = "/api"; // Change this if needed
```

### CORS Configuration

The backend accepts requests from any origin (for development). For production, update the CORS settings in `backend/src/server.ts`:

```typescript
app.use(
  cors({
    origin: "https://yourdomain.com",
    credentials: true,
  }),
);
```

---

## 📦 Build & Deployment

### Build for Production

**Frontend:**

```bash
npm run build
```

**Backend:**

```bash
npm run build:backend
```

**Both:**

```bash
npm run build:all
```

### Run Production Build

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
npm run preview
```

### Deploy Frontend

The frontend build output is in `Frontend/dist/` folder. Deploy to:

- **Vercel** (recommended) - `vercel deploy`
- **Netlify** - Drag & drop the `dist/` folder
- **GitHub Pages** - Build and push to gh-pages branch
- **Any static host** - Upload the `dist/` folder

See `VERCEL_DEPLOY.md` for detailed Vercel deployment instructions.

### Deploy Backend

Deploy the `backend/` folder to:

- **Vercel** (Node.js)
- **Railway** (recommended for this stack)
- **Render**
- **Fly.io**
- **AWS** (EC2, Lambda)
- **Any Node.js hosting**

Database: SQLite database file will be created automatically on first run.

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to backend server"

**Problem:** Frontend shows connection error
**Solutions:**

1. Ensure backend is running:
   ```bash
   npm run dev:backend
   ```
2. Check backend is on port 3001
3. Clear browser cache and refresh
4. Check browser console for detailed error

### ❌ "Members showing as undefined"

**Problem:** Members list is empty or shows errors
**Solutions:**

1. Check backend is running and healthy: `http://localhost:3001/api/health`
2. Check Network tab in browser DevTools
3. Verify database file exists: `backend/attendance.db`
4. Restart backend server

### ❌ "Cannot mark attendance"

**Problem:** Attendance marking fails
**Solutions:**

1. Ensure a session is selected
2. Check backend API is responding
3. Verify member and session IDs are valid
4. Check browser console for error details

### ❌ "Dark mode not working"

**Problem:** Theme toggle doesn't work
**Solutions:**

1. Clear browser localStorage
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for React errors

### ❌ "Database file missing"

**Problem:** Backend shows database error
**Solutions:**

1. Initialize database:
   ```bash
   cd backend
   npm run init-db
   ```
2. Check `backend/` folder exists and is writable
3. Restart backend server

### ❌ "Port already in use"

**Problem:** Backend or frontend port is already in use
**Solutions:**

1. **Change backend port** (in `backend/src/server.ts`):
   ```typescript
   const PORT = process.env.PORT || 3002; // Change 3001 to 3002
   ```
2. **Change frontend port** (in `vite.config.ts`):
   ```typescript
   server: {
     port: 5174,  // Change from 5173
   }
   ```
3. Kill process on port:

   ```bash
   # macOS/Linux
   lsof -ti:3001 | xargs kill -9

   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

---

## 📝 Available Scripts

### Frontend Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run preview          # Preview production build
npm run dev:backend      # Start backend server
npm run dev:all          # Start both frontend & backend
npm run build:backend    # Build backend
npm run build:all        # Build both frontend & backend
npm run install:all      # Install all dependencies
```

### Backend Scripts

```bash
cd backend
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Run production build
npm run init-db          # Initialize database with sample data
```

---

## 🗄️ Database

### Database Type

- **SQLite3** - File-based database stored at `backend/attendance.db`

### Database Tables

1. **members** - Stores member information
   - id, name, email, phone, role, createdAt

2. **sessions** - Stores session information
   - id, name, date, createdAt

3. **attendance** - Stores attendance records
   - id, memberId, sessionId, status, createdAt

### View Database

Use the admin panel:

```bash
curl http://localhost:3001/api/admin/database
```

Or use the `VIEW_DATABASE.md` guide for SQLite command-line tools.

---

## 🔐 Security Notes

### Current Configuration (Development)

- ✅ CORS enabled for all origins
- ✅ No authentication required
- ✅ SQLite database in-file

### For Production

- [ ] Implement JWT authentication
- [ ] Restrict CORS to specific domains
- [ ] Use environment variables for sensitive data
- [ ] Add input validation and sanitization
- [ ] Use HTTPS only
- [ ] Add rate limiting
- [ ] Use managed database (PostgreSQL, MySQL)
- [ ] Add logging and monitoring

---

## 📱 Browser Support

| Browser         | Version | Status             |
| --------------- | ------- | ------------------ |
| Chrome          | Latest  | ✅ Fully supported |
| Firefox         | Latest  | ✅ Fully supported |
| Safari          | Latest  | ✅ Fully supported |
| Edge            | Latest  | ✅ Fully supported |
| Mobile browsers | Latest  | ✅ Responsive      |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Youssef** - MSP Attendance System Developer

---

## 🙋 Support & Documentation

- **Frontend README:** See `Frontend/README.md`
- **Backend README:** See `backend/README.md`
- **Architecture Guide:** See `Frontend/ARCHITECTURE.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **Deployment Guide:** See `VERCEL_DEPLOY.md`

---

## 🎯 Future Enhancements

- [ ] User authentication and login system
- [ ] Email notifications for attendance
- [ ] Export attendance to Excel/PDF
- [ ] Monthly/yearly attendance reports
- [ ] Member performance analytics
- [ ] Role-based access control (RBAC)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] QR code attendance marking
- [ ] Calendar view for sessions
- [ ] Attendance history dashboard
- [ ] Real-time notifications
- [ ] Database backup and restore
- [ ] Bulk import/export members

---

## 📞 Contact & Support

- **Email:** support@mspsystem.com
- **Website:** Coming soon
- **GitHub Issues:** Report bugs and request features

---

## 📊 System Statistics

- **Total Files:** ~40+
- **Components:** 5 main React components
- **API Routes:** 15+ endpoints
- **Database Tables:** 3 tables
- **Code Language:** TypeScript (100%)
- **Styling Framework:** Tailwind CSS

---

## 🎉 Getting Started Checklist

- [ ] Install Node.js v18+
- [ ] Clone or navigate to project
- [ ] Run `npm run install:all`
- [ ] Run `npm run dev:all` to start both servers
- [ ] Open `http://localhost:5173` in browser
- [ ] Add your first member
- [ ] Create a session
- [ ] Mark attendance
- [ ] View reports
- [ ] Toggle dark mode
- [ ] Explore features!

---

**Last Updated:** January 30, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

**Happy attendance tracking! 🚀**
