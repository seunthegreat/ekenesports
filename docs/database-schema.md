# Database Schema

PostgreSQL schema managed by Prisma. Derived from the existing frontend types in `apps/web/src/lib/types.ts`.

## Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌───────────────┐
│  Sport   │────<│   Category   │────<│   Product     │
└──────────┘     └──────────────┘     └───────┬───────┘
                       │ self-ref              │
                       └── parentId            │
                                               │
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                     │   Variant    │  │ ProductImage │  │  ProductTag  │
                     └──────┬───────┘  └──────────────┘  └──────────────┘
                            │
                            ▼
┌──────────┐     ┌──────────────┐     ┌───────────────┐
│ Customer │────<│    Order     │────<│  OrderItem    │
└──────────┘     └──────┬───────┘     └───────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ OrderEvent   │
                 │ (timeline)   │
                 └──────────────┘

┌──────────┐
│ AdminUser│
└──────────┘
```

## Tables

### Sport

Maps to existing `Sport` interface.

```sql
CREATE TABLE sport (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  image_url   TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Category

Self-referencing for nested categories (e.g., Jerseys → Club Jerseys).

```sql
CREATE TABLE category (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  parent_id   UUID REFERENCES category(id) ON DELETE SET NULL,
  sport_id    UUID NOT NULL REFERENCES sport(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_category_sport ON category(sport_id);
CREATE INDEX idx_category_parent ON category(parent_id);
CREATE INDEX idx_category_slug ON category(slug);
```

### Product

```sql
CREATE TABLE product (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  description      TEXT NOT NULL,
  base_price       DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  brand            VARCHAR(100) NOT NULL,
  gender           VARCHAR(10) NOT NULL CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
  sport_id         UUID NOT NULL REFERENCES sport(id),
  category_id      UUID NOT NULL REFERENCES category(id),
  featured         BOOLEAN NOT NULL DEFAULT false,
  is_new           BOOLEAN NOT NULL DEFAULT false,
  rating           DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count     INTEGER NOT NULL DEFAULT 0,
  status           VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_sport ON product(sport_id);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_product_brand ON product(brand);
CREATE INDEX idx_product_status ON product(status);
CREATE INDEX idx_product_slug ON product(slug);
CREATE INDEX idx_product_featured ON product(featured) WHERE featured = true;

-- Full-text search (Phase 2)
CREATE INDEX idx_product_search ON product USING GIN (
  to_tsvector('english', name || ' ' || description || ' ' || brand)
);
```

### Variant

Each product has multiple size/color combinations.

```sql
CREATE TABLE variant (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  size             VARCHAR(10) NOT NULL,
  color            VARCHAR(50) NOT NULL,
  color_hex        VARCHAR(7) NOT NULL,
  sku              VARCHAR(50) NOT NULL UNIQUE,
  price            DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock            INTEGER NOT NULL DEFAULT 0,
  reserved_stock   INTEGER NOT NULL DEFAULT 0,  -- held during checkout
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_variant_product ON variant(product_id);
CREATE INDEX idx_variant_sku ON variant(sku);
CREATE INDEX idx_variant_stock ON variant(stock) WHERE stock > 0;
```

**Note:** `reserved_stock` is incremented when an order is placed (during Stripe checkout) and decremented when the order is confirmed or expired. Available stock = `stock - reserved_stock`.

### ProductImage

```sql
CREATE TABLE product_image (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         VARCHAR(255) NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_image_product ON product_image(product_id);
```

### Customer

```sql
CREATE TABLE customer (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255),  -- null for OAuth-only accounts
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(30),
  stripe_customer_id  VARCHAR(255) UNIQUE,
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_customer_stripe ON customer(stripe_customer_id);
```

### CustomerAddress

```sql
CREATE TABLE customer_address (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  label       VARCHAR(50) NOT NULL DEFAULT 'default',  -- 'home', 'work', etc.
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  street      VARCHAR(255) NOT NULL,
  apartment   VARCHAR(100),
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country     VARCHAR(2) NOT NULL,  -- ISO 3166-1 alpha-2
  phone       VARCHAR(30) NOT NULL,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_address_customer ON customer_address(customer_id);
```

### Order

Maps to the existing `Order` interface.

```sql
CREATE TABLE "order" (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      VARCHAR(20) NOT NULL UNIQUE,
  customer_id       UUID REFERENCES customer(id) ON DELETE SET NULL,  -- null for guest checkout
  email             VARCHAR(255) NOT NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),

  -- Shipping
  shipping_first_name   VARCHAR(100) NOT NULL,
  shipping_last_name    VARCHAR(100) NOT NULL,
  shipping_street       VARCHAR(255) NOT NULL,
  shipping_apartment    VARCHAR(100),
  shipping_city         VARCHAR(100) NOT NULL,
  shipping_state        VARCHAR(100) NOT NULL,
  shipping_postal_code  VARCHAR(20) NOT NULL,
  shipping_country      VARCHAR(2) NOT NULL,
  shipping_phone        VARCHAR(30) NOT NULL,
  shipping_method       VARCHAR(50) NOT NULL,
  shipping_rate_name    VARCHAR(100) NOT NULL,

  -- DHL
  waybill           VARCHAR(50) UNIQUE,
  dhl_shipment_id   VARCHAR(100),

  -- Stripe
  stripe_session_id     VARCHAR(255),
  stripe_payment_intent VARCHAR(255),

  -- Totals (stored at time of order, not computed)
  subtotal          DECIMAL(10,2) NOT NULL,
  shipping_cost     DECIMAL(10,2) NOT NULL,
  tax               DECIMAL(10,2) NOT NULL DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'EUR',

  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_customer ON "order"(customer_id);
CREATE INDEX idx_order_number ON "order"(order_number);
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_order_waybill ON "order"(waybill);
CREATE INDEX idx_order_email ON "order"(email);
CREATE INDEX idx_order_created ON "order"(created_at DESC);
```

### OrderItem

```sql
CREATE TABLE order_item (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES product(id) ON DELETE SET NULL,
  variant_id  UUID REFERENCES variant(id) ON DELETE SET NULL,
  name        VARCHAR(255) NOT NULL,       -- snapshot at time of order
  variant_label VARCHAR(100) NOT NULL,     -- "Black / M" snapshot
  sku         VARCHAR(50) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  quantity    INTEGER NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_item_order ON order_item(order_id);
```

### OrderEvent

Timeline of status changes (maps to `OrderTimelineEvent`).

```sql
CREATE TABLE order_event (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL,
  label       VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location    VARCHAR(200),
  actor       VARCHAR(50),  -- 'system', 'admin:user@email', 'dhl'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_event_order ON order_event(order_id);
CREATE INDEX idx_order_event_created ON order_event(created_at);
```

### AdminUser

```sql
CREATE TABLE admin_user (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'staff')),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### AuditLog

For tracking admin actions (see `security.md`).

```sql
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES admin_user(id) ON DELETE SET NULL,
  action      VARCHAR(50) NOT NULL,    -- 'product.create', 'order.update', 'order.refund'
  entity_type VARCHAR(50) NOT NULL,    -- 'product', 'order', 'customer'
  entity_id   UUID,
  changes     JSONB,                   -- { field: { old: ..., new: ... } }
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_admin ON audit_log(admin_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
```

## Prisma Schema Notes

- Use `@map` to convert camelCase TypeScript fields to snake_case database columns
- Use `@relation` for all foreign keys with explicit `onDelete` behavior
- `reserved_stock` on Variant uses optimistic locking for concurrent checkouts
- All `DECIMAL` columns use Prisma's `Decimal` type
- Timestamps use `@default(now())` with `@updatedAt` for `updated_at`

## Migrations Strategy

1. Start with `prisma migrate dev` locally
2. Use `prisma migrate deploy` in CI/CD for staging and production
3. Never edit migration files after they've been applied to staging
4. Seed script (`prisma/seed.ts`) imports from the existing `data.ts` mock data for development
