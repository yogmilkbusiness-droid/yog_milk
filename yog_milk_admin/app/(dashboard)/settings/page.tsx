"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Settings,
  Users,
  ShieldCheck,
  Building,
  CreditCard,
  Bell,
  Save,
  Plus,
  UserCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  X,
  Edit2,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { AdminUser, BusinessSettings, AdminRole } from "@/lib/contracts/settings";
import {
  getMockBusinessSettings,
  updateMockBusinessSettings,
  getMockAdminUsers,
  addMockAdminUser,
  updateMockAdminUser,
} from "@/lib/mock/admin-settings-repo";
import { appendMockAuditLog } from "@/lib/mock/admin-audit-repo";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(getMockBusinessSettings());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getMockAdminUsers());
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"BUSINESS" | "STAFF_RBAC" | "DISPATCH_DEFAULTS">("BUSINESS");

  // Invite Admin Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AdminRole>("DISPATCH_COORDINATOR");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getMockBusinessSettings());
    setAdminUsers(getMockAdminUsers());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save Business Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateMockBusinessSettings(settings);
    setSettings(updated);

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SETTINGS_UPDATED",
      actionLabel: "Updated Dairy Business Governance Details",
      affectedRecord: { type: "SETTINGS", id: "CONF-CORE", name: "Enterprise Business Config" },
      previousValue: "Prior business parameters",
      newValue: `Firm: ${settings.firmName} · FSSAI: ${settings.fssaiLicenseNumber}`,
      timestamp: new Date().toISOString(),
      reason: "Administrative update of statutory business contact and origin information.",
    });

    showToast("Governance settings saved successfully");
  };

  // Add New Admin Staff
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const initials = newUserName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const roleLabels: Record<AdminRole, string> = {
      SUPER_ADMIN: "Master Admin · Ops Lead",
      DISPATCH_COORDINATOR: "Fleet & Route Dispatcher",
      ACCOUNTS_EXECUTIVE: "Accounts & Vault Reconciler",
      WAREHOUSE_SUPERVISOR: "Cold-Room & Intake Supervisor",
    };

    const newUser = addMockAdminUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      roleLabel: roleLabels[newUserRole],
      avatarInitials: initials || "YM",
      status: "ACTIVE",
      permissions: {
        canManageCatalog: newUserRole === "SUPER_ADMIN" || newUserRole === "WAREHOUSE_SUPERVISOR",
        canManageRetailers: newUserRole === "SUPER_ADMIN" || newUserRole === "DISPATCH_COORDINATOR",
        canProgessOrders: true,
        canAssignDeliveries: newUserRole === "SUPER_ADMIN" || newUserRole === "DISPATCH_COORDINATOR",
        canRecordPayments: newUserRole === "SUPER_ADMIN" || newUserRole === "ACCOUNTS_EXECUTIVE",
        canManageSchedule: newUserRole === "SUPER_ADMIN",
        canBroadcastNotifications: newUserRole === "SUPER_ADMIN" || newUserRole === "DISPATCH_COORDINATOR",
        canViewAuditLogs: true,
        canManageSettings: newUserRole === "SUPER_ADMIN",
      },
    });

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SETTINGS_UPDATED",
      actionLabel: "Invited New Administrative User",
      affectedRecord: { type: "SETTINGS", id: newUser.id, name: newUser.name },
      previousValue: null,
      newValue: `Role: ${newUser.roleLabel} · Email: ${newUser.email}`,
      timestamp: new Date().toISOString(),
      reason: "Staff onboarding for operations console access.",
    });

    setAdminUsers(getMockAdminUsers());
    setIsInviteModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    showToast(`Staff invitation sent to ${newUser.email}`);
  };

  // Toggle user active status
  const handleToggleUserStatus = (user: AdminUser) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateMockAdminUser(user.id, { status: newStatus });
    setAdminUsers(getMockAdminUsers());

    appendMockAuditLog({
      actor: { id: "ADM-001", name: "Vikram Mehta", role: "Master Ops Root", email: "sec-ops@yogmilk.in" },
      action: "SETTINGS_UPDATED",
      actionLabel: `Toggled User Access (${newStatus})`,
      affectedRecord: { type: "SETTINGS", id: user.id, name: user.name },
      previousValue: `Status: ${user.status}`,
      newValue: `Status: ${newStatus}`,
      timestamp: new Date().toISOString(),
      reason: "RBAC security access modification.",
    });

    showToast(`User status updated to ${newStatus}`);
  };

  if (!isClientLoaded) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-7">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#051256] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Administration</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#051256] font-bold">Settings & Permissions</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#051256] tracking-tight">
            Settings & RBAC Governance
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure statutory dairy business details, non-GST invoice branding, and staff role permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#051256]" />
            <span className="font-mono">Audit Hash: #VK-9482A</span>
          </div>
        </div>
      </div>

      {/* Quick Section Anchor Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("BUSINESS")}
          className={cn(
            "px-4 py-1.5 rounded-lg transition-all",
            activeTab === "BUSINESS"
              ? "bg-white text-[#051256] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Dairy Business Identity
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("STAFF_RBAC")}
          className={cn(
            "px-4 py-1.5 rounded-lg transition-all",
            activeTab === "STAFF_RBAC"
              ? "bg-white text-[#051256] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Staff Roles & RBAC Matrix ({adminUsers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DISPATCH_DEFAULTS")}
          className={cn(
            "px-4 py-1.5 rounded-lg transition-all",
            activeTab === "DISPATCH_DEFAULTS"
              ? "bg-white text-[#051256] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Operational & Billing Defaults
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DAIRY BUSINESS IDENTITY                                         */}
      {/* ========================================================================= */}
      {activeTab === "BUSINESS" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#051256]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Statutory Dairy Business Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Registration information displayed on non-GST farm commercial bills and delivery memos.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#051256] text-white rounded-xl text-xs font-semibold hover:bg-[#051256]/90 transition-all flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Firm Name / Brand
                </label>
                <input
                  type="text"
                  required
                  value={settings.firmName}
                  onChange={(e) => setSettings({ ...settings, firmName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Legal Registered Entity
                </label>
                <input
                  type="text"
                  required
                  value={settings.legalEntityName}
                  onChange={(e) => setSettings({ ...settings, legalEntityName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  FSSAI Central Registration Number
                </label>
                <div className="relative">
                  <span className="font-mono font-bold absolute left-3.5 top-2.5 text-slate-400">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    value={settings.fssaiLicenseNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, fssaiLicenseNumber: e.target.value })
                    }
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-[#051256] focus:outline-none focus:border-[#051256]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Operational Support Phone
                </label>
                <input
                  type="text"
                  required
                  value={settings.operationalPhone}
                  onChange={(e) => setSettings({ ...settings, operationalPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Dairy Farm Origin & Chilling Hub Facility Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={settings.centralHubAddress}
                  onChange={(e) => setSettings({ ...settings, centralHubAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#051256]"
                />
              </div>
            </div>

            {/* Non-GST Invoicing Header Notes */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-[#051256] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#051256]" />
                Commercial Bill Header Subtitle & Packing Return Memo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    Invoice Subtitle (Printed below brand name)
                  </label>
                  <input
                    type="text"
                    value={settings.invoiceSubtitle}
                    onChange={(e) => setSettings({ ...settings, invoiceSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">
                    Customer Memo & Packaging Return Policy
                  </label>
                  <textarea
                    rows={2}
                    value={settings.invoiceReturnMemo}
                    onChange={(e) => setSettings({ ...settings, invoiceReturnMemo: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          </section>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: STAFF ROLES & RBAC MATRIX                                       */}
      {/* ========================================================================= */}
      {activeTab === "STAFF_RBAC" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#051256]" />
                Administrative Staff & Role-Based Access Control (RBAC)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff member accounts, assigned operational roles, and permission entitlements.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 bg-[#051256] text-white rounded-xl text-xs font-semibold hover:bg-[#051256]/90 transition-all flex items-center gap-2 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Staff Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Catalog & Stock</th>
                  <th className="py-3 px-4">Retailers</th>
                  <th className="py-3 px-4">Orders & Fleet</th>
                  <th className="py-3 px-4">COD Recording</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#051256] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {user.avatarInitials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {user.roleLabel}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.permissions.canManageCatalog ? (
                        <span className="text-emerald-600 font-bold">✓ Full</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.permissions.canManageRetailers ? (
                        <span className="text-emerald-600 font-bold">✓ Verify</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.permissions.canProgessOrders ? (
                        <span className="text-emerald-600 font-bold">✓ Dispatch</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.permissions.canRecordPayments ? (
                        <span className="text-emerald-600 font-bold">✓ Vault Cash</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.permissions.canManageSchedule ? (
                        <span className="text-emerald-600 font-bold">✓ Gate Edit</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold",
                          user.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        )}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(user)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: OPERATIONAL & BILLING DEFAULTS                                  */}
      {/* ========================================================================= */}
      {activeTab === "DISPATCH_DEFAULTS" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#051256]" />
              Operational Logistics & Non-GST Billing Directives
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard operating parameters governing fleet dispatches and commercial invoice format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Default Dawn Delivery Window</span>
              <p className="text-slate-600 leading-relaxed">
                Refrigerated van routes depart Central Chilling Hub between {settings.defaultDeliverySlot} daily.
              </p>
              <span className="text-[11px] font-semibold text-emerald-700 block">
                Standard Slot: {settings.defaultDeliverySlot}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Cutoff Buffer Window</span>
              <p className="text-slate-600 leading-relaxed">
                Orders received within {settings.dawnCutoffBufferMinutes} minutes prior to gate closing are automatically grouped into evening batch staging.
              </p>
              <span className="text-[11px] font-semibold text-[#051256] block">
                Cutoff Buffer: {settings.dawnCutoffBufferMinutes} minutes
              </span>
            </div>

            {/* Strict Non-GST Agricultural Notice */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 md:col-span-2">
              <span className="font-bold text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Statutory Non-GST Commercial Operations Directives (Master Plan Rule 4.5)
              </span>
              <p className="text-emerald-800 text-xs leading-relaxed">
                YOG MILK is not GST registered and sells pure agricultural dairy products (fresh raw milk, paneer, curd, butter, and artisanal ghee) that do not attract GST under current operations. The system strictly disables fake GSTIN inputs, tax splits (CGST/SGST/IGST), and HSN rate calculations. Bills are titled <strong>&ldquo;Commercial Invoice / Delivery Memo&rdquo;</strong> with FSSAI #{settings.fssaiLicenseNumber}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE STAFF MEMBER                                                */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#051256]" />
                Invite Operational Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shinde"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="r.shinde@yogmilk.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#051256]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Administrative Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#051256]"
                >
                  <option value="DISPATCH_COORDINATOR">Fleet & Route Dispatcher</option>
                  <option value="ACCOUNTS_EXECUTIVE">Accounts & Vault Reconciler</option>
                  <option value="WAREHOUSE_SUPERVISOR">Cold-Room & Intake Supervisor</option>
                  <option value="SUPER_ADMIN">Master Admin · Ops Lead</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#051256] text-white font-semibold hover:bg-[#051256]/90"
                >
                  Create & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
