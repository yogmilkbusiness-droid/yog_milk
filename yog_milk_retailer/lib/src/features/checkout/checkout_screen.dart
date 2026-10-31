import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/operational_gate_banner.dart';
import '../../core/design_system/widgets/pending_payment_alert_card.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/mock_schedule_repository.dart';
import '../../core/mock_engine/order_controller.dart';
import '../../core/mock_engine/seed/mock_orders.dart';
import 'widgets/mid_checkout_closed_dialog.dart';

/// Checkout Screen matching Stitch reference:
/// `yog_milk_checkout`
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  String _selectedPaymentMethod = 'ONLINE'; // 'ONLINE' | 'COD'
  bool _isSummaryExpanded = true;
  final TextEditingController _instructionsController = TextEditingController(
    text: 'Insulated drop crate outside store shutter.',
  );

  @override
  void dispose() {
    _instructionsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);
    final scheduleState = ref.watch(scheduleProvider);
    final authState = ref.watch(authControllerProvider);
    final ordersNotifier = ref.read(ordersProvider.notifier);

    final retailer = authState.profile;
    final shopName = retailer?.businessName ?? 'Om Sai Dairy & Sweets';
    final ownerName = retailer?.ownerName ?? 'Ramesh Patil';
    final phone = retailer?.phone ?? '+91 98201 54321';
    final address = retailer?.deliveryAddress ??
        'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune - 411038';
    final hasPendingBlock =
        (retailer?.hasPendingPaymentBlock ?? false) || ordersNotifier.hasPendingPaymentDebt;

    final isOrderingAllowed =
        scheduleState.isWindowOpen && !hasPendingBlock && cartState.isNotEmpty;

    // Detect when ordering cutoff occurs mid-checkout (Rule 4.1 interception)
    ref.listen(scheduleProvider, (previous, next) {
      if (previous?.isWindowOpen == true && !next.isWindowOpen) {
        MidCheckoutClosedDialog.show(
          context,
          savedItemsCount: cartState.totalUnits,
          nextOpeningDisplay: next.nextOpenDisplay,
        );
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            const Icon(
              Icons.spa_rounded,
              color: AppColors.primary,
              size: 20,
            ),
            const SizedBox(width: AppSpacing.xs),
            Text(
              'Checkout',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.sm,
              vertical: 4,
            ),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: AppRadius.radiusPill,
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.lock_rounded,
                  color: AppColors.primary,
                  size: 14,
                ),
                const SizedBox(width: 4),
                Text(
                  '256-bit Secure',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildStickyBottomBar(
        context,
        cartState,
        isOrderingAllowed,
        scheduleState.isWindowOpen,
        scheduleState.nextOpenDisplay,
        hasPendingBlock,
        ordersNotifier,
        address,
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Operational Gate Banner (Rule 4.1)
          if (!scheduleState.isWindowOpen) ...[
            OperationalGateBanner(
              isOpen: false,
              closesAtTime: scheduleState.closesAtDisplay,
              nextOpenTime: scheduleState.nextOpenDisplay,
              onInfoTap: () {
                MidCheckoutClosedDialog.show(
                  context,
                  savedItemsCount: cartState.totalUnits,
                  nextOpeningDisplay: scheduleState.nextOpenDisplay,
                );
              },
            ),
            const SizedBox(height: AppSpacing.sm),
          ],

          // 2. Pending Payment Debt Restriction (Rule 4.4)
          if (hasPendingBlock) ...[
            PendingPaymentAlertCard(
              orderCode: mockActiveOrder.orderCode,
              pendingAmount: mockActiveOrder.totalPayable,
              paymentMethod: 'Cash on Delivery (COD)',
              onViewOrder: () {
                context.push('/orders/${mockActiveOrder.id}');
              },
            ),
            const SizedBox(height: AppSpacing.sm),
          ],

          // 3. Dawn Drop Slot Indicator Ribbon
          _buildDawnSlotRibbon(),
          const SizedBox(height: AppSpacing.md),

          // 4. Delivery Address Card
          _buildDeliveryAddressCard(shopName, ownerName, phone, address),
          const SizedBox(height: AppSpacing.md),

          // 5. Payment Method Selection (Razorpay vs COD)
          _buildPaymentMethodSection(),
          const SizedBox(height: AppSpacing.md),

          // 6. Order Summary Accordion
          _buildOrderSummaryAccordion(cartState),
          const SizedBox(height: AppSpacing.md),

          // 7. Purity Reassurance Notice
          _buildPurityReassurance(),
          const SizedBox(height: 100), // Space for sticky bottom bar
        ],
      ),
    );
  }

  Widget _buildDawnSlotRibbon() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: 5,
              decoration: const BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.horizontal(
                  left: Radius.circular(8),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                const SizedBox(width: 4),
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerHigh,
                    borderRadius: AppRadius.radiusMd,
                  ),
                  child: const Icon(
                    Icons.wb_twilight_rounded,
                    color: AppColors.secondary,
                    size: 22,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            'SCHEDULED WINDOW',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.8,
                              fontSize: 10,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            width: 4,
                            height: 4,
                            decoration: const BoxDecoration(
                              color: AppColors.secondary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Brahma Muhurta Batch',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Tomorrow Dawn · 5:30 AM – 7:00 AM',
                        style: AppTypography.titleMedium.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w800,
                        ),
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

  Widget _buildDeliveryAddressCard(
    String shopName,
    String ownerName,
    String phone,
    String address,
  ) {
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
                    Icons.location_on_rounded,
                    color: AppColors.secondary,
                    size: 18,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'DAWN DELIVERY DROP POINT',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: () {
                  _showAddressEditSheet(context, address);
                },
                child: Text(
                  'Change',
                  style: AppTypography.labelMedium.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Text(
                ownerName,
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                ' · $phone',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            '$shopName, $address',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.xs,
            ),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusMd,
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.ac_unit_rounded,
                  color: AppColors.primary,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Cold-chain insulated crate drop configured at 4°C',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Select Payment Option',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            Text(
              'Trusted Gateway',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),

        // 1. Pay Online (UPI, Cards, Netbanking via Razorpay)
        InkWell(
          onTap: () {
            setState(() => _selectedPaymentMethod = 'ONLINE');
          },
          borderRadius: AppRadius.radiusXl,
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusXl,
              border: Border.all(
                color: _selectedPaymentMethod == 'ONLINE'
                    ? AppColors.primary
                    : AppColors.borderSubtle,
                width: _selectedPaymentMethod == 'ONLINE' ? 2.0 : 1.0,
              ),
              boxShadow: _selectedPaymentMethod == 'ONLINE'
                  ? const [
                      BoxShadow(
                        color: Color(0x12051256),
                        blurRadius: 10,
                        offset: Offset(0, 3),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 20,
                  height: 20,
                  margin: const EdgeInsets.only(top: 2, right: AppSpacing.sm),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _selectedPaymentMethod == 'ONLINE'
                          ? AppColors.primary
                          : AppColors.borderSubtle,
                      width: 2,
                    ),
                  ),
                  child: _selectedPaymentMethod == 'ONLINE'
                      ? Center(
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                        )
                      : null,
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pay Online (UPI, Cards, Netbanking)',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(
                            Icons.verified_rounded,
                            size: 14,
                            color: AppColors.secondary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Instant verified confirmation · Mock Gateway',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: [
                          _buildPaymentBadge('GPay'),
                          _buildPaymentBadge('PhonePe'),
                          _buildPaymentBadge('Paytm'),
                          _buildPaymentBadge('Visa · MC · RuPay'),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Zero convenience fees & instant receipt generation.',
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
        ),
        const SizedBox(height: AppSpacing.sm),

        // 2. Cash on Delivery (COD)
        InkWell(
          onTap: () {
            setState(() => _selectedPaymentMethod = 'COD');
          },
          borderRadius: AppRadius.radiusXl,
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusXl,
              border: Border.all(
                color: _selectedPaymentMethod == 'COD'
                    ? AppColors.primary
                    : AppColors.borderSubtle,
                width: _selectedPaymentMethod == 'COD' ? 2.0 : 1.0,
              ),
              boxShadow: _selectedPaymentMethod == 'COD'
                  ? const [
                      BoxShadow(
                        color: Color(0x12051256),
                        blurRadius: 10,
                        offset: Offset(0, 3),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 20,
                  height: 20,
                  margin: const EdgeInsets.only(top: 2, right: AppSpacing.sm),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _selectedPaymentMethod == 'COD'
                          ? AppColors.primary
                          : AppColors.borderSubtle,
                      width: 2,
                    ),
                  ),
                  child: _selectedPaymentMethod == 'COD'
                      ? Center(
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                        )
                      : null,
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Cash on Delivery (COD)',
                            style: AppTypography.titleMedium.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.sm,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceContainerHigh,
                              borderRadius: AppRadius.radiusPill,
                            ),
                            child: Text(
                              'Offline Handover',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLow,
                          borderRadius: AppRadius.radiusMd,
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: Text(
                          'Rule 4.3: Pay cash at morning delivery. Payment status stays PENDING until authorized YOG MILK administrator manually logs receipt.',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 11,
                            height: 1.4,
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
      ],
    );
  }

  Widget _buildPaymentBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Text(
        label,
        style: AppTypography.labelSmall.copyWith(
          color: AppColors.primary,
          fontWeight: FontWeight.w700,
          fontSize: 10,
        ),
      ),
    );
  }

  Widget _buildOrderSummaryAccordion(CartState cart) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() => _isSummaryExpanded = !_isSummaryExpanded);
            },
            borderRadius: BorderRadius.vertical(
              top: const Radius.circular(20),
              bottom: Radius.circular(_isSummaryExpanded ? 0 : 20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.receipt_long_rounded,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Order Summary (${cart.itemCount} items · ${cart.totalUnits} units)',
                            style: AppTypography.titleMedium.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          Text(
                            'Batch No: YOG-SAT-0491',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Icon(
                    _isSummaryExpanded
                        ? Icons.expand_less_rounded
                        : Icons.expand_more_rounded,
                    color: AppColors.textMuted,
                  ),
                ],
              ),
            ),
          ),
          if (_isSummaryExpanded) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                children: [
                  ...cart.items.map((item) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: Row(
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
                              const SizedBox(width: AppSpacing.xs),
                              Column(
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
                                    '${item.packSize} · ${item.crateCount} crates (${item.looseCount} pkts)',
                                    style: AppTypography.bodySmall.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '₹${item.lineTotal.toStringAsFixed(2)}',
                                style: AppTypography.titleSmall.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.primary,
                                ),
                              ),
                              Text(
                                '×${item.quantity} units',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
                  const Divider(height: AppSpacing.md),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Items Subtotal',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        '₹${cart.subtotal.toStringAsFixed(2)}',
                        style: AppTypography.titleSmall.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Dawn Express Crate Delivery',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        cart.deliveryFee == 0
                            ? 'FREE (Threshold Reached)'
                            : '₹${cart.deliveryFee.toStringAsFixed(2)}',
                        style: AppTypography.bodySmall.copyWith(
                          fontWeight: FontWeight.w700,
                          color: cart.deliveryFee == 0
                              ? AppColors.statusSuccess
                              : AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPurityReassurance() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh.withValues(alpha: 0.5),
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.workspace_premium_rounded,
            color: AppColors.secondary,
            size: 20,
          ),
          const SizedBox(width: AppSpacing.xs),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '100% Single-Origin A2 Vedic Dairy Batch',
                  style: AppTypography.titleSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Prices confirmed at order placement. Guaranteed hormone-free milk chilled within 45 mins. Non-GST commercial agricultural memo generated upon dispatch.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyBottomBar(
    BuildContext context,
    CartState cart,
    bool isOrderingAllowed,
    bool isWindowOpen,
    String nextOpenDisplay,
    bool hasPendingBlock,
    OrdersNotifier ordersNotifier,
    String address,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: AppColors.borderSubtle),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x10051256),
            blurRadius: 16,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TOTAL PAYABLE',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      '₹${cart.totalPayable.toStringAsFixed(2)}',
                      style: AppTypography.headlineSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(
                      Icons.eco_rounded,
                      color: AppColors.secondary,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Doorstep Dawn Chilled',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            YogButton(
              label: !isWindowOpen
                  ? 'Ordering Closed'
                  : hasPendingBlock
                      ? 'Pending Payment Debt Blocked'
                      : cart.isEmpty
                          ? 'Basket is Empty'
                          : _selectedPaymentMethod == 'ONLINE'
                              ? 'Pay & Confirm · ₹${cart.totalPayable.toStringAsFixed(2)}'
                              : 'Place COD Order · ₹${cart.totalPayable.toStringAsFixed(2)}',
              icon: const Icon(Icons.arrow_forward_rounded, size: 18),
              height: 50,
              onPressed: !isWindowOpen
                  ? () {
                      MidCheckoutClosedDialog.show(
                        context,
                        savedItemsCount: cart.totalUnits,
                        nextOpeningDisplay: nextOpenDisplay,
                      );
                    }
                  : !isOrderingAllowed
                      ? null
                      : () {
                      if (_selectedPaymentMethod == 'ONLINE') {
                        // Navigate to Verifying Payment screen for simulated 3s gateway verification
                        context.push(
                          '/checkout/verifying',
                          extra: {
                            'cartItems': cart.items,
                            'deliveryAddress': address,
                            'specialInstructions':
                                _instructionsController.text.trim(),
                            'totalAmount': cart.totalPayable,
                          },
                        );
                      } else {
                        // Cash on Delivery direct creation
                        final newOrder = ordersNotifier.createOrder(
                          cartItems: cart.items,
                          paymentMethod: 'COD',
                          deliveryAddress: address,
                          specialInstructions:
                              _instructionsController.text.trim(),
                          isOnlinePaid: false,
                        );

                        // Clear cart
                        ref.read(cartProvider.notifier).clearCart();

                        // Navigate to Order Success Screen
                        context.go('/orders/${newOrder.id}/success');
                      }
                    },
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'By placing order you agree to Yog Milk B2B Dawn Delivery Operations Policy',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 10,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _showAddressEditSheet(BuildContext context, String currentAddress) {
    final textController = TextEditingController(text: currentAddress);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (sheetCtx) => Padding(
        padding: EdgeInsets.only(
          left: AppSpacing.base,
          right: AppSpacing.base,
          top: AppSpacing.base,
          bottom: MediaQuery.of(sheetCtx).viewInsets.bottom + AppSpacing.base,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Edit Delivery Address',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w800,
                    color: AppColors.primary,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded),
                  onPressed: () => Navigator.of(sheetCtx).pop(),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            TextField(
              controller: textController,
              maxLines: 3,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: AppRadius.radiusMd,
                  borderSide: const BorderSide(color: AppColors.borderSubtle),
                ),
                hintText: 'Enter shop number, street, area, city, pincode',
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            YogButton(
              label: 'Update Address',
              onPressed: () {
                Navigator.of(sheetCtx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Delivery address updated for this order.'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
