import * as React from 'react';
import type { DiscoveryFilter } from '../contracts/dsh-home-types';
import { buildHomeCategoryFilterId } home-search-helpers';

type HomeDialAnchorLayout = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function useHomeState() {
	const [categoriesSheetVisible, setCategoriesSheetVisible] = React.useState(false);
	const [categoriesDialLayout, setCategoriesDialLayout] = React.useState<HomeDialAnchorLayout | null>(null);
	const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
	const [activeCategoryId, setActiveCategoryId] = React.useState<string>('all');
	const [activeRailItemId, setActiveRailItemId] = React.useState<string>(buildHomeCategoryFilterId('all'));
	const [activeSubcategoryId, setActiveSubcategoryId] = React.useState<string | null>(null);
	const [activePromoIndex, setActivePromoIndex] = React.useState(0);
	const [localFavoriteToggles, setLocalFavoriteToggles] = React.useState<Record<string, boolean>>({});
	const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
	const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});
	const [shortsVisible, setShortsVisible] = React.useState(false);
	const [currentTime, setCurrentTime] = React.useState(() => new Date());
	const [inlineSearchVisible, setInlineSearchVisible] = React.useState(false);
	const [inlineSearchQuery, setInlineSearchQuery] = React.useState('');
	const [serviceDialVisible, setServiceDialVisible] = React.useState(false);
	const [isTickerHidden, setIsTickerHidden] = React.useState(false);

	return {
		categoriesSheetVisible,
		setCategoriesSheetVisible,
		categoriesDialLayout,
		setCategoriesDialLayout,
		activeFilter,
		setActiveFilter,
		activeCategoryId,
		setActiveCategoryId,
		activeRailItemId,
		setActiveRailItemId,
		activeSubcategoryId,
		setActiveSubcategoryId,
		activePromoIndex,
		setActivePromoIndex,
		localFavoriteToggles,
		setLocalFavoriteToggles,
		followToggles,
		setFollowToggles,
		followCounts,
		setFollowCounts,
		shortsVisible,
		setShortsVisible,
		currentTime,
		setCurrentTime,
		inlineSearchVisible,
		setInlineSearchVisible,
		inlineSearchQuery,
		setInlineSearchQuery,
		serviceDialVisible,
		setServiceDialVisible,
		isTickerHidden,
		setIsTickerHidden,
	};
}
