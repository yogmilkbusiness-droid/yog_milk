library;

/// Decoupled status triad and order entity contracts.
/// All three lifecycle domains operate strictly independently:
/// 1. Order Lifecycle: placed -> confirmed -> processing -> readyForDelivery -> outForDelivery -> delivered (or cancelled / deliveryFailed)
/// 2. Payment Lifecycle: pending -> processing -> paid (or failed / refunded / partiallyRefunded)
/// 3. Delivery Lifecycle: notAssigned -> assigned -> pickedUp -> outForDelivery -> delivered (or failed)

enum OrderLifecycleStatus {
  placed,
  confirmed,
  processing,
  readyForDelivery,
  outForDelivery,
  delivered,
  cancelled,
  deliveryFailed,
}

enum PaymentLifecycleStatus {
  pending,
  processing,
  paid,
  failed,
  refunded,
  partiallyRefunded,
}

enum DeliveryLifecycleStatus {
  notAssigned,
  assigned,
  pickedUp,
  outForDelivery,
  delivered,
  failed,
}

class OrderItemEntity {
  final String productId;
  final String productName;
  final String packSize;
  final int quantity; // Total units/pouches
  final int crateCount;
  final double unitPrice;
  final double lineTotal;

  const OrderItemEntity({
    required this.productId,
    required this.productName,
    required this.packSize,
    required this.quantity,
    required this.crateCount,
    required this.unitPrice,
    required this.lineTotal,
  });

  OrderItemEntity copyWith({
    String? productId,
    String? productName,
    String? packSize,
    int? quantity,
    int? crateCount,
    double? unitPrice,
    double? lineTotal,
  }) {
    return OrderItemEntity(
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      packSize: packSize ?? this.packSize,
      quantity: quantity ?? this.quantity,
      crateCount: crateCount ?? this.crateCount,
      unitPrice: unitPrice ?? this.unitPrice,
      lineTotal: lineTotal ?? this.lineTotal,
    );
  }
}

class OrderStatusHistoryEntry {
  final DateTime timestamp;
  final String title;
  final String description;
  final bool isCompleted;

  const OrderStatusHistoryEntry({
    required this.timestamp,
    required this.title,
    required this.description,
    this.isCompleted = true,
  });
}

class DeliveryStatusHistoryEntry {
  final DateTime timestamp;
  final DeliveryLifecycleStatus status;
  final String title;
  final String description;
  final String? note;
  final bool isCompleted;

  const DeliveryStatusHistoryEntry({
    required this.timestamp,
    required this.status,
    required this.title,
    required this.description,
    this.note,
    this.isCompleted = true,
  });
}

class OrderEntity {
  final String id;
  final String orderCode; // e.g. "YM-2026-000124"
  final DateTime orderDate;
  final OrderLifecycleStatus orderStatus;
  final PaymentLifecycleStatus paymentStatus;
  final DeliveryLifecycleStatus deliveryStatus;
  final String paymentMethod; // "COD" | "RAZORPAY_ONLINE"
  final List<OrderItemEntity> items;
  final double subtotal;
  final double deliveryCharge;
  final double totalPayable;
  final String deliveryAddress;
  final String deliveryReference; // e.g. "YMD-2026-000124"
  final String? specialInstructions;
  final String? invoiceNumber; // e.g. "INV-2026-1049" (Commercial Non-GST)
  final List<OrderStatusHistoryEntry> statusHistory;
  final List<DeliveryStatusHistoryEntry> deliveryHistory;

  const OrderEntity({
    required this.id,
    required this.orderCode,
    required this.orderDate,
    required this.orderStatus,
    required this.paymentStatus,
    required this.deliveryStatus,
    required this.paymentMethod,
    required this.items,
    required this.subtotal,
    required this.deliveryCharge,
    required this.totalPayable,
    required this.deliveryAddress,
    required this.deliveryReference,
    this.specialInstructions,
    this.invoiceNumber,
    this.statusHistory = const [],
    this.deliveryHistory = const [],
  });

  bool get isPaymentPending => paymentStatus == PaymentLifecycleStatus.pending;
  bool get isPaymentPaid => paymentStatus == PaymentLifecycleStatus.paid;
  bool get isOrderActive =>
      orderStatus != OrderLifecycleStatus.delivered &&
      orderStatus != OrderLifecycleStatus.cancelled &&
      orderStatus != OrderLifecycleStatus.deliveryFailed;

  int get totalUnits => items.fold(0, (sum, item) => sum + item.quantity);
  int get totalCrates => items.fold(0, (sum, item) => sum + item.crateCount);

  String get orderStatusLabel {
    switch (orderStatus) {
      case OrderLifecycleStatus.placed:
        return 'Placed';
      case OrderLifecycleStatus.confirmed:
        return 'Confirmed';
      case OrderLifecycleStatus.processing:
        return 'Processing';
      case OrderLifecycleStatus.readyForDelivery:
        return 'Ready For Delivery';
      case OrderLifecycleStatus.outForDelivery:
        return 'Out For Delivery';
      case OrderLifecycleStatus.delivered:
        return 'Delivered';
      case OrderLifecycleStatus.cancelled:
        return 'Cancelled';
      case OrderLifecycleStatus.deliveryFailed:
        return 'Delivery Failed';
    }
  }

  String get paymentStatusLabel {
    switch (paymentStatus) {
      case PaymentLifecycleStatus.pending:
        return 'Pending';
      case PaymentLifecycleStatus.processing:
        return 'Processing';
      case PaymentLifecycleStatus.paid:
        return 'Paid';
      case PaymentLifecycleStatus.failed:
        return 'Failed';
      case PaymentLifecycleStatus.refunded:
        return 'Refunded';
      case PaymentLifecycleStatus.partiallyRefunded:
        return 'Partially Refunded';
    }
  }

  String get deliveryStatusLabel {
    switch (deliveryStatus) {
      case DeliveryLifecycleStatus.notAssigned:
        return 'Not Assigned';
      case DeliveryLifecycleStatus.assigned:
        return 'Assigned';
      case DeliveryLifecycleStatus.pickedUp:
        return 'Picked Up';
      case DeliveryLifecycleStatus.outForDelivery:
        return 'Out For Delivery';
      case DeliveryLifecycleStatus.delivered:
        return 'Delivered';
      case DeliveryLifecycleStatus.failed:
        return 'Failed';
    }
  }

  OrderEntity copyWith({
    String? id,
    String? orderCode,
    DateTime? orderDate,
    OrderLifecycleStatus? orderStatus,
    PaymentLifecycleStatus? paymentStatus,
    DeliveryLifecycleStatus? deliveryStatus,
    String? paymentMethod,
    List<OrderItemEntity>? items,
    double? subtotal,
    double? deliveryCharge,
    double? totalPayable,
    String? deliveryAddress,
    String? deliveryReference,
    String? specialInstructions,
    String? invoiceNumber,
    List<OrderStatusHistoryEntry>? statusHistory,
    List<DeliveryStatusHistoryEntry>? deliveryHistory,
  }) {
    return OrderEntity(
      id: id ?? this.id,
      orderCode: orderCode ?? this.orderCode,
      orderDate: orderDate ?? this.orderDate,
      orderStatus: orderStatus ?? this.orderStatus,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      deliveryStatus: deliveryStatus ?? this.deliveryStatus,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      deliveryCharge: deliveryCharge ?? this.deliveryCharge,
      totalPayable: totalPayable ?? this.totalPayable,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      deliveryReference: deliveryReference ?? this.deliveryReference,
      specialInstructions: specialInstructions ?? this.specialInstructions,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      statusHistory: statusHistory ?? this.statusHistory,
      deliveryHistory: deliveryHistory ?? this.deliveryHistory,
    );
  }
}

abstract class OrderRepository {
  Future<List<OrderEntity>> getOrders();
  Future<OrderEntity?> getOrderById(String id);
  Future<OrderEntity?> getPendingPaymentOrder();
  Future<bool> hasPendingPaymentBlock();
  Future<OrderEntity> placeOrder({
    required List<OrderItemEntity> items,
    required String paymentMethod,
    required String deliveryAddress,
    String? specialInstructions,
  });
  Future<OrderEntity> cancelOrder(String orderId);
}
