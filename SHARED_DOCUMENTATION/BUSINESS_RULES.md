# YOG MILK — Core Business Rules & Domain Logic (BUSINESS_RULES.md)
*Non-Negotiable Product Rules Governing Retailer Mobile App and Admin Dashboard*
*Source Baseline: Master Project Plan v2.0 (29 October 2026)*
*Role: Lead Software Architect*

---

## Rule 1: Automated Ordering Schedule (Operational Gate)

### 1.1 Automated Operation
- **Strictly No Manual On/Off Switch:** The platform does NOT provide a manual toggle switch or pause button to turn ordering on or off.
- **Automated Calculation:** The platform continuously evaluates whether ordering is `OPEN` or `CLOSED` based on:
  1. Administrator-configured recurring opening time (default: `07:00:00` IST) and closing time (default: `17:00:00` IST).
  2. Configured operating days of the week (default: Monday through Saturday, `[1, 2, 3, 4, 5, 6]`).
  3. Scheduled calendar holiday or maintenance closures entered by an administrator.
  4. The official business timezone: `Asia/Kolkata` (UTC+05:30).

### 1.2 Checkout Blocking & User Messaging
- When ordering is `CLOSED`:
  - Retailers can browse the catalog and build their cart.
  - All submission actions ("Proceed to Checkout", "Place Order", "Buy Now") are strictly disabled.
  - The retailer app displays the exact approved message:
    > *"The ordering window is closed. We’ll notify you when ordering opens again."*
  - An animated countdown shows the time remaining until the next scheduled opening.
- If an admin edits the schedule while a retailer has a cart open, the updated schedule takes effect immediately upon order submission.

---

## Rule 2: The "One Pending-Payment" Ordering Restriction

### 2.1 The Restriction Trigger
- A retailer is **strictly prohibited from placing a new order** if they have an earlier order with an unresolved positive balance (Payment Status = `PENDING`).
- This applies universally across all payment methods:
  - Cash on Delivery (COD) orders awaiting depot cash verification.
  - Interrupted or abandoned Razorpay online payment attempts.

### 2.2 Restriction Release Triggers
The ordering lock is released **only** when one of the following occurs:
1. **Manual COD Collection Recorded:** An authorized administrator records offline cash receipt in the Admin Dashboard, transitioning the payment to `PAID`.
2. **Online Payment Verified:** A Razorpay payment is verified and confirmed `PAID`.
3. **Formal Order Cancellation:** An administrator formally cancels the order and zeroes the outstanding balance according to cancellation policies.

### 2.3 User Experience & Visibility
- The Retailer App prominently warns the retailer at:
  - The Home screen top banner.
  - The Cart screen footer.
  - The Checkout screen submission button.
- The warning displays the exact blocking Order Code (e.g., `YM-2026-10381`), pending amount (e.g., `₹ 2,450.00`), payment method, and a button to view/pay that order.
- The Admin Dashboard displays a "Payment Pending — Ordering Blocked" badge on the retailer's 360° profile.

---

## Rule 3: Decoupled Independent Status Triad

Every order maintains three independent state machines. **They must never be coupled or merged into composite statuses:**

```
Order Progression:   PLACED ──► CONFIRMED ──► PROCESSING ──► READY_FOR_DELIVERY ──► OUT_FOR_DELIVERY ──► DELIVERED
Payment Lifecycle:   PENDING ──► [PROCESSING] ──► PAID
Delivery Lifecycle:  NOT_ASSIGNED ──► ASSIGNED ──► PICKED_UP ──► OUT_FOR_DELIVERY ──► DELIVERED
```

- An order can be in `PROCESSING` while its payment is `PENDING` and delivery is `NOT_ASSIGNED`.
- An order can be `DELIVERED` physically while its COD payment remains `PENDING` awaiting morning depot cash reconciliation.
- Updating one status must never corrupt or accidentally change another status.

---

## Rule 4: Cash on Delivery (COD) & Admin Manual Payment Recording

### 4.1 Order Placement
- When a retailer checks out using COD:
  - Order Status is created as `PLACED` (or `PROCESSING` if immediate processing is enabled).
  - Payment Method is set to `COD`.
  - Payment Status is set to `PENDING`.
  - Payment Status **NEVER** transitions automatically to `PAID`.

### 4.2 Admin Verification Protocol
- To transition a COD order to `PAID`:
  1. An authorized Administrator must open the **Record Payment Modal** in the Admin Dashboard.
  2. The admin enters:
     - Amount collected (defaults to full payable amount; partial payment only if explicitly approved).
     - Date and time cash was received at depot.
     - Cash receipt / voucher / deposit slip reference number.
     - Internal verification notes.
  3. Saving the record updates Payment Status to `PAID`, logs an entry in `payments` and `audit_logs`, and immediately releases the retailer's ordering block.

---

## Rule 5: Non-GST Commercial Invoices

### 5.1 Legal Scope & Instruction
- YOG MILK is **not GST registered** and operates under agricultural dairy exemptions for unprocessed milk and fresh dairy items.
- The platform **MUST NOT** include:
  - GSTIN (Goods and Services Tax Identification Number)
  - Tax breakdowns for CGST, SGST, or IGST
  - HSN / SAC codes
  - Claims of being a "GST Tax Invoice"
- The client's accountant must approve final legal wording before production deployment.

### 5.2 Mandatory Bill Contents
1. YOG MILK Brand Name, dairy plant address, contact email, and telephone.
2. FSSAI License / Registration Number.
3. Unique sequential Invoice Number (e.g. `INV-2026-00412`).
4. Invoice Date and corresponding Order Code (`YM-2026-00812`).
5. Retailer Business Name, Owner Name, and Delivery Address.
6. Itemized table: Product Description, Pack Size, Quantity (pouches/crates), Wholesale Rate (₹), and Line Total (₹).
7. Subtotal, Delivery Fee (if applicable), and Total Amount Payable.
8. Current Payment Status (`PAID` with receipt reference, or `UNPAID / COD DUE`).

---

## Rule 6: Trilingual Localization Standard

- The Retailer Android Application must fully support:
  1. **English (en)**
  2. **Hindi (hi)**
  3. **Marathi (mr)**
- Localization applies to:
  - All navigation labels, headers, and buttons.
  - Status names and progress timelines.
  - Notification titles and body text.
  - Validation error messages and empty state descriptions.
- Brand names (`YOG MILK`) and specific product identifiers (`A2 Gir Cow Milk`) remain recognizable in their standard form.

---

## Rule 7: Retailer Account & Approval Lifecycle

- **States:** `PENDING_APPROVAL` → `APPROVED` → `SUSPENDED` → `REJECTED`.
- **Registration:** Retailers sign in and complete shop details (Shop Name, Owner Name, Address, Pincode, FSSAI).
- **Access Gate:** A retailer in `PENDING_APPROVAL` status can explore the catalog and prices, but cannot place orders until verified by an Administrator.

---

## Rule 8: Multi-Channel Notifications

- Every critical business event generates a durable notification:
  - Order Placed
  - Order Status Changed
  - Delivery Out for Delivery / Delivered
  - Payment Verified / Received
  - COD Collection Pending Reminder
  - Ordering Window Opened / Closed
  - Admin Schedule or Holiday Announcement
- Retailers receive events strictly pertaining to their own account.
- Admins receive operational alerts for all incoming orders, pending collections, and dispatch failures.

---

## Rule 9: Absolute Prohibition of Credit Functionality

The Master Project Plan v2.0 has permanently removed all credit features:
- ❌ No credit allocation, credit limits, credit percentage, or credit wallets.
- ❌ No credit ledger, credit expiry, or 7-day payment terms.
- ❌ No credit-based orders or split payment options.
- Any attempt to introduce credit-related tables, columns, or UI components is strictly prohibited.

---

## 10. Open Business Decisions Requiring Client Confirmation

The following parameters from Section 15 of Master Plan v2.0 remain open for confirmation before live production backend deployment:

| Decision ID | Domain | Open Question | Current Mock Baseline |
| :--- | :--- | :--- | :--- |
| **OD-001** | Schedule | Exact recurring ordering hours and weekdays. | `07:00 – 17:00 IST`, Mon–Sat |
| **OD-002** | Order Flow | Initial status on submission: keep `PLACED` or auto-move to `PROCESSING`. | Display `PLACED`, 1-click move in Admin |
| **OD-003** | COD Scope | Cap on COD order value. | Maximum ₹ 10,000 per COD order |
| **OD-004** | Cancellation | Unblocking retailer on cancelled unpaid orders. | Immediate unblock upon cancellation |
| **OD-005** | Partial Payment| Whether partial cash collections are accepted. | Full settlement only |
| **OD-006** | COD Proof | Mandatory offline proof required. | Mandatory text voucher/receipt # & staff note |
| **OD-007** | Invoice Legal | Final legal supplier name and FSSAI number. | "YOG MILK DAIRY PRODUCTS PVT. LTD." / FSSAI #11519036000281 |
| **OD-008** | Delivery Code | Delivery code format and split dispatches. | Format `DEL-YYYY-NNNNNN`; 1-to-1 order mapping |
| **OD-009** | Pricing Model| Universal wholesale pricing vs retailer-specific tiers. | Universal wholesale pricing by SKU |
