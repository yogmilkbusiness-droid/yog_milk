"use client";

import { useState } from "react";
import { X, Truck, Check, MapPin, User, ShieldCheck } from "lucide-react";
import { Order } from "@/lib/contracts/order";
import { DeliveryRoute } from "@/lib/contracts/delivery";
import { getMockDeliveryRoutes } from "@/lib/mock/admin-orders-repo";

interface DeliveryAssignModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (
    orderId: string,
    routeId: string,
    driverName: string,
    vehicleNumber: string
  ) => void;
}

export function DeliveryAssignModal({
  order,
  isOpen,
  onClose,
  onAssign,
}: DeliveryAssignModalProps) {
  const routes = getMockDeliveryRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || "");

  if (!isOpen || !order) return null;

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoute) return;
    onAssign(order.id, currentRoute.id, currentRoute.driverName, currentRoute.vehicleNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-primary">Assign Route &amp; Van</h3>
              <p className="text-xs text-muted-foreground">
                Consignment for <strong className="text-dairy-dark">{order.orderCode}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleAssign} className="p-6 space-y-4 text-xs">
          {/* Outlet Summary */}
          <div className="p-3 rounded-xl bg-dairy-surface-low border border-dairy-subtle text-xs">
            <p className="font-bold text-dairy-dark">{order.retailerBusinessName}</p>
            <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {order.deliveryAddress}
            </p>
            <div className="mt-2 text-[11px] font-mono text-secondary font-bold">
              Total Crate Volume: {order.crateCount || 3} Insulated Crates (₹{order.totalPayable.toFixed(2)})
            </div>
          </div>

          {/* Route Options List */}
          <div>
            <label className="block font-bold text-dairy-dark mb-2">Select Active Cold-Route</label>
            <div className="space-y-2">
              {routes.map((route) => {
                const isSelected = selectedRouteId === route.id;
                return (
                  <label
                    key={route.id}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-2xs font-semibold"
                        : "border-dairy-subtle hover:bg-dairy-surface-low text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="route_selection"
                        value={route.id}
                        checked={isSelected}
                        onChange={() => setSelectedRouteId(route.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-bold text-dairy-dark text-xs">{route.routeName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Driver: {route.driverName} · Van: {route.vehicleNumber} ({route.vanTemperature})
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-dairy-surface text-dairy-dark">
                      {route.completedDrops}/{route.totalDrops} Drops
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Consignment temperature will be calibrated at 3.8°C upon hub departure.</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-dairy-subtle flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Confirm Route Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

