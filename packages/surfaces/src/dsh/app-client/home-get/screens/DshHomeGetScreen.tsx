import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  BthBox,
  BthMobileScrollView,
  BthNewsTickerBar,
  BthStateView,
  BthText,
} from '@bthwani/ui-kit';

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  summaryTitle?: string;
  summarySubtitle?: string;
  tickerMessage?: string;
  promos?: DshHomeGetPromo[];
  stores?: DshHomeGetStore[];
  onOpenList?: () => void;
  onOpenFavorites?: () => void;
  onOpenSearch?: () => void;
  onOpenStore?: (storeId: string) => void;
  onReturnHome?: () => void;
  onRetry?: () => void;
};

type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new';

export type DshHomeGetPromo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type DshHomeGetStore = {
  id: string;
  name: string;
  address: string;
  statusLabel: string;
  statusTone: 'open' | 'closed';
  distanceLabel: string;
  deliveryLabel: string;
  serviceLabel: string;
  followerCount: number;
  multiplierLabel: string;
  offerLabel?: string;
  isFavorite: boolean;
  isFollowing: boolean;
  hasOffer?: boolean;
};

const defaultDiscoveryPromos: DshHomeGetPromo[] = [
  { id: 'promo-1', title: 'تخفيضات', subtitle: 'خصم 30% على أول طلب', icon: '🔥' },
  { id: 'promo-2', title: 'تتبّع مباشر', subtitle: 'خطوة واحدة إلى الطلب النشط', icon: '📍' },
  { id: 'promo-3', title: 'الفئات المختارة', subtitle: 'تصفح مختصر بدون ضوضاء', icon: '✨' },
];

const defaultDiscoveryStores: DshHomeGetStore[] = [
  {
    id: 'store-1001',
    name: 'مطعم القلعة',
    address: 'شارع التحرير، صنعاء',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '2.1 كم',
    deliveryLabel: 'توصيل مجاني',
    serviceLabel: 'بثواني برو',
    followerCount: 11000,
    multiplierLabel: 'x2',
    offerLabel: 'خصم 20%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
  },
  {
    id: 'store-1002',
    name: 'مطاعم الأرض الخضراء',
    address: 'شارع حدة، جوار البنك',
    statusLabel: 'مفتوح',
    statusTone: 'open',
    distanceLabel: '1.8 كم',
    deliveryLabel: 'كوبون',
    serviceLabel: 'استلم بنفسك',
    followerCount: 9000,
    multiplierLabel: 'x1',
    isFavorite: false,
    isFollowing: false,
    hasOffer: false,
  },
  {
    id: 'store-1003',
    name: 'مؤسسة الشيباني للمطاعم',
    address: 'شارع الزبيري، أمام الجامعة',
    statusLabel: 'مغلق',
    statusTone: 'closed',
    distanceLabel: '3.5 كم',
    deliveryLabel: 'توصيل سريع',
    serviceLabel: 'بثواني برو',
    followerCount: 9000,
    multiplierLabel: 'x3',
    offerLabel: 'خصم 15%',
    isFavorite: true,
    isFollowing: false,
    hasOffer: true,
  },
];

const discoveryFilters: Array<{ value: DiscoveryFilter; label: string; icon: string }> = [
  { value: 'all', label: 'الكل', icon: '☰' },
  { value: 'favorites', label: 'المفضلة', icon: '♡' },
  { value: 'nearest', label: 'الأقرب', icon: '⌖' },
  { value: 'new', label: 'الجديدة', icon: '✦' },
];

function renderState(state: Exclude<NonNullable<DshHomeGetScreenProps['state']>, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="لا توجد بيانات عرض بعد"
        description="أعد المحاولة لاستعادة واجهة DSH الرئيسية واختصاراتها."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="الواجهة الرئيسية موقوفة مؤقتاً"
        description="أبقِ المحاولة مرئية حتى تعود هذه الواجهة للخدمة."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="تعذر تحميل الواجهة الرئيسية"
      description="أعد المحاولة ثم انتقل إلى الفئات أو الطلبات إذا لزم."
      actionLabel="إعادة المحاولة"
      onActionPress={onRetry}
    />
  );
}

export function DshHomeGetScreen({
  state = 'ready',
  summaryTitle = 'توصيل DSH',
  summarySubtitle = 'تخطيط بصري مطابق لمسار الاكتشاف: بانر علوي، عرض نشط، شرائح حالة، وبطاقات متاجر غنية.',
  tickerMessage = 'المساحة مخصصة للشريط الإخباري • اطلب إلى المنزل أو افتح الطلب النشط خلال خطوة واحدة',
  promos = defaultDiscoveryPromos,
  stores = defaultDiscoveryStores,
  onOpenList,
  onOpenFavorites,
  onOpenSearch,
  onOpenStore,
  onReturnHome,
  onRetry,
}: DshHomeGetScreenProps) {
  const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);
  const [favoriteToggles, setFavoriteToggles] = React.useState<Record<string, boolean>>({});
  const [followToggles, setFollowToggles] = React.useState<Record<string, boolean>>({});
  const [followCounts, setFollowCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (promos.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActivePromoIndex((current) => (current + 1) % promos.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [promos]);

  const visibleStores = React.useMemo(() => {
    return stores.filter((store) => {
      const isFavorite = favoriteToggles[store.id] ?? store.isFavorite;

      if (activeFilter === 'favorites') {
        return isFavorite;
      }

      if (activeFilter === 'nearest') {
        return store.distanceLabel === '1.8 كم' || store.distanceLabel === '2.1 كم';
      }

      if (activeFilter === 'new') {
        return Boolean(store.hasOffer);
      }

      return true;
    });
  }, [activeFilter, favoriteToggles, stores]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  const activePromo = promos[activePromoIndex % promos.length] ?? defaultDiscoveryPromos[0];

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthNewsTickerBar statusLabel="مباشر" message={tickerMessage} onPress={onOpenSearch} />

      <View style={styles.carouselViewport}>
        <View style={styles.carouselStage} />
        <View style={styles.carouselDotsRow}>
          {promos.map((promo, index) => (
            <View
              key={promo.id}
              style={[styles.carouselDot, index === activePromoIndex && styles.carouselDotActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.heroRow}>
        <Pressable style={styles.heroPromoCard} onPress={onOpenSearch ?? onOpenList}>
          <View style={styles.heroPromoContent}>
            <View style={styles.heroPromoTextWrap}>
              <BthText role="bodySm" style={styles.heroTag}>
                {activePromo.title}
              </BthText>
              <BthText role="titleLg" style={styles.heroHeadline}>
                {activePromo.subtitle.replace('على أول طلب', '').trim()}
              </BthText>
              <BthText role="titleSm" style={styles.heroSubline}>
                على أول طلب
              </BthText>
            </View>

            <View style={styles.heroIconWrap}>
              <BthText role="titleLg" style={styles.heroIcon}>
                {activePromo.icon}
              </BthText>
            </View>
          </View>

          <View style={styles.heroPagerRow}>
            <View style={styles.heroPagerActive} />
          </View>
        </Pressable>

        <View style={styles.quickActionsColumn}>
          <Pressable style={styles.quickActionPrimary} onPress={onOpenSearch}>
            <BthText role="titleLg" style={styles.quickActionArrow}>◀</BthText>
          </Pressable>

          <View style={styles.quickActionBottomRow}>
            <Pressable style={styles.quickActionSecondary} onPress={onOpenList}>
              <BthText role="bodySm" style={styles.quickActionLabel}>الفئات</BthText>
            </Pressable>
            <Pressable style={styles.quickActionTertiary} onPress={onOpenSearch}>
              <BthText role="bodySm" style={styles.quickActionLabel}>فيديو</BthText>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable style={styles.returnHomePill} onPress={onReturnHome}>
        <BthText role="bodySm" style={styles.returnHomeText}>العودة للرئيسية</BthText>
      </Pressable>

      <View style={styles.filtersRow}>
        {discoveryFilters.map((filter) => {
          const isActive = filter.value === activeFilter;
          return (
            <Pressable
              key={filter.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <BthText role="bodySm" style={[styles.filterChipLabel, isActive && styles.filterChipLabelActive]}>
                {filter.icon} {filter.label}
              </BthText>
            </Pressable>
          );
        })}
      </View>

      <BthBox gap={3}>
        {visibleStores.map((store) => (
          <Pressable key={store.id} style={styles.storeCard} onPress={onOpenStore ? () => onOpenStore(store.id) : undefined}>
            <View style={styles.storeCardTopRow}>
              <View style={[styles.statusChip, store.statusTone === 'closed' && styles.statusChipClosed]}>
                <BthText role="bodySm" style={[styles.statusChipText, store.statusTone === 'closed' && styles.statusChipTextClosed]}>
                  {store.statusLabel}
                </BthText>
              </View>
              <View style={styles.storeImageStub}>
                {store.offerLabel ? (
                  <View style={styles.storeOfferRibbon}>
                    <BthText role="bodySm" style={styles.storeOfferRibbonText}>{store.offerLabel}</BthText>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.storeBodyRow}>
              <View style={styles.favoriteColumn}>
                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    setFavoriteToggles((current) => ({
                      ...current,
                      [store.id]: !(current[store.id] ?? store.isFavorite),
                    }));
                  }}
                >
                  <BthText
                    role="titleLg"
                    style={[
                      styles.favoriteHeart,
                      !(favoriteToggles[store.id] ?? store.isFavorite) && styles.favoriteHeartInactive,
                    ]}
                  >
                    ♥
                  </BthText>
                </Pressable>
              </View>

              <View style={styles.storeContentColumn}>
                <BthText role="titleLg" style={styles.storeTitle}>{store.name}</BthText>
                <BthText role="bodySm" style={styles.storeAddress}>{store.address}</BthText>
                <BthText role="bodyMd" style={styles.storeDistanceLine}>
                  {store.distanceLabel} · استلم بنفسك · توصيل المتجر
                </BthText>

                <View style={styles.storeMetaChipRow}>
                  <View style={styles.metaChip}>
                    <BthText role="bodySm" style={styles.metaChipText}>{store.deliveryLabel}</BthText>
                  </View>
                  <View style={[styles.metaChip, styles.metaChipBlue]}>
                    <BthText role="bodySm" style={styles.metaChipBlueText}>⚡ {store.serviceLabel}</BthText>
                  </View>
                  <View style={styles.metaChip}>
                    <BthText role="bodySm" style={styles.metaChipText}>أولوية</BthText>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.storeFooterRow}>
              <View style={styles.storeScorePill}>
                <BthText role="bodySm" style={styles.storeScoreText}>★</BthText>
              </View>
              <View style={styles.storeMultiplierPill}>
                <BthText role="bodySm" style={styles.storeMultiplierText}>{store.multiplierLabel}</BthText>
              </View>
              <BthText role="bodySm" style={styles.storeFollowersText}>
                {Math.round((followCounts[store.id] ?? store.followerCount) / 1000)} ألف
              </BthText>
              <Pressable
                hitSlop={8}
                style={[styles.storeFollowAdd, (followToggles[store.id] ?? store.isFollowing) && styles.storeFollowAdded]}
                onPress={() => {
                  const isFollowing = followToggles[store.id] ?? store.isFollowing;
                  const baseCount = followCounts[store.id] ?? store.followerCount;
                  setFollowToggles((current) => ({ ...current, [store.id]: !isFollowing }));
                  setFollowCounts((current) => ({
                    ...current,
                    [store.id]: isFollowing ? Math.max(0, baseCount - 1) : baseCount + 1,
                  }));
                }}
              >
                <BthText role="bodySm" style={styles.storeFollowAddText}>
                  {(followToggles[store.id] ?? store.isFollowing) ? '✓' : '＋'}
                </BthText>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </BthBox>
    </BthMobileScrollView>
  );
}

const styles = StyleSheet.create({
  carouselViewport: {
    gap: 14,
  },
  carouselStage: {
    height: 170,
    borderRadius: 22,
    backgroundColor: '#ffffff',
  },
  carouselDotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
  },
  carouselDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#d5d8df',
  },
  carouselDotActive: {
    width: 40,
    backgroundColor: '#ff6a00',
  },
  heroRow: {
    flexDirection: 'row-reverse',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  heroPromoCard: {
    flex: 1,
    minHeight: 130,
    borderRadius: 26,
    backgroundColor: '#f54747',
    paddingHorizontal: 22,
    paddingVertical: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  heroPromoContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  heroPromoTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  heroTag: {
    color: '#fff',
    fontWeight: '700',
  },
  heroHeadline: {
    color: '#fff',
    fontWeight: '800',
  },
  heroSubline: {
    color: '#ffd3d3',
    fontWeight: '700',
  },
  heroIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    color: '#fff',
  },
  heroPagerRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  heroPagerActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  quickActionsColumn: {
    width: 118,
    gap: 12,
  },
  quickActionPrimary: {
    minHeight: 86,
    borderRadius: 22,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  quickActionArrow: {
    color: '#fff',
    fontWeight: '800',
  },
  quickActionBottomRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  quickActionSecondary: {
    flex: 1,
    minHeight: 42,
    borderRadius: 20,
    backgroundColor: '#0d2f67',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTertiary: {
    flex: 1,
    minHeight: 42,
    borderRadius: 20,
    backgroundColor: '#ff6a00',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  returnHomePill: {
    alignSelf: 'center',
    minWidth: 292,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#dde2ea',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  returnHomeText: {
    color: '#5a6472',
    fontWeight: '700',
  },
  filtersRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: '#f1f3f7',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#ff6a00',
  },
  filterChipLabel: {
    color: '#4b5665',
    fontWeight: '700',
  },
  filterChipLabelActive: {
    color: '#fff',
  },
  storeCard: {
    borderWidth: 1.5,
    borderColor: '#d8dce4',
    borderRadius: 28,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  storeCardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statusChip: {
    minHeight: 34,
    borderRadius: 18,
    backgroundColor: '#eafff6',
    borderWidth: 1.5,
    borderColor: '#45d2a0',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipClosed: {
    backgroundColor: '#ffeded',
    borderColor: '#ff4f4f',
  },
  statusChipText: {
    color: '#15a26b',
    fontWeight: '700',
  },
  statusChipTextClosed: {
    color: '#d33939',
  },
  storeImageStub: {
    width: 94,
    height: 94,
    borderRadius: 18,
    backgroundColor: '#edf1f6',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  storeOfferRibbon: {
    backgroundColor: '#ff5b41',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  storeOfferRibbonText: {
    color: '#fff',
    fontWeight: '700',
  },
  storeBodyRow: {
    flexDirection: 'row-reverse',
    gap: 14,
  },
  favoriteColumn: {
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteHeart: {
    color: '#e22a2a',
  },
  favoriteHeartInactive: {
    color: '#c9cdd6',
  },
  storeContentColumn: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 5,
  },
  storeTitle: {
    color: '#1c2330',
    fontWeight: '800',
    textAlign: 'right',
  },
  storeAddress: {
    color: '#6d7584',
    textAlign: 'right',
  },
  storeDistanceLine: {
    color: '#5b6372',
    textAlign: 'right',
  },
  storeMetaChipRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  metaChip: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: '#eef1f6',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaChipText: {
    color: '#657082',
    fontWeight: '700',
  },
  metaChipBlue: {
    backgroundColor: '#d7efff',
  },
  metaChipBlueText: {
    color: '#2d74be',
    fontWeight: '800',
  },
  storeFooterRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    marginTop: 12,
  },
  storeScorePill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff1cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeScoreText: {
    color: '#d88a00',
  },
  storeMultiplierPill: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: '#f8b12b',
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeMultiplierText: {
    color: '#332300',
    fontWeight: '800',
  },
  storeFollowersText: {
    color: '#454f5c',
    fontWeight: '700',
  },
  storeFollowAdd: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeFollowAddText: {
    color: '#fff',
    fontWeight: '800',
  },
  storeFollowAdded: {
    backgroundColor: '#0d9b65',
  },
});

export default DshHomeGetScreen;