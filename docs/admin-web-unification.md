# Admin ↔ Web Unification Plan

> **Goal:** Make both `apps/web` and `apps/admin` feel like a single product by aligning typography, font loading, color semantics, heading styles, and component patterns.
> **Generated:** March 22, 2026

---

## Executive Summary

Both apps already share the same **color tokens** (`globals.css` is identical). The divergences are concentrated in **four areas**:

| # | Area | Severity |
|---|---|---|
| 1 | Font loading method | 🔴 High — different fonts are actually loaded |
| 2 | Body typography class | 🔴 High — admin uses `font-sans` (system font fallback), web uses `font-body` |
| 3 | Typography sizing in pages | 🟡 Medium — admin body text uses raw px values (`text-[15px]`, `text-[13px]`) |
| 4 | Active state color in nav & pagination | 🟡 Medium — admin uses `bg-neutral-dark` for active/selected, web uses `bg-primary` |
| 5 | Status badge styling in tables | 🟡 Medium — uses ad-hoc Tailwind colors (emerald, indigo, amber) not design tokens |
| 6 | Alert CTA button colour | 🟡 Medium — uses `bg-neutral-dark` instead of `bg-primary` |
| 7 | Admin has no `font-heading` on `<h1>` in some components | 🟢 Low |

---

## Detailed Diff: Admin vs Web

### 1. Font Loading — `[locale]/layout.tsx`

| | Web | Admin |
|---|---|---|
| **Method** | Google Fonts `<link>` tag in `<head>` | `next/font/google` with `Inter` + `Outfit` |
| **Fonts loaded** | Plus Jakarta Sans (600/700/800), Inter (400/500/600), JetBrains Mono (500/600) | Inter, **Outfit** (not Plus Jakarta Sans, not JetBrains Mono!) |
| **CSS variables set** | `--font-heading`, `--font-body`, `--font-mono` via `@theme` | `--font-inter`, `--font-outfit` via `next/font` — NOT aligned with `@theme` tokens |
| **Body class** | `font-body text-neutral-dark antialiased` | `font-sans antialiased text-[#1A1A2E]` |

**Problem:** The admin is loading `Outfit` but all the theme tokens expect `Plus Jakarta Sans` for headings. Any class like `font-heading` resolves to Plus Jakarta Sans from `@theme`, but that font isn't actually downloaded by the browser in the admin. So `font-heading` in admin silently falls back to the system sans-serif.

Also, the admin body uses `font-sans` (Tailwind's default stack) instead of `font-body` (Inter via `@theme`), meaning body text could render differently on different OS.

---

### 2. Sidebar Nav — Active Item Color

**Current admin** (`admin-shell.tsx` line 180):
```tsx
isActive ? "bg-primary/8 text-primary" : "text-gray-500 hover:bg-gray-50"
```
This is good — it uses `text-primary` ✅. But the dot indicator and the active item text weight uses `font-body` class explicitly, which is correct.

---

### 3. DataTable Pagination — Active Page Button

**Current admin** (`data-table.tsx` line 172):
```tsx
currentPage === i + 1
  ? "bg-neutral-dark text-white shadow-md shadow-neutral-dark/10"   // ❌ should be bg-primary
  : "text-gray-500 hover:bg-gray-200"
```

**Web equivalent** (`product-listing.tsx`): Uses `<Button variant="outline">` for prev/next. Active page not highlighted the same way but all use `text-primary` border.

**Fix:** Change active page button to `bg-primary text-white`.

---

### 4. Dashboard Page — Body Text Size

**Current admin** (`page.tsx` lines 101, 199, etc.):
```tsx
<p className="text-[15px] text-gray-500 font-medium ...">   // hard-coded px
<p className="text-[10px] font-bold text-gray-400 ...">     // hard-coded px
<span className="text-white/60 font-bold text-[10px] ...">  // hard-coded px
```
**Web pattern:** Uses Tailwind scale — `text-sm` (14px), `text-xs` (12px), `text-lg` (18px). No raw pixel values in web components.

**Fix:** Replace raw pixel text sizes with Tailwind scale equivalents.

---

### 5. Order Status Badge — Ad-hoc Colors

**Current admin** (`page.tsx` lines 73–77):
```tsx
o.status === "Delivered"  ? "bg-emerald-50 text-emerald-600"  // ❌ not a token
o.status === "Shipped"    ? "bg-indigo-50 text-indigo-600"    // ❌ not a token
o.status === "Processing" ? "bg-amber-50 text-amber-600"      // ❌ not a token
                          : "bg-gray-100 text-gray-500"
```
**Web equivalent:** Uses the `<Badge>` component with variants `default` (green/primary), `sale` (red/error), `secondary` (amber).

**Fix:** Map status values to the Badge component's existing variants.

---

### 6. Alert CTA Button Color

**Current admin** (`page.tsx` line 248):
```tsx
className="... bg-neutral-dark text-white ... hover:bg-neutral-dark/90 ..."
```
**Web pattern:** Uses `<Button variant="default">` = `bg-primary text-white`.

**Fix:** Replace inline button with `<Button variant="default">` or change class to `bg-primary`.

---

### 7. Missing `font-heading` on Some Section Headings

Some admin section headings inside pages use `font-heading` correctly. But the layout body tag does not load Plus Jakarta Sans, so even when `font-heading` is declared, it silently uses a fallback. **Fixing Item 1 (font loading) will automatically fix all of these.**

---

## Changes Required

### File 1 — `apps/admin/src/app/[locale]/layout.tsx`

**Remove** `next/font/google` imports for `Inter` and `Outfit`.
**Add** the same Google Fonts `<link>` tags the web app uses:

```diff
- import { Inter, Outfit } from "next/font/google";
- const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
- const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

+ // No next/font imports needed — fonts loaded via <link> tags (matching web app)
```

```diff
  <html lang={locale}>
-   <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[#1A1A2E]`}>
+   <body className="font-body text-neutral-dark antialiased">
+     {/* Same font loading as apps/web */}
```

```diff
+ <head>
+   <link rel="preconnect" href="https://fonts.googleapis.com" />
+   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
+   <link
+     href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
+     rel="stylesheet"
+   />
+ </head>
```

---

### File 2 — `apps/admin/src/components/ui/data-table.tsx`

**Change active page button from `bg-neutral-dark` → `bg-primary`:**

```diff
  currentPage === i + 1
-   ? "bg-neutral-dark text-white shadow-md shadow-neutral-dark/10"
+   ? "bg-primary text-white shadow-md shadow-primary/10"
    : "text-gray-500 hover:bg-gray-200"
```

---

### File 3 — `apps/admin/src/app/[locale]/page.tsx` (Dashboard)

**3a — Replace hard-coded text sizes with Tailwind scale:**

```diff
- <p className="text-[15px] text-gray-500 font-medium leading-relaxed mt-2">
+ <p className="text-base text-gray-500 font-medium leading-relaxed mt-2">
```

```diff
- <span className="text-white/60 font-bold text-[10px] tracking-widest uppercase">
+ <span className="text-white/60 font-bold text-[10.5px] tracking-widest uppercase">
  {/* or simply text-xs */}
```

**3b — Replace ad-hoc status badge colours with `<Badge>` component:**

```diff
+ import { Badge } from "@/components/ui/badge";

  { header: t("table.status"), accessor: (o: any) => (
-   <span className={cn(
-     "px-2 py-0.5 rounded-md text-[9px] font-medium uppercase tracking-widest",
-     o.status === "Delivered" ? "bg-emerald-50 text-emerald-600" :
-     o.status === "Shipped"   ? "bg-indigo-50 text-indigo-600"   :
-     o.status === "Processing"? "bg-amber-50 text-amber-600"     :
-                                "bg-gray-100 text-gray-500"
-   )}>{o.status}</span>
+   <Badge
+     variant={
+       o.status === "Delivered"  ? "default" :
+       o.status === "Shipped"    ? "secondary" :
+       o.status === "Processing" ? "secondary" :
+                                   "outline"
+     }
+   >{o.status}</Badge>
  )}
```

**3c — Replace alert CTA with `<Button>`:**

```diff
- <Link href="/products/stock"
-   className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-dark text-white font-bold rounded-xl text-xs hover:bg-neutral-dark/90 transition-all shadow-lg shadow-neutral-dark/10 group"
- >
-   Stock Manager <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
- </Link>
+ <Link href="/products/stock">
+   <Button variant="default" size="sm">Stock Manager →</Button>
+ </Link>
```

---

## Summary of Typography Alignment After Changes

| Element | Before (Admin) | After (Admin) | Web Equivalent |
|---|---|---|---|
| `<body>` font | `font-sans` (system) | `font-body` (Inter) | `font-body` (Inter) ✅ |
| `<h1>` page title | `font-heading` (broken fallback) | `font-heading` (Plus Jakarta Sans) | `font-heading` (Plus Jakarta Sans) ✅ |
| `<h2>` section | `font-heading` (broken fallback) | `font-heading` (Plus Jakarta Sans) | `font-heading` (Plus Jakarta Sans) ✅ |
| Prices / monospace | none loaded | `font-mono` (JetBrains Mono) | `font-mono` (JetBrains Mono) ✅ |
| Body text size | `text-[15px]` (raw px) | `text-base` (16px) | `text-sm` / `text-base` ✅ |
| Active page btn | `bg-neutral-dark` | `bg-primary` | `bg-primary` ✅ |
| Status badges | ad-hoc colours | `<Badge>` component | `<Badge>` component ✅ |
| Alert CTA | `bg-neutral-dark` inline | `<Button variant="default">` | `<Button variant="default">` ✅ |

---

## What Does NOT Need Changing

- ✅ `globals.css` in admin — identical to web, already correct
- ✅ `Button` component — byte-for-byte identical to web
- ✅ `Badge` component — identical to web
- ✅ Color tokens (`--color-primary`, `--color-secondary`, etc.) — both apps share the same palette
- ✅ Sidebar nav active state — already uses `text-primary` / `bg-primary/8`
- ✅ `Modal` component — uses `font-heading` correctly, will work once fonts load
- ✅ `DataTable` header row — already uses `font-heading font-bold uppercase tracking-widest`
- ✅ `Card` component — styling is admin-specific (fine, admin needs denser cards) and already uses tokens
- ✅ i18n architecture — both use `next-intl` identically

---

## Verification Plan

All changes are cosmetic/typographic. Verify visually by running both apps:

```bash
# Start admin dev server
cd apps/admin && pnpm dev     # opens on http://localhost:3001 (or next available port)

# Start web dev server (for side-by-side comparison)
cd apps/web && pnpm dev       # opens on http://localhost:3000
```

**Manual checks:**
1. Open admin Dashboard — confirm the `h1` title renders in Plus Jakarta Sans (thick, geometric font), not system sans-serif
2. Confirm body text (description paragraph below h1) renders in Inter
3. Navigate to Orders page — open the DataTable. Click to page 2 if available — confirm active page button is **green** (`bg-primary`), not dark navy
4. On Dashboard, check the "Recent Orders" table — status labels should be `<Badge>` pill components, not raw spans
5. Dashboard Alerts section — "Stock Manager" CTA should be a green `<Button>` not a dark navy inline div
6. Open web storefront side-by-side and confirm heading style, weight, and font appear visually identical

---

## Files to Change (Summary)

| File | Change Type | Lines Affected |
|---|---|---|
| [`[locale]/layout.tsx`](file:///c:/Users/user/Desktop/ekenesports/apps/admin/src/app/[locale]/layout.tsx) | Font loading — swap next/font → Google Fonts link | 6–13, 52 |
| [`data-table.tsx`](file:///c:/Users/user/Desktop/ekenesports/apps/admin/src/components/ui/data-table.tsx) | Active page button colour | 172 |
| [`page.tsx` (Dashboard)](file:///c:/Users/user/Desktop/ekenesports/apps/admin/src/app/[locale]/page.tsx) | Body text sizes, status badges, alert CTA | 73–80, 101, 248 |
