export type AdminNotificationType =
  | "ORDER_NEW"
  | "ORDER_UPDATE"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_PENDING_COD"
  | "PAYMENT_FAILED"
  | "DELIVERY_UPDATE"
  | "PRODUCT_AVAILABLE"
  | "SCHEDULE_CHANGE"
  | "RETAILER_APPROVAL"
  | "BROADCAST";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type NotificationCategory =
  | "ALL"
  | "ORDERS"
  | "DELIVERIES"
  | "PAYMENTS"
  | "SYSTEM"
  | "BROADCASTS";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  priority: NotificationPriority;
  category: "ORDERS" | "DELIVERIES" | "PAYMENTS" | "SYSTEM" | "BROADCASTS";
  targetAudience?: string; // e.g. "All Retailers", "Route #4", "Pending Payment Retailers"
  referenceId?: string; // e.g. "ORD-2026-1042", "RET-8841", "TXN-RZP-90214"
  metadata?: Record<string, string | number | boolean>;
}

export interface BroadcastAnnouncementInput {
  title: string;
  message: string;
  targetAudience: "ALL_RETAILERS" | "ROUTE_PUNE_EAST" | "ROUTE_PUNE_WEST" | "PENDING_PAYMENT_ONLY";
  priority: NotificationPriority;
  adminId: string;
}

export interface NotificationRepository {
  getNotifications(): Promise<AdminNotification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  sendBroadcast(input: BroadcastAnnouncementInput): Promise<AdminNotification>;
}

