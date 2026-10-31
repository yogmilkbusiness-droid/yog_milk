export type AdminRole =
  | "SUPER_ADMIN"
  | "DISPATCH_COORDINATOR"
  | "ACCOUNTS_EXECUTIVE"
  | "WAREHOUSE_SUPERVISOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  avatarInitials: string;
  status: "ACTIVE" | "INACTIVE";
  lastActive: string;
  permissions: {
    canManageCatalog: boolean;
    canManageRetailers: boolean;
    canProgessOrders: boolean;
    canAssignDeliveries: boolean;
    canRecordPayments: boolean;
    canManageSchedule: boolean;
    canBroadcastNotifications: boolean;
    canViewAuditLogs: boolean;
    canManageSettings: boolean;
  };
}

export interface BusinessSettings {
  firmName: string;
  legalEntityName: string;
  fssaiLicenseNumber: string;
  centralHubAddress: string;
  operationalPhone: string;
  escalationEmail: string;
  invoiceSubtitle: string;
  invoiceReturnMemo: string;
  defaultDeliverySlot: string;
  dawnCutoffBufferMinutes: number;
  strictNonGstCompliance: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface SettingsRepository {
  getSettings(): Promise<BusinessSettings>;
  updateSettings(updates: Partial<BusinessSettings>, adminId: string): Promise<BusinessSettings>;
  getAdminUsers(): Promise<AdminUser[]>;
  addAdminUser(user: Omit<AdminUser, "id" | "lastActive">): Promise<AdminUser>;
  updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser>;
}

