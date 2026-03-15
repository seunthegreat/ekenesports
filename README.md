# Ekene Sport

Premium sportswear e-commerce platform. **Ekene** means "praise" in Igbo — because every victory deserves celebration.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **i18n:** next-intl (English, German)
- **Icons:** Lucide React
- **Package Manager:** pnpm (workspaces)

## Monorepo Structure

```
ekenesports/
├── apps/
│   ├── web/          # Next.js storefront (Phase 1)
│   └── api/          # Backend API (Phase 2)
├── packages/         # Shared packages
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/[locale]` | Home — hero, shop by sport, featured products, categories |
| `/[locale]/products` | Product listing with faceted search & filters |
| `/[locale]/products/[slug]` | Product detail — gallery, variants, add to cart |
| `/[locale]/sports/[slug]` | Products filtered by sport |
| `/[locale]/categories/[...slug]` | Nested category pages |
| `/[locale]/search` | Search results |
| `/[locale]/cart` | Shopping cart |
| `/[locale]/checkout` | Multi-step checkout (Information → Shipping → Payment → Review) |
| `/[locale]/checkout/success` | Order confirmation with DHL waybill |
| `/[locale]/orders/track` | Order tracking with DHL timeline |

## Features

### Storefront
- 7 sport categories (Football, Basketball, Running, Gym & Training, Tennis, Swimming, Accessories)
- Faceted search — filter by sport, category, gender, size, color, brand, price range
- Product variants with size/color selection and stock tracking
- Responsive design (mobile-first)

### Checkout & Shipping
- Multi-step checkout with address form, shipping selection, and payment
- DHL shipping integration (mock) with region-based rates:
  - **Domestic (DE):** DHL Paket, DHL Express
  - **EU:** DHL Europaket, DHL Express
  - **International (50+ countries):** DHL Paket International, DHL Express Worldwide
- Free shipping thresholds (€50 domestic, €100 EU)
- Order tracking with status timeline

### Internationalization
- English (default) and German
- Locale-prefixed routing (`/en/...`, `/de/...`)

## Project Architecture

### State Management (Zustand)
- **Cart Store** — persisted to localStorage, manages items/quantities
- **Checkout Store** — ephemeral, manages multi-step checkout flow
- **Order Store** — persisted, stores completed orders for tracking

### Data Layer
Phase 1 uses mock data generated in `src/lib/data.ts`. The architecture is designed to swap in a real backend (PostgreSQL + Prisma) in Phase 2 without changing component interfaces.

### Branding
- **Primary:** Deep Green `#0A6847`
- **Secondary:** Gold `#F5A623`
- **Fonts:** Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (prices)

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Storefront — catalog, search, cart, checkout, DHL shipping | In Progress |
| 2 | Admin dashboard — product management, order fulfillment, real database | Planned |
| 3 | Live integrations — Stripe payments, DHL API, Cloudinary images | Planned |

## License

Private — All rights reserved.
