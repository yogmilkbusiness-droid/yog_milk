# YOG MILK — Retailer Android Application Agent Operating Instructions (AGENTS.md)
*Application: YOG MILK Retailer Android Application (`yog_milk_retailer`)*
*Role: Principal Flutter Architect & Senior Mobile Engineer*
*Framework: Flutter 3.x (Stable) & Dart 3.x | Target: Android Mobile (Handheld Portrait)*
*Design Benchmark: `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite` (40+ Screen References)*
*Source Baseline: Master Project Plan v2.0 (29 October 2026) & Root AGENTS.md*

---

## 1. Application Identity & Business Context

### 1.1 Commercial Role
The **Retailer Android Application** is the mission-critical commercial purchasing client for authorized dairy booth owners, independent grocers, milk parlors, and institutional buyers across Western Maharashtra (Pune, Pimpri-Chinchwad, Satara, Kolhapur).

Retailers use this application at non-standard hours (e.g. 05:00 AM during morning crate intake, and 02:00 PM to 04:30 PM before the ordering window closes) under demanding retail booth environments.

### 1.2 Non-Negotiable Usability Mandates
- **Single-Thumb Operation:** Primary checkout, crate steppers, and quick-add actions positioned in the lower thumb zone.
- **High-Contrast Legibility:** High-contrast text on dairy cream surfaces; crisp typography for volume numbers (Liters), rates (₹), and batch timestamps.
- **Trilingual Accessibility:** Complete native translation in **English**, **Hindi**, and **Marathi** (not transliteration).
- **Zero Ambiguity on Statuses:** Clean visual distinction between Order Progression, Payment Status, and Delivery Dispatch.

### 1.3 Current Phase Constraint
> [!IMPORTANT]
> **CURRENT PHASE: FRONTEND UI IMPLEMENTATION WITH MOCK DATA ONLY.**
> - **NO** Supabase integration, live authentication, or network REST/GraphQL APIs.
> - **NO** live Razorpay SDK execution or live card/UPI processing.
> - **NO** database migrations or backend business logic.
> - All state machines, checkout validations, and payment outcomes are simulated via deterministic in-memory mock repositories.

### 1.4 Absolute Exclusion of Credit Features
> [!CAUTION]
> In accordance with Version 2.0 of the Master Project Plan, **all credit features have been permanently expunged from the project**:
> - ❌ NO Credit Allocation, Credit Limits, or Credit Balances.
> - ❌ NO Credit Percentage or Earned Credit per order.
> - ❌ NO Credit Wallet, Credit Ledger, or Credit Expiry.
> - ❌ NO 7-Day Credit Payment Terms or Credit-based Checkout.
> - ❌ NO Credit-related UI tabs, cards, badges, or mock data fields.

---

## 2. Architecture & Modular Feature-First Organization

The application strictly follows a **Feature-First Clean Architecture**. Features are modular, self-contained, and decoupled from external frameworks.

```
yog_milk_retailer/
├── assets/
│   ├── fonts/                         # Playfair Display & Plus Jakarta Sans TTF/OTF files
│   ├── icons/                         # Brand SVGs, category icons, milk carton symbols
│   └── images/                        # High-resolution dairy product pack renders
│
├── lib/
│   ├── main.dart                      # App entry point, ProviderScope initialization
│   ├── app.dart                       # MaterialApp.router, ThemeData, localization delegates
│   │
│   ├── src/
│   │   ├── core/                      # Shared platform infrastructure
│   │   │   ├── constants/             # App strings, storage keys, business constants
│   │   │   ├── design_system/         # Centralized design system (Theme, Tokens, Components)
│   │   │   │   ├── theme/             # Material 3 ThemeData, ColorScheme, TextTheme
│   │   │   │   ├── tokens/            # AppColors, AppTypography, AppSpacing, AppRadius, AppShadows
│   │   │   │   └── widgets/           # Shared UI primitives: Button, Card, Stepper, Badge, Shimmer
│   │   │   ├── localization/          # Trilingual arb/json engine, LocaleController, AppLocalizations
│   │   │   ├── mock_engine/           # In-memory mock repositories, seed datasets, latency simulator
│   │   │   ├── router/                # Centralized GoRouter instance, route names, redirects
│   │   │   └── utils/                 # Currency formatters (₹), date helpers (IST), validators
│   │   │
│   │   └── features/                  # Domain-specific business modules
│   │       ├── auth/                  # Splash, Onboarding Carousel, Sign-In, Profile Setup, Approval
│   │       ├── home/                  # Schedule Gate Banner, Quick Add Usual Items, Category Grid
│   │       ├── catalog/               # Product Listing, Category Filter, Fat/SNF Badges, Product Detail
│   │       ├── cart/                  # Bulk Cart Bottom Sheet, Crate Stepper, Order Summary
│   │       ├── checkout/              # Schedule Validation, Payment Block Check, Payment Method Selector
│   │       ├── orders/                # Orders List, Status Filter Tabs, Order Detail, Timeline
│   │       ├── delivery/              # Live Logistics Tracking, Driver Info, Status History
│   │       ├── payments/              # Payment History, Unpaid COD Warning Banner, Mock Verification
│   │       ├── invoices/              # Non-GST Commercial Invoices List, Bill Preview, Mock PDF Download
│   │       ├── notifications/         # In-App Notification Center, Unread Badges, Event Filters
│   │       ├── profile/               # Shop Profile, Language Switcher, Delivery Address, Support
│   │       └── analytics/             # Retailer Purchase Analytics, Lifetime Volume, Frequent SKUs
```

### 2.1 Internal Structure of Every Feature
Each feature package under `lib/src/features/<feature_name>/` must be strictly organized into three distinct layers:

```
<feature_name>/
├── domain/                            # Enterprise business layer (Zero Flutter UI dependencies)
│   ├── models/                        # Strongly typed, immutable data models (e.g., Order, Product)
│   └── repositories/                  # Abstract repository contracts (e.g., OrderRepository)
│
├── data/                              # Data tier
│   ├── dtos/                          # JSON serialization DTOs and mappers
│   └── mock_repositories/             # In-memory mock implementations with realistic latency
│
└── presentation/                      # Presentation layer
    ├── controllers/                   # Riverpod StateNotifiers / Notifiers
    ├── screens/                       # Top-level route screens (e.g., CatalogScreen, OrderDetailScreen)
    └── widgets/                       # Feature-specific sub-widgets (e.g., ProductGridItem, OrderTimelineCard)
```

### 2.2 Architectural Rules & Guardrails
1. **No UI-Coupled Business Data:** UI widgets must never instantiate mock datasets or contain direct business calculations. All data flows through Riverpod providers accessing repository abstractions.
2. **Avoid Over-Abstraction:** Do not build generic multi-layered mediator or clean architecture boilerplate where a simple repository contract and StateNotifier suffices.
3. **Immutability Mandate:** All domain models must be `@immutable` with `copyWith()` methods and strict compile-time null safety.

---

## 3. State Management Directive: Riverpod

**Riverpod (v2.x)** is the mandatory state management framework.

### 3.1 Approved Provider Topology
All application state is exposed through typed providers:

| Provider Name | Type | Scope / Responsibility |
| :--- | :--- | :--- |
| `localeProvider` | `StateNotifierProvider<LocaleController, Locale>` | Manages active language (`en`, `hi`, `mr`) and persists selection. |
| `authStateProvider` | `StateNotifierProvider<AuthController, AuthState>` | Simulates user authentication (Guest, Unapproved, Approved Retailer). |
| `orderingScheduleProvider` | `StateNotifierProvider<ScheduleController, ScheduleState>` | Evaluates real-time open/closed status, operating hours, countdown timer. |
| `pendingPaymentBlockProvider`| `Provider<bool>` | Evaluates whether current retailer has an unresolved pending payment. |
| `catalogProvider` | `StateNotifierProvider<CatalogController, CatalogState>` | Product listing, category filtering, search queries, milk fat sorting. |
| `cartProvider` | `StateNotifierProvider<CartController, CartState>` | Bulk cart items, crate count calculations, volume sum, subtotal amount. |
| `ordersListProvider` | `StateNotifierProvider<OrdersListController, OrdersListState>`| Order history, active orders, status filter tabs (`ALL`, `PROCESSING`, etc.). |
| `orderDetailProvider(code)` | `FutureProvider.family<Order, String>` | Fetches comprehensive details, timeline, and invoice reference for an order. |
| `deliveryTrackingProvider(code)`| `FutureProvider.family<Delivery, String>` | Live logistics status, assigned driver name, phone, vehicle registration. |
| `paymentHistoryProvider` | `StateNotifierProvider<PaymentHistoryController, PaymentState>`| Past transactions, unpaid COD reminders, receipt voucher records. |
| `invoicesProvider` | `FutureProvider<List<CommercialInvoice>>` | Commercial non-GST bills list and downloadable PDF records. |
| `notificationsProvider` | `StateNotifierProvider<NotificationController, NotificationState>`| Realtime notification list, unread badge count, filter tabs. |
| `retailerAnalyticsProvider` | `FutureProvider<RetailerAnalytics>` | Lifetime volume (Liters), monthly spend trends, frequent SKUs. |

### 3.2 Provider Guidelines
- Use `ConsumerWidget` or `Consumer` rather than wrapping entire screens in top-level state listeners.
- Use `ref.watch(provider.select(...))` to target specific model attributes and eliminate unnecessary widget rebuilds.
- Handle Riverpod `AsyncValue` (`data`, `loading`, `error`) gracefully on every async screen with tailored shimmer skeletons and error views.

---

## 4. Centralized Navigation Architecture: GoRouter

The application utilizes **GoRouter** with a declarative route tree, type-safe path parameters, and navigation guardrails.

### 4.1 Route Map & Screen Inventory

```
/                                            -> Initial redirect based on simulated Auth state
├── splash                                   -> SplashScreen (Vedic logo reveal, mock preload)
├── welcome                                  -> WelcomeCarouselScreen (Brand intro, 3-slide value prop)
├── auth/
│   ├── sign-in                              -> SignInScreen (Mock Phone/Google Sign-In, language switch)
│   ├── complete-profile                     -> CompleteProfileScreen (Shop Name, Owner, FSSAI, Address)
│   ├── approval-pending                     -> ApprovalPendingScreen (Verification awaiting notice)
│   └── account-on-hold                      -> AccountOnHoldScreen (Suspension message & support link)
│
├── shell                                    -> StatefulShellRoute (Persistent Bottom Navigation)
│   ├── /home                                -> HomeScreen (Schedule Gate, Usual Items, Categories)
│   ├── /catalog                             -> CatalogScreen (Full SKU list, Fat/SNF filters, search)
│   ├── /orders                              -> OrdersListScreen (Status tabs, active order cards)
│   ├── /notifications                       -> NotificationCenterScreen (Unread tabs, announcements)
│   └── /profile                             -> ProfileScreen (Shop details, address, language toggle)
│
├── catalog/
│   └── :productId                           -> ProductDetailScreen (Pack sizes, crate savings, specs)
├── cart                                     -> CartScreen (Bulk crate steppers, volume calculator)
├── checkout/
│   ├── review                               -> CheckoutScreen (Delivery address, COD vs Online toggle)
│   ├── closed-intercept                     -> OrderingClosedDialog / Screen (Window closed message)
│   ├── payment-blocked                      -> PaymentPendingBlockScreen (Unpaid order warning)
│   ├── verifying-payment                    -> VerifyingPaymentScreen (3-second simulated gateway check)
│   ├── payment-failed                       -> PaymentFailedScreen (Retry trigger or switch to COD)
│   └── success/:orderCode                   -> OrderPlacedSuccessScreen (Order code card, next steps)
│
├── orders/
│   ├── :orderCode                           -> OrderDetailScreen (Item breakdown, status, payment state)
│   └── :orderCode/delivery                  -> DeliveryTrackingScreen (Live route, vehicle & driver)
│
├── invoices/
│   ├── list                                 -> InvoicesListScreen (Monthly commercial bills)
│   └── :invoiceNumber                       -> InvoicePreviewScreen (Non-GST Farm Bill preview & PDF)
│
├── payments                                 -> PaymentHistoryScreen (Ledger, unpaid COD alerts, receipts)
├── analytics                                -> PurchaseAnalyticsScreen (Volume graphs, frequent items)
├── empty-states-showcase                    -> EmptyStatesShowcaseScreen (Design gallery of empty states)
└── system-error                             -> SystemErrorScreen (Network retry, offline fallback)
```

### 4.2 Simulated Auth & Redirection Protocol
During this mock phase:
- Authentication state is held in `authStateProvider`.
- Toggling simulated user roles (Guest, Unregistered, Unapproved, Approved Retailer, Suspended) is accessible via a hidden developer drawer or quick switch on the sign-in screen to allow instant testing of all routing branches.
- When an unapproved retailer attempts to checkout, the router redirects them to `/auth/approval-pending`.

---

## 5. Centralized Yog Milk Design System

All visual styling is consolidated under `lib/src/core/design_system/`. **Arbitrary, hardcoded hex values or inline text styles in screen files are strictly forbidden.**

### 5.1 Color Tokens (`AppColors`)
Directly mapped from Stitch assets (`sacred_dairy_vedic_wellness/DESIGN.md`):
- **Brand Primary:** `#051256` (Deep Royal Indigo)
- **Primary Container:** `#1f2a6b` (Dark Blue elevated container)
- **On-Primary:** `#ffffff` (White high contrast)
- **Brand Secondary / Accent:** `#994700` (Warm Terracotta)
- **Secondary Container:** `#fc8127` (Vibrant Saffron Amber)
- **Backgrounds:** `#faf8ff` (Milk Cream Surface) & `#fcf9f3` (Vedic Warm Cream)
- **Surfaces & Cards:** `#ffffff` (Pure White) with `#dde1f8` & `#c6c5d2` container borders
- **Text:** `#161b2b` (Deep Slate on-surface) & `#454650` (Muted Slate on-surface-variant)
- **Semantic Status Badges:**
  - `PLACED`: Background `#e0f2fe`, Text `#0369a1` (Soft Ocean)
  - `CONFIRMED`: Background `#e0e7ff`, Text `#3730a3` (Indigo)
  - `PROCESSING`: Background `#fef3c7`, Text `#b45309` (Amber Saffron)
  - `READY_FOR_DELIVERY`: Background `#fae8ff`, Text `#86198f` (Plum)
  - `OUT_FOR_DELIVERY`: Background `#f3e8ff`, Text `#7e22ce` (Royal Purple)
  - `DELIVERED` / `PAID`: Background `#dcfce7`, Text `#15803d` (Vedic Green)
  - `FAILED` / `BLOCKED`: Background `#fee2e2`, Text `#b91c1c` (Crimson Error)

### 5.2 Typography Tokens (`AppTypography`)
Configured in `TextTheme`:
- **Display & Headings:** `Playfair Display` (SemiBold 600) — Artisanal, premium, high-trust dairy presence.
- **Body, Numerals & UI:** `Plus Jakarta Sans` (400, 500, 600, 700) — Modern, clean, open numerals for quantities and currency.

### 5.3 Shared Reusable UI Components
Must be built in `lib/src/core/design_system/widgets/`:
1. **`YogPrimaryButton`:** Full-width or inline button with primary indigo fill, rounded 8px corners, loading spinner support.
2. **`YogSecondaryButton`:** Saffron/Terracotta accent button or outlined button.
3. **`YogStatusBadge`:** Pill capsule (`rounded-full`) with a 6px status dot and localized uppercase label.
4. **`CrateQuantityStepper`:** Large touch-target circular stepper incrementing by pouch or whole crate (e.g. 12 or 24 pouches), displaying real-time Liter equivalents.
5. **`OperationalGateBanner`:** Dynamic header card displaying real-time `OPEN` (green pulsator) or `CLOSED` (amber clock with countdown timer).
6. **`PendingPaymentAlertCard`:** Warning card highlighting blocking order code, due amount, and "Pay Now" action.
7. **`YogShimmerSkeleton`:** Shimmer loading placeholder mirroring the exact layout of product cards, order rows, and profile details.
8. **`YogEmptyState`:** Standardized empty illustration, contextual copy, and primary action button.

---

## 6. Core Business Rules Enforced on Mobile

### 6.1 Automated Ordering Schedule (Operational Gate)
- **Automated Calculation:** The schedule operates on admin-configured hours (default 07:00 AM to 05:00 PM IST, Mon–Sat).
- **Enforcement:** If `isCurrentlyOpen == false`:
  - The Home Screen displays the closed banner with dynamic countdown to the next opening.
  - Cart checkout and "Buy Now" buttons are disabled.
  - Tapping an attempted checkout presents the approved message:
    > *"The ordering window is closed. We’ll notify you when ordering opens again."*

### 6.2 The "One Pending-Payment" Ordering Restriction
- If the current retailer has any prior order with `paymentStatus == 'PENDING'`:
  - Home and Cart display a prominent alert banner.
  - Order submission is strictly blocked.
  - The UI displays: Blocking Order Code (e.g. `YM-2026-10381`), pending amount (e.g. `₹ 2,450.00`), and a direct link to that order.

### 6.3 Decoupled Status Triad
- Never conflate Order Status with Payment Status or Delivery Status:
  - An order can be `PROCESSING` while its Payment is `PENDING` (COD order).
  - An order can be `DELIVERED` physically while its COD payment remains `PENDING` awaiting morning depot reconciliation.

### 6.4 Non-GST Commercial Invoices
- Invoices are strictly titled **"Commercial Invoice"** or **"Farm Bill / Delivery Memo"**.
- **PROHIBITED:** Never display GSTIN, CGST, SGST, IGST, or HSN tax calculations.

### 6.5 Trilingual UI Standard
- 100% of user-facing strings must support English, Hindi, and Marathi.
- Marathi localized dairy terminology must be used (e.g., म्हशीचे दूध, गाईचे दूध, ताक, तूप, लोणी, नेहमीची ऑर्डर).

---

## 7. Mock Data Engine Architecture

All mock data must reside in `lib/src/core/mock_engine/` and strictly conform to `SHARED_DOCUMENTATION/MOCK_DATA_CONTRACT.md`.

### 7.1 Realistic Western Maharashtra Seed Data
- **Retailer Entities:** Authentic shops in Pune, Kothrud, Hadapsar, Swargate, Satara, and Kolhapur.
- **Dairy SKUs:**
  - Cow Milk (500ml @ ₹28.00, 1000ml @ ₹54.00, 3.5% FAT, 8.5% SNF)
  - Buffalo Full Cream Milk (500ml @ ₹36.00, 1000ml @ ₹70.00, 6.5% FAT, 9.0% SNF)
  - Vedic A2 Gir Cow Milk (1000ml Glass Bottle @ ₹110.00)
  - Fresh Malai Paneer (1kg Vacuum Pack @ ₹380.00)
  - Artisanal Cow Ghee (500ml Jar @ ₹490.00, 1000ml Tin @ ₹950.00)
  - Traditional Set Dahi (400g Cup @ ₹45.00)
  - Spiced Masala Taak (200ml Pouch @ ₹15.00)
  - White Cooking Butter (500g Block @ ₹280.00)

### 7.2 Asynchronous Simulation & In-Memory Mutation
- Mock repositories must simulate realistic network delay (`Future.delayed(const Duration(milliseconds: 350))`) to allow loading skeletons to render smoothly.
- Mock repositories must maintain in-memory mutable state:
  - Placing an order updates the mock order list.
  - Placing a COD order sets `hasPendingPaymentBlock = true`, immediately disabling subsequent checkouts.
  - Simulating admin payment clearance immediately releases the pending-payment block.

### 7.3 Gateway Simulation Guardrail
- On `/checkout/verifying-payment`, display a realistic 3-second animated verification spinner.
- Clearly label all mock payment screens with a developer notice:
  > *"[MOCK PROTOTYPE] Simulated payment transaction for evaluation only. No real money charged."*
- Never represent a mock transaction as a real bank or Razorpay confirmation.

---

## 8. Development Quality & Engineering Hygiene

1. **Focused Widget Composition:** Widgets should remain concise (< 150 lines). Split complex cards and screens into dedicated sub-widgets.
2. **Const Constructors:** Use `const` constructors wherever parameters are compile-time constants to optimize widget tree rebuilds.
3. **Dart Analysis:** Maintain zero warnings and zero errors under `flutter analyze`. Follow `flutter_lints` rules strictly.
4. **Mandatory 4-State UI Handling:** Every interactive screen must implement:
   - **Populated:** Rich, realistic data layouts.
   - **Loading:** Tailored shimmer skeleton cards matching the screen layout.
   - **Empty:** Illustrated view with clear contextual copy and CTA.
   - **Error / Blocked:** Constructive error message with retry trigger.
5. **Unit & Widget Testing:** Write unit tests for Riverpod controllers (`CartController`, `ScheduleController`, `AuthController`) and mock repositories to verify business rules (e.g. pending-payment block trigger, crate volume calculations).

---

## 9. Staged Implementation Control

Development must proceed in strict alignment with `DEVELOPMENT/DEVELOPMENT_ROADMAP.md`. **Never attempt to implement all features simultaneously.**

```
Stage 1: Project Scaffolding & Design System Foundations (Theme, Tokens, Typography, Router Shell)
Stage 2: Core Mock Data Engines & State Providers (Seed Data, Contracts, Latency)
Stage 3.1: Auth & Onboarding Flow (Splash, Carousel, Sign-In, Complete Profile, Approval Pending)
Stage 3.2: Home Dashboard & Operating Gate (Open/Closed Banner, Quick Add, Categories)
Stage 3.3: Catalog & Product Details (Filter, Fat/SNF Badges, Crate Stepper)
Stage 3.4: Cart, Checkout & Payment Simulation (Gate Check, Block Alert, COD vs Online, Success)
Stage 3.5: Orders List, Details & Live Delivery Tracking (Timeline, Driver Info)
Stage 3.6: Commercial Non-GST Invoices & PDF Preview (Farm Bill Viewer)
Stage 3.7: Notifications Center, Profile & Trilingual Localization Audit
```

**Always wait for explicit user instruction before proceeding to any stage or sub-stage.**

---

## 10. Agent Reporting Protocol (Flutter)

At the end of every implementation turn, the agent must report:
1. **Current Stage & Tasks Implemented:** Specific screens, controllers, and widgets authored.
2. **Files Created / Modified:** Exact file paths with a one-sentence summary of responsibilities.
3. **Dependencies Introduced:** Package names and versions (if any; keep to approved stack).
4. **Navigation Routes Verified:** Tested GoRouter paths.
5. **Test & Analysis Results:** Confirmation of `flutter analyze` passing with 0 warnings.
6. **Known Mock Limitations:** Explicit description of in-memory behaviors simulated.
7. **Verification of Safeguards:** Explicit confirmation that `DATABASE/schema.sql` remains empty and zero credit features were introduced.
8. **Next Step:** Immediate next recommended action awaiting user approval.
