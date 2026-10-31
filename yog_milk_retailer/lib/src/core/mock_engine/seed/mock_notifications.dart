library;

import '../contracts/notification_repository.dart';

final mockInitialNotificationsList = <NotificationEntity>[
  NotificationEntity(
    id: 'notif-001',
    title: 'Order Confirmed · Dawn Drop',
    body:
        'Order YM-2026-8841 placed successfully! Tomorrow’s 5:30 AM dawn reservation confirmed for 2 items (Gir Cow Milk & Malai Paneer).',
    timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
    category: NotificationCategory.ordersAndDelivery,
    isRead: false,
    relatedOrderCode: 'YM-2026-8841',
    actionRoute: '/orders/ord-8841',
    actionLabel: 'Track Morning Slot',
  ),
  NotificationEntity(
    id: 'notif-002',
    title: 'Cold-Chain Van Dispatched',
    body: 'Insulated van MH 12 QX 4812 en-route to Kothrud sector. Chilled at 4°C · ETA 5:40 AM.',
    timestamp: DateTime.now().subtract(const Duration(hours: 2)),
    category: NotificationCategory.ordersAndDelivery,
    isRead: false,
    relatedOrderCode: 'YM-2026-8841',
    actionRoute: '/orders/ord-8841/tracking',
    actionLabel: 'Live Van Route',
  ),
  NotificationEntity(
    id: 'notif-003',
    title: 'Commercial Invoice INV-2026-1049 Generated',
    body:
        'Non-GST Commercial Bill of Supply generated for Order YM-2026-8841. Total Payable: ₹2,450.00 (COD Settlement Pending).',
    timestamp: DateTime.now().subtract(const Duration(hours: 2, minutes: 45)),
    category: NotificationCategory.billing,
    isRead: false,
    relatedInvoiceNumber: 'INV-2026-1049',
    actionRoute: '/invoices/INV-2026-1049/preview',
    actionLabel: 'Preview Bill PDF',
  ),
  NotificationEntity(
    id: 'notif-004',
    title: 'Payment Received & Settled',
    body: 'Payment received: ₹3,168.00 settled via Razorpay UPI for Order YM-2026-8812. Invoice INV-2026-1035 clear.',
    timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 10)),
    category: NotificationCategory.billing,
    isRead: true,
    relatedInvoiceNumber: 'INV-2026-1035',
    actionRoute: '/invoices/INV-2026-1035',
    actionLabel: 'View Commercial Memo',
  ),
  NotificationEntity(
    id: 'notif-005',
    title: 'Ordering Window Closing at 5:00 PM',
    body: 'Daily operational gate closes strictly at 5:00 PM IST. Place orders to guarantee early morning 5:30 AM drop.',
    timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 18)),
    category: NotificationCategory.updates,
    isRead: true,
    actionRoute: '/catalog',
    actionLabel: 'Open Morning Shop',
  ),
  NotificationEntity(
    id: 'notif-006',
    title: 'Vedic A2 Cow Ghee Churned Today',
    body: 'Fresh Vedic Bilona Ghee 500ml glass jars churned at Devlali sanctuary now available for bulk booth reservation.',
    timestamp: DateTime.now().subtract(const Duration(days: 2)),
    category: NotificationCategory.updates,
    isRead: true,
    actionRoute: '/catalog/prod-005',
    actionLabel: 'View Ghee Specs',
  ),
];
