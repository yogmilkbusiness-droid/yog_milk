"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  IndianRupee,
  Users,
  Milk,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCw,
  ArrowUpRight,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/components/features/dashboard/DashboardCharts";
import { OperationalAlertsWidget } from "@/components/features/dashboard/OperationalAlertsWidget";
import { RecentOrdersWidget } from "@/components/features/dashboard/RecentOrdersWidget";
import { RecentActivitiesWidget } from "@/components/features/dashboard/RecentActivitiesWidget";
import { QuickActionsWidget } from "@/components/features/dashboard/QuickActionsWidget";
import { MOCK_DASHBOARD_METRICS } from "@/lib/mock/admin-metrics";
import { formatCurrency, cn } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today · 29 Oct 2026");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const metrics = MOCK_DASHBOARD_METRICS;

  return (
    <div className="space-y-6">
      {/* Page Header matching Stitch Reference */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <span>Operations Console</span>
            <span>/</span>
            <span className="text-secondary font-bold">Western India Dispatch Cycle</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Operations Dashboard
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold">
              Vedic Pure Batch #29A
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dawn &amp; morning batch fulfillment overview · Nashik Central Cold-Chain Hub
          </p>
        </div>

        {/* Filter and Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Refresh Counter */}
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-dairy-subtle text-xs font-mono text-muted-foreground hover:text-dairy-dark transition-colors shadow-2xs"
          >
            <RotateCw
              className={cn("h-3.5 w-3.5 text-secondary", isRefreshing && "animate-spin")}
            />
            <span>Synced 2m ago</span>
          </button>

          {/* Date Selector */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-white border border-dairy-subtle text-dairy-dark text-xs font-semibold rounded-xl py-2 pl-3.5 pr-8 hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
          >
            <option>Today · 29 Oct 2026</option>
            <option>Yesterday · 28 Oct 2026</option>
            <option>Last 7 Days (Dawn Runs)</option>
            <option>Custom Vedic Calendar Range</option>
          </select>

          {/* Export Non-GST Direct Farmer Report Button (Rule 4.5) */}
          <Link
            href="/invoices"
            className="flex items-center gap-2 px-3.5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl transition-all text-xs font-bold shadow-sm active:scale-95"
          >
            <FileText className="h-3.5 w-3.5 text-secondary-container" />
            <span>Export Non-GST Report</span>
          </Link>
        </div>
      </div>

      {/* Governance Banner: Verifying Absolute Precedence of v2.0 Master Plan */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-serif font-bold text-xs sm:text-sm text-primary">
              Operational Governance &amp; Policy Alignment Verified
            </span>
            <Badge variant="delivered" showDot>
              v2.0 Master Spec
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground max-w-2xl leading-relaxed">
            Strict 0-Credit Rule Enforced • Independent Triad Lifecycles (Order, Payment, Delivery) • Automated Recurring Ordering Gate (07:00 – 17:00 IST) • Commercial Non-GST Direct Farmer Invoicing.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
          <span className="bg-white border border-dairy-subtle px-2 py-0.5 rounded-md text-dairy-dark">
            schema.sql: 0 bytes
          </span>
          <span className="bg-white border border-dairy-subtle px-2 py-0.5 rounded-md text-dairy-dark">
            Zero Credit Features
          </span>
          <span className="bg-white border border-dairy-subtle px-2 py-0.5 rounded-md text-dairy-dark">
            Rule 4.4 Block Active
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MANDATORY KPI GRID: GROUP 1 - OPERATIONAL PIPELINE (6 Mini-Cards)    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Orders Today */}
        <div className="bg-white p-4 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Orders Today</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.ordersToday}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              +{metrics.ordersTodayDeltaPercent}%
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">vs dawn run yesterday</span>
        </div>

        {/* Metric 2: Awaiting Action */}
        <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30">
          <div className="absolute -right-2 -top-2 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <span className="text-xs font-bold text-amber-900">Awaiting Action</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-700">
              {metrics.awaitingActionCount}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
              URGENT
            </span>
          </div>
          <span className="text-[10px] text-amber-900/80 mt-1 font-medium">Requires verification</span>
        </div>

        {/* Metric 3: Processing Orders (Preparing in Kitchen) */}
        <div className="bg-white p-4 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Processing Orders</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-secondary">
              {metrics.processingCount}
            </span>
            <Milk className="h-4 w-4 text-secondary opacity-80" />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">Packaging &amp; chilling</span>
        </div>

        {/* Metric 4: Deliveries Due */}
        <div className="bg-white p-4 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Deliveries Due</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.deliveriesDueCount}
            </span>
            <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
              {metrics.deliveriesDueRoutes} Routes
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">Slot: 05:30 – 07:00 AM</span>
        </div>

        {/* Metric 5: Delivered Orders */}
        <div className="bg-white p-4 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Delivered Orders</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {metrics.deliveredCount}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">{metrics.deliveredReturnRatio}</span>
        </div>

        {/* Metric 6: Active Retailers */}
        <div className="bg-white p-4 rounded-2xl border border-dairy-subtle shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Active Retailers</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-primary">
              {metrics.activeRetailersCount}
            </span>
            <Users className="h-4 w-4 text-primary opacity-70" />
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1">
            +{metrics.activeRetailersNewCount} new booths
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MANDATORY KPI GRID: GROUP 2 - FINANCIAL SEPARATION TRIAD             */}
      {/* Crucial: Distinguish Order Value, Payments Collected & Pending COD     */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 7: Total Order Value Today (Navy High-Contrast Card) */}
        <div className="bg-primary text-white p-5 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-primary-on-container font-bold">
              Total Order Value Today
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white">
              Dawn + Dusk Runs
            </span>
          </div>

          <div className="my-3">
            <div className="font-serif text-3xl lg:text-4xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(metrics.totalOrderValue)}
            </div>
            <p className="text-[11px] text-primary-on-container mt-1">
              {metrics.orderValueDescription}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-primary-on-container">
            <span>Avg. Basket: {formatCurrency(metrics.avgBasketValue)}</span>
            <span className="text-secondary-container font-bold">Strict 0-Credit Policy</span>
          </div>
        </div>

        {/* Metric 8: Payments Collected (Success Green Container Card) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-emerald-900 font-bold">
              Payments Collected
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 font-mono">
              <CheckCircle2 className="h-3 w-3" />
              {metrics.paymentsCollectedPercent}% Settled
            </span>
          </div>

          <div className="my-3">
            <div className="font-serif text-3xl font-bold font-mono text-emerald-900 tracking-tight">
              {formatCurrency(metrics.paymentsCollected)}
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Razorpay Instant Online:</span>
                <span className="font-bold font-mono text-dairy-dark">
                  {formatCurrency(metrics.onlineCollected)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Verified Cash on Delivery (COD):</span>
                <span className="font-bold font-mono text-dairy-dark">
                  {formatCurrency(metrics.codCollected)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-dairy-subtle flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Bank payout scheduled 11:30 AM</span>
            <span className="text-emerald-700 font-bold">Reconciled</span>
          </div>
        </div>

        {/* Metric 9: Pending Payments (Amber Urgent Collection Card) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-900 font-bold">
              Pending Payments
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1 font-mono">
              <AlertCircle className="h-3 w-3 text-amber-700" />
              Rule 4.4 Active
            </span>
          </div>

          <div className="my-3">
            <div className="font-serif text-3xl font-bold font-mono text-amber-800 tracking-tight">
              {formatCurrency(metrics.pendingPayments)}
            </div>
            <div className="mt-2 space-y-1 text-xs text-amber-900 font-medium">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                {metrics.codPendingOrdersCount} orders pending Cash on Delivery collection
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                {metrics.onlineVerifyingOrdersCount} orders under online verification
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-amber-200 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-bold">Next-Order Checkout Block</span>
            <Link
              href="/payments"
              className="text-secondary font-bold hover:underline flex items-center gap-0.5"
            >
              Record Collection →
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* QUICK OPERATIONAL ACTIONS PANEL                                       */}
      {/* ===================================================================== */}
      <QuickActionsWidget />

      {/* ===================================================================== */}
      {/* CHARTS & OPERATIONAL ALERTS ROW                                       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Hourly Intake Curve & Stacked Status Distribution */}
        <div className="lg:col-span-8 space-y-6">
          <DashboardCharts />
        </div>

        {/* Right Column (4 cols): Operations & Risk Alerts Panel */}
        <div className="lg:col-span-4">
          <OperationalAlertsWidget />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LIVE ORDERS QUEUE & RECENT ACTIVITIES TIMELINE ROW                   */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 cols): Recent Orders Table with Decoupled Triad Badges */}
        <div className="lg:col-span-8">
          <RecentOrdersWidget />
        </div>

        {/* Right (4 cols): Real-Time Activities & Audit Stream */}
        <div className="lg:col-span-4">
          <RecentActivitiesWidget />
        </div>
      </div>
    </div>
  );
}
