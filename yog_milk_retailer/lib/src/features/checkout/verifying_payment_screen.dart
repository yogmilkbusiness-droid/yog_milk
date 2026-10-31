import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/order_controller.dart';

/// Verifying Payment Screen matching Stitch reference:
/// `yog_milk_verifying_payment`
/// Simulates 2.5s Razorpay payment verification before finalizing order.
class VerifyingPaymentScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic>? checkoutData;

  const VerifyingPaymentScreen({
    super.key,
    this.checkoutData,
  });

  @override
  ConsumerState<VerifyingPaymentScreen> createState() =>
      _VerifyingPaymentScreenState();
}

class _VerifyingPaymentScreenState extends ConsumerState<VerifyingPaymentScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  Timer? _verificationTimer;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();

    // 2.5s Simulated verification timer
    _verificationTimer = Timer(const Duration(milliseconds: 2600), () {
      if (mounted) {
        _completeVerification(isSuccess: true);
      }
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    _verificationTimer?.cancel();
    super.dispose();
  }

  void _completeVerification({required bool isSuccess}) {
    if (!isSuccess) {
      context.pushReplacement('/checkout/failed');
      return;
    }

    final cartItems = (widget.checkoutData?['cartItems'] as List<CartItemEntity>?) ??
        ref.read(cartProvider).items;
    final deliveryAddress = (widget.checkoutData?['deliveryAddress'] as String?) ??
        'Shop No. 4, Anand Nagar, Kothrud, Pune';
    final specialInstructions =
        widget.checkoutData?['specialInstructions'] as String?;

    final ordersNotifier = ref.read(ordersProvider.notifier);
    final newOrder = ordersNotifier.createOrder(
      cartItems: cartItems,
      paymentMethod: 'RAZORPAY_ONLINE',
      deliveryAddress: deliveryAddress,
      specialInstructions: specialInstructions,
      isOnlinePaid: true,
    );

    // Clear shopping cart
    ref.read(cartProvider.notifier).clearCart();

    // Navigate to Order Success Screen
    context.go('/orders/${newOrder.id}/success');
  }

  @override
  Widget build(BuildContext context) {
    final totalAmount = (widget.checkoutData?['totalAmount'] as double?) ??
        ref.watch(cartProvider).totalPayable;

    return PopScope(
      canPop: false, // Prevent accidental dismissal during transaction verification
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Top Header: Minimal Pure Lotus Branding
                Padding(
                  padding: const EdgeInsets.only(top: AppSpacing.lg),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.spa_rounded,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          Text(
                            'Yog Milk',
                            style: AppTypography.titleMedium.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'FROM NATURE TO NOURISH YOU',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textMuted,
                          fontSize: 9,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),

                // Center Meditative Spinner & Messages
                Column(
                  children: [
                    // Meditative Spinner Graphic
                    RotationTransition(
                      turns: _animController,
                      child: Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.primary.withValues(alpha: 0.15),
                            width: 3,
                          ),
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Positioned(
                              top: 6,
                              child: Container(
                                width: 14,
                                height: 14,
                                decoration: const BoxDecoration(
                                  color: AppColors.secondary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                            Container(
                              width: 64,
                              height: 64,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0x10051256),
                                    blurRadius: 10,
                                    offset: Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.water_drop_rounded,
                                color: AppColors.primary,
                                size: 36,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),

                    Text(
                      'Verifying your payment...',
                      style: AppTypography.headlineMedium.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      "Please don't close the app or tap back while we securely verify your dawn batch reservation with Razorpay Gateway.",
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.lg),

                    // Order Details Summary Card
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.base),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: AppRadius.radiusXl,
                        border: Border.all(color: AppColors.borderSubtle),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x06051256),
                            blurRadius: 10,
                            offset: Offset(0, 3),
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
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(
                                      color: AppColors.secondary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Batch Allocation',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.textSecondary,
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
                                  color: AppColors.surfaceContainerHigh,
                                  borderRadius: AppRadius.radiusPill,
                                ),
                                child: Text(
                                  'A2 Pure Fresh Milk',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: AppSpacing.base),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Amount',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Text(
                                '₹${totalAmount.toStringAsFixed(2)}',
                                style: AppTypography.titleMedium.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Method',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.account_balance_wallet_rounded,
                                    size: 14,
                                    color: AppColors.primary,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'UPI / Razorpay Gateway',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Target Drop',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.wb_twilight_rounded,
                                    size: 14,
                                    color: AppColors.secondary,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Tomorrow Dawn 5:30 AM',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.secondary,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                // Bottom Simulated Failure Testing Action
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.base),
                  child: TextButton(
                    onPressed: () {
                      _verificationTimer?.cancel();
                      _completeVerification(isSuccess: false);
                    },
                    child: Text(
                      'Simulate Gateway Failure (Testing Only)',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

