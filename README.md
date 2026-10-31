# YOG MILK — B2B Dairy Ordering & Retailer Management Platform

Welcome to the **YOG MILK** enterprise development workspace. This repository houses the complete frontend source code, design assets, architectural specifications, and mock data engines for the YOG MILK B2B dairy commerce platform.

---

## 1. Executive Summary

YOG MILK is a premier B2B dairy brand operating in Western India (Maharashtra), supplying pure, high-quality milk (Cow, Buffalo, A2 Gir Cow), curd (dahi), artisanal ghee, fresh malai paneer, butter, and butter milk (taak) to commercial retailers, dairy parlors, sweet marts, and kirana stores.

The platform consists of two interconnected, mission-critical applications:
1. **Retailer Android Application (`yog_milk_retailer`):** A high-performance Flutter mobile application designed for dairy booth owners to manage daily bulk milk standing orders, catalog orders, delivery tracking, payment history, and commercial non-GST invoices.
2. **Admin Web Dashboard (`yog_milk_admin`):** A modern, responsive Next.js (TypeScript & Tailwind CSS) web dashboard for dairy operations controllers, dispatch managers, and business administrators to oversee retailers, manage catalogs, configure automated ordering schedules, update delivery dispatches, record COD payments, and review analytics.

---

## 2. Current Development Phase

> [!IMPORTANT]
> **PHASE: Frontend UI Implementation with Realistic Mock Data ONLY.**
> - All backend integrations (Supabase, PostgreSQL tables, Row Level Security, Edge Functions) are **deferred** to subsequent phases.
> - `DATABASE/schema.sql` is strictly an empty placeholder file (0 bytes).
> - All authentication, checkout, delivery, and payment state machines are managed via deterministic, high-fidelity in-memory mock engines.

### Explicit Scope Exclusions (Master Plan v2.0)
As per the updated Master Project Plan dated 29 October 2026, **all credit facilities have been permanently excluded from scope**:
- ❌ No credit limits, credit percentage, credit wallets, credit ledgers, or credit expiry.
- ❌ No 7-day credit payment terms or credit-based orders.
- ❌ No credit UI components, notification templates, or database attributes.

---

## 3. Repository Structure

```
YOG_MILK/
├── AGENTS.md                          # Master AI operating instructions & governance
├── README.md                          # This document
│
├── PROJECT_DOCUMENTATION/
│   ├── MASTER_PROJECT_PLAN.pdf        # Authoritative Source of Truth (v2.0, 29 Oct 2026)
│   └── ARCHITECTURE_PLANNING_PROPOSAL.txt # Historical blueprint proposal (for context only)
│
├── DATABASE/
│   ├── schema.sql                     # EMPTY (0 bytes) during mock phase
│   ├── DATABASE_DESIGN.md             # Logical entity model and deferred implementation notes
│   └── DATABASE_DECISIONS.md          # Architectural rationale for database schemas
│
├── UI_UX_REFERENCES/                  # Extracted Stitch UI design packages
│   ├── RETAILER_APP/                  # 40+ screens (HTML, CSS, PNG) for mobile app
│   └── ADMIN_DASHBOARD/               # 44+ screens (HTML, CSS, PNG) for web dashboard
│
├── ARCHITECTURE/
│   ├── SYSTEM_OVERVIEW.md             # Unified platform architecture & communication flows
│   ├── RETAILER_APP_ARCHITECTURE.md   # Flutter Clean Architecture & state management spec
│   └── ADMIN_ARCHITECTURE.md          # Next.js App Router architecture & component spec
│
├── DEVELOPMENT/
│   ├── DEVELOPMENT_ROADMAP.md         # Staged delivery plan from Stage 0 to Stage 5
│   ├── IMPLEMENTATION_TRACKER.md      # Live status matrix for all screens and modules
│   ├── DECISIONS_LOG.md               # Log of confirmed decisions and unresolved questions
│   └── TESTING_CHECKLIST.md           # Quality gates, verification criteria, and test scenarios
│
├── SHARED_DOCUMENTATION/
│   ├── DESIGN_SYSTEM.md               # Vedic Wellness design tokens, typography, and colors
│   ├── BUSINESS_RULES.md              # Domain rules (ordering gate, payment blocks, COD flow)
│   ├── STATUS_DEFINITIONS.md          # Decoupled state machines (Order, Payment, Delivery)
│   └── MOCK_DATA_CONTRACT.md          # Strongly-typed data schemas for mock engines
│
├── yog_milk_retailer/                 # Flutter Android Retailer Application
│   └── AGENTS.md                      # Flutter-specific coding and architecture directives
│
└── yog_milk_admin/                    # Next.js TypeScript Admin Web Dashboard
    └── AGENTS.md                      # Admin-specific coding and Next.js directives
```

---

## 4. Key Architectural Principles

1. **Strict Source-of-Truth Hierarchy:** `MASTER_PROJECT_PLAN.pdf` v2.0 governs all product decisions. Legacy drafts never override it.
2. **Operational Gate (No Manual Switch):** Ordering windows are strictly governed by administrator-configured recurring schedules. The platform automatically evaluates open/closed status.
3. **Decoupled Status Triad:** Order Status, Payment Status, and Delivery Status are three completely independent lifecycles.
4. **Single Pending-Payment Rule:** A retailer with an unresolved pending payment (COD or incomplete online payment) is blocked from placing subsequent orders.
5. **Non-GST Commercial Invoices:** Compliant farm bill format without fictitious GSTIN, CGST, SGST, or HSN numbers.
6. **Trilingual Localization:** Comprehensive English, Hindi, and Marathi support across the retailer mobile experience.

---

## 5. Technology Stack

| Domain | Technology | Status in Current Phase |
| :--- | :--- | :--- |
| **Retailer Mobile App** | Flutter 3.x / Dart 3.x | Ready for Stage 1 Scaffolding |
| **Admin Web Dashboard** | Next.js 14+ (App Router), TypeScript, Tailwind CSS | Ready for Stage 1 Scaffolding |
| **Design System** | Playfair Display + Plus Jakarta Sans + Vedic Palette | Defined in `SHARED_DOCUMENTATION/` |
| **Mock Engine** | In-memory TypeScript & Dart state stores with delay simulation | Defined in `SHARED_DOCUMENTATION/` |
| **Future Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) | Deferred to Backend Phase |
| **Future Payments** | Razorpay Gateway + Admin Manual COD Collection | Deferred to Payment Integration Phase |

---

## 6. How to Navigate This Workspace

- **For AI Coding Agents:** Always read [AGENTS.md](file:///d:/FreeLancing/YOG%20milk/YOG_MILK/AGENTS.md) before performing any work.
- **For Business Rules:** Review [SHARED_DOCUMENTATION/BUSINESS_RULES.md](file:///d:/FreeLancing/YOG%20milk/YOG_MILK/SHARED_DOCUMENTATION/BUSINESS_RULES.md).
- **For State Machines:** Review [SHARED_DOCUMENTATION/STATUS_DEFINITIONS.md](file:///d:/FreeLancing/YOG%20milk/YOG_MILK/SHARED_DOCUMENTATION/STATUS_DEFINITIONS.md).
- **For Mock Data Contracts:** Review [SHARED_DOCUMENTATION/MOCK_DATA_CONTRACT.md](file:///d:/FreeLancing/YOG%20milk/YOG_MILK/SHARED_DOCUMENTATION/MOCK_DATA_CONTRACT.md).
- **For Progress Tracking:** Check [DEVELOPMENT/IMPLEMENTATION_TRACKER.md](file:///d:/FreeLancing/YOG%20milk/YOG_MILK/DEVELOPMENT/IMPLEMENTATION_TRACKER.md).

