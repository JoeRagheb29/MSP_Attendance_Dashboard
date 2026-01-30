import express from 'express';
import { db } from '../database/db.js';
import type { Attendance, AttendanceStatus } from '../types/index.js';

const router = express.Router();

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance ORDER BY createdAt DESC'
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance for a specific member
router.get('/member/:memberId', async (req, res) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance WHERE memberId = ? ORDER BY createdAt DESC',
      [memberId]
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching member attendance:', error);
    res.status(500).json({ error: 'Failed to fetch member attendance' });
  }
});

// Get attendance for a specific session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance WHERE sessionId = ? ORDER BY createdAt DESC',
      [sessionId]
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching session attendance:', error);
    res.status(500).json({ error: 'Failed to fetch session attendance' });
  }
});

// Get today's attendance
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await db.all<Attendance>(
      `SELECT a.* FROM attendance a 
       INNER JOIN sessions s ON a.sessionId = s.id 
       WHERE DATE(s.date) = ? 
       ORDER BY a.createdAt DESC`,
      [today]
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s attendance' });
  }
});

// Mark attendance (create or update)
router.post('/', async (req, res) => {
  try {
    const { memberId, sessionId, status, notes } = req.body;

    if (!memberId || !sessionId || !status) {
      return res.status(400).json({ error: 'memberId, sessionId, and status are required' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "present" or "absent"' });
    }

    // Check if member exists
    const member = await db.get('SELECT id FROM members WHERE id = ?', [memberId]);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if session exists
    const session = await db.get('SELECT id FROM sessions WHERE id = ?', [sessionId]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if attendance record already exists
    const existing = await db.get<Attendance>(
      'SELECT * FROM attendance WHERE memberId = ? AND sessionId = ?',
      [memberId, sessionId]
    );

    if (existing) {
      // Update existing record
      await db.run(
        'UPDATE attendance SET status = ?, notes = ? WHERE id = ?',
        [status, notes || null, existing.id]
      );
      const updated = await db.get<Attendance>('SELECT * FROM attendance WHERE id = ?', [existing.id]);
      return res.json(updated);
    } else {
      // Create new record
      const result = await db.run(
        'INSERT INTO attendance (memberId, sessionId, status, notes, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
        [memberId, sessionId, status, notes || null]
      );
      const newAttendance = await db.get<Attendance>('SELECT * FROM attendance WHERE id = ?', [result.lastID]);
      return res.status(201).json(newAttendance);
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Update attendance
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;

    // Check if attendance record exists
    const existing = await db.get<Attendance>('SELECT * FROM attendance WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (status && !['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "present" or "absent"' });
    }

    await db.run(
      'UPDATE attendance SET status = COALESCE(?, status), notes = ? WHERE id = ?',
      [status || null, notes !== undefined ? notes : existing.notes, id]
    );

    const updated = await db.get<Attendance>('SELECT * FROM attendance WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if attendance record exists
    const existing = await db.get<Attendance>('SELECT * FROM attendance WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    await db.run('DELETE FROM attendance WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;
