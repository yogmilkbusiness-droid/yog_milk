import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_bottom_navigation_bar.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/localization/locale_controller.dart';
import '../../core/mock_engine/address_controller.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/notification_controller.dart';
import '../../core/mock_engine/order_controller.dart';
import '../../core/mock_engine/payment_controller.dart';

/// Retailer Account, Profile & Settings Screen matching Stitch reference:
/// `yog_milk_account`
class AccountScreen extends ConsumerStatefulWidget {
  const AccountScreen({super.key});

  @override
  ConsumerState<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends ConsumerState<AccountScreen> {
  bool _dawnAlertsEnabled = true;
  bool _openingWindowAlertEnabled = true;

  @override
  Widget build(BuildContext context) {
    final currentLocale = ref.watch(localeControllerProvider);
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authControllerProvider);
    final cartState = ref.watch(cartProvider);
    final notifications = ref.watch(notificationsProvider);
    final unreadCount = notifications.where((n) => !n.isRead).length;
    final orders = ref.watch(ordersProvider);
    final payments = ref.watch(paymentsProvider);
    final addresses = ref.watch(addressProvider);

    final defaultAddress = addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => addresses.first,
    );

    final profile = authState.profile;
    final ownerName = profile?.ownerName ?? 'Ramesh Patil';
    final businessName = profile?.businessName ?? 'Om Sai Dairy & Sweets';
    final phone = profile?.phone ?? '+91 98220 12345';
    const email = 'ramesh.patil.dairy@gmail.com';
    const customerId = 'YM-CUST-84920';

    // Financial summaries
    final settledAmount = payments
        .where((p) => p.isSettled)
        .fold<double>(0.0, (sum, p) => sum + p.amount);
    final pendingAmount = payments
        .where((p) => p.isPending)
        .fold<double>(0.0, (sum, p) => sum + p.amountDue);

    // Order counts
    final activeOrdersCount = orders
        .where((o) =>
            o.orderStatus.name != 'delivered' &&
            o.orderStatus.name != 'cancelled')
        .length;
    final deliveredOrdersCount =
        orders.where((o) => o.orderStatus.name == 'delivered').length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: Container(
          margin: const EdgeInsets.all(10),
          decoration: const BoxDecoration(
            color: AppColors.primary,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.spa_rounded,
            color: Colors.white,
            size: 18,
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Yog Milk',
              style: AppTypography.titleLarge.copyWith(
                fontWeight: FontWeight.w900,
                color: AppColors.primary,
                letterSpacing: -0.3,
              ),
            ),
            Text(
              'VEDIC DAIRY WHOLESALE',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 8.5,
                letterSpacing: 0.8,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        actions: [
          // Notifications
          IconButton(
            icon: Stack(
              children: [
                const Icon(
                  Icons.notifications_outlined,
                  color: AppColors.primary,
                ),
                if (unreadCount > 0)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => context.push('/notifications'),
          ),
          // Cart
          IconButton(
            icon: Stack(
              children: [
                const Icon(
                  Icons.shopping_bag_outlined,
                  color: AppColors.primary,
                ),
                if (cartState.itemCount > 0)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 14,
                        minHeight: 14,
                      ),
                      child: Text(
                        '${cartState.itemCount}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => context.push('/cart'),
          ),
          const SizedBox(width: 4),
        ],
      ),
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: 4, // Account
        cartItemCount: cartState.itemCount,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/catalog');
          } else if (index == 2) {
            context.go('/orders');
          } else if (index == 3) {
            context.go('/invoices');
          }
        },
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Page Title Subheader
          Text(
            l10n.account,
            style: AppTypography.headlineMedium.copyWith(
              fontWeight: FontWeight.w900,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // 1. Customer Profile Card
          _buildProfileCard(
            context,
            ownerName: ownerName,
            businessName: businessName,
            customerId: customerId,
            phone: phone,
            email: email,
            defaultAddress: defaultAddress.fullAddress,
            l10n: l10n,
          ),
          const SizedBox(height: AppSpacing.md),

          // 2. GROUP 1: Orders & Finance
          _buildSectionHeader(l10n.ordersFinance),
          const SizedBox(height: AppSpacing.xs),
          _buildMenuContainer([
            _buildMenuTile(
              icon: Icons.receipt_long_rounded,
              title: l10n.orders,
              subtitle: 'Active: $activeOrdersCount · Delivered: $deliveredOrdersCount',
              onTap: () => context.push('/orders'),
            ),
            _buildMenuTile(
              icon: Icons.description_outlined,
              title: l10n.invoices,
              subtitle: 'Commercial Non-GST farm bills & delivery memos',
              onTap: () => context.push('/invoices'),
            ),
            _buildMenuTile(
              icon: Icons.account_balance_wallet_outlined,
              title: l10n.paymentsLedger,
              subtitle:
                  'Settled: ₹${settledAmount.toStringAsFixed(0)} · COD Due: ₹${pendingAmount.toStringAsFixed(0)}',
              onTap: () => context.push('/payments'),
            ),
            _buildMenuTile(
              icon: Icons.bar_chart_rounded,
              title: l10n.myPurchases,
              subtitle: 'Monthly purchasing overview & farm staples',
              onTap: () => context.push('/purchases'),
            ),
            _buildMenuTile(
              icon: Icons.location_on_outlined,
              title: l10n.deliveryAddresses,
              subtitle: defaultAddress.title,
              onTap: () => context.push('/account/addresses'),
            ),
          ]),
          const SizedBox(height: AppSpacing.md),

          // 3. GROUP 2: Business & FSSAI Information
          _buildSectionHeader(l10n.businessInfo),
          const SizedBox(height: AppSpacing.xs),
          _buildMenuContainer([
            _buildMenuTile(
              icon: Icons.storefront_outlined,
              title: businessName,
              subtitle: 'FSSAI Lic. 21522026000412 · Non-GST Certified',
              onTap: () => context.push('/account/business'),
            ),
          ]),
          const SizedBox(height: AppSpacing.md),

          // 4. GROUP 3: Preferences & Language Settings
          _buildSectionHeader(l10n.preferencesSettings),
          const SizedBox(height: AppSpacing.xs),
          _buildMenuContainer([
            // Language Selection Tile
            Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerHigh,
                          borderRadius: AppRadius.radiusMd,
                        ),
                        child: const Icon(
                          Icons.language_rounded,
                          color: AppColors.primary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              l10n.languageSelect,
                              style: AppTypography.titleMedium.copyWith(
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                            Text(
                              'Selected: ${currentLocale.languageCode == 'mr' ? 'मराठी' : currentLocale.languageCode == 'hi' ? 'हिंदी' : 'English'}',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Trilingual Language Switch Chips
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _buildLanguageChip(
                        code: 'en',
                        label: 'English',
                        isSelected: currentLocale.languageCode == 'en',
                      ),
                      _buildLanguageChip(
                        code: 'hi',
                        label: 'हिंदी',
                        isSelected: currentLocale.languageCode == 'hi',
                      ),
                      _buildLanguageChip(
                        code: 'mr',
                        label: 'मराठी',
                        isSelected: currentLocale.languageCode == 'mr',
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: AppColors.borderSubtle),

            // Dawn Notification Toggle
            SwitchListTile(
              value: _dawnAlertsEnabled,
              onChanged: (val) => setState(() => _dawnAlertsEnabled = val),
              activeThumbColor: AppColors.primary,
              title: Text(
                l10n.dawnAlerts,
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
              subtitle: Text(
                'Receive dispatch notifications when the cold-chain van approaches your booth.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                ),
              ),
            ),
            const Divider(height: 1, color: AppColors.borderSubtle),

            // Ordering Window Alert Toggle
            SwitchListTile(
              value: _openingWindowAlertEnabled,
              onChanged: (val) =>
                  setState(() => _openingWindowAlertEnabled = val),
              activeThumbColor: AppColors.primary,
              title: Text(
                l10n.orderWindowAlert,
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
              subtitle: Text(
                'Daily morning alert when the wholesale dairy booking window opens.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                ),
              ),
            ),
          ]),
          const SizedBox(height: AppSpacing.md),

          // 5. GROUP 4: Care & Governance
          _buildSectionHeader(l10n.careGovernance),
          const SizedBox(height: AppSpacing.xs),
          _buildMenuContainer([
            _buildMenuTile(
              icon: Icons.support_agent_rounded,
              title: l10n.helpSupport,
              subtitle: 'Morning ops dispatch desk & WhatsApp assistance',
              onTap: () => _showSupportSheet(context),
            ),
            _buildMenuTile(
              icon: Icons.eco_rounded,
              title: l10n.aboutYogMilk,
              subtitle: 'Ahimsa Gaushala & Cold-chain standards',
              onTap: () => _showAboutDialog(context),
            ),
            _buildMenuTile(
              icon: Icons.shield_outlined,
              title: l10n.legalPolicies,
              subtitle: 'Agricultural exemption & purity certifications',
              onTap: () => context.push('/account/business'),
            ),
          ]),
          const SizedBox(height: AppSpacing.lg),

          // 6. Sign Out Button
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: TextButton.icon(
              icon: const Icon(Icons.logout_rounded, color: AppColors.error),
              label: Text(
                l10n.signOut,
                style: AppTypography.titleSmall.copyWith(
                  color: AppColors.error,
                  fontWeight: FontWeight.w800,
                ),
              ),
              onPressed: () {
                ref.read(authControllerProvider.notifier).signOut();
                context.go('/auth/sign-in');
              },
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  // 1. Customer Profile Card
  Widget _buildProfileCard(
    BuildContext context, {
    required String ownerName,
    required String businessName,
    required String customerId,
    required String phone,
    required String email,
    required String defaultAddress,
    required AppLocalizations l10n,
  }) {
    final initials = ownerName
        .split(' ')
        .map((p) => p.isNotEmpty ? p[0] : '')
        .take(2)
        .join()
        .toUpperCase();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Initials avatar
                Stack(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryContainerNavy,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          initials.isNotEmpty ? initials : 'RP',
                          style: AppTypography.titleLarge.copyWith(
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        padding: const EdgeInsets.all(3),
                        decoration: const BoxDecoration(
                          color: AppColors.secondary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.spa_rounded,
                          size: 11,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              ownerName,
                              style: AppTypography.titleLarge.copyWith(
                                fontWeight: FontWeight.w900,
                                color: AppColors.primary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.edit_outlined,
                                size: 18, color: AppColors.primary),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: () => context.push('/account/business'),
                          ),
                        ],
                      ),
                      Text(
                        businessName,
                        style: AppTypography.bodySmall.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            customerId,
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textMuted,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE8F5E9),
                              borderRadius: AppRadius.radiusPill,
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 5,
                                  height: 5,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF2E7D32),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  l10n.activeStatus,
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
                      const SizedBox(height: 6),
                      Text(
                        phone,
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Drop Point Banner
          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.base, vertical: 10),
            decoration: const BoxDecoration(
              color: Color(0xFFFCF9F3),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
              border: Border(
                top: BorderSide(color: AppColors.borderSubtle),
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.wb_twilight_rounded,
                  size: 16,
                  color: AppColors.secondary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        alignment: WrapAlignment.spaceBetween,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text(
                            'DELIVERY DROP POINT',
                            style: AppTypography.labelSmall.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.secondary,
                              fontSize: 9.5,
                              letterSpacing: 0.8,
                            ),
                          ),
                          Text(
                            l10n.morningDrop,
                            style: AppTypography.labelSmall.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.primary,
                              fontSize: 9.5,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        defaultAddress,
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontSize: 11,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Text(
        title.toUpperCase(),
        style: AppTypography.labelSmall.copyWith(
          color: AppColors.textMuted,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  Widget _buildMenuContainer(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(children: children),
    );
  }

  Widget _buildMenuTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadius.radiusXl,
      child: Padding(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.base, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerHigh,
                borderRadius: AppRadius.radiusMd,
              ),
              child: Icon(icon, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppColors.textMuted,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageChip({
    required String code,
    required String label,
    required bool isSelected,
  }) {
    return InkWell(
      onTap: () {
        ref.read(localeControllerProvider.notifier).setLanguageCode(code);
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.borderSubtle,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelMedium.copyWith(
            color: isSelected ? Colors.white : AppColors.textPrimary,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
          ),
        ),
      ),
    );
  }

  void _showSupportSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.base),
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
              const SizedBox(height: 14),
              Text(
                'Morning Logistics Support',
                style: AppTypography.titleLarge.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Available daily from 4:30 AM to 6:00 PM for dispatch assistance.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.phone_in_talk_rounded,
                    color: Color(0xFF2E7D32)),
                title: const Text('Call Dispatch Desk'),
                subtitle: const Text('+91 20 2588 4100'),
                onTap: () => Navigator.of(ctx).pop(),
              ),
              ListTile(
                leading:
                    const Icon(Icons.chat_rounded, color: Color(0xFF128C7E)),
                title: const Text('WhatsApp Operations Sahayak'),
                subtitle: const Text('Immediate route updates'),
                onTap: () => Navigator.of(ctx).pop(),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.spa_rounded, color: AppColors.primary),
              SizedBox(width: 8),
              Text('About YOG MILK'),
            ],
          ),
          content: const Text(
            'YOG MILK is an artisanal A2 Vedic dairy enterprise operating single-origin Gaushalas in Devlali, Nashik and Satara, Maharashtra.\n\nAll dairy products are 100% pure, unadulterated, and cold-chain transported directly to commercial retailers at dawn.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }
}
