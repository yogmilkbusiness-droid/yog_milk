import { OrderItem } from "./order";

export interface InvoiceRevision {
  version: string; // e.g. "v1", "v2"
  timestamp: string;
  author: string;
  notes: string;
  amount: number;
}

export interface CommercialInvoice {
  invoiceNumber: string; // e.g. "INV-2026-0489" or "YMI-2026-000049"
  invoiceDate: string;
  orderId: string;
  orderCode: string;
  firmName: "YOG MILK";
  firmTagline: "From Nature to Nourish You";
  firmAddress: string;
  fssaiNumber: string; // FSSAI Central Registration: 11524022000189
  retailerId: string;
  retailerBusinessName: string;
  retailerOwnerName: string;
  retailerAddress: string;
  retailerArea: string;
  retailerPhone: string;
  retailerFssai?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalPayable: number;
  amountReceived?: number;
  balanceDue?: number;
  paymentMethod: "COD" | "ONLINE" | "UPI" | "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "VOIDED";
  paymentSettlementNote?: string;
  // Non-GST commercial declaration (Rule 4.5)
  isGstExempt: true;
  billTitle: "Commercial Invoice / Delivery Memo";
  version: string; // "v1 (Original)" or "v2 (Corrected)"
  versionHistory?: InvoiceRevision[];
  dispatchRouteName?: string;
  dispatchSlot?: string;
  ledgerHash?: string;
}

export interface InvoiceRepository {
  getInvoices(): Promise<CommercialInvoice[]>;
  getInvoiceByNumber(number: string): Promise<CommercialInvoice | null>;
  getInvoiceByOrderId(orderId: string): Promise<CommercialInvoice | null>;
}
