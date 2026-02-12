import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.js';
import membersRouter from './routes/members.js';
import sessionsRouter from './routes/sessions.js';
import attendanceRouter from './routes/attendance.js';
import adminRouter from './routes/admin.js';
import { db } from './database/db.js';
import { initDatabase } from './database/init-server.js';
import helmet from 'helmet'; // مكتبة أمان مهمة جداً للـ CV

const app = express();
const PORT = process.env.PORT || 3001;
const isVercel = process.env.VERCEL === '1';

// CORS configuration to accept requests from any port
const corsOptions = {
  // origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  //   // Allow requests with no origin (mobile apps, curl requests, etc.)
  //   if (!origin) {
  //     callback(null, true);
  //     return;
  //   }
  //   // Allow any localhost with different ports
  //   if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
  //     callback(null, true);
  //     return;
  //   }
  //   // Allow all origins (for development)
  //   callback(null, true);
  // },
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
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

app.post('/api/form', async (req, res) => {
  res.sendStatus(200);
});

app.use('/api/members', membersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// if (!isVercel) {
//   const publicPath = path.join(__dirname, '../../public');
//   app.use(express.static(publicPath));
//   app.use('/api/*', (req, res) => {
//     res.status(404).json({ error: 'Route not found' });
//   });
//   app.get('*', (req, res) => {
//     if (req.path.startsWith('/api')) {
//       return res.status(404).json({ error: 'Route not found' });
//     }
//     res.sendFile(path.join(publicPath, 'index.html'));
//   });
// } else {
//   app.use((_req, res) => {
//     res.status(404).json({ error: 'Route not found' });
//   });
// }



// 1. إعدادات الأمان الأساسية
app.use(helmet()); 
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true
}));
app.use(express.json());

// 2. الـ Routes بتاعتك (لازم تكون قبل الـ 404 handler)
// app.use('/api/auth', authRoutes); 

// 3. اختبار بسيط للتأكد إن الباك شغال (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running!' });
});

// 4. الـ 404 Handler الآمن للـ API فقط
// أي طلب مش بيبدأ بـ /api سيبه لـ Vercel يتعامل معاه من خلال vercel.json
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API Route not found' });
});


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
