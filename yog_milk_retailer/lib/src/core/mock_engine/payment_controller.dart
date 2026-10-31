library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/order_repository.dart';
import 'contracts/payment_repository.dart';
import 'order_controller.dart';
import 'seed/mock_payments.dart';

/// StateNotifier for financial payments and transaction ledger.
class PaymentNotifier extends StateNotifier<List<PaymentTransactionEntity>> {
  final Ref ref;

  PaymentNotifier(this.ref) : super(List<PaymentTransactionEntity>.from(mockInitialPaymentsList));

  /// Records a new payment transaction.
  PaymentTransactionEntity recordTransaction({
    required String orderId,
    required String orderCode,
    required String invoiceNumber,
    required double amount,
    required PaymentMethodType methodType,
    required PaymentLifecycleStatus status,
    required String referenceNumber,
    String? failureReason,
    String? collectorStaffName,
    String? settlementNote,
  }) {
    final now = DateTime.now();
    final newId = 'pay-${100 + state.length + 1}';
    final amountReceived = (status == PaymentLifecycleStatus.paid) ? amount : 0.00;

    final entry = PaymentTransactionEntity(
      id: newId,
      orderId: orderId,
      orderCode: orderCode,
      invoiceNumber: invoiceNumber,
      amount: amount,
      amountReceived: amountReceived,
      methodType: methodType,
      status: status,
      referenceNumber: referenceNumber,
      timestamp: now,
      failureReason: failureReason,
      collectorStaffName: collectorStaffName,
      settlementNote: settlementNote,
    );

    state = [entry, ...state];
    return entry;
  }

  /// Simulates admin manual cash recording for an active COD debt,
  /// immediately settling the invoice and releasing Rule 4.4 ordering block.
  void settleCodPayment(String paymentId, {String? receiptVoucher}) {
    final index = state.indexWhere((p) => p.id == paymentId || p.orderCode == paymentId);
    if (index < 0) return;

    final target = state[index];
    final updated = target.copyWith(
      status: PaymentLifecycleStatus.paid,
      amountReceived: target.amount,
      referenceNumber: receiptVoucher ?? 'COD-SETTLED-${DateTime.now().millisecondsSinceEpoch % 10000}',
      settlementNote: 'Admin manual collection verified at depot desk · Rule 4.4 restriction released.',
    );

    final updatedList = List<PaymentTransactionEntity>.from(state);
    updatedList[index] = updated;
    state = updatedList;

    // Cross-sync with order controller to update order payment status
    ref.read(ordersProvider.notifier).updatePaymentStatus(target.orderId, PaymentLifecycleStatus.paid);
  }

  /// Calculates total volume of settled payments.
  double get totalSettledAmount {
    return state
        .where((p) => p.status == PaymentLifecycleStatus.paid)
        .fold<double>(0.0, (sum, p) => sum + p.amountReceived);
  }

  /// Calculates total pending COD debt balance.
  double get totalPendingAmount {
    return state
        .where((p) => p.status == PaymentLifecycleStatus.pending)
        .fold<double>(0.0, (sum, p) => sum + p.amountDue);
  }

  /// Finds any active blocking debt under Rule 4.4.
  PaymentTransactionEntity? get activeBlockingPayment {
    try {
      return state.firstWhere((p) => p.status == PaymentLifecycleStatus.pending);
    } catch (_) {
      return null;
    }
  }

  /// Retrieves payment transaction by ID or Order code.
  PaymentTransactionEntity? getPaymentById(String paymentId) {
    try {
      return state.firstWhere((p) => p.id == paymentId || p.orderCode == paymentId);
    } catch (_) {
      return null;
    }
  }
}

/// Global provider for payment ledger.
final paymentsProvider = StateNotifierProvider<PaymentNotifier, List<PaymentTransactionEntity>>((ref) {
  return PaymentNotifier(ref);
});

