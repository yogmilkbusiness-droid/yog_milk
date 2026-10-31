import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

/// B2B Dairy Crate & Pouch Stepper.
/// Enables dairy shopkeepers to increment by pouch or by full dairy crate (12 pouches).
class CrateQuantityStepper extends StatelessWidget {
  final int quantity;
  final ValueChanged<int> onChanged;
  final int minQuantity;
  final int maxQuantity;
  final int unitsPerCrate;
  final bool showCrateCalculation;

  const CrateQuantityStepper({
    super.key,
    required this.quantity,
    required this.onChanged,
    this.minQuantity = 0,
    this.maxQuantity = 9999,
    this.unitsPerCrate = 12,
    this.showCrateCalculation = true,
  });

  @override
  Widget build(BuildContext context) {
    final crateCount = quantity ~/ unitsPerCrate;
    final looseCount = quantity % unitsPerCrate;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: AppRadius.radiusMd,
            border: Border.all(color: AppColors.borderSubtle, width: 1),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildStepButton(
                icon: Icons.remove,
                onTap: quantity > minQuantity
                    ? () => onChanged(
                        (quantity - 1).clamp(minQuantity, maxQuantity),
                      )
                    : null,
              ),
              Container(
                constraints: const BoxConstraints(minWidth: 44),
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                alignment: Alignment.center,
                child: Text(
                  '$quantity',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
              _buildStepButton(
                icon: Icons.add,
                onTap: quantity < maxQuantity
                    ? () => onChanged(
                        (quantity + 1).clamp(minQuantity, maxQuantity),
                      )
                    : null,
              ),
            ],
          ),
        ),
        if (showCrateCalculation && quantity > 0) ...[
          const SizedBox(height: AppSpacing.xs),
          Text(
            _buildCrateText(crateCount, looseCount),
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.secondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStepButton({
    required IconData icon,
    required VoidCallback? onTap,
  }) {
    final isEnabled = onTap != null;
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadius.radiusMd,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.sm),
        child: Icon(
          icon,
          size: 18,
          color: isEnabled ? AppColors.primary : AppColors.textMuted,
        ),
      ),
    );
  }

  String _buildCrateText(int crates, int loose) {
    if (crates > 0 && loose > 0) {
      return '$crates ${crates == 1 ? 'Crate' : 'Crates'} + $loose loose';
    } else if (crates > 0) {
      return '$crates ${crates == 1 ? 'Crate' : 'Crates'}';
    } else {
      return '$loose loose pkts';
    }
  }
}
