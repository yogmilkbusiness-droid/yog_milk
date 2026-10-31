import 'dart:math';

/// Configuration for simulated network latency.
class MockLatencyConfig {
  static bool isEnabled = true;
  static int defaultMinMs = 250;
  static int defaultMaxMs = 500;

  static void disableForTesting() => isEnabled = false;
  static void enable() => isEnabled = true;
}

/// Simulates realistic network latency (default 250ms–500ms) during frontend mock phase.
Future<void> mockLatency({int? minMs, int? maxMs}) async {
  if (!MockLatencyConfig.isEnabled) return;
  final min = minMs ?? MockLatencyConfig.defaultMinMs;
  final max = maxMs ?? MockLatencyConfig.defaultMaxMs;
  final random = Random();
  final range = max > min ? max - min : 1;
  final delay = min + random.nextInt(range);
  await Future.delayed(Duration(milliseconds: delay));
}
