import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:yog_milk_retailer/src/core/mock_engine/contracts/order_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/contracts/payment_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/contracts/notification_repository.dart';

import 'package:yog_milk_retailer/src/core/mock_engine/payment_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/invoice_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/notification_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/order_controller.dart';

import 'package:yog_milk_retailer/src/features/payments/payment_history_screen.dart';
import 'package:yog_milk_retailer/src/features/invoices/invoices_list_screen.dart';
import 'package:yog_milk_retailer/src/features/invoices/invoice_detail_screen.dart';
import 'package:yog_milk_retailer/src/features/invoices/invoice_preview_screen.dart';
import 'package:yog_milk_retailer/src/features/notifications/notifications_screen.dart';
import 'package:yog_milk_retailer/src/features/notifications/widgets/notification_detail_sheet.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Payment Controller & Settlement Unit Tests', () {
    test('Initial payments list is populated with realistic Maharashtra seed data', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final payments = container.read(paymentsProvider);
      expect(payments.isNotEmpty, isTrue);

      final pendingCod = payments.firstWhere((p) => p.isPending);
      expect(pendingCod.methodType, equals(PaymentMethodType.cod));
      expect(pendingCod.amountDue, greaterThan(0));
      expect(pendingCod.isSettled, isFalse);
    });

    test('Settle COD Payment updates transaction to paid, clears debt, and cross-syncs with ordersProvider', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(paymentsProvider.notifier);
      final initialPending = notifier.activeBlockingPayment;
      expect(initialPending, isNotNull);
      expect(initialPending!.isPending, isTrue);

      // Verify order before settlement
      final ordersBefore = container.read(ordersProvider);
      final orderBefore = ordersBefore.firstWhere((o) => o.orderCode == initialPending.orderCode);
      expect(orderBefore.paymentStatus, equals(PaymentLifecycleStatus.pending));

      // Execute settlement
      notifier.settleCodPayment(
        initialPending.id,
        receiptVoucher: 'DEPOT-CASH-TEST-99',
      );

      // Verify payment state after settlement
      final updatedPayment = container.read(paymentsProvider).firstWhere((p) => p.id == initialPending.id);
      expect(updatedPayment.status, equals(PaymentLifecycleStatus.paid));
      expect(updatedPayment.isSettled, isTrue);
      expect(updatedPayment.amountDue, equals(0.00));
      expect(updatedPayment.referenceNumber, equals('DEPOT-CASH-TEST-99'));

      // Verify order cross-sync (Rule 4.4 restriction release)
      final ordersAfter = container.read(ordersProvider);
      final orderAfter = ordersAfter.firstWhere((o) => o.orderCode == initialPending.orderCode);
      expect(orderAfter.paymentStatus, equals(PaymentLifecycleStatus.paid));
      expect(container.read(ordersProvider.notifier).hasPendingPaymentDebt, isFalse);
    });

    test('Financial calculations totalSettledAmount and totalPendingAmount calculate accurately', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(paymentsProvider.notifier);
      expect(notifier.totalSettledAmount, greaterThan(0));
      expect(notifier.totalPendingAmount, greaterThan(0));
    });
  });

  group('Commercial Invoice (Rule 4.5 Non-GST) Unit Tests', () {
    test('Invoices comply with Rule 4.5: Raw agricultural dairy produce is Non-GST', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final invoices = container.read(invoicesProvider);
      expect(invoices.isNotEmpty, isTrue);

      for (final inv in invoices) {
        expect(inv.supplierBusinessName.toUpperCase(), contains('YOG MILK'));
        expect(inv.supplierFssaiNumber, equals('11519036000281'));
        expect(inv.invoiceNumber, startsWith('INV-2026-'));
        expect(inv.items.isNotEmpty, isTrue);
        // Financial sanity
        expect(inv.totalAmount, equals(inv.subtotal + inv.deliveryFee));
        expect(inv.amountDue, equals(inv.totalAmount - inv.amountReceived));
      }
    });

    test('createInvoiceFromOrder generates accurate Non-GST Commercial Farm Bill', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final orders = container.read(ordersProvider);
      final targetOrder = orders.first;

      final invoiceNotifier = container.read(invoicesProvider.notifier);
      final newInvoice = invoiceNotifier.createInvoiceFromOrder(
        order: targetOrder,
        retailerBusinessName: 'Om Sai Dairy & Sweets',
        retailerOwnerName: 'Ramesh Patil',
        retailerPhone: '+91 98201 54321',
      );

      expect(newInvoice.orderCode, equals(targetOrder.orderCode));
      expect(newInvoice.subtotal, equals(targetOrder.subtotal));
      expect(newInvoice.deliveryFee, equals(targetOrder.deliveryCharge));
      expect(newInvoice.totalAmount, equals(targetOrder.totalPayable));
      expect(newInvoice.items.length, equals(targetOrder.items.length));
    });

    test('updateInvoicePaymentStatus updates invoice to paid', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final invoiceNotifier = container.read(invoicesProvider.notifier);
      final pendingInv = container.read(invoicesProvider).firstWhere((i) => i.isPending);

      invoiceNotifier.updateInvoicePaymentStatus(
        pendingInv.invoiceNumber,
        PaymentLifecycleStatus.paid,
      );

      final updated = container.read(invoicesProvider).firstWhere((i) => i.invoiceNumber == pendingInv.invoiceNumber);
      expect(updated.paymentStatus, equals(PaymentLifecycleStatus.paid));
      expect(updated.isSettled, isTrue);
      expect(updated.amountDue, equals(0.00));
    });
  });

  group('Notification Controller & Feed Unit Tests', () {
    test('Seed notifications are properly typed and populated', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifications = container.read(notificationsProvider);
      expect(notifications.isNotEmpty, isTrue);
      expect(container.read(notificationsProvider.notifier).unreadCount, greaterThan(0));
    });

    test('markAsRead and markAsUnread toggle notification read state', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      final firstNotif = container.read(notificationsProvider).first;

      // Mark as read
      notifier.markAsRead(firstNotif.id);
      expect(container.read(notificationsProvider).firstWhere((n) => n.id == firstNotif.id).isRead, isTrue);

      // Mark as unread
      notifier.markAsUnread(firstNotif.id);
      expect(container.read(notificationsProvider).firstWhere((n) => n.id == firstNotif.id).isRead, isFalse);
    });

    test('markAllAsRead marks every notification as read', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      expect(notifier.unreadCount, greaterThan(0));

      notifier.markAllAsRead();

      expect(notifier.unreadCount, equals(0));
      for (final notif in container.read(notificationsProvider)) {
        expect(notif.isRead, isTrue);
      }
    });

    test('addNotification prepends new operational alert to feed', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(notificationsProvider.notifier);
      final initialCount = container.read(notificationsProvider).length;

      notifier.addNotification(
        title: 'Gaushala Churn Complete',
        body: 'Fresh Vedic cultured ghee churned at Nashik dairy unit.',
        category: NotificationCategory.updates,
        actionLabel: 'Explore Catalog',
        actionRoute: '/catalog',
      );

      final updated = container.read(notificationsProvider);
      expect(updated.length, equals(initialCount + 1));
      expect(updated.first.title, equals('Gaushala Churn Complete'));
      expect(updated.first.isRead, isFalse);
    });
  });

  group('Payment History Screen Widget Tests', () {
    testWidgets('Renders Bento summary card, filter tabs, and transaction cards', (tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: PaymentHistoryScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Top title
      expect(find.text('Payment History'), findsOneWidget);

      // Bento cards: Settled vs Active COD Due
      expect(find.text('Settled Payments'), findsOneWidget);
      expect(find.text('Active COD Due'), findsOneWidget);

      // Filter tabs & Pending status pill
      expect(find.text('All Payments'), findsOneWidget);
      expect(find.text('Successful'), findsOneWidget);
      expect(find.text('Pending COD'), findsAtLeastNWidgets(1));
    });
  });

  group('Invoices List Screen Widget Tests', () {
    testWidgets('Renders cycle summary, search bar, filter pills, and invoice cards', (tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: InvoicesListScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Title & Bento summary
      expect(find.text('Commercial Invoices'), findsOneWidget);
      expect(find.text('Rule 4.5 Non-GST'), findsOneWidget);
      expect(find.text('Total Billed Amount'), findsOneWidget);

      // Filter chips
      expect(find.text('All Invoices'), findsOneWidget);
      expect(find.text('Paid & Settled'), findsAtLeastNWidgets(1));
      expect(find.text('Pending COD'), findsAtLeastNWidgets(1));

      // Non-GST indicator
      expect(find.textContaining('Non-GST'), findsAtLeastNWidgets(1));

      // Action buttons
      expect(find.text('View Bill'), findsAtLeastNWidgets(1));
      expect(find.text('Mock PDF'), findsAtLeastNWidgets(1));
    });
  });

  group('Invoice Detail Screen Widget Tests', () {
    testWidgets('Displays supplier identity, FSSAI #11519036000281, and itemized breakdown', (tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 1000));

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: InvoiceDetailScreen(invoiceId: 'INV-2026-1049'),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Prototype notice
      expect(find.textContaining('PROTOTYPE NOTICE'), findsOneWidget);

      // Supplier identity
      expect(find.text('YOG MILK DAIRY PRODUCTS PVT. LTD.'), findsOneWidget);
      expect(find.textContaining('11519036000281'), findsOneWidget);

      // Retailer identity
      expect(find.text('Om Sai Dairy & Sweets'), findsOneWidget);

      // Itemized items
      expect(find.text('Gir Cow Full Cream Milk 1L'), findsOneWidget);

      // Financial breakdown & Rule 4.5 compliance
      final subtotalFinder = find.text('Items Subtotal');
      await tester.scrollUntilVisible(subtotalFinder, 100);
      expect(subtotalFinder, findsOneWidget);
      expect(find.text('Dawn Delivery Fee'), findsOneWidget);
      expect(find.text('Total Commercial Payable'), findsOneWidget);
      expect(find.text('Amount Received'), findsOneWidget);
      expect(find.text('Balance Due'), findsOneWidget);
      expect(find.text('Pure Agricultural Produce · Exempt from GST'), findsOneWidget);
    });
  });

  group('Invoice Preview (Mock PDF Paper) Screen Widget Tests', () {
    testWidgets('Renders authentic paper-styled Non-GST Commercial Farm Bill with watermark', (tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 1000));

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: InvoicePreviewScreen(invoiceId: 'INV-2026-1049'),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Watermark & Prototype indicators
      expect(find.textContaining('DEVELOPMENT PROTOTYPE'), findsOneWidget);
      expect(find.textContaining('MOCK GENERATED INVOICE PREVIEW'), findsOneWidget);

      // Document title
      expect(find.text('COMMERCIAL INVOICE / FARM BILL'), findsOneWidget);

      // Supplier details
      expect(find.text('YOG MILK DAIRY PRODUCTS PVT. LTD.'), findsOneWidget);
      expect(find.textContaining('11519036000281'), findsOneWidget);

      // Bill details
      expect(find.text('INV-2026-1049'), findsOneWidget);
      expect(find.text('YM-2026-8841'), findsOneWidget);

      // Action buttons
      expect(find.text('Download PDF'), findsOneWidget);
      expect(find.text('Share Document'), findsOneWidget);
    });
  });

  group('Notifications Screen & Detail Sheet Widget Tests', () {
    testWidgets('Renders categories, dawn banner, notification cards, and detail sheet', (tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 1000));

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: NotificationsScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Header & Dawn Banner
      expect(find.text('Notifications'), findsOneWidget);
      expect(find.text('Mark all read'), findsOneWidget);
      expect(find.textContaining('Dawn distribution batches dispatch at'), findsOneWidget);

      // Filter chips
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Orders & Delivery'), findsOneWidget);
      expect(find.text('Billing'), findsOneWidget);
      expect(find.text('Updates'), findsOneWidget);

      // Section groups
      expect(find.text('Today'), findsOneWidget);

      // Tap on a notification to open detail sheet
      final firstCard = find.byType(InkWell).first;
      await tester.ensureVisible(firstCard);
      await tester.tap(firstCard);
      await tester.pumpAndSettle();

      // Detail sheet content
      expect(find.byType(NotificationDetailSheet), findsOneWidget);
      expect(find.text('Linked Transaction Details'), findsOneWidget);
      expect(find.text('Close'), findsOneWidget);
    });
  });
}
