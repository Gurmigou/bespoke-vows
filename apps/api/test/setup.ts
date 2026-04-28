import { vi, beforeAll, beforeEach, afterAll } from 'vitest';

process.env.NODE_ENV = 'development';
process.env.DATABASE_URL ??= 'postgresql://user:password@localhost:5432/bespoke_vows';
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-string';
process.env.MONO_WEBHOOK_SECRET = 'test-mono-webhook-secret';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3001/auth/google/callback';
process.env.WEB_ORIGIN = 'http://localhost:8080';
process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';

vi.mock('@vercel/blob', () => ({
  put: vi.fn(async (filename: string) => ({
    url: `https://blob.test/${filename}`,
  })),
  del: vi.fn(async () => undefined),
}));

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

beforeAll(async () => {
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: './src/db/migrations' });
});

beforeEach(async () => {
  await sql`TRUNCATE TABLE invitations, users RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await sql.end();
});
