/**
 * DSH Partner Order Accept — dsh_partner_order_accept
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/{order_id}/accept (via api-clients)
 * بعد القبول يُضاف الطلب لعروض الكابتن (أقرب 5). التطبيق: قبول ورفض فقط (0/1 مخصصان لـ SMS وواتساب).
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to accept order
 * - Clear confirmation
 * - Full states: Loading/Error/Success
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { acceptDshPartnerOrder } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerOrderAcceptProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderAccept: React.FC<AutoDshPartnerOrderAcceptProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const orderId = route?.params?.orderId || 'unknown';
  const order = route?.params?.order || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAccept = useCallback(async () => {
    const id = (orderId ?? route?.params?.orderId ?? '').trim();
    if (!id || id === 'unknown') {
      setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.validationOrderIdRequired'));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const ok = await acceptDshPartnerOrder(id, order ? {
        restaurant: order.restaurantName,
        total: order.total,
        itemsCount: order.itemsCount,
      } : undefined);
      if (!ok) {
        throw new Error('فشل في قبول الطلب');
      }

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.successAcceptMessage'), t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.successAcceptMessage'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.okButton'),
          onPress: () => {
            navigation?.navigate('dsh_partner_orders_list');
          }
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.errorAcceptMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, route?.params?.orderId, order, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.retryButton')}
      onErrorAction={handleAccept}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.successAcceptTitle')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_accept.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_accept"
      operationName="dsh_partner_order_accept"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>قبول الطلب</Text>
          <Text style={styles.subtitle}>طلب #{orderId}</Text>
        </View>

        {order && (
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>اسم العميل:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.customer_name || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>المبلغ:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{order.total_amount ? `${order.total_amount} ر.س` : '-'}</Text>
            </View>
          </View>
        )}

        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>
            هل أنت متأكد من قبول هذا الطلب؟
          </Text>
          <Text style={styles.confirmationSubtext}>
            سيتم إشعار العميل بقبول الطلب وبدء التحضير
          </Text>
        </View>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
          disabled={isLoading}
        >
          <Text style={styles.acceptButtonText}>قبول الطلب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>إلغاء</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  orderInfo: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    fontWeight: '600',
  },
  confirmationBox: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  confirmationSubtext: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  acceptButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  acceptButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AutoDshPartnerOrderAccept;

