import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

/// Operational Gate Banner communicating the active status of the ordering window.
/// Enforces Business Rule 4.1: Automated Recurring Ordering Schedule (e.g. 07:00 to 17:00 IST).
class OperationalGateBanner extends StatelessWidget {
  final bool isOpen;
  final String? closesAtTime; // e.g. "05:00 PM"
  final String? nextOpenTime; // e.g. "Tomorrow at 07:00 AM"
  final VoidCallback? onInfoTap;

  const OperationalGateBanner({
    super.key,
    required this.isOpen,
    this.closesAtTime,
    this.nextOpenTime,
    this.onInfoTap,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isOpen
        ? AppColors.statusSuccessContainer
        : AppColors.statusErrorContainer;
    final borderColor = isOpen
        ? const Color(0xFF86EFAC)
        : const Color(0xFFFECACA);
    final iconColor = isOpen ? AppColors.statusSuccess : AppColors.statusError;
    final textColor = isOpen
        ? AppColors.onStatusSuccess
        : AppColors.onStatusError;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: AppSpacing.md,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: borderColor, width: 1.2),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            isOpen ? Icons.check_circle_outline : Icons.lock_clock_outlined,
            color: iconColor,
            size: 22,
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Text(
                      isOpen
                          ? 'Ordering Window Open'
                          : 'Ordering Window Closed',
                      style: AppTypography.titleMedium.copyWith(
                        color: textColor,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.xxs),
                Text(
                  isOpen
                      ? 'Orders accepted until ${closesAtTime ?? '05:00 PM'}. Fresh morning dispatch guaranteed.'
                      : 'The ordering window is closed. We’ll notify you when ordering opens again (${nextOpenTime ?? 'Tomorrow at 07:00 AM'}).',
                  style: AppTypography.bodySmall.copyWith(
                    color: textColor.withValues(alpha: 0.9),
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          if (onInfoTap != null)
            IconButton(
              icon: Icon(Icons.info_outline, size: 18, color: textColor),
              onPressed: onInfoTap,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }
}
