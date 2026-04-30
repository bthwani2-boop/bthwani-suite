/**
 * DSH Partner Order Handoff — dsh_partner_order_handoff
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/{order_id}/handoff (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to handoff order to captain
 * - Full states: Loading/Error/Success
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { performDshPartnerOrderAction } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerOrderHandoffProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderHandoff: React.FC<AutoDshPartnerOrderHandoffProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const orderId = route?.params?.orderId || 'unknown';
  const order = route?.params?.order || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleHandoff = useCallback(async () => {
    Alert.alert(
      t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.confirmHandoffTitle'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.confirmHandoffMessage'),
      [
        { text: t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.cancelButton'), style: 'cancel' },
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.confirmButton'),
          onPress: async () => {
            try {
              setIsLoading(true);
              setError(null);

              const ok = await performDshPartnerOrderAction(orderId.trim(), 'handoff');
              if (!ok) {
                throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.handoffFail'));
              }

              setIsSuccess(true);
              Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.successHandoffTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.successHandoffTitle'), [
                {
                  text: t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.okButton'),
                  onPress: () => {
                    safeGoBack(navigation, 'dsh_partner_orders_list');
                  }
                }
              ]);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.errorHandoffMessage');
              setError(errorMessage);
              Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.errorTitle'), errorMessage);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  }, [orderId, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.retryButton')}
      onErrorAction={handleHandoff}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.successHandoffMessage')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_handoff"
      operationName="dsh_partner_order_handoff"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تسليم للكابتن</Text>
          <Text style={styles.subtitle}>طلب #{orderId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            سيتم إشعار الكابتن بتسليم الطلب
          </Text>
        </View>

        <TouchableOpacity
          style={styles.handoffButton}
          onPress={handleHandoff}
          disabled={isLoading}
        >
          <Text style={styles.handoffButtonText}>تسليم للكابتن</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>{t('dsh.app-partner.mobile.auto_dsh_partner_order_handoff.cancelButtonText')}</Text>
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
  handoffButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  handoffButtonText: {
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

export default AutoDshPartnerOrderHandoff;

