import type { SeedMediaKey } from './catalog';

declare const require: (path: string) => unknown;

export type SeedMediaSource = unknown;

export const SeedMediaSourceRegistry = {
  'dsh.product.apple.v1': require('../assets/seed/dsh/products/dsh-product-apple-v1.png'),
  'dsh.product.bread.v1': require('../assets/seed/dsh/products/dsh-product-bread-v1.png'),
  'dsh.product.chicken.v1': require('../assets/seed/dsh/products/dsh-product-chicken-v1.png'),
  'dsh.product.choco.v1': require('../assets/seed/dsh/products/dsh-product-choco-v1.png'),
  'dsh.product.croissant.v1': require('../assets/seed/dsh/products/dsh-product-croissant-v1.png'),
  'dsh.product.milk.v1': require('../assets/seed/dsh/products/dsh-product-milk-v1.png'),
  'dsh.product.pasta.v1': require('../assets/seed/dsh/products/dsh-product-pasta-v1.png'),
  'dsh.product.roll.v1': require('../assets/seed/dsh/products/dsh-product-roll-v1.png'),
  'dsh.product.salad.v1': require('../assets/seed/dsh/products/dsh-product-salad-v1.png'),
  'dsh.product.yogurt.v1': require('../assets/seed/dsh/products/dsh-product-yogurt-v1.png'),
  'dsh.store.hadda.cover.v1': require('../assets/seed/dsh/stores/dsh-store-hadda-cover-v1.png'),
  'dsh.store.hittin.cover.v1': require('../assets/seed/dsh/stores/dsh-store-hittin-cover-v1.png'),
  'dsh.store.malqa.cover.v1': require('../assets/seed/dsh/stores/dsh-store-malqa-cover-v1.png'),
  'dsh.banner.home.promo-1.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-1-v1.png'),
  'dsh.banner.home.promo-2.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-2-v1.png'),
  'dsh.banner.home.promo-3.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-3-v1.png'),
  'dsh.banner.home.promo-4.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-4-v1.png'),
  'dsh.banner.home.promo-5.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-5-v1.png'),
  'dsh.banner.home.promo-6.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-6-v1.png'),
  'dsh.banner.home.promo-7.v1': require('../assets/seed/dsh/banners/dsh-banner-home-promo-7-v1.png'),
} as const satisfies Record<SeedMediaKey, SeedMediaSource>;

export function resolveSeedMediaSource(key: SeedMediaKey): SeedMediaSource {
  return SeedMediaSourceRegistry[key];
}


