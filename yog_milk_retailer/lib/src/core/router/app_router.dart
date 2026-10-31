import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/approval_pending_screen.dart';
import '../../features/auth/retailer_registration_screen.dart';
import '../../features/auth/welcome_screen.dart';
import '../../features/account/account_on_hold_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/catalog/catalog_screen.dart';
import '../../features/catalog/product_detail_screen.dart';
import '../../features/checkout/checkout_screen.dart';
import '../../features/checkout/payment_failed_screen.dart';
import '../../features/checkout/verifying_payment_screen.dart';
import '../../features/foundation_preview/foundation_preview_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/invoices/invoice_detail_screen.dart';
import '../../features/invoices/invoice_preview_screen.dart';
import '../../features/invoices/invoices_list_screen.dart';
import '../../features/notifications/notifications_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/orders/delivery_tracking_screen.dart';
import '../../features/orders/order_detail_screen.dart';
import '../../features/orders/order_success_screen.dart';
import '../../features/orders/orders_list_screen.dart';
import '../../features/payments/payment_history_screen.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/account/account_screen.dart';
import '../../features/account/address_management_screen.dart';
import '../../features/account/business_info_screen.dart';
import '../../features/purchases/purchases_screen.dart';

/// Master GoRouter navigation routing for Yog Milk Retailer App.
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: false,
    routes: [
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/welcome',
        name: 'welcome',
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/complete-profile',
        name: 'complete_profile',
        builder: (context, state) => const RetailerRegistrationScreen(),
      ),
      GoRoute(
        path: '/approval-pending',
        name: 'approval_pending',
        builder: (context, state) => const ApprovalPendingScreen(),
      ),
      GoRoute(
        path: '/account-on-hold',
        name: 'account_on_hold',
        builder: (context, state) => const AccountOnHoldScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/catalog',
        name: 'catalog',
        builder: (context, state) {
          final category = state.uri.queryParameters['category'];
          return CatalogScreen(initialCategorySlug: category);
        },
      ),
      GoRoute(
        path: '/catalog/:productId',
        name: 'product_detail',
        builder: (context, state) {
          final productId = state.pathParameters['productId'] ?? '';
          return ProductDetailScreen(productId: productId);
        },
      ),
      GoRoute(
        path: '/cart',
        name: 'cart',
        builder: (context, state) => const CartScreen(),
      ),
      GoRoute(
        path: '/checkout',
        name: 'checkout',
        builder: (context, state) => const CheckoutScreen(),
      ),
      GoRoute(
        path: '/checkout/verifying',
        name: 'verifying_payment',
        builder: (context, state) {
          final checkoutData = state.extra as Map<String, dynamic>?;
          return VerifyingPaymentScreen(checkoutData: checkoutData);
        },
      ),
      GoRoute(
        path: '/checkout/failed',
        name: 'payment_failed',
        builder: (context, state) => const PaymentFailedScreen(),
      ),
      GoRoute(
        path: '/orders',
        name: 'orders',
        builder: (context, state) => const OrdersListScreen(),
      ),
      GoRoute(
        path: '/orders/:orderId',
        name: 'order_detail',
        builder: (context, state) {
          final orderId = state.pathParameters['orderId'] ?? '';
          return OrderDetailScreen(orderId: orderId);
        },
      ),
      GoRoute(
        path: '/orders/:orderId/success',
        name: 'order_success',
        builder: (context, state) {
          final orderId = state.pathParameters['orderId'] ?? '';
          return OrderSuccessScreen(orderId: orderId);
        },
      ),
      GoRoute(
        path: '/orders/:orderId/tracking',
        name: 'delivery_tracking',
        builder: (context, state) {
          final orderId = state.pathParameters['orderId'] ?? '';
          return DeliveryTrackingScreen(orderId: orderId);
        },
      ),
      GoRoute(
        path: '/payments',
        name: 'payments',
        builder: (context, state) => const PaymentHistoryScreen(),
      ),
      GoRoute(
        path: '/invoices',
        name: 'invoices',
        builder: (context, state) => const InvoicesListScreen(),
      ),
      GoRoute(
        path: '/invoices/:invoiceId',
        name: 'invoice_detail',
        builder: (context, state) {
          final invoiceId = state.pathParameters['invoiceId'] ?? '';
          return InvoiceDetailScreen(invoiceId: invoiceId);
        },
      ),
      GoRoute(
        path: '/invoices/:invoiceId/preview',
        name: 'invoice_preview',
        builder: (context, state) {
          final invoiceId = state.pathParameters['invoiceId'] ?? '';
          return InvoicePreviewScreen(invoiceId: invoiceId);
        },
      ),
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/account',
        name: 'account',
        builder: (context, state) => const AccountScreen(),
      ),
      GoRoute(
        path: '/purchases',
        name: 'purchases',
        builder: (context, state) => const PurchasesScreen(),
      ),
      GoRoute(
        path: '/account/addresses',
        name: 'account_addresses',
        builder: (context, state) => const AddressManagementScreen(),
      ),
      GoRoute(
        path: '/account/business',
        name: 'account_business',
        builder: (context, state) => const BusinessInfoScreen(),
      ),
      GoRoute(
        path: '/components-showcase',
        name: 'components_showcase',
        builder: (context, state) => const FoundationPreviewScreen(),
      ),
    ],
  );
});
