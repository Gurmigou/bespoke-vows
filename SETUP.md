# Local Development Setup

## Prerequisites

- Node.js 20+
- Docker Desktop (running)
- npm 10+

## First-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`. Required for local dev:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | already set for Docker |
| `JWT_SECRET` | At least 32 random chars | fill in any long string |
| `WEB_ORIGIN` | Frontend URL for CORS | `http://localhost:8080` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | optional (use dev-login instead) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | optional |
| `GOOGLE_REDIRECT_URI` | OAuth redirect | `http://localhost:3001/auth/google/callback` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | optional (image upload only) |
| `MONO_WEBHOOK_SECRET` | Plata by Mono webhook secret | optional (payments only) |

### 3. Start database and run migrations

```bash
npm run db:setup --workspace=apps/api
```

This starts PostgreSQL in Docker, waits until healthy, then runs all migrations.

### 4. (Optional) Seed test data

```bash
npm run db:seed --workspace=apps/api
```

Inserts a `dev@test.com` user with 2 sample invitations.

### 5. Start dev servers

```bash
npm run dev
```

Both the API (`http://localhost:3001`) and web app (`http://localhost:8080`) start via Turborepo.

To run individually:
```bash
npm run dev:api   # API only
npm run dev:web   # Web only
```

## Authenticating locally (no Google OAuth needed)

Use the dev-login endpoint to get a session without setting up Google OAuth:

```bash
curl -c cookies.txt -X POST http://localhost:3001/auth/dev-login \
  -H 'Content-Type: application/json' \
  -d '{"email": "dev@test.com", "name": "Dev User"}'
```

The response sets a `session` cookie valid for 30 days. Use `cookies.txt` in subsequent requests:

```bash
curl -b cookies.txt http://localhost:3001/invitations
```

> This endpoint is only available when `NODE_ENV=development`.

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run db:setup --workspace=apps/api` | Start DB + run migrations |
| `npm run db:seed --workspace=apps/api` | Insert test data |
| `npm run db:migrate --workspace=apps/api` | Run pending migrations |
| `npm run db:generate --workspace=apps/api` | Generate migration from schema changes |
| `npm run db:studio --workspace=apps/api` | Open Drizzle Studio (DB browser) |
| `docker compose down` | Stop PostgreSQL |
| `docker compose down -v` | Stop PostgreSQL and delete data |

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/dev-login` | — | Dev-only login bypass |
| `GET` | `/auth/google` | — | Start Google OAuth flow |
| `POST` | `/auth/logout` | — | Clear session |
| `GET` | `/auth/me` | cookie | Current user |
| `POST` | `/invitations` | cookie | Create invitation |
| `GET` | `/invitations` | cookie | List own invitations |
| `GET` | `/invitations/:id` | cookie | Get single invitation |
| `PATCH` | `/invitations/:id` | cookie | Update config |
| `DELETE` | `/invitations/:id` | cookie | Delete invitation |
| `POST` | `/invitations/:id/publish` | cookie | Publish (starts active window) |
| `POST` | `/invitations/:id/pay` | webhook | Plata payment webhook |
| `GET` | `/i/:id` | — | Public guest view |
| `POST` | `/upload` | cookie | Upload image (Vercel Blob) |
| `GET` | `/api/health` | — | Health check |
