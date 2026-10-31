import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/design_system/widgets/yog_confirmation_dialog.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/order_controller.dart';
import '../../core/mock_engine/seed/mock_orders.dart';

/// Comprehensive Order Detail Screen matching Stitch references:
/// - `yog_milk_order_detail_cod_pending`
/// - `yog_milk_order_detail_online_paid`
/// Strictly displays: Order code, Order date, Items, Quantities, Prices, Total,
/// Payment method, Payment status, Delivery reference, Delivery status, Status history.
class OrderDetailScreen extends ConsumerWidget {
  final String orderId;

  const OrderDetailScreen({
    super.key,
    required this.orderId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(ordersProvider);
    final ordersNotifier = ref.read(ordersProvider.notifier);

    final order = orders.cast<OrderEntity?>().firstWhere(
          (o) => o?.id == orderId || o?.orderCode == orderId,
          orElse: () => mockActiveOrder,
        )!;

    final isPaymentPending = order.paymentStatus == PaymentLifecycleStatus.pending;
    final isCOD = order.paymentMethod.toUpperCase() == 'COD';
    final canCancel = order.isOrderActive;

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
          'Order Details',
          style: AppTypography.titleMedium.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.textSecondary),
            tooltip: 'Share Order',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Sharing reference for ${order.orderCode}'),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.download_rounded, color: AppColors.primary),
            tooltip: 'Download Non-GST Commercial Bill',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Downloading Commercial Non-GST Invoice (${order.invoiceNumber ?? 'INV-2026-1049'})...',
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: AppColors.borderSubtle),
          ),
        ),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              if (canCancel) ...[
                Expanded(
                  child: YogButton.outline(
                    label: 'Cancel Order',
                    icon: const Icon(Icons.cancel_outlined, size: 16),
                    height: 48,
                    onPressed: () {
                      YogConfirmationDialog.show(
                        context,
                        title: 'Cancel Order',
                        message:
                            'Are you sure you want to cancel ${order.orderCode}? This can only be done before morning batch dispatch.',
                        confirmLabel: 'Confirm Cancel',
                        isDestructive: true,
                      ).then((confirmed) {
                        if (confirmed == true && context.mounted) {
                          ordersNotifier.cancelOrder(order.id);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Order ${order.orderCode} has been cancelled.'),
                              backgroundColor: AppColors.statusError,
                            ),
                          );
                        }
                      });
                    },
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
              ],
              Expanded(
                child: YogButton(
                  label: 'Track Delivery',
                  icon: const Icon(Icons.local_shipping_outlined, size: 18),
                  height: 48,
                  onPressed: () {
                    context.push('/orders/${order.id}/tracking');
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Order Code Reference Chip Card
          _buildOrderReferenceCard(context, order),
          const SizedBox(height: AppSpacing.sm),

          // 2. Status Summary Banner (Amber for COD Pending, Green for Online Paid)
          _buildStatusBanner(order, isPaymentPending),
          const SizedBox(height: AppSpacing.sm),

          // 3. Three Independent Status Chips (Order, Payment, Delivery)
          _buildTriadStatusRow(order, isPaymentPending),
          const SizedBox(height: AppSpacing.md),

          // 4. Delivery Drop Details Card (With Delivery Reference)
          _buildDeliveryDropCard(context, order),
          const SizedBox(height: AppSpacing.md),

          // 5. Items Ordered Card (Name, packSize, quantities, rates, line totals)
          _buildItemsOrderedCard(order),
          const SizedBox(height: AppSpacing.md),

          // 6. Commercial Non-GST Bill Breakdown
          _buildBillBreakdownCard(context, order),
          const SizedBox(height: AppSpacing.md),

          // 7. Payment Mode & Settlement Ref
          _buildPaymentSection(order, isCOD, isPaymentPending),
          const SizedBox(height: AppSpacing.md),

          // 8. Vertical Order Progression Timeline (Status History)
          _buildOrderProgressionTimeline(order),
          const SizedBox(height: 100), // Space for sticky bottom bar
        ],
      ),
    );
  }

  Widget _buildOrderReferenceCard(BuildContext context, OrderEntity order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusMd,
                ),
                child: const Icon(
                  Icons.receipt_long_rounded,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'ORDER REFERENCE',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 10,
                      letterSpacing: 0.8,
                    ),
                  ),
                  Text(
                    order.orderCode,
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ],
          ),
          TextButton.icon(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: order.orderCode));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Order code ${order.orderCode} copied!'),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
            icon: const Icon(Icons.content_copy_rounded, size: 14),
            label: const Text('Copy'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primary,
              backgroundColor: AppColors.surfaceContainerLow,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBanner(OrderEntity order, bool isPending) {
    if (isPending) {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: const Color(0xFFFFF8EC),
          borderRadius: AppRadius.radiusXl,
          border: Border.all(color: const Color(0xFFF4BE77)),
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFE8C2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.pending_actions_rounded,
                    color: Color(0xFF994700),
                    size: 20,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Payment Pending',
                            style: AppTypography.titleMedium.copyWith(
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF602A00),
                            ),
                          ),
                          Text(
                            '₹${order.totalPayable.toStringAsFixed(2)}',
                            style: AppTypography.titleLarge.copyWith(
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF602A00),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Payment stays pending until our delivery partner collects cash at your doorstep and admin confirms recording.',
                        style: AppTypography.bodySmall.copyWith(
                          color: const Color(0xFF753400),
                          fontSize: 11,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: AppSpacing.base, color: Color(0xFFF4BE77)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Awaiting Dawn Handover',
                      style: AppTypography.labelSmall.copyWith(
                        color: const Color(0xFF753400),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                Text(
                  'Doorstep Cash (COD)',
                  style: AppTypography.labelSmall.copyWith(
                    color: const Color(0xFF753400),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: AppColors.statusSuccessContainer.withValues(alpha: 0.6),
          borderRadius: AppRadius.radiusXl,
          border: Border.all(color: AppColors.statusSuccess.withValues(alpha: 0.4)),
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                color: AppColors.statusSuccess,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Payment Confirmed',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.onStatusSuccess,
                        ),
                      ),
                      Text(
                        '₹${order.totalPayable.toStringAsFixed(2)}',
                        style: AppTypography.titleLarge.copyWith(
                          fontWeight: FontWeight.w900,
                          color: AppColors.onStatusSuccess,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'Settled online via Razorpay Gateway · Invoice Generated',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.onStatusSuccess.withValues(alpha: 0.8),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }
  }

  Widget _buildTriadStatusRow(OrderEntity order, bool isPending) {
    return Row(
      children: [
        // Order Status
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              children: [
                Text(
                  'Order',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  order.orderStatusLabel,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 6),

        // Payment Status
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            decoration: BoxDecoration(
              color: isPending
                  ? const Color(0xFFFFF3CD)
                  : AppColors.statusSuccessContainer,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(
                color: isPending
                    ? const Color(0xFFFFEEBA)
                    : AppColors.statusSuccess.withValues(alpha: 0.4),
              ),
            ),
            child: Column(
              children: [
                Text(
                  'Payment',
                  style: AppTypography.labelSmall.copyWith(
                    color: isPending
                        ? const Color(0xFF856404)
                        : AppColors.onStatusSuccess,
                    fontSize: 10,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  order.paymentStatusLabel,
                  style: AppTypography.labelSmall.copyWith(
                    color: isPending
                        ? const Color(0xFF856404)
                        : AppColors.onStatusSuccess,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 6),

        // Delivery Status
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              children: [
                Text(
                  'Delivery',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  order.deliveryStatusLabel,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDeliveryDropCard(BuildContext context, OrderEntity order) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.local_shipping_rounded,
                    color: AppColors.secondary,
                    size: 18,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'DELIVERY DROP DETAILS',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Text(
                    order.deliveryReference,
                    style: AppTypography.labelSmall.copyWith(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    icon: const Icon(
                      Icons.content_copy_rounded,
                      size: 14,
                      color: AppColors.textMuted,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: order.deliveryReference));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Delivery Ref ${order.deliveryReference} copied!',
                          ),
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            order.deliveryAddress,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textPrimary,
              height: 1.4,
            ),
          ),
          if (order.specialInstructions != null) ...[
            const SizedBox(height: AppSpacing.xs),
            Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: const Color(0xFFFBF1DC),
                borderRadius: AppRadius.radiusMd,
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.info_outline_rounded,
                    size: 15,
                    color: AppColors.secondary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Special Instruction: "${order.specialInstructions}"',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textPrimary,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildItemsOrderedCard(OrderEntity order) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.inventory_2_rounded,
                    color: AppColors.primary,
                    size: 18,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Items Ordered',
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              Text(
                '${order.items.length} Items · ${order.totalUnits} Units',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),
          ...order.items.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.productName,
                          style: AppTypography.bodyMedium.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          '${item.packSize} • Qty: ${item.quantity} (${item.crateCount} crates)',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                        Text(
                          '₹${item.unitPrice.toStringAsFixed(2)} / unit',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textMuted,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '₹${item.lineTotal.toStringAsFixed(2)}',
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildBillBreakdownCard(BuildContext context, OrderEntity order) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Bill Breakdown',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  'Non-GST Farm Bill',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Items Subtotal', style: AppTypography.bodySmall),
              Text(
                '₹${order.subtotal.toStringAsFixed(2)}',
                style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.w700),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Dawn Delivery Charge', style: AppTypography.bodySmall),
              Text(
                order.deliveryCharge == 0
                    ? 'FREE'
                    : '₹${order.deliveryCharge.toStringAsFixed(2)}',
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w700,
                  color: order.deliveryCharge == 0
                      ? AppColors.statusSuccess
                      : AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Packaging & Cold Chain', style: AppTypography.bodySmall),
              Text('₹0.00', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.w700)),
            ],
          ),
          const Divider(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Payable',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
              Text(
                '₹${order.totalPayable.toStringAsFixed(2)}',
                style: AppTypography.headlineSmall.copyWith(
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          InkWell(
            onTap: () {
              context.push('/invoices/${order.orderCode}/preview');
            },
            borderRadius: AppRadius.radiusMd,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.description_outlined, size: 16, color: AppColors.primary),
                  SizedBox(width: 8),
                  Text(
                    'View Non-GST Commercial Bill (PDF)',
                    style: TextStyle(
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(width: 4),
                  Icon(Icons.arrow_forward_ios_rounded, size: 11, color: AppColors.primary),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentSection(OrderEntity order, bool isCOD, bool isPending) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.payments_rounded, color: AppColors.primary, size: 18),
                  const SizedBox(width: 6),
                  Text(
                    'Payment Details',
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: isPending
                      ? const Color(0xFFFFF3CD)
                      : AppColors.statusSuccessContainer,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  isPending ? 'Pending Handover' : 'Paid & Settled',
                  style: AppTypography.labelSmall.copyWith(
                    color: isPending
                        ? const Color(0xFF856404)
                        : AppColors.onStatusSuccess,
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Payment Mode', style: AppTypography.bodySmall),
              Text(
                isCOD ? 'Cash on Delivery (COD)' : 'Razorpay Gateway (Online)',
                style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.w700),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(isPending ? 'Amount Due' : 'Amount Paid', style: AppTypography.bodySmall),
              Text(
                '₹${order.totalPayable.toStringAsFixed(2)}',
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: isPending ? AppColors.secondary : AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Settlement Ref', style: AppTypography.bodySmall),
              Text(
                isCOD ? 'COD-PENDING-${order.orderCode.split('-').last}' : 'RZP-SETTLED-${order.orderCode.split('-').last}',
                style: AppTypography.labelSmall.copyWith(
                  fontFamily: 'monospace',
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderProgressionTimeline(OrderEntity order) {
    return Container(
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
              const Icon(Icons.timeline_rounded, color: AppColors.primary, size: 18),
              const SizedBox(width: 6),
              Text(
                'Order Progression',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),
          ...order.statusHistory.map((milestone) {
            final isDone = milestone.isCompleted;

            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: isDone ? AppColors.primary : AppColors.surfaceContainerHigh,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isDone ? Icons.check_rounded : Icons.circle,
                      color: isDone ? Colors.white : AppColors.borderOutline,
                      size: isDone ? 13 : 8,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              milestone.title,
                              style: AppTypography.titleSmall.copyWith(
                                color: isDone ? AppColors.primary : AppColors.textSecondary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Text(
                              '${milestone.timestamp.hour.toString().padLeft(2, '0')}:${milestone.timestamp.minute.toString().padLeft(2, '0')}',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          milestone.description,
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
            );
          }),
        ],
      ),
    );
  }
}
