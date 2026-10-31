library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../../core/design_system/tokens/app_colors.dart';
import '../../../core/design_system/tokens/app_radius.dart';
import '../../../core/design_system/tokens/app_spacing.dart';
import '../../../core/design_system/tokens/app_typography.dart';
import '../../../core/design_system/widgets/yog_bottom_sheet.dart';
import '../../../core/design_system/widgets/yog_button.dart';
import '../../../core/mock_engine/contracts/order_repository.dart';
import '../../../core/mock_engine/contracts/payment_repository.dart';

/// Modal bottom sheet displaying detailed payment transaction breakdown.
class PaymentDetailSheet {
  static void show(
    BuildContext context, {
    required PaymentTransactionEntity payment,
    VoidCallback? onSettleCod,
  }) {
    final isCOD = payment.methodType == PaymentMethodType.cod;
    final isSettled = payment.status == PaymentLifecycleStatus.paid;
    final isPending = payment.status == PaymentLifecycleStatus.pending;
    final isFailed = payment.status == PaymentLifecycleStatus.failed;

    YogBottomSheet.show(
      context,
      title: 'Payment Details',
      subtitle: 'Transaction Ref: ${payment.referenceNumber}',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status Pill & Amount Hero Card
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: isSettled
                  ? const Color(0xFFF0FDF4)
                  : isPending
                      ? AppColors.surfaceVedic
                      : AppColors.statusErrorContainer,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(
                color: isSettled
                    ? const Color(0xFFBBF7D0)
                    : isPending
                        ? const Color(0xFFFFDBC8)
                        : const Color(0xFFFECACA),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TRANSACTION AMOUNT',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        letterSpacing: 0.8,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '₹${payment.amount.toStringAsFixed(2)}',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.w900,
                        color: isFailed ? AppColors.statusError : AppColors.primary,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isSettled
                        ? AppColors.statusSuccess
                        : isPending
                            ? AppColors.secondary
                            : AppColors.statusError,
                    borderRadius: AppRadius.radiusPill,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isSettled
                            ? Icons.check_circle_rounded
                            : isPending
                                ? Icons.pending_actions_rounded
                                : Icons.error_outline_rounded,
                        color: Colors.white,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isSettled
                            ? 'PAID'
                            : isPending
                                ? 'PENDING'
                                : 'FAILED',
                        style: AppTypography.labelSmall.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Failure Reason Callout (if failed)
          if (isFailed && payment.failureReason != null) ...[
            Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.statusErrorContainer,
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: const Color(0xFFFECACA)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: AppColors.statusError, size: 18),
                  const SizedBox(width: AppSpacing.xs),
                  Expanded(
                    child: Text(
                      payment.failureReason!,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.onStatusError,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],

          // Settlement Metrics Grid
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusLg,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Column(
              children: [
                _buildInfoRow('Associated Order', payment.orderCode, isMonospace: true),
                const Divider(height: AppSpacing.md),
                _buildInfoRow('Commercial Invoice', payment.invoiceNumber, isMonospace: true),
                const Divider(height: AppSpacing.md),
                _buildInfoRow('Payment Method', payment.methodType.displayLabel),
                const Divider(height: AppSpacing.md),
                _buildInfoRow('Gateway / Slip Ref', payment.referenceNumber, isMonospace: true, canCopy: true, context: context),
                const Divider(height: AppSpacing.md),
                _buildInfoRow(
                  'Timestamp',
                  '${payment.timestamp.day.toString().padLeft(2, '0')}/${payment.timestamp.month.toString().padLeft(2, '0')}/${payment.timestamp.year} · ${payment.timestamp.hour.toString().padLeft(2, '0')}:${payment.timestamp.minute.toString().padLeft(2, '0')}',
                ),
                if (payment.collectorStaffName != null) ...[
                  const Divider(height: AppSpacing.md),
                  _buildInfoRow('Route Driver / Collector', payment.collectorStaffName!),
                ],
                const Divider(height: AppSpacing.md),
                _buildInfoRow('Amount Received', '₹${payment.amountReceived.toStringAsFixed(2)}', isBold: true),
                const Divider(height: AppSpacing.md),
                _buildInfoRow(
                  'Balance Due',
                  '₹${payment.amountDue.toStringAsFixed(2)}',
                  valueColor: payment.amountDue > 0 ? AppColors.secondary : AppColors.statusSuccess,
                  isBold: true,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Settlement Note
          if (payment.settlementNote != null) ...[
            Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.description_outlined, color: AppColors.textSecondary, size: 16),
                  const SizedBox(width: AppSpacing.xs),
                  Expanded(
                    child: Text(
                      payment.settlementNote!,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
        ],
      ),
      bottomAction: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isPending && isCOD && onSettleCod != null) ...[
            YogButton(
              label: 'Simulate Admin Depot Cash Settlement',
              icon: const Icon(Icons.point_of_sale_rounded, size: 18),
              onPressed: () {
                Navigator.of(context).pop();
                onSettleCod();
              },
            ),
            const SizedBox(height: AppSpacing.xs),
          ],
          Row(
            children: [
              Expanded(
                child: YogButton.outline(
                  label: 'View Order',
                  icon: const Icon(Icons.receipt_rounded, size: 16),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.push('/orders/${payment.orderId}');
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: YogButton(
                  label: 'View Bill',
                  icon: const Icon(Icons.picture_as_pdf_outlined, size: 16),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.push('/invoices/${payment.invoiceNumber}');
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  static Widget _buildInfoRow(
    String label,
    String value, {
    bool isMonospace = false,
    bool isBold = false,
    Color? valueColor,
    bool canCopy = false,
    BuildContext? context,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted),
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              value,
              style: (isMonospace ? AppTypography.titleSmall : AppTypography.bodySmall).copyWith(
                fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
                color: valueColor ?? AppColors.primary,
                fontFamily: isMonospace ? 'monospace' : null,
              ),
            ),
            if (canCopy && context != null) ...[
              const SizedBox(width: 4),
              InkWell(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: value));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Copied $value'),
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
                child: const Icon(Icons.copy_rounded, size: 12, color: AppColors.textMuted),
              ),
            ],
          ],
        ),
      ],
    );
  }
}

