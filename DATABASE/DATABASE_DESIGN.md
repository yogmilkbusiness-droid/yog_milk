# YOG MILK — Logical Database Design & Entity Architecture
*Document Status: Conceptual Blueprint for Future Implementation | Phase: Deferred*
*Current Phase Status: `DATABASE/schema.sql` is an empty 0-byte file. No SQL, tables, or migrations are created in this phase.*

---

## 1. Executive Notice: Deferred Implementation

> [!IMPORTANT]
> **DATABASE IMPLEMENTATION IS DEFERRED TO THE BACKEND IMPLEMENTATION PHASE.**
> In accordance with the Project Master Plan v2.0 and the current Frontend UI/Mock Data scope, **no physical database tables, indexes, functions, triggers, or migrations are to be created at this time**. The file `DATABASE/schema.sql` MUST remain completely empty (0 bytes).
> 
> The logical entity definitions below represent the authoritative architecture designed for the future Supabase/PostgreSQL backend, ensuring that our frontend mock data models are 100% schema-compatible when the database phase begins.

---

## 2. Logical Entity Model (Conceptual Blueprint)

The YOG MILK database architecture is organized into seven decoupled logical modules:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Identity & Auth │◄──────┤  Retailers 360  │◄──────┤ Retailer Orders │
│ (profiles, rbac)│       │ (shops, contact)│       │  (orders, items)│
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                  ┌─────────────────┐                        ▼
                  │  Dispatches &   │◄───────────────┌─────────────────┐
                  │    Deliveries   │                │    Payments     │
                  └─────────────────┘                │  (COD, Razorpay)│
                                                     └────────┬────────┘
                  ┌─────────────────┐                         │
                  │   Non-GST Farm  │◄────────────────────────┘
                  │     Invoices    │
                  └─────────────────┘
```

---

## 3. Logical Modules & Entity Specifications

### 3.1 Module 1: Identity, RBAC & Retailer Profiles
- **`profiles`**: Tied to `auth.users` in Supabase. Contains `id` (UUID), `full_name`, `phone`, `email`, `preferred_language` (`en`, `hi`, `mr`), `avatar_url`, and timestamps.
- **`retailers`**: Business entity linked to a profile. Contains `id`, `profile_id`, `business_name` (e.g., "Om Sai Dairy"), `owner_name`, `shop_category` (Dairy Parlor, Kirana, Sweet Mart, Wholesaler), `fssai_number`, `approval_status` (`PENDING`, `APPROVED`, `SUSPENDED`, `REJECTED`), `approved_at`, `approved_by`, `delivery_address_line1`, `landmark`, `area_pincode`, `latitude`, `longitude`, `created_at`.
- **`user_roles`**: Administrative role-based access control. Contains `user_id`, `role` (`SUPER_ADMIN`, `OPERATIONS_MANAGER`, `ACCOUNTS_EXECUTIVE`, `DISPATCH_OFFICER`). Note: Never rely on client-side role assertions.

### 3.2 Module 2: Catalog & Pricing
- **`categories`**: Product taxonomy. Contains `id`, `name_en`, `name_hi`, `name_mr`, `slug`, `display_order`, `image_url`, `is_active`.
- **`products`**: Dairy SKUs. Contains `id`, `category_id`, `name_en`, `name_hi`, `name_mr`, `description_en`, `description_hi`, `description_mr`, `pack_size` (e.g. "500 ml", "1 L", "1 kg"), `pack_unit` (`ML`, `L`, `GM`, `KG`, `PIECE`), `image_url`, `base_wholesale_price` (NUMERIC(10,2)), `minimum_order_qty`, `order_increment_qty`, `fat_percentage` (e.g., "6.0% FAT"), `snf_percentage`, `shelf_life_days`, `is_available`, `is_active`, `sort_order`.
- **`product_announcements`**: Broadcast banners for product arrivals/seasonal availability. Contains `id`, `product_id`, `title`, `message`, `target_audience` (`ALL`, `SELECTED_RETAILERS`), `starts_at`, `ends_at`, `is_active`.

### 3.3 Module 3: Operating Schedule & Ordering Gates
- **`ordering_schedules`**: Singleton or recurring operational configuration. Contains `id`, `recurring_open_time` (TIME, e.g. "07:00:00"), `recurring_close_time` (TIME, e.g. "17:00:00"), `operating_days` (ARRAY of INT [1..7] where 1=Monday), `business_timezone` (Default "Asia/Kolkata"), `scheduled_closure_reason` (TEXT), `updated_at`, `updated_by`.
- **`ordering_schedule_exceptions`**: Planned calendar holidays or operational maintenance closures. Contains `id`, `start_timestamp`, `end_timestamp`, `closure_reason`, `created_at`.

### 3.4 Module 4: Orders & Order Status History
- **`orders`**: Root commercial order record. Contains:
  - `id` (UUID, internal immutable key)
  - `order_code` (VARCHAR, unique human-readable code e.g. `YM-2026-10381`)
  - `retailer_id` (FK to `retailers.id`)
  - `order_status` (`PLACED`, `CONFIRMED`, `PROCESSING`, `READY_FOR_DELIVERY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `DELIVERY_FAILED`)
  - `payment_method` (`COD`, `RAZORPAY`)
  - `payment_status` (`PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`)
  - `delivery_status` (`NOT_ASSIGNED`, `ASSIGNED`, `PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `DELIVERY_FAILED`)
  - `subtotal_amount` (NUMERIC(10,2))
  - `delivery_fee` (NUMERIC(10,2))
  - `total_payable_amount` (NUMERIC(10,2))
  - `paid_amount` (NUMERIC(10,2))
  - `delivery_address_snapshot` (JSONB)
  - `delivery_notes` (TEXT)
  - `created_at`, `updated_at`
- **`order_items`**: Immutable snapshots of purchased items at point of order. Contains `id`, `order_id`, `product_id`, `product_name_snapshot`, `pack_size_snapshot`, `unit_price_snapshot` (NUMERIC(10,2)), `quantity`, `line_total` (NUMERIC(10,2)).
- **`order_status_history`**: Audit trail of every order status transition. Contains `id`, `order_id`, `from_status`, `to_status`, `actor_id`, `actor_role`, `transition_notes`, `created_at`.

### 3.5 Module 5: Payments & Cash Collection Auditing
- **`payments`**: Payment ledger records. Contains `id`, `order_id`, `retailer_id`, `amount` (NUMERIC(10,2)), `payment_method` (`COD`, `RAZORPAY`), `status` (`PENDING`, `PAID`, `FAILED`, `REFUNDED`), `provider_payment_id` (Razorpay payment ID or NULL for COD), `provider_order_id`, `recorded_by_admin_id` (FK to profiles for manual COD collection), `offline_receipt_note` (TEXT), `verified_at`, `created_at`.
- **`payment_webhook_events`**: Idempotency ledger for incoming Razorpay webhooks. Contains `event_id`, `event_type`, `payload_hash`, `processed_at`, `status`.

### 3.6 Module 6: Deliveries & Logistics
- **`deliveries`**: Physical logistics record tied to an order. Contains `id`, `delivery_code` (VARCHAR, unique human-readable code e.g. `DEL-2026-08492`), `order_id`, `assigned_route_id`, `driver_name`, `driver_phone`, `vehicle_number`, `current_status` (`NOT_ASSIGNED`, `ASSIGNED`, `PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `DELIVERY_FAILED`), `dispatched_at`, `delivered_at`, `failure_reason`, `created_at`.
- **`delivery_status_history`**: Audit log of delivery movement. Contains `id`, `delivery_id`, `from_status`, `to_status`, `actor_id`, `latitude`, `longitude`, `notes`, `created_at`.

### 3.7 Module 7: Non-GST Commercial Invoices
- **`invoices`**: Immutable commercial billing documents. Contains:
  - `id` (UUID)
  - `invoice_number` (VARCHAR, unique e.g. `INV-2026-0914`)
  - `order_id` (FK to `orders.id`, unique 1-to-1)
  - `retailer_id` (FK to `retailers.id`)
  - `invoice_date` (DATE)
  - `billed_total` (NUMERIC(10,2))
  - `amount_paid` (NUMERIC(10,2))
  - `balance_due` (NUMERIC(10,2))
  - `status` (`ISSUED`, `PAID`, `CANCELLED`)
  - `pdf_storage_path` (VARCHAR, Supabase Storage private bucket)
  - `raw_invoice_snapshot` (JSONB)
  - `created_at`

### 3.8 Module 8: Notifications & Administrative Audit Trail
- **`notifications`**: User-facing notification records. Contains `id`, `recipient_user_id`, `recipient_role` (`RETAILER`, `ADMIN`), `event_type` (`ORDER_PLACED`, `ORDER_STATUS_CHANGED`, `PAYMENT_RECEIVED`, `DELIVERY_DISPATCHED`, `SCHEDULE_GATE_CHANGED`, `NEW_PRODUCT_AVAILABLE`), `title_en`, `title_hi`, `title_mr`, `body_en`, `body_hi`, `body_mr`, `target_route` (deep link path), `reference_id` (order_id or delivery_id), `is_read`, `read_at`, `created_at`.
- **`audit_logs`**: Append-only administrative security log. Contains `id`, `actor_user_id`, `actor_role`, `action_type` (e.g., `RECORD_COD_PAYMENT`, `CHANGE_ORDER_STATUS`, `UPDATE_SCHEDULE`, `APPROVE_RETAILER`), `target_entity_type`, `target_entity_id`, `before_state` (JSONB), `after_state` (JSONB), `ip_address`, `user_agent`, `created_at`.

---

## 4. Explicit Exclusion of Credit Entities

To ensure architectural integrity, the following entities are **deliberately and completely excluded**:
- ❌ NO `retailer_credit_wallets`
- ❌ NO `credit_transactions` or `credit_ledger`
- ❌ NO `credit_limits` or `credit_percentage`
- ❌ NO `credit_expiry` or `credit_due_dates`

No future agent may create database tables, columns, or foreign keys related to credit without an explicitly signed scope revision.

