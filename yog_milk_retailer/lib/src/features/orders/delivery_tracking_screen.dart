import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/order_controller.dart';
import '../../core/mock_engine/seed/mock_orders.dart';

/// Dawn Delivery Tracking Screen matching Stitch reference:
/// `yog_milk_delivery_tracking`
class DeliveryTrackingScreen extends ConsumerWidget {
  final String orderId;

  const DeliveryTrackingScreen({
    super.key,
    required this.orderId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(ordersProvider);
    final order = orders.cast<OrderEntity?>().firstWhere(
          (o) => o?.id == orderId || o?.orderCode == orderId,
          orElse: () => mockActiveOrder,
        )!;

    final isOutForDelivery =
        order.deliveryStatus == DeliveryLifecycleStatus.outForDelivery;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Dawn Delivery Tracking',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            Text(
              'Order ${order.orderCode}',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: AppRadius.radiusPill,
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.spa_rounded,
                  color: AppColors.secondary,
                  size: 13,
                ),
                const SizedBox(width: 4),
                Text(
                  'Sattvic A2',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 0. If delivery failed, display unsuccessful attempt banner
          if (order.deliveryStatus == DeliveryLifecycleStatus.failed) ...[
            _buildFailedDeliveryAlert(context, order),
            const SizedBox(height: AppSpacing.md),
          ],

          // 1. Header Card: Tracking Ref Code, Status Pill, Destination
          _buildTrackingHeaderCard(context, order, isOutForDelivery),
          const SizedBox(height: AppSpacing.md),

          // 2. 5-Stage Doorstep Delivery Timeline Stepper
          _buildDeliveryTimelineStepper(order),
          const SizedBox(height: AppSpacing.md),

          // 3. Special Delivery Instructions Card
          _buildSpecialInstructionsCard(order),
          const SizedBox(height: AppSpacing.md),

          // 4. Operations Team & Support Actions
          _buildOperationsContactButtons(context),
          const SizedBox(height: AppSpacing.lg),

          // 5. Sacred Dairy Assurance Footer
          _buildVedicFooter(),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  Widget _buildFailedDeliveryAlert(BuildContext context, OrderEntity order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.errorContainer.withValues(alpha: 0.35),
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.error.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.error_outline_rounded,
                    color: AppColors.error, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'DAWN DROP STATUS',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.error,
                        fontWeight: FontWeight.w800,
                        fontSize: 9.5,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      'Delivery Attempt Unsuccessful',
                      style: AppTypography.titleMedium.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.door_front_door_outlined,
                        size: 16, color: AppColors.secondary),
                    const SizedBox(width: 6),
                    Text(
                      'Drop Issue Noted',
                      style: AppTypography.titleSmall.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Store shutter closed during morning dawn delivery attempt. Our dispatch coordinator will reach out to reschedule the morning drop.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
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

  Widget _buildTrackingHeaderCard(
    BuildContext context,
    OrderEntity order,
    bool isOutForDelivery,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            runSpacing: 6,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DISPATCH REF CODE',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 10,
                      letterSpacing: 0.8,
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        order.deliveryReference,
                        style: AppTypography.titleLarge.copyWith(
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                          fontFamily: 'monospace',
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
                          Clipboard.setData(
                            ClipboardData(text: order.deliveryReference),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                'Dispatch ref ${order.deliveryReference} copied!',
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
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isOutForDelivery
                      ? AppColors.secondaryContainer.withValues(alpha: 0.15)
                      : AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                  border: Border.all(
                    color: isOutForDelivery
                        ? AppColors.secondaryContainer
                        : AppColors.borderSubtle,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🚚 ', style: TextStyle(fontSize: 12)),
                    Text(
                      order.deliveryStatusLabel,
                      style: AppTypography.labelSmall.copyWith(
                        color: isOutForDelivery
                            ? AppColors.secondary
                            : AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),

          // Destination
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: AppRadius.radiusMd,
                ),
                child: const Icon(
                  Icons.storefront_rounded,
                  size: 16,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Drop Destination',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                      ),
                    ),
                    Text(
                      order.deliveryAddress,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveryTimelineStepper(OrderEntity order) {
    final stages = [
      (
        DeliveryLifecycleStatus.notAssigned,
        'Not assigned',
        'Order received and queued in route dispatcher',
        'Dawn Batch Synchronized',
      ),
      (
        DeliveryLifecycleStatus.assigned,
        'Assigned',
        'Assigned to Kothrud-Paud Morning Delivery Route',
        'Driver: Santosh Jadhav (MH 12 QX 4812)',
      ),
      (
        DeliveryLifecycleStatus.pickedUp,
        'Picked up',
        'Package picked up from central cold storage depot',
        'Cold-chain temperature inspected at 4°C',
      ),
      (
        DeliveryLifecycleStatus.outForDelivery,
        'Out for delivery',
        'Chilled transit to your storefront drop point',
        '“Package safely packed in temperature-controlled crate.”',
      ),
      (
        DeliveryLifecycleStatus.delivered,
        'Delivered',
        'Estimated dawn delivery upon drop confirmation',
        'Doorstep inspection & return crate handover',
      ),
    ];

    // Determine current index based on deliveryStatus
    final currentStatusIndex = stages.indexWhere(
      (s) => s.$1 == order.deliveryStatus,
    );
    final activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 1;

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
              Expanded(
                child: Row(
                  children: [
                    const Icon(
                      Icons.local_shipping_rounded,
                      color: AppColors.primary,
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        'Delivery Status Progress',
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
              const SizedBox(width: 8),
              Text(
                'Stage ${activeIndex + 1} of 5',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.base),

          // Stepper Items
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: stages.length,
            itemBuilder: (context, index) {
              final stage = stages[index];
              final isCompleted = index <= activeIndex;
              final isCurrent = index == activeIndex;

              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Step Indicator
                    Column(
                      children: [
                        Container(
                          width: 26,
                          height: 26,
                          decoration: BoxDecoration(
                            color: isCurrent
                                ? AppColors.secondary
                                : isCompleted
                                    ? AppColors.primary
                                    : AppColors.surfaceContainerLow,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isCompleted
                                  ? Colors.transparent
                                  : AppColors.borderOutline,
                            ),
                          ),
                          child: Icon(
                            isCompleted ? Icons.check_rounded : Icons.circle,
                            color: isCompleted
                                ? Colors.white
                                : AppColors.borderOutline,
                            size: isCompleted ? 16 : 8,
                          ),
                        ),
                        if (index < stages.length - 1)
                          Container(
                            width: 2,
                            height: 38,
                            color: isCompleted
                                ? AppColors.primary.withValues(alpha: 0.5)
                                : AppColors.borderSubtle,
                          ),
                      ],
                    ),
                    const SizedBox(width: AppSpacing.md),

                    // Stage Title & Descriptions
                    Expanded(
                      child: Container(
                        padding: isCurrent
                            ? const EdgeInsets.all(AppSpacing.sm)
                            : EdgeInsets.zero,
                        decoration: isCurrent
                            ? BoxDecoration(
                                color: AppColors.surfaceContainerLow,
                                borderRadius: AppRadius.radiusMd,
                                border: Border.all(
                                  color: AppColors.secondaryContainer.withValues(alpha: 0.4),
                                ),
                              )
                            : null,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  stage.$2,
                                  style: AppTypography.titleSmall.copyWith(
                                    fontWeight: isCurrent
                                        ? FontWeight.w900
                                        : FontWeight.w700,
                                    color: isCompleted
                                        ? AppColors.primary
                                        : AppColors.textMuted,
                                  ),
                                ),
                                if (isCurrent)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 6,
                                      vertical: 1,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.secondary,
                                      borderRadius: AppRadius.radiusPill,
                                    ),
                                    child: const Text(
                                      'Active Now',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              stage.$3,
                              style: AppTypography.bodySmall.copyWith(
                                color: isCompleted
                                    ? AppColors.textSecondary
                                    : AppColors.textMuted,
                                fontSize: 11,
                              ),
                            ),
                            if (isCurrent) ...[
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.chat_bubble_outline_rounded,
                                    size: 11,
                                    color: AppColors.secondary,
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      stage.$4,
                                      style: AppTypography.labelSmall.copyWith(
                                        color: AppColors.secondary,
                                        fontStyle: FontStyle.italic,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialInstructionsCard(OrderEntity order) {
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
              const Icon(
                Icons.assignment_late_outlined,
                color: AppColors.secondary,
                size: 18,
              ),
              const SizedBox(width: 6),
              Text(
                'Special Delivery Instructions',
                style: AppTypography.titleSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '“${order.specialInstructions ?? 'Insulated drop crate outside store shutter.'}”',
                  style: AppTypography.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Please leave yesterday’s rinsed glass bottles and empty crates inside the designated canvas pouch for sterilization & refund.',
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
  }

  Widget _buildOperationsContactButtons(BuildContext context) {
    return Column(
      children: [
        YogButton(
          label: 'Call Operations Dispatch (5:00 AM – 10:00 PM)',
          icon: const Icon(Icons.call_rounded, size: 18),
          height: 48,
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Calling YOG MILK Pune Operations Desk (+91 20 2500 0000)...'),
              ),
            );
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        YogButton.outline(
          label: 'WhatsApp Operations Helpdesk',
          icon: const Icon(Icons.chat_rounded, size: 18),
          height: 46,
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Opening WhatsApp support channel (+91 98765 43210)...'),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildVedicFooter() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.spa_rounded, size: 14, color: AppColors.secondary),
            const SizedBox(width: 4),
            Text(
              'YOG MILK · FROM NATURE TO NOURISH YOU',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                letterSpacing: 1.0,
                fontSize: 10,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          'Direct Farm Line: Western Maharashtra Agro Corridor · Pure Gir A2 Dairy Heritage',
          style: AppTypography.labelSmall.copyWith(
            color: AppColors.textMuted,
            fontSize: 9,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

