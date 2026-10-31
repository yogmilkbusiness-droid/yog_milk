"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  CreditCard,
  ShoppingBag,
  Users,
  Layers,
  ChevronRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { OperationsAnalyticsSummary } from "@/lib/contracts/analytics";
import {
  getOperationsAnalytics,
  generateOperationsCsv,
} from "@/lib/mock/admin-reports-repo";
import { formatCurrency, cn } from "@/lib/utils";

export default function ReportsAnalyticsPage() {
  const [analytics, setAnalytics] = useState<OperationsAnalyticsSummary | null>(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Date Range filter
  const [dateRange, setDateRange] = useState<"TODAY" | "LAST_7_DAYS" | "CURRENT_MONTH" | "ALL_TIME">("CURRENT_MONTH");

  // Active Report Tab
  const [activeTab, setActiveTab] = useState<"TRENDS" | "PRODUCTS" | "RETAILERS" | "STATUS_FLEET">("TRENDS");

  // Trend interval view (Daily / Weekly / Monthly)
  const [trendInterval, setTrendInterval] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("DAILY");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAnalytics(getOperationsAnalytics(dateRange));
    setIsClientLoaded(true);
  }, [dateRange]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    if (!analytics) return;
    const csvContent = generateOperationsCsv(analytics);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YOG_MILK_OPERATIONS_REPORT_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Operations CSV report exported successfully");
  };

  // Export Audited PDF Handler (Simulated Download)
  const handleExportPdf = () => {
    if (!analytics) return;
    const summaryText = `
========================================================================
                      YOG MILK DIRECT AGRO FARMS
             AUDITED OPERATIONS & NON-GST COMMODITY REPORT
                 FSSAI Central License #11524022000189
========================================================================
Date Range: ${dateRange}
Report Generated: ${new Date().toLocaleString()}
Status: VALIDATED AGAINST IMMUTABLE PRODUCTION AUDIT LOG
------------------------------------------------------------------------

1. FINANCIAL REALIZATION & VOLUMES:
   * Total Commercial Orders:     ${analytics.totalOrderVolume} Orders
   * Total Order Value:           Rs. ${analytics.totalOrderValue.toFixed(2)}
   * Total Reconciled Payments:   Rs. ${analytics.totalPaymentsCollected.toFixed(2)}
     - Razorpay / UPI QR:         Rs. ${analytics.upiPaymentsTotal.toFixed(2)}
     - Driver Cash (COD):         Rs. ${analytics.codPaymentsTotal.toFixed(2)}
   * Outstanding Balance (Risk):  Rs. ${analytics.totalPendingBalance.toFixed(2)}
   * Rule 4.4 Blocked Accounts:   ${analytics.blockedRetailersCount} Retailers Blocked

2. LOGISTICS & DAWN DISPATCHES:
   * On-Time Dawn Runs:           ${analytics.onTimeDawnDispatches} / ${analytics.totalOrderVolume}
   * Completion Rate:             ${analytics.deliveryCompletionRate}%
   * Failed Drops / Incidents:    ${analytics.failedDispatches}

3. TOP AGRICULTURAL DAIRY COMMODITIES:
${analytics.topProducts.map((p, i) => `   ${i + 1}. ${p.productName} (${p.packSize}): ${p.unitsSold} units · Rs. ${p.totalRevenue.toFixed(2)}`).join("\n")}

========================================================================
NOTE: Pure agricultural dairy products. Non-GST commercial operations.
========================================================================
    `;

    const blob = new Blob([summaryText.trim()], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YOG_MILK_AUDITED_REPORT_${dateRange}_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Audited Operations Report summary exported");
  };

  if (!isClientLoaded || !analytics) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-100 animate-pulse rounded-2xl" />
          <div className="h-44 bg-slate-100 animate-pulse rounded-2xl" />
          <div className="h-44 bg-slate-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeTrendData =
    trendInterval === "DAILY"
      ? analytics.dailyTrends
      : trendInterval === "WEEKLY"
      ? analytics.weeklyTrends
      : analytics.monthlyTrends;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-7">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#051256] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Export Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Operations Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#051256] font-bold">Audited Reports & Intelligence</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#051256] tracking-tight">
            Dawn Milk Intake & Financial Realization
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Date Range Picker */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setDateRange("TODAY")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                dateRange === "TODAY" && "bg-white text-[#051256] shadow-xs"
              )}
            >
              Today · Dawn
            </button>
            <button
              type="button"
              onClick={() => setDateRange("LAST_7_DAYS")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                dateRange === "LAST_7_DAYS" && "bg-white text-[#051256] shadow-xs"
              )}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setDateRange("CURRENT_MONTH")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                dateRange === "CURRENT_MONTH" && "bg-white text-[#051256] shadow-xs font-bold"
              )}
            >
              Current Month (Oct 2026)
            </button>
            <button
              type="button"
              onClick={() => setDateRange("ALL_TIME")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                dateRange === "ALL_TIME" && "bg-white text-[#051256] shadow-xs"
              )}
            >
              All Time
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-[#051256] hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#051256] text-white hover:bg-[#051256]/90 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Export Audited PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THREE SEPARATED FINANCIAL HERO METRICS (Matching Stitch Reference)         */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD A: Total Order Value (Deep Navy Hero Container) */}
        <div className="relative bg-[#051256] text-white rounded-2xl p-6 shadow-sm border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-blue-200 text-[10px] font-bold tracking-widest uppercase">
                Direct Farm Realization
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> +14.2% MTD
              </span>
            </div>
            <div className="text-xs text-blue-200/80">Total Order Value (Non-GST Direct)</div>
            <div className="text-3xl font-serif font-bold text-white mt-1 tracking-tight">
              {formatCurrency(analytics.totalOrderValue)}
            </div>
          </div>
          <div className="pt-5 mt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-blue-200/70 text-[11px]">Consignments</div>
              <div className="font-bold text-white mt-0.5">{analytics.totalOrderVolume} Orders</div>
            </div>
            <div>
              <div className="text-blue-200/70 text-[11px]">Average Order</div>
              <div className="font-bold text-white mt-0.5">
                {formatCurrency(
                  analytics.totalOrderVolume > 0
                    ? analytics.totalOrderValue / analytics.totalOrderVolume
                    : 0
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD B: Payments Collected (Muted Forest Green Container) */}
        <div className="relative bg-[#0d3b24] text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-200 text-[10px] font-bold tracking-widest uppercase">
                {analytics.totalOrderValue > 0
                  ? `${Math.round((analytics.totalPaymentsCollected / analytics.totalOrderValue) * 100)}% Settled`
                  : "100% Settled"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Reconciled
              </span>
            </div>
            <div className="text-xs text-emerald-100/80">Payments Collected & Reconciled</div>
            <div className="text-3xl font-serif font-bold text-white mt-1 tracking-tight">
              {formatCurrency(analytics.totalPaymentsCollected)}
            </div>
          </div>
          <div className="pt-5 mt-4 border-t border-emerald-700/40 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-emerald-200/70 text-[11px] flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Razorpay / UPI
              </div>
              <div className="font-bold text-emerald-100 mt-0.5">
                {formatCurrency(analytics.upiPaymentsTotal)}
              </div>
            </div>
            <div>
              <div className="text-emerald-200/70 text-[11px] flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Driver Cash (COD)
              </div>
              <div className="font-bold text-emerald-100 mt-0.5">
                {formatCurrency(analytics.codPaymentsTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* CARD C: Outstanding / At Risk (Warm Amber / Terracotta Container) */}
        <div className="relative bg-[#541c00] text-white rounded-2xl p-6 shadow-sm border border-amber-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md bg-[#ffb68b]/20 text-[#ffdbc8] text-[10px] font-bold tracking-widest uppercase">
                Zero-Credit Policy
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {analytics.blockedRetailersCount} Blocked
              </span>
            </div>
            <div className="text-xs text-[#ffdbc8]/80">Outstanding Balance (Pending Settling)</div>
            <div className="text-3xl font-serif font-bold text-[#ffdbc8] mt-1 tracking-tight">
              {formatCurrency(analytics.totalPendingBalance)}
            </div>
          </div>
          <div className="pt-5 mt-4 border-t border-amber-800/50 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[#ffdbc8]/70 text-[11px]">Rule 4.4 Gate Holds</div>
              <div className="font-bold text-white mt-0.5">{analytics.blockedRetailersCount} Accounts</div>
            </div>
            <div>
              <div className="text-[#ffdbc8]/70 text-[11px]">Completion Rate</div>
              <div className="font-bold text-emerald-300 mt-0.5">
                {analytics.deliveryCompletionRate}% On-Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* REPORT VIEW TABS                                                          */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab("TRENDS")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all",
            activeTab === "TRENDS"
              ? "border-[#051256] text-[#051256] font-bold"
              : "border-transparent hover:text-slate-900"
          )}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Volume & Revenue Trends</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PRODUCTS")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all",
            activeTab === "PRODUCTS"
              ? "border-[#051256] text-[#051256] font-bold"
              : "border-transparent hover:text-slate-900"
          )}
        >
          <Package className="w-4 h-4" />
          <span>Top Dairy Products</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RETAILERS")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all",
            activeTab === "RETAILERS"
              ? "border-[#051256] text-[#051256] font-bold"
              : "border-transparent hover:text-slate-900"
          )}
        >
          <Users className="w-4 h-4" />
          <span>Top Retailers & Settlement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("STATUS_FLEET")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all",
            activeTab === "STATUS_FLEET"
              ? "border-[#051256] text-[#051256] font-bold"
              : "border-transparent hover:text-slate-900"
          )}
        >
          <Truck className="w-4 h-4" />
          <span>Status Distribution & Fleet Telemetry</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VOLUME & REVENUE TRENDS (Daily / Weekly / Monthly)                 */}
      {/* ========================================================================= */}
      {activeTab === "TRENDS" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dairy Order Volume & Realization Trajectory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Periodic breakdown of commercial milk demand, collected collections, and pending balances.
              </p>
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setTrendInterval("DAILY")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  trendInterval === "DAILY" && "bg-white text-[#051256] font-bold shadow-xs"
                )}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setTrendInterval("WEEKLY")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  trendInterval === "WEEKLY" && "bg-white text-[#051256] font-bold shadow-xs"
                )}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTrendInterval("MONTHLY")}
                className={cn(
                  "px-3 py-1 rounded transition-colors",
                  trendInterval === "MONTHLY" && "bg-white text-[#051256] font-bold shadow-xs"
                )}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Order Value (INR)</th>
                  <th className="py-3 px-4 text-right">Collections (INR)</th>
                  <th className="py-3 px-4 text-right">Pending Balance</th>
                  <th className="py-3 px-4 text-center">Settlement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTrendData.map((row) => {
                  const rate =
                    row.orderValue > 0
                      ? Math.round((row.paymentsCollected / row.orderValue) * 100)
                      : 100;
                  return (
                    <tr key={row.period} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{row.label}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {row.orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(row.orderValue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                        {formatCurrency(row.paymentsCollected)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-700">
                        {formatCurrency(row.pendingAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-bold",
                            rate >= 90
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          )}
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TOP DAIRY PRODUCTS                                                 */}
      {/* ========================================================================= */}
      {activeTab === "PRODUCTS" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Top Selling Dairy SKUs & Procurement Revenue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by commercial bulk quantities delivered to kiranas and dairy parlors.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pack Size</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                  <th className="py-3 px-4 text-center">Inventory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.topProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.productName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{p.packSize}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      {p.unitsSold.toLocaleString()} units
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#051256]">
                      {formatCurrency(p.totalRevenue)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TOP RETAILERS & SETTLEMENT                                         */}
      {/* ========================================================================= */}
      {activeTab === "RETAILERS" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Commercial Retailer Volume & Prompt Settlement Leaderboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Profiles with highest dairy orders and disciplined offline/online settlement histories.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/60">
                  <th className="py-3 px-4">Retailer / Shop</th>
                  <th className="py-3 px-4">Proprietor</th>
                  <th className="py-3 px-4">Area & Route</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Total Billed</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Pending Due</th>
                  <th className="py-3 px-4 text-center">Settlement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.topRetailers.map((r) => (
                  <tr key={r.retailerId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.shopName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.ownerName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.area}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">{r.orderCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(r.totalBilledValue)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(r.totalPaid)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700">
                      {formatCurrency(r.pendingBalance)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold",
                          r.settlementRate >= 95
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        )}
                      >
                        {r.settlementRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STATUS DISTRIBUTION & FLEET TELEMETRY                              */}
      {/* ========================================================================= */}
      {activeTab === "STATUS_FLEET" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Status Distribution */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Order Lifecycle Distribution</h2>
            <div className="space-y-3">
              {analytics.statusDistribution.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.count} orders ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fleet Telemetry & Dawn Runs */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Logistics & Fleet Performance</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">On-Time Dawn Deliveries</span>
                <div className="text-2xl font-serif font-bold text-emerald-700">
                  {analytics.onTimeDawnDispatches} Runs
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  05:00 AM – 08:00 AM window
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Dispatch Failure Incidents</span>
                <div className="text-2xl font-serif font-bold text-rose-700">
                  {analytics.failedDispatches} Drops
                </div>
                <span className="text-[10px] text-slate-400">All incident logs reviewed</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
                <span className="text-slate-500 text-[11px]">Overall Delivery Completion Rate</span>
                <div className="text-3xl font-serif font-bold text-[#051256]">
                  {analytics.deliveryCompletionRate}%
                </div>
                <p className="text-[11px] text-slate-500">
                  Refrigerated fleet maintains strict 4°C cold chain integrity across all Pune and suburban distribution clusters.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
