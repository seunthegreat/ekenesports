# Ekene Sport — Web App Reverse Engineering

> **Scope:** `apps/web` — the public-facing Next.js 15 storefront
> **Generated:** March 22, 2026

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Internationalisation | `next-intl` |
| State Management | Zustand (`cart-store`, `checkout-store`, `order-store`) |
| Icons | `lucide-react` |
| Image Hosting | Unsplash (dev), Cloudinary (production) |
| Font Delivery | Google Fonts (preconnect + stylesheet link in `<head>`) |
| Variant Styling | `class-variance-authority` (CVA) |
| Shipping | DHL integration (`lib/dhl-shipping.ts`) |
| Payment | Stripe (`PaymentInfo.method = "stripe"`) |

---

## 2. Folder Structure

```
apps/web/
├── next.config.ts            # Next.js config + next-intl plugin
├── postcss.config.mjs        # PostCSS (Tailwind)
├── tsconfig.json
├── package.json
├── public/
│   ├── logo.svg
│   └── hero-video.mp4        # Hero section background video
└── src/
    ├── app/
    │   ├── globals.css       # Design tokens (colors + fonts)
    │   ├── layout.tsx        # Root layout (redirect shim)
    │   └── [locale]/         # i18n-scoped layout + routes
    │       ├── layout.tsx    # Shell: PromoBar + Header + main + Footer
    │       ├── page.tsx      # Home page
    │       ├── cart/
    │       ├── categories/
    │       │   └── [...slug]/
    │       ├── checkout/
    │       ├── orders/
    │       ├── products/
    │       │   └── [slug]/
    │       ├── search/
    │       └── sports/
    ├── components/
    │   ├── layout/           # Global shell components
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── promo-bar.tsx
    │   │   ├── mobile-nav.tsx
    │   │   ├── language-switcher.tsx
    │   │   └── search-dialog.tsx
    │   ├── home/             # Homepage section components
    │   │   ├── hero-banner.tsx
    │   │   ├── sport-selector.tsx
    │   │   ├── featured-products.tsx
    │   │   ├── category-grid.tsx
    │   │   └── new-arrivals.tsx
    │   ├── product/          # Product listing & detail
    │   │   ├── product-card.tsx
    │   │   ├── product-grid.tsx
    │   │   ├── product-listing.tsx
    │   │   ├── product-gallery.tsx
    │   │   ├── facet-sidebar.tsx
    │   │   └── variant-selector.tsx
    │   ├── cart/
    │   │   └── cart-drawer.tsx
    │   ├── checkout/
    │   │   ├── address-form.tsx
    │   │   ├── payment-form.tsx
    │   │   ├── shipping-selector.tsx
    │   │   ├── order-summary-sidebar.tsx
    │   │   └── order-review.tsx
    │   └── ui/               # Primitive / reusable UI components
    │       ├── button.tsx
    │       ├── badge.tsx
    │       ├── input.tsx
    │       ├── select.tsx
    │       ├── sheet.tsx
    │       ├── stepper.tsx
    │       └── radio-card.tsx
    ├── i18n/
    │   ├── routing.ts        # Locale definitions
    │   └── request.ts        # next-intl server config
    ├── lib/
    │   ├── types.ts          # All TypeScript interfaces
    │   ├── data.ts           # Mock/seed data + filter logic (26 KB)
    │   ├── utils.ts          # formatPrice, cn helpers
    │   ├── cart-store.ts     # Zustand cart state
    │   ├── checkout-store.ts # Zustand checkout state
    │   ├── order-store.ts    # Zustand order state
    │   └── dhl-shipping.ts   # DHL rate fetch
    └── messages/
        ├── en.json           # English translations
        └── fr.json           # French translations (at least)
```

---

## 3. App Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `[locale]/page.tsx` | Homepage — 5 section components |
| `/products` | `[locale]/products/` | Product listing with facets |
| `/products/[slug]` | `[locale]/products/[slug]/` | Product detail page |
| `/categories/[...slug]` | `[locale]/categories/[...slug]/` | Category-filtered listing |
| `/sports` | `[locale]/sports/` | Sport-filtered listing |
| `/search` | `[locale]/search/` | Search results |
| `/cart` | `[locale]/cart/` | Cart page |
| `/checkout` | `[locale]/checkout/` | Multi-step checkout |
| `/orders` | `[locale]/orders/` | Order tracking |

> All routes are nested under `[locale]` for i18n — locale is read from the URL segment (e.g. `/en/products`, `/fr/products`).

---

## 4. Design System & Colors

### 4.1 CSS Custom Properties (`globals.css`)

```css
@theme {
  --color-primary:       #0A6847   /* Deep forest green — brand primary */
  --color-primary-light: #14B87A   /* Lighter green for hover states */
  --color-secondary:     #F5A623   /* Amber/gold — CTAs, ratings, badges */
  --color-neutral-dark:  #1A1A2E   /* Near-black — footer bg, body text */
  --color-neutral-light: #F8F9FA   /* Off-white — card backgrounds, hover */
  --color-error:         #DC2626   /* Red — sale badges, error states */
}
```

### 4.2 Color Usage by Component

| Context | Color Token | Hex |
|---|---|---|
| Header background | `bg-white` | `#FFFFFF` |
| Header nav links | `text-neutral-dark` → `hover:text-primary` | `#1A1A2E` → `#0A6847` |
| Cart badge | `bg-secondary text-neutral-dark` | `#F5A623` on `#1A1A2E` |
| Footer background | `bg-neutral-dark` | `#1A1A2E` |
| Footer headings | `text-white` | `#FFFFFF` |
| Footer body text | `text-gray-400` | Tailwind default |
| Footer subscribe btn | `bg-primary hover:bg-primary-light` | `#0A6847` → `#14B87A` |
| Hero banner overlay | `bg-primary/20 mix-blend-multiply` | Green tint on video |
| Section h2 | `text-neutral-dark` | `#1A1A2E` |
| "View All" links | `text-primary hover:text-primary-light` | `#0A6847` → `#14B87A` |
| Product card hover | `hover:text-primary` | `#0A6847` |
| Product card overlay | `bg-gradient-to-t from-black/70` | Overlay gradient |
| Rating star | `fill-secondary text-secondary` | `#F5A623` |
| Price (normal) | `font-mono font-semibold text-neutral-dark` | `#1A1A2E` |
| Price (crossed out) | `font-mono text-gray-400 line-through` | Tailwind gray-400 |
| Badge: New / default | `bg-primary text-white` | `#0A6847` |
| Badge: Sale | `bg-error text-white` | `#DC2626` |
| Button: default | `bg-primary text-white hover:bg-primary-light` | `#0A6847` |
| Button: secondary | `bg-secondary text-neutral-dark hover:bg-secondary/80` | `#F5A623` |
| Button: outline | `border-primary text-primary hover:bg-primary hover:text-white` | `#0A6847` |
| Shop-by hover gradient | `from-primary/80 via-primary/30` | Green wash overlay |

---

## 5. Typography System

### 5.1 Font Families

| Variable | Font | Weights | Use |
|---|---|---|---|
| `--font-heading` | **Plus Jakarta Sans** | 600, 700, 800 | All headings (`font-heading`) |
| `--font-body` | **Inter** | 400, 500, 600 | Body text (set on `<body className="font-body">`) |
| `--font-mono` | **JetBrains Mono** | 500, 600 | Prices (`font-mono`) |

### 5.2 Heading Scale

| Level | Tailwind Classes | Size | Used In |
|---|---|---|---|
| `h1` — Page Hero | `font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-white` | 36px → 72px | `HeroBanner` |
| `h1` — Page Title | `font-heading text-2xl md:text-3xl font-bold text-neutral-dark` | 24px → 30px | `ProductListing` |
| `h2` — Section | `font-heading text-2xl md:text-3xl font-bold text-neutral-dark` | 24px → 30px | `FeaturedProducts`, `CategoryGrid`, `SportSelector` |
| `h2` — Sheet | `font-heading text-lg font-bold` | 18px | `Sheet` modal header |
| `h3` — Card overlay | `text-lg md:text-xl font-semibold text-white` | 18px → 20px | `HeroProductCard`, `CategoryGrid` |
| `h3` — Footer section | `font-heading font-bold text-sm text-white` | 14px | `Footer` |
| `h3` — Product card | `text-sm font-medium text-neutral-dark` | 14px | `ProductCard` |

### 5.3 Body & Utility Text

| Role | Classes | Size |
|---|---|---|
| Body default | `font-body text-neutral-dark antialiased` | 16px (rem base) |
| Nav links | `text-sm font-medium` | 14px |
| Product brand label | `text-xs uppercase tracking-wide text-gray-500` | 12px |
| Product rating | `text-xs text-gray-500` | 12px |
| Price (main) | `font-mono font-semibold text-sm` | 14px |
| Price (compare) | `font-mono text-xs text-gray-400 line-through` | 12px |
| Hero subtitle | `text-lg md:text-xl text-white/90 leading-relaxed` | 18px → 20px |
| Footer body | `text-sm text-gray-400 leading-relaxed` | 14px |
| Count / pagination | `text-sm text-gray-500` | 14px |
| Badge text | `text-xs font-semibold` | 12px |

---

## 6. Reusable UI Components (`components/ui/`)

All primitives use **CVA (class-variance-authority)** + the `cn` utility for class merging.

### 6.1 `Button`

```
Variants: default | secondary | outline | ghost | link
Sizes:    default (h-10) | sm (h-8) | lg (h-12) | icon (h-10 w-10)

default:   bg-primary text-white hover:bg-primary-light
secondary: bg-secondary text-neutral-dark hover:bg-secondary/80
outline:   border-2 border-primary text-primary hover:bg-primary hover:text-white
ghost:     hover:bg-neutral-light text-neutral-dark
link:      text-primary underline-offset-4 hover:underline
```

Used in: `HeroBanner`, `ProductListing` (pagination + filter toggle), `Footer` (subscribe), `CartDrawer`, checkout forms.

### 6.2 `Badge`

```
Variants: default | secondary | sale | outline

default:   bg-primary text-white           (New products)
secondary: bg-secondary text-neutral-dark
sale:      bg-error text-white             (Discount %)
outline:   border border-current text-current
```

Used in: `ProductCard`, `HeroProductCard`.

### 6.3 `Sheet`

A slide-in overlay panel. Props: `open`, `onClose`, `side` (`left`|`right`), `title`.

- Locks body scroll when open
- Closes on `Escape` key
- Backdrop: `bg-black/50`
- Panel: `max-w-md bg-white shadow-xl` sliding from `left` or `right`

Used in: `ProductListing` (mobile filters), `CartDrawer`.

### 6.4 `Input`

Standard form text input with consistent border, padding, `focus:ring-primary/50` ring.

Used in: Checkout `AddressForm`, `SearchDialog`, `Footer` newsletter.

### 6.5 `Select`

Styled `<select>` wrapper. Consistent sizing with `Input`.

Used in: Checkout shipping, `ProductListing` sort dropdown.

### 6.6 `Stepper`

Numeric quantity stepper with increment/decrement buttons.

Used in: `CartDrawer`, product detail variant selection.

### 6.7 `RadioCard`

Card-style radio input (large click area, border highlight on selection).

Used in: `ShippingSelector`, `PaymentForm`.

---

## 7. Section-by-Section Page Breakdown

### 7.1 Home Page (`[locale]/page.tsx`)

Composed of 5 sequential section components:

```
1. <HeroBanner />       — Full-width video hero with h1 + CTA button
2. <SportSelector />    — 3-col gender selector (Men / Women / Kids)
3. <FeaturedProducts /> — Mixed hero + grid product cards
4. <CategoryGrid />     — 2-col → 3-col sport category image grid
5. <NewArrivals />      — New product grid (simple)
```

**Animation pattern:** `IntersectionObserver` with `threshold: 0.1–0.2` triggers `opacity-0 translate-y-6` → `opacity-100 translate-y-0` fade-up transitions with `transitionDelay` staggered per card.

### 7.2 HeroBanner

- **Background:** `<video>` autoplay/loop/muted with `canplaythrough` listener; fallback `bg-gradient-to-br from-primary`.
- **Overlays:** `from-black/75 via-black/50 to-black/30` dark gradient + `bg-primary/20 mix-blend-multiply` green tint.
- **CTA:** `<Button size="lg" variant="secondary">Shop Now →</Button>`

### 7.3 SportSelector (Shop By)

- 3 equal-column cards (Men / Women / Kids) with `aspect-[3/4]` ratio.
- On hover: active card scales to `1.02`, inactive cards dim to `brightness(0.7)`.
- Hover overlay swaps from `from-black/70` → `from-primary/80` gradient.
- Label animates `text-lg` → `text-xl` on hover.

### 7.4 FeaturedProducts

- **Hero cards (2):** `col-span-2`, `min-h-[24rem]`, image fill with `group-hover:scale-105`.
- **Standard cards (4):** `col-span-1`, aspect-square.
- Section header: `h2 font-heading text-2xl md:text-3xl` + "View All →" link.

### 7.5 CategoryGrid

- Root categories only (`parentId === null`, max 6).
- `aspect-[4/3]` image with `from-black/60` bottom gradient.
- Category name: `h3 text-white font-heading font-bold text-lg md:text-xl`.

### 7.6 ProductListing (`/products`, `/categories/*`, `/sports/*`)

- Toolbar: results count + sort `<select>` + mobile filter toggle `<Button variant="outline">`.
- Desktop: `w-64` `<aside>` sidebar with `<FacetSidebar>`.
- Mobile: `<Sheet side="left">` containing `<FacetSidebar>`.
- Grid: `<ProductGrid>` — standard 2→4 column grid of `<ProductCard>`.
- Pagination: `<Button variant="outline" size="icon">` prev/next + `page / totalPages` label.

### 7.7 Header

- `sticky top-0 z-40 bg-white border-b`, height `h-16`.
- Logo: `<Image src="/logo.svg" width={130} height={40} priority>`.
- Nav: `text-sm font-medium text-neutral-dark hover:text-primary` links (Products / Men / Women / Kids).
- Right: `<LanguageSwitcher>` + Search icon → `<SearchDialog>` + Cart icon → `<CartDrawer>`.
- Cart count badge: `bg-secondary text-neutral-dark text-xs font-bold rounded-full`.

### 7.8 Footer

- Background: `bg-neutral-dark text-white`.
- Layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.
- Columns: Brand (logo + tagline), Customer Service, Company, Legal.
- Section titles: `h3 font-heading font-bold text-sm text-white`.
- Links: `text-sm text-gray-400 hover:text-white transition-colors`.
- Newsletter row: email `<input>` + `bg-primary` subscribe button.
- Bottom copyright: `text-sm text-gray-500`.

### 7.9 Checkout Flow

Multi-step process using components:

```
1. AddressForm      — Name, email, phone, shipping address
2. ShippingSelector — <RadioCard> options with DHL rates
3. PaymentForm      — Stripe card input via <RadioCard>
4. OrderReview      — Final summary before confirm
```

Sidebar: `<OrderSummarySidebar>` — persistent right-side summary of cart totals.

---

## 8. i18n Architecture

- **Library:** `next-intl`
- **Locales:** defined in `src/i18n/routing.ts`
- **Messages:** `src/messages/{locale}.json` — loaded dynamically in `[locale]/layout.tsx`
- **Usage:** `useTranslations("namespace")` hook in client components; `getTranslations()` in server components
- **URL Structure:** `/{locale}/path` — e.g. `/en/products`, `/fr/produits`
- **Link Component:** Custom `Link` from `@/i18n/routing` (locale-aware)
- **Namespaces seen:** `nav`, `common`, `home`, `products`, `footer`

---

## 9. State Management (Zustand Stores)

| Store | File | State |
|---|---|---|
| Cart | `lib/cart-store.ts` | `items[]`, `getItemCount()`, add/remove/update |
| Checkout | `lib/checkout-store.ts` | Address, shipping rate, payment info |
| Order | `lib/order-store.ts` | Confirmed order data |

All stores are Zustand slices with no persistence (in-memory only unless extended).

---

## 10. Data Layer (`lib/data.ts`, 26 KB)

All data is currently **mock/seeded** — no external API:

- `getFeaturedProducts(n)` — returns first `n` products with `featured: true`
- `filterProducts(FilterState)` — client-side filter + sort + paginate, returns `{ products, total, facets }`
- `categories` — exported array of `Category` objects
- `sports` — exported array of `Sport` objects

**Facets computed dynamically** from the filtered result set: sports, categories, genders, sizes, colors, brands, priceRange.

---

## 11. TypeScript Data Model

```
Sport        { id, name, slug, icon, image }
Category     { id, name, slug, parentId, sportId, image, children? }
ProductImage { url, alt }
Variant      { id, size, color, colorHex, sku, price, compareAtPrice, stock }
Product      { id, name, slug, description, basePrice, compareAtPrice, brand,
               gender (men|women|unisex|kids), tags, sportId, categoryId,
               images, variants, featured, isNew, rating, reviewCount, createdAt }
CartItem     { productId, variantId, quantity, product, variant }
FilterState  { sport?, category?, gender?, sizes?, colors?, minPrice?, maxPrice?,
               brand?, sort?, search?, page? }
Order        { id, orderNumber, waybill, items, shippingAddress, shippingRate,
               payment, subtotal, shippingCost, total, status, timeline, createdAt }
OrderStatus  "confirmed"|"processing"|"shipped"|"in_transit"|"out_for_delivery"|"delivered"
```

---

## 12. SEO & Metadata

Defined in `[locale]/layout.tsx`:

```ts
export const metadata = {
  title: "Ekene Sport — Premium Sportswear",
  description: "Premium sportswear for every athlete. Shop football, basketball, running, gym & training gear at Ekene Sport.",
};
```

- `<html lang={locale}>` for language attribute
- Google Fonts loaded via `<link rel="preconnect">` + stylesheet in `<head>`
- Images use Next.js `<Image>` with `priority` on logo and hero
- Remote image patterns: `images.unsplash.com`, `res.cloudinary.com`
- Image cache TTL: 30 days

---

## 13. Animation & Interaction Patterns

| Pattern | Components | Implementation |
|---|---|---|
| Scroll fade-up | `FeaturedProducts`, `SportSelector` | `IntersectionObserver` → CSS `transition opacity + translateY` |
| Stagger delay | `FeaturedProducts`, `SportSelector` | `transitionDelay: index * 100–150ms` inline style |
| Image zoom on hover | `ProductCard`, `CategoryGrid`, `HeroProductCard` | `group-hover:scale-105 transition-transform duration-300` |
| Hover brightness dim | `SportSelector` | `filter: brightness(0.7)` on inactive cards |
| Gender card scale | `SportSelector` | `scale(1.02)` on active, `scale(0.98)` on inactive |
| Shimmer fallback | `HeroBanner` | `bg-gradient animate-pulse` while video loads |
| Sheet slide-in | `Sheet` | CSS `transition-transform` on fixed panel |
| Color transition | Nav links, buttons | `transition-colors` Tailwind utility |

---

## 14. Layout Conventions

- **Max width:** `max-w-7xl mx-auto px-4` — used consistently in all sections
- **Section spacing:** `py-12 md:py-16` on most home sections; `py-8` on listing pages
- **Column grid:** Tailwind grid with `grid-cols-2 md:grid-cols-3` or `grid-cols-2 md:grid-cols-4`
- **Responsive breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px) used throughout
- **Aspect ratios:** `aspect-square` (product cards), `aspect-[4/3]` (category), `aspect-[3/4]` (sport selector)
- **Mobile nav:** Slides in as `<MobileNav>` component using `Sheet`

---

## 15. Image Strategy

| Source | Usage |
|---|---|
| `/public/logo.svg` | Header + Footer logo |
| `/public/hero-video.mp4` | Hero banner video background |
| `images.unsplash.com` | Dev/mock product and category images |
| `res.cloudinary.com` | Production image CDN |

All product images use `fill` layout with `object-cover`. `sizes` attribute is always specified for responsive optimization.
