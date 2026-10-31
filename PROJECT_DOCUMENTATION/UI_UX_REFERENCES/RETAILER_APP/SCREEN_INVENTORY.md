# YOG MILK — Retailer Android Application Screen Inventory & UI/UX Audit
*Document: SCREEN_INVENTORY.md | Location: PROJECT_DOCUMENTATION/UI_UX_REFERENCES/RETAILER_APP/*
*Audit Scope: Complete Inspection of Extracted Stitch Assets (`stitch_yog_milk_commerce_suite`)*
*Audited by: UI/UX Engineering Lead & Technical Analyst | Date: 31 October 2026*

---

## 1. Executive Summary & Audit Statistics
- **Total Discovered Retailer Assets:** 42 Directories (40 Interactive Screen Templates, 1 Design System MD, 1 Reference Graphic).
- **Total Audited Screens:** 40 Screens fully inspected (HTML, CSS, screenshots, and DOM trees).
- **Design System Baseline:** `sacred_dairy_vedic_wellness/DESIGN.md`.
- **Primary Typography:** `Playfair Display` (Headings) + `Plus Jakarta Sans` (UI / Numerals).
- **Primary Colors:** Deep Royal Indigo (`#051256`), Warm Terracotta (`#994700`), Saffron Amber (`#fc8127`), Milk Cream surfaces (`#faf8ff` / `#fcf9f3`).
- **Credit Exclusion Audit:** **Zero credit components found in retailer screens.** (100% compliant with Master Plan v2.0).

---

## 2. Comprehensive Screen Inventory (All 40 Screens)

### 1. Account & Profile Screen (`yog_milk_account`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_account/`
- **Files Inspected:** `code.html` (34655 bytes), `screen.png` (389424 bytes)
- **Purpose:** Manage retailer profile, delivery address, app language, and business support.
- **Main Sections:** Shop profile header (Om Sai Dairy, Pune), Account verification status badge, Delivery addresses list, Language Selector (English / हिन्दी / मराठी), FSSAI registration display, Dairy Plant Contact & Support, Sign Out button
- **UI Components:** Profile avatar card, Language radio sheet, Address card, Support link, Destructive button 'Sign Out'
- **User Actions:** Change language, Edit address, Call support, Sign out
- **Navigation Destination:** `/auth/sign-in`
- **Mock Data Required:** RetailerProfile DTO conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Language changes persist locally across app restarts.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 2. Account On Hold / Suspended Screen (`yog_milk_account_on_hold`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_account_on_hold/`
- **Files Inspected:** `code.html` (14448 bytes), `screen.png` (349374 bytes)
- **Purpose:** Display administrative account hold status with explicit reason code.
- **Main Sections:** Warning alert header, Reason card (e.g. Unresolved dispute / Route adjustment), Accounts contact desk, Appeal / Call button
- **UI Components:** Crimson status banner, Reason container, Phone CTA button
- **User Actions:** Tap 'Call Accounts Helpdesk'
- **Navigation Destination:** `/profile`
- **Mock Data Required:** Suspension reason string, admin actor timestamp
- **Related Business Rules:** Ordering is completely blocked while account is on hold.
- **Gap / Missing Elements:** Formal ticket submission form.
- **Implementation Status:** `DESIGN AVAILABLE`


### 3. Account Approval Pending Screen (`yog_milk_approval_pending`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_approval_pending/`
- **Files Inspected:** `code.html` (15254 bytes), `screen.png` (227827 bytes)
- **Purpose:** Inform retailer that their commercial registration is under review by YOG MILK dispatch admin.
- **Main Sections:** Status illustration (Hourglass / Shield), Verification timeline tracker, Application reference code, Catalog preview teaser CTA, Support call button
- **UI Components:** Status alert card, Timeline progression widget, Contact phone link, Outlined CTA 'Explore Catalog (View Only)'
- **User Actions:** Tap 'Explore Catalog', Tap 'Call Support (+91 20 2682 9900)'
- **Navigation Destination:** `/home (view-only catalog mode)`
- **Mock Data Required:** Registration date, expected verification window (typically 24 hours)
- **Related Business Rules:** Retailer can browse catalog prices but checkout is blocked.
- **Gap / Missing Elements:** None. Very well designed in Stitch.
- **Implementation Status:** `DESIGN AVAILABLE`


### 4. Bulk Cart Screen (English) (`yog_milk_cart`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_cart/`
- **Files Inspected:** `code.html` (24888 bytes), `screen.png` (247263 bytes)
- **Purpose:** Review bulk milk pouches and crates, verify volume, and proceed to checkout.
- **Main Sections:** Itemized cart items list with crate steppers, Daily milk volume total (e.g. 48 Liters), Delivery address card, Bill subtotal summary, Sticky checkout CTA bar
- **UI Components:** Crate stepper, Remove item swipe / button, Price breakdown card, Primary button 'Proceed to Checkout'
- **User Actions:** Update crate quantities, Remove item, Tap 'Proceed to Checkout'
- **Navigation Destination:** `/checkout`
- **Mock Data Required:** Cart state (items, crate count, total liters, subtotal)
- **Related Business Rules:** Rule 1 (Window check). Rule 2 (Pending payment check).
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 5. Bulk Cart Screen (Marathi Localization) (`yog_milk_cart_marathi`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_cart_marathi/`
- **Files Inspected:** `code.html` (25978 bytes), `screen.png` (240144 bytes)
- **Purpose:** Demonstrates native Marathi localization of the bulk cart.
- **Main Sections:** Localized header ('तुमची कार्ट'), Marathi dairy terms (उदा. 'म्हैस दूध १ लिटर', 'क्रेट संख्या'), Subtotal and checkout button ('ऑर्डर पुढे करा')
- **UI Components:** Marathi typography, Crate stepper, Price summary
- **User Actions:** Same as English Cart
- **Navigation Destination:** `/checkout`
- **Mock Data Required:** Marathi cart model
- **Related Business Rules:** Trilingual localization standard.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 6. Checkout Screen (Active Ordering Window) (`yog_milk_checkout`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_checkout/`
- **Files Inspected:** `code.html` (19973 bytes), `screen.png` (216403 bytes)
- **Purpose:** Finalize delivery address, select payment method, and submit order.
- **Main Sections:** Delivery booth address confirmation, Delivery instructions / notes field, Order items snapshot summary, Payment method selector (COD / Online Razorpay), Commercial non-GST billing notice, Slide to Pay / 'Place Order' CTA
- **UI Components:** Address picker card, Note input field, Radio list for Payment Method, Sticky CTA button
- **User Actions:** Select COD or Online, Enter delivery note, Tap 'Place Order'
- **Navigation Destination:** `/checkout/verifying-payment (Online) or /checkout/success/:orderCode (COD)`
- **Mock Data Required:** Checkout submission payload, retailer delivery address
- **Related Business Rules:** Enforces schedule window and single pending-payment restriction.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 7. Checkout Screen (Ordering Closed State) (`yog_milk_checkout_ordering_closed`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_checkout_ordering_closed/`
- **Files Inspected:** `code.html` (18490 bytes), `screen.png` (258779 bytes)
- **Purpose:** Checkout screen view when ordering hours have closed.
- **Main Sections:** Amber banner: Ordering window closed, Disabled submission button, Next opening countdown timer, Return to Home button
- **UI Components:** Warning card, Disabled CTA, Outlined back button
- **User Actions:** Tap 'Return to Catalog'
- **Navigation Destination:** `/home`
- **Mock Data Required:** Schedule closed status
- **Related Business Rules:** Rule 1: Blocks all submissions.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 8. Checkout Screen (Payment Blocked State) (`yog_milk_checkout_payment_pending_block`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_checkout_payment_pending_block/`
- **Files Inspected:** `code.html` (18286 bytes), `screen.png` (221977 bytes)
- **Purpose:** Checkout screen view when retailer has an unpaid prior order.
- **Main Sections:** Crimson block alert card, Blocking order code reference, Amount due summary, Direct action button 'Pay Outstanding Bill'
- **UI Components:** Error alert card, Primary CTA 'Clear Pending Payment'
- **User Actions:** Tap 'Pay Pending Order'
- **Navigation Destination:** `/orders/:orderCode`
- **Mock Data Required:** Unpaid order code, due amount
- **Related Business Rules:** Rule 2: Ordering lock.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 9. Complete Business Profile Screen (`yog_milk_complete_profile`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_complete_profile/`
- **Files Inspected:** `code.html` (19506 bytes), `screen.png` (185376 bytes)
- **Purpose:** Capture dairy booth registration details for admin verification.
- **Main Sections:** Shop identity card, Owner personal contact details, Delivery physical address, FSSAI License registration, Bottom submission CTA
- **UI Components:** Shop name input, Owner name input, Address text area, Pincode numeric field, FSSAI 14-digit validator, Primary CTA 'Submit for Verification'
- **User Actions:** Fill business fields, Tap 'Submit Application'
- **Navigation Destination:** `/auth/approval-pending`
- **Mock Data Required:** Retailer registration draft DTO
- **Related Business Rules:** All commercial fields mandatory; sets retailer status to PENDING_APPROVAL.
- **Gap / Missing Elements:** GPS location pin-drop map picker (address text entry is provided).
- **Implementation Status:** `DESIGN AVAILABLE`


### 10. Home Dashboard (Active Order Placed Variant) (`yog_milk_customer_home_order`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_customer_home_order/`
- **Files Inspected:** `code.html` (31573 bytes), `screen.png` (317465 bytes)
- **Purpose:** Home dashboard variant showing live status of today's placed order.
- **Main Sections:** Active order tracking strip (PLACED / PROCESSING), Dispatch timeline estimate, Quick Add Usual Items, Categories
- **UI Components:** Live order progress bar, View tracking CTA, Crate steppers
- **User Actions:** Tap 'Track Morning Delivery'
- **Navigation Destination:** `/orders/:orderCode/delivery`
- **Mock Data Required:** Active order progress state (PROCESSING, delivery code DEL-2026-08492)
- **Related Business Rules:** Decoupled status triad (Order PROCESSING, Delivery NOT_ASSIGNED).
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 11. Delivery Tracking Screen (Active) (`yog_milk_delivery_tracking`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_delivery_tracking/`
- **Files Inspected:** `code.html` (17797 bytes), `screen.png` (316079 bytes)
- **Purpose:** Live logistics tracker for morning milk delivery run.
- **Main Sections:** Delivery code (DEL-2026-08492), Live dispatch timeline (NOT_ASSIGNED -> ASSIGNED -> PICKED_UP -> OUT_FOR_DELIVERY -> DELIVERED), Assigned driver card (Name, Photo, Phone number), Vehicle registration number, Estimated booth arrival time (e.g. 05:15 AM), Direct 'Call Driver' action
- **UI Components:** Step-by-step dispatch timeline, Driver profile card, Call phone button, Vehicle tag
- **User Actions:** Tap 'Call Driver (+91 98221 44829)'
- **Navigation Destination:** `/orders/:orderCode`
- **Mock Data Required:** Delivery DTO conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Decoupled delivery lifecycle managed by admin dispatcher.
- **Gap / Missing Elements:** Live GPS vehicle map rendering (driver contact and step timeline are provided).
- **Implementation Status:** `DESIGN AVAILABLE`


### 12. Delivery Tracking Screen (Failed State) (`yog_milk_delivery_tracking_failed`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_delivery_tracking_failed/`
- **Files Inspected:** `code.html` (18490 bytes), `screen.png` (336448 bytes)
- **Purpose:** Displays exception information when morning delivery could not be completed.
- **Main Sections:** Crimson status banner: 'Delivery Incomplete', Failure reason code (e.g. Booth Closed / Route Roadblock), Dispatcher notes, Helpdesk contact CTA
- **UI Components:** Failure alert card, Reason text, Call operations button
- **User Actions:** Tap 'Contact Dairy Dispatch Desk'
- **Navigation Destination:** `/orders/:orderCode`
- **Mock Data Required:** Delivery failure reason code and timestamp
- **Related Business Rules:** Delivery status = DELIVERY_FAILED.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 13. Interactive Design System Prototype (`yog_milk_design_system_interactive_prototype`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_design_system_interactive_prototype/`
- **Files Inspected:** `code.html` (81409 bytes), `screen.png` (104117 bytes)
- **Purpose:** Comprehensive component library and design token verification gallery.
- **Main Sections:** Color palette swatches, Typography scale (Playfair Display + Plus Jakarta Sans), Button variants, Status badges matrix, Crate quantity steppers
- **UI Components:** Component kitchen sink
- **User Actions:** Inspect and interact with UI primitives
- **Navigation Destination:** `Internal design tool`
- **Mock Data Required:** Design token definitions
- **Related Business Rules:** Visual source of truth.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 14. Empty States Design Showcase (`yog_milk_empty_states_showcase`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_empty_states_showcase/`
- **Files Inspected:** `code.html` (32041 bytes), `screen.png` (182962 bytes)
- **Purpose:** Design gallery and reusable component catalog for all empty states.
- **Main Sections:** Empty Cart view, No Orders view, No Notifications view, No Invoices view
- **UI Components:** Illustrated empty container, Contextual title & copy, Primary action button
- **User Actions:** Tap showcase action buttons
- **Navigation Destination:** `Component showcase`
- **Mock Data Required:** Empty state mockup strings
- **Related Business Rules:** All empty states must provide a primary action button.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 15. Home Dashboard (Hindi Localization) (`yog_milk_home_hindi`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_home_hindi/`
- **Files Inspected:** `code.html` (33088 bytes), `screen.png` (215269 bytes)
- **Purpose:** Demonstrates native Hindi localization of the home dashboard.
- **Main Sections:** Localized header ('योग मिल्क'), Schedule gate in Hindi ('ऑर्डरिंग खिड़की खुली है'), Quick add ('नियमित ऑर्डर'), Categories in Hindi ('दूध पाउच', 'पनीर', 'घी')
- **UI Components:** Hindi typography layout, Pills with Devanagari numerals
- **User Actions:** Same as Home Open
- **Navigation Destination:** `Same as Home Open`
- **Mock Data Required:** Hindi translations of products, categories, and gate notices
- **Related Business Rules:** Trilingual localization standard.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 16. Home Dashboard (Ordering Closed) (`yog_milk_home_ordering_closed`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_home_ordering_closed/`
- **Files Inspected:** `code.html` (34822 bytes), `screen.png` (206300 bytes)
- **Purpose:** State of home dashboard when daily window is closed.
- **Main Sections:** Operational Gate Banner (CLOSED - Next opening countdown e.g. 07:00 AM Tomorrow), Informational notice: 'The ordering window is closed. We’ll notify you when ordering opens again.', View-only Quick Add (Disabled actions), Browse catalog banner
- **UI Components:** Amber lock banner, Countdown timer widget, Disabled checkout triggers, Browse catalog button
- **User Actions:** Browse catalog, View past orders, Set reminder notification
- **Navigation Destination:** `/catalog, /orders`
- **Mock Data Required:** Next opening timestamp (tomorrow 07:00 AM IST)
- **Related Business Rules:** Rule 1: Hard block on order submission; cart can be viewed but checkout is locked.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 17. Home Dashboard (Ordering Open) (`yog_milk_home_ordering_open`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_home_ordering_open/`
- **Files Inspected:** `code.html` (34245 bytes), `screen.png` (292271 bytes)
- **Purpose:** Primary operational landing screen when the daily ordering window is open.
- **Main Sections:** Top app bar with shop name & notification bell, Operational Gate Banner (OPEN - Countdown timer), Quick Add Usual Items carousel, Product category cards, Featured dairy SKUs, Persistent bottom navigation
- **UI Components:** Live clock pulsating pill, 1-tap reorder card, Category icon chips, Product card with crate stepper, Bottom nav bar
- **User Actions:** Tap 'Quick Reorder', Adjust crate stepper, Tap category chip, Open Cart
- **Navigation Destination:** `/cart, /catalog, /catalog/:productId, /notifications`
- **Mock Data Required:** Active ordering schedule, usual order items snapshot, category list, featured SKUs
- **Related Business Rules:** Rule 1 (Schedule Open). Rule 2 (No pending payment block active).
- **Gap / Missing Elements:** None. Benchmark reference screen.
- **Implementation Status:** `DESIGN AVAILABLE`


### 18. Home Dashboard (Pending Payment Block) (`yog_milk_home_payment_pending`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_home_payment_pending/`
- **Files Inspected:** `code.html` (35664 bytes), `screen.png` (235718 bytes)
- **Purpose:** Home screen showing active 'One Pending-Payment' restriction banner.
- **Main Sections:** Urgent alert banner: Previous order unpaid, Blocking order summary (Code, Amount due, COD pending), Direct 'Clear Due / View Order' CTA, Restricted quick-add (ordering blocked)
- **UI Components:** Warning card with exclamation icon, Pay Now CTA button, Disabled cart banner
- **User Actions:** Tap 'Pay Pending Order', Tap 'View Order Details'
- **Navigation Destination:** `/orders/:orderCode, /payments`
- **Mock Data Required:** Unpaid order code (YM-2026-10381), due balance (₹ 2,450.00)
- **Related Business Rules:** Rule 2: Retailer cannot checkout until this balance is marked PAID by admin.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 19. Non-GST Farm Bill / Invoice Preview Screen (`yog_milk_invoice_preview`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_invoice_preview/`
- **Files Inspected:** `code.html` (20466 bytes), `screen.png` (302603 bytes)
- **Purpose:** Full-screen preview of printable non-GST commercial bill.
- **Main Sections:** Dairy supplier header (YOG MILK, Saswad Road plant address, FSSAI #), Retailer billing & delivery details, Invoice #, Date, Order #, Itemized product lines (Pouches, Crates, Rate, Total), Subtotal, Delivery Fee, Final Total, Payment Mode & Settlement Status, Non-GST legal exemption footer, Bottom action: 'Download PDF' & 'Share'
- **UI Components:** Printable paper container, Item table, Exemption note, Download CTA
- **User Actions:** Tap 'Download PDF', Tap 'Share Bill'
- **Navigation Destination:** `/invoices/list`
- **Mock Data Required:** Full CommercialInvoice DTO conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Zero GSTIN, CGST, SGST, IGST, or HSN tax calculations.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 20. Invoices List Screen (`yog_milk_invoices_list`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_invoices_list/`
- **Files Inspected:** `code.html` (22467 bytes), `screen.png` (379204 bytes)
- **Purpose:** Commercial bill repository for monthly accounting and tax record-keeping.
- **Main Sections:** Month selector (e.g. October 2026), Total billed volume summary, Invoice cards list with Invoice # (INV-2026-00412), Order #, Date, Amount (₹), and Payment Status, One-tap PDF download button per card
- **UI Components:** Month picker, Invoice item card, Download icon button
- **User Actions:** Tap invoice card, Tap 'Download PDF'
- **Navigation Destination:** `/invoices/:invoiceNumber`
- **Mock Data Required:** List of CommercialInvoice summaries
- **Related Business Rules:** Rule 5: Non-GST commercial invoices only.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 21. Mid-Checkout Closed Intercept Dialog (`yog_milk_mid_checkout_dialog_ordering_closed`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_mid_checkout_dialog_ordering_closed/`
- **Files Inspected:** `code.html` (13446 bytes), `screen.png` (304674 bytes)
- **Purpose:** Modal intercept displayed if ordering window closes while user was filling checkout form.
- **Main Sections:** Clock alert icon, Title: 'Ordering Window Just Closed', Message: 'The ordering window closed at 05:00 PM. We could not complete your order. Your cart has been saved for tomorrow morning.', Next opening countdown, Primary button 'Understood'
- **UI Components:** Modal dialog container, Countdown pill, Primary action button
- **User Actions:** Tap 'Understood' (redirects to Home)
- **Navigation Destination:** `/home`
- **Mock Data Required:** Schedule closing cutoff time
- **Related Business Rules:** Rule 1: Prevents race condition submissions.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 22. Purchase Analytics / My Purchases Screen (`yog_milk_my_purchases`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_my_purchases/`
- **Files Inspected:** `code.html` (23203 bytes), `screen.png` (197271 bytes)
- **Purpose:** Review historical milk volume purchased and monthly spend trends.
- **Main Sections:** Lifetime milk volume counter (e.g. 8,420 Liters), Monthly volume chart, Most frequently ordered dairy SKUs, Average weekly order value
- **UI Components:** Stat card, Bar chart widget, Top SKUs list
- **User Actions:** Switch month filter, Quick add top SKU to cart
- **Navigation Destination:** `/catalog`
- **Mock Data Required:** Retailer analytics metrics
- **Related Business Rules:** Exclusively displays purchase volumes; zero credit metrics.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 23. Notifications Center Screen (`yog_milk_notifications`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_notifications/`
- **Files Inspected:** `code.html` (23400 bytes), `screen.png` (246751 bytes)
- **Purpose:** In-app notification feed for operational alerts, schedule openings, and order dispatches.
- **Main Sections:** Unread count badge, Filter tabs (All, Orders, Schedule, Payments), Notification cards list with timestamp and read/unread status indicator, 'Mark All as Read' action
- **UI Components:** Category tabs, Notification card with event icon, Unread dot, Mark read button
- **User Actions:** Filter tabs, Tap notification (navigates to target order/schedule), Mark all read
- **Navigation Destination:** `Target deep link (/orders/:orderCode, /home, /payments)`
- **Mock Data Required:** List of Notification records conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Durable events; notifications route only to the owning retailer.
- **Gap / Missing Elements:** Notification preferences toggle screen (push sound/vibrate).
- **Implementation Status:** `DESIGN AVAILABLE`


### 24. Order Detail Screen (COD Pending) (`yog_milk_order_detail_cod_pending`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_order_detail_cod_pending/`
- **Files Inspected:** `code.html` (27885 bytes), `screen.png` (417979 bytes)
- **Purpose:** Granular order breakdown showing Cash on Delivery pending status.
- **Main Sections:** Order code & placed timestamp, Status timeline (PLACED -> PROCESSING -> READY_FOR_DELIVERY), COD Payment Warning Card ('Payment Pending — Hand over cash to delivery driver'), Itemized pouches/crates list, Non-GST bill totals breakdown, Delivery address card, Actions: 'Track Delivery' & 'Download Invoice'
- **UI Components:** Order timeline tracker, Warning pill, Itemized table, Action buttons
- **User Actions:** Tap 'Track Delivery', Tap 'Download Commercial Bill'
- **Navigation Destination:** `/orders/:orderCode/delivery, /invoices/:invoiceNumber`
- **Mock Data Required:** Detailed Order DTO with items snapshots
- **Related Business Rules:** Payment status = PENDING; clear notice that admin confirms payment.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 25. Order Detail Screen (Hindi Localization) (`yog_milk_order_detail_hindi`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_order_detail_hindi/`
- **Files Inspected:** `code.html` (28960 bytes), `screen.png` (147462 bytes)
- **Purpose:** Demonstrates native Hindi localization of order details.
- **Main Sections:** Localized order code ('ऑर्डर #YM-2026-10381'), Hindi status timeline ('स्वीकृत' -> 'प्रक्रिया जारी' -> 'वितरण'), Itemized milk lines in Hindi ('गाय दूध १ लिटर', 'पनीर १ किग्रा'), Bill totals in Hindi ('कुल देय राशि')
- **UI Components:** Hindi typography, Status timeline, Item breakdown
- **User Actions:** Same as English detail
- **Navigation Destination:** `Same as English detail`
- **Mock Data Required:** Hindi localized order data
- **Related Business Rules:** Trilingual localization standard.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 26. Order Detail Screen (Online Paid) (`yog_milk_order_detail_online_paid`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_order_detail_online_paid/`
- **Files Inspected:** `code.html` (26620 bytes), `screen.png` (413315 bytes)
- **Purpose:** Granular order breakdown showing verified online payment.
- **Main Sections:** Order code & timestamp, Status timeline, Payment Verified Card ('Paid Online — Ref: RZP-948210'), Itemized product breakdown, Bill total breakdown, Delivery address, Invoice download button
- **UI Components:** Green verified badge, Timeline tracker, Item table, CTA button
- **User Actions:** Tap 'Download Commercial Bill', Tap 'Track Delivery'
- **Navigation Destination:** `/invoices/:invoiceNumber, /orders/:orderCode/delivery`
- **Mock Data Required:** Paid Order DTO with Razorpay provider reference
- **Related Business Rules:** Payment status = PAID.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 27. Order Placed Confirmation Screen (`yog_milk_order_placed_success`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_order_placed_success/`
- **Files Inspected:** `code.html` (17828 bytes), `screen.png` (209258 bytes)
- **Purpose:** Celebratory order confirmation screen with order code and morning delivery schedule.
- **Main Sections:** Green checkmark animation, Unique Order Code (e.g. YM-2026-10381), Delivery date & window (e.g. Tomorrow, 04:30 AM – 06:30 AM), Itemized summary preview, Payment mode badge (COD - Payment Due on Delivery), Buttons: 'View Order Details' & 'Return to Home'
- **UI Components:** Success card, Order code clipboard copy chip, Status badge, Primary & Outlined buttons
- **User Actions:** Tap 'Track Order', Tap 'Back to Home'
- **Navigation Destination:** `/orders/:orderCode, /home`
- **Mock Data Required:** Newly generated order snapshot conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Order Status = PLACED (or PROCESSING); Payment Status = PENDING (for COD).
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 28. Orders List Screen (`yog_milk_orders_list`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_orders_list/`
- **Files Inspected:** `code.html` (28359 bytes), `screen.png` (330204 bytes)
- **Purpose:** Review all past and active orders with status tabs and search.
- **Main Sections:** Top search bar by Order Code, Status filter tabs (All, Processing, Out for Delivery, Delivered, Cancelled), Order cards list with item counts, Liter totals, Rupee totals, and status badges, Quick reorder button per order card
- **UI Components:** Horizontal tabs, Order summary card, Decoupled Order & Payment status badges, Reorder button
- **User Actions:** Filter by status, Tap order card, Tap 'Reorder'
- **Navigation Destination:** `/orders/:orderCode`
- **Mock Data Required:** List of Order records conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Decoupled status triad.
- **Gap / Missing Elements:** Date range picker for order history.
- **Implementation Status:** `DESIGN AVAILABLE`


### 29. Payment Failed Screen (`yog_milk_payment_failed`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_payment_failed/`
- **Files Inspected:** `code.html` (15499 bytes), `screen.png` (240075 bytes)
- **Purpose:** Handles declined or timed out online payment attempts.
- **Main Sections:** Red error emblem, Title: 'Payment Incomplete', Failure reason (e.g. Bank timeout / UPI declined), Retry button, Switch to Cash on Delivery (COD) button
- **UI Components:** Error card, Primary CTA 'Retry Payment', Secondary CTA 'Switch to Cash on Delivery'
- **User Actions:** Tap 'Retry', Tap 'Pay with COD'
- **Navigation Destination:** `/checkout`
- **Mock Data Required:** Error message, order reference
- **Related Business Rules:** Failed attempt does not erase earlier cart or mark order paid.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 30. Payment History Ledger Screen (`yog_milk_payment_history`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_payment_history/`
- **Files Inspected:** `code.html` (27035 bytes), `screen.png` (208197 bytes)
- **Purpose:** Financial ledger of all commercial transactions, offline COD collections, and online payments.
- **Main Sections:** Payment balance card (Total Billed vs Total Paid vs Outstanding Balance), Unpaid COD alerts filter, Transactions list with Receipt Voucher #, Date, Order Code, and Payment Status badge, Download receipt action
- **UI Components:** Balance summary card, Filter chips, Payment row item, Status badge
- **User Actions:** Filter by Unpaid/Paid, Tap payment row, Download receipt memo
- **Navigation Destination:** `/orders/:orderCode`
- **Mock Data Required:** List of Payment records conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Strict financial separation of Order Value vs Payments Collected.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 31. Product Detail Screen (`yog_milk_product_detail`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_product_detail/`
- **Files Inspected:** `code.html` (21544 bytes), `screen.png` (319297 bytes)
- **Purpose:** Comprehensive SKU specifications, wholesale crate pricing, and nutritional specs.
- **Main Sections:** Product pack hero image, Product title, category, and Fat/SNF tags, Pricing tiers (Per Pouch ₹ vs Per Crate ₹), Minimum order quantity notice, Nutritional specs (Protein, Moisture, SNF), Bottom action bar with crate stepper & 'Add to Cart'
- **UI Components:** Hero image carousel, Spec table, Crate stepper, Primary CTA button
- **User Actions:** Adjust crate count, Tap 'Add Crate to Cart'
- **Navigation Destination:** `/cart`
- **Mock Data Required:** Single Product detail model with crate capacity and wholesale rate
- **Related Business Rules:** Order quantity must increment by crate capacity.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 32. Quick Add Usual Items Sheet / Screen (`yog_milk_quick_add_usual_items`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_quick_add_usual_items/`
- **Files Inspected:** `code.html` (27003 bytes), `screen.png` (287850 bytes)
- **Purpose:** High-velocity reordering screen for daily milk crate quotas.
- **Main Sections:** Header: 'Your Daily Usual Order', Usual SKUs with last-ordered crate quantities, Total daily milk volume (Liters), Total daily subtotal (₹), One-tap 'Add All to Cart & Checkout'
- **UI Components:** Crate quantity stepper (+/- 12/24 pouches), Milk volume calculator, Primary button 'Order Usual'
- **User Actions:** Increment/decrement crates, Tap 'Order Usual'
- **Navigation Destination:** `/cart, /checkout`
- **Mock Data Required:** Last successful order item snapshots and current prices
- **Related Business Rules:** Re-evaluates current live prices; blocks if schedule closed or payment pending.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 33. Reorder Review Bottom Sheet (`yog_milk_reorder_review_sheet`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_reorder_review_sheet/`
- **Files Inspected:** `code.html` (18462 bytes), `screen.png` (252289 bytes)
- **Purpose:** Fast confirmation sheet before submitting a repeat order.
- **Main Sections:** Order summary review, Delivery address confirmation, Payment mode selector (COD / Online), Confirm Order CTA
- **UI Components:** Modal drag handle, Address chip, Radio toggle, Slider / CTA button
- **User Actions:** Select payment mode, Tap 'Confirm Repeat Order'
- **Navigation Destination:** `/checkout/verifying-payment or /checkout/success`
- **Mock Data Required:** Reorder cart DTO
- **Related Business Rules:** Validates schedule and pending payment block.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 34. Search Empty State Screen (`yog_milk_search_empty_state`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_search_empty_state/`
- **Files Inspected:** `code.html` (20377 bytes), `screen.png` (262428 bytes)
- **Purpose:** Catalog search fallback when no SKUs match query.
- **Main Sections:** Search input with invalid query, Search illustration, Copy: 'No dairy products found matching your search', Suggested popular categories chips, Clear search button
- **UI Components:** Search bar, Empty illustration, Category chips
- **User Actions:** Tap category chip, Clear search
- **Navigation Destination:** `/catalog`
- **Mock Data Required:** Search query state
- **Related Business Rules:** Clean fallback without crashing or blank screen.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 35. Shop & Product Catalog Screen (`yog_milk_shop`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_shop/`
- **Files Inspected:** `code.html` (35526 bytes), `screen.png` (315017 bytes)
- **Purpose:** Browse full dairy product catalog with sorting, fat/snf filtering, and search.
- **Main Sections:** Search bar, Category tab bar (All, Cow Milk, Buffalo Milk, Ghee, Paneer, Curd, Taak), Filter pills (Fat %, Pack Size, Shelf Life), Product grid with crate calculators, Bottom cart bar
- **UI Components:** Search field, Horizontal scroll chips, Product card with Fat badge (e.g. 6.5% FAT), Crate add button, Floating cart pill
- **User Actions:** Search SKU, Filter by category, Add crate to cart, Tap product card
- **Navigation Destination:** `/catalog/:productId, /cart`
- **Mock Data Required:** Complete SKUs catalog conforming to MOCK_DATA_CONTRACT.md
- **Related Business Rules:** Wholesale pricing displayed exclusively to authenticated retailers.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 36. Retailer Sign-In Screen (`yog_milk_sign_in`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_sign_in/`
- **Files Inspected:** `code.html` (12698 bytes), `screen.png` (250361 bytes)
- **Purpose:** Simulated authentication entry for retailers using Phone OTP or Google Sign-In.
- **Main Sections:** Top Vedic branding bar, Language selector pill (EN/HI/MR), Phone number entry, Google Sign-In button, Mock role switcher drawer trigger
- **UI Components:** Phone text field (+91 prefix), Primary button 'Send OTP', Google OAuth button, Language dropdown modal, Terms & non-GST commercial policy notice
- **User Actions:** Enter 10-digit phone, Tap 'Continue', Tap 'Sign In with Google', Change language
- **Navigation Destination:** `/auth/complete-profile (new user) or /home (approved retailer)`
- **Mock Data Required:** Simulated phone verification, mock auth state switcher
- **Related Business Rules:** No live Supabase/Google SDK; simulate instantly.
- **Gap / Missing Elements:** Dedicated OTP PIN entry sub-screen (contained inline or in modal).
- **Implementation Status:** `DESIGN AVAILABLE`


### 37. Splash Screen (`yog_milk_splash`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_splash/`
- **Files Inspected:** `code.html` (15073 bytes), `screen.png` (527199 bytes)
- **Purpose:** Brand launch presentation, session bootstrap, and offline network verification.
- **Main Sections:** Hero Vedic emblem animation, Brand title 'YOG MILK', Vedic dairy tagline, Session loader
- **UI Components:** Animated brand logo, Circular spinner, Version label
- **User Actions:** Auto-transitions after 1.5s session check
- **Navigation Destination:** `/welcome (first launch) or /home (authenticated) or /auth/sign-in`
- **Mock Data Required:** App version (v2.4.0), active session token check
- **Related Business Rules:** Must verify local mock auth state before routing.
- **Gap / Missing Elements:** Explicit network connection failure retry trigger (covered by offline error screen).
- **Implementation Status:** `DESIGN AVAILABLE`


### 38. System States & Offline Error Screen (`yog_milk_system_states_offline_error_session_update`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_system_states_offline_error_session_update/`
- **Files Inspected:** `code.html` (32094 bytes), `screen.png` (530057 bytes)
- **Purpose:** Handles network disconnections and system maintenance errors.
- **Main Sections:** No internet / Offline banner, Error illustration, Title: 'Unable to Connect to YOG MILK Servers', Diagnostic advice, Retry connection button
- **UI Components:** Error container, Primary CTA 'Retry Connection'
- **User Actions:** Tap 'Retry Connection'
- **Navigation Destination:** `Retries active route`
- **Mock Data Required:** Offline error state
- **Related Business Rules:** Network error boundary.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 39. Verifying Payment Screen (`yog_milk_verifying_payment`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_verifying_payment/`
- **Files Inspected:** `code.html` (15833 bytes), `screen.png` (230851 bytes)
- **Purpose:** Simulated payment verification screen with 3-second animated state.
- **Main Sections:** Rotating Vedic seal / loader, Title: 'Verifying Online Payment...', Subtitle: 'Please do not press back or close the app', Prototype disclaimer pill
- **UI Components:** Circular progress indicator, Transaction reference text, Mock prototype notice banner
- **User Actions:** Auto-redirects after 3s simulation
- **Navigation Destination:** `/checkout/success/:orderCode or /checkout/payment-failed`
- **Mock Data Required:** Simulated transaction ID (mock_pay_94821)
- **Related Business Rules:** Must clearly label as mock prototype; never represent as real Razorpay verification.
- **Gap / Missing Elements:** None.
- **Implementation Status:** `DESIGN AVAILABLE`


### 40. Welcome Onboarding Carousel (`yog_milk_welcome_carousel`)
- **Stitch Reference Folder:** `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite/yog_milk_welcome_carousel/`
- **Files Inspected:** `code.html` (15287 bytes), `screen.png` (491622 bytes)
- **Purpose:** Introduce commercial value proposition of YOG MILK to dairy booth owners.
- **Main Sections:** 3-slide carousel hero, Slide pagination dots, Value proposition copy, Bottom action CTA bar
- **UI Components:** Carousel slider, Progress indicator pills, Primary CTA button ('Get Started'), Language toggle pill
- **User Actions:** Swipe between slides, Tap 'Get Started', Tap 'Sign In'
- **Navigation Destination:** `/auth/sign-in`
- **Mock Data Required:** 3 Onboarding slide data models (Procurement purity, Morning delivery, Fair B2B pricing)
- **Related Business Rules:** Displayed only once upon initial app launch or when manually triggered.
- **Gap / Missing Elements:** Skip button layout variation.
- **Implementation Status:** `DESIGN AVAILABLE`

