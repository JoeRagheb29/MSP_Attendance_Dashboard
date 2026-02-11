import pg from 'pg';
const { Pool } = pg;

// الرابط ده هتاخده من Supabase (Settings -> Database -> Connection String)
const connectionString = "postgresql://postgres.eudevmtgrkyoemqsdebe:GHepM9k792kL9E3j@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

class Database {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // ضروري للاتصال بـ Supabase من السيرفرات السحابية
      }
    });

    this.pool.on('connect', () => {
      console.log('✅ Connected to Supabase (PostgreSQL) database');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
    });
  }

  // في Postgres الـ Result مش بيرجع lastID بنفس شكل SQLite
  // بس هنحفظ الـ Structure عشان الكود بتاعك ما يضربش
  async run(sql: string, params: unknown[] = []): Promise<{ lastID: number }> {
    const result = await this.pool.query(sql, params);
    // في Postgres بنستخدم RETURNING id في الـ SQL عشان ناخد الـ ID
    return { lastID: result.rows[0]?.id || 0 };
  }

  async get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    const result = await this.pool.query(sql, params);
    return result.rows[0] as T;
  }

  async all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = new Database();