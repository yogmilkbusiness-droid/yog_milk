export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "DELIVERY_FAILED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "PARTIALLY_PAID"
  | "REFUNDED";

export type DeliveryStatus =
  | "NOT_ASSIGNED"
  | "ASSIGNED"
  | "PICKED_UP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED";

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number; // total units / pouches
  crateCount: number;
  unitPrice: number;
  lineTotal: number;
  fatPercentage?: number;
  snfPercentage?: number;
  batchCode?: string;
  specs?: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  fromStatus?: OrderStatus | DeliveryStatus | PaymentStatus;
  toStatus: OrderStatus | DeliveryStatus | PaymentStatus;
  statusType: "ORDER" | "DELIVERY" | "PAYMENT";
  timestamp: string; // Formatted date string
  adminId: string;
  adminName: string; // e.g. "Vikram Mehta (Operations Lead)"
  reason?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "YM-2026-000142"
  consignmentId?: string; // e.g. "YMD-2026-000142"
  retailerId: string;
  retailerBusinessName: string;
  retailerOwnerName?: string;
  retailerPhone: string;
  retailerArea: string;
  retailerFssai?: string;
  orderDate: string;
  orderTime?: string;
  dateKey?: string; // e.g. "2026-10-31" for filtering
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentMethod: "COD" | "ONLINE";
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalPayable: number;
  deliveryAddress: string;
  deliveryRouteId?: string;
  deliveryRouteName?: string;
  deliveryDriverName?: string;
  deliveryDriverPhone?: string;
  deliveryVehicleNumber?: string;
  crateCount?: number;
  coldBoxTemp?: string; // e.g. "3.4°C"
  scheduledSlot?: string; // e.g. "Dawn 05:30 – 07:00 AM"
  deliveredAt?: string;
  invoiceNumber?: string; // "INV-2026-0489" (Commercial Non-GST)
  notes?: string;
  deliveryNotes?: string;
  deliveryFailureReason?: string;
  deliveryFollowUpAction?: string;
  statusHistory?: OrderStatusHistoryItem[];
}

export interface OrderRepository {
  getOrders(filters?: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    deliveryStatus?: DeliveryStatus;
    retailerId?: string;
    search?: string;
    dateFilter?: string;
  }): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    adminId: string,
    adminName: string,
    reason?: string
  ): Promise<Order>;
  updateDeliveryStatus(
    id: string,
    newStatus: DeliveryStatus,
    adminId: string,
    adminName: string,
    payload?: {
      failureReason?: string;
      followUpAction?: string;
      deliveryNotes?: string;
    }
  ): Promise<Order>;
  cancelOrder(id: string, adminId: string, adminName: string, reason: string): Promise<Order>;
}
