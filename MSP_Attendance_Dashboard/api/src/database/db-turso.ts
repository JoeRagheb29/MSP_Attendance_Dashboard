/**
 * Turso (libSQL) database adapter for Vercel serverless.
 * Use when TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set.
 */
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const client = createClient({ url, authToken });

export interface TursoRunResult {
  lastID: number;
}

async function run(sql: string, params: unknown[] = []): Promise<TursoRunResult> {
  const args = params as (string | number | null)[];
  const result = await client.execute({ sql, args });
  return { lastID: Number(result.lastInsertRowid ?? 0) };
}

async function get<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  const args = params as (string | number | null)[];
  const result = await client.execute({ sql, args });
  if (result.rows.length === 0) return undefined;
  const row = result.rows[0] as Record<string, unknown>;
  return row as unknown as T;
}

async function all<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const args = params as (string | number | null)[];
  const result = await client.execute({ sql, args });
  return result.rows as unknown as T[];
}

async function close(): Promise<void> {
  client.close();
}

export const db = {
  run,
  get,
  all,
  close,
};
