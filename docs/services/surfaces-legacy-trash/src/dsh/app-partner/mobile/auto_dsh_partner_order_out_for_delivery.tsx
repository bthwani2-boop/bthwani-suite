/**
 * DSH Partner Order Out for Delivery — dsh_partner_order_out_for_delivery
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/{order_id}/out-for-delivery (via api-clients)
 * توصيل الشريك (merchant_delivery): الشريك يحدد أنه خرج للتوصيل. لا كابتن.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { markDshPartnerOrderOutForDelivery } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface Props {
  navigation?: any;
  route?: { params?: { orderId?: string } };
}

export const AutoDshPartnerOrderOutForDelivery: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useI18n();
  const orderId = route?.params?.orderId || '';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAction = useCallback(async () => {
    if (!orderId.trim()) {
      setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.validationOrderIdRequired'));
      return;
    }
    Alert.alert(
      t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.confirmOutForDeliveryMessage'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.confirmOutForDeliveryMessage'),
      [
      { text: t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.cancelButton'), style: 'cancel' },
      {
        text: t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.yesButton'),
        onPress: async () => {
          try {
            setIsLoading(true);
            setError(null);
            const ok = await markDshPartnerOrderOutForDelivery(orderId.trim());
            if (!ok) {
              throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.errorTitleShort'));
            }
            setIsSuccess(true);
            Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.successStatusMessage'), t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.successStatusMessage'), [
              { text: t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.okButton'), onPress: () => navigation?.navigate?.('dsh_partner_orders_list') },
            ]);
          } catch (err) {
            const msg = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.errorTitleShort');
            setError(msg);
            Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.errorTitle'), msg);
          } finally {
            setIsLoading(false);
          }
        },
      },
      ],
    );
  }, [orderId, navigation]);

  const state = isLoading ? 'loading' : isSuccess ? 'success' : error ? 'error' : 'content';
  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.updatingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.errorOccurredMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.retryButton')}
      onErrorAction={handleAction}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_out_for_delivery.backToListButton')}
      onSuccessAction={() => navigation?.navigate?.('dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_out_for_delivery"
      operationName="dsh_partner_order_out_for_delivery"
    >
      <View style={styles.container}>
        <Text style={styles.title}>خرج للتوصيل</Text>
        <Text style={styles.subtitle}>طلب #{orderId || '—'}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleAction} disabled={isLoading}>
          <Text style={styles.btnText}>تحديث: خرج للتوصيل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation?.goBack?.()} disabled={isLoading}>
          <Text style={styles.cancelText}>إلغاء</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 22, fontWeight: '600', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs, textAlign: 'center' },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.lg, textAlign: 'center' },
  btn: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.contentH, borderRadius: BTHWANI_RADIUS.lg, alignItems: 'center', marginBottom: BTHWANI_SPACING.md },
  btnText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '600' },
  cancelBtn: { padding: BTHWANI_SPACING.contentH, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.lg },
  cancelText: { color: semanticRoles.onSurface, fontSize: 16 },
});

export default AutoDshPartnerOrderOutForDelivery;
