# YOG MILK — Admin Web Dashboard Screen Inventory & UI/UX Audit
*Document: SCREEN_INVENTORY.md | Location: PROJECT_DOCUMENTATION/UI_UX_REFERENCES/ADMIN_DASHBOARD/*
*Audit Scope: Complete Inspection of Extracted Stitch Assets (`stitch_yog_milk_e_commerce_platform`)*
*Audited by: UI/UX Engineering Lead & Technical Analyst | Date: 31 October 2026*

---

## 1. Executive Summary & Audit Statistics
- **Total Discovered Admin Assets:** 46 Directories (44 Interactive Screen Templates, 2 Design System Specifications).
- **Total Audited Screens:** 44 Screens fully inspected (HTML, CSS, screenshots, and DOM trees).
- **Design System Baseline:** `artisanal_dairy_operations_admin/DESIGN.md` & `vedic_wellness_dairy_system/DESIGN.md`.
- **Primary Typography:** `Playfair Display` (Headings & Metric Numbers) + `Plus Jakarta Sans` (Data Tables, Forms, Labels).
- **Primary Colors:** Deep Royal Navy (`#051256`), Primary Container (`#1f2a6b`), Warm Terracotta / Saffron (`#994700` / `#fc8127`), Crisp White (`#ffffff`) on Clean Milk Cream (`#faf8ff`), borders (`#dde1f8`).
- **Credit Exclusion Audit:** Inspected all 44 screens. Found several screens with legacy 'Zero-Credit Policy' alert strips and return allowances. **All credit features (limits, wallets, ledgers, 7-day terms) are completely omitted from implementation.**

---

## 2. Comprehensive Screen Inventory (All 44 Screens)

### 1. Append-Only Administrative Security Audit Log (Standard View) (`yog_milk_admin_append_only_audit_log_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_append_only_audit_log_1/`
- **Files Inspected:** `code.html` (38753 bytes), `screen.png` (380622 bytes)
- **Purpose:** Immutable security log recording all administrative modifications across the system.
- **Main Sections:** Audit log header with immutable status pill, Filter bar (Action type, Actor, Entity type, Date range), TanStack table with Timestamp, Actor Name & Role, Action (e.g. RECORD_COD_PAYMENT), Target Entity, IP Address, Details button, Export audit trail CSV
- **UI Components:** Data table, Filter selectors, Action type badges, View details button
- **User Actions:** Filter by action type, Search by Actor, Click row to view Before/After state
- **Navigation Destination:** `/audit`
- **Mock Data Required:** List of AuditLogEntry records conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Append-only; records cannot be edited or deleted.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 2. Append-Only Audit Log (Filtered by Payment & Financial Actions) (`yog_milk_admin_append_only_audit_log_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_append_only_audit_log_2/`
- **Files Inspected:** `code.html` (49805 bytes), `screen.png` (342278 bytes)
- **Purpose:** Focused financial audit log showing cash collection recordings and status overrides.
- **Main Sections:** Financial action filter active, Audit rows highlighted with voucher references and recorded cash amounts
- **UI Components:** Filtered data table, Cash amount tags
- **User Actions:** Inspect financial action diffs
- **Navigation Destination:** `/audit`
- **Mock Data Required:** Financial audit events
- **Related Business Rules:** Complete traceability for offline cash recordings.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 3. Append-Only Audit Log (Before/After State Diff Modal) (`yog_milk_admin_append_only_audit_log_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_append_only_audit_log_3/`
- **Files Inspected:** `code.html` (38852 bytes), `screen.png` (378420 bytes)
- **Purpose:** Inspect granular JSON before and after snapshots for an administrative action.
- **Main Sections:** Action summary header, Actor & Timestamp metadata, Side-by-side JSON Diff viewer (Before State vs After State), Close button
- **UI Components:** Modal dialog, Code/diff highlight container, Close button
- **User Actions:** Inspect JSON changes, Close modal
- **Navigation Destination:** `/audit`
- **Mock Data Required:** Audit before/after JSON payload
- **Related Business Rules:** State diff inspection.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 4. Retailer 360° Profile (Overview & Financial Risk Status) (`yog_milk_admin_customer_360_profile_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customer_360_profile_1/`
- **Files Inspected:** `code.html` (50602 bytes), `screen.png` (806058 bytes)
- **Purpose:** Comprehensive single-pane-of-glass customer intelligence profile for dairy retailers.
- **Main Sections:** Customer header (Shop name, owner, contact, FSSAI #, active status), Zero-Credit Policy / Payment Risk Alert Strip (e.g. ₹2,440 COD due), Lifetime KPIs (Total orders, Billed value, Payments, Milk volume in Liters), Quick actions (Record Payment, Suspend Account, Call)
- **UI Components:** Risk alert card, KPI summary grid, Action button group, Tabs header (Orders, Payments, Deliveries, Invoices, Analytics, Timeline)
- **User Actions:** Tap 'Record Offline Payment', Tap 'Suspend Retailer', Switch tabs
- **Navigation Destination:** `/payments, /retailers`
- **Mock Data Required:** RetailerProfile DTO with metrics conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Pending payment block indicator; zero credit balances.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 5. Retailer 360° Profile (Order & Invoice History Tabs) (`yog_milk_admin_customer_360_profile_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customer_360_profile_2/`
- **Files Inspected:** `code.html` (29510 bytes), `screen.png` (409950 bytes)
- **Purpose:** Detailed historical order breakdown and issued non-GST commercial bills for a specific retailer.
- **Main Sections:** Profile compact header, Order History TanStack table (Order Code, Date, Pouches, Total, Status badges), Invoice History table (Invoice #, Date, Amount, Payment status, Download PDF)
- **UI Components:** Data table with sorting, Decoupled status badges, PDF download button
- **User Actions:** Sort orders, Filter by status, Click Order Code to view details, Download Invoice PDF
- **Navigation Destination:** `/orders/[id], /invoices/[id]`
- **Mock Data Required:** Retailer historical orders and invoices
- **Related Business Rules:** Tenant isolation: displays only this retailer's records.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 6. Retailer 360° Profile (Payment Ledger & Route History Tabs) (`yog_milk_admin_customer_360_profile_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customer_360_profile_3/`
- **Files Inspected:** `code.html` (29791 bytes), `screen.png` (425569 bytes)
- **Purpose:** Financial audit trail of all cash and gateway payments plus delivery route history.
- **Main Sections:** Profile compact header, Payment Ledger table (Receipt #, Method, Amount, Admin Actor, Timestamp), Delivery History table (Delivery Code, Driver, Vehicle, Delivery Timestamp, Status)
- **UI Components:** Data tables with filter pills, Receipt view button, Status badges
- **User Actions:** View payment voucher, Inspect driver notes
- **Navigation Destination:** `/payments/[id]`
- **Mock Data Required:** Payment records and delivery history for retailer
- **Related Business Rules:** Auditable financial ledger.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 7. Retailer Account Approval Dialog (Standalone Component) (`yog_milk_admin_customers_list_approval_dialog`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customers_list_approval_dialog/`
- **Files Inspected:** `code.html` (29816 bytes), `screen.png` (373416 bytes)
- **Purpose:** Standalone modular component for inspecting and approving a newly registered dairy booth.
- **Main Sections:** Applicant identity details, FSSAI compliance check, Assigned morning delivery route picker, Approval notes field, Confirm Approval CTA
- **UI Components:** Dialog card, Route dropdown selector, Notes input, Primary button 'Approve Retailer'
- **User Actions:** Select delivery route, Confirm approval
- **Navigation Destination:** `/retailers`
- **Mock Data Required:** Pending Retailer registration draft
- **Related Business Rules:** Mandatory route assignment upon approval.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 8. Retailers Management & Verification Queue (Dialog Active) (`yog_milk_admin_customers_list_verification_dialog_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customers_list_verification_dialog_1/`
- **Files Inspected:** `code.html` (49933 bytes), `screen.png` (543529 bytes)
- **Purpose:** Manage dairy retailer accounts and review pending booth registrations.
- **Main Sections:** Retailers table with status filters (Approved, Pending Approval, Suspended), Verification modal dialog open over table, Shop registration details (Owner, Shop address, FSSAI #, Route zone), Approval / Rejection decision form
- **UI Components:** TanStack table, Modal dialog overlay, Status pills, Approve & Reject buttons
- **User Actions:** Approve Retailer, Reject Application, Search retailers by name/phone
- **Navigation Destination:** `/retailers/[id]`
- **Mock Data Required:** List of RetailerProfile models and pending verification item
- **Related Business Rules:** Approval transitions status to APPROVED and enables ordering.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 9. Retailers Management (Suspended & Blocked Accounts View) (`yog_milk_admin_customers_list_verification_dialog_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_customers_list_verification_dialog_2/`
- **Files Inspected:** `code.html` (29908 bytes), `screen.png` (371126 bytes)
- **Purpose:** Focused operational queue of retailer accounts currently blocked from ordering.
- **Main Sections:** Blocked accounts warning strip, Table filtered to 'Suspended / Payment Blocked', Outstanding balance summary column, Unblock / Record Payment quick action
- **UI Components:** Alert banner, Data table with red highlight rows, Quick action buttons
- **User Actions:** Record COD Payment to unblock, Reactivate account
- **Navigation Destination:** `/retailers/[id], /payments`
- **Mock Data Required:** Retailers with pendingBalance > 0 or approvalStatus == 'SUSPENDED'
- **Related Business Rules:** Enforces single pending-payment ordering restriction.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 10. Operations Overview Dashboard (Morning Operational Cycle) (`yog_milk_admin_dashboard_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_dashboard_1/`
- **Files Inspected:** `code.html` (51132 bytes), `screen.png` (530970 bytes)
- **Purpose:** Primary operational desk displaying daily milk demand quotas, live order intake, and cash collection summary.
- **Main Sections:** Shift summary header with live IST clock, Volume & Fulfillment metric cards, Financial Clarity strip (Order Value vs Collected vs Outstanding), Daily Milk Volume Area Chart (Cow vs Buffalo), Live orders queue snippet, Recent operational alert cards
- **UI Components:** Metric KPI cards, Stacked area chart (Recharts), TanStack table snippet, Alert pills, Operational gate status widget
- **User Actions:** Filter by shift/cycle, Quick jump to Orders queue, Quick jump to Dispatch desk, Record cash collection CTA
- **Navigation Destination:** `/orders, /deliveries, /payments`
- **Mock Data Required:** Daily orders count (84), Milk volume (4,850L), Order value (₹2,48,500), Payments collected (₹1,84,200), Pending COD (₹64,300)
- **Related Business Rules:** Strict financial separation of Order Value vs Payments Collected. Automated schedule gate status.
- **Gap / Missing Elements:** None. Benchmark reference screen.
- **Implementation Status:** `DESIGN AVAILABLE`


### 11. Operations Overview Dashboard (Afternoon Cutoff & Batch Staging) (`yog_milk_admin_dashboard_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_dashboard_2/`
- **Files Inspected:** `code.html` (26296 bytes), `screen.png` (458038 bytes)
- **Purpose:** Dashboard state when ordering hours have closed and warehouse packaging batch is locked.
- **Main Sections:** Locked production batch banner, Total morning dispatch crate requirement, Route summary cards, Night cold-room packing progress
- **UI Components:** Batch locked banner, Route crate counter chips, Progress bars
- **User Actions:** Export packing manifests, Notify route drivers
- **Navigation Destination:** `/deliveries`
- **Mock Data Required:** Final locked crate count, driver allocation summary
- **Related Business Rules:** Ordering window closed; production volume frozen.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 12. Delivery Dispatch Desk & Route Assignment Drawer (`yog_milk_admin_delivery_queue_update_drawer_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_delivery_queue_update_drawer_1/`
- **Files Inspected:** `code.html` (44614 bytes), `screen.png` (421628 bytes)
- **Purpose:** Logistics dispatch control for assigning drivers and delivery vehicles to morning order batches.
- **Main Sections:** Delivery dispatch queue table (Delivery Code DEL-2026-08492, Order #, Shop, Address, Status), Slide-over drawer open on right, Driver assignment form (Driver name, Phone number, Vehicle registration), Status dropdown (NOT_ASSIGNED -> ASSIGNED -> PICKED_UP -> OUT_FOR_DELIVERY -> DELIVERED)
- **UI Components:** Slide-over sheet (shadcn), Driver select input, Vehicle text field, Status picker, Primary button 'Update Dispatch'
- **User Actions:** Assign driver, Update delivery status, Save dispatch note
- **Navigation Destination:** `/deliveries`
- **Mock Data Required:** Deliveries list and active DeliveryRecord DTO
- **Related Business Rules:** Decoupled delivery lifecycle; updates reflect in retailer app live.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 13. Delivery Dispatch Desk (Delivery Exception / Failed Drawer) (`yog_milk_admin_delivery_queue_update_drawer_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_delivery_queue_update_drawer_2/`
- **Files Inspected:** `code.html` (35499 bytes), `screen.png` (416172 bytes)
- **Purpose:** Logistics drawer for recording a delivery failure with mandatory reason.
- **Main Sections:** Delivery details, Failure reason dropdown (Retailer Booth Closed, Damaged Crate, Unreachable), Reschedule date picker, Driver return notes
- **UI Components:** Drawer sheet, Failure reason picker, Date picker, Save button
- **User Actions:** Log delivery failure, Schedule redelivery
- **Navigation Destination:** `/deliveries`
- **Mock Data Required:** Delivery exception payload
- **Related Business Rules:** Transitions to DELIVERY_FAILED and alerts operations.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 14. Non-GST Commercial Farm Bill (Full-Screen Preview) (`yog_milk_admin_invoices_non_gst_farm_bill_preview_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_invoices_non_gst_farm_bill_preview_1/`
- **Files Inspected:** `code.html` (42701 bytes), `screen.png` (859929 bytes)
- **Purpose:** Printable, professional commercial farm bill and delivery memo compliant with non-GST agricultural dairy exemption.
- **Main Sections:** Supplier brand header (YOG MILK DAIRY PRODUCTS PVT. LTD., Saswad Rd Plant, FSSAI #11519036000281), Invoice # (INV-2026-00412), Date, Order #, Retailer billing and delivery details, Itemized product lines (Pouches, Crates, Rate, Amount), Summary (Subtotal, Delivery fee, Total Amount, Amount Paid, Balance Due), Non-GST legal exemption disclaimer, Action buttons: 'Print Bill', 'Download PDF', 'Email'
- **UI Components:** Printable document sheet, Item table, Legal disclaimer box, Print button
- **User Actions:** Click 'Print Bill', Click 'Download PDF'
- **Navigation Destination:** `/invoices`
- **Mock Data Required:** CommercialInvoice DTO conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Rule 5: Zero GSTIN, CGST, SGST, IGST, or HSN tax calculations.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 15. Invoices Desk (Listing & Batch Operations) (`yog_milk_admin_invoices_non_gst_farm_bill_preview_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_invoices_non_gst_farm_bill_preview_2/`
- **Files Inspected:** `code.html` (31469 bytes), `screen.png` (485655 bytes)
- **Purpose:** Repository table of all issued commercial invoices with batch export capability.
- **Main Sections:** Monthly billing summary cards, Search by Invoice # or Retailer, Invoices TanStack table (Invoice #, Date, Retailer, Order #, Total, Status), Batch action: 'Download Selected PDFs (ZIP)'
- **UI Components:** Data table with checkboxes, Batch download bar, Search input
- **User Actions:** Filter by month, Select multiple invoices, Download batch ZIP
- **Navigation Destination:** `/invoices/[id]`
- **Mock Data Required:** List of CommercialInvoice summaries
- **Related Business Rules:** Rule 5: Non-GST commercial invoices only.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 16. Invoices Desk (Compact Print & Slip Layout) (`yog_milk_admin_invoices_non_gst_farm_bill_preview_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_invoices_non_gst_farm_bill_preview_3/`
- **Files Inspected:** `code.html` (31712 bytes), `screen.png` (479903 bytes)
- **Purpose:** Narrow slip / thermal print layout optimized for delivery drivers.
- **Main Sections:** Compact dairy bill slip, Barcode / Order Code scan header, Minimal item list, Driver cash acknowledgment signature line
- **UI Components:** Narrow bill slip container, Print button
- **User Actions:** Print packing slip
- **Navigation Destination:** `/invoices`
- **Mock Data Required:** Slip format invoice snapshot
- **Related Business Rules:** Slip format for physical crate delivery.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 17. Admin Sign-In Screen (Credentials & Role Switcher) (`yog_milk_admin_login_auth_states_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_login_auth_states_1/`
- **Files Inspected:** `code.html` (21165 bytes), `screen.png` (403771 bytes)
- **Purpose:** Secure authentication portal for dairy staff with simulated role switcher.
- **Main Sections:** YOG MILK Admin portal brand header, Staff email and password fields, Quick role switcher drawer (Super Admin, Operations Manager, Accounts, Dispatcher), Sign In CTA button
- **UI Components:** Card container, Email & password inputs, Primary button 'Sign In to Operations', Role switcher chips
- **User Actions:** Enter credentials, Select mock role, Click Sign In
- **Navigation Destination:** `/`
- **Mock Data Required:** Admin staff user credentials list
- **Related Business Rules:** Simulates authenticated administrative session.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 18. Admin Sign-In Screen (2FA / OTP Verification Simulation) (`yog_milk_admin_login_auth_states_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_login_auth_states_2/`
- **Files Inspected:** `code.html` (20666 bytes), `screen.png` (353330 bytes)
- **Purpose:** Simulated two-factor authentication for sensitive administrative roles.
- **Main Sections:** OTP entry header, 6-digit code numeric inputs, Resend OTP timer, Verify & Continue CTA
- **UI Components:** OTP input boxes, Timer text, Primary button 'Verify Identity'
- **User Actions:** Enter OTP, Click Verify
- **Navigation Destination:** `/`
- **Mock Data Required:** Simulated OTP state
- **Related Business Rules:** Simulated 2FA.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 19. Notification Center & Announcement Desk (Queue View) (`yog_milk_admin_notification_center_announcement_composer_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_notification_center_announcement_composer_1/`
- **Files Inspected:** `code.html` (36547 bytes), `screen.png` (457168 bytes)
- **Purpose:** Review system-wide notifications, operational alerts, and broadcast history.
- **Main Sections:** Notifications table (Title, Audience, Sent Date, Delivery Status, Read Rate), Filter tabs (All, Broadcasts, Order Updates, System Alerts), Button: 'Compose Announcement'
- **UI Components:** Data table, Status pills, Primary button 'Compose Announcement'
- **User Actions:** Filter notifications, Open composer modal
- **Navigation Destination:** `/notifications/compose`
- **Mock Data Required:** List of Notification records conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Durable notification records.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 20. Broadcast Announcement Composer Modal (`yog_milk_admin_notification_center_announcement_composer_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_notification_center_announcement_composer_2/`
- **Files Inspected:** `code.html` (46783 bytes), `screen.png` (500125 bytes)
- **Purpose:** Form modal for administrators to compose targeted notifications to retailers.
- **Main Sections:** Target Audience selector (All Retailers, Specific Category, Route Batch), Announcement Title input, Trilingual Message Body tabs (English, Hindi, Marathi), Notification Type selector (Info, Schedule Change, Product Arrival, Urgent), Send Announcement CTA
- **UI Components:** Modal dialog, Select dropdown, Tabs (EN/HI/MR), Textarea inputs, Primary button 'Send Broadcast'
- **User Actions:** Compose message in EN/HI/MR, Select audience, Send broadcast
- **Navigation Destination:** `/notifications`
- **Mock Data Required:** Announcement draft DTO
- **Related Business Rules:** Audience targeting rules.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 21. Announcement Preview & Dispatch Confirmation (`yog_milk_admin_notification_center_announcement_composer_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_notification_center_announcement_composer_3/`
- **Files Inspected:** `code.html` (37542 bytes), `screen.png` (465400 bytes)
- **Purpose:** Visual simulation of how the broadcast will render on mobile retailer screens.
- **Main Sections:** Mobile phone frame mockup, Push notification banner preview, In-app dialog preview, Recipient count estimate (e.g. 156 Retailers), Confirm Dispatch CTA
- **UI Components:** Phone preview container, Confirm dialog, Dispatch button
- **User Actions:** Verify preview, Confirm send
- **Navigation Destination:** `/notifications`
- **Mock Data Required:** Notification preview payload
- **Related Business Rules:** Broadcast dispatch.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 22. Order Detail & Status Transition Modal (Progression) (`yog_milk_admin_order_detail_status_dialog_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_order_detail_status_dialog_1/`
- **Files Inspected:** `code.html` (55650 bytes), `screen.png` (413628 bytes)
- **Purpose:** Granular order inspection and individual status progression modal.
- **Main Sections:** Order snapshot header (YM-2026-10381, Om Sai Dairy), Itemized pouches and crate breakdown table, Non-GST bill totals summary, Status progression modal dialog enforcing valid next states (e.g. Move from CONFIRMED to PROCESSING), Staff notes input
- **UI Components:** Modal dialog overlay, Status stepper, Staff note textarea, Primary button 'Confirm Transition'
- **User Actions:** Select next status, Enter transition note, Save status change
- **Navigation Destination:** `/orders`
- **Mock Data Required:** Single Order DTO with items snapshots and status history
- **Related Business Rules:** Enforces valid state machine progression; logs in order_status_history.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 23. Order Detail & Cancellation Dialog (Exception Handling) (`yog_milk_admin_order_detail_status_dialog_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_order_detail_status_dialog_2/`
- **Files Inspected:** `code.html` (24946 bytes), `screen.png` (371679 bytes)
- **Purpose:** Handles administrative order cancellation with mandatory reason code.
- **Main Sections:** Order snapshot, Cancellation alert container, Cancellation reason dropdown (Out of stock, Booth request, Schedule cutoff), Staff notes field, Destructive CTA 'Cancel Order & Zero Balance'
- **UI Components:** Confirmation dialog, Reason selector, Destructive button
- **User Actions:** Select cancel reason, Confirm cancellation
- **Navigation Destination:** `/orders`
- **Mock Data Required:** Order cancellation payload
- **Related Business Rules:** Cancelling resolves balance and unblocks retailer pending payment restriction.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 24. Ordering Schedule Settings Desk (Overview) (`yog_milk_admin_ordering_schedule`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_ordering_schedule/`
- **Files Inspected:** `code.html` (29772 bytes), `screen.png` (365003 bytes)
- **Purpose:** Overview of operational ordering gates, current automated status, and recurring schedule.
- **Main Sections:** Current Gate Status banner (AUTOMATED OPEN / CLOSED based on clock), Recurring hours summary card (07:00 AM – 05:00 PM IST), Operating weekdays pills (Mon, Tue, Wed, Thu, Fri, Sat), Scheduled calendar exception closures list, Button: 'Edit Schedule'
- **UI Components:** Status indicator pill with pulsating dot, Schedule summary card, Action button 'Edit Configuration'
- **User Actions:** Tap 'Edit Schedule', Add Holiday Closure
- **Navigation Destination:** `/schedule/edit`
- **Mock Data Required:** OrderingSchedule DTO conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Rule 1: Automated schedule. Strictly NO manual master on/off switch.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 25. Operational Gate Schedule Editor (Recurring Hours & Days) (`yog_milk_admin_ordering_schedule_operational_gate_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_ordering_schedule_operational_gate_1/`
- **Files Inspected:** `code.html` (34282 bytes), `screen.png` (635987 bytes)
- **Purpose:** Form to configure recurring daily ordering intervals and active days.
- **Main Sections:** Operating Hours editor (Start Time e.g. 07:00, End Time e.g. 17:00), Business Timezone indicator (Asia/Kolkata UTC+05:30), Active weekdays multi-select toggles (Monday through Saturday), Next opening message preview, Save Configuration CTA
- **UI Components:** Time picker inputs, Weekday toggle buttons, Live message preview card, Primary button 'Save Schedule'
- **User Actions:** Change open/close times, Toggle operating days, Save schedule
- **Navigation Destination:** `/schedule`
- **Mock Data Required:** OrderingSchedule settings model
- **Related Business Rules:** Updates take effect immediately on next order submission.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 26. Operational Gate Exception & Holiday Closure Manager (`yog_milk_admin_ordering_schedule_operational_gate_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_ordering_schedule_operational_gate_2/`
- **Files Inspected:** `code.html` (29657 bytes), `screen.png` (365508 bytes)
- **Purpose:** Manage planned calendar holidays or operational plant maintenance closures.
- **Main Sections:** Scheduled closures table (Date range, Reason e.g. Diwali Plant Maintenance, Created by), Add Exception modal form (Start date, End date, Reason, Custom notice), Delete exception action with confirmation
- **UI Components:** Data table, Date range picker, Textarea for notice, Modal container
- **User Actions:** Add holiday closure, Remove scheduled closure
- **Navigation Destination:** `/schedule`
- **Mock Data Required:** Schedule exceptions array
- **Related Business Rules:** System calculates CLOSED during exception periods automatically.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 27. Orders Management Desk (Standard Operational View) (`yog_milk_admin_orders_table_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_orders_table_1/`
- **Files Inspected:** `code.html` (39256 bytes), `screen.png` (441331 bytes)
- **Purpose:** High-density queue of daily incoming dairy orders.
- **Main Sections:** Page header with batch export buttons, Status filter tabs (All, Placed, Confirmed, Processing, Ready, Delivered, Cancelled), TanStack table with Order Code, Retailer Shop, Pouches/Crates, Total (₹), Order Status, Payment Status, Delivery Status, Table search & pagination
- **UI Components:** Multi-column table, Debounce search, Pill badges with status dots, Pagination footer, Row action dropdown
- **User Actions:** Filter by status, Search order code / retailer, Click row to view details, Advance order status
- **Navigation Destination:** `/orders/[id]`
- **Mock Data Required:** List of Order DTOs conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Decoupled status triad (Order, Payment, Delivery independent).
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 28. Orders Management Desk (Morning Dispatch Batch View) (`yog_milk_admin_orders_table_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_orders_table_2/`
- **Files Inspected:** `code.html` (48610 bytes), `screen.png` (434497 bytes)
- **Purpose:** Batch view for warehouse dispatch team preparing morning crate distribution.
- **Main Sections:** Batch dispatch summary (Route 1: Kothrud, Route 2: Hadapsar), Table showing Crate Breakdown (Cow Milk crates, Buffalo Milk crates), Batch action: 'Mark Selected as READY_FOR_DELIVERY'
- **UI Components:** Batch action bar, Checkbox multi-select table, Route grouping chips
- **User Actions:** Select all orders in route, Bulk transition status
- **Navigation Destination:** `/orders/[id]`
- **Mock Data Required:** Orders grouped by route and crate counts
- **Related Business Rules:** Only valid status transitions allowed.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 29. Orders Management Desk (High-Volume Priority Filter) (`yog_milk_admin_orders_table_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_orders_table_3/`
- **Files Inspected:** `code.html` (39098 bytes), `screen.png` (412824 bytes)
- **Purpose:** Filtered queue prioritizing high-volume commercial milk orders (> 100 Liters).
- **Main Sections:** High-volume priority filter active, Table sorted by milk volume descending, Wholesale value badges
- **UI Components:** Filter chip active, Sorted data table
- **User Actions:** Inspect high-volume accounts, Assign dedicated truck
- **Navigation Destination:** `/orders/[id]`
- **Mock Data Required:** High-volume filtered orders
- **Related Business Rules:** Commercial ordering thresholds.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 30. Payments Management Desk (Full Financial Ledger) (`yog_milk_admin_payments_table_blocked_accounts_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_payments_table_blocked_accounts_1/`
- **Files Inspected:** `code.html` (44667 bytes), `screen.png` (420428 bytes)
- **Purpose:** Centralized ledger of all financial transactions across all payment methods.
- **Main Sections:** Financial summary header (Total Billed vs Collected vs Outstanding), Filter tabs (All, Online Razorpay, Cash on Delivery, Blocked Accounts), TanStack table with Payment ID, Order Code, Retailer, Amount (₹), Method, Status, Verified Timestamp, Export CSV button
- **UI Components:** Data table, Financial stat cards, Method badges, Export button
- **User Actions:** Filter by payment method, Search by Order Code, Export CSV
- **Navigation Destination:** `/payments/[id]`
- **Mock Data Required:** List of PaymentRecord models conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Strict financial distinction; clear COD PENDING visibility.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 31. Payments Management Desk (COD Pending & Blocked Accounts Queue) (`yog_milk_admin_payments_table_blocked_accounts_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_payments_table_blocked_accounts_2/`
- **Files Inspected:** `code.html` (59357 bytes), `screen.png` (546730 bytes)
- **Purpose:** Operational queue of uncollected cash on delivery orders that are actively blocking retailers.
- **Main Sections:** Strict Zero-Credit Policy Warning Strip, Table filtered to 'Payment Status = PENDING', Aging days column, One-click 'Record Cash Collection' trigger per row
- **UI Components:** Warning strip, Table with red alert badges, Action button 'Record Cash'
- **User Actions:** Click 'Record Cash' (opens RecordPaymentDrawer), Inspect retailer profile
- **Navigation Destination:** `/retailers/[id]`
- **Mock Data Required:** Orders with paymentStatus == 'PENDING'
- **Related Business Rules:** Rule 2 (Pending Payment Block) & Rule 4 (COD Workflow).
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 32. Product Catalog & SKU Management Desk (`yog_milk_admin_products_categories_management_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_products_categories_management_1/`
- **Files Inspected:** `code.html` (56321 bytes), `screen.png` (430199 bytes)
- **Purpose:** Manage dairy inventory, crate rules, base wholesale prices, and stock availability.
- **Main Sections:** Categories navigation tabs (All, Milk Pouches, Artisanal Ghee, Paneer, Curd, Butter & Taak), SKUs TanStack table (Product Name, Pack Size, Base Rate ₹, Crate Capacity, Fat %, Stock Availability toggle), Button: 'Add New Product'
- **UI Components:** Data table, Stock toggle switch, Crate capacity badge, Action dropdown, Primary button 'Add Product'
- **User Actions:** Toggle stock availability, Edit product, Filter by category
- **Navigation Destination:** `/catalog/[id], /catalog/new`
- **Mock Data Required:** Complete SKUs catalog conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Changing prices does not alter historical order snapshots.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 33. Product Creation & SKU Edit Slide-Over Drawer (`yog_milk_admin_products_categories_management_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_products_categories_management_2/`
- **Files Inspected:** `code.html` (32803 bytes), `screen.png` (821488 bytes)
- **Purpose:** Form drawer for adding new dairy SKUs or editing pricing, pack sizes, and fat percentages.
- **Main Sections:** Drawer title: 'Edit Product', Category selector, Product English, Hindi, and Marathi names, Pack Size & Unit (ML, L, GM, KG), Base Wholesale Price input (₹), Minimum Order Quantity & Crate Capacity, Fat % and SNF % inputs, Stock availability switch, Save CTA
- **UI Components:** Slide-over sheet (shadcn), Text inputs, Number inputs, Select dropdown, Switch toggle, Primary button 'Save SKU'
- **User Actions:** Update wholesale rate, Update crate capacity, Save product
- **Navigation Destination:** `/catalog`
- **Mock Data Required:** Product edit form DTO
- **Related Business Rules:** Wholesale pricing rules.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 34. Operations & Fulfillment Analytics Desk (`yog_milk_admin_reports_operations_analytics_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_reports_operations_analytics_1/`
- **Files Inspected:** `code.html` (43251 bytes), `screen.png` (463021 bytes)
- **Purpose:** Analytics dashboard for dairy processing volume, fulfillment rates, and delivery punctuality.
- **Main Sections:** Date range picker (Last 7 Days, Last 30 Days, Custom), Daily milk volume fulfillment area chart (Demanded vs Delivered Liters), Delivery punctuality bar chart (On-time dawn delivery %), Crate loss / damage rate metric
- **UI Components:** Date range selector, Area charts (Recharts), Fulfillment rate gauge, Export report button
- **User Actions:** Change date filter, Export analytics CSV
- **Navigation Destination:** `/reports`
- **Mock Data Required:** Operational analytics datasets
- **Related Business Rules:** Exclusively operational volume; no credit analytics.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 35. Financial & Revenue Analytics Desk (`yog_milk_admin_reports_operations_analytics_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_reports_operations_analytics_2/`
- **Files Inspected:** `code.html` (33954 bytes), `screen.png` (382488 bytes)
- **Purpose:** Financial reporting on gross order value, cash collection efficiency, and pending receivables aging.
- **Main Sections:** Financial KPIs (Gross Billed Value, Cash Collections, Outstanding Balance), Revenue collection timeline bar chart (Razorpay vs Cash), Receivables aging breakdown (0-3 days, 4-7 days), Export accounting report button
- **UI Components:** Bar chart, Financial KPI cards, Aging breakdown table, Export button
- **User Actions:** Filter by date, Export financial statement
- **Navigation Destination:** `/reports`
- **Mock Data Required:** Financial report datasets
- **Related Business Rules:** Strict financial separation of Order Value vs Payments Collected.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 36. Admin Accounts & RBAC Permissions Desk (Staff List) (`yog_milk_admin_settings_rbac_permissions_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_settings_rbac_permissions_1/`
- **Files Inspected:** `code.html` (36059 bytes), `screen.png` (295580 bytes)
- **Purpose:** Manage administrator accounts, operational roles, and access credentials.
- **Main Sections:** Staff users TanStack table (Name, Email, Role badge, Status, Last Login), Role filter chips (Super Admin, Operations, Accounts, Dispatch), Button: 'Add Staff Member'
- **UI Components:** Data table, Role badges, Primary button 'Add Staff'
- **User Actions:** Search staff, Filter by role, Edit staff account
- **Navigation Destination:** `/settings/rbac/new`
- **Mock Data Required:** Staff user accounts list
- **Related Business Rules:** Role-based access control; least-privilege principles.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 37. Role Permissions Matrix & Governance Desk (`yog_milk_admin_settings_rbac_permissions_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_settings_rbac_permissions_2/`
- **Files Inspected:** `code.html` (48269 bytes), `screen.png` (312782 bytes)
- **Purpose:** Audit and configure permission capabilities across administrative roles.
- **Main Sections:** Role selection tabs (Super Admin, Operations, Accounts, Dispatch), Permissions matrix table (Capabilities vs Access levels: View, Edit, Approve, Audit), Security governance notes
- **UI Components:** Permissions matrix table, Checkbox toggles (read-only in prototype), Save button
- **User Actions:** Inspect role capabilities
- **Navigation Destination:** `/settings/rbac`
- **Mock Data Required:** RBAC permission matrix definition
- **Related Business Rules:** Zero client-side role assertions.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 38. Add / Edit Staff User Modal (`yog_milk_admin_settings_rbac_permissions_3`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_admin_settings_rbac_permissions_3/`
- **Files Inspected:** `code.html` (36113 bytes), `screen.png` (299969 bytes)
- **Purpose:** Modal form for provisioning new staff accounts with assigned roles.
- **Main Sections:** Staff full name input, Company email field, Assigned Role selector, Account status toggle, Save Staff Member CTA
- **UI Components:** Modal dialog, Input fields, Role select, Primary CTA button
- **User Actions:** Enter staff details, Assign role, Save
- **Navigation Destination:** `/settings/rbac`
- **Mock Data Required:** Staff user form DTO
- **Related Business Rules:** Staff account provisioning.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 39. Admin Design System Specification v2.4 (Kitchen Sink) (`yog_milk_design_system_clickable_prototype_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_design_system_clickable_prototype_1/`
- **Files Inspected:** `code.html` (94408 bytes), `screen.png` (217428 bytes)
- **Purpose:** Visual component library and design token verification gallery for the admin web dashboard.
- **Main Sections:** Color palette swatches (Primary Royal Navy, Terracotta Saffron, Milk Cream), Typography scale (Playfair Display + Plus Jakarta Sans), Button variants, Table styles, Badge matrix, Modal containers
- **UI Components:** Kitchen sink gallery
- **User Actions:** Inspect UI primitives
- **Navigation Destination:** `Internal design tool`
- **Mock Data Required:** Design tokens
- **Related Business Rules:** Admin visual benchmark.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 40. Admin Design System Interactive Component Showcase (`yog_milk_design_system_clickable_prototype_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_design_system_clickable_prototype_2/`
- **Files Inspected:** `code.html` (71535 bytes), `screen.png` (231814 bytes)
- **Purpose:** Interactive showcase for drawers, dialogs, form inputs, and notification toasts.
- **Main Sections:** Interactive drawer triggers, Modal triggers, Form controls showcase
- **UI Components:** Interactive UI components
- **User Actions:** Test dialogs and drawers
- **Navigation Destination:** `Internal design tool`
- **Mock Data Required:** Design tokens
- **Related Business Rules:** Admin visual benchmark.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 41. Logistics Route Map & Order Delivery Progression Tracker (`yog_milk_orders_tracking`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_orders_tracking/`
- **Files Inspected:** `code.html` (22821 bytes), `screen.png` (226393 bytes)
- **Purpose:** Visual delivery run monitor showing morning delivery batches across Pune routes.
- **Main Sections:** Route map summary (Route 1: Kothrud, Route 2: Hadapsar, Route 3: Swargate), Active trucks on route with vehicle IDs, Delivery drop status checklist per truck, Exception alert container
- **UI Components:** Route checklist cards, Status badges, Driver contact pills
- **User Actions:** Select route, Call driver
- **Navigation Destination:** `/deliveries`
- **Mock Data Required:** Active route dispatch data
- **Related Business Rules:** Decoupled delivery lifecycle.
- **Gap / Missing Elements:** Live vector map rendering (route step cards and vehicle cards are provided).
- **Implementation Status:** `DESIGN AVAILABLE`


### 42. Record Payment Modal (Manual COD Cash Collection) (`yog_milk_payment_record_modal_attempt_drawer_1`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_payment_record_modal_attempt_drawer_1/`
- **Files Inspected:** `code.html` (46641 bytes), `screen.png` (786740 bytes)
- **Purpose:** Authorized modal dialog for accounts staff to record physical cash received from delivery drivers.
- **Main Sections:** Order reference summary (YM-2026-10381, Suresh Patil, ₹ 2,450.00), Amount collected input (defaults to full due amount), Deposit slip / Receipt voucher reference number field, Received date & time picker, Staff verification notes, Confirm Cash Collection CTA
- **UI Components:** Modal dialog container, Currency input field, Voucher text field, Date/time input, Primary CTA button
- **User Actions:** Enter voucher number, Confirm payment recorded
- **Navigation Destination:** `/payments`
- **Mock Data Required:** Payment recording payload
- **Related Business Rules:** Rule 4: Admin manual recording transitions payment to PAID and immediately unblocks retailer.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 43. Payment Attempt History Drawer (`yog_milk_payment_record_modal_attempt_drawer_2`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_payment_record_modal_attempt_drawer_2/`
- **Files Inspected:** `code.html` (35346 bytes), `screen.png` (455423 bytes)
- **Purpose:** Detailed audit slide-over showing all attempts, gateway IDs, and manual recording logs for an order.
- **Main Sections:** Payment timeline, Razorpay gateway attempt log with error codes, Manual COD collection records with admin staff signatures, Audit timestamps
- **UI Components:** Drawer sheet, Timeline widget, Provider event badges
- **User Actions:** Inspect gateway response, Close drawer
- **Navigation Destination:** `/payments`
- **Mock Data Required:** Payment transaction history list
- **Related Business Rules:** Failed attempt does not erase earlier successful records.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 44. Operations Storefront Preview / Live Catalog Inspection (`yog_milk_storefront_home`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform/yog_milk_storefront_home/`
- **Files Inspected:** `code.html` (32493 bytes), `screen.png` (296364 bytes)
- **Purpose:** Admin view allowing staff to inspect how products and prices currently appear to retailers.
- **Main Sections:** Preview header: 'Retailer View Mode', Current live wholesale catalog grid, Active ordering gate status banner
- **UI Components:** Catalog grid, Wholesale price cards
- **User Actions:** Switch category view
- **Navigation Destination:** `/catalog`
- **Mock Data Required:** Live catalog state
- **Related Business Rules:** Mirror view of retailer catalog.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`

