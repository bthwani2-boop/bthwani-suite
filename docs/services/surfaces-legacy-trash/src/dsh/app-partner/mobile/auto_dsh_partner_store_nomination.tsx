/**
 * DSH Partner Store Nomination — ترشيح متجر
 * Surface: app-partner | Service: dsh
 * Operation: POST /api/dsh/partner/store-nominations
 * الترشيح يُعرض في قسم الشركاء بلوحة التحكم للموافقة أو الرفض.
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

interface AutoDshPartnerStoreNominationProps {
  navigation?: any;
}

export const AutoDshPartnerStoreNomination: React.FC<AutoDshPartnerStoreNominationProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim()) {
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.validationStoreNameRequired'), t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.validationStoreNameRequired'));
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const res = await rawFetch(`${getBaseUrl()}/api/dsh/partner/store-nominations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إرسال الترشيح');

      setIsSuccess(true);
      Alert.alert(
        t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.successSentTitle'),
        t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.successSentMessage'),
        [{ text: t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.okButton'), onPress: () => safeGoBack(navigation, 'dsh_partner_store_get') }]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.errorSendMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.errorTitle'), errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [formData, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.retryButton')}
      onErrorAction={() => setError(null)}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.successSentMessageAlt')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_store_nomination"
      operationName="dsh_partner_store_nominations_post"
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ترشيح متجر</Text>
          <Text style={styles.subtitle}>أدخل بيانات المتجر المرشّح. سيتم مراجعة الطلب من الفريق والموافقة عليه أو رفضه.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>اسم المتجر *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.storeNamePlaceholder')}
            placeholderTextColor={semanticRoles.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>العنوان</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.addressPlaceholder')}
            placeholderTextColor={semanticRoles.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>رقم الهاتف</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+966501234567"
            placeholderTextColor={semanticRoles.textMuted}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="store@example.com"
            placeholderTextColor={semanticRoles.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSaving}
        >
          <Text style={styles.submitButtonText}>
            {isSaving ? t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.submitNominationButton') : t('dsh.app-partner.mobile.auto_dsh_partner_store_nomination.submitNominationButton')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    lineHeight: 20,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    color: semanticRoles.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AutoDshPartnerStoreNomination;
