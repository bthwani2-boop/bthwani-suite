import React from 'react';
import {
  BthBox,
  BthButton,
  BthMobileScrollView,
  BthSearchField,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthTabs,
  BthText,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { HomeBannerCarousel, type HomeBannerCarouselItem } from '../../home/components/HomeBannerCarousel';
import { StoreCardPremium, type DshStoreCompactCardData } from '../../home/components/StoreCardPremium';

export type DshStoreListItem = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
  isOffer?: boolean;
  isFavorite?: boolean;
  isFollowing?: boolean;
  etaMinutes?: number;
  distanceKm?: number;
  rating?: number;
  imageUri?: string;
  deliveryLabel?: string;
  serviceLabel?: string;
  followerCount?: number;
  multiplierLabel?: string;
  subscriptionPackageChips?: string[];
  offerLabel?: string;
  hasBthwaniPro?: boolean;
  hasNewProducts?: boolean;
  hasCouponAvailable?: boolean;
  supportsPickup?: boolean;
  supportsPartnerDelivery?: boolean;
};

export type DshStoresListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error';
  items: DshStoreListItem[];
  banners?: HomeBannerCarouselItem[];
  query?: string;
  activeFilter?: 'all' | 'nearest' | 'offers' | 'favorites';
  onQueryChange?: (query: string) => void;
  onFilterChange?: (filter: 'all' | 'nearest' | 'offers' | 'favorites') => void;
  onOpenStore?: (storeId: string) => void;
  onOpenFavorites?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(
  state: 'loading' | 'empty' | 'error',
  storeText: ReturnType<typeof useUiText>['storeScreen'],
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title={storeText.states.listEmptyTitle}
        description={storeText.states.listEmptyDescription}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title={storeText.states.listErrorTitle}
      description={storeText.states.listErrorDescription}
      actionLabel={storeText.states.retry}
      onActionPress={onRetry}
    />
  );
}

export function DshStoresListScreen({
  state = 'ready',
  items,
  banners = [],
  query = '',
  activeFilter = 'all',
  onQueryChange,
  onFilterChange,
  onOpenStore,
  onOpenFavorites,
  onRetry,
}: DshStoresListScreenProps) {
  const { direction } = useDirection();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});
  const [bannerSearchVisible, setBannerSearchVisible] = React.useState(false);

  const filteredByMode = React.useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === 'nearest') {
        return (item.etaMinutes ?? 999) <= 22;
      }

      if (activeFilter === 'offers') {
        return Boolean(item.isOffer);
      }

      if (activeFilter === 'favorites') {
        return Boolean(item.isFavorite);
      }

      return true;
    });
  }, [activeFilter, items]);

  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return filteredByMode;
    }

    return filteredByMode.filter((item) => {
      const haystack = `${item.name} ${item.subtitle} ${item.meta}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [filteredByMode, query]);

  if (state !== 'ready') {
    return renderNonReadyState(state, storeText, onRetry);
  }

  if (filteredItems.length === 0) {
    return renderNonReadyState('empty', storeText, onRetry);
  }

  const buildCardItem = React.useCallback((item: DshStoreListItem): DshStoreCompactCardData => {
    const isFavorite = favoriteToggles[item.id] ?? item.isFavorite ?? false;
    const isFollowing = followToggles[item.id] ?? item.isFollowing ?? false;

    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      image: { uri: item.imageUri ?? '' },
      rating: item.rating ?? (item.isOffer ? 5 : 4.8),
      distanceKm: item.distanceKm ?? (item.etaMinutes != null ? Number((item.etaMinutes / 10).toFixed(1)) : null),
      isOpen: item.statusLabel.toLowerCase() !== 'closed' && item.statusLabel.toLowerCase() !== 'مغلق',
      supportsPickup: item.supportsPickup ?? true,
      supportsPartnerDelivery: item.supportsPartnerDelivery ?? true,
      serviceTokens: item.deliveryLabel || item.serviceLabel
        ? [{ label: item.deliveryLabel ?? 'توصيل سريع' }, { label: item.serviceLabel ?? 'توصيل برو' }]
        : undefined,
      isFavorite,
      isFollowing,
      followersCount: followCounts[item.id] ?? item.followerCount ?? 0,
      hasBthwaniPro: item.hasBthwaniPro ?? true,
      subscriptionPackageChips: item.subscriptionPackageChips,
      hasNewProducts: item.hasNewProducts ?? Boolean(item.isOffer),
      hasOffer: item.isOffer ?? Boolean(item.offerLabel),
      offerText: item.offerLabel ?? (item.isOffer ? 'عرض مباشر' : undefined),
      pointsMultiplier: item.multiplierLabel ? Number.parseInt(item.multiplierLabel.replace(/[^\d]/g, ''), 10) || undefined : undefined,
      hasCouponAvailable: item.hasCouponAvailable ?? !Boolean(item.isOffer),
    };
  }, [favoriteToggles, followCounts, followToggles]);

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <View style={styles.discoveryHeaderCard}>
        <View style={[styles.discoveryHeaderRow, direction === 'rtl' && styles.rowReverse]}>
          <View style={[styles.discoveryHeaderActions, direction === 'rtl' && styles.rowReverse]}>
            <Pressable style={styles.discoveryHeaderIconButton} onPress={() => setBannerSearchVisible((current) => !current)}>
              <Ionicons name="search-outline" size={18} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.discoveryHeaderIconButton} onPress={onOpenFavorites}>
              <Ionicons name="heart-outline" size={18} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.discoveryHeaderIconButton}>
              <Ionicons name="notifications-outline" size={18} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.discoveryHeaderIconButton}>
              <Ionicons name="time-outline" size={18} color="#ffffff" />
            </Pressable>
          </View>

          <View style={[styles.discoveryHeaderTextWrap, direction === 'rtl' && styles.discoveryHeaderTextWrapRtl]}>
            <BthText role="titleSm" style={styles.discoveryHeaderTitle}>{uiText.topBar.brandName}</BthText>
            <BthText role="bodySm" style={styles.discoveryHeaderSubtitle}>{storeText.list.headerSubtitle}</BthText>
          </View>
        </View>

        <View style={[styles.discoveryHeaderChipsRow, direction === 'rtl' && styles.rowReverse]}>
          <View style={styles.discoveryHeaderChipPrimary}>
            <BthText role="bodySm" style={styles.discoveryHeaderChipPrimaryText} numberOfLines={1}>
              {storeText.list.headerChipPrimary}
            </BthText>
          </View>
          <View style={styles.discoveryHeaderChipAccent}>
            <BthText role="bodySm" style={styles.discoveryHeaderChipAccentText} numberOfLines={1}>
              {storeText.list.headerChipAccent}
            </BthText>
          </View>
          <View style={styles.discoveryHeaderChipMuted}>
            <BthText role="bodySm" style={styles.discoveryHeaderChipMutedText} numberOfLines={1}>
              {storeText.list.headerChipMuted}
            </BthText>
          </View>
        </View>
      </View>

      {banners.length > 0 ? (
        <View style={styles.bannerViewport}>
          <HomeBannerCarousel banners={banners} height={154} />
        </View>
      ) : null}

      {bannerSearchVisible ? (
        <BthSurface tone="inset" gap={3}>
          <BthSearchField
            label={storeText.list.searchLabel}
            value={query}
            onChangeText={onQueryChange}
            hint={storeText.list.searchHint}
          />
        </BthSurface>
      ) : null}

      <BthSurface tone="inset" gap={3}>
        <BthTabs
          items={[
            { value: 'all', label: storeText.filters.all },
            { value: 'nearest', label: storeText.filters.nearest },
            { value: 'offers', label: storeText.filters.offers },
            { value: 'favorites', label: storeText.filters.favorites },
          ]}
          value={activeFilter}
          onValueChange={(next) => onFilterChange?.(next)}
          variant="pill"
        />
        <BthButton label={storeText.list.favoritesCta} tone="ghost" onPress={onOpenFavorites} />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title={storeText.list.sectionTitle}
          subtitle={storeText.list.sectionSubtitle}
          count={filteredItems.length}
        />
        <BthText role="caption" tone="muted">
          {storeText.list.sectionHint}
        </BthText>
        <BthBox gap={2}>
          {filteredItems.map((item) => (
            <StoreCardPremium
              key={item.id}
              item={buildCardItem(item)}
              onPress={onOpenStore}
              onPressSubscriptionChip={onOpenStore ? () => onOpenStore(item.id) : undefined}
              onToggleFavorite={(storeId) => {
                setFavoriteToggles((current) => ({
                  ...current,
                  [storeId]: !(current[storeId] ?? item.isFavorite ?? false),
                }));
              }}
              onToggleFollow={(storeId) => {
                const currentFollow = followToggles[storeId] ?? item.isFollowing ?? false;
                const baseCount = followCounts[storeId] ?? item.followerCount ?? 0;

                setFollowToggles((current) => ({ ...current, [storeId]: !currentFollow }));
                setFollowCounts((current) => ({
                  ...current,
                  [storeId]: currentFollow ? Math.max(0, baseCount - 1) : baseCount + 1,
                }));
              }}
            />
          ))}
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  bannerViewport: {
    marginTop: -2,
  },
  discoveryHeaderCard: {
    backgroundColor: '#ff6a00',
    borderRadius: 28,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  discoveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  discoveryHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discoveryHeaderIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoveryHeaderTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  discoveryHeaderTextWrapRtl: {
    alignItems: 'flex-start',
  },
  discoveryHeaderTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 16,
  },
  discoveryHeaderSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  discoveryHeaderChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discoveryHeaderChipPrimary: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  discoveryHeaderChipPrimaryText: {
    color: '#ff6a00',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'right',
  },
  discoveryHeaderChipAccent: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 94,
  },
  discoveryHeaderChipAccentText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  discoveryHeaderChipMuted: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  discoveryHeaderChipMutedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
});