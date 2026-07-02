# TaxCode

Web-first tax filing application built with Next.js, Fastify, and Rust.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind CSS |
| Backend | Fastify + Drizzle ORM + BullMQ |
| Tax Engine | Rust (Axum) |
| Database | PostgreSQL |
| Queue | Redis + BullMQ |
| Package Manager | pnpm |
| Monorepo | Turborepo |

## Repository Structure

```
taxcode/
├── apps/
│   ├── web/           Next.js frontend (App Router)
│   ├── api/           Fastify backend (modular monolith)
│   └── tax-engine/    Rust tax calculation engine
├── packages/
│   └── shared-types/  Shared Zod schemas & TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Rust 1.75+ (for tax-engine)

## Local Development Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

**Database connection:**
| Service | Host | Port | User | Password | Database |
|---|---|---|---|---|---|
| PostgreSQL | `localhost` | `5432` | `taxcode` | `taxcode_local` | `taxcode` |
| Redis | `localhost` | `6379` | — | — | — |

### 3. Configure environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your local values if needed.

### 4. Run all apps in parallel

```bash
pnpm dev
```

Or run individually:

```bash
# Frontend (http://localhost:3000)
pnpm --filter @taxcode/web dev

# Backend (http://localhost:3001)
pnpm --filter @taxcode/api dev

# Rust engine (http://localhost:8080)
cd apps/tax-engine && cargo run
```

## Turborepo Tasks

| Command | Description |
|---|---|
| `pnpm build` | Build all apps |
| `pnpm dev` | Run all apps in dev mode |
| `pnpm lint` | Lint all apps |
| `pnpm typecheck` | Type-check all apps |
| `pnpm db:studio` | Open Drizzle Studio |

## Module Overview

### apps/web
Next.js frontend with App Router. Routes:
- `/` — Landing
- `/dashboard` — Filing overview
- `/filings` — Filing list and detail
- `/documents` — Document management
- `/settings` — Account settings

### apps/api
Fastify modular monolith. Modules:
- `auth` — Login, register, JWT
- `users` — User management
- `filings` — Filing lifecycle
- `documents` — Document metadata
- `tax-engine` — Gateway to Rust engine
- `jobs` — BullMQ job management
- `health` — Health checks

### apps/tax-engine
Rust engine providing:
- `POST /calculate` — Tax calculation
- `POST /validate` — Filing validation

### packages/shared-types
Shared Zod schemas and TypeScript types used by both web and api.

## License

Private
