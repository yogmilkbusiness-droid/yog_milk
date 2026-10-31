# YOG MILK — Master Agent Operating Instructions (AGENTS.md)
*Supreme Instruction Hierarchy, Architecture Directives, and Behavioral Governance for AI Coding Agents*
*Version: 2.0 | Approved Date: 31 October 2026 | Source Baseline: Master Project Plan v2.0 (29 October 2026)*

---

## 1. Project Identity & Business Context

### 1.1 Project Identity
- **Project Name:** YOG MILK
- **Domain:** B2B Dairy Ordering, Supply Chain Operations & Retailer Management
- **Target Market:** Western India (Maharashtra region: Pune, Mumbai, Satara, Kolhapur)
- **Primary Stakeholders:** 
  - **Dairy Retailers / Booth Owners / Kirana Store Owners:** Commercial purchasers of bulk milk, curd, paneer, butter, and ghee.
  - **Dairy Operations & Administrative Staff:** YOG MILK warehouse managers, dispatchers, accounts personnel, and platform administrators.

### 1.2 Two Interconnected Applications
1. **Retailer Android Application (`yog_milk_retailer`):**
   - **Framework:** Flutter & Dart (Android first, clean architecture, feature-first modularization).
   - **Target Audience:** Dairy booth owners, independent grocers, milk parlors, institutional caterers.
   - **Key Capabilities:** Daily bulk ordering, catalog discovery, fast repeat ordering ("Quick Add" / "Order Usual"), order tracking, delivery tracking, payment history, downloadable commercial non-GST bills, trilingual UI (English, Hindi, Marathi), push/in-app notifications, and operating schedule visibility.
2. **Admin Web Dashboard (`yog_milk_admin`):**
   - **Framework:** Next.js (TypeScript, Tailwind CSS, Lucide Icons, Material-inspired components).
   - **Target Audience:** YOG MILK central operations, dispatch coordinators, warehouse controllers, accounts, and executives.
   - **Key Capabilities:** Retailer verification and Customer 360° profile, catalog & wholesale pricing management, automated ordering schedule configuration, individual order status progression, independent delivery dispatch tracking, manual Cash on Delivery (COD) payment recording, commercial non-GST invoice generation & downloads, broadcast/targeted notification center, analytics & operational reporting, and append-only audit trail.

### 1.3 Future Backend Infrastructure (Planned — NOT In Scope for Current Phase)
- **Database & Auth:** Supabase (PostgreSQL 15+, Supabase Auth with Google OAuth, Storage buckets, Realtime WebSockets, Row Level Security).
- **Payment Processing:** Razorpay Payment Gateway integration (trusted server-side order creation, webhook verification with SHA-256 HMAC signature validation) + Manual Cash-on-Delivery (COD) recording.
- **Push Notification Service:** Firebase Cloud Messaging (FCM) linked to durable PostgreSQL notification records.

---

## 2. Current Development Phase & Strict Guardrails

> [!IMPORTANT]
> **CURRENT PHASE: Frontend UI Implementation with Realistic Mock Data ONLY.**
> All engineering activities are strictly constrained to client-side presentation, local state management, deterministic mock services, and high-fidelity UX prototypes matching the Stitch design assets.

### 2.1 Explicit Prohibitions for Current Phase
1. **NO Flutter or Next.js Project Creation (during Workspace Initialization):** Projects are created only when the roadmap reaches Stage 1.
2. **NO Backend Integration:** Do NOT connect to live Supabase, Firebase, or external REST/GraphQL APIs.
3. **NO Database Implementation:** `DATABASE/schema.sql` MUST remain a 0-byte empty file. Do NOT write SQL tables, foreign keys, or database migration files.
4. **NO Authentication Integration:** Do NOT integrate Google Sign-In SDKs, Firebase Auth, or Supabase Auth. Simulate authentication states (Guest, Unapproved Retailer, Approved Retailer, Blocked Retailer, Admin, Operations) entirely via mock session providers.
5. **NO Payment Gateway Integration:** Do NOT integrate Razorpay SDK or live payment verification. Simulate Razorpay checkout flows (Success, Failed, Verifying) and COD recording in memory.
6. **NO Dependency Bloat:** Do NOT install speculative packages or dependencies.

### 2.2 Explicitly Excluded Features (Permanently Removed from Scope)
The authoritative Version 2.0 Master Planning Document explicitly struck out all credit features from the project. **ANY AGENT INTRODUCING CREDIT FUNCTIONALITY IS IN DIRECT VIOLATION OF ARCHITECTURAL GOVERNANCE.**
- ❌ **NO Credit Allocation or Credit Limits.**
- ❌ **NO Credit Balance or Credit Wallet.**
- ❌ **NO Credit Percentage or Earned Credit per order.**
- ❌ **NO Credit Ledger or Credit Debit/Credit tracking.**
- ❌ **NO Credit Expiry or Grace Periods.**
- ❌ **NO Credit-based Orders or Split-Payment via Credit.**
- ❌ **NO 7-Day Credit Payment Terms.**
- ❌ **NO Credit-related Notifications, Alerts, or Analytics.**
- ❌ **NO "Credit" UI tabs, cards, tables, database columns, or mock fields.**

---

## 3. Authoritative Source of Truth Hierarchy

When resolving requirements, architecture patterns, UI layouts, or data models, agents MUST adhere strictly to the following precedence hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. MASTER_PROJECT_PLAN.pdf (v2.0, dated 29 October 2026)               │
│    (Authoritative, supreme specification; overrides all older drafts)  │
├────────────────────────────────────────────────────────────────────────┤
│ 2. DEVELOPMENT/DECISIONS_LOG.md                                        │
│    (Explicitly approved client/architect decisions recorded during dev)│
├────────────────────────────────────────────────────────────────────────┤
│ 3. Root AGENTS.md & SHARED_DOCUMENTATION/                             │
│    (DESIGN_SYSTEM.md, BUSINESS_RULES.md, STATUS_DEFINITIONS.md, etc.)   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Extracted Stitch Design References (UI_UX_REFERENCES/)              │
│    (High-fidelity HTML/CSS/PNG design templates)                       │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Historical Documents (e.g., ARCHITECTURE_PLANNING_PROPOSAL.txt)    │
│    (REFERENCE ONLY. Never overrides v2.0 Master Plan or Decision Log)  │
└────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> If a conflict arises between any design asset and the Master Planning Document v2.0 (such as a legacy Stitch screen displaying a "Credit Limit" badge), **the Master Planning Document takes absolute precedence**. The credit element MUST be omitted, and the discrepancy logged in `DEVELOPMENT/DECISIONS_LOG.md`.

---

## 4. Core Business Rules & Domain Logic

Every agent developing UI components, state machines, or mock services must abide by these non-negotiable business rules:

### 4.1 Admin-Configurable Ordering Schedule (Operational Gate)
- **No Master On/Off Switch:** There is NO manual master toggle to turn ordering on or off.
- **Automated Time Windows:** Ordering window operates strictly on an administrator-configured recurring schedule (e.g., recurring daily hours such as 07:00 to 17:00 IST, applicable weekdays, and scheduled calendar exception closures).
- **Enforcement at Submission:** When the schedule is CLOSED, all checkout, "Buy Now", and cart submission paths are blocked. The retailer app must display: *"The ordering window is closed. We’ll notify you when ordering opens again."* alongside a timer indicating the next scheduled opening.
- **Mock Implementation:** The mock service must support changing the virtual clock or editing the active schedule in Admin to test both OPEN and CLOSED states seamlessly.

### 4.2 Independent Status Triad
The platform manages three independent, decoupled status domains for every order. **Never combine or confuse these three distinct lifecycles:**

```
Order Lifecycle:
PLACED ──► CONFIRMED ──► PROCESSING ──► READY_FOR_DELIVERY ──► OUT_FOR_DELIVERY ──► DELIVERED
(Optional terminal: CANCELLED, DELIVERY_FAILED)

Payment Lifecycle:
PENDING ──► [PROCESSING] ──► PAID
(Edge states: FAILED, PARTIALLY_PAID [if approved], REFUNDED)

Delivery Lifecycle:
NOT_ASSIGNED ──► ASSIGNED ──► PICKED_UP ──► OUT_FOR_DELIVERY ──► DELIVERED
(Edge states: DELIVERY_FAILED, RETURNED)
```
*Example:* An order can be `PROCESSING` while its payment is `PENDING` (e.g. COD order) and its delivery is `NOT_ASSIGNED`.

### 4.3 Cash on Delivery (COD) Workflow & Admin Manual Payment Recording
- When a retailer checks out with COD, the order is created with Payment Status = `PENDING` and Payment Method = `COD`.
- Payment status **NEVER** automatically transitions to `PAID`.
- Payment status transitions to `PAID` **ONLY** after an authorized Administrator explicitly records the cash/offline collection in the Admin Dashboard, capturing amount, received timestamp, payment method, reference/receipt note, and administrator identity.

### 4.4 The "One Pending-Payment" Ordering Restriction
- **The Rule:** A retailer is **strictly prohibited** from placing a new order if they have any previous order with an unresolved positive balance (Payment Status = `PENDING`).
- **Scope:** Applies regardless of whether the pending order was COD or an interrupted online payment.
- **Resolution:** The restriction is released immediately when:
  1. The pending payment is confirmed as `PAID` (via verified online payment or admin manual recording).
  2. The pending order is formally cancelled by admin and its balance resolved.
- **UI Treatment:** The retailer app must display an informational blocking banner at checkout detailing the blocking Order Code, pending amount due, payment method, and a button to view/pay that order.

### 4.5 Non-GST Commercial Billing
- YOG MILK is **not GST registered** and sells pure agricultural dairy products that do not attract GST under current operations.
- The platform **MUST NOT** generate GST tax invoices, GSTIN numbers, HSN/SAC codes, CGST, SGST, IGST calculations, or tax breakdown summaries.
- Bills are strictly titled **"Commercial Invoice"** or **"Farm Bill / Delivery Memo"** containing YOG MILK firm name, address, FSSAI registration number, sequential invoice number, date, retailer details, itemized product list (pack size, qty, rate, line total), subtotal, delivery charges (if any), total payable, and payment status.

### 4.6 Trilingual Localization Standard
All user-facing strings in the Retailer Application (and key customer communications in Admin) must support:
1. **English (en)** — Default / Primary.
2. **Hindi (hi)** — Complete translation (not transliteration).
3. **Marathi (mr)** — Complete translation tailored to regional dairy terminology (e.g., म्हशीचे दूध, गाईचे दूध, ताक, पनीर, लोणी, तूप).
- Product and company proper names (e.g. "YOG MILK", "Gir Cow A2 Milk 1L") retain their brand names, while UI labels, statuses, messages, and dates are fully localized.

---

## 5. UI/UX Quality Standards (Stitch Reference Alignment)

Design assets located in `UI_UX_REFERENCES/` are the aesthetic benchmark. All components must replicate their design language:

### 5.1 Design Tokens & Theme
- **Primary Color:** Deep Royal Navy (`#051256`) — symbol of purity, corporate reliability, and premium heritage.
- **Secondary / Accent:** Warm Terracotta / Rich Saffron Amber (`#994700`, `#fc8127`, container `#ffdbc8`) — reflects traditional Vedic earthen pottery and butter churning.
- **Background & Surfaces:** Clean Milk & Cream tones (`#faf8ff`, `#fcf9f3`, container low `#f2f3ff`, container high `#e3e7fe`).
- **Typography:**
  - **Editorial / Display Headers:** `Playfair Display` (Serif, 600 weight) — gives a distinctive artisanal, organic, high-trust dairy brand presence.
  - **Interface / Data / Body:** `Plus Jakarta Sans` (Sans-serif, 400/500/600/700) — clean, readable, modern numerals for quantities, rates, and statuses.

### 5.2 Mandatory UI States
Every screen and interactive widget must implement four states:
1. **Populated State:** Realistic, well-padded layout with Indian dairy figures (e.g., ₹2,450.00, 50 Liters, Buffalo Milk 6.0% FAT).
2. **Loading State:** Shimmer/skeleton screens matching exact component layout (no plain centered spinners).
3. **Empty State:** Illustrated empty screen with clear, contextual copy and a primary action button (e.g., "No past orders yet. Start your daily dairy order now.").
4. **Error / Blocked State:** Clear, constructive messaging with retry triggers or action guidance (e.g., "Ordering Window Closed", "Pending Payment Block").

---

## 6. Mock Data Architecture & Data Contracts

All mock data must conform strictly to `SHARED_DOCUMENTATION/MOCK_DATA_CONTRACT.md`.
- **Realistic Seed Data:** Realistic retailer entities (e.g., "Om Sai Dairy & Sweets, Kothrud", "Shree Krishna Milk Centre, Hadapsar"), realistic dairy SKUs (Cow Milk 500ml/1L Pouch, Buffalo Full Cream Milk 1L, Artisanal A2 Cow Ghee 500ml glass jar, Fresh Malai Paneer 1kg vacuum pack, Cow Butter 500g, Spiced Masala Taak 200ml).
- **Price Precision:** All monetary amounts are formatted to 2 decimal places (`₹ XX.00`). Calculations must use integers (paise) or precise decimal arithmetic to prevent floating-point rounding errors.
- **Simulated Latency:** Mock services should include configurable simulated delays (250ms–500ms) to allow loading skeletons and optimistic UI to render naturally.
- **State Mutation in Memory:** Actions in the prototype (e.g., adding to cart, placing an order, updating delivery status in admin, recording a COD payment) must mutate local state so that navigating between screens reflects the updated state.

---

## 7. Development Methodology & Staged Implementation

Development proceeds in strict, sequential stages. **No stage may commence until the preceding stage passes acceptance criteria.**

```
Stage 0: Workspace Architecture & Instruction Hierarchy (CURRENT STAGE)
  └── Establish directory layout, documentation, governance rules, and empty schema.sql.
Stage 1: Project Scaffolding & Design System Foundation
  └── Initialize Flutter Android project and Next.js project. Setup tokens, fonts, and base theme.
Stage 2: Core Mock Data Engines & State Architecture
  └── Build in-memory mock repositories, state providers, and shared model contracts.
Stage 3: Retailer App UI Implementation (Flutter)
  └── Splash, onboarding, home (open/closed), catalog, bulk cart, checkout, orders, invoices, profile.
Stage 4: Admin Web Dashboard UI Implementation (Next.js)
  └── Retailers 360°, catalog manager, schedule controls, order queue, delivery desk, COD recording, invoices.
Stage 5: Cross-Application Experience Sync & End-to-End Walkthrough
  └── Verify state transitions, trilingual localization, responsiveness, and edge-case handling.
```

---

## 8. Definition of Done (DoD) for Any Task

Before any agent marks a task or stage as complete, all the following criteria must be satisfied:
1. **Master Plan Compliance:** Matches all rules in `MASTER_PROJECT_PLAN.pdf` v2.0 without deviation.
2. **Zero Prohibited Code:** Absolutely zero credit features, tables, columns, or UI elements.
3. **Design Fidelity:** Visually matches the typography, spacing, and colors defined in Stitch design assets.
4. **All UI States Handled:** Populated, Empty, Loading Skeleton, and Error/Closed states are all present.
5. **No Regressions:** Does not break existing screens, models, or documentation.
6. **Documentation Updated:** Corresponding items in `DEVELOPMENT/IMPLEMENTATION_TRACKER.md` updated with date and notes.

---

## 9. Agent Reporting Protocol

At the end of every response, the AI Agent must report:
1. **Current Stage & Task:** Exactly what was accomplished.
2. **Files Created / Modified:** Path and purpose of each file.
3. **Decisions / Conflicts Observed:** Any item requiring client clarification added to `DECISIONS_LOG.md`.
4. **Current Status of schema.sql:** Explicit confirmation that `DATABASE/schema.sql` remains empty.
5. **Next Step:** The immediate next action waiting for user approval.

The current development phase is MOCK-DATA FRONTEND ONLY.

All repositories must use local mock implementations.

No screen, provider, component, widget, hook, or service may directly
depend on Supabase.

The future backend must be replaceable without rewriting the
presentation layer.

All mock data must be centralized, typed, deterministic and reusable.

Never confuse mock functionality with actual backend functionality.