import 'package:flutter/material.dart';

/// Centralized color tokens for YOG MILK extracted from Stitch design assets.
/// Source of Truth: sacred_dairy_vedic_wellness/DESIGN.md & Master Plan v2.0.
class AppColors {
  AppColors._();

  // Primary Brand Identity - Deep Royal Navy
  static const Color primary = Color(0xFF051256);
  static const Color primaryContainer = Color(0xFF1F2A6B);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onPrimaryContainer = Color(0xFF8994DB);

  // Secondary Accent - Warm Terracotta & Saffron Amber
  static const Color secondary = Color(0xFF994700);
  static const Color secondaryContainer = Color(0xFFFC8127);
  static const Color secondaryLight = Color(0xFFFFDBC8);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color onSecondaryContainer = Color(0xFFFFDBC8);

  // Surface & Vedic Dairy Backgrounds
  static const Color background = Color(0xFFFAF8FF); // Clean Milk Cream
  static const Color surfaceVedic = Color(0xFFFCF9F3); // Warm Vedic Cream
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFF2F3FF);
  static const Color surfaceContainerHigh = Color(0xFFE3E7FE);

  // Typography & Content Colors
  static const Color textPrimary = Color(0xFF1A1C20);
  static const Color textSecondary = Color(0xFF5E6272);
  static const Color textMuted = Color(0xFF8E92A4);
  static const Color onSurface = Color(0xFF1A1C20);

  // Borders & Dividers
  static const Color borderSubtle = Color(0xFFDDE1F8);
  static const Color borderOutline = Color(0xFFC6C5D2);
  static const Color divider = Color(0xFFE8EAED);

  // Semantic Status Colors
  // Success (Delivered, Paid, Operational Open)
  static const Color statusSuccess = Color(0xFF15803D);
  static const Color statusSuccessContainer = Color(0xFFDCFCE7);
  static const Color onStatusSuccess = Color(0xFF14532D);

  // Warning / Pending (Pending Payment, Placed, Processing)
  static const Color statusWarning = Color(0xFFB45309);
  static const Color statusWarningContainer = Color(0xFFFEF3C7);
  static const Color onStatusWarning = Color(0xFF78350F);

  // Error / Blocked / Cancelled (Ordering Closed, Debt Block, Failed)
  static const Color statusError = Color(0xFFB91C1C);
  static const Color statusErrorContainer = Color(0xFFFEE2E2);
  static const Color onStatusError = Color(0xFF7F1D1D);

  // Info / Transit (Out for delivery, Assigned)
  static const Color statusInfo = Color(0xFF1D4ED8);
  static const Color statusInfoContainer = Color(0xFFDBEAFE);
  static const Color onStatusInfo = Color(0xFF1E3A8A);

  // Neutral / Draft
  static const Color statusNeutral = Color(0xFF4B5563);
  static const Color statusNeutralContainer = Color(0xFFF3F4F6);
  static const Color onStatusNeutral = Color(0xFF1F2937);

  // Aliases for Stitch M3 color names
  static const Color primaryNavy = primary;
  static const Color primaryContainerNavy = primaryContainer;
  static const Color secondaryContainerAmber = secondaryContainer;
  static const Color backgroundMilk = background;
  static const Color outline = textMuted;
  static const Color outlineVariant = borderOutline;
  static const Color onSurfaceVariant = textSecondary;
  static const Color error = statusError;
  static const Color errorContainer = statusErrorContainer;
}
