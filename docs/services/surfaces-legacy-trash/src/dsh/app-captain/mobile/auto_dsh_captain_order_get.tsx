// Auto-generated screen for dsh_captain_order_get
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/orders/:orderId
// Description: Get DSH order details - Clear information display

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { AnimatedCard } from '../../../mobile/components/MicroInteractions';
import { ServiceIcon } from '../../../mobile/components';
import { colorTokens } from '@bthwani/ui-kit';
import { useDshCaptainDeliveryPositionPing } from '../hooks/useDshCaptainDeliveryPositionPing';
import { ArrivalBellCaptainBlock } from '../../components/ArrivalBellCaptainBlock';
import { getDshCaptainOrder } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  delivery_location: string;
  total_amount: number;
  distance_km: number;
  items_count: number;
  estimated_delivery: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  payment_method?: 'cash' | 'card' | 'wallet';
  /** لنظام إشعارات قرب الكابتن — من GET order (مرجع DSH_SMART_NOTIFICATIONS_CAPTAIN_NEAR_SPEC) */
  customer_id?: string | null;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
}

interface AutoDshCaptainOrderGetProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: Order;
    };
  };
}

export const AutoDshCaptainOrderGet: React.FC<AutoDshCaptainOrderGetProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderId = route?.params?.orderId || route?.params?.order?.id || '';

  const loadOrder = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // If order is provided in params, use it
      if (route?.params?.order) {
        setOrder(route.params.order);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const id = (orderId || '').trim();
      if (!id) {
        setOrder(null);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const d = await getDshCaptainOrder(id);
      if (!d) throw new Error(t('dsh.app-captain.mobile.auto_dsh_captain_order_get.loadFail'));
      const statusMap: Record<string, Order['status']> = {
        preparing: 'pending',
        ready: 'accepted',
        pending: 'pending',
        accepted: 'accepted',
        in_transit: 'in_transit',
        delivered: 'delivered',
        cancelled: 'cancelled',
      };
      setOrder({
        id: d.id ?? id,
        customer_name: d.customer_name ?? d.restaurant ?? t('dsh.app-captain.mobile.auto_dsh_captain_order_get.customerLabel'),
        customer_phone: d.customer_phone ?? '',
        pickup_location: d.pickup_location ?? d.restaurant ?? '',
        delivery_location: d.delivery_location ?? '',
        total_amount: Number(d.total) ?? 0,
        distance_km: Number(d.distance_km) ?? 0,
        items_count: Number(d.itemsCount) ?? 0,
        estimated_delivery: d.orderTime ?? new Date().toISOString(),
        status: statusMap[String(d.status).toLowerCase()] ?? 'pending',
        payment_method: (d.payment_method === 'card' || d.payment_method === 'wallet' ? d.payment_method : 'cash') as Order['payment_method'],
        customer_id: d.customer_id ?? null,
        delivery_lat: typeof d.delivery_lat === 'number' ? d.delivery_lat : null,
        delivery_lng: typeof d.delivery_lng === 'number' ? d.delivery_lng : null,
      });
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_order_get.errorLoadMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId, route?.params?.order]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'accepted': return semanticRoles.stateInfo.icon;
      case 'in_transit': return semanticRoles.primaryCTA;
      case 'delivered': return semanticRoles.stateSuccess.icon;
      case 'cancelled': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('dsh.app-captain.mobile.auto_dsh_captain_order_get.statusPending');
      case 'accepted': return t('dsh.app-captain.mobile.auto_dsh_captain_order_get.statusAccepted');
      case 'in_transit': return t('dsh.app-captain.mobile.auto_dsh_captain_order_get.statusInDelivery');
      case 'delivered': return t('dsh.app-captain.mobile.auto_dsh_captain_order_get.statusDelivered');
      case 'cancelled': return t('dsh.app-captain.mobile.auto_dsh_captain_order_get.statusCancelled');
      default: return status;
    }
  };

  const isInTransit = order?.status === 'in_transit';
  useDshCaptainDeliveryPositionPing(
    order?.id ?? '',
    order
      ? {
          customerId: order.customer_id ?? undefined,
          deliveryLat: order.delivery_lat ?? undefined,
          deliveryLng: order.delivery_lng ?? undefined,
        }
      : null,
    Boolean(isInTransit && order?.id),
  );

  if (isLoading) {
    return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_order_get.loadingMessage')} />;
  }

  if (error) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={() => loadOrder()}
      />
    );
  }

  if (!order) {
    return <ScreenWrapper state="empty" emptyMessage={t('dsh.app-captain.mobile.auto_dsh_captain_order_get.emptyOrderMessage')} />;
  }

  return (
    <ScreenWrapper state="content">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadOrder(true)} />
        }
      >
        <AnimatedCard style={styles.card}>
          <View style={styles.header}>
            <ServiceIcon name="visibility" size={48} color={semanticRoles.primaryCTA} />
            <Text style={styles.title}>تفاصيل الطلب</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{order.total_amount.toFixed(2)}</Text>
              <Text style={styles.currency}> ريال</Text>
            </View>
            <Text style={[styles.orderId, textAlignStart]}>رقم الطلب: {order.id}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>معلومات العميل</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الاسم:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.customer_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الهاتف:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.customer_phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>الموقع</Text>
            <View style={styles.locationCard}>
              <Text style={[styles.locationLabel, textAlignStart]}>من:</Text>
              <Text style={[styles.locationValue, textAlignStart]}>{order.pickup_location}</Text>
            </View>
            <View style={styles.locationCard}>
              <Text style={[styles.locationLabel, textAlignStart]}>إلى:</Text>
              <Text style={[styles.locationValue, textAlignStart]}>{order.delivery_location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>المسافة:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.distance_km.toFixed(1)} كم</Text>
            </View>
          </View>

          {order.status === 'in_transit' && (
            <ArrivalBellCaptainBlock orderId={order.id} serviceLabel={t('dsh.app-captain.mobile.auto_dsh_captain_order_get.deliveryLabel')} />
          )}

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>معلومات إضافية</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>عدد العناصر:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.items_count}</Text>
            </View>
            {order.payment_method && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>طريقة الدفع:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {order.payment_method === 'cash' ? t('dsh.app-captain.mobile.auto_dsh_captain_order_get.paymentCardLabel') : order.payment_method === 'card' ? t('dsh.app-captain.mobile.auto_dsh_captain_order_get.paymentCardLabel') : 'محفظة'}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>وقت التوصيل المتوقع:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>
                {new Date(order.estimated_delivery).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {order.status === 'accepted' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation?.navigate('dsh_captain_order_pickup', {
                orderId: order.id,
                order: order,
              })}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>بدء الاستلام</Text>
            </TouchableOpacity>
          )}
        </AnimatedCard>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.sm,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    marginBottom: BTHWANI_SPACING.sm,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
  },
  currency: {
    fontSize: 20,
    color: semanticRoles.textMuted,
    marginEnd: BTHWANI_SPACING.xs,
  },
  orderId: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.sm,
  },
  locationCard: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  divider: {
    height: 1,
    backgroundColor: semanticRoles.border,
    marginVertical: BTHWANI_SPACING.lg,
  },
  actionButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  actionButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainOrderGet;

