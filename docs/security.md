# Security

Security architecture, threat model, and implementation guidelines for the Ekene Sport platform.

---

## Authentication

### Customer Auth

**Method:** Session-based with httpOnly cookies.

```
Register/Login → Server creates session → Sets httpOnly cookie
                                            ↓
                               Cookie sent on every request
                                            ↓
                               Server validates session from Redis
```

**Session configuration:**
| Setting | Value | Rationale |
|---------|-------|-----------|
| Cookie name | `ekene_session` | Identifiable but not revealing |
| httpOnly | `true` | Prevents XSS from reading session |
| secure | `true` (prod) | Only sent over HTTPS |
| sameSite | `lax` | Allows navigation but blocks cross-site POST |
| maxAge | 7 days | Balance UX and security |
| domain | `.ekenesport.com` | Scoped to our domain |

**Session storage:** Redis with TTL matching cookie maxAge. Key: `session:{sessionId}`, Value: `{ customerId, email, createdAt }`.

**Password hashing:** Argon2id (memory: 64MB, iterations: 3, parallelism: 4). Argon2 is the winner of the Password Hashing Competition and resists GPU/ASIC attacks better than bcrypt.

**Login protection:**
- Max 5 failed login attempts per email per 15 minutes → temporary lockout
- Max 20 failed login attempts per IP per 15 minutes → CAPTCHA challenge
- Lockout notification email sent after 5 failed attempts
- Successful login resets the counter

### Admin Auth

Same session-based approach but stricter:

| Setting | Value |
|---------|-------|
| Cookie name | `ekene_admin_session` |
| maxAge | 8 hours (work day) |
| Idle timeout | 30 minutes of inactivity |
| MFA | Required for super_admin role |

**Admin login flow:**
1. Email + password
2. If MFA enabled: TOTP code (Google Authenticator / Authy)
3. Session created with role embedded
4. IP + User-Agent logged in `audit_log`

### Why sessions over JWT

- Immediate revocation (delete from Redis vs waiting for JWT expiry)
- No token in localStorage (XSS vector)
- Server controls session lifetime precisely
- Simpler refresh logic (just extend TTL)

---

## Authorization

### Role-Based Access Control (RBAC)

Three admin roles with escalating permissions:

```
staff → admin → super_admin
```

| Permission | Staff | Admin | Super Admin |
|------------|-------|-------|-------------|
| View products | Yes | Yes | Yes |
| Create/edit products | Yes | Yes | Yes |
| Delete/archive products | No | Yes | Yes |
| View orders | Yes | Yes | Yes |
| Update order status | Yes | Yes | Yes |
| Ship orders | Yes | Yes | Yes |
| Cancel/refund orders | No | Yes | Yes |
| View customers | Yes | Yes | Yes |
| Edit/delete customers | No | No | Yes |
| Manage shipping zones | No | Yes | Yes |
| Manage staff accounts | No | No | Yes |
| View audit log | No | Yes | Yes |
| System settings | No | No | Yes |

**Implementation:** Middleware function on tRPC admin router that checks `session.role` against required permission before executing the procedure.

```typescript
// Example: admin.order.cancel requires 'admin' or 'super_admin'
.use(requireRole(['admin', 'super_admin']))
```

### Customer Authorization

Customers can only access their own data:
- Own orders (`order.customer_id = session.customer_id`)
- Own addresses
- Own profile

Guest checkout: order lookup by order number + email combination.

---

## Data Protection

### PII Handling

| Data | Storage | Encryption |
|------|---------|------------|
| Email | PostgreSQL | At rest (database-level encryption) |
| Password | PostgreSQL | Argon2id hash (irreversible) |
| Phone | PostgreSQL | At rest |
| Shipping address | PostgreSQL | At rest |
| Payment card data | **Never stored** | Handled entirely by Stripe |
| Session data | Redis | In-memory, TTL auto-expiry |

### GDPR Compliance

**Right to Access (Art. 15):**
- Customer can request full data export from profile page
- Export includes: profile, addresses, order history
- Delivered as JSON download

**Right to Erasure (Art. 17):**
- Customer can request account deletion
- Process:
  1. Anonymize customer record (replace PII with placeholder)
  2. Retain order records for legal/accounting (7 years in Germany)
  3. Delete addresses, sessions
  4. Anonymize customer name in orders → "Deleted Customer"
  5. Email confirmation of deletion

**Right to Rectification (Art. 16):**
- Customer can update profile and addresses via account settings

**Data minimization:**
- Collect only what's needed for the transaction
- No analytics cookies without consent
- No third-party trackers

### Data Retention

| Data | Retention | Reason |
|------|-----------|--------|
| Orders | 10 years | German tax law (§147 AO) |
| Customer accounts | Until deletion requested | Service |
| Sessions | 7 days | Auth |
| Audit logs | 2 years | Compliance |
| Failed login attempts | 24 hours | Security |

---

## API Security

### Input Validation

All inputs validated with Zod schemas at the tRPC procedure level. No raw user input reaches the database.

```typescript
// Every mutation has a Zod schema
createProduct: adminProcedure
  .input(createProductSchema)  // Zod validation
  .mutation(async ({ input }) => { ... })
```

**Validation rules:**
- String fields: max length, trim whitespace, sanitize HTML
- Numeric fields: min/max bounds, integer check where appropriate
- Email: format validation
- Phone: format validation (E.164)
- Country: ISO 3166-1 alpha-2 whitelist
- Slug: alphanumeric + hyphens only
- IDs: UUID v4 format

### SQL Injection Prevention

- Prisma ORM parameterizes all queries by default
- No raw SQL queries without explicit parameterization
- Database user has minimal privileges (no DROP, no GRANT)

### XSS Prevention

- React escapes output by default
- `dangerouslySetInnerHTML` never used
- Content-Security-Policy header (see Headers section)
- Rich text editor output sanitized with DOMPurify before storage
- API responses set `Content-Type: application/json`

### CSRF Protection

- SameSite=Lax cookies prevent most CSRF
- State-changing operations (mutations) require valid session cookie
- Stripe webhooks verified by signature (not cookie)

### Rate Limiting

Implemented with Redis using sliding window algorithm.

| Endpoint Group | Limit | Window | Key |
|----------------|-------|--------|-----|
| Auth (login/register) | 5 requests | 1 minute | IP + email |
| Password reset | 3 requests | 15 minutes | email |
| Product queries | 100 requests | 1 minute | IP |
| Checkout | 10 requests | 1 minute | IP + session |
| Admin mutations | 60 requests | 1 minute | admin session |
| Webhooks (Stripe/DHL) | Unlimited | — | Verified by signature |

**Response when limited:** HTTP 429 with `Retry-After` header.

---

## Security Headers

Set via Next.js middleware and API response headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://res.cloudinary.com https://images.unsplash.com data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Payment Security

### PCI DSS Compliance

By using **Stripe Checkout Sessions**, card data never touches our servers:
- No card number, CVV, or expiry stored or transmitted through our backend
- Stripe handles all PCI DSS requirements
- We are classified as **SAQ A** (lowest compliance burden)

### Webhook Verification

```typescript
// Always verify Stripe webhook signatures
const event = stripe.webhooks.constructEvent(
  rawBody,
  request.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
);
```

- Raw request body must be preserved (no JSON parsing before verification)
- Webhook endpoint does not require session auth
- Idempotent processing (check if event already handled)

### Refund Security

- Only `admin` and `super_admin` roles can issue refunds
- All refunds logged in `audit_log` with admin ID, amount, and reason
- Partial refunds require a reason field
- Maximum refund cannot exceed original order total

---

## Infrastructure Security

### Environment Variables

- Never committed to git (`.gitignore` includes `.env*`)
- Stored in deployment platform's secret manager (Vercel/Railway/AWS)
- Rotated quarterly: Stripe keys, DHL API keys, session secret
- Different values per environment (dev/staging/prod)

**Required secrets:**
```
DATABASE_URL
REDIS_URL
SESSION_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
DHL_API_KEY
DHL_API_SECRET
CLOUDINARY_API_SECRET
RESEND_API_KEY
```

### HTTPS

- Enforced in production (HSTS header)
- All cookies set with `secure: true`
- API rejects non-HTTPS requests in production
- TLS 1.2 minimum

### Database Security

- Connection via SSL
- Application database user: SELECT, INSERT, UPDATE, DELETE only (no DDL)
- Migrations run by a separate user with full privileges (CI/CD only)
- Connection pooling via PgBouncer or Prisma Accelerate
- Automated daily backups with 30-day retention

---

## Audit Logging

All admin actions that modify data are logged:

```sql
-- Example audit log entry
INSERT INTO audit_log (admin_id, action, entity_type, entity_id, changes, ip_address)
VALUES (
  'uuid-admin',
  'order.refund',
  'order',
  'uuid-order',
  '{"status": {"old": "delivered", "new": "refunded"}, "refund_amount": 89.99}',
  '203.0.113.1'
);
```

**Logged actions:**
| Category | Actions |
|----------|---------|
| Products | create, update, archive, delete, stock_update |
| Orders | update_status, ship, cancel, refund, add_note |
| Customers | update, deactivate, anonymize |
| Staff | invite, role_change, deactivate |
| Settings | shipping_rate_update, general_update |
| Auth | login, logout, failed_login, mfa_setup |

**Access:** Audit log is read-only. Only `admin` and `super_admin` can view it. No one can delete or modify entries.

---

## Threat Model (OWASP Top 10)

| # | Threat | Mitigation |
|---|--------|------------|
| A01 | Broken Access Control | RBAC on all admin endpoints, customer data scoped to session, ID enumeration prevented (UUIDs) |
| A02 | Cryptographic Failures | Argon2id passwords, TLS everywhere, no sensitive data in URLs/logs |
| A03 | Injection | Prisma parameterized queries, Zod input validation, no raw SQL |
| A04 | Insecure Design | Principle of least privilege, defense in depth, stock reservation with timeout |
| A05 | Security Misconfiguration | Security headers, minimal DB permissions, no default credentials, no debug in prod |
| A06 | Vulnerable Components | Dependabot/Renovate for dependency updates, `pnpm audit` in CI |
| A07 | Auth Failures | Session-based auth, rate-limited login, account lockout, MFA for admins |
| A08 | Data Integrity Failures | Stripe webhook signature verification, DHL webhook verification, Zod validation |
| A09 | Logging Failures | Audit log for all admin actions, structured logging (no PII in logs), log aggregation |
| A10 | SSRF | No user-controlled URLs fetched server-side, Cloudinary uploads are direct client-to-Cloudinary |

---

## Incident Response

### Account Compromise

1. Admin detects suspicious activity (unusual orders, login from new location)
2. Deactivate affected customer account
3. Invalidate all sessions (delete from Redis)
4. Send password reset email
5. Review recent orders for fraud
6. Log incident in internal tracker

### Data Breach

1. Identify scope (which data, how many customers)
2. Contain: rotate all secrets, invalidate sessions
3. Notify: German DPA (within 72 hours per GDPR Art. 33)
4. Notify affected customers (without undue delay per GDPR Art. 34)
5. Remediate: patch vulnerability, update security measures
6. Post-mortem: document root cause and prevention

### Payment Fraud

1. Stripe Radar flags suspicious payment
2. Review order in admin portal
3. If fraudulent: cancel order, refund, block email/IP
4. Report to Stripe for chargeback defense if disputed
