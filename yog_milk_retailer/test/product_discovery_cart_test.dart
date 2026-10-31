import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yog_milk_retailer/src/core/localization/app_localizations.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/cart_controller.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/seed/mock_orders.dart';
import 'package:yog_milk_retailer/src/core/mock_engine/seed/mock_products.dart';
import 'package:yog_milk_retailer/src/features/cart/cart_screen.dart';
import 'package:yog_milk_retailer/src/features/catalog/catalog_screen.dart';
import 'package:yog_milk_retailer/src/features/catalog/product_detail_screen.dart';
import 'package:yog_milk_retailer/src/features/catalog/widgets/quick_add_sheet.dart';
import 'package:yog_milk_retailer/src/features/catalog/widgets/reorder_review_sheet.dart';

Widget createTestApp(Widget child) {
  return ProviderScope(
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
  group('Cart Controller Unit Tests', () {
    test('Initial cart state has correct totals', () {
      final notifier = CartNotifier();
      final state = notifier.state;

      expect(state.items.length, 2);
      expect(state.isEmpty, isFalse);
      // Item 0: Gir Cow Milk (24 pouches = 2 crates @ ₹68 = ₹1,632)
      // Item 1: Masala Taak (24 pouches = 1 crate @ ₹15 = ₹360)
      // Subtotal = ₹1,992.00
      expect(state.subtotal, 1992.00);
      expect(state.deliveryFee, 50.00);
      expect(state.totalPayable, 2042.00);
      expect(state.totalUnits, 48);
      expect(state.totalCrates, 3);
    });

    test('Add, update, and remove items from cart', () {
      final notifier = CartNotifier();

      // Add 1 crate of Buffalo Milk (12 pouches @ ₹80)
      notifier.addCrate(mockProducts[1]);
      expect(notifier.state.getQuantity('prod-002'), 12);

      // Decrement 1 unit
      notifier.decrementUnit(mockProducts[1]);
      expect(notifier.state.getQuantity('prod-002'), 11);

      // Remove item
      notifier.removeItem('prod-002');
      expect(notifier.state.getQuantity('prod-002'), 0);

      // Clear cart
      notifier.clearCart();
      expect(notifier.state.isEmpty, isTrue);
      expect(notifier.state.subtotal, 0.0);
      expect(notifier.state.deliveryFee, 0.0);
      expect(notifier.state.totalPayable, 0.0);
    });

    test('Free delivery applied when subtotal >= ₹3000', () {
      final notifier = CartNotifier();
      notifier.clearCart();

      // Add 5 crates of Gir Cow Milk = 60 * 68 = ₹4,080.00
      notifier.setQuantity(mockProducts[0], 60);
      expect(notifier.state.subtotal, 4080.00);
      expect(notifier.state.isDeliveryFree, isTrue);
      expect(notifier.state.deliveryFee, 0.00);
      expect(notifier.state.totalPayable, 4080.00);
    });

    test('Reordering from historical order does not modify historical order', () {
      final notifier = CartNotifier();
      final originalItemCount = mockPastUsualOrder.items.length;
      final originalSubtotal = mockPastUsualOrder.subtotal;

      final count = notifier.reorderFromOrder(
        order: mockPastUsualOrder,
        availableProducts: mockProducts,
      );

      expect(count, 2);
      expect(notifier.state.items.length, 2);

      // Assert historical order was NOT mutated
      expect(mockPastUsualOrder.items.length, originalItemCount);
      expect(mockPastUsualOrder.subtotal, originalSubtotal);
      expect(mockPastUsualOrder.orderCode, 'YM-2026-8812');
    });
  });

  group('Catalog Screen Widget Tests', () {
    testWidgets('Renders catalogue header, search bar, and products', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const CatalogScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Yog Milk'), findsOneWidget);
      expect(find.text('Order by 5:00 PM for 5:30 AM Dawn Delivery'), findsOneWidget);
      expect(find.text('Gir Cow Full Cream Milk'), findsOneWidget);
      expect(find.text('Buffalo Full Cream Gold Milk'), findsOneWidget);
      expect(find.text('View Basket'), findsOneWidget);
    });

    testWidgets('Live search filters product list and shows empty state on no match', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const CatalogScreen()));
      await tester.pumpAndSettle();

      // Enter search query matching Paneer
      await tester.enterText(find.byType(TextField), 'Paneer');
      await tester.pumpAndSettle();

      expect(find.text('Fresh Malai Paneer'), findsOneWidget);
      expect(find.text('Gir Cow Full Cream Milk'), findsNothing);

      // Enter search query matching nothing
      await tester.enterText(find.byType(TextField), 'NonExistentSoyProduct');
      await tester.pumpAndSettle();

      expect(find.text('No Dairy Products Found'), findsOneWidget);
      expect(find.text('Reset Filters'), findsOneWidget);

      // Tap Reset Filters
      await tester.tap(find.text('Reset Filters'));
      await tester.pumpAndSettle();

      expect(find.text('Gir Cow Full Cream Milk'), findsOneWidget);
    });
  });

  group('Product Detail Screen Widget Tests', () {
    testWidgets('Renders product specifications and price calculation', (tester) async {
      tester.view.physicalSize = const Size(1080, 2800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        createTestApp(const ProductDetailScreen(productId: 'prod-001')),
      );
      await tester.pumpAndSettle();

      expect(find.text('Gir Cow Full Cream Milk'), findsWidgets);
      expect(find.text('Product Specifications'), findsOneWidget);
      expect(find.text('Purity Standards'), findsOneWidget);
      expect(find.text('Vedic Heritage & Provenance'), findsOneWidget);
      expect(find.text('Purity & Lab Guarantee'), findsOneWidget);
      expect(find.text('Bulk Dawn Drop'), findsOneWidget);

      // Bottom bar shows Update Basket since item is already in cart
      expect(find.textContaining('Update Basket'), findsOneWidget);
      expect(find.text('crates'), findsOneWidget);
    });
  });

  group('Cart Screen Widget Tests', () {
    testWidgets('Renders reserved fresh items, Non-GST Bill, and enforces Rule 4.4 Debt Block', (tester) async {
      tester.view.physicalSize = const Size(1080, 2800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(createTestApp(const CartScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Your Morning Basket'), findsOneWidget);
      expect(find.text('Bill Summary'), findsOneWidget);
      expect(find.text('Items Subtotal'), findsOneWidget);
      expect(find.text('Commercial Non-GST Bill (Rule 4.5)'), findsOneWidget);
      expect(find.text('Dawn Delivery Destination'), findsOneWidget);
      expect(find.text('100% A2 Tested'), findsOneWidget);
      expect(find.text('4°C Cold Chain'), findsOneWidget);
      // Enforces Rule 4.4: Active pending unpaid COD order restricts checkout
      expect(find.textContaining('Pending Debt Block'), findsOneWidget);
    });
  });

  group('Reorder Review Sheet & Quick Add Tests', () {
    testWidgets('Reorder review sheet displays past items with check controls', (tester) async {
      tester.view.physicalSize = const Size(1080, 2800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        createTestApp(
          Scaffold(
            body: ReorderReviewSheet(pastOrder: mockPastUsualOrder),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Review Past Order'), findsOneWidget);
      expect(find.text('YM-2026-8812'), findsOneWidget);
      expect(find.text("Tomorrow's Dawn Batch Sync"), findsOneWidget);
      expect(find.textContaining('Add available items to cart'), findsOneWidget);
    });

    testWidgets('Quick add sheet displays usual items and crate quick actions', (tester) async {
      tester.view.physicalSize = const Size(1080, 2800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        createTestApp(
          const Scaffold(
            body: QuickAddSheet(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Quick Add · Your Usual Items'), findsOneWidget);
      expect(find.text('Daily morning essentials & fast re-stock'), findsOneWidget);
      expect(find.text('VEDIC PURITY ASSURANCE'), findsOneWidget);
      expect(find.text('USUAL MORNING RE-STOCK'), findsOneWidget);
    });
  });
}
