import express from 'express';
import { db } from '../database/db.js';
import type { Session } from '../types/index.js';

const router = express.Router();

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await db.all<Session>('SELECT * FROM sessions ORDER BY date DESC, createdAt DESC');
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const session = await db.get<Session>('SELECT * FROM sessions WHERE id = ?', [id]);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create new session
router.post('/', async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Session name is required' });
    }

    // Use provided date or current date
    const sessionDate = date || new Date().toISOString();

    const result = await db.run(
      'INSERT INTO sessions (name, date, createdAt) VALUES (?, ?, datetime("now"))',
      [name, sessionDate]
    );

    const newSession = await db.get<Session>('SELECT * FROM sessions WHERE id = ?', [result.lastID]);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, date } = req.body;

    // Check if session exists
    const existingSession = await db.get<Session>('SELECT * FROM sessions WHERE id = ?', [id]);
    if (!existingSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db.run(
      'UPDATE sessions SET name = COALESCE(?, name), date = COALESCE(?, date) WHERE id = ?',
      [name || null, date || null, id]
    );

    const updatedSession = await db.get<Session>('SELECT * FROM sessions WHERE id = ?', [id]);
    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if session exists
    const existingSession = await db.get<Session>('SELECT * FROM sessions WHERE id = ?', [id]);
    if (!existingSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db.run('DELETE FROM sessions WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
