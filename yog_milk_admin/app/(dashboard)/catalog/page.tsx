"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Package,
  PlusCircle,
  FolderTree,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  ShieldCheck,
  Download,
  AlertCircle,
  Check,
} from "lucide-react";
import { Product, ProductCategory } from "@/lib/contracts/product";
import {
  getMockProducts,
  getMockCategories,
  createMockProduct,
  updateMockProduct,
  toggleMockProductAvailability,
  toggleMockProductActive,
  deleteMockProduct,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory,
} from "@/lib/mock/admin-catalog";
import { ProductDrawerModal } from "@/components/features/catalog/ProductDrawerModal";
import { CategoryModal } from "@/components/features/catalog/CategoryModal";
import { ProductDetailModal } from "@/components/features/catalog/ProductDetailModal";
import { formatCurrency, cn } from "@/lib/utils";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("priority");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Success / notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from mock store on mount
  useEffect(() => {
    setProducts(getMockProducts());
    setCategories(getMockCategories());
    setIsClientLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Re-sync helpers
  const refreshData = () => {
    setProducts(getMockProducts());
    setCategories(getMockCategories());
  };

  // Calculations & Counts
  const totalSkuCount = products.length;
  const availableCount = products.filter((p) => p.isAvailable).length;
  const unavailableCount = totalSkuCount - availableCount;
  const activeCount = products.filter((p) => p.isActive).length;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchUnit = p.unit.toLowerCase().includes(q);
          const matchBatch = p.batchCode ? p.batchCode.toLowerCase().includes(q) : false;
          if (!matchName && !matchSku && !matchCat && !matchUnit && !matchBatch) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
          return false;
        }

        // Availability filter
        if (availabilityFilter === "available" && !p.isAvailable) {
          return false;
        }
        if (availabilityFilter === "unavailable" && p.isAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "price_asc") {
          return a.price - b.price;
        }
        if (sortBy === "price_desc") {
          return b.price - a.price;
        }
        if (sortBy === "sku") {
          return a.sku.localeCompare(b.sku);
        }
        // "priority": available first, then active
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return a.sku.localeCompare(b.sku);
      });
  }, [products, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, availabilityFilter, sortBy]);

  // Actions
  const handleToggleAvailability = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleMockProductAvailability(id);
    if (updated) {
      refreshData();
      showToast(
        `${updated.name} availability is now ${
          updated.isAvailable ? "ON (Storefront Open)" : "OFF (Restocking)"
        }`
      );
    }
  };

  const handleToggleCategoryVisibility = (cat: ProductCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateMockCategory(cat.id, { isVisible: !cat.isVisible });
    if (updated) {
      refreshData();
      showToast(
        `Category '${updated.name}' is now ${
          updated.isVisible ? "visible" : "hidden"
        } on retailer storefront.`
      );
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleOpenDetailModal = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const handleDeleteProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to remove "${product.name}" (${product.sku}) from active dairy line items?\n\nNote: Historical order records and past invoices referencing this SKU will preserve their original data.`
    );
    if (confirmed) {
      deleteMockProduct(product.id);
      refreshData();
      showToast(`Removed product "${product.name}" from catalog.`);
    }
  };

  const handleDuplicateProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicatedData = {
      name: `${product.name} (Copy)`,
      description: product.description,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      imageUrl: product.imageUrl,
      packSize: product.packSize,
      unit: product.unit,
      price: product.price,
      unitsPerCrate: product.unitsPerCrate,
      minimumQuantity: product.minimumQuantity,
      quantityIncrement: product.quantityIncrement,
      isAvailable: false, // Default newly duplicated to off for inspection
      isActive: true,
      fatPercentage: product.fatPercentage,
      snfPercentage: product.snfPercentage,
      stockInCrates: 20,
      batchCode: `#${product.sku.slice(-3)}-CPY`,
      storageCondition: product.storageCondition,
    };
    const created = createMockProduct(duplicatedData);
    refreshData();
    showToast(`Duplicated "${product.name}" as ${created.sku}`);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      // Update
      const updated = updateMockProduct(editingProduct.id, productData);
      if (updated) {
        showToast(`Successfully updated "${updated.name}"`);
      }
    } else {
      // Create
      const created = createMockProduct(productData);
      showToast(`Added new product "${created.name}" (${created.sku})`);
    }
    setIsDrawerOpen(false);
    setEditingProduct(null);
    refreshData();
  };

  // Category handlers
  const handleCreateCategory = (name: string, description: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created = createMockCategory({
      name,
      slug,
      description,
      displayOrder: categories.length + 1,
      isVisible: true,
    });
    refreshData();
    showToast(`Category "${created.name}" created successfully.`);
  };

  const handleUpdateCategory = (id: string, updates: Partial<ProductCategory>) => {
    updateMockCategory(id, updates);
    refreshData();
    showToast("Category updated.");
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    const catProducts = products.filter((p) => p.categoryId === id);
    if (catProducts.length > 0) {
      alert(
        `Cannot delete "${category.name}" because it still contains ${catProducts.length} active products. Please reassign or delete those products first.`
      );
      return;
    }
    const confirmed = window.confirm(`Delete category "${category.name}"?`);
    if (confirmed) {
      deleteMockCategory(id);
      refreshData();
      showToast(`Category "${category.name}" deleted.`);
    }
  };

  const exportMockCsv = () => {
    showToast("Exported catalog report: yog_milk_dairy_catalog.csv");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-white shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner matching Stitch Reference */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dairy-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Morning Dawn Supply Chain
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="text-xs text-muted-foreground">Nashik Vedic Farm Hub</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Products &amp; Inventory Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage daily Vedic dairy harvests, pack rules, dawn availability, and batch wholesale pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Manage Categories Button */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-white border border-dairy-subtle text-dairy-dark text-xs font-bold flex items-center gap-2 hover:bg-dairy-surface-low transition-all shadow-xs"
          >
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <span>Manage Categories</span>
          </button>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAddDrawer}
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Dairy SKUs</span>
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-primary">{totalSkuCount} SKUs</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{activeCount} active in daily harvest</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Live Available</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">{availableCount} SKUs</div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Open for retailer orders</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Restocking / Off</span>
            <XCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-700">{unavailableCount} SKUs</div>
          <p className="text-[11px] text-amber-700 mt-0.5">Sold out / morning batch prep</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-dairy-subtle shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Storefront Segments</span>
            <Layers className="h-4 w-4 text-secondary" />
          </div>
          <div className="text-xl font-bold font-mono text-primary">{categories.length} Categories</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">All direct non-GST agricultural</p>
        </div>
      </div>

      {/* Categories Filter Tabs Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {/* All Categories Pill */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5",
              selectedCategory === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-dairy-subtle text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low"
            )}
          >
            <span>All Categories</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                selectedCategory === "all" ? "bg-white/20 text-white" : "bg-dairy-surface text-muted-foreground"
              )}
            >
              {categoryCounts.all || 0}
            </span>
          </button>

          {/* Dynamic Category Pills */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5",
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white border border-dairy-subtle text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  selectedCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-dairy-surface text-muted-foreground"
                )}
              >
                {categoryCounts[cat.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs text-muted-foreground">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-dairy-subtle rounded-lg text-xs py-1.5 pl-2 pr-7 text-dairy-dark focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="priority">Dispatch Priority (Available first)</option>
            <option value="name_asc">Product Name (A-Z)</option>
            <option value="price_asc">Pack Price (Low to High)</option>
            <option value="price_desc">Pack Price (High to Low)</option>
            <option value="sku">SKU Code</option>
          </select>
        </div>
      </div>

      {/* Storefront Category Display Ribbon (Stitch Reference) */}
      <section className="bg-dairy-surface-low border border-dairy-subtle rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            <span className="font-bold text-xs text-dairy-dark">
              Storefront Category Display &amp; Visibility
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              (Live categories visible to retailers during ordering window)
            </span>
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Manage Categories</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-white border border-dairy-subtle/80 rounded-xl px-3 py-2 text-xs shadow-2xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[11px] font-mono text-muted-foreground font-bold">
                  {idx + 1}.
                </span>
                <span className="font-semibold text-dairy-dark truncate">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({categoryCounts[cat.id] || 0})
                </span>
              </div>
              <button
                onClick={(e) => handleToggleCategoryVisibility(cat, e)}
                title={cat.isVisible ? "Storefront visible (Click to hide)" : "Hidden on storefront (Click to show)"}
                className={cn(
                  "p-1 rounded-md transition-colors shrink-0",
                  cat.isVisible
                    ? "text-emerald-700 hover:bg-emerald-50"
                    : "text-zinc-400 hover:bg-zinc-100"
                )}
              >
                {cat.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Main Inventory Card with Search, Filter & Products Table */}
      <div className="bg-white rounded-2xl border border-dairy-subtle shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-dairy-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">Active Dairy Line Items</h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
              {filteredProducts.length} SKUs Listed
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, SKU, unit..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-dairy-subtle bg-dairy-surface-low/50 text-dairy-dark placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Availability filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-dairy-surface-low/50 border border-dairy-subtle rounded-xl text-xs py-1.5 px-3 text-dairy-dark focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Availability</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>

            {/* Cold Chain Indicator & Export */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground border-l border-dairy-subtle pl-3">
              <ThermometerSnowflake className="h-3.5 w-3.5 text-emerald-600" />
              <span>Cold-Chain: <strong className="text-emerald-700">3.8°C Nominal</strong></span>
            </div>

            <button
              onClick={exportMockCsv}
              className="p-1.5 text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low rounded-lg transition-colors"
              title="Export CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dairy-surface-low text-muted-foreground text-[11px] uppercase tracking-wider font-semibold border-b border-dairy-subtle">
                <th className="py-3 px-6">Product &amp; SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pack &amp; Unit</th>
                <th className="py-3 px-4">Wholesale Price (₹)</th>
                <th className="py-3 px-4">Order Min / Step</th>
                <th className="py-3 px-4">Live Availability</th>
                <th className="py-3 px-4">Batch Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dairy-subtle text-xs">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="font-semibold text-dairy-dark text-sm">No dairy products found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try adjusting your search terms or category filters.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const packTotal = p.price * p.unitsPerCrate;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpenDetailModal(p)}
                      className={cn(
                        "hover:bg-dairy-surface-low/70 transition-colors cursor-pointer group",
                        !p.isAvailable && "bg-dairy-surface/40"
                      )}
                    >
                      {/* Product & SKU */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-dairy-subtle bg-white shrink-0">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className={cn(
                                "w-full h-full object-cover transition-transform group-hover:scale-105",
                                !p.isAvailable && "grayscale-40 opacity-75"
                              )}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-dairy-dark text-xs sm:text-sm group-hover:text-primary transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              SKU: {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-dairy-surface text-dairy-dark border border-dairy-subtle/50">
                          {p.categoryName}
                        </span>
                      </td>

                      {/* Pack & Unit */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-dairy-dark">{p.packSize}</div>
                        <div className="text-[11px] text-muted-foreground">{p.unit}</div>
                      </td>

                      {/* Wholesale Price */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-dairy-dark">
                          ₹{p.price.toFixed(2)}{" "}
                          <span className="text-[10px] text-muted-foreground font-sans font-normal">
                            / unit
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          ₹{packTotal.toFixed(2)} / pack
                        </div>
                      </td>

                      {/* Order Min / Step */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-dairy-dark">
                          Min {p.minimumQuantity}
                        </span>{" "}
                        <span className="text-muted-foreground">· Step {p.quantityIncrement}</span>
                      </td>

                      {/* Live Availability Toggle Pill */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleAvailability(p.id, e)}
                          title="Click to toggle storefront ordering availability"
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all active:scale-95",
                            p.isAvailable
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : "bg-zinc-100 text-zinc-600 border-zinc-300 hover:bg-zinc-200"
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              p.isAvailable ? "bg-emerald-600" : "bg-zinc-400"
                            )}
                          />
                          <span>{p.isAvailable ? "Available ON" : "Available OFF"}</span>
                        </button>
                      </td>

                      {/* Batch Status */}
                      <td className="py-3.5 px-4">
                        {p.isAvailable ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ● Active Harvest
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            ⏳ Restocking 07:00 AM
                          </span>
                        )}
                        {p.batchCode && (
                          <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                            {p.batchCode}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetailModal(p)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low transition-colors"
                          title="View Specifications & Snapshot Data"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleOpenEditDrawer(p, e)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Product Details & Rates"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicateProduct(p, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark hover:bg-dairy-surface-low transition-colors"
                          title="Duplicate SKU"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProduct(p, e)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Footer */}
        <div className="px-6 py-4 border-t border-dairy-subtle flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-dairy-dark">{paginatedProducts.length}</strong> of{" "}
            <strong className="text-dairy-dark">{filteredProducts.length}</strong> dairy items across Nashik
            farm harvest line
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 py-1 rounded-lg bg-primary text-white font-bold text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-dairy-subtle text-dairy-dark hover:bg-dairy-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Protection Notice Footer */}
      <div className="p-4 rounded-xl bg-dairy-surface-low border border-dairy-subtle flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <p className="font-bold text-dairy-dark mb-0.5">
            Historical Order Snapshot Integrity &amp; Agricultural Billing Governance
          </p>
          <p>
            When product pricing, pack size, or descriptions are updated in this catalog, the changes
            apply strictly to new cart additions and future retailer orders. Historical placed orders,
            dispatched crates, and generated non-GST commercial invoices retain their original immutable price
            and SKU snapshots.
          </p>
        </div>
      </div>

      {/* Slide-over Product Drawer Modal (Create / Edit) */}
      <ProductDrawerModal
        product={editingProduct}
        categories={categories}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Categories Management Modal */}
      <CategoryModal
        categories={categories}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Product Detail Specifications Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          isOpen={!!selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onEdit={() => {
            const p = selectedProductForDetail;
            setSelectedProductForDetail(null);
            handleOpenEditDrawer(p);
          }}
        />
      )}
    </div>
  );
}
