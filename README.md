# Bespoke Vows

Online wedding invitation builder for Ukrainian-speaking couples. Form-based editor with live preview; share via public URL.

- Web (`apps/web`) — React 18 + Vite + Tailwind + shadcn/ui
- API (`apps/api`) — Hono + Drizzle + PostgreSQL
- Monorepo: npm workspaces + Turborepo

See [`CLAUDE.md`](./CLAUDE.md) for architecture, [`DEPLOY.md`](./DEPLOY.md) for Vercel + Neon deployment.

## Prerequisites

- Node.js 20+, npm 10+
- Docker Desktop (local PostgreSQL)

## Run locally

```bash
npm install

# one-time: create API env
cp apps/api/.env.example apps/api/.env
# generate a JWT secret and paste it into apps/api/.env
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# start Postgres + run migrations
npm run db:setup --workspace=apps/api

# (optional) seed dev@test.com with sample invitations
npm run db:seed --workspace=apps/api

# start web + API
npm run dev
```

- Web → <http://localhost:8080>
- API → <http://localhost:3001>

Individually: `npm run dev:web`, `npm run dev:api`.

### Dev login (no Google OAuth)

```bash
curl -c cookies.txt -X POST http://localhost:3001/auth/dev-login \
  -H 'Content-Type: application/json' \
  -d '{"email": "dev@test.com", "name": "Dev User"}'
```

Only enabled when `NODE_ENV=development`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start web + API |
| `npm run build` | Build all workspaces |
| `npm run db:setup --workspace=apps/api` | Start Docker Postgres + migrate |
| `npm run db:migrate --workspace=apps/api` | Apply pending migrations |
| `npm run db:generate --workspace=apps/api` | Generate migration from schema changes |
| `npm run db:studio --workspace=apps/api` | Open Drizzle Studio |
| `docker compose down -v` | Stop Postgres and wipe data |

## Secrets

`.env` files are gitignored — never commit them. Production secrets live in Vercel env vars (see [`DEPLOY.md`](./DEPLOY.md)).
