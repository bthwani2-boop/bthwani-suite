// Auto-generated screen for dsh_captain_orders_list
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/orders (captainId in query)
// Description: List delivery orders for DSH captain - Perfect UX with minimum clicks

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';
import { CAPTAIN_CONTENT_BG } from '../../../captain/captainTypes';
import { getDshCaptainOrders } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  pickup_location: string;
  delivery_location: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  estimated_delivery: string;
  total_amount: number;
  distance_km?: number;
  items_count?: number;
}

interface AutoDshCaptainOrdersListProps {
  navigation?: any;
}

export const AutoDshCaptainOrdersList: React.FC<AutoDshCaptainOrdersListProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const rawOrders = await getDshCaptainOrders();
      if (!rawOrders) throw new Error('فشل في تحميل الطلبات');
      const statusMap: Record<string, Order['status']> = {
        preparing: 'pending',
        ready: 'accepted',
        pending: 'pending',
        accepted: 'accepted',
        in_transit: 'in_transit',
        delivered: 'delivered',
        cancelled: 'cancelled',
      };
      const orders: Order[] = rawOrders.map((o: any) => ({
        id: o.id ?? '',
        customer_name: o.restaurant ?? (o.source === 'awnak' ? (o.from_label || 'عونك') : t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.customerLabel')),
        customer_phone: undefined,
        pickup_location: o.from_label ?? o.restaurant ?? '',
        delivery_location: o.to_label ?? '',
        status: statusMap[String(o.status).toLowerCase()] ?? 'pending',
        estimated_delivery: o.orderTime ?? new Date().toISOString(),
        total_amount: Number(o.total) ?? 0,
        distance_km: undefined,
        items_count: Number(o.itemsCount) ?? 0,
      }));
      setOrders(orders);
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.errorMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRefresh = useCallback(() => {
    loadOrders(true);
  }, [loadOrders]);

  const handleOrderPress = useCallback((order: Order) => {
    navigation?.navigate('dsh_captain_order_details', {
      orderId: order.id,
      order: order
    });
  }, [navigation]);

  const handleAcceptOrder = useCallback((order: Order) => {
    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.confirmAcceptTitle'),
      `هل تريد قبول طلب ${order.customer_name} بقيمة ${order.total_amount} ريال؟`,
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.cancelButton'), style: 'cancel' },
        {
          text: t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.acceptButton'),
          style: 'default',
          onPress: () => {
            // Navigate to accept screen with order data
            navigation?.navigate('dsh_captain_order_accept', {
              orderId: order.id,
              order: order
            });
          }
        }
      ]
    );
  }, [navigation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.background;
      case 'accepted': return semanticRoles.stateInfo.background;
      case 'in_transit': return semanticRoles.primaryCTA;
      case 'delivered': return semanticRoles.stateSuccess.background;
      case 'cancelled': return semanticRoles.stateError.background;
      default: return semanticRoles.surfaceSubtle;
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.text;
      case 'accepted': return semanticRoles.stateInfo.text;
      case 'in_transit': return semanticRoles.primaryCTAText;
      case 'delivered': return semanticRoles.stateSuccess.text;
      case 'cancelled': return semanticRoles.stateError.text;
      default: return semanticRoles.text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.statusAvailable');
      case 'accepted': return t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.statusAccepted');
      case 'in_transit': return t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.statusInDelivery');
      case 'delivered': return t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.statusDelivered');
      case 'cancelled': return t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.statusCancelled');
      default: return status;
    }
  };

  const renderOrderCard = ({ item: order }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(order)}
      activeOpacity={0.7}
    >
      {/* Header with customer info and status */}
      <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{order.customer_name}</Text>
          <Text style={styles.customerPhone}>{order.customer_phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={[styles.statusText, { color: getStatusTextColor(order.status) }]}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locationsContainer}>
        <View style={[styles.locationRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.locationIcon}>
            <ServiceIcon name="restaurant" size={20} color={semanticRoles.primaryCTA} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>من:</Text>
            <Text style={styles.locationText} numberOfLines={1}>{order.pickup_location}</Text>
          </View>
        </View>

        <View style={[styles.locationRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.locationIcon}>
            <ServiceIcon name="home" size={20} color={semanticRoles.primaryCTA} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>إلى:</Text>
            <Text style={styles.locationText} numberOfLines={1}>{order.delivery_location || '—'}</Text>
          </View>
        </View>
      </View>

      {/* Order details */}
      <View style={[styles.orderDetails, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>المسافة:</Text>
          <Text style={styles.detailValue}>{order.distance_km} كم</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>الأصناف:</Text>
          <Text style={styles.detailValue}>{order.items_count}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>الوقت:</Text>
          <Text style={styles.detailValue}>
            {new Date(order.estimated_delivery).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>

      {/* Footer with amount and action */}
      <View style={[styles.cardFooter, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>المبلغ:</Text>
          <Text style={styles.amountValue}>{order.total_amount.toFixed(2)} ريال</Text>
        </View>

        {order.status === 'pending' && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptOrder(order)}
          >
            <Text style={styles.acceptButtonText}>قبول الطلب</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <ServiceIcon name="inventory" size={48} color={semanticRoles.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>لا توجد طلبات توصيل</Text>
      <Text style={styles.emptyText}>
        لا توجد طلبات توصيل متاحة حاليًا.{'\n'}سيتم إشعارك عند وصول طلبات جديدة.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>تحديث القائمة</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.loadingMessage')}
        screenName="dsh_captain_orders_list"
        operationName="GET /api/dsh/captain/orders"
      />
    );
  }

  if (error && !isRefreshing) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={handleRefresh}
        errorActionText={t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.retryButton')}
        screenName="dsh_captain_orders_list"
        operationName="GET /api/dsh/captain/orders"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.emptyMessage')}
        emptyActionText={t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.refreshListButton')}
        onEmptyAction={handleRefresh}
        screenName="dsh_captain_orders_list"
        operationName="GET /api/dsh/captain/orders"
      >
        {renderEmptyState()}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="dsh_captain_orders_list"
      operationName="GET /api/dsh/captain/orders"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>طلبات التوصيل</Text>
          <Text style={styles.subtitle}>
            {orders.filter(o => o.status === 'pending').length} طلب متاح للقبول
          </Text>
        </View>

        {/* Orders List */}
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[semanticRoles.primaryCTA]}
              tintColor={semanticRoles.primaryCTA}
              title={t('dsh.app-captain.mobile.auto_dsh_captain_orders_list.updatingMessage')}
              titleColor={semanticRoles.text}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CAPTAIN_CONTENT_BG,
  },
  header: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  listContainer: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  orderCard: {
    backgroundColor: semanticRoles.surface,
    marginVertical: BTHWANI_SPACING.xs,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  customerInfo: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.md,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationsContainer: {
    marginBottom: BTHWANI_SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 18,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  amountContainer: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  acceptButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
  },
  acceptButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIconWrap: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: BTHWANI_SPACING.lg,
  },
  refreshButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
  },
  refreshButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AutoDshCaptainOrdersList;

