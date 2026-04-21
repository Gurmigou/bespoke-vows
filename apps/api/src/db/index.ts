import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL!;

function createDb() {
  if (process.env.NODE_ENV === 'development') {
    const client = postgres(DATABASE_URL);
    return drizzle(client, { schema });
  }
  const client = neon(DATABASE_URL);
  return drizzleNeon(client, { schema });
}

export const db = createDb();
