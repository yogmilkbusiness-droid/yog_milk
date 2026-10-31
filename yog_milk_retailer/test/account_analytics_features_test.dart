import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:yog_milk_retailer/src/core/localization/app_localizations.dart';
import 'package:yog_milk_retailer/src/core/localization/locale_controller.dart';
import 'package:yog_milk_retailer/src/core/design_system/widgets/yog_button.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/address_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/contracts/address_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/contracts/order_repository.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/order_controller.dart';
import 'package:yog_milk_retailer/src/features/account/account_screen.dart';
import 'package:yog_milk_retailer/src/features/account/address_management_screen.dart';
import 'package:yog_milk_retailer/src/features/account/business_info_screen.dart';
import 'package:yog_milk_retailer/src/features/orders/delivery_tracking_screen.dart';
import 'package:yog_milk_retailer/src/features/purchases/purchase_analytics_controller.dart';
import 'package:yog_milk_retailer/src/features/purchases/purchases_screen.dart';

Widget _buildTestApp(Widget child, [ProviderContainer? container]) {
  return UncontrolledProviderScope(
    container: container ?? ProviderContainer(),
    child: Consumer(
      builder: (context, ref, _) {
        final locale = ref.watch(localeControllerProvider);
        return MaterialApp(
          locale: locale,
          supportedLocales: AppLocalizations.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          home: child,
        );
      },
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Purchase Analytics Provider Unit Tests', () {
    test('Calculates monthly overview metrics from active orders', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final analytics = container.read(purchaseAnalyticsProvider);
      final orders = container.read(ordersProvider);

      final validOrders = orders
          .where((o) => o.orderStatus != OrderLifecycleStatus.cancelled)
          .toList();

      expect(analytics.monthlyOverview.totalDrops, equals(validOrders.length));
      expect(analytics.monthlyOverview.totalSpend, greaterThan(0));
      expect(
        analytics.monthlyOverview.avgDrop,
        closeTo(
          analytics.monthlyOverview.totalSpend / validOrders.length,
          0.01,
        ),
      );
      expect(analytics.monthlyOverview.period, equals('Oct 2026'));
    });

    test('Calculates settlement health summary without any credit metrics', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final analytics = container.read(purchaseAnalyticsProvider);
      final summary = analytics.settlementSummary;

      expect(summary.clearedAmount, greaterThan(0));
      expect(summary.pendingCodAmount, greaterThan(0));
      expect(summary.clearedPercent + summary.pendingPercent, closeTo(1.0, 0.01));
      expect(summary.pendingOrdersCount, greaterThanOrEqualTo(1));
    });

    test('Aggregates farm staples basket by product spend', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final analytics = container.read(purchaseAnalyticsProvider);
      final staples = analytics.topStaples;

      expect(staples.isNotEmpty, isTrue);
      // Ensure sorted by spend descending
      for (int i = 0; i < staples.length - 1; i++) {
        expect(staples[i].totalSpend, greaterThanOrEqualTo(staples[i + 1].totalSpend));
      }
    });

    test('Order statistics accurately counts active, delivered, and cancelled', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final analytics = container.read(purchaseAnalyticsProvider);
      final stats = analytics.orderStats;

      expect(stats.total, equals(stats.active + stats.delivered + stats.cancelled));
      expect(stats.total, greaterThan(0));
    });
  });

  group('Address Management Notifier Unit Tests', () {
    test('Initial addresses contain default primary drop point', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final addresses = container.read(addressProvider);
      expect(addresses.isNotEmpty, isTrue);

      final defaultAddr = addresses.firstWhere((a) => a.isDefault);
      expect(defaultAddr.city, equals('Pune'));
      expect(defaultAddr.area, equals('Kothrud'));
    });

    test('Adding a new address with isDefault sets previous default to false', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      const newAddr = DeliveryAddressEntity(
        id: 'addr-new-99',
        title: 'New Outlet Booth',
        businessName: 'Om Sai Dairy',
        street: 'MG Road',
        area: 'Camp',
        city: 'Pune',
        pincode: '411001',
        isDefault: true,
      );

      container.read(addressProvider.notifier).addAddress(newAddr);

      final updated = container.read(addressProvider);
      final matching = updated.firstWhere((a) => a.id == 'addr-new-99');
      expect(matching.isDefault, isTrue);

      // Verify only 1 address is default
      final defaults = updated.where((a) => a.isDefault).toList();
      expect(defaults.length, equals(1));
    });

    test('setDefault changes default address correctly', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(addressProvider.notifier).setDefault('addr-002');
      final updated = container.read(addressProvider);

      final addr2 = updated.firstWhere((a) => a.id == 'addr-002');
      expect(addr2.isDefault, isTrue);

      final addr1 = updated.firstWhere((a) => a.id == 'addr-001');
      expect(addr1.isDefault, isFalse);
    });

    test('Deleting address removes it from list', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(addressProvider.notifier).deleteAddress('addr-003');
      final updated = container.read(addressProvider);

      expect(updated.any((a) => a.id == 'addr-003'), isFalse);
    });
  });

  group('Trilingual Localization & Locale Controller Unit Tests', () {
    test('LocaleNotifier switches between en, hi, mr and validates codes', () {
      final notifier = LocaleNotifier();
      expect(notifier.state.languageCode, equals('en'));

      notifier.setLanguageCode('hi');
      expect(notifier.state.languageCode, equals('hi'));

      notifier.setLanguageCode('mr');
      expect(notifier.state.languageCode, equals('mr'));

      // Ignore unsupported codes
      notifier.setLanguageCode('fr');
      expect(notifier.state.languageCode, equals('mr'));
    });

    test('AppLocalizations translates keys in all three languages', () {
      final en = AppLocalizations(const Locale('en'));
      final hi = AppLocalizations(const Locale('hi'));
      final mr = AppLocalizations(const Locale('mr'));

      expect(en.account, equals('Account'));
      expect(hi.account, equals('खाता'));
      expect(mr.account, equals('खाते'));

      expect(en.myPurchases, equals('My Purchases'));
      expect(hi.myPurchases, equals('मेरी खरीदारी'));
      expect(mr.myPurchases, equals('माझी खरेदी'));

      expect(en.deliveryAddresses, equals('Delivery Addresses & Drop Point'));
      expect(hi.deliveryAddresses, equals('वितरण पते एवं ड्रॉप पॉइंट'));
      expect(mr.deliveryAddresses, equals('डिलिव्हरी पत्ते आणि ड्रॉप पॉईंट'));
    });
  });

  group('PurchasesScreen Widget Tests', () {
    testWidgets('Renders top metrics, settlement health, weekly spend, and farm staples',
        (tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(_buildTestApp(const PurchasesScreen(), container));
      await tester.pumpAndSettle();

      // Verify Top Metrics Ribbon
      expect(find.text('This Month'), findsOneWidget);
      expect(find.text('Total Drops'), findsOneWidget);
      expect(find.text('Avg Drop'), findsOneWidget);

      // Verify Settlement Health
      expect(find.text('Settlement Ratio'), findsOneWidget);
      expect(find.textContaining('Cleared (Online):'), findsOneWidget);
      expect(find.textContaining('COD Due:'), findsOneWidget);

      // Verify Weekly Spend Rhythm
      expect(find.text('Weekly Spend Rhythm'), findsOneWidget);
      expect(find.text('W1'), findsOneWidget);
      expect(find.text('W4 (Now)'), findsOneWidget);

      // Verify Farm Staples Basket
      expect(find.text('Farm Staples Basket'), findsOneWidget);

      // Verify Recent Drops and Purity Card by scrolling down
      await tester.scrollUntilVisible(find.text('PURE SATTVIC ORIGIN'), 300);
      expect(find.text('Recent Drops & History'), findsOneWidget);
      expect(find.text('PURE SATTVIC ORIGIN'), findsOneWidget);
    });
  });

  group('AccountScreen Widget Tests', () {
    testWidgets('Renders retailer profile card, orders & finance, and language switcher',
        (tester) async {
      tester.view.physicalSize = const Size(400, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(_buildTestApp(const AccountScreen(), container));
      await tester.pumpAndSettle();

      // Profile details
      expect(find.text('Ramesh Patil'), findsOneWidget);
      expect(find.text('Om Sai Dairy & Sweets'), findsAtLeastNWidgets(1));
      expect(find.text('YM-CUST-84920'), findsOneWidget);
      expect(find.text('Active'), findsOneWidget);

      // Orders & Finance section
      expect(find.text('ORDERS & FINANCE'), findsOneWidget);
      expect(find.text('My Purchases'), findsOneWidget);
      expect(find.text('Delivery Addresses & Drop Point'), findsOneWidget);

      // Language Switcher Chips
      expect(find.text('English'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);
      expect(find.text('मराठी'), findsOneWidget);

      // Tap 'मराठी' chip and verify language changes
      await tester.tap(find.text('मराठी'));
      await tester.pumpAndSettle();

      // UI text updates to Marathi
      expect(container.read(localeControllerProvider).languageCode, equals('mr'));
      expect(find.text('खाते'), findsOneWidget);
      expect(find.text('माझी खरेदी'), findsOneWidget);
    });
  });

  group('AddressManagementScreen Widget Tests', () {
    testWidgets('Renders address list with default badge and add address button',
        (tester) async {
      tester.view.physicalSize = const Size(400, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(_buildTestApp(const AddressManagementScreen(), container));
      await tester.pumpAndSettle();

      expect(find.text('Delivery Addresses & Drop Point'), findsOneWidget);
      expect(find.text('Default Drop'), findsOneWidget);
      expect(find.text('Main Dairy Booth (Primary Drop Point)'), findsOneWidget);

      await tester.drag(find.byType(ListView), const Offset(0, -500));
      await tester.pumpAndSettle();

      final addButton = find.byType(YogButton);
      expect(addButton, findsOneWidget);

      // Tap Add New Address button and verify bottom sheet appears
      await tester.tap(addButton);
      await tester.pumpAndSettle();

      expect(find.text('Add Delivery Drop Point'), findsOneWidget);
      expect(find.text('Save Address'), findsOneWidget);
    });
  });

  group('BusinessInfoScreen Widget Tests', () {
    testWidgets('Renders regulatory credentials and Non-GST agricultural supply notice',
        (tester) async {
      tester.view.physicalSize = const Size(400, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(_buildTestApp(const BusinessInfoScreen(), container));
      await tester.pumpAndSettle();

      expect(find.text('Business & FSSAI Information'), findsOneWidget);
      expect(find.text('Om Sai Dairy & Sweets'), findsOneWidget);
      expect(find.text('FSSAI Verified Retailer'), findsOneWidget);
      expect(find.text('21522026000412'), findsOneWidget);
      expect(find.text('MH-PN-RET-2024-9912'), findsOneWidget);
      expect(find.text('Non-GST Agricultural Exemption'), findsOneWidget);
    });
  });

  group('DeliveryTrackingScreen Failed State Widget Test', () {
    testWidgets('Renders unsuccessful delivery attempt alert when delivery status is failed',
        (tester) async {
      tester.view.physicalSize = const Size(400, 900);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final container = ProviderContainer();
      addTearDown(container.dispose);

      // Create a test order with failed delivery
      final failedOrder = OrderEntity(
        id: 'ord-failed-01',
        orderCode: 'YM-2026-000115',
        orderDate: DateTime.now().subtract(const Duration(hours: 4)),
        orderStatus: OrderLifecycleStatus.processing,
        paymentStatus: PaymentLifecycleStatus.pending,
        deliveryStatus: DeliveryLifecycleStatus.failed,
        paymentMethod: 'COD',
        deliveryAddress: 'Shop No. 4, Anand Nagar, Paud Road, Kothrud, Pune 411038',
        deliveryReference: 'YMD-2026-000115',
        items: const [],
        subtotal: 1000.0,
        deliveryCharge: 0.0,
        totalPayable: 1000.0,
      );

      container.read(ordersProvider.notifier).state = [
        failedOrder,
        ...container.read(ordersProvider),
      ];

      await tester.pumpWidget(
        _buildTestApp(
          const DeliveryTrackingScreen(orderId: 'YM-2026-000115'),
          container,
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Delivery Attempt Unsuccessful'), findsOneWidget);
      expect(find.text('Drop Issue Noted'), findsOneWidget);
      expect(
        find.textContaining('Store shutter closed during morning dawn delivery attempt.'),
        findsOneWidget,
      );
    });
  });
}
