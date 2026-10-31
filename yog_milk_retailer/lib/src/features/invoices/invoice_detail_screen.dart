library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_button.dart';
import '../../core/mock_engine/contracts/invoice_repository.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/invoice_controller.dart';
import '../../core/mock_engine/seed/mock_invoices.dart';

/// Commercial Non-GST Invoice Details Screen.
/// Follows Rule 4.5: Non-GST Commercial Billing.
/// Absolutely NO GSTIN, CGST, SGST, IGST, or HSN codes.
class InvoiceDetailScreen extends ConsumerWidget {
  final String invoiceId;

  const InvoiceDetailScreen({
    super.key,
    required this.invoiceId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final invoices = ref.watch(invoicesProvider);
    final invoice = invoices.cast<CommercialInvoiceEntity?>().firstWhere(
          (inv) => inv?.invoiceNumber == invoiceId || inv?.id == invoiceId || inv?.orderCode == invoiceId,
          orElse: () => mockInitialInvoicesList.first,
        )!;

    final isSettled = invoice.paymentStatus == PaymentLifecycleStatus.paid;

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
          'Invoice Details',
          style: AppTypography.titleMedium.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.print_rounded, color: AppColors.primary),
            tooltip: 'Print / Mock PDF Preview',
            onPressed: () => context.push('/invoices/${invoice.invoiceNumber}/preview'),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.borderSubtle)),
        ),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              Expanded(
                child: YogButton.outline(
                  label: 'View Order',
                  icon: const Icon(Icons.receipt_rounded, size: 16),
                  onPressed: () => context.push('/orders/${invoice.orderCode}'),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: YogButton(
                  label: 'Preview PDF Bill',
                  icon: const Icon(Icons.picture_as_pdf_rounded, size: 16),
                  onPressed: () => context.push('/invoices/${invoice.invoiceNumber}/preview'),
                ),
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Prominent Mock Generation Banner (Prompt Requirement)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded, color: AppColors.primary, size: 16),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'PROTOTYPE NOTICE: Mock Non-GST commercial bill generated for client demonstration.',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // 2. Invoice Document Sheet
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusXl,
              border: Border.all(color: AppColors.borderSubtle),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x08051256),
                  blurRadius: 12,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Color Accent Bar
                Container(
                  height: 6,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(AppSpacing.base),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header: Supplier Brand & Emblem
                      Center(
                        child: Column(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainerLow,
                                shape: BoxShape.circle,
                                border: Border.all(color: AppColors.borderSubtle),
                              ),
                              child: const Icon(
                                Icons.spa_rounded,
                                color: AppColors.secondary,
                                size: 28,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              invoice.supplierBusinessName,
                              style: AppTypography.titleMedium.copyWith(
                                fontWeight: FontWeight.w900,
                                color: AppColors.primary,
                                letterSpacing: 0.5,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              invoice.supplierTagline,
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.5,
                                fontSize: 9,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              invoice.supplierAddress,
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 10,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            Text(
                              'FSSAI Reg. No. ${invoice.supplierFssaiNumber} · ${invoice.supplierEmail}',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: AppSpacing.sm),

                            // Non-GST Formal Tag
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainerLow,
                                borderRadius: AppRadius.radiusPill,
                                border: Border.all(color: AppColors.borderSubtle),
                              ),
                              child: Text(
                                'COMMERCIAL BILL OF SUPPLY (NON-GST)',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Divider(height: AppSpacing.lg),

                      // Metadata 2-Column Grid
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLow,
                          borderRadius: AppRadius.radiusLg,
                        ),
                        child: Column(
                          children: [
                            _buildMetaRow('Invoice Number', invoice.invoiceNumber, isMonospace: true, canCopy: true, context: context),
                            const SizedBox(height: 4),
                            _buildMetaRow(
                              'Invoice Date',
                              '${invoice.invoiceDate.day.toString().padLeft(2, '0')}/${invoice.invoiceDate.month.toString().padLeft(2, '0')}/${invoice.invoiceDate.year} · ${invoice.invoiceDate.hour.toString().padLeft(2, '0')}:${invoice.invoiceDate.minute.toString().padLeft(2, '0')}',
                            ),
                            const SizedBox(height: 4),
                            _buildMetaRow('Order Code', invoice.orderCode, isMonospace: true),
                            const SizedBox(height: 4),
                            _buildMetaRow('Delivery Reference', invoice.deliveryReference, isMonospace: true),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Retailer / Customer Details Box
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: AppRadius.radiusLg,
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'BILLED & DELIVERED TO',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w800,
                                fontSize: 10,
                                letterSpacing: 0.8,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              invoice.retailerBusinessName,
                              style: AppTypography.titleSmall.copyWith(
                                fontWeight: FontWeight.w800,
                                color: AppColors.primary,
                              ),
                            ),
                            Text(
                              'Prop. ${invoice.retailerOwnerName}',
                              style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                            ),
                            Text(
                              invoice.retailerAddress,
                              style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary, fontSize: 11),
                            ),
                            Text(
                              'Contact: ${invoice.retailerPhone}',
                              style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Itemized Table
                      Text(
                        'Itemized Products Table',
                        style: AppTypography.titleSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      _buildItemsTable(invoice.items),
                      const SizedBox(height: AppSpacing.md),

                      // Calculations Breakdown Card
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLow,
                          borderRadius: AppRadius.radiusLg,
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: Column(
                          children: [
                            _buildCalcRow('Items Subtotal', '₹${invoice.subtotal.toStringAsFixed(2)}'),
                            const SizedBox(height: 4),
                            _buildCalcRow(
                              'Dawn Delivery Fee',
                              invoice.deliveryFee == 0
                                  ? '₹0.00 (FREE · Sattvic Member)'
                                  : '₹${invoice.deliveryFee.toStringAsFixed(2)}',
                              valueColor: invoice.deliveryFee == 0 ? AppColors.statusSuccess : null,
                            ),
                            if (invoice.discountAmount > 0) ...[
                              const SizedBox(height: 4),
                              _buildCalcRow(
                                'Promotional Discount',
                                '-₹${invoice.discountAmount.toStringAsFixed(2)}',
                                valueColor: AppColors.statusSuccess,
                              ),
                            ],
                            const Divider(height: AppSpacing.md),
                            _buildCalcRow(
                              'Total Commercial Payable',
                              '₹${invoice.totalAmount.toStringAsFixed(2)}',
                              isBold: true,
                              valueColor: AppColors.primary,
                            ),
                            const Divider(height: AppSpacing.md),
                            _buildCalcRow('Payment Method', invoice.paymentMethod),
                            const SizedBox(height: 4),
                            _buildCalcRow(
                              'Payment Status',
                              isSettled ? 'PAID & SETTLED' : 'PENDING (COD COLLECTION)',
                              valueColor: isSettled ? AppColors.statusSuccess : AppColors.secondary,
                              isBold: true,
                            ),
                            if (invoice.paymentReference != null) ...[
                              const SizedBox(height: 4),
                              _buildCalcRow('Transaction Ref', invoice.paymentReference!, isMonospace: true),
                            ],
                            const SizedBox(height: 4),
                            _buildCalcRow('Amount Received', '₹${invoice.amountReceived.toStringAsFixed(2)}', isBold: true),
                            const SizedBox(height: 4),
                            _buildCalcRow(
                              'Balance Due',
                              '₹${invoice.amountDue.toStringAsFixed(2)}',
                              isBold: true,
                              valueColor: invoice.amountDue > 0 ? AppColors.secondary : AppColors.statusSuccess,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // Legal Disclaimer Seal (Rule 4.5)
                      Center(
                        child: Column(
                          children: [
                            Text(
                              'Pure Agricultural Produce · Exempt from GST',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              'Computer Generated Memo · No Physical Signature Required',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                                fontSize: 9,
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
          ),
          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildItemsTable(List<InvoiceLineItemEntity> items) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        children: [
          // Header Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
            decoration: const BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: 5,
                  child: Text('Product & Pack', style: _tableHeaderStyle),
                ),
                Expanded(
                  flex: 2,
                  child: Text('Qty', textAlign: TextAlign.center, style: _tableHeaderStyle),
                ),
                Expanded(
                  flex: 2,
                  child: Text('Rate', textAlign: TextAlign.right, style: _tableHeaderStyle),
                ),
                Expanded(
                  flex: 3,
                  child: Text('Total', textAlign: TextAlign.right, style: _tableHeaderStyle),
                ),
              ],
            ),
          ),

          // Items Rows
          ...items.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            final isEven = idx % 2 == 0;

            return Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
              color: isEven ? Colors.white : AppColors.surfaceContainerLow.withValues(alpha: 0.5),
              child: Row(
                children: [
                  Expanded(
                    flex: 5,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.productName,
                          style: AppTypography.labelSmall.copyWith(fontWeight: FontWeight.w700),
                        ),
                        Text(
                          item.packSize,
                          style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted, fontSize: 9),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '${item.quantity}',
                      textAlign: TextAlign.center,
                      style: AppTypography.labelSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '₹${item.unitPrice.toStringAsFixed(0)}',
                      textAlign: TextAlign.right,
                      style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary),
                    ),
                  ),
                  Expanded(
                    flex: 3,
                    child: Text(
                      '₹${item.lineTotal.toStringAsFixed(2)}',
                      textAlign: TextAlign.right,
                      style: AppTypography.labelSmall.copyWith(fontWeight: FontWeight.w800, color: AppColors.primary),
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

  static const _tableHeaderStyle = TextStyle(
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.5,
  );

  Widget _buildMetaRow(
    String label,
    String value, {
    bool isMonospace = false,
    bool canCopy = false,
    BuildContext? context,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted, fontSize: 10),
        ),
        Row(
          children: [
            Text(
              value,
              style: (isMonospace ? AppTypography.titleSmall : AppTypography.bodySmall).copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
                fontSize: 11,
                fontFamily: isMonospace ? 'monospace' : null,
              ),
            ),
            if (canCopy && context != null) ...[
              const SizedBox(width: 4),
              InkWell(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: value));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Copied $value'), duration: const Duration(seconds: 1)),
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

  Widget _buildCalcRow(
    String label,
    String value, {
    bool isBold = false,
    bool isMonospace = false,
    Color? valueColor,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: isBold ? AppColors.textPrimary : AppColors.textMuted,
              fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: (isBold ? AppTypography.titleSmall : AppTypography.labelSmall).copyWith(
            fontWeight: isBold ? FontWeight.w900 : FontWeight.w600,
            color: valueColor ?? AppColors.textPrimary,
            fontFamily: isMonospace ? 'monospace' : null,
          ),
        ),
      ],
    );
  }
}
