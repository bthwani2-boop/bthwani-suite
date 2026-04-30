/**
 * DSH — بذرة الفئات الرئيسية والفرعية للتطوير.
 * المصدر: kdt/analysis/dsh/DSH_CATALOG_AND_MOCK_UNIFIED.md و DSH_EXPERIMENTAL_CATEGORIES_REFERENCE.md
 * للعرض فقط أثناء التطوير؛ الربط المنطقي يعتمد على id/slug وليس على النص.
 * لا استدعاء t() على مستوى الموديول — المستهلك يمرّر t من useI18n().
 */

import type { DshCategoryItem, DshCategoryDetailItem } from './types';

/** يبني بذرة الفئات مع الترجمة — يُستدعى من component مع t من useI18n(). */
export function getDshCategoriesSeed(t: (key: string) => string): DshCategoryDetailItem[] {
  return [
    {
      id: 'restaurants',
      name: t('dsh.dshCategoriesSeed.categoryRestaurants'),
      slug: 'restaurants',
      subcategories: [],
    },
    {
      id: 'grocery',
      name: t('dsh.dshCategoriesSeed.categoryGrocery'),
      slug: 'grocery',
      subcategories: [
        { id: 'grocery_vegetables_fruits', name: t('dsh.dshCategoriesSeed.categoryVegetablesFruits'), slug: 'vegetables-fruits', parent_id: 'grocery' },
        { id: 'grocery_meat_fish_chicken', name: t('dsh.dshCategoriesSeed.categoryMeatFishChicken'), slug: 'meat-fish-chicken', parent_id: 'grocery' },
        { id: 'grocery_roasted_spices', name: t('dsh.dshCategoriesSeed.categoryRoastedSpices'), slug: 'roasted-spices', parent_id: 'grocery' },
        { id: 'grocery_bakeries', name: t('dsh.dshCategoriesSeed.categoryBakeries'), slug: 'bakeries', parent_id: 'grocery' },
        { id: 'grocery_deals_bundle', name: t('dsh.dshCategoriesSeed.categoryDealsBundle'), slug: 'deals-bundle', parent_id: 'grocery' },
      ],
    },
    {
      id: 'sweets_juices',
      name: t('dsh.dshCategoriesSeed.categorySweetsJuices'),
      slug: 'sweets-juices',
      subcategories: [
        { id: 'sweets_juices_fresh', name: t('dsh.dshCategoriesSeed.categoryFreshJuices'), slug: 'fresh-juices', parent_id: 'sweets_juices' },
        { id: 'sweets_juices_sweets', name: t('dsh.dshCategoriesSeed.categorySweets'), slug: 'sweets', parent_id: 'sweets_juices' },
        { id: 'sweets_juices_icecream', name: t('dsh.dshCategoriesSeed.categoryIceCream'), slug: 'ice-cream', parent_id: 'sweets_juices' },
      ],
    },
    {
      id: 'anaqati',
      name: t('dsh.dshCategoriesSeed.categoryAnaqati'),
      slug: 'anaqati',
      subcategories: [
        { id: 'anaqati_perfumes', name: t('dsh.dshCategoriesSeed.categoryPerfumes'), slug: 'perfumes', parent_id: 'anaqati' },
        { id: 'anaqati_accessories_beauty', name: t('dsh.dshCategoriesSeed.categoryAccessoriesBeauty'), slug: 'accessories-beauty', parent_id: 'anaqati' },
        { id: 'anaqati_clothing', name: t('dsh.dshCategoriesSeed.categoryClothing'), slug: 'clothing', parent_id: 'anaqati' },
      ],
    },
    {
      id: 'bthwani_store',
      name: t('dsh.dshCategoriesSeed.categoryPharmacy'),
      slug: 'bthwani-store',
      subcategories: [],
    },
    {
      id: 'home_projects',
      name: t('dsh.dshCategoriesSeed.categoryElectronics'),
      slug: 'home-projects',
      subcategories: [],
    },
    {
      id: 'awnak',
      name: t('dsh.dshCategoriesSeed.categoryAwnak'),
      slug: 'awnak',
      subcategories: [],
    },
    {
      id: 'gas_refill',
      name: t('dsh.dshCategoriesSeed.categoryGasRefill'),
      slug: 'gas-refill',
      subcategories: [
        { id: 'gas_refill_refill', name: t('dsh.dshCategoriesSeed.categoryGasRefillRefill'), slug: 'refill', parent_id: 'gas_refill' },
        { id: 'gas_refill_repair', name: t('dsh.dshCategoriesSeed.categoryGasRefillRepair'), slug: 'refill-repair', parent_id: 'gas_refill' },
        { id: 'gas_refill_buy', name: t('dsh.dshCategoriesSeed.categoryGasRefillBuy'), slug: 'buy-refill', parent_id: 'gas_refill' },
      ],
    },
    {
      id: 'shein',
      name: t('dsh.dshCategoriesSeed.categoryHome'),
      slug: 'shein',
      subcategories: [],
    },
    {
      id: 'spare_parts',
      name: t('dsh.dshCategoriesSeed.categoryFashion'),
      slug: 'spare-parts',
      subcategories: [],
    },
    {
      id: 'honey_dates',
      name: t('dsh.dshCategoriesSeed.categorySports'),
      slug: 'honey-dates',
      subcategories: [],
    },
    {
      id: 'electronics',
      name: t('dsh.dshCategoriesSeed.categoryBooks'),
      slug: 'electronics',
      subcategories: [],
    },
  ];
}

/** قائمة الفئات الرئيسية فقط (للقائمة الرئيسية) — استدعاء من component مع t. */
export function getDshCategoriesSeedList(t: (key: string) => string): DshCategoryItem[] {
  return getDshCategoriesSeed(t).map(({ id, name, slug }) => ({ id, name, slug }));
}

/** أيقونات الفئات الرئيسية للعرض (شبكة التصنيفات + الشريط الأفقي) — مرجع الصور المرفقة */
export const DSH_CATEGORY_ICONS: Record<string, string> = {
  restaurants: '🍽️',
  grocery: '🛒',
  sweets_juices: '🧃',
  anaqati: '👗',
  bthwani_store: '🏪',
  home_projects: '🏠',
  awnak: '🤝',
  gas_refill: '⛽',
  shein: '🛍️',
  spare_parts: '🔧',
  honey_dates: '🍯',
  electronics: '📱',
};

/** تفاصيل فئة واحدة بالمعرف أو الـ slug — يُستدعى من component مع t. */
export function getDshCategoryDetailSeed(categoryId: string, t: (key: string) => string): DshCategoryDetailItem | null {
  const normalized = categoryId?.trim();
  if (!normalized) return null;
  const seed = getDshCategoriesSeed(t);
  const found = seed.find((c) => c.id === normalized || c.slug === normalized);
  return found ?? null;
}
