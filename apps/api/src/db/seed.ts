import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, invitations } from './schema.js';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const DEV_EMAIL = 'dev@test.com';
const DEV_GOOGLE_ID = `dev:${DEV_EMAIL}`;

const [user] = await db
  .insert(users)
  .values({ googleId: DEV_GOOGLE_ID, email: DEV_EMAIL, name: 'Dev User', avatarUrl: null })
  .onConflictDoUpdate({ target: users.googleId, set: { name: 'Dev User' } })
  .returning();

console.log(`User: ${user.email} (${user.id})`);

const existing = await db.select().from(invitations).where(eq(invitations.userId, user.id));
if (existing.length > 0) {
  console.log(`Skipping invitations — ${existing.length} already exist for this user`);
  await client.end();
  process.exit(0);
}

const [draft] = await db
  .insert(invitations)
  .values({
    userId: user.id,
    templateId: 'classic',
    config: {
      hisName: 'Іван',
      herName: 'Марія',
      weddingDate: '15 червня 2026',
      weddingPlace: 'Київ',
      loveStory: { moment1: '', moment2: '', image1Url: '', image2Url: '' },
      events: [],
      weddingColors: [],
      templateColors: { primary: '#f5e6d3', text: '#2c2c2c', accent: '#b8860b' },
    },
  })
  .returning();

const now = new Date();
const [published] = await db
  .insert(invitations)
  .values({
    userId: user.id,
    templateId: 'modern',
    publishedAt: now,
    lastPublishedAt: now,
    freeActiveDaysUsed: 1,
    config: {
      hisName: 'Олексій',
      herName: 'Наталія',
      weddingDate: '20 вересня 2026',
      weddingPlace: 'Львів',
      loveStory: { moment1: 'Ми познайомились у 2020', moment2: 'Він запропонував у 2025', image1Url: '', image2Url: '' },
      events: [{ id: '1', title: 'Церемонія', time: '14:00', location: 'Собор Св. Юра', description: '' }],
      weddingColors: ['#e8d5c4', '#8b7355'],
      templateColors: { primary: '#1a1a2e', text: '#eaeaea', accent: '#e94560' },
    },
  })
  .returning();

console.log(`Draft invitation:     ${draft.id} (classic)`);
console.log(`Published invitation: ${published.id} (modern, active_free)`);
console.log('\nDone. Log in via:');
console.log(`  POST http://localhost:3001/auth/dev-login`);
console.log(`  Body: { "email": "${DEV_EMAIL}", "name": "Dev User" }`);

await client.end();
