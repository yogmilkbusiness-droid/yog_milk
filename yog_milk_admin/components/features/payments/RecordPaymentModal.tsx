"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Lock,
  Store,
  ShieldCheck,
  IndianRupee,
  Calendar,
  User,
  FileText,
  BadgeAlert,
  Save,
  QrCode,
  Building2,
  Truck,
} from "lucide-react";
import { PaymentRecord, RecordCashPaymentParams } from "@/lib/contracts/payment";
import { formatCurrency, cn } from "@/lib/utils";

interface RecordPaymentModalProps {
  payment: PaymentRecord | null;
  pendingPayments?: PaymentRecord[];
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (params: RecordCashPaymentParams) => void;
}

export function RecordPaymentModal({
  payment,
  pendingPayments = [],
  isOpen,
  onClose,
  onRecordPayment,
}: RecordPaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(payment);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "BANK_TRANSFER">("COD");
  const [amount, setAmount] = useState<string>("0");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const target = payment || pendingPayments[0] || null;
    setSelectedPayment(target);
    if (target) {
      setAmount(target.amount.toString());
      setReceiptNumber(`VAULT-REC-${Date.now().toString().slice(-4)}`);
      setNotes(`Cash collected by morning route driver. Reconciled in depot vault.`);
    }
  }, [payment, pendingPayments]);

  if (!isOpen || !selectedPayment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsSubmitting(true);
    onRecordPayment({
      orderId: selectedPayment.orderId,
      amountCollected: numericAmount,
      paymentMethod,
      adminId: "admin-session",
      adminName: "Vikram Mehta (Operations Lead)",
      receiptNumber: receiptNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-dairy-subtle shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header matching Stitch Reference */}
        <div className="px-6 py-4 border-b border-dairy-subtle flex items-center justify-between bg-dairy-surface-low shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-dairy-subtle flex items-center justify-center text-primary shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-primary">
                Record Offline / Cash Payment
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Order Reference:{" "}
                <span className="font-mono text-primary font-bold">
                  {selectedPayment.orderCode}
                </span>{" "}
                · Manual Vault Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Order / Customer Summary Banner */}
          <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle space-y-3">
            <div className="flex items-start justify-between border-b border-dairy-subtle/80 pb-2.5">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  CUSTOMER ACCOUNT
                </p>
                <p className="text-sm font-bold text-primary">
                  {selectedPayment.retailerBusinessName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedPayment.retailerOwnerName} · {selectedPayment.retailerArea}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                  <Lock className="h-3 w-3" />
                  Payment Pending Block Active
                </span>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  Non-GST Agricultural Produce
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-dairy-subtle">
                <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                  Outstanding Balance
                </span>
                <span className="text-base font-mono font-bold text-primary">
                  ₹{selectedPayment.amount.toFixed(2)}
                </span>
              </div>
              <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-900 uppercase block font-semibold">
                  Settlement Receiver
                </span>
                <span className="text-xs font-bold text-amber-900">
                  Admin (Vikram Mehta)
                </span>
              </div>
            </div>
          </div>

          {/* Payment Amount Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-dairy-dark">
                Payment Amount Received (₹) <span className="text-red-500">*</span>
              </label>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold font-mono">
                Full Settlement
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-primary text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-dairy-dark font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span>Recording this payment will immediately release Rule 4.4 checkout ordering restrictions.</span>
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-dairy-dark mb-1.5">
              Payment Channel &amp; Receipt Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all",
                  paymentMethod === "COD"
                    ? "border-primary bg-primary/10 font-bold text-primary shadow-2xs"
                    : "border-dairy-subtle hover:bg-dairy-surface-low text-muted-foreground"
                )}
              >
                <Truck className="h-5 w-5 mb-1 text-primary" />
                <span className="text-xs">Cash on Delivery</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">(Physical Vault Handover)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={cn(
                  "p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all",
                  paymentMethod === "UPI"
                    ? "border-primary bg-primary/10 font-bold text-primary shadow-2xs"
                    : "border-dairy-subtle hover:bg-dairy-surface-low text-muted-foreground"
                )}
              >
                <QrCode className="h-5 w-5 mb-1 text-secondary" />
                <span className="text-xs">Direct UPI / QR</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">(Depot Terminal)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={cn(
                  "p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all",
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-primary bg-primary/10 font-bold text-primary shadow-2xs"
                    : "border-dairy-subtle hover:bg-dairy-surface-low text-muted-foreground"
                )}
              >
                <Building2 className="h-5 w-5 mb-1 text-indigo-700" />
                <span className="text-xs">Bank Transfer</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">(NEFT / RTGS)</span>
              </button>
            </div>
          </div>

          {/* Double Column: Receipt No & Timestamp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-dairy-dark mb-1">
                Physical Receipt / Vault Slip #
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="e.g. VAULT-REC-2026-089"
                className="w-full px-3 py-2 rounded-xl border border-dairy-subtle bg-white text-xs font-mono text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-dairy-dark mb-1">
                Settlement Timestamp
              </label>
              <input
                type="text"
                readOnly
                value="Today, 08:15 AM (Live Session)"
                className="w-full px-3 py-2 rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-xs text-muted-foreground font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block font-bold text-dairy-dark mb-1">
              Administrative Audit Note
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record driver handoff note, bank reference, or cash verification details..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-dairy-subtle bg-white text-xs text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-dairy-subtle flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm Payment &amp; Release Block</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

