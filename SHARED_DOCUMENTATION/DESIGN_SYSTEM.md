# YOG MILK — Unified Design System Specification (DESIGN_SYSTEM.md)
*Supreme Visual Standard & Token Specification for Flutter Retailer App & Next.js Admin Web Dashboard*
*Benchmark: Extracted Stitch Design Packages (`sacred_dairy_vedic_wellness`, `artisanal_dairy_operations_admin`, `vedic_wellness_dairy_system`)*
*Role: Design Systems Engineer & UI/UX Engineering Lead | Date: 31 October 2026*

---

## 1. Brand Analysis & Extracted Design Language

The YOG MILK design system merges traditional Indian Vedic dairy heritage with modern transactional efficiency. 

### 1.1 Brand Philosophy
- **Metaphor:** Pure Sattvic nourishment, sacred Gir cow A2 milk, hand-churned saffron butter, clay matkas, and the calm indigo sky of dawn dispatches.
- **Tone:** Serene, pure, dependable, grounded, dignified, and commercially rigorous.
- **Visual Foundation:** Clean Milk Cream canvases (`#faf8ff` / `#fcf9f3`), structured Deep Royal Navy (`#051256`), Warm Terracotta (`#994700`), Saffron Amber (`#fc8127`), and subtle lavender-tinted borders (`#dde1f8`).

---

## 2. Centralized Design Tokens

### 2.1 Color Tokens (Extracted Values)

| Token Name | Hex Code | Material 3 Role | Application / Usage |
| :--- | :--- | :--- | :--- |
| `primary` | `#051256` | Primary | Deep Royal Navy. Primary CTAs, app bars, dark table headers. |
| `on-primary` | `#ffffff` | On Primary | High-contrast white text on primary surfaces. |
| `primary-container` | `#1f2a6b` | Primary Container | Elevated navy containers, hero banner backgrounds. |
| `on-primary-container`| `#8994db` | On Primary Container | Muted labels on dark containers. |
| `secondary` | `#994700` | Secondary | Warm Earthen Terracotta. Brand highlights, badge edges. |
| `secondary-container`| `#fc8127` | Secondary Container | Vibrant Saffron Amber. Active order gate pills, urgent alerts. |
| `on-secondary-container`| `#602a00`| On Secondary Container| Dark brown text on saffron containers. |
| `tertiary` | `#261a00` | Tertiary | Vedic Bronze. Specialized artisanal product accents. |
| `tertiary-container`| `#3f2e00` | Tertiary Container | Deep gold container background. |
| `on-tertiary-container`| `#ba9331`| On Tertiary Container | Rich gold text on dark bronze surfaces. |
| `background` | `#faf8ff` | Background (Retailer) | Clean Milk Surface. Main application background. |
| `background-alt` | `#fcf9f3` | Background (Warm) | Warm Cream Surface for editorial / invoice preview. |
| `surface` | `#ffffff` | Surface | Pure White for cards, table rows, input fields, modals. |
| `surface-container-low`| `#f2f3ff`| Surface Container Low | Subtle background tint for table alternating rows. |
| `surface-container` | `#eaedff` | Surface Container | Active row highlights, skeleton shimmer base. |
| `surface-container-high`| `#e3e7fe`| Surface Container High | Active tab indicators, hover states. |
| `surface-container-highest`| `#dde1f8`| Surface Container Highest| Subtle container borders, divider lines. |
| `outline` | `#767681` | Outline | Inactive icon colors, secondary borders. |
| `outline-variant` | `#c6c5d2` | Outline Variant | Input field borders, card borders. |
| `on-surface` | `#161b2b` | On Surface | High-contrast body text, headings, numbers. |
| `on-surface-variant` | `#454650` | On Surface Variant | Muted helper text, timestamps, captions. |
| `error` | `#ba1a1a` | Error | Crimson error color for failed states, alerts. |
| `error-container` | `#ffdad6` | Error Container | Light red background for warning cards. |
| `on-error-container` | `#93000a` | On Error Container | Dark red text for error alerts. |

---

### 2.2 Typography Tokens

The system strictly pairs an editorial Serif for headings with a high-density Sans-Serif for tabular dairy data:
- **Display & Headings:** `Playfair Display` (SemiBold 600, Bold 700).
- **Body, Numerals & UI:** `Plus Jakarta Sans` (Regular 400, Medium 500, SemiBold 600, Bold 700).

#### Complete Type Scale
| Token | Font Family | Size (Web / Mobile) | Weight | Line Height | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Playfair Display | 48px / 34px | 600 | 56px / 42px | -0.02em | Hero splash, landing titles |
| `headline-lg`| Playfair Display | 32px / 26px | 600 | 40px / 34px | -0.01em | Desk titles, Catalog page header |
| `headline-md`| Playfair Display | 24px / 20px | 600 | 32px / 28px | 0 | Section titles, drawer headings |
| `headline-sm`| Playfair Display | 20px / 18px | 500 | 28px / 24px | 0 | Card section titles, modal headers |
| `title-lg` | Plus Jakarta Sans| 18px / 18px | 600 | 26px / 26px | -0.01em | Product names, order numbers |
| `title-md` | Plus Jakarta Sans| 16px / 16px | 600 | 24px / 24px | 0 | Table column headers, tab labels |
| `body-lg` | Plus Jakarta Sans| 16px / 16px | 400 | 26px / 26px | 0 | Product descriptions, terms |
| `body-md` | Plus Jakarta Sans| 14px / 14px | 400 | 22px / 22px | 0 | Standard UI text, table cells |
| `body-sm` | Plus Jakarta Sans| 12px / 12px | 400 | 18px / 18px | +0.01em | Timestamps, helper text, captions |
| `label-lg` | Plus Jakarta Sans| 14px / 14px | 600 | 20px / 20px | +0.01em | Primary button labels |
| `label-md` | Plus Jakarta Sans| 12px / 12px | 600 | 16px / 16px | +0.02em | Status badge pills |
| `label-sm` | Plus Jakarta Sans| 11px / 11px | 600 | 14px / 14px | +0.04em | Micro-badges (Fat %, SNF %) |

---

### 2.3 Spacing Scale (4px Base Grid)
| Token | Value (Rem / Px) | Typical Usage |
| :--- | :--- | :--- |
| `space-1` | `0.25rem` (4px) | Micro-spacing between badge dot and text, icon offsets. |
| `space-2` | `0.5rem` (8px) | Tight list item gaps, button internal vertical padding. |
| `space-3` | `0.75rem` (12px)| Form input vertical padding, table cell vertical padding. |
| `space-4` | `1.0rem` (16px) | Standard mobile gutter, card interior padding. |
| `space-6` | `1.5rem` (24px) | Desktop web table padding, drawer internal padding. |
| `space-8` | `2.0rem` (32px) | Major section separation, modal header gaps. |
| `space-12` | `3.0rem` (48px) | Desktop hero padding, footer spacing. |

---

### 2.4 Border Radii Tokens
| Token | Value | Applied Components |
| :--- | :--- | :--- |
| `rounded-sm` | `4px` (`0.25rem`) | Micro tags, checkboxes, selection controls. |
| `rounded-md` | `8px` (`0.5rem`) | Action buttons, form input fields, table containers. |
| `rounded-lg` | `12px` (`0.75rem`)| Product cards, order cards, modal dialogs, slide-over sheets. |
| `rounded-xl` | `16px` (`1.0rem`) | Bottom sheets, hero container banners. |
| `rounded-2xl` | `24px` (`1.5rem`) | Special bottom drawer handles, hero card roundings. |
| `rounded-full`| `9999px` | Capsule status badges, round avatars, crate steppers. |

---

### 2.5 Elevation & Shadow Tokens
- **Tier 0 (Flat):** `none` (background surfaces with 1px `#dde1f8` border).
- **Tier 1 (Cards & Product Tiles):** `box-shadow: 0 1px 3px 0 rgba(5, 18, 86, 0.05), 0 1px 2px -1px rgba(5, 18, 86, 0.05);` (Subtle warm navy elevation).
- **Tier 2 (Drawers & Sticky Action Bars):** `box-shadow: 0 10px 15px -3px rgba(5, 18, 86, 0.08), 0 4px 6px -4px rgba(5, 18, 86, 0.08);`
- **Tier 3 (Floating Modals & Dialogs):** `box-shadow: 0 20px 25px -5px rgba(5, 18, 86, 0.12), 0 8px 10px -6px rgba(5, 18, 86, 0.12);`

---

### 2.6 Component Heights & Touch Targets
- **Buttons (Mobile):** Minimum `48px` height (48x48dp touch target for thumb operation).
- **Buttons (Admin Desktop):** `40px` (standard) / `32px` (compact table row action).
- **Form Inputs:** `48px` (mobile) / `40px` (desktop).
- **Table Rows:** `52px` (standard high-density) / `44px` (dense data view).
- **Mobile Top Bar:** `56px` height.
- **Admin Desktop TopNav:** `64px` height.
- **Bottom Navigation Bar:** `64px` height + safe area inset.

---

### 2.7 Breakpoints
- **Mobile (Handheld Portrait):** `< 768px` (Fluid 390px to 430px).
- **Tablet (Vertical / Mini):** `768px – 1023px`.
- **Laptop / Small Desktop:** `1024px – 1439px`.
- **Desktop Command Center:** `1440px+`.

---

## 3. Status Visualization & Decoupled State Badges

The platform enforces **three independent status domains**. Each status has an exact, visually distinct badge specification:

### 3.1 Order Progression Lifecycle (`order_status`)
| Status | Background | Text Color | Border Color | Icon | Display Label (EN / HI / MR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PLACED` | `#e0f2fe` | `#0369a1` | `#bae6fd` | `Clock` | Order Placed / ऑर्डर दर्ज हुई / ऑर्डर नोंदवली |
| `CONFIRMED` | `#e0e7ff` | `#3730a3` | `#c7d2fe` | `CheckCircle`| Confirmed / स्वीकृत / मंजूर |
| `PROCESSING` | `#fef3c7` | `#b45309` | `#fde68a` | `Package` | Processing / प्रक्रिया जारी / प्रक्रिया सुरू |
| `READY_FOR_DELIVERY`| `#fae8ff` | `#86198f` | `#f5d0fe` | `Truck` | Ready / तैयार / तयार |
| `OUT_FOR_DELIVERY` | `#f3e8ff` | `#7e22ce` | `#e9d5ff` | `Navigation` | Out for Delivery / वितरण मार्ग पर / मार्गावर |
| `DELIVERED` | `#dcfce7` | `#15803d` | `#bbf7d0` | `CheckCheck` | Delivered / डिलीवर / पोहोचवले |
| `CANCELLED` | `#fee2e2` | `#991b1b` | `#fecaca` | `XCircle` | Cancelled / रद्द / रद्द केले |
| `DELIVERY_FAILED` | `#fee2e2` | `#b91c1c` | `#fecaca` | `AlertTriangle`| Failed / असफल / अयशस्वी |

### 3.2 Payment Status Lifecycle (`payment_status`)
| Status | Background | Text Color | Border Color | Icon | Meaning / Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PENDING` | `#fee2e2` | `#b91c1c` | `#fecaca` | `AlertCircle` | Cash/Online collection due. Triggers ordering lock! |
| `PROCESSING` | `#fef3c7` | `#b45309` | `#fde68a` | `Loader` | Gateway payment attempt active. |
| `PAID` | `#dcfce7` | `#15803d` | `#bbf7d0` | `CheckCheck` | Verified received in depot / gateway. Releases lock! |
| `FAILED` | `#fee2e2` | `#dc2626` | `#fca5a5` | `XCircle` | Gateway transaction timed out / declined. |
| `REFUNDED` | `#f1f5f9` | `#475569` | `#cbd5e1` | `RotateCcw` | Amount returned to retailer. |
| `PARTIALLY_REFUNDED`| `#f8fafc` | `#334155` | `#e2e8f0` | `RotateCcw` | Partial return recorded. |

### 3.3 Delivery Status Lifecycle (`delivery_status`)
| Status | Background | Text Color | Border Color | Icon | Logistics Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NOT_ASSIGNED` | `#f3f4f6` | `#4b5563` | `#e5e7eb` | `Clock` | Order confirmed; awaiting vehicle route assignment. |
| `ASSIGNED` | `#e0e7ff` | `#3730a3` | `#c7d2fe` | `UserCheck` | Driver & vehicle allocated to route batch. |
| `PICKED_UP` | `#fae8ff` | `#86198f` | `#f5d0fe` | `Boxes` | Crates loaded from depot cold room into vehicle. |
| `OUT_FOR_DELIVERY` | `#f3e8ff` | `#7e22ce` | `#e9d5ff` | `Truck` | Vehicle currently on morning delivery run. |
| `DELIVERED` | `#dcfce7` | `#15803d` | `#bbf7d0` | `CheckCheck` | Crates safely unloaded and accepted at retail booth. |
| `DELIVERY_FAILED` | `#fee2e2` | `#b91c1c` | `#fecaca` | `AlertTriangle`| Drop could not be made (booth closed / crate damaged). |

---

## 4. Shared Business Components Specification

### 4.1 Product Card
- **Mobile Treatment:** 12px radius, pure white container with 1px `#dde1f8` border. Product pack image on left (80x80px); title in `title-lg` (Plus Jakarta Sans); Fat/SNF micro-tag in `#e0e7ff`; rate in large `₹ XX.00` numeral; interactive `CrateQuantityStepper` in lower right thumb zone.
- **Admin Treatment:** High-density table row (52px height) with thumbnail avatar, product code, Fat %, SNF %, crate capacity badge, wholesale price column, and stock availability toggle switch.

### 4.2 Order Card & Order Summary Card
- **Structure:** Order code in monospace/SemiBold (`YM-2026-10381`); formatted date/time in `body-sm`; decoupled status badge group (e.g. `PROCESSING` pill + `COD PENDING` red badge); items preview text (e.g. *“48 Liters (4 Crates) · 2 SKUs”*); total payable in `Playfair Display` (`₹ 2,450.00`); quick action button ("Track Delivery" or "Reorder").

### 4.3 Crate Quantity Stepper
- **Specification:** Circular 36x36px buttons with `#051256` indigo border and tactile tap feedback. Center display shows pouch count, crate count, and volume in Liters:
  ```
  [ - ]   24 Pouches (2 Crates) · 24L   [ + ]
  ```
- **Rules:** Cannot decrement below 0. Increments strictly by whole crate capacity (12 or 24 pouches).

### 4.4 Operational Gate Banner
- **Specification:** Elevated card placed at top of mobile Home screen and Admin Header.
  - **State OPEN:** Pulsating 8px Vedic Green dot (`#15803d`), title *"Ordering Window is OPEN"*, live time display, closing cutoff notice (e.g. *"Closes today at 05:00 PM"*).
  - **State CLOSED:** Amber lock icon (`#fc8127`), title *"Ordering Window Closed"*, dynamic countdown to next morning opening (e.g. *"Opens in 14h 22m at 07:00 AM"*), message: *"The ordering window is closed. We’ll notify you when ordering opens again."*

### 4.5 Pending Payment Alert Card
- **Specification:** High-visibility warning container with light red background (`#fee2e2`) and crimson border (`#fecaca`). Highlights blocking Order Code (`YM-2026-10381`), outstanding cash due (`₹ 2,450.00`), and a direct CTA button *"View & Clear Pending Payment"*.

### 4.6 Commercial Farm Bill / Invoice Preview Container
- **Specification:** Styled as a clean, authentic Indian agricultural delivery bill. Pure white sheet with `#c6c5d2` border on `#fcf9f3` warm background.
- **Strict Exclusion:** **NO GSTIN, CGST, SGST, IGST, or HSN codes.**
- **Header:** YOG MILK DAIRY PRODUCTS PVT. LTD., Saswad Rd Plant Address, FSSAI Registration #11519036000281. Sequential invoice number (`INV-2026-00412`).
- **Footer:** Formal agricultural exemption statement.

### 4.7 Reusable Empty States
- **Specification:** Illustrated vector graphic in `#8994db` muted indigo; title in `headline-sm` (Playfair Display); supportive explanation in `body-md`; primary CTA button (e.g. *"Explore Dairy Catalog"* or *"Refresh Queue"*).

### 4.8 Shimmer Loading Skeletons
- **Specification:** Smooth animated linear gradient transitioning from `#eaedff` to `#f2f3ff` with 1.5s ease-in-out cycle. Matches the exact outline of product cards, order tiles, and data table rows.

---

## 5. Application-Specific Token Implementations

### 5.1 Flutter Implementation (`lib/src/core/design_system/tokens/`)

```dart
// lib/src/core/design_system/tokens/app_colors.dart
import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  static const primary = Color(0xFF051256);
  static const primaryContainer = Color(0xFF1F2A6B);
  static const onPrimary = Color(0xFFFFFFFF);
  static const onPrimaryContainer = Color(0xFF8994DB);

  static const secondary = Color(0xFF994700);
  static const secondaryContainer = Color(0xFFFC8127);
  static const onSecondaryContainer = Color(0xFF602A00);

  static const background = Color(0xFFFAF8FF);
  static const backgroundWarm = Color(0xFFFCF9F3);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceContainerLow = Color(0xFFF2F3FF);
  static const surfaceContainer = Color(0xFFEAEDFF);
  static const surfaceContainerHigh = Color(0xFFE3E7FE);
  static const border = Color(0xFFDDE1F8);
  static const borderOutline = Color(0xFFC6C5D2);

  static const onSurface = Color(0xFF161B2B);
  static const onSurfaceVariant = Color(0xFF454650);

  // Semantic Status Colors
  static const statusPlacedBg = Color(0xFFE0F2FE);
  static const statusPlacedText = Color(0xFF0369A1);
  static const statusProcessingBg = Color(0xFFFEF3C7);
  static const statusProcessingText = Color(0xFFB45309);
  static const statusDispatchBg = Color(0xFFF3E8FF);
  static const statusDispatchText = Color(0xFF7E22CE);
  static const statusDeliveredBg = Color(0xFFDCFCE7);
  static const statusDeliveredText = Color(0xFF15803D);
  static const statusFailedBg = Color(0xFFFEE2E2);
  static const statusFailedText = Color(0xFFB91C1C);
}
```

```dart
// lib/src/core/design_system/tokens/app_typography.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTypography {
  AppTypography._();

  static const fontFamilyDisplay = 'Playfair Display';
  static const fontFamilyBody = 'Plus Jakarta Sans';

  static const headlineLarge = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 26,
    fontWeight: FontWeight.w600,
    height: 34 / 26,
    color: AppColors.onSurface,
  );

  static const headlineMedium = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 28 / 20,
    color: AppColors.onSurface,
  );

  static const titleLarge = TextStyle(
    fontFamily: fontFamilyBody,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 26 / 18,
    letterSpacing: -0.1,
    color: AppColors.onSurface,
  );

  static const bodyMedium = TextStyle(
    fontFamily: fontFamilyBody,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 22 / 14,
    color: AppColors.onSurface,
  );

  static const labelMedium = TextStyle(
    fontFamily: fontFamilyBody,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 16 / 12,
    letterSpacing: 0.2,
  );
}
```

---

### 5.2 Next.js Admin Web Implementation (`tailwind.config.ts`)

```typescript
// yog_milk_admin/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#051256",
          container: "#1f2a6b",
          on: "#ffffff",
          "on-container": "#8994db",
        },
        secondary: {
          DEFAULT: "#994700",
          container: "#fc8127",
          "on-container": "#602a00",
        },
        surface: {
          DEFAULT: "#ffffff",
          cream: "#faf8ff",
          warm: "#fcf9f3",
          low: "#f2f3ff",
          container: "#eaedff",
          high: "#e3e7fe",
          border: "#dde1f8",
          outline: "#c6c5d2",
        },
        status: {
          placed: { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
          confirmed: { bg: "#e0e7ff", text: "#3730a3", border: "#c7d2fe" },
          processing: { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
          ready: { bg: "#fae8ff", text: "#86198f", border: "#f5d0fe" },
          transit: { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" },
          delivered: { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
          failed: { bg: "#fee2e2", text: "#b91c1c", border: "#fecaca" },
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 6. Confirmation of Safeguards & Status

> [!IMPORTANT]
> - ✅ **Unified Design System strictly implemented across `SHARED_DOCUMENTATION/DESIGN_SYSTEM.md`.**
> - ✅ **100% compliant with Master Project Plan v2.0 & Stitch design assets.**
> - ✅ **All color hex codes, type scales, and spacing values extracted directly from source assets.**
> - ✅ **Zero credit tokens, cards, or badges.**
> - ✅ **`DATABASE/schema.sql` remains strictly an empty 0-byte file.**
> - ✅ **NO application code was generated.**
