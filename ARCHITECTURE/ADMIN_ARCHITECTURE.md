# YOG MILK — Admin Web Dashboard Architecture (ADMIN_ARCHITECTURE.md)
*Framework: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui*
*Design Benchmark: `UI_UX_REFERENCES/ADMIN_DASHBOARD/stitch_yog_milk_e_commerce_platform` (44 Screen References)*
*Role: Lead Software Architect & Senior Frontend Architect*

---

## 1. App Router Structure & Layout Architecture

The Admin Web Dashboard is designed as an operational command center. It uses the Next.js App Router to separate route segments, layouts, and data desks:

```
yog_milk_admin/
├── app/
│   ├── (auth)/
│   │   └── login/                     # Administrator authentication & role switcher
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Root AppShell: Collapsible Sidebar, Header, Alerts Drawer
│   │   ├── page.tsx                   # Operations Overview Dashboard (Daily volume, financial KPIs)
│   │   ├── retailers/
│   │   │   ├── page.tsx               # Retailers list & verification queue
│   │   │   └── [id]/page.tsx          # Retailer 360° Profile (History, Ledgers, Analytics)
│   │   ├── catalog/
│   │   │   ├── page.tsx               # Product SKU table & crate rules
│   │   │   └── categories/page.tsx    # Category taxonomy manager
│   │   ├── orders/
│   │   │   ├── page.tsx               # Live orders queue with multi-filter & status tabs
│   │   │   └── [id]/page.tsx          # Order details & status progression modal
│   │   ├── deliveries/
│   │   │   ├── page.tsx               # Logistics dispatch desk & route batches
│   │   │   └── [id]/page.tsx          # Delivery tracking drawer & driver assignment
│   │   ├── payments/
│   │   │   ├── page.tsx               # Financial ledger (Online vs Cash)
│   │   │   └── pending/page.tsx       # COD Pending queue (Record cash drawer)
│   │   ├── invoices/
│   │   │   ├── page.tsx               # Non-GST commercial invoices listing & batch export
│   │   │   └── [id]/page.tsx          # Full-screen Non-GST Farm Bill preview & PDF viewer
│   │   ├── notifications/
│   │   │   └── page.tsx               # Notification Center & broadcast announcement composer
│   │   ├── reports/
│   │   │   ├── page.tsx               # Business analytics (Daily volume trends, fulfillment)
│   │   │   └── exports/page.tsx       # Export accounting & delivery reports (CSV)
│   │   ├── schedule/
│   │   │   └── page.tsx               # Operational Gate: Recurring ordering schedule & holiday closures
│   │   ├── audit/
│   │   │   └── page.tsx               # Append-only administrative security audit log
│   │   └── settings/
│   │       ├── page.tsx               # General dairy plant settings
│   │       └── rbac/page.tsx          # Admin staff accounts & role permissions matrix
│   │
│   ├── api/                           # Mock API route handlers (simulated endpoints)
│   └── globals.css                    # Tailwind CSS base, design tokens, and utility classes
│
├── components/
│   ├── ui/                            # shadcn/ui primitives (Button, Dialog, Sheet, Table, Badge)
│   ├── layout/                        # Sidebar, Header, Breadcrumbs, TimezoneClock, QuickStatsBar
│   └── features/                      # Domain-specific interactive widgets
│       ├── orders/OrderStatusModal.tsx
│       ├── payments/RecordPaymentDrawer.tsx
│       ├── deliveries/UpdateDeliveryDrawer.tsx
│       ├── schedule/ScheduleConfigForm.tsx
│       └── invoices/FarmBillViewer.tsx
│
├── lib/
│   ├── types/                         # Canonical TypeScript interfaces (MOCK_DATA_CONTRACT.md)
│   ├── repositories/                  # Pure TypeScript repository contracts
│   ├── mock/                          # In-memory mock repositories and seed datasets
│   └── utils/                         # Date/time helpers (Asia/Kolkata), currency formatters (₹)
```

### 1.1 Global AppShell Layout (`components/layout/`)
- **`Sidebar.tsx`**: Collapsible 260px desktop navigation with badge counts (e.g. `12 Orders Placed`, `8 COD Pending`). Features active link highlighting in `#1f2a6b`.
- **`Header.tsx`**: Houses global search bar, simulated role switcher, active business timezone clock (`Asia/Kolkata`), notification bell with unread badge, and administrator user avatar menu.
- **`Breadcrumbs.tsx`**: Dynamic path hierarchy (e.g. `Dashboard > Retailers > Om Sai Dairy > Order History`).
- **`QuickStatsBar.tsx`**: Sticky status bar displaying current shift volume in Liters and automated schedule gate status.

---

## 2. Data Table Architecture: TanStack Table (`@tanstack/react-table`)

All operational data tables (Orders, Retailers, Deliveries, Payments, Invoices, Audit Logs) are built using `@tanstack/react-table`:

### 2.1 Reusable `DataTable<T>` Architecture
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  statusFilterColumn?: string;
  statusFilterOptions?: { label: string; value: string }[];
  onRowClick?: (row: TData) => void;
  batchActions?: React.ReactNode;
}
```
- **Capabilities:**
  - Multi-column sorting (e.g. sort by Amount descending, then Date).
  - Global debounce search across retailer name, phone, order code, and voucher number.
  - Multi-select row selection for batch printing packing slips or batch PDF downloads.
  - Pagination with customizable page sizes (10, 25, 50, 100 rows).
  - Responsive collapse: Horizontal scroll container with sticky left-most identifier column on tablet; stacked card layout on mobile.

---

## 3. Data Visualization & Chart Architecture: Recharts

Built using **Recharts** for responsive, server-safe SVG data visualizations:

1. **Daily Milk Volume Trend (`VolumeAreaChart.tsx`):**
   - Stacked Area Chart displaying Cow Milk (Liters) vs Buffalo Milk (Liters) over the past 14 days.
   - Gradients: Cow Milk `#8994db` to `#eaedff`; Buffalo Milk `#fc8127` to `#ffdbc8`.
2. **Sales vs Cash Collection (`RevenueBarChart.tsx`):**
   - Clustered Bar Chart comparing daily **Gross Order Value** vs **Payments Collected**.
   - Visually reinforces the strict financial separation required by business rules.
3. **Category Volume Breakdown (`CategoryDonutChart.tsx`):**
   - Donut Chart displaying volume share across Pouch Milk, Artisanal Ghee, Malai Paneer, Dahi, and Taak.

---

## 4. Form Validation Architecture: React Hook Form & Zod

All data entry forms utilize **React Hook Form** paired with **Zod** schema resolvers:

```typescript
// Example: Manual COD Payment Recording Schema
export const RecordPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order reference is required'),
  retailerId: z.string().min(1, 'Retailer ID is required'),
  amountCollected: z.number().positive('Amount must be greater than zero'),
  receiptVoucherNumber: z.string().min(3, 'Voucher/receipt number is required'),
  receivedTimestamp: z.string().min(1, 'Collection timestamp is required'),
  staffNotes: z.string().optional(),
});
export type RecordPaymentFormData = z.infer<typeof RecordPaymentSchema>;
```

- **Benefits:** Instant client-side validation, accessible field error messages, and type safety between form state and repository mutation methods.

---

## 5. Responsive Layout Strategy

| Viewport | Breakpoint | Sidebar Behavior | Data Table Treatment | Drawer / Modal Treatment |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop** | 1440px+ | Full 260px expanded | Full multi-column table | 480px Slide-over sheet |
| **Laptop** | 1024px–1439px | Compact / Icon sidebar | Condensed padding, sticky headers | 420px Slide-over sheet |
| **Tablet** | 768px–1023px | Overlay hamburger drawer | Horizontally scrollable table | 75% width sheet |
| **Mobile** | < 768px | Overlay drawer | Stacked responsive card layout | Full-screen modal |

> [!IMPORTANT]
> The body viewport strictly maintains `overflow-x: hidden`. Tables that require horizontal scrolling are contained within dedicated styled scroll wrappers with scroll indicators.

---

## 6. Testing Strategy

1. **Unit Tests (Jest / React Testing Library):**
   - Form schemas: Verify that `RecordPaymentSchema` and `ScheduleConfigSchema` reject invalid inputs.
   - Currency formatters: Verify `formatINR(2450.5)` produces `"₹ 2,450.50"`.
2. **Component Tests:**
   - Verify `DataTable` handles empty datasets gracefully with illustrated empty views.
   - Verify `OrderStatusModal` disables illegal state transitions (e.g. moving from `PLACED` directly to `DELIVERED`).
3. **Mock State Integration Tests:**
   - Execute the COD reconciliation cycle: Record cash payment in mock store → verify that the retailer's `hasPendingPaymentBlock` immediately updates to `false`.
