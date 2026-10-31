import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/seed/mock_retailers.dart';

/// Account On Hold Screen matching Stitch reference:
/// `yog_milk_account_on_hold`
/// Displays a serene, respectful pause state when a retailer's account is temporarily held.
class AccountOnHoldScreen extends ConsumerStatefulWidget {
  const AccountOnHoldScreen({super.key});

  @override
  ConsumerState<AccountOnHoldScreen> createState() => _AccountOnHoldScreenState();
}

class _AccountOnHoldScreenState extends ConsumerState<AccountOnHoldScreen> {
  bool _isCopied = false;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authControllerProvider);
    final retailer = authState.profile ?? mockRetailerOnHold;

    final customerId = retailer.accountCode ?? 'YM-ACC-0942';
    final businessName = retailer.businessName;
    final reason = retailer.holdReason ??
        'Morning route restructuring in your sector / pending dawn verification.';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/welcome');
            }
          },
        ),
        title: Text(
          'Yog Milk',
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline_rounded, color: AppColors.textSecondary),
            tooltip: 'Support Help',
            onPressed: () => _showHelpInfoDialog(context),
          ),
          const SizedBox(width: AppSpacing.xs),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // 1. Serene Ayurvedic Emblem Illustration
              _buildAyurvedicEmblem(),
              const SizedBox(height: AppSpacing.md),

              // 2. Respectful Status Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusPill,
                  border: Border.all(color: AppColors.borderOutline.withValues(alpha: 0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.secondaryContainer,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      l10n.accountOnHoldBadge,
                      style: AppTypography.labelMedium.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // 3. Headline in Playfair Display
              Text(
                l10n.accountPausedHeadline,
                style: AppTypography.headlineLarge.copyWith(
                  fontFamily: AppTypography.fontHeading,
                  fontWeight: FontWeight.w700,
                  fontSize: 22,
                  color: AppColors.primary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.xs),

              // 4. Subtitle
              Text(
                l10n.accountPausedDesc,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.lg),

              // 5. Account Reference Chip with Copy Button
              Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusLg,
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(
                            Icons.badge_outlined,
                            size: 18,
                            color: AppColors.primary,
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text.rich(
                              TextSpan(
                                children: [
                                  TextSpan(
                                    text: '${l10n.customerId}: ',
                                    style: AppTypography.labelMedium.copyWith(
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                  TextSpan(
                                    text: customerId,
                                    style: AppTypography.labelMedium.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      onTap: () {
                        Clipboard.setData(ClipboardData(text: customerId));
                        setState(() => _isCopied = true);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Customer ID $customerId copied to clipboard'),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                        Future.delayed(const Duration(seconds: 3), () {
                          if (mounted) setState(() => _isCopied = false);
                        });
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Row(
                          children: [
                            Icon(
                              _isCopied ? Icons.check_rounded : Icons.content_copy_rounded,
                              size: 14,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _isCopied ? 'Copied' : 'Copy',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // 6. Reason Explanation Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.base),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.borderSubtle),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x06051256),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 34,
                          height: 34,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceContainerLow,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.alt_route_rounded,
                            size: 18,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                l10n.statusDetails.toUpperCase(),
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                reason,
                                style: AppTypography.titleSmall.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w700,
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: AppSpacing.lg),
                    Text(
                      'We have temporarily paused new dispatches for $businessName to complete a sector route restructuring. Your past order history, records, and invoices remain completely safe.',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.verified_outlined,
                            size: 15,
                            color: AppColors.secondary,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Verified Partner Facility · Non-GST Agricultural Supply',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 10.5,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // 7. Action Stack
              Column(
                children: [
                  // Primary Action: WhatsApp Support
                  YogButton(
                    label: l10n.contactWhatsapp,
                    icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Opening WhatsApp support channel (+91 98201 54321)... (Simulated)'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Secondary Action: Call Operations Team
                  YogButton.outline(
                    label: l10n.callOperations,
                    icon: const Icon(Icons.phone_outlined, size: 18),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Connecting to YOG MILK Operations Desk 1800-123-456... (Simulated)'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Tertiary Action: View Past History & Invoices
                  TextButton.icon(
                    icon: const Icon(Icons.receipt_long_rounded, size: 16, color: AppColors.primary),
                    label: Text(
                      l10n.viewPastInvoices,
                      style: AppTypography.labelMedium.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    onPressed: () => context.push('/invoices'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xl),

              // 8. Assurance Footer Note
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.lock_outline_rounded, size: 14, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Flexible(
                    child: Text(
                      'Pure A2 Sattvic Guarantee • Encrypted Account Data',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                'Yog Milk Dairy Operations & Logistics • Sector 14 Dawn Hub',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                  fontSize: 9.5,
                ),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAyurvedicEmblem() {
    return SizedBox(
      width: 140,
      height: 140,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Soft decorative glow halo
          Container(
            width: 130,
            height: 130,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.surfaceContainerLow.withValues(alpha: 0.8),
            ),
          ),
          // Lotus Petal Outer Accent Ring
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              border: Border.all(color: AppColors.secondaryLight, width: 1.5),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x0A051256),
                  blurRadius: 10,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Center(
              // Sacred Drop & Restful State Symbol
              child: Container(
                width: 66,
                height: 66,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.surfaceContainerHigh.withValues(alpha: 0.7),
                ),
                child: const Icon(
                  Icons.pause_circle_filled_rounded,
                  size: 40,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
          // Delicate Lotus Bud Badge (Top Accent)
          Positioned(
            top: 10,
            child: Container(
              width: 26,
              height: 26,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                border: Border.all(color: AppColors.borderSubtle),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x10000000),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: const Icon(
                Icons.spa_rounded,
                size: 14,
                color: Color(0xFFEDC15A),
              ),
            ),
          ),
          // Dawn Sun Droplet (Bottom Accent)
          Positioned(
            bottom: 12,
            child: Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.secondaryLight,
                border: Border.all(color: AppColors.secondary),
              ),
              child: const Icon(
                Icons.wb_twilight_rounded,
                size: 12,
                color: AppColors.secondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showHelpInfoDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.info_outline_rounded, color: AppColors.primary),
            const SizedBox(width: 8),
            Text('Account Support', style: AppTypography.titleMedium),
          ],
        ),
        content: Text(
          'Your account is temporarily placed on hold for route verification. You can continue to view past invoices and payment records. For urgent re-dispatch, please connect with your route coordinator.',
          style: AppTypography.bodySmall,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
