import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_constants.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/mock_engine/auth_controller.dart';

/// Splash Screen adhering to Stitch reference: yog_milk_splash.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeAnimation;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeAnimation = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

    _scaleAnimation = Tween<double>(
      begin: 0.85,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));

    _controller.forward();

    // 1.5-second simulated session bootstrap
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      final auth = ref.read(authControllerProvider);
      try {
        if (auth.isAuthenticated) {
          context.go('/home');
        } else if (auth.isWaitingApproval) {
          context.go('/approval-pending');
        } else {
          context.go('/onboarding');
        }
      } catch (_) {
        // Safe fallback when running in isolated test without router
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Vedic Dairy Insignia
                      Container(
                        width: 96,
                        height: 96,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primaryContainer,
                          border: Border.all(
                            color: AppColors.secondaryContainer.withValues(
                              alpha: 0.6,
                            ),
                            width: 2.5,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x3D000000),
                              blurRadius: 20,
                              offset: Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Center(
                          child: Icon(
                            Icons.eco_rounded,
                            size: 48,
                            color: AppColors.secondaryContainer,
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // Brand Title
                      Text(
                        AppConstants.appName,
                        style: AppTypography.displayLarge.copyWith(
                          color: Colors.white,
                          letterSpacing: 2.0,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),

                      // Brand Tagline
                      Text(
                        AppConstants.appTagline,
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.onPrimaryContainer,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxl),

                      // Loading indicator
                      const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppColors.secondaryContainer,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Version & Region at bottom
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: AppSpacing.lg,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: AppSpacing.xxs,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: AppRadius.radiusPill,
                        ),
                        child: Text(
                          'v2.0 • Maharashtra Dairy Network',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.onPrimaryContainer,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
