class ProductEntity {
  final String id;
  final String name;
  final String categoryId;
  final String categoryName;
  final String packSize; // e.g. "500ml Pouch", "1L Pouch", "1kg Tub"
  final int unitsPerCrate;
  final double wholesalePrice;
  final double fatPercentage;
  final double snfPercentage;
  final String description;
  final bool isAvailable;
  final String? imageUrl;

  const ProductEntity({
    required this.id,
    required this.name,
    required this.categoryId,
    required this.categoryName,
    required this.packSize,
    required this.unitsPerCrate,
    required this.wholesalePrice,
    required this.fatPercentage,
    required this.snfPercentage,
    required this.description,
    required this.isAvailable,
    this.imageUrl,
  });
}

class CategoryEntity {
  final String id;
  final String name;
  final String slug;
  final int displayOrder;

  const CategoryEntity({
    required this.id,
    required this.name,
    required this.slug,
    required this.displayOrder,
  });
}

abstract class CatalogRepository {
  Future<List<CategoryEntity>> getCategories();
  Future<List<ProductEntity>> getProducts({String? categoryId});
  Future<ProductEntity?> getProductById(String id);
}
