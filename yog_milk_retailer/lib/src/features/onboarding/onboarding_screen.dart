import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/localization/locale_controller.dart';

class OnboardingSlide {
  final String title;
  final String description;
  final IconData icon;
  final String tag;

  const OnboardingSlide({
    required this.title,
    required this.description,
    required this.icon,
    required this.tag,
  });
}

/// 3-Slide Onboarding Carousel matching Stitch: yog_milk_welcome_carousel.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<OnboardingSlide> _slides = const [
    OnboardingSlide(
      tag: 'VEDIC PURITY',
      title: 'Pure Dairy Direct from Certified Farms',
      description:
          'A2 Gir Cow & Buffalo milk cold-transported from Satara and Kolhapur. 100% pure, farm-fresh milk with consistent daily fat and SNF testing.',
      icon: Icons.local_florist_outlined,
    ),
    OnboardingSlide(
      tag: 'DAILY RELIABILITY',
      title: 'Guaranteed Morning Booth Dispatch',
      description:
          'Place orders during our automated daily ordering window (07:00 to 17:00 IST). Refrigerated routes arrive at your shop before 06:00 AM.',
      icon: Icons.local_shipping_outlined,
    ),
    OnboardingSlide(
      tag: 'B2B ADVANTAGE',
      title: 'Transparent Crate Rates & Farm Bills',
      description:
          'Wholesale pricing with clear crate economics. Download compliant non-GST commercial invoices directly to your phone for seamless bookkeeping.',
      icon: Icons.receipt_long_outlined,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
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
        child: Column(
          children: [
            // PageView Slider
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (idx) => setState(() => _currentIndex = idx),
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.xl,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Hero Icon Container
                        Container(
                          width: 130,
                          height: 130,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceContainerLow,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.borderSubtle,
                              width: 2,
                            ),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x0A051256),
                                blurRadius: 16,
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Icon(
                            slide.icon,
                            size: 58,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xl),

                        // Tag Pill
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: AppSpacing.xxs,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.secondary.withValues(alpha: 0.1),
                            borderRadius: AppRadius.radiusPill,
                          ),
                          child: Text(
                            slide.tag,
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Title
                        Text(
                          slide.title,
                          textAlign: TextAlign.center,
                          style: AppTypography.displaySmall.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),

                        // Description
                        Text(
                          slide.description,
                          textAlign: TextAlign.center,
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Pagination Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_slides.length, (idx) {
                final isSelected = idx == _currentIndex;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: isSelected ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.borderOutline,
                    borderRadius: AppRadius.radiusPill,
                  ),
                );
              }),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Bottom Action CTAs
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
              child: Column(
                children: [
                  YogButton(
                    label: _currentIndex == _slides.length - 1
                        ? 'Get Started'
                        : 'Continue',
                    onPressed: () {
                      if (_currentIndex < _slides.length - 1) {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        context.go('/welcome');
                      }
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  YogButton.text(
                    label: 'Already a Registered Retailer? Sign In',
                    onPressed: () => context.go('/welcome'),
                  ),
                  const SizedBox(height: AppSpacing.base),
                ],
              ),
            ),
          ],
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
