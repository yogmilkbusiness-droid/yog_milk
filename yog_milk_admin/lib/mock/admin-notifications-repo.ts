import {
  AdminNotification,
  BroadcastAnnouncementInput,
} from "@/lib/contracts/notification";

let notificationsStore: AdminNotification[] = [
  {
    id: "NOTIF-001",
    type: "ORDER_NEW",
    title: "New Bulk Dawn Order Received",
    message: "Om Sai Dairy & Sweets (Kothrud) placed Order #ORD-2026-1042 for 150L Buffalo Milk & 20kg Malai Paneer (₹14,800.00).",
    timestamp: "2026-10-31T09:15:00Z",
    isRead: false,
    priority: "HIGH",
    category: "ORDERS",
    referenceId: "ORD-2026-1042",
    metadata: { orderCode: "ORD-2026-1042", retailer: "Om Sai Dairy & Sweets", amount: 14800 },
  },
  {
    id: "NOTIF-002",
    type: "PAYMENT_PENDING_COD",
    title: "Driver Cash Collection Pending at Central Hub",
    message: "Van #04 driver submitted manifest for Shree Krishna Milk Centre. ₹3,600.00 cash awaiting administrative vault count.",
    timestamp: "2026-10-31T08:45:00Z",
    isRead: false,
    priority: "URGENT",
    category: "PAYMENTS",
    referenceId: "PAY-2026-004",
    metadata: { retailer: "Shree Krishna Milk Centre", pendingAmount: 3600, route: "Pune West" },
  },
  {
    id: "NOTIF-003",
    type: "PAYMENT_RECEIVED",
    title: "Razorpay Online Payment Confirmed",
    message: "₹2,720.00 settled via UPI QR for Order #ORD-2026-1040 (Mauli Milk Dairy, Hadapsar). Reference: TXN-RZP-902148.",
    timestamp: "2026-10-31T08:20:00Z",
    isRead: true,
    priority: "NORMAL",
    category: "PAYMENTS",
    referenceId: "TXN-RZP-902148",
  },
  {
    id: "NOTIF-004",
    type: "PAYMENT_FAILED",
    title: "Interrupted UPI Payment Attempt",
    message: "Jai Malhar Milk Bar initiated payment for ₹4,200.00 but transaction timed out at bank gateway. Retailer alerted.",
    timestamp: "2026-10-31T07:50:00Z",
    isRead: false,
    priority: "HIGH",
    category: "PAYMENTS",
    referenceId: "ORD-2026-1038",
  },
  {
    id: "NOTIF-005",
    type: "DELIVERY_UPDATE",
    title: "Dawn Dispatch Run Completed Successfully",
    message: "Route #1 (Kothrud - Karve Road) completed 18 of 18 delivery drops on time at 07:12 AM. Driver: Ramesh Shinde.",
    timestamp: "2026-10-31T07:15:00Z",
    isRead: true,
    priority: "NORMAL",
    category: "DELIVERIES",
    referenceId: "DEL-2026-001",
  },
  {
    id: "NOTIF-006",
    type: "RETAILER_APPROVAL",
    title: "New Commercial Retailer Pending Verification",
    message: "Ganesh Dairy Farm (Warje Malwadi) uploaded FSSAI registration & shop establishment certificate for verification.",
    timestamp: "2026-10-30T16:40:00Z",
    isRead: false,
    priority: "HIGH",
    category: "SYSTEM",
    referenceId: "RET-8846",
  },
  {
    id: "NOTIF-007",
    type: "PRODUCT_AVAILABLE",
    title: "Artisanal A2 Gir Cow Ghee Stock Replenished",
    message: "Batch #GHEE-OCT-26 (500 units, 500ml glass jars) certified by quality lab and published to retailer catalog.",
    timestamp: "2026-10-30T14:10:00Z",
    isRead: true,
    priority: "NORMAL",
    category: "SYSTEM",
    referenceId: "PROD-A2-GHEE",
  },
  {
    id: "NOTIF-008",
    type: "SCHEDULE_CHANGE",
    title: "Ordering Window Operational Gate Adjustment",
    message: "Operational window closing time confirmed at 17:00 IST. Evening cutoff buffer locked at 30 minutes.",
    timestamp: "2026-10-30T11:00:00Z",
    isRead: true,
    priority: "LOW",
    category: "SYSTEM",
  },
  {
    id: "NOTIF-009",
    type: "BROADCAST",
    title: "Dawn Logistics Notice: Diwali Dispatch Timings",
    message: "System broadcast sent to all 28 active retailers regarding uninterrupted dawn milk dispatches during festive week.",
    timestamp: "2026-10-29T10:00:00Z",
    isRead: true,
    priority: "NORMAL",
    category: "BROADCASTS",
    targetAudience: "All Retailers (Maharashtra Central)",
  },
  {
    id: "NOTIF-010",
    type: "ORDER_UPDATE",
    title: "Order Processed & Staged in Cold Room #2",
    message: "Order #ORD-2026-1041 transitioned to READY_FOR_DELIVERY. 80L Cow Milk packed in insulated crates.",
    timestamp: "2026-10-29T08:30:00Z",
    isRead: true,
    priority: "NORMAL",
    category: "ORDERS",
    referenceId: "ORD-2026-1041",
  },
];

export function getMockNotifications(): AdminNotification[] {
  return [...notificationsStore];
}

export function markMockNotificationAsRead(id: string): void {
  notificationsStore = notificationsStore.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
}

export function markAllMockNotificationsAsRead(): void {
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
}

export function sendMockBroadcastAnnouncement(
  input: BroadcastAnnouncementInput
): AdminNotification {
  const newBroadcast: AdminNotification = {
    id: `NOTIF-BC-${Date.now().toString().slice(-6)}`,
    type: "BROADCAST",
    title: input.title,
    message: input.message,
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: input.priority,
    category: "BROADCASTS",
    targetAudience:
      input.targetAudience === "ALL_RETAILERS"
        ? "All Active Retailers (Pune & Suburbs)"
        : input.targetAudience === "ROUTE_PUNE_EAST"
        ? "Route #1 - Pune East & Hadapsar"
        : input.targetAudience === "ROUTE_PUNE_WEST"
        ? "Route #2 - Kothrud & Karve Nagar"
        : "Retailers with Pending Payment Block (Rule 4.4)",
  };

  notificationsStore = [newBroadcast, ...notificationsStore];
  return newBroadcast;
}

