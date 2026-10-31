import 'package:flutter/material.dart';
import '../tokens/app_colors.dart';
import '../tokens/app_radius.dart';
import '../tokens/app_spacing.dart';
import '../tokens/app_typography.dart';

enum YogButtonVariant { primary, secondary, outline, text, destructive }

/// Comprehensive, typed Yog Milk Button component supporting all variants.
class YogButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final YogButtonVariant variant;
  final bool isLoading;
  final Widget? icon;
  final double height;
  final bool isFullWidth;

  const YogButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = YogButtonVariant.primary,
    this.isLoading = false,
    this.icon,
    this.height = 48.0,
    this.isFullWidth = true,
  });

  const YogButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.height = 48.0,
    this.isFullWidth = true,
  }) : variant = YogButtonVariant.secondary;

  const YogButton.outline({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.height = 48.0,
    this.isFullWidth = true,
  }) : variant = YogButtonVariant.outline;

  const YogButton.text({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.height = 40.0,
    this.isFullWidth = false,
  }) : variant = YogButtonVariant.text;

  const YogButton.destructive({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.height = 48.0,
    this.isFullWidth = true,
  }) : variant = YogButtonVariant.destructive;

  @override
  Widget build(BuildContext context) {
    final colors = _resolveColors();

    final buttonContent = isLoading
        ? SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2.2,
              valueColor: AlwaysStoppedAnimation<Color>(colors.fg),
            ),
          )
        : Row(
            mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                icon!,
                const SizedBox(width: AppSpacing.sm),
              ],
              Flexible(
                child: Text(
                  label,
                  style: AppTypography.labelLarge.copyWith(
                    color: colors.fg,
                    letterSpacing: 0.2,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
            ],
          );

    return SizedBox(
      height: height,
      width: isFullWidth ? double.infinity : null,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.bg,
          foregroundColor: colors.fg,
          minimumSize: Size(isFullWidth ? double.infinity : 64, height),
          disabledBackgroundColor: colors.bg.withValues(alpha: 0.5),
          disabledForegroundColor: colors.fg.withValues(alpha: 0.7),
          side: colors.border != null
              ? BorderSide(color: colors.border!, width: 1.5)
              : BorderSide.none,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
        ),
        child: buttonContent,
      ),
    );
  }

  _ButtonColorConfig _resolveColors() {
    switch (variant) {
      case YogButtonVariant.primary:
        return const _ButtonColorConfig(
          bg: AppColors.primary,
          fg: Colors.white,
        );
      case YogButtonVariant.secondary:
        return const _ButtonColorConfig(
          bg: AppColors.secondary,
          fg: Colors.white,
        );
      case YogButtonVariant.outline:
        return const _ButtonColorConfig(
          bg: Colors.white,
          fg: AppColors.primary,
          border: AppColors.borderOutline,
        );
      case YogButtonVariant.text:
        return const _ButtonColorConfig(
          bg: Colors.transparent,
          fg: AppColors.primary,
        );
      case YogButtonVariant.destructive:
        return const _ButtonColorConfig(
          bg: AppColors.statusError,
          fg: Colors.white,
        );
    }
  }
}

class _ButtonColorConfig {
  final Color bg;
  final Color fg;
  final Color? border;

  const _ButtonColorConfig({required this.bg, required this.fg, this.border});
}
