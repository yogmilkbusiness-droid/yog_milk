# YOG MILK — Canonical Mock Data Contract & Strategy (MOCK_DATA_CONTRACT.md)
*Shared TypeScript & Dart Entity Contracts, Seed Conventions, and Deterministic State Architecture*
*Role: Lead Software Architect | Status: Finalized for Mock-Data Frontend Phase*

---

## 1. Cross-Application Identifier & Seed Conventions

To ensure complete cross-application consistency between the Flutter Retailer App and the Next.js Admin Dashboard, both applications must strictly reference the same entity identifiers:

### 1.1 Standard Identifier Conventions
| Entity | ID Format | Example Identifier | Cross-App Usage |
| :--- | :--- | :--- | :--- |
| **Retailer** | `ret-NNN` | `ret-001`, `ret-002`, `ret-003` | Identifies commercial dairy booths |
| **Product** | `prod-<slug>` | `prod-cow-1l`, `prod-buf-1l` | Identifies dairy SKUs |
| **Category** | `cat-<slug>` | `cat-milk`, `cat-ghee`, `cat-paneer` | Product categorization |
| **Order** | `YM-YYYY-NNNNNN` | `YM-2026-10381`, `YM-2026-10382` | Human-readable order code |
| **Delivery** | `DEL-YYYY-NNNNNN`| `DEL-2026-08492`, `DEL-2026-08493`| Unique delivery dispatch reference |
| **Invoice** | `INV-YYYY-NNNN` | `INV-2026-00412`, `INV-2026-00413`| Sequential commercial farm bill number |
| **Payment** | `pay-NNN` | `pay-001`, `pay-002` | Financial transaction ledger ID |
| **Staff User** | `staff-NNN` | `staff-001` (Super Admin), `staff-002`| Admin accounts and audit actors |

---

## 2. Canonical TypeScript & Dart Entity Models

### 2.1 Retailer Model (`RetailerProfile`)
```typescript
export interface RetailerProfile {
  id: string;                         // e.g. "ret-001"
  shopName: string;                   // e.g. "Om Sai Dairy & Sweets"
  ownerName: string;                  // e.g. "Suresh Ganpat Patil"
  phone: string;                      // e.g. "+91 98220 12345"
  email: string;                      // e.g. "omsai.dairy@gmail.com"
  fssaiNumber: string;                // e.g. "11523038000142"
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  preferredLanguage: 'en' | 'hi' | 'mr';
  assignedRouteId: string;            // e.g. "route-kothrud"
  deliveryAddress: {
    line1: string;                    // "Shop 4, Anand Nagar, Paud Road"
    landmark: string;                 // "Near More Vidyalaya"
    area: string;                     // "Kothrud, Pune"
    pincode: string;                  // "411038"
    latitude: number;                 // 18.5074
    longitude: number;                // 73.8077
  };
  metrics: {
    lifetimeOrders: number;           // 142
    lifetimeVolumeLiters: number;     // 8420
    totalBilledAmount: number;        // 495000.00
    totalPaidAmount: number;          // 492550.00
    pendingBalance: number;           // 2450.00
    hasPendingPaymentBlock: boolean;  // true if pendingBalance > 0
    lastOrderDate: string;            // ISO 8601
    lastPaymentDate: string;          // ISO 8601
  };
  createdAt: string;
}
```

```dart
// Dart Equivalent
class RetailerProfile {
  final String id;
  final String shopName;
  final String ownerName;
  final String phone;
  final String email;
  final String fssaiNumber;
  final RetailerStatus approvalStatus;
  final String preferredLanguage;
  final String assignedRouteId;
  final DeliveryAddress deliveryAddress;
  final RetailerMetrics metrics;
  final DateTime createdAt;

  const RetailerProfile({
    required this.id,
    required this.shopName,
    required this.ownerName,
    required this.phone,
    required this.email,
    required this.fssaiNumber,
    required this.approvalStatus,
    required this.preferredLanguage,
    required this.assignedRouteId,
    required this.deliveryAddress,
    required this.metrics,
    required this.createdAt,
  });
}
```

---

### 2.2 Product & Category Models
```typescript
export interface Category {
  id: string;                         // "cat-milk"
  slug: string;                       // "milk-pouches"
  name: { en: string; hi: string; mr: string };
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;                         // "prod-cow-1l"
  categoryId: string;                 // "cat-milk"
  name: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  packSize: string;                   // "1 Liter Pouch"
  packUnit: 'ML' | 'L' | 'GM' | 'KG' | 'PIECE';
  unitQuantity: number;               // 1.0 (for 1L)
  baseWholesalePrice: number;         // 54.00 (₹ per pouch)
  minimumOrderQty: number;            // 12 (1 crate)
  orderIncrementQty: number;          // 12
  crateCapacity: number;              // 12 pouches per crate
  fatPercentage?: string;             // "3.5% FAT"
  snfPercentage?: string;             // "8.5% SNF"
  shelfLifeDays: number;              // 2
  imageUrl: string;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
}
```

---

### 2.3 Order & Order Items Model
```typescript
export interface OrderItem {
  id: string;
  productId: string;
  productNameSnapshot: string;        // "YOG Cow Milk Pouch"
  packSizeSnapshot: string;           // "1 Liter"
  unitPriceSnapshot: number;          // 54.00
  quantityPouches: number;            // 24
  quantityCrates: number;             // 2
  volumeLiters: number;               // 24.0
  lineTotal: number;                  // 1296.00
}

export interface Order {
  id: string;                         // UUID
  orderCode: string;                  // "YM-2026-10381"
  retailerId: string;                 // "ret-001"
  retailerName: string;               // "Om Sai Dairy & Sweets"
  orderStatus: OrderStatus;           // 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'DELIVERY_FAILED'
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentStatus: PaymentStatus;       // 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED'
  deliveryStatus: DeliveryStatus;     // 'NOT_ASSIGNED' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELIVERY_FAILED'
  deliveryCode: string;               // "DEL-2026-08492"
  invoiceNumber: string;              // "INV-2026-00412"
  items: OrderItem[];
  totalVolumeLiters: number;          // 48.0
  subtotalAmount: number;             // 2450.00
  deliveryFee: number;                // 0.00
  totalPayableAmount: number;         // 2450.00
  paidAmount: number;                 // 0.00 (or 2450.00 when paid)
  deliveryAddressSnapshot: RetailerProfile['deliveryAddress'];
  deliveryNotes?: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    actor: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

### 2.4 Payment Model (`PaymentRecord`)
```typescript
export interface PaymentRecord {
  id: string;                         // "pay-001"
  orderId: string;                    // Internal UUID
  orderCode: string;                  // "YM-2026-10381"
  retailerId: string;                 // "ret-001"
  retailerName: string;               // "Om Sai Dairy & Sweets"
  amount: number;                     // 2450.00
  paymentMethod: 'COD' | 'RAZORPAY';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  providerPaymentId?: string;         // "pay_rzp_94821" (for Razorpay) or null (for COD)
  receiptVoucherNumber?: string;      // "VCH-2026-8819" (recorded by admin for COD)
  recordedByAdminId?: string;         // "staff-002"
  staffNotes?: string;                // "Cash collected by morning driver Santosh"
  verifiedAt?: string;                // ISO 8601
  createdAt: string;
}
```

---

### 2.5 Delivery Model (`DeliveryRecord`)
```typescript
export interface DeliveryRecord {
  id: string;                         // "del-001"
  deliveryCode: string;               // "DEL-2026-08492"
  orderId: string;
  orderCode: string;                  // "YM-2026-10381"
  retailerId: string;                 // "ret-001"
  routeId: string;                    // "route-kothrud"
  routeName: string;                  // "Kothrud - Paud Road Route #1"
  driverName?: string;                // "Santosh Shinde"
  driverPhone?: string;               // "+91 98221 44829"
  vehicleNumber?: string;             // "MH 12 QX 4821"
  currentStatus: DeliveryStatus;      // 'NOT_ASSIGNED' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'DELIVERY_FAILED'
  estimatedArrivalWindow: string;     // "04:30 AM – 06:00 AM"
  failureReason?: string;             // e.g. "Shop shutter closed at dawn"
  dispatchedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}
```

---

### 2.6 Commercial Non-GST Invoice Model (`CommercialInvoice`)
```typescript
export interface CommercialInvoice {
  id: string;
  invoiceNumber: string;              // "INV-2026-00412"
  orderCode: string;                  // "YM-2026-10381"
  orderDate: string;                  // YYYY-MM-DD
  invoiceDate: string;                // YYYY-MM-DD
  retailer: {
    shopName: string;
    ownerName: string;
    phone: string;
    address: string;
    fssaiNumber: string;
  };
  supplier: {
    name: "YOG MILK DAIRY PRODUCTS PVT. LTD.";
    plantAddress: "Gate No. 142, Saswad-Pune Road, Wadki, Pune - 412308, Maharashtra";
    fssaiLicense: "11519036000281";
    phone: "+91 20 2682 9900";
    email: "care@yogmilk.in";
  };
  items: Array<{
    srNo: number;
    description: string;
    packSize: string;
    quantityPouches: number;
    quantityCrates: number;
    ratePerUnit: number;
    amount: number;
  }>;
  summary: {
    subtotal: number;
    deliveryCharges: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    paymentMode: 'CASH ON DELIVERY' | 'ONLINE (RAZORPAY)';
    paymentStatus: 'PAID' | 'UNPAID / COD DUE';
  };
  legalNotice: "Commercial Invoice / Delivery Memo issued under agricultural dairy exemption. No GST collected.";
}
```

---

### 2.7 Operational Schedule Model (`OrderingSchedule`)
```typescript
export interface OrderingSchedule {
  id: string;
  recurringOpenTime: string;          // "07:00:00" (IST)
  recurringCloseTime: string;         // "17:00:00" (IST)
  operatingDays: number[];            // [1, 2, 3, 4, 5, 6] (Mon-Sat)
  businessTimezone: string;           // "Asia/Kolkata"
  isCurrentlyOpen: boolean;           // Real-time evaluation
  nextOpeningTimestamp: string;       // ISO 8601
  exceptions: Array<{
    id: string;
    startDate: string;                // YYYY-MM-DD
    endDate: string;                  // YYYY-MM-DD
    reason: string;                   // e.g. "Diwali Processing Maintenance"
  }>;
}
```

---

## 3. Deterministic Mock Data Architecture & State Engine

Both applications utilize in-memory mock repositories that mutate session state deterministically.

### 3.1 Repository Interfaces
```typescript
export interface IOrderRepository {
  getOrders(filter?: OrderFilter): Promise<Order[]>;
  getOrderByCode(orderCode: string): Promise<Order | null>;
  createOrder(payload: CreateOrderPayload): Promise<Order>;
  updateOrderStatus(orderCode: string, nextStatus: OrderStatus, note?: string): Promise<Order>;
  cancelOrder(orderCode: string, reason: string): Promise<Order>;
}

export interface IPaymentRepository {
  getPayments(): Promise<PaymentRecord[]>;
  getPendingCODPayments(): Promise<PaymentRecord[]>;
  recordManualPayment(payload: RecordPaymentPayload): Promise<PaymentRecord>;
}

export interface IScheduleRepository {
  getSchedule(): Promise<OrderingSchedule>;
  updateRecurringSchedule(openTime: string, closeTime: string, days: number[]): Promise<OrderingSchedule>;
  addScheduleException(exception: ScheduleExceptionPayload): Promise<OrderingSchedule>;
  removeScheduleException(id: string): Promise<void>;
  setVirtualClockTime(isoTimestamp: string): Promise<void>; // Developer simulation toggle
}
```

### 3.2 In-Memory State Mutation Lifecycle
1. **Order Creation Mutation:**
   - Calling `createOrder(payload)` appends an `Order` object to `mockOrders`.
   - Generates sequential code `YM-2026-10383` and delivery code `DEL-2026-08494`.
   - Generates non-GST invoice `INV-2026-00414`.
   - If payment method is `COD`:
     - Creates `PaymentRecord` with status `PENDING`.
     - Updates `retailer.metrics.pendingBalance += totalPayableAmount`.
     - Sets `retailer.metrics.hasPendingPaymentBlock = true`.
2. **Manual Payment Recording Mutation:**
   - Calling `recordManualPayment({ orderCode, amount, voucherNumber, notes })`:
     - Finds the `PaymentRecord` and transitions status to `PAID`.
     - Updates `order.paymentStatus = 'PAID'` and `order.paidAmount = amount`.
     - Deducts `retailer.metrics.pendingBalance -= amount`.
     - Sets `retailer.metrics.hasPendingPaymentBlock = false`.
     - Immediately logs an entry in `mockAuditLogs`.

### 3.3 Asynchronous Latency & Error Simulation
- **Latency Simulator:** All mock repository methods wrap responses in `Future.delayed(Duration(milliseconds: 350))` in Flutter, and `await new Promise(r => setTimeout(r, 350))` in Next.js.
- **Error Simulation Mode:** A developer toggle (`isErrorSimulationActive: boolean`) can force methods to reject with `NetworkException`, testing UI shimmer recovery and offline fallback screens.
- **Global Reset Functionality:** `resetMockStateToSeed()` restores all retailers, orders, payments, deliveries, and schedule exceptions to the pristine seed state.
