# API Specification

Backend API for the Ekene Sport platform. Uses tRPC for type-safe storefront/admin calls and REST for external webhooks.

## Base URL

```
Development:  http://localhost:4000
Staging:      https://api.staging.ekenesport.com
Production:   https://api.ekenesport.com
```

## Authentication

- **Customer sessions:** httpOnly secure cookies (`ekene_session`)
- **Admin sessions:** httpOnly secure cookies (`ekene_admin_session`)
- **Webhook verification:** Stripe signature (`stripe-signature` header), DHL API key

See `security.md` for details.

---

## tRPC Router Structure

```
appRouter
├── product
│   ├── list          (query)    — Paginated, filtered product listing
│   ├── getBySlug     (query)    — Single product by slug
│   ├── getFeatured   (query)    — Featured products
│   ├── getNewArrivals(query)    — New arrivals
│   ├── getBySport    (query)    — Products by sport slug
│   ├── getByCategory (query)    — Products by category slug
│   ├── getRelated    (query)    — Related products
│   └── search        (query)    — Full-text search
├── category
│   ├── list          (query)    — All categories (tree structure)
│   ├── getBySport    (query)    — Categories for a sport
│   └── getBySlug     (query)    — Single category by slug
├── sport
│   └── list          (query)    — All sports
├── cart
│   ├── get           (query)    — Get current cart (guest or customer)
│   ├── addItem       (mutation) — Add item to cart
│   ├── updateItem    (mutation) — Update quantity
│   ├── removeItem    (mutation) — Remove item
│   └── clear         (mutation) — Clear cart
├── checkout
│   ├── createSession (mutation) — Create Stripe Checkout session
│   └── getShippingRates (query) — DHL rates for address
├── order
│   ├── getByNumber   (query)    — Order by order number (auth required)
│   ├── getByWaybill  (query)    — Order by DHL waybill
│   ├── listMine      (query)    — Customer's orders (auth required)
│   └── getTimeline   (query)    — Order tracking timeline
├── customer
│   ├── register      (mutation) — Create account
│   ├── login         (mutation) — Email/password login
│   ├── logout        (mutation) — End session
│   ├── me            (query)    — Current user profile
│   ├── updateProfile (mutation) — Update name, phone
│   ├── addresses     (query)    — List saved addresses
│   ├── addAddress    (mutation) — Add shipping address
│   └── deleteAddress (mutation) — Remove address
└── admin
    ├── product
    │   ├── list      (query)    — All products (with drafts)
    │   ├── create    (mutation) — Create product + variants
    │   ├── update    (mutation) — Update product
    │   ├── delete    (mutation) — Soft delete (archive)
    │   └── updateStock(mutation) — Bulk stock update
    ├── order
    │   ├── list      (query)    — All orders with filters
    │   ├── get       (query)    — Single order detail
    │   ├── updateStatus(mutation)— Change order status
    │   ├── ship      (mutation) — Create DHL shipment
    │   ├── cancel    (mutation) — Cancel order + refund
    │   └── addNote   (mutation) — Internal note
    ├── customer
    │   ├── list      (query)    — All customers
    │   └── get       (query)    — Customer detail + order history
    ├── analytics
    │   ├── overview  (query)    — Revenue, orders, customers summary
    │   ├── topProducts(query)   — Best selling products
    │   └── salesByPeriod(query) — Revenue over time
    └── settings
        ├── shipping  (query/mutation) — Shipping zone rates
        └── staff     (query/mutation) — Manage admin users
```

---

## Key Endpoints

### product.list

Replaces the current `filterProducts()` function.

**Input:**
```typescript
{
  sport?: string;          // sport slug
  category?: string;       // category slug
  gender?: "men" | "women" | "unisex" | "kids";
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  search?: string;
  page?: number;           // default 1
  pageSize?: number;       // default 12, max 48
}
```

**Output:**
```typescript
{
  products: Product[];
  total: number;
  facets: Facets;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### checkout.createSession

Creates a Stripe Checkout Session and returns the redirect URL.

**Input:**
```typescript
{
  items: { variantId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  shippingRateId: string;
}
```

**Output:**
```typescript
{
  sessionUrl: string;     // Stripe Checkout redirect URL
  orderNumber: string;    // Our order reference
}
```

**Side effects:**
1. Validates stock availability for all variants
2. Reserves stock (`reserved_stock += quantity`)
3. Creates order with status `pending`
4. Creates Stripe Checkout Session with line items
5. Schedules stock release job (30 min timeout) if payment not completed

### checkout.getShippingRates

Replaces the current `getShippingRates()` mock function.

**Input:**
```typescript
{
  countryCode: string;
  items: { variantId: string; quantity: number }[];
}
```

**Output:**
```typescript
{
  rates: ShippingRate[];
}
```

**Logic:**
- Calculates total weight from variant dimensions (future)
- Calls DHL Rate API or returns preconfigured zone-based rates
- Applies free shipping thresholds

---

## REST Endpoints (Webhooks)

### POST /webhooks/stripe

Handles Stripe events.

**Events handled:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Confirm order, release reserved stock, send confirmation email |
| `checkout.session.expired` | Cancel pending order, release reserved stock |
| `charge.refunded` | Update order status to `refunded`, restore stock |

**Security:** Verify `stripe-signature` header with webhook secret.

### POST /webhooks/dhl

Handles DHL tracking updates.

**Events handled:**
| Event | Action |
|-------|--------|
| `shipment.transit` | Update order status, add timeline event |
| `shipment.delivered` | Mark order as `delivered`, add timeline event |
| `shipment.exception` | Add timeline event, notify admin |

**Security:** Verify DHL webhook signature.

---

## Error Format

All errors follow a consistent shape:

```typescript
{
  code: string;           // machine-readable: "NOT_FOUND", "VALIDATION_ERROR", "UNAUTHORIZED"
  message: string;        // human-readable
  details?: Record<string, string>;  // field-level errors for validation
}
```

**Common error codes:**
| Code | HTTP Status | When |
|------|-------------|------|
| `UNAUTHORIZED` | 401 | Missing or invalid session |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Entity doesn't exist |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `CONFLICT` | 409 | Duplicate slug, email already registered |
| `INSUFFICIENT_STOCK` | 422 | Not enough stock for checkout |
| `RATE_LIMITED` | 429 | Too many requests |

---

## Pagination

All list endpoints use cursor-based pagination for large datasets and offset-based for admin views.

**Storefront (cursor-based):**
```typescript
{ cursor?: string; pageSize: number }
→ { items: T[]; nextCursor: string | null }
```

**Admin (offset-based):**
```typescript
{ page: number; pageSize: number }
→ { items: T[]; total: number; page: number; totalPages: number }
```

---

## Rate Limiting

| Endpoint group | Limit | Window |
|----------------|-------|--------|
| Public queries (products, categories) | 100 | 1 min |
| Auth (login, register) | 5 | 1 min |
| Checkout | 10 | 1 min |
| Admin mutations | 60 | 1 min |
| Webhooks | No limit | — |

See `security.md` for implementation details.
