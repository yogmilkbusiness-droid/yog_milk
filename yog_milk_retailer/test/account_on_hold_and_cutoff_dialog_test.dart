import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:yog_milk_retailer/src/core/localization/app_localizations.dart';
import 'package:yog_milk_retailer/src/features/account/account_on_hold_screen.dart';
import 'package:yog_milk_retailer/src/features/checkout/widgets/mid_checkout_closed_dialog.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget buildTestableWidget(Widget child, {Locale locale = const Locale('en')}) {
    return ProviderScope(
      child: MaterialApp(
        locale: locale,
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: child,
      ),
    );
  }

  group('AccountOnHoldScreen Tests', () {
    testWidgets('renders account paused headline, customer ID, and support actions in English',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));
      await tester.pumpWidget(
        buildTestableWidget(const AccountOnHoldScreen()),
      );
      await tester.pumpAndSettle();

      // Heading and badges
      expect(find.text('Account On Hold'), findsOneWidget);
      expect(find.text('Account Temporarily Paused'), findsOneWidget);

      // Customer account ID chip
      expect(find.textContaining('YM-ACC-0942'), findsOneWidget);

      // Support actions
      expect(find.textContaining('WhatsApp'), findsOneWidget);
      expect(find.textContaining('Call Operations'), findsOneWidget);
      expect(find.textContaining('View Past Invoices'), findsOneWidget);
    });

    testWidgets('renders properly in Marathi localization', (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));
      await tester.pumpWidget(
        buildTestableWidget(const AccountOnHoldScreen(), locale: const Locale('mr')),
      );
      await tester.pumpAndSettle();

      expect(find.text('खाते तात्पुरते थांबवले आहे'), findsAtLeastNWidgets(1));
      expect(find.text('व्हॉट्सॲपवर संपर्क साधा'), findsOneWidget);
    });

    testWidgets('renders properly in Hindi localization', (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));
      await tester.pumpWidget(
        buildTestableWidget(const AccountOnHoldScreen(), locale: const Locale('hi')),
      );
      await tester.pumpAndSettle();

      expect(find.text('खाता अस्थायी रूप से रुका हुआ है'), findsOneWidget);
      expect(find.text('व्हाट्सएप पर सहायता संपर्क करें'), findsOneWidget);
    });
  });

  group('MidCheckoutClosedDialog Tests', () {
    testWidgets('renders dialog bottom sheet with items count and next opening in English',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));
      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: Builder(
              builder: (context) => Center(
                child: ElevatedButton(
                  onPressed: () {
                    MidCheckoutClosedDialog.show(
                      context,
                      savedItemsCount: 36,
                      nextOpeningDisplay: 'Tomorrow Dawn · 5:30 AM',
                    );
                  },
                  child: const Text('Open Dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      // Dialog content
      expect(find.textContaining("The ordering window is closed"), findsOneWidget);
      expect(find.textContaining('36 items'), findsOneWidget);
      expect(find.text('Tomorrow Dawn · 5:30 AM'), findsOneWidget);
      expect(find.text('View Saved Cart'), findsOneWidget);
      expect(find.text('Back to Home'), findsOneWidget);
    });

    testWidgets('renders dialog in Hindi localization', (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(450, 950));
      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: Builder(
              builder: (context) => Center(
                child: ElevatedButton(
                  onPressed: () {
                    MidCheckoutClosedDialog.show(
                      context,
                      savedItemsCount: 24,
                      nextOpeningDisplay: 'कल सुबह 5:30 बजे',
                    );
                  },
                  child: const Text('Open Dialog'),
                ),
              ),
            ),
          ),
          locale: const Locale('hi'),
        ),
      );

      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      expect(find.textContaining('ऑर्डरिंग विंडो बंद हो गई है'), findsOneWidget);
      expect(find.text('सुरक्षित कार्ट देखें'), findsOneWidget);
      expect(find.text('होम पर वापस जाएं'), findsOneWidget);
    });
  });
}
