import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/design_system/tokens/app_colors.dart';
import '../../../core/design_system/tokens/app_radius.dart';
import '../../../core/design_system/tokens/app_spacing.dart';
import '../../../core/design_system/tokens/app_typography.dart';
import '../../../core/design_system/widgets/yog_button.dart';
import '../../../core/mock_engine/cart_controller.dart';
import '../../../core/mock_engine/contracts/order_repository.dart';
import '../../../core/mock_engine/seed/mock_orders.dart';
import '../../../core/mock_engine/seed/mock_products.dart';

/// Reorder Review Bottom Sheet matching Stitch reference:
/// `yog_milk_reorder_review_sheet`
/// Allows reviewing past order items, checking live dawn-batch availability,
/// and cloning available items into a fresh cart without altering historical orders.
class ReorderReviewSheet extends ConsumerStatefulWidget {
  final OrderEntity pastOrder;

  const ReorderReviewSheet({
    super.key,
    required this.pastOrder,
  });

  static Future<void> show(
    BuildContext context, {
    OrderEntity? pastOrder,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ReorderReviewSheet(
        pastOrder: pastOrder ?? mockPastUsualOrder,
      ),
    );
  }

  @override
  ConsumerState<ReorderReviewSheet> createState() => _ReorderReviewSheetState();
}

class _ReorderReviewSheetState extends ConsumerState<ReorderReviewSheet> {
  late final Map<String, bool> _selectedItemIds;

  @override
  void initState() {
    super.initState();
    // Default check all items that are currently in stock
    _selectedItemIds = {};
    for (final item in widget.pastOrder.items) {
      final product = mockProducts.cast<dynamic>().firstWhere(
            (p) => p.id == item.productId,
            orElse: () => null,
          );
      final isAvailable = product?.isAvailable ?? true;
      _selectedItemIds[item.productId] = isAvailable;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Calculate total of currently selected items
    double updatedTotal = 0.0;
    int selectedCount = 0;

    for (final item in widget.pastOrder.items) {
      if (_selectedItemIds[item.productId] == true) {
        // Calculate based on fresh catalog wholesale price
        final product = mockProducts.cast<dynamic>().firstWhere(
              (p) => p.id == item.productId,
              orElse: () => null,
            );
        final price = product?.wholesalePrice ?? item.unitPrice;
        updatedTotal += price * item.quantity;
        selectedCount++;
      }
    }

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Color(0x2E051256),
            blurRadius: 32,
            offset: Offset(0, -8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag Handle & Header
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.base,
              AppSpacing.sm,
              AppSpacing.base,
              AppSpacing.sm,
            ),
            child: Column(
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: AppColors.borderSubtle,
                      borderRadius: AppRadius.radiusPill,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Review Past Order',
                          style: AppTypography.headlineSmall.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(
                              Icons.history_rounded,
                              size: 14,
                              color: AppColors.secondary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              widget.pastOrder.orderCode,
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded,
                          color: AppColors.primary),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Scrollable Body
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.base),
              children: [
                // 1. Dawn Batch Sync Banner
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: AppRadius.radiusLg,
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.wb_twilight_rounded,
                        color: AppColors.secondary,
                        size: 20,
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Tomorrow's Dawn Batch Sync",
                              style: AppTypography.titleSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Wholesale prices and stock quotas updated for tomorrow dawn delivery.',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // 2. Section Heading
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ORDER ITEMS (${widget.pastOrder.items.length})',
                      style: AppTypography.labelMedium.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      '$selectedCount Selected',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                // 3. Items List
                ...widget.pastOrder.items.map((item) {
                  final product = mockProducts.cast<dynamic>().firstWhere(
                        (p) => p.id == item.productId,
                        orElse: () => null,
                      );
                  final isAvailable = product?.isAvailable ?? true;
                  final isChecked = _selectedItemIds[item.productId] ?? false;
                  final currentPrice = product?.wholesalePrice ?? item.unitPrice;
                  final lineTotal = currentPrice * item.quantity;

                  return Container(
                    margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: isAvailable ? Colors.white : AppColors.surfaceContainerLow,
                      borderRadius: AppRadius.radiusLg,
                      border: Border.all(
                        color: isChecked
                            ? AppColors.primary
                            : AppColors.borderSubtle,
                        width: isChecked ? 1.5 : 1.0,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Checkbox
                        Checkbox(
                          value: isChecked,
                          onChanged: isAvailable
                              ? (val) {
                                  setState(() {
                                    _selectedItemIds[item.productId] =
                                        val ?? false;
                                  });
                                }
                              : null,
                          activeColor: AppColors.primary,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        // Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.productName,
                                style: AppTypography.titleMedium.copyWith(
                                  color: isAvailable
                                      ? AppColors.textPrimary
                                      : AppColors.textMuted,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${item.packSize} • Qty: ${item.quantity} (${item.crateCount} crates)',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              if (!isAvailable) ...[
                                const SizedBox(height: AppSpacing.xs),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: AppSpacing.sm,
                                    vertical: AppSpacing.xxs,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.statusErrorContainer,
                                    borderRadius: AppRadius.radiusPill,
                                  ),
                                  child: Text(
                                    'Currently unavailable • Dawn quota full',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.onStatusError,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        // Line Price
                        Text(
                          '₹${lineTotal.toStringAsFixed(2)}',
                          style: AppTypography.titleMedium.copyWith(
                            color: isAvailable
                                ? AppColors.primary
                                : AppColors.textMuted,
                            fontWeight: FontWeight.w700,
                            decoration: isAvailable
                                ? null
                                : TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ),
                  );
                }),

                const SizedBox(height: AppSpacing.md),

                // 4. Summary Breakdown Card
                Container(
                  padding: const EdgeInsets.all(AppSpacing.base),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: AppRadius.radiusLg,
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Previous order total',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Text(
                            '₹${widget.pastOrder.subtotal.toStringAsFixed(2)}',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textMuted,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Updated available total',
                                style: AppTypography.titleMedium.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              Text(
                                '$selectedCount items selected',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '₹${updatedTotal.toStringAsFixed(2)}',
                            style: AppTypography.headlineMedium.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: AppSpacing.lg),
                      Row(
                        children: [
                          const Icon(
                            Icons.wb_sunny_rounded,
                            size: 16,
                            color: AppColors.secondary,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Tomorrow 5:30 AM dawn drop',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'Commercial Non-GST Farm Bill • Prices confirmed at checkout',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textMuted,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Sticky Footer Actions
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: AppColors.borderSubtle),
              ),
            ),
            child: Column(
              children: [
                YogButton(
                  label: 'Add available items to cart · ₹${updatedTotal.toStringAsFixed(2)}',
                  icon: const Icon(Icons.add_shopping_cart_rounded, size: 18),
                  isFullWidth: true,
                  height: 50,
                  onPressed: selectedCount == 0
                      ? null
                      : () {
                          // Clone selected items into cart
                          final cartNotifier = ref.read(cartProvider.notifier);
                          for (final item in widget.pastOrder.items) {
                            if (_selectedItemIds[item.productId] == true) {
                              final product = mockProducts.firstWhere(
                                (p) => p.id == item.productId,
                              );
                              cartNotifier.setQuantity(product, item.quantity);
                            }
                          }

                          Navigator.of(context).pop();

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                '$selectedCount items added to your morning basket!',
                              ),
                              backgroundColor: AppColors.primary,
                              action: SnackBarAction(
                                label: 'View Cart',
                                textColor: AppColors.secondaryLight,
                                onPressed: () {
                                  context.push('/cart');
                                },
                              ),
                            ),
                          );
                        },
                ),
                const SizedBox(height: AppSpacing.xs),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: Text(
                    'Cancel',
                    style: AppTypography.labelLarge.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
