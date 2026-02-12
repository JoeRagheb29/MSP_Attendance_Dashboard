import express from 'express';
import { db } from '../database/db.js';
import type { Session } from '../types/index.js';

const router = express.Router();

// Get all sessions
router.get('/', async (req, res) => {
  try {
    // Note: Column names like createdAt are often double-quoted in Postgres 
    // to preserve case-sensitivity if the table was defined that way.
    const sessions = await db.all<Session>(
      'SELECT * FROM sessions ORDER BY date DESC, "created_at" DESC'
    );
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
    const session = await db.get<Session>('SELECT * FROM sessions WHERE id = $1', [id]);
    
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

    const sessionDate = date || new Date().toISOString();

    // Postgres uses CURRENT_TIMESTAMP and RETURNING * to get the new row immediately
    const query = `
      INSERT INTO sessions (name, date, "created_at") 
      VALUES ($1, $2, CURRENT_TIMESTAMP) 
      RETURNING *
    `;

    const newSession = await db.get<Session>(query, [name, sessionDate]);
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

    // We can use RETURNING * here as well to check existence and update in one go
    const query = `
      UPDATE sessions 
      SET name = COALESCE($1, name), 
          date = COALESCE($2, date) 
      WHERE id = $3 
      RETURNING *
    `;

    const updatedSession = await db.get<Session>(query, [name || null, date || null, id]);

    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

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

    // In Postgres, we use $1 as the placeholder
    const result = await db.run('DELETE FROM sessions WHERE id = $1', [id]);
    
    // Most PG drivers return information about how many rows were affected.
    // If you need to verify it existed, you'd check result.rowCount
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;