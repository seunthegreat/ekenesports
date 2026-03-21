# Ekene Sport UI & Design Patterns

## Overview
This document enforces strict UI and component design standards across the Ekene Sport applications (both Storefront and Admin Portal). It serves as the single source of truth to ensure a consistent, recognizable, and highly polished user experience.

## 1. Core Visual Directives
- **Color Identity:** 
  - `Primary:` #0A6847 (Deep Sport Green)
  - `Secondary:` #F5A623 (Athletic Gold)
  - Colors are predominantly used as actionable accents, pill badges, and active states rather than heavy blocks. Backgrounds should rely heavily on pristine white or off-white (`#F8F9FA`) to let content breathe.
  
- **Typography Matrix:**
  - **Headings & Brands (`Plus Jakarta Sans`):** Use for all page titles, numeric statistics, and primary marketing copy. Weight: `extrabold` (800) for maximum impact.
  - **Body & Labels (`Inter`):** Use for lists, table content, and descriptions. Emphasize legibility with `medium` (500) and `bold` (700) weights rather than thin fonts. Keep label sizes small (`text-xs` to `text-sm`) but bolded and tracked out (uppercase).

## 2. Admin Portal specific Layout Guidelines
Based on iterative stakeholder feedback, the Admin UI breaks from traditional "utility" dashboard design to adopt a more editorial, clean approach.

- **Headerless Design:** 
  - There is no traditional horizontal dashboard header. Page titles (e.g., "Welcome to iCourses" or "Dashboard Overview") serve as the definitive top-of-page anchor. Sub-actions (like "Search", "Create Product", or "Save") are moved either inside the page hero area or embedded gracefully into the components that require them.
  
- **Fluid & Draggable Sidebar:** 
  - Navigation is contained exclusively in a left-hand Sidebar.
  - The Sidebar lists flat, unified navigation items (no categorized sub-menus like 'MENU' or 'USER' breaking up the visual flow).
  - The Sidebar must be **draggable** and dynamically resizable.
  - **Mini-Sidebar Mode:** If the sidebar is dragged below ~160px, it should snap into an "icon-only" state (`~80px` wide) where the text labels disappear gracefully to save space.
  - **Vertical Rhythm:** Navigation links must have tight vertical padding (e.g. `py-2`) to entirely eliminate vertical overflow/scrollbars.
  - **Active States:** The active navigation link must use the dark navy background (`#1A1A2E`) with white text and a `Primary Green` icon. Inactive links remain a soft gray.
  - **App Icon Sync:** The admin portal must use the exact customer `logo.svg` instead of generic Lucide icons.
  
- **Mobile Responsiveness:** 
  - The Sidebar must be hidden behind a hamburger icon on mobile viewports.
  - Form grids collapse from a multi-column layout to a stacked, single-column configuration for optimal touch-legibility.

## 3. Component Styling
- **Animation & Polish:** Utilize Tailwind's discrete transitions for micro-interactions (e.g., `transition-all duration-300`). Components should exhibit a slight lift/scale (`hover:scale-[1.02]`) or background flush (`hover:bg-primary/5`) upon hover to confirm interactivity.
- **Borders & Shadows:** Rely on ultra-soft shadows (`shadow-sm`, `shadow-md`) and extremely light, single-pixel borders (`border-gray-100`) rather than stark dividers. Shapes should lean rounded (`rounded-2xl` or `rounded-3xl` for major cards, `rounded-xl` for buttons/inputs).

## 4. Admin Portal Specific Implementations
Referencing `docs/admin-portal.md` for strict layout and data schema requirements:
- **Shared Components:** All interfaces MUST implement `packages/shared` or `@/components/ui/` unified elements (e.g. `Input`, `Button`, `Dropdown`, `DataTable`). Avoid raw HTML.
- **Data Tables:** All `DataTable` instances must be natively sortable and synchronized via Next.js `useSearchParams()` URL routing. Every list view (Products, Orders, Customers) must map `sortable: true` and `id` properties to their respective columns.
- **Filtering:** Pages mapping complex entities (`/products`, `/orders`, `/stock`) must mount robust sidebar or dropdown filters containing all attributes mandated by `admin-portal.md` (e.g., status, sport, category, brand) mapped structurally to URL query strings.
- **Confirmations:** Destructive operations (delete, deactivate, archive) across the portal must be firmly intercepted by the global `<ConfirmDialog />`.
- **Inventory/Stock:** Bulk updates must happen via a unified `<Modal>` with standardized `<Input type="number">` and `<Button>` components. Reports must be exportable via a primary `<Button variant="outline">`.
- **Order Management:** Status badges must follow the `statusStyles` mapping for color consistency (Primary Green for Delivered, Athletic Gold for Processing, Red for Refunded). Every order list record should be clickable to navigate to detail views.
