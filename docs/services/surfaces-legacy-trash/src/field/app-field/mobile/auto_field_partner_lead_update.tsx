/**
 * Field Partner Lead Update — field_partner_lead_update
 * Surface: app-field | Service: field
 * Operation: PATCH /api/field/partners/leads/{lead_id}
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerLeadUpdateProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_lead_update';

const AutoFieldPartnerLeadUpdate: React.FC<AutoFieldPartnerLeadUpdateProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const leadId = route?.params?.leadId || 'new';
  const isNew = route?.params?.isNew || false;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'converted',
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew && leadId !== 'new') {
      loadLead();
    }
  }, [leadId, isNew]);

  const loadLead = async () => {
    try {
      setIsLoading(true);
      
      // const lead = await getFieldPartnerLead(leadId);
      await new Promise(resolve => setTimeout(resolve, 600));
      setFormData({
        name: t('surfaces.عميل_محتمل'),
        phone: '+966501234567',
        email: 'lead@example.com',
        company: t('surfaces.شركة_تجريبية'),
        notes: t('surfaces.ملاحظات_إضافية'),
        status: 'contacted',
      });
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.loadLeadFailed`));
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t(`${NS}.nameRequired`);
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t(`${NS}.phoneRequired`);
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t(`${NS}.phoneInvalid`);
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t(`${NS}.emailInvalid`);
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
      // await updateFieldPartnerLead(leadId, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(
        t(`${NS}.success`),
        isNew ? t(`${NS}.leadCreateSuccess`) : t(`${NS}.leadUpdateSuccess`),
        [{ text: t(`${NS}.ok`), onPress: () => navigation?.goBack() }]
      );
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.saveLeadFailed`));
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
        screenName="field_partner_lead_update"
        operationName="field_partner_lead_update"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_lead_update"
      operationName="field_partner_lead_update"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isNew ? `➕ ${t(`${NS}.titleCreate`)}` : `✏️ ${t(`${NS}.titleUpdate`)}`}</Text>
            <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.nameLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleFieldChange('name', value)}
                placeholder={t(`${NS}.enterName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.companyLabel`)}</Text>
              <TextInput
                style={styles.input}
                value={formData.company}
                onChangeText={(value) => handleFieldChange('company', value)}
                placeholder={t(`${NS}.companyName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.statusLabel`)}</Text>
              <View style={[styles.statusButtons, { flexDirection: 'row', direction: layoutDirection }]}>
                {(['new', 'contacted', 'qualified', 'converted'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.statusButtonActive,
                    ]}
                    onPress={() => handleFieldChange('status', status)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === status && styles.statusButtonTextActive,
                      ]}
                    >
                      {t(`${NS}.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.notesLabel`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => handleFieldChange('notes', value)}
                placeholder={t(`${NS}.notesPlaceholder`)}
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
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  statusButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: semanticRoles.text,
  },
  statusButtonTextActive: {
    color: semanticRoles.primaryCTAText,
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

export default AutoFieldPartnerLeadUpdate;
