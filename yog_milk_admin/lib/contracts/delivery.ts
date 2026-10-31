import { DeliveryStatus } from "./order";

export interface DeliveryRoute {
  id: string;
  routeName: string; // e.g. "Route 4: Nashik East (Indira Nagar & Old City)"
  driverName: string;
  driverPhone: string;
  vehicleNumber: string; // "MH 15 EG 4402"
  totalDrops: number;
  completedDrops: number;
  totalCrates: number;
  dispatchTime?: string;
  vanTemperature: string; // "3.8°C"
  status: "PENDING" | "DISPATCHED" | "COMPLETED";
}

export interface DeliveryConsignment {
  id: string; // e.g. "YMD-2026-000142"
  orderId: string;
  orderCode: string;
  retailerId: string;
  retailerName: string;
  retailerPhone: string;
  deliveryAddress: string;
  area: string;
  routeId: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  cratesCount: number;
  itemsSummary: string;
  orderTotal: number;
  paymentMethod: "COD" | "ONLINE";
  deliveryStatus: DeliveryStatus;
  scheduledSlot: string; // "Dawn 05:30 – 07:00 AM"
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  coldBoxTemp?: string;
  failureReason?: string;
  followUpAction?: string;
  dispatchNotes?: string;
}

export interface DeliveryRepository {
  getRoutes(): Promise<DeliveryRoute[]>;
  getConsignments(routeId?: string): Promise<DeliveryConsignment[]>;
  assignOrderToRoute(
    orderId: string,
    routeId: string,
    driverName: string,
    vehicleNumber: string
  ): Promise<void>;
  updateDeliveryStatus(
    consignmentId: string,
    status: DeliveryStatus,
    adminName: string,
    payload?: {
      failureReason?: string;
      followUpAction?: string;
      notes?: string;
    }
  ): Promise<void>;
}
