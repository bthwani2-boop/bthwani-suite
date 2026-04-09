// Auto-generated screen for dsh_captain_orders_offers_list
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/captain/orders/offers
// Description: عروضي — قائمة الطلبات المعروضة على الكابتن (أقرب 5). الضغط يفتح شاشة القبول.

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { getDshCaptainOrderOffers } from '@bthwani/api-clients/dsh/dsh-captain-api';

export interface OfferItem {
  id: string;
  restaurant: string;
  total: number;
  itemsCount: number;
  orderTime: string;
}

interface AutoDshCaptainOrdersOffersListProps {
  navigation?: { navigate: (name: string, params?: Record<string, unknown>) => void };
}

function mapOfferToAcceptOrder(o: OfferItem, t: (key: string) => string) {
  return {
    id: o.id,
    customer_name: t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.customerLabel'),
    customer_phone: '',
    pickup_location: t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.pickupAddressLabel'),
    delivery_location: t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.deliveryAddressLabel'),
    total_amount: o.total,
    distance_km: 0,
    items_count: o.itemsCount,
    estimated_delivery: o.orderTime,
  };
}

export const AutoDshCaptainOrdersOffersList: React.FC<AutoDshCaptainOrdersOffersListProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOffers = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      const list = await getDshCaptainOrderOffers();
      setOffers(list);
      setHasActiveOrder(list && list.length > 0);
    } catch (e) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.errorMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleOfferPress = useCallback(
    (offer: OfferItem) => {
      const order = mapOfferToAcceptOrder(offer, t);
      navigation?.navigate('dsh_captain_order_accept', { orderId: offer.id, order });
    },
    [navigation, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: OfferItem }) => (
      <TouchableOpacity style={styles.card} onPress={() => handleOfferPress(item)} activeOpacity={0.7}>
        <Text style={styles.restaurant}>{item.restaurant}</Text>
        <Text style={styles.meta}>
          {item.total} ر.س · {item.itemsCount} صنف
        </Text>
      </TouchableOpacity>
    ),
    [handleOfferPress],
  );

  if (isLoading && offers.length === 0) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.centered}>
          <Text style={styles.muted}>{t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.loadingText')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state="content">
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadOffers()}>
            <Text style={styles.retryBtnText}>{t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.retryText')}</Text>
          </TouchableOpacity>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.centered}>
          {hasActiveOrder ? (
            <Text style={styles.activeOrderMessage}>
              لديك طلب قيد التوصيل. لا تظهر عروض جديدة حتى تسلّمه.
            </Text>
          ) : (
            <Text style={styles.muted}>{t('dsh.app-captain.mobile.auto_dsh_captain_orders_offers_list.emptyText')}</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadOffers(true)} colors={[semanticRoles.primaryCTA]} />
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  list: { padding: BTHWANI_SPACING.md },
  card: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  restaurant: { fontSize: 16, fontWeight: '700', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.xs },
  meta: { fontSize: 14, color: semanticRoles.textMuted },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: BTHWANI_SPACING.contentH },
  muted: { fontSize: 14, color: semanticRoles.textMuted },
  activeOrderMessage: { fontSize: 14, color: semanticRoles.text, textAlign: 'center', lineHeight: 22 },
  errorText: { fontSize: 14, color: semanticRoles.error, marginBottom: BTHWANI_SPACING.md, textAlign: 'center' },
  retryBtn: { paddingVertical: BTHWANI_SPACING.sm, paddingHorizontal: BTHWANI_SPACING.contentH },
  retryBtnText: { fontSize: 14, fontWeight: '600', color: semanticRoles.primaryCTA },
});

