export type AdminRole =
  | "SUPER_ADMIN"
  | "OPERATIONS_MANAGER"
  | "ACCOUNTS_EXECUTIVE"
  | "WAREHOUSE_DISPATCHER";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  avatarText: string;
  hubName: string;
}

export const ADMIN_PRESET_USERS: Record<AdminRole, AdminUser> = {
  OPERATIONS_MANAGER: {
    id: "adm-ops-01",
    name: "Vikram Mehta",
    email: "ops.fleet@yogmilk.com",
    role: "OPERATIONS_MANAGER",
    roleLabel: "Operations Manager",
    avatarText: "VM",
    hubName: "Nashik Central Hub",
  },
  SUPER_ADMIN: {
    id: "adm-super-01",
    name: "Priya Deshmukh",
    email: "priya.admin@yogmilk.com",
    role: "SUPER_ADMIN",
    roleLabel: "Super Admin",
    avatarText: "PD",
    hubName: "HQ Executive Console",
  },
  ACCOUNTS_EXECUTIVE: {
    id: "adm-acc-01",
    name: "Snehal Kulkarni",
    email: "accounts@yogmilk.com",
    role: "ACCOUNTS_EXECUTIVE",
    roleLabel: "Accounts Executive",
    avatarText: "SK",
    hubName: "Accounts & Commercial Audit",
  },
  WAREHOUSE_DISPATCHER: {
    id: "adm-wh-01",
    name: "Sachin Jadhav",
    email: "dispatch@yogmilk.com",
    role: "WAREHOUSE_DISPATCHER",
    roleLabel: "Warehouse Dispatcher",
    avatarText: "SJ",
    hubName: "Cold Storage & Route Triage",
  },
};

