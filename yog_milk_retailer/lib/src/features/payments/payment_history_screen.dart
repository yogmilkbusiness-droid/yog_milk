library;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_empty_state.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/contracts/payment_repository.dart';
import '../../core/mock_engine/payment_controller.dart';
import 'widgets/payment_detail_sheet.dart';

/// Payment History Screen matching Stitch reference:
/// `yog_milk_payment_history`
/// Implements financial transaction ledger, COD pending debt tracker, and gateway attempt details.
class PaymentHistoryScreen extends ConsumerStatefulWidget {
  const PaymentHistoryScreen({super.key});

  @override
  ConsumerState<PaymentHistoryScreen> createState() => _PaymentHistoryScreenState();
}

class _PaymentHistoryScreenState extends ConsumerState<PaymentHistoryScreen> {
  String _selectedTab = 'ALL'; // 'ALL' | 'SUCCESSFUL' | 'PENDING' | 'FAILED'

  @override
  Widget build(BuildContext context) {
    final payments = ref.watch(paymentsProvider);
    final paymentNotifier = ref.read(paymentsProvider.notifier);

    final settledTotal = paymentNotifier.totalSettledAmount;
    final pendingTotal = paymentNotifier.totalPendingAmount;
    final settledCount = payments.where((p) => p.status == PaymentLifecycleStatus.paid).length;
    final pendingCount = payments.where((p) => p.status == PaymentLifecycleStatus.pending).length;
    final failedCount = payments.where((p) => p.status == PaymentLifecycleStatus.failed).length;

    // Filter transactions
    final filteredPayments = payments.where((p) {
      if (_selectedTab == 'SUCCESSFUL' && p.status != PaymentLifecycleStatus.paid) return false;
      if (_selectedTab == 'PENDING' && p.status != PaymentLifecycleStatus.pending) return false;
      if (_selectedTab == 'FAILED' && p.status != PaymentLifecycleStatus.failed) return false;
      return true;
    }).toList();

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
            const Icon(Icons.spa_rounded, color: AppColors.secondary, size: 20),
            const SizedBox(width: AppSpacing.xs),
            Text(
              'Payment History',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.receipt_long_rounded, color: AppColors.primary),
            tooltip: 'View Invoices',
            onPressed: () => context.push('/invoices'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Financial Balance Bento Summary Card
          _buildBentoSummaryCard(settledTotal, settledCount, pendingTotal, pendingCount),
          const SizedBox(height: AppSpacing.md),

          // 2. Pending Payment Debt Notice (When Active)
          if (pendingTotal > 0) ...[
            _buildPendingPaymentAlert(pendingTotal),
            const SizedBox(height: AppSpacing.md),
          ],

          // 3. Segment Filter Tabs
          _buildFilterTabs(payments.length, settledCount, pendingCount, failedCount),
          const SizedBox(height: AppSpacing.md),

          // 4. Activity Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Recent Activity & Records',
                  style: AppTypography.titleSmall.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  'Sattvic Ledger · Oct 2026',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // 5. Transactions List
          if (filteredPayments.isEmpty)
            YogEmptyState(
              title: 'No Transactions Found',
              message: 'There are no $_selectedTab transactions in this period.',
              icon: Icons.payments_outlined,
            )
          else
            ...filteredPayments.map((p) => _buildTransactionCard(context, p, paymentNotifier)),

          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildBentoSummaryCard(
    double settledTotal,
    int settledCount,
    double pendingTotal,
    int pendingCount,
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
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.verified_user_rounded, color: AppColors.secondary, size: 18),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Sattvic Settlement Ledger',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w700,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  'Oct 2026',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: AppSpacing.md),
          Row(
            children: [
              // Settled Payments Box
              Expanded(
                child: Container(
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
                        'Settled Payments',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textMuted,
                          fontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Flexible(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                '₹${settledTotal.toStringAsFixed(0)}',
                                style: AppTypography.titleLarge.copyWith(
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '/ $settledCount ops',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.check_circle_rounded, color: AppColors.statusSuccess, size: 12),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              'Morning drops clear',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.statusSuccess,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),

              // Active COD Due Box
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: pendingTotal > 0 ? AppColors.surfaceVedic : AppColors.surfaceContainerLow,
                    borderRadius: AppRadius.radiusLg,
                    border: Border.all(
                      color: pendingTotal > 0 ? const Color(0xFFFFDBC8) : AppColors.borderSubtle,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Active COD Due',
                            style: AppTypography.labelSmall.copyWith(
                              color: pendingTotal > 0 ? AppColors.secondary : AppColors.textMuted,
                              fontWeight: FontWeight.w700,
                              fontSize: 10,
                            ),
                          ),
                          if (pendingTotal > 0)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Flexible(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                '₹${pendingTotal.toStringAsFixed(0)}',
                                style: AppTypography.titleLarge.copyWith(
                                  fontWeight: FontWeight.w900,
                                  color: pendingTotal > 0 ? AppColors.secondary : AppColors.primary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'due',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        pendingTotal > 0 ? 'Van collection pending' : 'Zero outstanding debt',
                        style: AppTypography.labelSmall.copyWith(
                          color: pendingTotal > 0 ? AppColors.secondary : AppColors.textSecondary,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPendingPaymentAlert(double pendingAmount) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.statusErrorContainer,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: const Color(0xFFFECACA), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.error_outline_rounded, color: AppColors.statusError, size: 20),
              const SizedBox(width: AppSpacing.xs),
              Expanded(
                child: Text(
                  'Pending Cash on Delivery Collection',
                  style: AppTypography.titleSmall.copyWith(
                    color: AppColors.onStatusError,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.statusError,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: const Text(
                  'Rule 4.4 Gate',
                  style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            '₹${pendingAmount.toStringAsFixed(2)} is awaiting depot reconciliation. Under Rule 4.4, new bulk orders cannot be placed until this balance is marked paid by the dispatch desk.',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterTabs(int total, int settled, int pending, int failed) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildFilterChip('ALL', 'All Payments', total),
          _buildFilterChip('SUCCESSFUL', 'Successful', settled),
          _buildFilterChip('PENDING', 'Pending COD', pending, isWarning: pending > 0),
          _buildFilterChip('FAILED', 'Failed', failed, isError: failed > 0),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String key, String label, int count, {bool isWarning = false, bool isError = false}) {
    final isSelected = _selectedTab == key;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: InkWell(
        onTap: () => setState(() => _selectedTab = key),
        borderRadius: AppRadius.radiusPill,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : AppColors.surfaceContainerLow,
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
                      : isError
                          ? AppColors.statusErrorContainer
                          : isWarning
                              ? const Color(0xFFFFDBC8)
                              : AppColors.surfaceContainerHigh,
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isSelected
                        ? Colors.white
                        : isError
                            ? AppColors.statusError
                            : isWarning
                                ? AppColors.secondary
                                : AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionCard(
    BuildContext context,
    PaymentTransactionEntity payment,
    PaymentNotifier notifier,
  ) {
    final isSettled = payment.status == PaymentLifecycleStatus.paid;
    final isPending = payment.status == PaymentLifecycleStatus.pending;
    final isFailed = payment.status == PaymentLifecycleStatus.failed;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(
          color: isFailed
              ? const Color(0xFFFECACA)
              : isPending
                  ? const Color(0xFFFFDBC8)
                  : AppColors.borderSubtle,
          width: (isFailed || isPending) ? 1.5 : 1.0,
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
          // Header: Status chip, Amount & Order Code
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isSettled
                            ? AppColors.surfaceContainerHigh
                            : isPending
                                ? AppColors.surfaceVedic
                                : AppColors.statusErrorContainer,
                        borderRadius: AppRadius.radiusPill,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isSettled
                                ? Icons.check_circle_rounded
                                : isPending
                                    ? Icons.pending_actions_rounded
                                    : Icons.error_rounded,
                            size: 13,
                            color: isSettled
                                ? AppColors.primary
                                : isPending
                                    ? AppColors.secondary
                                    : AppColors.statusError,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            isSettled
                                ? 'Paid'
                                : isPending
                                    ? 'Pending COD'
                                    : 'Failed',
                            style: AppTypography.labelSmall.copyWith(
                              color: isSettled
                                  ? AppColors.primary
                                  : isPending
                                      ? AppColors.secondary
                                      : AppColors.statusError,
                              fontWeight: FontWeight.w800,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    Flexible(
                      child: Text(
                        '₹${payment.amount.toStringAsFixed(2)}',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w900,
                          color: isFailed ? AppColors.statusError : AppColors.primary,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Order Code',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 9,
                    ),
                  ),
                  Text(
                    payment.orderCode,
                    style: AppTypography.labelSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Metadata Details Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusMd,
            ),
            child: Column(
              children: [
                _buildRow(
                  'Method:',
                  payment.methodType.displayLabel,
                  icon: Icons.payments_outlined,
                ),
                const SizedBox(height: 3),
                _buildRow(
                  'Reference:',
                  payment.referenceNumber,
                  icon: Icons.tag_rounded,
                  isMonospace: true,
                ),
                const SizedBox(height: 3),
                _buildRow(
                  'Timestamp:',
                  '${payment.timestamp.day.toString().padLeft(2, '0')}/${payment.timestamp.month.toString().padLeft(2, '0')}/${payment.timestamp.year} · ${payment.timestamp.hour.toString().padLeft(2, '0')}:${payment.timestamp.minute.toString().padLeft(2, '0')}',
                  icon: Icons.schedule_rounded,
                ),
              ],
            ),
          ),

          // Failure Callout
          if (isFailed && payment.failureReason != null) ...[
            const SizedBox(height: AppSpacing.xs),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.statusErrorContainer,
                borderRadius: AppRadius.radiusSm,
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, size: 14, color: AppColors.statusError),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      payment.failureReason!,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.onStatusError,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: AppSpacing.sm),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    PaymentDetailSheet.show(
                      context,
                      payment: payment,
                      onSettleCod: isPending
                          ? () {
                              notifier.settleCodPayment(payment.id);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('COD Payment for ${payment.orderCode} recorded as PAID! Rule 4.4 restriction released.'),
                                  backgroundColor: AppColors.statusSuccess,
                                ),
                              );
                            }
                          : null,
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.borderSubtle),
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                  child: const Text('View Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              if (isFailed) ...[
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => context.push('/cart'),
                    icon: const Icon(Icons.refresh_rounded, size: 14),
                    label: const Text('Retry Pay', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.secondary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                  ),
                ),
              ] else if (isPending) ...[
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      notifier.settleCodPayment(payment.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('COD Payment for ${payment.orderCode} marked PAID! Rule 4.4 restriction released.'),
                          backgroundColor: AppColors.statusSuccess,
                        ),
                      );
                    },
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 14),
                    label: const Text('Simulate Paid', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.statusSuccess,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                  ),
                ),
              ] else ...[
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => context.push('/invoices/${payment.invoiceNumber}/preview'),
                    icon: const Icon(Icons.picture_as_pdf_outlined, size: 14),
                    label: const Text('Bill PDF', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.borderSubtle),
                      shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {IconData? icon, bool isMonospace = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            if (icon != null) ...[
              Icon(icon, size: 13, color: AppColors.textMuted),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 10,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: (isMonospace ? AppTypography.labelSmall : AppTypography.bodySmall).copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
            fontSize: 11,
            fontFamily: isMonospace ? 'monospace' : null,
          ),
        ),
      ],
    );
  }
}
