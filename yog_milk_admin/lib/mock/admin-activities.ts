export interface AdminActivity {
  id: string;
  timestamp: string;
  category: "PAYMENT" | "LOGISTICS" | "ORDER" | "SCHEDULE" | "RETAILER" | "SECURITY";
  title: string;
  description: string;
  adminName: string;
  adminRole: string;
  badgeVariant?: "placed" | "confirmed" | "processing" | "ready" | "outForDelivery" | "delivered" | "pending" | "paid" | "cancelled";
}

export const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: "act-01",
    timestamp: "10 mins ago",
    category: "PAYMENT",
    title: "Manual COD Payment Recorded",
    description: "₹2,550 recorded for Panchavati Retail (YM-2026-000138) by Cash Handover Receipt #CR-8819",
    adminName: "Snehal Kulkarni",
    adminRole: "Accounts Executive",
    badgeVariant: "paid",
  },
  {
    id: "act-02",
    timestamp: "24 mins ago",
    category: "LOGISTICS",
    title: "Morning Dispatch Cycle #29A Out",
    description: "56 crates dispatched across Routes 1 to 4 from Nashik Central Cold Hub",
    adminName: "Vikram Mehta",
    adminRole: "Operations Lead",
    badgeVariant: "outForDelivery",
  },
  {
    id: "act-03",
    timestamp: "45 mins ago",
    category: "ORDER",
    title: "Bulk Order Placed via Kirana App",
    description: "Shree Krishna Milk Centre submitted YM-2026-000142 (40L Gir Cow Milk + 5kg Paneer)",
    adminName: "System Automation",
    adminRole: "Automated Ingestion",
    badgeVariant: "placed",
  },
  {
    id: "act-04",
    timestamp: "1 hour ago",
    category: "RETAILER",
    title: "Rule 4.4 Checkout Block Enforced",
    description: "Sharma General Store attempted new cart checkout; blocked due to unpaid COD YM-2026-000140 (₹3,200)",
    adminName: "Rule 4.4 Enforcement Engine",
    adminRole: "Zero-Credit Policy",
    badgeVariant: "cancelled",
  },
  {
    id: "act-05",
    timestamp: "2 hours ago",
    category: "SCHEDULE",
    title: "Ordering Window Opened Automatically",
    description: "Recurring schedule 07:00 – 17:00 IST activated for Western India Kirana network",
    adminName: "Operational Gatekeeper",
    adminRole: "Automated Gate",
    badgeVariant: "confirmed",
  },
  {
    id: "act-06",
    timestamp: "3 hours ago",
    category: "RETAILER",
    title: "New Retailer Verified & Approved",
    description: "Mauli Kirana & Milk Parlour (Hadapsar) approved with zero credit line (Prepaid / COD only)",
    adminName: "Priya Deshmukh",
    adminRole: "Super Admin",
    badgeVariant: "delivered",
  },
];

