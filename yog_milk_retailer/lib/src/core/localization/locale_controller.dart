import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../mock_engine/persistence/mock_storage_service.dart';

/// Riverpod controller managing current active locale (en, hi, mr).
class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(const Locale('en')) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final savedCode = await MockStorageService.getLocaleCode();
    if (savedCode != null && ['en', 'hi', 'mr'].contains(savedCode)) {
      state = Locale(savedCode);
    }
  }

  void setLocale(Locale newLocale) {
    if (['en', 'hi', 'mr'].contains(newLocale.languageCode)) {
      state = newLocale;
      MockStorageService.saveLocaleCode(newLocale.languageCode);
    }
  }

  void setLanguageCode(String code) {
    if (['en', 'hi', 'mr'].contains(code)) {
      state = Locale(code);
      MockStorageService.saveLocaleCode(code);
    }
  }

  bool isCurrent(String code) => state.languageCode == code;
}

final localeControllerProvider = StateNotifierProvider<LocaleNotifier, Locale>((
  ref,
) {
  return LocaleNotifier();
});
