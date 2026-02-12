import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import membersRouter from './routes/members.js';
import sessionsRouter from './routes/sessions.js';
import attendanceRouter from './routes/attendance.js';
import adminRouter from './routes/admin.js';
import { db } from './database/db.js';
import { initDatabase } from './database/init-server.js';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const app = express();
const PORT = process.env.PORT || 3001;
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Allowed origins — prefer explicit env var, fallback to known dev/prod origins
const defaultFrontend = 'https://event-attendance-system-6Sav2htRa-joeragheb29s-projects.vercel.app';
const allowedFromEnv = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
const allowedOrigins = allowedFromEnv
  ? allowedFromEnv.split(',').map(s => s.trim()).filter(Boolean)
  : [defaultFrontend, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

console.log('Allowed CORS origins:', allowedOrigins.join(', '));

// CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares (order matters)
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Health checks
app.get('/health', (_req, res) => res.json({ status: 'ok', message: 'MSP Attendance API is running' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Server is running!' }));

// Root info
app.get('/api', (_req, res) => {
  res.json({
    message: 'MSP Attendance API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
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

// Simple form endpoint
app.post('/api/form', async (_req, res) => res.sendStatus(200));

// API routes
app.use('/api/members', membersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Error handling
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err && (err as Error).message ? (err as Error).message : err);
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS Error: origin not allowed' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for API
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'API Route not found' }));

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
} else {
  // Vercel / serverless: export app and let platform handle the listener
  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
}

export default app;
export { initDatabase };
