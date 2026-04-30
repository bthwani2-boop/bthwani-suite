/**
 * Field Partner Product Update — field_partner_product_update
 * Surface: app-field | Service: field
 * Operation: PUT /api/field/partners/{partner_id}/products/{product_id}
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerProductUpdateProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_product_update';

const AutoFieldPartnerProductUpdate: React.FC<AutoFieldPartnerProductUpdateProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const partnerId = route?.params?.partnerId || 'unknown';
  const productId = route?.params?.productId || 'unknown';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    serviceType: 'DSH' as 'DSH' | 'ARB',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      
      // const product = await getFieldPartnerProduct(partnerId, productId);
      await new Promise(resolve => setTimeout(resolve, 600));
      setFormData({
        name: t(`${NS}.mockProductName`),
        description: t(`${NS}.descriptionPlaceholder`),
        price: '50',
        serviceType: 'DSH',
      });
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.loadFailed`));
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t(`${NS}.nameRequired`);
    }
    if (!formData.price.trim()) {
      newErrors.price = t(`${NS}.priceRequired`);
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = t(`${NS}.priceInvalid`);
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
      // await updateFieldPartnerProduct(partnerId, productId, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(t(`${NS}.success`), t(`${NS}.updateSuccess`), [
        { text: t(`${NS}.ok`), onPress: () => navigation?.goBack() },
      ]);
    } catch (err) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.updateFailed`));
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
        screenName="field_partner_product_update"
        operationName="field_partner_product_update"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_product_update"
      operationName="field_partner_product_update"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>✏️ {t(`${NS}.title`)}</Text>
            <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.nameLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => handleFieldChange('name', value)}
                placeholder={t(`${NS}.enterProductName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.descriptionLabel`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleFieldChange('description', value)}
                placeholder={t(`${NS}.descriptionPlaceholder`)}
                multiline
                numberOfLines={4}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.priceLabel`)}</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={formData.price}
                onChangeText={(value) => handleFieldChange('price', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor={semanticRoles.textMuted}
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t(`${NS}.serviceTypeLabel`)}</Text>
              <View style={[styles.serviceTypeButtons, { flexDirection: 'row', direction: layoutDirection }]}>
                <TouchableOpacity
                  style={[
                    styles.serviceTypeButton,
                    formData.serviceType === 'DSH' && styles.serviceTypeButtonActive,
                  ]}
                  onPress={() => handleFieldChange('serviceType', 'DSH')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.serviceTypeButtonText,
                      formData.serviceType === 'DSH' && styles.serviceTypeButtonTextActive,
                    ]}
                  >
                    🏪 {t(`${NS}.serviceTypeDsh`)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.serviceTypeButton,
                    formData.serviceType === 'ARB' && styles.serviceTypeButtonActive,
                  ]}
                  onPress={() => handleFieldChange('serviceType', 'ARB')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.serviceTypeButtonText,
                      formData.serviceType === 'ARB' && styles.serviceTypeButtonTextActive,
                    ]}
                  >
                    🎭 {t(`${NS}.serviceTypeArb`)}
                  </Text>
                </TouchableOpacity>
              </View>
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
  serviceTypeButtons: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  serviceTypeButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  serviceTypeButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  serviceTypeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
  },
  serviceTypeButtonTextActive: {
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

export default AutoFieldPartnerProductUpdate;
