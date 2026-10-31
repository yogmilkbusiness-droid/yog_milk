import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/operational_gate_banner.dart';
import '../../core/design_system/widgets/pending_payment_alert_card.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/design_system/widgets/yog_confirmation_dialog.dart';
import '../../core/design_system/widgets/yog_empty_state.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/mock_schedule_repository.dart';
import '../../core/mock_engine/seed/mock_orders.dart';

/// Shopping Cart / Morning Basket Screen matching Stitch references:
/// - `yog_milk_cart`
/// - `yog_milk_cart_marathi`
/// - Non-GST Commercial Billing (Rule 4.5)
/// - Operational Gate Enforcement (Rule 4.1)
/// - One-Pending Payment Restriction (Rule 4.4)
class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final cartState = ref.watch(cartProvider);
    final cartNotifier = ref.read(cartProvider.notifier);
    final scheduleState = ref.watch(scheduleProvider);
    final authState = ref.watch(authControllerProvider);

    final retailer = authState.profile;
    final shopName = retailer?.businessName ?? 'Om Sai Dairy & Sweets';
    final address = retailer?.deliveryAddress ?? 'Shop No. 4, Anand Nagar, Kothrud, Pune';
    final hasPendingBlock = retailer?.hasPendingPaymentBlock ?? false;

    final isOrderingAllowed = scheduleState.isWindowOpen && !hasPendingBlock;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.yourBasket,
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            Text(
              '${cartState.totalUnits} ${l10n.itemsReserved}',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.sm,
              vertical: 4,
            ),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: AppRadius.radiusPill,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.wb_twilight_rounded,
                  color: AppColors.secondary,
                  size: 14,
                ),
                const SizedBox(width: 4),
                Text(
                  'Dawn 5:30 AM',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          if (cartState.isNotEmpty)
            IconButton(
              icon: const Icon(
                Icons.delete_sweep_outlined,
                color: AppColors.textMuted,
              ),
              tooltip: l10n.clearCart,
              onPressed: () {
                YogConfirmationDialog.show(
                  context,
                  title: l10n.clearCart,
                  message:
                      'Are you sure you want to remove all items from your morning basket?',
                  confirmLabel: 'Clear All',
                  isDestructive: true,
                ).then((confirmed) {
                  if (confirmed == true) {
                    cartNotifier.clearCart();
                  }
                });
              },
            ),
        ],
      ),
      bottomNavigationBar: cartState.isEmpty
          ? null
          : _buildStickyCheckoutBar(
              context,
              cartState,
              isOrderingAllowed,
              scheduleState.isWindowOpen,
              hasPendingBlock,
              l10n,
            ),
      body: cartState.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.xxl),
                child: YogEmptyState(
                  title: l10n.emptyCartTitle,
                  message: l10n.emptyCartDesc,
                  icon: Icons.shopping_basket_outlined,
                  actionLabel: l10n.browseCatalog,
                  onAction: () {
                    context.go('/catalog');
                  },
                ),
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(AppSpacing.base),
              children: [
                // 1. Operational Gate Banner (Rule 4.1)
                OperationalGateBanner(
                  isOpen: scheduleState.isWindowOpen,
                  closesAtTime: scheduleState.closesAtDisplay,
                  nextOpenTime: scheduleState.nextOpenDisplay,
                ),
                const SizedBox(height: AppSpacing.sm),

                // 2. Pending Payment Debt Restriction Notice (Rule 4.4)
                if (hasPendingBlock) ...[
                  PendingPaymentAlertCard(
                    orderCode: mockActiveOrder.orderCode,
                    pendingAmount: mockActiveOrder.totalPayable,
                    paymentMethod: 'Cash on Delivery (COD)',
                    onViewOrder: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Opening pending COD order details...'),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                ],

                // 3. Section Heading
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'RESERVED FRESH ITEMS (${cartState.itemCount})',
                      style: AppTypography.labelMedium.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.verified_rounded,
                          size: 14,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'A2 Sattvic Batch',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                // 4. Cart Items List
                ...cartState.items.map((item) {
                  return _buildCartItemCard(context, item, cartNotifier);
                }),
                const SizedBox(height: AppSpacing.sm),

                // 5. Add More Items Prompt Link
                InkWell(
                  onTap: () => context.go('/catalog'),
                  borderRadius: AppRadius.radiusLg,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                      vertical: AppSpacing.md,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: AppRadius.radiusLg,
                      border: Border.all(
                        color: AppColors.primary.withValues(alpha: 0.3),
                        style: BorderStyle.solid,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.add_circle_outline_rounded,
                          color: AppColors.secondary,
                          size: 20,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Text(
                          l10n.addMoreItems,
                          style: AppTypography.labelMedium.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // 6. Dawn Delivery Destination Card
                _buildDeliveryDestinationCard(shopName, address, l10n),
                const SizedBox(height: AppSpacing.lg),

                // 7. Commercial Non-GST Bill Summary Card (Rule 4.5)
                _buildBillSummaryCard(cartState, l10n),
                const SizedBox(height: AppSpacing.md),

                // 8. Farm Purity Guarantee Note
                _buildPurityNotice(),
                const SizedBox(height: AppSpacing.md),

                // 9. Sattvic Purity Trust Marks
                _buildTrustMarks(),
                const SizedBox(height: 100), // Spacing for sticky checkout bar
              ],
            ),
    );
  }

  Widget _buildCartItemCard(
    BuildContext context,
    CartItemEntity item,
    CartNotifier cartNotifier,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail with pack size
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Stack(
              children: [
                const Center(
                  child: Icon(
                    Icons.water_drop_rounded,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                Positioned(
                  bottom: 2,
                  right: 2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 4,
                      vertical: 1,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: AppRadius.radiusPill,
                    ),
                    child: Text(
                      item.packSize.split(' ').first,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.md),

          // Details & Stepper
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        item.productName,
                        style: AppTypography.titleMedium.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline_rounded,
                        color: AppColors.textMuted,
                        size: 18,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () {
                        cartNotifier.removeItem(item.productId);
                      },
                    ),
                  ],
                ),
                Text(
                  '${item.packSize} • ${item.crateCount} crates (${item.looseCount} loose)',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Price and Stepper
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '₹${item.lineTotal.toStringAsFixed(2)}',
                          style: AppTypography.titleMedium.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          '₹${item.unitPrice.toStringAsFixed(2)} / unit',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textMuted,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),

                    // Stepper
                    Container(
                      height: 32,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow,
                        borderRadius: AppRadius.radiusMd,
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove, size: 14),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(minWidth: 28),
                            onPressed: () {
                              cartNotifier.updateItemQuantity(
                                item.productId,
                                item.quantity - 1,
                              );
                            },
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: Text(
                              '${item.quantity}',
                              style: AppTypography.titleSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add, size: 14),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(minWidth: 28),
                            onPressed: () {
                              cartNotifier.updateItemQuantity(
                                item.productId,
                                item.quantity + 1,
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveryDestinationCard(
    String shopName,
    String address,
    AppLocalizations l10n,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.location_on_rounded,
                color: AppColors.primary,
                size: 18,
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                l10n.deliveryDestination,
                style: AppTypography.titleSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            shopName,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            address,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const Divider(height: AppSpacing.base),
          Row(
            children: [
              const Icon(
                Icons.access_time_rounded,
                size: 14,
                color: AppColors.secondary,
              ),
              const SizedBox(width: 4),
              Text(
                'Scheduled Dawn Slot: 05:30 AM – 06:15 AM',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBillSummaryCard(CartState cart, AppLocalizations l10n) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.receipt_long_rounded,
                    color: AppColors.primary,
                    size: 18,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Bill Summary',
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: 2,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  '${cart.itemCount} Items',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),

          // Items Subtotal
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l10n.itemsSubtotal,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                '₹${cart.subtotal.toStringAsFixed(2)}',
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),

          // Delivery Charge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    l10n.dawnDelivery,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 4,
                      vertical: 1,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerHigh,
                      borderRadius: AppRadius.radiusPill,
                    ),
                    child: Text(
                      'Direct Farm',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontSize: 9,
                      ),
                    ),
                  ),
                ],
              ),
              Text(
                cart.deliveryFee == 0
                    ? l10n.free
                    : '₹${cart.deliveryFee.toStringAsFixed(2)}',
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w700,
                  color: cart.deliveryFee == 0
                      ? AppColors.statusSuccess
                      : AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),

          // Cold chain Packaging
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l10n.packagingColdChain,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                '₹0.00',
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.lg),

          // Total to Pay
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l10n.totalToPay,
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    'Commercial Non-GST Bill (Rule 4.5)',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
              Text(
                '₹${cart.totalPayable.toStringAsFixed(2)}',
                style: AppTypography.headlineMedium.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPurityNotice() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh.withValues(alpha: 0.5),
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.auto_awesome_rounded,
            color: AppColors.secondary,
            size: 18,
          ),
          const SizedBox(width: AppSpacing.xs),
          Expanded(
            child: Text(
              'Purity Guarantee: Direct morning milking from Satara & Nashik native herds, chilled to 4°C within 45 mins. Non-GST commercial agricultural invoice generated upon dispatch.',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
                fontSize: 11,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustMarks() {
    return Row(
      children: [
        _buildTrustItem(Icons.verified_user_rounded, '100% A2 Tested', 'Zero Oxytocin'),
        const SizedBox(width: AppSpacing.xs),
        _buildTrustItem(Icons.thermostat_rounded, '4°C Cold Chain', 'Never Broken'),
        const SizedBox(width: AppSpacing.xs),
        _buildTrustItem(Icons.agriculture_rounded, 'Farm Fresh', 'Direct Supply'),
      ],
    );
  }

  Widget _buildTrustItem(IconData icon, String title, String subtitle) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.xs,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: AppRadius.radiusMd,
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(height: 2),
            Text(
              title,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 10,
              ),
              textAlign: TextAlign.center,
            ),
            Text(
              subtitle,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 9,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStickyCheckoutBar(
    BuildContext context,
    CartState cart,
    bool isOrderingAllowed,
    bool isWindowOpen,
    bool hasPendingBlock,
    AppLocalizations l10n,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: AppColors.borderSubtle),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x10051256),
            blurRadius: 16,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${cart.totalUnits} items (${cart.totalCrates} crates)',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                Text(
                  '₹${cart.totalPayable.toStringAsFixed(2)}',
                  style: AppTypography.headlineSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
            const SizedBox(width: AppSpacing.base),
            Expanded(
              child: YogButton(
                label: !isWindowOpen
                    ? 'Ordering Closed'
                    : hasPendingBlock
                        ? 'Pending Debt Block'
                        : '${l10n.checkout} · ₹${cart.totalPayable.toStringAsFixed(2)}',
                icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                height: 50,
                onPressed: !isOrderingAllowed
                    ? null
                    : () {
                        context.push('/checkout');
                      },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
