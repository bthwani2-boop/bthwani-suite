// MRF Claim Create Screen - Create Claim for Report
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Per roadmap: mrf_claim_create → entity_create (entityType=claim, domain=MRF) - unified operation

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_claim_createProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack?: () => void;
  };
  route?: { params?: { reportId?: string } };
}

export const auto_mrf_claim_create: React.FC<auto_mrf_claim_createProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Form fields
  const [claimDetails, setClaimDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Get reportId from route params
  const reportId = route?.params?.reportId || '';

  // Retry helper with exponential backoff
  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries: number = MAX_RETRIES,
    attempt: number = 0
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }, REQUEST_TIMEOUT);

    try {
      const response = await rawFetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const validateForm = (): boolean => {
    if (!claimDetails.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_claim_create.errorMessage'), t('mrf.app-client.mobile.auto_mrf_claim_create.errorMessage'));
      return false;
    }
    if (claimDetails.trim().length < 10) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_claim_create.claimDetailsMinLength'), t('mrf.app-client.mobile.auto_mrf_claim_create.claimDetailsMinLength'));
      return false;
    }
    if (!contactInfo.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_claim_create.validationRequired'), t('mrf.app-client.mobile.auto_mrf_claim_create.validationRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!reportId) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_claim_create.reportIdNotFound'), t('mrf.app-client.mobile.auto_mrf_claim_create.reportIdNotFound'));
      return;
    }

    setSubmitting(true);
    setState('loading');
    setNetworkError(null);
    setIsOffline(false);

    try {
      const baseUrl = getBaseUrl();
      // Per roadmap: mrf_claim_create → entity_create (entityType=claim, domain=MRF)
      const url = `${baseUrl}/api/entities`;

      console.log(`[MRF Claim Create] Creating claim for report: ${reportId}`);

      const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          entityType: 'claim',
          domain: 'MRF',
          reportId: reportId,
          claimDetails: claimDetails.trim(),
          contactInfo: contactInfo.trim(),
          additionalInfo: additionalInfo.trim() || undefined,
        }),
      });

      console.log(`[MRF Claim Create] Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[MRF Claim Create] HTTP error: ${response.status} ${response.statusText}`);

        if (response.status === 401 || response.status === 403) {
          setNetworkError(t('surfaces.يرجى_تسجيل_الدخول_للوصول_إلى_هذه_الص'));
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 400) {
          let errorMessage = t('surfaces.طلب_غير_صحيح');
          try {
            const errorData = await response.json();
            console.error(`[MRF Claim Create] Error response:`, errorData);
            errorMessage = errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            console.error(`[MRF Claim Create] Failed to parse error response:`, parseError);
          }
          setNetworkError(errorMessage);
          setState('error');
          setIsOffline(false);
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error(`[MRF Claim Create] Error response:`, errorData);
          errorMessage = errorData?.error || errorData?.message || errorData?.error_code || errorMessage;
        } catch (parseError) {
          console.error(`[MRF Claim Create] Failed to parse error response:`, parseError);
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);

      const json = await response.json();
      console.log(`[MRF Claim Create] Parsed response:`, { success: json?.success, hasData: !!json?.data });

      if (!json?.success) {
        const errorMsg = json?.error || json?.message || t('surfaces.فشل_في_إنشاء_المطالبة');
        console.error(`[MRF Claim Create] API returned success=false:`, errorMsg);
        throw new Error(errorMsg);
      }

      console.log(`[MRF Claim Create] Claim created successfully`);
      setState('success');
    } catch (error: any) {
      console.error(`[MRF Claim Create] Submit error:`, error);
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
        setState('error');
      } else {
        setIsOffline(false);
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_claim_create.errorCreateMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      setSubmitting(false);
    }
  }, [claimDetails, contactInfo, additionalInfo, reportId]);

  const handleRetry = useCallback(() => {
    setState('content');
    setNetworkError(null);
    setIsOffline(false);
  }, []);

  const handleSuccessAction = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate('MrfReportGet' as any, { reportId });
    } else if (onNavigate) {
      onNavigate('MrfReportGet', { reportId });
    } else {
      setState('content');
    }
  }, [navigation, onNavigate, reportId]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_create.title')}</Text>
            <Text style={[styles.subtitle, textAlignStart]}>
              {reportId ? `مطالبة مرتبطة بالبلاغ ${reportId}` : t('surfaces.إضافة_مطالبة_مرتبطة_ببلاغ_المفقود')}
            </Text>
          </View>

          {/* Report ID Info */}
          {reportId && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>معرف البلاغ:</Text>
              <Text style={styles.infoValue}>{reportId}</Text>
            </View>
          )}

          {/* Claim Details */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>تفاصيل المطالبة *</Text>
            <Text style={[styles.inputHint, textAlignStart]}>
              اشرح تفاصيل المطالبة (مثال: لدي معلومات عن الشخص المفقود، أو عثرت على شيء يطابق الوصف)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('mrf.app-client.mobile.auto_mrf_claim_create.placeholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={claimDetails}
              onChangeText={setClaimDetails}
              multiline
              numberOfLines={6}
              maxLength={1000}
              editable={!submitting}
            />
            <Text style={[styles.charCount, textAlignStart]}>{claimDetails.length}/1000 حرف</Text>
          </View>

          {/* Contact Info */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>معلومات التواصل *</Text>
            <Text style={[styles.inputHint, textAlignStart]}>
              رقم الهاتف أو البريد الإلكتروني للتواصل معك
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('mrf.app-client.mobile.auto_mrf_claim_create.placeholder_300')}
              placeholderTextColor={semanticRoles.textMuted}
              value={contactInfo}
              onChangeText={setContactInfo}
              maxLength={200}
              editable={!submitting}
            />
          </View>

          {/* Additional Info */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>معلومات إضافية (اختياري)</Text>
            <Text style={[styles.inputHint, textAlignStart]}>
              أي معلومات إضافية قد تساعد في حل البلاغ
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('mrf.app-client.mobile.auto_mrf_claim_create.additionalInfoPlaceholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!submitting}
            />
            <Text style={[styles.charCount, textAlignStart]}>{additionalInfo.length}/500 حرف</Text>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={[styles.warningText, textAlignStart]}>
              يرجى التأكد من صحة المعلومات المقدمة. المطالبات الكاذبة قد تؤدي إلى إجراءات قانونية.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={[
              styles.submitButtonText,
              submitting && styles.submitButtonTextDisabled,
            ]}>
              {submitting ? 'جاري الإرسال...' : t('surfaces.إرسال_المطالبة')}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              if (navigation?.goBack) {
                navigation.goBack();
              } else if (navigation?.navigate) {
                navigation.navigate('MrfReportGet' as any, { reportId });
              } else if (onNavigate) {
                onNavigate('MrfReportGet', { reportId });
              }
            }}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>{t('mrf.app-client.mobile.auto_mrf_claim_create.cancelButtonText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // Show offline screen if error and offline
  if (state === 'error' && isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_claim_create.emptySubtitle')}
        onErrorAction={handleRetry}
        screenName="auto_mrf_claim_create"
        operationName="mrf_claim_create"
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={submitting ? t('surfaces.جاري_إرسال_المطالبة') : t('surfaces.جاري_التحميل')}
      errorMessage={networkError || "فشل في إنشاء المطالبة"}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_إنشاء_المطالبة_بنجاح')}
      successActionText={t('surfaces.العودة_للبلاغ')}
      onSuccessAction={handleSuccessAction}
      screenName="auto_mrf_claim_create"
      operationName="mrf_claim_create"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  contentContainer: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.textMuted,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  inputHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 18,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  warningCard: {
    backgroundColor: semanticRoles.stateWarning.icon + '20',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.stateWarning.icon,
  },
  warningIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    marginEnd: BTHWANI_SPACING.sm,
  },
  warningText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    minHeight: 56,
  },
  submitButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.surface,
  },
  submitButtonTextDisabled: {
    color: semanticRoles.textMuted,
  },
  cancelButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    marginTop: BTHWANI_SPACING.md,
  },
  emptyButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
});

export default auto_mrf_claim_create;

