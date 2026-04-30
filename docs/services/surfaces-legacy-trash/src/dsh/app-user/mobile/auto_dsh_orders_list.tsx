// Auto-generated screen for dsh_orders_list
// Surface: app-client | Service: dsh
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { DshDeliveryModeId, DshDeliveryModeFilterKey } from '../../deliveryModes';
import { rawFetch } from '@bthwani/api-clients';
import {
  DSH_FILTER_KEY_TO_MODE_ID,
  getDshDeliveryModes,
  getDeliveryModeLabelByFilterKey,
} from '../../deliveryModes';

interface Order {
  id: string;
  restaurant: string;
  status: 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: string;
  total: number;
  itemsCount: number;
  deliveryTime?: string;
  /** نمط التوصيل: استلم بنفسك / توصيل المنصة / توصيل الشريك / دارك ستور */
  deliveryMode?: DshDeliveryModeId;
}

interface auto_dsh_orders_listProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_dsh_orders_list: React.FC<auto_dsh_orders_listProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const deliveryModes = useMemo(() => getDshDeliveryModes(t), [t]);
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [serviceMode, setServiceMode] = useState<DshDeliveryModeFilterKey>('all');
  const [orders, setOrders] = useState<Order[]>([]);

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  useEffect(() => {
    const loadOrders = async () => {
      setState('loading');
      try {
        const url = `${getBaseUrl()}/api/dsh/orders?limit=50&offset=0`;
        const res = await rawFetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'Fetch failed');
        const list = (json?.data?.orders ?? []) as Order[];
        setOrders(list);
        setState(list.length ? 'content' : 'empty');
      } catch {
        setOrders([]);
        setState('error');
      }
    };

    void loadOrders();
  }, []);

  const handleRetry = () => {
    setState('loading');
    (async () => {
      try {
        const url = `${getBaseUrl()}/api/dsh/orders?limit=50&offset=0`;
        const res = await rawFetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'Fetch failed');
        const list = (json?.data?.orders ?? []) as Order[];
        setOrders(list);
        setState(list.length ? 'content' : 'empty');
      } catch {
        setOrders([]);
        setState('error');
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return semanticRoles.stateWarning.icon;
      case 'ready': return semanticRoles.stateInfo.icon;
      case 'delivered': return semanticRoles.stateSuccess.icon;
      case 'cancelled': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return t('dsh.app-client.mobile.auto_dsh_orders_list.statusPreparing');
      case 'ready': return t('dsh.app-client.mobile.auto_dsh_orders_list.statusReady');
      case 'delivered': return t('dsh.app-client.mobile.auto_dsh_orders_list.statusDelivered');
      case 'cancelled': return t('dsh.app-client.mobile.auto_dsh_orders_list.statusCancelled');
      default: return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') {
      // only status filter
    } else if (filter === 'active') {
      if (order.status !== 'preparing' && order.status !== 'ready') return false;
    } else if (filter === 'completed') {
      if (order.status !== 'delivered' && order.status !== 'cancelled') return false;
    }
    // وضع خدمة الطلب: الكل / توصيل الشريك / توصيل المنصة / استلم بنفسك / دارك ستور
    if (serviceMode === 'all') return true;
    const wantedModeId = DSH_FILTER_KEY_TO_MODE_ID[serviceMode];
    const orderMode = order.deliveryMode;
    if (orderMode == null) return false; // طلبات قديمة بدون deliveryMode تظهر فقط عند filterAll
    return orderMode === wantedModeId;
  });

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusColor = getStatusColor(item.status);
    const isActive = item.status === 'preparing' || item.status === 'ready';

    return (
      <TouchableOpacity
        style={[styles.orderCard, isActive && styles.orderCardActive]}
        onPress={() => handleNavigate('DshOrderGet')}
        activeOpacity={0.7}
      >
      <View style={[styles.orderHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={styles.orderInfo}>
            <View style={[styles.restaurantRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.restaurantIcon}>🍽️</Text>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {item.restaurant}
                </Text>
          <Text style={styles.orderId}>{item.id}</Text>
        </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.statusDot} />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={[styles.detailItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailLabel}>وقت الطلب:</Text>
          <Text style={styles.detailValue}>{item.orderTime}</Text>
            </View>
        </View>
        <View style={[styles.detailRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={[styles.detailItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.detailIcon}>📦</Text>
          <Text style={styles.detailLabel}>عدد الأصناف:</Text>
          <Text style={styles.detailValue}>{item.itemsCount} أصناف</Text>
        </View>
        {item.deliveryTime && (
              <View style={[styles.detailItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.detailIcon}>⏱️</Text>
                <Text style={styles.detailLabel}>التوصيل:</Text>
            <Text style={styles.detailValue}>{item.deliveryTime}</Text>
          </View>
        )}
          </View>
      </View>

      <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{t('dsh.app-client.mobile.auto_dsh_orders_list.totalLabel')}</Text>
        <Text style={styles.orderTotal}>{item.total} ريال</Text>
          </View>
          <View style={[styles.actionButtons, { flexDirection: 'row', direction: layoutDirection }]}>
            {!isActive && (
              <TouchableOpacity
                style={styles.reorderButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleNavigate('DshStoresList');
                }}
              >
                <Text style={styles.reorderButtonText}>{t('dsh.app-client.mobile.auto_dsh_orders_list.reorderButtonText')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.viewDetailsButton, isActive && styles.viewDetailsButtonActive]}
              onPress={(e) => {
                e.stopPropagation();
                if (isActive) {
                  handleNavigate('DshOrderStatusGet', { orderId: item.id });
                } else {
                  handleNavigate('DshOrderGet', { orderId: item.id });
                }
              }}
            >
              <Text style={styles.viewDetailsText}>
                {isActive ? t('dsh.app-client.mobile.auto_dsh_orders_list.trackOrderText') : t('dsh.app-client.mobile.auto_dsh_orders_list.viewDetailsText')}
              </Text>
        </TouchableOpacity>
          </View>
      </View>
    </TouchableOpacity>
  );
  };

  if (state === 'content') {
    const activeCount = orders.filter(
      (o) => o.status === 'preparing' || o.status === 'ready'
    ).length;
    const completedCount = orders.filter(
      (o) => o.status === 'delivered' || o.status === 'cancelled'
    ).length;

    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_orders_list.title')}</Text>
              <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_orders_list.subtitle')}</Text>
            </View>
            <TouchableOpacity
              style={[styles.primaryButton, { flexDirection: 'row', direction: layoutDirection }]}
              onPress={() => handleNavigate('DshOrderCreate')}
            >
              <Text style={styles.primaryButtonIcon}>➕</Text>
              <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_orders_list.primaryButtonText')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.filterTabs, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.activeFilterTab, { flexDirection: 'row', direction: layoutDirection }]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                {t('dsh.app-client.mobile.auto_dsh_orders_list.filterAll')}
              </Text>
              <View style={[styles.filterBadge, filter === 'all' && styles.activeFilterBadge]}>
                <Text
                  style={[
                    styles.filterBadgeText,
                    filter === 'all' && styles.activeFilterBadgeText,
                  ]}
                >
                  {orders.length}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'active' && styles.activeFilterTab, { flexDirection: 'row', direction: layoutDirection }]}
              onPress={() => setFilter('active')}
            >
              <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
                {t('dsh.app-client.mobile.auto_dsh_orders_list.filterActive')}
              </Text>
              <View style={[styles.filterBadge, filter === 'active' && styles.activeFilterBadge]}>
                <Text
                  style={[
                    styles.filterBadgeText,
                    filter === 'active' && styles.activeFilterBadgeText,
                  ]}
                >
                  {activeCount}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab, { flexDirection: 'row', direction: layoutDirection }]}
              onPress={() => setFilter('completed')}
            >
              <Text
                style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}
              >
                {t('dsh.app-client.mobile.auto_dsh_orders_list.filterCompleted')}
              </Text>
              <View
                style={[styles.filterBadge, filter === 'completed' && styles.activeFilterBadge]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    filter === 'completed' && styles.activeFilterBadgeText,
                  ]}
                >
                  {completedCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* وضع خدمة الطلب: الكل / توصيل الشريك / توصيل المنصة / استلم بنفسك / دارك ستور */}
          <View style={[styles.serviceModeRow, { flexDirection: 'row', direction: layoutDirectionReverse }]}>
            <TouchableOpacity
              style={[
                styles.serviceModeChip,
                serviceMode === 'all' && styles.serviceModeChipActive,
              ]}
              onPress={() => setServiceMode('all')}
            >
              <Text
                style={[
                  styles.serviceModeText,
                  serviceMode === 'all' && styles.serviceModeTextActive,
                ]}
              >
                {t('dsh.app-client.mobile.auto_dsh_orders_list.filterAll')}
              </Text>
            </TouchableOpacity>
            {(['store', 'platform', 'pickup', 'darkstore'] as const).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.serviceModeChip,
                  serviceMode === key && styles.serviceModeChipActive,
                ]}
                onPress={() => setServiceMode(key)}
              >
                <Text
                  style={[
                    styles.serviceModeText,
                    serviceMode === key && styles.serviceModeTextActive,
                  ]}
                >
                  {getDeliveryModeLabelByFilterKey(deliveryModes, key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyText}>{t('dsh.app-client.mobile.auto_dsh_orders_list.emptyText')}</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => handleNavigate('DshOrderCreate')}
                >
                  <Text style={styles.emptyButtonText}>{t('dsh.app-client.mobile.auto_dsh_orders_list.emptyButtonText')}</Text>
                </TouchableOpacity>
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
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_orders_list.loadingMessage')}
      emptyMessage={t('dsh.app-client.mobile.auto_dsh_orders_list.emptyMessage')}
      emptyActionText={t('dsh.app-client.mobile.auto_dsh_orders_list.emptyActionText')}
      onEmptyAction={() => handleNavigate('DshOrderCreate')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_orders_list.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_orders_list"
      operationName="dsh_orders_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  titleContainer: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
  },
  primaryButtonIcon: {
    fontSize: 16,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xs,
    gap: BTHWANI_SPACING.xs,
  },
  serviceModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  serviceModeChip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
  },
  serviceModeChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  serviceModeText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  serviceModeTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
  },
  activeFilterTab: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  activeFilterText: {
    color: semanticRoles.primaryCTAText,
  },
  filterBadge: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: semanticRoles.textInverse + '4D',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.textMuted,
  },
  activeFilterBadgeText: {
    color: semanticRoles.primaryCTAText,
  },
  ordersList: {
    padding: BTHWANI_SPACING.contentH,
  },
  orderCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: semanticRoles.surfaceSubtle,
  },
  orderCardActive: {
    borderLeftColor: semanticRoles.primaryCTA,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.sm,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  orderId: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticRoles.surface,
  },
  statusText: {
    color: semanticRoles.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.surfaceSubtle,
    paddingTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  orderFooter: {
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.surfaceSubtle,
  },
  totalContainer: {
    marginBottom: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  orderTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  reorderButton: {
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textInverse,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.accent,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
    shadowColor: semanticRoles.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chatButtonIcon: {
    fontSize: 16,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  completeButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.primaryCTA,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  statusUpdateButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  statusUpdateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  issueFlagButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  issueFlagButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  proofCodeButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  proofCodeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  proofVerifyButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  proofVerifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  escrowHoldButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  escrowHoldButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  escrowReleaseButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  escrowReleaseButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  receiptButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  receiptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  rateButton: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  rateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
  },
  viewDetailsButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
    shadowColor: semanticRoles.primaryCTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  viewDetailsText: {
    color: semanticRoles.text,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: BTHWANI_SPACING.xxxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_orders_list;

