"use client";

import {
  X,
  Package,
  Milk,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import { Product } from "@/lib/contracts/product";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onEdit,
}: ProductDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-dairy-subtle bg-white shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                  {product.sku}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {product.categoryName}
                </span>
              </div>
              <h2 className="font-serif text-base font-bold text-primary mt-0.5">
                {product.name}
              </h2>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-3.5 bg-dairy-surface-low/60 rounded-xl border border-dairy-subtle text-muted-foreground leading-relaxed">
            {product.description}
          </div>

          {/* Pricing & Order Specifications Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-dairy-subtle bg-white">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Wholesale Unit Rate
              </span>
              <span className="font-mono text-lg font-bold text-primary mt-1 block">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                per {product.unit}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-dairy-subtle bg-white">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Packaging Configuration
              </span>
              <span className="text-sm font-bold text-dairy-dark mt-1 block">
                {product.packSize}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {product.unitsPerCrate} units / crate
              </span>
            </div>

            <div className="p-3 rounded-xl border border-dairy-subtle bg-white">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Order Min / Step Rule
              </span>
              <span className="font-semibold text-dairy-dark mt-1 block">
                Min {product.minimumQuantity} • Step {product.quantityIncrement}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Wholesale bulk increments
              </span>
            </div>

            <div className="p-3 rounded-xl border border-dairy-subtle bg-white">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Storefront Availability
              </span>
              <span
                className={`font-bold mt-1 inline-flex items-center gap-1 ${
                  product.isAvailable ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.isAvailable ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {product.isAvailable ? "Available ON" : "Restocking / OFF"}
              </span>
            </div>
          </div>

          {/* Chemical & Quality Parameters */}
          {(product.fatPercentage || product.snfPercentage) && (
            <div className="p-3 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-center justify-between">
              <div>
                <span className="font-bold text-dairy-dark block">
                  Vedic Quality Parameters
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Natural agricultural consistency
                </span>
              </div>
              <div className="flex gap-4 font-mono font-bold text-primary text-xs">
                {product.fatPercentage && (
                  <span>FAT: {product.fatPercentage}%</span>
                )}
                {product.snfPercentage && (
                  <span>SNF: {product.snfPercentage}%</span>
                )}
              </div>
            </div>
          )}

          {/* Protection Directive */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground leading-snug">
            <strong>Immutable Historical Snapshots:</strong> Any updates made to this product will only affect newly placed orders. Historical order items, invoices, and payment receipts retain their original rates and descriptions.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dairy-surface-low border-t border-dairy-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-dairy-subtle text-xs font-semibold text-dairy-dark hover:bg-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}

