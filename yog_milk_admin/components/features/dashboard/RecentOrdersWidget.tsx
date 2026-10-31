"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Eye,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_ADMIN_RECENT_ORDERS } from "@/lib/mock/admin-orders";
import { Order, OrderStatus } from "@/lib/contracts/order";
import { formatCurrency, cn } from "@/lib/utils";

type FilterTab = "ALL" | "AWAITING" | "PROCESSING" | "OUT_FOR_DELIVERY" | "DELIVERED";

export function RecentOrdersWidget() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  const filteredOrders = MOCK_ADMIN_RECENT_ORDERS.filter((order) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "AWAITING") return order.orderStatus === "PLACED";
    if (activeFilter === "PROCESSING") return order.orderStatus === "PROCESSING" || order.orderStatus === "READY_FOR_DELIVERY";
    if (activeFilter === "OUT_FOR_DELIVERY") return order.orderStatus === "OUT_FOR_DELIVERY";
    if (activeFilter === "DELIVERED") return order.orderStatus === "DELIVERED";
    return true;
  });

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl border border-dairy-subtle shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-dairy-subtle">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-primary">
              Live Order Queue
            </h2>
            <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full">
              Decoupled Triad
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time bulk orders with independent order, payment, and delivery lifecycles
          </p>
        </div>

        <Link
          href="/orders"
          className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
        >
          <span>View All Orders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs">
        <span className="text-muted-foreground font-semibold flex items-center gap-1 mr-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {(
          [
            { key: "ALL", label: "All Orders" },
            { key: "AWAITING", label: "Awaiting Action" },
            { key: "PROCESSING", label: "Processing" },
            { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
            { key: "DELIVERED", label: "Delivered" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0",
              activeFilter === tab.key
                ? "bg-primary text-white shadow-xs"
                : "bg-dairy-surface-low text-muted-foreground hover:text-dairy-dark border border-dairy-subtle"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-dairy-subtle text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <th className="py-2.5 px-3">Order Code</th>
              <th className="py-2.5 px-3">Retailer &amp; Area</th>
              <th className="py-2.5 px-3">Order Status</th>
              <th className="py-2.5 px-3">Payment Status</th>
              <th className="py-2.5 px-3">Delivery Status</th>
              <th className="py-2.5 px-3 text-right">Value (Non-GST)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dairy-subtle/70">
            {filteredOrders.map((order) => {
              // Order status badge variant
              let orderVariant: "placed" | "confirmed" | "processing" | "ready" | "outForDelivery" | "delivered" | "cancelled" = "placed";
              if (order.orderStatus === "CONFIRMED") orderVariant = "confirmed";
              else if (order.orderStatus === "PROCESSING") orderVariant = "processing";
              else if (order.orderStatus === "READY_FOR_DELIVERY") orderVariant = "ready";
              else if (order.orderStatus === "OUT_FOR_DELIVERY") orderVariant = "outForDelivery";
              else if (order.orderStatus === "DELIVERED") orderVariant = "delivered";
              else if (order.orderStatus === "CANCELLED") orderVariant = "cancelled";

              // Payment badge
              const isPaid = order.paymentStatus === "PAID";
              const isProcessing = order.paymentStatus === "PROCESSING";

              // Delivery badge
              let deliveryVariant: "outline" | "confirmed" | "ready" | "outForDelivery" | "delivered" = "outline";
              if (order.deliveryStatus === "ASSIGNED") deliveryVariant = "confirmed";
              else if (order.deliveryStatus === "PICKED_UP") deliveryVariant = "ready";
              else if (order.deliveryStatus === "OUT_FOR_DELIVERY") deliveryVariant = "outForDelivery";
              else if (order.deliveryStatus === "DELIVERED") deliveryVariant = "delivered";

              return (
                <tr
                  key={order.id}
                  className="hover:bg-dairy-surface-low/70 transition-colors"
                >
                  {/* Order Code */}
                  <td className="py-3 px-3 font-mono font-bold text-primary">
                    <Link
                      href={`/orders?id=${order.id}`}
                      className="hover:text-secondary hover:underline"
                    >
                      {order.orderCode}
                    </Link>
                    <div className="text-[10px] text-muted-foreground font-normal">
                      {order.orderDate}
                    </div>
                  </td>

                  {/* Retailer */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-dairy-dark">
                      {order.retailerBusinessName}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {order.retailerArea}
                    </div>
                  </td>

                  {/* Order Status */}
                  <td className="py-3 px-3">
                    <Badge variant={orderVariant}>
                      {order.orderStatus}
                    </Badge>
                  </td>

                  {/* Payment Status (Rule 4.3 & 4.4) */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <Badge
                        variant={
                          isPaid
                            ? "paid"
                            : isProcessing
                            ? "processing"
                            : "pending"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                      <span className="text-[9px] font-mono text-muted-foreground">
                        via {order.paymentMethod}
                      </span>
                    </div>
                  </td>

                  {/* Delivery Status */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <Badge variant={deliveryVariant}>
                        {order.deliveryStatus}
                      </Badge>
                      {order.deliveryDriverName && (
                        <span className="text-[9px] text-muted-foreground">
                          {order.deliveryDriverName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-dairy-dark">
                    {formatCurrency(order.totalPayable)}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    <Link
                      href={`/orders?id=${order.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dairy-surface-low hover:bg-primary hover:text-white border border-dairy-subtle text-[11px] font-semibold transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Review</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

