import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';
import 'crate_quantity_stepper.dart';
import 'yog_button.dart';

/// B2B Wholesale Dairy Product Card.
/// Implements Stitch visual layout with crate calculations, Fat/SNF tags, and stepper.
class YogProductCard extends StatelessWidget {
  final String title;
  final String packSize;
  final double wholesalePrice;
  final int unitsPerCrate;
  final double? fatPercentage;
  final double? snfPercentage;
  final int currentQuantity;
  final ValueChanged<int> onQuantityChanged;
  final bool isAvailable;
  final VoidCallback? onQuickAdd;
  final VoidCallback? onTap;

  const YogProductCard({
    super.key,
    required this.title,
    required this.packSize,
    required this.wholesalePrice,
    required this.unitsPerCrate,
    this.fatPercentage,
    this.snfPercentage,
    required this.currentQuantity,
    required this.onQuantityChanged,
    this.isAvailable = true,
    this.onQuickAdd,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cratePrice = wholesalePrice * unitsPerCrate;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(
          color: currentQuantity > 0
              ? AppColors.primary
              : AppColors.borderSubtle,
          width: currentQuantity > 0 ? 1.5 : 1.0,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08051256),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadius.radiusLg,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top row: Pack Size badge & Availability
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm,
                        vertical: AppSpacing.xxs,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerHigh,
                        borderRadius: AppRadius.radiusPill,
                      ),
                      child: Text(
                        packSize,
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    if (!isAvailable)
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
                          'Out of Stock',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.onStatusError,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                // Product Title
                Text(
                  title,
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),

                // Fat & SNF badges (Dairy Industry Standard)
                if (fatPercentage != null && snfPercentage != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                    child: Text(
                      '${fatPercentage!.toStringAsFixed(1)}% FAT • ${snfPercentage!.toStringAsFixed(1)}% SNF',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.secondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),

                // Crate rule subtitle
                Text(
                  '1 Crate = $unitsPerCrate pkts (₹${cratePrice.toStringAsFixed(2)})',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const Divider(height: AppSpacing.lg),

                // Bottom row: Price and Stepper or Quick Add
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '₹${wholesalePrice.toStringAsFixed(2)}',
                          style: AppTypography.metricMedium,
                        ),
                        Text(
                          'Wholesale / unit',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textMuted,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                    if (isAvailable) ...[
                      if (currentQuantity == 0)
                        SizedBox(
                          height: 36,
                          child: YogButton(
                            label: '+ Crate',
                            variant: YogButtonVariant.outline,
                            height: 36,
                            isFullWidth: false,
                            onPressed:
                                onQuickAdd ??
                                () => onQuantityChanged(unitsPerCrate),
                          ),
                        )
                      else
                        CrateQuantityStepper(
                          quantity: currentQuantity,
                          onChanged: onQuantityChanged,
                          unitsPerCrate: unitsPerCrate,
                        ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
