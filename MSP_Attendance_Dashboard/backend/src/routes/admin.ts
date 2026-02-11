import express from 'express';
import { db } from '../database/db.js';
import type { Member, Session, Attendance } from '../types/index.js';

const router = express.Router();

// Get all database data
router.get('/database', async (req, res) => {
  try {
    // في Postgres بنستخدم "created_at" (الاسم اللي عملناه في الـ SQL Editor)
    const members = await db.all<Member>('SELECT * FROM members ORDER BY created_at DESC');
    const sessions = await db.all<Session>('SELECT * FROM sessions ORDER BY date DESC, created_at DESC');
    const attendance = await db.all<Attendance>('SELECT * FROM attendance ORDER BY created_at DESC');

    const attendanceWithDetails = await db.all<any>(`
      SELECT 
        a.*,
        m.name as "memberName",
        m.category as "memberCategory",
        s.name as "sessionName",
        s.date as "sessionDate"
      FROM attendance a
      INNER JOIN members m ON a.member_id = m.id
      INNER JOIN sessions s ON a.session_id = s.id
      ORDER BY a.created_at DESC
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
    const memberCount = await db.get<{ count: string }>('SELECT COUNT(*) as count FROM members');
    const sessionCount = await db.get<{ count: string }>('SELECT COUNT(*) as count FROM sessions');
    const attendanceCount = await db.get<{ count: string }>('SELECT COUNT(*) as count FROM attendance');
    
    const presentCount = await db.get<{ count: string }>(
      "SELECT COUNT(*) as count FROM attendance WHERE status = 'present'"
    );
    const absentCount = await db.get<{ count: string }>(
      "SELECT COUNT(*) as count FROM attendance WHERE status = 'absent'"
    );

    const membersByCategory = await db.all<{ category: string; count: number }>(
      'SELECT category, COUNT(*) as count FROM members GROUP BY category'
    );

    const attendanceBySession = await db.all<{ session_id: number; sessionName: string; present: number; absent: number }>(`
      SELECT 
        s.id as "session_id",
        s.name as "sessionName",
        CAST(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS INTEGER) as present,
        CAST(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS INTEGER) as absent
      FROM sessions s
      LEFT JOIN attendance a ON s.id = a.session_id
      GROUP BY s.id, s.name
      ORDER BY s.date DESC
    `);

    res.json({
      totals: {
        members: Number(memberCount?.count) || 0,
        sessions: Number(sessionCount?.count) || 0,
        attendanceRecords: Number(attendanceCount?.count) || 0,
        present: Number(presentCount?.count) || 0,
        absent: Number(absentCount?.count) || 0,
      },
      membersByCategory,
      attendanceBySession,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all members with summary
router.get('/members-attendance', async (req, res) => {
  try {
    const membersWithAttendance = await db.all<any>(`
      SELECT 
        m.*,
        COUNT(a.id) as "totalSessionsAttended",
        CAST(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS INTEGER) as "presentCount",
        CAST(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS INTEGER) as "absentCount"
      FROM members m
      LEFT JOIN attendance a ON m.id = a.member_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);

    res.json(membersWithAttendance);
  } catch (error) {
    console.error('Error fetching members with attendance:', error);
    res.status(500).json({ error: 'Failed to fetch members with attendance' });
  }
});

export default router;