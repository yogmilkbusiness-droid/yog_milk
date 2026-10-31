library;

import 'order_repository.dart';

/// Payment method types supported by Yog Milk Retailer Platform.
enum PaymentMethodType {
  cod,
  razorpayUpi,
  razorpayCard,
  razorpayNetbanking,
}

extension PaymentMethodTypeX on PaymentMethodType {
  String get displayLabel {
    return switch (this) {
      PaymentMethodType.cod => 'Cash on Delivery (COD)',
      PaymentMethodType.razorpayUpi => 'Online (Razorpay UPI)',
      PaymentMethodType.razorpayCard => 'Online (Debit/Credit Card)',
      PaymentMethodType.razorpayNetbanking => 'Online (Netbanking)',
    };
  }

  String get shortLabel {
    return switch (this) {
      PaymentMethodType.cod => 'COD',
      PaymentMethodType.razorpayUpi => 'UPI',
      PaymentMethodType.razorpayCard => 'Card',
      PaymentMethodType.razorpayNetbanking => 'Netbanking',
    };
  }
}

/// Payment Transaction Entity representing financial events and settlement records.
class PaymentTransactionEntity {
  final String id;
  final String orderId;
  final String orderCode;
  final String invoiceNumber;
  final double amount;
  final double amountReceived;
  final PaymentMethodType methodType;
  final PaymentLifecycleStatus status;
  final String referenceNumber;
  final DateTime timestamp;
  final String? failureReason;
  final String? collectorStaffName;
  final String? settlementNote;

  const PaymentTransactionEntity({
    required this.id,
    required this.orderId,
    required this.orderCode,
    required this.invoiceNumber,
    required this.amount,
    required this.amountReceived,
    required this.methodType,
    required this.status,
    required this.referenceNumber,
    required this.timestamp,
    this.failureReason,
    this.collectorStaffName,
    this.settlementNote,
  });

  double get amountDue => (amount - amountReceived).clamp(0.0, double.infinity);
  bool get isSettled => status == PaymentLifecycleStatus.paid;
  bool get isPending => status == PaymentLifecycleStatus.pending;
  bool get isFailed => status == PaymentLifecycleStatus.failed;

  PaymentTransactionEntity copyWith({
    String? id,
    String? orderId,
    String? orderCode,
    String? invoiceNumber,
    double? amount,
    double? amountReceived,
    PaymentMethodType? methodType,
    PaymentLifecycleStatus? status,
    String? referenceNumber,
    DateTime? timestamp,
    String? failureReason,
    String? collectorStaffName,
    String? settlementNote,
  }) {
    return PaymentTransactionEntity(
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      orderCode: orderCode ?? this.orderCode,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      amount: amount ?? this.amount,
      amountReceived: amountReceived ?? this.amountReceived,
      methodType: methodType ?? this.methodType,
      status: status ?? this.status,
      referenceNumber: referenceNumber ?? this.referenceNumber,
      timestamp: timestamp ?? this.timestamp,
      failureReason: failureReason ?? this.failureReason,
      collectorStaffName: collectorStaffName ?? this.collectorStaffName,
      settlementNote: settlementNote ?? this.settlementNote,
    );
  }
}

