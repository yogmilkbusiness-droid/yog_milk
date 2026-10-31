import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_constants.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_widgets.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/localization/locale_controller.dart';

/// Foundation preview and showcase screen.
/// Verifies that all tokens, widgets, localization, and business rules are working.
class FoundationPreviewScreen extends ConsumerStatefulWidget {
  const FoundationPreviewScreen({super.key});

  @override
  ConsumerState<FoundationPreviewScreen> createState() =>
      _FoundationPreviewScreenState();
}

class _FoundationPreviewScreenState
    extends ConsumerState<FoundationPreviewScreen> {
  // Interactive state controls for verification
  bool _isWindowOpen = true;
  bool _showDebtBlock = true;
  int _stepperValue = 24; // 2 Crates
  int _selectedCategoryIndex = 0;
  int _bottomNavIndex = 0;
  String _dropdownValue = 'Pune Central';

  final List<String> _categories = [
    'All Products',
    'Cow Milk',
    'Buffalo Milk',
    'Curd & Taak',
    'Paneer & Butter',
    'Artisanal Ghee',
  ];

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final currentLocale = ref.watch(localeControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.appTitle,
              style: AppTypography.titleLarge.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
                letterSpacing: 0.5,
              ),
            ),
            Text(
              AppConstants.regionCoverage,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [_buildLanguageMenu(context, currentLocale)],
      ),
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: _bottomNavIndex,
        onTap: (index) => setState(() => _bottomNavIndex = index),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Section 1: Brand & Architecture Verification
          _buildCard(
            title: 'Technical Foundation Verified',
            badge: 'Stage 1 Ready',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'YOG MILK Retailer Android Application',
                  style: AppTypography.headlineSmall.copyWith(
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Flutter 3.41.2 • Riverpod • GoRouter • Material 3 • Clean Architecture. Connected to deterministic in-memory mock engine with zero database dependencies.',
                  style: AppTypography.bodySmall,
                ),
                const SizedBox(height: AppSpacing.md),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.xs,
                  children: [
                    _buildChip('schema.sql: 0 bytes'),
                    _buildChip('No Credit Features'),
                    _buildChip('Non-GST Bills'),
                    _buildChip('Trilingual (EN/HI/MR)'),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 2: Rule 4.1 - Operational Gate Schedule
          _buildSectionHeader('Operational Ordering Gate (Rule 4.1)'),
          const SizedBox(height: AppSpacing.sm),
          OperationalGateBanner(
            isOpen: _isWindowOpen,
            closesAtTime: '05:00 PM',
            nextOpenTime: 'Tomorrow at 07:00 AM',
            onInfoTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Recurring operating schedule: 07:00 - 17:00 IST',
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text('Simulate Gate Status: ', style: AppTypography.labelSmall),
              Switch.adaptive(
                value: _isWindowOpen,
                activeTrackColor: AppColors.primary,
                onChanged: (val) => setState(() => _isWindowOpen = val),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Section 3: Rule 4.4 - The One Pending-Payment Restriction
          _buildSectionHeader('Pending Payment Restriction (Rule 4.4)'),
          const SizedBox(height: AppSpacing.sm),
          if (_showDebtBlock)
            PendingPaymentAlertCard(
              orderCode: 'YM-2026-8841',
              pendingAmount: 2450.00,
              paymentMethod: 'Cash on Delivery (COD)',
              onViewOrder: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Navigating to Order #YM-2026-8841 details...',
                    ),
                  ),
                );
              },
            )
          else
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.statusSuccessContainer,
                borderRadius: AppRadius.radiusMd,
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.check_circle,
                    color: AppColors.statusSuccess,
                    size: 20,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Text(
                    'No unresolved pending payments. Retailer cleared to order.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.onStatusSuccess,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                'Simulate Unresolved Debt: ',
                style: AppTypography.labelSmall,
              ),
              Switch.adaptive(
                value: _showDebtBlock,
                activeTrackColor: AppColors.statusError,
                onChanged: (val) => setState(() => _showDebtBlock = val),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Section 4: Category Chips
          _buildSectionHeader('Category Chips & Filter Pills'),
          const SizedBox(height: AppSpacing.sm),
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              separatorBuilder: (_, i) => const SizedBox(width: AppSpacing.sm),
              itemBuilder: (context, index) {
                return YogCategoryChip(
                  title: _categories[index],
                  isSelected: _selectedCategoryIndex == index,
                  onTap: () => setState(() => _selectedCategoryIndex = index),
                );
              },
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 5: Form Inputs & Search Bar
          _buildSectionHeader('Inputs & Search Field'),
          const SizedBox(height: AppSpacing.sm),
          const YogSearchBar(),
          const SizedBox(height: AppSpacing.md),
          const YogTextField(
            label: 'Retail Booth Name',
            hint: 'e.g. Om Sai Dairy & Sweets',
            prefixIcon: Icon(
              Icons.storefront_outlined,
              size: 20,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          YogDropdown<String>(
            label: 'Delivery Zone / Route',
            value: _dropdownValue,
            items: const [
              DropdownMenuItem(
                value: 'Pune Central',
                child: Text('Route 1: Pune Central / Kothrud'),
              ),
              DropdownMenuItem(
                value: 'Hadapsar',
                child: Text('Route 2: Hadapsar & Magarpatta'),
              ),
              DropdownMenuItem(
                value: 'Wakad',
                child: Text('Route 3: Wakad & Hinjewadi'),
              ),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _dropdownValue = val);
            },
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 6: Wholesale Product Cards
          _buildSectionHeader('Wholesale Dairy Product Cards'),
          const SizedBox(height: AppSpacing.sm),
          YogProductCard(
            title: 'Gir Cow Full Cream Milk',
            packSize: '1L Pouch',
            wholesalePrice: 68.00,
            unitsPerCrate: 12,
            fatPercentage: 4.5,
            snfPercentage: 8.5,
            currentQuantity: _stepperValue,
            onQuantityChanged: (val) => setState(() => _stepperValue = val),
          ),
          const SizedBox(height: AppSpacing.md),
          YogProductCard(
            title: 'Fresh Malai Paneer',
            packSize: '1kg Vacuum Pack',
            wholesalePrice: 380.00,
            unitsPerCrate: 5,
            fatPercentage: 22.0,
            snfPercentage: 18.0,
            currentQuantity: 0,
            onQuantityChanged: (_) {},
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 7: B2B Order Card
          _buildSectionHeader('Order History Card'),
          const SizedBox(height: AppSpacing.sm),
          YogOrderCard(
            orderCode: 'YM-2026-8841',
            formattedDate: 'Today, 08:30 AM',
            orderStatus: 'PROCESSING',
            paymentStatus: 'PENDING',
            itemsSummary:
                'Gir Cow Milk 1L (24 pkts / 2 crates), Fresh Paneer 1kg (5 units)',
            totalAmount: 3530.00,
            paymentMethod: 'Cash on Delivery (COD)',
            onViewDetails: () {
              YogBottomSheet.show(
                context,
                title: 'Order #YM-2026-8841 Details',
                subtitle: 'Placed today at 08:30 AM IST',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const YogPaymentIndicator(
                      paymentMethod: 'COD',
                      paymentStatus: 'PENDING',
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      'This order is currently PROCESSING at the central dairy warehouse. Delivery driver assignment will occur at 04:00 AM tomorrow.',
                      style: AppTypography.bodySmall,
                    ),
                  ],
                ),
                bottomAction: YogButton(
                  label: 'Close Details',
                  variant: YogButtonVariant.outline,
                  onPressed: () => Navigator.of(context).pop(),
                ),
              );
            },
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 8: Commercial Invoice Card (Rule 4.5)
          _buildSectionHeader('Commercial Non-GST Bill Card (Rule 4.5)'),
          const SizedBox(height: AppSpacing.sm),
          YogInvoiceCard(
            invoiceNumber: 'INV-2026-1049',
            orderCode: 'YM-2026-8841',
            invoiceDate: '31 Oct 2026',
            totalAmount: 3530.00,
            paymentStatus: 'PAID',
            onDownloadPdf: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Downloading Commercial Invoice INV-2026-1049 PDF...',
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 9: Notification Tile
          _buildSectionHeader('In-App Notification Tile'),
          const SizedBox(height: AppSpacing.sm),
          YogNotificationTile(
            title: 'Morning Milk Dispatch Dispatched',
            message:
                'Vehicle MH 12 QX 4821 is out for delivery. Estimated arrival at your booth: 06:15 AM.',
            timestamp: '10 mins ago',
            type: NotificationType.delivery,
            isRead: false,
            onTap: () {},
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 10: Modal Dialog & Bottom Sheet Triggers
          _buildSectionHeader('Dialogs & Bottom Sheets'),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: YogButton.outline(
                  label: 'Test Dialog',
                  onPressed: () {
                    YogConfirmationDialog.show(
                      context,
                      title: 'Cancel Dairy Order?',
                      message:
                          'Are you sure you want to cancel order #YM-2026-8841? This action cannot be undone once processing begins.',
                      confirmLabel: 'Cancel Order',
                      isDestructive: true,
                      icon: Icons.cancel_outlined,
                    );
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: YogButton(
                  label: 'Test Bottom Sheet',
                  onPressed: () {
                    YogBottomSheet.show(
                      context,
                      title: 'Quick Order Usual',
                      subtitle: '24 pkts Cow Milk + 10 pkts Taak',
                      child: Text(
                        'This will instantly prepare your regular daily dairy basket for tomorrow morning delivery.',
                        style: AppTypography.bodyMedium,
                      ),
                      bottomAction: YogButton(
                        label: 'Confirm Usual Order',
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 11: Error Banner
          _buildSectionHeader('Inline Error Alert Banner'),
          const SizedBox(height: AppSpacing.sm),
          YogErrorBanner(
            title: 'Schedule Synchronization Warning',
            message:
                'Unable to refresh real-time delivery GPS coordinates. Showing last recorded dispatch status.',
            onRetry: () {},
            onDismiss: () {},
          ),
          const SizedBox(height: AppSpacing.lg),

          // Section 12: Decoupled Status Badges
          _buildSectionHeader('Decoupled Status Badges (Rule 4.2)'),
          const SizedBox(height: AppSpacing.sm),
          _buildCard(
            title: 'Order Status Domain',
            child: const Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                YogStatusBadge(status: 'PLACED'),
                YogStatusBadge(status: 'CONFIRMED'),
                YogStatusBadge(status: 'PROCESSING'),
                YogStatusBadge(status: 'OUT_FOR_DELIVERY'),
                YogStatusBadge(status: 'DELIVERED'),
                YogStatusBadge(status: 'CANCELLED'),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildCard(
            title: 'Payment Status Domain',
            child: const Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                YogStatusBadge(status: 'PENDING'),
                YogStatusBadge(status: 'PAID'),
                YogStatusBadge(status: 'FAILED'),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: AppTypography.titleMedium.copyWith(
        fontWeight: FontWeight.w700,
        color: AppColors.primary,
        letterSpacing: 0.2,
      ),
    );
  }

  Widget _buildCard({
    required String title,
    String? badge,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x05051256),
            blurRadius: 6,
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
              Text(
                title,
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              if (badge != null)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                    vertical: AppSpacing.xxs,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerHigh,
                    borderRadius: AppRadius.radiusPill,
                  ),
                  child: Text(
                    badge,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontSize: 10,
                    ),
                  ),
                ),
            ],
          ),
          const Divider(height: AppSpacing.lg),
          child,
        ],
      ),
    );
  }

  Widget _buildChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Text(
        label,
        style: AppTypography.labelSmall.copyWith(
          color: AppColors.textPrimary,
          fontSize: 11,
        ),
      ),
    );
  }

  Widget _buildLanguageMenu(BuildContext context, Locale currentLocale) {
    return PopupMenuButton<String>(
      tooltip: 'Change Language / भाषा बदला',
      icon: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: AppRadius.radiusPill,
          border: Border.all(color: AppColors.borderSubtle),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, size: 16, color: AppColors.primary),
            const SizedBox(width: AppSpacing.xs),
            Text(
              currentLocale.languageCode.toUpperCase(),
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
      onSelected: (code) {
        ref.read(localeControllerProvider.notifier).setLanguageCode(code);
      },
      itemBuilder: (context) => [
        const PopupMenuItem(value: 'en', child: Text('English (Default)')),
        const PopupMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
        const PopupMenuItem(value: 'mr', child: Text('मराठी (Marathi)')),
      ],
    );
  }
}
