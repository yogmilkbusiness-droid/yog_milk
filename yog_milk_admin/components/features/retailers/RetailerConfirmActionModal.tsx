"use client";

import { useState } from "react";
import {
  AlertTriangle,
  X,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Retailer, RetailerApprovalStatus } from "@/lib/contracts/retailer";

export type SensitiveActionType = "SUSPEND" | "ACTIVATE" | "OVERRIDE_BLOCK";

interface RetailerConfirmActionModalProps {
  retailer: Retailer;
  actionType: SensitiveActionType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RetailerConfirmActionModal({
  retailer,
  actionType,
  isOpen,
  onClose,
  onConfirm,
}: RetailerConfirmActionModalProps) {
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isSuspend = actionType === "SUSPEND";
  const isActivate = actionType === "ACTIVATE";
  const isOverride = actionType === "OVERRIDE_BLOCK";

  let title = "Confirm Sensitive Action";
  let description = "Are you sure you want to proceed?";
  let buttonLabel = "Confirm Action";
  let buttonColor = "bg-primary hover:bg-primary-container";

  if (isSuspend) {
    title = `Suspend Account: ${retailer.businessName}`;
    description = "Suspending will halt all morning milk deliveries and freeze ordering access until reactivated.";
    buttonLabel = "Confirm Suspension";
    buttonColor = "bg-rose-600 hover:bg-rose-700";
  } else if (isActivate) {
    title = `Reactivate Account: ${retailer.businessName}`;
    description = "Reactivating will restore full ordering window access and dawn dispatch.";
    buttonLabel = "Confirm Reactivation";
    buttonColor = "bg-emerald-600 hover:bg-emerald-700";
  } else if (isOverride) {
    title = `Override Rule 4.4 Payment Block: ${retailer.businessName}`;
    description = "Retailer has an unresolved COD pending balance. Overriding allows checkout for today only.";
    buttonLabel = "Override Block for Today";
    buttonColor = "bg-amber-600 hover:bg-amber-700";
  }

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(reason || "Action confirmed by Administrator");
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${isSuspend ? "bg-rose-600" : isActivate ? "bg-emerald-600" : "bg-amber-600"}`}>
              {isSuspend ? (
                <PauseCircle className="h-5 w-5" />
              ) : isActivate ? (
                <PlayCircle className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target Outlet: <span className="font-semibold text-dairy-dark">{retailer.businessName}</span> ({retailer.accountCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-dairy-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-dairy-surface-low border border-dairy-subtle text-xs text-dairy-dark leading-relaxed">
            {description}
          </div>

          {isSuspend && (
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Reason for Suspension <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="Seasonal pause requested by retailer">Seasonal pause requested by retailer</option>
                <option value="Shop closed for renovation">Shop closed for renovation</option>
                <option value="Temporary cold storage failure at outlet">Temporary cold storage failure at outlet</option>
                <option value="Administrative verification review required">Administrative verification review required</option>
              </select>
            </div>
          )}

          {isOverride && (
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Super Admin Authorization Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Reason for temporary exception to Rule 4.4..."
                rows={3}
                className="w-full text-xs rounded-xl p-3 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
              />
            </div>
          )}

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
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${buttonColor}`}
            >
              <span>{isSubmitting ? "Processing..." : buttonLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

