import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import membersRouter from './routes/members.js';
import sessionsRouter from './routes/sessions.js';
import attendanceRouter from './routes/attendance.js';
import adminRouter from './routes/admin.js';
import { db } from './database/db.js';
import { initDatabase } from './database/init-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get public directory path
const publicPath = path.join(__dirname, '../../public');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MSP Attendance API is running' });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'MSP Attendance API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      members: '/api/members',
      sessions: '/api/sessions',
      attendance: '/api/attendance',
      admin: {
        database: '/api/admin/database',
        stats: '/api/admin/stats',
        membersAttendance: '/api/admin/members-attendance'
      }
    }
  });
});

// API routes (must come before static files)
app.use('/api/members', membersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Serve static files from public directory
app.use(express.static(publicPath));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Serve index.html for root and all other non-API routes
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database tables
    await initDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.close();
  process.exit(0);
});
