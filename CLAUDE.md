# Wedding Website — Bespoke Vows

## Overview

Bespoke Vows is an online wedding invitation builder that lets couples create a personalized, beautifully designed digital invitation using a simple form-based editor with a live preview. Users customize their invitation with couple names, wedding date and venue, a love story with photos, a color palette, and a detailed event timeline — all rendered in real-time on an elegant scrollable invitation page. The product targets Ukrainian-speaking couples and is sold as a one-time payment ($9.99/invitation) via Plata by Mono, unlocking 1 year of active sharing.

---

## Tech Stack

### Frontend (`apps/web`)

| Layer | Tech |
| --- | --- |
| Framework | React 18 + TypeScript + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| State | React Context + TanStack Query |
| Auth | Google OAuth via backend session |

### Backend (`apps/api`)

| Layer | Tech |
| --- | --- |
| Runtime | Node.js + TypeScript |
| Framework | Hono (serverless-compatible, Vercel-native) |
| Database | PostgreSQL via **Neon** (serverless, HTTP queries) |
| ORM | Drizzle ORM (TypeScript-first, no codegen bloat) |
| Auth | Google OAuth 2.0 + JWT sessions |
| File storage | Vercel Blob (for love story images) |
| Payments | Plata by Mono |

### Shared (`packages/shared`)

- TypeScript types for invitation config, API contracts
- Shared between frontend and backend — single source of truth

### Infrastructure

| Concern | Tool |
| --- | --- |
| Hosting (frontend) | Vercel |
| Hosting (backend API) | Vercel Serverless Functions |
| Database | Neon (serverless PostgreSQL) |
| CI/CD | Vercel GitHub integration — auto-deploy on push to `main` |
| Env config | Vercel Environment Variables per project |

---

## Repo Structure: Monorepo

```
bespoke-vows/                  ← single GitHub repo
├── apps/
│   ├── web/                   ← Vite React app (existing code moves here)
│   └── api/                   ← Hono Node.js backend
├── packages/
│   └── shared/                ← shared TypeScript types
├── package.json               ← workspace root (npm workspaces or pnpm)
└── turbo.json                 ← optional: Turborepo for build caching
```

**Vercel setup — 2 projects, 1 repo:**

| Vercel Project | Root Directory | Build command | Output |
| --- | --- | --- | --- |
| `bespoke-vows-web` | `apps/web` | `vite build` | `dist/` |
| `bespoke-vows-api` | `apps/api` | `tsc` | Vercel auto-detects Hono handler |

---

## Architecture

- **Auth** — Google OAuth only ("Continue with Google")
- **Invitation = JSON config** — builder produces a config object; backend stores it; frontend fetches + renders it
- **Guest view** — public URL `/i/:id`; frontend fetches config from backend and renders; no login required
- **Language** — invitation content Ukrainian only in v1
- **Templates** — minimum 3 distinct visual designs; template ID stored in config

### Invitation Config Shape

```json
{
  "id": "uuid",
  "userId": "uuid",
  "templateId": "classic|modern|floral",
  "status": "draft|active|expired",
  "paidUntil": "2027-04-21T00:00:00Z",
  "data": {
    "hisName": "Іван",
    "herName": "Марія",
    "weddingDate": "15 червня 2026",
    "weddingPlace": "Київ",
    "loveStory": { "moment1": "", "moment2": "", "image1Url": "", "image2Url": "" },
    "events": [],
    "weddingColors": [],
    "templateColors": { "primary": "", "text": "", "accent": "" }
  }
}
```

---

## Pricing Model

| Tier | Price | Invitation active for |
| --- | --- | --- |
| Free | $0 | 1 day after publish |
| Paid | $9.99 one-time | 1 year from payment date |

- Free users build and preview unlimited; publishing starts 1-day countdown
- Pay $9.99 → extends to 1 year
- Expired invitations show "This invitation is no longer active" page
