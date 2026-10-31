import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'contracts/address_repository.dart';
import 'persistence/mock_storage_service.dart';
import 'seed/mock_addresses.dart';

class AddressNotifier extends StateNotifier<List<DeliveryAddressEntity>> {
  AddressNotifier() : super(mockInitialAddresses) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final saved = await MockStorageService.getAddresses();
    if (saved != null && saved.isNotEmpty) {
      state = saved;
    }
  }

  void addAddress(DeliveryAddressEntity address) {
    if (address.isDefault) {
      // Clear previous default
      state = [
        ...state.map((a) => a.copyWith(isDefault: false)),
        address,
      ];
    } else {
      state = [...state, address];
    }
    MockStorageService.saveAddresses(state);
  }

  void updateAddress(DeliveryAddressEntity updated) {
    state = state.map((a) {
      if (a.id == updated.id) {
        return updated;
      }
      if (updated.isDefault) {
        return a.copyWith(isDefault: false);
      }
      return a;
    }).toList();
    MockStorageService.saveAddresses(state);
  }

  void setDefault(String id) {
    state = state.map((a) {
      return a.copyWith(isDefault: a.id == id);
    }).toList();
    MockStorageService.saveAddresses(state);
  }

  void deleteAddress(String id) {
    final list = state.where((a) => a.id != id).toList();
    // If the deleted address was default and list is not empty, set first as default
    if (list.isNotEmpty && !list.any((a) => a.isDefault)) {
      list[0] = list[0].copyWith(isDefault: true);
    }
    state = list;
    MockStorageService.saveAddresses(state);
  }

  DeliveryAddressEntity? get defaultAddress {
    try {
      return state.firstWhere((a) => a.isDefault);
    } catch (_) {
      return state.isNotEmpty ? state.first : null;
    }
  }
}

final addressProvider =
    StateNotifierProvider<AddressNotifier, List<DeliveryAddressEntity>>((ref) {
  return AddressNotifier();
});
