export interface AdminNotification {
  id: string;
  category: "RISK_ALERT" | "COD_PENDING" | "GATE_SCHEDULE" | "LOGISTICS" | "PAYMENT_ISSUE";
  severity: "urgent" | "warning" | "info" | "neutral";
  title: string;
  entity: string;
  description: string;
  actionText: string;
  actionHref: string;
  timestamp: string;
  read: boolean;
}

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-01",
    category: "RISK_ALERT",
    severity: "warning",
    title: "Order Blocked (Rule 4.4)",
    entity: "Sharma General Store (Rajesh Sharma)",
    description: "Unpaid order YM-2026-000140 (₹3,200 COD pending). Next checkout auto-blocked per 0-credit policy.",
    actionText: "Review Order →",
    actionHref: "/orders",
    timestamp: "12m ago",
    read: false,
  },
  {
    id: "notif-02",
    category: "COD_PENDING",
    severity: "warning",
    title: "COD Reconcile Required",
    entity: "Route 4 Nashik East",
    description: "6 pending cash receipts awaiting morning run physical deposit verification (₹8,920).",
    actionText: "Verify COD →",
    actionHref: "/payments",
    timestamp: "28m ago",
    read: false,
  },
  {
    id: "notif-03",
    category: "PAYMENT_ISSUE",
    severity: "urgent",
    title: "Payment Error / Webhook Timeout",
    entity: "Order YM-2026-000141",
    description: "₹3,500 Razorpay webhook timeout. Customer account debited; order status not yet confirmed.",
    actionText: "Inspect Webhook →",
    actionHref: "/payments",
    timestamp: "45m ago",
    read: false,
  },
  {
    id: "notif-04",
    category: "LOGISTICS",
    severity: "info",
    title: "Delivery Route Re-assignment",
    entity: "Cold-Van 2 Re-assignment",
    description: "Crate batch #D-14 assigned to cold-van 2 to balance Gangapur Road delivery volume.",
    actionText: "View Route →",
    actionHref: "/deliveries",
    timestamp: "1h ago",
    read: true,
  },
  {
    id: "notif-05",
    category: "GATE_SCHEDULE",
    severity: "neutral",
    title: "Dawn Dispatch Cutoff",
    entity: "Scheduled Gate Closure",
    description: "Automatic ordering cutoff scheduled precisely at 5:00 PM today. Churning begins at 02:00 AM.",
    actionText: "Adjust Schedule →",
    actionHref: "/schedule",
    timestamp: "2h ago",
    read: true,
  },
];

