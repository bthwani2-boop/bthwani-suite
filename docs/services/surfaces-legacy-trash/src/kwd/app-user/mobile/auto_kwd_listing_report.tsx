// KWD Listing Report Screen - Report Inappropriate Job Listing
// Surface: app-client | Service: kwd
// §30 States: Loading / Empty / Error / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// Simple report form: reason (required) + optional details

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { ScreenState, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  colorTokens,
  elevation,
  typography,
} from '@bthwani/ui-kit';
import {
  AppScreenLayout,
  ScreenHeader,
  ScreenSection,
  AppLoadingState,
  AppErrorState,
  AppSuccessState,
} from '@bthwani/ui-kit';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

type ReportTargetType = 'listing' | 'user' | 'application';

interface auto_kwd_listing_reportProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: {
    params?: {
      reportType?: ReportTargetType;
      listingId?: string;
      jobId?: string;
      jobTitle?: string;
      companyName?: string;
      applicationId?: string;
      userId?: string;
      targetUserName?: string;
    };
  };
}

export const auto_kwd_listing_report: React.FC<
  auto_kwd_listing_reportProps
> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );
  const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);

  const reportType: ReportTargetType = route?.params?.reportType || 'listing';
  const listingId = route?.params?.listingId || route?.params?.jobId || '';
  const jobTitle =
    route?.params?.jobTitle ||
    t('kwd.app-client.mobile.auto_kwd_listing_report.job');
  const companyName =
    route?.params?.companyName ||
    t('kwd.app-client.mobile.auto_kwd_listing_report.companyFallback');
  const applicationId = route?.params?.applicationId || '';
  const userId = route?.params?.userId || '';
  const targetUserName =
    route?.params?.targetUserName ||
    t('kwd.app-client.mobile.auto_kwd_listing_report.userFallback');
  const entityId =
    reportType === 'listing'
      ? listingId || 'job_123456'
      : applicationId || userId || '';

  // Form fields
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

  // Network state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs
  const hasSubmittedRef = useRef(false);

  const handleNavigate = useCallback(
    (screen: string, params?: any) => {
      if (navigation?.navigate) {
        navigation.navigate(screen as any, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

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
      const isNetworkError =
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.name === 'TypeError' ||
          error.message.includes('Network request failed') ||
          error.message.includes('timeout'));

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (reportType === 'listing') {
      if (!listingId || listingId.trim().length === 0) {
        newErrors.listingId = t('surfaces.معرف_الإعلان_مطلوب');
      }
    } else {
      if (!applicationId && !userId) {
        newErrors.entityId = t('surfaces.معرف_التقديم_أو_المستخدم_مطلوب');
      }
    }

    if (!selectedReason || selectedReason.trim().length === 0) {
      newErrors.reason = t('surfaces.mustSelectReportReason');
    }

    if (additionalDetails && additionalDetails.length > 1000) {
      newErrors.details = t('surfaces.التفاصيل_الإضافية_يجب_أن_تكون_أقل_من');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit report
  const handleSubmitReport = useCallback(async () => {
    if (hasSubmittedRef.current) return;

    if (!validateForm()) {
      Alert.alert(
        t('kwd.app-client.mobile.auto_kwd_listing_report.validationRequired'),
        t('kwd.app-client.mobile.auto_kwd_listing_report.validationRequired')
      );
      return;
    }

    try {
      setSubmitting(true);
      setState('loading');
      setNetworkError(null);
      setIsOffline(false);

      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/kwd/reports`;

      const requestBody: Record<string, unknown> = {
        reportType,
        reason: selectedReason,
        details: additionalDetails.trim() || undefined,
        contactInfo: contactInfo.trim() || undefined,
      };
      if (reportType === 'listing') {
        requestBody.listingId = listingId || entityId;
      } else {
        if (applicationId) requestBody.applicationId = applicationId;
        if (userId) requestBody.userId = userId;
      }

      const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t('errors.login_required'));
        }
        if (response.status === 403) {
          throw new Error('حسابك غير مفعّل. يرجى تفعيل حسابك');
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || t('errors.invalid_data'));
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || t('surfaces.failedToSendReport'));
      }

      hasSubmittedRef.current = true;
      setState('success');
      setIsOffline(false);
      setNetworkError(null);
      setRetryCount(0);
    } catch (error: any) {
      console.error('[KWD Listing Report] Submit error:', error);
      const isNetworkError =
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.name === 'TypeError' ||
          error.message.includes('Network request failed') ||
          error.message.includes('timeout') ||
          error.message.includes('NetworkError') ||
          error.message.includes('Failed to fetch'));

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError(t('surfaces.networkErrorCheckConnection'));
        setRetryCount(prev => prev + 1);
        setState('error');
      } else {
        setIsOffline(false);
        const errorMessage =
          error instanceof Error
            ? error.message
            : t('kwd.app-client.mobile.auto_kwd_listing_report.errorSendMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    reportType,
    listingId,
    applicationId,
    userId,
    entityId,
    selectedReason,
    additionalDetails,
    contactInfo,
    retryCount,
  ]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setNetworkError(null);
    setIsOffline(false);
    handleSubmitReport();
  }, [handleSubmitReport]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    if (navigation && t('surfaces.goBack') in navigation) {
      (navigation as any).goBack();
    } else if (onNavigate) {
      if (reportType === 'listing') {
        onNavigate('KwdJobGet', { jobId: listingId || entityId });
      } else {
        onNavigate('KwdMyApplicationsList');
      }
    }
  }, [navigation, onNavigate, reportType, listingId, entityId]);

  // Success handler
  const handleSuccess = useCallback(() => {
    if (navigation && 'goBack' in navigation) {
      (navigation as any).goBack();
    } else if (onNavigate) {
      onNavigate('KwdJobsList');
    }
  }, [navigation, onNavigate]);

  const reportReasonsListing = [
    t('surfaces.إعلان_مضلل_أو_خاطئ'),
    t('surfaces.محتوى_غير_لائق_أو_مسيء'),
    t('surfaces.احتيال_أو_غش'),
    t('surfaces.انتهاك_لحقوق_الملكية_الفكرية'),
    t('surfaces.إعلان_مزدوج_أو_مكرر'),
    t('surfaces.معلومات_اتصال_خاطئة'),
    t('surfaces.سعر_غير_واقعي'),
    t('surfaces.سبب_آخر'),
  ];
  const reportReasonsUser = [
    t('surfaces.سلوك_غير_لائق'),
    t('surfaces.عدم_الرد_أو_التغيّب'),
    t('surfaces.reportReasonFraud'),
    t('surfaces.مخالفة_لشروط_الاستخدام'),
    t('surfaces.reportReasonOther'),
  ];
  const reportReasons =
    reportType === 'listing' ? reportReasonsListing : reportReasonsUser;

  const reportTitle =
    reportType === 'listing'
      ? t('surfaces.الإبلاغ_عن_إعلان_وظيفي')
      : t('surfaces.الإبلاغ_عن_مستخدم_أو_تقديم');
  const reportSubtitle =
    reportType === 'listing'
      ? t('surfaces.ساعدنا_في_الحفاظ_على_جودة_الإعلانات')
      : t('surfaces.ساعدنا_في_الحفاظ_على_بيئة_آمنة_للجمي');

  if (state === 'content') {
    return (
      <AppScreenLayout
        header={<ScreenHeader title={reportTitle} subtitle={reportSubtitle} />}
      >
        <ScreenSection topSpacing={0}>
          <View style={styles.jobCard}>
            <Text style={[styles.jobId, textAlignStart]}>
              #
              {entityId ||
                (reportType === 'listing'
                  ? listingId
                  : applicationId || userId) ||
                '—'}
            </Text>
            <View style={styles.jobInfo}>
              {reportType === 'listing' ? (
                <>
                  <Text style={[styles.jobTitle, textAlignStart]}>
                    {jobTitle}
                  </Text>
                  <Text style={[styles.jobCompany, textAlignStart]}>
                    {companyName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[styles.jobTitle, textAlignStart]}>
                    {targetUserName}
                  </Text>
                  {applicationId || listingId ? (
                    <Text style={[styles.jobCompany, textAlignStart]}>
                      {t('surfaces.relatedListingOrApplication')}
                    </Text>
                  ) : null}
                </>
              )}
            </View>
          </View>
        </ScreenSection>

        <ScreenSection>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              {t('surfaces.reportReasonRequired')}
            </Text>
            <Text style={[styles.sectionDescription, textAlignStart]}>
              {reportType === 'listing'
                ? t('surfaces.اختر_السبب_الذي_ينطبق_على_المشكلة_في')
                : t('surfaces.اختر_السبب_الذي_ينطبق_على_المشكلة')}
            </Text>

            {errors.reason && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.reason}
              </Text>
            )}

            <View style={[styles.reasonsGrid, { direction: layoutDirection }]}>
              {reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonCard,
                    selectedReason === reason && styles.selectedReason,
                  ]}
                  onPress={() => {
                    setSelectedReason(reason);
                    setErrors(prev => ({ ...prev, reason: '' }));
                  }}
                  accessibilityRole='button'
                  accessibilityLabel={reason}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason && styles.selectedReasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScreenSection>

        <ScreenSection>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              {t('surfaces.additionalDetailsOptional')}
            </Text>
            <Text style={[styles.sectionDescription, textAlignStart]}>
              وصف المشكلة بالتفصيل لمساعدتنا في فهمها بشكل أفضل
            </Text>

            {errors.details && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.details}
              </Text>
            )}

            <TextInput
              style={[
                styles.detailsInput,
                errors.details && styles.inputError,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
              placeholder={t(
                'kwd.app-client.mobile.auto_kwd_listing_report.problemDescriptionPlaceholder'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={additionalDetails}
              onChangeText={text => {
                setAdditionalDetails(text);
                setErrors(prev => ({ ...prev, details: '' }));
              }}
              multiline
              numberOfLines={4}
              maxLength={1000}
              textAlignVertical='top'
            />
            <Text style={[styles.charCount, textAlignStart]}>
              {additionalDetails.length}/1000
            </Text>
          </View>
        </ScreenSection>

        <ScreenSection>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              {t('surfaces.contactInfoOptional')}
            </Text>
            <Text style={[styles.sectionDescription, textAlignStart]}>
              إذا كنت تريد متابعة حالة الإبلاغ
            </Text>

            <TextInput
              style={[
                styles.contactInput,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
              placeholder={t(
                'kwd.app-client.mobile.auto_kwd_listing_report.phoneOrEmailPlaceholder'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={contactInfo}
              onChangeText={setContactInfo}
              keyboardType='email-address'
            />
          </View>
        </ScreenSection>

        <ScreenSection>
          <View style={styles.policyCard}>
            <Text style={[styles.policyTitle, textAlignStart]}>
              سياسة الإبلاغ
            </Text>
            <View style={styles.policyPoints}>
              <Text style={[styles.policyPoint, textAlignStart]}>
                • جميع الإبلاغات تُراجع من قبل فريقنا
              </Text>
              <Text style={[styles.policyPoint, textAlignStart]}>
                • الإبلاغات المزيفة قد تؤدي إلى حظر الحساب
              </Text>
              <Text style={[styles.policyPoint, textAlignStart]}>
                • نحافظ على سرية معلوماتك
              </Text>
              <Text style={[styles.policyPoint, textAlignStart]}>
                • الرد على الإبلاغات خلال 24-48 ساعة
              </Text>
            </View>
          </View>
        </ScreenSection>

        <ScreenSection>
          <View style={[styles.warningBanner, { direction: layoutDirection }]}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={[styles.warningText, textAlignStart]}>
              تأكد من صحة المعلومات المقدمة. الإبلاغات المزيفة قد تؤثر على
              سمعتك.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedReason || submitting) && styles.disabledButton,
            ]}
            onPress={handleSubmitReport}
            disabled={!selectedReason || submitting}
            accessibilityRole='button'
            accessibilityLabel={
              submitting
                ? t('surfaces.submitting')
                : t('surfaces.إرسال_الإبلاغ')
            }
          >
            <Text
              style={[
                styles.submitText,
                (!selectedReason || submitting) && styles.disabledText,
              ]}
            >
              {submitting
                ? t('surfaces.submitting')
                : t('surfaces.إرسال_الإبلاغ')}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            accessibilityRole='button'
            accessibilityLabel={t('common.cancel')}
          >
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </ScreenSection>
      </AppScreenLayout>
    );
  }

  const loadingMessage = t('surfaces.جاري_إرسال_الإبلاغ');
  const errorMessage =
    networkError || t('surfaces.فشل_في_إرسال_الإبلاغ_يرجى_المحاولة_م');
  const successMessage = t('surfaces.تم_إرسال_الإبلاغ_بنجاح_سنراجعه_خلال');
  const successActionText = t('surfaces.العودة');

  if (state === 'loading') {
    return (
      <AppScreenLayout disableScroll>
        <AppLoadingState message={loadingMessage} />
      </AppScreenLayout>
    );
  }
  if (state === 'error') {
    return (
      <AppScreenLayout disableScroll>
        <AppErrorState message={errorMessage} />
        <View style={styles.stateCta}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRetry}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.إعادة_المحاولة')}
          >
            <Text style={styles.primaryButtonText}>
              {t('surfaces.إعادة_المحاولة')}
            </Text>
          </TouchableOpacity>
        </View>
      </AppScreenLayout>
    );
  }
  if (state === 'success') {
    return (
      <AppScreenLayout disableScroll>
        <AppSuccessState message={successMessage} />
        <View style={styles.stateCta}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSuccess}
            accessibilityRole='button'
            accessibilityLabel={successActionText}
          >
            <Text style={styles.primaryButtonText}>{successActionText}</Text>
          </TouchableOpacity>
        </View>
      </AppScreenLayout>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...elevation.md,
  },
  jobId: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobInfo: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  jobCompany: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.textMuted,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.error,
    marginBottom: BTHWANI_SPACING.sm,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reasonCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  selectedReason: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: colorTokens.primary['50'] || semanticRoles.surfaceSubtle,
  },
  reasonText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedReasonText: {
    color: semanticRoles.primaryCTA,
    fontWeight: typography.fontWeight.bold,
  },
  detailsInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: semanticRoles.error,
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  contactInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  policyCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...elevation.sm,
  },
  policyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  policyPoints: {
    gap: BTHWANI_SPACING.sm,
  },
  policyPoint: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  warningBanner: {
    backgroundColor: colorTokens.warning['100'] || semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colorTokens.warning['500'] || semanticRoles.warning,
  },
  warningIcon: {
    fontSize: typography.fontSize.xl,
    marginEnd: BTHWANI_SPACING.md,
  },
  warningText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colorTokens.warning['800'] || semanticRoles.warning,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.6,
  },
  submitText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  disabledText: {
    color: semanticRoles.surface,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  cancelText: {
    color: semanticRoles.primaryCTA,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  stateCta: {
    padding: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});

export default auto_kwd_listing_report;

