import { AdminUser, BusinessSettings } from "@/lib/contracts/settings";

let adminUsersStore: AdminUser[] = [
  {
    id: "ADM-001",
    name: "Vikram Mehta",
    email: "sec-ops@yogmilk.in",
    role: "SUPER_ADMIN",
    roleLabel: "Master Admin · Ops Lead",
    avatarInitials: "VM",
    status: "ACTIVE",
    lastActive: "2026-10-31T15:20:00Z",
    permissions: {
      canManageCatalog: true,
      canManageRetailers: true,
      canProgessOrders: true,
      canAssignDeliveries: true,
      canRecordPayments: true,
      canManageSchedule: true,
      canBroadcastNotifications: true,
      canViewAuditLogs: true,
      canManageSettings: true,
    },
  },
  {
    id: "ADM-002",
    name: "Sunita Deshmukh",
    email: "accounts@yogmilk.in",
    role: "ACCOUNTS_EXECUTIVE",
    roleLabel: "Accounts & Vault Reconciler",
    avatarInitials: "SD",
    status: "ACTIVE",
    lastActive: "2026-10-31T14:48:00Z",
    permissions: {
      canManageCatalog: false,
      canManageRetailers: false,
      canProgessOrders: false,
      canAssignDeliveries: false,
      canRecordPayments: true,
      canManageSchedule: false,
      canBroadcastNotifications: false,
      canViewAuditLogs: true,
      canManageSettings: false,
    },
  },
  {
    id: "ADM-003",
    name: "Anand Kulkarni",
    email: "dispatch@yogmilk.in",
    role: "DISPATCH_COORDINATOR",
    roleLabel: "Fleet & Route Dispatcher",
    avatarInitials: "AK",
    status: "ACTIVE",
    lastActive: "2026-10-31T13:10:00Z",
    permissions: {
      canManageCatalog: false,
      canManageRetailers: true,
      canProgessOrders: true,
      canAssignDeliveries: true,
      canRecordPayments: false,
      canManageSchedule: false,
      canBroadcastNotifications: true,
      canViewAuditLogs: true,
      canManageSettings: false,
    },
  },
  {
    id: "ADM-004",
    name: "Mahesh Patil",
    email: "warehouse@yogmilk.in",
    role: "WAREHOUSE_SUPERVISOR",
    roleLabel: "Cold-Room & Intake Supervisor",
    avatarInitials: "MP",
    status: "ACTIVE",
    lastActive: "2026-10-31T11:30:00Z",
    permissions: {
      canManageCatalog: true,
      canManageRetailers: false,
      canProgessOrders: true,
      canAssignDeliveries: false,
      canRecordPayments: false,
      canManageSchedule: false,
      canBroadcastNotifications: false,
      canViewAuditLogs: true,
      canManageSettings: false,
    },
  },
];

let businessSettingsStore: BusinessSettings = {
  firmName: "YOG MILK",
  legalEntityName: "Yog Milk Technologies Private Limited",
  fssaiLicenseNumber: "11524022000189",
  centralHubAddress: "Gat No. 142/2, Anjaneri Reserve, Trimbak Road, Nashik Rural, Maharashtra 422002",
  operationalPhone: "+91 98220 12345",
  escalationEmail: "operations@yogmilk.in",
  invoiceSubtitle: "Fresh Raw A2 Gir Cow & Buffalo Milk · Direct Farm Dispatch",
  invoiceReturnMemo: "Farm-fresh unpasteurized agricultural dairy. Pure non-GST agricultural produce. Crates subject to daily doorstep collection.",
  defaultDeliverySlot: "05:00 AM - 08:00 AM",
  dawnCutoffBufferMinutes: 30,
  strictNonGstCompliance: true,
  updatedAt: "2026-10-31T10:00:00Z",
  updatedBy: "Vikram Mehta",
};

export function getMockBusinessSettings(): BusinessSettings {
  return { ...businessSettingsStore };
}

export function updateMockBusinessSettings(
  updates: Partial<BusinessSettings>,
  adminName: string = "Vikram Mehta"
): BusinessSettings {
  businessSettingsStore = {
    ...businessSettingsStore,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: adminName,
  };
  return { ...businessSettingsStore };
}

export function getMockAdminUsers(): AdminUser[] {
  return [...adminUsersStore];
}

export function addMockAdminUser(
  user: Omit<AdminUser, "id" | "lastActive">
): AdminUser {
  const newUser: AdminUser = {
    ...user,
    id: `ADM-${Date.now().toString().slice(-4)}`,
    lastActive: "Never",
  };
  adminUsersStore = [...adminUsersStore, newUser];
  return newUser;
}

export function updateMockAdminUser(
  id: string,
  updates: Partial<AdminUser>
): AdminUser {
  adminUsersStore = adminUsersStore.map((u) =>
    u.id === id ? { ...u, ...updates } : u
  );
  return adminUsersStore.find((u) => u.id === id)!;
}

