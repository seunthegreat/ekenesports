# Architecture

System design and service boundaries for the Ekene Sport platform.

## Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                          Clients                                 │
│    Browser (Next.js SSR/CSR)  ·  Admin Portal (React SPA)       │
└────────────────┬─────────────────────────────┬───────────────────┘
                 │                             │
                 ▼                             ▼
┌────────────────────────────┐  ┌──────────────────────────────────┐
│       Storefront API       │  │         Admin API                │
│    (Next.js API Routes)    │  │    (Express or tRPC server)      │
│                            │  │                                  │
│  • Product queries         │  │  • Product CRUD                  │
│  • Cart/checkout           │  │  • Order management              │
│  • Order placement         │  │  • Customer management           │
│  • Tracking lookup         │  │  • Analytics/dashboard           │
└──────────┬─────────────────┘  └──────────┬───────────────────────┘
           │                               │
           ▼                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Shared Services                           │
│                                                                  │
│   ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│   │  PostgreSQL  │  │  Redis       │  │  Object Storage    │     │
│   │  (Prisma)    │  │  (Sessions,  │  │  (Cloudinary /     │     │
│   │              │  │   Cache)     │  │   S3)              │     │
│   └─────────────┘  └──────────────┘  └────────────────────┘     │
│                                                                  │
│   ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│   │  Stripe      │  │  DHL API     │  │  Email Service     │     │
│   │  (Payments)  │  │  (Shipping)  │  │  (Resend/SES)      │     │
│   └─────────────┘  └──────────────┘  └────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

## Service Boundaries

### Storefront (`apps/web`)

The existing Next.js application. Currently uses mock data in `lib/data.ts`. The backend transition replaces data functions with API calls — component interfaces stay the same.

**Responsibilities:**
- Server-side rendering for SEO (product pages, category pages)
- Client-side state for cart, checkout flow
- Stripe Checkout redirect (no payment form on our server)
- i18n routing (en, de)

**What changes in Phase 2:**
- `getProducts()`, `filterProducts()`, `getProductBySlug()` → API calls
- `useCartStore` syncs with server-side cart for logged-in users
- `useOrderStore` → API call to fetch orders by customer

### Backend API (`apps/api`)

New service handling all data operations.

**Tech stack:**
- Runtime: Node.js
- Framework: Express + tRPC (type-safe API layer)
- ORM: Prisma (PostgreSQL)
- Auth: Better Auth or Lucia (session-based)
- Validation: Zod (shared with frontend types)

**Why tRPC over REST:**
- End-to-end type safety with the Next.js frontend
- No API schema drift — types are shared at build time
- Still supports REST endpoints for webhooks (Stripe, DHL)

### Admin Portal

Separate React SPA or Next.js app under `apps/admin`.

**Tech stack:**
- Framework: Next.js (App Router) or Vite + React
- UI: Same Tailwind theme as storefront for brand consistency
- Data: tRPC client connected to the same backend API
- Auth: Admin-only login, no customer registration

## Data Flow

### Product Browse
```
Browser → Next.js SSR → tRPC query → Prisma → PostgreSQL
                                         ↓
                                    Redis cache (5m TTL)
```

### Checkout
```
Browser → Checkout Store (Zustand)
       → POST /api/orders (create order, reserve stock)
       → Stripe Checkout Session (redirect)
       → Stripe webhook → confirm order, adjust stock
       → DHL API → create shipment, get waybill
       → Email → order confirmation
```

### Admin Order Management
```
Admin Portal → tRPC mutation → Prisma → PostgreSQL
                                   ↓
                             DHL API (ship / cancel)
                                   ↓
                             Email (status update to customer)
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | PostgreSQL | Relational data (orders, products, variants), strong with Prisma |
| ORM | Prisma | Type-safe, excellent migration tooling, shared with frontend types |
| API protocol | tRPC | Type-safe end-to-end with Next.js, no code generation needed |
| Auth | Session-based (httpOnly cookies) | More secure than JWT for web apps, simpler token management |
| Payments | Stripe Checkout | PCI compliant out of the box, no card data touches our server |
| Image storage | Cloudinary | On-the-fly transforms (resize, crop), CDN built in |
| Cache | Redis | Session storage + query cache for product listings |
| Search | PostgreSQL full-text (Phase 2), Meilisearch (Phase 3) | Start simple, upgrade when needed |
| Email | Resend | Developer-friendly, React Email templates, good deliverability |

## Monorepo Package Structure

```
ekenesports/
├── apps/
│   ├── web/            # Next.js storefront
│   ├── api/            # Backend API server
│   └── admin/          # Admin portal
├── packages/
│   ├── db/             # Prisma schema, client, migrations
│   ├── shared/         # Shared types, validation schemas (Zod)
│   └── email/          # Email templates (React Email)
├── pnpm-workspace.yaml
└── package.json
```

**Shared package (`packages/shared`)** exports:
- Zod schemas for all entities (Product, Order, etc.)
- TypeScript types inferred from Zod schemas
- Constants (shipping zones, order statuses, etc.)
- Utility functions (formatPrice, slugify)

This ensures the frontend, backend, and admin portal all share the same type definitions and validation logic.

## Environment Strategy

| Environment | Database | Stripe | DHL | Purpose |
|-------------|----------|--------|-----|---------|
| Local | PostgreSQL (Docker) | Test keys | Mock | Development |
| Staging | Managed PostgreSQL | Test keys | Sandbox | QA, demo |
| Production | Managed PostgreSQL | Live keys | Live | Customer-facing |
