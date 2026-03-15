# Ekene Sport — Project Guide

## Overview
Sportswear e-commerce storefront. "Ekene" means "praise" in Igbo. Marketed in Germany — bilingual (EN/DE).

## Monorepo Structure
```
apps/
  web/          → Next.js 16 storefront (App Router, Turbopack)
  api/          → Backend placeholder (Phase 2)
```

## Tech Stack
- **Framework**: Next.js 16, App Router, TypeScript
- **Styling**: Tailwind CSS 4 (no config file — uses `@theme` in globals.css)
- **i18n**: next-intl (locale in URL: `/en/...`, `/de/...`)
- **Cart**: Zustand + localStorage (`cart-store.ts`)
- **Checkout**: Multi-step with Zustand (`checkout-store.ts`)
- **Orders**: Zustand + localStorage (`order-store.ts`)
- **Data**: All dummy data generated in `data.ts` (no database yet)
- **Package manager**: pnpm (workspace root)

## Key Directories (all under `apps/web/src/`)

### Data & State
- `lib/data.ts` — Product/category/sport generation (612 products, 11K+ SKUs), query functions (filter, search, facets)
- `lib/types.ts` — All TypeScript interfaces (Product, Variant, Cart, Order, Shipping, etc.)
- `lib/utils.ts` — `cn()`, `formatPrice()`, `slugify()`
- `lib/cart-store.ts` — Zustand cart with localStorage persistence
- `lib/checkout-store.ts` — Multi-step checkout state
- `lib/order-store.ts` — Order creation and lookup
- `lib/dhl-shipping.ts` — Shipping rates and country list

### i18n
- `i18n/routing.ts` — Locale config (en, de), exports `Link`, `useRouter`, etc.
- `i18n/request.ts` — Server-side locale resolution
- `messages/en.json` — English translations
- `messages/de.json` — German translations
- `middleware.ts` — Locale detection middleware

### Components
- `components/ui/` — Primitives: Button, Badge, Sheet, Input, Select, Stepper, RadioCard
- `components/layout/` — Header, Footer, PromoBar, MobileNav, LanguageSwitcher, SearchDialog
- `components/home/` — HeroBanner (video bg), SportSelector, FeaturedProducts, CategoryGrid, NewArrivals
- `components/product/` — ProductCard, ProductGrid, ProductGallery, VariantSelector, FacetSidebar, ProductListing
- `components/cart/` — CartDrawer
- `components/checkout/` — AddressForm, ShippingSelector, PaymentForm, OrderReview, OrderSummarySidebar

### Routes (`app/[locale]/`)
- `page.tsx` — Homepage
- `products/page.tsx` — Catalog with faceted filters
- `products/[slug]/page.tsx` — Product detail page
- `sports/[slug]/page.tsx` — Sport-filtered listing
- `categories/[...slug]/page.tsx` — Category-filtered listing
- `search/page.tsx` — Search results
- `cart/page.tsx` — Full cart page
- `checkout/page.tsx` — Multi-step checkout
- `checkout/success/page.tsx` — Order confirmation
- `orders/track/page.tsx` — Order tracking

## Branding
| Role | Hex | Tailwind class |
|------|-----|---------------|
| Primary (Deep Green) | `#0A6847` | `text-primary`, `bg-primary` |
| Primary Light | `#14B87A` | `text-primary-light`, `bg-primary-light` |
| Secondary (Gold) | `#F5A623` | `text-secondary`, `bg-secondary` |
| Neutral Dark | `#1A1A2E` | `text-neutral-dark`, `bg-neutral-dark` |
| Neutral Light | `#F8F9FA` | `bg-neutral-light` |
| Error | `#DC2626` | `text-error`, `bg-error` |

Fonts: `font-heading` (Plus Jakarta Sans), `font-body` (Inter), `font-mono` (JetBrains Mono)

## Design Conventions
- Product cards/images use **sharp corners** (no rounded)
- Hero banner uses **rounded-2xl**, constrained to `max-w-7xl`
- UI primitives (buttons, badges, inputs) keep subtle rounding
- Mobile-first, 375px baseline

## Commands
```bash
cd apps/web
pnpm dev          # Dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint
```

## Adding translations
Add keys to both `messages/en.json` and `messages/de.json`. Use `useTranslations("namespace")` in components.

## Phase Roadmap
- **Phase 1** (current): Storefront with dummy data
- **Phase 2**: Backend API (`apps/api/`) — PostgreSQL, Prisma, Stripe
- **Phase 3**: DHL shipping integration
