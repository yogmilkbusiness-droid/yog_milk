"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Lock,
  PauseCircle,
  FileDown,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  PlusCircle,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Badge } from "@/components/ui/badge";
import {
  Retailer,
  RetailerApprovalStatus,
} from "@/lib/contracts/retailer";
import {
  getMockRetailers,
  mutateRetailerStatus,
} from "@/lib/mock/admin-retailers";
import { RetailerApprovalModal } from "@/components/features/retailers/RetailerApprovalModal";
import {
  RetailerConfirmActionModal,
  SensitiveActionType,
} from "@/components/features/retailers/RetailerConfirmActionModal";
import { useAdminAuth } from "@/components/auth/AuthContext";
import { formatCurrency, cn } from "@/lib/utils";

type QuickFilter = "ALL" | "WAITING_APPROVAL" | "APPROVED" | "SUSPENDED" | "BLOCKED";

const PAGE_SIZE = 5;

export default function RetailersListingPage() {
  const { user } = useAdminAuth();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("ALL");
  const [routeFilter, setRouteFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "balance" | "orders">("recent");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [approvalTarget, setApprovalTarget] = useState<Retailer | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    retailer: Retailer;
    type: SensitiveActionType;
  } | null>(null);

  // Load from mock store
  useEffect(() => {
    setRetailers(getMockRetailers());
  }, []);

  const counts = useMemo(() => {
    return {
      all: retailers.length,
      pending: retailers.filter((r) => r.status === "WAITING_APPROVAL").length,
      approved: retailers.filter((r) => r.status === "APPROVED").length,
      suspended: retailers.filter((r) => r.status === "SUSPENDED").length,
      blocked: retailers.filter((r) => r.status === "BLOCKED").length,
    };
  }, [retailers]);

  // Filtered & Searched & Sorted
  const filteredRetailers = useMemo(() => {
    let result = [...retailers];

    // Quick filter
    if (quickFilter !== "ALL") {
      result = result.filter((r) => r.status === quickFilter);
    }

    // Route filter
    if (routeFilter !== "ALL") {
      result = result.filter((r) => r.assignedRouteId.includes(routeFilter));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.businessName.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.accountCode.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "balance") {
      result.sort((a, b) => b.outstandingBalance - a.outstandingBalance);
    } else if (sortBy === "orders") {
      result.sort((a, b) => b.totalOrdersCount - a.totalOrdersCount);
    }

    return result;
  }, [retailers, quickFilter, routeFilter, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredRetailers.length / PAGE_SIZE) || 1;
  const paginatedRetailers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRetailers.slice(start, start + PAGE_SIZE);
  }, [filteredRetailers, currentPage]);

  const handleApprove = (routeId: string, routeName: string, slot: string) => {
    if (!approvalTarget) return;
    const updated = mutateRetailerStatus(
      approvalTarget.id,
      "APPROVED",
      user.name,
      user.roleLabel,
      `Account approved with route allocation: ${routeName}`
    );
    if (updated) {
      setRetailers(getMockRetailers());
    }
  };

  const handleConfirmAction = (reason: string) => {
    if (!actionTarget) return;
    const { retailer, type } = actionTarget;

    let targetStatus: RetailerApprovalStatus = "APPROVED";
    if (type === "SUSPEND") targetStatus = "SUSPENDED";
    else if (type === "ACTIVATE") targetStatus = "APPROVED";
    else if (type === "OVERRIDE_BLOCK") targetStatus = "APPROVED";

    const updated = mutateRetailerStatus(
      retailer.id,
      targetStatus,
      user.name,
      user.roleLabel,
      reason
    );
    if (updated) {
      setRetailers(getMockRetailers());
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setQuickFilter("ALL");
    setRouteFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <PageHeading
        title="Customer Accounts &amp; Verification"
        description="Verify retail accounts, manage credit blocks, and monitor dawn delivery access across Western India routes."
        badge={
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">
            Vedic Distribution Governance
          </span>
        }
        breadcrumbs={[{ label: "Admin", href: "/" }, { label: "Retailers 360°" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-9 px-3.5 rounded-xl border border-dairy-subtle bg-white hover:bg-dairy-surface-low text-primary text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <FileDown className="h-4 w-4 text-muted-foreground" />
              <span>Export CSV</span>
            </button>
            {counts.pending > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuickFilter("WAITING_APPROVAL");
                  const firstPending = retailers.find((r) => r.status === "WAITING_APPROVAL");
                  if (firstPending) setApprovalTarget(firstPending);
                }}
                className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <UserCheck className="h-4 w-4 text-secondary-container" />
                <span>Verify Pending ({counts.pending})</span>
              </button>
            )}
          </div>
        }
      />

      {/* QUICK METRIC FILTER STRIP (5 Cards Matching Stitch Reference) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Metric 1: All Customers */}
        <button
          type="button"
          onClick={() => {
            setQuickFilter("ALL");
            setCurrentPage(1);
          }}
          className={cn(
            "p-3.5 rounded-2xl border text-left transition-all shadow-xs",
            quickFilter === "ALL"
              ? "bg-white border-primary ring-2 ring-primary/20 shadow-sm"
              : "bg-white border-dairy-subtle hover:border-primary/40"
          )}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>All Retailers</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-primary">
              {counts.all}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">accounts</span>
          </div>
        </button>

        {/* Metric 2: Pending Approval (Amber Urgency) */}
        <button
          type="button"
          onClick={() => {
            setQuickFilter("WAITING_APPROVAL");
            setCurrentPage(1);
          }}
          className={cn(
            "p-3.5 rounded-2xl border text-left transition-all shadow-xs relative overflow-hidden",
            quickFilter === "WAITING_APPROVAL"
              ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-300"
              : "bg-amber-50/40 border-amber-300 hover:border-amber-400"
          )}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Pending approval</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-amber-800">
              {counts.pending}
            </span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-mono">
              Action Req.
            </span>
          </div>
        </button>

        {/* Metric 3: Active (Healthy Green) */}
        <button
          type="button"
          onClick={() => {
            setQuickFilter("APPROVED");
            setCurrentPage(1);
          }}
          className={cn(
            "p-3.5 rounded-2xl border text-left transition-all shadow-xs",
            quickFilter === "APPROVED"
              ? "bg-white border-emerald-500 ring-2 ring-emerald-300 shadow-sm"
              : "bg-white border-dairy-subtle hover:border-emerald-400"
          )}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-primary">
              {counts.approved}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-md font-mono">
              Dawn Active
            </span>
          </div>
        </button>

        {/* Metric 4: On Hold (Suspended) */}
        <button
          type="button"
          onClick={() => {
            setQuickFilter("SUSPENDED");
            setCurrentPage(1);
          }}
          className={cn(
            "p-3.5 rounded-2xl border text-left transition-all shadow-xs",
            quickFilter === "SUSPENDED"
              ? "bg-white border-blue-500 ring-2 ring-blue-300 shadow-sm"
              : "bg-white border-dairy-subtle hover:border-primary/40"
          )}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>On hold</span>
            <PauseCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-primary">
              {counts.suspended}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">seasonal</span>
          </div>
        </button>

        {/* Metric 5: Payment Blocked (Rule 4.4 Lock) */}
        <button
          type="button"
          onClick={() => {
            setQuickFilter("BLOCKED");
            setCurrentPage(1);
          }}
          className={cn(
            "p-3.5 rounded-2xl border text-left transition-all shadow-xs",
            quickFilter === "BLOCKED"
              ? "bg-rose-50/70 border-rose-400 ring-2 ring-rose-300"
              : "bg-rose-50/40 border-rose-300 hover:border-rose-400"
          )}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>Payment blocked</span>
            <Lock className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-rose-700">
              {counts.blocked}
            </span>
            <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-1.5 py-0.5 rounded-md font-mono">
              Rule 4.4
            </span>
          </div>
        </button>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="p-3.5 rounded-2xl bg-white border border-dairy-subtle shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Live Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer, business, phone, route..."
              className="w-full pl-9 pr-4 py-2 bg-dairy-surface-low border border-dairy-subtle rounded-xl text-xs font-medium text-dairy-dark focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Route Filter */}
          <div className="relative">
            <select
              value={routeFilter}
              onChange={(e) => {
                setRouteFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 pl-3 pr-8 rounded-xl bg-dairy-surface-low border border-dairy-subtle text-xs font-semibold text-dairy-dark focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">All Routes (Western India Network)</option>
              <option value="HADAPSAR">Route 1 - Hadapsar Hub</option>
              <option value="KOTHRUD">Route 2 - Kothrud &amp; Paud</option>
              <option value="COLLEGE">Route 3 - College Road</option>
              <option value="EAST">Route 4 - Nashik East &amp; Panchavati</option>
              <option value="CAMP">Route 5 - Camp &amp; Cantonment</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || quickFilter !== "ALL" || routeFilter !== "ALL") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-9 px-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low flex items-center gap-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 pl-3 pr-7 rounded-xl bg-white border border-dairy-subtle text-xs font-bold text-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="recent">Most Recent Registration</option>
            <option value="balance">Outstanding Amount: High to Low</option>
            <option value="orders">Total Volume of Orders</option>
          </select>
        </div>
      </div>

      {/* RETAILERS TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dairy-surface-low border-b border-dairy-subtle text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Name &amp; Avatar</th>
                <th className="py-3 px-4">Business / Outlet</th>
                <th className="py-3 px-4">Contact &amp; Route</th>
                <th className="py-3 px-4">Status Chip</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Outstanding Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dairy-subtle/70">
              {paginatedRetailers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="font-semibold text-dairy-dark">No retailers found matching criteria</p>
                    <p className="text-[11px] mt-0.5">Try adjusting your search query or route filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedRetailers.map((ret) => {
                  const initials = ret.ownerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);

                  const isBlocked = ret.status === "BLOCKED";
                  const isPending = ret.status === "WAITING_APPROVAL";
                  const isSuspended = ret.status === "SUSPENDED";
                  const isApproved = ret.status === "APPROVED";

                  return (
                    <tr
                      key={ret.id}
                      className={cn(
                        "hover:bg-dairy-surface-low/60 transition-colors",
                        isBlocked && "bg-rose-50/20"
                      )}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs",
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
                          <div>
                            <Link
                              href={`/retailers/${ret.id}`}
                              className="font-bold text-primary hover:text-secondary hover:underline text-xs"
                            >
                              {ret.ownerName}
                            </Link>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              ID: {ret.accountCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Business & Demand */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-dairy-dark">
                          {ret.businessName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Daily Demand: <span className="font-bold text-primary">{ret.dailyMilkDemandLiters}L</span>
                        </div>
                      </td>

                      {/* Contact & Route */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-dairy-dark">{ret.phone}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                          {ret.area} • {ret.assignedRouteName.split("-")[0]}
                        </div>
                      </td>

                      {/* Status Chip */}
                      <td className="py-3.5 px-4">
                        {isBlocked ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                            <Lock className="h-3 w-3 text-rose-600" />
                            <span>Payment Blocked</span>
                          </div>
                        ) : isPending ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-bold">
                            <Clock className="h-3 w-3 text-amber-600" />
                            <span>Pending Approval</span>
                          </div>
                        ) : isSuspended ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dairy-surface-low border border-dairy-subtle text-muted-foreground text-[10px] font-bold">
                            <PauseCircle className="h-3 w-3" />
                            <span>On Hold (Suspended)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Active</span>
                          </div>
                        )}
                      </td>

                      {/* Total Orders */}
                      <td className="py-3.5 px-4 font-mono font-medium text-dairy-dark">
                        {ret.totalOrdersCount} orders
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {ret.deliveredOrdersCount} delivered
                        </div>
                      </td>

                      {/* Outstanding Amount */}
                      <td className="py-3.5 px-4">
                        {ret.outstandingBalance > 0 ? (
                          <div className="font-mono font-bold text-rose-700">
                            {formatCurrency(ret.outstandingBalance)}
                            <div className="text-[9px] text-rose-600 font-semibold uppercase">
                              COD Pending
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono font-bold text-emerald-700">
                            ₹0.00
                            <div className="text-[9px] text-muted-foreground font-normal">
                              Settled
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 360 Detail View Link */}
                          <Link
                            href={`/retailers/${ret.id}`}
                            className="px-2.5 py-1 rounded-lg border border-dairy-subtle bg-white hover:bg-primary hover:text-white text-primary text-[11px] font-bold transition-colors shadow-2xs"
                          >
                            View 360°
                          </Link>

                          {/* Quick Context Action */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setApprovalTarget(ret)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-2xs"
                            >
                              Approve
                            </button>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() =>
                                setActionTarget({ retailer: ret, type: "SUSPEND" })
                              }
                              className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold"
                            >
                              Suspend
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() =>
                                setActionTarget({ retailer: ret, type: "ACTIVATE" })
                              }
                              className="px-2 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="px-5 py-3.5 bg-dairy-surface-low border-t border-dairy-subtle flex items-center justify-between text-xs">
          <div className="text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-dairy-dark">
              {filteredRetailers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-dairy-dark">
              {Math.min(currentPage * PAGE_SIZE, filteredRetailers.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-dairy-dark">
              {filteredRetailers.length}
            </span>{" "}
            retailer accounts
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-dairy-subtle bg-white text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 transition-colors shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono font-bold text-primary px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-dairy-subtle bg-white text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 transition-colors shadow-2xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {approvalTarget && (
        <RetailerApprovalModal
          retailer={approvalTarget}
          isOpen={!!approvalTarget}
          onClose={() => setApprovalTarget(null)}
          onApprove={handleApprove}
        />
      )}

      {/* Sensitive Action Modal */}
      {actionTarget && (
        <RetailerConfirmActionModal
          retailer={actionTarget.retailer}
          actionType={actionTarget.type}
          isOpen={!!actionTarget}
          onClose={() => setActionTarget(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
