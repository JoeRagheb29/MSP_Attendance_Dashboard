import express from 'express';
import { db } from '../database/db.js';
import type { Member, Category } from '../types/index.js';

const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    // Postgres uses double quotes for case-sensitive column names if they were created that way,
    // but typically we just use standard names.
    const members = await db.all<Member>('SELECT * FROM members ORDER BY "created_at" DESC');
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get members by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category as Category;
    // Changed '?' to '$1'
    const members = await db.all<Member>(
      'SELECT * FROM members WHERE category = $1 ORDER BY "created_at" DESC',
      [category]
    );
    res.json(members);
  } catch (error) {
    console.error('Error fetching members by category:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const member = await db.get<Member>('SELECT * FROM members WHERE id = $1', [id]);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Add new member
router.post('/', async (req, res) => {
  try {
    const { name, category, role, email, phone } = req.body;

    if (!name || !category || !role) {
      return res.status(400).json({ error: 'Name, category, and role are required' });
    }

    // Postgres-specific: Using CURRENT_TIMESTAMP and RETURNING *
    const query = `
      INSERT INTO members (name, category, role, email, phone, "created_at") 
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const newMember = await db.get<Member>(query, [
      name, 
      category, 
      role, 
      email || null, 
      phone || null
    ]);

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, role, email, phone } = req.body;

    // Postgres logic: Use COALESCE to handle partial updates cleanly
    // and RETURNING * to get the result immediately.
    const query = `
      UPDATE members 
      SET 
        name = COALESCE($1, name), 
        category = COALESCE($2, category), 
        role = COALESCE($3, role), 
        email = COALESCE($4, email), 
        phone = COALESCE($5, phone) 
      WHERE id = $6
      RETURNING *
    `;

    const updatedMember = await db.get<Member>(query, [
      name || null, 
      category || null, 
      role || null, 
      email || null, 
      phone || null, 
      id
    ]);

    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // In Postgres, we can just attempt the delete and check if anything happened
    const result = await db.run('DELETE FROM members WHERE id = $1', [id]);
    
    // Depending on your pg helper library, you'd check result.rowCount
    // But for a simple conversion, we'll keep your status flow:
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;