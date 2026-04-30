// MRF Reports List Screen - My Reports (ESF-Inspired Design)
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Smart Feed Design (Modern Mobile Pattern) - Based on ESF

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import {
  MrfFloatingActionButton,
  MrfFilterChipsBar,
  MrfSwipeableCard,
  MrfReportMiniDetailsSheet,
  MrfReportQuickComposeSheet,
  MrfNotificationBadge,
  type MrfReport,
} from './components';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_reports_listProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

export const auto_mrf_reports_list: React.FC<auto_mrf_reports_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MrfReport | null>(null);
  const [miniDetailsVisible, setMiniDetailsVisible] = useState(false);
  const [quickComposeVisible, setQuickComposeVisible] = useState(false);
  const [processingReport, setProcessingReport] = useState<string | null>(null);

  // Network and connection state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent infinite loops
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Filters
  const [filterReportType, setFilterReportType] = useState<
    'missing' | 'found' | 'all'
  >('all');
  const [filterStatus, setFilterStatus] = useState<
    'active' | 'resolved' | 'closed' | 'all'
  >('all');
  const [filterUrgency, setFilterUrgency] = useState<
    'low' | 'medium' | 'high' | 'all'
  >('all');

  // API data - loaded from backend
  const [allReports, setAllReports] = useState<MrfReport[]>([]);

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
          error.message.includes('timeout') ||
          error.message.includes('NetworkError') ||
          error.message.includes('Failed to fetch'));

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const loadData = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) {
        return;
      }

      if (maxRetriesReachedRef.current && !isRetry) {
        setAllReports([]);
        setState('content');
        return;
      }

      if (maxRetriesReachedRef.current && isRetry) {
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
      }

      try {
        isLoadingRef.current = true;

        if (!isRetry) {
          setState('loading');
          setNetworkError(null);
          setIsOffline(false);
        }

        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/mrf/reports?limit=100&offset=0`;

        let reportsResponse: Response;
        try {
          reportsResponse = await fetchWithRetry(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
        } catch (fetchError) {
          throw fetchError;
        }

        if (!reportsResponse.ok) {
          if (
            reportsResponse.status === 401 ||
            reportsResponse.status === 403
          ) {
            setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
            setState('error');
            setIsOffline(false);
            return;
          }

          let errorMessage = `HTTP ${reportsResponse.status}`;
          try {
            const errorData = await reportsResponse.json();
            errorMessage =
              errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            // Ignore
          }
          throw new Error(errorMessage);
        }

        setIsOffline(false);
        setNetworkError(null);
        setRetryCount(0);

        const reportsJson = await reportsResponse.json();

        if (!reportsJson?.success) {
          throw new Error(reportsJson?.error || 'فشل في تحميل البلاغات');
        }

        // Transform API response to MrfReport format
        const reportsData =
          reportsJson?.data?.reports || reportsJson?.data || [];

        const transformedReports: MrfReport[] = reportsData.map((req: any) => {
          // Format timestamp
          let timestamp = t('mrf.app-client.mobile.auto_mrf_reports_list.timestampNow');
          if (req.reportedAt || req.createdAt) {
            const created = new Date(req.reportedAt || req.createdAt);
            const now = new Date();
            const diffMinutes = Math.floor(
              (now.getTime() - created.getTime()) / 60000
            );
            if (diffMinutes < 1) timestamp = t('mrf.app-client.mobile.auto_mrf_reports_list.timestampNow');
            else if (diffMinutes < 60) timestamp = `منذ ${diffMinutes} دقيقة`;
            else if (diffMinutes < 1440)
              timestamp = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
            else timestamp = `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
          }

          // Extract location
          let location = t('mrf.app-client.mobile.auto_mrf_reports_list.locationUndefined');
          if (req.location?.city && req.location?.region) {
            location = `${req.location.city}، ${req.location.region}`;
          } else if (req.location?.city) {
            location = req.location.city;
          } else if (req.location?.region) {
            location = req.location.region;
          } else if (typeof req.location === 'string') {
            location = req.location;
          }

          return {
            id: req.id || req.reportId || `RPT-${Date.now()}-${0}`,
            title:
              req.title || t('mrf.app-client.mobile.auto_mrf_reports_list.reportNoTitle'),
            reportType: (req.reportType || 'missing').toLowerCase() as
              | 'missing'
              | 'found',
            status: (req.status || 'active').toLowerCase() as
              | 'active'
              | 'resolved'
              | 'closed',
            location,
            timestamp,
            urgency: (req.urgency || 'medium').toLowerCase() as
              | 'low'
              | 'medium'
              | 'high',
          };
        });

        setAllReports(transformedReports);
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
      } catch (error) {
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
          setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');

          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);

          const isDevMode =
            process.env.EXPO_PUBLIC_DEV_MODE === 'true' ||
            process.env.NODE_ENV === 'development';

          if (isDevMode && newRetryCount >= 2) {
            maxRetriesReachedRef.current = true;
            hasLoadedRef.current = true;
            setAllReports([]);
            setState('content');
          } else if (newRetryCount >= 3) {
            maxRetriesReachedRef.current = true;
            hasLoadedRef.current = true;
            setState('error');
          } else {
            setState('error');
          }
        } else {
          setIsOffline(false);
          const errorMessage =
            error instanceof Error
              ? error.message
              : t('mrf.app-client.mobile.auto_mrf_reports_list.errorLoadMessage');
          setNetworkError(errorMessage);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
      }
    },
    [retryCount]
  );

  // Load data only once on mount
  useEffect(() => {
    if (
      !hasLoadedRef.current &&
      !isLoadingRef.current &&
      !maxRetriesReachedRef.current
    ) {
      loadData();
    }
  }, []);

  // Create a safe error handler
  const handleErrorRetry = useCallback(() => {
    if (maxRetriesReachedRef.current) {
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
      loadData(true);
    } else {
      loadData(true);
    }
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    maxRetriesReachedRef.current = false;
    hasLoadedRef.current = false;
    setRetryCount(0);
    loadData().finally(() => setRefreshing(false));
  }, [loadData]);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = [...allReports];

    if (filterReportType !== 'all') {
      filtered = filtered.filter(r => r.reportType === filterReportType);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }
    if (filterUrgency !== 'all') {
      filtered = filtered.filter(r => r.urgency === filterUrgency);
    }

    // Sort by urgency (high first), then by timestamp (newest first)
    filtered.sort((a, b) => {
      const urgencyOrder: Record<string, number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return 0; // Keep original order if urgency is equal
    });

    return filtered;
  }, [allReports, filterReportType, filterStatus, filterUrgency]);

  // Open details in mini bottom sheet
  const handleViewDetails = useCallback((report: MrfReport) => {
    setSelectedReport(report);
    setMiniDetailsVisible(true);
  }, []);

  // Handle Quick Compose submit
  const handleQuickComposeSubmit = useCallback(
    async (data: any) => {
      try {
        const requestBody = {
          reportType: data.reportType,
          title: data.title,
          description: data.description,
          location: data.location,
          category: data.category,
          attachments: data.attachments,
        };

        const response = await fetchWithRetry(
          `${getBaseUrl()}/api/mrf/reports`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || 'فشل في نشر البلاغ');
        }

        // Reload data to get the new report
        await loadData();

        Alert.alert(
          t('mrf.app-client.mobile.auto_mrf_reports_list.reportPublishedSuccess'),
          t('mrf.app-client.mobile.auto_mrf_reports_list.reportPublishedSuccess')
        );
        setQuickComposeVisible(false);
        setSelectedReport(null);
      } catch (error) {
        console.error('Failed to create report:', error);
        Alert.alert(
          'خطأ',
          error instanceof Error
            ? error.message
            : t('mrf.app-client.mobile.auto_mrf_reports_list.errorPublishMessage')
        );
      }
    },
    [loadData]
  );

  // Helper functions
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return semanticRoles.stateSuccess.icon;
      case 'medium':
        return semanticRoles.stateWarning.icon;
      case 'high':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return t('mrf.app-client.mobile.auto_mrf_reports_list.priorityLow');
      case 'medium':
        return t('mrf.app-client.mobile.auto_mrf_reports_list.priorityMedium');
      case 'high':
        return t('mrf.app-client.mobile.auto_mrf_reports_list.priorityHigh');
      default:
        return urgency;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'missing':
        return '🔍';
      case 'found':
        return '✅';
      default:
        return '📋';
    }
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'missing':
        return t('mrf.app-client.mobile.auto_mrf_reports_list.statusMissing');
      case 'found':
        return t('mrf.app-client.mobile.auto_mrf_reports_list.statusFound');
      default:
        return type;
    }
  };

  const renderReportCard = ({
    item,
    index,
  }: {
    item: MrfReport;
    index: number;
  }) => {
    const isProcessing = processingReport === item.id;
    const canUpdate = item.status === 'active' && !isProcessing;

    const cardContent = (
      <View style={styles.cardContent}>
        {/* Report Type Badge + Main Info */}
        <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <View
            style={[
              styles.reportTypeBadge,
              { backgroundColor: getUrgencyColor(item.urgency) },
            ]}
          >
            <Text style={styles.reportTypeIcon}>
              {getReportTypeIcon(item.reportType)}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
          </View>
          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: getUrgencyColor(item.urgency) + '20' },
            ]}
          >
            <Text
              style={[
                styles.urgencyText,
                { color: getUrgencyColor(item.urgency) },
              ]}
            >
              {getUrgencyText(item.urgency)}
            </Text>
          </View>
        </View>

        {/* Footer: Time + Status + Actions */}
        <View style={[styles.cardFooter, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.cardTime}>{item.timestamp}</Text>
          <View style={[styles.cardActions, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={e => {
                e.stopPropagation();
                handleViewDetails(item);
              }}
              disabled={isProcessing}
            >
              <Text style={styles.actionButtonText}>{t('mrf.app-client.mobile.auto_mrf_reports_list.actionButtonText')}</Text>
            </TouchableOpacity>
            {canUpdate && (
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={e => {
                  e.stopPropagation();
                  setSelectedReport(item);
                  setQuickComposeVisible(true);
                }}
                disabled={isProcessing}
              >
                <Text
                  style={[styles.actionButtonText, styles.updateButtonText]}
                >
                  تحديث
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
        disabled={isProcessing}
      >
        {cardContent}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>{t('mrf.app-client.mobile.auto_mrf_reports_list.emptyTitleNoReports')}</Text>
        <Text style={styles.emptySubtitle}>
          {t('mrf.app-client.mobile.auto_mrf_reports_list.emptySubtitleNoReports')}
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => {
            setSelectedReport(null);
            setQuickComposeVisible(true);
          }}
        >
          <Text style={styles.emptyButtonText}>{t('mrf.app-client.mobile.auto_mrf_reports_list.emptyButtonTextCreate')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show offline screen if loading and offline
  if (state === 'loading' && isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_reports_list.emptyTitleNoConnection')}
        onErrorAction={() => {
          setRetryCount(0);
          loadData(true);
        }}
        screenName="auto_mrf_reports_list"
        operationName="mrf_reports_list"
      />
    );
  }

  // Show offline state if network error
  if (isOffline && (state === 'error' || state === 'loading')) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_reports_list.emptyTitleNoConnection')}
        onErrorAction={() => {
          setRetryCount(0);
          loadData(true);
        }}
        screenName="auto_mrf_reports_list"
        operationName="mrf_reports_list"
      />
    );
  }

  // Generic API/data error with retry
  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('states.error')}
        onErrorAction={() => {
          setRetryCount(0);
          loadData(true);
        }}
        screenName="auto_mrf_reports_list"
        operationName="mrf_reports_list"
      />
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          {/* A) Compact Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('mrf.app-client.mobile.auto_mrf_reports_list.headerTitle')}</Text>
            <Text style={styles.headerSubtitle}>
              متابعة جميع البلاغات التي قدمتها
            </Text>
          </View>

          {/* B) Sticky Control Bar */}
          <MrfFilterChipsBar
            reportType={filterReportType}
            status={filterStatus}
            urgency={filterUrgency}
            onReportTypePress={() => {
              // Cycle through: all -> missing -> found -> all
              const types: Array<'all' | 'missing' | 'found'> = [
                'all',
                'missing',
                'found',
              ];
              const currentIndex = types.indexOf(filterReportType);
              setFilterReportType(types[(currentIndex + 1) % types.length]);
            }}
            onLocationPress={() => {
              // Not applicable for "My Reports"
              Alert.alert(
                t('mrf.app-client.mobile.auto_mrf_reports_list.locationNotInMyReports'),
                t('mrf.app-client.mobile.auto_mrf_reports_list.locationNotInMyReports')
              );
            }}
            onCategoryPress={() => {
              // Not applicable for "My Reports"
              Alert.alert(
                t('mrf.app-client.mobile.auto_mrf_reports_list.categoryNotInMyReports'),
                t('mrf.app-client.mobile.auto_mrf_reports_list.categoryNotInMyReports')
              );
            }}
            onStatusPress={() => {
              const statuses: Array<'all' | 'active' | 'resolved' | 'closed'> =
                ['all', 'active', 'resolved', 'closed'];
              const currentIndex = statuses.indexOf(filterStatus);
              setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
            }}
            onUrgencyPress={() => {
              const urgencies: Array<'all' | 'low' | 'medium' | 'high'> = [
                'all',
                'low',
                'medium',
                'high',
              ];
              const currentIndex = urgencies.indexOf(filterUrgency);
              setFilterUrgency(
                urgencies[(currentIndex + 1) % urgencies.length]
              );
            }}
          />

          {/* C) Feed - Reports */}
          <FlatList
            data={filteredReports}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => renderReportCard({ item, index })}
            contentContainerStyle={[
              styles.listContainer,
              filteredReports.length === 0 && styles.listContainerEmpty,
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />

          {/* FAB - Floating Action Button */}
          <MrfFloatingActionButton
            onPress={() => {
              setSelectedReport(null);
              setQuickComposeVisible(true);
            }}
            label={t('mrf.app-client.mobile.auto_mrf_reports_list.newReport')}
            icon='+'
          />
        </View>

        {/* Mini Details Sheet */}
        <MrfReportMiniDetailsSheet
          visible={miniDetailsVisible}
          onClose={() => {
            setMiniDetailsVisible(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
          onViewFull={report => {
            handleNavigate('MrfReportGet', { reportId: report.id });
            setMiniDetailsVisible(false);
          }}
        />

        {/* Quick Compose Sheet */}
        <MrfReportQuickComposeSheet
          visible={quickComposeVisible}
          onClose={() => {
            setQuickComposeVisible(false);
            setSelectedReport(null);
          }}
          onSubmit={handleQuickComposeSubmit}
          initialData={
            selectedReport
              ? {
                  reportType: selectedReport.reportType,
                  title: selectedReport.title,
                  description: (selectedReport as any).description || '',
                  location: {
                    city: selectedReport.location.split('،')[0] || undefined,
                  },
                  category: (selectedReport as any).category,
                }
              : undefined
          }
          isEditMode={!!selectedReport}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage='جاري تحميل البلاغات...'
      errorMessage={t('mrf.app-client.mobile.auto_mrf_reports_list.errorMessageLoad')}
      onErrorAction={handleErrorRetry}
      screenName='auto_mrf_reports_list'
      operationName='mrf_reports_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  // A) Compact Header
  header: {
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  headerTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  headerSubtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  // C) Feed
  listContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl * 3, // Space for FAB
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  reportCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: BTHWANI_SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  reportTypeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  reportTypeIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardLocation: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  urgencyBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: BTHWANI_SPACING.sm,
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.border,
  },
  cardTime: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.xs,
  },
  actionButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: semanticRoles.text,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  updateButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  updateButtonText: {
    color: semanticRoles.primaryCTAText,
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
    backgroundColor: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.md,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
});

export default auto_mrf_reports_list;

