/**
 * Field Partner Draft Update — field_partner_draft_update
 * Surface: app-field | Service: field
 * Operation: PATCH /api/field/partners/drafts/{draft_id}
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftUpdateProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_draft_update';

const AutoFieldPartnerDraftUpdate: React.FC<AutoFieldPartnerDraftUpdateProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const draftId = route?.params?.draftId || 'new';
  const isNew = route?.params?.isNew || false;
  
  const [formData, setFormData] = useState({
    partnerName: '',
    phone: '',
    email: '',
    address: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew && draftId !== 'new') {
      loadDraft();
    }
  }, [draftId, isNew]);

  const loadDraft = async () => {
    try {
      setIsLoading(true);
      
      // const draft = await getFieldPartnerDraft(draftId);
      await new Promise(resolve => setTimeout(resolve, 800));
      setFormData({
        partnerName: 'Partner Name',
        phone: '+966501234567',
        email: 'info@example.com',
        address: 'Riyadh, Al Narjis',
        description: t(`${NS}.mockDescription`),
      });
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.loadDraftFailed`));
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.partnerName.trim()) {
      newErrors.partnerName = t(`${NS}.partnerNameRequired`);
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t(`${NS}.phoneRequired`);
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t(`${NS}.phoneInvalid`);
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t(`${NS}.emailInvalid`);
    }
    if (!formData.address.trim()) {
      newErrors.address = t(`${NS}.addressRequired`);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.fixFormErrors`));
      return;
    }

    setIsSaving(true);
    try {
      // await updateFieldPartnerDraft(draftId, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(t(`${NS}.success`), t(`${NS}.saveDraftSuccess`), [
        { text: t(`${NS}.ok`), onPress: () => navigation?.goBack() },
      ]);
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.saveDraftFailed`));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t(`${NS}.loadingMessage`)}
        screenName="field_partner_draft_update"
        operationName="field_partner_draft_update"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_draft_update"
      operationName="field_partner_draft_update"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isNew ? `➕ ${t(`${NS}.createDraftCta`)}` : `✏️ ${t(`${NS}.updateDraftTitle`)}`}</Text>
            <Text style={styles.subtitle}>{t(`${NS}.fillSubtitle`)}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.partnerNameLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.partnerName && styles.inputError]}
                value={formData.partnerName}
                onChangeText={(value) => handleFieldChange('partnerName', value)}
                placeholder={t(`${NS}.enterPartnerName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.partnerName && <Text style={styles.errorText}>{errors.partnerName}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.phoneLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(value) => handleFieldChange('phone', value)}
                placeholder="+966501234567"
                keyboardType="phone-pad"
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.emailLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                placeholder="info@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.addressLabel`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.address && styles.inputError]}
                value={formData.address}
                onChangeText={(value) => handleFieldChange('address', value)}
                placeholder={t(`${NS}.enterFullAddress`)}
                multiline
                numberOfLines={3}
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.descriptionLabel`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleFieldChange('description', value)}
                placeholder={t(`${NS}.additionalDescription`)}
                multiline
                numberOfLines={4}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? t(`${NS}.saving`) : `💾 ${t(`${NS}.saveButton`)}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => navigation?.goBack()}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{t(`${NS}.cancel`)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  form: {
    gap: BTHWANI_SPACING.md,
  },
  fieldGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
  },
  inputError: {
    borderColor: colorTokens.error['500'],
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colorTokens.error['500'],
    marginTop: BTHWANI_SPACING.xs,
  },
  actions: {
    marginTop: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.md,
  },
  actionButton: {
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  cancelButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AutoFieldPartnerDraftUpdate;
