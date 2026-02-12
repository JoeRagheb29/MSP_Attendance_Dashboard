import express from 'express';
import { db } from '../database/db.js';
import type { Attendance } from '../types/index.js';

const router = express.Router();

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance ORDER BY "created_at" DESC'
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance for a specific member
router.get('/member/:member_id', async (req, res) => {
  try {
    const member_id = parseInt(req.params.member_id);
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance WHERE "member_id" = $1 ORDER BY "created_at" DESC',
      [member_id]
    );
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching member attendance:', error);
    res.status(500).json({ error: 'Failed to fetch member attendance' });
  }
});

// Get attendance for a specific session
router.get('/session/:session_id', async (req, res) => {
  try {
    const session_id = parseInt(req.params.session_id);
    const attendance = await db.all<Attendance>(
      'SELECT * FROM attendance WHERE "session_id" = $1 ORDER BY "created_at" DESC',
      [session_id]
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
       INNER JOIN sessions s ON a."session_id" = s.id 
       WHERE s.date::date = $1 
       ORDER BY a."created_at" DESC`,
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
    const { member_id, session_id, status, notes } = req.body;

    if (!member_id || !session_id || !status) {
      return res.status(400).json({ error: 'member_id, session_id, and status are required' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "present" or "absent"' });
    }

    // Check if member exists
    const member = await db.get('SELECT id FROM members WHERE id = $1', [member_id]);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if session exists
    const session = await db.get('SELECT id FROM sessions WHERE id = $1', [session_id]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // PostgreSQL specific UPSERT (Insert or Update on conflict)
    // This assumes you have a UNIQUE constraint on (member_id, session_id)
    const query = `
      INSERT INTO attendance ("member_id", "session_id", status, notes, "created_at")
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT ("member_id", "session_id") 
      DO UPDATE SET 
        status = EXCLUDED.status,
        notes = EXCLUDED.notes
      RETURNING *;
    `;
    
    const result = await db.get<Attendance>(query, [member_id, session_id, status, notes || null]);
    return res.status(201).json(result);

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

    if (status && !['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "present" or "absent"' });
    }

    const query = `
      UPDATE attendance 
      SET status = COALESCE($1, status), 
          notes = COALESCE($2, notes) 
      WHERE id = $3 
      RETURNING *;
    `;
    
    const updated = await db.get<Attendance>(query, [status || null, notes || null, id]);
    
    if (!updated) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

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
    const result = await db.run('DELETE FROM attendance WHERE id = $1', [id]);
    
    // In many Postgres drivers, you check result.rowCount
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;