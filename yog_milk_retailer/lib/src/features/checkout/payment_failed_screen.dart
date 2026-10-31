import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/order_controller.dart';

/// Payment Failed Screen matching Stitch reference:
/// `yog_milk_payment_failed`
class PaymentFailedScreen extends ConsumerWidget {
  const PaymentFailedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartState = ref.watch(cartProvider);
    final authState = ref.watch(authControllerProvider);
    final ordersNotifier = ref.read(ordersProvider.notifier);
    final retailer = authState.profile;
    final address = retailer?.deliveryAddress ?? 'Shop No. 4, Anand Nagar, Kothrud, Pune';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: AppColors.primary),
          onPressed: () => context.go('/cart'),
        ),
        title: Text(
          'Payment Status',
          style: AppTypography.titleMedium.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  const SizedBox(height: AppSpacing.xxl),
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.statusErrorContainer,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.cancel_rounded,
                      color: AppColors.statusError,
                      size: 48,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Text(
                    'Payment Unsuccessful',
                    style: AppTypography.headlineSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    'Your bank or payment app could not complete the transaction. No money was deducted from your account.',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Troubleshooting Guidance Card
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: AppRadius.radiusXl,
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.lightbulb_outline_rounded,
                              color: AppColors.secondary,
                              size: 18,
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            Text(
                              'What you can do:',
                              style: AppTypography.titleSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        _buildTipRow('Switch to Cash on Delivery (COD) for zero payment risk.'),
                        _buildTipRow('Check your UPI daily transaction limit or bank server status.'),
                        _buildTipRow('Try paying using a different UPI app (PhonePe/GPay).'),
                      ],
                    ),
                  ),
                ],
              ),

              // Bottom Actions
              Column(
                children: [
                  YogButton(
                    label: 'Switch to Cash on Delivery (COD)',
                    icon: const Icon(Icons.payments_outlined, size: 18),
                    onPressed: cartState.isEmpty
                        ? null
                        : () {
                            final newOrder = ordersNotifier.createOrder(
                              cartItems: cartState.items,
                              paymentMethod: 'COD',
                              deliveryAddress: address,
                              isOnlinePaid: false,
                            );

                            ref.read(cartProvider.notifier).clearCart();
                            context.go('/orders/${newOrder.id}/success');
                          },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  YogButton.outline(
                    label: 'Retry Online Payment',
                    icon: const Icon(Icons.refresh_rounded, size: 18),
                    onPressed: () => context.pop(),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  TextButton(
                    onPressed: () => context.go('/cart'),
                    child: Text(
                      'Back to Morning Basket',
                      style: AppTypography.labelMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTipRow(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 6),
            width: 5,
            height: 5,
            decoration: const BoxDecoration(
              color: AppColors.secondary,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

