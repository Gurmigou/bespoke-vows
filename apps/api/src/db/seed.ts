import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { users, templates, invitations, payments } from './schema.js';
import { classicTemplate } from '../../../web/src/components/invitation/templates/definitions/classic.js';
import { modernTemplate } from '../../../web/src/components/invitation/templates/definitions/modern.js';
import { floralTemplate } from '../../../web/src/components/invitation/templates/definitions/floral.js';
import { royalTemplate } from '../../../web/src/components/invitation/templates/definitions/royal.js';
import type { InvitationData, TemplateDefinition } from '@bespoke-vows/shared';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const DEV_EMAIL = 'dev@test.com';
const DEV_PASSWORD = 'devdevdev';

const blankConfig = (defaults: TemplateDefinition['defaultColors']): InvitationData => ({
  hisName: '',
  herName: '',
  weddingDate: '',
  weddingPlace: '',
  venue: { label: '', mapsUrl: '' },
  loveStory: { moments: [] },
  events: [],
  weddingColors: [],
  templateColors: { ...defaults },
});

async function main() {
  console.log('Wiping & seeding...');
  await db.delete(payments);
  await db.delete(invitations);
  await db.delete(templates);
  await db.delete(users);

  const defs: TemplateDefinition[] = [classicTemplate, modernTemplate, floralTemplate, royalTemplate];

  for (const def of defs) {
    await db.insert(templates).values({
      slug: def.id,
      name: def.name,
      description: def.description,
      definition: def,
      defaultData: blankConfig(def.defaultColors),
    });
  }

  const allTemplates = await db.select().from(templates);
  console.log(`Templates seeded: ${allTemplates.map((t) => t.slug).join(', ')}`);

  const passwordHash = await hashPassword(DEV_PASSWORD);
  const [user] = await db
    .insert(users)
    .values({ email: DEV_EMAIL, passwordHash })
    .returning();
  console.log(`User: ${user.email} / ${DEV_PASSWORD}`);

  const classic = allTemplates.find((t) => t.slug === 'classic')!;
  const [draft] = await db
    .insert(invitations)
    .values({
      userId: user.id,
      templateId: classic.id,
      config: {
        ...(classic.defaultData as InvitationData),
        hisName: 'Іван',
        herName: 'Марія',
        weddingDate: '15 червня 2026',
        weddingPlace: 'Київ',
      },
    })
    .returning();
  console.log(`Draft invitation: ${draft.id} (classic)`);

  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
