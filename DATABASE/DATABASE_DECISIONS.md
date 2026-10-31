# YOG MILK — Database Architectural Decisions (DATABASE_DECISIONS.md)
*Document Classification: Architectural Decision Records (ADR) for Future Data Tier*

---

## Decision 1: Supabase & PostgreSQL as the Relational Foundation
- **Context:** The platform requires relational integrity, ACID compliance for orders and financial records, role-based access control, file storage for PDF bills/product media, and realtime notifications.
- **Decision:** Standardize on PostgreSQL 15+ managed via Supabase.
- **Rationale:** 
  1. Relational data modeling is strictly required for order-to-items, order-to-payments, and order-to-deliveries mappings.
  2. PostgreSQL Row Level Security (RLS) provides tenant isolation, ensuring retailers can never query another retailer's orders or invoices.
  3. Supabase Realtime enables push updates for order status, delivery dispatch, and schedule gate changes without building a custom WebSocket server.
  4. Supabase Storage handles private, authenticated access to generated commercial PDF invoices.

---

## Decision 2: Decoupled State Machines (The Status Triad)
- **Context:** An order moves through physical preparation, financial settlement, and logistics dispatch at different times. A COD order is physically delivered before its cash is recorded in admin; an online order is paid before warehouse packaging starts.
- **Decision:** Split statuses into three independent columns and audit tables:
  1. `order_status` (Order progression: `PLACED` → `CONFIRMED` → `PROCESSING` → `READY_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`).
  2. `payment_status` (`PENDING` → `PAID` / `FAILED` / `REFUNDED`).
  3. `delivery_status` (`NOT_ASSIGNED` → `ASSIGNED` → `PICKED_UP` → `OUT_FOR_DELIVERY` → `DELIVERED`).
- **Rationale:** Decoupling eliminates state explosion (e.g. attempting to create composite statuses like `PROCESSING_BUT_COD_UNPAID_AND_DRIVER_ASSIGNED`). Each operational team (warehouse, accounts, delivery dispatch) updates their respective state independently without corrupting other states.

---

## Decision 3: Immutable Snapshotting of Commercial Details
- **Context:** Dairy prices fluctuate (milk procurement rates change seasonally), products get renamed, and pack sizes may be updated. Retailers may also move addresses.
- **Decision:** `order_items` and `invoices` MUST snapshot:
  - Product Name and Pack Size at point of order.
  - Unit Wholesale Price at point of order.
  - Retailer shop name, owner name, phone, and delivery address.
- **Rationale:** Changing a product price in the catalog tomorrow must **never** retroactively alter historical orders, invoices, or financial accounts.

---

## Decision 4: Currency Precision & Rounding Rules
- **Context:** Dairy ordering involves high volume and fractional rates (e.g., 50 pouches at ₹32.50 = ₹1,625.00). Floating point types (`FLOAT`, `DOUBLE`) introduce IEEE 754 rounding errors.
- **Decision:** Standardize strictly on `NUMERIC(10, 2)` across all database columns, mock contracts, and frontend display formatting.
- **Rationale:** Prevents off-by-one paise discrepancies in invoice reconciliation and payment gateway order matching.

---

## Decision 5: Non-GST Billing Architecture
- **Context:** YOG MILK is not currently GST registered, and agricultural dairy products (unflavored milk, fresh paneer, unbranded curd) do not attract GST under current operations.
- **Decision:** 
  - Do NOT create `gstin`, `cgst_rate`, `sgst_rate`, `igst_rate`, `hsn_code`, or `tax_breakup` columns in orders or invoice tables.
  - Create a structured `invoices` table that formats output as a legal "Commercial Bill / Farm Memo".
- **Rationale:** Printing speculative or fictitious GST details is legally hazardous under Indian tax law. Should GST registration occur in a future phase, it will be added via a formal migration.

---

## Decision 6: Absolute Removal of Credit Entities (Master Plan v2.0)
- **Context:** Older architectural proposals drafted a 7-day credit system with credit percentages and wallets. The Master Project Plan v2.0 (29 Oct 2026) formally removed all credit features.
- **Decision:** Zero credit tables, zero credit columns, and zero credit stored procedures.
- **Rationale:** Eliminates dead code, reduces cognitive overhead, and strictly honors the client-approved Master Project Plan.

---

## Decision 7: Server-Side Schedule Validation & Order Blocking
- **Context:** Client apps (Flutter mobile or web browser) can have inaccurate device clocks or could be bypassed.
- **Decision:** When backend development begins, ordering schedule enforcement and the "One Pending-Payment" restriction MUST be evaluated inside a trusted PostgreSQL transaction / Supabase Edge Function prior to committing an order.
- **Rationale:** Protects the dairy from unauthorized off-hours orders and runaway uncollected COD debt.

