/**
 * DSH Partner Order Get — dsh_partner_order_get
 * Surface: app-partner | Service: dsh
 * Operation: GET /dsh/partner/orders/:order_id + POST .../actions (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

type PartnerOrderAction = 'accept' | 'reject' | 'prepare' | 'ready' | 'handoff' | 'out_for_delivery' | 'store_delivered';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { ArrivalBellCaptainBlock } from '../../components/ArrivalBellCaptainBlock';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';
import {
  getDshPartnerOrder,
  performDshPartnerOrderAction,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerOrderGetProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      storeId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderGet: React.FC<AutoDshPartnerOrderGetProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const orderId = route?.params?.orderId || 'unknown';
  const selectedStoreId = route?.params?.storeId || '';
  const [order, setOrder] = useState<any>(route?.params?.order || null);
  const [isLoading, setIsLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsOffline(false);
      const data = await getDshPartnerOrder(orderId);
      if (data) setOrder(data);
      else setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_get.orderNotFoundMessage'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_get.errorLoadOrderMessage');
      setError(errorMessage);
      if (errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId && orderId !== 'unknown') loadOrder();
  }, [orderId, loadOrder]);

  const handleAction = useCallback(async (action: PartnerOrderAction) => {
    if (isActioning) return;

    // توصيل الشريك: تنقل إلى شاشة مخصصة
    if (action === 'out_for_delivery') {
      navigation?.navigate?.('dsh_partner_order_out_for_delivery', { orderId, storeId: selectedStoreId });
      return;
    }
    if (action === 'store_delivered') {
      navigation?.navigate?.('dsh_partner_order_store_delivered', { orderId, storeId: selectedStoreId });
      return;
    }

    // Confirm destructive actions
    if (action === 'reject') {
      Alert.alert(
        t('dsh.app-partner.mobile.auto_dsh_partner_order_get.confirmRejectTitle'),
        t('dsh.app-partner.mobile.auto_dsh_partner_order_get.confirmRejectMessage'),
        [
          { text: t('dsh.app-partner.mobile.auto_dsh_partner_order_get.cancelButton'), style: 'cancel' },
          {
            text: t('dsh.app-partner.mobile.auto_dsh_partner_order_get.rejectButton'),
            style: 'destructive',
            onPress: () => performAction(action)
          }
        ]
      );
      return;
    }

    performAction(action);
  }, [isActioning, navigation, orderId, selectedStoreId]);

  const partnerOrderAction = useCallback(async (id: string, action: PartnerOrderAction) => {
    const ok = await performDshPartnerOrderAction(id, action);
    if (!ok) {
      throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_order_get.errorOperationMessage'));
    }
  }, []);

  const performAction = useCallback(async (action: PartnerOrderAction) => {
    try {
      setIsActioning(true);
      setError(null);

      await partnerOrderAction(orderId, action);
      
      // Refresh order data
      await loadOrder();
      
      // Show success message
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_get.successTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionSuccessTemplate', { action: getActionText(action) }), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_get.okButton'),
          onPress: () => {
            // Navigate back or to next screen based on action
            if (action === 'handoff') {
              safeGoBack(navigation, 'dsh_partner_orders_list');
            }
          }
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_get.errorOperationMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_get.errorTitle'), errorMessage);
    } finally {
      setIsActioning(false);
    }
  }, [orderId, loadOrder, navigation, partnerOrderAction]);

  const getActionText = (action: PartnerOrderAction) => {
    switch (action) {
      case 'accept': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionAcceptOrder');
      case 'reject': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionRejectOrder');
      case 'prepare': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionStartPrepare');
      case 'ready': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionMarkReady');
      case 'handoff': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionHandoffToCaptain');
      case 'out_for_delivery': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionOutForDelivery');
      case 'store_delivered': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionDeliveredToCustomer');
      default: return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.actionExecute');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return BTHWANI_COLORS.accent;
      case 'accepted': return BTHWANI_COLORS.primary;
      case 'preparing': return colorTokens.success['600'];
      case 'ready': return colorTokens.success['600'];
      case 'store_out_for_delivery': return colorTokens.success['500'];
      case 'store_delivered':
      case 'handed_off':
      case 'delivered': return colorTokens.success['700'];
      case 'cancelled': return colorTokens.error['600'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'pending': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusNew');
      case 'accepted': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusAccepted');
      case 'preparing': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusPreparing');
      case 'ready': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusReadyForDelivery');
      case 'store_out_for_delivery': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusOutForDelivery');
      case 'store_delivered':
      case 'handed_off':
      case 'delivered': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusDelivered');
      case 'cancelled': return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusCancelled');
      default: return t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusUnknown');
    }
  };

  const getAvailableActions = (status?: string, deliveryMode?: string): PartnerOrderAction[] => {
    const isMerchantDelivery = deliveryMode === 'merchant_delivery';
    switch (status) {
      case 'pending': return ['accept', 'reject'];
      case 'accepted': return ['prepare', 'reject'];
      case 'preparing': return ['ready'];
      case 'ready': return isMerchantDelivery ? ['out_for_delivery'] : ['handoff'];
      case 'store_out_for_delivery': return isMerchantDelivery ? ['store_delivered'] : [];
      default: return [];
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount?: number) => {
    if (amount === undefined || amount === null) return '0.00';
    return amount.toFixed(2);
  };

  // Loading State
  if (isLoading) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_get.loadingMessage')}
        screenName="dsh_partner_order_get"
        operationName="GET /api/dsh/partner/orders/:order_id"
      />
    );
  }

  // Offline State
  if (isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_get.offlineMessage')}
        errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_get.retryButton')}
        onErrorAction={loadOrder}
        screenName="dsh_partner_order_get"
        operationName="GET /api/dsh/partner/orders/:order_id"
      />
    );
  }

  // Error State
  if (error || !order) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_get.orderNotFoundShort')}
        errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_get.retryButtonAlt')}
        onErrorAction={loadOrder}
        screenName="dsh_partner_order_get"
        operationName="GET /api/dsh/partner/orders/:order_id"
      />
    );
  }

  const availableActions = getAvailableActions(order.status, order.deliveryMode);
  const statusColor = getStatusColor(order.status);
  const statusText = getStatusText(order.status);

  // Success/Content State
  return (
    <ScreenWrapper
      state="content"
      screenName="dsh_partner_order_get"
      operationName="GET /api/dsh/partner/orders/:order_id"
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: Order ID + Status */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.orderId}>طلب #{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            </View>
            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات العميل</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>الاسم:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.customer_name || t('dsh.app-partner.mobile.auto_dsh_partner_order_get.statusUnknownAlt')}</Text>
            </View>
            {order.delivery_address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>عنوان التوصيل:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{order.delivery_address}</Text>
              </View>
            )}
            {order.acceptedByEmployeePhone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dsh.app-partner.mobile.auto_dsh_partner_order_get.acceptedByEmployeeLabel')}</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {order.acceptedByEmployeePhone}
                  {order.acceptedByAt ? ` (${formatDate(order.acceptedByAt)})` : ''}
                </Text>
              </View>
            )}
          </View>

          {/* خريطة/رابط الخريطة — حالة خاصة لتوصيل الشريك: إرشاد الشريك لموقع العميل داخل الطلب */}
          {order.deliveryMode === 'merchant_delivery' && order.delivery_address && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('dsh.app-partner.mobile.auto_dsh_partner_order_get.sectionDeliveryToCustomer')}
              </Text>
              <Text style={[styles.mapHint, textAlignStart]}>
                {t('dsh.app-partner.mobile.auto_dsh_partner_order_get.mapHint')}
              </Text>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => {
                  const query = encodeURIComponent(order.delivery_address);
                  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
                  Linking.openURL(url).catch(() => {});
                }}
              >
                <Text style={styles.mapButtonText}>
                  {t('dsh.app-partner.mobile.auto_dsh_partner_order_get.openMapsCta')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* جرس الوصول — عند توصيل الشريك (merchant_delivery) وحالة خرج للتوصيل: الشريك يضغط وصلت ثم رن الجرس. نفس عملية arrival_bell. */}
          {order.deliveryMode === 'merchant_delivery' && order.status === 'store_out_for_delivery' && order.id && (
            <View style={styles.section}>
              <ArrivalBellCaptainBlock
                orderId={order.id}
                actor="partner"
                actorId={order.partner_id ?? order.store_id}
                serviceLabel={t('dsh.app-partner.mobile.auto_dsh_partner_order_get.sectionDeliveryToCustomer')}
              />
            </View>
          )}

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الأصناف ({order.items.length})</Text>
              {order.items.map((item: any, index: number) => (
                <View key={item.id || index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name || t('dsh.app-partner.mobile.auto_dsh_partner_order_get.itemLabel')}</Text>
                    <Text style={styles.itemQuantity}>الكمية: {item.quantity || 1}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatAmount(item.price)} ريال
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Total Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>المبلغ الإجمالي</Text>
            <Text style={styles.amountValue}>{formatAmount(order.total)} ريال</Text>
          </View>

          {/* Notes */}
          {order.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ملاحظات</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          )}

          {/* Actions - Minimum Clicks */}
          {availableActions.length > 0 && (
            <View style={styles.actionsSection}>
              <Text style={styles.actionsTitle}>الإجراءات المتاحة</Text>
              {availableActions.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={[
                    styles.actionButton,
                    action === 'reject' && styles.rejectButton,
                    isActioning && styles.actionButtonDisabled
                  ]}
                  onPress={() => handleAction(action)}
                  disabled={isActioning}
                >
                  <Text style={[
                    styles.actionButtonText,
                    action === 'reject' && styles.rejectButtonText
                  ]}>
                    {getActionText(action)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xxxl + BTHWANI_SPACING.lg, // Extra padding to avoid tab bar overlap
  },
  header: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  section: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    flex: 1,
  },
  mapHint: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  mapButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  itemQuantity: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
  amountSection: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  notesText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    lineHeight: 20,
  },
  actionsSection: {
    marginTop: BTHWANI_SPACING.md,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  actionButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  rejectButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: colorTokens.error['600'],
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  rejectButtonText: {
    color: colorTokens.error['600'],
  },
});

export default AutoDshPartnerOrderGet;

