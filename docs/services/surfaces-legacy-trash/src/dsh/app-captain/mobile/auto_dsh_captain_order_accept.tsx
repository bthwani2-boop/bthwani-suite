// Auto-generated screen for dsh_captain_order_accept
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/orders/:orderId/accept
// Description: Accept delivery order - One-tap decision with clear consequences

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';
import { acceptDshCaptainOrder, rejectDshCaptainOrder } from '@bthwani/api-clients/dsh/dsh-captain-api';
import { buildOrderAcceptMock, type OrderAccept as Order } from '../../hooks';

interface AutoDshCaptainOrderAcceptProps {
  navigation?: any;
  route?: {
    params?: {
      orderId: string;
      order: Order;
    };
  };
}

export const AutoDshCaptainOrderAccept: React.FC<AutoDshCaptainOrderAcceptProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);

  useEffect(() => {
    // Get order data from navigation params or route
    const orderData = route?.params?.order;
    if (orderData) {
      setOrder(orderData);
    } else {
      setOrder(buildOrderAcceptMock(t));
    }
  }, [route, t]);

  const handleAcceptOrder = async () => {
    if (!order || isProcessing) return;

    setIsProcessing(true);
    setDecision('accept');

    try {
      const success = await acceptDshCaptainOrder(order.id);
      if (!success) throw new Error('فشل في قبول الطلب');

      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.alertTitle'),
        `تم قبول طلب ${order.customer_name} بنجاح. ابدأ بالتوجه للمطعم.`,
        [
          {
            text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.alertConfirm'),
            onPress: () => {
              navigation?.navigate('dsh_captain_order_pickup', {
                orderId: order.id,
                order: order
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.confirmTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.confirmMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.confirmButtonText') }]
      );
      setDecision(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!order || isProcessing) return;

    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.rejectTitle'),
      t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.rejectMessage'),
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.rejectCancel'), style: 'cancel' },
        {
          text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.rejectConfirm'),
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            setDecision('reject');

            try {
              const success = await rejectDshCaptainOrder(order.id);
              if (!success) throw new Error('فشل في رفض الطلب');

              Alert.alert(
                t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.successTitle'),
                t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.successMessage'),
                [
                  {
                    text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.successButtonText'),
                    onPress: () => navigation?.navigate('dsh_captain_orders_list')
                  }
                ]
              );
            } catch (error) {
              Alert.alert(
                t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.errorTitle'),
                t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.errorMessage'),
                [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.errorButtonText') }]
              );
              setDecision(null);
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  if (!order) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.loadingMessage')}
        screenName="dsh_captain_order_accept"
        operationName="POST /api/dsh/captain/orders/{orderId}/accept"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="dsh_captain_order_accept"
      operationName="POST /api/dsh/captain/orders/{orderId}/accept"
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={[styles.headerTop, { flexDirection: 'row', direction: layoutDirection }]}>
              <View>
                <Text style={styles.title}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.title')}</Text>
                <Text style={styles.subtitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.subtitle')}</Text>
              </View>
              <View style={styles.orderIdBadge}>
                <Text style={styles.orderIdText}>#{order.id}</Text>
              </View>
            </View>
          </View>

          {/* Order Summary Card */}
          <View style={styles.orderCard}>
            <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.cardIconWrap}>
                <ServiceIcon name="receipt" size={22} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.cardTitleSummary')}</Text>
            </View>
            <View style={styles.customerSection}>
              <View style={[styles.customerInfo, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.customerIconWrap}>
                  <ServiceIcon name="person" size={22} color={semanticRoles.primaryCTA} />
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{order.customer_name}</Text>
                  <Text style={styles.customerPhone}>{order.customer_phone}</Text>
                </View>
              </View>
            </View>
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>قيمة الطلب</Text>
              <Text style={styles.amountValue}>{order.total_amount.toFixed(2)} ريال</Text>
            </View>
          </View>

          {/* Route Information Card */}
          <View style={styles.routeCard}>
            <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.cardIconWrap}>
                <ServiceIcon name="map" size={22} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.cardTitleRoute')}</Text>
            </View>
            <View style={styles.routeContainer}>
              <View style={[styles.routeItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.routeIconContainer}>
                  <ServiceIcon name="restaurant" size={20} color={semanticRoles.primaryCTA} />
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.routeLabelFrom')}</Text>
                  <Text style={styles.routeText}>{order.pickup_location}</Text>
                </View>
              </View>
              <View style={styles.routeDivider} />
              <View style={[styles.routeItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.routeIconContainer}>
                  <ServiceIcon name="home" size={20} color={semanticRoles.primaryCTA} />
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.routeLabelTo')}</Text>
                  <Text style={styles.routeText}>{order.delivery_location}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Order Details Card */}
          <View style={styles.detailsCard}>
            <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.cardIconWrap}>
                <ServiceIcon name="assessment" size={22} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.cardTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.cardTitleDetails')}</Text>
            </View>
            <View style={[styles.detailsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.detailCard}>
                <ServiceIcon name="location-on" size={22} color={semanticRoles.textMuted} />
                <Text style={styles.detailLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.detailLabelDistance')}</Text>
                <Text style={styles.detailValue}>{order.distance_km} كم</Text>
              </View>
              <View style={styles.detailCard}>
                <ServiceIcon name="inventory" size={22} color={semanticRoles.textMuted} />
                <Text style={styles.detailLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.detailLabelItems')}</Text>
                <Text style={styles.detailValue}>{order.items_count}</Text>
              </View>
              <View style={styles.detailCard}>
                <ServiceIcon name="schedule" size={22} color={semanticRoles.textMuted} />
                <Text style={styles.detailLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.detailLabelTime')}</Text>
                <Text style={styles.detailValue}>
                  {new Date(order.estimated_delivery).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.detailCard}>
                <ServiceIcon name="payment" size={22} color={semanticRoles.textMuted} />
                <Text style={styles.detailLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.detailLabelCommission')}</Text>
                <Text style={[styles.detailValue, styles.commissionValue]}>{(order.total_amount * 0.1).toFixed(2)} ريال</Text>
              </View>
            </View>
          </View>

          {/* Important Notes Card */}
          <View style={styles.notesCard}>
            <View style={[styles.notesHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <ServiceIcon name="info" size={20} color={semanticRoles.stateWarning.icon} />
              <Text style={styles.notesTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.notesTitle')}</Text>
            </View>
            <View style={styles.notesList}>
              <View style={[styles.noteItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.noteText1')}</Text>
              </View>
              <View style={[styles.noteItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.noteText2')}</Text>
              </View>
              <View style={[styles.noteItem, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.noteText3')}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons - Fixed at bottom */}
        <View style={[styles.actionsContainer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton, isProcessing && styles.buttonDisabled]}
            onPress={handleRejectOrder}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Text style={styles.rejectButtonText}>
              {decision === 'reject' && isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.buttonRejectLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.buttonRejectLabel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton, isProcessing && styles.buttonDisabled]}
            onPress={handleAcceptOrder}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>
              {decision === 'accept' && isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.buttonAcceptLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_accept.buttonAcceptLabel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  orderIdBadge: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  orderCard: {
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
  customerSection: {
    marginBottom: BTHWANI_SPACING.md,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  customerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  customerPhone: {
    fontSize: 15,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  amountCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  amountLabel: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  routeCard: {
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
  routeContainer: {
    gap: BTHWANI_SPACING.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeDetails: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  routeText: {
    fontSize: 15,
    color: semanticRoles.text,
    fontWeight: '500',
    lineHeight: 20,
  },
  routeDivider: {
    height: 1,
    backgroundColor: semanticRoles.border,
    marginVertical: BTHWANI_SPACING.sm,
    marginStart: 56,
  },
  detailsCard: {
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  detailCard: {
    width: '47%',
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  detailLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  commissionValue: {
    color: semanticRoles.primaryCTA,
  },
  notesCard: {
    backgroundColor: semanticRoles.stateWarning.background,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  notesList: {
    gap: BTHWANI_SPACING.sm,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
  },
  noteBullet: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
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
  acceptButton: {
    backgroundColor: semanticRoles.primaryCTA,
    flex: 2,
  },
  acceptButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AutoDshCaptainOrderAccept;
