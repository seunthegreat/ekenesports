# Deployment

Infrastructure, CI/CD, and environment configuration for the Ekene Sport platform.

---

## Infrastructure Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CDN (Vercel Edge / Cloudflare)            │
│                    Static assets, image optimization             │
└─────────────┬──────────────────────────────────┬─────────────────┘
              │                                  │
              ▼                                  ▼
┌──────────────────────┐           ┌──────────────────────────┐
│   Storefront (web)   │           │    Admin Portal (admin)  │
│   Vercel             │           │    Vercel                │
│   Next.js SSR + SSG  │           │    Next.js / Vite SPA    │
└──────────┬───────────┘           └──────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Backend API (api)                             │
│                     Railway / Render / Fly.io                    │
│                     Node.js + tRPC + Express                     │
└──────┬──────────────────┬──────────────────┬─────────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌──────────────────┐
│ PostgreSQL  │   │   Redis     │   │  External APIs   │
│ (Railway /  │   │ (Upstash /  │   │  Stripe, DHL,    │
│  Neon /     │   │  Railway)   │   │  Cloudinary,     │
│  Supabase)  │   │             │   │  Resend          │
└─────────────┘   └─────────────┘   └──────────────────┘
```

## Platform Recommendations

| Service | Option A (Simple) | Option B (Scalable) |
|---------|-------------------|---------------------|
| Storefront | Vercel (free tier) | Vercel Pro |
| Admin Portal | Vercel | Vercel |
| Backend API | Railway | Fly.io (multi-region) |
| PostgreSQL | Railway / Neon | Supabase / AWS RDS |
| Redis | Upstash (serverless) | Railway Redis |
| Domain | Cloudflare DNS | Cloudflare DNS |

**Recommended starting stack:** Vercel (web + admin) + Railway (api + PostgreSQL + Redis). Simple, affordable, good DX.

---

## Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Local | Any | `localhost:3000` / `localhost:4000` | Development |
| Preview | PR branches | `pr-{n}.ekenesport.vercel.app` | PR review |
| Staging | `staging` | `staging.ekenesport.com` | QA, demo |
| Production | `main` | `ekenesport.com` | Live |

### Environment Variables

**Storefront (`apps/web`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000   # tRPC endpoint
NEXT_PUBLIC_STRIPE_KEY=pk_test_...          # Stripe publishable key
```

**Backend API (`apps/api`):**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/ekene
REDIS_URL=redis://host:6379

# Auth
SESSION_SECRET=random-64-char-string

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# DHL
DHL_API_KEY=...
DHL_API_SECRET=...
DHL_ACCOUNT_NUMBER=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=ekene-sport
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=orders@ekenesport.com

# App
NODE_ENV=production
API_URL=https://api.ekenesport.com
WEB_URL=https://ekenesport.com
ADMIN_URL=https://admin.ekenesport.com
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    - pnpm install --frozen-lockfile
    - pnpm lint
    - pnpm tsc --noEmit

  test:
    - Start PostgreSQL service container
    - pnpm prisma migrate deploy
    - pnpm test

  build:
    - pnpm build
    # Vercel auto-deploys on push (web + admin)

  deploy-api:
    if: branch == main || branch == staging
    - Deploy to Railway via CLI
    - Run prisma migrate deploy
    - Health check
```

### Deployment Steps

#### Storefront + Admin (Vercel)
1. Push to `main` → Vercel auto-builds and deploys
2. PR → Vercel creates preview deployment
3. Zero-downtime (atomic deploys)

#### Backend API (Railway)
1. Push to `main` → Railway auto-deploys
2. Pre-deploy: `prisma migrate deploy` (via Railway deploy hook)
3. Health check endpoint: `GET /health`
4. Rollback: Railway one-click rollback to previous deployment

#### Database Migrations
1. Migrations created locally: `prisma migrate dev`
2. Committed to git as migration files
3. Applied in CI: `prisma migrate deploy` (no interactive prompts)
4. Staging runs migrations first → verify → then production

---

## Domain & DNS

```
ekenesport.com          → Vercel (storefront)
admin.ekenesport.com    → Vercel (admin portal)
api.ekenesport.com      → Railway (backend API)
```

**DNS provider:** Cloudflare
- Proxy enabled for DDoS protection
- SSL: Full (strict) mode
- Cache: static assets only (API requests bypassed)

---

## Monitoring & Observability

### Application Monitoring

| Tool | Purpose | Coverage |
|------|---------|----------|
| Vercel Analytics | Web vitals, page performance | Storefront |
| Sentry | Error tracking, stack traces | All apps |
| Axiom / Logtail | Log aggregation, structured logs | API |

### Health Checks

**API health endpoint:** `GET /health`
```json
{
  "status": "ok",
  "version": "1.2.0",
  "database": "connected",
  "redis": "connected",
  "uptime": 86400
}
```

**Monitoring:**
- Uptime check every 1 minute (Better Uptime / UptimeRobot)
- Alert on: downtime, response time > 2s, error rate > 1%
- Notification: Slack + email

### Database Monitoring

- Connection pool usage
- Slow query log (queries > 500ms)
- Disk usage alerts
- Automated backups verified monthly

---

## Backup & Recovery

### Database Backups

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Automated snapshot | Daily | 30 days | Platform managed |
| Point-in-time recovery | Continuous (WAL) | 7 days | Platform managed |
| Manual export | Weekly | 90 days | S3 / object storage |

### Recovery Plan

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| Application crash | < 5 min | 0 | Auto-restart (platform managed) |
| Bad deployment | < 10 min | 0 | Rollback to previous version |
| Database corruption | < 1 hour | < 1 hour | Restore from point-in-time backup |
| Complete outage | < 4 hours | < 24 hours | Restore from daily snapshot + replay WAL |

---

## Scaling Considerations

### Phase 1 (Launch)
- Single region deployment (EU - Frankfurt)
- Vercel free/hobby tier handles storefront traffic
- Railway starter plan for API
- Sufficient for ~1,000 daily visitors

### Phase 2 (Growth)
- Vercel Pro for faster builds and more bandwidth
- Railway Pro with auto-scaling (2-4 instances)
- Redis caching for product queries (reduce DB load)
- Cloudinary CDN for images
- Sufficient for ~10,000 daily visitors

### Phase 3 (Scale)
- Multi-region API deployment (EU + US)
- Read replicas for PostgreSQL
- Meilisearch for product search (offload from PostgreSQL)
- CDN for API responses (product listings)
- Queue system (BullMQ) for background jobs (emails, DHL polling)
- Sufficient for ~100,000+ daily visitors

---

## Cost Estimate (Phase 1)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Vercel (web + admin) | Hobby / Pro | $0–$20 |
| Railway (API + PostgreSQL + Redis) | Starter | ~$5–$15 |
| Cloudflare (DNS) | Free | $0 |
| Stripe | Pay per transaction (2.9% + €0.25) | Variable |
| Cloudinary | Free tier (25 credits) | $0 |
| Resend | Free tier (3,000 emails/month) | $0 |
| Sentry | Free tier | $0 |
| **Total fixed** | | **~$5–$35/month** |
