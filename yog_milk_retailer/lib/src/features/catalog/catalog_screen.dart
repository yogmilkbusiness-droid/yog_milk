import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/design_system/tokens/app_colors.dart';
import '../../core/design_system/tokens/app_radius.dart';
import '../../core/design_system/tokens/app_spacing.dart';
import '../../core/design_system/tokens/app_typography.dart';
import '../../core/design_system/widgets/yog_bottom_navigation_bar.dart';
import '../../core/design_system/widgets/yog_empty_state.dart';
import '../../core/design_system/widgets/yog_product_card.dart';
import '../../core/mock_engine/auth_controller.dart';
import '../../core/mock_engine/cart_controller.dart';
import '../../core/mock_engine/contracts/catalog_repository.dart';
import '../../core/mock_engine/seed/mock_categories.dart';
import '../../core/mock_engine/seed/mock_products.dart';
import 'widgets/quick_add_sheet.dart';

/// Product Catalogue & Discovery Screen matching Stitch references:
/// - `yog_milk_shop`
/// - `yog_milk_search_empty_state`
class CatalogScreen extends ConsumerStatefulWidget {
  final String? initialCategorySlug;

  const CatalogScreen({
    super.key,
    this.initialCategorySlug,
  });

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategorySlug = 'all';
  String _selectedFatFilter = 'all'; // 'all' | 'low' | 'high'
  String _searchQuery = '';
  final List<String> _recentSearches = [
    'Gir Cow Milk',
    'Bilona Ghee',
    'Malai Paneer',
    'Masala Taak',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialCategorySlug != null) {
      _selectedCategorySlug = widget.initialCategorySlug!;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);
    final cartNotifier = ref.read(cartProvider.notifier);
    final authState = ref.watch(authControllerProvider);
    final retailer = authState.profile;
    final area = retailer?.area ?? 'Kothrud, Pune';

    // Filter products by search query, category, and fat content
    final filteredProducts = mockProducts.where((p) {
      // 1. Category filter
      if (_selectedCategorySlug != 'all') {
        final category = mockCategories.cast<CategoryEntity?>().firstWhere(
              (c) => c?.slug == _selectedCategorySlug,
              orElse: () => null,
            );
        if (category != null && p.categoryId != category.id) {
          return false;
        }
      }

      // 2. Search query filter
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchesName = p.name.toLowerCase().contains(q);
        final matchesDesc = p.description.toLowerCase().contains(q);
        final matchesCat = p.categoryName.toLowerCase().contains(q);
        final matchesPack = p.packSize.toLowerCase().contains(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesPack) {
          return false;
        }
      }

      // 3. Fat content filter
      if (_selectedFatFilter == 'low' && p.fatPercentage > 3.0) {
        return false;
      }
      if (_selectedFatFilter == 'high' && p.fatPercentage <= 4.0) {
        return false;
      }

      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      bottomNavigationBar: YogBottomNavigationBar(
        currentIndex: 1, // Catalog active
        cartItemCount: cartState.itemCount,
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            // Already here
          } else if (index == 2) {
            context.push('/orders');
          } else if (index == 3) {
            context.push('/invoices');
          } else if (index == 4) {
            context.push('/account');
          }
        },
      ),
      body: SafeArea(
        child: Stack(
          children: [
            // Main Scrollable Content
            CustomScrollView(
              slivers: [
                // 1. Dawn Batch Status Bar
                SliverToBoxAdapter(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                      vertical: AppSpacing.xs,
                    ),
                    color: AppColors.surfaceContainerLow,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Dawn Batch Dispatched · Chilled at 4°C',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on_rounded,
                              size: 14,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 2),
                            Text(
                              area,
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // 2. Sticky Header with Brand & Cart Icon
                SliverToBoxAdapter(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                      vertical: AppSpacing.sm,
                    ),
                    color: Colors.white,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainerLow,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: AppColors.borderSubtle,
                                ),
                              ),
                              child: const Icon(
                                Icons.spa_rounded,
                                color: AppColors.primary,
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Yog Milk',
                                  style: AppTypography.titleMedium.copyWith(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                Text(
                                  'FROM NATURE TO NOURISH YOU',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: AppColors.textMuted,
                                    fontSize: 9,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(
                                Icons.bolt_rounded,
                                color: AppColors.secondary,
                              ),
                              tooltip: 'Quick Add Usual',
                              onPressed: () => QuickAddSheet.show(context),
                            ),
                            Stack(
                              children: [
                                IconButton(
                                  icon: const Icon(
                                    Icons.shopping_bag_outlined,
                                    color: AppColors.primary,
                                  ),
                                  tooltip: 'Cart',
                                  onPressed: () => context.push('/cart'),
                                ),
                                if (cartState.itemCount > 0)
                                  Positioned(
                                    top: 6,
                                    right: 6,
                                    child: Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: const BoxDecoration(
                                        color: AppColors.secondary,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Text(
                                        '${cartState.itemCount}',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // 3. Search & Quick Filter Cluster
                SliverToBoxAdapter(
                  child: Container(
                    color: Colors.white,
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.base,
                      0,
                      AppSpacing.base,
                      AppSpacing.sm,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 46,
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceContainerLow,
                                  borderRadius: AppRadius.radiusLg,
                                  border: Border.all(
                                    color: AppColors.borderSubtle,
                                  ),
                                ),
                                child: TextField(
                                  controller: _searchController,
                                  onChanged: (val) {
                                    setState(() => _searchQuery = val);
                                  },
                                  decoration: InputDecoration(
                                    hintText:
                                        'Search milk, ghee, chaas, paneer...',
                                    hintStyle:
                                        AppTypography.bodyMedium.copyWith(
                                      color: AppColors.textMuted,
                                    ),
                                    prefixIcon: const Icon(
                                      Icons.search_rounded,
                                      color: AppColors.textMuted,
                                      size: 20,
                                    ),
                                    suffixIcon: _searchQuery.isNotEmpty
                                        ? IconButton(
                                            icon: const Icon(
                                              Icons.clear_rounded,
                                              size: 18,
                                            ),
                                            onPressed: () {
                                              _searchController.clear();
                                              setState(() => _searchQuery = '');
                                            },
                                          )
                                        : const Icon(
                                            Icons.mic_none_rounded,
                                            color: AppColors.textMuted,
                                            size: 20,
                                          ),
                                    border: InputBorder.none,
                                    contentPadding:
                                        const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            Container(
                              height: 46,
                              width: 46,
                              decoration: BoxDecoration(
                                color: _selectedFatFilter != 'all'
                                    ? AppColors.primary
                                    : AppColors.surfaceContainerLow,
                                borderRadius: AppRadius.radiusLg,
                                border: Border.all(
                                  color: AppColors.borderSubtle,
                                ),
                              ),
                              child: IconButton(
                                icon: Icon(
                                  Icons.tune_rounded,
                                  size: 20,
                                  color: _selectedFatFilter != 'all'
                                      ? Colors.white
                                      : AppColors.primary,
                                ),
                                onPressed: () {
                                  // Toggle fat filter
                                  setState(() {
                                    if (_selectedFatFilter == 'all') {
                                      _selectedFatFilter = 'high';
                                    } else if (_selectedFatFilter == 'high') {
                                      _selectedFatFilter = 'low';
                                    } else {
                                      _selectedFatFilter = 'all';
                                    }
                                  });
                                },
                              ),
                            ),
                          ],
                        ),

                        // Recent Searches Chips (when searching or focused)
                        if (_searchQuery.isEmpty) ...[
                          const SizedBox(height: AppSpacing.xs),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                Text(
                                  'Recent: ',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: AppColors.textMuted,
                                    fontSize: 10,
                                  ),
                                ),
                                ..._recentSearches.map((term) {
                                  return Padding(
                                    padding: const EdgeInsets.only(right: 6),
                                    child: ActionChip(
                                      label: Text(
                                        term,
                                        style:
                                            AppTypography.labelSmall.copyWith(
                                          color: AppColors.primary,
                                          fontSize: 11,
                                        ),
                                      ),
                                      backgroundColor:
                                          AppColors.surfaceContainerLow,
                                      side: BorderSide.none,
                                      padding: EdgeInsets.zero,
                                      onPressed: () {
                                        _searchController.text = term;
                                        setState(() => _searchQuery = term);
                                      },
                                    ),
                                  );
                                }),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                // 4. Categories Horizontal Selector Pills
                SliverToBoxAdapter(
                  child: Container(
                    color: Colors.white,
                    padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.base,
                      ),
                      child: Row(
                        children: [
                          _buildCategoryPill('all', 'All (${mockProducts.length})'),
                          ...mockCategories.map(
                            (c) => _buildCategoryPill(c.slug, c.name),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // 5. Dawn Guarantee Ribbon
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.base,
                      AppSpacing.sm,
                      AppSpacing.base,
                      AppSpacing.xs,
                    ),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md,
                        vertical: AppSpacing.xs,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerHigh.withValues(alpha: 0.6),
                        borderRadius: AppRadius.radiusMd,
                        border: Border.all(color: AppColors.borderSubtle),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.wb_twilight_rounded,
                                size: 16,
                                color: AppColors.secondary,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Order by 5:00 PM for 5:30 AM Dawn Delivery',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '100% Pure A2',
                            style: AppTypography.labelSmall.copyWith(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // 6. Products List / Grid
                if (filteredProducts.isEmpty)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.xxl),
                      child: YogEmptyState(
                        title: 'No Dairy Products Found',
                        message:
                            'No items match your filter "$_searchQuery". Try resetting the search or category filter.',
                        icon: Icons.search_off_rounded,
                        actionLabel: 'Reset Filters',
                        onAction: () {
                          setState(() {
                            _searchController.clear();
                            _searchQuery = '';
                            _selectedCategorySlug = 'all';
                            _selectedFatFilter = 'all';
                          });
                        },
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.base,
                      AppSpacing.sm,
                      AppSpacing.base,
                      120, // Extra padding for floating cart bar
                    ),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final product = filteredProducts[index];
                          final currentQty = cartState.getQuantity(product.id);

                          return Padding(
                            padding: const EdgeInsets.only(
                              bottom: AppSpacing.md,
                            ),
                            child: YogProductCard(
                              title: product.name,
                              packSize: product.packSize,
                              wholesalePrice: product.wholesalePrice,
                              unitsPerCrate: product.unitsPerCrate,
                              fatPercentage: product.fatPercentage,
                              snfPercentage: product.snfPercentage,
                              currentQuantity: currentQty,
                              isAvailable: product.isAvailable,
                              onTap: () {
                                context.push('/catalog/${product.id}');
                              },
                              onQuantityChanged: (newQty) {
                                cartNotifier.setQuantity(product, newQty);
                              },
                              onQuickAdd: () {
                                cartNotifier.addCrate(product);
                              },
                            ),
                          );
                        },
                        childCount: filteredProducts.length,
                      ),
                    ),
                  ),
              ],
            ),

            // 7. Sticky Floating Cart Pill Bar (matching Stitch `yog_milk_shop`)
            if (cartState.itemCount > 0)
              Positioned(
                bottom: AppSpacing.base,
                left: AppSpacing.base,
                right: AppSpacing.base,
                child: InkWell(
                  onTap: () => context.push('/cart'),
                  borderRadius: AppRadius.radiusPill,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base,
                      vertical: AppSpacing.sm,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: AppRadius.radiusPill,
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x33051256),
                          blurRadius: 18,
                          offset: Offset(0, 6),
                        ),
                      ],
                      border: Border.all(
                        color: AppColors.primaryContainer,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 34,
                              height: 34,
                              decoration: const BoxDecoration(
                                color: AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.water_drop_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      'View Basket',
                                      style:
                                          AppTypography.titleSmall.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      '• ${cartState.totalUnits} items (${cartState.totalCrates} crates)',
                                      style:
                                          AppTypography.labelSmall.copyWith(
                                        color: AppColors.secondaryLight,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  'Dawn Drop · Tomorrow 5:30 AM',
                                  style: AppTypography.labelSmall.copyWith(
                                    color: Colors.white70,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            Text(
                              '₹${cartState.totalPayable.toStringAsFixed(2)}',
                              style: AppTypography.titleMedium.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.arrow_forward_rounded,
                              color: AppColors.secondaryLight,
                              size: 18,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryPill(String slug, String label) {
    final isSelected = _selectedCategorySlug == slug;

    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: InkWell(
        onTap: () {
          setState(() => _selectedCategorySlug = slug);
        },
        borderRadius: AppRadius.radiusPill,
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: 6,
          ),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary
                : AppColors.surfaceContainerLow,
            borderRadius: AppRadius.radiusPill,
            border: Border.all(
              color: isSelected
                  ? AppColors.primary
                  : AppColors.borderSubtle,
            ),
          ),
          child: Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
