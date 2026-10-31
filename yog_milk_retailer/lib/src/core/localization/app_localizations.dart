import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

/// Trilingual Localization implementation for YOG MILK Retailer Application.
/// Fully supports English (en), Hindi (hi), and regional Marathi (mr) dairy terms.
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(const Locale('en'));
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = [
    Locale('en'),
    Locale('hi'),
    Locale('mr'),
  ];

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_title': 'YOG MILK',
      'tagline': 'Pure Dairy Wholesale & Retailer Management',
      'language_name': 'English',
      'home': 'Home',
      'catalog': 'Catalog',
      'orders': 'Orders',
      'invoices': 'Invoices',
      'profile': 'Profile',
      'ordering_open': 'Ordering Window Open',
      'ordering_closed': 'Ordering Window Closed',
      'window_closed_message':
          'The ordering window is closed. We’ll notify you when ordering opens again.',
      'next_opening_at': 'Next opening at',
      'debt_block_title': 'Pending Payment Restriction',
      'debt_block_desc':
          'New orders are paused because of an unpaid balance on a previous order. Once settled, ordering resumes immediately.',
      'view_order': 'View Order',
      'order_usual': 'Order Usual',
      'quick_add': 'Quick Add',
      'add_to_cart': 'Add to Cart',
      'crate': 'Crate',
      'crates': 'Crates',
      'loose_pkts': 'loose pkts',
      'total': 'Total',
      'place_order': 'Place Order',
      'status_placed': 'Placed',
      'status_confirmed': 'Confirmed',
      'status_processing': 'Processing',
      'status_out_for_delivery': 'Out For Delivery',
      'status_delivered': 'Delivered',
      'status_cancelled': 'Cancelled',
      'status_pending': 'Pending',
      'status_paid': 'Paid',
      'cow_milk': 'Cow Milk',
      'buffalo_milk': 'Buffalo Milk',
      'curd_taak': 'Curd & Taak',
      'paneer_butter': 'Paneer & Butter',
      'artisanal_ghee': 'Artisanal Ghee',
      'cart': 'Cart',
      'your_basket': 'Your Morning Basket',
      'items_reserved': 'items batch-reserved',
      'items_subtotal': 'Items Subtotal',
      'dawn_delivery': 'Morning Dawn Delivery',
      'free': 'FREE',
      'packaging_coldchain': 'Packaging & Chilled Cold-Chain',
      'total_to_pay': 'Total to Pay',
      'checkout': 'Proceed to Checkout',
      'empty_cart_title': 'Your Morning Basket is Empty',
      'empty_cart_desc': 'Add fresh milk pouches, curd, and artisanal ghee for tomorrow dawn delivery.',
      'browse_catalog': 'Browse Dairy Catalog',
      'reorder_review_title': 'Review Past Order',
      'add_items_to_cart': 'Add available items to cart',
      'clear_cart': 'Clear Basket',
      'search_placeholder': 'Search milk, ghee, chaas, paneer...',
      'out_of_stock': 'Out of Stock',
      'purity_guarantee': 'Purity Guarantee',
      'non_gst_notice': 'Commercial Non-GST Farm Bill',
      'add_more_items': 'Add more items from Morning Dairy Shop',
      'delivery_destination': 'Dawn Delivery Destination',
      'account': 'Account',
      'account_settings': 'Account & Settings',
      'my_purchases': 'My Purchases',
      'purchases_analytics': 'Purchase Analytics',
      'monthly_purchases': 'Monthly Purchasing Overview',
      'top_staples': 'Farm Staples Basket',
      'settlement_ratio': 'Settlement Ratio',
      'weekly_spend_rhythm': 'Weekly Spend Rhythm',
      'orders_finance': 'Orders & Finance',
      'payments_ledger': 'Payments & Ledger',
      'delivery_addresses': 'Delivery Addresses & Drop Point',
      'business_info': 'Business & FSSAI Information',
      'preferences_settings': 'Preferences & Settings',
      'language_select': 'Language / भाषा / निवडा',
      'dawn_alerts': 'Dawn Delivery Notifications',
      'order_window_alert': 'Notify when ordering window opens (7:00 AM)',
      'care_governance': 'Care & Governance',
      'help_support': 'Help & Support',
      'about_yog_milk': 'About Yog Milk',
      'legal_policies': 'Legal & Purity Policies',
      'sign_out': 'Sign Out',
      'active_status': 'Active',
      'customer_id': 'Customer ID',
      'morning_drop': 'Morning 5:30 AM',
      'add_new_address': 'Add New Address',
      'edit_address': 'Edit Address',
      'set_as_default': 'Set as Default Drop Point',
      'address_title': 'Address Label (e.g. Main Booth)',
      'street_address': 'Street & Shop Number',
      'area_landmark': 'Area & Landmark',
      'pincode': 'Pincode',
      'contact_person': 'Contact Person',
      'contact_phone': 'Contact Phone',
      'save_address': 'Save Address',
      'fssai_lic_number': 'FSSAI License No.',
      'tax_exemption_title': 'Non-GST Agricultural Exemption',
      'tax_exemption_desc': 'Yog Milk provides 100% pure farm-fresh agricultural dairy produce, exempt from GST under Indian commercial provisions.',
      'account_on_hold_badge': 'Account On Hold',
      'account_paused_headline': 'Account Temporarily Paused',
      'account_paused_desc': 'A peaceful pause to ensure Vedic milk authenticity and uninterrupted doorstep drops.',
      'status_details': 'Status Details',
      'contact_whatsapp': 'Contact Support on WhatsApp',
      'call_operations': 'Call Operations Team (9 AM - 6 PM)',
      'view_past_invoices': 'View Past Invoices & History',
      'mid_checkout_closed_title': "The ordering window is closed. We'll notify you when ordering opens again.",
      'saved_cart_msg': 'We have saved your Morning Basket items.',
      'next_ordering_window': 'Next Ordering Window',
      'notify_when_opens': 'Notify me when ordering opens',
      'view_saved_cart': 'View Saved Cart',
      'back_to_home': 'Back to Home',
    },
    'hi': {
      'app_title': 'योग मिल्क',
      'tagline': 'शुद्ध डेयरी थोक एवं विक्रेता प्रबंधन',
      'language_name': 'हिंदी',
      'home': 'होम',
      'catalog': 'कैटलॉग',
      'orders': 'ऑर्डर',
      'invoices': 'बिल / इनवॉइस',
      'profile': 'प्रोफ़ाइल',
      'ordering_open': 'ऑर्डरिंग विंडो खुली है',
      'ordering_closed': 'ऑर्डरिंग विंडो बंद है',
      'window_closed_message':
          'ऑर्डर विंडो बंद है। जब ऑर्डर फिर से खुलेगा हम आपको सूचित करेंगे।',
      'next_opening_at': 'अगला समय',
      'debt_block_title': 'बकाया भुगतान प्रतिबंध',
      'debt_block_desc':
          'पिछले ऑर्डर का भुगतान लंबित होने के कारण नया ऑर्डर रुका हुआ है। भुगतान होते ही ऑर्डर शुरू हो जाएगा।',
      'view_order': 'ऑर्डर देखें',
      'order_usual': 'रोज़ का ऑर्डर',
      'quick_add': 'त्वरित जोड़ें',
      'add_to_cart': 'कार्ट में जोड़ें',
      'crate': 'क्रेट',
      'crates': 'क्रेट',
      'loose_pkts': 'खुले पैकेट',
      'total': 'कुल योग',
      'place_order': 'ऑर्डर दर्ज करें',
      'status_placed': 'दर्ज किया गया',
      'status_confirmed': 'स्वीकृत',
      'status_processing': 'तैयारी में',
      'status_out_for_delivery': 'वितरण हेतु रवाना',
      'status_delivered': 'पहुंचा दिया गया',
      'status_cancelled': 'रद्द किया गया',
      'status_pending': 'लंबित',
      'status_paid': 'भुगतान पूर्ण',
      'cow_milk': 'गाय का दूध',
      'buffalo_milk': 'भैंस का दूध',
      'curd_taak': 'दही और छाछ (ताक)',
      'paneer_butter': 'पनीर और मक्खन',
      'artisanal_ghee': 'शुद्ध देसी घी',
      'cart': 'कार्ट',
      'your_basket': 'आपकी सुबह की टोकरी',
      'items_reserved': 'आइटम आरक्षित',
      'items_subtotal': 'सामग्री उप-योग',
      'dawn_delivery': 'भोर की डिलीवरी',
      'free': 'मुफ्त',
      'packaging_coldchain': 'पैकेजिंग और कोल्ड-चेन',
      'total_to_pay': 'कुल देय राशि',
      'checkout': 'चेकआउट करें',
      'empty_cart_title': 'आपकी टोकरी खाली है',
      'empty_cart_desc': 'कल सुबह की ताजा डिलीवरी के लिए दूध के पाउच, दही और घी जोड़ें।',
      'browse_catalog': 'डेयरी कैटलॉग देखें',
      'reorder_review_title': 'पिछले ऑर्डर की समीक्षा',
      'add_items_to_cart': 'उपलब्ध आइटम कार्ट में जोड़ें',
      'clear_cart': 'टोकरी खाली करें',
      'search_placeholder': 'दूध, घी, छाछ, पनीर खोजें...',
      'out_of_stock': 'स्टॉक समाप्त',
      'purity_guarantee': 'शुद्धता की गारंटी',
      'non_gst_notice': 'व्यावसायिक गैर-जीएसटी कृषि बिल',
      'add_more_items': 'डेयरी शॉप से ​​और आइटम जोड़ें',
      'delivery_destination': 'डिलीवरी गंतव्य',
      'account': 'खाता',
      'account_settings': 'खाता और सेटिंग्स',
      'my_purchases': 'मेरी खरीदारी',
      'purchases_analytics': 'खरीद विश्लेषण',
      'monthly_purchases': 'मासिक खरीद समीक्षा',
      'top_staples': 'नियमित डेयरी बास्केट',
      'settlement_ratio': 'भुगतान निपटान अनुपात',
      'weekly_spend_rhythm': 'साप्ताहिक खर्च लय',
      'orders_finance': 'ऑर्डर और वित्त',
      'payments_ledger': 'भुगतान एवं बहीखाता',
      'delivery_addresses': 'वितरण पते एवं ड्रॉप पॉइंट',
      'business_info': 'व्यवसाय एवं FSSAI जानकारी',
      'preferences_settings': 'प्राथमिकताएं एवं सेटिंग्स',
      'language_select': 'भाषा / Language / निवडा',
      'dawn_alerts': 'भोर डिलीवरी सूचनाएं',
      'order_window_alert': 'ऑर्डर विंडो खुलने की सूचना (सुबह 7:00 बजे)',
      'care_governance': 'सहायता एवं नीतियां',
      'help_support': 'सहायता एवं संपर्क',
      'about_yog_milk': 'योग मिल्क के बारे में',
      'legal_policies': 'कानूनी एवं शुद्धता नीतियां',
      'sign_out': 'लॉग आउट',
      'active_status': 'सक्रिय',
      'customer_id': 'ग्राहक आईडी',
      'morning_drop': 'प्रातः 5:30 बजे',
      'add_new_address': 'नया पता जोड़ें',
      'edit_address': 'पता बदलें',
      'set_as_default': 'डिफ़ॉल्ट ड्रॉप पॉइंट बनाएं',
      'address_title': 'पता का नाम (उदा. मुख्य बूथ)',
      'street_address': 'दुकान संख्या एवं सड़क',
      'area_landmark': 'क्षेत्र एवं लैंडमार्क',
      'pincode': 'पिनकोड',
      'contact_person': 'संपर्क व्यक्ति',
      'contact_phone': 'मोबाइल नंबर',
      'save_address': 'पता सहेजें',
      'fssai_lic_number': 'FSSAI लाइसेंस नंबर',
      'tax_exemption_title': 'गैर-जीएसटी कृषि छूट',
      'tax_exemption_desc': 'योग मिल्क 100% शुद्ध ताज़ा कृषि डेयरी उत्पाद प्रदान करता है, जो भारतीय वाणिज्यिक प्रावधानों के तहत जीएसटी से मुक्त हैं।',
      'account_on_hold_badge': 'खाता रुका हुआ है',
      'account_paused_headline': 'खाता अस्थायी रूप से रुका हुआ है',
      'account_paused_desc': 'वैदिक दूध शुद्धता और निर्बाध प्रातः डिलीवरी सुनिश्चित करने के लिए एक शांतिपूर्ण विराम।',
      'status_details': 'स्थिति विवरण',
      'contact_whatsapp': 'व्हाट्सएप पर सहायता संपर्क करें',
      'call_operations': 'ऑपरेशन्स टीम को कॉल करें (सुबह 9 - शाम 6)',
      'view_past_invoices': 'मागील बिल एवं इतिहास देखें',
      'mid_checkout_closed_title': 'ऑर्डरिंग विंडो बंद हो गई है। जब यह दोबारा खुलेगी, हम आपको सूचित करेंगे।',
      'saved_cart_msg': 'हमने आपकी मॉर्निंग बास्केट की वस्तुओं को सुरक्षित रखा है।',
      'next_ordering_window': 'अगली ऑर्डरिंग विंडो',
      'notify_when_opens': 'खुलने पर मुझे सूचित करें',
      'view_saved_cart': 'सुरक्षित कार्ट देखें',
      'back_to_home': 'होम पर वापस जाएं',
    },
    'mr': {
      'app_title': 'योग मिल्क',
      'tagline': 'शुद्ध डेअरी घाऊक व किरकोळ विक्रेता व्यवस्थापन',
      'language_name': 'मराठी',
      'home': 'मुख्यपृष्ठ',
      'catalog': 'कॅटलॉग',
      'orders': 'ऑर्डर्स',
      'invoices': 'बिल / चलन',
      'profile': 'प्रोफाइल',
      'ordering_open': 'ऑर्डरिंग विंडो सुरू आहे',
      'ordering_closed': 'ऑर्डरिंग विंडो बंद आहे',
      'window_closed_message':
          'ऑर्डर विंडो बंद आहे. पुन्हा सुरू झाल्यावर आम्ही आपल्याला कळवू.',
      'next_opening_at': 'पुढील वेळ',
      'debt_block_title': 'थकबाकी पेमेंट निर्बंध',
      'debt_block_desc':
          'मागील ऑर्डरचे बिल प्रलंबित असल्याने नवीन ऑर्डर तात्पुरती थांबवली आहे. खात्यात रक्कम जमा होताच ऑर्डर सुरू होईल.',
      'view_order': 'ऑर्डर पहा',
      'order_usual': 'नेहमीची ऑर्डर',
      'quick_add': 'जलद जोडा',
      'add_to_cart': 'कार्टमध्ये जोडा',
      'crate': 'क्रेट',
      'crates': 'क्रेट्स',
      'loose_pkts': 'सुटे पाकीट',
      'total': 'एकूण',
      'place_order': 'ऑर्डर नोंदवा',
      'status_placed': 'नोंदवली',
      'status_confirmed': 'निश्चित',
      'status_processing': 'प्रक्रियेत',
      'status_out_for_delivery': 'डिलिव्हरीसाठी निघाली',
      'status_delivered': 'वितरित झाली',
      'status_cancelled': 'रद्द केली',
      'status_pending': 'प्रलंबित',
      'status_paid': 'पूर्ण भरले',
      'cow_milk': 'गाईचे दूध',
      'buffalo_milk': 'म्हशीचे दूध',
      'curd_taak': 'दही आणि ताक',
      'paneer_butter': 'पनीर आणि लोणी',
      'artisanal_ghee': 'शुद्ध साजूक तूप',
      'cart': 'कार्ट',
      'your_basket': 'तुमची सकाळची बास्केट',
      'items_reserved': 'वस्तू आरक्षित',
      'items_subtotal': 'वस्तूंची बेरीज',
      'dawn_delivery': 'पहाटेची डिलिव्हरी',
      'free': 'मोफत',
      'packaging_coldchain': 'पॅकेजिंग आणि कोल्ड-चेन',
      'total_to_pay': 'एकूण देय रक्कम',
      'checkout': 'ऑर्डर पुढे करा',
      'empty_cart_title': 'तुमची बास्केट रिकामी आहे',
      'empty_cart_desc': 'उद्याच्या पहाटेच्या डिलिव्हरीसाठी दुधाचे पाकीट, दही आणि तूप जोडा.',
      'browse_catalog': 'डेअरी कॅटलॉग पहा',
      'reorder_review_title': 'मागील ऑर्डर तपासा',
      'add_items_to_cart': 'उपलब्ध वस्तू कार्टमध्ये जोडा',
      'clear_cart': 'बास्केट रिकामी करा',
      'search_placeholder': 'दूध, तूप, ताक, पनीर शोधा...',
      'out_of_stock': 'साठा संपला',
      'purity_guarantee': 'शुद्धतेची खात्री',
      'non_gst_notice': 'व्यावसायिक विना-जीएसटी शेती बिल',
      'add_more_items': 'डेअरी शॉपमधून आणखी वस्तू जोडा',
      'delivery_destination': 'डिलिव्हरी पत्ता',
      'account': 'खाते',
      'account_settings': 'खाते आणि सेटिंग्ज',
      'my_purchases': 'माझी खरेदी',
      'purchases_analytics': 'खरेदी विश्लेषण',
      'monthly_purchases': 'मासिक खरेदी आढावा',
      'top_staples': 'नियमित डेअरी बास्केट',
      'settlement_ratio': 'पेमेंट सेटलमेंट प्रमाण',
      'weekly_spend_rhythm': 'साप्ताहिक खर्च लय',
      'orders_finance': 'ऑर्डर्स आणि वित्त',
      'payments_ledger': 'पेमेंट आणि लेजर',
      'delivery_addresses': 'डिलिव्हरी पत्ते आणि ड्रॉप पॉईंट',
      'business_info': 'व्यवसाय आणि FSSAI माहिती',
      'preferences_settings': 'प्राधान्ये आणि सेटिंग्ज',
      'language_select': 'भाषा / Language / निवडा',
      'dawn_alerts': 'पहाटेची डिलिव्हरी सूचना',
      'order_window_alert': 'ऑर्डर खिडकी उघडण्याची सूचना (सकाळी ७:००)',
      'care_governance': 'मदत आणि धोरणे',
      'help_support': 'मदत आणि ग्राहक सेवा',
      'about_yog_milk': 'योग मिल्क विषयी',
      'legal_policies': 'कायदेशीर आणि शुद्धता नियम',
      'sign_out': 'साइन आउट',
      'active_status': 'सक्रिय',
      'customer_id': 'ग्राहक आयडी',
      'morning_drop': 'पहाटे ५:३० वाजता',
      'add_new_address': 'नवीन पत्ता जोडा',
      'edit_address': 'पत्ता बदला',
      'set_as_default': 'प्राथमिक ड्रॉप पॉईंट करा',
      'address_title': 'पत्याचे नाव (उदा. मुख्य बूथ)',
      'street_address': 'दुकान क्रमांक आणि रस्ता',
      'area_landmark': 'परिसर आणि लँडमार्क',
      'pincode': 'पिनकोड',
      'contact_person': 'संपर्क व्यक्ती',
      'contact_phone': 'मोबाईल नंबर',
      'save_address': 'पत्ता जतन करा',
      'fssai_lic_number': 'FSSAI परवाना क्र.',
      'tax_exemption_title': 'विना-जीएसटी शेती उत्पादन सूट',
      'tax_exemption_desc': 'योग मिल्क १००% शुद्ध शेतातील ताजी कृषी डेअरी उत्पादने पुरवते, ज्यावर भारतीय कर कायद्यानुसार जीएसटी आकारला जात नाही.',
      'account_on_hold_badge': 'खाते तात्पुरते थांबवले आहे',
      'account_paused_headline': 'खाते तात्पुरते थांबवले आहे',
      'account_paused_desc': 'वैदिक दुधाची शुद्धता आणि अखंड सकाळची डिलिव्हरी सुनिश्चित करण्यासाठी तात्पुरती स्थगिती.',
      'status_details': 'सद्यस्थिती तपशील',
      'contact_whatsapp': 'व्हॉट्सॲपवर संपर्क साधा',
      'call_operations': 'ऑपरेशन्स टीमशी संपर्क साधा (सकाळी ९ ते संध्याकाळी ६)',
      'view_past_invoices': 'मागील बिले आणि इतिहास पहा',
      'mid_checkout_closed_title': 'ऑर्डरिंग विंडो बंद झाली आहे. ती पुन्हा उघडल्यावर आम्ही आपल्याला कळवू.',
      'saved_cart_msg': 'आम्ही तुमच्या सकाळच्या बास्केटमधील वस्तू सुरक्षित ठेवल्या आहेत.',
      'next_ordering_window': 'पुढील ऑर्डर खिडकी',
      'notify_when_opens': 'सुरू झाल्यावर मला कळवा',
      'view_saved_cart': 'जतन केलेली बास्केट पहा',
      'back_to_home': 'मुख्यपृष्ठावर परत जा',
    },
  };

  String translate(String key) {
    final langCode = locale.languageCode;
    return _localizedValues[langCode]?[key] ??
        _localizedValues['en']?[key] ??
        key;
  }

  // Getters for frequently used strings
  String get appTitle => translate('app_title');
  String get tagline => translate('tagline');
  String get home => translate('home');
  String get catalog => translate('catalog');
  String get orders => translate('orders');
  String get invoices => translate('invoices');
  String get profile => translate('profile');
  String get orderingOpen => translate('ordering_open');
  String get orderingClosed => translate('ordering_closed');
  String get windowClosedMessage => translate('window_closed_message');
  String get nextOpeningAt => translate('next_opening_at');
  String get debtBlockTitle => translate('debt_block_title');
  String get debtBlockDesc => translate('debt_block_desc');
  String get viewOrder => translate('view_order');
  String get orderUsual => translate('order_usual');
  String get quickAdd => translate('quick_add');
  String get addToCart => translate('add_to_cart');
  String get crate => translate('crate');
  String get crates => translate('crates');
  String get loosePkts => translate('loose_pkts');
  String get total => translate('total');
  String get placeOrder => translate('place_order');
  String get cowMilk => translate('cow_milk');
  String get buffaloMilk => translate('buffalo_milk');
  String get curdTaak => translate('curd_taak');
  String get paneerButter => translate('paneer_butter');
  String get artisanalGhee => translate('artisanal_ghee');
  String get cart => translate('cart');
  String get yourBasket => translate('your_basket');
  String get itemsReserved => translate('items_reserved');
  String get itemsSubtotal => translate('items_subtotal');
  String get dawnDelivery => translate('dawn_delivery');
  String get account => translate('account');
  String get accountSettings => translate('account_settings');
  String get myPurchases => translate('my_purchases');
  String get purchasesAnalytics => translate('purchases_analytics');
  String get monthlyPurchases => translate('monthly_purchases');
  String get topStaples => translate('top_staples');
  String get settlementRatio => translate('settlement_ratio');
  String get weeklySpendRhythm => translate('weekly_spend_rhythm');
  String get ordersFinance => translate('orders_finance');
  String get paymentsLedger => translate('payments_ledger');
  String get deliveryAddresses => translate('delivery_addresses');
  String get businessInfo => translate('business_info');
  String get preferencesSettings => translate('preferences_settings');
  String get languageSelect => translate('language_select');
  String get dawnAlerts => translate('dawn_alerts');
  String get orderWindowAlert => translate('order_window_alert');
  String get careGovernance => translate('care_governance');
  String get helpSupport => translate('help_support');
  String get aboutYogMilk => translate('about_yog_milk');
  String get legalPolicies => translate('legal_policies');
  String get signOut => translate('sign_out');
  String get activeStatus => translate('active_status');
  String get customerId => translate('customer_id');
  String get morningDrop => translate('morning_drop');
  String get addNewAddress => translate('add_new_address');
  String get editAddress => translate('edit_address');
  String get setAsDefault => translate('set_as_default');
  String get addressTitle => translate('address_title');
  String get streetAddress => translate('street_address');
  String get areaLandmark => translate('area_landmark');
  String get pincode => translate('pincode');
  String get contactPerson => translate('contact_person');
  String get contactPhone => translate('contact_phone');
  String get saveAddress => translate('save_address');
  String get fssaiLicNumber => translate('fssai_lic_number');
  String get taxExemptionTitle => translate('tax_exemption_title');
  String get taxExemptionDesc => translate('tax_exemption_desc');
  String get free => translate('free');
  String get packagingColdChain => translate('packaging_coldchain');
  String get totalToPay => translate('total_to_pay');
  String get checkout => translate('checkout');
  String get emptyCartTitle => translate('empty_cart_title');
  String get emptyCartDesc => translate('empty_cart_desc');
  String get browseCatalog => translate('browse_catalog');
  String get reorderReviewTitle => translate('reorder_review_title');
  String get addItemsToCart => translate('add_items_to_cart');
  String get clearCart => translate('clear_cart');
  String get searchPlaceholder => translate('search_placeholder');
  String get outOfStock => translate('out_of_stock');
  String get purityGuarantee => translate('purity_guarantee');
  String get nonGstNotice => translate('non_gst_notice');
  String get addMoreItems => translate('add_more_items');
  String get deliveryDestination => translate('delivery_destination');
  String get accountOnHoldBadge => translate('account_on_hold_badge');
  String get accountPausedHeadline => translate('account_paused_headline');
  String get accountPausedDesc => translate('account_paused_desc');
  String get statusDetails => translate('status_details');
  String get contactWhatsapp => translate('contact_whatsapp');
  String get callOperations => translate('call_operations');
  String get viewPastInvoices => translate('view_past_invoices');
  String get midCheckoutClosedTitle => translate('mid_checkout_closed_title');
  String get savedCartMsg => translate('saved_cart_msg');
  String get nextOrderingWindow => translate('next_ordering_window');
  String get notifyWhenOpens => translate('notify_when_opens');
  String get viewSavedCart => translate('view_saved_cart');
  String get backToHome => translate('back_to_home');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      ['en', 'hi', 'mr'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
