/**
 * DSH Partner Store Update — dsh_partner_store_update
 * Surface: app-partner | Service: dsh
 * Operation: PATCH /dsh/partner/profile (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Success
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';
import {
  getDshPartnerStoreProfile,
  updateDshPartnerStoreProfile,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerStoreUpdateProps {
  navigation?: any;
}

export const AutoDshPartnerStoreUpdate: React.FC<AutoDshPartnerStoreUpdateProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getDshPartnerStoreProfile();
      if (!data) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_store_update.validationError'));
      }
      setFormData({
        name: data.name ?? '',
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_update.validationError'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) {
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_store_update.confirmDialogTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_store_update.confirmDialogTitle'));
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const ok = await updateDshPartnerStoreProfile(formData);
      if (!ok) {
        throw new Error('فشل في التحديث');
      }

      setIsSuccess(true);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_store_update.confirmSaveTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_store_update.confirmSaveTitle'), [
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_store_update.confirmButtonText'),
          onPress: () => safeGoBack(navigation, 'dsh_partner_store_get')
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_update.errorMessage');
      setError(errorMessage);
      Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_store_update.errorDialogTitle'), errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [formData, navigation]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_store_update.errorMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.errorActionText')}
      onErrorAction={loadStore}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.successMessage')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.successActionText')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_store_update"
      operationName="dsh_partner_store_update"
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>اسم المتجر *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.placeholderStoreName')}
            placeholderTextColor={semanticRoles.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('dsh.app-partner.mobile.auto_dsh_partner_store_update.labelAddress')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_store_update.placeholderDescription')}
            placeholderTextColor={semanticRoles.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('dsh.app-partner.mobile.auto_dsh_partner_store_update.labelPhone')}</Text>
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
          <Text style={styles.label}>{t('dsh.app-partner.mobile.auto_dsh_partner_store_update.labelEmail')}</Text>
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
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? t('dsh.app-partner.mobile.auto_dsh_partner_store_update.submitButtonText') : t('dsh.app-partner.mobile.auto_dsh_partner_store_update.submitButtonText')}
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
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AutoDshPartnerStoreUpdate;

