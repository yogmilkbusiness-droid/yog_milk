import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/mock_engine/contracts/notification_repository.dart';
import '../../core/mock_engine/notification_controller.dart';
import '../../core/design_system/tokens/app_colors.dart';
import 'widgets/notification_detail_sheet.dart';

/// Screen displaying the retailer's operational, billing, and order notifications.
/// Faithful implementation of Stitch `yog_milk_notifications`.
class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  NotificationCategory _selectedCategory = NotificationCategory.all;

  @override
  Widget build(BuildContext context) {
    final notifications = ref.watch(notificationsProvider);
    final notifier = ref.read(notificationsProvider.notifier);

    // Filter by selected category
    final filteredNotifications = notifications.where((n) {
      if (_selectedCategory == NotificationCategory.all) return true;
      return n.category == _selectedCategory;
    }).toList();

    // Group into Today and Earlier this week
    final now = DateTime.now();
    final todayNotifications = <NotificationEntity>[];
    final earlierNotifications = <NotificationEntity>[];

    for (final notif in filteredNotifications) {
      final diff = now.difference(notif.timestamp);
      if (diff.inHours < 24 && notif.timestamp.day == now.day) {
        todayNotifications.add(notif);
      } else {
        earlierNotifications.add(notif);
      }
    }

    final totalUnread = notifier.unreadCount;

    return Scaffold(
      backgroundColor: AppColors.backgroundMilk,
      appBar: AppBar(
        backgroundColor: AppColors.surface.withValues(alpha: 0.95),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primaryNavy),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(
            fontFamily: 'Playfair Display',
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.primaryNavy,
          ),
        ),
        actions: [
          if (totalUnread > 0)
            TextButton(
              onPressed: () {
                notifier.markAllAsRead();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('All notifications marked as read'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
              child: const Text(
                'Mark all read',
                style: TextStyle(
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.secondary,
                ),
              ),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Daily Dawn Insight Sub-Banner
            _buildDailyInsightBanner(),

            // Filter Chips Horizontal Row
            _buildFilterChipRow(notifications),

            const SizedBox(height: 8),

            // Notification stream
            if (filteredNotifications.isEmpty)
              _buildEmptyState()
            else ...[
              if (todayNotifications.isNotEmpty) ...[
                _buildGroupHeader(
                  title: 'Today',
                  indicatorColor: AppColors.secondary,
                  subtext: '${todayNotifications.where((n) => !n.isRead).length} new alerts',
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: todayNotifications
                        .map((n) => _buildNotificationCard(n, notifier))
                        .toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],
              if (earlierNotifications.isNotEmpty) ...[
                _buildGroupHeader(
                  title: 'Earlier this week',
                  indicatorColor: AppColors.outlineVariant,
                  subtext: '${earlierNotifications.where((n) => n.isRead).length} read',
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: earlierNotifications
                        .map((n) => _buildNotificationCard(n, notifier))
                        .toList(),
                  ),
                ),
              ],
              const SizedBox(height: 32),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDailyInsightBanner() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.surfaceContainerHigh),
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFFFFDBC8),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.wb_sunny_rounded,
                size: 18,
                color: AppColors.secondary,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text.rich(
                TextSpan(
                  text: 'Dawn distribution batches dispatch at ',
                  style: TextStyle(
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 12,
                    color: AppColors.onSurfaceVariant,
                    height: 1.3,
                  ),
                  children: [
                    TextSpan(
                      text: '5:30 AM',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                    TextSpan(
                      text: '. Pure Gir cow A2 milk tested Sattvic pure.',
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChipRow(List<NotificationEntity> allNotifications) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          _buildChip(
            category: NotificationCategory.all,
            label: 'All',
            count: allNotifications.length,
          ),
          const SizedBox(width: 8),
          _buildChip(
            category: NotificationCategory.ordersAndDelivery,
            label: 'Orders & Delivery',
            count: allNotifications
                .where((n) => n.category == NotificationCategory.ordersAndDelivery)
                .length,
          ),
          const SizedBox(width: 8),
          _buildChip(
            category: NotificationCategory.billing,
            label: 'Billing',
            count: allNotifications
                .where((n) => n.category == NotificationCategory.billing)
                .length,
          ),
          const SizedBox(width: 8),
          _buildChip(
            category: NotificationCategory.updates,
            label: 'Updates',
            count: allNotifications
                .where((n) => n.category == NotificationCategory.updates)
                .length,
          ),
        ],
      ),
    );
  }

  Widget _buildChip({
    required NotificationCategory category,
    required String label,
    required int count,
  }) {
    final isSelected = _selectedCategory == category;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = category;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        height: 34,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryNavy : Colors.white,
          borderRadius: BorderRadius.circular(17),
          border: Border.all(
            color: isSelected ? AppColors.primaryNavy : AppColors.outlineVariant.withValues(alpha: 0.5),
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primaryNavy.withValues(alpha: 0.2),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primaryContainerNavy
                    : AppColors.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '$count',
                style: TextStyle(
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : AppColors.onSurface,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGroupHeader({
    required String title,
    required Color indicatorColor,
    required String subtext,
  }) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: indicatorColor,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryNavy,
                ),
              ),
            ],
          ),
          Text(
            subtext,
            style: const TextStyle(
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 11,
              color: AppColors.outline,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(NotificationEntity notif, NotificationNotifier notifier) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: notif.isRead
              ? AppColors.surfaceContainerHigh
              : AppColors.secondary.withValues(alpha: 0.3),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: notif.isRead ? 0.02 : 0.05),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: () {
            if (!notif.isRead) {
              notifier.markAsRead(notif.id);
            }
            NotificationDetailSheet.show(context, notif);
          },
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Visual Avatar Icon
                _buildNotificationAvatar(notif),

                const SizedBox(width: 12),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              notif.title,
                              style: TextStyle(
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: 13,
                                fontWeight: notif.isRead ? FontWeight.w600 : FontWeight.bold,
                                color: notif.isRead
                                    ? AppColors.onSurface
                                    : AppColors.primaryNavy,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Text(
                            _formatRelativeTime(notif.timestamp),
                            style: const TextStyle(
                              fontFamily: 'Plus Jakarta Sans',
                              fontSize: 11,
                              color: AppColors.outline,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notif.body,
                        style: TextStyle(
                          fontFamily: 'Plus Jakarta Sans',
                          fontSize: 12,
                          color: notif.isRead
                              ? AppColors.onSurfaceVariant
                              : AppColors.onSurface,
                          height: 1.35,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (notif.actionLabel != null) ...[
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Text(
                              notif.actionLabel!,
                              style: const TextStyle(
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppColors.secondary,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.arrow_forward_rounded,
                              size: 12,
                              color: AppColors.secondary,
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Unread indicator dot or chevron
                if (!notif.isRead)
                  Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(top: 4),
                    decoration: const BoxDecoration(
                      color: AppColors.secondaryContainerAmber,
                      shape: BoxShape.circle,
                    ),
                  )
                else
                  const Padding(
                    padding: EdgeInsets.only(top: 4),
                    child: Icon(
                      Icons.chevron_right,
                      size: 16,
                      color: AppColors.outlineVariant,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationAvatar(NotificationEntity notif) {
    IconData icon;
    Color bgColor;
    Color iconColor;

    switch (notif.category) {
      case NotificationCategory.ordersAndDelivery:
        if (notif.title.toLowerCase().contains('dispatch') || notif.title.toLowerCase().contains('delivery')) {
          icon = Icons.local_shipping_rounded;
          bgColor = const Color(0xFFFFDBC8);
          iconColor = AppColors.secondary;
        } else {
          icon = Icons.shopping_bag_rounded;
          bgColor = AppColors.primaryNavy;
          iconColor = Colors.white;
        }
      case NotificationCategory.billing:
        if (notif.title.toLowerCase().contains('invoice') || notif.title.toLowerCase().contains('bill')) {
          icon = Icons.receipt_long_rounded;
          bgColor = const Color(0xFFDEE0FF);
          iconColor = AppColors.primaryNavy;
        } else {
          icon = Icons.currency_rupee_rounded;
          bgColor = AppColors.surfaceContainerHigh;
          iconColor = AppColors.primaryNavy;
        }
      case NotificationCategory.updates:
        if (notif.title.toLowerCase().contains('schedule') || notif.title.toLowerCase().contains('window')) {
          icon = Icons.schedule_rounded;
          bgColor = const Color(0xFFFFDF9C);
          iconColor = const Color(0xFF5B4300);
        } else if (notif.title.toLowerCase().contains('verified') || notif.title.toLowerCase().contains('account')) {
          icon = Icons.verified_user_rounded;
          bgColor = const Color(0xFFBBC3FF);
          iconColor = AppColors.primaryNavy;
        } else {
          icon = Icons.spa_rounded;
          bgColor = AppColors.surfaceContainerHigh;
          iconColor = AppColors.primaryNavy;
        }
      case NotificationCategory.all:
        icon = Icons.notifications_rounded;
        bgColor = AppColors.surfaceContainerHigh;
        iconColor = AppColors.primaryNavy;
    }

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: bgColor,
        shape: BoxShape.circle,
      ),
      child: Icon(icon, size: 20, color: iconColor),
    );
  }

  String _formatRelativeTime(DateTime timestamp) {
    final diff = DateTime.now().difference(timestamp);
    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m ago';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}h ago';
    } else if (diff.inDays == 1) {
      return 'Yesterday';
    } else {
      return '${diff.inDays}d ago';
    }
  }

  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.notifications_none_rounded,
              size: 32,
              color: AppColors.outline,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'No notifications here',
            style: TextStyle(
              fontFamily: 'Playfair Display',
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryNavy,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'You are completely up to date. New updates and alerts will appear here.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 13,
              color: AppColors.outline,
            ),
          ),
          const SizedBox(height: 20),
          OutlinedButton(
            onPressed: () {
              setState(() {
                _selectedCategory = NotificationCategory.all;
              });
            },
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.outlineVariant),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Show All Notifications'),
          ),
        ],
      ),
    );
  }
}
