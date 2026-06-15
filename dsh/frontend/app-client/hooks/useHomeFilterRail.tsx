import * as React from 'react';
import type { StyleProp, ImageStyle, TextStyle } from 'react-native';
import { Icon, type BThwaniFilterRailItem } from '@bthwani/ui-kit';
import { CategoryIconImage } from '../parts/home/HomeCategoryCarousel';
import {
  DSH_CATEGORY_ICONS as categoryIconMap,
  DSH_SUBCATEGORY_ICONS as subcategoryIconMap,
} from '../../shared/catalog/catalog.icons';
import { DSH_HOME_DISCOVERY_FILTERS as discoveryFilters } from '../../shared/discovery/home-service-config';
import { getDshCategoryIconUrl } from '../../shared/catalog/catalog.icon-url';
import {
  buildHomeCategoryFilterId,
  buildHomeModeFilterId,
  HOME_CATEGORY_FILTER_PREFIX,
  HOME_MODE_FILTER_PREFIX,
} from '../../shared/discovery/home-search-helpers';
import type { DiscoveryFilter, DshHomeCategory } from '../../shared/discovery/dsh-home-types';
import { useFeatureFlag } from '../../platform';

export function useHomeFilterRail({
  theme,
  styles,
  categoryItems: rawCategoryItems,
  activeFilter,
  setActiveFilter,
  activeCategoryId,
  activeRailItemId,
  setActiveRailItemId,
  selectCategoryPage,
  onOpenCategory,
  onOpenSheinInfo,
}: {
  theme: { textInverse: string; textMuted: string };
  styles: { filterChipIcon: StyleProp<ImageStyle | TextStyle> };
  categoryItems: DshHomeCategory[];
  activeFilter: DiscoveryFilter;
  setActiveFilter: (val: DiscoveryFilter) => void;
  activeCategoryId: string | null;
  activeRailItemId: string;
  setActiveRailItemId: (val: string) => void;
  selectCategoryPage: (id: string) => void;
  onOpenCategory?: (id: string) => void;
  onOpenSheinInfo?: () => void;
}) {
  const isAwnakEnabled = useFeatureFlag('DSH:capability:awnak');

  const categoryItems = React.useMemo(() => {
    if (isAwnakEnabled) return rawCategoryItems;
    return rawCategoryItems.filter((cat) => cat.id !== 'awnak');
  }, [rawCategoryItems, isAwnakEnabled]);

  const selectedCategory = React.useMemo(
    () =>
      activeCategoryId && activeCategoryId !== 'all'
        ? categoryItems.find((category) => category.id === activeCategoryId) ?? null
        : null,
    [activeCategoryId, categoryItems],
  );
  const selectedCategoryLabel = selectedCategory?.label ?? 'الفئات';
  const selectedSubcategories = React.useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );
  const allCategoryRailItems = React.useMemo(
    () =>
      categoryItems.map((category) => ({
        ...category,
        iconUrl: getDshCategoryIconUrl(category.id),
        icon: categoryIconMap[category.id] ?? '📂',
        mediaKey: category.mediaKey,
      })),
    [categoryItems],
  );
  const categoriesDialItems = React.useMemo(
    () =>
      categoryItems.map((category) => ({
        id: category.id,
        key: category.id,
        title: category.label,
        subtitle: category.subtitle,
        // mediaKey threads category identity to DshCategoryOrbitCarouselBase.
        mediaKey: category.mediaKey,
        iconUrl: getDshCategoryIconUrl(category.id),
        emojiFallback: category.emojiFallback ?? categoryIconMap[category.id] ?? '📂',
      })),
    [categoryItems],
  );
  const activeCategoryDialItem = React.useMemo(() => {
    if (!selectedCategory) return null;
    return {
      id: selectedCategory.id,
      key: selectedCategory.id,
      title: selectedCategoryLabel,
      subtitle: selectedCategory.subtitle,
      mediaKey: selectedCategory.mediaKey,
      iconUrl: getDshCategoryIconUrl(selectedCategory.id),
      emojiFallback: selectedCategory.emojiFallback ?? categoryIconMap[selectedCategory.id] ?? '📂',
    };
  }, [selectedCategory, selectedCategoryLabel]);
  const selectedSubcategoryCards = React.useMemo(
    () =>
      selectedSubcategories.map((subcategory) => ({
        id: subcategory.id,
        title: subcategory.label,
        subtitle: subcategory.subtitle,
        emoji: subcategoryIconMap[subcategory.id] ?? '📂',
      })),
    [selectedSubcategories],
  );

  const homeFilterRailItems = React.useMemo<BThwaniFilterRailItem[]>(
    () => [
      {
        id: buildHomeCategoryFilterId('all'),
        label: 'الكل',
        icon: ({ selected }: { selected: boolean }) => (
          <Icon
            name="menu-outline"
            size={16}
            color={selected ? theme.textInverse : theme.textMuted}
          />
        ),
      },
      ...discoveryFilters
        .filter((filter) => filter.value !== 'all')
        .map((filter) => ({
          id: buildHomeModeFilterId(filter.value),
          label: filter.label,
          icon: ({ selected }: { selected: boolean }) => (
            <Icon
              name={filter.iconName as React.ComponentProps<typeof Icon>['name']}
              size={16}
              color={selected ? theme.textInverse : theme.textMuted}
            />
          ),
        })),
      ...allCategoryRailItems
        .filter((category) => category.id !== 'all')
        .map((category) => ({
          id: buildHomeCategoryFilterId(category.id),
          label: category.label,
          icon: (
            <CategoryIconImage
              uri={category.iconUrl ?? null}
              emojiFallback={category.icon}
              style={styles.filterChipIcon}
            />
          ),
        })),
    ],
    [allCategoryRailItems, styles.filterChipIcon, theme.textInverse, theme.textMuted],
  );

  const handleHomeFilterRailChange = React.useCallback((itemId: string) => {
    setActiveRailItemId(itemId);

    if (itemId.startsWith(HOME_MODE_FILTER_PREFIX)) {
      setActiveFilter(itemId.slice(HOME_MODE_FILTER_PREFIX.length) as DiscoveryFilter);
      return;
    }

    if (itemId.startsWith(HOME_CATEGORY_FILTER_PREFIX)) {
      const categoryId = itemId.slice(HOME_CATEGORY_FILTER_PREFIX.length);
      selectCategoryPage(categoryId);

      if (categoryId === 'awnak') {
        onOpenCategory?.('awnak');
      }

      if (categoryId === 'shein') {
        onOpenSheinInfo?.();
      }
    }
  }, [onOpenCategory, onOpenSheinInfo, selectCategoryPage, setActiveFilter, setActiveRailItemId]);

  const isHomeFilterRailItemSelected = React.useCallback((item: BThwaniFilterRailItem) => {
    if (item.id.startsWith(HOME_MODE_FILTER_PREFIX)) {
      return item.id === buildHomeModeFilterId(activeFilter);
    }

    if (item.id.startsWith(HOME_CATEGORY_FILTER_PREFIX)) {
      return item.id === buildHomeCategoryFilterId(activeCategoryId || '');
    }

    return false;
  }, [activeCategoryId, activeFilter]);

  React.useEffect(() => {
    const categoryRailItemId = buildHomeCategoryFilterId(activeCategoryId || 'all');
    if (activeRailItemId.startsWith(HOME_CATEGORY_FILTER_PREFIX) && activeRailItemId !== categoryRailItemId) {
      setActiveRailItemId(categoryRailItemId);
    }
  }, [activeCategoryId, activeRailItemId, setActiveRailItemId]);

  React.useEffect(() => {
    if (!homeFilterRailItems.some((item) => item.id === activeRailItemId)) {
      setActiveRailItemId(buildHomeCategoryFilterId(activeCategoryId || 'all'));
    }
  }, [activeCategoryId, activeRailItemId, homeFilterRailItems, setActiveRailItemId]);

  return {
    allCategoryRailItems,
    selectedCategory,
    selectedCategoryLabel,
    categoriesDialItems,
    activeCategoryDialItem,
    selectedSubcategoryCards,
    homeFilterRailItems,
    handleHomeFilterRailChange,
    isHomeFilterRailItemSelected,
  };
}
