/// Master constants for Yog Milk Retailer Application.
/// Strictly adheres to Master Planning Document v2.0 and AGENTS.md.
class AppConstants {
  AppConstants._();

  // Branding
  static const String appName = 'YOG MILK';
  static const String appTagline = 'Pure Dairy, Everyday Reliability';
  static const String regionCoverage =
      'Western India (Pune, Mumbai, Satara, Kolhapur)';

  // Support & Operations
  static const String supportPhone = '+91 98220 00000';
  static const String supportEmail = 'operations@yogmilk.com';
  static const String defaultTimeZone = 'Asia/Kolkata';

  // Currency
  static const String currencySymbol = '₹';

  // Ordering Schedule Defaults (Admin Configurable)
  // Window operates recurringly e.g. 07:00 to 17:00 IST
  static const int defaultOpenHour = 7;
  static const int defaultOpenMinute = 0;
  static const int defaultCloseHour = 17;
  static const int defaultCloseMinute = 0;

  // Dairy Logistics
  static const int standardPouchesPerCrate =
      12; // Standard dairy crate capacity
  static const int largePouchesPerCrate = 24;

  // Localization
  static const List<String> supportedLanguages = ['en', 'hi', 'mr'];
}
