import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yog_milk_retailer/src/core/localization/app_localizations.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/cart_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/contracts/order_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/mock_schedule_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/order_controller.dart';
import 'package:yog_milk_retailer/src/features/checkout/checkout_screen.dart';
import 'package:yog_milk_retailer/src/features/checkout/payment_failed_screen.dart';
import 'package:yog_milk_retailer/src/features/checkout/verifying_payment_screen.dart';
import 'package:yog_milk_retailer/src/features/orders/delivery_tracking_screen.dart';
import 'package:yog_milk_retailer/src/features/orders/order_detail_screen.dart';
import 'package:yog_milk_retailer/src/features/orders/order_success_screen.dart';
import 'package:yog_milk_retailer/src/features/orders/orders_list_screen.dart';

Widget createTestApp(
  Widget child, {
  List<Override> overrides = const [],
}) {
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      localizationsDelegates: const [
        AppLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
      home: child,
    ),
  );
}

void main() {
  group('Orders Controller & Triad Unit Tests', () {
    test('Initial orders list is populated with realistic Maharashtra seed data', () {
      final notifier = OrdersNotifier();
      expect(notifier.state.length, 4);

      // Verify active order has COD pending
      final activeOrder = notifier.state.firstWhere((o) => o.id == 'ord-8841');
      expect(activeOrder.orderStatus, OrderLifecycleStatus.processing);
      expect(activeOrder.paymentStatus, PaymentLifecycleStatus.pending);
      expect(activeOrder.deliveryStatus, DeliveryLifecycleStatus.assigned);
      expect(activeOrder.paymentMethod, 'COD');
    });

    test('Creating an order with COD sets placed, pending, and notAssigned status triad', () {
      final notifier = OrdersNotifier();
      final cartNotifier = CartNotifier();
      final cart = cartNotifier.state;

      final newOrder = notifier.createOrder(
        cartItems: cart.items,
        paymentMethod: 'COD',
        deliveryAddress: 'Shop 4, Anand Nagar, Kothrud, Pune',
        specialInstructions: 'Ring bell at back door',
      );

      expect(newOrder.orderStatus, OrderLifecycleStatus.placed);
      expect(newOrder.paymentStatus, PaymentLifecycleStatus.pending);
      expect(newOrder.deliveryStatus, DeliveryLifecycleStatus.notAssigned);
      expect(newOrder.paymentMethod, 'COD');
      expect(newOrder.deliveryAddress, 'Shop 4, Anand Nagar, Kothrud, Pune');
      expect(newOrder.specialInstructions, 'Ring bell at back door');
      expect(newOrder.items.length, cart.items.length);
      expect(newOrder.totalPayable, cart.totalPayable);
      expect(newOrder.statusHistory.isNotEmpty, isTrue);
      expect(newOrder.deliveryHistory.isNotEmpty, isTrue);

      // Verify prepended to list
      expect(notifier.state.first.id, newOrder.id);
    });

    test('Creating an order with ONLINE sets placed, paid, and notAssigned status triad', () {
      final notifier = OrdersNotifier();
      final cartNotifier = CartNotifier();
      final cart = cartNotifier.state;

      final newOrder = notifier.createOrder(
        cartItems: cart.items,
        paymentMethod: 'RAZORPAY_ONLINE',
        deliveryAddress: 'Shop 4, Anand Nagar, Kothrud, Pune',
        isOnlinePaid: true,
      );

      expect(newOrder.orderStatus, OrderLifecycleStatus.placed);
      expect(newOrder.paymentStatus, PaymentLifecycleStatus.paid);
      expect(newOrder.deliveryStatus, DeliveryLifecycleStatus.notAssigned);
      expect(newOrder.paymentMethod, 'RAZORPAY_ONLINE');
    });

    test('Cancelling an order updates orderStatus to cancelled and deliveryStatus to failed without modifying payment status', () {
      final notifier = OrdersNotifier();
      final initialPaymentStatus = notifier.state.first.paymentStatus;

      notifier.cancelOrder('ord-8841');

      final cancelledOrder = notifier.state.firstWhere((o) => o.id == 'ord-8841');
      expect(cancelledOrder.orderStatus, OrderLifecycleStatus.cancelled);
      expect(cancelledOrder.deliveryStatus, DeliveryLifecycleStatus.failed);
      // Independent triad: paymentStatus is decoupled
      expect(cancelledOrder.paymentStatus, initialPaymentStatus);
      expect(cancelledOrder.statusHistory.last.title, 'Order Cancelled');
    });

    test('hasPendingPaymentDebt accurately checks pending payments', () {
      final notifier = OrdersNotifier();
      // Initially, ord-8841 has PaymentLifecycleStatus.pending
      expect(notifier.hasPendingPaymentDebt, isTrue);

      // Mark paid
      notifier.updatePaymentStatus('ord-8841', PaymentLifecycleStatus.paid);
      expect(notifier.hasPendingPaymentDebt, isFalse);
    });
  });

  group('Checkout Screen Widget Tests', () {
    testWidgets('Renders delivery slot, address card, payment options, and bill summary', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const CheckoutScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Checkout'), findsOneWidget);
      expect(find.text('SCHEDULED WINDOW'), findsOneWidget);
      expect(find.text('Tomorrow Dawn · 5:30 AM – 7:00 AM'), findsOneWidget);
      expect(find.text('DAWN DELIVERY DROP POINT'), findsOneWidget);
      expect(find.text('Select Payment Option'), findsOneWidget);
      expect(find.text('Pay Online (UPI, Cards, Netbanking)'), findsOneWidget);
      expect(find.text('Cash on Delivery (COD)'), findsOneWidget);
      expect(find.text('Items Subtotal'), findsOneWidget);
      expect(find.text('Dawn Express Crate Delivery'), findsOneWidget);
    });

    testWidgets('Enforces Rule 4.1 Operational Gate when ordering schedule is closed', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(
        const CheckoutScreen(),
        overrides: [
          scheduleProvider.overrideWith(
            (ref) => ScheduleNotifier()..state = const ScheduleState(isWindowOpen: false),
          ),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.text('Ordering Window Closed'), findsWidgets);
    });

    testWidgets('Enforces Rule 4.4 One-Pending Payment Debt restriction at checkout', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const CheckoutScreen()));
      await tester.pumpAndSettle();

      // Seed ord-8841 is pending COD, so debt restriction notice is displayed
      expect(find.text('Pending Payment Restriction'), findsOneWidget);
      expect(find.text('Pending Payment Debt Blocked'), findsOneWidget);
    });
  });

  group('Verifying Payment & Failed Screen Widget Tests', () {
    testWidgets('VerifyingPaymentScreen renders Yogic meditative animation and trust badge', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(
        const VerifyingPaymentScreen(checkoutData: {
          'paymentMethod': 'RAZORPAY_ONLINE',
          'deliveryAddress': 'Shop 4, Pune',
        }),
      ));
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Verifying your payment...'), findsOneWidget);
      expect(find.text('FROM NATURE TO NOURISH YOU'), findsOneWidget);
      expect(find.text('Yog Milk'), findsOneWidget);
    });

    testWidgets('PaymentFailedScreen renders retry and switch to COD options', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const PaymentFailedScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Payment Unsuccessful'), findsOneWidget);
      expect(find.text('Retry Online Payment'), findsOneWidget);
      expect(find.text('Switch to Cash on Delivery (COD)'), findsOneWidget);
    });
  });

  group('Order Success Screen Widget Tests', () {
    testWidgets('Renders celebration, copyable order code, and independent status triad', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(
        const OrderSuccessScreen(orderId: 'ord-8841'),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Order Placed for Dawn Delivery!'), findsOneWidget);
      expect(find.text('YM-2026-8841'), findsOneWidget);
      expect(find.text('INDEPENDENT STATUS PROGRESSION (TRIAD)'), findsOneWidget);
      expect(find.text('Track Order Progress'), findsOneWidget);
      expect(find.text('Continue Shopping'), findsOneWidget);
    });
  });

  group('Orders List Screen Widget Tests', () {
    testWidgets('Renders all order tabs and filters orders by tab selection', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const OrdersListScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Your Orders'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Active'), findsOneWidget);
      expect(find.text('Delivered'), findsWidgets);
      expect(find.text('Cancelled'), findsWidgets);

      // Verify active order card is present
      expect(find.text('YM-2026-8841'), findsOneWidget);

      // Switch to Delivered tab
      await tester.tap(find.text('Delivered').first);
      await tester.pumpAndSettle();

      expect(find.text('YM-2026-8812'), findsOneWidget);
      expect(find.text('YM-2026-8841'), findsNothing);
    });
  });

  group('Order Detail Screen Widget Tests', () {
    testWidgets('Renders all required order details, status triad, and status history timeline', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(
        const OrderDetailScreen(orderId: 'ord-8841'),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Order Details'), findsOneWidget);
      expect(find.text('YM-2026-8841'), findsWidgets);
      expect(find.text('Gir Cow Full Cream Milk 1L'), findsOneWidget);
      expect(find.text('Fresh Malai Paneer 1kg'), findsOneWidget);
      expect(find.text('Track Delivery'), findsOneWidget);
      expect(find.text('Cancel Order'), findsOneWidget);
    });
  });

  group('Delivery Tracking Screen Widget Tests', () {
    testWidgets('Renders 5-stage doorstep delivery progression and dispatch reference', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(
        const DeliveryTrackingScreen(orderId: 'ord-8841'),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Dawn Delivery Tracking'), findsOneWidget);
      expect(find.text('YMD-2026-8841'), findsOneWidget);
      expect(find.text('Not assigned'), findsOneWidget);
      expect(find.text('Assigned'), findsNWidgets(2));
      expect(find.text('Picked up'), findsOneWidget);
      expect(find.text('Out for delivery'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
      expect(find.text('Drop Destination'), findsOneWidget);
    });
  });
}
