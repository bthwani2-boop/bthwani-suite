import { dshCategoryFixtures } from './categories.preview-data';
import { getMarketingBannerItems, getMarketingVideoItems } from './marketing.preview-data';
import { dshHomeGetFixtureProducts, dshHomeGetFixtureStores } from './stores.preview-data';

export const dshMediaPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  ownership: 'dsh/frontend/data',
  mediaOwnership: 'dsh/frontend/media-fixtures',
} as const;

export type DshPreviewMediaOwnerKind =
  | 'store'
  | 'product'
  | 'banner'
  | 'video'
  | 'category'
  | 'subcategory'
  | 'storeLogo'
  | 'brand';

export type DshPreviewMediaAsset = {
  id: string;
  ownerId: string;
  ownerKind: DshPreviewMediaOwnerKind;
  mediaKey: string;
};

function mediaAsset(
  ownerKind: DshPreviewMediaOwnerKind,
  ownerId: string,
  mediaKey?: string | null,
): DshPreviewMediaAsset[] {
  if (!mediaKey || !mediaKey.startsWith('dsh.')) return [];
  return [
    {
      id: `media-${ownerKind}-${ownerId}`,
      ownerId,
      ownerKind,
      mediaKey,
    },
  ];
}

const categoryMediaAssets: DshPreviewMediaAsset[] = dshCategoryFixtures.flatMap((category) => [
  ...mediaAsset('category', category.id, category.mediaKey ?? category.imageUri),
  ...category.subcategories.flatMap((subcategory) =>
    mediaAsset('subcategory', subcategory.id, subcategory.mediaKey ?? subcategory.imageUri),
  ),
]);

export const dshPreviewMediaAssets: readonly DshPreviewMediaAsset[] = [
  ...dshHomeGetFixtureStores.flatMap((store) => mediaAsset('store', store.id, store.mediaKey)),
  ...dshHomeGetFixtureProducts.flatMap((product) => mediaAsset('product', product.id, product.mediaKey)),
  ...categoryMediaAssets,
  ...getMarketingBannerItems().flatMap((banner) => mediaAsset('banner', banner.id, banner.imageUrl)),
  ...getMarketingVideoItems().flatMap((video) => mediaAsset('video', video.id, video.thumbnailUrl)),
  ...mediaAsset('brand', 'dsh-brand', 'dsh.brand.logo.v1'),
];
