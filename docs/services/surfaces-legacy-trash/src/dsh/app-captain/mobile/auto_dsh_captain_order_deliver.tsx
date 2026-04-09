// Auto-generated screen for dsh_captain_order_deliver
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/orders/:orderId/complete
// Description: Complete delivery - One-tap confirmation with verification

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';
import { useDshCaptainDeliveryPositionPing } from '../hooks/useDshCaptainDeliveryPositionPing';
import { ArrivalBellCaptainBlock } from '../../components/ArrivalBellCaptainBlock';
import { deliverDshCaptainOrder } from '@bthwani/api-clients/dsh/dsh-captain-api';
import { buildOrderDeliverMock, type OrderDeliver as Order } from '../../hooks';

interface AutoDshCaptainOrderDeliverProps {
  navigation?: any;
  route?: {
    params?: {
      orderId: string;
      order: Order;
    };
  };
}

export const AutoDshCaptainOrderDeliver: React.FC<AutoDshCaptainOrderDeliverProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [order, setOrder] = useState<Order | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashReceived, setCashReceived] = useState(false);

  useDshCaptainDeliveryPositionPing(
    order?.id ?? '',
    order
      ? {
          customerId: order.customer_id ?? undefined,
          deliveryLat: order.delivery_lat ?? undefined,
          deliveryLng: order.delivery_lng ?? undefined,
        }
      : null,
    Boolean(order?.id),
  );

  useEffect(() => {
    // Get order data from navigation params or route
    const orderData = route?.params?.order;
    if (orderData) {
      setOrder(orderData);
    } else {
      setOrder(buildOrderDeliverMock(t));
    }
  }, [route, t]);

  const handleDeliverOrder = async () => {
    if (!order || isProcessing) return;

    // Validation
    if (order.payment_method === 'cash' && !cashReceived) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle1'), t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle1'));
      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle2'), t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle2'));
      return;
    }

    if (verificationCode.length !== 4 || !/^\d{4}$/.test(verificationCode)) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle3'), t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.errorTitle3'));
      return;
    }

    setIsProcessing(true);

    try {
      const success = await deliverDshCaptainOrder(order.id);
      if (!success) throw new Error(t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.deliverFail'));

      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.successTitle'),
        `تم استلام ${order.total_amount} ريال ${order.payment_method === 'cash' ? t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.successAmountLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.successAmountLabel') + order.payment_method}`,
        [
          {
            text: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.successButtonText'),
            onPress: () => navigation?.navigate('dsh_captain_orders_list'),
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.confirmTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.confirmMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.confirmButtonText') }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCallCustomer = () => {
    if (!order?.customer_phone) return;

    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.alertTitle'),
      `هل تريد الاتصال بـ ${order.customer_name}؟`,
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.alertCancel'), style: 'cancel' },
        {
          text: t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.alertConfirm'),
          onPress: () => {
            // In real app, this would open phone dialer
            Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.contactTitle'), t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.callingCustomer', { phone: order.customer_phone }));
          }
        }
      ]
    );
  };

  if (!order) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.loadingMessage')}
        screenName="dsh_captain_order_deliver"
        operationName="POST /api/dsh/captain/orders/{orderId}/deliver"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="dsh_captain_order_deliver"
      operationName="POST /api/dsh/captain/orders/{orderId}/deliver"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>تسليم الطلب</Text>
          <Text style={styles.subtitle}>
            تأكد من استلام العميل للطلب واتبع خطوات التسليم
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <Text style={styles.customerName}>{order.customer_name}</Text>
          <Text style={styles.customerPhone}>{order.customer_phone}</Text>

          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallCustomer}
          >
            <Text style={styles.callButtonText}>📞 اتصال بالعميل</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Location */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>مكان التسليم</Text>
          <Text style={styles.locationText}>{order.delivery_location}</Text>
        </View>

        <ArrivalBellCaptainBlock orderId={order.id} serviceLabel={t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.serviceLabel')} />

        {/* Payment Method */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          <View style={[styles.paymentInfo, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.paymentMethod}>
              {order.payment_method === 'cash' ? t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.paymentCashLabel') :
               order.payment_method === 'card' ? t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.paymentOtherLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.paymentOtherLabel')}
            </Text>
            <Text style={styles.paymentAmount}>{order.total_amount.toFixed(2)} ريال</Text>
          </View>

          {order.payment_method === 'cash' && (
            <TouchableOpacity
              style={[styles.cashConfirmButton, cashReceived && styles.cashConfirmed]}
              onPress={() => setCashReceived(!cashReceived)}
            >
              <Text style={[styles.cashConfirmText, cashReceived && styles.cashConfirmedText]}>
                {cashReceived ? t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.cashReceivedLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.cashReceivedLabel')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verification Code */}
        <View style={styles.verificationCard}>
          <Text style={styles.sectionTitle}>رمز التحقق</Text>
          <Text style={styles.verificationHint}>
            اطلب من العميل رمز التحقق المرسل له
          </Text>

          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder={t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.placeholderAmount')}
            keyboardType="numeric"
            maxLength={4}
            textAlign="center"
            placeholderTextColor={semanticRoles.textMuted}
          />
        </View>

        {/* Important Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>تأكد من:</Text>
          <Text style={styles.notesText}>
            • تسليم جميع الأصناف المطلوبة{'\n'}
            • التحقق من هوية العميل{'\n'}
            • استلام المبلغ كاملاً (إن كان نقداً){'\n'}
            • إدخال رمز التحقق الصحيح
          </Text>
        </View>

        {/* Deliver Button */}
        <View style={styles.deliverContainer}>
          <TouchableOpacity
            style={[styles.deliverButton, isProcessing && styles.buttonDisabled]}
            onPress={handleDeliverOrder}
            disabled={isProcessing}
          >
            <Text style={[styles.deliverButtonText, isProcessing && styles.buttonTextDisabled]}>
              {isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.submitButtonLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_deliver.submitButtonLabel')}
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
    padding: BTHWANI_SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
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
    textAlign: 'center',
    lineHeight: 22,
  },
  customerCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  customerPhone: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
    marginBottom: BTHWANI_SPACING.md,
  },
  callButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
  },
  callButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  callButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  cashConfirmButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cashConfirmed: {
    backgroundColor: semanticRoles.stateSuccess.background,
    borderColor: semanticRoles.stateSuccess.background,
  },
  cashConfirmText: {
    color: semanticRoles.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cashConfirmedText: {
    color: semanticRoles.stateSuccess.text,
  },
  verificationCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  verificationHint: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    backgroundColor: semanticRoles.surface,
    textAlign: 'center',
    letterSpacing: 4,
  },
  notesCard: {
    backgroundColor: semanticRoles.stateWarning.background,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.xl,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  notesText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  deliverContainer: {
    paddingTop: BTHWANI_SPACING.md,
  },
  deliverButton: {
    backgroundColor: semanticRoles.stateSuccess.icon,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  deliverButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});

export default AutoDshCaptainOrderDeliver;
