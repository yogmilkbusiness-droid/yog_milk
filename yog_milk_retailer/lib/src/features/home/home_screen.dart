import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_widgets.dart';
import '../../core/localization/locale_controller.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/mock_schedule_repository.dart';
import '../../core/mock_engine/contracts/invoice_repository.dart';
import '../../core/mock_engine/contracts/notification_repository.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/invoice_controller.dart';
import '../../core/mock_engine/notification_controller.dart';
import '../../core/mock_engine/seed/mock_categories.dart';
import '../../core/mock_engine/seed/mock_orders.dart';
import '../../core/mock_engine/seed/mock_products.dart';
import '../auth/mock_google_sign_in_sheet.dart';
import '../catalog/widgets/quick_add_sheet.dart';
import '../catalog/widgets/reorder_review_sheet.dart';

/// Main Home Dashboard matching Stitch references:
/// - yog_milk_home_ordering_open
/// - yog_milk_home_ordering_closed
/// - yog_milk_home_payment_pending
/// - yog_milk_customer_home_order
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _bottomNavIndex = 0;
  String _selectedCategorySlug = 'cow-milk';

  @override
  Widget build(BuildContext context) {
    final currentLocale = ref.watch(localeControllerProvider);
    final authState = ref.watch(authControllerProvider);
    final scheduleState = ref.watch(scheduleProvider);
    final cartState = ref.watch(cartProvider);
    final invoices = ref.watch(invoicesProvider);
    final notifications = ref.watch(notificationsProvider);
    final unreadNotifs = notifications.where((n) => !n.isRead).length;

    final retailer = authState.profile;
    final shopName = retailer?.businessName ?? 'Om Sai Dairy & Sweets';
    final ownerName = retailer?.ownerName ?? 'Ramesh Patil';
    final area = retailer?.area ?? 'Kothrud, Pune';
    final hasPendingBlock = retailer?.hasPendingPaymentBlock ?? true;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _buildAppBar(
        context,
        shopName,
        area,
        currentLocale,
        cartState.itemCount,
        unreadNotifs,
      ),
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: _bottomNavIndex,
        cartItemCount: cartState.itemCount,
        onTap: (index) {
          setState(() => _bottomNavIndex = index);
          if (index == 1) {
            context.push('/catalog');
          } else if (index == 2) {
            context.push('/orders');
          } else if (index == 3) {
            context.push('/invoices');
          } else if (index == 4) {
            context.push('/account');
          }
        },
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 400));
        },
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.base),
          children: [
            // 1. Retailer Greeting Card
            _buildRetailerGreeting(ownerName, shopName),
            const SizedBox(height: AppSpacing.md),

            // 2. Rule 4.1: Operational Ordering Gate Banner
            OperationalGateBanner(
              isOpen: scheduleState.isWindowOpen,
              closesAtTime: scheduleState.closesAtDisplay,
              nextOpenTime: scheduleState.nextOpenDisplay,
              onInfoTap: () {
                _showScheduleInfoDialog(context, scheduleState);
              },
            ),
            const SizedBox(height: AppSpacing.sm),

            // 3. Rule 4.4: Pending Payment Debt Restriction Notice (When Active)
            if (hasPendingBlock) ...[
              PendingPaymentAlertCard(
                orderCode: mockActiveOrder.orderCode,
                pendingAmount: mockActiveOrder.totalPayable,
                paymentMethod: 'Cash on Delivery (COD)',
                onViewOrder: () {
                  context.push('/orders/${mockActiveOrder.id}');
                },
              ),
              const SizedBox(height: AppSpacing.md),
            ],

            // 4. Product Announcements & Daily Plant Notice
            _buildAnnouncementBanner(),
            const SizedBox(height: AppSpacing.lg),

            // 5. Reorder Last Order ("Order Usual")
            _buildOrderUsualCard(scheduleState.isWindowOpen, hasPendingBlock),
            const SizedBox(height: AppSpacing.lg),

            // 6. Product Categories
            _buildCategoriesSection(),
            const SizedBox(height: AppSpacing.lg),

            // 7. Quick Add / Frequently Purchased Products
            _buildQuickAddSection(),
            const SizedBox(height: AppSpacing.lg),

            // 8. Current Orders Status
            _buildCurrentOrdersSection(),
            const SizedBox(height: AppSpacing.lg),

            // 9. Recent Commercial Invoices (Non-GST Rule 4.5)
            _buildRecentInvoicesSection(invoices),
            const SizedBox(height: AppSpacing.lg),

            // 10. Operational Notifications Feed
            _buildNotificationsSection(notifications),
            const SizedBox(height: AppSpacing.lg),

            // 11. Interactive Prototype Simulation Controls
            _buildPrototypeSimulationDesk(scheduleState, hasPendingBlock),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(
    BuildContext context,
    String shopName,
    String area,
    Locale currentLocale,
    int cartItemCount,
    int unreadNotifs,
  ) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0.5,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                shopName,
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: AppColors.statusSuccess,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
          Text(
            area,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
      actions: [
        // Language Selector
        _buildLanguageMenu(currentLocale),
        // Notifications Bell
        Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              icon: const Icon(
                Icons.notifications_outlined,
                color: AppColors.primary,
              ),
              tooltip: 'Notifications',
              onPressed: () => context.push('/notifications'),
            ),
            if (unreadNotifs > 0)
              Positioned(
                top: 6,
                right: 6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: AppColors.secondary,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$unreadNotifs',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
        // Shopping Cart Bag
        Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              icon: const Icon(
                Icons.shopping_bag_outlined,
                color: AppColors.primary,
              ),
              tooltip: 'Morning Basket',
              onPressed: () => context.push('/cart'),
            ),
            if (cartItemCount > 0)
              Positioned(
                top: 6,
                right: 6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: AppColors.secondary,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$cartItemCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
        // Switch Mock Account
        IconButton(
          icon: const Icon(
            Icons.account_circle_outlined,
            color: AppColors.primary,
          ),
          tooltip: 'Switch Mock Account',
          onPressed: () => MockGoogleSignInSheet.show(context),
        ),
      ],
    );
  }

  Widget _buildRetailerGreeting(String ownerName, String shopName) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
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
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.wb_sunny_rounded,
                      size: 15,
                      color: AppColors.secondaryContainer,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'MORNING RITUAL',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.secondary,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  'Namaste, $ownerName 🙏',
                  style: AppTypography.headlineLarge.copyWith(
                    fontFamily: AppTypography.fontHeading,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const Icon(
                      Icons.location_on_outlined,
                      size: 14,
                      color: AppColors.textMuted,
                    ),
                    const SizedBox(width: 2),
                    Expanded(
                      child: Text(
                        'Fresh from nature to your doorstep in Kothrud, Pune',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'NEXT RUN',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '5:30 AM',
                  style: AppTypography.titleSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnnouncementBanner() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primaryContainer, AppColors.primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.18),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            ),
            child: const Icon(
              Icons.eco_rounded,
              color: Color(0xFFFFDF9C),
              size: 24,
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryContainer,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'SATTVIC HARVEST',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'A2 Vedic Desi Cow Milk & Pure Bilona Ghee',
                  style: AppTypography.titleSmall.copyWith(
                    fontFamily: AppTypography.fontHeading,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                    color: Colors.white,
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Fresh morning batch dispatching now directly from organic Maharashtra pastures in sanitized crates. Order before 17:00 IST.',
                  style: AppTypography.bodySmall.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontSize: 11.5,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderUsualCard(bool isWindowOpen, bool hasPendingBlock) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.history_rounded,
                    color: AppColors.primary,
                    size: 20,
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  Text(
                    'Order Usual (Reorder Last Basket)',
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  'YM-2026-8841',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'monospace',
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.lg),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: AppColors.primaryContainer,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Gir Cow A2 Milk 1L',
                    style: AppTypography.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                'x 36 pkts',
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: AppColors.primaryContainer,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Spiced Masala Taak 200ml',
                    style: AppTypography.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                'x 48 pkts',
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Delivered 29 Oct 2026',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                  fontSize: 11,
                ),
              ),
              Text(
                '₹3,218.00',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              icon: const Icon(Icons.replay_rounded, size: 18),
              label: Text(
                isWindowOpen && !hasPendingBlock
                    ? '+ 1-Tap Reorder Basket'
                    : !isWindowOpen
                        ? 'Ordering Window Closed'
                        : 'Pending Debt Blocked',
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: isWindowOpen && !hasPendingBlock
                    ? AppColors.secondaryContainer
                    : Colors.grey.shade300,
                foregroundColor: isWindowOpen && !hasPendingBlock
                    ? Colors.white
                    : Colors.grey.shade600,
                padding: const EdgeInsets.symmetric(vertical: 13),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: isWindowOpen && !hasPendingBlock ? 2 : 0,
              ),
              onPressed: isWindowOpen && !hasPendingBlock
                  ? () {
                      ReorderReviewSheet.show(
                        context,
                        pastOrder: mockPastUsualOrder,
                      );
                    }
                  : null,
            ),
          ),
          const SizedBox(height: 6),
          Center(
            child: Text(
              '*Current daily wholesale pricing confirmed at instant placement',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 10.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoriesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Product Categories',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            InkWell(
              onTap: () => context.push('/catalog'),
              child: Text(
                'View All →',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        SizedBox(
          height: 42,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: mockCategories.length,
            separatorBuilder: (_, i) => const SizedBox(width: AppSpacing.sm),
            itemBuilder: (context, index) {
              final cat = mockCategories[index];
              final isSelected = cat.slug == _selectedCategorySlug;
              return YogCategoryChip(
                title: cat.name,
                isSelected: isSelected,
                icon: Icons.grain_rounded,
                onTap: () {
                  setState(() => _selectedCategorySlug = cat.slug);
                  context.push('/catalog?category=${cat.slug}');
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildQuickAddSection() {
    final cartState = ref.watch(cartProvider);
    final cartNotifier = ref.read(cartProvider.notifier);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Quick Add / Frequently Purchased',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            InkWell(
              onTap: () => QuickAddSheet.show(context),
              child: Text(
                'Quick Add Sheet →',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3,
          separatorBuilder: (_, i) => const SizedBox(height: AppSpacing.md),
          itemBuilder: (context, index) {
            final prod = mockProducts[index];
            final currentQty = cartState.getQuantity(prod.id);
            return YogProductCard(
              title: prod.name,
              packSize: prod.packSize,
              wholesalePrice: prod.wholesalePrice,
              unitsPerCrate: prod.unitsPerCrate,
              fatPercentage: prod.fatPercentage,
              snfPercentage: prod.snfPercentage,
              currentQuantity: currentQty,
              onTap: () {
                context.push('/catalog/${prod.id}');
              },
              onQuantityChanged: (newQty) {
                cartNotifier.setQuantity(prod, newQty);
              },
              onQuickAdd: () {
                cartNotifier.addCrate(prod);
              },
            );
          },
        ),
      ],
    );
  }

  Widget _buildCurrentOrdersSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Active Order Status',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            GestureDetector(
              onTap: () => context.push('/orders'),
              child: Text(
                'View All Orders',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        YogOrderCard(
          orderCode: mockActiveOrder.orderCode,
          formattedDate: 'Today, 08:30 AM',
          orderStatus: 'PROCESSING',
          paymentStatus: 'PENDING',
          itemsSummary:
              'Gir Cow Milk 1L (24 pkts / 2 crates), Fresh Paneer 1kg (2 units)',
          totalAmount: mockActiveOrder.totalPayable,
          paymentMethod: 'Cash on Delivery (COD)',
          onViewDetails: () {
            context.push('/orders/${mockActiveOrder.id}');
          },
        ),
      ],
    );
  }

  Widget _buildRecentInvoicesSection(List<CommercialInvoiceEntity> invoices) {
    if (invoices.isEmpty) return const SizedBox.shrink();
    final firstInv = invoices.first;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Commercial Invoices (Non-GST)',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            InkWell(
              onTap: () => context.push('/invoices'),
              child: Text(
                'View All',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        YogInvoiceCard(
          invoiceNumber: firstInv.invoiceNumber,
          orderCode: firstInv.orderCode,
          invoiceDate: '${firstInv.invoiceDate.day} Oct 2026',
          totalAmount: firstInv.totalAmount,
          paymentStatus: firstInv.paymentStatus == PaymentLifecycleStatus.paid
              ? 'Paid & Settled'
              : 'COD Pending',
          onDownloadPdf: () {
            context.push('/invoices/${firstInv.invoiceNumber}/preview');
          },
        ),
      ],
    );
  }

  Widget _buildNotificationsSection(List<NotificationEntity> notifications) {
    final recentNotifs = notifications.take(3).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Operational Notices',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            InkWell(
              onTap: () => context.push('/notifications'),
              child: Text(
                'View All',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        ...recentNotifs.map(
          (n) => YogNotificationTile(
            title: n.title,
            message: n.body,
            timestamp: _formatTime(n.timestamp),
            type: n.category == NotificationCategory.ordersAndDelivery
                ? NotificationType.order
                : n.category == NotificationCategory.billing
                    ? NotificationType.payment
                    : NotificationType.announcement,
            isRead: n.isRead,
            onTap: () => context.push('/notifications'),
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  Widget _buildPrototypeSimulationDesk(
    ScheduleState scheduleState,
    bool hasPendingBlock,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Prototype Test Bench',
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  'STAGE 1 DEMO',
                  style: AppTypography.labelSmall.copyWith(
                    color: Colors.white,
                    fontSize: 9,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.md),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text(
              'Ordering Window Gate (Rule 4.1)',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
            subtitle: Text(
              scheduleState.isWindowOpen
                  ? 'Currently OPEN (07:00 - 17:00 IST)'
                  : 'Currently CLOSED (Order submit blocked)',
              style: const TextStyle(fontSize: 10),
            ),
            value: scheduleState.isWindowOpen,
            onChanged: (val) {
              ref.read(scheduleProvider.notifier).toggleWindow(val);
            },
          ),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text(
              'Pending Payment Block (Rule 4.4)',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
            subtitle: Text(
              hasPendingBlock
                  ? 'ACTIVE: Order #YM-2026-8841 due ₹2,450.00 blocks new orders'
                  : 'CLEARED: Zero outstanding debt',
              style: const TextStyle(fontSize: 10),
            ),
            value: hasPendingBlock,
            onChanged: (val) {
              ref
                  .read(authControllerProvider.notifier)
                  .setPendingPaymentBlock(val);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageMenu(Locale currentLocale) {
    return PopupMenuButton<String>(
      icon: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: AppRadius.radiusPill,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, size: 14, color: AppColors.primary),
            const SizedBox(width: 3),
            Text(
              currentLocale.languageCode.toUpperCase(),
              style: AppTypography.labelSmall.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
      onSelected: (code) {
        ref.read(localeControllerProvider.notifier).setLanguageCode(code);
      },
      itemBuilder: (context) => const [
        PopupMenuItem(value: 'en', child: Text('English (Default)')),
        PopupMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
        PopupMenuItem(value: 'mr', child: Text('मराठी (Marathi)')),
      ],
    );
  }

  void _showScheduleInfoDialog(BuildContext context, ScheduleState schedule) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Automated Ordering Schedule'),
        content: Text(
          'Operating Window: 07:00 to 17:00 IST daily.\n\nAll bulk orders submitted during this window are chilled and dispatched for morning arrival before 06:00 AM.',
          style: AppTypography.bodySmall,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }
}
