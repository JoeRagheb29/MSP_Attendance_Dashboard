# Viewing the Database

The backend provides several endpoints to view your database contents:

## Quick Access URLs

Once your server is running (`npm run dev`), you can access:

### 1. **Complete Database View**
**URL**: http://localhost:3001/api/admin/database

Shows all data in the database:
- All members
- All sessions
- All attendance records (with member and session details)
- Summary statistics

### 2. **Statistics Dashboard**
**URL**: http://localhost:3001/api/admin/stats

Shows:
- Total counts (members, sessions, attendance records)
- Present/Absent counts
- Members grouped by category
- Attendance breakdown by session

### 3. **Members with Attendance Summary**
**URL**: http://localhost:3001/api/admin/members-attendance

Shows each member with:
- Their total sessions attended
- Present count
- Absent count

## Using a Browser

Simply open any of the URLs above in your web browser to see the JSON data.

## Using curl (Command Line)

```bash
# View complete database
curl http://localhost:3001/api/admin/database

# View statistics
curl http://localhost:3001/api/admin/stats

# View members with attendance
curl http://localhost:3001/api/admin/members-attendance
```

## Using a JSON Formatter

For better readability, use a browser extension like:
- **JSON Formatter** (Chrome/Edge)
- **JSONView** (Firefox)

Or use online tools:
- https://jsonformatter.org/
- https://jsonformatter.curiousconcept.com/

## Using SQLite Browser (Advanced)

If you want to view the raw database file:

1. **Install DB Browser for SQLite**: https://sqlitebrowser.org/
2. Open the `attendance.db` file in the `backend` folder
3. Browse tables, run queries, and view data

**Note**: Make sure the server is not running when directly accessing the database file, or use read-only mode.
