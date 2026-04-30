/**
 * DSH Field Store Activation Request — dsh_field_store_activation_request
 * Surface: app-field | Service: dsh
 * Operation: POST /api/dsh/field/stores/{store_id}/activation-request
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';
import { requestDshFieldStoreActivation } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshFieldStoreActivationRequestProps {
  navigation?: any;
  route?: { params?: { storeId?: string; store_id?: string } };
}

const AutoDshFieldStoreActivationRequest: React.FC<AutoDshFieldStoreActivationRequestProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const storeIdFromParams = route?.params?.storeId ?? route?.params?.store_id ?? '';
  const [storeIdInput, setStoreIdInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveStoreId = (storeIdFromParams || storeIdInput || '').trim();

  const handleActivationRequest = async () => {
    if (!effectiveStoreId) {
      Alert.alert(t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.validationRequired'), t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.validationRequired'));
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      const success = await requestDshFieldStoreActivation(effectiveStoreId);
      if (!success) throw new Error('فشل في إرسال طلب التفعيل');
      setIsSuccess(true);
      Alert.alert(t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.storeActivationRequestSentSuccess'), t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.storeActivationRequestSentSuccess'), [
        { text: t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.okButton'), onPress: () => navigation?.goBack?.() },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.errorSendMessage');
      setError(msg);
      Alert.alert(t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.errorMessage'), msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      errorMessage={error || undefined}
      onErrorAction={error ? () => setError(null) : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="store" size={64} color={semanticRoles.primaryCTA} />
          <Text style={styles.title}>طلب تفعيل المتجر</Text>
          <Text style={styles.subtitle}>
            إرسال طلب تفعيل المتجر للنظام. افتح الشاشة من سياق المتجر أو أدخل المعرف أدناه.
          </Text>
          {!storeIdFromParams && (
            <TextInput
              style={styles.input}
              placeholder={t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.optionalLabel')}
              placeholderTextColor={semanticRoles.textMuted}
              value={storeIdInput}
              onChangeText={setStoreIdInput}
              editable={!isSubmitting}
            />
          )}
          {storeIdFromParams ? (
            <Text style={styles.storeIdLabel}>المتجر: {storeIdFromParams}</Text>
          ) : null}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleActivationRequest}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.sendActivationRequest') : t('dsh.app-field.mobile.auto_dsh_field_store_activation_request.sendActivationRequest')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    color: semanticRoles.text,
    fontSize: 16,
  },
  storeIdLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  button: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshFieldStoreActivationRequest;

