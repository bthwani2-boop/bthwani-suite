// MRF Report Update Screen - Update Report
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Per roadmap: mrf_report_update → entity_update (entityType=report, domain=MRF) - unified operation

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

interface auto_mrf_report_updateProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack?: () => void;
  };
  route?: { params?: { reportId?: string } };
}

export const auto_mrf_report_update: React.FC<auto_mrf_report_updateProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'active' | 'resolved' | 'closed'>('active');

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

  // Load existing report data
  const loadReport = useCallback(async () => {
    if (!reportId) {
      setNetworkError('معرف البلاغ غير موجود');
      setState('error');
      return;
    }

    try {
      setState('loading');
      setNetworkError(null);
      setIsOffline(false);
      
      const baseUrl = getBaseUrl();
      // Load report using entity_get
      const url = `${baseUrl}/api/entities/${reportId}?entityType=report&domain=MRF`;

      console.log(`[MRF Report Update] Loading report from: ${url}`);

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setNetworkError('البلاغ غير موجود');
          setState('error');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في تحميل البلاغ');
      }

      // Transform entity_get response to form fields
      const entityData = json?.data || {};
      const reportMetadata = entityData.metadata || {};

      setTitle(reportMetadata.title || '');
      setDescription(reportMetadata.description || '');
      setLocation(reportMetadata.location?.address || reportMetadata.location || '');
      setCategory(reportMetadata.category || '');
      setStatus((reportMetadata.status || 'active') as 'active' | 'resolved' | 'closed');

      setState('content');
      hasLoadedRef.current = true;
    } catch (error: any) {
      console.error(`[MRF Report Update] Load error:`, error);
      const isNetworkError = error instanceof Error && (
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
      } else {
        setIsOffline(false);
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_report_update.errorLoadMessage');
        setNetworkError(errorMessage);
      }
      setState('error');
    }
  }, [reportId]);

  // Load report on mount
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadReport();
    }
  }, [loadReport]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_update.validationRequired'), t('mrf.app-client.mobile.auto_mrf_report_update.validationRequired'));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_update.validationRequired_193'), t('mrf.app-client.mobile.auto_mrf_report_update.validationRequired_193'));
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!reportId) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_update.reportIdNotFound'), t('mrf.app-client.mobile.auto_mrf_report_update.reportIdNotFound'));
      return;
    }

    setSubmitting(true);
    setState('loading');
    setNetworkError(null);
    setIsOffline(false);

    try {
      const baseUrl = getBaseUrl();
      // Per roadmap: mrf_report_update → entity_update (entityType=report, domain=MRF)
      const url = `${baseUrl}/api/entities/${reportId}`;

      console.log(`[MRF Report Update] Updating report: ${reportId}`);

      const response = await fetchWithRetry(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          entityType: 'report',
          domain: 'MRF',
          title: title.trim(),
          description: description.trim(),
          location: location.trim() || undefined,
          category: category.trim() || undefined,
          status: status,
        }),
      });

      console.log(`[MRF Report Update] Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 404) {
          setNetworkError('البلاغ غير موجود');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 400) {
          let errorMessage = 'طلب غير صحيح';
          try {
            const errorData = await response.json();
            errorMessage = errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            // Ignore
          }
          setNetworkError(errorMessage);
          setState('error');
          setIsOffline(false);
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (parseError) {
          // Ignore
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في تحديث البلاغ');
      }

      console.log(`[MRF Report Update] Report updated successfully`);
      setState('success');
    } catch (error: any) {
      console.error(`[MRF Report Update] Submit error:`, error);
      const isNetworkError = error instanceof Error && (
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
        setState('error');
      } else {
        setIsOffline(false);
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_report_update.errorUpdateMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      setSubmitting(false);
    }
  }, [title, description, location, category, status, reportId]);

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
            <Text style={[styles.title, textAlignStart]}>تحديث البلاغ</Text>
            <Text style={[styles.subtitle, textAlignStart]}>
              {reportId ? `تعديل بيانات البلاغ ${reportId}` : t('surfaces.تعديل_بيانات_بلاغ_المفقود')}
            </Text>
          </View>

          {/* Report ID Info */}
          {reportId && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>معرف البلاغ:</Text>
              <Text style={styles.infoValue}>{reportId}</Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>عنوان البلاغ *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('mrf.app-client.mobile.auto_mrf_report_update.placeholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={200}
              editable={!submitting}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>وصف البلاغ *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('mrf.app-client.mobile.auto_mrf_report_update.reportDescriptionPlaceholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              maxLength={1000}
              editable={!submitting}
            />
            <Text style={[styles.charCount, textAlignStart]}>{description.length}/1000 حرف</Text>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>الموقع (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder={t('mrf.app-client.mobile.auto_mrf_report_update.placeholder_384')}
              placeholderTextColor={semanticRoles.textMuted}
              value={location}
              onChangeText={setLocation}
              maxLength={200}
              editable={!submitting}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>الفئة (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder={t('mrf.app-client.mobile.auto_mrf_report_update.placeholder_398')}
              placeholderTextColor={semanticRoles.textMuted}
              value={category}
              onChangeText={setCategory}
              maxLength={100}
              editable={!submitting}
            />
          </View>

          {/* Status */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>حالة البلاغ</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'active' && styles.statusButtonSelected,
                  status === 'active' && { backgroundColor: semanticRoles.stateInfo.icon },
                ]}
                onPress={() => setStatus('active')}
                disabled={submitting}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'active' && styles.statusButtonTextSelected,
                ]}>
                  نشط
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'resolved' && styles.statusButtonSelected,
                  status === 'resolved' && { backgroundColor: semanticRoles.stateSuccess.icon },
                ]}
                onPress={() => setStatus('resolved')}
                disabled={submitting}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'resolved' && styles.statusButtonTextSelected,
                ]}>
                  تم الحل
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'closed' && styles.statusButtonSelected,
                  status === 'closed' && { backgroundColor: semanticRoles.textMuted },
                ]}
                onPress={() => setStatus('closed')}
                disabled={submitting}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'closed' && styles.statusButtonTextSelected,
                ]}>
                  مغلق
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={[styles.warningText, textAlignStart]}>
              يرجى التأكد من صحة المعلومات المحدثة. التحديثات الكاذبة قد تؤدي إلى إجراءات قانونية.
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
              {submitting ? 'جاري الحفظ...' : t('surfaces.حفظ_التغييرات')}
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
            <Text style={styles.cancelButtonText}>إلغاء</Text>
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
        errorMessage={networkError || t('states.offline')}
        onErrorAction={handleRetry}
        screenName="auto_mrf_report_update"
        operationName="mrf_report_update"
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={submitting ? t('surfaces.جاري_حفظ_التغييرات') : t('surfaces.جاري_تحميل_البلاغ')}
      errorMessage={networkError || (submitting ? t('surfaces.فشل_في_تحديث_البلاغ') : "فشل في تحميل البلاغ")}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_تحديث_البلاغ_بنجاح')}
      successActionText="العودة للبلاغ"
      onSuccessAction={handleSuccessAction}
      screenName="auto_mrf_report_update"
      operationName="mrf_report_update"
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
    marginBottom: BTHWANI_SPACING.sm,
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
  statusButtons: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  statusButton: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonSelected: {
    borderColor: semanticRoles.primaryCTA,
  },
  statusButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  statusButtonTextSelected: {
    color: semanticRoles.surface,
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

export default auto_mrf_report_update;

