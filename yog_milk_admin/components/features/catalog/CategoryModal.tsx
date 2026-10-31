"use client";

import { useState } from "react";
import {
  X,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  FolderTree,
} from "lucide-react";
import { ProductCategory } from "@/lib/contracts/product";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  categories: ProductCategory[];
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, description: string) => void;
  onUpdateCategory: (id: string, updates: Partial<ProductCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryModal({
  categories,
  isOpen,
  onClose,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateCategory(newName, newDesc);
    setNewName("");
    setNewDesc("");
    setIsAddingNew(false);
  };

  const startEdit = (cat: ProductCategory) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const handleSaveEdit = (id: string) => {
    onUpdateCategory(id, {
      name: editName,
      description: editDesc,
    });
    setEditingCatId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-dairy-subtle shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-dairy-surface-low border-b border-dairy-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-serif text-base font-bold text-primary">
                Storefront Category Management
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Organize product segments displayed in retailer app catalog tabs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-dairy-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Add New Category Action */}
          {!isAddingNew ? (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-primary/40 hover:border-primary text-primary hover:bg-primary/5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Create New Dairy Category</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 bg-dairy-surface-low rounded-xl border border-dairy-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-primary">New Category Details</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-muted-foreground hover:text-dairy-dark"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Traditional Sweets)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2 bg-white border border-dairy-subtle outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Short description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2 bg-white border border-dairy-subtle outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-bold"
              >
                Save Category
              </button>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Active Storefront Categories ({categories.length})
            </span>

            {categories.map((cat, idx) => {
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl border border-dairy-subtle bg-white hover:bg-dairy-surface-low/40 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs font-bold px-2 py-1 rounded border border-dairy-subtle bg-white"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full text-xs px-2 py-1 rounded border border-dairy-subtle bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="px-3 py-1 bg-primary text-white rounded text-[11px] font-bold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="px-2 py-1 text-muted-foreground text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-muted-foreground text-[10px] font-bold">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-dairy-dark truncate">
                            {cat.name}
                          </span>
                          <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-1.5 py-0.2 rounded-full font-mono">
                            {cat.itemCount} SKUs
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateCategory(cat.id, { isVisible: !cat.isVisible })
                          }
                          title={cat.isVisible ? "Storefront Visible" : "Hidden from Retailers"}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            cat.isVisible
                              ? "text-emerald-700 hover:bg-emerald-50"
                              : "text-muted-foreground hover:bg-dairy-surface-low"
                          )}
                        >
                          {cat.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          title="Edit Category Name"
                          className="p-1.5 rounded-lg text-primary hover:bg-dairy-surface-low"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCategory(cat.id)}
                          title="Delete Category"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dairy-surface-low border-t border-dairy-subtle flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

