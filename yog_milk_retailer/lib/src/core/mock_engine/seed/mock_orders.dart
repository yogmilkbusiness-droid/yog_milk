import '../contracts/order_repository.dart';

final mockActiveOrder = OrderEntity(
  id: 'ord-8841',
  orderCode: 'YM-2026-8841',
  orderDate: DateTime.now().subtract(const Duration(hours: 3)),
  orderStatus: OrderLifecycleStatus.processing,
  paymentStatus: PaymentLifecycleStatus.pending,
  deliveryStatus: DeliveryLifecycleStatus.assigned,
  paymentMethod: 'COD',
  deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
  deliveryReference: 'YMD-2026-8841',
  specialInstructions: 'Insulated drop crate outside store shutter.',
  invoiceNumber: 'INV-2026-1049',
  items: const [
    OrderItemEntity(
      productId: 'prod-001',
      productName: 'Gir Cow Full Cream Milk 1L',
      packSize: '1L Pouch',
      quantity: 24, // 2 crates
      crateCount: 2,
      unitPrice: 68.00,
      lineTotal: 1632.00,
    ),
    OrderItemEntity(
      productId: 'prod-003',
      productName: 'Fresh Malai Paneer 1kg',
      packSize: '1kg Vacuum Pack',
      quantity: 2,
      crateCount: 1,
      unitPrice: 380.00,
      lineTotal: 760.00,
    ),
  ],
  subtotal: 2392.00,
  deliveryCharge: 58.00,
  totalPayable: 2450.00,
  statusHistory: [
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      title: 'Order Placed',
      description: 'Dawn reservation confirmed for Batch #N43.',
      isCompleted: true,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(hours: 2, minutes: 45)),
      title: 'Inventory Allocated',
      description: 'Reserved 2 crates milk and 2kg paneer in Pune cold storage.',
      isCompleted: true,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      title: 'Batch Churning & Bottling',
      description: 'Fresh processing completed at Satara dairy plant.',
      isCompleted: true,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().add(const Duration(hours: 8)),
      title: 'Out for Dawn Delivery',
      description: 'Scheduled for 5:30 AM dawn dispatch.',
      isCompleted: false,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().add(const Duration(hours: 10)),
      title: 'Delivered',
      description: 'Doorstep hand-off at Kothrud shop.',
      isCompleted: false,
    ),
  ],
  deliveryHistory: [
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      status: DeliveryLifecycleStatus.notAssigned,
      title: 'Not assigned',
      description: 'Order received and queued in route dispatcher.',
      isCompleted: true,
    ),
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(hours: 1, minutes: 30)),
      status: DeliveryLifecycleStatus.assigned,
      title: 'Assigned',
      description: 'Assigned to Kothrud-Paud Morning Delivery Route #P4.',
      note: 'Driver: Santosh Jadhav (MH 12 QX 4812).',
      isCompleted: true,
    ),
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().add(const Duration(hours: 8)),
      status: DeliveryLifecycleStatus.pickedUp,
      title: 'Picked up',
      description: 'Vehicle loading at Hadapsar central cold chain depot.',
      isCompleted: false,
    ),
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().add(const Duration(hours: 9)),
      status: DeliveryLifecycleStatus.outForDelivery,
      title: 'Out for delivery',
      description: 'Chilled transit maintained at 4°C.',
      isCompleted: false,
    ),
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().add(const Duration(hours: 10)),
      status: DeliveryLifecycleStatus.delivered,
      title: 'Delivered',
      description: 'Drop confirmation and empty crate return.',
      isCompleted: false,
    ),
  ],
);

final mockPastUsualOrder = OrderEntity(
  id: 'ord-8812',
  orderCode: 'YM-2026-8812',
  orderDate: DateTime.now().subtract(const Duration(days: 1)),
  orderStatus: OrderLifecycleStatus.delivered,
  paymentStatus: PaymentLifecycleStatus.paid,
  deliveryStatus: DeliveryLifecycleStatus.delivered,
  paymentMethod: 'RAZORPAY_ONLINE',
  deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
  deliveryReference: 'YMD-2026-8812',
  specialInstructions: 'Drop in crate outside store.',
  invoiceNumber: 'INV-2026-1035',
  items: const [
    OrderItemEntity(
      productId: 'prod-001',
      productName: 'Gir Cow Full Cream Milk 1L',
      packSize: '1L Pouch',
      quantity: 36, // 3 crates
      crateCount: 3,
      unitPrice: 68.00,
      lineTotal: 2448.00,
    ),
    OrderItemEntity(
      productId: 'prod-004',
      productName: 'Spiced Masala Taak 200ml',
      packSize: '200ml Pouch',
      quantity: 48, // 2 crates
      crateCount: 2,
      unitPrice: 15.00,
      lineTotal: 720.00,
    ),
  ],
  subtotal: 3168.00,
  deliveryCharge: 0.00, // Free delivery over ₹3,000
  totalPayable: 3168.00,
  statusHistory: [
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 14)),
      title: 'Order Placed',
      description: 'Online payment verified via Razorpay UPI.',
      isCompleted: true,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 10)),
      title: 'Batch Bottled',
      description: 'Chilled at 4°C within 45 mins of milking.',
      isCompleted: true,
    ),
    OrderStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      title: 'Delivered',
      description: 'Delivered at 5:45 AM dawn drop.',
      isCompleted: true,
    ),
  ],
  deliveryHistory: [
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 12)),
      status: DeliveryLifecycleStatus.pickedUp,
      title: 'Picked up',
      description: 'Loaded onto route van.',
      isCompleted: true,
    ),
    DeliveryStatusHistoryEntry(
      timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      status: DeliveryLifecycleStatus.delivered,
      title: 'Delivered',
      description: 'Confirmed delivered to Ramesh Patil.',
      isCompleted: true,
    ),
  ],
);

final mockPastOrderDelivered2 = OrderEntity(
  id: 'ord-8790',
  orderCode: 'YM-2026-8790',
  orderDate: DateTime.now().subtract(const Duration(days: 3)),
  orderStatus: OrderLifecycleStatus.delivered,
  paymentStatus: PaymentLifecycleStatus.paid,
  deliveryStatus: DeliveryLifecycleStatus.delivered,
  paymentMethod: 'RAZORPAY_ONLINE',
  deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
  deliveryReference: 'YMD-2026-8790',
  invoiceNumber: 'INV-2026-1011',
  items: const [
    OrderItemEntity(
      productId: 'prod-002',
      productName: 'Buffalo Full Cream Gold Milk 1L',
      packSize: '1L Pouch',
      quantity: 24, // 2 crates
      crateCount: 2,
      unitPrice: 80.00,
      lineTotal: 1920.00,
    ),
    OrderItemEntity(
      productId: 'prod-005',
      productName: 'Traditional Vedic Cow Ghee 500ml',
      packSize: '500ml Glass Jar',
      quantity: 6, // 1 crate
      crateCount: 1,
      unitPrice: 650.00,
      lineTotal: 3900.00,
    ),
  ],
  subtotal: 5820.00,
  deliveryCharge: 0.00,
  totalPayable: 5820.00,
);

final mockCancelledOrder = OrderEntity(
  id: 'ord-8740',
  orderCode: 'YM-2026-8740',
  orderDate: DateTime.now().subtract(const Duration(days: 7)),
  orderStatus: OrderLifecycleStatus.cancelled,
  paymentStatus: PaymentLifecycleStatus.failed,
  deliveryStatus: DeliveryLifecycleStatus.failed,
  paymentMethod: 'COD',
  deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
  deliveryReference: 'YMD-2026-8740',
  items: const [
    OrderItemEntity(
      productId: 'prod-001',
      productName: 'Gir Cow Full Cream Milk 1L',
      packSize: '1L Pouch',
      quantity: 12,
      crateCount: 1,
      unitPrice: 68.00,
      lineTotal: 816.00,
    ),
  ],
  subtotal: 816.00,
  deliveryCharge: 50.00,
  totalPayable: 866.00,
);

final mockInitialOrdersList = [
  mockActiveOrder,
  mockPastUsualOrder,
  mockPastOrderDelivered2,
  mockCancelledOrder,
];
