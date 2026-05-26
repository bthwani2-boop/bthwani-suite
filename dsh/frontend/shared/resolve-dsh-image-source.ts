import type { ImageSourcePropType } from 'react-native';

const dshSeedMediaSources: Record<string, ImageSourcePropType> = {
  'dsh.product.apple.v1': require('../media-fixtures/products/dsh-product-apple-v1.png') as ImageSourcePropType,
  'dsh.product.bread.v1': require('../media-fixtures/products/dsh-product-bread-v1.png') as ImageSourcePropType,
  'dsh.product.chicken.v1': require('../media-fixtures/products/dsh-product-chicken-v1.png') as ImageSourcePropType,
  'dsh.product.choco.v1': require('../media-fixtures/products/dsh-product-choco-v1.png') as ImageSourcePropType,
  'dsh.product.croissant.v1': require('../media-fixtures/products/dsh-product-croissant-v1.png') as ImageSourcePropType,
  'dsh.product.milk.v1': require('../media-fixtures/products/dsh-product-milk-v1.png') as ImageSourcePropType,
  'dsh.product.pasta.v1': require('../media-fixtures/products/dsh-product-pasta-v1.png') as ImageSourcePropType,
  'dsh.product.roll.v1': require('../media-fixtures/products/dsh-product-roll-v1.png') as ImageSourcePropType,
  // DEFERRED_MEDIA_FIXTURE: lead-5 featured product image falls back to roll-v1 until real media assets are generated
  'dsh.product.lead-5.dates-box.v1': require('../media-fixtures/products/dsh-product-lead-5-dates-box-v1.png') as ImageSourcePropType,
  'dsh.product.salad.v1': require('../media-fixtures/products/dsh-product-salad-v1.png') as ImageSourcePropType,
  'dsh.product.yogurt.v1': require('../media-fixtures/products/dsh-product-yogurt-v1.png') as ImageSourcePropType,
  'dsh.store.hadda.cover.v1': require('../media-fixtures/stores/dsh-store-hadda-cover-v1.png') as ImageSourcePropType,
  'dsh.store.hittin.cover.v1': require('../media-fixtures/stores/dsh-store-hittin-cover-v1.png') as ImageSourcePropType,
  'dsh.store.malqa.cover.v1': require('../media-fixtures/stores/dsh-store-malqa-cover-v1.png') as ImageSourcePropType,
  'dsh.store.hadda.logo.v1': require('../media-fixtures/logos/dsh-store-hadda-logo-v1.png') as ImageSourcePropType,
  'dsh.store.hittin.logo.v1': require('../media-fixtures/logos/dsh-store-hittin-logo-v1.png') as ImageSourcePropType,
  'dsh.store.malqa.logo.v1': require('../media-fixtures/logos/dsh-store-malqa-logo-v1.png') as ImageSourcePropType,
  'dsh.store.lead-5.cover.v1': require('../media-fixtures/stores/dsh-store-lead-5-cover-v1.png') as ImageSourcePropType,
  'dsh.store.lead-5.logo.v1': require('../media-fixtures/logos/dsh-store-lead-5-logo-v1.png') as ImageSourcePropType,
  'dsh.brand.logo.v1': require('../media-fixtures/logos/brand-logo.png') as ImageSourcePropType,
  'dsh.banner.home.promo-1.v1': require('../media-fixtures/banners/dsh-banner-home-promo-1-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-2.v1': require('../media-fixtures/banners/dsh-banner-home-promo-2-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-3.v1': require('../media-fixtures/banners/dsh-banner-home-promo-3-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-4.v1': require('../media-fixtures/banners/dsh-banner-home-promo-4-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-5.v1': require('../media-fixtures/banners/dsh-banner-home-promo-5-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-6.v1': require('../media-fixtures/banners/dsh-banner-home-promo-6-v1.png') as ImageSourcePropType,
  'dsh.banner.home.promo-7.v1': require('../media-fixtures/banners/dsh-banner-home-promo-7-v1.png') as ImageSourcePropType,
};

export function resolveDshImageSource(source?: string | ImageSourcePropType | null): ImageSourcePropType | undefined {
  if (!source) return undefined;
  if (typeof source !== 'string') return source;
  if (source.startsWith('dsh.')) return dshSeedMediaSources[source];
  return { uri: source };
}
