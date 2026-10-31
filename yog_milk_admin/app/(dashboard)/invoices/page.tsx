"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { CommercialInvoice } from "@/lib/contracts/invoice";
import { getMockInvoices } from "@/lib/mock/admin-billing-repo";
import { InvoicePreviewModal } from "@/components/features/invoices/InvoicePreviewModal";
import { formatCurrency, cn } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<CommercialInvoice[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected Invoice for Preview Modal
  const [selectedInvoice, setSelectedInvoice] = useState<CommercialInvoice | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setInvoices(getMockInvoices());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Top Aggregates
  const totalBilledValue = useMemo(() => {
    return invoices
      .filter((inv) => inv.paymentStatus !== "VOIDED")
      .reduce((acc, inv) => acc + inv.totalPayable, 0);
  }, [invoices]);

  const totalOutstandingDue = useMemo(() => {
    return invoices
      .filter((inv) => inv.paymentStatus === "PENDING")
      .reduce((acc, inv) => acc + (inv.balanceDue || inv.totalPayable), 0);
  }, [invoices]);

  const totalSettledAmount = useMemo(() => {
    return invoices
      .filter((inv) => inv.paymentStatus === "PAID")
      .reduce((acc, inv) => acc + (inv.amountReceived || inv.totalPayable), 0);
  }, [invoices]);

  // Tab counters
  const tabCounts = useMemo(() => {
    const counts = {
      all: invoices.length,
      paid: 0,
      pending: 0,
      voided: 0,
    };
    invoices.forEach((inv) => {
      if (inv.paymentStatus === "PAID") counts.paid++;
      if (inv.paymentStatus === "PENDING") counts.pending++;
      if (inv.paymentStatus === "VOIDED") counts.voided++;
    });
    return counts;
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchCode = inv.orderCode.toLowerCase().includes(q);
        const matchRetailer = inv.retailerBusinessName.toLowerCase().includes(q);
        const matchOwner = inv.retailerOwnerName.toLowerCase().includes(q);
        const matchArea = inv.retailerArea.toLowerCase().includes(q);
        if (!matchNumber && !matchCode && !matchRetailer && !matchOwner && !matchArea) {
          return false;
        }
      }

      // Status Tab
      if (statusTab === "paid" && inv.paymentStatus !== "PAID") return false;
      if (statusTab === "pending" && inv.paymentStatus !== "PENDING") return false;
      if (statusTab === "voided" && inv.paymentStatus !== "VOIDED") return false;

      return true;
    });
  }, [invoices, searchQuery, statusTab]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusTab]);

  const downloadBatch = () => {
    showToast("Downloaded batch sequential invoices: yog_milk_daily_invoices_batch.zip");
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

      {/* Page Heading matching Stitch Reference */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-dairy-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Billing Operations</span>
            <span>/</span>
            <span className="text-primary font-semibold">Commercial Invoices</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Commercial Non-GST Invoices
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Rule 4.5 Compliant
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sequential agricultural delivery memos and farm bills for raw Vedic dairy harvests. Strictly no GSTIN or GST breakdown.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            onClick={downloadBatch}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dairy-subtle bg-white hover:bg-dairy-surface-low text-dairy-dark text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Download Daily Batch Memos</span>
          </button>
        </div>
      </div>

      {/* Rule 4.5 Non-GST Policy Banner */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-dairy-dark leading-relaxed">
          <p className="font-bold">Rule 4.5 Non-GST Commercial Billing Governance</p>
          <p className="text-muted-foreground mt-0.5">
            YOG MILK is not GST registered and sells pure agricultural dairy commodities. Bills are titled <strong>&ldquo;Commercial Invoice&rdquo;</strong> or <strong>&ldquo;Farm Bill / Delivery Memo&rdquo;</strong> containing FSSAI Central Registration (#11524022000189), sequential invoice numbers, itemized quantities, unit rates, and settlement status. No tax lines, HSN codes, or GSTIN calculations are generated.
          </p>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Total Billed Today
          </div>
          <div className="text-xl font-bold font-mono text-primary">
            ₹{totalBilledValue.toFixed(2)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {invoices.length} sequential memos issued
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Settled Collections
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800">
            ₹{totalSettledAmount.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Online UPI &amp; recorded cash
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
            Outstanding Net Due
          </div>
          <div className="text-xl font-bold font-mono text-amber-800">
            ₹{totalOutstandingDue.toFixed(2)}
          </div>
          <p className="text-[11px] text-amber-900 mt-0.5">
            {tabCounts.pending} unpaid orders pending collection
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Central FSSAI License
          </div>
          <div className="text-sm font-mono font-bold text-emerald-800">
            #11524022000189
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Nashik Vedic Farm Facility
          </p>
        </div>
      </div>

      {/* Main Invoices Table Card */}
      <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-dairy-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Invoices", count: tabCounts.all },
              { id: "paid", label: "Paid / Settled", count: tabCounts.paid },
              { id: "pending", label: "Pending COD", count: tabCounts.pending },
              { id: "voided", label: "Voided / Cancelled", count: tabCounts.voided },
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

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice #, order code, outlet, area..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-dairy-dark placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dairy-surface-low text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-dairy-subtle">
                <th className="py-3 px-6">Invoice Number &amp; Date</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Retailer Outlet</th>
                <th className="py-3 px-4">Dispatch Route</th>
                <th className="py-3 px-4 text-right">Net Billed (₹)</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dairy-subtle">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="font-semibold text-dairy-dark text-sm">No invoices found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Adjust your search terms or filter selection.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.invoiceNumber}
                    onClick={() => setSelectedInvoice(inv)}
                    className={cn(
                      "hover:bg-dairy-surface-low/60 transition-colors cursor-pointer group",
                      inv.paymentStatus === "VOIDED" && "bg-zinc-50 opacity-70"
                    )}
                  >
                    {/* Invoice Number & Date */}
                    <td className="py-3.5 px-6">
                      <div className="font-mono font-bold text-primary group-hover:underline">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{inv.invoiceDate}</div>
                    </td>

                    {/* Order Reference */}
                    <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                      {inv.orderCode}
                    </td>

                    {/* Retailer Outlet */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-dairy-dark">{inv.retailerBusinessName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {inv.retailerOwnerName} · {inv.retailerArea}
                      </div>
                    </td>

                    {/* Dispatch Route */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-dairy-dark truncate max-w-[150px]">
                        {inv.dispatchRouteName || "Route 4 Nashik East"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {inv.dispatchSlot || "Dawn Run"}
                      </div>
                    </td>

                    {/* Net Billed */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-dairy-dark">
                      ₹{inv.totalPayable.toFixed(2)}
                      {inv.paymentStatus === "PENDING" && (
                        <div className="text-[10px] text-amber-700 font-sans font-normal">
                          Net Due
                        </div>
                      )}
                    </td>

                    {/* Settlement Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          inv.paymentStatus === "PAID" && "bg-emerald-100 text-emerald-800",
                          inv.paymentStatus === "PENDING" && "bg-amber-100 text-amber-800",
                          inv.paymentStatus === "VOIDED" && "bg-red-100 text-red-800 line-through"
                        )}
                      >
                        ● {inv.paymentStatus === "PAID"
                          ? `Paid (${inv.paymentMethod})`
                          : inv.paymentStatus === "PENDING"
                          ? `Pending · ${inv.paymentMethod}`
                          : "Voided"}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-dairy-surface text-dairy-dark text-[10px] font-mono font-semibold">
                        {inv.version}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] transition-colors"
                      >
                        Preview Bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-4 border-t border-dairy-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-dairy-dark">{paginatedInvoices.length}</strong> of{" "}
            <strong className="text-dairy-dark">{filteredInvoices.length}</strong> commercial non-GST bills
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

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoicePreviewModal
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
