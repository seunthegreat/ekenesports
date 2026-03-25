# Stripe Payment System Implementation

Our payment system uses **Stripe Elements**, which provides a secure, customizable UI for collecting payment details directly on our site without handling sensitive card data.

## System Architecture

The integration consists of three main parts:
1.  **Frontend (Next.js)**: Uses `@stripe/react-stripe-js` to render the `PaymentElement`.
2.  **Backend (NestJS)**: Manages `PaymentIntents` and links them to our `Order` records.
3.  **Webhook**: Listens for Stripe events (like `payment_intent.succeeded`) to update order status.

---

## 1. Initializing the Payment (The "Secret")

When a user reaches the payment step in the checkout:
-   The `StripeElementsWrapper` component calls our backend (`/stripe/create-payment-intent`).
-   The backend creates (or updates) a **PaymentIntent** at Stripe.
-   Stripe returns a **Client Secret** (e.g., `pi_3Ox..._secret_ABC...`).
-   We pass this secret to the `<Elements>` provider, which allows the `PaymentElement` to securely communicate with Stripe.

> [!NOTE]  
> If the user changes their cart or shipping method, we send the existing `paymentIntentId` back to the API. This ensures we **update** the same intent rather than creating duplicate ones.

---

## 2. Collecting & Confirming Payment

1.  **PaymentForm**: Renders the `PaymentElement`. Stripe handles all validation and PCI compliance.
2.  **OrderReview**: When the user clicks "Place Order":
    -   We first call our API (`/stripe/initialize-order`) to create a `PENDING` order in our database.
    -   We then call `stripe.confirmPayment()`.
    -   Stripe takes over the UI (e.g., for 3D Secure/OTP) and then redirects the user to our `successUrl`.

---

## 3. Handling IDs & State

| ID Type | Source | Purpose |
| :--- | :--- | :--- |
| **PaymentIntent ID (`pi_...`)** | Stripe | Unique identifier for the payment attempt. We store this in our `Order` table as `stripePaymentIntentId`. |
| **Client Secret** | Stripe | A temporary key used by the frontend to safely collect card details for a specific `PaymentIntent`. |
| **Order ID** | Our DB | Our internal reference. We pass this to Stripe in the `metadata` of the `PaymentIntent`. |

---

## 4. Why Webhooks are Critical

Even if the user closes their browser after a successful payment but before the redirect completes, our system stays in sync via **Webhooks**.

-   **Stripe** sends a POST request to `/stripe/webhook`.
-   **Our Backend** verifies the signature, extracts the `payment_intent.succeeded` event.
-   We find the order using the `stripePaymentIntentId` or the `orderId` in the `metadata`.
-   We update the order status to `PAID`.

---

## Technical Files
- **Frontend Wrapper**: [stripe-elements-wrapper.tsx](file:///c:/Users/user/Desktop/ekenesports/apps/web/src/components/checkout/stripe-elements-wrapper.tsx)
- **Backend Service**: [stripe.service.ts](file:///c:/Users/user/Desktop/ekenesports/apps/api/src/stripe/stripe.service.ts)
