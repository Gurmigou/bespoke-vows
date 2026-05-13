# Deployment

## Secrets — where they live

| Where | Contents | Committed? |
|---|---|---|
| `apps/api/.env` | Local dev: Docker Postgres URL, dev JWT secret | No (gitignored) |
| `apps/api/.env.production.local` | Reference copy of prod Neon URL + prod JWT secret, for ad-hoc admin (`db:migrate` against prod) | No (gitignored — `.env.*` rule) |
| Vercel env vars (per project, per environment) | Source of truth for prod/preview runtime | No (lives in Vercel) |
| `apps/api/.env.example` | Documents required keys, no real values | Yes |

If a real secret is ever staged, `git rm --cached` it and rotate the credential. `git check-ignore -v apps/api/.env` should print a gitignore rule for every env file.

## Vercel — two projects, one repo

| Project | Root Directory | Framework preset |
|---|---|---|
| `bespoke-vows-web` | `apps/web` | Vite |
| `bespoke-vows-api` | `apps/api` | Other (Node.js) |

The API project uses `apps/api/vercel.json` to rewrite every path to `/api`, which Vercel serves from `apps/api/src/api/index.ts` (`export default app.fetch`).

## Set production env vars

Install the CLI once: `npm i -g vercel && vercel login`. Link each project from its root:

```bash
cd apps/api && vercel link        # pick bespoke-vows-api
cd ../web  && vercel link         # pick bespoke-vows-web
```

Then push the API secrets. The values live in `apps/api/.env.production.local`; do not paste them into chat or commit messages.

```bash
cd apps/api

vercel env add DATABASE_URL production       # paste Neon connection string
vercel env add JWT_SECRET production         # paste long random string
vercel env add WEB_ORIGIN production         # https://<your-web-domain>
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_REDIRECT_URI production
vercel env add BLOB_READ_WRITE_TOKEN production
vercel env add MONO_WEBHOOK_SECRET production
```

Repeat with `preview` for preview deployments (typically a separate Neon branch).

For the web project, set `VITE_API_URL=https://<api-domain>` so the frontend knows where to hit the API.

## Deploy

```bash
git push origin main      # Vercel auto-deploys both projects
```

Or manually: `vercel --prod` from `apps/api` / `apps/web`.

## Run migrations against Neon

`apps/api/src/db/index.ts` switches drivers by `NODE_ENV`: `postgres-js` for dev/test, `@neondatabase/serverless` HTTP for everything else. To migrate prod from your laptop:

```bash
cd apps/api
set -a; . .env.production.local; set +a
npm run db:migrate
```

Migrations also run automatically on the first request post-deploy if you wire `migrate.ts` into your startup — currently it's a manual step.

## Rotating the Neon password

Neon dashboard → Roles → `neondb_owner` → Reset password. Update:
1. `apps/api/.env.production.local`
2. `vercel env rm DATABASE_URL production && vercel env add DATABASE_URL production`
3. Redeploy: `vercel --prod`
