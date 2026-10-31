export interface ProductCategory {
  id: string;
  name: string; // e.g. "Fresh Milk", "Ghee & Vedic Oils"
  slug: string;
  displayOrder: number;
  itemCount: number;
  isVisible: boolean;
  description?: string;
}

export interface Product {
  id: string;
  sku: string; // e.g. "YM-PRD-001"
  name: string; // e.g. "Gir Cow A2 Milk 1L Pouch"
  description: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  packSize: string; // e.g. "Pack of 20", "1L Bottle", "1kg Block"
  unit: string; // e.g. "1L pouch", "500ml bottle", "1kg block"
  price: number; // Wholesale unit rate in INR (₹)
  wholesalePrice?: number; // Aliased for backwards compatibility
  unitsPerCrate: number;
  minimumQuantity: number; // e.g. 1 pack
  quantityIncrement: number; // e.g. 1 pack
  isAvailable: boolean; // Live availability toggle: ON / OFF
  isActive: boolean; // Active / Inactive harvest status
  fatPercentage?: number; // e.g. 6.0
  snfPercentage?: number; // e.g. 9.0
  stockInCrates?: number;
  batchCode?: string; // e.g. "#FCM-29A"
  storageCondition?: string; // e.g. "Cold storage 3.8°C"
}

export interface CatalogRepository {
  getCategories(): Promise<ProductCategory[]>;
  createCategory(category: Omit<ProductCategory, "id" | "itemCount">): Promise<ProductCategory>;
  updateCategory(id: string, updates: Partial<ProductCategory>): Promise<ProductCategory>;
  deleteCategory(id: string): Promise<boolean>;

  getProducts(filters?: {
    categoryId?: string;
    search?: string;
    availableOnly?: boolean;
    activeOnly?: boolean;
  }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, "id" | "sku">): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  toggleAvailability(id: string): Promise<Product>;
  toggleActiveStatus(id: string): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
}
