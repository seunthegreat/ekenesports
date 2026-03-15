# Integrations

External service integration specs for Stripe, DHL, Cloudinary, and email.

---

## Stripe (Payments)

### Overview

Use **Stripe Checkout Sessions** for payment. No card data ever touches our server — Stripe handles the entire payment UI. This keeps us out of PCI DSS scope.

### Flow

```
1. Customer clicks "Place Order"
2. Frontend → POST checkout.createSession (tRPC)
3. Backend:
   a. Validates cart items and stock
   b. Reserves stock on variants
   c. Creates Order (status: "pending")
   d. Creates Stripe Checkout Session with:
      - line_items (from cart)
      - shipping_options (selected DHL rate)
      - success_url (/checkout/success?order={orderNumber}&session_id={CHECKOUT_SESSION_ID})
      - cancel_url (/cart)
      - metadata: { orderNumber }
      - customer_email
      - expires_after: 30 minutes
   e. Returns session URL
4. Frontend → redirect to Stripe Checkout
5. Customer pays on Stripe
6. Stripe → POST /webhooks/stripe (checkout.session.completed)
7. Backend:
   a. Verifies webhook signature
   b. Confirms order (status: "confirmed")
   c. Releases reserved stock → decrements actual stock
   d. Sends confirmation email
   e. Creates timeline event
```

### Webhook Events

| Event | Handler |
|-------|---------|
| `checkout.session.completed` | Confirm order, finalize stock, send email |
| `checkout.session.expired` | Cancel pending order, release reserved stock |
| `charge.refunded` | Mark order as refunded, restore stock |
| `charge.dispute.created` | Flag order, notify admin |

### Configuration

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Idempotency

- Each Stripe Checkout Session stores `orderNumber` in metadata
- Webhook handler checks if order is already confirmed before processing
- Use Stripe's built-in idempotency for API calls

---

## DHL (Shipping)

### Overview

Use DHL's **Business Customer Shipping API (Geschäftskundenversand)** for shipment creation and tracking. Germany is the warehouse origin.

### Shipment Creation Flow

```
1. Admin clicks "Ship Order" in admin portal
2. Admin confirms package weight + dimensions
3. Backend → DHL Shipment API:
   POST /shipments
   {
     shipper: { Ekene Sport warehouse address },
     receiver: { customer shipping address },
     services: { selectedRate },
     packages: [{ weight, dimensions }]
   }
4. DHL returns: shipment ID, waybill number, label PDF URL
5. Backend:
   a. Stores waybill + shipment ID on order
   b. Updates order status → "shipped"
   c. Creates timeline event
   d. Sends shipping notification email with tracking link
```

### Tracking

**Option A: Webhook (preferred)**
- Register webhook URL with DHL
- DHL pushes status updates to `POST /webhooks/dhl`
- Update order timeline on each event

**Option B: Polling (fallback)**
- Cron job every 2 hours for orders with status `shipped` or `in_transit`
- `GET /track/shipments?trackingNumber={waybill}`
- Parse events and update order timeline

### DHL Status Mapping

| DHL Status | Our Status | Timeline Label |
|------------|------------|----------------|
| `pre-transit` | `processing` | Package prepared |
| `transit` | `in_transit` | In transit |
| `out-for-delivery` | `out_for_delivery` | Out for delivery |
| `delivered` | `delivered` | Delivered |
| `failure` | (no change) | Delivery attempt failed |
| `return` | (no change) | Returned to sender |

### Configuration

```env
DHL_API_KEY=...
DHL_API_SECRET=...
DHL_ACCOUNT_NUMBER=...    # EKP number
DHL_API_URL=https://api-eu.dhl.com
```

### Shipping Zones (from current `dhl-shipping.ts`)

| Zone | Countries | Standard Rate | Express Rate | Free Threshold |
|------|-----------|--------------|--------------|----------------|
| Domestic | DE | €4.99 (1-3 days) | €9.99 (next day) | €50 |
| EU | AT, BE, FR, NL, +20 | €7.99 (3-5 days) | €14.99 (1-2 days) | €100 |
| International | US, GB, NG, +25 | €12.99 (7-14 days) | €24.99 (2-4 days) | — |

---

## Cloudinary (Image Storage)

### Overview

Replace Unsplash placeholder images with Cloudinary for product image hosting. Provides on-the-fly resizing, format conversion (WebP/AVIF), and CDN delivery.

### Upload Flow

```
1. Admin drags image into product form
2. Frontend → signed upload URL from backend
3. Frontend → direct upload to Cloudinary (no image data through our server)
4. Cloudinary returns: public_id, secure_url, dimensions
5. Frontend sends metadata to backend
6. Backend stores in product_image table
```

### URL Transformation

Store the Cloudinary `public_id` in the database. Generate URLs with transforms at render time:

```
Product card:    /c_fill,w_400,h_400,f_auto,q_80/v1/{public_id}
Product detail:  /c_fill,w_800,h_800,f_auto,q_85/v1/{public_id}
Hero banner:     /c_fill,w_1600,h_800,f_auto,q_85/v1/{public_id}
Thumbnail:       /c_fill,w_100,h_100,f_auto,q_70/v1/{public_id}
```

### Configuration

```env
CLOUDINARY_CLOUD_NAME=ekene-sport
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Migration Plan

1. Upload all current Unsplash images to Cloudinary
2. Update seed script to reference Cloudinary URLs
3. Update `next.config.ts` image domains
4. Remove Unsplash dependency

---

## Email (Resend)

### Overview

Transactional emails using Resend with React Email templates. Templates live in `packages/email`.

### Email Templates

| Template | Trigger | Content |
|----------|---------|---------|
| Order Confirmation | `checkout.session.completed` | Order number, items, totals, shipping address, estimated delivery |
| Shipping Notification | Order shipped (DHL shipment created) | Waybill number, tracking link, estimated delivery |
| Delivery Confirmation | DHL status = delivered | "Your order has been delivered" |
| Account Welcome | Customer registration | Welcome message, shop link |
| Password Reset | Customer requests reset | Reset link (24h expiry) |
| Order Cancelled | Admin cancels order | Cancellation reason, refund details |
| Low Stock Alert (Admin) | Variant stock < 5 | Product name, SKU, remaining stock |

### Configuration

```env
RESEND_API_KEY=re_...
EMAIL_FROM=orders@ekenesport.com
EMAIL_REPLY_TO=support@ekenesport.com
```

### i18n

Email templates support both `en` and `de` locales. The customer's locale (from their browser or account settings) determines which template is sent.

---

## Integration Testing Strategy

| Service | Local Development | CI | Staging |
|---------|------------------|-----|---------|
| Stripe | Test mode keys + CLI webhook forwarding | Test mode | Test mode |
| DHL | Mock responses from `dhl-shipping.ts` | Mock | Sandbox API |
| Cloudinary | Direct uploads to dev folder | Mock | Dev folder |
| Resend | Suppress sends / log to console | Mock | Test domain |
