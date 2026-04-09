/**
 * DSH Partner Order Prepare — dsh_partner_order_prepare
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/:order_id/prepare (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to start preparing order
 * - Full states: Loading/Error/Success
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { performDshPartnerOrderAction } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerOrderPrepareProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderPrepare: React.FC<AutoDshPartnerOrderPrepareProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const orderId = route?.params?.orderId || 'unknown';
  const order = route?.params?.order || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePrepare = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id || id === 'unknown') {
      setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.validationOrderIdRequired'));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const ok = await performDshPartnerOrderAction(id, 'prepare');
      if (!ok) {
        throw new Error('فشل في بدء التحضير');
      }

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.successStartPrepareMessage'), t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.successStartPrepareMessage'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.okButton'),
          onPress: () => {
            navigation?.navigate('dsh_partner_order_get', { orderId, order });
          }
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.errorStartPrepareMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, order, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.retryButton')}
      onErrorAction={handlePrepare}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.successStartPrepareTitle')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_prepare.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_prepare"
      operationName="dsh_partner_order_prepare"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>بدء التحضير</Text>
          <Text style={styles.subtitle}>طلب #{orderId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            سيتم إشعار العميل ببدء تحضير الطلب
          </Text>
        </View>

        <TouchableOpacity
          style={styles.prepareButton}
          onPress={handlePrepare}
          disabled={isLoading}
        >
          <Text style={styles.prepareButtonText}>بدء التحضير</Text>
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
  infoBox: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: semanticRoles.text,
    textAlign: 'center',
  },
  prepareButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  prepareButtonText: {
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

export default AutoDshPartnerOrderPrepare;

