import { PaymentStatus } from "./order";

export interface PaymentRecord {
  id: string; // e.g. "PAY-2026-000142"
  orderId: string;
  orderCode: string;
  consignmentId?: string;
  retailerId: string;
  retailerBusinessName: string;
  retailerOwnerName?: string;
  retailerArea: string;
  retailerPhone?: string;
  amount: number;
  paymentMethod: "COD" | "ONLINE" | "BANK_TRANSFER" | "UPI";
  paymentStatus: PaymentStatus;
  recordedByAdminId?: string;
  recordedByAdminName?: string;
  receiptNumber?: string; // Physical vault voucher slip
  transactionReference?: string; // Razorpay UPI / Gateway ID
  recordedAt: string;
  dateKey?: string; // "today" | "yesterday"
  notes?: string;
  overdueDays?: number;
  hasPendingPaymentBlock?: boolean;
}

export interface RecordCashPaymentParams {
  orderId: string;
  amountCollected: number;
  paymentMethod: "COD" | "UPI" | "BANK_TRANSFER";
  adminId: string;
  adminName: string;
  receiptNumber?: string;
  notes?: string;
}

export interface PaymentRepository {
  getPayments(): Promise<PaymentRecord[]>;
  getPendingPayments(): Promise<PaymentRecord[]>;
  getPaymentById(id: string): Promise<PaymentRecord | null>;
  recordManualPayment(params: RecordCashPaymentParams): Promise<PaymentRecord>;
}
