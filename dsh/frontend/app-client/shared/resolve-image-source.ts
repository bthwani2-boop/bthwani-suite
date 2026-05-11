import type { ImageSourcePropType } from 'react-native';

const seedMediaSources: Record<string, ImageSourcePropType> = {
	'dsh.product.apple.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-apple-v1.png') as ImageSourcePropType,
	'dsh.product.bread.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-bread-v1.png') as ImageSourcePropType,
	'dsh.product.chicken.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-chicken-v1.png') as ImageSourcePropType,
	'dsh.product.choco.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-choco-v1.png') as ImageSourcePropType,
	'dsh.product.croissant.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-croissant-v1.png') as ImageSourcePropType,
	'dsh.product.milk.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-milk-v1.png') as ImageSourcePropType,
	'dsh.product.pasta.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-pasta-v1.png') as ImageSourcePropType,
	'dsh.product.roll.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-roll-v1.png') as ImageSourcePropType,
	'dsh.product.salad.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-salad-v1.png') as ImageSourcePropType,
	'dsh.product.yogurt.v1': require('../../media-fixtures/assets/seed/dsh/products/dsh-product-yogurt-v1.png') as ImageSourcePropType,
	'dsh.store.hadda.cover.v1': require('../../media-fixtures/assets/seed/dsh/stores/dsh-store-hadda-cover-v1.png') as ImageSourcePropType,
	'dsh.store.hittin.cover.v1': require('../../media-fixtures/assets/seed/dsh/stores/dsh-store-hittin-cover-v1.png') as ImageSourcePropType,
	'dsh.store.malqa.cover.v1': require('../../media-fixtures/assets/seed/dsh/stores/dsh-store-malqa-cover-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-1.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-1-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-2.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-2-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-3.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-3-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-4.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-4-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-5.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-5-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-6.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-6-v1.png') as ImageSourcePropType,
	'dsh.banner.home.promo-7.v1': require('../../media-fixtures/assets/seed/dsh/banners/dsh-banner-home-promo-7-v1.png') as ImageSourcePropType,
};

function resolveSeedMediaSource(source: keyof typeof seedMediaSources) {
	return seedMediaSources[source];
}

export function resolveDshImageSource(source?: string | ImageSourcePropType | null): ImageSourcePropType | undefined {
	if (!source) {
		return undefined;
	}

	if (typeof source !== 'string') {
		return source;
	}

	if (source.startsWith('dsh.')) {
		return resolveSeedMediaSource(source as keyof typeof seedMediaSources);
	}

	return { uri: source };
}
