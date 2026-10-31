import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';
import 'yog_status_badge.dart';

/// Payment method and status indicator for order cards and checkout.
class YogPaymentIndicator extends StatelessWidget {
  final String paymentMethod; // "COD" | "ONLINE"
  final String paymentStatus; // "PENDING" | "PAID"
  final double? pendingAmount;

  const YogPaymentIndicator({
    super.key,
    required this.paymentMethod,
    required this.paymentStatus,
    this.pendingAmount,
  });

  @override
  Widget build(BuildContext context) {
    final isCod = paymentMethod.toUpperCase().contains('COD');
    final isPaid = paymentStatus.toUpperCase() == 'PAID';

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Method pill
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm,
            vertical: AppSpacing.xxs,
          ),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: AppRadius.radiusSm,
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                isCod
                    ? Icons.payments_outlined
                    : Icons.account_balance_wallet_outlined,
                size: 14,
                color: AppColors.primary,
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                isCod ? 'Cash on Delivery (COD)' : 'Online Payment',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: AppSpacing.sm),

        // Status badge
        YogStatusBadge(
          status: paymentStatus,
          customLabel: isPaid ? 'Paid' : 'Payment Due',
        ),
      ],
    );
  }
}
