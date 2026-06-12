import type { ProductCardProps } from '@bthwani/ui-kit';

import type { DshStoreFixtureItem as DshStoreMenuItem } from '../../shared/dshStoreProductCardModel';

import { resolveDshRuntimeImageSource } from './resolve-runtime-image-source';

function extractPriceValue(label?: string): number | undefined {
	if (!label) return undefined;
	// Remove currency symbols and non-numeric chars, normalize comma to dot
	const cleaned = label.replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
	const parsed = parseFloat(cleaned);
	return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapMenuItemToProductCard(item: DshStoreMenuItem): ProductCardProps {
	return {
		id: item.id,
		title: item.name ?? '',
		subtitle: item.subtitle,
		imageSource: resolveDshRuntimeImageSource(item.imageUri),
		showImage: Boolean(item.imageUri),
		price: item.priceLabel ? { label: item.priceLabel, value: item.priceValue ?? extractPriceValue(item.priceLabel) } : undefined,
		oldPrice: item.oldPriceLabel ? { label: item.oldPriceLabel, value: item.oldPriceValue ?? extractPriceValue(item.oldPriceLabel) } : undefined,
		discountLabel: item.discountLabel,
		statusLabel: item.statusLabel,
		categoryLabel: item.categoryLabel,
		preparationTime: item.preparationTime,
		isFavorited: false,
	};
}
