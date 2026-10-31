library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_empty_state.dart';
import '../../core/mock_engine/contracts/invoice_repository.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/invoice_controller.dart';

/// Commercial Non-GST Invoices List Screen matching Stitch reference:
/// `yog_milk_invoices_list`
/// Strictly Non-GST agricultural commercial billing. Zero GSTIN / GST calculations.
class InvoicesListScreen extends ConsumerStatefulWidget {
  const InvoicesListScreen({super.key});

  @override
  ConsumerState<InvoicesListScreen> createState() => _InvoicesListScreenState();
}

class _InvoicesListScreenState extends ConsumerState<InvoicesListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedFilter = 'ALL'; // 'ALL' | 'PAID' | 'PENDING'
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final invoices = ref.watch(invoicesProvider);
    final invoiceNotifier = ref.read(invoicesProvider.notifier);

    final totalBilled = invoiceNotifier.totalBilledAmount;
    final paidCount = invoiceNotifier.paidCount;
    final pendingCount = invoiceNotifier.pendingCount;

    // Filter by tab and search query
    final filteredInvoices = invoices.where((inv) {
      if (_selectedFilter == 'PAID' && inv.paymentStatus != PaymentLifecycleStatus.paid) {
        return false;
      }
      if (_selectedFilter == 'PENDING' && inv.paymentStatus != PaymentLifecycleStatus.pending) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchesInv = inv.invoiceNumber.toLowerCase().contains(q);
        final matchesOrder = inv.orderCode.toLowerCase().contains(q);
        final matchesItems = inv.items.any((i) => i.productName.toLowerCase().contains(q));
        if (!matchesInv && !matchesOrder && !matchesItems) return false;
      }
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
            const Icon(Icons.receipt_long_rounded, color: AppColors.primary, size: 20),
            const SizedBox(width: AppSpacing.xs),
            Text(
              'Commercial Invoices',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded, color: AppColors.primary),
            tooltip: 'Payment History',
            onPressed: () => context.push('/payments'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // 1. Cycle Total Billed Bento Card
          _buildBentoCycleCard(totalBilled, invoices.length, pendingCount),
          const SizedBox(height: AppSpacing.md),

          // 2. Search Input
          _buildSearchBar(),
          const SizedBox(height: AppSpacing.md),

          // 3. Segment Filter Pills
          _buildFilterPills(invoices.length, paidCount, pendingCount),
          const SizedBox(height: AppSpacing.md),

          // 4. Invoices Cards List
          if (filteredInvoices.isEmpty)
            YogEmptyState(
              title: 'No Invoices Found',
              message: _searchQuery.isNotEmpty
                  ? 'No invoices match "$_searchQuery".'
                  : 'There are no $_selectedFilter invoices recorded.',
              icon: Icons.receipt_long_outlined,
            )
          else
            ...filteredInvoices.map((inv) => _buildInvoiceCard(context, inv)),

          const SizedBox(height: AppSpacing.xxl),
        ],
      ),
    );
  }

  Widget _buildBentoCycleCard(double totalBilled, int totalCount, int pendingCount) {
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerHigh,
                        borderRadius: AppRadius.radiusPill,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 12, color: AppColors.primary),
                          const SizedBox(width: 4),
                          Text(
                            'Cycle: Oct 2026',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Total Billed Amount',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 11,
                      ),
                    ),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '₹${totalBilled.toStringAsFixed(2)}',
                            style: AppTypography.headlineSmall.copyWith(
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '/ $totalCount Invoices',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.textMuted,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: pendingCount == 0 ? const Color(0xFFF0FDF4) : AppColors.surfaceVedic,
                      borderRadius: AppRadius.radiusPill,
                      border: Border.all(
                        color: pendingCount == 0 ? const Color(0xFFBBF7D0) : const Color(0xFFFFDBC8),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          pendingCount == 0 ? Icons.verified_user_rounded : Icons.pending_actions_rounded,
                          size: 14,
                          color: pendingCount == 0 ? AppColors.statusSuccess : AppColors.secondary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          pendingCount == 0 ? 'All-Settled' : '$pendingCount COD Pending',
                          style: AppTypography.labelSmall.copyWith(
                            color: pendingCount == 0 ? AppColors.statusSuccess : AppColors.secondary,
                            fontWeight: FontWeight.w800,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rule 4.5 Non-GST',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 9,
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

  Widget _buildSearchBar() {
    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: TextField(
        controller: _searchController,
        onChanged: (val) => setState(() => _searchQuery = val),
        decoration: InputDecoration(
          hintText: 'Search by Invoice (INV-) or Order (YM-)...',
          hintStyle: AppTypography.bodySmall.copyWith(color: AppColors.textMuted),
          prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppColors.textMuted),
          suffixIcon: _searchQuery.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear_rounded, size: 16),
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
    );
  }

  Widget _buildFilterPills(int total, int paid, int pending) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildFilterPill('ALL', 'All Invoices', total),
          _buildFilterPill('PAID', 'Paid & Settled', paid),
          _buildFilterPill('PENDING', 'Pending COD', pending, isWarning: pending > 0),
        ],
      ),
    );
  }

  Widget _buildFilterPill(String key, String label, int count, {bool isWarning = false}) {
    final isSelected = _selectedFilter == key;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: InkWell(
        onTap: () => setState(() => _selectedFilter = key),
        borderRadius: AppRadius.radiusPill,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.white,
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

  Widget _buildInvoiceCard(BuildContext context, CommercialInvoiceEntity invoice) {
    final isSettled = invoice.paymentStatus == PaymentLifecycleStatus.paid;
    final isPending = invoice.paymentStatus == PaymentLifecycleStatus.pending;
    final itemsSummary = invoice.items.map((i) => i.productName).join(', ');

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(
          color: isPending ? const Color(0xFFFFDBC8) : AppColors.borderSubtle,
          width: isPending ? 1.5 : 1.0,
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
          // Header: Invoice Number & Status Pill
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Flexible(
                      child: Text(
                        invoice.invoiceNumber,
                        style: AppTypography.titleSmall.copyWith(
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                          fontFamily: 'monospace',
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    InkWell(
                      onTap: () {
                        Clipboard.setData(ClipboardData(text: invoice.invoiceNumber));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Copied ${invoice.invoiceNumber}')),
                        );
                      },
                      child: const Icon(Icons.copy_rounded, size: 14, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isSettled ? const Color(0xFFF0FDF4) : AppColors.surfaceVedic,
                  borderRadius: AppRadius.radiusPill,
                  border: Border.all(
                    color: isSettled ? const Color(0xFFBBF7D0) : const Color(0xFFFFDBC8),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isSettled ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
                      size: 12,
                      color: isSettled ? AppColors.statusSuccess : AppColors.secondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isSettled ? 'Paid & Settled' : 'COD Due (Pending)',
                      style: AppTypography.labelSmall.copyWith(
                        color: isSettled ? AppColors.statusSuccess : AppColors.secondary,
                        fontWeight: FontWeight.w800,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            'Order Ref: ${invoice.orderCode}',
            style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted, fontSize: 10),
          ),
          const Divider(height: AppSpacing.md),

          // Details Preview Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: AppRadius.radiusMd,
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
                          const Icon(Icons.wb_twilight_rounded, size: 13, color: AppColors.secondary),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              '${invoice.invoiceDate.day.toString().padLeft(2, '0')}/${invoice.invoiceDate.month.toString().padLeft(2, '0')}/${invoice.invoiceDate.year} · Dawn Batch',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                                fontSize: 10,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${invoice.items.length} SKUs included',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  itemsSummary,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textPrimary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Total Value Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Text(
                  'Total Bill Value (Non-GST):',
                  style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '₹${invoice.totalAmount.toStringAsFixed(2)}',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => context.push('/invoices/${invoice.invoiceNumber}'),
                  icon: const Icon(Icons.visibility_rounded, size: 14),
                  label: const Text('View Bill', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/invoices/${invoice.invoiceNumber}/preview'),
                  icon: const Icon(Icons.picture_as_pdf_rounded, size: 14),
                  label: const Text('Mock PDF', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.radiusMd),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
