// SHEIN Manual Order Form – dsh_external_order_create
// Surface: app-client | Service: dsh
// Single vertical form, no store / catalog / search

import React, { useState, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

// Canonical React component name for this screen
export const SheinCreateRequestScreen: React.FC<Props> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');

  const [productUrl, setProductUrl] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [sizeColor, setSizeColor] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState(''); // comma-separated image URLs or upload IDs

  const [submitting, setSubmitting] = useState(false);
  const [errorUrl, setErrorUrl] = useState<string | null>(null);
  const [errorQuantity, setErrorQuantity] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simple loading state for UX – no heavy logic
    const t = setTimeout(() => setState('content'), 400);
    return () => clearTimeout(t);
  }, []);

  const validate = (): boolean => {
    setErrorUrl(null);
    setErrorQuantity(null);
    setSuccessMessage(null);

    let ok = true;

    if (!productUrl || !productUrl.trim()) {
      setErrorUrl(t('dsh.app-client.mobile.auto_dsh_external_order_create.validationProductLinkRequired'));
      ok = false;
    } else if (!productUrl.trim().toLowerCase().startsWith('http')) {
      setErrorUrl(t('dsh.app-client.mobile.auto_dsh_external_order_create.validationLinkFormat'));
      ok = false;
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) {
      setErrorQuantity(t('dsh.app-client.mobile.auto_dsh_external_order_create.validationMinQuantity'));
      ok = false;
    }

    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setErrorUrl(null);
    setErrorQuantity(null);
    setSuccessMessage(null);

    try {
      // Strip trailing slash and any trailing /api to avoid /api/api duplication
      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.slice(0, -4);
      }
      console.log('[SHEIN] EXPO_PUBLIC_API_URL =', process.env.EXPO_PUBLIC_API_URL);
      console.log('[SHEIN] Using baseUrl =', baseUrl);

      const payload = {
        serviceCode: 'SHEIN_PROXY',
        productUrl: productUrl.trim(),
        quantity: Number(quantity),
        sizeColor: sizeColor || undefined,
        notes: notes || undefined,
        images: images
          ? images
              .split(',')
              .map(v => v.trim())
              .filter(Boolean)
          : [],
      };

      const requestUrl = `${baseUrl}/api/dsh/proxy-request`;
      console.log('[SHEIN] Request URL =', requestUrl);

      const response = await rawFetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.error || 'Operation failed');
      }

      const requestId = result?.data?.requestId;
      setSuccessMessage(t('dsh.app-client.mobile.auto_dsh_external_order_create.successSubmitMessage'));
      // Reset form
      setProductUrl('');
      setQuantity('1');
      setSizeColor('');
      setNotes('');
      setImages('');
      // انتقال لتتبع الطلب لإكمال الدائرة
      if (requestId && navigation) {
        (navigation as any).navigate('auto_dsh_proxy_request_tracking', { requestId });
      }
    } catch (error) {
      console.error('Error submitting SHEIN request:', error);
      setErrorUrl(t('dsh.app-client.mobile.auto_dsh_external_order_create.errorSubmitMessage'));
    } finally {
      setSubmitting(false);
    }
  };

  if (state !== 'content') {
    return (
      <ScreenWrapper
        state={state}
        screenName="auto_dsh_external_order_create"
        operationName="dsh_external_order_create"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_external_order_create.loadingFormMessage')}
        errorMessage={t('dsh.app-client.mobile.auto_dsh_external_order_create.errorLoadScreenMessage')}
      />
    );
  }

  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <ScreenWrapper state="content" screenName="SheinCreateRequestScreen" operationName="dsh_external_order_create">
      <KeyboardAvoidingView style={styles.flex} behavior={behavior} keyboardVerticalOffset={80}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>طلب شراء من SHEIN</Text>
              <Text style={styles.subtitle}>
                الصق رابط المنتج من موقع SHEIN وأدخل الكمية وباقي التفاصيل، وسيقوم فريق العمليات بكل شيء.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                رابط المنتج *
              </Text>
              <TextInput
                style={[styles.input, errorUrl && styles.inputError]}
                placeholder="https://www.shein.com/..."
                value={productUrl}
                onChangeText={setProductUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
              {errorUrl && <Text style={styles.errorText}>{errorUrl}</Text>}
            </View>

            <View style={[styles.fieldGroupRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>
                  الكمية *
                </Text>
                <TextInput
                  style={[styles.input, errorQuantity && styles.inputError]}
                  placeholder="1"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
                {errorQuantity && <Text style={styles.errorText}>{errorQuantity}</Text>}
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>
                  المقاس / اللون (اختياري)
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('dsh.app-client.mobile.auto_dsh_external_order_create.exampleVariantPlaceholder')}
                  value={sizeColor}
                  onChangeText={setSizeColor}
                  maxLength={100}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                ملاحظات إضافية (اختياري)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('dsh.app-client.mobile.auto_dsh_external_order_create.extraDetailsPlaceholder')}
                value={notes}
                onChangeText={setNotes}
                maxLength={500}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.helperText}>
                أقصى حد 500 حرف.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                روابط الصور (اختياري)
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('dsh.app-client.mobile.auto_dsh_external_order_create.imagesLinkHint')}
                value={images}
                onChangeText={setImages}
                autoCapitalize="none"
                multiline
              />
              <Text style={styles.helperText}>
                مثال: upl_123, upl_456, upl_789
              </Text>
            </View>

            {successMessage && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitText}>
                {submitting ? t('dsh.app-client.mobile.auto_dsh_external_order_create.loadingSubmitMessage') : successMessage ? 'تم إرسال الطلب' : 'إرسال الطلب'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  fieldGroupRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  fieldHalf: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.borderSubtle,
    backgroundColor: BTHWANI_COLORS.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: BTHWANI_COLORS.danger,
  },
  errorText: {
    marginTop: BTHWANI_SPACING.xs,
    fontSize: 12,
    color: BTHWANI_COLORS.danger,
  },
  helperText: {
    marginTop: BTHWANI_SPACING.xs,
    fontSize: 11,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  successBox: {
    marginTop: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: 8,
    backgroundColor: BTHWANI_COLORS.successSubtle,
  },
  successText: {
    fontSize: 13,
    color: BTHWANI_COLORS.success,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.lg,
    paddingTop: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.borderSubtle,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: BTHWANI_COLORS.onPrimary,
  },
});

// Keep default export named for backwards compatibility in barrels/routeMap
const auto_dsh_external_order_create = SheinCreateRequestScreen;
export default auto_dsh_external_order_create;

