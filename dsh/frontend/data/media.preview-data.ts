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

export type DshPreviewMediaOption = {
  value: string;
  label: string;
};

export const dshCommonMediaKeyOptions: readonly DshPreviewMediaOption[] = [
  { value: 'dsh.product.apple.v1', label: '🍎 تفاح' },
  { value: 'dsh.product.milk.v1', label: '🥛 حليب' },
  { value: 'dsh.product.bread.v1', label: '🍞 خبز' },
  { value: 'dsh.product.chicken.v1', label: '🍗 دجاج' },
  { value: 'dsh.product.pasta.v1', label: '🍝 باستا' },
  { value: 'dsh.product.choco.v1', label: '🍰 كيكة' },
  { value: 'dsh.product.roll.v1', label: '🌴 تمر (مؤقت)' },
  { value: 'dsh.product.lead-5.dates-box.v1', label: '🌴 علبة التمر الفاخرة' },
];

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
  ...getMarketingVideoItems().flatMap((video) => mediaAsset('video', video.id, video.posterUrl)),
  ...mediaAsset('brand', 'dsh-brand', 'dsh.brand.logo.v1'),
];
