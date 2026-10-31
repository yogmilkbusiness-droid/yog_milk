import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/mock_engine/address_controller.dart';
import '../../core/mock_engine/contracts/address_repository.dart';

/// Address Management & Drop Point Interface
class AddressManagementScreen extends ConsumerStatefulWidget {
  const AddressManagementScreen({super.key});

  @override
  ConsumerState<AddressManagementScreen> createState() =>
      _AddressManagementScreenState();
}

class _AddressManagementScreenState
    extends ConsumerState<AddressManagementScreen> {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final addresses = ref.watch(addressProvider);

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
          l10n.deliveryAddresses,
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Informational Dawn Logistics Banner
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: AppColors.secondaryContainerAmber.withValues(alpha: 0.25),
              borderRadius: AppRadius.radiusLg,
              border: Border.all(
                color: AppColors.secondaryContainerAmber.withValues(alpha: 0.6),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.wb_twilight_rounded,
                  color: AppColors.secondary,
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'DAWN DISPATCH DROP POINT',
                        style: AppTypography.labelSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.secondary,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Your default address is automatically loaded for 5:30 AM cold-chain drops. Ensure delivery drop instructions specify where morning crates should be placed.',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Address Cards List
          ...addresses.map((address) => _buildAddressCard(context, address, l10n)),

          const SizedBox(height: AppSpacing.md),

          // Add New Address Button
          YogButton(
            label: l10n.addNewAddress,
            icon: const Icon(Icons.add_location_alt_rounded,
                size: 18, color: AppColors.primary),
            variant: YogButtonVariant.outline,
            onPressed: () => _showAddEditAddressSheet(context, null),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  Widget _buildAddressCard(
    BuildContext context,
    DeliveryAddressEntity address,
    AppLocalizations l10n,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(
          color: address.isDefault ? AppColors.primary : AppColors.borderSubtle,
          width: address.isDefault ? 1.5 : 1.0,
        ),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      address.isDefault
                          ? Icons.location_on_rounded
                          : Icons.storefront_rounded,
                      color: address.isDefault
                          ? AppColors.primary
                          : AppColors.textMuted,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        address.title,
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              if (address.isDefault)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primaryContainerNavy.withValues(alpha: 0.1),
                    borderRadius: AppRadius.radiusPill,
                  ),
                  child: Text(
                    'Default Drop',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                      fontSize: 10,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),

          Text(
            address.fullAddress,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 6),

          // Drop instructions note
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFFCF9F3),
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.note_alt_outlined,
                  size: 14,
                  color: AppColors.secondary,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Drop Note: ${address.dropInstructions}',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontSize: 10.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Contact details
          Wrap(
            spacing: 12,
            runSpacing: 4,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.person_outline_rounded,
                      size: 14, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    address.contactPerson,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.phone_outlined,
                      size: 14, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    address.contactPhone,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(height: 1, color: AppColors.borderSubtle),
          const SizedBox(height: 8),

          // Actions Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (!address.isDefault)
                Flexible(
                  child: TextButton.icon(
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 16),
                    label: Text(
                      l10n.setAsDefault,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.secondary,
                      padding: EdgeInsets.zero,
                    ),
                    onPressed: () {
                      ref.read(addressProvider.notifier).setDefault(address.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Set ${address.title} as default drop point.'),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                  ),
                )
              else
                Flexible(
                  child: Text(
                    'Primary 5:30 AM drop destination',
                    style: AppTypography.labelSmall.copyWith(
                      color: const Color(0xFF2E7D32),
                      fontWeight: FontWeight.w700,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit_outlined,
                        size: 18, color: AppColors.primary),
                    onPressed: () =>
                        _showAddEditAddressSheet(context, address),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline_rounded,
                        size: 18, color: AppColors.error),
                    onPressed: () {
                      ref
                          .read(addressProvider.notifier)
                          .deleteAddress(address.id);
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showAddEditAddressSheet(
    BuildContext context,
    DeliveryAddressEntity? existing,
  ) {
    final titleCtrl = TextEditingController(text: existing?.title ?? '');
    final streetCtrl = TextEditingController(text: existing?.street ?? '');
    final areaCtrl = TextEditingController(text: existing?.area ?? '');
    final cityCtrl = TextEditingController(text: existing?.city ?? 'Pune');
    final pincodeCtrl = TextEditingController(text: existing?.pincode ?? '411038');
    final noteCtrl = TextEditingController(
      text: existing?.dropInstructions ??
          'Keep morning crates in front chilled rack.',
    );
    final contactCtrl =
        TextEditingController(text: existing?.contactPerson ?? 'Ramesh Patil');
    final phoneCtrl =
        TextEditingController(text: existing?.contactPhone ?? '+91 98220 12345');
    bool isDefault = existing?.isDefault ?? false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: AppSpacing.base,
                right: AppSpacing.base,
                top: AppSpacing.base,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + AppSpacing.base,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppColors.borderSubtle,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      existing == null ? 'Add Delivery Drop Point' : 'Edit Drop Point',
                      style: AppTypography.titleLarge.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: titleCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Address Label (e.g. Main Booth, Godown #2)',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                            horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: streetCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Street Address & Shop No.',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                            horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: areaCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Area / Landmark',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: cityCtrl,
                            decoration: const InputDecoration(
                              labelText: 'City',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: pincodeCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Pincode',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                            horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: noteCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Dawn Drop Instructions (Where to place crates)',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                            horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: contactCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Contact Person',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: phoneCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Phone',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      value: isDefault,
                      onChanged: (v) {
                        setSheetState(() => isDefault = v ?? false);
                      },
                      title: Text(
                        'Set as primary dawn drop point',
                        style: AppTypography.bodySmall.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                      controlAffinity: ListTileControlAffinity.leading,
                    ),
                    const SizedBox(height: 12),
                    YogButton(
                      label: 'Save Address',
                      onPressed: () {
                        if (titleCtrl.text.trim().isEmpty ||
                            streetCtrl.text.trim().isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please fill in label and street address.'),
                            ),
                          );
                          return;
                        }

                        final newAddress = DeliveryAddressEntity(
                          id: existing?.id ??
                              'addr-${DateTime.now().millisecondsSinceEpoch}',
                          title: titleCtrl.text.trim(),
                          businessName: 'Om Sai Dairy & Sweets',
                          street: streetCtrl.text.trim(),
                          area: areaCtrl.text.trim(),
                          city: cityCtrl.text.trim(),
                          pincode: pincodeCtrl.text.trim(),
                          dropInstructions: noteCtrl.text.trim(),
                          contactPerson: contactCtrl.text.trim(),
                          contactPhone: phoneCtrl.text.trim(),
                          isDefault: isDefault,
                        );

                        if (existing == null) {
                          ref
                              .read(addressProvider.notifier)
                              .addAddress(newAddress);
                        } else {
                          ref
                              .read(addressProvider.notifier)
                              .updateAddress(newAddress);
                        }

                        Navigator.of(ctx).pop();
                      },
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
