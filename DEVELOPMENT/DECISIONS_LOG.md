# YOG MILK — Architectural & Business Decisions Log (DECISIONS_LOG.md)
*Official Audit Record of Approved Architecture, Resolved Conflicts, and Open Business Decisions*
*Last Updated: 31 October 2026 | Milestone: Workspace Initialization*

---

## 1. Confirmed & Approved Architectural Decisions

| ID | Topic | Approved Decision | Authority / Reference |
| :--- | :--- | :--- | :--- |
| **ADR-001** | **Source of Truth** | `PROJECT_DOCUMENTATION/MASTER_PROJECT_PLAN.pdf` (Version 2.0, 29 October 2026) is the supreme authoritative specification. It supersedes all previous drafts and proposals. | Client & Architect Review |
| **ADR-002** | **Credit Removal** | All credit features (credit limit, wallet, ledger, percentage, expiry, 7-day terms, credit orders) are **permanently removed from scope**. No credit tables or UI elements may be created. | Master Project Plan v2.0 §2.2 |
| **ADR-003** | **Application Stacks** | Retailer Mobile Application: **Flutter & Dart** (Android first). Admin Web Dashboard: **Next.js 14+ (App Router), TypeScript, Tailwind CSS**. | Master Project Plan v2.0 §1.2 |
| **ADR-004** | **Current Scope Boundary** | **Frontend UI Implementation with Realistic Mock Data ONLY.** Supabase, PostgreSQL tables, Edge Functions, Razorpay SDK, and FCM integrations are deferred. | Phase Scope Agreement |
| **ADR-005** | **Empty Database File** | `DATABASE/schema.sql` MUST remain strictly an empty 0-byte file during this phase. No SQL DDL or migrations may be generated. | Phase Scope Agreement |
| **ADR-006** | **Operational Gate** | Ordering schedule operates automatically based on administrator-configured hours and weekdays. **No manual master on/off switch is permitted.** | Master Project Plan v2.0 §5.1 |
| **ADR-007** | **Decoupled Status Triad**| Order Status, Payment Status, and Delivery Status are three decoupled, independent state machines. | Master Project Plan v2.0 §6.1–6.5 |
| **ADR-008** | **COD Workflow** | COD orders are created with Payment Status = `PENDING`. Payment status transitions to `PAID` **only** upon explicit admin manual recording. | Master Project Plan v2.0 §6.3 |
| **ADR-009** | **Pending Payment Block** | A retailer with any order having an unresolved positive balance (Payment Status = `PENDING`) is strictly blocked from placing new orders. | Master Project Plan v2.0 §5.3 |
| **ADR-010** | **Non-GST Billing** | YOG MILK is not GST registered. The platform prints clean commercial bills / farm memos without fictitious GSTIN, CGST, SGST, IGST, or HSN codes. | Master Project Plan v2.0 §8.1–8.2 |
| **ADR-011** | **Trilingual Support** | Complete UI localization in English, Hindi, and Marathi across the retailer mobile experience. | Master Project Plan v2.0 §2.1 |

---

## 2. Discrepancies Discovered & Recorded Resolutions

During the repository inspection and Stitch asset review, the following conflicts were identified and formally resolved:

### Discrepancy 1: Legacy Credit Mentions in Historical Blueprint
- **Observation:** `YogMilk Platform Architecture BluePrint.docx` (now preserved in `PROJECT_DOCUMENTATION/ARCHITECTURE_PLANNING_PROPOSAL.txt`) contained extensive descriptions of a 7-day credit system, credit limits, and credit wallets.
- **Resolution:** As mandated by the user and Master Plan v2.0, the blueprint is classified as **historical reference only**. Master Plan v2.0 supersedes it completely. **Zero credit functionality will be implemented.**

### Discrepancy 2: Older Stitch Screens Displaying "Credit" Badges
- **Observation:** Several raw HTML mockups in the Stitch UI zip files contained visual placeholders for "Credit Limit: ₹ 50,000" and "Credit Days Remaining: 4 Days".
- **Resolution:** In accordance with the Source-of-Truth Hierarchy, Master Plan v2.0 overrides these design mockups. All credit placeholders, badges, and tabs are removed from the Flutter and Next.js component specifications.

---

## 3. Open Business Decisions Requiring Client Confirmation

In accordance with Section 15 of the Master Project Plan v2.0, the following operational parameters are recorded for final confirmation before production backend deployment:

| Decision ID | Domain | Open Question / Decision Description | Recommended Default (for Mock Phase) |
| :--- | :--- | :--- | :--- |
| **OD-001** | **Schedule** | Exact recurring ordering hours and applicable weekdays. | **07:00 AM to 05:00 PM IST, Monday through Saturday** |
| **OD-002** | **Order Flow** | Whether successful order placement moves immediately to `PROCESSING` or remains `PLACED` until admin confirmation. | **Display `PLACED` initially, with quick one-click confirmation to `PROCESSING` in Admin** |
| **OD-003** | **COD Scope** | Whether COD is available to all registered retailers, or only selected approved accounts, and whether an order value cap applies. | **Enabled for all approved retailers with a maximum cap of ₹ 10,000 per order** |
| **OD-004** | **Payment Block** | Whether an unpaid order that is cancelled immediately unblocks the retailer or requires manual admin clearance. | **Immediate unblock upon formal order cancellation** |
| **OD-005** | **Partial Payment**| Whether the initial release supports partial cash payments (e.g. paying ₹1,500 of ₹2,450) or full settlement only. | **Full payment resolution only for initial release** |
| **OD-006** | **COD Proof** | Whether recording manual COD payment requires an uploaded receipt image or only a voucher/receipt number. | **Mandatory text voucher/receipt number and admin note** |
| **OD-007** | **Invoice Legal** | Final legal business name, plant address, FSSAI registration number, and accountant-approved non-GST footer text. | **Use representative authentic Pune dairy plant address and standard exemption disclaimer** |
| **OD-008** | **Delivery Code** | Delivery code format and whether one order can ever be split into multiple dispatches. | **Format `DEL-YYYY-NNNNNN`; strict 1-to-1 mapping between Order and Delivery** |
| **OD-009** | **Pricing Model**| Universal catalog wholesale pricing vs retailer-specific negotiated pricing. | **Universal wholesale pricing by SKU for initial release** |
| **OD-010** | **Onboarding** | Mandatory profile fields required before account approval. | **Shop Name, Owner Name, Contact Phone, Delivery Address, Pincode, and FSSAI License Number** |

