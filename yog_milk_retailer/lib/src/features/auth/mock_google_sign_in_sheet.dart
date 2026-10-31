import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/seed/mock_retailers.dart';

/// Interactive Mock Google Sign-In Sheet.
/// Allows developers and stakeholders to simulate 1-tap Google OAuth with different retailer states.
class MockGoogleSignInSheet extends ConsumerWidget {
  const MockGoogleSignInSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const MockGoogleSignInSheet(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xxl),
          topRight: Radius.circular(AppRadius.xxl),
        ),
      ),
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.borderOutline.withValues(alpha: 0.5),
                  borderRadius: AppRadius.radiusPill,
                ),
              ),
            ),

            // Header with Google Logo Icon
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: const BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      'G',
                      style: TextStyle(
                        fontFamily: AppTypography.fontBody,
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                        color: Color(0xFF4285F4),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Sign in with Google',
                      style: AppTypography.titleMedium.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'to continue to YOG MILK B2B Platform',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const Divider(height: AppSpacing.xl),

            // Account 1: Om Sai Dairy (Approved, Has Pending COD Block)
            _buildAccountTile(
              context: context,
              ref: ref,
              name: 'Ramesh Patil',
              email: 'ramesh.patil.dairy@gmail.com',
              badge: 'Approved (Has Pending COD)',
              badgeColor: AppColors.statusWarning,
              onTap: () {
                ref
                    .read(authControllerProvider.notifier)
                    .signInWithGoogle(mockRetailerApproved);
                Navigator.of(context).pop();
                context.go('/home');
              },
            ),

            // Account 2: Sunil Shinde (Approved, Clean Account)
            _buildAccountTile(
              context: context,
              ref: ref,
              name: 'Sunil Shinde',
              email: 'sunil.shinde.hadapsar@gmail.com',
              badge: 'Approved (Clean Account)',
              badgeColor: AppColors.statusSuccess,
              onTap: () {
                ref
                    .read(authControllerProvider.notifier)
                    .signInWithGoogle(mockRetailerClean);
                Navigator.of(context).pop();
                context.go('/home');
              },
            ),

            // Account 3: Vinod More (Application Under Review)
            _buildAccountTile(
              context: context,
              ref: ref,
              name: 'Vinod More',
              email: 'vinod.gajanan.needs@gmail.com',
              badge: 'Verification In Progress',
              badgeColor: AppColors.secondary,
              onTap: () {
                ref
                    .read(authControllerProvider.notifier)
                    .signInWithGoogle(mockRetailerPendingApproval);
                Navigator.of(context).pop();
                context.go('/approval-pending');
              },
            ),

            // Account 4: Rajesh Sharma (Account On Hold / Route Verification)
            _buildAccountTile(
              context: context,
              ref: ref,
              name: 'Rajesh Sharma',
              email: 'rajesh.sharma.store@gmail.com',
              badge: 'Account On Hold (Sector Route Restructure)',
              badgeColor: AppColors.secondaryContainer,
              onTap: () {
                ref
                    .read(authControllerProvider.notifier)
                    .signInWithGoogle(mockRetailerOnHold);
                Navigator.of(context).pop();
                context.go('/account-on-hold');
              },
            ),

            // Option 5: Register New Account
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: AppColors.surfaceContainerLow,
                child: Icon(
                  Icons.person_add_outlined,
                  size: 20,
                  color: AppColors.primary,
                ),
              ),
              title: Text(
                'Register a New Retail Booth',
                style: AppTypography.titleSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
              subtitle: Text(
                'Enter shop credentials & FSSAI registration',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
              onTap: () {
                Navigator.of(context).pop();
                context.push('/complete-profile');
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountTile({
    required BuildContext context,
    required WidgetRef ref,
    required String name,
    required String email,
    required String badge,
    required Color badgeColor,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: AppColors.primary,
          child: Text(
            name[0],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        title: Row(
          children: [
            Text(
              name,
              style: AppTypography.titleSmall.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(width: AppSpacing.xs),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
              decoration: BoxDecoration(
                color: badgeColor.withValues(alpha: 0.15),
                borderRadius: AppRadius.radiusPill,
              ),
              child: Text(
                badge,
                style: AppTypography.labelSmall.copyWith(
                  color: badgeColor,
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        subtitle: Text(
          email,
          style: AppTypography.labelSmall.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        trailing: const Icon(
          Icons.chevron_right,
          size: 18,
          color: AppColors.textMuted,
        ),
      ),
    );
  }
}
