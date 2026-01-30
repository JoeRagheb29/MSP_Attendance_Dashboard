import express from 'express';
import { db } from '../database/db.js';
import type { Member, Session, Attendance } from '../types/index.js';

const router = express.Router();

// Get all database data in a readable format
router.get('/database', async (req, res) => {
  try {
    const members = await db.all<Member>('SELECT * FROM members ORDER BY createdAt DESC');
    const sessions = await db.all<Session>('SELECT * FROM sessions ORDER BY date DESC, createdAt DESC');
    const attendance = await db.all<Attendance>('SELECT * FROM attendance ORDER BY createdAt DESC');

    // Get attendance with member and session details
    const attendanceWithDetails = await db.all<any>(`
      SELECT 
        a.*,
        m.name as memberName,
        m.category as memberCategory,
        s.name as sessionName,
        s.date as sessionDate
      FROM attendance a
      INNER JOIN members m ON a.memberId = m.id
      INNER JOIN sessions s ON a.sessionId = s.id
      ORDER BY a.createdAt DESC
    `);

    res.json({
      summary: {
        totalMembers: members.length,
        totalSessions: sessions.length,
        totalAttendanceRecords: attendance.length,
      },
      members,
      sessions,
      attendance: attendanceWithDetails,
      rawAttendance: attendance,
    });
  } catch (error) {
    console.error('Error fetching database data:', error);
    res.status(500).json({ error: 'Failed to fetch database data' });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const memberCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM members');
    const sessionCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM sessions');
    const attendanceCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM attendance');
    
    const presentCount = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM attendance WHERE status = 'present'"
    );
    const absentCount = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM attendance WHERE status = 'absent'"
    );

    const membersByCategory = await db.all<{ category: string; count: number }>(
      'SELECT category, COUNT(*) as count FROM members GROUP BY category'
    );

    const attendanceBySession = await db.all<{ sessionId: number; sessionName: string; present: number; absent: number }>(`
      SELECT 
        s.id as sessionId,
        s.name as sessionName,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent
      FROM sessions s
      LEFT JOIN attendance a ON s.id = a.sessionId
      GROUP BY s.id, s.name
      ORDER BY s.date DESC
    `);

    res.json({
      totals: {
        members: memberCount?.count || 0,
        sessions: sessionCount?.count || 0,
        attendanceRecords: attendanceCount?.count || 0,
        present: presentCount?.count || 0,
        absent: absentCount?.count || 0,
      },
      membersByCategory,
      attendanceBySession,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all members with their attendance summary
router.get('/members-attendance', async (req, res) => {
  try {
    const membersWithAttendance = await db.all<any>(`
      SELECT 
        m.*,
        COUNT(a.id) as totalSessionsAttended,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absentCount
      FROM members m
      LEFT JOIN attendance a ON m.id = a.memberId
      GROUP BY m.id
      ORDER BY m.createdAt DESC
    `);

    res.json(membersWithAttendance);
  } catch (error) {
    console.error('Error fetching members with attendance:', error);
    res.status(500).json({ error: 'Failed to fetch members with attendance' });
  }
});

export default router;
