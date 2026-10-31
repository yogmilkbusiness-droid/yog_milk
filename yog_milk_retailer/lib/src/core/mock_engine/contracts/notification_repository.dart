library;

/// High-level categories for in-app operational notifications.
enum NotificationCategory {
  all,
  ordersAndDelivery,
  billing,
  updates,
}

extension NotificationCategoryX on NotificationCategory {
  String get displayLabel {
    return switch (this) {
      NotificationCategory.all => 'All',
      NotificationCategory.ordersAndDelivery => 'Orders & Delivery',
      NotificationCategory.billing => 'Billing',
      NotificationCategory.updates => 'Updates',
    };
  }
}

/// Notification Entity.
class NotificationEntity {
  final String id;
  final String title;
  final String body;
  final DateTime timestamp;
  final NotificationCategory category;
  final bool isRead;
  final String? relatedOrderCode;
  final String? relatedInvoiceNumber;
  final String? actionRoute;
  final String? actionLabel;

  const NotificationEntity({
    required this.id,
    required this.title,
    required this.body,
    required this.timestamp,
    required this.category,
    required this.isRead,
    this.relatedOrderCode,
    this.relatedInvoiceNumber,
    this.actionRoute,
    this.actionLabel,
  });

  NotificationEntity copyWith({
    String? id,
    String? title,
    String? body,
    DateTime? timestamp,
    NotificationCategory? category,
    bool? isRead,
    String? relatedOrderCode,
    String? relatedInvoiceNumber,
    String? actionRoute,
    String? actionLabel,
  }) {
    return NotificationEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      timestamp: timestamp ?? this.timestamp,
      category: category ?? this.category,
      isRead: isRead ?? this.isRead,
      relatedOrderCode: relatedOrderCode ?? this.relatedOrderCode,
      relatedInvoiceNumber: relatedInvoiceNumber ?? this.relatedInvoiceNumber,
      actionRoute: actionRoute ?? this.actionRoute,
      actionLabel: actionLabel ?? this.actionLabel,
    );
  }
}

