"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Product, ProductCategory } from "@/lib/contracts/product";
import { MOCK_PRESET_IMAGES } from "@/lib/mock/admin-catalog";
import { cn } from "@/lib/utils";

interface ProductDrawerModalProps {
  product?: Product | null; // If provided, edit mode; otherwise, create mode
  categories: ProductCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
}

export function ProductDrawerModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductDrawerModalProps) {
  const isEdit = !!product;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState(MOCK_PRESET_IMAGES[0].url);
  const [packSize, setPackSize] = useState("Pack of 20");
  const [unit, setUnit] = useState("1L pouch");
  const [price, setPrice] = useState("85.00");
  const [minimumQuantity, setMinimumQuantity] = useState("1");
  const [quantityIncrement, setQuantityIncrement] = useState("1");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [fatPercentage, setFatPercentage] = useState("4.8");
  const [snfPercentage, setSnfPercentage] = useState("8.8");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategoryId(product.categoryId);
      setImageUrl(product.imageUrl || MOCK_PRESET_IMAGES[0].url);
      setPackSize(product.packSize);
      setUnit(product.unit);
      setPrice(String(product.price));
      setMinimumQuantity(String(product.minimumQuantity));
      setQuantityIncrement(String(product.quantityIncrement));
      setIsAvailable(product.isAvailable);
      setIsActive(product.isActive);
      setFatPercentage(product.fatPercentage ? String(product.fatPercentage) : "4.8");
      setSnfPercentage(product.snfPercentage ? String(product.snfPercentage) : "8.8");
    } else {
      // Default new product values
      setName("");
      setDescription("");
      setCategoryId(categories[0]?.id || "cat-01");
      setImageUrl(MOCK_PRESET_IMAGES[0].url);
      setPackSize("Pack of 20");
      setUnit("1L pouch");
      setPrice("85.00");
      setMinimumQuantity("1");
      setQuantityIncrement("1");
      setIsAvailable(true);
      setIsActive(true);
      setFatPercentage("4.8");
      setSnfPercentage("8.8");
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cat = categories.find((c) => c.id === categoryId) || categories[0];
    const payload = {
      name,
      description,
      categoryId: cat.id,
      categoryName: cat.name,
      imageUrl,
      packSize,
      unit,
      price: parseFloat(price) || 0,
      unitsPerCrate: parseInt(packSize.replace(/\D/g, "")) || 20,
      minimumQuantity: parseInt(minimumQuantity) || 1,
      quantityIncrement: parseInt(quantityIncrement) || 1,
      isAvailable,
      isActive,
      fatPercentage: parseFloat(fatPercentage) || undefined,
      snfPercentage: parseFloat(snfPercentage) || undefined,
    };

    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <aside className="relative z-10 w-full max-w-[540px] bg-white h-screen shadow-2xl flex flex-col border-l border-dairy-subtle animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                Dairy Catalog Master
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-[11px] text-muted-foreground font-mono">
                {isEdit ? product?.sku : "New SKU"}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-primary">
              {isEdit ? `Edit: ${product?.name}` : "Add New Dairy Product SKU"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-dairy-dark hover:bg-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Core Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gir Cow A2 Milk 1L Pouch"
                className="w-full h-11 px-3.5 rounded-xl border border-dairy-subtle bg-white text-xs font-semibold text-dairy-dark focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Product Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-dairy-subtle bg-dairy-surface-low text-xs font-semibold text-dairy-dark focus:border-primary outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dairy-dark mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed commercial description, fat content, and storage guidelines..."
                className="w-full p-3 rounded-xl border border-dairy-subtle bg-white text-xs text-dairy-dark focus:border-primary outline-none leading-relaxed"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Displayed in the retailer catalog, quick reorder sheets, and order memos.
              </p>
            </div>
          </div>

          {/* Section 2: Mock Image Dropzone & Preview */}
          <div className="space-y-2 pt-2 border-t border-dairy-subtle">
            <label className="block text-xs font-bold text-dairy-dark">
              Product Photography &amp; Thumbnail
            </label>
            <div className="border border-dairy-subtle rounded-2xl p-3 bg-dairy-surface-low flex items-center gap-3.5">
              {/* Image Preview */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-dairy-subtle bg-white shrink-0 shadow-xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-dairy-dark truncate">
                  {name || "Dairy SKU Image"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Vedic dairy authenticated imagery
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                    className="text-xs font-bold text-primary hover:text-secondary hover:underline"
                  >
                    {isGalleryOpen ? "Hide Preset Gallery" : "Choose from Presets"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Preset Gallery Selector */}
            {isGalleryOpen && (
              <div className="p-3 bg-white rounded-xl border border-dairy-subtle shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                  Select Mock Dairy Image:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {MOCK_PRESET_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setImageUrl(img.url);
                        setIsGalleryOpen(false);
                      }}
                      className={cn(
                        "rounded-lg overflow-hidden border-2 aspect-square relative group transition-all",
                        imageUrl === img.url
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-dairy-subtle"
                      )}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                      <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-primary/40 flex items-center justify-center text-white text-[9px] font-bold p-1 text-center transition-opacity">
                        {img.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Packaging & Pricing Rules */}
          <div className="pt-2 border-t border-dairy-subtle space-y-4">
            <h3 className="font-serif text-sm font-bold text-primary flex items-center gap-2">
              <Package className="h-4 w-4 text-secondary" />
              Packaging &amp; Wholesale Pricing Rules
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Pack Size <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  placeholder="e.g. Pack of 20"
                  className="w-full h-10 px-3 rounded-xl border border-dairy-subtle bg-white text-xs font-semibold text-dairy-dark focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Unit Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 1L pouch"
                  className="w-full h-10 px-3 rounded-xl border border-dairy-subtle bg-white text-xs font-semibold text-dairy-dark focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Wholesale Unit Rate (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-dairy-dark text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-dairy-subtle bg-white text-xs font-mono font-bold text-dairy-dark focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Minimum Order Qty
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={minimumQuantity}
                  onChange={(e) => setMinimumQuantity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-dairy-subtle bg-white text-xs font-mono font-semibold text-dairy-dark focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Quantity Step / Increment
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityIncrement}
                  onChange={(e) => setQuantityIncrement(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-dairy-subtle bg-white text-xs font-mono font-semibold text-dairy-dark focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dairy-dark mb-1">
                  Fat % (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fatPercentage}
                  onChange={(e) => setFatPercentage(e.target.value)}
                  placeholder="e.g. 4.8"
                  className="w-full h-10 px-3 rounded-xl border border-dairy-subtle bg-white text-xs font-mono text-dairy-dark focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Storefront Availability & Active Status */}
          <div className="pt-2 border-t border-dairy-subtle space-y-3">
            {/* Availability Toggle */}
            <div className="p-3.5 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-dairy-dark">Live Storefront Availability</p>
                <p className="text-[11px] text-muted-foreground">
                  Available for retailer order additions during open ordering window
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dairy-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dairy-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Active / Inactive Toggle */}
            <div className="p-3.5 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-dairy-dark">Product Lifecycle Status</p>
                <p className="text-[11px] text-muted-foreground">
                  {isActive ? "Active in Daily Farm Harvest" : "Inactive / Archived SKU"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dairy-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dairy-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>

          {/* Historical Order Integrity Note */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-dairy-dark flex items-start gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-snug">
              <strong>Order Snapshot Protection:</strong> Modifying pricing or specifications here updates future catalog displays only. Historical order-item snapshots and previous non-GST bills remain immutable.
            </p>
          </div>

          {/* Drawer Actions Footer */}
          <div className="pt-3 border-t border-dairy-subtle flex items-center justify-between sticky bottom-0 bg-white py-2">
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
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : isEdit ? "Save & Publish Changes" : "Create & Publish Product"}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

