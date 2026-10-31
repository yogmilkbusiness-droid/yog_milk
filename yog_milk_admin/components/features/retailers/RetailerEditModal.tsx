"use client";

import { useState } from "react";
import { X, Edit3, CheckCircle2 } from "lucide-react";
import { Retailer } from "@/lib/contracts/retailer";

interface RetailerEditModalProps {
  retailer: Retailer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: {
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    deliverySlot: string;
  }) => void;
}

export function RetailerEditModal({
  retailer,
  isOpen,
  onClose,
  onSave,
}: RetailerEditModalProps) {
  const [businessName, setBusinessName] = useState(retailer.businessName);
  const [ownerName, setOwnerName] = useState(retailer.ownerName);
  const [phone, setPhone] = useState(retailer.phone);
  const [email, setEmail] = useState(retailer.email || "");
  const [deliveryAddress, setDeliveryAddress] = useState(retailer.deliveryAddress);
  const [deliverySlot, setDeliverySlot] = useState(retailer.deliverySlot);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave({
        businessName,
        ownerName,
        phone,
        email,
        deliveryAddress,
        deliverySlot,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Edit Permitted Information
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update verified retailer business coordinates
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-dairy-dark mb-1">
              Business / Outlet Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dairy-dark mb-1">
              Owner / Attendant Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dairy-dark mb-1">
              Delivery Address &amp; Drop Landmark <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              rows={2}
              className="w-full text-xs rounded-xl p-3 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dairy-dark mb-1">
              Dawn Delivery Slot
            </label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full text-xs rounded-xl px-3 py-2.5 bg-dairy-surface-low border border-dairy-subtle focus:bg-white focus:border-primary outline-none"
            >
              <option>Dawn Slot (05:00 – 06:30 AM)</option>
              <option>Dawn Slot (05:30 – 07:00 AM)</option>
              <option>Early Morning (06:30 – 08:00 AM)</option>
            </select>
          </div>

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
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-all"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

