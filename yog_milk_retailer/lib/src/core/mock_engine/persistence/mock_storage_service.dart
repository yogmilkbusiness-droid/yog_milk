import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../contracts/address_repository.dart';
import '../contracts/order_repository.dart';
import '../cart_controller.dart';

/// Centralized local storage service using SharedPreferences for the mock-data frontend.
/// Persists cart items, active profile, addresses, language, and created orders
/// so that prototype state survives application restarts.
class MockStorageService {
  static const String _keyLocale = 'yog_pref_locale';
  static const String _keyCart = 'yog_pref_cart';
  static const String _keyRetailerId = 'yog_pref_active_retailer_id';
  static const String _keyAddresses = 'yog_pref_addresses';
  static const String _keyOrders = 'yog_pref_orders';

  static SharedPreferences? _prefs;

  /// Ensure SharedPreferences is loaded safely
  static Future<SharedPreferences?> _getPrefs() async {
    if (_prefs != null) return _prefs;
    try {
      _prefs = await SharedPreferences.getInstance();
      return _prefs;
    } catch (_) {
      // In test environments or uninitialized bindings, return null gracefully
      return null;
    }
  }

  // ==========================================
  // LOCALE PERSISTENCE
  // ==========================================
  static Future<void> saveLocaleCode(String code) async {
    final prefs = await _getPrefs();
    await prefs?.setString(_keyLocale, code);
  }

  static Future<String?> getLocaleCode() async {
    final prefs = await _getPrefs();
    return prefs?.getString(_keyLocale);
  }

  // ==========================================
  // CART PERSISTENCE
  // ==========================================
  static Future<void> saveCart(List<CartItemEntity> items) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;

    final jsonList = items.map((item) {
      return {
        'productId': item.productId,
        'productName': item.productName,
        'packSize': item.packSize,
        'unitsPerCrate': item.unitsPerCrate,
        'unitPrice': item.unitPrice,
        'quantity': item.quantity,
        'imageUrl': item.imageUrl,
        'fatPercentage': item.fatPercentage,
        'snfPercentage': item.snfPercentage,
      };
    }).toList();

    await prefs.setString(_keyCart, jsonEncode(jsonList));
  }

  static Future<List<CartItemEntity>?> getCart() async {
    final prefs = await _getPrefs();
    final raw = prefs?.getString(_keyCart);
    if (raw == null || raw.isEmpty) return null;

    try {
      final List decoded = jsonDecode(raw);
      return decoded.map((map) {
        return CartItemEntity(
          productId: map['productId'] as String,
          productName: map['productName'] as String,
          packSize: map['packSize'] as String,
          unitsPerCrate: (map['unitsPerCrate'] as num?)?.toInt() ?? 12,
          unitPrice: (map['unitPrice'] as num?)?.toDouble() ?? 0.0,
          quantity: (map['quantity'] as num?)?.toInt() ?? 0,
          imageUrl: map['imageUrl'] as String?,
          fatPercentage: (map['fatPercentage'] as num?)?.toDouble(),
          snfPercentage: (map['snfPercentage'] as num?)?.toDouble(),
        );
      }).toList();
    } catch (_) {
      return null;
    }
  }

  // ==========================================
  // ACTIVE RETAILER ID PERSISTENCE
  // ==========================================
  static Future<void> saveActiveRetailerId(String id) async {
    final prefs = await _getPrefs();
    await prefs?.setString(_keyRetailerId, id);
  }

  static Future<String?> getActiveRetailerId() async {
    final prefs = await _getPrefs();
    return prefs?.getString(_keyRetailerId);
  }

  // ==========================================
  // ADDRESSES PERSISTENCE
  // ==========================================
  static Future<void> saveAddresses(List<DeliveryAddressEntity> addresses) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;

    final jsonList = addresses.map((a) {
      return {
        'id': a.id,
        'title': a.title,
        'businessName': a.businessName,
        'street': a.street,
        'area': a.area,
        'city': a.city,
        'pincode': a.pincode,
        'dropInstructions': a.dropInstructions,
        'isDefault': a.isDefault,
        'contactPerson': a.contactPerson,
        'contactPhone': a.contactPhone,
      };
    }).toList();

    await prefs.setString(_keyAddresses, jsonEncode(jsonList));
  }

  static Future<List<DeliveryAddressEntity>?> getAddresses() async {
    final prefs = await _getPrefs();
    final raw = prefs?.getString(_keyAddresses);
    if (raw == null || raw.isEmpty) return null;

    try {
      final List decoded = jsonDecode(raw);
      return decoded.map((m) {
        return DeliveryAddressEntity(
          id: m['id'] as String,
          title: m['title'] as String,
          businessName: m['businessName'] as String,
          street: m['street'] as String,
          area: m['area'] as String,
          city: m['city'] as String,
          pincode: m['pincode'] as String,
          dropInstructions: m['dropInstructions'] as String? ?? 'Drop crates inside chilled rack before 5:30 AM',
          isDefault: m['isDefault'] as bool? ?? false,
          contactPerson: m['contactPerson'] as String? ?? '',
          contactPhone: m['contactPhone'] as String? ?? '',
        );
      }).toList();
    } catch (_) {
      return null;
    }
  }

  // ==========================================
  // ORDERS PERSISTENCE
  // ==========================================
  static Future<void> saveOrders(List<OrderEntity> orders) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;

    final jsonList = orders.map((o) {
      return {
        'id': o.id,
        'orderCode': o.orderCode,
        'orderDate': o.orderDate.toIso8601String(),
        'orderStatus': o.orderStatus.name,
        'paymentStatus': o.paymentStatus.name,
        'deliveryStatus': o.deliveryStatus.name,
        'paymentMethod': o.paymentMethod,
        'items': o.items.map((i) => {
          'productId': i.productId,
          'productName': i.productName,
          'packSize': i.packSize,
          'quantity': i.quantity,
          'crateCount': i.crateCount,
          'unitPrice': i.unitPrice,
          'lineTotal': i.lineTotal,
        }).toList(),
        'subtotal': o.subtotal,
        'deliveryCharge': o.deliveryCharge,
        'totalPayable': o.totalPayable,
        'deliveryAddress': o.deliveryAddress,
        'deliveryReference': o.deliveryReference,
        'specialInstructions': o.specialInstructions,
        'invoiceNumber': o.invoiceNumber,
        'statusHistory': o.statusHistory.map((h) => {
          'timestamp': h.timestamp.toIso8601String(),
          'title': h.title,
          'description': h.description,
          'isCompleted': h.isCompleted,
        }).toList(),
        'deliveryHistory': o.deliveryHistory.map((dh) => {
          'timestamp': dh.timestamp.toIso8601String(),
          'status': dh.status.name,
          'title': dh.title,
          'description': dh.description,
          'note': dh.note,
          'isCompleted': dh.isCompleted,
        }).toList(),
      };
    }).toList();

    await prefs.setString(_keyOrders, jsonEncode(jsonList));
  }

  static Future<List<OrderEntity>?> getOrders() async {
    final prefs = await _getPrefs();
    final raw = prefs?.getString(_keyOrders);
    if (raw == null || raw.isEmpty) return null;

    try {
      final List decoded = jsonDecode(raw);
      return decoded.map((m) {
        final itemsList = (m['items'] as List? ?? []).map((i) {
          return OrderItemEntity(
            productId: i['productId'] as String,
            productName: i['productName'] as String,
            packSize: i['packSize'] as String,
            quantity: (i['quantity'] as num).toInt(),
            crateCount: (i['crateCount'] as num).toInt(),
            unitPrice: (i['unitPrice'] as num).toDouble(),
            lineTotal: (i['lineTotal'] as num).toDouble(),
          );
        }).toList();

        final statusHistoryList = (m['statusHistory'] as List? ?? []).map((h) {
          return OrderStatusHistoryEntry(
            timestamp: DateTime.tryParse(h['timestamp'] as String) ?? DateTime.now(),
            title: h['title'] as String,
            description: h['description'] as String,
            isCompleted: h['isCompleted'] as bool? ?? true,
          );
        }).toList();

        final deliveryHistoryList = (m['deliveryHistory'] as List? ?? []).map((dh) {
          final statusName = dh['status'] as String? ?? 'notAssigned';
          final statusEnum = DeliveryLifecycleStatus.values.firstWhere(
            (e) => e.name == statusName,
            orElse: () => DeliveryLifecycleStatus.notAssigned,
          );
          return DeliveryStatusHistoryEntry(
            timestamp: DateTime.tryParse(dh['timestamp'] as String) ?? DateTime.now(),
            status: statusEnum,
            title: dh['title'] as String,
            description: dh['description'] as String,
            note: dh['note'] as String?,
            isCompleted: dh['isCompleted'] as bool? ?? true,
          );
        }).toList();

        final orderStatusName = m['orderStatus'] as String? ?? 'placed';
        final orderStatusEnum = OrderLifecycleStatus.values.firstWhere(
          (e) => e.name == orderStatusName,
          orElse: () => OrderLifecycleStatus.placed,
        );

        final paymentStatusName = m['paymentStatus'] as String? ?? 'pending';
        final paymentStatusEnum = PaymentLifecycleStatus.values.firstWhere(
          (e) => e.name == paymentStatusName,
          orElse: () => PaymentLifecycleStatus.pending,
        );

        final deliveryStatusName = m['deliveryStatus'] as String? ?? 'notAssigned';
        final deliveryStatusEnum = DeliveryLifecycleStatus.values.firstWhere(
          (e) => e.name == deliveryStatusName,
          orElse: () => DeliveryLifecycleStatus.notAssigned,
        );

        return OrderEntity(
          id: m['id'] as String,
          orderCode: m['orderCode'] as String,
          orderDate: DateTime.tryParse(m['orderDate'] as String) ?? DateTime.now(),
          orderStatus: orderStatusEnum,
          paymentStatus: paymentStatusEnum,
          deliveryStatus: deliveryStatusEnum,
          paymentMethod: m['paymentMethod'] as String,
          items: itemsList,
          subtotal: (m['subtotal'] as num).toDouble(),
          deliveryCharge: (m['deliveryCharge'] as num).toDouble(),
          totalPayable: (m['totalPayable'] as num).toDouble(),
          deliveryAddress: m['deliveryAddress'] as String,
          deliveryReference: m['deliveryReference'] as String,
          specialInstructions: m['specialInstructions'] as String?,
          invoiceNumber: m['invoiceNumber'] as String?,
          statusHistory: statusHistoryList,
          deliveryHistory: deliveryHistoryList,
        );
      }).toList();
    } catch (_) {
      return null;
    }
  }

  /// Clears all local storage keys (resets to initial mock baseline)
  static Future<void> clearAll() async {
    final prefs = await _getPrefs();
    await prefs?.remove(_keyLocale);
    await prefs?.remove(_keyCart);
    await prefs?.remove(_keyRetailerId);
    await prefs?.remove(_keyAddresses);
    await prefs?.remove(_keyOrders);
  }
}

