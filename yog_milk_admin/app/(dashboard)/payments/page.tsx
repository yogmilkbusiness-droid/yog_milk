"use client";

import { useState, useMemo, useEffect } from "react";
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ShieldAlert,
  PlusCircle,
  Lock,
  Store,
  Eye,
  RefreshCw,
  QrCode,
  Building2,
  Truck,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { PaymentRecord, RecordCashPaymentParams } from "@/lib/contracts/payment";
import {
  getMockPayments,
  recordManualCashPayment,
} from "@/lib/mock/admin-billing-repo";
import { RecordPaymentModal } from "@/components/features/payments/RecordPaymentModal";
import { formatCurrency, cn } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordingTargetPayment, setRecordingTargetPayment] = useState<PaymentRecord | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPayments(getMockPayments());
    setIsClientLoaded(true);
  }, []);

  const refreshPayments = () => {
    setPayments(getMockPayments());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Top Aggregates
  const totalSettledToday = useMemo(() => {
    return payments
      .filter((p) => p.paymentStatus === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const totalPendingAmount = useMemo(() => {
    return payments
      .filter((p) => p.paymentStatus === "PENDING")
      .reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const pendingCodList = useMemo(() => {
    return payments.filter((p) => p.paymentStatus === "PENDING");
  }, [payments]);

  // Tab counters
  const tabCounts = useMemo(() => {
    const counts = {
      all: payments.length,
      paid: 0,
      pending: 0,
      processing: 0,
      refunded: 0,
    };
    payments.forEach((p) => {
      if (p.paymentStatus === "PAID") counts.paid++;
      if (p.paymentStatus === "PENDING") counts.pending++;
      if (p.paymentStatus === "PROCESSING") counts.processing++;
      if (p.paymentStatus === "REFUNDED") counts.refunded++;
    });
    return counts;
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = p.orderCode.toLowerCase().includes(q);
        const matchRetailer = p.retailerBusinessName.toLowerCase().includes(q);
        const matchArea = p.retailerArea.toLowerCase().includes(q);
        const matchRef = p.transactionReference?.toLowerCase().includes(q) || false;
        const matchReceipt = p.receiptNumber?.toLowerCase().includes(q) || false;
        if (!matchCode && !matchRetailer && !matchArea && !matchRef && !matchReceipt) {
          return false;
        }
      }

      // Status Tab
      if (statusTab === "paid" && p.paymentStatus !== "PAID") return false;
      if (statusTab === "pending" && p.paymentStatus !== "PENDING") return false;
      if (statusTab === "processing" && p.paymentStatus !== "PROCESSING") return false;
      if (statusTab === "refunded" && p.paymentStatus !== "REFUNDED") return false;

      // Method Filter
      if (methodFilter !== "all" && p.paymentMethod !== methodFilter) return false;

      // Date Filter
      if (dateFilter === "today" && p.dateKey !== "today") return false;
      if (dateFilter === "yesterday" && p.dateKey !== "yesterday") return false;

      return true;
    });
  }, [payments, searchQuery, statusTab, methodFilter, dateFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusTab, methodFilter, dateFilter]);

  // Handlers
  const handleOpenRecordPayment = (payment?: PaymentRecord) => {
    setRecordingTargetPayment(payment || pendingCodList[0] || null);
    setIsRecordModalOpen(true);
  };

  const handleRecordPayment = (params: RecordCashPaymentParams) => {
    const updated = recordManualCashPayment(params);
    if (updated) {
      refreshPayments();
      showToast(
        `Recorded ₹${params.amountCollected.toFixed(2)} for ${updated.retailerBusinessName}. Rule 4.4 restriction released.`
      );
    }
  };

  const exportLedger = () => {
    showToast("Exported payments reconciliation ledger: yog_milk_payments_ledger.csv");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-white shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header matching Stitch Reference */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-dairy-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
            <span>Operations Console</span>
            <span>/</span>
            <span className="text-primary font-semibold">Payments &amp; Reconciliation</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            Payments &amp; Reconciliation
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage daily consignment settlements, Cash on Delivery collections, and payment pending blocked accounts.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={exportLedger}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dairy-subtle bg-white hover:bg-dairy-surface-low text-xs font-semibold text-dairy-dark shadow-2xs transition-colors"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Export Ledger (CSV)</span>
          </button>
          <button
            onClick={() => handleOpenRecordPayment()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Record Offline Payment</span>
          </button>
        </div>
      </div>

      {/* Policy Directive Banner (Rules 4.3 & 4.4) */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">
            Rule 4.3 (Manual COD Recording) &amp; Rule 4.4 (The Single Pending-Payment Gate)
          </p>
          <p className="mt-0.5">
            Cash on Delivery orders remain strictly <strong>PENDING</strong> until physically verified and recorded here by an authorized Administrator. Retailers with an unresolved pending payment are strictly prohibited from placing new orders. Zero credit features are permanently enforced.
          </p>
        </div>
      </div>

      {/* Top Summary KPI Strip (Stitch Reference) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Balance */}
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-500/40 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Pending Balances
              </span>
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-primary">
                ₹{totalPendingAmount.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {pendingCodList.length} unpaid
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Pending driver handover or hub reconciliation</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span>Requires administrator recording</span>
            <ChevronRight className="h-4 w-4 text-amber-700" />
          </div>
        </div>

        {/* Card 2: Settled Paid Today */}
        <div className="p-5 rounded-2xl bg-white border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Settled Today
              </span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-800">
                ₹{totalSettledToday.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                {tabCounts.paid} Paid
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Simulated Razorpay &amp; verified cash settlements today.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-dairy-subtle flex items-center justify-between text-xs text-muted-foreground">
            <span>Last reconciled 07:45 AM</span>
            <span className="text-emerald-700 font-semibold">Active</span>
          </div>
        </div>

        {/* Card 3: Processing / Verification */}
        <div className="p-5 rounded-2xl bg-white border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                In Verification
              </span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                <RefreshCw className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-primary">
                {tabCounts.processing} Transactions
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Online checkouts undergoing webhook callback verification.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-dairy-subtle flex items-center justify-between text-xs text-muted-foreground">
            <span>Simulated gateway active</span>
          </div>
        </div>

        {/* Card 4: Payment Pending Block Accounts */}
        <div className="p-5 rounded-2xl bg-white border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Payment Pending Block
              </span>
              <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Lock className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-primary">
                {pendingCodList.length} Accounts
              </span>
              <span className="text-xs text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                Order Blocked
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              New orders blocked until full unpaid balance is recorded.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-dairy-subtle flex items-center justify-between text-xs text-red-700 font-semibold">
            <span>Rule 4.4 Enforced</span>
          </div>
        </div>
      </div>

      {/* SECTION: PAYMENT PENDING BLOCK ACCOUNTS PANEL (Stitch Reference) */}
      {pendingCodList.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-500/40 shadow-xs overflow-hidden">
          <div className="p-4 md:px-6 bg-amber-50/70 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-dairy-dark flex items-center gap-2">
                  Payment Pending Block Accounts
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                    {pendingCodList.length} Holds Active
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Retailer accounts with overdue balances. Ordering is restricted under Rule 4.4 until payment is recorded.
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Automatic checkout gate active
            </div>
          </div>

          <div className="divide-y divide-dairy-subtle">
            {pendingCodList.map((p) => (
              <div
                key={p.id}
                className="p-4 md:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-dairy-surface-low/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold text-dairy-dark">
                        {p.retailerBusinessName}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        ({p.retailerOwnerName})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-dairy-surface text-primary font-mono text-xs font-semibold border border-dairy-subtle">
                        {p.orderCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="font-bold text-red-600 font-mono">
                        Total Overdue: ₹{p.amount.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-medium">
                        Pending: {p.overdueDays || 1} Day
                      </span>
                      <span>•</span>
                      <span className="text-red-700 font-semibold flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Checkout restricted
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => handleOpenRecordPayment(p)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Record Payment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Payments Ledger Table Card */}
      <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-dairy-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Settlements", count: tabCounts.all },
              { id: "paid", label: "Paid / Settled", count: tabCounts.paid },
              { id: "pending", label: "Pending COD", count: tabCounts.pending },
              { id: "processing", label: "Processing", count: tabCounts.processing },
              { id: "refunded", label: "Refunded", count: tabCounts.refunded },
            ].map((tab) => {
              const isActive = statusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusTab(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    isActive
                      ? "bg-primary text-white shadow-2xs"
                      : "text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-dairy-surface text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code, shop, area, ref..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-dairy-dark placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Method filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs py-1.5 px-3 text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Methods</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="ONLINE">Razorpay Online</option>
              <option value="UPI">Direct UPI / QR</option>
              <option value="BANK_TRANSFER">Bank Transfer (NEFT)</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dairy-surface-low text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-dairy-subtle">
                <th className="py-3 px-6">Payment ID &amp; Date</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer &amp; Area</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Gateway / Vault Status</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dairy-subtle">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <IndianRupee className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="font-semibold text-dairy-dark text-sm">No payment records found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try adjusting search filters or expanding your status tab.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p) => (
                  <tr
                    key={p.id}
                    className={cn(
                      "hover:bg-dairy-surface-low/60 transition-colors",
                      p.paymentStatus === "PENDING" && "bg-amber-50/20"
                    )}
                  >
                    {/* Payment ID & Date */}
                    <td className="py-3.5 px-6">
                      <div className="font-mono font-bold text-primary">{p.id}</div>
                      <div className="text-[11px] text-muted-foreground">{p.recordedAt}</div>
                    </td>

                    {/* Order Reference */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-secondary">{p.orderCode}</div>
                      {p.consignmentId && (
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {p.consignmentId}
                        </div>
                      )}
                    </td>

                    {/* Customer & Area */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-dairy-dark">{p.retailerBusinessName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.retailerOwnerName} · {p.retailerArea}
                      </div>
                    </td>

                    {/* Billed Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-dairy-dark">
                      ₹{p.amount.toFixed(2)}
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-dairy-dark">
                        {p.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : p.paymentMethod === "ONLINE"
                          ? "Razorpay Online"
                          : p.paymentMethod === "UPI"
                          ? "Direct UPI / QR"
                          : "Bank Transfer"}
                      </span>
                      {p.transactionReference && (
                        <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">
                          {p.transactionReference}
                        </div>
                      )}
                      {p.receiptNumber && (
                        <div className="text-[10px] font-mono text-emerald-800 font-bold">
                          {p.receiptNumber}
                        </div>
                      )}
                    </td>

                    {/* Gateway Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          p.paymentStatus === "PAID" && "bg-emerald-100 text-emerald-800",
                          p.paymentStatus === "PENDING" && "bg-amber-100 text-amber-800",
                          p.paymentStatus === "PROCESSING" && "bg-blue-100 text-blue-800",
                          p.paymentStatus === "REFUNDED" && "bg-zinc-100 text-zinc-700"
                        )}
                      >
                        ● {p.paymentStatus}
                      </span>
                    </td>

                    {/* Audit Status */}
                    <td className="py-3.5 px-4">
                      {p.paymentStatus === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          <Lock className="h-3 w-3" />
                          Block Active
                        </span>
                      ) : p.recordedByAdminName ? (
                        <div className="text-[10px] text-muted-foreground">
                          Vault: <strong className="text-dairy-dark">{p.recordedByAdminName}</strong>
                        </div>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-medium">Auto Cleared</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      {p.paymentStatus === "PENDING" ? (
                        <button
                          onClick={() => handleOpenRecordPayment(p)}
                          className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-container text-white text-[11px] font-bold shadow-2xs transition-all"
                        >
                          Record
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold">✓ Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-dairy-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-dairy-dark">{paginatedPayments.length}</strong> of{" "}
            <strong className="text-dairy-dark">{filteredPayments.length}</strong> payment transactions
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-primary text-white font-bold text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <RecordPaymentModal
          payment={recordingTargetPayment}
          pendingPayments={pendingCodList}
          isOpen={isRecordModalOpen}
          onClose={() => {
            setIsRecordModalOpen(false);
            setRecordingTargetPayment(null);
          }}
          onRecordPayment={handleRecordPayment}
        />
      )}
    </div>
  );
}
