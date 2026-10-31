"use client";

import { useState } from "react";
import {
  X,
  Package,
  Truck,
  Wallet,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  MapPin,
  Phone,
  ThermometerSnowflake,
  ArrowRight,
  Printer,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";
import { Order, OrderStatus, DeliveryStatus } from "@/lib/contracts/order";
import { formatCurrency, cn } from "@/lib/utils";

interface OrderDetailStatusDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, reason?: string) => void;
  onUpdateDeliveryStatus: (orderId: string, newDeliveryStatus: DeliveryStatus, reason?: string) => void;
  onOpenAssignRoute?: (order: Order) => void;
}

export function OrderDetailStatusDialog({
  order,
  isOpen,
  onClose,
  onUpdateOrderStatus,
  onUpdateDeliveryStatus,
  onOpenAssignRoute,
}: OrderDetailStatusDialogProps) {
  // Sensitive action confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    type: "CANCEL" | "FAIL_DELIVERY" | "CONFIRM_DELIVERY";
    title: string;
    description: string;
    actionLabel: string;
    actionColor: string;
  } | null>(null);
  const [reasonInput, setReasonInput] = useState("");

  if (!isOpen || !order) return null;

  // Determine next valid order transitions
  const getNextOrderTransitions = (status: OrderStatus) => {
    switch (status) {
      case "PLACED":
        return [
          {
            label: "Confirm Order",
            status: "CONFIRMED" as OrderStatus,
            className: "bg-primary text-white hover:bg-primary-container",
          },
          {
            label: "Cancel Order",
            status: "CANCELLED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      case "CONFIRMED":
        return [
          {
            label: "Move to Bottling / Processing",
            status: "PROCESSING" as OrderStatus,
            className: "bg-primary text-white hover:bg-primary-container",
          },
          {
            label: "Cancel Order",
            status: "CANCELLED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      case "PROCESSING":
        return [
          {
            label: "Mark Ready for Delivery",
            status: "READY_FOR_DELIVERY" as OrderStatus,
            className: "bg-emerald-700 text-white hover:bg-emerald-800",
          },
          {
            label: "Cancel Order",
            status: "CANCELLED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      case "READY_FOR_DELIVERY":
        return [
          {
            label: "Dispatch Van (Out for Delivery)",
            status: "OUT_FOR_DELIVERY" as OrderStatus,
            className: "bg-indigo-700 text-white hover:bg-indigo-800",
          },
          {
            label: "Cancel Order",
            status: "CANCELLED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      case "OUT_FOR_DELIVERY":
        return [
          {
            label: "Mark Delivered (Drop Complete)",
            status: "DELIVERED" as OrderStatus,
            isSensitive: true,
            className: "bg-emerald-700 text-white hover:bg-emerald-800",
          },
          {
            label: "Delivery Exception / Failed",
            status: "DELIVERY_FAILED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      case "DELIVERY_FAILED":
        return [
          {
            label: "Retry Dispatch (Re-queue)",
            status: "READY_FOR_DELIVERY" as OrderStatus,
            className: "bg-primary text-white hover:bg-primary-container",
          },
          {
            label: "Cancel & Restock Inventory",
            status: "CANCELLED" as OrderStatus,
            isSensitive: true,
            className: "border border-red-200 text-red-600 hover:bg-red-50",
          },
        ];
      default:
        return [];
    }
  };

  const handleTransitionClick = (
    nextStatus: OrderStatus,
    isSensitive?: boolean
  ) => {
    if (nextStatus === "CANCELLED") {
      setConfirmModal({
        type: "CANCEL",
        title: `Cancel Order ${order.orderCode}?`,
        description:
          "This will halt dawn delivery dispatch and notify the retailer. Please record a mandatory reason for the audit trail.",
        actionLabel: "Confirm Cancellation",
        actionColor: "bg-red-600 hover:bg-red-700 text-white",
      });
      setReasonInput("Cancelled before dawn dispatch upon request.");
      return;
    }

    if (nextStatus === "DELIVERY_FAILED") {
      setConfirmModal({
        type: "FAIL_DELIVERY",
        title: `Log Delivery Exception for ${order.orderCode}?`,
        description:
          "Record that the delivery attempt was unsuccessful at the retailer doorstep. Crate stock must be routed back to the central chiller.",
        actionLabel: "Log Exception",
        actionColor: "bg-amber-600 hover:bg-amber-700 text-white",
      });
      setReasonInput("Customer outlet closed / shutter down at dawn.");
      return;
    }

    if (nextStatus === "DELIVERED") {
      setConfirmModal({
        type: "CONFIRM_DELIVERY",
        title: `Confirm Handover & Delivery for ${order.orderCode}?`,
        description:
          "Confirm that all milk and dairy crates were inspected and received at the retailer doorstep. Corresponding retailer profile records will be updated.",
        actionLabel: "Confirm Delivery",
        actionColor: "bg-emerald-700 hover:bg-emerald-800 text-white",
      });
      setReasonInput("Delivered at doorstep. Returnable crates received.");
      return;
    }

    // Direct progression for normal transitions
    onUpdateOrderStatus(order.id, nextStatus);
  };

  const handleExecuteConfirmedAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === "CANCEL") {
      onUpdateOrderStatus(order.id, "CANCELLED", reasonInput);
    } else if (confirmModal.type === "FAIL_DELIVERY") {
      onUpdateDeliveryStatus(order.id, "DELIVERY_FAILED", reasonInput);
    } else if (confirmModal.type === "CONFIRM_DELIVERY") {
      onUpdateOrderStatus(order.id, "DELIVERED", reasonInput);
    }

    setConfirmModal(null);
    setReasonInput("");
  };

  const orderTransitions = getNextOrderTransitions(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-dairy-subtle shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header matching Stitch Design */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                Order Code: {order.orderCode}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground font-mono">
                {order.invoiceNumber || "INV-2026-NON-GST"}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{order.orderDate}</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary">
              Order Detail &amp; Status Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
              title="Print Order Manifest"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
              title="Close Dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Triad Status Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD A: ORDER STATUS */}
            <div className="bg-dairy-surface-low/50 rounded-2xl p-4 border border-dairy-subtle flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Order Lifecycle
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold",
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
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-snug">
                  {order.orderStatus === "DELIVERED"
                    ? `Order completed and signed off at ${order.deliveredAt || "dawn"}.`
                    : order.orderStatus === "CANCELLED"
                    ? "Order formally cancelled. Inventory unreserved."
                    : order.orderStatus === "DELIVERY_FAILED"
                    ? "Doorstep drop unsuccessful. Cold-chain exception logged."
                    : "Active in morning operations queue."}
                </p>
              </div>

              {/* Next Valid Transitions */}
              <div className="pt-2 border-t border-dairy-subtle/70">
                <label className="text-[10px] text-muted-foreground block mb-1.5 font-bold uppercase">
                  Next Valid Transitions
                </label>
                {orderTransitions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Terminal state reached.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {orderTransitions.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTransitionClick(t.status, t.isSensitive)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1",
                          t.className
                        )}
                      >
                        <span>{t.label}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CARD B: PAYMENT STATUS */}
            <div className="bg-dairy-surface-low/50 rounded-2xl p-4 border border-dairy-subtle flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Payment Status
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold",
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    ● {order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-sm mb-1">
                  <span className="text-muted-foreground text-xs font-sans">Settlement:</span>
                  <strong className="text-dairy-dark">
                    {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Online (Razorpay)"}
                  </strong>
                </div>
                <div className="flex items-center justify-between font-mono text-sm mb-3">
                  <span className="text-muted-foreground text-xs font-sans">Net Total:</span>
                  <strong className="text-primary font-bold">₹{order.totalPayable.toFixed(2)}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-dairy-subtle/70 text-[11px] text-muted-foreground">
                {order.paymentStatus === "PAID" ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Reconciled in bank / cash ledger
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Rule 4.4: Outstanding balance pending collection
                  </span>
                )}
              </div>
            </div>

            {/* CARD C: DELIVERY STATUS */}
            <div className="bg-dairy-surface-low/50 rounded-2xl p-4 border border-dairy-subtle flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Delivery Dispatch
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold",
                      order.deliveryStatus === "DELIVERED" && "bg-emerald-100 text-emerald-800",
                      order.deliveryStatus === "OUT_FOR_DELIVERY" && "bg-indigo-100 text-indigo-800",
                      order.deliveryStatus === "PICKED_UP" && "bg-indigo-50 text-indigo-900",
                      order.deliveryStatus === "ASSIGNED" && "bg-blue-100 text-blue-800",
                      order.deliveryStatus === "NOT_ASSIGNED" && "bg-zinc-100 text-zinc-700",
                      order.deliveryStatus === "DELIVERY_FAILED" && "bg-red-100 text-red-800"
                    )}
                  >
                    ● {order.deliveryStatus}
                  </span>
                </div>
                <div className="text-xs mb-1">
                  <span className="font-semibold text-dairy-dark">
                    {order.deliveryRouteName || "Route not yet assigned"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                  <span>Van: {order.deliveryVehicleNumber || "Pending"}</span>
                  <span>Driver: {order.deliveryDriverName || "Unassigned"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dairy-subtle/70 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <ThermometerSnowflake className="h-3.5 w-3.5" />
                  {order.coldBoxTemp || "3.8°C"}
                </span>
                {order.deliveryStatus === "NOT_ASSIGNED" && onOpenAssignRoute && (
                  <button
                    onClick={() => onOpenAssignRoute(order)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>Assign Route Van</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 2-Column Main Content (65% / 35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Manifest & Timeline (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Order Manifest (Item Table) */}
              <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
                <div className="p-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-base font-bold text-primary">
                      Artisan Order Manifest
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Unhomogenized Vedic direct farm harvests allocated for Dawn Run
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-dairy-surface text-dairy-dark">
                    {order.items.length} Line Items
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-dairy-surface-low/70 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-dairy-subtle">
                        <th className="py-2.5 px-4">Product Name &amp; Specs</th>
                        <th className="py-2.5 px-3">Pack Size</th>
                        <th className="py-2.5 px-3">Locked Price</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-4 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dairy-subtle">
                      {order.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-dairy-surface-low/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-dairy-dark">{it.productName}</div>
                            {it.specs && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {it.specs}
                              </div>
                            )}
                            {it.batchCode && (
                              <div className="text-[9px] font-mono text-secondary font-bold">
                                Batch: {it.batchCode}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-dairy-surface text-dairy-dark font-medium text-[11px]">
                              {it.packSize}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <div className="font-semibold text-dairy-dark">
                              ₹{it.unitPrice.toFixed(2)}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-dairy-dark">{it.quantity} units</span>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              ({it.crateCount} crates)
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-dairy-dark">
                            ₹{it.lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ledger Calculation Footer */}
                <div className="p-4 bg-dairy-surface-low/30 border-t border-dairy-subtle flex flex-col sm:flex-row justify-between gap-4">
                  <div className="max-w-xs space-y-1 text-[11px] text-muted-foreground">
                    <p className="font-bold text-dairy-dark flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Locked Snapshot Integrity
                    </p>
                    <p>
                      Prices locked at order creation time. Raw unbranded agricultural dairy
                      exempt from GST.
                    </p>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="font-mono font-medium text-dairy-dark">
                        ₹{order.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee:</span>
                      <span className="font-mono text-emerald-700 font-semibold">₹0.00 (Free Dawn Run)</span>
                    </div>
                    <div className="pt-2 border-t border-dairy-subtle flex justify-between items-baseline font-bold text-sm text-primary">
                      <span>Total Net Payable:</span>
                      <span className="font-mono text-base text-primary">
                        ₹{order.totalPayable.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-right text-muted-foreground italic">
                      Commercial Non-GST Memo
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Timeline & Audit Trail */}
              <div className="bg-white rounded-2xl border border-dairy-subtle p-5 shadow-xs">
                <h3 className="font-serif text-base font-bold text-primary mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Order Audit Trail &amp; Status Timeline</span>
                </h3>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-dairy-subtle">
                  {(order.statusHistory || []).map((h, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary -translate-x-1/2" />
                      <div className="flex-1 bg-dairy-surface-low/40 rounded-xl p-3 border border-dairy-subtle text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-dairy-dark">
                            {h.fromStatus ? `${h.fromStatus} → ${h.toStatus}` : `Created as ${h.toStatus}`}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {h.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Logged by: <strong className="text-dairy-dark">{h.adminName}</strong>
                        </p>
                        {h.reason && (
                          <div className="mt-1 text-[11px] text-red-700 bg-red-50 p-1.5 rounded-lg border border-red-200">
                            Reason: {h.reason}
                          </div>
                        )}
                        {h.notes && !h.reason && (
                          <p className="mt-1 text-[11px] text-muted-foreground italic">
                            &quot;{h.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Retailer & Logistics Brief (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Retailer Card */}
              <div className="bg-white rounded-2xl border border-dairy-subtle p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-dairy-subtle">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-xs text-dairy-dark">Retailer Information</h3>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-primary">{order.retailerBusinessName}</h4>
                  <p className="text-xs text-muted-foreground">Owner: {order.retailerOwnerName || "Proprietor"}</p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-dairy-dark">{order.retailerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                  {order.retailerFssai && (
                    <div className="text-[10px] font-mono text-muted-foreground pt-1">
                      {order.retailerFssai}
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Logistics Brief */}
              <div className="bg-white rounded-2xl border border-dairy-subtle p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-dairy-subtle">
                  <Truck className="h-4 w-4 text-secondary" />
                  <h3 className="font-bold text-xs text-dairy-dark">Dispatch Logistics</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consignment:</span>
                    <span className="font-mono font-bold text-secondary">
                      {order.consignmentId || "YMD-2026-PENDING"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Window:</span>
                    <span className="font-medium text-dairy-dark">{order.scheduledSlot || "Dawn 05:30 – 07:00 AM"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insulated Crate Volume:</span>
                    <span className="font-bold text-dairy-dark">{order.crateCount || 3} Crates</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chiller Van Telemetry:</span>
                    <span className="text-emerald-700 font-bold">{order.coldBoxTemp || "3.8°C Nominal"}</span>
                  </div>
                </div>

                {order.deliveryFailureReason && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                    <p className="font-bold mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Delivery Exception Logged
                    </p>
                    <p className="text-[11px]">{order.deliveryFailureReason}</p>
                    {order.deliveryFollowUpAction && (
                      <p className="text-[10px] mt-1 font-semibold text-red-900">
                        Follow-up: {order.deliveryFollowUpAction}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-dairy-surface-low rounded-2xl border border-dairy-subtle p-3.5 text-xs">
                  <p className="font-bold text-dairy-dark mb-1 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-primary" />
                    Special Drop Instructions
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-dairy-surface-low border-t border-dairy-subtle flex items-center justify-between shrink-0">
          <div className="text-[11px] text-muted-foreground">
            Yog Milk Master Admin · Session User: <strong>Vikram Mehta (Operations Lead)</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-dairy-subtle text-dairy-dark text-xs font-semibold hover:bg-dairy-surface transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Sensitive Confirmation Sub-Dialog */}
      {confirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-dairy-subtle shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-dairy-dark">{confirmModal.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Reason / Action Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Enter explanation for audit trail..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-xs text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-dairy-subtle">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-dairy-subtle text-xs font-semibold text-dairy-dark hover:bg-dairy-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reasonInput.trim()}
                onClick={handleExecuteConfirmedAction}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50",
                  confirmModal.actionColor
                )}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
