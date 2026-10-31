# YOG MILK — System Architecture Overview (SYSTEM_OVERVIEW.md)
*Supreme Architecture Blueprint, Platform Topology, and Future Backend Transition Plan*
*Role: Lead Software Architect | Status: Finalized for Mock-Data Frontend Phase*
*Source Baseline: Master Project Plan v2.0 (29 October 2026)*

---

## 1. System High-Level Topology

YOG MILK is an enterprise-grade B2B dairy commerce and logistics coordination platform connecting commercial dairy parlors, kirana grocers, and institutional caterers across Western Maharashtra (Pune, Satara, Kolhapur) with central dairy processing and distribution hubs.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       CLIENT APPLICATIONS TIER                                   │
│                                                                                                  │
│   ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────┐   │
│   │  Retailer Android Mobile App                 │    │  Admin Web Dashboard                 │   │
│   │  (Flutter 3.x / Dart 3.x / Riverpod)         │    │  (Next.js 14+ / React / TypeScript)  │   │
│   │  • Handheld Portrait (390–430px)             │    │  • Responsive Desktop / Tablet       │   │
│   │  • Trilingual UI (English, Hindi, Marathi)   │    │  • High-Density TanStack Tables      │   │
│   │  • Fast Quick-Add & Bulk Crate Steppers      │    │  • Real-time Operations & Recharts   │   │
│   │  • Commercial Non-GST Invoice Viewer         │    │  • Manual COD Payment Recording      │   │
│   └──────────────────────┬───────────────────────┘    └──────────────────┬───────────────────┘   │
└──────────────────────────┼───────────────────────────────────────────────┼───────────────────────┘
                           │                                               │
                           ▼                                               ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     CURRENT PHASE: DETERMINISTIC IN-MEMORY MOCK SERVICE TIER                     │
│                                                                                                  │
│   • Canonical Shared Data Contracts (MOCK_DATA_CONTRACT.md)                                     │
│   • Consistent Cross-Application Identifiers (ret-001, YM-2026-10381, DEL-2026-08492)           │
│   • In-Memory State Mutation (Placing COD order locks retailer; Admin payment clears lock)        │
│   • Configurable Simulated Latency (250ms – 500ms) with Shimmer Skeletons                        │
│   • Error Simulation Modes & Global Reset Functionality                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                  [FUTURE BACKEND INTEGRATION PHASE — CURRENTLY DEFERRED]
                                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             FUTURE BACKEND: SUPABASE / POSTGRESQL TIER                           │
│                                                                                                  │
│   ┌───────────────────────────────┐  ┌──────────────────────────────┐  ┌─────────────────────┐   │
│   │  Supabase Auth & RBAC         │  │  PostgreSQL 15+ Relational   │  │  Supabase Storage   │   │
│   │  (Google OAuth + Phone OTP)   │  │  (Orders, Payments, Items)   │  │  (Private PDF Bills)│   │
│   ├───────────────────────────────┤  ├──────────────────────────────┤  ├─────────────────────┤   │
│   │  Supabase Edge Functions      │  │  Row Level Security (RLS)    │  │  Realtime Engine    │   │
│   │  (Schedule gate & verification│  │  (Multi-tenant isolation)    │  │  (Live status sync) │   │
│   └───────────────────────────────┘  └──────────────────────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Daily Commercial Dairy Distribution Cycle

The platform operates around a strict, time-sensitive daily dairy supply chain:

```
07:00 AM IST ──► Automated Ordering Gate OPENS (Retailers notified via app/push)
      │
14:00 PM IST ──► Peak afternoon ordering window (Retailers reorder usual crates)
      │
17:00 PM IST ──► Automated Ordering Gate CLOSES (Order intake locked; submissions rejected)
      │
18:00 PM IST ──► Production Demand Locked (Central plant aggregates milk liters for pasteurization)
      │
22:00 PM IST ──► Night packaging into crates (Cold room staging by route)
      │
03:30 AM IST ──► Morning dispatch departure (Drivers assigned, status moves to OUT_FOR_DELIVERY)
      │
05:30 AM IST ──► Booth drop & physical cash collection (Delivery status DELIVERED; COD PENDING)
      │
08:30 AM IST ──► Morning Depot Cash Audit (Admin records payment as PAID; ordering lock released)
```

---

## 3. Data Flows & Domain Lifecycles

### 3.1 Order Placement & Validation Flow
1. **Gate Check:** Client evaluates `orderingScheduleProvider`. If current time is outside recurring hours or within a calendar exception, checkout is locked.
2. **Pending Debt Check:** Client evaluates `pendingPaymentBlockProvider`. If the retailer has any prior order with `paymentStatus == 'PENDING'`, checkout is disabled with an informational banner.
3. **Cart Submission:** Cart computes crates, pouches, total Liters, and subtotal (₹). Retailer selects Payment Method: **COD** or **Online**.
4. **Order Creation:** Mock repository generates immutable snapshots of product names, pack sizes, unit rates, and delivery address. Order code `YM-YYYY-NNNNNN` is issued.
5. **Debt Lock Triggered:** If COD is selected, Payment Status = `PENDING`. Retailer's `hasPendingPaymentBlock` becomes `true`. Subsequent checkouts are immediately blocked.

### 3.2 COD Cash Reconciliation Flow
1. Crate delivery occurs at retail booth at 05:00 AM. Driver collects cash.
2. Order status moves to `DELIVERED`, but payment status remains `PENDING`.
3. Delivery driver turns in cash and physical receipt vouchers at morning depot reconciliation.
4. Accounts administrator opens **Record Payment Drawer** in Admin Dashboard, enters voucher #, cash amount, and admin notes.
5. Payment transitions to `PAID`.
6. Retailer's `hasPendingPaymentBlock` is cleared to `false`. When the ordering window reopens at 07:00 AM, the retailer can order again.

---

## 4. Architectural Boundaries & Security Posture

1. **Zero Client-Side Privileges:** Service-role keys, payment gateway secret keys, and webhook signing secrets must NEVER exist in client bundles.
2. **Decoupled Status Triad:** `order_status`, `payment_status`, and `delivery_status` are managed as separate, decoupled state machines.
3. **Non-GST Commercial Invoices:** Strict compliance with non-GST agricultural dairy exemption. No fictitious GSTIN, CGST, SGST, IGST, or HSN tax calculations.
4. **Absolute Exclusion of Credit:** Zero credit allocation, credit limits, credit wallets, credit ledgers, or 7-day payment terms.

---

## 5. Future Backend Transition Blueprint

The frontend architecture guarantees that migrating from mock repositories to Supabase requires **zero modifications to presentation UI components**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (UI)                         │
│           (Flutter Widgets / Riverpod & Next.js React Components)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Watches / Calls
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    DOMAIN REPOSITORY CONTRACTS                         │
│           (IRetailerRepository, IOrderRepository, etc.)                │
└─────────────────┬──────────────────────────────────┬───────────────────┘
                  │                                  │
    [CURRENT MOCK PHASE]               [FUTURE SUPABASE PHASE]
                  ▼                                  ▼
┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│  MockOrderRepository             │ │  SupabaseOrderRepository         │
│  • In-memory State Map           │ │  • Supabase Client (PostgREST)   │
│  • Simulated Latency             │ │  • RLS Tenant Enforcement        │
│  • Local Seed Storage            │ │  • Realtime WebSocket Channels   │
└──────────────────────────────────┘ └──────────────────────────────────┘
```

### 5.1 Step-by-Step Transition Protocol
1. **Interface Compliance:** All UI components consume abstract repository interfaces (`IRetailerRepository`, `IOrderRepository`, etc.).
2. **DTO Standardization:** DTOs in `lib/src/features/*/data/dtos/` match PostgreSQL schema column names directly.
3. **Provider Dependency Injection:** In Flutter, `orderRepositoryProvider` will simply return `SupabaseOrderRepository(supabaseClient)` instead of `MockOrderRepository()`. In Next.js, repository instances are injected via server actions or client context.
4. **RLS Migration:** PostgreSQL Row Level Security policies will mirror the current mock filtering rules:
   ```sql
   -- Future RLS Rule Preview (Reference Only — Not to be implemented currently)
   CREATE POLICY "Retailers can only view own orders" 
   ON orders FOR SELECT 
   USING (retailer_id = (SELECT id FROM retailers WHERE profile_id = auth.uid()));
   ```

---

## 6. Recorded Discrepancies & Unresolved Business Decisions

The following business items from Section 15 of Master Plan v2.0 require client confirmation prior to production backend implementation:

| Decision ID | Domain | Open Business Item | Mock-Phase Baseline Applied |
| :--- | :--- | :--- | :--- |
| **OD-001** | Schedule | Exact recurring daily hours and operating days. | **07:00 AM – 05:00 PM IST, Mon–Sat** |
| **OD-002** | Order Flow | Status immediately upon order placement. | **Display `PLACED`, 1-click admin move to `PROCESSING`** |
| **OD-003** | COD Threshold | Maximum permitted order value for COD. | **₹ 10,000.00 maximum order value** |
| **OD-004** | Cancellation | Unblocking retailer upon order cancellation. | **Immediate unblock upon formal order cancellation** |
| **OD-005** | Partial Payment| Whether partial cash payments are accepted. | **Full payment resolution only** |
| **OD-006** | COD Proof | Mandatory offline proof required. | **Mandatory text voucher/receipt # and staff note** |
| **OD-007** | Invoice Legal | Final legal supplier name and FSSAI number. | **"YOG MILK DAIRY PRODUCTS PVT. LTD." / FSSAI #11519036000281** |
| **OD-008** | Pricing Tiers | Universal wholesale pricing vs retailer-specific. | **Universal wholesale pricing by SKU** |
