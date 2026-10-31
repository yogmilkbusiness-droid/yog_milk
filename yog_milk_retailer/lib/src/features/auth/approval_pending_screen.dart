import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_constants.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/mock_engine/auth_controller.dart';
import 'mock_google_sign_in_sheet.dart';

/// Approval Pending Screen matching Stitch: yog_milk_approval_pending.
class ApprovalPendingScreen extends ConsumerWidget {
  const ApprovalPendingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final shopName = auth.profile?.businessName ?? 'Your Dairy Booth';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Application Status'),
        actions: [
          IconButton(
            icon: const Icon(Icons.swap_horiz_rounded),
            tooltip: 'Switch Mock Account',
            onPressed: () => MockGoogleSignInSheet.show(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: AppSpacing.lg),
                      // Hourglass Container
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLow,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.secondaryContainer.withValues(
                              alpha: 0.5,
                            ),
                            width: 2,
                          ),
                        ),
                        child: const Icon(
                          Icons.hourglass_top_rounded,
                          size: 44,
                          color: AppColors.secondary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.lg),

                      // Verification Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: AppSpacing.xxs,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.statusWarningContainer,
                          borderRadius: AppRadius.radiusPill,
                        ),
                        child: Text(
                          'UNDER VERIFICATION',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.onStatusWarning,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Headline
                      Text(
                        'Application Submitted',
                        style: AppTypography.headlineMedium.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'Registration details for $shopName have been received by YOG MILK Central Operations.',
                        textAlign: TextAlign.center,
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // Reference Card
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.base),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: AppRadius.radiusLg,
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Application Reference',
                                  style: AppTypography.bodySmall,
                                ),
                                Text(
                                  '#APP-2026-7719',
                                  style: AppTypography.titleSmall.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ],
                            ),
                            const Divider(height: AppSpacing.lg),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Expected Turnaround',
                                  style: AppTypography.bodySmall,
                                ),
                                Text(
                                  'Within 24 Hours',
                                  style: AppTypography.titleSmall.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.secondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // 3-Stage Timeline
                      _buildTimeline(),
                      const SizedBox(height: AppSpacing.xl),

                      // Phone Support
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.phone_in_talk_outlined,
                            size: 16,
                            color: AppColors.primary,
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          Text(
                            'Support: ${AppConstants.supportPhone}',
                            style: AppTypography.labelMedium.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Actions
              Column(
                children: [
                  YogButton(
                    label: 'Explore Catalog (View Only)',
                    icon: const Icon(Icons.grid_view_outlined, size: 20),
                    onPressed: () => context.go('/home'),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  YogButton.text(
                    label: 'Switch Account (Mock OAuth)',
                    onPressed: () => MockGoogleSignInSheet.show(context),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimeline() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        children: [
          _buildTimelineItem(
            step: 1,
            title: 'Profile & FSSAI Submitted',
            subtitle: 'Commercial credentials received',
            isCompleted: true,
          ),
          const SizedBox(height: AppSpacing.md),
          _buildTimelineItem(
            step: 2,
            title: 'Operations Review & Route Allocation',
            subtitle: 'Driver route and delivery window assignment in progress',
            isCurrent: true,
          ),
          const SizedBox(height: AppSpacing.md),
          _buildTimelineItem(
            step: 3,
            title: 'Bulk Wholesale Ordering Activated',
            subtitle: 'You will receive an SMS when ordering window opens',
            isUpcoming: true,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required int step,
    required String title,
    required String subtitle,
    bool isCompleted = false,
    bool isCurrent = false,
    bool isUpcoming = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 12,
          backgroundColor: isCompleted
              ? AppColors.statusSuccess
              : isCurrent
              ? AppColors.secondary
              : AppColors.surfaceContainerLow,
          child: isCompleted
              ? const Icon(Icons.check, size: 14, color: Colors.white)
              : Text(
                  '$step',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isCurrent ? Colors.white : AppColors.textMuted,
                  ),
                ),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w700,
                  color: isCurrent
                      ? AppColors.secondary
                      : AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textMuted,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
