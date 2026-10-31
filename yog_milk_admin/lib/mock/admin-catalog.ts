import { Product, ProductCategory } from "../contracts/product";

export const MOCK_PRESET_IMAGES = [
  {
    id: "img-milk-01",
    label: "A2 Gir Cow Milk Glass Bottle",
    category: "Fresh Milk",
    url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-milk-02",
    label: "Buffalo Pure Milk Pouch & Crate",
    category: "Fresh Milk",
    url: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-ghee-01",
    label: "Pure Vedic A2 Bilona Ghee Jar",
    category: "Ghee & Vedic Oils",
    url: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-dahi-01",
    label: "Traditional Clay Pot Set Dahi",
    category: "Cultured & Fermented",
    url: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-butter-01",
    label: "Hand-Churned Makhan Butter",
    category: "Cultured & Fermented",
    url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-paneer-01",
    label: "Fresh Soft Malai Paneer Block",
    category: "Artisanal Paneer",
    url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-chaas-01",
    label: "Spiced Masala Buttermilk (Taak)",
    category: "Traditional Beverages",
    url: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "img-lassi-01",
    label: "Royal Saffron Cardamom Sweet Lassi",
    category: "Traditional Beverages",
    url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
  },
];

export const INITIAL_MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-01",
    name: "Fresh Milk",
    slug: "fresh-milk",
    displayOrder: 1,
    itemCount: 2,
    isVisible: true,
    description: "Daily unadulterated dawn milk harvests (Gir Cow A2 & Buffalo)",
  },
  {
    id: "cat-02",
    name: "Cultured & Fermented",
    slug: "cultured-fermented",
    displayOrder: 2,
    itemCount: 2,
    isVisible: true,
    description: "Probiotic clay set curds and hand-churned Vedic butter",
  },
  {
    id: "cat-03",
    name: "Ghee & Vedic Oils",
    slug: "ghee-oils",
    displayOrder: 3,
    itemCount: 1,
    isVisible: true,
    description: "Slow-cooked A2 Gir Cow Bilona Ghee in glass containers",
  },
  {
    id: "cat-04",
    name: "Artisanal Paneer",
    slug: "fresh-paneer",
    displayOrder: 4,
    itemCount: 1,
    isVisible: true,
    description: "Fresh coagulated malai cottage cheese with zero preservatives",
  },
  {
    id: "cat-05",
    name: "Traditional Beverages",
    slug: "beverages",
    displayOrder: 5,
    itemCount: 2,
    isVisible: true,
    description: "Masala Chaas, Spiced Taak, and Royal Sweet Lassi",
  },
];

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    sku: "YM-PRD-001",
    name: "Gir Cow A2 Milk 1L Pouch",
    description: "Pure unhomogenized A2 Gir cow milk with 4.8% natural fat and 8.8% SNF. Farm chilled to 3.8°C within 45 minutes of dawn harvest.",
    categoryId: "cat-01",
    categoryName: "Fresh Milk",
    imageUrl: MOCK_PRESET_IMAGES[0].url,
    packSize: "Pack of 20",
    unit: "1L pouch",
    price: 68.0,
    wholesalePrice: 68.0,
    unitsPerCrate: 20,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 4.8,
    snfPercentage: 8.8,
    stockInCrates: 42,
    batchCode: "#GCM-29A",
    storageCondition: "Cold storage 3.8°C",
  },
  {
    id: "prod-02",
    sku: "YM-PRD-002",
    name: "Buffalo Full Cream Milk 1L",
    description: "Rich full-cream Murrah buffalo milk with 6.5% natural fat. Ideal for tea vendors, halwais, and sweet makers requiring dense consistency.",
    categoryId: "cat-01",
    categoryName: "Fresh Milk",
    imageUrl: MOCK_PRESET_IMAGES[1].url,
    packSize: "Pack of 20",
    unit: "1L pouch",
    price: 80.0,
    wholesalePrice: 80.0,
    unitsPerCrate: 20,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 6.5,
    snfPercentage: 9.0,
    stockInCrates: 56,
    batchCode: "#BFM-29B",
    storageCondition: "Cold storage 3.8°C",
  },
  {
    id: "prod-03",
    sku: "YM-PRD-003",
    name: "Fresh Malai Paneer 1kg Vacuum Pack",
    description: "Traditional soft malai paneer prepared from pure whole milk coagulation. Shipped in food-grade vacuum blocks with zero artificial additives.",
    categoryId: "cat-04",
    categoryName: "Artisanal Paneer",
    imageUrl: MOCK_PRESET_IMAGES[5].url,
    packSize: "Pack of 5",
    unit: "1kg vacuum pack",
    price: 380.0,
    wholesalePrice: 380.0,
    unitsPerCrate: 5,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 22.0,
    snfPercentage: 20.0,
    stockInCrates: 18,
    batchCode: "#PAN-102",
    storageCondition: "Refrigerated 4.0°C",
  },
  {
    id: "prod-04",
    sku: "YM-PRD-004",
    name: "Pure Vedic Bilona Ghee 1L Glass Jar",
    description: "Crafted through the ancient Bilona method: curd is slow-churned into makhan and melted over low fire. Sealed in UV-protective amber glass jar.",
    categoryId: "cat-03",
    categoryName: "Ghee & Vedic Oils",
    imageUrl: MOCK_PRESET_IMAGES[2].url,
    packSize: "Pack of 6",
    unit: "1L glass jar",
    price: 1450.0,
    wholesalePrice: 1450.0,
    unitsPerCrate: 6,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 99.7,
    snfPercentage: 0.3,
    stockInCrates: 24,
    batchCode: "#BIL-014",
    storageCondition: "Ambient dark pantry",
  },
  {
    id: "prod-05",
    sku: "YM-PRD-005",
    name: "Fresh Dahi 400g Clay Pot",
    description: "Traditional dahi naturally fermented with heritage lactobacillus culture in porous unglazed earthen pots. Mildly sweet aroma and firm set texture.",
    categoryId: "cat-02",
    categoryName: "Cultured & Fermented",
    imageUrl: MOCK_PRESET_IMAGES[3].url,
    packSize: "Pack of 20",
    unit: "400g clay pot",
    price: 45.0,
    wholesalePrice: 45.0,
    unitsPerCrate: 20,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 4.5,
    snfPercentage: 8.5,
    stockInCrates: 30,
    batchCode: "#FDH-088",
    storageCondition: "Refrigerated 4.0°C",
  },
  {
    id: "prod-06",
    sku: "YM-PRD-006",
    name: "A2 Cultured Cow Butter 500g",
    description: "Authentic hand-churned Vedic makhan with active probiotic culture, zero salt and zero artificial colors. Pale golden hue from Gir cow beta-carotene.",
    categoryId: "cat-02",
    categoryName: "Cultured & Fermented",
    imageUrl: MOCK_PRESET_IMAGES[4].url,
    packSize: "Pack of 10",
    unit: "500g butter wrap",
    price: 320.0,
    wholesalePrice: 320.0,
    unitsPerCrate: 10,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    fatPercentage: 82.0,
    snfPercentage: 1.5,
    stockInCrates: 12,
    batchCode: "#BTR-004",
    storageCondition: "Chilled 2.0°C – 4.0°C",
  },
  {
    id: "prod-07",
    sku: "YM-PRD-007",
    name: "Spiced Masala Chaas 200ml",
    description: "Refreshing diluted churned buttermilk blended with roasted rock cumin, pink Himalayan salt, and fresh green ginger essence.",
    categoryId: "cat-05",
    categoryName: "Traditional Beverages",
    imageUrl: MOCK_PRESET_IMAGES[6].url,
    packSize: "Pack of 30",
    unit: "200ml bottle",
    price: 15.0,
    wholesalePrice: 15.0,
    unitsPerCrate: 30,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: true,
    isActive: true,
    stockInCrates: 40,
    batchCode: "#CHA-059",
    storageCondition: "Cold storage 3.8°C",
  },
  {
    id: "prod-08",
    sku: "YM-PRD-008",
    name: "Royal Sweet Lassi 200ml",
    description: "Rich, dense Punjabi-style sweet lassi whipped from farm curd and infused with Kashmiri saffron threads and ground green cardamom.",
    categoryId: "cat-05",
    categoryName: "Traditional Beverages",
    imageUrl: MOCK_PRESET_IMAGES[7].url,
    packSize: "Pack of 30",
    unit: "200ml bottle",
    price: 25.0,
    wholesalePrice: 25.0,
    unitsPerCrate: 30,
    minimumQuantity: 1,
    quantityIncrement: 1,
    isAvailable: false, // Stock restocking simulation
    isActive: true,
    stockInCrates: 0,
    batchCode: "#LAS-021",
    storageCondition: "Cold storage 3.8°C",
  },
];

const PRODUCTS_STORAGE_KEY = "yog_milk_admin_mock_products_v2";
const CATEGORIES_STORAGE_KEY = "yog_milk_admin_mock_categories_v2";

export function getMockProducts(): Product[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_PRODUCTS;
}

export function saveMockProducts(products: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }
}

export function getMockCategories(): ProductCategory[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return INITIAL_MOCK_CATEGORIES;
}

export function saveMockCategories(categories: ProductCategory[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }
}

// Product CRUD
export function createMockProduct(
  data: Omit<Product, "id" | "sku">
): Product {
  const products = getMockProducts();
  const nextNumber = products.length + 1;
  const newSku = `YM-PRD-${String(nextNumber).padStart(3, "0")}`;
  const newId = `prod-${String(nextNumber).padStart(2, "0")}`;

  const created: Product = {
    ...data,
    id: newId,
    sku: newSku,
    wholesalePrice: data.price,
  };

  const updatedProducts = [created, ...products];
  saveMockProducts(updatedProducts);

  // Update category item count
  const categories = getMockCategories();
  const catIndex = categories.findIndex((c) => c.id === data.categoryId);
  if (catIndex !== -1) {
    categories[catIndex].itemCount += 1;
    saveMockCategories(categories);
  }

  return created;
}

export function updateMockProduct(
  id: string,
  updates: Partial<Product>
): Product | null {
  const products = getMockProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    ...updates,
    wholesalePrice: updates.price !== undefined ? updates.price : products[index].price,
  };

  products[index] = updated;
  saveMockProducts(products);
  return updated;
}

export function toggleMockProductAvailability(id: string): Product | null {
  const products = getMockProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index].isAvailable = !products[index].isAvailable;
  saveMockProducts(products);
  return products[index];
}

export function toggleMockProductActive(id: string): Product | null {
  const products = getMockProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index].isActive = !products[index].isActive;
  saveMockProducts(products);
  return products[index];
}

export function deleteMockProduct(id: string): boolean {
  const products = getMockProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return false;

  const filtered = products.filter((p) => p.id !== id);
  saveMockProducts(filtered);

  // Decrement category count
  const categories = getMockCategories();
  const catIndex = categories.findIndex((c) => c.id === target.categoryId);
  if (catIndex !== -1 && categories[catIndex].itemCount > 0) {
    categories[catIndex].itemCount -= 1;
    saveMockCategories(categories);
  }

  return true;
}

// Category CRUD
export function createMockCategory(
  data: Omit<ProductCategory, "id" | "itemCount">
): ProductCategory {
  const categories = getMockCategories();
  const newId = `cat-${String(categories.length + 1).padStart(2, "0")}`;
  const created: ProductCategory = {
    ...data,
    id: newId,
    itemCount: 0,
  };
  const updated = [...categories, created];
  saveMockCategories(updated);
  return created;
}

export function updateMockCategory(
  id: string,
  updates: Partial<ProductCategory>
): ProductCategory | null {
  const categories = getMockCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = { ...categories[index], ...updates };
  saveMockCategories(categories);
  return categories[index];
}

export function deleteMockCategory(id: string): boolean {
  const categories = getMockCategories();
  const filtered = categories.filter((c) => c.id !== id);
  saveMockCategories(filtered);
  return true;
}

