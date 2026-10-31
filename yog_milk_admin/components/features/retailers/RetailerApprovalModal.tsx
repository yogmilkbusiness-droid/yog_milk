"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  FileText,
  Truck,
  Clock,
  ShieldCheck,
  Building2,
  User,
  Phone,
  MapPin,
  Milk,
} from "lucide-react";
import { Retailer } from "@/lib/contracts/retailer";
import { useAdminAuth } from "@/components/auth/AuthContext";

interface RetailerApprovalModalProps {
  retailer: Retailer;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (routeId: string, routeName: string, slot: string) => void;
}

const AVAILABLE_ROUTES = [
  { id: "ROUTE-01-HADAPSAR", name: "Route 1 - Hadapsar Central Hub (Van #01)", capacity: "82% Capacity" },
  { id: "ROUTE-02-KOTHRUD", name: "Route 2 - Kothrud & Paud (Van #02)", capacity: "74% Capacity" },
  { id: "ROUTE-03-NASHIK-COLLEGE", name: "Route 3 - College Road (Van #03)", capacity: "68% Capacity" },
  { id: "ROUTE-04-NASHIK-EAST", name: "Route 4 - Nashik East & Panchavati (Van #04)", capacity: "91% Capacity" },
  { id: "ROUTE-05-CAMP", name: "Route 5 - Camp & Cantonment (Van #05)", capacity: "55% Capacity" },
];

export function RetailerApprovalModal({
  retailer,
  isOpen,
  onClose,
  onApprove,
}: RetailerApprovalModalProps) {
  const { user } = useAdminAuth();
  const [selectedRouteId, setSelectedRouteId] = useState(
    retailer.assignedRouteId || AVAILABLE_ROUTES[0].id
  );
  const [selectedSlot, setSelectedSlot] = useState(
    retailer.deliverySlot || "Dawn Slot (05:30 – 07:00 AM)"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const route = AVAILABLE_ROUTES.find((r) => r.id === selectedRouteId) || AVAILABLE_ROUTES[0];
    setTimeout(() => {
      onApprove(route.id, route.name, selectedSlot);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-bold text-primary">
                Review &amp; Approve Retailer Account
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Confirm route capacity and activate account for morning deliveries.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Retailer Card */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              {retailer.ownerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-primary">
                  {retailer.ownerName}
                </h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                  Pending Approval
                </span>
              </div>
              <div className="text-xs font-semibold text-dairy-dark">
                {retailer.businessName} • <span className="font-mono text-muted-foreground">{retailer.accountCode}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Contact</span>
                  <span className="font-medium text-dairy-dark">{retailer.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Location</span>
                  <span className="font-medium text-dairy-dark">{retailer.area}, {retailer.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Est. Daily Milk</span>
                  <span className="font-bold text-primary">{retailer.dailyMilkDemandLiters || 40} Liters / day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Review */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-dairy-dark uppercase tracking-wider">
              Verification Documents ({retailer.documents?.length || 0})
            </label>
            <div className="space-y-2">
              {retailer.documents && retailer.documents.length > 0 ? (
                retailer.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="font-semibold text-dairy-dark">{doc.title}</p>
                        {doc.fileNumber && (
                          <p className="text-[11px] font-mono text-muted-foreground">
                            {doc.fileNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Reviewed
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-dairy-subtle text-xs text-muted-foreground text-center">
                  Standard FSSAI and Storefront photographs recorded in applicant file.
                </div>
              )}
            </div>
          </div>

          {/* Route & Delivery Allocation */}
          <div className="space-y-4 pt-2 border-t border-dairy-subtle">
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Assigned Route &amp; Logistics Van <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none font-medium"
              >
                {AVAILABLE_ROUTES.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name} — {route.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Dawn Delivery Slot <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none font-medium"
              >
                <option>Dawn Slot (05:00 – 06:30 AM)</option>
                <option>Dawn Slot (05:30 – 07:00 AM)</option>
                <option>Early Morning (06:30 – 08:00 AM)</option>
              </select>
            </div>

            {/* Zero Credit Enforced Confirmation */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary space-y-1">
              <p className="font-bold">Zero-Credit Terms Enforced</p>
              <p className="text-[11px] text-muted-foreground">
                Upon activation, this retailer will order strictly via Prepaid UPI or verified Cash on Delivery. No credit limit is allocated.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-dairy-subtle flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-dairy-subtle text-xs font-semibold text-dairy-dark hover:bg-dairy-surface-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? "Activating..." : "Confirm & Approve Retailer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

