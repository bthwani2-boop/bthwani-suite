// MRF Report Get Screen - Report Details
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Per roadmap: mrf_report_get → entity_get (entityType=report, domain=MRF) - unified operation

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { MrfImageGallery } from './components/MrfImageGallery';
import { rawFetch } from '@bthwani/api-clients';
import { buildMrfReportGetMock } from '../../hooks';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_report_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { reportId?: string } };
}

export const auto_mrf_report_get: React.FC<auto_mrf_report_getProps> = ({ 
  onNavigate, 
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [reportData, setReportData] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Get reportId from route params
  const reportId = route?.params?.reportId || '';

  const handleNavigate = useCallback((screen: string, params?: any) => {
    if (navigation?.navigate) {
      navigation.navigate(screen as any, params);
    } else if (onNavigate) {
      onNavigate(screen, params);
    }
  }, [navigation, onNavigate]);

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

  const loadReport = useCallback(async (isRetry: boolean = false) => {
    if (isLoadingRef.current) {
      return;
    }

    if (maxRetriesReachedRef.current && !isRetry) {
      setReportData(null);
      setState('content');
      return;
    }

    if (maxRetriesReachedRef.current && isRetry) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
    }

    if (!reportId) {
      setNetworkError(t('surfaces.معرف_البلاغ_غير_موجود'));
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
      // Per roadmap: mrf_report_get → entity_get (entityType=report, domain=MRF)
      const url = `${baseUrl}/api/entities/${reportId}?entityType=report&domain=MRF`;

      console.log(`[MRF Report Get] Loading report from: ${url}`);

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log(`[MRF Report Get] Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[MRF Report Get] HTTP error: ${response.status} ${response.statusText}`);
        
        if (response.status === 401 || response.status === 403) {
          setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (response.status === 404) {
          setNetworkError(t('surfaces.البلاغ_غير_موجود'));
          setState('error');
          setIsOffline(false);
          return;
        }

        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error(`[MRF Report Get] Error response:`, errorData);
          errorMessage = errorData?.error || errorData?.message || errorData?.error_code || errorMessage;
        } catch (parseError) {
          console.error(`[MRF Report Get] Failed to parse error response:`, parseError);
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);
      setRetryCount(0);

      const json = await response.json();
      console.log(`[MRF Report Get] Parsed response:`, { success: json?.success, hasData: !!json?.data });

      if (!json?.success) {
        const errorMsg = json?.error || json?.message || t('surfaces.فشل_في_تحميل_البلاغ');
        console.error(`[MRF Report Get] API returned success=false:`, errorMsg);
        throw new Error(errorMsg);
      }

      // Transform entity_get response to report format
      // entity_get returns: { success: true, data: { id, entityType, domain, metadata: {...report data...} } }
      const entityData = json?.data || {};
      const reportMetadata = entityData.metadata || {};

      // Transform to report UI format
      const transformedReport = {
        id: entityData.id || reportId,
        type: reportMetadata.reportType || reportMetadata.type || 'missing',
        status: reportMetadata.status || 'active',
        title: reportMetadata.title || t('mrf.app-client.mobile.auto_mrf_report_get.reportNoTitle'),
        description: reportMetadata.description || '',
        person: {
          name: reportMetadata.person?.name || reportMetadata.name || 'غير محدد',
          age: reportMetadata.person?.age || reportMetadata.age || 'غير محدد',
          gender: reportMetadata.person?.gender || reportMetadata.gender || 'غير محدد',
          description: reportMetadata.person?.description || reportMetadata.description || t('mrf.app-client.mobile.auto_mrf_report_get.noDescription'),
        },
        location: {
          lastSeen: reportMetadata.location?.lastSeen || reportMetadata.location?.address || reportMetadata.location || 'غير محدد',
          coordinates: reportMetadata.location?.coordinates || '',
          area: reportMetadata.location?.area || reportMetadata.location?.city || '',
        },
        timing: {
          reportedAt: reportMetadata.reportedAt || reportMetadata.createdAt || new Date().toISOString(),
          lastSeen: reportMetadata.lastSeen || reportMetadata.timing?.lastSeen || '',
          updatedAt: reportMetadata.updatedAt || reportMetadata.timing?.updatedAt || new Date().toISOString(),
        },
        investigation: {
          status: reportMetadata.investigation?.status || 'ongoing',
          assignedOfficer: reportMetadata.investigation?.assignedOfficer || reportMetadata.officer || 'غير محدد',
          priority: reportMetadata.urgency || reportMetadata.investigation?.priority || 'medium',
          clues: reportMetadata.investigation?.clues || reportMetadata.clues || [],
          actions: reportMetadata.investigation?.actions || reportMetadata.actions || [],
        },
        contactInfo: {
          reporter: reportMetadata.contactInfo?.reporter || reportMetadata.reporter || 'غير محدد',
          phone: reportMetadata.contactInfo?.phone || reportMetadata.phone || '',
          email: reportMetadata.contactInfo?.email || reportMetadata.email || '',
          relation: reportMetadata.contactInfo?.relation || reportMetadata.relation || '',
        },
        images: reportMetadata.images || reportMetadata.attachments || [],
      };

      console.log(`[MRF Report Get] Transformed report data`);
      setReportData(transformedReport);
      setState('content');
      hasLoadedRef.current = true;
      maxRetriesReachedRef.current = false;
    } catch (error: any) {
      console.error(`[MRF Report Get] Load error:`, error);
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
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_report_get.errorLoadMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [reportId, retryCount]);

  // Load report on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !isLoadingRef.current && !maxRetriesReachedRef.current) {
      loadReport();
    }
  }, [loadReport]);

  const handleRetry = useCallback(() => {
    if (maxRetriesReachedRef.current) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
      loadReport(true);
    } else {
      loadReport(true);
    }
  }, [loadReport]);

  const handleContactPolice = useCallback(() => {
    Linking.openURL('tel:999').catch(() => {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_get.cannotOpenPhoneApp'), t('mrf.app-client.mobile.auto_mrf_report_get.cannotOpenPhoneApp'));
    });
  }, []);

  const handleResolveReport = useCallback(async () => {
    if (!reportId || !reportData || reportData.status !== 'active') {
      return;
    }

    Alert.alert(
      t('surfaces.إغلاق_البلاغ'),
      'هل أنت متأكد من أنك تريد إغلاق هذا البلاغ؟ سيتم تغيير حالته إلى "تم الحل".',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: t('surfaces.تأكيد'),
          style: 'destructive',
          onPress: async () => {
            setIsResolving(true);
            setNetworkError(null);

            try {
              const baseUrl = getBaseUrl();
              const url = `${baseUrl}/api/entities/${reportId}`;

              const response = await fetchWithRetry(url, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  entityType: 'report',
                  domain: 'MRF',
                  status: 'resolved',
                }),
              });

              if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_get.errorMessage'), t('mrf.app-client.mobile.auto_mrf_report_get.errorMessage'));
                  return;
                }
                throw new Error(`HTTP ${response.status}`);
              }

              const json = await response.json();
              if (!json?.success) {
                throw new Error(json?.error || 'فشل في تحديث حالة البلاغ');
              }

              // Update local state
              setReportData((prev: any) => ({
                ...prev,
                status: 'resolved',
              }));

              Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_get.reportClosedSuccess'), t('mrf.app-client.mobile.auto_mrf_report_get.reportClosedSuccess'));
            } catch (error: any) {
              console.error('[MRF Report Resolve] Error:', error);
              Alert.alert(
                t('mrf.app-client.mobile.auto_mrf_report_get.errorMessage'),
                error.message || t('surfaces.فشل_في_إغلاق_البلاغ_يرجى_المحاولة_مر')
              );
            } finally {
              setIsResolving(false);
            }
          },
        },
      ]
    );
  }, [reportId, reportData]);

  const mockReport = useMemo(() => buildMrfReportGetMock(t, reportId || undefined), [t, reportId]);
  const displayReport = reportData ?? mockReport;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return '🔍';
      case 'found': return '✅';
      default: return '📋';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'missing': return t('mrf.app-client.mobile.auto_mrf_report_get.statusMissing');
      case 'found': return t('mrf.app-client.mobile.auto_mrf_report_get.statusFound');
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return semanticRoles.stateInfo.icon;
      case 'resolved': return semanticRoles.stateSuccess.icon;
      case 'closed': return semanticRoles.textMuted;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'resolved': return 'تم الحل';
      case 'closed': return 'مغلق';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return semanticRoles.stateError.icon;
      case 'medium': return semanticRoles.stateWarning.icon;
      case 'low': return semanticRoles.stateSuccess.icon;
      default: return semanticRoles.textMuted;
    }
  };

  if (state === 'content' && displayReport) {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>تفاصيل البلاغ</Text>
          <Text style={styles.reportId}>{displayReport.id}</Text>

          <View style={[styles.emergencyBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>
              بلاغ عاجل - يرجى الاتصال بالشرطة فوراً إذا كان لديك معلومات: 999
            </Text>
          </View>

          <View style={styles.statusCard}>
            <View style={[styles.statusHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={[styles.typeContainer, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.typeIcon}>{getTypeIcon(displayReport.type)}</Text>
                <Text style={styles.typeText}>{getTypeText(displayReport.type)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(displayReport.status) }]}>
                <Text style={styles.statusText}>{getStatusText(displayReport.status)}</Text>
              </View>
            </View>
            <Text style={styles.reportTime}>
              تم الإبلاغ في: {new Date(displayReport.timing.reportedAt).toLocaleString('ar-SA')}
            </Text>
            <Text style={styles.lastUpdate}>
              آخر تحديث: {new Date(displayReport.timing.updatedAt).toLocaleString('ar-SA')}
            </Text>
          </View>

          {displayReport.title && (
            <View style={styles.titleCard}>
              <Text style={styles.sectionTitle}>عنوان البلاغ</Text>
              <Text style={styles.titleText}>{displayReport.title}</Text>
            </View>
          )}

          <View style={styles.personCard}>
            <Text style={styles.sectionTitle}>معلومات الشخص</Text>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>👤 {displayReport.person.name}</Text>
              <Text style={styles.personDetails}>{displayReport.person.age} • {displayReport.person.gender}</Text>
            </View>
            {displayReport.person.description && (
              <Text style={styles.personDescription}>{displayReport.person.description}</Text>
            )}
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>مكان آخر مشاهدة</Text>
            <Text style={styles.locationAddress}>📍 {displayReport.location.lastSeen}</Text>
            {displayReport.location.area && (
              <Text style={styles.locationArea}>🏙️ {displayReport.location.area}</Text>
            )}
            {displayReport.timing.lastSeen && (
              <Text style={styles.lastSeenTime}>🕐 آخر مشاهدة: {displayReport.timing.lastSeen}</Text>
            )}
          </View>

          <View style={styles.investigationCard}>
            <Text style={styles.sectionTitle}>حالة التحقيق</Text>
            <View style={[styles.investigationHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.officer}>👮 {displayReport.investigation.assignedOfficer}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(displayReport.investigation.priority) }]}>
                <Text style={styles.priorityText}>
                  {displayReport.investigation.priority === 'high' ? t('surfaces.أولوية_عالية') :
                   displayReport.investigation.priority === 'medium' ? t('surfaces.أولوية_متوسطة') : t('surfaces.أولوية_منخفضة')}
                </Text>
              </View>
            </View>

            {displayReport.investigation.clues && displayReport.investigation.clues.length > 0 && (
              <View style={styles.cluesSection}>
                <Text style={styles.subsectionTitle}>الأدلة المتاحة:</Text>
                {displayReport.investigation.clues.map((clue: string, index: number) => (
                  <View key={index} style={[styles.clueItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.clueText}>{clue}</Text>
                  </View>
                ))}
              </View>
            )}

            {displayReport.investigation.actions && displayReport.investigation.actions.length > 0 && (
              <View style={styles.actionsSection}>
                <Text style={styles.subsectionTitle}>الإجراءات المتخذة:</Text>
                {displayReport.investigation.actions.map((action: string, index: number) => (
                  <View key={index} style={[styles.actionItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.actionText}>{action}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.sectionTitle}>معلومات التواصل</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>📞 {displayReport.contactInfo.reporter}</Text>
              {displayReport.contactInfo.relation && (
                <Text style={styles.contactDetails}>({displayReport.contactInfo.relation})</Text>
              )}
            </View>
            {displayReport.contactInfo.phone && (
              <Text style={styles.contactPhone}>{displayReport.contactInfo.phone}</Text>
            )}
            {displayReport.contactInfo.email && (
              <Text style={styles.contactEmail}>✉️ {displayReport.contactInfo.email}</Text>
            )}
          </View>

          {displayReport.images && displayReport.images.length > 0 && (
            <MrfImageGallery 
              attachments={displayReport.images} 
              title={t('mrf.app-client.mobile.auto_mrf_report_get.attachedPhotos')}
            />
          )}

          {displayReport.status === 'active' && (
            <TouchableOpacity 
              style={[styles.resolveButton, isResolving && styles.resolveButtonDisabled]} 
              onPress={handleResolveReport}
              disabled={isResolving}
            >
              <Text style={styles.resolveText}>
                {isResolving ? t('surfaces.جاري_الحل') : t('surfaces.تم_الحل_إغلاق_البلاغ')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={() => handleNavigate('MrfReportUpdate', { reportId: displayReport.id })}
          >
            <Text style={styles.updateText}>تحديث معلومات البلاغ</Text>
          </TouchableOpacity>

          {displayReport.status === 'active' && (
            <TouchableOpacity 
              style={styles.claimButton} 
              onPress={() => handleNavigate('MrfClaimCreate', { reportId: displayReport.id })}
            >
              <Text style={styles.claimText}>✓ لدي معلومات — تقديم بلاغ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.contactPoliceButton} onPress={handleContactPolice}>
            <Text style={styles.contactPoliceText}>🚔 اتصال بالشرطة — 999</Text>
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
        screenName="auto_mrf_report_get"
        operationName="mrf_report_get"
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_البلاغ')}
      errorMessage={networkError || t('surfaces.فشل_في_تحميل_تفاصيل_البلاغ')}
      onErrorAction={handleRetry}
      screenName="auto_mrf_report_get"
      operationName="mrf_report_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  reportId: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  emergencyBanner: {
    backgroundColor: colorTokens.error['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colorTokens.error['400'],
  },
  emergencyIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    marginEnd: BTHWANI_SPACING.md,
  },
  emergencyText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.error['800'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titleCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    marginEnd: BTHWANI_SPACING.sm,
  },
  typeText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  reportTime: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  lastUpdate: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
  },
  personCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
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
  personInfo: {
    marginBottom: BTHWANI_SPACING.md,
  },
  personName: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  personDetails: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  personDescription: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  locationCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationAddress: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 24,
  },
  locationArea: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  lastSeenTime: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
  },
  investigationCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  investigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  officer: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  priorityBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  priorityText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  subsectionTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  cluesSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  clueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  bullet: {
    color: semanticRoles.stateWarning.icon,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginTop: 2,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  clueText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  actionsSection: {
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  checkmark: {
    color: semanticRoles.stateSuccess.icon,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    marginEnd: BTHWANI_SPACING.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  actionText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  contactName: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  contactDetails: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  contactPhone: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
    marginBottom: BTHWANI_SPACING.xs,
  },
  contactEmail: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  imagesCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  imageIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    marginEnd: BTHWANI_SPACING.sm,
  },
  imageText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
  },
  viewText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
  },
  updateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  updateText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  claimButton: {
    backgroundColor: semanticRoles.stateSuccess.icon,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
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
  claimText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  resolveButton: {
    backgroundColor: semanticRoles.stateSuccess.icon,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  resolveButtonDisabled: {
    opacity: 0.6,
  },
  resolveText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  contactPoliceButton: {
    backgroundColor: colorTokens.error['600'],
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  contactPoliceText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
});

export default auto_mrf_report_get;

