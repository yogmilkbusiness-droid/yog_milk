export type RetailerApprovalStatus =
  | "APPROVED"
  | "WAITING_APPROVAL"
  | "SUSPENDED"
  | "BLOCKED"
  | "REJECTED";

export interface FrequentProduct {
  productId: string;
  name: string;
  packSize: string;
  category: string;
  avgDailyUnits: number;
  highlightTag?: string;
}

export interface RetailerDocument {
  id: string;
  title: string;
  documentType: "FSSAI_LICENSE" | "SHOP_ESTABLISHMENT" | "IDENTITY_PROOF" | "STOREFRONT_PHOTO";
  fileNumber?: string;
  status: "VERIFIED" | "PENDING_REVIEW" | "REJECTED";
  verifiedAt?: string;
}

export interface RetailerTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  category: "ONBOARDING" | "VERIFICATION" | "ORDER" | "PAYMENT" | "SECURITY" | "DELIVERY";
}

export interface Retailer {
  id: string;
  accountCode: string; // e.g. "YM-CUST-8839"
  businessName: string; // e.g. "Sharma General Store"
  ownerName: string; // e.g. "Rajesh Sharma"
  phone: string;
  email?: string;
  city: string; // "Pune" / "Nashik"
  area: string; // "Gangapur Road" / "Kothrud"
  deliveryAddress: string;
  boothNumber?: string;
  status: RetailerApprovalStatus;
  statusNote?: string;
  hasPendingPaymentBlock: boolean; // Enforces Rule 4.4
  outstandingBalance: number;
  totalOrdersCount: number;
  totalBilledValue: number;
  totalPaymentsReceived: number;
  deliveredOrdersCount: number;
  registeredAt: string;
  verifiedAt?: string;
  verifiedBy?: string;

  // Route & Logistics
  assignedRouteId: string;
  assignedRouteName: string;
  deliverySlot: string; // "Dawn Slot (05:30 – 07:00 AM)"
  dailyMilkDemandLiters: number;

  // Business & FSSAI (Rule 4.5 Commercial Non-GST)
  fssaiNumber: string;
  gstExemptNotice: string;

  // Summary Metrics
  lastOrderCode?: string;
  lastOrderDate?: string;
  lastOrderAmount?: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  lastPaymentMethod?: string;

  // Breakdown Collections
  frequentProducts: FrequentProduct[];
  documents: RetailerDocument[];
  timeline: RetailerTimelineEvent[];
}

export interface RetailerRepository {
  getAllRetailers(): Promise<Retailer[]>;
  getRetailerById(id: string): Promise<Retailer | null>;
  updateRetailerStatus(
    id: string,
    status: RetailerApprovalStatus,
    adminId: string,
    reason?: string
  ): Promise<Retailer>;
  updateRetailerInfo(
    id: string,
    updates: Partial<Pick<Retailer, "businessName" | "ownerName" | "phone" | "email" | "deliveryAddress" | "assignedRouteId" | "assignedRouteName" | "deliverySlot">>,
    adminId: string
  ): Promise<Retailer>;
  getPendingVerificationRetailers(): Promise<Retailer[]>;
}
