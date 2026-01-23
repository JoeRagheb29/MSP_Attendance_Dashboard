import { db } from './db.js';

async function initDatabase() {
  try {
    // Create members table
    await db.run(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('game', 'graphics')),
        role TEXT NOT NULL CHECK(role IN ('attendee', 'member', 'organizer')),
        email TEXT,
        phone TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create attendance table
    await db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId INTEGER NOT NULL,
        sessionId INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
        notes TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
        UNIQUE(memberId, sessionId)
      )
    `);

    // Create indexes for better performance
    await db.run('CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(memberId)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(sessionId)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_members_category ON members(category)');

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await db.close();
  }
}

initDatabase();
