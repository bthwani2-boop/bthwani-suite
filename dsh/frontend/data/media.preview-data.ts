import { getMarketingBannerItems, getMarketingVideoItems } from './marketing.preview-data';
import { dshHomeGetFixtureProducts, dshHomeGetFixtureStores } from './stores.preview-data';

export const dshMediaPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type DshPreviewMediaAsset = {
  id: string;
  ownerId: string;
  ownerKind: 'store' | 'product' | 'banner' | 'video';
  mediaKey: string;
};

export const dshPreviewMediaAssets: readonly DshPreviewMediaAsset[] = [
  ...dshHomeGetFixtureStores.flatMap((store) => (store.mediaKey ? [{ id: `media-${store.id}`, ownerId: store.id, ownerKind: 'store' as const, mediaKey: store.mediaKey }] : [])),
  ...dshHomeGetFixtureProducts.map((product) => ({ id: `media-${product.id}`, ownerId: product.id, ownerKind: 'product' as const, mediaKey: product.mediaKey })),
  ...getMarketingBannerItems().flatMap((banner) => (banner.imageUrl ? [{ id: `media-${banner.id}`, ownerId: banner.id, ownerKind: 'banner' as const, mediaKey: banner.imageUrl }] : [])),
  ...getMarketingVideoItems().map((video) => ({ id: `media-${video.id}`, ownerId: video.id, ownerKind: 'video' as const, mediaKey: video.thumbnailUrl })),
];
