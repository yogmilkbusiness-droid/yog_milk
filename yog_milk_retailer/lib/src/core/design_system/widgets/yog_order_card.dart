import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';
import 'yog_button.dart';
import 'yog_status_badge.dart';

/// Reusable Order Card for Orders history and recent orders feed.
class YogOrderCard extends StatelessWidget {
  final String orderCode;
  final String formattedDate;
  final String orderStatus;
  final String paymentStatus;
  final String itemsSummary;
  final double totalAmount;
  final String paymentMethod;
  final VoidCallback onViewDetails;

  const YogOrderCard({
    super.key,
    required this.orderCode,
    required this.formattedDate,
    required this.orderStatus,
    required this.paymentStatus,
    required this.itemsSummary,
    required this.totalAmount,
    required this.paymentMethod,
    required this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    final isPaymentPending = paymentStatus.toUpperCase() == 'PENDING';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(
          color: isPaymentPending
              ? const Color(0xFFFDE68A)
              : AppColors.borderSubtle,
          width: 1.2,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Row 1: Order Code, Date & Order Status Badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '#$orderCode',
                      style: AppTypography.titleSmall.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                    ),
                    Text(
                      formattedDate,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
                YogStatusBadge(status: orderStatus),
              ],
            ),
            const Divider(height: AppSpacing.lg),

            // Row 2: Items Summary
            Text(
              itemsSummary,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textPrimary,
                height: 1.4,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppSpacing.md),

            // Row 3: Payment status and Amount
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          '$paymentMethod • ',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        YogStatusBadge(
                          status: paymentStatus,
                          customLabel: isPaymentPending
                              ? 'Payment Due'
                              : 'Paid',
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xxs),
                    Text(
                      '₹${totalAmount.toStringAsFixed(2)}',
                      style: AppTypography.metricMedium,
                    ),
                  ],
                ),
                SizedBox(
                  height: 36,
                  child: YogButton(
                    label: 'Details',
                    variant: YogButtonVariant.outline,
                    height: 36,
                    isFullWidth: false,
                    onPressed: onViewDetails,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
