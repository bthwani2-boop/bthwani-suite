export type SeedMediaService = 'dsh' | 'shared';

export type SeedMediaRole =
  | 'store-cover'
  | 'product-image'
  | 'category-image'
  | 'banner'
  | 'offer-image'
  | 'empty-state';

export type SeedMediaFormat = 'png' | 'webp';

export type SeedMediaItem = {
  readonly key: string;
  readonly service: SeedMediaService;
  readonly role: SeedMediaRole;
  readonly format: SeedMediaFormat;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;
  readonly relativePath: string;
  readonly description: string;
};
