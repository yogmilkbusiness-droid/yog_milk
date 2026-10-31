import 'package:flutter/material.dart';
import '../design_system/tokens/app_colors.dart';
import '../design_system/tokens/app_radius.dart';
import '../design_system/tokens/app_spacing.dart';
import '../design_system/tokens/app_typography.dart';
import '../design_system/widgets/yog_primary_button.dart';
import 'app_exception.dart';

/// Error boundary widget displaying user-friendly error state with retry.
class ErrorBoundary extends StatelessWidget {
  final Object error;
  final VoidCallback? onRetry;
  final String? customTitle;

  const ErrorBoundary({
    super.key,
    required this.error,
    this.onRetry,
    this.customTitle,
  });

  @override
  Widget build(BuildContext context) {
    final title = customTitle ?? _resolveTitle(error);
    final description = _resolveDescription(error);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.xl),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: AppRadius.radiusLg,
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: const BoxDecoration(
                  color: AppColors.statusErrorContainer,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.warning_amber_rounded,
                  color: AppColors.statusError,
                  size: 36,
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                title,
                textAlign: TextAlign.center,
                style: AppTypography.headlineSmall.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                description,
                textAlign: TextAlign.center,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              if (onRetry != null) ...[
                const SizedBox(height: AppSpacing.lg),
                YogPrimaryButton(
                  label: 'Try Again',
                  onPressed: onRetry,
                  isFullWidth: false,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  String _resolveTitle(Object error) {
    if (error is ScheduleClosedException) {
      return 'Ordering Window Closed';
    }
    if (error is PendingPaymentBlockedException) {
      return 'Pending Payment Restriction';
    }
    if (error is UnapprovedRetailerException) {
      return 'Account Under Verification';
    }
    if (error is NetworkException) {
      return 'Connection Error';
    }
    return 'Something Went Wrong';
  }

  String _resolveDescription(Object error) {
    if (error is AppException) {
      return error.message;
    }
    return error.toString();
  }
}
