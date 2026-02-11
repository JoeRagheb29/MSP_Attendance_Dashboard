// import { db } from './db.js';

// export async function initDatabase() {
//   try {
//     // Create users table for authentication
//     await db.run(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         email TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         role TEXT NOT NULL CHECK(role IN ('admin', 'moderator', 'user')) DEFAULT 'user',
//         createdAt TEXT NOT NULL DEFAULT (datetime('now')),
//         updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
//       )
//     `);

//     // Create members table
//     await db.run(`
//       CREATE TABLE IF NOT EXISTS members (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         category TEXT NOT NULL CHECK(category IN ('game', 'graphics')),
//         role TEXT NOT NULL CHECK(role IN ('attendee', 'member', 'organizer')),
//         email TEXT,
//         phone TEXT,
//         createdAt TEXT NOT NULL DEFAULT (datetime('now'))
//       )
//     `);

//     // Create sessions table
//     await db.run(`
//       CREATE TABLE IF NOT EXISTS sessions (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         date TEXT NOT NULL,
//         createdAt TEXT NOT NULL DEFAULT (datetime('now'))
//       )
//     `);

//     // Create attendance table
//     await db.run(`
//       CREATE TABLE IF NOT EXISTS attendance (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         member_id INTEGER NOT NULL,
//         session_id INTEGER NOT NULL,
//         status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
//         notes TEXT,
//         createdAt TEXT NOT NULL DEFAULT (datetime('now')),
//         FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
//         FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
//         UNIQUE(member_id, session_id)
//       )
//     `);

//     // Create indexes for better performance
//     await db.run('CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id)');
//     await db.run('CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id)');
//     await db.run('CREATE INDEX IF NOT EXISTS idx_members_category ON members(category)');

//     console.log('✅ Database tables initialized successfully!');
//   } catch (error) {
//     console.error('❌ Error initializing database:', error);
//     throw error;
//   }
// }


// src/database/init-server.ts

import { db } from './db'; // أو أي اسم ملف الداتابيز عندك

export const initDatabase = async () => {
  try {
    // إحنا خلاص عملنا الجداول يدوي على Supabase
    // فمش محتاجين ننشئها هنا تاني
    console.log('📡 Skipping table creation (Tables already exist on Supabase)');
    
    // ممكن تعمل Test بسيط للاتصال هنا بس
    await db.get('SELECT NOW()'); 
    console.log('✅ Database connection verified!');
  } catch (err) {
    console.error('❌ Database verification failed:', err);
    throw err; // ارمي الـ error عشان السيرفر يقف لو مفيش اتصال
  }
};