import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

enum NotificationType { order, delivery, payment, schedule, announcement }

/// Push / In-app notification list tile.
class YogNotificationTile extends StatelessWidget {
  final String title;
  final String message;
  final String timestamp;
  final NotificationType type;
  final bool isRead;
  final VoidCallback onTap;

  const YogNotificationTile({
    super.key,
    required this.title,
    required this.message,
    required this.timestamp,
    this.type = NotificationType.order,
    this.isRead = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final typeConfig = _resolveTypeConfig();

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: isRead ? Colors.white : AppColors.surfaceContainerLow,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(
          color: isRead ? AppColors.borderSubtle : AppColors.borderOutline,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadius.radiusMd,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: typeConfig.color.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    typeConfig.icon,
                    color: typeConfig.color,
                    size: 20,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: AppTypography.titleSmall.copyWith(
                                fontWeight: isRead
                                    ? FontWeight.w600
                                    : FontWeight.w800,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          if (!isRead)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                      Text(
                        message,
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.35,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        timestamp,
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
        ),
      ),
    );
  }

  _TypeConfig _resolveTypeConfig() {
    switch (type) {
      case NotificationType.order:
        return const _TypeConfig(
          icon: Icons.receipt_long_outlined,
          color: AppColors.primary,
        );
      case NotificationType.delivery:
        return const _TypeConfig(
          icon: Icons.local_shipping_outlined,
          color: AppColors.statusInfo,
        );
      case NotificationType.payment:
        return const _TypeConfig(
          icon: Icons.payments_outlined,
          color: AppColors.statusSuccess,
        );
      case NotificationType.schedule:
        return const _TypeConfig(
          icon: Icons.lock_clock_outlined,
          color: AppColors.statusWarning,
        );
      case NotificationType.announcement:
        return const _TypeConfig(
          icon: Icons.campaign_outlined,
          color: AppColors.secondary,
        );
    }
  }
}

class _TypeConfig {
  final IconData icon;
  final Color color;

  const _TypeConfig({required this.icon, required this.color});
}
