library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/invoice_repository.dart';
import 'contracts/order_repository.dart';
import 'seed/mock_invoices.dart';

/// StateNotifier for Non-GST Commercial Invoices.
class InvoiceNotifier extends StateNotifier<List<CommercialInvoiceEntity>> {
  InvoiceNotifier() : super(List<CommercialInvoiceEntity>.from(mockInitialInvoicesList));

  /// Creates and adds an invoice from an Order entity.
  CommercialInvoiceEntity createInvoiceFromOrder({
    required OrderEntity order,
    required String retailerBusinessName,
    required String retailerOwnerName,
    required String retailerPhone,
  }) {
    final invoiceNum = order.invoiceNumber ?? 'INV-2026-${1050 + state.length}';
    final lineItems = order.items
        .map(
          (item) => InvoiceLineItemEntity(
            productId: item.productId,
            productName: item.productName,
            packSize: item.packSize,
            quantity: item.quantity,
            crateCount: item.crateCount,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          ),
        )
        .toList();

    final isPaid = order.paymentStatus == PaymentLifecycleStatus.paid;

    final invoice = CommercialInvoiceEntity(
      id: 'inv-${100 + state.length + 1}',
      invoiceNumber: invoiceNum,
      orderCode: order.orderCode,
      deliveryReference: order.deliveryReference,
      invoiceDate: order.orderDate,
      retailerBusinessName: retailerBusinessName,
      retailerOwnerName: retailerOwnerName,
      retailerAddress: order.deliveryAddress,
      retailerPhone: retailerPhone,
      items: lineItems,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryCharge,
      totalAmount: order.totalPayable,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentReference: isPaid ? 'RZP_PAY_${order.orderCode.replaceAll(RegExp(r'[^0-9]'), '')}' : null,
      amountReceived: isPaid ? order.totalPayable : 0.00,
    );

    state = [invoice, ...state];
    return invoice;
  }

  /// Updates payment status on invoice (e.g. after COD recording).
  void updateInvoicePaymentStatus(String invoiceNumber, PaymentLifecycleStatus status, {String? reference}) {
    final index = state.indexWhere((inv) => inv.invoiceNumber == invoiceNumber || inv.id == invoiceNumber);
    if (index < 0) return;

    final target = state[index];
    final isPaid = status == PaymentLifecycleStatus.paid;
    final updated = target.copyWith(
      paymentStatus: status,
      paymentReference: reference ?? target.paymentReference,
      amountReceived: isPaid ? target.totalAmount : 0.00,
    );

    final updatedList = List<CommercialInvoiceEntity>.from(state);
    updatedList[index] = updated;
    state = updatedList;
  }

  /// Finds an invoice by its invoiceNumber or ID.
  CommercialInvoiceEntity? getInvoiceByNumber(String invoiceNumber) {
    try {
      return state.firstWhere(
        (inv) => inv.invoiceNumber == invoiceNumber || inv.id == invoiceNumber || inv.orderCode == invoiceNumber,
      );
    } catch (_) {
      return null;
    }
  }

  /// Total sum of all invoices.
  double get totalBilledAmount {
    return state.fold<double>(0.0, (sum, inv) => sum + inv.totalAmount);
  }

  /// Count of paid invoices.
  int get paidCount {
    return state.where((inv) => inv.paymentStatus == PaymentLifecycleStatus.paid).length;
  }

  /// Count of pending invoices.
  int get pendingCount {
    return state.where((inv) => inv.paymentStatus == PaymentLifecycleStatus.pending).length;
  }
}

/// Global provider for Invoices.
final invoicesProvider = StateNotifierProvider<InvoiceNotifier, List<CommercialInvoiceEntity>>((ref) {
  return InvoiceNotifier();
});

