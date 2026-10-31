# YOG MILK — Admin Web Dashboard Agent Operating Instructions (AGENTS.md)
*Application: YOG MILK Admin Web Dashboard (`yog_milk_admin`)*
*Role: Principal Frontend Architect & Senior UI Engineer*
*Framework: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui*
*Design Benchmark: `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform` (44 Screen References)*
*Source Baseline: Master Project Plan v2.0 (29 October 2026) & Root AGENTS.md*

---

## 1. Executive Identity, Business Role & Technology Stack

### 1.1 Commercial Mission
The **Admin Web Dashboard** is the central operational command center for YOG MILK dairy processing, logistics dispatch, and accounts reconciliation.

Authorized dairy operations staff (Warehouse Controllers, Dispatch Coordinators, Accounts Executives, and Platform Administrators) use this dashboard to oversee hundreds of dairy retail booths, manage daily milk volume quotas, adjust delivery routes, record cash collections, and monitor business analytics.

### 1.2 Technology Stack
- **Framework:** Next.js 14+ (App Router, Server and Client Components).
- **Core Library:** React 18+ with strict TypeScript (`strict: true`).
- **Styling & Design System:** Tailwind CSS with custom tokens matching Stitch assets.
- **Component Primitives:** shadcn/ui (Radix UI accessible primitives).
- **Iconography:** Lucide React (`lucide-react`).
- **Data Visualization & Analytics:** Recharts (`recharts`).
- **Form Management & Validation:** React Hook Form (`react-hook-form`) + Zod (`zod`).
- **Data Tables:** TanStack Table (`@tanstack/react-table`).
- **State Management & Mock Repositories:** In-memory mutable TypeScript state stores with simulated latency.

> [!NOTE]
> Exact dependency versions will be selected during Stage 1 initialization after validating environment compatibility.

### 1.3 Current Phase Constraint
> [!IMPORTANT]
> **CURRENT PHASE: RESPONSIVE ADMIN FRONTEND WITH MOCK DATA ONLY.**
> - **NO** Supabase integration, live PostgreSQL queries, or Edge Functions.
> - **NO** live Razorpay webhook handling or bank settlement APIs.
> - **NO** database migrations or SQL DDL (`DATABASE/schema.sql` MUST remain empty, 0 bytes).
> - All administrative actions (recording COD payment, progressing order status, assigning delivery routes, editing ordering schedules) mutate in-memory mock repositories.

### 1.4 Absolute Exclusion of Credit Features
> [!CAUTION]
> In accordance with Version 2.0 of the Master Project Plan, **all credit features have been permanently expunged from the platform**:
> - ❌ NO Credit Allocation, Credit Limits, or Credit Balances.
> - ❌ NO Credit Percentage or Earned Credit per order.
> - ❌ NO Credit Wallet, Credit Ledger, or Credit Expiry.
> - ❌ NO 7-Day Credit Payment Terms.
> - ❌ NO Credit-related dashboard cards, tables, columns, filters, or analytics.

---

## 2. Design Philosophy & Aesthetic Mandate

The dashboard must reflect the **Artisanal Dairy Operations** aesthetic extracted from `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/artisanal_dairy_operations_admin/DESIGN.md`.

It must communicate:
1. **Operational Control:** Real-time visibility into morning milk dispatches, warehouse processing, and order volume.
2. **Financial Clarity:** Explicit, uncompromised separation between Billed Order Value, Collected Cash, and Pending Receivables.
3. **Reliability & Trust:** Robust data tables, structured verification dialogs, and immutable audit trails.
4. **Efficiency:** High data density, keyboard-accessible filters, quick search, and slide-over drawers for rapid triage.

### 2.1 Color Palette & Semantic Tokens
- **Brand Primary:** `#051256` (Deep Royal Navy — Sidebar, main headings, primary buttons).
- **Primary Container:** `#1f2a6b` (Dark Blue elevated container with on-primary `#8994db`).
- **Brand Secondary / Accent:** `#994700` (Warm Terracotta) and `#fc8127` (Vibrant Saffron Amber).
- **Surfaces & Cards:** `#ffffff` (Pure White cards) on `#faf8ff` (Clean Milk Surface background).
- **Container Borders:** `#dde1f8` (Subtle lavender-tinted border) and `#c6c5d2` (Outline variant).
- **Typography Colors:** `#161b2b` (Deep Slate on-surface) and `#454650` (Muted Slate).
- **Status Badges:**
  - `INFO / PLACED`: Background `#e0f2fe`, Text `#0369a1` (Soft Blue)
  - `CONFIRMED`: Background `#e0e7ff`, Text `#3730a3` (Indigo)
  - `PROCESSING`: Background `#fef3c7`, Text `#b45309` (Amber Saffron)
  - `READY_FOR_DELIVERY`: Background `#fae8ff`, Text `#86198f` (Plum)
  - `OUT_FOR_DELIVERY`: Background `#f3e8ff`, Text `#7e22ce` (Royal Purple)
  - `DELIVERED` / `PAID`: Background `#dcfce7`, Text `#15803d` (Forest Green)
  - `FAILED` / `BLOCKED`: Background `#fee2e2`, Text `#b91c1c` (Crimson Error)

### 2.2 Typography Hierarchy
- **Editorial Headings & Metric Digits:** `Playfair Display` (SemiBold 600, Bold 700) — Distinctive artisanal presence.
- **Data Tables, Forms, Stats, UI Labels:** `Plus Jakarta Sans` (400, 500, 600, 700) — Ultra-clean tabular numerals and high-density data readability.

---

## 3. Reusable Component & Layout Architecture

To prevent code duplication, the dashboard relies on modular building blocks:

```
components/
├── ui/                                # shadcn/ui primitives
│   ├── button.tsx                     # Primary, secondary, outline, destructive, ghost
│   ├── badge.tsx                      # Pill status badges with dot indicators
│   ├── dialog.tsx                     # Centered modal dialogs (Verification, Status progression)
│   ├── sheet.tsx                      # Slide-over drawers (Delivery assignment, Record payment)
│   ├── table.tsx                      # Base table primitives (Header, Body, Row, Cell)
│   ├── input.tsx                      # High-density inputs with label and error state
│   ├── select.tsx                     # Dropdown selectors with search
│   ├── tabs.tsx                       # Filter tabs (All, Processing, Delivered, Cancelled)
│   ├── card.tsx                       # Metric cards, profile cards, chart containers
│   └── skeleton.tsx                   # Shimmer loading skeletons
│
├── layout/                            # Global shell layout
│   ├── Sidebar.tsx                    # Collapsible navigation with active route highlights & badges
│   ├── Header.tsx                     # TopNav with search, notification bell, time display, user menu
│   ├── Breadcrumbs.tsx                # Contextual breadcrumb navigation
│   ├── PageHeading.tsx                # Title, subtitle, and action buttons container
│   └── NotificationDrawer.tsx         # Flyout panel for operational alerts
│
└── features/                          # Domain-specific operational widgets
    ├── metrics/                       # MetricCard, MetricGrid, VolumeGauge
    ├── tables/                        # DataTable (TanStack Table wrapper with sorting/filtering)
    ├── retailers/                     # RetailerVerificationModal, Retailer360Summary
    ├── orders/                        # OrderStatusModal, OrderTimelineViewer
    ├── deliveries/                    # UpdateDeliveryDrawer, RouteAssignmentForm
    ├── payments/                      # RecordPaymentDrawer, OutstandingQueueCard
    ├── schedule/                      # ScheduleConfigForm, HolidayClosureModal
    ├── invoices/                      # FarmBillViewer, BatchInvoicePrintQueue
    └── notifications/                 # AnnouncementComposerModal
```

---

## 4. Approved Admin Modules & Route Specifications

The application implements all 27 operational modules without omission:

```
app/
├── (auth)/
│   └── login/                         # Simulated staff sign-in with role switcher
│
└── (dashboard)/
    ├── page.tsx                       # 1. Operations Overview Dashboard
    │
    ├── retailers/
    │   ├── page.tsx                   # 2. Retailer Management & Verification Queue
    │   └── [id]/page.tsx              # 3. Retailer 360° Profile (Complete History)
    │
    ├── catalog/
    │   ├── page.tsx                   # 4. Product Catalog Management (SKUs, Fat/SNF, Crates)
    │   ├── new/page.tsx               # 5. Product Creation Modal / Form
    │   ├── [id]/page.tsx              # 6. Product Edit & Pricing Manager
    │   └── categories/page.tsx        # 7. Category Taxonomy Management
    │
    ├── orders/
    │   ├── page.tsx                   # 8. Live Orders Queue (Status Tabs, Multi-filter)
    │   └── [id]/page.tsx              # 9. Order Details & Snapshot Viewer
    │                                  # 10. Order Status Management (Dialog on details)
    │
    ├── payments/
    │   ├── page.tsx                   # 11. Payment Records Ledger
    │   ├── pending/page.tsx           # 12. Outstanding Payments Queue (COD Pending)
    │   └── [id]/page.tsx              # 13. Payment Details & Receipt Voucher Viewer
    │                                  # 14. Record Payment Modal (Drawer on queue)
    │
    ├── deliveries/
    │   ├── page.tsx                   # 15. Logistics Dispatch Desk & Route Queue
    │   └── [id]/page.tsx              # 16. Delivery Details & Route Tracking Drawer
    │
    ├── invoices/
    │   ├── page.tsx                   # 17. Commercial Invoices Listing
    │   └── [id]/page.tsx              # 18. Non-GST Farm Bill Preview & PDF Viewer
    │
    ├── notifications/
    │   └── page.tsx                   # 19. Notification Center & Broadcast Composer
    │
    ├── reports/
    │   ├── page.tsx                   # 20. Business & Operations Analytics (Volume, Fulfillment)
    │   └── exports/page.tsx           # 21. Reports & Data Exports Desk (CSV/PDF)
    │
    ├── audit/
    │   └── page.tsx                   # 22. Append-Only Administrative Security Audit Log
    │
    ├── schedule/
    │   └── page.tsx                   # 23. Operational Gate Ordering Schedule Settings
    │
    └── settings/
        ├── page.tsx                   # 24. General Business Settings (Plant address, FSSAI)
        └── rbac/page.tsx              # 25. Admin Accounts & RBAC Permissions Management
```

---

## 5. Dashboard Specific Metrics & Financial Clarity

The Operations Overview Dashboard (`/`) must present **explicit, uncompromised metrics**:

### 5.1 Volume & Fulfillment Metrics
- **Orders Today:** Total count of orders placed in the current operating cycle (e.g. `84 Orders`).
- **Orders Awaiting Action:** Orders in `PLACED` requiring warehouse acceptance (e.g. `12 Orders`).
- **Orders Processing:** Orders currently being packaged in cold rooms (e.g. `36 Orders`).
- **Deliveries Due:** Morning logistics dispatches scheduled (e.g. `48 Routes`).
- **Delivered Orders:** Successfully delivered order batches (e.g. `36 Delivered`).
- **Active Retailers:** Verified commercial milk parlors and kiranas (e.g. `156 Retailers`).
- **Total Milk Volume Demanded:** Sum of all pouch/crate volumes in Liters (e.g. `4,850 Liters`).

### 5.2 Mandatory Financial Separation
> [!CRITICAL]
> **NEVER TREAT THESE THREE METRICS AS INTERCHANGEABLE:**
> 1. **ORDER VALUE:** Total gross sales amount of all orders placed (e.g. `₹ 2,48,500.00`).
> 2. **PAYMENTS COLLECTED:** Actual verified cash/online funds confirmed in company accounts (e.g. `₹ 1,84,200.00`).
> 3. **OUTSTANDING BALANCE:** Total unpaid receivables due / COD pending collection (e.g. `₹ 64,300.00`).

Metric cards must clearly pair **Order Value vs. Payments Collected** and display the net **Outstanding Balance** with an alert badge if receivables exceed operational safety limits.

### 5.3 Charts (Recharts)
- **Daily Milk Volume Trend:** Stacked Area Chart showing Cow Milk (Liters) vs. Buffalo Milk (Liters) over the past 14 days.
- **Sales vs. Cash Collection:** Bar Chart comparing daily Gross Order Value vs. Cash Collected.
- **Product Distribution:** Donut Chart displaying sales volume across Categories (Pouch Milk, Artisanal Ghee, Malai Paneer, Dahi, Butter/Taak).

---

## 6. Retailer 360° Profile Requirements

The retailer detail page (`/retailers/[id]`) is the complete customer lifecycle record:

### 6.1 Profile Header & Risk Summary
- **Shop Name & Owner:** e.g. "Om Sai Dairy & Sweets" (Owner: Suresh Ganpat Patil).
- **Contact Details:** Phone (+91 98220 12345), Email, Delivery Address (Shop 4, Kothrud, Pune - 411038).
- **FSSAI License:** 14-digit registration number.
- **Account Status Badge:** `APPROVED`, `PENDING_APPROVAL`, `SUSPENDED`, `REJECTED`.
- **Payment Risk Indicator:** If `pendingBalance > 0`, display a prominent warning:
  > *⚠️ "Payment Pending — Ordering Blocked (Order #YM-2026-10381, ₹ 2,450.00)"*
- **Quick Actions:** "Record Offline Payment", "Suspend Account", "Edit Business Details".

### 6.2 Key Customer Metrics
- Total Orders Placed (Lifetime count).
- Total Billed Value (₹ Lifetime).
- Payments Received (₹ Lifetime).
- Outstanding Balance Due (₹).
- Lifetime Milk Volume Purchased (Total Liters).
- Last Order Date & Reference Code.
- Last Payment Date & Voucher Reference.

### 6.3 Deep Historical Tabs
1. **Order History:** TanStack Table of all historical orders with Order Code, Date, Item Count, Total (₹), Order Status badge, Payment Status badge, and View button.
2. **Payment History:** Ledger of all payments (Online Razorpay and recorded COD cash collections) with Receipt Voucher, Timestamp, Recorded By Admin ID, and Amount.
3. **Delivery History:** Dispatch log showing assigned routes, drivers, vehicle numbers, and delivery confirmation timestamps.
4. **Invoice History:** Table of issued non-GST commercial bills with one-click PDF preview/download.
5. **Purchase Analytics:** Monthly volume chart (Liters) and top ordered SKUs breakdown.
6. **Activity Timeline:** Audit log of account events (registration date, verification by admin, account suspensions, payment clearings).

---

## 7. Interaction & Mock State Mutation Requirements

Every interactive element in the dashboard must mutate the mock state in memory. **Dead buttons or no-op controls are strictly prohibited.**

### 7.1 Required Interactive Workflows
1. **Change Order Status:**
   - In Order Details, clicking "Advance Status" opens the `OrderStatusModal`.
   - Enforces valid transitions: `PLACED` → `CONFIRMED` → `PROCESSING` → `READY_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`.
   - Captures staff notes and updates the order status and timeline in memory.
2. **Record Mock COD Payment:**
   - On the Outstanding Payments Queue or Retailer 360°, clicking "Record Payment" opens `RecordPaymentDrawer`.
   - Admin enters: Amount Collected (₹), Receipt/Voucher Number, Collection Date/Time, and Staff Notes.
   - Submitting updates Payment Status to `PAID`, logs an entry in `payments` and `audit_logs`, and **immediately clears the retailer's pending payment block** in mock storage!
3. **Operational Gate (Ordering Schedule Settings):**
   - In `/schedule`, editing recurring opening time (e.g. 07:00 AM) or closing time (e.g. 05:00 PM) and saving updates the global schedule state.
   - Adding a holiday closure (e.g. "Diwali Processing Maintenance") sets the system status to `CLOSED` for that date window.
   - **NO MANUAL MASTER ON/OFF SWITCH:** The UI emphasizes automated schedule evaluation based on `Asia/Kolkata` time.
4. **Retailer Verification:**
   - In `/retailers`, pending applications open the `RetailerVerificationModal`.
   - Admin approves or rejects the shop; status updates to `APPROVED` and enables mock ordering eligibility.
5. **Product & Pricing Management:**
   - Add new dairy SKUs, edit wholesale prices (₹), update crate capacities, and toggle "Available in Stock" switch.
6. **Commercial Non-GST Invoice Preview:**
   - Clicking "View Invoice" renders the full-screen printable bill matching Stitch template `yog_milk_admin_invoices_non_gst_farm_bill_preview_1`.
   - Clicking "Print / Download PDF" triggers a browser print dialog with print-optimized CSS.
7. **Broadcast Notification Composer:**
   - Compose announcements and select target audience (`ALL_RETAILERS`, `SELECTED_CATEGORIES`). Submitting adds records to mock notifications.
8. **Confirmation Dialogs:**
   - Mandatory for destructive or sensitive operations (e.g. cancelling an order, suspending a retailer account, or modifying schedule hours).

---

## 8. Responsive Design & Viewport Support

The dashboard must provide a responsive experience across all screen sizes:

### 8.1 Desktop (1440px+) — Primary Command Center
- Persistent full-width sidebar (260px) with expandable module sections.
- Multi-column TanStack data tables with rich columns, badges, and action dropdowns.
- 4-column metric grids and side-by-side Recharts visualizations.

### 8.2 Laptop & Small Desktop (1024px – 1439px)
- Condensed sidebar (compact or icon-expandable).
- High-density table cell padding; secondary columns hidden or available via horizontal scroll.
- 2-column metric grids.

### 8.3 Tablet (768px – 1023px)
- Collapsible overlay drawer sidebar triggered via top bar hamburger menu.
- Data tables support smooth horizontal scrolling with sticky left-most column (Retailer / Order Code).
- Slide-over drawers expand to 75% screen width.

### 8.4 Mobile Browser (< 768px)
- Full-width mobile navigation drawer.
- Data tables adapt to **stacked responsive card layouts** showing Order Code, Retailer, Total, and Status Badge.
- Slide-overs adapt to full-screen modals.
- **Zero horizontal scroll on body:** All content strictly contained within viewport bounds.

---

## 9. Data Architecture & Separation of Concerns

```
yog_milk_admin/
├── lib/
│   ├── types/                         # Strongly typed TypeScript interfaces
│   │   ├── retailer.ts                # RetailerProfile, Address, Metrics
│   │   ├── product.ts                 # Product, Category, CrateRules
│   │   ├── order.ts                   # Order, OrderItem, OrderStatus, Timeline
│   │   ├── payment.ts                 # PaymentRecord, PaymentStatus
│   │   ├── delivery.ts                # DeliveryRecord, DeliveryStatus, Driver
│   │   ├── invoice.ts                 # CommercialInvoice, InvoiceItem
│   │   ├── schedule.ts                # OrderingSchedule, ScheduleException
│   │   ├── notification.ts            # NotificationItem, Announcement
│   │   └── audit.ts                   # AuditLogEntry, ActionType
│   │
│   ├── repositories/                  # Pure TypeScript repository contracts
│   │   ├── IRetailerRepository.ts
│   │   ├── IProductRepository.ts
│   │   ├── IOrderRepository.ts
│   │   ├── IPaymentRepository.ts
│   │   ├── IDeliveryRepository.ts
│   │   ├── IInvoiceRepository.ts
│   │   └── IScheduleRepository.ts
│   │
│   ├── mock/                          # In-memory mock repositories & seed datasets
│   │   ├── seed/                      # Authentic Maharashtra dairy seed data
│   │   ├── MockRetailerRepository.ts
│   │   ├── MockOrderRepository.ts
│   │   ├── MockPaymentRepository.ts
│   │   ├── MockDeliveryRepository.ts
│   │   ├── MockInvoiceRepository.ts
│   │   └── MockScheduleRepository.ts
│   │
│   └── utils/                         # Date/currency utilities
│       ├── currency.ts                # formatINR(2450) -> "₹ 2,450.00"
│       ├── date.ts                    # formatIST(timestamp) in Asia/Kolkata
│       └── export.ts                  # Mock CSV generator utility
```

### 9.1 Architecture Rules
1. **No Embedded Datasets in Pages:** Page components must never declare inline mock data arrays. All data must be fetched through repository contracts.
2. **Pluggable Architecture:** When the backend phase begins, Supabase repositories can drop into `lib/repositories/` without refactoring presentation components.

---

## 10. Business Rule Restrictions & Scope Boundaries

1. **Master Plan Compliance:** Follow `PROJECT_DOCUMENTATION/MASTER_PROJECT_PLAN.pdf` v2.0 without deviation.
2. **Zero Credit Implementation:** Never create credit balance cards, credit limit tables, credit percentage fields, or 7-day payment term indicators.
3. **Non-GST Commercial Invoices:** Never print GSTIN, CGST, SGST, IGST, or HSN tax codes. Invoices must be titled "Commercial Invoice" or "Farm Bill / Delivery Memo".
4. **No Real Payment Verification:** Clearly badge mock payment screens with a developer notice: `[MOCK PROTOTYPE — No Real Payment Verified]`.
5. **No Manual Master Switch:** Ordering schedule must operate automatically from recurring hours and scheduled exceptions.

---

## 11. Staged Implementation Control

Development proceeds in strictly controlled stages:

```
Stage 1: Admin Scaffolding & Design System Foundations (Next.js init, Tailwind tokens, App Shell)
Stage 2: Core Mock Data Engines & Typed Repositories (Seed SKUs, Retailers, Orders, Latency)
Stage 4.1: Dashboard Overview & Metric Cards (Orders Today, Volume, Financial Separation, Recharts)
Stage 4.2: Retailer Management & Retailer 360° Profile (History, Verification Dialog)
Stage 4.3: Catalog & Category Management (SKU table, pricing, crate rules, edit modal)
Stage 4.4: Live Orders Queue & Status Progression Dialog (Multi-filters, stepwise status)
Stage 4.5: Logistics Dispatch Desk & Delivery Update Drawer (Route, driver, vehicle)
Stage 4.6: Payment Operations & Record Payment Modal (COD pending queue, cash recording)
Stage 4.7: Commercial Non-GST Invoice Preview & PDF Generator (Farm Bill template)
Stage 4.8: Operational Gate Schedule Manager & Holiday Exceptions (Automated schedule)
Stage 4.9: Notification Center, Broadcast Composer, RBAC Settings & Audit Log
```

**Never attempt to generate all screens in one operation. Wait for stage-specific instructions.**

---

## 12. Agent Reporting Protocol (Admin Web)

At the conclusion of each implementation stage, report:
1. **Modules & Screens Implemented:** Specific operational desks, routes, and forms authored.
2. **Components Created / Modified:** Reusable widgets, tables, drawers, and modal dialogs.
3. **Mock Interactions Implemented:** Concrete state mutations tested (e.g. recording payment, advancing status).
4. **Verification of Safeguards:** Confirmation that `DATABASE/schema.sql` remains empty and zero credit features were introduced.
5. **Linting & Type-Check Results:** Results of `npm run lint` and `tsc --noEmit`.
6. **Responsive Behavior Verified:** Desktop, tablet, and mobile responsiveness.
7. **Known Mock Limitations:** Simulated in-memory behavior notes.
8. **Next Step:** Immediate next recommended task awaiting user approval.
