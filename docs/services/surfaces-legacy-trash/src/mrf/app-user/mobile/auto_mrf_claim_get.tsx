// MRF Claim Get Screen - Claim Details
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Per roadmap: mrf_claim_get is a dedicated operation (GET /api/mrf/claims/{claim_id})

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
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_claim_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { claimId?: string } };
}

export const auto_mrf_claim_get: React.FC<auto_mrf_claim_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [claimData, setClaimData] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  // Get claimId from route params
  const claimId = route?.params?.claimId || '';

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

  const loadClaim = useCallback(async (isRetry: boolean = false) => {
    if (isLoadingRef.current) {
      return;
    }

    if (maxRetriesReachedRef.current && !isRetry) {
      setClaimData(null);
      setState('content');
      return;
    }

    if (maxRetriesReachedRef.current && isRetry) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
    }

    if (!claimId) {
      setNetworkError(t('surfaces.معرف_المطالبة_غير_موجود'));
      setState('error');
      return;
    }

    try {
      isLoadingRef.current = true;
      
      if (!isRetry) {
        setState('loading');
        setNetworkError(null);
        setIsOffline(false);
      }
      
      const baseUrl = getBaseUrl();
      // Per roadmap: mrf_claim_get is a dedicated operation
      const url = `${baseUrl}/api/mrf/claims/${claimId}`;

      console.log(`[MRF Claim Get] Loading claim from: ${url}`);

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log(`[MRF Claim Get] Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[MRF Claim Get] HTTP error: ${response.status} ${response.statusText}`);
        
        if (response.status === 401 || response.status === 403) {
          setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 404) {
          setNetworkError(t('surfaces.المطالبة_غير_موجودة'));
          setState('error');
          setIsOffline(false);
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error(`[MRF Claim Get] Error response:`, errorData);
          errorMessage = errorData?.error || errorData?.message || errorData?.error_code || errorMessage;
        } catch (parseError) {
          console.error(`[MRF Claim Get] Failed to parse error response:`, parseError);
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);
      setRetryCount(0);

      const json = await response.json();
      console.log(`[MRF Claim Get] Parsed response:`, { success: json?.success, hasData: !!json?.data });

      if (!json?.success) {
        const errorMsg = json?.error || json?.message || t('surfaces.فشل_في_تحميل_المطالبة');
        console.error(`[MRF Claim Get] API returned success=false:`, errorMsg);
        throw new Error(errorMsg);
      }

      // Transform response to claim format
      // API returns: { success: true, data: { claim: {...} } }
      const claimData = json?.data?.claim || json?.data || {};

      const transformedClaim = {
        id: claimData.id || claimId,
        claimNumber: claimData.claimNumber || claimData.claim_number || '',
        reportId: claimData.reportId || claimData.report_id || '',
        status: claimData.status || 'pending',
        type: claimData.type || '',
        priority: claimData.priority || 'medium',
        title: claimData.title || '',
        description: claimData.description || claimData.claimDetails || claimData.details || '',
        amount: claimData.amount || null,
        claimant: claimData.claimant || '',
        assignee: claimData.assignee || '',
        contactInfo: claimData.contactInfo || claimData.contact || '',
        additionalInfo: claimData.additionalInfo || claimData.additional_info || '',
        createdAt: claimData.createdAt || claimData.created_at || new Date().toISOString(),
        updatedAt: claimData.updatedAt || claimData.updated_at || new Date().toISOString(),
        response: claimData.response || null,
      };

      console.log(`[MRF Claim Get] Transformed claim data`);
      setClaimData(transformedClaim);
      setState('content');
      hasLoadedRef.current = true;
      maxRetriesReachedRef.current = false;
    } catch (error: any) {
      console.error(`[MRF Claim Get] Load error:`, error);
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
        
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount >= 3) {
          maxRetriesReachedRef.current = true;
          hasLoadedRef.current = true;
          setState('error');
        } else {
          setState('error');
        }
      } else {
        setIsOffline(false);
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_claim_get.errorLoadMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [claimId, retryCount]);

  // Load claim on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !isLoadingRef.current && !maxRetriesReachedRef.current) {
      loadClaim();
    }
  }, [loadClaim]);

  const handleRetry = useCallback(() => {
    if (maxRetriesReachedRef.current) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
      loadClaim(true);
    } else {
      loadClaim(true);
    }
  }, [loadClaim]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'accepted': return semanticRoles.stateSuccess.icon;
      case 'rejected': return semanticRoles.stateError.icon;
      case 'resolved': return semanticRoles.stateInfo.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('mrf.app-client.mobile.auto_mrf_claim_get.statusPending');
      case 'accepted': return t('surfaces.مقبولة');
      case 'rejected': return t('mrf.app-client.mobile.auto_mrf_claim_get.statusRejected');
      case 'resolved': return t('surfaces.تم_الحل');
      default: return status;
    }
  };

  if (state === 'content' && claimData) {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.title')}</Text>
            <Text style={[styles.subtitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.subtitle')}</Text>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={[styles.statusLabel, textAlignStart]}>حالة المطالبة:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(claimData.status) }]}>
                <Text style={styles.statusText}>{getStatusText(claimData.status)}</Text>
              </View>
            </View>
            <Text style={[styles.claimId, textAlignStart]}>معرف المطالبة: {claimData.id}</Text>
            {claimData.reportId && (
              <Text style={[styles.reportId, textAlignStart]}>معرف البلاغ: {claimData.reportId}</Text>
            )}
          </View>

          {/* Title */}
          {claimData.title && (
            <View style={styles.titleCard}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleClaim')}</Text>
              <Text style={[styles.titleText, textAlignStart]}>{claimData.title}</Text>
            </View>
          )}

          {/* Claim Details */}
          <View style={styles.detailsCard}>
            <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleDetails')}</Text>
            <Text style={[styles.detailsText, textAlignStart]}>{claimData.description || t('mrf.app-client.mobile.auto_mrf_claim_get.noDetails')}</Text>
          </View>

          {/* Claim Number */}
          {claimData.claimNumber && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>رقم المطالبة:</Text>
              <Text style={styles.infoValue}>{claimData.claimNumber}</Text>
            </View>
          )}

          {/* Type and Priority */}
          {(claimData.type || claimData.priority) && (
            <View style={styles.infoCard}>
              {claimData.type && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>نوع المطالبة:</Text>
                  <Text style={styles.infoValue}>{claimData.type}</Text>
                </View>
              )}
              {claimData.priority && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>الأولوية:</Text>
                  <Text style={styles.infoValue}>
                    {claimData.priority === 'high' ? t('surfaces.عالية') :
                     claimData.priority === 'medium' ? t('surfaces.متوسطة') : t('surfaces.منخفضة')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Contact Info */}
          {claimData.contactInfo && (
            <View style={styles.contactCard}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleContact')}</Text>
              <Text style={[styles.contactText, textAlignStart]}>{claimData.contactInfo}</Text>
            </View>
          )}

          {/* Additional Info */}
          {claimData.additionalInfo && (
            <View style={styles.additionalCard}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleExtra')}</Text>
              <Text style={[styles.additionalText, textAlignStart]}>{claimData.additionalInfo}</Text>
            </View>
          )}

          {/* Response */}
          {claimData.response && (
            <View style={styles.responseCard}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleResponse')}</Text>
              <Text style={[styles.responseText, textAlignStart]}>
                {claimData.response.message || claimData.response || t('surfaces.تم_الرد_على_المطالبة')}
              </Text>
              {claimData.response.respondedAt && (
                <Text style={[styles.responseDate, textAlignStart]}>
                  تاريخ الرد: {new Date(claimData.response.respondedAt).toLocaleString('ar-SA')}
                </Text>
              )}
            </View>
          )}

          {/* Timestamps */}
          <View style={styles.timestampsCard}>
            <Text style={[styles.sectionTitle, textAlignStart]}>{t('mrf.app-client.mobile.auto_mrf_claim_get.sectionTitleTime')}</Text>
            <Text style={[styles.timestampText, textAlignStart]}>
              تاريخ الإنشاء: {new Date(claimData.createdAt).toLocaleString('ar-SA')}
            </Text>
            <Text style={[styles.timestampText, textAlignStart]}>
              آخر تحديث: {new Date(claimData.updatedAt).toLocaleString('ar-SA')}
            </Text>
          </View>

          {/* Actions */}
          {claimData.reportId && (
            <TouchableOpacity
              style={styles.viewReportButton}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('MrfReportGet' as any, { reportId: claimData.reportId });
                } else if (onNavigate) {
                  onNavigate('MrfReportGet', { reportId: claimData.reportId });
                }
              }}
            >
              <Text style={styles.viewReportText}>{t('mrf.app-client.mobile.auto_mrf_claim_get.viewReportText')}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // Show offline screen if error and offline
  if (state === 'error' && isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_claim_get.emptyTitle')}
        onErrorAction={handleRetry}
        screenName="auto_mrf_claim_get"
        operationName="mrf_claim_get"
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_المطالبة')}
      errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_claim_get.errorLoadClaim')}
      onErrorAction={handleRetry}
      screenName="auto_mrf_claim_get"
      operationName="mrf_claim_get"
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
  statusCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  statusLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  claimId: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reportId: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  detailsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  detailsText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  additionalCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  additionalText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  responseCard: {
    backgroundColor: semanticRoles.stateInfo.icon + '20',
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.stateInfo.icon,
  },
  responseText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
    marginBottom: BTHWANI_SPACING.sm,
  },
  responseDate: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  timestampsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timestampText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  viewReportButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  viewReportText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
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

export default auto_mrf_claim_get;

