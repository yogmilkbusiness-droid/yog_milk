"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  IndianRupee,
  ShoppingCart,
  Download,
  Edit3,
  PauseCircle,
  PlayCircle,
  Lock,
  ArrowRight,
  TrendingUp,
  Package,
  Eye,
  PlusCircle,
  History,
  BarChart3,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Badge } from "@/components/ui/badge";
import {
  Retailer,
  RetailerApprovalStatus,
} from "@/lib/contracts/retailer";
import {
  getMockRetailerById,
  getMockRetailers,
  mutateRetailerStatus,
  mutateRetailerInfo,
} from "@/lib/mock/admin-retailers";
import { MOCK_ADMIN_RECENT_ORDERS } from "@/lib/mock/admin-orders";
import { RetailerApprovalModal } from "@/components/features/retailers/RetailerApprovalModal";
import {
  RetailerConfirmActionModal,
  SensitiveActionType,
} from "@/components/features/retailers/RetailerConfirmActionModal";
import { RetailerEditModal } from "@/components/features/retailers/RetailerEditModal";
import { useAdminAuth } from "@/components/auth/AuthContext";
import { formatCurrency, cn } from "@/lib/utils";

type ActiveTab =
  | "overview"
  | "orders"
  | "payments"
  | "invoices"
  | "deliveries"
  | "analytics"
  | "timeline";

export default function Retailer360Page() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAdminAuth();
  const retailerId = (params?.id as string) || "ret-03";

  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // Modals
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<SensitiveActionType | null>(null);

  // Load retailer
  useEffect(() => {
    const found = getMockRetailerById(retailerId);
    if (found) {
      setRetailer(found);
    } else {
      // Fallback to first available retailer if id doesn't match
      const all = getMockRetailers();
      if (all.length > 0) setRetailer(all[0]);
    }
  }, [retailerId]);

  if (!retailer) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2 animate-spin" />
        <p className="font-semibold text-dairy-dark">Loading Retailer 360° Profile...</p>
      </div>
    );
  }

  // Related orders for this retailer
  const retailerOrders = MOCK_ADMIN_RECENT_ORDERS.filter(
    (o) => o.retailerId === retailer.id || retailer.id === "ret-03"
  );

  // Status Handlers
  const handleApprove = (routeId: string, routeName: string, slot: string) => {
    const updated = mutateRetailerStatus(
      retailer.id,
      "APPROVED",
      user.name,
      user.roleLabel,
      `Account approved with route allocation: ${routeName}`
    );
    if (updated) setRetailer({ ...updated });
  };

  const handleSensitiveAction = (reason: string) => {
    if (!actionTarget) return;
    let newStatus: RetailerApprovalStatus = "APPROVED";
    if (actionTarget === "SUSPEND") newStatus = "SUSPENDED";
    else if (actionTarget === "ACTIVATE") newStatus = "APPROVED";
    else if (actionTarget === "OVERRIDE_BLOCK") newStatus = "APPROVED";

    const updated = mutateRetailerStatus(
      retailer.id,
      newStatus,
      user.name,
      user.roleLabel,
      reason
    );
    if (updated) setRetailer({ ...updated });
    setActionTarget(null);
  };

  const handleSaveInfo = (updates: any) => {
    const updated = mutateRetailerInfo(
      retailer.id,
      updates,
      user.name,
      user.roleLabel
    );
    if (updated) setRetailer({ ...updated });
  };

  const initials = retailer.ownerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const isBlocked = retailer.status === "BLOCKED";
  const isPending = retailer.status === "WAITING_APPROVAL";
  const isSuspended = retailer.status === "SUSPENDED";
  const isApproved = retailer.status === "APPROVED";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/retailers"
            className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Retailers List</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-dairy-dark">
            {retailer.businessName} ({retailer.accountCode})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-muted-foreground">
            Registered: {retailer.registeredAt}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CUSTOMER 360 HEADER BANNER (Editorial Card Tier 1)                     */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-6 border border-dairy-subtle shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4 border-b border-dairy-subtle">
          {/* Left Info Cluster */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold shadow-xs shrink-0",
                isBlocked
                  ? "bg-rose-100 text-rose-800"
                  : isPending
                  ? "bg-amber-100 text-amber-900"
                  : isSuspended
                  ? "bg-dairy-surface-low text-muted-foreground"
                  : "bg-primary text-white"
              )}
            >
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                  {retailer.ownerName}
                </h1>
                <span className="text-muted-foreground">•</span>
                <span className="font-serif text-lg font-bold text-dairy-dark">
                  {retailer.businessName}
                </span>

                {/* Status Badge */}
                {isBlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                    <Lock className="h-3.5 w-3.5 text-rose-600" />
                    Payment Blocked
                  </span>
                ) : isPending ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Pending Approval
                  </span>
                ) : isSuspended ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dairy-surface-low text-muted-foreground border border-dairy-subtle text-xs font-bold">
                    <PauseCircle className="h-3.5 w-3.5" />
                    On Hold (Suspended)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Active Retailer
                  </span>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Verified Dairy Booth • Account ID:{" "}
                <span className="font-mono font-bold text-dairy-dark">
                  {retailer.accountCode}
                </span>
                {retailer.verifiedBy && (
                  <span> • Verified by {retailer.verifiedBy}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Controls Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Edit Permitted Info Action */}
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-primary border border-dairy-subtle hover:bg-dairy-surface-low text-xs font-bold shadow-2xs transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Account</span>
            </button>

            {/* Contextual Status Action */}
            {isPending && (
              <button
                type="button"
                onClick={() => setIsApprovalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Account</span>
              </button>
            )}

            {isApproved && (
              <button
                type="button"
                onClick={() => setActionTarget("SUSPEND")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors"
              >
                <PauseCircle className="h-4 w-4" />
                <span>Suspend...</span>
              </button>
            )}

            {isSuspended && (
              <button
                type="button"
                onClick={() => setActionTarget("ACTIVATE")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Reactivate Account</span>
              </button>
            )}

            {/* Primary Action CTA: Record Payment */}
            <Link
              href="/payments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-xs transition-colors"
            >
              <IndianRupee className="h-4 w-4 text-secondary-container" />
              <span>Record Payment</span>
            </Link>
          </div>
        </div>

        {/* Secondary Info Line: Contact, Address, Delivery Slot */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-dairy-dark font-medium">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">{retailer.phone}</span>
          </div>

          {retailer.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{retailer.email}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{retailer.deliveryAddress}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dairy-surface-low text-primary font-semibold text-[11px] border border-dairy-subtle">
            <Truck className="h-3.5 w-3.5 text-secondary" />
            <span>
              {retailer.assignedRouteName} • {retailer.deliverySlot}
            </span>
          </div>
        </div>

        {/* Hard Rule 4.4 Alert Banner when Payment Hold is active */}
        {retailer.hasPendingPaymentBlock && (
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-200/60 text-amber-900 shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-xs text-amber-950">
                <p className="font-bold">
                  Rule 4.4 Payment Pending Block Active
                </p>
                <p className="mt-0.5 text-amber-800">
                  Retailer has an unresolved COD pending balance of{" "}
                  <span className="font-mono font-bold text-amber-950">
                    {formatCurrency(retailer.outstandingBalance)}
                  </span>
                  . Under YOG MILK zero-credit governance, further order submissions are auto-blocked until this balance is recorded as paid.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActionTarget("OVERRIDE_BLOCK")}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-colors"
              >
                Override Block
              </button>
              <Link
                href="/payments"
                className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Record Cash Collection
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE METRICS STRIP (8 Key Counters Requested by User)             */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* Metric 1: Total Orders */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Total Orders
          </div>
          <div className="mt-1 font-serif text-xl font-bold font-mono text-primary">
            {retailer.totalOrdersCount}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {retailer.deliveredOrdersCount} delivered
          </div>
        </div>

        {/* Metric 2: Total Billed Value */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Total Billed
          </div>
          <div className="mt-1 font-serif text-xl font-bold font-mono text-primary">
            {formatCurrency(retailer.totalBilledValue)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Direct farm billing
          </div>
        </div>

        {/* Metric 3: Total Payments Received */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Payments Recv
          </div>
          <div className="mt-1 font-serif text-xl font-bold font-mono text-emerald-700">
            {formatCurrency(retailer.totalPaymentsReceived)}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">
            {retailer.totalBilledValue > 0
              ? `${Math.round((retailer.totalPaymentsReceived / retailer.totalBilledValue) * 100)}% settled`
              : "100% settled"}
          </div>
        </div>

        {/* Metric 4: Pending Amount */}
        <div
          className={cn(
            "p-3.5 rounded-xl border shadow-xs",
            retailer.outstandingBalance > 0
              ? "bg-amber-50/70 border-amber-300"
              : "bg-white border-dairy-subtle"
          )}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider flex items-center justify-between text-amber-900">
            <span>Pending Amount</span>
            {retailer.outstandingBalance > 0 && (
              <AlertCircle className="h-3 w-3 text-amber-600" />
            )}
          </div>
          <div
            className={cn(
              "mt-1 font-serif text-xl font-bold font-mono",
              retailer.outstandingBalance > 0
                ? "text-amber-800"
                : "text-emerald-700"
            )}
          >
            {formatCurrency(retailer.outstandingBalance)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {retailer.outstandingBalance > 0 ? "COD hold active" : "Zero liability"}
          </div>
        </div>

        {/* Metric 5: Delivered Orders */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Delivered Drops
          </div>
          <div className="mt-1 font-serif text-xl font-bold font-mono text-primary">
            {retailer.deliveredOrdersCount}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            100% on-time dawn
          </div>
        </div>

        {/* Metric 6: Last Order */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Last Order
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-primary truncate">
            {retailer.lastOrderCode || "None"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {retailer.lastOrderDate || "No orders placed"}
          </div>
        </div>

        {/* Metric 7: Last Payment */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Last Settled
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-emerald-700 truncate">
            {retailer.lastPaymentAmount
              ? formatCurrency(retailer.lastPaymentAmount)
              : "₹0.00"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {retailer.lastPaymentMethod || "No payments recorded"}
          </div>
        </div>

        {/* Metric 8: Quota Fulfillment */}
        <div className="bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Daily Milk Drop
          </div>
          <div className="mt-1 font-serif text-xl font-bold font-mono text-primary">
            {retailer.dailyMilkDemandLiters}L
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Avg crate quota
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FREQUENT PRODUCTS & DAILY QUOTAS PANEL                                 */}
      {/* ========================================================================= */}
      {retailer.frequentProducts && retailer.frequentProducts.length > 0 && (
        <section className="bg-white rounded-2xl p-5 border border-dairy-subtle shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-base font-bold text-primary">
                Frequent Order Breakdown &amp; Daily Quotas
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Recurring wholesale preference for {retailer.businessName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {retailer.frequentProducts.map((p) => (
              <div
                key={p.productId}
                className="p-3.5 rounded-xl bg-dairy-surface-low/60 border border-dairy-subtle flex items-start justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-dairy-dark">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Avg {p.avgDailyUnits} units / day
                  </p>
                  {p.highlightTag && (
                    <span className="inline-block mt-2 text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
                      {p.highlightTag}
                    </span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-xl bg-white border border-dairy-subtle flex items-center justify-center font-mono font-bold text-xs text-primary shadow-2xs">
                  {p.avgDailyUnits}x
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. TABBED NAVIGATION BAR (7 SECTIONS)                                     */}
      {/* ========================================================================= */}
      <div className="border-b border-dairy-subtle">
        <nav className="flex space-x-6 overflow-x-auto text-xs font-bold">
          {(
            [
              { key: "overview", label: "Overview", icon: Building2 },
              { key: "orders", label: `Orders (${retailerOrders.length})`, icon: ShoppingCart },
              { key: "payments", label: "Payments", icon: IndianRupee },
              { key: "invoices", label: "Invoices", icon: FileText },
              { key: "deliveries", label: "Deliveries", icon: Truck },
              { key: "analytics", label: "Analytics", icon: BarChart3 },
              { key: "timeline", label: "Activity Timeline", icon: History },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 py-3 border-b-2 transition-colors shrink-0",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-dairy-dark"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT AREAS                                                      */}
      {/* ========================================================================= */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Business & Legal Profile (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-dairy-subtle shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-primary pb-2 border-b border-dairy-subtle">
              Retailer Registration &amp; Commercial Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  FSSAI License Registration
                </span>
                <p className="font-mono font-bold text-dairy-dark">
                  {retailer.fssaiNumber}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Verified pure dairy food business operator
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  GST Status (Rule 4.5)
                </span>
                <p className="font-bold text-emerald-800">
                  Exempt Primary Agricultural Commodity
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {retailer.gstExemptNotice}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  Delivery Logistics Drop Point
                </span>
                <p className="font-medium text-dairy-dark">
                  {retailer.deliveryAddress}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Assigned Route: {retailer.assignedRouteName}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  Credit Governance Rule
                </span>
                <p className="font-bold text-primary">
                  Strict Zero Credit Policy Enforced
                </p>
                <p className="text-[11px] text-muted-foreground">
                  No credit balance, wallet, or limits. One pending payment restriction.
                </p>
              </div>
            </div>

            {/* Verification Documents List */}
            <div className="pt-3 border-t border-dairy-subtle">
              <h4 className="font-bold text-xs text-dairy-dark mb-2">
                KYC &amp; Outlet Verification Documents
              </h4>
              <div className="space-y-2">
                {retailer.documents?.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-dairy-subtle bg-dairy-surface-low/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-semibold text-dairy-dark">
                          {doc.title}
                        </span>
                        {doc.fileNumber && (
                          <span className="font-mono text-muted-foreground ml-2">
                            ({doc.fileNumber})
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="delivered" showDot>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Route Info (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-dairy-subtle shadow-xs space-y-3">
            <h3 className="font-serif text-base font-bold text-primary pb-2 border-b border-dairy-subtle">
              Logistics Dispatch Slot
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-dairy-surface-low border border-dairy-subtle">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Dawn Dispatch Window
                </span>
                <span className="font-bold text-primary text-sm mt-0.5 block">
                  {retailer.deliverySlot}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Trunk capacity nominal
                </span>
              </div>

              <div className="p-3 rounded-xl bg-dairy-surface-low border border-dairy-subtle">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Assigned Route Van
                </span>
                <span className="font-semibold text-dairy-dark mt-0.5 block">
                  {retailer.assignedRouteName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
          <div className="p-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Order Fulfillment Registry
              </h3>
              <p className="text-xs text-muted-foreground">
                Showing all historical and active bulk orders for {retailer.businessName}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-primary">
              {retailerOrders.length} Orders Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dairy-subtle text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-4">Order Code</th>
                  <th className="py-2.5 px-4">Order Date</th>
                  <th className="py-2.5 px-4">Items Summary</th>
                  <th className="py-2.5 px-4">Order Status</th>
                  <th className="py-2.5 px-4">Payment Status</th>
                  <th className="py-2.5 px-4">Delivery Status</th>
                  <th className="py-2.5 px-4 text-right">Total (Non-GST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dairy-subtle/70">
                {retailerOrders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";
                  const isProcessing = order.paymentStatus === "PROCESSING";

                  let orderVariant: "placed" | "confirmed" | "processing" | "ready" | "outForDelivery" | "delivered" = "placed";
                  if (order.orderStatus === "CONFIRMED") orderVariant = "confirmed";
                  else if (order.orderStatus === "PROCESSING") orderVariant = "processing";
                  else if (order.orderStatus === "READY_FOR_DELIVERY") orderVariant = "ready";
                  else if (order.orderStatus === "OUT_FOR_DELIVERY") orderVariant = "outForDelivery";
                  else if (order.orderStatus === "DELIVERED") orderVariant = "delivered";

                  return (
                    <tr key={order.id} className="hover:bg-dairy-surface-low/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {order.orderCode}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.orderDate}
                      </td>
                      <td className="py-3 px-4 font-medium text-dairy-dark">
                        {order.items.map((i) => `${i.productName} (${i.quantity})`).join(", ")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={orderVariant}>{order.orderStatus}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isPaid ? "paid" : isProcessing ? "processing" : "pending"}>
                          {order.paymentStatus} ({order.paymentMethod})
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{order.deliveryStatus}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-dairy-dark">
                        {formatCurrency(order.totalPayable)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle">
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Payment Transactions &amp; Receipts
              </h3>
              <p className="text-xs text-muted-foreground">
                Reconciliation of Online UPI payments and Physical Cash collections
              </p>
            </div>
            <Link
              href="/payments"
              className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Record Cash Collection</span>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <p className="font-bold text-dairy-dark">
                    Cash Handover Receipt #CR-8819
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Settled for order YM-2026-000118 by Snehal Kulkarni (Accounts)
                  </p>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-emerald-800">
                ₹2,290.00
                <span className="block text-[10px] text-muted-foreground font-normal">
                  Verified Deposit
                </span>
              </div>
            </div>

            {retailer.outstandingBalance > 0 && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <p className="font-bold text-amber-900">
                      Pending COD Collection: Order {retailer.lastOrderCode}
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Awaiting physical deposit from morning delivery run (Route 4)
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-amber-800">
                  {formatCurrency(retailer.outstandingBalance)}
                  <span className="block text-[10px] text-amber-700 font-semibold uppercase">
                    Unpaid
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES (RULE 4.5) */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle">
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Commercial Non-GST Invoices
              </h3>
              <p className="text-xs text-muted-foreground">
                Direct agricultural delivery memos issued to {retailer.businessName}
              </p>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Download Batch Farm Bills</span>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-dairy-subtle bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-mono font-bold text-primary">INV-2026-0487</p>
                  <p className="text-[11px] text-muted-foreground">
                    Issued: Today, 05:50 AM • Ref Order: YM-2026-000140
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right font-mono font-bold text-dairy-dark">
                  ₹3,200.00
                  <span className="block text-[10px] text-rose-600 font-semibold">
                    Payment Pending
                  </span>
                </div>
                <Link
                  href="/invoices"
                  className="px-2.5 py-1 rounded-lg border border-dairy-subtle hover:bg-dairy-surface-low text-xs font-bold text-primary"
                >
                  Preview Farm Bill
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dairy-subtle bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-mono font-bold text-primary">INV-2026-0485</p>
                  <p className="text-[11px] text-muted-foreground">
                    Issued: Yesterday, 05:15 AM • Ref Order: YM-2026-000138
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right font-mono font-bold text-emerald-800">
                  ₹2,550.00
                  <span className="block text-[10px] text-emerald-700 font-semibold">
                    Paid in Full
                  </span>
                </div>
                <Link
                  href="/invoices"
                  className="px-2.5 py-1 rounded-lg border border-dairy-subtle hover:bg-dairy-surface-low text-xs font-bold text-primary"
                >
                  Preview Farm Bill
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DELIVERIES */}
      {activeTab === "deliveries" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dairy-subtle">
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Dawn Doorstep Deliveries
              </h3>
              <p className="text-xs text-muted-foreground">
                Route telemetry and doorstep drop confirmation log
              </p>
            </div>
            <Link
              href="/deliveries"
              className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
            >
              <span>View Route Dispatch Desk →</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-bold text-dairy-dark">
                  Dawn Drop: {retailer.deliverySlot}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Assigned Van: {retailer.assignedRouteName}
                </p>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-xs">
              100% Crate Return
            </span>
          </div>
        </div>
      )}

      {/* TAB 6: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs p-5 space-y-4">
          <h3 className="font-serif text-base font-bold text-primary pb-3 border-b border-dairy-subtle">
            Purchasing Volume &amp; Fulfillment Velocity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Avg Daily Intake
              </span>
              <span className="text-2xl font-bold font-mono text-primary mt-1 block">
                {retailer.dailyMilkDemandLiters} Liters
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                A2 Gir Cow + Buffalo Milk
              </span>
            </div>

            <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Average Basket
              </span>
              <span className="text-2xl font-bold font-mono text-primary mt-1 block">
                {formatCurrency(
                  retailer.totalOrdersCount > 0
                    ? Math.round(retailer.totalBilledValue / retailer.totalOrdersCount)
                    : 0
                )}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Wholesale commercial rate
              </span>
            </div>

            <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Settlement Health
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                92.5%
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Strict 0-credit adherence
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs p-5 space-y-4">
          <h3 className="font-serif text-base font-bold text-primary pb-3 border-b border-dairy-subtle">
            Append-Only Retailer Audit Trail
          </h3>

          <div className="space-y-4">
            {retailer.timeline?.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-xs">
                <div className="h-7 w-7 rounded-lg bg-dairy-surface-low border border-dairy-subtle flex items-center justify-center shrink-0 text-primary mt-0.5 font-bold">
                  •
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-dairy-dark">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                  <p className="text-[10px] text-primary/80 font-medium mt-1">
                    by {event.actor} ({event.actorRole})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {isApprovalOpen && (
        <RetailerApprovalModal
          retailer={retailer}
          isOpen={isApprovalOpen}
          onClose={() => setIsApprovalOpen(false)}
          onApprove={handleApprove}
        />
      )}

      {actionTarget && (
        <RetailerConfirmActionModal
          retailer={retailer}
          actionType={actionTarget}
          isOpen={!!actionTarget}
          onClose={() => setActionTarget(null)}
          onConfirm={handleSensitiveAction}
        />
      )}

      {isEditOpen && (
        <RetailerEditModal
          retailer={retailer}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveInfo}
        />
      )}
    </div>
  );
}

