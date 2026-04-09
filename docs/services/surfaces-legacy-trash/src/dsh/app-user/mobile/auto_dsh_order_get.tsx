// DSH Order Detail Screen - Enhanced Modern Design
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildDshOrderGetMock, type OrderItem } from '../../hooks';

interface auto_dsh_order_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_order_get: React.FC<auto_dsh_order_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { isRTL, t } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) {
        navigation.navigate(screen);
      } else if (onNavigate) {
        onNavigate(screen);
      }
    },
    [navigation, onNavigate]
  );

  const loadOrder = useCallback(async () => {
      try {
      setState('loading');
      await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockSuccess = 0 > 0.1;
        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
  }, []);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  }, [loadOrder]);

  const handleRetry = () => {
    loadOrder();
  };

  const order = useMemo(() => buildDshOrderGetMock(t), [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return semanticRoles.stateSuccess.icon;
      case 'preparing':
        return semanticRoles.stateWarning.icon;
      case 'ready':
        return semanticRoles.stateInfo.icon;
      case 'delivered':
        return semanticRoles.stateSuccess.icon;
      case 'cancelled':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('dsh.app-client.mobile.auto_dsh_order_get.statusConfirmed');
      case 'preparing':
        return t('dsh.app-client.mobile.auto_dsh_order_get.statusPreparing');
      case 'ready':
        return t('dsh.app-client.mobile.auto_dsh_order_get.statusReadyForDelivery');
      case 'delivered':
        return t('dsh.app-client.mobile.auto_dsh_order_get.statusDelivered');
      case 'cancelled':
        return t('dsh.app-client.mobile.auto_dsh_order_get.statusCancelled');
      default:
        return status;
    }
  };

  const calculateItemTotal = (item: OrderItem) => item.price * item.quantity;

  if (state === 'content') {
    const isActive = order.status !== 'delivered' && order.status !== 'cancelled';

    return (
      <ScreenWrapper state="content">
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <View>
          <Text style={styles.title}>تفاصيل الطلب</Text>
              <Text style={styles.orderId}>#{order.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>

          {/* Restaurant Card */}
          <View style={styles.restaurantCard}>
            <View style={[styles.restaurantHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.restaurantImageContainer}>
              <Text style={styles.restaurantEmoji}>{order.restaurant.image}</Text>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                <View style={[styles.restaurantMeta, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.restaurantRating}>⭐ {order.restaurant.rating}</Text>
                  <Text style={styles.restaurantDeliveryTime}>⏱️ {order.restaurant.deliveryTime}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Timeline */}
          <View style={styles.timelineCard}>
            <View style={[styles.timelineItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>تم تأكيد الطلب</Text>
                <Text style={styles.timelineTime}>{order.orderTime}</Text>
              </View>
            </View>
            {order.status !== 'confirmed' && (
              <View style={[styles.timelineItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <View
                  style={[
                    styles.timelineDot,
                    order.status === 'preparing' || order.status === 'ready' || order.status === 'delivered'
                      ? styles.timelineDotActive
                      : styles.timelineDotInactive,
                  ]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>قيد التحضير</Text>
                  {order.status === 'preparing' && (
                    <Text style={styles.timelineTime}>جاري التحضير الآن...</Text>
                  )}
                </View>
              </View>
            )}
            {order.estimatedDelivery && (
              <View style={[styles.timelineItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <View
                  style={[
                    styles.timelineDot,
                    order.status === 'delivered' ? styles.timelineDotActive : styles.timelineDotInactive,
                  ]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>الموعد المتوقع للتوصيل</Text>
                  <Text style={styles.timelineTime}>{order.estimatedDelivery}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>عناصر الطلب</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItemCard}>
                <View style={[styles.orderItemHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {calculateItemTotal(item)} {order.pricing.currency}
                  </Text>
                </View>
                <View style={[styles.orderItemMeta, { flexDirection: 'row', direction: layoutDirection }]}>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>الكمية: {item.quantity}</Text>
                  </View>
                {item.specialInstructions && (
                    <View style={[styles.instructionsBadge, { flexDirection: 'row', direction: layoutDirection }]}>
                      <Text style={styles.instructionsIcon}>📝</Text>
                      <Text style={styles.instructionsText}>{item.specialInstructions}</Text>
                    </View>
                )}
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Address */}
          <View style={styles.addressCard}>
            <View style={[styles.addressHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
            </View>
            <Text style={styles.deliveryAddress}>{order.deliveryAddress}</Text>
          </View>

          {/* Pricing Summary */}
          <View style={styles.pricingCard}>
            <Text style={styles.sectionTitle}>ملخص الفاتورة</Text>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>المجموع الفرعي</Text>
              <Text style={styles.pricingValue}>
                {order.pricing.subtotal} {order.pricing.currency}
              </Text>
            </View>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>رسوم التوصيل</Text>
              <Text style={styles.pricingValue}>
                {order.pricing.deliveryFee} {order.pricing.currency}
              </Text>
            </View>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>الضريبة المضافة (15%)</Text>
              <Text style={styles.pricingValue}>
                {order.pricing.tax.toFixed(1)} {order.pricing.currency}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>المجموع الكلي</Text>
              <Text style={styles.totalValue}>
                {order.pricing.total.toFixed(1)} {order.pricing.currency}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <View style={styles.paymentCard}>
            <View style={[styles.paymentHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.paymentIcon}>💳</Text>
            <Text style={styles.sectionTitle}>معلومات الدفع</Text>
            </View>
            <View style={[styles.paymentRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.paymentLabel}>طريقة الدفع</Text>
              <Text style={styles.paymentValue}>{order.payment.method}</Text>
            </View>
            <View style={[styles.paymentRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.paymentLabel}>{t('dsh.app-client.mobile.auto_dsh_order_get.paymentStatusLabel')}</Text>
              <View style={[styles.paymentStatusBadge, order.payment.status === 'paid' && styles.paidBadge]}>
                <Text style={[styles.paymentStatusText, order.payment.status === 'paid' && styles.paidText]}>
                  {order.payment.status === 'paid' ? t('dsh.app-client.mobile.auto_dsh_order_get.paymentPaid') : t('dsh.app-client.mobile.auto_dsh_order_get.paymentPending')}
              </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {isActive && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.chatButton, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => handleNavigate('DshChatSend')}
              >
                <Text style={styles.chatButtonIcon}>💬</Text>
                <Text style={styles.chatButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_get.chatWithCaptain')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.trackButton, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => handleNavigate('DshDeliveryTrackGet')}
              >
                <Text style={styles.trackButtonIcon}>📍</Text>
                <Text style={styles.trackButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_get.trackDelivery')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleNavigate('DshOrderCancel')}
              >
                <Text style={styles.cancelButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_get.cancelOrder')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {order.status === 'delivered' && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.primaryActionButton, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => handleNavigate('DshOrderRate')}
              >
                <Text style={styles.primaryActionIcon}>⭐</Text>
                <Text style={styles.primaryActionText}>{t('dsh.app-client.mobile.auto_dsh_order_get.rateOrder')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => handleNavigate('DshReviewCreate')}
              >
                <Text style={styles.secondaryActionText}>كتابة تقييم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => handleNavigate('DshOrderReceiptGet')}
              >
                <Text style={styles.secondaryActionText}>إيصال الطلب</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Contact Button */}
          <TouchableOpacity
            style={[styles.contactButton, { flexDirection: 'row', direction: layoutDirection }]}
            onPress={() => handleNavigate('DshChatSend')}
          >
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactText}>{t('dsh.app-client.mobile.auto_dsh_order_get.contactRestaurant')}</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_get.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_order_get.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_order_get"
      operationName="dsh_order_get"
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
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.divider,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  orderId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticRoles.textInverse,
  },
  statusText: {
    color: semanticRoles.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  restaurantCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImageContainer: {
    width: 64,
    height: 64,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  restaurantEmoji: {
    fontSize: 32,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  restaurantRating: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  restaurantDeliveryTime: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  timelineCard: {
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.xs,
  },
  timelineDotActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  timelineDotInactive: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  timelineTime: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  itemsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  orderItemCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    flex: 1,
    marginEnd: BTHWANI_SPACING.sm,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  orderItemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  quantityBadge: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  quantityText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  instructionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.stateWarning.background,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    gap: BTHWANI_SPACING.xs,
  },
  instructionsIcon: {
    fontSize: 12,
  },
  instructionsText: {
    fontSize: 12,
    color: semanticRoles.stateWarning.text,
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  addressIcon: {
    fontSize: 20,
  },
  deliveryAddress: {
    fontSize: 16,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  pricingCard: {
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  pricingLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  divider: {
    height: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    marginVertical: BTHWANI_SPACING.md,
  },
  totalRow: {
    marginTop: BTHWANI_SPACING.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  paymentCard: {
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  paymentLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  paymentStatusBadge: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  paidBadge: {
    backgroundColor: semanticRoles.accent,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  paidText: {
    color: semanticRoles.textInverse,
  },
  actionsContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.md,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.accent,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chatButtonIcon: {
    fontSize: 20,
  },
  chatButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  trackButtonIcon: {
    fontSize: 20,
  },
  trackButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: semanticRoles.textMuted,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryActionIcon: {
    fontSize: 20,
  },
  primaryActionText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryActionButton: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
  },
  secondaryActionText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
    gap: BTHWANI_SPACING.sm,
  },
  contactIcon: {
    fontSize: 20,
  },
  contactText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: BTHWANI_SPACING.xl,
  },
});

export default auto_dsh_order_get;

