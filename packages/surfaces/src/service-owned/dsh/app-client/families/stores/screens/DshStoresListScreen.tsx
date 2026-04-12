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
} from '@bthwani/ui-kit';
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
  query?: string;
  activeFilter?: 'all' | 'nearest' | 'offers' | 'favorites';
  onQueryChange?: (query: string) => void;
  onFilterChange?: (filter: 'all' | 'nearest' | 'offers' | 'favorites') => void;
  onOpenStore?: (storeId: string) => void;
  onOpenFavorites?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(state: 'loading' | 'empty' | 'error', onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No stores found"
        description="Try another filter or search term."
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Stores list is unavailable"
      description="Retry to restore discovery continuity."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshStoresListScreen({
  state = 'ready',
  items,
  query = '',
  activeFilter = 'all',
  onQueryChange,
  onFilterChange,
  onOpenStore,
  onOpenFavorites,
  onRetry,
}: DshStoresListScreenProps) {
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});

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
    return renderNonReadyState(state, onRetry);
  }

  if (filteredItems.length === 0) {
    return renderNonReadyState('empty', onRetry);
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
      <BthBox gap={2}>
        <BthText role="titleLg">Stores discovery</BthText>
        <BthText role="bodySm" tone="muted">
          Keep store selection compact and one-tap to details.
        </BthText>
      </BthBox>

      <BthSurface tone="inset" gap={3}>
        <BthSearchField
          label="Find store"
          value={query}
          onChangeText={onQueryChange}
          hint="Search by store name or category subtitle."
        />
        <BthTabs
          items={[
            { value: 'all', label: 'All' },
            { value: 'nearest', label: 'Nearest' },
            { value: 'offers', label: 'Offers' },
            { value: 'favorites', label: 'Favorites' },
          ]}
          value={activeFilter}
          onValueChange={(next) => onFilterChange?.(next)}
          variant="pill"
        />
        <BthButton label="Open favorites" tone="ghost" onPress={onOpenFavorites} />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Available stores"
          subtitle="Open store details to continue the delivery journey."
          count={filteredItems.length}
        />
        <BthText role="caption" tone="muted">
          Premium cards keep rating, follow, favorite, and offer state visible in one glance.
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