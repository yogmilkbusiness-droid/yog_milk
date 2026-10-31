import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/mock_engine/auth_controller.dart';

/// Retailer Business Profile & FSSAI Verification Screen
class BusinessInfoScreen extends ConsumerWidget {
  const BusinessInfoScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authControllerProvider);
    final profile = authState.profile;

    final businessName = profile?.businessName ?? 'Om Sai Dairy & Sweets';
    final ownerName = profile?.ownerName ?? 'Ramesh Patil';
    final phone = profile?.phone ?? '+91 98220 12345';
    const email = 'ramesh.patil.dairy@gmail.com';
    const fssaiLicense = '21522026000412';
    const tradeLicense = 'MH-PN-RET-2024-9912';
    final registeredAddress = profile?.deliveryAddress ??
        'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.businessInfo,
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Business Header Card
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusXl,
              border: Border.all(color: AppColors.borderSubtle),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x06051256),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainerNavy,
                    borderRadius: AppRadius.radiusLg,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.storefront_rounded,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        businessName,
                        style: AppTypography.titleLarge.copyWith(
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE8F5E9),
                              borderRadius: AppRadius.radiusPill,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.verified_rounded,
                                  size: 11,
                                  color: Color(0xFF2E7D32),
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  'FSSAI Verified Retailer',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: const Color(0xFF2E7D32),
                                    fontWeight: FontWeight.w800,
                                    fontSize: 9.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // 2. Regulatory & FSSAI Information
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusXl,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.badge_outlined,
                        color: AppColors.primary, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Regulatory Credentials',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _buildInfoRow(
                  context,
                  label: l10n.fssaiLicNumber,
                  value: fssaiLicense,
                  isCopyable: true,
                ),
                const Divider(height: 16, color: AppColors.borderSubtle),
                _buildInfoRow(
                  context,
                  label: 'Trade Registration',
                  value: tradeLicense,
                  isCopyable: true,
                ),
                const Divider(height: 16, color: AppColors.borderSubtle),
                _buildInfoRow(
                  context,
                  label: 'Proprietor / Owner',
                  value: ownerName,
                ),
                const Divider(height: 16, color: AppColors.borderSubtle),
                _buildInfoRow(
                  context,
                  label: 'Registered Phone',
                  value: phone,
                ),
                const Divider(height: 16, color: AppColors.borderSubtle),
                _buildInfoRow(
                  context,
                  label: 'Email',
                  value: email,
                ),
                const Divider(height: 16, color: AppColors.borderSubtle),
                _buildInfoRow(
                  context,
                  label: 'Registered Shop Address',
                  value: registeredAddress,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // 3. Legal Non-GST Agricultural Supply Notice Card (Rule 4.5 Compliance)
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: const Color(0xFFFBF1DC),
              borderRadius: AppRadius.radiusXl,
              border: Border.all(color: const Color(0xFFE7E2D6)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.shield_outlined,
                      color: AppColors.secondary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        l10n.taxExemptionTitle,
                        style: AppTypography.titleSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  l10n.taxExemptionDesc,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textPrimary,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.8),
                    borderRadius: AppRadius.radiusMd,
                  ),
                  child: Text(
                    'Commercial non-GST delivery memos / farm bills are issued sequentially with FSSAI Reg. No. 11519036000281. No GSTIN, SAC/HSN codes, or tax liabilities are charged or collected.',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontSize: 10,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    BuildContext context, {
    required String label,
    required String value,
    bool isCopyable = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Text(
            label,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          flex: 3,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Flexible(
                child: Text(
                  value,
                  textAlign: TextAlign.end,
                  style: AppTypography.bodyMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
              if (isCopyable) ...[
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: value));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('$label copied to clipboard!'),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: const Icon(
                    Icons.content_copy_rounded,
                    size: 14,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
