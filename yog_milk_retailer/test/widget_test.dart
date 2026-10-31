import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yog_milk_retailer/src/features/auth/approval_pending_screen.dart';
import 'package:yog_milk_retailer/src/features/auth/welcome_screen.dart';
import 'package:yog_milk_retailer/src/features/home/home_screen.dart';
import 'package:yog_milk_retailer/src/features/onboarding/onboarding_screen.dart';
import 'package:yog_milk_retailer/src/features/splash/splash_screen.dart';

void main() {
  testWidgets('Splash screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: SplashScreen()),
      ),
    );

    expect(find.text('YOG MILK'), findsOneWidget);
    expect(find.text('Pure Dairy, Everyday Reliability'), findsOneWidget);
    expect(find.text('v2.0 • Maharashtra Dairy Network'), findsOneWidget);

    // Fast-forward pending bootstrap timer
    await tester.pump(const Duration(milliseconds: 1800));
  });

  testWidgets('Onboarding screen carousel smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: OnboardingScreen()),
      ),
    );

    expect(find.text('VEDIC PURITY'), findsOneWidget);
    expect(find.text('Pure Dairy Direct from Certified Farms'), findsOneWidget);
    expect(find.text('Continue'), findsOneWidget);
  });

  testWidgets('Welcome screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: WelcomeScreen()),
      ),
    );

    expect(find.text('Retailer Sign In'), findsOneWidget);
    expect(find.text('Send OTP'), findsOneWidget);
    expect(find.text('Sign In with Google (1-Tap Mock)'), findsOneWidget);
  });

  testWidgets('Approval pending screen smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: ApprovalPendingScreen()),
      ),
    );

    expect(find.text('Application Submitted'), findsOneWidget);
    expect(find.text('#APP-2026-7719'), findsOneWidget);
    expect(find.text('Explore Catalog (View Only)'), findsOneWidget);
  });

  testWidgets('Home screen all required sections smoke test', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 3200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: HomeScreen()),
      ),
    );

    await tester.pumpAndSettle();

    // 1. Retailer Greeting & Shop
    expect(find.text('Namaste, Ramesh Patil 🙏'), findsOneWidget);
    expect(find.text('Om Sai Dairy & Sweets'), findsOneWidget);

    // 2. Operational Gate Banner (Rule 4.1)
    expect(find.text('Ordering Window Open'), findsOneWidget);

    // 3. Pending Payment Restriction (Rule 4.4)
    expect(find.text('Pending Payment Restriction'), findsOneWidget);

    // 4. Order Usual
    expect(find.text('Order Usual (Reorder Last Basket)'), findsOneWidget);

    // 5. Product Categories
    expect(find.text('Product Categories'), findsOneWidget);

    // 6. Quick Add
    expect(find.text('Quick Add / Frequently Purchased'), findsOneWidget);

    // 7. Active Order
    expect(find.text('Active Order Status'), findsOneWidget);

    // 8. Commercial Invoices (Rule 4.5)
    expect(find.text('Recent Commercial Invoices (Non-GST)'), findsOneWidget);

    // 9. Notifications Feed
    expect(find.text('Recent Operational Notices'), findsOneWidget);
  });
}
