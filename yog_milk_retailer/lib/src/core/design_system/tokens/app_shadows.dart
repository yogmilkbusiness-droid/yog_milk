import 'package:flutter/material.dart';

/// Centralized elevation and shadow tokens matching the Stitch design system.
/// Soft, diffused navy/slate shadows that convey purity and depth.
class AppShadows {
  AppShadows._();

  static const List<BoxShadow> card = [
    BoxShadow(
      color: Color(0x0A051256),
      blurRadius: 10,
      offset: Offset(0, 2),
      spreadRadius: 0,
    ),
    BoxShadow(
      color: Color(0x05051256),
      blurRadius: 4,
      offset: Offset(0, 1),
      spreadRadius: 0,
    ),
  ];

  static const List<BoxShadow> elevated = [
    BoxShadow(
      color: Color(0x14051256),
      blurRadius: 16,
      offset: Offset(0, 4),
      spreadRadius: 0,
    ),
    BoxShadow(
      color: Color(0x0A051256),
      blurRadius: 8,
      offset: Offset(0, 2),
      spreadRadius: 0,
    ),
  ];

  static const List<BoxShadow> bottomBar = [
    BoxShadow(
      color: Color(0x0F051256),
      blurRadius: 12,
      offset: Offset(0, -3),
      spreadRadius: 0,
    ),
  ];
}
