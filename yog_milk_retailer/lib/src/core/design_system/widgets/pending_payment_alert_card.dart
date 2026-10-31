import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

/// Debt restriction alert banner.
/// Enforces Business Rule 4.4: The "One Pending-Payment" Ordering Restriction.
/// A retailer cannot place a new order if any prior order has Payment Status = PENDING.
class PendingPaymentAlertCard extends StatelessWidget {
  final String orderCode;
  final double pendingAmount;
  final String paymentMethod; // e.g. "Cash on Delivery (COD)"
  final VoidCallback onViewOrder;

  const PendingPaymentAlertCard({
    super.key,
    required this.orderCode,
    required this.pendingAmount,
    required this.paymentMethod,
    required this.onViewOrder,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.statusErrorContainer,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: const Color(0xFFFECACA), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.error_outline_rounded,
                color: AppColors.statusError,
                size: 24,
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  'Pending Payment Restriction',
                  style: AppTypography.titleMedium.copyWith(
                    color: AppColors.onStatusError,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xxs,
                ),
                decoration: BoxDecoration(
                  color: AppColors.statusError,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  '₹${pendingAmount.toStringAsFixed(2)} DUE',
                  style: AppTypography.labelSmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'New order submissions are temporarily paused. You have an outstanding balance on Order #$orderCode ($paymentMethod). Once this payment is recorded by our accounts team, your ordering capability will resume immediately.',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.onStatusError,
              height: 1.4,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            width: double.infinity,
            height: 38,
            child: OutlinedButton(
              onPressed: onViewOrder,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.statusError,
                side: const BorderSide(
                  color: AppColors.statusError,
                  width: 1.2,
                ),
                shape: const RoundedRectangleBorder(
                  borderRadius: AppRadius.radiusMd,
                ),
                padding: EdgeInsets.zero,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'View Order #$orderCode Details',
                    style: AppTypography.labelMedium.copyWith(
                      color: AppColors.statusError,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  const Icon(
                    Icons.arrow_forward_rounded,
                    size: 16,
                    color: AppColors.statusError,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
