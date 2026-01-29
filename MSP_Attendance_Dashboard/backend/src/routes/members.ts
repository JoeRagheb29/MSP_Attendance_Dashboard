import express from 'express';
import { db } from '../database/db.js';
import type { Member, Category } from '../types/index.js';

const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await db.all<Member>('SELECT * FROM members ORDER BY createdAt DESC');
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
    const members = await db.all<Member>(
      'SELECT * FROM members WHERE category = ? ORDER BY createdAt DESC',
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
    const member = await db.get<Member>('SELECT * FROM members WHERE id = ?', [id]);
    
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

    if (!['game', 'graphics'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (!['attendee', 'member', 'organizer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await db.run(
      'INSERT INTO members (name, category, role, email, phone, createdAt) VALUES (?, ?, ?, ?, ?, datetime("now"))',
      [name, category, role, email || null, phone || null]
    );

    const newMember = await db.get<Member>('SELECT * FROM members WHERE id = ?', [result.lastID]);
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

    // Check if member exists
    const existingMember = await db.get<Member>('SELECT * FROM members WHERE id = ?', [id]);
    if (!existingMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (category && !['game', 'graphics'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (role && !['attendee', 'member', 'organizer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await db.run(
      'UPDATE members SET name = COALESCE(?, name), category = COALESCE(?, category), role = COALESCE(?, role), email = ?, phone = ? WHERE id = ?',
      [name || null, category || null, role || null, email || null, phone || null, id]
    );

    const updatedMember = await db.get<Member>('SELECT * FROM members WHERE id = ?', [id]);
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

    // Check if member exists
    const existingMember = await db.get<Member>('SELECT * FROM members WHERE id = ?', [id]);
    if (!existingMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await db.run('DELETE FROM members WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;
