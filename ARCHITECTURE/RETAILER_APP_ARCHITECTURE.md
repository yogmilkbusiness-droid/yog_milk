# YOG MILK — Retailer Android App Architecture (RETAILER_APP_ARCHITECTURE.md)
*Framework: Flutter 3.x (Stable) & Dart 3.x | Target: Android Handhelds*
*Design Benchmark: `UI_UX_REFERENCES/RETAILER_APP/stitch_yog_milk_commerce_suite` (40 Screen References)*
*Role: Lead Software Architect & Senior Flutter Architect*

---

## 1. Feature-First Project Structure & Directory Responsibilities

The codebase follows a **Clean Feature-First Architecture**. The architecture avoids unnecessary generic boilerplate and isolates each business domain into a cohesive module.

```
yog_milk_retailer/
├── assets/
│   ├── fonts/                         # Playfair Display & Plus Jakarta Sans TTF files
│   ├── icons/                         # SVG icons (Milk pouch, crate, delivery truck, bell)
│   └── images/                        # High-res product pack renders & empty state illustrations
│
├── lib/
│   ├── main.dart                      # App entry point, ProviderScope, ErrorWidget setup
│   ├── app.dart                       # MaterialApp.router, ThemeData, localization delegates
│   │
│   ├── src/
│   │   ├── core/                      # Shared platform infrastructure (cross-cutting)
│   │   │   ├── constants/             # AppStrings, AssetPaths, StorageKeys, BusinessDefaults
│   │   │   ├── design_system/         # Centralized design system (Theme, Tokens, Components)
│   │   │   │   ├── theme/             # Material 3 ThemeData, ColorScheme, TextTheme
│   │   │   │   ├── tokens/            # AppColors, AppTypography, AppSpacing, AppRadius, AppShadows
│   │   │   │   └── widgets/           # Shared UI primitives: Button, Card, Stepper, Badge, Shimmer
│   │   │   ├── error_handling/        # AppException hierarchy, ErrorBoundary widget
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

### 1.1 Directory Responsibilities
- **`src/core/design_system/`**: Single source of truth for UI styling. Screen files must never declare raw hex colors or inline text styles.
- **`src/core/error_handling/`**: Standardizes error models (`AppException`, `ScheduleClosedException`, `PendingPaymentBlockedException`) and maps them to localized user-facing UI messages.
- **`src/core/localization/`**: Delivers dynamic English, Hindi, and Marathi translation without app restarts.
- **`src/core/mock_engine/`**: Houses in-memory state stores, seed data sets, and simulated latency timers.
- **`src/core/router/`**: Declarative routing with GoRouter, handling auth guards, deep links, and modal routes.
- **`src/features/<feature>/domain/`**: Pure Dart models and abstract repository contracts. Free of Flutter UI packages.
- **`src/features/<feature>/data/`**: Data Transfer Objects (DTOs) with JSON serialization, and repository implementations.
- **`src/features/<feature>/presentation/`**: Riverpod StateNotifiers, UI screen widgets, and sub-widgets.

---

## 2. Error Handling & Exception Architecture

All operational and domain exceptions inherit from a typed hierarchy:

```dart
// lib/src/core/error_handling/app_exception.dart
abstract class AppException implements Exception {
  final String message;
  final String? code;
  const AppException(this.message, [this.code]);
}

class NetworkException extends AppException {
  const NetworkException([String message = 'Unable to connect to YOG MILK servers']) 
      : super(message, 'NETWORK_ERROR');
}

class ScheduleClosedException extends AppException {
  final DateTime nextOpeningTime;
  const ScheduleClosedException(this.nextOpeningTime) 
      : super('The ordering window is closed. We’ll notify you when ordering opens again.', 'SCHEDULE_CLOSED');
}

class PendingPaymentBlockedException extends AppException {
  final String orderCode;
  final double dueAmount;
  const PendingPaymentBlockedException(this.orderCode, this.dueAmount) 
      : super('Ordering blocked: Unpaid balance on order $orderCode', 'PAYMENT_PENDING_BLOCK');
}

class AccountSuspendedException extends AppException {
  final String reason;
  const AccountSuspendedException(this.reason) 
      : super('Account on hold: $reason', 'ACCOUNT_SUSPENDED');
}
```

UI controllers catch `AppException` types and expose descriptive state objects, rendering tailored banners or modal dialogs without unhandled crashes.

---

## 3. Riverpod State Management Topology

The application utilizes **Riverpod (v2.x)** for dependency injection, asynchronous state handling, and reactive UI bindings.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RIVERPOD PROVIDER GRAPH                         │
│                                                                        │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌────────────┐   │
│   │   localeProvider    │   │  authStateProvider  │   │scheduleProv│   │
│   │ (LocaleController)  │   │  (AuthController)   │   │ (Schedule) │   │
│   └──────────┬──────────┘   └──────────┬──────────┘   └─────┬──────┘   │
│              │                         │                    │          │
│              ▼                         ▼                    ▼          │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 pendingPaymentBlockProvider                    │   │
│   │    (Calculates if active retailer has unpaid positive balance) │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│                                    ▼                                   ▼
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌────────────┐   │
│   │    cartProvider     │──►│   checkoutProvider  │   │ ordersList │   │
│   │  (CartController)   │   │ (CheckoutController)│   │ (Orders)   │   │
│   └─────────────────────┘   └─────────────────────┘   └────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Core Provider Contracts
1. **`CartController` (`cartProvider`)**:
   - Manages items map: `Map<String, CartItem>`.
   - Computes: `totalCrates`, `totalPouches`, `totalVolumeLiters`, `subtotalAmount`.
   - Methods: `addCrate(Product)`, `removeCrate(Product)`, `clearCart()`, `loadUsualItems()`.
2. **`ScheduleController` (`orderingScheduleProvider`)**:
   - Evaluates system clock against recurring hours (07:00 – 17:00 IST) and holiday closures.
   - Computes: `isOpen: bool`, `nextOpeningTimestamp: DateTime`, `formattedCountdown: String`.
3. **`CheckoutController` (`checkoutProvider`)**:
   - Validates `scheduleProvider.isOpen` and `pendingPaymentBlockProvider`.
   - Submits order: creates immutable snapshot, generates `YM-YYYY-NNNNNN` code, updates mock repository, and triggers pending payment block if COD.

---

## 4. Centralized GoRouter Routing Architecture

GoRouter provides declarative navigation, typed parameters, and authentication redirects.

### 4.1 Route Declarations & Paths
| Route Path | Name | Screen Widget | Purpose / Redirect Rule |
| :--- | :--- | :--- | :--- |
| `/splash` | `splash` | `SplashScreen` | App boot & mock session initialization. |
| `/welcome` | `welcome` | `WelcomeCarouselScreen` | 3-slide value proposition carousel. |
| `/auth/sign-in` | `signIn` | `SignInScreen` | Simulated phone/Google authentication. |
| `/auth/complete-profile`| `completeProfile` | `CompleteProfileScreen` | Capture shop name, address, FSSAI #. |
| `/auth/approval-pending`| `approvalPending` | `ApprovalPendingScreen` | Verification under review holding state. |
| `/auth/account-on-hold` | `accountOnHold` | `AccountOnHoldScreen` | Account suspension with support phone. |
| `/home` | `home` | `HomeScreen` | Operational Gate banner, Quick Add, Categories. |
| `/catalog` | `catalog` | `CatalogScreen` | SKU list with category chips and fat filters. |
| `/catalog/:productId` | `productDetail` | `ProductDetailScreen` | Crate specs, fat/snf badges, crate stepper. |
| `/cart` | `cart` | `CartScreen` | Bulk crate quantities, Liters sum, subtotal. |
| `/checkout` | `checkout` | `CheckoutScreen` | Address review, COD vs Online selector. |
| `/checkout/verifying` | `verifyingPayment`| `VerifyingPaymentScreen`| 3-second animated mock verification. |
| `/checkout/failed` | `paymentFailed` | `PaymentFailedScreen` | Incomplete payment retry / switch to COD. |
| `/checkout/success/:code`| `orderSuccess` | `OrderPlacedSuccessScreen`| Order code card and morning delivery date. |
| `/orders` | `ordersList` | `OrdersListScreen` | Status filter tabs (`ALL`, `PROCESSING`, etc.).|
| `/orders/:code` | `orderDetail` | `OrderDetailScreen` | Timeline, snapshots, invoice button. |
| `/orders/:code/delivery`| `deliveryTracking`| `DeliveryTrackingScreen`| Logistics status, driver call, vehicle tag. |
| `/invoices` | `invoicesList` | `InvoicesListScreen` | Monthly commercial bills repository. |
| `/invoices/:number` | `invoicePreview` | `InvoicePreviewScreen` | Non-GST Farm Bill preview & PDF download. |
| `/payments` | `paymentHistory` | `PaymentHistoryScreen` | Ledger of online & offline COD collections. |
| `/notifications` | `notifications` | `NotificationCenterScreen`| In-app alerts feed with unread filter. |
| `/profile` | `profile` | `ProfileScreen` | Shop details, address, language switch. |
| `/analytics` | `analytics` | `PurchaseAnalyticsScreen`| Lifetime Liters, top SKUs, monthly spend. |
| `/empty-showcase` | `emptyShowcase` | `EmptyStatesShowcaseScreen`| Design system gallery of empty states. |
| `/system-error` | `systemError` | `SystemErrorScreen` | Offline / network retry error boundary. |

---

## 5. Trilingual Localization Engine (English, Hindi, Marathi)

- **Architecture:** Managed via Flutter `intl` / `AppLocalizations` delegates.
- **Language Switcher:** Accessible from `ProfileScreen` and `SignInScreen`. Persisted locally in `SharedPreferences` via `LocaleController`.
- **Regional Dairy Dictionary in Marathi:**
  - Cow Milk → गाईचे दूध (3.5% FAT, 8.5% SNF)
  - Buffalo Milk → म्हशीचे दूध (Full Cream 6.5% FAT)
  - Ghee → शुद्ध साजूक तूप (Bilona Churned)
  - Curd / Dahi → ताजे दही
  - Buttermilk → मसाला ताक
  - Fresh Paneer → मलाई पनीर
  - Quick Add / Usual Order → नेहमीची ऑर्डर
  - Ordering Window Closed → ऑर्डरिंग वेळ बंद आहे

---

## 6. Shared Reusable UI Components Catalog

Located in `lib/src/core/design_system/widgets/`:
1. **`YogPrimaryButton`**: Material 3 filled button with `#051256` indigo fill, 8px radius, height 48dp, and integrated `CircularProgressIndicator` for loading states.
2. **`YogSecondaryButton`**: Saffron/Terracotta accent button (`#994700`) or outlined button.
3. **`CrateQuantityStepper`**: Dedicated dairy crate stepper incrementing in units of whole crates (12 or 24 pouches), updating real-time Liter equivalents.
4. **`YogStatusBadge`**: Pill capsule (`rounded-full`) with a 6px status dot and localized label for Order, Payment, and Delivery lifecycles.
5. **`OperationalGateBanner`**: Prominent card with clock icon, pulsating green dot when OPEN, or amber lock with countdown timer when CLOSED.
6. **`PendingPaymentAlertCard`**: Alert banner highlighting blocking order code, due balance (₹), and "Pay Now" action.
7. **`YogShimmerSkeleton`**: Animated gradient placeholder mirroring exact product card, order tile, and profile layouts during simulated latency.
8. **`YogEmptyState`**: Standardized empty illustration, contextual copy, and primary action button.

---

## 7. Quality Assurance & Testing Strategy

1. **Unit Testing:**
   - `CartControllerTest`: Verify crate-to-liter conversions, item additions, and subtotal arithmetic.
   - `ScheduleControllerTest`: Verify automated schedule transitions (OPEN vs CLOSED) across simulated boundary times (06:59 AM, 07:00 AM, 16:59 PM, 17:00 PM).
   - `PendingPaymentBlockTest`: Verify that placing a COD order activates the block and unblocks upon simulated payment confirmation.
2. **Widget Testing:**
   - Verify `CrateQuantityStepper` responds to tap events and disables decrement at zero.
   - Verify `OperationalGateBanner` renders correct localized text in English, Hindi, and Marathi.
3. **Static Analysis:**
   - Strict adherence to `flutter_lints`. Maintain zero warnings under `flutter analyze`.
