import type { ImageSourcePropType } from 'react-native';

/**
 * DSH Seed Media Source Resolver
 * Owner: dsh/frontend/shared (resolver) — media assets live in dsh/frontend/media-fixtures
 *
 * Approved media paths:
 *   products         → ../media-fixtures/products/
 *   stores           → ../media-fixtures/stores/
 *   store_logos      → ../media-fixtures/store_logos/
 *   banners          → ../media-fixtures/banners/
 *   categories/main  → ../media-fixtures/categories/main/   (keys: dsh.category.main.<id>.v1)
 *   categories/sub   → ../media-fixtures/categories/sub/    (keys: dsh.category.sub.<id>.v1)
 *
 * DSH_CATEGORY_ICONS is emoji fallback only — not a primary image source.
 * Callers use emojiFallback from DshCategoryFixture as the active fallback.
 */

const dshSeedMediaSources: Record<string, ImageSourcePropType> = {
  'dsh.product.apple.v1': require('../media-fixtures/products/dsh-product-apple-v1.png') as ImageSourcePropType,
  'dsh.product.bread.v1': require('../media-fixtures/products/dsh-product-bread-v1.png') as ImageSourcePropType,
  'dsh.product.chicken.v1': require('../media-fixtures/products/dsh-product-chicken-v1.png') as ImageSourcePropType,
  'dsh.product.choco.v1': require('../media-fixtures/products/dsh-product-choco-v1.png') as ImageSourcePropType,
  'dsh.product.croissant.v1': require('../media-fixtures/products/dsh-product-croissant-v1.png') as ImageSourcePropType,
  'dsh.product.milk.v1': require('../media-fixtures/products/dsh-product-milk-v1.png') as ImageSourcePropType,
  'dsh.product.pasta.v1': require('../media-fixtures/products/dsh-product-pasta-v1.png') as ImageSourcePropType,
  'dsh.product.roll.v1': require('../media-fixtures/products/dsh-product-roll-v1.png') as ImageSourcePropType,
  'dsh.product.lead-5.dates-box.v1': require('../media-fixtures/products/dsh-product-lead-5-dates-box-v1.png') as ImageSourcePropType,
  'dsh.product.salad.v1': require('../media-fixtures/products/dsh-product-salad-v1.png') as ImageSourcePropType,
  'dsh.product.yogurt.v1': require('../media-fixtures/products/dsh-product-yogurt-v1.png') as ImageSourcePropType,
  'dsh.store.hadda.cover.v1': require('../media-fixtures/stores/dsh-store-hadda-cover-v1.png') as ImageSourcePropType,
  'dsh.store.hittin.cover.v1': require('../media-fixtures/stores/dsh-store-hittin-cover-v1.png') as ImageSourcePropType,
  'dsh.store.malqa.cover.v1': require('../media-fixtures/stores/dsh-store-malqa-cover-v1.png') as ImageSourcePropType,
  'dsh.store.hadda.logo.v1': require('../media-fixtures/store_logos/dsh-store-hadda-logo-v1.png') as ImageSourcePropType,
  'dsh.store.hittin.logo.v1': require('../media-fixtures/store_logos/dsh-store-hittin-logo-v1.png') as ImageSourcePropType,
  'dsh.store.malqa.logo.v1': require('../media-fixtures/store_logos/dsh-store-malqa-logo-v1.png') as ImageSourcePropType,
  'dsh.store.lead-5.cover.v1': require('../media-fixtures/stores/dsh-store-lead-5-cover-v1.png') as ImageSourcePropType,
  'dsh.store.lead-5.logo.v1': require('../media-fixtures/store_logos/dsh-store-lead-5-logo-v1.png') as ImageSourcePropType,
  'dsh.brand.logo.v1': require('../media-fixtures/store_logos/brand-logo.png') as ImageSourcePropType,
  'dsh.banner.home.promo-1.v1': require('../media-fixtures/banners/dsh-banner-home-promo-1-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-2.v1': require('../media-fixtures/banners/dsh-banner-home-promo-2-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-3.v1': require('../media-fixtures/banners/dsh-banner-home-promo-3-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-4.v1': require('../media-fixtures/banners/dsh-banner-home-promo-4-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-5.v1': require('../media-fixtures/banners/dsh-banner-home-promo-5-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-6.v1': require('../media-fixtures/banners/dsh-banner-home-promo-6-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-7.v1': require('../media-fixtures/banners/dsh-banner-home-promo-7-v1.png') as ImageSourcePropType,

  // Main Categories
  'dsh.category.main.restaurants.v1': require('../media-fixtures/categories/main/dsh-category-main-restaurants-v1.png') as ImageSourcePropType,
  'dsh.category.main.grocery.v1': require('../media-fixtures/categories/main/dsh-category-main-grocery-v1.png') as ImageSourcePropType,
  'dsh.category.main.sweets_juices.v1': require('../media-fixtures/categories/main/dsh-category-main-sweets_juices-v1.png') as ImageSourcePropType,
  'dsh.category.main.anaqati.v1': require('../media-fixtures/categories/main/dsh-category-main-anaqati-v1.png') as ImageSourcePropType,
  'dsh.category.main.wani_store.v1': require('../media-fixtures/categories/main/dsh-category-main-wani_store-v1.png') as ImageSourcePropType,
  'dsh.category.main.home_projects.v1': require('../media-fixtures/categories/main/dsh-category-main-home_projects-v1.png') as ImageSourcePropType,
  'dsh.category.main.cloud_kitchens.v1': require('../media-fixtures/categories/main/dsh-category-main-cloud_kitchens-v1.png') as ImageSourcePropType,
  'dsh.category.main.awnak.v1': require('../media-fixtures/categories/main/dsh-category-main-awnak-v1.png') as ImageSourcePropType,
  'dsh.category.main.gas_refill.v1': require('../media-fixtures/categories/main/dsh-category-main-gas_refill-v1.png') as ImageSourcePropType,
  'dsh.category.main.shein.v1': require('../media-fixtures/categories/main/dsh-category-main-shein-v1.png') as ImageSourcePropType,
  'dsh.category.main.spare_parts.v1': require('../media-fixtures/categories/main/dsh-category-main-spare_parts-v1.png') as ImageSourcePropType,
  'dsh.category.main.honey_dates.v1': require('../media-fixtures/categories/main/dsh-category-main-honey_dates-v1.png') as ImageSourcePropType,
  'dsh.category.main.electronics.v1': require('../media-fixtures/categories/main/dsh-category-main-electronics-v1.png') as ImageSourcePropType,

  // Sub Categories
  'dsh.category.sub.grocery_vegetables_fruits.v1': require('../media-fixtures/categories/sub/dsh-category-sub-grocery_vegetables_fruits-v1.png') as ImageSourcePropType,
  'dsh.category.sub.grocery_meat_fish_chicken.v1': require('../media-fixtures/categories/sub/dsh-category-sub-grocery_meat_fish_chicken-v1.png') as ImageSourcePropType,
  'dsh.category.sub.grocery_roasted_spices.v1': require('../media-fixtures/categories/sub/dsh-category-sub-grocery_roasted_spices-v1.png') as ImageSourcePropType,
  'dsh.category.sub.grocery_bakeries.v1': require('../media-fixtures/categories/sub/dsh-category-sub-grocery_bakeries-v1.png') as ImageSourcePropType,
  'dsh.category.sub.grocery_deals_bundle.v1': require('../media-fixtures/categories/sub/dsh-category-sub-grocery_deals_bundle-v1.png') as ImageSourcePropType,
  'dsh.category.sub.sweets_juices_fresh.v1': require('../media-fixtures/categories/sub/dsh-category-sub-sweets_juices_fresh-v1.png') as ImageSourcePropType,
  'dsh.category.sub.sweets_juices_sweets.v1': require('../media-fixtures/categories/sub/dsh-category-sub-sweets_juices_sweets-v1.png') as ImageSourcePropType,
  'dsh.category.sub.sweets_juices_icecream.v1': require('../media-fixtures/categories/sub/dsh-category-sub-sweets_juices_icecream-v1.png') as ImageSourcePropType,
  'dsh.category.sub.anaqati_perfumes.v1': require('../media-fixtures/categories/sub/dsh-category-sub-anaqati_perfumes-v1.png') as ImageSourcePropType,
  'dsh.category.sub.anaqati_accessories_beauty.v1': require('../media-fixtures/categories/sub/dsh-category-sub-anaqati_accessories_beauty-v1.png') as ImageSourcePropType,
  'dsh.category.sub.anaqati_clothing.v1': require('../media-fixtures/categories/sub/dsh-category-sub-anaqati_clothing-v1.png') as ImageSourcePropType,
  'dsh.category.sub.gas_refill_refill.v1': require('../media-fixtures/categories/sub/dsh-category-sub-gas_refill_refill-v1.png') as ImageSourcePropType,
  'dsh.category.sub.gas_refill_repair.v1': require('../media-fixtures/categories/sub/dsh-category-sub-gas_refill_repair-v1.png') as ImageSourcePropType,
  'dsh.category.sub.gas_refill_buy.v1': require('../media-fixtures/categories/sub/dsh-category-sub-gas_refill_buy-v1.png') as ImageSourcePropType,
};

/**
 * Category key namespace router.
 * Keys: dsh.category.main.<id>.v1  → media-fixtures/categories/main/dsh-category-main-<id>-v1.png
 *       dsh.category.sub.<id>.v1   → media-fixtures/categories/sub/dsh-category-sub-<id>-v1.png
 *
 * Returns resolved ImageSourcePropType from registered sources above.
 */
function resolveCategoryKey(key: string): ImageSourcePropType | undefined {
  return dshSeedMediaSources[key];
}

export function resolveDshImageSource(source?: string | ImageSourcePropType | null): ImageSourcePropType | undefined {
  if (!source) return undefined;
  if (typeof source !== 'string') return source;
  // Route category namespace — emoji fallback activates when undefined is returned
  if (source.startsWith('dsh.category.main.') || source.startsWith('dsh.category.sub.')) {
    return resolveCategoryKey(source);
  }
  if (source.startsWith('dsh.')) return dshSeedMediaSources[source];
  return { uri: source };
}
