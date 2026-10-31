import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/design_system/widgets/yog_dropdown.dart';
import '../../core/design_system/widgets/yog_text_field.dart';
import '../../core/mock_engine/auth_controller.dart';

/// Complete Business Profile / Retailer Registration matching Stitch: yog_milk_complete_profile.
class RetailerRegistrationScreen extends ConsumerStatefulWidget {
  const RetailerRegistrationScreen({super.key});

  @override
  ConsumerState<RetailerRegistrationScreen> createState() =>
      _RetailerRegistrationScreenState();
}

class _RetailerRegistrationScreenState
    extends ConsumerState<RetailerRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();

  final _shopNameController = TextEditingController(
    text: 'Shree Krishna Daily Dairy',
  );
  final _ownerNameController = TextEditingController(text: 'Suresh Shinde');
  final _phoneController = TextEditingController(text: '98220 77665');
  final _addressController = TextEditingController(
    text: 'Shop 2, Karve Road, Deccan',
  );
  final _pincodeController = TextEditingController(text: '411004');
  final _fssaiController = TextEditingController(text: '11522036000192');

  String _selectedArea = 'Deccan / Karve Road';
  bool _isSubmitting = false;

  @override
  void dispose() {
    _shopNameController.dispose();
    _ownerNameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _pincodeController.dispose();
    _fssaiController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    setState(() => _isSubmitting = true);

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      ref
          .read(authControllerProvider.notifier)
          .registerRetailer(
            businessName: _shopNameController.text.trim(),
            ownerName: _ownerNameController.text.trim(),
            phone: '+91 ${_phoneController.text.trim()}',
            deliveryAddress:
                '${_addressController.text.trim()}, Pune ${_pincodeController.text.trim()}',
            city: 'Pune',
            area: _selectedArea,
          );

      context.go('/approval-pending');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Complete Retailer Profile')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Info Banner
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.verified_user_outlined,
                        color: AppColors.primary,
                        size: 24,
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Text(
                          'Authorized B2B supply is restricted to verified milk parlors, grocers, and commercial institutions.',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Section 1: Business Details
                Text(
                  '1. Dairy Booth Identity',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'Dairy Booth / Shop Name',
                  hint: 'e.g. Om Sai Dairy & Sweets',
                  controller: _shopNameController,
                  prefixIcon: const Icon(
                    Icons.storefront_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'Proprietor / Owner Full Name',
                  hint: 'e.g. Ramesh Patil',
                  controller: _ownerNameController,
                  prefixIcon: const Icon(
                    Icons.person_outline,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'Contact Mobile Number',
                  hint: '98220 00000',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: const Icon(
                    Icons.phone_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Section 2: Delivery Logistics
                Text(
                  '2. Morning Delivery Location',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                YogDropdown<String>(
                  label: 'Logistics Route / Delivery Zone',
                  value: _selectedArea,
                  items: const [
                    DropdownMenuItem(
                      value: 'Kothrud / Paud Road',
                      child: Text('Route 1: Kothrud & Paud Road'),
                    ),
                    DropdownMenuItem(
                      value: 'Deccan / Karve Road',
                      child: Text('Route 2: Deccan & Karve Road'),
                    ),
                    DropdownMenuItem(
                      value: 'Hadapsar / Gadital',
                      child: Text('Route 3: Hadapsar & Magarpatta'),
                    ),
                    DropdownMenuItem(
                      value: 'Wakad / Hinjewadi',
                      child: Text('Route 4: Wakad & Hinjewadi'),
                    ),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedArea = val);
                  },
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'Detailed Delivery Address',
                  hint: 'Shop number, building name, nearest landmark',
                  controller: _addressController,
                  maxLines: 2,
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'Pincode',
                  hint: '411038',
                  controller: _pincodeController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: AppSpacing.lg),

                // Section 3: Statutory Credentials
                Text(
                  '3. Food Safety Credentials',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                YogTextField(
                  label: 'FSSAI Registration / License Number',
                  hint: '14-digit FSSAI number (e.g. 11522036000192)',
                  controller: _fssaiController,
                  keyboardType: TextInputType.number,
                  prefixIcon: const Icon(
                    Icons.verified_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Submit CTA
                YogButton(
                  label: 'Submit for Verification',
                  isLoading: _isSubmitting,
                  icon: const Icon(Icons.check_circle_outline, size: 20),
                  onPressed: _handleSubmit,
                ),
                const SizedBox(height: AppSpacing.xl),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
