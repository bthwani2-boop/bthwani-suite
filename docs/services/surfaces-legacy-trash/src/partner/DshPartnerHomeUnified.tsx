/**
 * DshPartnerHomeUnified — واجهة موحدة للطلبات والتشغيل اليومي
 * §UX-SUPREME-001: One-Click Everything | Smart Defaults | Progressive Disclosure
 *
 * تشريح بصري ومنطقي:
 * - قبل: قائمة أزرار (قائمة الطلبات، تسليم، لوحة عمليات، مكتب مشاكل) → 2+ نقرات للوصول
 * - بعد: محتوى مباشر — الطلبات مع إجراءات مضمنة، شريط عمليات، شريط مشاكل
 * - نقرات: عرض تفاصيل=1، تسليم=1، مشكلة=1، لوحة عمليات=1، مكتب مشاكل=1
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  semanticRoles,
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { ServiceIcon } from '../mobile/components';
import {
  getDshPartnerOrdersList,
  type DshPartnerOrdersListItem,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

type DshOrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'handed_off'
  | 'delivered'
  | 'cancelled';

interface DshPartnerHomeUnifiedProps {
  navigation?: { navigate: (name: string, params?: Record<string, unknown>) => void };
  activeStoreScope?: string;
}

export const DshPartnerHomeUnified: React.FC<DshPartnerHomeUnifiedProps> = ({
  navigation,
  activeStoreScope,
}) => {
  const { t, isRTL } = useI18n();
  const [orders, setOrders] = useState<DshPartnerOrdersListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const canNavigate = !!navigation?.navigate;

  const loadOrders = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      const list = await getDshPartnerOrdersList();
      let data = Array.isArray(list) ? list : [];
      if (data.length === 0 && typeof __DEV__ !== 'undefined' && __DEV__) {
        data = [
          {
            id: 'mock-1',
            status: 'pending',
            created_at: new Date().toISOString(),
            total: 45.5,
            customer_name: t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.mockCustomerName'),
          },
        ] as DshPartnerOrdersListItem[];
      }
      setOrders(data);
    } catch {
      setOrders([]);
      setError(t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.errorMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const navigateTo = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (!canNavigate) return;
      const p =
        activeStoreScope &&
        !['all', '__partner_all_stores__'].includes(activeStoreScope)
          ? { ...params, storeId: activeStoreScope }
          : params;
      navigation!.navigate(screen, p);
    },
    [canNavigate, navigation, activeStoreScope],
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return BTHWANI_COLORS.accent;
      case 'accepted':
      case 'preparing':
      case 'ready':
        return BTHWANI_COLORS.primary;
      case 'delivered':
      case 'handed_off':
        return '#22c55e';
      case 'cancelled':
        return '#ef4444';
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'pending':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusNew');
      case 'accepted':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusAccepted');
      case 'preparing':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusPreparing');
      case 'ready':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusReadyForDelivery');
      case 'handed_off':
      case 'delivered':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusDelivered');
      case 'cancelled':
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusCancelled');
      default:
        return t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.statusUnknown');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount?: number) =>
    amount != null ? amount.toFixed(2) : '0.00';

  const canHandoff = (status?: string) =>
    ['accepted', 'preparing', 'ready'].includes(status || '');

  const renderOrderCard = ({ item: order }: { item: DshPartnerOrdersListItem }) => {
    const statusColor = getStatusColor(order.status);
    const statusText = getStatusText(order.status);
    const showHandoff = canHandoff(order.status);
    const canAccept = order.status === 'pending';
    const canReject = ['pending', 'accepted'].includes(order.status || '');

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigateTo('dsh_partner_order_get', {
              orderId: order.id,
              order,
            })
          }
          style={styles.orderCardTouch}
        >
          <View style={[styles.cardRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.customerBlock}>
              <Text style={styles.customerName} numberOfLines={1}>
                {order.customer_name || t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.customerLabel')}
              </Text>
              <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountValue}>{formatAmount(order.total)} ر.س</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.inlineActions, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={styles.inlineBtn}
            onPress={() =>
              navigateTo('dsh_partner_order_get', { orderId: order.id, order })
            }
          >
            <ServiceIcon name="visibility" size={16} color={semanticRoles.primaryCTA} />
            <Text style={styles.inlineBtnText}>{t('partner.PartnerHomeScreen.navDetails')}</Text>
          </TouchableOpacity>
          {canAccept && (
            <>
              <TouchableOpacity
                style={[styles.inlineBtn, styles.acceptBtn]}
                onPress={() =>
                  navigateTo('dsh_partner_order_accept', { orderId: order.id, order })
                }
              >
                <Text style={styles.inlineBtnTextAccept}>✓ قبول</Text>
              </TouchableOpacity>
              {canReject && (
                <TouchableOpacity
                  style={[styles.inlineBtn, styles.rejectBtn]}
                  onPress={() =>
                    navigateTo('dsh_partner_order_reject', { orderId: order.id, order })
                  }
                >
                  <Text style={styles.inlineBtnTextReject}>✕</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {showHandoff && (
            <TouchableOpacity
              style={[styles.inlineBtn, styles.handoffBtn]}
              onPress={() =>
                navigateTo('dsh_partner_order_handoff', { orderId: order.id, order })
              }
            >
              <ServiceIcon name="send" size={16} color={BTHWANI_COLORS.surface} />
              <Text style={styles.inlineBtnTextWhite}>
                {t('partner.PartnerHomeScreen.navOrderDelivery')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.inlineBtn}
            onPress={() =>
              navigateTo('dsh_partner_order_issue_queue', { orderId: order.id })
            }
          >
            <ServiceIcon name="report-problem" size={16} color={semanticRoles.warning} />
            <Text style={styles.inlineBtnTextIssue}>{t('partner.PartnerHomeScreen.navIssue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTopStrips = () => (
    <View style={[styles.topStrips, { flexDirection: 'row', direction: layoutDirection }]}>
      <TouchableOpacity
        style={styles.strip}
        onPress={() => navigateTo('dsh_partner_delivery_ops_board')}
        activeOpacity={0.7}
      >
        <ServiceIcon name="local-shipping" size={18} color={semanticRoles.primaryCTA} />
        <Text style={styles.stripText}>
          {t('partner.PartnerHomeScreen.navDeliveryOpsBoard')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.strip}
        onPress={() => navigateTo('dsh_partner_order_issue_queue')}
        activeOpacity={0.7}
      >
        <ServiceIcon name="report-problem" size={18} color={semanticRoles.warning} />
        <Text style={styles.stripText}>
          {t('partner.PartnerHomeScreen.navIssueQueue')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // §UX-SUPREME-001: Never block the whole screen. Top strips (لوحة عمليات، مكتب مشاكل) are
  // always visible — one-click access even when orders fail. Progressive disclosure.
  const renderOrdersSection = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.ordersLoadingBlock}>
          <Text style={styles.loadingText}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.loadingMessage')}
          </Text>
        </View>
      );
    }
    if (error && orders.length === 0) {
      return (
        <View style={styles.ordersErrorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadOrders()}>
            <Text style={styles.retryBtnText}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.retryButton')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (orders.length === 0) {
      return (
        <View style={styles.emptyBlock}>
          <ServiceIcon name="list" size={48} color={semanticRoles.textMuted} />
          <Text style={styles.emptyText}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.emptyMessage')}
          </Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => loadOrders(true)}>
            <Text style={styles.refreshBtnText}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_orders_list.refreshListButton')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null; // FlatList will render items
  };

  const listHeader = (
    <>
      {renderTopStrips()}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {t('partner.PartnerHomeScreen.navOrdersList')}
        </Text>
        <Text style={styles.listSubtitle}>
          {orders.length} {orders.length === 1 ? t('partner.PartnerHomeScreen.ordersCountSingular') : t('partner.PartnerHomeScreen.ordersCountPlural')}
        </Text>
      </View>
      {renderOrdersSection()}
    </>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrderCard}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={null}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => loadOrders(true)}
          colors={[BTHWANI_COLORS.primary]}
          tintColor={BTHWANI_COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  ordersLoadingBlock: {
    paddingVertical: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  ordersErrorBlock: {
    paddingVertical: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: semanticRoles.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: semanticRoles.error,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  retryBtn: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  topStrips: {
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  strip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  stripText: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  listHeader: {
    marginBottom: BTHWANI_SPACING.md,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  listSubtitle: {
    fontSize: 13,
    color: semanticRoles.textMuted,
  },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  orderCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  orderCardTouch: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerBlock: {
    flex: 1,
    minWidth: 0,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  amountRow: {
    marginTop: BTHWANI_SPACING.sm,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  inlineActions: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  inlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.primaryCTA + '12',
    borderRadius: BTHWANI_RADIUS.md,
  },
  inlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  acceptBtn: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  inlineBtnTextAccept: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  rejectBtn: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  inlineBtnTextReject: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.error,
  },
  handoffBtn: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  inlineBtnTextWhite: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  inlineBtnTextIssue: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.warning,
  },
  emptyBlock: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.xxl,
  },
  emptyText: {
    fontSize: 15,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
    textAlign: 'center',
  },
  refreshBtn: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA + '20',
    borderRadius: BTHWANI_RADIUS.md,
  },
  refreshBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
});
