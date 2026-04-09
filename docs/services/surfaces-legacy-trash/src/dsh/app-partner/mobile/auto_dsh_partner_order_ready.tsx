/**
 * DSH Partner Order Ready — dsh_partner_order_ready
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/:order_id/ready (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to mark order as ready
 * - Full states: Loading/Error/Success
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { performDshPartnerOrderAction } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerOrderReadyProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderReady: React.FC<AutoDshPartnerOrderReadyProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const orderId = route?.params?.orderId || 'unknown';
  const order = route?.params?.order || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReady = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id || id === 'unknown') {
      setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.validationOrderIdRequired'));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const ok = await performDshPartnerOrderAction(id, 'ready');
      if (!ok) {
        throw new Error('فشل في تحديد الطلب كجاهز');
      }

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.successMarkReadyMessage'), t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.successMarkReadyMessage'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.okButton'),
          onPress: () => {
            navigation?.navigate('dsh_partner_order_get', { orderId, order });
          }
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.errorMarkReadyMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.errorTitle'), errorMessage);
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
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.retryButton')}
      onErrorAction={handleReady}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.successMarkReadyTitle')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_ready.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_ready"
      operationName="dsh_partner_order_ready"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الطلب جاهز</Text>
          <Text style={styles.subtitle}>طلب #{orderId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            سيتم إشعار الكابتن بأن الطلب جاهز للتسليم
          </Text>
        </View>

        <TouchableOpacity
          style={styles.readyButton}
          onPress={handleReady}
          disabled={isLoading}
        >
          <Text style={styles.readyButtonText}>تحديد كجاهز</Text>
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
  readyButton: {
    backgroundColor: colorTokens.success['600'],
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  readyButtonText: {
    color: 'white',
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

export default AutoDshPartnerOrderReady;

