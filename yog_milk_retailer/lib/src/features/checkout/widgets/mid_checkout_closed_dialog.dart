import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/design_system/tokens/app_colors.dart';
import '../../../core/design_system/tokens/app_radius.dart';
import '../../../core/design_system/tokens/app_spacing.dart';
import '../../../core/design_system/tokens/app_typography.dart';
import '../../../core/design_system/widgets/yog_button.dart';
import '../../../core/localization/app_localizations.dart';

/// Mid-Checkout Ordering Closed Interception Dialog matching Stitch reference:
/// `yog_milk_mid_checkout_dialog_ordering_closed`
/// Displays a serene bottom-sheet interception when the operational cutoff occurs during checkout.
class MidCheckoutClosedDialog extends StatefulWidget {
  final int savedItemsCount;
  final String nextOpeningDisplay;

  const MidCheckoutClosedDialog({
    super.key,
    required this.savedItemsCount,
    required this.nextOpeningDisplay,
  });

  static Future<void> show(
    BuildContext context, {
    required int savedItemsCount,
    required String nextOpeningDisplay,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      isDismissible: false,
      enableDrag: true,
      builder: (ctx) => MidCheckoutClosedDialog(
        savedItemsCount: savedItemsCount,
        nextOpeningDisplay: nextOpeningDisplay,
      ),
    );
  }

  @override
  State<MidCheckoutClosedDialog> createState() =>
      _MidCheckoutClosedDialogState();
}

class _MidCheckoutClosedDialogState extends State<MidCheckoutClosedDialog> {
  bool _notifyEnabled = true;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        boxShadow: [
          BoxShadow(
            color: Color(0x24051256),
            blurRadius: 28,
            offset: Offset(0, -6),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl, vertical: AppSpacing.base),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Top Drag / Decorative Handle
            Center(
              child: Container(
                width: 48,
                height: 5,
                margin: const EdgeInsets.only(bottom: AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.borderOutline.withValues(alpha: 0.5),
                  borderRadius: AppRadius.radiusPill,
                ),
              ),
            ),

            // Top Sun-Setting / Clock Lotus Emblem
            _buildEmblem(),
            const SizedBox(height: AppSpacing.md),

            // Headline in Playfair Display
            Text(
              l10n.midCheckoutClosedTitle,
              style: AppTypography.headlineLarge.copyWith(
                fontFamily: AppTypography.fontHeading,
                fontWeight: FontWeight.w700,
                fontSize: 20,
                height: 1.35,
                color: AppColors.primary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xs),

            // Reassuring Body Text
            Text(
              '${widget.nextOpeningDisplay}. ${l10n.savedCartMsg} (${widget.savedItemsCount} ${l10n.itemsReserved}).',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
                height: 1.45,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.lg),

            // Next Window Info Box (Warm Milk Cream)
            Container(
              padding: const EdgeInsets.all(AppSpacing.base),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.secondaryLight.withValues(alpha: 0.5),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.wb_sunny_rounded,
                          color: AppColors.secondary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Flexible(
                                  child: Text(
                                    l10n.nextOrderingWindow,
                                    style: AppTypography.titleSmall.copyWith(
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.primary,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.secondaryLight,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    'SCHEDULED',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.secondary,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 9,
                                      letterSpacing: 0.6,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              widget.nextOpeningDisplay,
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: AppSpacing.lg),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            const Icon(
                              Icons.notifications_active_rounded,
                              size: 18,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                l10n.notifyWhenOpens,
                                style: AppTypography.labelMedium.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Switch.adaptive(
                        value: _notifyEnabled,
                        activeTrackColor: AppColors.secondaryLight,
                        activeThumbColor: AppColors.secondaryContainer,
                        onChanged: (val) {
                          setState(() => _notifyEnabled = val);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                val
                                    ? 'Opening bell notification scheduled!'
                                    : 'Opening bell notification muted.',
                              ),
                              duration: const Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Action Buttons Stack
            Column(
              children: [
                // Primary Navy Button: View Saved Cart
                YogButton(
                  label: l10n.viewSavedCart,
                  icon: const Icon(Icons.shopping_cart_outlined, size: 18),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.go('/cart');
                  },
                ),
                const SizedBox(height: AppSpacing.sm),

                // Secondary Outlined Button: Back to Home
                YogButton.outline(
                  label: l10n.backToHome,
                  icon: const Icon(Icons.home_outlined, size: 18),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.go('/home');
                  },
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
          ],
        ),
      ),
    );
  }

  Widget _buildEmblem() {
    return SizedBox(
      width: 80,
      height: 80,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: 76,
            height: 76,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.secondaryLight.withValues(alpha: 0.3),
            ),
          ),
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.surfaceContainerLow,
              border: Border.all(color: const Color(0xFFEDC15A), width: 1.2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x0A051256),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: const Center(
              child: Icon(
                Icons.wb_twilight_rounded,
                size: 32,
                color: AppColors.secondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
