import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

/// Semantic pill badge displaying status with a 6px status dot.
/// Follows the decoupled status definitions in STATUS_DEFINITIONS.md.
class YogStatusBadge extends StatelessWidget {
  final String status;
  final String? customLabel;
  final bool showDot;

  const YogStatusBadge({
    super.key,
    required this.status,
    this.customLabel,
    this.showDot = true,
  });

  @override
  Widget build(BuildContext context) {
    final style = _resolveStatusStyle(status.toUpperCase().trim());
    final displayText = customLabel ?? _formatStatusText(status);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm + 2,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: style.backgroundColor,
        borderRadius: AppRadius.radiusPill,
        border: Border.all(color: style.borderColor, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: style.dotColor,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: AppSpacing.xs + 2),
          ],
          Text(
            displayText,
            style: AppTypography.labelSmall.copyWith(
              color: style.textColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatStatusText(String raw) {
    return raw
        .replaceAll('_', ' ')
        .split(' ')
        .map(
          (w) => w.isEmpty
              ? ''
              : '${w[0].toUpperCase()}${w.substring(1).toLowerCase()}',
        )
        .join(' ');
  }

  _StatusVisuals _resolveStatusStyle(String normalized) {
    switch (normalized) {
      // Success states
      case 'DELIVERED':
      case 'PAID':
      case 'OPEN':
      case 'APPROVED':
      case 'ACTIVE':
        return const _StatusVisuals(
          backgroundColor: AppColors.statusSuccessContainer,
          textColor: AppColors.onStatusSuccess,
          borderColor: Color(0xFF86EFAC),
          dotColor: AppColors.statusSuccess,
        );

      // Warning / Pending states
      case 'PENDING':
      case 'PLACED':
      case 'PROCESSING':
      case 'CONFIRMED':
      case 'WAITING_APPROVAL':
        return const _StatusVisuals(
          backgroundColor: AppColors.statusWarningContainer,
          textColor: AppColors.onStatusWarning,
          borderColor: Color(0xFFFDE68A),
          dotColor: AppColors.statusWarning,
        );

      // Info / Transit states
      case 'OUT_FOR_DELIVERY':
      case 'READY_FOR_DELIVERY':
      case 'PICKED_UP':
      case 'ASSIGNED':
        return const _StatusVisuals(
          backgroundColor: AppColors.statusInfoContainer,
          textColor: AppColors.onStatusInfo,
          borderColor: Color(0xFFBFDBFE),
          dotColor: AppColors.statusInfo,
        );

      // Error / Terminal negative states
      case 'CANCELLED':
      case 'FAILED':
      case 'DELIVERY_FAILED':
      case 'BLOCKED':
      case 'REJECTED':
      case 'CLOSED':
        return const _StatusVisuals(
          backgroundColor: AppColors.statusErrorContainer,
          textColor: AppColors.onStatusError,
          borderColor: Color(0xFFFECACA),
          dotColor: AppColors.statusError,
        );

      // Default Neutral
      case 'NOT_ASSIGNED':
      case 'RETURNED':
      default:
        return const _StatusVisuals(
          backgroundColor: AppColors.statusNeutralContainer,
          textColor: AppColors.onStatusNeutral,
          borderColor: Color(0xFFE5E7EB),
          dotColor: AppColors.statusNeutral,
        );
    }
  }
}

class _StatusVisuals {
  final Color backgroundColor;
  final Color textColor;
  final Color borderColor;
  final Color dotColor;

  const _StatusVisuals({
    required this.backgroundColor,
    required this.textColor,
    required this.borderColor,
    required this.dotColor,
  });
}
