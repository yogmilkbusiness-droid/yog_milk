import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/catalog_repository.dart';
import 'contracts/order_repository.dart';
import 'persistence/mock_storage_service.dart';
import 'seed/mock_products.dart';

/// Single item in the Retailer Shopping Cart.
class CartItemEntity {
  final String productId;
  final String productName;
  final String packSize;
  final int unitsPerCrate;
  final double unitPrice;
  final int quantity; // Total units/pouches
  final String? imageUrl;
  final double? fatPercentage;
  final double? snfPercentage;

  const CartItemEntity({
    required this.productId,
    required this.productName,
    required this.packSize,
    required this.unitsPerCrate,
    required this.unitPrice,
    required this.quantity,
    this.imageUrl,
    this.fatPercentage,
    this.snfPercentage,
  });

  int get crateCount => unitsPerCrate > 0 ? (quantity ~/ unitsPerCrate) : 0;
  int get looseCount => unitsPerCrate > 0 ? (quantity % unitsPerCrate) : 0;
  double get lineTotal => quantity * unitPrice;

  CartItemEntity copyWith({
    String? productId,
    String? productName,
    String? packSize,
    int? unitsPerCrate,
    double? unitPrice,
    int? quantity,
    String? imageUrl,
    double? fatPercentage,
    double? snfPercentage,
  }) {
    return CartItemEntity(
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      packSize: packSize ?? this.packSize,
      unitsPerCrate: unitsPerCrate ?? this.unitsPerCrate,
      unitPrice: unitPrice ?? this.unitPrice,
      quantity: quantity ?? this.quantity,
      imageUrl: imageUrl ?? this.imageUrl,
      fatPercentage: fatPercentage ?? this.fatPercentage,
      snfPercentage: snfPercentage ?? this.snfPercentage,
    );
  }
}

/// Immutable state of the Shopping Basket.
class CartState {
  final List<CartItemEntity> items;
  final double standardDeliveryFee;
  final double freeDeliveryThreshold;

  const CartState({
    this.items = const [],
    this.standardDeliveryFee = 50.00,
    this.freeDeliveryThreshold = 3000.00,
  });

  bool get isEmpty => items.isEmpty;
  bool get isNotEmpty => items.isNotEmpty;
  int get itemCount => items.length;

  int get totalUnits => items.fold(0, (sum, item) => sum + item.quantity);
  int get totalCrates => items.fold(0, (sum, item) => sum + item.crateCount);
  int get totalLoose => items.fold(0, (sum, item) => sum + item.looseCount);

  double get subtotal => items.fold(0.0, (sum, item) => sum + item.lineTotal);

  bool get isDeliveryFree => subtotal >= freeDeliveryThreshold;

  double get deliveryFee =>
      (isEmpty || isDeliveryFree) ? 0.00 : standardDeliveryFee;

  double get totalPayable => isEmpty ? 0.00 : (subtotal + deliveryFee);

  CartItemEntity? findItem(String productId) {
    try {
      return items.firstWhere((item) => item.productId == productId);
    } catch (_) {
      return null;
    }
  }

  int getQuantity(String productId) {
    return findItem(productId)?.quantity ?? 0;
  }

  CartState copyWith({
    List<CartItemEntity>? items,
    double? standardDeliveryFee,
    double? freeDeliveryThreshold,
  }) {
    return CartState(
      items: items ?? this.items,
      standardDeliveryFee: standardDeliveryFee ?? this.standardDeliveryFee,
      freeDeliveryThreshold:
          freeDeliveryThreshold ?? this.freeDeliveryThreshold,
    );
  }
}

/// State notifier managing cart mutations.
class CartNotifier extends StateNotifier<CartState> {
  CartNotifier()
      : super(
          // Pre-populate with typical retailer order matching Stitch baseline
          CartState(
            items: [
              CartItemEntity(
                productId: mockProducts[0].id,
                productName: mockProducts[0].name,
                packSize: mockProducts[0].packSize,
                unitsPerCrate: mockProducts[0].unitsPerCrate,
                unitPrice: mockProducts[0].wholesalePrice,
                quantity: 24, // 2 crates
                fatPercentage: mockProducts[0].fatPercentage,
                snfPercentage: mockProducts[0].snfPercentage,
              ),
              CartItemEntity(
                productId: mockProducts[3].id,
                productName: mockProducts[3].name,
                packSize: mockProducts[3].packSize,
                unitsPerCrate: mockProducts[3].unitsPerCrate,
                unitPrice: mockProducts[3].wholesalePrice,
                quantity: 24, // 1 crate
                fatPercentage: mockProducts[3].fatPercentage,
                snfPercentage: mockProducts[3].snfPercentage,
              ),
            ],
          ),
        ) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final saved = await MockStorageService.getCart();
    if (saved != null) {
      state = state.copyWith(items: saved);
    }
  }

  void _persist() {
    MockStorageService.saveCart(state.items);
  }

  /// Sets absolute quantity for a product. Removes if quantity <= 0.
  void setQuantity(ProductEntity product, int quantity) {
    final cleanQty = quantity < 0 ? 0 : quantity;
    final existingIndex =
        state.items.indexWhere((item) => item.productId == product.id);

    if (cleanQty == 0) {
      if (existingIndex >= 0) {
        final updated = List<CartItemEntity>.from(state.items)
          ..removeAt(existingIndex);
        state = state.copyWith(items: updated);
        _persist();
      }
      return;
    }

    if (existingIndex >= 0) {
      final updated = List<CartItemEntity>.from(state.items);
      updated[existingIndex] =
          updated[existingIndex].copyWith(quantity: cleanQty);
      state = state.copyWith(items: updated);
    } else {
      final newItem = CartItemEntity(
        productId: product.id,
        productName: product.name,
        packSize: product.packSize,
        unitsPerCrate: product.unitsPerCrate,
        unitPrice: product.wholesalePrice,
        quantity: cleanQty,
        fatPercentage: product.fatPercentage,
        snfPercentage: product.snfPercentage,
      );
      state = state.copyWith(items: [...state.items, newItem]);
    }
    _persist();
  }

  /// Adds a full crate (unitsPerCrate) to current quantity.
  void addCrate(ProductEntity product) {
    final current = state.getQuantity(product.id);
    setQuantity(product, current + product.unitsPerCrate);
  }

  /// Decreases by a full crate (unitsPerCrate) or clears if less than crate.
  void removeCrate(ProductEntity product) {
    final current = state.getQuantity(product.id);
    final target = (current - product.unitsPerCrate).clamp(0, 99999);
    setQuantity(product, target);
  }

  /// Increments quantity by 1 loose pouch.
  void incrementUnit(ProductEntity product) {
    final current = state.getQuantity(product.id);
    setQuantity(product, current + 1);
  }

  /// Decrements quantity by 1 loose pouch.
  void decrementUnit(ProductEntity product) {
    final current = state.getQuantity(product.id);
    setQuantity(product, current - 1);
  }

  /// Updates quantity by productId (used directly in cart list).
  void updateItemQuantity(String productId, int quantity) {
    final existingIndex =
        state.items.indexWhere((item) => item.productId == productId);
    if (existingIndex < 0) return;

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    final updated = List<CartItemEntity>.from(state.items);
    updated[existingIndex] = updated[existingIndex].copyWith(quantity: quantity);
    state = state.copyWith(items: updated);
    _persist();
  }

  /// Removes an item completely from cart.
  void removeItem(String productId) {
    final updated =
        state.items.where((item) => item.productId != productId).toList();
    state = state.copyWith(items: updated);
    _persist();
  }

  /// Clears the basket.
  void clearCart() {
    state = state.copyWith(items: const []);
    _persist();
  }

  /// Reorder from historical order items without modifying the historical order.
  /// Matches items with current catalog pricing & availability.
  int reorderFromOrder({
    required OrderEntity order,
    required List<ProductEntity> availableProducts,
  }) {
    final newItems = <CartItemEntity>[];
    int addedCount = 0;

    for (final orderItem in order.items) {
      // Find matching product in catalog
      final product = availableProducts.cast<ProductEntity?>().firstWhere(
            (p) => p?.id == orderItem.productId,
            orElse: () => null,
          );

      if (product != null && product.isAvailable) {
        newItems.add(
          CartItemEntity(
            productId: product.id,
            productName: product.name,
            packSize: product.packSize,
            unitsPerCrate: product.unitsPerCrate,
            unitPrice: product.wholesalePrice,
            quantity: orderItem.quantity,
            fatPercentage: product.fatPercentage,
            snfPercentage: product.snfPercentage,
          ),
        );
        addedCount++;
      }
    }

    if (newItems.isNotEmpty) {
      // Replace or merge with existing cart items
      state = state.copyWith(items: newItems);
      _persist();
    }

    return addedCount;
  }
}

/// Global provider for the Retailer Cart.
final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier();
});

