import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_bottom_navigation_bar.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/design_system/widgets/yog_empty_state.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/order_controller.dart';

/// Orders List & History Screen matching Stitch reference:
/// `yog_milk_orders_list`
class OrdersListScreen extends ConsumerStatefulWidget {
  const OrdersListScreen({super.key});

  @override
  ConsumerState<OrdersListScreen> createState() => _OrdersListScreenState();
}

class _OrdersListScreenState extends ConsumerState<OrdersListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedTab = 'ALL'; // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final allOrders = ref.watch(ordersProvider);
    final cartState = ref.watch(cartProvider);

    final activeCount = allOrders.where((o) => o.isOrderActive).length;
    final deliveredCount = allOrders
        .where((o) => o.orderStatus == OrderLifecycleStatus.delivered)
        .length;
    final cancelledCount = allOrders
        .where((o) => o.orderStatus == OrderLifecycleStatus.cancelled)
        .length;

    // Filter by tab and search
    final filteredOrders = allOrders.where((o) {
      // Tab filter
      if (_selectedTab == 'ACTIVE' && !o.isOrderActive) return false;
      if (_selectedTab == 'DELIVERED' &&
          o.orderStatus != OrderLifecycleStatus.delivered) {
        return false;
      }
      if (_selectedTab == 'CANCELLED' &&
          o.orderStatus != OrderLifecycleStatus.cancelled) {
        return false;
      }

      // Search filter
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchesCode = o.orderCode.toLowerCase().contains(q);
        final matchesItem =
            o.items.any((item) => item.productName.toLowerCase().contains(q));
        if (!matchesCode && !matchesItem) return false;
      }

      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: 2, // Orders active
        cartItemCount: cartState.itemCount,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/catalog');
          } else if (index == 2) {
            // Already here
          } else if (index == 3) {
            context.push('/invoices');
          } else if (index == 4) {
            context.push('/account');
          }
        },
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Header with search and category tabs
            Container(
              color: Colors.white,
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Your Orders',
                            style: AppTypography.headlineMedium.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.primary,
                            ),
                          ),
                          Text(
                            'Batches dispatched fresh daily at dawn',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLow,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.eco_rounded,
                          color: AppColors.primary,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),

                  // Search Bar
                  Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLow,
                      borderRadius: AppRadius.radiusLg,
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() => _searchQuery = val);
                      },
                      decoration: InputDecoration(
                        hintText: 'Search by Order Code (e.g. YM-2026-...)',
                        hintStyle: AppTypography.bodySmall.copyWith(
                          color: AppColors.textMuted,
                        ),
                        prefixIcon: const Icon(
                          Icons.search_rounded,
                          color: AppColors.textMuted,
                          size: 20,
                        ),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear_rounded, size: 18),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() => _searchQuery = '');
                                },
                              )
                            : null,
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Segment Filter Tabs
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildTabChip('ALL', 'All', allOrders.length),
                        _buildTabChip('ACTIVE', 'Active', activeCount),
                        _buildTabChip('DELIVERED', 'Delivered', deliveredCount),
                        _buildTabChip('CANCELLED', 'Cancelled', cancelledCount),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            // 2. Orders List
            Expanded(
              child: filteredOrders.isEmpty
                  ? Center(
                      child: YogEmptyState(
                        title: 'No Orders Found',
                        message: _searchQuery.isNotEmpty
                            ? 'No orders match "$_searchQuery".'
                            : 'You have no $_selectedTab orders currently.',
                        icon: Icons.receipt_long_outlined,
                        actionLabel: 'Browse Morning Catalog',
                        onAction: () => context.go('/catalog'),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(AppSpacing.base),
                      itemCount: filteredOrders.length,
                      itemBuilder: (context, index) {
                        final order = filteredOrders[index];
                        return _buildOrderCard(context, order);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabChip(String tabKey, String label, int count) {
    final isSelected = _selectedTab == tabKey;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: InkWell(
        onTap: () {
          setState(() => _selectedTab = tabKey);
        },
        borderRadius: AppRadius.radiusPill,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary
                : AppColors.surfaceContainerLow,
            borderRadius: AppRadius.radiusPill,
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.borderSubtle,
            ),
          ),
          child: Row(
            children: [
              Text(
                label,
                style: AppTypography.labelSmall.copyWith(
                  color: isSelected ? Colors.white : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Colors.white.withValues(alpha: 0.25)
                      : AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, OrderEntity order) {
    final isPaymentPending =
        order.paymentStatus == PaymentLifecycleStatus.pending;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(
          color: isPaymentPending
              ? const Color(0xFFFDE68A)
              : AppColors.borderSubtle,
          width: isPaymentPending ? 1.5 : 1.0,
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
          // Row 1: Order Code, Copy Icon, Date
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    order.orderCode,
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                      fontFamily: 'monospace',
                    ),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    icon: const Icon(
                      Icons.content_copy_rounded,
                      size: 15,
                      color: AppColors.textMuted,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: order.orderCode));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Order code ${order.orderCode} copied!'),
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                  ),
                ],
              ),
              Row(
                children: [
                  const Icon(
                    Icons.schedule_rounded,
                    size: 13,
                    color: AppColors.textMuted,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${order.orderDate.day}/${order.orderDate.month}/${order.orderDate.year}',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Row 2: 3 DISTINCT STATUS CHIPS (Never merged)
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: [
              // 1. Order Status Chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      order.orderStatusLabel,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Payment Status Chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isPaymentPending
                      ? const Color(0xFFFFF3CD)
                      : AppColors.statusSuccessContainer,
                  borderRadius: AppRadius.radiusPill,
                  border: Border.all(
                    color: isPaymentPending
                        ? const Color(0xFFFFEEBA)
                        : AppColors.statusSuccess.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '₹ ',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isPaymentPending
                            ? const Color(0xFF856404)
                            : AppColors.onStatusSuccess,
                      ),
                    ),
                    Text(
                      order.paymentStatusLabel,
                      style: AppTypography.labelSmall.copyWith(
                        color: isPaymentPending
                            ? const Color(0xFF856404)
                            : AppColors.onStatusSuccess,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),

              // 3. Delivery Status Chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🚚 ', style: TextStyle(fontSize: 10)),
                    Text(
                      order.deliveryStatusLabel,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),

          // Row 3: Product Thumbnails & Summary
          Row(
            children: [
              ...order.items.take(3).map((item) {
                return Container(
                  margin: const EdgeInsets.only(right: AppSpacing.xs),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: AppRadius.radiusMd,
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.water_drop_rounded,
                        size: 14,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '×${item.quantity}',
                        style: AppTypography.labelSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                );
              }),
              if (order.items.length > 3)
                Text(
                  '+${order.items.length - 3} more',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Row 4: Total & Action Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${order.items.length} items · ${order.totalUnits} units',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 10,
                    ),
                  ),
                  Text(
                    '₹${order.totalPayable.toStringAsFixed(2)}',
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  SizedBox(
                    height: 36,
                    child: YogButton.outline(
                      label: 'View Details',
                      height: 36,
                      isFullWidth: false,
                      onPressed: () {
                        context.push('/orders/${order.id}');
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  SizedBox(
                    height: 36,
                    child: YogButton(
                      label: 'Track',
                      icon: const Icon(Icons.location_searching_rounded, size: 14),
                      height: 36,
                      isFullWidth: false,
                      onPressed: () {
                        context.push('/orders/${order.id}/tracking');
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
