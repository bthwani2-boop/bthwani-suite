/**
 * DSH Partner Order Reject — dsh_partner_order_reject
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/orders/:order_id/reject (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to reject order with reason
 * - Clear confirmation
 * - Full states: Loading/Error/Success
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { rejectDshPartnerOrder } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerOrderRejectProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: any;
    };
  };
}

export const AutoDshPartnerOrderReject: React.FC<AutoDshPartnerOrderRejectProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const orderId = route?.params?.orderId || 'unknown';
  const order = route?.params?.order || null;
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');

  const rejectReasons = useMemo(
    () => [
      t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonStoreClosed'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonOutOfZone'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonProductsUnavailable'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonTechnical'),
      t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonOther'),
    ],
    [t]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReject = useCallback(async () => {
    if (!selectedReason) {
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.validationSelectReason'), t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.validationSelectReason'));
      return;
    }

    const reason = selectedReason === t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonOtherLabel') ? customReason : selectedReason;
    if (!reason.trim()) {
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.validationEnterReason'), t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.validationEnterReason'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const id = (orderId ?? '').trim();
      if (!id || id === 'unknown') {
        setError(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.validationOrderIdRequired'));
        return;
      }
      const ok = await rejectDshPartnerOrder(id, reason);
      if (!ok) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.rejectFail'));
      }

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.successRejectTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.successRejectTitle'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.okButton'),
          onPress: () => {
            navigation?.navigate('dsh_partner_orders_list');
          }
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.errorRejectMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, selectedReason, customReason, navigation, t]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.retryButton')}
      onErrorAction={handleReject}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.successRejectMessage')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
      screenName="auto_dsh_partner_order_reject"
      operationName="dsh_partner_order_reject"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>رفض الطلب</Text>
          <Text style={styles.subtitle}>طلب #{orderId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختر سبب الرفض</Text>
          {rejectReasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonOption,
                selectedReason === reason && styles.reasonOptionSelected
              ]}
              onPress={() => setSelectedReason(reason)}
            >
              <Text style={[
                styles.reasonText,
                selectedReason === reason && styles.reasonTextSelected
              ]}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedReason === t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonOtherOption') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>أدخل السبب</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.reasonPlaceholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={customReason}
              onChangeText={setCustomReason}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.rejectButton, !selectedReason && styles.rejectButtonDisabled]}
          onPress={handleReject}
          disabled={isLoading || !selectedReason}
        >
          <Text style={styles.rejectButtonText}>رفض الطلب</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => safeGoBack(navigation, 'dsh_partner_orders_list')}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>{t('dsh.app-partner.mobile.auto_dsh_partner_order_reject.cancelButtonText')}</Text>
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
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  reasonOption: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  reasonOptionSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  reasonText: {
    fontSize: 16,
    color: semanticRoles.text,
  },
  reasonTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    color: semanticRoles.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  rejectButton: {
    backgroundColor: colorTokens.error['500'],
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  rejectButtonDisabled: {
    opacity: 0.5,
  },
  rejectButtonText: {
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

export default AutoDshPartnerOrderReject;

