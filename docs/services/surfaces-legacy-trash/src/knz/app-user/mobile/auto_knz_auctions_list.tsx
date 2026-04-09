// KNZ Auctions List — قائمة المزادات، نقرة → KnzAuctionGet
// Surface: app-client | Service: knz
// مرجع: KNZ_ADDITIONS 1.5، KNZ_POLICY §4 — مسار واضح لمزاد أونلاين

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

const NS = 'knz.app-client.mobile.auto_knz_auctions_list';
const NS_COMMON = 'knz.app-client.mobile.common';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KnzPolicyDisclaimer } from './components/KnzPolicyDisclaimer';

interface AuctionItem {
  id: string;
  title: string;
  currentPrice: number;
  bidsCount: number;
  status: 'open' | 'closed';
  endsAt: string;
  sellerName: string;
}

interface auto_knz_auctions_listProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_auctions_list: React.FC<auto_knz_auctions_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const loadAuctions = useCallback(async () => {
    try {
      setState('loading');
      // Load from backend API when available (e.g. knz auctions list endpoint).
      setAuctions([]);
      setState('content');
    } catch {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAuctions().finally(() => setRefreshing(false));
  }, [loadAuctions]);

  const renderItem = ({ item }: { item: AuctionItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigate('KnzAuctionGet', { auctionId: item.id })}
      activeOpacity={0.7}
    >
      <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={[styles.statusBadge, item.status === 'open' ? styles.statusOpen : styles.statusClosed]}>
          <Text style={styles.statusText}>{item.status === 'open' ? t(`${NS}.open`) : t(`${NS}.closed`)}</Text>
        </View>
      </View>
      <View style={[styles.cardRow, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.cardLabel}>{t(`${NS}.currentPriceLabel`)}</Text>
        <Text style={styles.cardPrice}>{item.currentPrice.toLocaleString()} SAR</Text>
      </View>
      <View style={[styles.cardRow, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.cardLabel}>{t(`${NS}.bidsCountLabel`)}</Text>
        <Text style={styles.cardValue}>{item.bidsCount}</Text>
      </View>
      <Text style={styles.cardSeller}>{t(`${NS}.sellerLabel`)}: {item.sellerName}</Text>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t(`${NS}.headerTitle`)}</Text>
            <Text style={styles.headerSubtitle}>{t(`${NS}.headerSubtitle`)}</Text>
          </View>
          <View style={styles.policyWrap}>
            <KnzPolicyDisclaimer variant="auction" />
          </View>
          <FlatList
            data={auctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t(`${NS}.emptyText`)}</Text>
              </View>
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(`${NS}.loadingMessage`)}
      emptyMessage={t(`${NS}.emptyMessage`)}
      emptyActionText={t(`${NS}.emptyActionText`)}
      onEmptyAction={() => handleNavigate('KnzHome')}
      errorMessage={t(`${NS}.errorMessage`)}
      onErrorAction={loadAuctions}
      screenName="auto_knz_auctions_list"
      operationName="knz_listings_list"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.xs },
  headerSubtitle: { fontSize: 12, color: semanticRoles.textMuted },
  policyWrap: { paddingHorizontal: BTHWANI_SPACING.contentH, paddingTop: BTHWANI_SPACING.sm, paddingBottom: BTHWANI_SPACING.sm, backgroundColor: semanticRoles.surface },
  list: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl * 2 },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: BTHWANI_SPACING.sm },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: semanticRoles.text },
  statusBadge: { paddingHorizontal: BTHWANI_SPACING.sm, paddingVertical: 2, borderRadius: BTHWANI_RADIUS.sm },
  statusOpen: { backgroundColor: semanticRoles.success + '30' },
  statusClosed: { backgroundColor: semanticRoles.textMuted + '30' },
  statusText: { fontSize: 12, fontWeight: '600', color: semanticRoles.text },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: BTHWANI_SPACING.xs },
  cardLabel: { fontSize: 13, color: semanticRoles.textMuted },
  cardPrice: { fontSize: 14, fontWeight: '700', color: semanticRoles.primaryCTA },
  cardValue: { fontSize: 13, color: semanticRoles.text },
  cardSeller: { fontSize: 12, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.xs },
  empty: { padding: BTHWANI_SPACING.contentH, alignItems: 'center' },
  emptyText: { fontSize: 15, color: semanticRoles.textMuted },
});

export default auto_knz_auctions_list;

