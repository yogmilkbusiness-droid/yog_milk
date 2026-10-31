export type AuditActionType =
  | "ORDER_CONFIRMED"
  | "ORDER_CANCELLED"
  | "PAYMENT_RECORDED"
  | "RETAILER_APPROVED"
  | "RETAILER_SUSPENDED"
  | "SCHEDULE_UPDATED"
  | "PRICE_UPDATED"
  | "PRODUCT_STOCK_TOGGLED"
  | "DELIVERY_ASSIGNED"
  | "DELIVERY_STATUS_CHANGED"
  | "BROADCAST_SENT"
  | "SETTINGS_UPDATED";

export interface AuditActor {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface AuditAffectedRecord {
  type: "ORDER" | "PAYMENT" | "INVOICE" | "RETAILER" | "PRODUCT" | "DELIVERY" | "SCHEDULE" | "SETTINGS";
  id: string; // e.g. "ORD-2026-1042", "RET-8841"
  name?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: AuditActor;
  action: AuditActionType;
  actionLabel: string;
  affectedRecord: AuditAffectedRecord;
  previousValue: string | null;
  newValue: string;
  timestamp: string; // ISO string
  reason?: string;
  ipAddress?: string;
  tamperSealHash: string; // sha256 mock hash
}

export interface AuditRepository {
  getLogs(): Promise<AuditLogEntry[]>;
  appendLog(entry: Omit<AuditLogEntry, "id" | "tamperSealHash">): Promise<AuditLogEntry>;
}

