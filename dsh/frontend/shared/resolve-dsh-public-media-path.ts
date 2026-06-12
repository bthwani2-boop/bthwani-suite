// DSH Web/Public Media Resolver
// SCAFFOLD: not runtime truth, not backend/API/binding source.
// Owner: dsh/frontend/shared.
// Archived preview media lives under dsh/frontend/media-fixtures/legacy-preview.
// Live runtime media must come from DSH API -> PostgreSQL dsh_media_assets +
// MinIO/S3 public_url values.

const dshPublicMediaPrefix = '/dsh/media-fixtures/';
const dshLegacyPreviewPrefix = 'legacy-preview/';

export const explicitPublicMediaPathByKey: Record<string, string> = {
  'dsh.product.apple.v1': 'legacy-preview/products/dsh-product-apple-v1.png',
  'dsh.product.bread.v1': 'legacy-preview/products/dsh-product-bread-v1.png',
  'dsh.product.chicken.v1': 'legacy-preview/products/dsh-product-chicken-v1.png',
  'dsh.product.choco.v1': 'legacy-preview/products/dsh-product-choco-v1.png',
  'dsh.product.croissant.v1': 'legacy-preview/products/dsh-product-croissant-v1.png',
  'dsh.product.milk.v1': 'legacy-preview/products/dsh-product-milk-v1.png',
  'dsh.product.pasta.v1': 'legacy-preview/products/dsh-product-pasta-v1.png',
  'dsh.product.roll.v1': 'legacy-preview/products/dsh-product-roll-v1.png',
  'dsh.product.lead-5.dates-box.v1': 'legacy-preview/products/dsh-product-lead-5-dates-box-v1.png',
  'dsh.product.salad.v1': 'legacy-preview/products/dsh-product-salad-v1.png',
  'dsh.product.yogurt.v1': 'legacy-preview/products/dsh-product-yogurt-v1.png',

  'dsh.store.hadda.cover.v1': 'legacy-preview/stores/dsh-store-hadda-cover-v1.png',
  'dsh.store.hittin.cover.v1': 'legacy-preview/stores/dsh-store-hittin-cover-v1.png',
  'dsh.store.malqa.cover.v1': 'legacy-preview/stores/dsh-store-malqa-cover-v1.png',
  'dsh.store.lead-5.cover.v1': 'legacy-preview/stores/dsh-store-lead-5-cover-v1.png',

  'dsh.store.hadda.logo.v1': 'legacy-preview/store_logos/dsh-store-hadda-logo-v1.png',
  'dsh.store.hittin.logo.v1': 'legacy-preview/store_logos/dsh-store-hittin-logo-v1.png',
  'dsh.store.malqa.logo.v1': 'legacy-preview/store_logos/dsh-store-malqa-logo-v1.png',
  'dsh.store.lead-5.logo.v1': 'legacy-preview/store_logos/dsh-store-lead-5-logo-v1.png',
  'dsh.brand.logo.v1': 'legacy-preview/store_logos/brand-logo.png',
  'dsh.proof.delivery.preview.v1': 'legacy-preview/banners/dsh-banner-home-promo-1-v1.png',
};

function publicPath(relativePath: string): string {
  return `${dshPublicMediaPrefix}${relativePath}`;
}

function categoryPublicPath(kind: 'main' | 'sub', key: string): string {
  const namespace = `dsh.category.${kind}.`;
  const id = key.substring(namespace.length).replace('.v1', '');
  return publicPath(`${dshLegacyPreviewPrefix}categories/${kind}/dsh-category-${kind}-${id}-v1.png`);
}

function bannerPublicPath(key: string): string {
  const slug = key.replace('dsh.banner.home.', '').replace('.v1', '');
  return publicPath(`${dshLegacyPreviewPrefix}banners/dsh-banner-home-${slug}-v1.png`);
}

export function getActualPublicMediaPath(key?: string | null): string {
  if (!key) return '';
  if (key.startsWith('http') || key.startsWith('//') || key.startsWith('/')) return key;
  if (key.startsWith('dsh.category.main.')) return categoryPublicPath('main', key);
  if (key.startsWith('dsh.category.sub.')) return categoryPublicPath('sub', key);
  if (key.startsWith('dsh.banner.home.')) return bannerPublicPath(key);
  const explicitPath = explicitPublicMediaPathByKey[key];
  return explicitPath ? publicPath(explicitPath) : '';
}

export function hasDshPublicMediaPath(key?: string | null): boolean {
  return getActualPublicMediaPath(key).length > 0;
}

export function getMediaKeyFromPublicPath(path: string): string | null {
  if (!path.startsWith(dshPublicMediaPrefix)) return null;
  const rel = path.substring(dshPublicMediaPrefix.length);
  const normalizedRel = rel.startsWith(dshLegacyPreviewPrefix) ? rel : `${dshLegacyPreviewPrefix}${rel}`;

  for (const [key, value] of Object.entries(explicitPublicMediaPathByKey)) {
    if (value === normalizedRel) return key;
  }

  if (normalizedRel.startsWith('legacy-preview/categories/main/dsh-category-main-')) {
    const id = normalizedRel.substring('legacy-preview/categories/main/dsh-category-main-'.length).replace('-v1.png', '');
    return `dsh.category.main.${id}.v1`;
  }
  if (normalizedRel.startsWith('legacy-preview/categories/sub/dsh-category-sub-')) {
    const id = normalizedRel.substring('legacy-preview/categories/sub/dsh-category-sub-'.length).replace('-v1.png', '');
    return `dsh.category.sub.${id}.v1`;
  }
  if (normalizedRel.startsWith('legacy-preview/banners/dsh-banner-home-')) {
    const slug = normalizedRel.substring('legacy-preview/banners/dsh-banner-home-'.length).replace('-v1.png', '');
    return `dsh.banner.home.${slug}.v1`;
  }

  return null;
}
