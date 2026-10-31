library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/notification_repository.dart';
import 'seed/mock_notifications.dart';

/// StateNotifier for notifications feed and read/unread interactions.
class NotificationNotifier extends StateNotifier<List<NotificationEntity>> {
  NotificationNotifier() : super(List<NotificationEntity>.from(mockInitialNotificationsList));

  /// Marks a specific notification as read.
  void markAsRead(String id) {
    state = [
      for (final n in state)
        if (n.id == id) n.copyWith(isRead: true) else n,
    ];
  }

  /// Marks a specific notification as unread.
  void markAsUnread(String id) {
    state = [
      for (final n in state)
        if (n.id == id) n.copyWith(isRead: false) else n,
    ];
  }

  /// Marks all notifications as read.
  void markAllAsRead() {
    state = [
      for (final n in state) n.copyWith(isRead: true),
    ];
  }

  /// Adds a new notification to top of feed.
  void addNotification({
    required String title,
    required String body,
    required NotificationCategory category,
    String? relatedOrderCode,
    String? relatedInvoiceNumber,
    String? actionRoute,
    String? actionLabel,
  }) {
    final newNotif = NotificationEntity(
      id: 'notif-${100 + state.length + 1}',
      title: title,
      body: body,
      timestamp: DateTime.now(),
      category: category,
      isRead: false,
      relatedOrderCode: relatedOrderCode,
      relatedInvoiceNumber: relatedInvoiceNumber,
      actionRoute: actionRoute,
      actionLabel: actionLabel,
    );

    state = [newNotif, ...state];
  }

  /// Number of unread notifications.
  int get unreadCount => state.where((n) => !n.isRead).length;

  /// Retrieves a notification by its id.
  NotificationEntity? getNotificationById(String id) {
    try {
      return state.firstWhere((n) => n.id == id);
    } catch (_) {
      return null;
    }
  }
}

/// Global provider for notifications.
final notificationsProvider = StateNotifierProvider<NotificationNotifier, List<NotificationEntity>>((ref) {
  return NotificationNotifier();
});

