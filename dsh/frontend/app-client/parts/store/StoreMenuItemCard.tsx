import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ProductCard } from '@bthwani/ui-kit';
import { type DshStoreMenuItem as DshStoreGetMenuItem } from '../../../shared/products';
import { canRenderInClientSurface } from '../../../shared/partner/partner.workflow';
import { mapMenuItemToProductCard } from '../../shared/map-menu-item-to-product-card';
import { resolveDshRuntimeImageSource } from '../../../shared/media/resolve-runtime-image-source';
import { normalizeDisplayText } from '../../../shared/stores';

export function resolveDshStoreMenuItemImageSource(item: DshStoreGetMenuItem): ImageSourcePropType | undefined {
	if (!canRenderInClientSurface(item.publishStage, 'product-media')) {
		return undefined;
	}
	return resolveDshRuntimeImageSource(item.imageUri);
}

export function MenuItemCard({
	item,
	partnerImageSource,
	onAddPress,
	onImagePress,
	onFavoritePress,
	isFavorited,
}: {
	item: DshStoreGetMenuItem;
	partnerImageSource?: ImageSourcePropType | string | null;
	onAddPress?: (anchor?: { x: number; y: number }) => void;
	onImagePress?: (item: DshStoreGetMenuItem) => void;
	onFavoritePress?: () => void;
	isFavorited?: boolean;
}) {
	const productCard = mapMenuItemToProductCard(item);

	return (
		<ProductCard
			{...productCard}
			title={normalizeDisplayText(productCard.title)}
			subtitle={normalizeDisplayText(productCard.subtitle)}
			statusLabel={normalizeDisplayText(item.statusLabel ?? productCard.statusLabel ?? '') || undefined}
			categoryLabel={normalizeDisplayText(item.categoryLabel ?? productCard.categoryLabel ?? '') || undefined}
			preparationTime={normalizeDisplayText(item.preparationTime ?? productCard.preparationTime ?? '') || undefined}
			imageSource={resolveDshStoreMenuItemImageSource(item)}
			partnerImageSource={partnerImageSource}
			onAdd={onAddPress}
			onImagePress={onImagePress ? () => onImagePress(item) : undefined}
			onFavorite={onFavoritePress}
			isFavorited={isFavorited}
		/>
	);
}
