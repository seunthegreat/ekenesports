# Implementation Plan - Germany Localization & Compliance

This plan addresses the legal gaps identified in the compliance audit to make the site ready for the German market.

## Proposed Changes

### [Component] Web Frontend (Localization)

#### [MODIFY] [de.json](file:///c:/Users/user/Desktop/ekenesports/apps/web/src/messages/de.json)
- Update `placeOrder` to "Zahlungspflichtig bestellen".
- Add `vatIncluded` key: "inkl. MwSt., zzgl. Versandkosten".
- Add footer policy URLs for legal pages.

#### [MODIFY] [order-summary-sidebar.tsx](file:///c:/Users/user/Desktop/ekenesports/apps/web/src/components/checkout/order-summary-sidebar.tsx)
- Display "inkl. MwSt." under the total price.

#### [MODIFY] [footer.tsx](file:///c:/Users/user/Desktop/ekenesports/apps/web/src/components/layout/footer.tsx)
- Point `privacy`, `terms`, and `imprint` links to their respective routes (e.g., `/privacy`).

### [NEW] Legal Pages
- Create placeholder pages for `/impressum`, `/datenschutz`, and `/agb` so the site doesn't 404 and complies with basic accessibility requirements.

## Verification Plan

### Manual Verification
1.  Switch language to German.
2.  Navigate to checkout.
3.  Verify the final button text is "Zahlungspflichtig bestellen".
4.  Verify that VAT information is visible in the order summary.
5.  Click footer links to ensure they lead to content pages.
