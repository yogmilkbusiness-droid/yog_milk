"use client";

import { useState, useEffect } from "react";
import {
  X,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Store,
  ThermometerSnowflake,
  ShieldAlert,
  Save,
} from "lucide-react";
import { DeliveryConsignment } from "@/lib/contracts/delivery";
import { DeliveryStatus } from "@/lib/contracts/order";
import { cn } from "@/lib/utils";

interface DeliveryUpdateDrawerProps {
  consignment: DeliveryConsignment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpdate: (
    consignmentId: string,
    newStatus: DeliveryStatus,
    payload: {
      failureReason?: string;
      followUpAction?: string;
      notes?: string;
    }
  ) => void;
}

export function DeliveryUpdateDrawer({
  consignment,
  isOpen,
  onClose,
  onConfirmUpdate,
}: DeliveryUpdateDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>("DELIVERED");
  const [failureReason, setFailureReason] = useState(
    "Customer outlet closed / shutter down at dawn"
  );
  const [followUpAction, setFollowUpAction] = useState(
    "Return crates to Central Chiller B (Zero spoilage)"
  );
  const [dispatchNotes, setDispatchNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (consignment) {
      if (consignment.deliveryStatus === "DELIVERY_FAILED") {
        setSelectedStatus("DELIVERY_FAILED");
        setFailureReason(
          consignment.failureReason || "Customer outlet closed / shutter down at dawn"
        );
        setFollowUpAction(
          consignment.followUpAction ||
            "Return crates to Central Chiller B (Zero spoilage)"
        );
        setDispatchNotes(consignment.dispatchNotes || "");
      } else if (consignment.deliveryStatus === "DELIVERED") {
        setSelectedStatus("DELIVERED");
        setDispatchNotes("Delivered at doorstep. Empties returned.");
      } else {
        setSelectedStatus("DELIVERED");
        setDispatchNotes(
          `Van in transit. Driver ${consignment.driverName} on route.`
        );
      }
    }
  }, [consignment]);

  if (!isOpen || !consignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onConfirmUpdate(consignment.orderId, selectedStatus, {
      failureReason: selectedStatus === "DELIVERY_FAILED" ? failureReason : undefined,
      followUpAction: selectedStatus === "DELIVERY_FAILED" ? followUpAction : undefined,
      notes: dispatchNotes,
    });
    setIsSubmitting(false);
    onClose();
  };

  const isFailed = selectedStatus === "DELIVERY_FAILED";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-primary/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-dairy-subtle shadow-2xl flex flex-col justify-between shrink-0">
          {/* Drawer Header matching Stitch Reference */}
          <div className="p-6 border-b border-dairy-subtle bg-dairy-surface-low/50 shrink-0">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5",
                  isFailed
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                )}
              >
                {isFailed ? (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Cold-Chain Incident</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-3.5 w-3.5" />
                    <span>Live Consignment Dispatch</span>
                  </>
                )}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
                title="Close Drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="font-serif text-xl font-bold text-primary mt-3">
              Update Delivery Status
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consignment: <strong className="text-dairy-dark font-mono">{consignment.id}</strong> ·
              Order: <strong className="text-secondary font-mono">{consignment.orderCode}</strong>
            </p>

            {/* Customer Brief Card */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border border-dairy-subtle/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-primary truncate">
                  {consignment.retailerName}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">
                  {consignment.area} · ₹{consignment.orderTotal.toFixed(2)} Value
                </p>
              </div>
            </div>
          </div>

          {/* Form Scrollable Body */}
          <form
            id="delivery-update-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6 text-xs"
          >
            {/* Status Radio Selector */}
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-2">
                Consignment State Transition
              </label>
              <div className="space-y-2">
                {/* Option 1: Delivered */}
                <label
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                    selectedStatus === "DELIVERED"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-2xs"
                      : "border-dairy-subtle hover:bg-dairy-surface-low"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery_status"
                      checked={selectedStatus === "DELIVERED"}
                      onChange={() => setSelectedStatus("DELIVERED")}
                      className="text-emerald-700 focus:ring-emerald-700"
                    />
                    <span className="font-bold text-dairy-dark">Delivered (Completed Drop)</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </label>

                {/* Option 2: Failed */}
                <label
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                    selectedStatus === "DELIVERY_FAILED"
                      ? "border-red-500 bg-red-50/70 shadow-2xs"
                      : "border-dairy-subtle hover:bg-dairy-surface-low"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery_status"
                      checked={selectedStatus === "DELIVERY_FAILED"}
                      onChange={() => setSelectedStatus("DELIVERY_FAILED")}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="font-bold text-red-700">Failed / Delivery Exception</span>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </label>

                {/* Option 3: Reschedule / Assigned */}
                <label
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                    selectedStatus === "ASSIGNED"
                      ? "border-primary bg-primary/5 shadow-2xs"
                      : "border-dairy-subtle hover:bg-dairy-surface-low"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery_status"
                      checked={selectedStatus === "ASSIGNED"}
                      onChange={() => setSelectedStatus("ASSIGNED")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-bold text-dairy-dark">Reschedule for Dusk / Dawn Run</span>
                  </div>
                  <Clock className="h-4 w-4 text-secondary" />
                </label>
              </div>
            </div>

            {/* Mandatory Failure Reason Section (Visible when FAILED) */}
            {isFailed && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-dairy-dark">
                      Required Failure Reason
                    </label>
                    <span className="text-[10px] text-red-600 font-bold uppercase">Mandatory</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Customer outlet closed / shutter down at dawn",
                      "Cold-chain temp excursion >6°C in van",
                      "Customer rejected consignment (crate count / seal dispute)",
                      "Wrong address / gate inaccessible",
                      "Vehicle breakdown / route emergency",
                    ].map((reason, idx) => (
                      <label
                        key={idx}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer text-xs transition-all",
                          failureReason === reason
                            ? "border-primary bg-primary/5 font-semibold text-dairy-dark"
                            : "border-dairy-subtle hover:bg-dairy-surface-low text-muted-foreground"
                        )}
                      >
                        <input
                          type="radio"
                          name="failure_reason_choice"
                          checked={failureReason === reason}
                          onChange={() => setFailureReason(reason)}
                          className="mt-0.5 text-primary focus:ring-primary"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mandatory Cold-Chain Follow-Up Action */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-dairy-dark">
                      Cold-Chain Follow-Up Action
                    </label>
                    <span className="text-[10px] text-red-600 font-bold uppercase">Mandatory</span>
                  </div>
                  <select
                    value={followUpAction}
                    onChange={(e) => setFollowUpAction(e.target.value)}
                    className="w-full bg-white border border-dairy-subtle rounded-xl p-2.5 text-xs text-dairy-dark focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option>Return crates to Central Chiller B (Zero spoilage)</option>
                    <option>Retry on Afternoon Dusk Route (15:30 PM)</option>
                    <option>Cancel order &amp; restock Vedic inventory</option>
                    <option>Hold at Hub Cold Vault for direct merchant pickup</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dispatch Operations Notes */}
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1.5">
                Dispatch Operations Notes &amp; Cold Log
              </label>
              <textarea
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="Log cold-box temp, driver handoff comments, or return reason..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-dairy-subtle bg-white text-xs text-dairy-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-700">
                  <ThermometerSnowflake className="h-3 w-3" />
                  Chiller Telemetry: 3.8°C
                </span>
                <span>Logged by Vikram Mehta</span>
              </div>
            </div>
          </form>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-dairy-subtle bg-dairy-surface-low/50 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-dairy-subtle text-xs font-semibold text-dairy-dark hover:bg-dairy-surface transition-colors"
            >
              Cancel / Dismiss
            </button>
            <button
              type="submit"
              form="delivery-update-form"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Confirm Update"}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

