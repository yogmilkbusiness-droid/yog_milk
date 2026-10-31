library;

import 'package:flutter/material.dart';
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

/// Mock PDF Invoice Preview Screen matching Stitch reference:
/// `yog_milk_invoice_preview`
/// Renders an authentic paper-styled Non-GST Commercial Farm Bill with export simulation.
class InvoicePreviewScreen extends ConsumerWidget {
  final String invoiceId;

  const InvoicePreviewScreen({
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
      backgroundColor: const Color(0xFFE2E5F0), // Desk / Paper viewport background
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
              'Mock PDF Preview',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            Text(
              '${invoice.invoiceNumber}.pdf · 240 KB',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
                fontSize: 10,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primary),
            tooltip: 'Share PDF',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Simulated sharing of ${invoice.invoiceNumber}.pdf'),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.print_outlined, color: AppColors.primary),
            tooltip: 'Print',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Connecting to thermal/desktop printer... (Simulated)'),
                  duration: Duration(seconds: 2),
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
          border: Border(top: BorderSide(color: AppColors.borderSubtle)),
          boxShadow: [
            BoxShadow(
              color: Color(0x10051256),
              blurRadius: 10,
              offset: Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Row(
            children: [
              Expanded(
                child: YogButton.outline(
                  label: 'Share Document',
                  icon: const Icon(Icons.share_rounded, size: 16),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Sharing ${invoice.invoiceNumber}.pdf to WhatsApp / Email...')),
                    );
                  },
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: YogButton(
                  label: 'Download PDF',
                  icon: const Icon(Icons.download_rounded, size: 16),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Saved ${invoice.invoiceNumber}.pdf to device downloads! (Mock Generated)'),
                        backgroundColor: AppColors.statusSuccess,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.base),
        child: Column(
          children: [
            // Prominent Mock Banner Callout
            Container(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: AppRadius.radiusMd,
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.science_outlined, color: Color(0xFF92400E), size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'DEVELOPMENT PROTOTYPE: This is a client-side simulated PDF representation. No backend PDF service connected.',
                      style: AppTypography.labelSmall.copyWith(
                        color: const Color(0xFF92400E),
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.md),

            // Paper A4 Sheet
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: AppRadius.radiusMd,
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x18000000),
                    blurRadius: 16,
                    offset: Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Top Gradient Stripe
                  Container(
                    height: 6,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppColors.primary, AppColors.secondary, AppColors.primary],
                      ),
                      borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
                    ),
                  ),

                  // Watermark diagonal ribbon
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    color: AppColors.surfaceContainerHigh.withValues(alpha: 0.6),
                    child: Center(
                      child: Text(
                        '★ MOCK GENERATED INVOICE PREVIEW · NON-GST AGRICULTURAL SUPPLY ★',
                        style: AppTypography.labelSmall.copyWith(
                          fontSize: 9,
                          letterSpacing: 1.2,
                          color: AppColors.primary,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Column(
                      children: [
                        // Farm Emblem & Header
                        Container(
                          width: 54,
                          height: 54,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceContainerLow,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.borderSubtle),
                          ),
                          child: const Icon(
                            Icons.spa_rounded,
                            color: AppColors.secondary,
                            size: 32,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          invoice.supplierBusinessName,
                          style: AppTypography.titleLarge.copyWith(
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
                            letterSpacing: 1.8,
                            fontSize: 9,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          invoice.supplierAddress,
                          style: AppTypography.bodySmall.copyWith(fontSize: 10, color: AppColors.textSecondary),
                          textAlign: TextAlign.center,
                        ),
                        Text(
                          'care@yogmilk.in · +91 98201 54321 · FSSAI Reg. No. ${invoice.supplierFssaiNumber}',
                          style: AppTypography.labelSmall.copyWith(fontSize: 9, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: AppSpacing.sm),

                        // Non-GST Formal Document Title
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: AppRadius.radiusPill,
                          ),
                          child: Text(
                            'COMMERCIAL INVOICE / FARM BILL',
                            style: AppTypography.labelSmall.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 10,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                        const Divider(height: AppSpacing.xl),

                        // Metadata 2-Column Grid
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildField('INVOICE NUMBER', invoice.invoiceNumber, isMonospace: true),
                                  const SizedBox(height: 6),
                                  _buildField('ORDER CODE', invoice.orderCode, isMonospace: true),
                                  const SizedBox(height: 6),
                                  _buildField('DELIVERY REFERENCE', invoice.deliveryReference, isMonospace: true),
                                ],
                              ),
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  _buildField(
                                    'INVOICE DATE',
                                    '${invoice.invoiceDate.day.toString().padLeft(2, '0')}/${invoice.invoiceDate.month.toString().padLeft(2, '0')}/${invoice.invoiceDate.year}',
                                  ),
                                  const SizedBox(height: 6),
                                  _buildField('DISPATCH TIME', '05:30 AM Dawn Drop'),
                                  const SizedBox(height: 6),
                                  _buildField(
                                    'STATUS',
                                    isSettled ? 'PAID & SETTLED' : 'COD UNPAID / DUE',
                                    valueColor: isSettled ? AppColors.statusSuccess : AppColors.secondary,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Retailer Information Card
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.md),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceContainerLow,
                            borderRadius: AppRadius.radiusMd,
                            border: Border.all(color: AppColors.borderSubtle),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'BILLED & DELIVERED TO:',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.secondary,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 9,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${invoice.retailerBusinessName} (Prop. ${invoice.retailerOwnerName})',
                                style: AppTypography.titleSmall.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.primary,
                                ),
                              ),
                              Text(
                                invoice.retailerAddress,
                                style: AppTypography.bodySmall.copyWith(fontSize: 10, color: AppColors.textPrimary),
                              ),
                              Text(
                                'Phone: ${invoice.retailerPhone}',
                                style: AppTypography.labelSmall.copyWith(fontSize: 10, color: AppColors.textMuted),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Itemized Products Grid
                        _buildItemsGrid(invoice.items),
                        const SizedBox(height: AppSpacing.md),

                        // Bill Summary Breakdown
                        Align(
                          alignment: Alignment.centerRight,
                          child: SizedBox(
                            width: 240,
                            child: Column(
                              children: [
                                _buildSummaryLine('Subtotal:', '₹${invoice.subtotal.toStringAsFixed(2)}'),
                                const SizedBox(height: 3),
                                _buildSummaryLine(
                                  'Delivery Charge:',
                                  invoice.deliveryFee == 0 ? 'FREE' : '₹${invoice.deliveryFee.toStringAsFixed(2)}',
                                ),
                                if (invoice.discountAmount > 0) ...[
                                  const SizedBox(height: 3),
                                  _buildSummaryLine(
                                    'Discount:',
                                    '-₹${invoice.discountAmount.toStringAsFixed(2)}',
                                    color: AppColors.statusSuccess,
                                  ),
                                ],
                                const Divider(height: 12),
                                _buildSummaryLine(
                                  'Total Payable:',
                                  '₹${invoice.totalAmount.toStringAsFixed(2)}',
                                  isTotal: true,
                                ),
                                const Divider(height: 12),
                                _buildSummaryLine('Amount Received:', '₹${invoice.amountReceived.toStringAsFixed(2)}'),
                                const SizedBox(height: 3),
                                _buildSummaryLine(
                                  'Amount Due:',
                                  '₹${invoice.amountDue.toStringAsFixed(2)}',
                                  color: invoice.amountDue > 0 ? AppColors.secondary : AppColors.statusSuccess,
                                  isTotal: true,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const Divider(height: AppSpacing.xl),

                        // End-of-Bill Assurance Seal
                        Center(
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.eco_rounded, size: 14, color: AppColors.secondary),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Unadulterated Pure Vedic A2 Produce',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Exempted from GST under section 23(1) of CGST Act (Agricultural Dairy Products).',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 8,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              Text(
                                'Computer Generated Farm Bill · No Physical Signature Required',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textMuted,
                                  fontSize: 8,
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
      ),
    );
  }

  Widget _buildField(String label, String value, {bool isMonospace = false, Color? valueColor}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTypography.labelSmall.copyWith(
            color: AppColors.textMuted,
            fontSize: 9,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
          ),
        ),
        Text(
          value,
          style: (isMonospace ? AppTypography.titleSmall : AppTypography.bodySmall).copyWith(
            fontWeight: FontWeight.w800,
            color: valueColor ?? AppColors.primary,
            fontSize: 11,
            fontFamily: isMonospace ? 'monospace' : null,
          ),
        ),
      ],
    );
  }

  Widget _buildItemsGrid(List<InvoiceLineItemEntity> items) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.borderSubtle),
        borderRadius: AppRadius.radiusMd,
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            color: AppColors.surfaceContainerHigh,
            child: const Row(
              children: [
                Expanded(flex: 5, child: Text('Item & Pack Size', style: _headerStyle)),
                Expanded(flex: 2, child: Text('Qty', textAlign: TextAlign.center, style: _headerStyle)),
                Expanded(flex: 2, child: Text('Rate', textAlign: TextAlign.right, style: _headerStyle)),
                Expanded(flex: 3, child: Text('Line Total', textAlign: TextAlign.right, style: _headerStyle)),
              ],
            ),
          ),
          ...items.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            final isEven = idx % 2 == 0;

            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primary),
                        ),
                        Text(
                          item.packSize,
                          style: const TextStyle(fontSize: 8, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '${item.quantity}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600),
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(
                      '₹${item.unitPrice.toStringAsFixed(0)}',
                      textAlign: TextAlign.right,
                      style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                    ),
                  ),
                  Expanded(
                    flex: 3,
                    child: Text(
                      '₹${item.lineTotal.toStringAsFixed(2)}',
                      textAlign: TextAlign.right,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primary),
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

  static const _headerStyle = TextStyle(
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: AppColors.primary,
  );

  Widget _buildSummaryLine(String label, String value, {bool isTotal = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 11 : 10,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
              color: isTotal ? AppColors.textPrimary : AppColors.textMuted,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: isTotal ? 12 : 10,
            fontWeight: isTotal ? FontWeight.w900 : FontWeight.w600,
            color: color ?? AppColors.primary,
          ),
        ),
      ],
    );
  }
}
