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
const isVercel = process.env.VERCEL === '1';

app.use(cors());
app.use(express.json());

function healthResponse(res: express.Response) {
  res.json({ status: 'ok', message: 'MSP Attendance API is running' });
}

app.get('/health', (req, res) => healthResponse(res));
app.get('/api/health', (req, res) => healthResponse(res));

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
        membersAttendance: '/api/admin/members-attendance',
      },
    },
  });
});

app.post('/api/form', async (req, res) => {
  res.sendStatus(200);
});

app.use('/api/members', membersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/admin', adminRouter);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (!isVercel) {
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (!isVercel) {
  startServer();
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
}

export default app;
export { initDatabase };
