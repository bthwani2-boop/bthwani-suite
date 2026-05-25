import * as React from 'react';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';

export function useStoreState() {
	const [selectedMode, setSelectedMode] = React.useState<DshFulfillmentDeliveryMode>('bthwani_delivery');
	const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
	const [pickerItem, setPickerItem] = React.useState<DshStoreGetMenuItem | null>(null);
	const [selectedMeasureOption, setSelectedMeasureOption] = React.useState<string | null>(null);
	const [selectedMeasureQty, setSelectedMeasureQty] = React.useState(1);
	const [pickerAnchor, setPickerAnchor] = React.useState({ x: 32, y: 360 });
	const [headerSearchVisible, setHeaderSearchVisible] = React.useState(false);
	const [headerSearchQuery, setHeaderSearchQuery] = React.useState('');
	const [addedItemLabel, setAddedItemLabel] = React.useState('');
	const [previewItem, setPreviewItem] = React.useState<DshStoreGetMenuItem | null>(null);
	const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());
	const [isAddedToCart, setIsAddedToCart] = React.useState(false);
	const [stickyThreshold, setStickyThreshold] = React.useState(1000);
	const [previewActiveIndex, setPreviewActiveIndex] = React.useState(-1);

	return {
		selectedMode,
		setSelectedMode,
		selectedCategory,
		setSelectedCategory,
		pickerItem,
		setPickerItem,
		selectedMeasureOption,
		setSelectedMeasureOption,
		selectedMeasureQty,
		setSelectedMeasureQty,
		pickerAnchor,
		setPickerAnchor,
		headerSearchVisible,
		setHeaderSearchVisible,
		headerSearchQuery,
		setHeaderSearchQuery,
		addedItemLabel,
		setAddedItemLabel,
		previewItem,
		setPreviewItem,
		favoriteIds,
		setFavoriteIds,
		isAddedToCart,
		setIsAddedToCart,
		stickyThreshold,
		setStickyThreshold,
		previewActiveIndex,
		setPreviewActiveIndex,
	};
}
