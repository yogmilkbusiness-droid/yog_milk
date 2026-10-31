"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThermometerSnowflake,
  Download,
  Filter,
  Kanban,
  Table as TableIcon,
  Store,
  ArrowRight,
  ShieldAlert,
  Search,
  ChevronRight,
  User,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";
import { DeliveryRoute, DeliveryConsignment } from "@/lib/contracts/delivery";
import { DeliveryStatus, Order } from "@/lib/contracts/order";
import {
  getMockOrders,
  getMockDeliveryRoutes,
  getMockConsignments,
  updateMockDeliveryStatus,
  assignMockOrderRoute,
} from "@/lib/mock/admin-orders-repo";
import { DeliveryUpdateDrawer } from "@/components/features/deliveries/DeliveryUpdateDrawer";
import { DeliveryAssignModal } from "@/components/features/deliveries/DeliveryAssignModal";
import { cn } from "@/lib/utils";

export default function DeliveriesPage() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [consignments, setConsignments] = useState<DeliveryConsignment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  // Drawer & Modal state
  const [selectedConsignment, setSelectedConsignment] = useState<DeliveryConsignment | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setRoutes(getMockDeliveryRoutes());
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(getMockOrders());
    setConsignments(getMockConsignments());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered consignments
  const filteredConsignments = useMemo(() => {
    return consignments.filter((c) => {
      if (selectedRouteId !== "all" && c.routeId !== selectedRouteId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = c.id.toLowerCase().includes(q);
        const matchCode = c.orderCode.toLowerCase().includes(q);
        const matchRetailer = c.retailerName.toLowerCase().includes(q);
        const matchArea = c.area.toLowerCase().includes(q);
        const matchDriver = c.driverName.toLowerCase().includes(q);
        if (!matchId && !matchCode && !matchRetailer && !matchArea && !matchDriver) {
          return false;
        }
      }
      return true;
    });
  }, [consignments, selectedRouteId, searchQuery]);

  // Kanban Columns Mapping
  const kanbanColumns = useMemo(() => {
    return [
      {
        id: "needs_prep",
        title: "Needs Preparation / Unassigned",
        dotColor: "bg-amber-500",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "NOT_ASSIGNED"),
      },
      {
        id: "assigned",
        title: "Assigned (Reefer Ready)",
        dotColor: "bg-blue-600",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "ASSIGNED"),
      },
      {
        id: "picked_up",
        title: "Van Loaded / Picked Up",
        dotColor: "bg-indigo-600",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "PICKED_UP"),
      },
      {
        id: "out_for_delivery",
        title: "Out for Delivery",
        dotColor: "bg-purple-600",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "OUT_FOR_DELIVERY"),
      },
      {
        id: "delivered",
        title: "Delivered (Completed Drops)",
        dotColor: "bg-emerald-600",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "DELIVERED"),
      },
      {
        id: "failed",
        title: "Delivery Exceptions / Incidents",
        dotColor: "bg-red-600",
        items: filteredConsignments.filter((c) => c.deliveryStatus === "DELIVERY_FAILED"),
      },
    ];
  }, [filteredConsignments]);

  // Telemetry Aggregates
  const totalCrates = useMemo(() => {
    return consignments.reduce((acc, c) => acc + c.cratesCount, 0);
  }, [consignments]);

  const completedCount = useMemo(() => {
    return consignments.filter((c) => c.deliveryStatus === "DELIVERED").length;
  }, [consignments]);

  const exceptionsCount = useMemo(() => {
    return consignments.filter((c) => c.deliveryStatus === "DELIVERY_FAILED").length;
  }, [consignments]);

  // Actions
  const handleConfirmDeliveryUpdate = (
    orderId: string,
    newStatus: DeliveryStatus,
    payload: { failureReason?: string; followUpAction?: string; notes?: string }
  ) => {
    const updated = updateMockDeliveryStatus(
      orderId,
      newStatus,
      "Vikram Mehta (Operations Lead)",
      payload
    );
    if (updated) {
      refreshData();
      showToast(
        `Consignment ${updated.consignmentId || updated.orderCode} updated to ${newStatus}`
      );
    }
  };

  const handleAssignRoute = (
    orderId: string,
    routeId: string,
    driverName: string,
    vehicleNumber: string
  ) => {
    const updated = assignMockOrderRoute(
      orderId,
      routeId,
      driverName,
      vehicleNumber,
      "Vikram Mehta (Operations Lead)"
    );
    if (updated) {
      refreshData();
      showToast(`Assigned ${updated.orderCode} to Van ${vehicleNumber} (${driverName})`);
    }
  };

  const exportManifest = () => {
    showToast("Exported dispatch delivery manifest: yog_milk_cold_chain_manifest.csv");
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-white shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header matching Stitch Reference */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-dairy-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Operations Console</span>
            <span>/</span>
            <span className="text-primary font-semibold">Dispatch Logistics</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Deliveries &amp; Cold-Chain Dispatch
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Route Pulse
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Morning Vedic consignment departures, temperature telemetry, and Western Maharashtra dairy hub drop progression.
          </p>
        </div>

        {/* Toolbar: Route Filter, Telemetry, Export, View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
          {/* Route Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="bg-white border border-dairy-subtle rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="all">All Routes ({consignments.length} Deliveries)</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeName} ({r.totalDrops} Drops)
                </option>
              ))}
            </select>
          </div>

          {/* Van Fleet Telemetry Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-secondary/30 shadow-2xs text-primary">
            <ThermometerSnowflake className="h-4 w-4 text-emerald-600" />
            <span className="text-[11px] font-bold">
              4 Insulated Vans Active · <span className="text-emerald-700">Avg Temp 3.8°C</span>
            </span>
          </div>

          {/* Export Manifest */}
          <button
            onClick={exportManifest}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-dairy-surface-low border border-dairy-subtle text-xs font-semibold text-dairy-dark shadow-2xs transition-colors"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Export Manifest</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-dairy-surface-low rounded-xl border border-dairy-subtle">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === "board"
                  ? "bg-white text-primary shadow-xs"
                  : "text-muted-foreground hover:text-dairy-dark"
              )}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Board View</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === "table"
                  ? "bg-white text-primary shadow-xs"
                  : "text-muted-foreground hover:text-dairy-dark"
              )}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Total Crate Volume
          </div>
          <div className="text-xl font-bold font-mono text-primary">{totalCrates} Crates</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Insulated dawn delivery run</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Active Cold-Vans
          </div>
          <div className="text-xl font-bold font-mono text-primary">5 Fleet Vehicles</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">All sensors calibrated &lt;4.0°C</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Completed Drops
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {completedCount} Consignments
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Signed off at retail booths</p>
        </div>

        <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-800 mb-1">
            Delivery Incidents
          </div>
          <div className="text-xl font-bold font-mono text-red-700">
            {exceptionsCount} Exceptions
          </div>
          <p className="text-[11px] text-red-700 mt-0.5">Shutter closed / vault quarantine</p>
        </div>
      </div>

      {/* Omnisearch Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by consignment ID, order code, outlet, area, or driver..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-dairy-subtle rounded-xl text-xs text-dairy-dark placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
        />
      </div>

      {/* VIEW MODE 1: KANBAN BOARD VIEW (Stitch Reference) */}
      {viewMode === "board" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 items-start" style={{ minWidth: "1680px" }}>
            {kanbanColumns.map((col) => (
              <div
                key={col.id}
                className="w-72 bg-dairy-surface-low rounded-2xl p-3 flex flex-col max-h-[750px] border border-dairy-subtle shrink-0 shadow-2xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 px-1 border-b border-dairy-subtle">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", col.dotColor)}></span>
                    <span className="font-bold text-xs text-dairy-dark">{col.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-dairy-surface text-muted-foreground text-[10px] font-mono font-bold">
                    {col.items.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 pt-3 overflow-y-auto max-h-[680px] pr-1">
                  {col.items.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs italic">
                      No consignments in this stage
                    </div>
                  ) : (
                    col.items.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedConsignment(c)}
                        className={cn(
                          "bg-white p-3.5 rounded-xl border border-dairy-subtle shadow-xs hover:shadow-md transition-all cursor-pointer group",
                          c.deliveryStatus === "DELIVERY_FAILED" && "border-red-300 bg-red-50/30"
                        )}
                      >
                        {/* Top ID & Slot */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-primary tracking-wide">
                            {c.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-dairy-surface text-dairy-dark">
                            {c.scheduledSlot}
                          </span>
                        </div>

                        {/* Retailer Outlet */}
                        <h4 className="font-bold text-xs text-dairy-dark group-hover:text-primary transition-colors leading-snug">
                          {c.retailerName}
                        </h4>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{c.area}</span> ·{" "}
                          <span className="font-mono text-secondary font-bold">{c.orderCode}</span>
                        </p>

                        {/* Driver & Van Box */}
                        {c.driverName !== "Not Assigned" ? (
                          <div className="mt-2.5 p-2 rounded-lg bg-dairy-surface-low border border-dairy-subtle text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between text-dairy-dark font-semibold">
                              <span>Driver: {c.driverName}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {c.vehicleNumber}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-800 text-[10px] font-medium">
                              <span>{c.cratesCount} Crates</span>
                              <span className="flex items-center gap-1">
                                <ThermometerSnowflake className="h-3 w-3 text-emerald-600" />
                                {c.coldBoxTemp || "3.8°C"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 flex items-center justify-between">
                            <span>Route Van Unassigned</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const ord = orders.find((o) => o.id === c.orderId);
                                if (ord) setAssigningOrder(ord);
                              }}
                              className="font-bold text-primary hover:underline"
                            >
                              Assign Now →
                            </button>
                          </div>
                        )}

                        {/* Failure note if failed */}
                        {c.failureReason && (
                          <div className="mt-2 text-[10px] font-medium text-red-800 bg-red-100/70 px-2 py-1 rounded-lg border border-red-200">
                            {c.failureReason}
                          </div>
                        )}

                        {/* Footer: Items summary & Total */}
                        <div className="mt-2.5 pt-2 border-t border-dairy-subtle flex items-center justify-between text-xs">
                          <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                            {c.itemsSummary}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            ₹{c.orderTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: TABLE VIEW */
        <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-dairy-surface-low text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-dairy-subtle">
                  <th className="py-3 px-6">Consignment ID</th>
                  <th className="py-3 px-4">Order Code</th>
                  <th className="py-3 px-4">Retailer Outlet</th>
                  <th className="py-3 px-4">Route &amp; Van</th>
                  <th className="py-3 px-4">Crates &amp; Temp</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dairy-subtle">
                {filteredConsignments.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedConsignment(c)}
                    className="hover:bg-dairy-surface-low/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-6 font-mono font-bold text-primary group-hover:underline">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-secondary">
                      {c.orderCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-dairy-dark">{c.retailerName}</div>
                      <div className="text-[11px] text-muted-foreground">{c.area}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-dairy-dark">{c.driverName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {c.vehicleNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-dairy-dark">{c.cratesCount} Crates</div>
                      <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                        <ThermometerSnowflake className="h-3 w-3" />
                        {c.coldBoxTemp}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          c.deliveryStatus === "DELIVERED" && "bg-emerald-100 text-emerald-800",
                          c.deliveryStatus === "OUT_FOR_DELIVERY" && "bg-indigo-100 text-indigo-800",
                          c.deliveryStatus === "PICKED_UP" && "bg-indigo-50 text-indigo-900",
                          c.deliveryStatus === "ASSIGNED" && "bg-blue-100 text-blue-800",
                          c.deliveryStatus === "NOT_ASSIGNED" && "bg-zinc-100 text-zinc-700",
                          c.deliveryStatus === "DELIVERY_FAILED" && "bg-red-100 text-red-800"
                        )}
                      >
                        ● {c.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-dairy-dark">
                      ₹{c.orderTotal.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedConsignment(c)}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Delivery Update Drawer */}
      {selectedConsignment && (
        <DeliveryUpdateDrawer
          consignment={selectedConsignment}
          isOpen={!!selectedConsignment}
          onClose={() => setSelectedConsignment(null)}
          onConfirmUpdate={handleConfirmDeliveryUpdate}
        />
      )}

      {/* Assign Route Modal */}
      {assigningOrder && (
        <DeliveryAssignModal
          order={assigningOrder}
          isOpen={!!assigningOrder}
          onClose={() => setAssigningOrder(null)}
          onAssign={handleAssignRoute}
        />
      )}
    </div>
  );
}
