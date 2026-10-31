---
name: Artisanal Dairy Operations Admin
colors:
  surface: '#faf8ff'
  surface-dim: '#d5d9ef'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e3e7fe'
  surface-container-highest: '#dde1f8'
  on-surface: '#161b2b'
  on-surface-variant: '#454650'
  inverse-surface: '#2b3041'
  inverse-on-surface: '#eef0ff'
  outline: '#767681'
  outline-variant: '#c6c5d2'
  surface-tint: '#4f599c'
  primary: '#051256'
  on-primary: '#ffffff'
  primary-container: '#1f2a6b'
  on-primary-container: '#8994db'
  inverse-primary: '#bbc3ff'
  secondary: '#535b8e'
  on-secondary: '#ffffff'
  secondary-container: '#bcc3fd'
  on-secondary-container: '#474f81'
  tertiary: '#331300'
  on-tertiary: '#ffffff'
  tertiary-container: '#532300'
  on-tertiary-container: '#ef771c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#051256'
  on-primary-fixed-variant: '#374183'
  secondary-fixed: '#dee0ff'
  secondary-fixed-dim: '#bcc3fd'
  on-secondary-fixed: '#0e1647'
  on-secondary-fixed-variant: '#3b4375'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb68b'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753400'
  background: '#faf8ff'
  on-background: '#161b2b'
  surface-variant: '#dde1f8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  numeric-tabular:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-xxl: 3rem
---

## Brand & Style

This design system establishes a refined merchant operations interface for managing artisanal dairy commerce. Blending the utilitarian efficiency of modern merchant back-offices with the heritage prestige of small-batch dairy producers, the aesthetic pairs structured data workflows with warm, editorial craftsmanship.

The visual style merges **Corporate / Modern** commerce architecture with **Editorial Warmth**. The experience avoids sterile cold grays in favor of warm buttermilk backdrops, deep maritime navy structural framing, and deliberate saffron callouts. High-contrast typography pairs an authoritative high-contrast serif for headings with a legible, rounded geometric sans-serif for high-density administrative tabular data, invoices, and status monitors.

The emotional signature is dependable, orderly, and authentic. The interface instills calm confidence during high-volume morning fulfillment runs, dispatch processing, and batch reconciliations.

## Colors

The palette establishes crisp data hierarchy anchored by naval authority and warm dairy tones:

- **Primary Canvas & Surfaces**: Base backdrop is canvas `#FFFCF6`, providing a soft, non-fatiguing reading environment. Cards and operational panels sit on crisp white `#FFFFFF` or elevated warm cream `#FBF1DC` for metadata panels and balance receipts.
- **Structural Foundations**: `#1F2A6B` serves as the primary action tone, brand headers, and primary interactive nodes. Deep navy `#151D4D` anchors navigational chrome, mastheads, and selected sidebar states.
- **Accents**: Saffron `#F47B20` is reserved strictly for high-urgency notifications, order exceptions, and active system alerts. Gold `#C9A03D` is applied selectively for heritage stamps, decorative badges, and premium tier monograms.
- **Typography & Borders**: Primary text resolves to `#1B2030` for maximum contrast and high legibility. Borders rely on `#E5E7EB` to segment tables without creating visual cage effects.
- **Operational Status**:
  - `Fulfilled / Verified / Paid`: Success `#1F9D63`
  - `Pending / In-Transit / Batching`: Amber `#E8A317`
  - `Canceled / Spoiled / Payment Void`: Error `#D64545`

## Typography

The type system creates an intentional juxtaposition between high-end editorial heritage and structured merchant execution:

- **Editorial Headings (`Playfair Display`)**: Applied to invoice headers, section titles, shop metrics, and top-level operational modules. It conveys tradition, care, and artisanal provenance without compromising vertical density.
- **Operational Text (`Plus Jakarta Sans`)**: Applied across all body copy, tabular lists, forms, and button actions. Its geometric balance ensures legibility across batch SKU listings and dense line-item receipts.
- **Tabular Numerics**: Line items, product quantities, milk volume tiers (liters, gallons), and non-GST invoice line calculations enforce monospace figures (`font-variant-numeric: tabular-nums`) to maintain vertical column alignment.
- **Product Nomenclature Rule**: Dairy SKU listings must follow strict neutral naming without conversational marketing flourishes (e.g., `Standardized Whole Milk 3.5% Fat - 1L Glass Bottle`, `Raw A2 Farm Pasteurized - 500ml`).

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid system pinned to a maximum container width of 1440px on desktop screens, ensuring wide data tables remain cohesive and scans are comfortable.

- **Desktop (1024px+)**: 12 columns, 24px (`1.5rem`) gutters, and 32px (`2rem`) outer canvas margins. Sidebars remain persistently docked at 260px width.
- **Tablet (768px - 1023px)**: 8 columns, 16px (`1rem`) gutters, and 24px (`1.5rem`) outer margin. Sidebars collapse to icon-only navigation or drawer menus.
- **Mobile (<768px)**: 4 columns, 12px (`0.75rem`) gutters, and 16px (`1rem`) screen margins. Complex tables convert to stacked summary order cards.

Component layout relies on the 8px baseline rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px). Tight data cells utilize `space-xs` and `space-sm` vertical padding to ensure dense tabular utility.

## Elevation & Depth

Visual hierarchy is primarily driven through **low-contrast outlines combined with subtle ambient shadows**. Flatness ensures fast administrative scan rates, while gentle depth accents identify interactive or floating layers.

- **Level 0 (Flat / Canvas)**: Page background `#FFFCF6`. No border or shadow.
- **Level 1 (Panels & Cards)**: Surface `#FFFFFF` bordered with 1px solid `#E5E7EB`. Subtle ambient drop shadow: `0px 1px 3px rgba(27, 32, 48, 0.04), 0px 1px 2px rgba(27, 32, 48, 0.02)`.
- **Level 2 (Popovers, Flyouts, Filter Menus)**: Surface `#FFFFFF`, border `#D1D5DB`, shadow: `0px 4px 12px -2px rgba(21, 29, 77, 0.08), 0px 2px 6px -1px rgba(21, 29, 77, 0.04)`.
- **Level 3 (Modals & Slide-over Sheets)**: Surface `#FFFFFF`, backdrop overlay `rgba(21, 29, 77, 0.45)`, shadow: `0px 12px 28px -4px rgba(21, 29, 77, 0.16)`.

## Shapes

The interface adheres to a **Soft (`1`)** shape language. This creates a balanced, crisp look suited for dense business tools while retaining approachable corners.

- **Standard Elements (Buttons, Inputs, Selects)**: `rounded` (`0.25rem` / 4px).
- **Cards, Modals & Data Tables**: `rounded-lg` (`0.5rem` / 8px).
- **Hero Banners & Receipt Containers**: `rounded-xl` (`0.75rem` / 12px).
- **Status Badges & Pills**: Handled via compact `0.25rem` rounding to preserve an administrative document feel, avoiding overly playful full-pill rounding in core transactional flows.

## Components

### Buttons
- **Primary**: Solid navy `#1F2A6B` background, `#FFFFFF` text, `0.25rem` radius. On hover: `#151D4D`. Focus state: 2px ring offset in `#FFFCF6` with 2px solid `#1F2A6B`.
- **Secondary**: Crisp white `#FFFFFF` surface with 1px border `#E5E7EB`, text `#1B2030`. On hover: `#FBF1DC` border `#D1D5DB`.
- **Destructive**: Bordered or filled `#D64545` with white or red-600 text, reserved exclusively for irreversible actions (e.g., voiding unfulfilled batch records).
- **Alert / Action Highlight**: Reserved for critical prompts via `#F47B20` with white text. Used only when manual intervention is blocking dispatches.

### Input Fields & Controls
- **Inputs**: Background `#FFFFFF`, border 1px `#E5E7EB`, text `#1B2030`, padding `0.5rem 0.75rem`. Focused border shifts to `#1F2A6B` with a soft 1px glow.
- **Checkboxes & Radios**: 16px square/circle with a 1.5px border in `#D1D5DB`. Checked state displays solid `#1F2A6B` with a white checkmark or center pip.

### Automatic Read-Only Ordering Status Pills
Status pills represent automated system state machines and are strictly non-editable tags:
- **Confirmed / Harvested / Delivered**: Light green background (`#E8F6EE`), text `#1F9D63`, 1px border `rgba(31, 157, 99, 0.2)`.
- **Processing / Batch Pasteurizing**: Warm amber background (`#FDF6E8`), text `#B87B07`, 1px border `rgba(232, 163, 23, 0.2)`.
- **Payment Pending / Exception**: Light red background (`#FDECEC`), text `#D64545`, 1px border `rgba(214, 69, 69, 0.2)`.

### Cards & Invoicing Panels
- **Plain Non-GST Invoices**: Set against a dedicated warm cream container (`#FBF1DC`) bordered with subtle `#E5E7EB`. Uses plain tax exemption declarations (`"Non-GST Supply: Fresh Raw/Standardized Farm Milk Under Exemption Schedule"`). Itemizations display SKU, unit volume, quantity, unit rate, and total net amount with zero tax lines.
- **Full-Balance Payment Badge**: System explicitly rejects partial-installment captures. Payment modules strictly feature a full-balance confirmation card stating `"Payment Status: Full Balance Settled"` with clear transaction timestamps and exact reference IDs.

### Data Tables & Product Listings
- Headers styled in uppercase `label-sm` with neutral background `#FBF1DC` or subtle `#F9FAFB`.
- Rows enforce alternating subtle dividers (`#E5E7EB`). Hover states apply subtle warm tinting (`#FFFCF6`).
- Standardized neutral dairy labeling is enforced across all tables without adjectives (e.g., `Milk Whole Cow 1L`, `Curd Buffalo Unsweetened 500g`, `Paneer Fresh Vacuum 200g`).