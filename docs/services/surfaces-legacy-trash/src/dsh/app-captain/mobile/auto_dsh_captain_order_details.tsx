// Auto-generated screen for dsh_captain_order_details
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/orders/:orderId
// Description: Get detailed order information for DSH captain - Premium Design

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';
import { useDshCaptainDeliveryPositionPing } from '../hooks/useDshCaptainDeliveryPositionPing';
import { getDshCaptainOrder } from '@bthwani/api-clients/dsh/dsh-captain-api';
import {
  mapApiResponseToOrderDetails,
  type OrderDetails,
} from '../../hooks';

interface AutoDshCaptainOrderDetailsProps {
  navigation?: any;
}

export const AutoDshCaptainOrderDetails: React.FC<AutoDshCaptainOrderDetailsProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const route = useRoute();
  const routeParams = route.params as { orderId?: string } | undefined;
  const orderId = routeParams?.orderId || 'unknown';

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && orderId !== 'unknown') {
      loadOrderDetails();
    } else {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_order_details.errorLoadMessage'));
      setIsLoading(false);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const order = await getDshCaptainOrder(orderId);
      if (!order) throw new Error('فشل في تحميل التفاصيل');
      setOrderDetails(mapApiResponseToOrderDetails(order as Record<string, unknown>, t, orderId));
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_order_details.errorFetchMessage'));
      } finally {
      setIsLoading(false);
    }
  };

  const isInTransit = orderDetails?.status === 'in_transit';
  useDshCaptainDeliveryPositionPing(
    orderDetails?.id ?? orderId ?? '',
    orderDetails
      ? {
          customerId: orderDetails.customer_id ?? undefined,
          deliveryLat: orderDetails.delivery_lat ?? undefined,
          deliveryLng: orderDetails.delivery_lng ?? undefined,
        }
      : null,
    Boolean(isInTransit && (orderDetails?.id ?? orderId)),
  );

  const handleCallCustomer = () => {
    if (orderDetails?.customerPhone) {
      Linking.openURL(`tel:${orderDetails.customerPhone}`);
    }
  };

  const handleAcceptOrder = () => {
    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_order_details.alertTitle'),
      t('dsh.app-captain.mobile.auto_dsh_captain_order_details.alertMessage'),
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_order_details.alertCancel'), style: 'cancel' },
        {
          text: t('dsh.app-captain.mobile.auto_dsh_captain_order_details.alertConfirm'),
          onPress: () => {
            navigation?.navigate('dsh_captain_order_pickup', { orderId });
          }
        }
      ]
    );
  };

  const handleRejectOrder = () => {
    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_order_details.confirmTitle'),
      t('dsh.app-captain.mobile.auto_dsh_captain_order_details.confirmMessage'),
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_order_details.confirmCancel'), style: 'cancel' },
        {
          text: t('dsh.app-captain.mobile.auto_dsh_captain_order_details.confirmConfirm'),
          style: 'destructive',
          onPress: () => {
            if (typeof navigation?.goBack === 'function') navigation.goBack();
            else navigation?.navigate?.('Home');
          }
        }
      ]
    );
  };

  const getScreenState = (): 'loading' | 'error' | 'content' => {
    if (isLoading) return 'loading';
    if (error || !orderDetails) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getScreenState()}
      loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_order_details.loadingMessage')}
      errorMessage={error || t('dsh.app-captain.mobile.auto_dsh_captain_order_details.errorMessage')}
      errorActionText={t('dsh.app-captain.mobile.auto_dsh_captain_order_details.errorActionText')}
      onErrorAction={loadOrderDetails}
      screenName="dsh_captain_order_details"
      operationName="GET /api/dsh/captain/orders/{order_id}"
    >
      {orderDetails && (
        <View style={styles.container}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Card */}
            <View style={styles.headerCard}>
              <View style={styles.headerTop}>
                <View style={styles.orderIdContainer}>
                  <Text style={styles.orderIdLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.orderIdLabel')}</Text>
                  <Text style={styles.orderId}>#{orderDetails.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderDetails.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusTextColor(orderDetails.status) }]}>{getStatusText(orderDetails.status, t)}</Text>
                </View>
              </View>
              {orderDetails.distanceKm != null && (
                <View style={styles.distanceContainer}>
                  <ServiceIcon name="location-on" size={18} color={semanticRoles.primaryCTA} />
                  <Text style={styles.distanceText}>{orderDetails.distanceKm} كم</Text>
                </View>
              )}
            </View>

            {/* Customer Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}>
                  <ServiceIcon name="person" size={22} color={semanticRoles.primaryCTA} />
                </View>
                <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.cardTitleCustomer')}</Text>
              </View>
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelName')}</Text>
                  <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.customerName}</Text>
                </View>
                <TouchableOpacity style={styles.infoItem} onPress={handleCallCustomer}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelPhone')}</Text>
                  <View style={styles.phoneContainer}>
                    <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.customerPhone}</Text>
                    <ServiceIcon name="phone" size={18} color={semanticRoles.primaryCTA} />
                  </View>
                </TouchableOpacity>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelAddress')}</Text>
                  <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.deliveryAddress}</Text>
                </View>
              </View>
            </View>

            {/* Restaurant Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}>
                  <ServiceIcon name="restaurant" size={22} color={semanticRoles.primaryCTA} />
                </View>
                <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.cardTitleRestaurant')}</Text>
              </View>
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelRestaurantName')}</Text>
                  <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.restaurantName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelAddressShort')}</Text>
                  <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.restaurantAddress}</Text>
                </View>
              </View>
            </View>

            {/* Order Items Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}>
                  <ServiceIcon name="receipt" size={22} color={semanticRoles.primaryCTA} />
                </View>
                <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.cardTitleOrderDetails')}</Text>
              </View>
              <View style={styles.itemsContainer}>
                {orderDetails.items.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>× {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>{item.price * item.quantity} ريال</Text>
                  </View>
                ))}
                <View style={styles.totalCard}>
                  <Text style={styles.totalLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.totalLabel')}</Text>
                  <Text style={styles.totalAmount}>{orderDetails.totalAmount} ريال</Text>
                </View>
              </View>
            </View>

            {/* Timing Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconWrap}>
                  <ServiceIcon name="schedule" size={22} color={semanticRoles.primaryCTA} />
                </View>
                <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.cardTitleTiming')}</Text>
              </View>
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelOrderTime')}</Text>
                  <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.createdAt}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.infoLabelEstimatedDelivery')}</Text>
                  <Text style={[styles.infoValue, textAlignStart, styles.estimatedTime]}>{orderDetails.estimatedDeliveryTime}</Text>
                </View>
              </View>
            </View>

            {/* Awnak Notes Card — عند وجود ملاحظات */}
            {orderDetails.notes && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconWrap}>
                    <ServiceIcon name="notes" size={22} color={semanticRoles.primaryCTA} />
                  </View>
                  <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.cardTitleNotes')}</Text>
                </View>
                <Text style={[styles.infoValue, textAlignStart]}>{orderDetails.notes}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {orderDetails.status === 'pending' && (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.rejectButton]} 
                  onPress={handleRejectOrder}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rejectButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.rejectButtonText')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.acceptButton]} 
                  onPress={handleAcceptOrder}
                  activeOpacity={0.8}
                >
                  <Text style={styles.acceptButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.acceptButtonText')}</Text>
                </TouchableOpacity>
              </>
            )}
            {orderDetails.status === 'accepted' && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]} 
                onPress={() => navigation?.navigate('dsh_captain_order_pickup', { orderId })}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.primaryButtonPickup')}</Text>
              </TouchableOpacity>
            )}
            {orderDetails.status === 'picked_up' && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]} 
                onPress={() => navigation?.navigate('dsh_captain_order_deliver', { orderId })}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_details.primaryButtonDeliver')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return semanticRoles.stateWarning.background;
    case 'accepted': return semanticRoles.stateInfo.background;
    case 'picked_up': return semanticRoles.primaryCTA;
    case 'delivered': return semanticRoles.stateSuccess.background;
    case 'cancelled': return semanticRoles.stateError.background;
    default: return semanticRoles.surfaceSubtle;
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'pending': return semanticRoles.stateWarning.text;
    case 'accepted': return semanticRoles.stateInfo.text;
    case 'picked_up': return semanticRoles.primaryCTAText;
    case 'delivered': return semanticRoles.stateSuccess.text;
    case 'cancelled': return semanticRoles.stateError.text;
    default: return semanticRoles.text;
  }
};

const getStatusText = (status: string, translate: (key: string) => string) => {
  switch (status) {
    case 'pending': return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusPending');
    case 'accepted': return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusAccepted');
    case 'picked_up': return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusPickedUp');
    case 'delivered': return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusDelivered');
    case 'cancelled': return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusCancelled');
    default: return translate('dsh.app-captain.mobile.auto_dsh_captain_order_details.statusUnknown');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xxxl,
  },
  headerCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  orderId: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.xs,
  },
  distanceText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
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
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  infoSection: {
    gap: BTHWANI_SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: semanticRoles.text,
    fontWeight: '500',
    flex: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  itemsContainer: {
    gap: BTHWANI_SPACING.sm,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 15,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  itemPrice: {
    fontSize: 15,
    color: semanticRoles.text,
    fontWeight: '700',
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 2,
    borderTopColor: semanticRoles.border,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  estimatedTime: {
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    gap: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md + 2,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: semanticRoles.primaryCTA,
    flex: 2,
  },
  acceptButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  rejectButtonText: {
    color: semanticRoles.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AutoDshCaptainOrderDetails;
