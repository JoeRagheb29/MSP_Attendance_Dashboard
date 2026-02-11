/**
 * Database layer: SQLite (local) or Turso (Vercel serverless).
 * Uses Turso when TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set.
 */
const useTurso =
  typeof process !== 'undefined' &&
  !!process.env.TURSO_DATABASE_URL &&
  !!process.env.TURSO_AUTH_TOKEN;

let db: {
  run: (sql: string, params?: unknown[]) => Promise<{ lastID: number }>;
  get: <T = unknown>(sql: string, params?: unknown[]) => Promise<T | undefined>;
  all: <T = unknown>(sql: string, params?: unknown[]) => Promise<T[]>;
  close: () => Promise<void>;
};

if (useTurso) {
  const turso = await import('./db-turso.js');
  db = turso.db;
} else {
  const sqlite = await import('./db-postgreSQL.js');
  db = sqlite.db;
}

export { db };
