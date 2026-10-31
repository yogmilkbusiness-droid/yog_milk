import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/mock_engine/contracts/notification_repository.dart';
import '../../../core/mock_engine/notification_controller.dart';
import '../../../core/design_system/tokens/app_colors.dart';

/// Modal bottom sheet displaying detailed content of an operational notification.
class NotificationDetailSheet extends ConsumerWidget {
  final NotificationEntity notification;

  const NotificationDetailSheet({
    super.key,
    required this.notification,
  });

  static Future<void> show(BuildContext context, NotificationEntity notification) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => NotificationDetailSheet(notification: notification),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dateFormat = DateFormat('EEE, d MMM yyyy • h:mm a');
    final formattedDate = dateFormat.format(notification.timestamp);

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 12,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: AppColors.outlineVariant,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header: Category badge + Read/Unread action
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            runSpacing: 4,
            children: [
              _buildCategoryBadge(notification.category),
              TextButton.icon(
                onPressed: () {
                  if (notification.isRead) {
                    ref.read(notificationsProvider.notifier).markAsUnread(notification.id);
                  } else {
                    ref.read(notificationsProvider.notifier).markAsRead(notification.id);
                  }
                  Navigator.of(context).pop();
                },
                icon: Icon(
                  notification.isRead ? Icons.mark_email_unread_outlined : Icons.mark_email_read_outlined,
                  size: 18,
                  color: AppColors.secondary,
                ),
                label: Text(
                  notification.isRead ? 'Mark as Unread' : 'Mark as Read',
                  style: const TextStyle(
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.secondary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Title
          Text(
            notification.title,
            style: const TextStyle(
              fontFamily: 'Playfair Display',
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryNavy,
              height: 1.25,
            ),
          ),

          const SizedBox(height: 6),

          // Timestamp
          Row(
            children: [
              const Icon(
                Icons.access_time_rounded,
                size: 14,
                color: AppColors.outline,
              ),
              const SizedBox(width: 4),
              Text(
                formattedDate,
                style: const TextStyle(
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 12,
                  color: AppColors.outline,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Body text
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceContainerHigh),
            ),
            child: Text(
              notification.body,
              style: const TextStyle(
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 14,
                color: AppColors.onSurface,
                height: 1.45,
              ),
            ),
          ),

          // Related order / invoice section
          if (notification.relatedOrderCode != null || notification.relatedInvoiceNumber != null) ...[
            const SizedBox(height: 16),
            const Text(
              'Linked Transaction Details',
              style: TextStyle(
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.outline,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            if (notification.relatedOrderCode != null)
              _buildReferenceCard(
                icon: Icons.receipt_long_rounded,
                label: 'Order Reference',
                value: notification.relatedOrderCode!,
                actionLabel: 'View Order',
                onAction: () {
                  Navigator.of(context).pop();
                  context.push('/orders/${notification.relatedOrderCode}');
                },
              ),
            if (notification.relatedInvoiceNumber != null) ...[
              const SizedBox(height: 8),
              _buildReferenceCard(
                icon: Icons.request_quote_rounded,
                label: 'Non-GST Commercial Bill',
                value: notification.relatedInvoiceNumber!,
                actionLabel: 'View Bill',
                onAction: () {
                  Navigator.of(context).pop();
                  context.push('/invoices/${notification.relatedInvoiceNumber}');
                },
              ),
            ],
          ],

          const SizedBox(height: 20),

          // Primary Context Action Button (e.g. "Track Morning Slot", "View Bill PDF", "Open Shop")
          if (notification.actionLabel != null && notification.actionRoute != null)
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                  context.push(notification.actionRoute!);
                },
                icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                label: Text(
                  notification.actionLabel!,
                  style: const TextStyle(
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryNavy,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
              ),
            ),

          const SizedBox(height: 8),

          // Close button
          SizedBox(
            width: double.infinity,
            height: 44,
            child: OutlinedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.outlineVariant),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Close',
                style: TextStyle(
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.onSurface,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryBadge(NotificationCategory category) {
    Color bg;
    Color fg;
    IconData icon;

    switch (category) {
      case NotificationCategory.ordersAndDelivery:
        bg = const Color(0xFFFFDBC8);
        fg = AppColors.secondary;
        icon = Icons.local_shipping_rounded;
      case NotificationCategory.billing:
        bg = const Color(0xFFDDE1F8);
        fg = AppColors.primaryNavy;
        icon = Icons.currency_rupee_rounded;
      case NotificationCategory.updates:
        bg = const Color(0xFFFFDF9C);
        fg = const Color(0xFF5B4300);
        icon = Icons.spa_rounded;
      case NotificationCategory.all:
        bg = AppColors.surfaceContainerHigh;
        fg = AppColors.primaryNavy;
        icon = Icons.notifications_rounded;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: fg),
          const SizedBox(width: 5),
          Text(
            category.displayLabel,
            style: TextStyle(
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: fg,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReferenceCard({
    required IconData icon,
    required String label,
    required String value,
    required String actionLabel,
    required VoidCallback onAction,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceContainerHigh),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.primaryNavy),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 11,
                    color: AppColors.outline,
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryNavy,
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: onAction,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: Text(
              actionLabel,
              style: const TextStyle(
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.secondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
