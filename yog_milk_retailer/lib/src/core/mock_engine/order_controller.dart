import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'cart_controller.dart';
import 'contracts/order_repository.dart';
import 'persistence/mock_storage_service.dart';
import 'seed/mock_orders.dart';

/// StateNotifier managing mutable order collection in-memory.
class OrdersNotifier extends StateNotifier<List<OrderEntity>> {
  OrdersNotifier() : super(List<OrderEntity>.from(mockInitialOrdersList)) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final saved = await MockStorageService.getOrders();
    if (saved != null && saved.isNotEmpty) {
      state = saved;
    }
  }

  void _persist() {
    MockStorageService.saveOrders(state);
  }

  /// Creates a new order from cart contents and appends to in-memory state.
  OrderEntity createOrder({
    required List<CartItemEntity> cartItems,
    required String paymentMethod, // "COD" | "RAZORPAY_ONLINE"
    required String deliveryAddress,
    String? specialInstructions,
    bool isOnlinePaid = false,
  }) {
    final newOrderNum = 120 + state.length + 1;
    final orderCode = 'YM-2026-000$newOrderNum';
    final deliveryRef = 'YMD-2026-000$newOrderNum';
    final invoiceNum = 'INV-2026-${1050 + state.length}';

    final orderItems = cartItems
        .map(
          (c) => OrderItemEntity(
            productId: c.productId,
            productName: c.productName,
            packSize: c.packSize,
            quantity: c.quantity,
            crateCount: c.crateCount,
            unitPrice: c.unitPrice,
            lineTotal: c.lineTotal,
          ),
        )
        .toList();

    final subtotal = orderItems.fold<double>(
      0.0,
      (sum, item) => sum + item.lineTotal,
    );
    final deliveryFee = subtotal >= 3000.0 ? 0.00 : 50.00;
    final totalPayable = subtotal + deliveryFee;

    final now = DateTime.now();

    final newOrder = OrderEntity(
      id: 'ord-$newOrderNum',
      orderCode: orderCode,
      orderDate: now,
      orderStatus: OrderLifecycleStatus.placed,
      paymentStatus: isOnlinePaid
          ? PaymentLifecycleStatus.paid
          : PaymentLifecycleStatus.pending,
      deliveryStatus: DeliveryLifecycleStatus.notAssigned,
      paymentMethod: paymentMethod,
      items: orderItems,
      subtotal: subtotal,
      deliveryCharge: deliveryFee,
      totalPayable: totalPayable,
      deliveryAddress: deliveryAddress,
      deliveryReference: deliveryRef,
      specialInstructions: specialInstructions ?? 'Insulated drop crate outside store shutter.',
      invoiceNumber: invoiceNum,
      statusHistory: [
        OrderStatusHistoryEntry(
          timestamp: now,
          title: 'Order Placed',
          description: isOnlinePaid
              ? 'Dawn reservation confirmed · Paid online via Razorpay.'
              : 'Dawn reservation confirmed · Cash on Delivery settlement at drop.',
          isCompleted: true,
        ),
        OrderStatusHistoryEntry(
          timestamp: now.add(const Duration(minutes: 5)),
          title: 'Inventory Allocated',
          description: 'Reserved in cold storage at central district hub.',
          isCompleted: false,
        ),
        OrderStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 4)),
          title: 'Batch Churning & Bottling',
          description: 'Dawn churning at 4°C pasture sanctuary.',
          isCompleted: false,
        ),
        OrderStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 8)),
          title: 'Out for Dawn Delivery',
          description: 'Scheduled for early morning 5:30 AM drop.',
          isCompleted: false,
        ),
        OrderStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 10)),
          title: 'Delivered',
          description: 'Doorstep drop-off at store.',
          isCompleted: false,
        ),
      ],
      deliveryHistory: [
        DeliveryStatusHistoryEntry(
          timestamp: now,
          status: DeliveryLifecycleStatus.notAssigned,
          title: 'Not assigned',
          description: 'Order received and queued for route allocation.',
          isCompleted: true,
        ),
        DeliveryStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 2)),
          status: DeliveryLifecycleStatus.assigned,
          title: 'Assigned',
          description: 'Assigned to district morning dispatch route.',
          isCompleted: false,
        ),
        DeliveryStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 6)),
          status: DeliveryLifecycleStatus.pickedUp,
          title: 'Picked up',
          description: 'Loaded onto temperature-controlled van.',
          isCompleted: false,
        ),
        DeliveryStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 8)),
          status: DeliveryLifecycleStatus.outForDelivery,
          title: 'Out for delivery',
          description: 'En-route to drop point.',
          note: 'Chilled at 4°C in insulated dairy crate.',
          isCompleted: false,
        ),
        DeliveryStatusHistoryEntry(
          timestamp: now.add(const Duration(hours: 10)),
          status: DeliveryLifecycleStatus.delivered,
          title: 'Delivered',
          description: 'Drop confirmation and crate inspection.',
          isCompleted: false,
        ),
      ],
    );

    // Prepend to top of list
    state = [newOrder, ...state];
    _persist();
    return newOrder;
  }

  /// Cancels an active order before delivery dispatch.
  OrderEntity? cancelOrder(String orderId) {
    final index = state.indexWhere((o) => o.id == orderId || o.orderCode == orderId);
    if (index < 0) return null;

    final target = state[index];
    final updated = target.copyWith(
      orderStatus: OrderLifecycleStatus.cancelled,
      deliveryStatus: DeliveryLifecycleStatus.failed,
      statusHistory: [
        ...target.statusHistory,
        OrderStatusHistoryEntry(
          timestamp: DateTime.now(),
          title: 'Order Cancelled',
          description: 'Cancelled by retailer prior to morning dispatch.',
          isCompleted: true,
        ),
      ],
    );

    final updatedList = List<OrderEntity>.from(state);
    updatedList[index] = updated;
    state = updatedList;
    _persist();
    return updated;
  }

  /// Updates payment status for an order (e.g. admin manual recording or gateway verification).
  void updatePaymentStatus(String orderId, PaymentLifecycleStatus newStatus) {
    final index = state.indexWhere((o) => o.id == orderId || o.orderCode == orderId);
    if (index < 0) return;
    final target = state[index];
    final updated = target.copyWith(paymentStatus: newStatus);
    final updatedList = List<OrderEntity>.from(state);
    updatedList[index] = updated;
    state = updatedList;
    _persist();
  }

  /// Finds an order by its ID or order code.
  OrderEntity? getOrderById(String orderId) {
    try {
      return state.firstWhere((o) => o.id == orderId || o.orderCode == orderId);
    } catch (_) {
      return null;
    }
  }

  /// Returns true if any active order has an unresolved pending payment.
  bool get hasPendingPaymentDebt {
    return state.any(
      (o) =>
          o.paymentStatus == PaymentLifecycleStatus.pending &&
          o.orderStatus != OrderLifecycleStatus.cancelled,
    );
  }
}

/// Global provider for Orders.
final ordersProvider =
    StateNotifierProvider<OrdersNotifier, List<OrderEntity>>((ref) {
  return OrdersNotifier();
});
