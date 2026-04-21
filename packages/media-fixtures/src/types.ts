export type BthSeedMediaService = 'dsh' | 'shared';

export type BthSeedMediaRole =
  | 'store-cover'
  | 'product-image'
  | 'category-image'
  | 'banner'
  | 'offer-image'
  | 'empty-state';

export type BthSeedMediaFormat = 'png' | 'webp';

export type BthSeedMediaItem = {
  readonly key: string;
  readonly service: BthSeedMediaService;
  readonly role: BthSeedMediaRole;
  readonly format: BthSeedMediaFormat;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
  readonly relativePath: string;
  readonly description: string;
};
