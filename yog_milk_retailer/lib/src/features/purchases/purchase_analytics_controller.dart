import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import '../../core/mock_engine/order_controller.dart';
import '../../core/mock_engine/payment_controller.dart';

/// Monthly overview stats calculated from active mock orders
class MonthlyPurchasingOverview {
  final String period; // e.g. "Oct 2026"
  final double totalSpend;
  final int totalDrops;
  final double avgDrop;
  final String growthNote; // e.g. "+8%"

  const MonthlyPurchasingOverview({
    required this.period,
    required this.totalSpend,
    required this.totalDrops,
    required this.avgDrop,
    required this.growthNote,
  });
}

/// Settlement ratio & payment summary (Strictly decoupled, ZERO credit)
class SettlementHealthSummary {
  final double clearedAmount;
  final double pendingCodAmount;
  final int pendingOrdersCount;
  final double clearedPercent;
  final double pendingPercent;

  const SettlementHealthSummary({
    required this.clearedAmount,
    required this.pendingCodAmount,
    required this.pendingOrdersCount,
    required this.clearedPercent,
    required this.pendingPercent,
  });
}

/// Weekly spend point for spend rhythm visual chart
class WeeklySpendPoint {
  final String label; // "W1", "W2", "W3", "W4 (Now)"
  final double amount;
  final double ratio; // 0.0 to 1.0
  final bool isCurrent;

  const WeeklySpendPoint({
    required this.label,
    required this.amount,
    required this.ratio,
    required this.isCurrent,
  });
}

/// Product-wise purchase history and top staples
class ProductPurchaseStat {
  final String productId;
  final String productName;
  final String packSize;
  final int totalQuantity;
  final String unit;
  final double totalSpend;
  final double basketPercent;
  final String emoji;
  final String frequencyNote;

  const ProductPurchaseStat({
    required this.productId,
    required this.productName,
    required this.packSize,
    required this.totalQuantity,
    required this.unit,
    required this.totalSpend,
    required this.basketPercent,
    required this.emoji,
    required this.frequencyNote,
  });
}

/// Aggregated order statistics
class OrderStatisticsSummary {
  final int total;
  final int active;
  final int delivered;
  final int cancelled;

  const OrderStatisticsSummary({
    required this.total,
    required this.active,
    required this.delivered,
    required this.cancelled,
  });
}

/// Master Retailer Purchase Analytics State Model
class PurchaseAnalyticsState {
  final MonthlyPurchasingOverview monthlyOverview;
  final SettlementHealthSummary settlementSummary;
  final List<WeeklySpendPoint> weeklySpend;
  final List<ProductPurchaseStat> topStaples;
  final OrderStatisticsSummary orderStats;
  final List<OrderEntity> recentDrops;

  const PurchaseAnalyticsState({
    required this.monthlyOverview,
    required this.settlementSummary,
    required this.weeklySpend,
    required this.topStaples,
    required this.orderStats,
    required this.recentDrops,
  });
}

/// Reactive provider computing analytics from Riverpod orders & payments
final purchaseAnalyticsProvider = Provider<PurchaseAnalyticsState>((ref) {
  final orders = ref.watch(ordersProvider);
  final payments = ref.watch(paymentsProvider);

  // 1. Filter valid non-cancelled orders for spend calculations
  final validOrders = orders
      .where((o) => o.orderStatus != OrderLifecycleStatus.cancelled)
      .toList();

  final totalSpend = validOrders.fold<double>(
    0.0,
    (sum, o) => sum + o.totalPayable,
  );
  final totalDrops = validOrders.length;
  final avgDrop = totalDrops > 0 ? (totalSpend / totalDrops) : 0.0;

  final monthlyOverview = MonthlyPurchasingOverview(
    period: 'Oct 2026',
    totalSpend: totalSpend,
    totalDrops: totalDrops,
    avgDrop: avgDrop,
    growthNote: '+8% vs Sept',
  );

  // 2. Settlement Health / Payment Summary (Decoupled, strictly NO credit)
  final clearedAmount = payments
      .where((p) => p.isSettled)
      .fold<double>(0.0, (sum, p) => sum + p.amount);

  final pendingCodAmount = payments
      .where((p) => p.isPending)
      .fold<double>(0.0, (sum, p) => sum + p.amountDue);

  final totalTrackedPayments = clearedAmount + pendingCodAmount;
  final clearedPercent = totalTrackedPayments > 0
      ? (clearedAmount / totalTrackedPayments)
      : 1.0;
  final pendingPercent = totalTrackedPayments > 0
      ? (pendingCodAmount / totalTrackedPayments)
      : 0.0;

  final pendingCount = orders
      .where((o) => o.paymentStatus == PaymentLifecycleStatus.pending)
      .length;

  final settlementSummary = SettlementHealthSummary(
    clearedAmount: clearedAmount,
    pendingCodAmount: pendingCodAmount,
    pendingOrdersCount: pendingCount,
    clearedPercent: clearedPercent,
    pendingPercent: pendingPercent,
  );

  // 3. Weekly Spend Rhythm (4-week breakdown)
  // Derive dynamically or distribute based on order timestamps
  double w1 = 0.0;
  double w2 = 0.0;
  double w3 = 0.0;
  double w4 = 0.0;

  for (final order in validOrders) {
    final day = order.orderDate.day;
    if (day <= 7) {
      w1 += order.totalPayable;
    } else if (day <= 14) {
      w2 += order.totalPayable;
    } else if (day <= 21) {
      w3 += order.totalPayable;
    } else {
      w4 += order.totalPayable;
    }
  }

  // Provide realistic default distribution if single date range
  if (w1 == 0 && w2 == 0 && w3 == 0) {
    w1 = totalSpend * 0.22;
    w2 = totalSpend * 0.26;
    w3 = totalSpend * 0.28;
    w4 = totalSpend * 0.24;
  }

  final maxWeek = [w1, w2, w3, w4]
      .reduce((curr, next) => curr > next ? curr : next);
  final weeklySpend = [
    WeeklySpendPoint(
      label: 'W1',
      amount: w1,
      ratio: maxWeek > 0 ? (w1 / maxWeek).clamp(0.2, 1.0) : 0.5,
      isCurrent: false,
    ),
    WeeklySpendPoint(
      label: 'W2',
      amount: w2,
      ratio: maxWeek > 0 ? (w2 / maxWeek).clamp(0.2, 1.0) : 0.65,
      isCurrent: false,
    ),
    WeeklySpendPoint(
      label: 'W3',
      amount: w3,
      ratio: maxWeek > 0 ? (w3 / maxWeek).clamp(0.2, 1.0) : 0.85,
      isCurrent: false,
    ),
    WeeklySpendPoint(
      label: 'W4 (Now)',
      amount: w4,
      ratio: maxWeek > 0 ? (w4 / maxWeek).clamp(0.2, 1.0) : 0.70,
      isCurrent: true,
    ),
  ];

  // 4. Product-wise Purchase History & Frequently Purchased Staples
  final Map<String, _ProductAggregator> productMap = {};

  for (final order in validOrders) {
    for (final item in order.items) {
      if (!productMap.containsKey(item.productId)) {
        productMap[item.productId] = _ProductAggregator(
          productId: item.productId,
          productName: item.productName,
          packSize: item.packSize,
        );
      }
      productMap[item.productId]!.add(item.quantity, item.lineTotal);
    }
  }

  final List<ProductPurchaseStat> topStaples = productMap.values.map((agg) {
    final basketPct =
        totalSpend > 0 ? ((agg.totalSpend / totalSpend) * 100) : 0.0;
    String emoji = '🥛';
    String unit = 'pouches';
    String freq = '${basketPct.toStringAsFixed(0)}% of Basket';

    if (agg.productName.toLowerCase().contains('ghee')) {
      emoji = '🍯';
      unit = 'jars';
      freq = 'Bi-weekly drop';
    } else if (agg.productName.toLowerCase().contains('paneer')) {
      emoji = '🧀';
      unit = 'packs';
      freq = 'Fresh weekend feast';
    } else if (agg.productName.toLowerCase().contains('taak') ||
        agg.productName.toLowerCase().contains('chaas') ||
        agg.productName.toLowerCase().contains('dahi')) {
      emoji = '🥣';
      unit = 'pouches';
      freq = 'Probiotic daily';
    } else if (agg.productName.toLowerCase().contains('buffalo')) {
      emoji = '🥛';
      unit = 'pouches';
      freq = 'High FAT 6.5%';
    }

    return ProductPurchaseStat(
      productId: agg.productId,
      productName: agg.productName,
      packSize: agg.packSize,
      totalQuantity: agg.totalQuantity,
      unit: unit,
      totalSpend: agg.totalSpend,
      basketPercent: basketPct,
      emoji: emoji,
      frequencyNote: freq,
    );
  }).toList();

  topStaples.sort((a, b) => b.totalSpend.compareTo(a.totalSpend));

  // 5. Order Statistics Summary
  int activeCount = 0;
  int deliveredCount = 0;
  int cancelledCount = 0;

  for (final o in orders) {
    if (o.orderStatus == OrderLifecycleStatus.cancelled) {
      cancelledCount++;
    } else if (o.orderStatus == OrderLifecycleStatus.delivered) {
      deliveredCount++;
    } else {
      activeCount++;
    }
  }

  final orderStats = OrderStatisticsSummary(
    total: orders.length,
    active: activeCount,
    delivered: deliveredCount,
    cancelled: cancelledCount,
  );

  return PurchaseAnalyticsState(
    monthlyOverview: monthlyOverview,
    settlementSummary: settlementSummary,
    weeklySpend: weeklySpend,
    topStaples: topStaples,
    orderStats: orderStats,
    recentDrops: validOrders.take(5).toList(),
  );
});

class _ProductAggregator {
  final String productId;
  final String productName;
  final String packSize;
  int totalQuantity = 0;
  double totalSpend = 0.0;

  _ProductAggregator({
    required this.productId,
    required this.productName,
    required this.packSize,
  });

  void add(int qty, double spend) {
    totalQuantity += qty;
    totalSpend += spend;
  }
}
