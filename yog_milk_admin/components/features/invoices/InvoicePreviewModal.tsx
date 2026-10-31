"use client";

import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Truck,
  Hash,
} from "lucide-react";
import { CommercialInvoice } from "@/lib/contracts/invoice";
import { formatCurrency, cn } from "@/lib/utils";

interface InvoicePreviewModalProps {
  invoice: CommercialInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoicePreviewModal({
  invoice,
  isOpen,
  onClose,
}: InvoicePreviewModalProps) {
  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = () => {
    // Generate text/pdf simulation download
    const element = document.createElement("a");
    const file = new Blob(
      [
        `=================================================================\n` +
          `YOG MILK — COMMERCIAL INVOICE / DELIVERY MEMO (NON-GST)\n` +
          `=================================================================\n` +
          `Invoice Number: ${invoice.invoiceNumber}\n` +
          `Order Reference: ${invoice.orderCode}\n` +
          `Date: ${invoice.invoiceDate}\n` +
          `FSSAI License: ${invoice.fssaiNumber}\n\n` +
          `BILLED TO:\n` +
          `${invoice.retailerBusinessName}\n` +
          `Attn: ${invoice.retailerOwnerName}\n` +
          `${invoice.retailerAddress}\n` +
          `Phone: ${invoice.retailerPhone}\n\n` +
          `ITEMS ALLOCATED:\n` +
          invoice.items
            .map(
              (it) =>
                `- ${it.productName} | ${it.packSize} | Qty: ${it.quantity} | Rate: ₹${it.unitPrice.toFixed(2)} | Total: ₹${it.lineTotal.toFixed(2)}`
            )
            .join("\n") +
          `\n\n-----------------------------------------------------------------\n` +
          `Subtotal: ₹${invoice.subtotal.toFixed(2)}\n` +
          `Cold-Chain Delivery: FREE\n` +
          `Total Net Payable: ₹${invoice.totalPayable.toFixed(2)}\n` +
          `Payment Method: ${invoice.paymentMethod}\n` +
          `Payment Status: ${invoice.paymentStatus}\n` +
          `-----------------------------------------------------------------\n` +
          `Note: Pure raw agricultural dairy commodities exempt from GST.\n` +
          `Printed by Yog Milk Central Operations Hub.\n` +
          `=================================================================\n`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-dairy-subtle shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header toolbar */}
        <div className="px-6 py-3.5 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                invoice.paymentStatus === "PAID"
                  ? "bg-emerald-600"
                  : invoice.paymentStatus === "VOIDED"
                  ? "bg-red-600"
                  : "bg-amber-500"
              )}
            />
            <span className="font-bold text-xs text-dairy-dark">
              Commercial Invoice Preview ({invoice.invoiceNumber})
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              · Non-GST Farm Bill
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
              title="Print Bill"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-2xs hover:bg-primary-container transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF / Text</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-dairy-surface-low/60">
          {/* THE OFFICIAL NON-GST FARM DISPATCH BILL (Physical Print Replica Container) */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E7E2D6] relative space-y-5">
            {/* Stamp on Top Right */}
            <div className="absolute top-6 right-6 text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 text-[10px] font-bold tracking-wider text-primary uppercase">
                Official Bill
              </span>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Original Copy
              </div>
            </div>

            {/* Farm Identity & Header */}
            <div className="border-b border-[#E7E2D6] pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                  Yog Milk
                </span>
              </div>
              <div className="text-xs italic font-serif text-muted-foreground mb-2">
                &ldquo;From Nature to Nourish You&rdquo;
              </div>
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                {invoice.firmAddress}
                <br />
                Central Farm Gate Facility · Anjaneri Vedic Reserve
              </div>

              {/* Document Title (Strict Non-GST: NO "Tax Invoice") */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#E7E2D6] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-primary">
                    Commercial Invoice / Delivery Memo
                  </h2>
                  <span className="text-xs font-mono font-bold text-secondary">
                    {invoice.invoiceNumber}
                  </span>
                  <span className="ml-1.5 text-[10px] bg-dairy-surface text-dairy-dark px-1.5 py-0.5 rounded font-mono font-semibold">
                    {invoice.version}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <div className="text-muted-foreground">
                    Order Ref:{" "}
                    <span className="font-mono font-bold text-primary">{invoice.orderCode}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Date: <span className="text-dairy-dark">{invoice.invoiceDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dispatch & Milk Batch Details */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-dairy-surface-low border border-[#E7E2D6] text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Dispatch Route
                </span>
                <span className="font-bold text-dairy-dark">
                  {invoice.dispatchRouteName || "Route 4 Nashik East"}
                </span>
                <div className="text-[10px] text-muted-foreground">
                  Insulated Reefer Van ({invoice.dispatchSlot || "Dawn Run"})
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Batch Certification
                </span>
                <span className="font-bold text-emerald-800">4.9% Fat · 8.8 SNF Passed</span>
                <div className="text-[10px] text-muted-foreground">
                  Chilling Threshold: 3.8°C at Gate
                </div>
              </div>
            </div>

            {/* Billed To Customer Card */}
            <div className="p-3.5 rounded-xl border border-[#E7E2D6] bg-dairy-surface-low/50 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Billed Retail Partner
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold",
                    invoice.paymentStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-800"
                      : invoice.paymentStatus === "VOIDED"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  ● {invoice.paymentStatus}
                </span>
              </div>
              <div className="font-bold text-sm text-primary">
                {invoice.retailerBusinessName}
              </div>
              <div className="text-dairy-dark font-medium">
                Proprietor: {invoice.retailerOwnerName}
              </div>
              <div className="text-muted-foreground mt-0.5">
                {invoice.retailerAddress} · Ph: {invoice.retailerPhone}
              </div>
              {invoice.retailerFssai && (
                <div className="mt-1 pt-1.5 border-t border-[#E7E2D6] text-[10px] font-mono text-muted-foreground">
                  {invoice.retailerFssai}
                </div>
              )}
            </div>

            {/* Line Items Table (NON-GST: NO GSTIN, NO HSN, NO TAX BREAKDOWN) */}
            <div className="border border-[#E7E2D6] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FBF1DC] text-dairy-dark border-b border-[#E7E2D6]">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-[11px]">Item Description</th>
                    <th className="py-2.5 px-2 text-right font-bold text-[11px]">Rate / Unit</th>
                    <th className="py-2.5 px-2 text-center font-bold text-[11px]">Qty / Pack</th>
                    <th className="py-2.5 px-3 text-right font-bold text-[11px]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2D6] bg-white text-dairy-dark">
                  {invoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-primary">{it.productName}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {it.packSize} {it.specs ? `· ${it.specs}` : ""}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-medium">
                        ₹{it.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-medium">
                        {it.quantity} units
                        <div className="text-[9px] text-muted-foreground">({it.crateCount} crates)</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        ₹{it.lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-3.5 rounded-xl bg-[#FBF1DC] border border-[#E7E2D6] space-y-1.5 text-xs">
              <div className="flex justify-between text-dairy-dark">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-dairy-dark">
                <span className="text-muted-foreground">Cold-Chain Reefer Delivery:</span>
                <span className="font-medium text-emerald-800">FREE</span>
              </div>
              <div className="flex justify-between text-dairy-dark">
                <span className="text-muted-foreground">Crate Deposit (Insulated):</span>
                <span className="font-medium text-dairy-dark">Waived (Returnable)</span>
              </div>
              <div className="pt-2 border-t border-[#E7E2D6] flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm text-primary block">Total Net Payable:</span>
                  <span className="text-[10px] text-muted-foreground">
                    {invoice.paymentMethod === "COD" ? "Cash on Delivery" : "Online Gateway"}
                  </span>
                </div>
                <span className="font-serif text-xl font-bold text-primary font-mono">
                  ₹{invoice.totalPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Statutory Producer Notice */}
            <div className="pt-3 border-t border-dashed border-[#E7E2D6] text-[10px] text-muted-foreground leading-relaxed text-center">
              <p className="font-bold text-dairy-dark mb-0.5">
                Rule 4.5 Commercial Non-GST Agricultural Produce Billing
              </p>
              <p>
                Pure agricultural dairy produce is not subject to GST under prevailing Indian tax laws.
                This document serves as an authentic commercial delivery memo.
              </p>
              <div className="mt-1 font-mono text-[9px] text-muted-foreground">
                FSSAI Central Dairy License: {invoice.fssaiNumber} · Nashik Vedic Hub
              </div>
              {invoice.ledgerHash && (
                <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                  {invoice.ledgerHash}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-3 bg-dairy-surface-low border-t border-dairy-subtle flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">
            Yog Milk Accounts Master · Authenticated by <strong>Vikram Mehta</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-dairy-subtle bg-white text-xs font-semibold text-dairy-dark hover:bg-dairy-surface"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

