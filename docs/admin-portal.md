# Admin Portal

Specification for the Ekene Sport admin dashboard (`apps/admin`).

## Overview

A staff-facing application for managing products, orders, customers, and shipping. Separate from the storefront — different auth, different deployment, same backend API.

## Roles & Permissions

| Role | Products | Orders | Customers | Settings | Staff |
|------|----------|--------|-----------|----------|-------|
| **Super Admin** | Full CRUD | Full + refund | Full + delete | All | Manage all |
| **Admin** | Full CRUD | Full + refund | View + edit | Shipping zones | View only |
| **Staff** | View + edit | View + update status | View only | None | None |

## Pages

### Dashboard (`/`)

Overview metrics with date range selector (today, 7d, 30d, 90d, custom).

**Widgets:**
- Revenue (total, vs previous period)
- Orders (count, avg order value)
- New customers
- Top 5 selling products
- Recent orders (last 10, quick-link to detail)
- Low stock alerts (variants with stock < 10)
- Orders pending shipment count

### Products (`/products`)

#### Product List
- Table: image thumbnail, name, brand, sport, status (draft/active/archived), base price, total stock, created date
- Filters: status, sport, category, brand
- Search: by name, SKU
- Bulk actions: activate, archive, delete
- Sort: name, price, created, stock

#### Product Create/Edit (`/products/new`, `/products/:id`)
- **General:** name, slug (auto-generated, editable), description (rich text), brand, gender, sport, category
- **Pricing:** base price, compare-at price
- **Media:** drag-and-drop image upload (Cloudinary), reorder images, alt text
- **Variants:** matrix editor — select colors + sizes, auto-generates variant rows
  - Per-variant: SKU (auto-generated, editable), price override, stock count
  - Bulk update: set stock for all variants, adjust all prices
- **SEO:** meta title, meta description (optional, auto-generated from product data)
- **Status:** draft (not visible on storefront), active, archived
- **Tags:** free-form tags for future filtering

#### Stock Management (`/products/stock`)
- Dedicated view for bulk stock updates
- Table: SKU, product name, variant (color/size), current stock, reserved
- Inline editing for stock values
- CSV import/export for bulk updates
- Low stock filter (< 10, < 5, out of stock)

### Orders (`/orders`)

#### Order List
- Table: order number, customer name, email, status badge, total, items count, date
- Filters: status, date range, shipping method
- Search: by order number, email, waybill
- Quick actions: view, mark as processing, ship

#### Order Detail (`/orders/:id`)

**Sections:**
1. **Header:** order number, status badge, created date, action buttons
2. **Items:** product image, name, variant, quantity, price, line total
3. **Customer:** name, email, phone — link to customer profile
4. **Shipping address:** full address, copy button
5. **Shipping:** method, rate, waybill (linked to DHL tracking), estimated delivery
6. **Payment:** Stripe payment ID (linked to Stripe dashboard), amount, status
7. **Timeline:** chronological events — order placed, payment confirmed, shipped, delivered
8. **Internal notes:** staff-only notes with author and timestamp

**Actions:**
| Action | Conditions | Effect |
|--------|------------|--------|
| Mark as Processing | Status = confirmed | Updates status, adds timeline event |
| Ship Order | Status = processing | Opens DHL shipment dialog → creates shipment, gets waybill, sends shipping email |
| Cancel Order | Status != delivered/cancelled | Cancels order, refunds via Stripe, releases stock |
| Refund | Status = delivered | Partial or full refund via Stripe |
| Add Note | Any | Adds internal note |

**Ship Order Dialog:**
- Pre-filled weight (estimated from items)
- Package dimensions (default or custom)
- Shipping service (from DHL rates)
- Confirm → calls DHL API → stores waybill → sends customer email

### Customers (`/customers`)

#### Customer List
- Table: name, email, orders count, total spent, joined date
- Search: by name, email
- Sort: name, joined, total spent

#### Customer Detail (`/customers/:id`)
- Profile: name, email, phone, joined date
- Saved addresses
- Order history (linked to order detail)
- Total spent, average order value
- Actions: edit profile, deactivate account (GDPR: anonymize data)

### Analytics (`/analytics`)

#### Sales Overview
- Revenue chart (line graph, by day/week/month)
- Orders chart
- Average order value trend
- Conversion rate (if tracking page views)

#### Top Products
- Table: product, units sold, revenue, rating
- Filter by period
- Group by sport or category

#### Geographic
- Orders by country (map or table)
- Revenue by shipping zone
- Most popular shipping method

### Settings (`/settings`)

#### Shipping Zones (`/settings/shipping`)
- Zone list: domestic, EU, international
- Per-zone: rates table (method name, base price, free threshold, estimated days)
- Edit rates inline
- Country-to-zone mapping

#### Staff Management (`/settings/staff`) — Super Admin only
- Table: name, email, role, last login, status
- Invite new staff (sends email with setup link)
- Change role
- Deactivate/reactivate

#### General (`/settings/general`)
- Store name, support email
- Currency settings
- Tax configuration (VAT rate)
- Promo bar message

---

## UI Framework

- Same Tailwind theme as storefront (primary green, secondary gold)
- Data tables: sortable, filterable, paginated with URL state
- Forms: same Input, Select, Button components from `packages/shared`
- Toasts for success/error feedback
- Confirmation dialogs for destructive actions (cancel order, delete product, deactivate customer)
- Keyboard shortcuts: `Cmd+K` for global search, `Cmd+S` to save forms

## Notifications

In-app notification center for:
- New orders
- Low stock alerts (< 5 units)
- Failed payments
- DHL delivery exceptions
- Customer support requests (future)

Optional: email/Slack webhook for critical events (order > €500, stock at 0).
