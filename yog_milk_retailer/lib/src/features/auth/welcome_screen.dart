import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_constants.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/design_system/widgets/yog_text_field.dart';
import '../../core/localization/locale_controller.dart';
import '../../core/mock_engine/auth_controller.dart';
import 'mock_google_sign_in_sheet.dart';

/// Welcome / Retailer Sign-In Screen matching Stitch: yog_milk_sign_in.
class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key});

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  final TextEditingController _phoneController = TextEditingController(
    text: '98220 12345',
  );
  String? _phoneError;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _handlePhoneLogin() {
    final raw = _phoneController.text.replaceAll(' ', '').trim();
    if (raw.length < 10) {
      setState(
        () => _phoneError = 'Please enter a valid 10-digit mobile number',
      );
      return;
    }
    setState(() => _phoneError = null);

    // Call mock auth controller
    ref.read(authControllerProvider.notifier).signInWithPhone(raw);
    final auth = ref.read(authControllerProvider);
    if (auth.isAuthenticated) {
      context.go('/home');
    } else {
      context.push('/complete-profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentLocale = ref.watch(localeControllerProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          _buildLanguagePill(currentLocale),
          const SizedBox(width: AppSpacing.base),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Vedic Brand Header
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 72,
                      height: 72,
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.eco_rounded,
                          size: 38,
                          color: AppColors.secondaryContainer,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      AppConstants.appName,
                      style: AppTypography.displayMedium.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xxs),
                    Text(
                      'B2B Wholesale Dairy Retailer Portal',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),

              // Title Card
              Text(
                'Retailer Sign In',
                style: AppTypography.headlineSmall.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppSpacing.xxs),
              Text(
                'Enter your registered dairy booth mobile number to receive an OTP.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Phone Number Field
              YogTextField(
                label: 'Mobile Number',
                hint: '98220 00000',
                controller: _phoneController,
                errorText: _phoneError,
                keyboardType: TextInputType.phone,
                prefixIcon: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                  ),
                  alignment: Alignment.centerLeft,
                  width: 58,
                  child: Text(
                    '+91',
                    style: AppTypography.bodyLarge.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),

              // Primary Continue Button
              YogButton(label: 'Send OTP', onPressed: _handlePhoneLogin),
              const SizedBox(height: AppSpacing.lg),

              // Divider
              Row(
                children: [
                  const Expanded(child: Divider()),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                    ),
                    child: Text(
                      'OR',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Mock Google Sign-In Button
              OutlinedButton(
                onPressed: () => MockGoogleSignInSheet.show(context),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: AppColors.borderSubtle),
                  shape: const RoundedRectangleBorder(
                    borderRadius: AppRadius.radiusMd,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 22,
                      height: 22,
                      decoration: const BoxDecoration(
                        color: Color(0xFF4285F4),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Text(
                          'G',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      'Sign In with Google (1-Tap Mock)',
                      style: AppTypography.labelLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              // Non-GST and B2B Policy Notice
              Center(
                child: Text(
                  'By continuing, you agree to YOG MILK B2B Terms of Supply and Non-GST Commercial Invoicing policies.',
                  textAlign: TextAlign.center,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLanguagePill(Locale currentLocale) {
    return PopupMenuButton<String>(
      icon: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: AppRadius.radiusPill,
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, size: 16, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              currentLocale.languageCode.toUpperCase(),
              style: AppTypography.labelSmall.copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
      onSelected: (code) {
        ref.read(localeControllerProvider.notifier).setLanguageCode(code);
      },
      itemBuilder: (context) => const [
        PopupMenuItem(value: 'en', child: Text('English')),
        PopupMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
        PopupMenuItem(value: 'mr', child: Text('मराठी (Marathi)')),
      ],
    );
  }
}
