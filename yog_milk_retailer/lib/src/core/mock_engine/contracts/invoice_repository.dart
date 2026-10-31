library;

import 'order_repository.dart';

/// Non-GST Commercial Invoice Item Contract.
class InvoiceLineItemEntity {
  final String productId;
  final String productName;
  final String packSize;
  final int quantity;
  final int crateCount;
  final double unitPrice;
  final double lineTotal;

  const InvoiceLineItemEntity({
    required this.productId,
    required this.productName,
    required this.packSize,
    required this.quantity,
    required this.crateCount,
    required this.unitPrice,
    required this.lineTotal,
  });
}

/// Non-GST Commercial Farm Bill / Invoice Entity.
/// Governed by Rule 4.5: Non-GST Commercial Billing.
/// Absolutely NO GSTIN, CGST, SGST, IGST, or HSN codes.
class CommercialInvoiceEntity {
  final String id;
  final String invoiceNumber;
  final String orderCode;
  final String deliveryReference;
  final DateTime invoiceDate;
  final String supplierBusinessName;
  final String supplierTagline;
  final String supplierAddress;
  final String supplierFssaiNumber;
  final String supplierEmail;
  final String supplierPhone;
  final String retailerBusinessName;
  final String retailerOwnerName;
  final String retailerAddress;
  final String retailerPhone;
  final List<InvoiceLineItemEntity> items;
  final double subtotal;
  final double deliveryFee;
  final double discountAmount;
  final double totalAmount;
  final String paymentMethod;
  final PaymentLifecycleStatus paymentStatus;
  final String? paymentReference;
  final double amountReceived;

  const CommercialInvoiceEntity({
    required this.id,
    required this.invoiceNumber,
    required this.orderCode,
    required this.deliveryReference,
    required this.invoiceDate,
    this.supplierBusinessName = 'YOG MILK DAIRY PRODUCTS PVT. LTD.',
    this.supplierTagline = 'FROM NATURE TO NOURISH YOU',
    this.supplierAddress =
        'Yog Milk Gaushala & Dairy Farm, Survey No. 42, Devlali Agro Corridor, Nashik / Pune, Maharashtra - 422401',
    this.supplierFssaiNumber = '11519036000281',
    this.supplierEmail = 'care@yogmilk.in',
    this.supplierPhone = '+91 98201 54321',
    required this.retailerBusinessName,
    required this.retailerOwnerName,
    required this.retailerAddress,
    required this.retailerPhone,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    this.discountAmount = 0.00,
    required this.totalAmount,
    required this.paymentMethod,
    required this.paymentStatus,
    this.paymentReference,
    required this.amountReceived,
  });

  double get amountDue => (totalAmount - amountReceived).clamp(0.0, double.infinity);
  bool get isSettled => paymentStatus == PaymentLifecycleStatus.paid;
  bool get isPending => paymentStatus == PaymentLifecycleStatus.pending;

  CommercialInvoiceEntity copyWith({
    String? id,
    String? invoiceNumber,
    String? orderCode,
    String? deliveryReference,
    DateTime? invoiceDate,
    String? supplierBusinessName,
    String? supplierTagline,
    String? supplierAddress,
    String? supplierFssaiNumber,
    String? supplierEmail,
    String? supplierPhone,
    String? retailerBusinessName,
    String? retailerOwnerName,
    String? retailerAddress,
    String? retailerPhone,
    List<InvoiceLineItemEntity>? items,
    double? subtotal,
    double? deliveryFee,
    double? discountAmount,
    double? totalAmount,
    String? paymentMethod,
    PaymentLifecycleStatus? paymentStatus,
    String? paymentReference,
    double? amountReceived,
  }) {
    return CommercialInvoiceEntity(
      id: id ?? this.id,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      orderCode: orderCode ?? this.orderCode,
      deliveryReference: deliveryReference ?? this.deliveryReference,
      invoiceDate: invoiceDate ?? this.invoiceDate,
      supplierBusinessName: supplierBusinessName ?? this.supplierBusinessName,
      supplierTagline: supplierTagline ?? this.supplierTagline,
      supplierAddress: supplierAddress ?? this.supplierAddress,
      supplierFssaiNumber: supplierFssaiNumber ?? this.supplierFssaiNumber,
      supplierEmail: supplierEmail ?? this.supplierEmail,
      supplierPhone: supplierPhone ?? this.supplierPhone,
      retailerBusinessName: retailerBusinessName ?? this.retailerBusinessName,
      retailerOwnerName: retailerOwnerName ?? this.retailerOwnerName,
      retailerAddress: retailerAddress ?? this.retailerAddress,
      retailerPhone: retailerPhone ?? this.retailerPhone,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      discountAmount: discountAmount ?? this.discountAmount,
      totalAmount: totalAmount ?? this.totalAmount,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      paymentReference: paymentReference ?? this.paymentReference,
      amountReceived: amountReceived ?? this.amountReceived,
    );
  }
}

