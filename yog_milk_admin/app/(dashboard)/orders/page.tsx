"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Package,
  Layers,
  ArrowUpDown,
  X,
  PlusCircle,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Order, OrderStatus, DeliveryStatus, PaymentStatus } from "@/lib/contracts/order";
import {
  getMockOrders,
  updateMockOrderStatus,
  updateMockDeliveryStatus,
  assignMockOrderRoute,
} from "@/lib/mock/admin-orders-repo";
import { OrderDetailStatusDialog } from "@/components/features/orders/OrderDetailStatusDialog";
import { DeliveryAssignModal } from "@/components/features/deliveries/DeliveryAssignModal";
import { formatCurrency, cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected Order for Modal Dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getMockOrders());
    setIsClientLoaded(true);
  }, []);

  const refreshOrders = () => {
    const updated = getMockOrders();
    setOrders(updated);
    if (selectedOrder) {
      const refreshedSelected = updated.find((o) => o.id === selectedOrder.id);
      if (refreshedSelected) setSelectedOrder(refreshedSelected);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Status Tab Counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      placed: 0,
      confirmed: 0,
      processing: 0,
      ready: 0,
      out: 0,
      delivered: 0,
      cancelled: 0,
      failed: 0,
    };
    orders.forEach((o) => {
      if (o.orderStatus === "PLACED") counts.placed++;
      if (o.orderStatus === "CONFIRMED") counts.confirmed++;
      if (o.orderStatus === "PROCESSING") counts.processing++;
      if (o.orderStatus === "READY_FOR_DELIVERY") counts.ready++;
      if (o.orderStatus === "OUT_FOR_DELIVERY") counts.out++;
      if (o.orderStatus === "DELIVERED") counts.delivered++;
      if (o.orderStatus === "CANCELLED") counts.cancelled++;
      if (o.orderStatus === "DELIVERY_FAILED") counts.failed++;
    });
    return counts;
  }, [orders]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = o.orderCode.toLowerCase().includes(q);
        const matchRetailer = o.retailerBusinessName.toLowerCase().includes(q);
        const matchOwner = o.retailerOwnerName?.toLowerCase().includes(q);
        const matchPhone = o.retailerPhone.toLowerCase().includes(q);
        const matchArea = o.retailerArea.toLowerCase().includes(q);
        const matchItem = o.items.some((i) => i.productName.toLowerCase().includes(q));
        if (!matchCode && !matchRetailer && !matchOwner && !matchPhone && !matchArea && !matchItem) {
          return false;
        }
      }

      // Status Tab
      if (statusTab === "placed" && o.orderStatus !== "PLACED") return false;
      if (statusTab === "confirmed" && o.orderStatus !== "CONFIRMED") return false;
      if (statusTab === "processing" && o.orderStatus !== "PROCESSING") return false;
      if (statusTab === "ready" && o.orderStatus !== "READY_FOR_DELIVERY") return false;
      if (statusTab === "out" && o.orderStatus !== "OUT_FOR_DELIVERY") return false;
      if (statusTab === "delivered" && o.orderStatus !== "DELIVERED") return false;
      if (statusTab === "cancelled" && o.orderStatus !== "CANCELLED") return false;
      if (statusTab === "failed" && o.orderStatus !== "DELIVERY_FAILED") return false;

      // Payment Filter
      if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;

      // Delivery Filter
      if (deliveryFilter !== "all" && o.deliveryStatus !== deliveryFilter) return false;

      // Date Filter
      if (dateFilter === "today" && o.dateKey !== "today") return false;
      if (dateFilter === "yesterday" && o.dateKey !== "yesterday") return false;

      return true;
    });
  }, [orders, searchQuery, statusTab, paymentFilter, deliveryFilter, dateFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusTab, paymentFilter, deliveryFilter, dateFilter]);

  // Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, reason?: string) => {
    const updated = updateMockOrderStatus(
      orderId,
      newStatus,
      "Vikram Mehta (Operations Lead)",
      reason
    );
    if (updated) {
      refreshOrders();
      showToast(`Order ${updated.orderCode} transitioned to ${newStatus}`);
    }
  };

  const handleUpdateDeliveryStatus = (
    orderId: string,
    newDeliveryStatus: DeliveryStatus,
    reason?: string
  ) => {
    const updated = updateMockDeliveryStatus(
      orderId,
      newDeliveryStatus,
      "Vikram Mehta (Operations Lead)",
      { failureReason: reason }
    );
    if (updated) {
      refreshOrders();
      showToast(`Delivery for ${updated.orderCode} updated to ${newDeliveryStatus}`);
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
      refreshOrders();
      showToast(`Order ${updated.orderCode} assigned to ${driverName} (${vehicleNumber})`);
    }
  };

  const exportCsv = () => {
    showToast("Exported orders report: yog_milk_orders_manifest.csv");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusTab("all");
    setPaymentFilter("all");
    setDeliveryFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusTab !== "all" ||
    paymentFilter !== "all" ||
    deliveryFilter !== "all" ||
    dateFilter !== "all";

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
            <span className="text-primary font-semibold">Orders Management</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Live Orders Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor daily B2B dairy fulfillment, payments verification, and dispatch delivery status across Western Maharashtra routes.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dairy-subtle bg-white hover:bg-dairy-surface-low text-dairy-dark text-xs font-semibold shadow-2xs transition-all"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Export Orders (CSV)</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs (Stitch Reference) */}
      <div className="flex items-center justify-between border-b border-dairy-subtle pb-2 overflow-x-auto gap-3">
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-1">
          {[
            { id: "all", label: "All Orders", count: tabCounts.all },
            { id: "placed", label: "Placed", count: tabCounts.placed },
            { id: "confirmed", label: "Confirmed", count: tabCounts.confirmed },
            { id: "processing", label: "Processing", count: tabCounts.processing },
            { id: "ready", label: "Ready for Delivery", count: tabCounts.ready },
            { id: "out", label: "Out for Delivery", count: tabCounts.out },
            { id: "delivered", label: "Delivered", count: tabCounts.delivered },
            { id: "cancelled", label: "Cancelled", count: tabCounts.cancelled },
            { id: "failed", label: "Exceptions", count: tabCounts.failed },
          ].map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                  isActive
                    ? "bg-primary text-white shadow-2xs"
                    : "text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                    isActive ? "bg-white/20 text-white" : "bg-dairy-surface text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Filter Controls Bar (Stitch Reference) */}
      <div className="bg-white p-3.5 rounded-2xl border border-dairy-subtle shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center text-xs">
          {/* Omnisearch (4 cols) */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code (YM-2026-...), shop name, phone, area, item..."
              className="w-full pl-9 pr-3 py-2 bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs text-dairy-dark placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Date Filter Picker (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs font-semibold text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">Date: All Runs</option>
              <option value="today">Today&apos;s Dawn Run</option>
              <option value="yesterday">Yesterday&apos;s Run</option>
            </select>
          </div>

          {/* Payment Status Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs font-semibold text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">Payment: All Statuses</option>
              <option value="PAID">PAID (Settled)</option>
              <option value="PENDING">PENDING (COD / Webhook)</option>
              <option value="PROCESSING">PROCESSING (Online)</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>

          {/* Delivery Status Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs font-semibold text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">Delivery: All Consignments</option>
              <option value="NOT_ASSIGNED">Not Assigned / Needs Prep</option>
              <option value="ASSIGNED">Assigned to Route Van</option>
              <option value="PICKED_UP">Van Loaded / Picked Up</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered (Completed)</option>
              <option value="DELIVERY_FAILED">Delivery Failed / Incident</option>
            </select>
          </div>
        </div>

        {/* Applied Filters Strip & Clear All */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-dairy-subtle/60 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground font-semibold">Active filters:</span>
              {statusTab !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-dairy-surface border border-dairy-subtle text-primary text-[11px] font-bold">
                  Status: {statusTab.toUpperCase()}
                  <button onClick={() => setStatusTab("all")} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {paymentFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-dairy-surface border border-dairy-subtle text-primary text-[11px] font-bold">
                  Payment: {paymentFilter}
                  <button onClick={() => setPaymentFilter("all")} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {deliveryFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-dairy-surface border border-dairy-subtle text-primary text-[11px] font-bold">
                  Delivery: {deliveryFilter}
                  <button onClick={() => setDeliveryFilter("all")} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-dairy-surface border border-dairy-subtle text-primary text-[11px] font-bold">
                  Date: {dateFilter}
                  <button onClick={() => setDateFilter("all")} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-primary font-bold hover:underline text-[11px]"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Orders Table Card */}
      <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dairy-surface-low text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-dairy-subtle">
                <th className="py-3 px-6">Order Code &amp; Time</th>
                <th className="py-3 px-4">Retailer Outlet</th>
                <th className="py-3 px-4">Allocated Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery Dispatch</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dairy-subtle">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="font-semibold text-dairy-dark text-sm">No orders found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try clearing search queries or expanding status filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const itemsSummary = order.items
                    .map((it) => `${it.productName} (${it.quantity})`)
                    .join(", ");
                  const totalUnits = order.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={cn(
                        "hover:bg-dairy-surface-low/60 transition-colors cursor-pointer group",
                        order.orderStatus === "DELIVERY_FAILED" && "bg-red-50/20",
                        order.orderStatus === "CANCELLED" && "bg-zinc-50 opacity-75"
                      )}
                    >
                      {/* Order Code & Time */}
                      <td className="py-3.5 px-6">
                        <div className="font-mono font-bold text-primary group-hover:underline">
                          {order.orderCode}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {order.orderDate}
                        </div>
                        {order.consignmentId && (
                          <div className="text-[9px] font-mono text-secondary font-bold">
                            {order.consignmentId}
                          </div>
                        )}
                      </td>

                      {/* Retailer Outlet */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-dairy-dark">{order.retailerBusinessName}</div>
                        <div className="text-[11px] text-muted-foreground">{order.retailerArea}</div>
                      </td>

                      {/* Allocated Items */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate font-medium text-dairy-dark text-[11px]">
                          {itemsSummary}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {totalUnits} Units · {order.crateCount || 3} Crates
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-dairy-dark">
                          ₹{order.totalPayable.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-sans">
                          {order.paymentMethod === "COD" ? "COD" : "Online"}
                        </div>
                      </td>

                      {/* Order Status Triad Chip 1 */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                            order.orderStatus === "DELIVERED" && "bg-emerald-100 text-emerald-800",
                            order.orderStatus === "OUT_FOR_DELIVERY" && "bg-indigo-100 text-indigo-800",
                            order.orderStatus === "READY_FOR_DELIVERY" && "bg-amber-100 text-amber-800",
                            order.orderStatus === "PROCESSING" && "bg-blue-100 text-blue-800",
                            order.orderStatus === "CONFIRMED" && "bg-blue-50 text-blue-900",
                            order.orderStatus === "PLACED" && "bg-zinc-100 text-zinc-700",
                            order.orderStatus === "CANCELLED" && "bg-red-100 text-red-800",
                            order.orderStatus === "DELIVERY_FAILED" && "bg-red-100 text-red-800"
                          )}
                        >
                          ● {order.orderStatus}
                        </span>
                      </td>

                      {/* Payment Status Triad Chip 2 */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          )}
                        >
                          {order.paymentStatus === "PAID" ? "✓ Paid" : "⏳ Pending"}
                        </span>
                      </td>

                      {/* Delivery Status Triad Chip 3 */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                              order.deliveryStatus === "DELIVERED" && "bg-emerald-50 text-emerald-800",
                              order.deliveryStatus === "OUT_FOR_DELIVERY" && "bg-indigo-50 text-indigo-900",
                              order.deliveryStatus === "PICKED_UP" && "bg-indigo-50 text-indigo-900",
                              order.deliveryStatus === "ASSIGNED" && "bg-blue-50 text-blue-900",
                              order.deliveryStatus === "NOT_ASSIGNED" && "bg-zinc-100 text-zinc-700",
                              order.deliveryStatus === "DELIVERY_FAILED" && "bg-red-100 text-red-800"
                            )}
                          >
                            <Truck className="h-3 w-3" />
                            <span>{order.deliveryStatus}</span>
                          </span>
                          {order.deliveryDriverName && (
                            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                              {order.deliveryDriverName}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {order.deliveryStatus === "NOT_ASSIGNED" && (
                            <button
                              onClick={() => setAssigningOrder(order)}
                              className="px-2 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-[10px] transition-colors"
                              title="Assign Delivery Route"
                            >
                              Assign
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            title="View Full Detail & Status"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-4 border-t border-dairy-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-dairy-dark">{paginatedOrders.length}</strong> of{" "}
            <strong className="text-dairy-dark">{filteredOrders.length}</strong> daily consignment orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
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
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail & Status Modal */}
      {selectedOrder && (
        <OrderDetailStatusDialog
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
          onOpenAssignRoute={(ord) => setAssigningOrder(ord)}
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
