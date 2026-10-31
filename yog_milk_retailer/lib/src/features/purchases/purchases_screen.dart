import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_bottom_navigation_bar.dart';
import '../../core/design_system/widgets/yog_status_badge.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/localization/locale_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/contracts/order_repository.dart';
import 'purchase_analytics_controller.dart';

/// My Purchases & Purchasing Analytics Screen matching Stitch reference:
/// `yog_milk_my_purchases`
class PurchasesScreen extends ConsumerStatefulWidget {
  const PurchasesScreen({super.key});

  @override
  ConsumerState<PurchasesScreen> createState() => _PurchasesScreenState();
}

class _PurchasesScreenState extends ConsumerState<PurchasesScreen> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    ref.watch(localeControllerProvider);
    final l10n = AppLocalizations.of(context);
    final cartState = ref.watch(cartProvider);
    final analytics = ref.watch(purchaseAnalyticsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFFCF9F3),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFCF9F3),
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Text(
          l10n.myPurchases,
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusPill,
              border: Border.all(color: AppColors.borderSubtle),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x06051256),
                  blurRadius: 4,
                  offset: Offset(0, 1),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.calendar_month_rounded,
                  size: 14,
                  color: AppColors.secondary,
                ),
                const SizedBox(width: 4),
                Text(
                  analytics.monthlyOverview.period,
                  style: AppTypography.labelSmall.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const Icon(
                  Icons.arrow_drop_down_rounded,
                  size: 18,
                  color: AppColors.textMuted,
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: 4, // Account / Purchases
        cartItemCount: cartState.itemCount,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/catalog');
          } else if (index == 2) {
            context.go('/orders');
          } else if (index == 3) {
            context.go('/invoices');
          } else if (index == 4) {
            context.go('/account');
          }
        },
      ),
      body: _isLoading
          ? _buildLoadingSkeleton()
          : analytics.monthlyOverview.totalDrops == 0
              ? _buildEmptyState(context, l10n)
              : RefreshIndicator(
                  onRefresh: () async {
                    setState(() => _isLoading = true);
                    await Future.delayed(const Duration(milliseconds: 350));
                    if (mounted) setState(() => _isLoading = false);
                  },
                  child: ListView(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    children: [
                      // 1. Top Metrics Ribbon (3-Card Stats Grid)
                      _buildTopMetricsRibbon(analytics.monthlyOverview),
                      const SizedBox(height: AppSpacing.md),

                      // 2. Settlement Health Bar / Payment Summary
                      _buildSettlementHealthSection(
                        context,
                        analytics.settlementSummary,
                        l10n,
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // 3. Weekly Spend Rhythm Bar Chart
                      _buildWeeklySpendChart(analytics.weeklySpend, l10n),
                      const SizedBox(height: AppSpacing.md),

                      // 4. Farm Staples Basket (Product-wise History)
                      _buildStaplesBasketSection(analytics.topStaples, l10n),
                      const SizedBox(height: AppSpacing.md),

                      // 5. Recent Activity Snapshot
                      _buildRecentActivitySection(
                        context,
                        analytics.recentDrops,
                        l10n,
                      ),
                      const SizedBox(height: AppSpacing.md),

                      // 6. Sattvic Purity Reassurance Card
                      _buildSattvicAssuranceCard(context),
                      const SizedBox(height: AppSpacing.xl),
                    ],
                  ),
                ),
    );
  }

  // 1. Top Metrics Ribbon
  Widget _buildTopMetricsRibbon(MonthlyPurchasingOverview overview) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Row(
          children: [
            Expanded(
              child: _buildMetricTile(
                title: 'This Month',
                value: '₹${overview.totalSpend.toStringAsFixed(0)}',
                badgeText: overview.growthNote,
                badgeColor: const Color(0xFF2E7D32),
                badgeIcon: Icons.trending_up_rounded,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildMetricTile(
                title: 'Total Drops',
                value: '${overview.totalDrops} Drops',
                badgeText: 'Dawn logged',
                badgeColor: AppColors.secondary,
                badgeIcon: Icons.wb_twilight_rounded,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildMetricTile(
                title: 'Avg Drop',
                value: '₹${overview.avgDrop.toStringAsFixed(0)}',
                badgeText: 'Pure Vedic',
                badgeColor: AppColors.primary,
                badgeIcon: Icons.spa_rounded,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required String badgeText,
    required Color badgeColor,
    required IconData badgeIcon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              style: AppTypography.titleLarge.copyWith(
                fontWeight: FontWeight.w900,
                color: AppColors.primary,
                letterSpacing: -0.5,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Icon(badgeIcon, size: 11, color: badgeColor),
              const SizedBox(width: 3),
              Flexible(
                child: Text(
                  badgeText,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    color: badgeColor,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 2. Settlement Health Section
  Widget _buildSettlementHealthSection(
    BuildContext context,
    SettlementHealthSummary summary,
    AppLocalizations l10n,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06051256),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    const Icon(
                      Icons.account_balance_wallet_rounded,
                      color: AppColors.primary,
                      size: 18,
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        l10n.settlementRatio,
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              if (summary.pendingOrdersCount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryContainerAmber.withValues(alpha: 0.4),
                    borderRadius: AppRadius.radiusPill,
                  ),
                  child: Text(
                    '${summary.pendingOrdersCount} Pending COD',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.w800,
                      fontSize: 10,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: SizedBox(
              height: 10,
              child: Row(
                children: [
                  Expanded(
                    flex: (summary.clearedPercent * 100).toInt().clamp(5, 100),
                    child: Container(color: const Color(0xFF2E7D32)),
                  ),
                  if (summary.pendingPercent > 0)
                    Expanded(
                      flex: (summary.pendingPercent * 100).toInt().clamp(1, 95),
                      child: Container(color: AppColors.secondary),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Numerical Breakdown
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 12,
            runSpacing: 4,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Color(0xFF2E7D32),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    'Cleared (Online): ',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    '₹${summary.clearedAmount.toStringAsFixed(0)}',
                    style: AppTypography.labelSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.secondary,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    'COD Due: ',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    '₹${summary.pendingCodAmount.toStringAsFixed(0)}',
                    style: AppTypography.labelSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.secondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Divider(height: 1, color: AppColors.borderSubtle),
          const SizedBox(height: 8),

          // Helper Note
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.info_outline_rounded,
                size: 15,
                color: AppColors.secondary,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  summary.pendingOrdersCount > 0
                      ? 'Doorstep cash collection active for morning dawn drop. Hand exact change to the delivery sahayak.'
                      : 'All accounts completely settled. 100% compliant with YOG MILK non-credit wholesale terms.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                    height: 1.3,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 3. Weekly Spend Rhythm Bar Chart
  Widget _buildWeeklySpendChart(
    List<WeeklySpendPoint> points,
    AppLocalizations l10n,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.weeklySpendRhythm,
                      style: AppTypography.titleMedium.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'Weekly ordering consistency',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.bar_chart_rounded, color: AppColors.primary),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 110,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: points.map((p) {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      '₹${(p.amount / 1000).toStringAsFixed(1)}k',
                      style: AppTypography.labelSmall.copyWith(
                        fontWeight: p.isCurrent ? FontWeight.w800 : FontWeight.w600,
                        color: p.isCurrent ? AppColors.primary : AppColors.textMuted,
                        fontSize: 9.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      width: 32,
                      height: (70 * p.ratio).clamp(18.0, 70.0),
                      decoration: BoxDecoration(
                        color: p.isCurrent
                            ? AppColors.primary
                            : AppColors.primaryContainerNavy.withValues(alpha: 0.15),
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(6),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      p.label,
                      style: AppTypography.labelSmall.copyWith(
                        fontWeight: p.isCurrent ? FontWeight.w800 : FontWeight.w600,
                        color: p.isCurrent ? AppColors.primary : AppColors.textSecondary,
                        fontSize: 10,
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  // 4. Farm Staples Basket Section
  Widget _buildStaplesBasketSection(
    List<ProductPurchaseStat> staples,
    AppLocalizations l10n,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusXl,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.eco_rounded, color: AppColors.primary, size: 18),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        l10n.topStaples,
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Oct 2026',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (staples.isEmpty)
            Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Center(
                child: Text(
                  'No purchase items recorded this month.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            )
          else
            ...staples.map((stat) => _buildStapleItemRow(stat)),
        ],
      ),
    );
  }

  Widget _buildStapleItemRow(ProductPurchaseStat stat) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFFCF9F3),
        borderRadius: AppRadius.radiusMd,
        border: Border.all(color: AppColors.borderSubtle.withValues(alpha: 0.6)),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusMd,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Center(
              child: Text(
                stat.emoji,
                style: const TextStyle(fontSize: 18),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  stat.productName,
                  style: AppTypography.titleSmall.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  stat.packSize,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${stat.totalQuantity} ${stat.unit}',
                style: AppTypography.titleSmall.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                decoration: BoxDecoration(
                  color: AppColors.secondaryContainerAmber.withValues(alpha: 0.3),
                  borderRadius: AppRadius.radiusPill,
                ),
                child: Text(
                  stat.frequencyNote,
                  style: AppTypography.labelSmall.copyWith(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: AppColors.secondary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 5. Recent Activity Snapshot
  Widget _buildRecentActivitySection(
    BuildContext context,
    List<OrderEntity> orders,
    AppLocalizations l10n,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Recent Drops & History',
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => context.push('/orders'),
              child: Text(
                'View All',
                style: AppTypography.labelMedium.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...orders.map((o) => _buildRecentOrderCard(context, o)),
      ],
    );
  }

  Widget _buildRecentOrderCard(BuildContext context, OrderEntity order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order.orderCode,
                      style: AppTypography.titleSmall.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      '${order.items.length} items · ${order.deliveryReference}',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                        fontSize: 10,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              YogStatusBadge(
                status: order.deliveryStatus.name,
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Divider(height: 1, color: AppColors.borderSubtle),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    'Total: ',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    '₹${order.totalPayable.toStringAsFixed(2)}',
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () => context.push('/orders/${order.orderCode}/tracking'),
                child: Row(
                  children: [
                    Text(
                      'Track Drop',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right_rounded,
                      size: 16,
                      color: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 6. Sattvic Purity Reassurance Card
  Widget _buildSattvicAssuranceCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: const Color(0xFFFBF1DC),
        borderRadius: AppRadius.radiusLg,
        border: Border.all(color: const Color(0xFFE7E2D6)),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.verified_user_rounded,
            color: Color(0xFFC9A03D),
            size: 24,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PURE SATTVIC ORIGIN',
                  style: AppTypography.labelSmall.copyWith(
                    fontWeight: FontWeight.w800,
                    color: AppColors.primary,
                    letterSpacing: 0.8,
                  ),
                ),
                Text(
                  '100% Single-origin A2 Vedic Gir cow farm records. Sourced with reverence from Devlali, Nashik.',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 10.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingSkeleton() {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        children: [
          Container(
            height: 80,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Container(
            height: 120,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          Container(
            height: 160,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: AppRadius.radiusLg,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, AppLocalizations l10n) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.analytics_outlined,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No Purchases Recorded Yet',
              style: AppTypography.titleLarge.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'Once you place dawn dairy orders, your monthly spend rhythm and staple analytics will appear here.',
              textAlign: TextAlign.center,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ElevatedButton(
              onPressed: () => context.go('/catalog'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: const StadiumBorder(),
              ),
              child: const Text('Browse Dairy Catalog'),
            ),
          ],
        ),
      ),
    );
  }
}
