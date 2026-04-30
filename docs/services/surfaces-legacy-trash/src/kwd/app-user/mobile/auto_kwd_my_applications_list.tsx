// KWD My Applications List Screen - Track Job Applications Status
// Surface: app-client | Service: kwd
// §30 States: Loading / Empty / Error / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// Status tracking: pending → contacted → accepted/rejected → completed

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
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  colorTokens,
  elevation,
  typography,
} from '@bthwani/ui-kit';
import {
  AppEmptyState,
  AppLoadingState,
  ScreenHeader,
  scrollContentContainerStyle,
} from '@bthwani/ui-kit';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;
const DEFAULT_LIMIT = 20;

interface JobApplication {
  id: string;
  applicationId?: string;
  job: {
    id: string;
    title: string;
    company?: {
      name: string;
      logoUrl?: string;
      industry?: string;
    };
    location?: string;
    salary?: {
      minSalary?: number;
      maxSalary?: number;
      currency?: string;
    };
    jobType?: string;
  };
  status:
    | 'pending'
    | 'contacted'
    | 'accepted'
    | 'rejected'
    | 'completed'
    | 'under_review'
    | 'shortlisted'
    | 'interviewed'
    | 'offered'
    | 'withdrawn';
  statusHistory?: Array<{
    status: string;
    changedAt: string;
    changedBy?: string;
    notes?: string;
  }>;
  appliedAt?: string;
  lastUpdated?: string;
  notes?: string;
  nextSteps?: string[];
}

interface auto_kwd_my_applications_listProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { userId?: string } };
}

export const auto_kwd_my_applications_list: React.FC<
  auto_kwd_my_applications_listProps
> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);

  // Get userId from route params or use default (should come from auth context in real app)
  const userId = route?.params?.userId || 'user_123';

  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, pending, contacted, accepted, rejected, completed

  // Pagination
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Network state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

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

  // Load applications from API
  const loadApplications = useCallback(
    async (isRetry: boolean = false, isRefresh: boolean = false) => {
      if (isLoadingRef.current && !isRefresh) return;

      if (maxRetriesReachedRef.current && !isRetry) {
        setApplications([]);
        setState('content');
        return;
      }

      if (maxRetriesReachedRef.current && isRetry) {
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
      }

      try {
        isLoadingRef.current = true;

        if (!isRetry && !isRefresh) {
          setState('loading');
          setNetworkError(null);
          setIsOffline(false);
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.append('userId', userId);
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        params.append('limit', limit.toString());
        params.append('offset', isRefresh ? '0' : offset.toString());

        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/kwd/applications/me?${params.toString()}`;

        const response = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(t('surfaces.mustSignInFirst'));
          }
          if (response.status === 403) {
            throw new Error(t('surfaces.accountNotActivated'));
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(
            json?.error || t('surfaces.failedToLoadApplications')
          );
        }

        const applicationsData = json?.applications || [];
        const totalCount = json?.total || 0;

        // Transform API response to JobApplication format
        const transformedApplications: JobApplication[] = applicationsData.map(
          (app: any) => ({
            id: app.id || app.applicationId || `app_${Date.now()}`,
            applicationId: app.applicationId || app.id,
            job: {
              id: app.job?.id || '',
              title:
                app.job?.title ||
                t(
                  'kwd.app-client.mobile.auto_kwd_my_applications_list.noAddress'
                ),
              company: app.job?.company
                ? {
                    name: app.job.company.name || t('surfaces.unspecified'),
                    logoUrl: app.job.company.logoUrl,
                    industry: app.job.company.industry,
                  }
                : undefined,
              location: app.job?.location || t('surfaces.unspecified'),
              salary: app.job?.salary
                ? {
                    minSalary: app.job.salary.minSalary,
                    maxSalary: app.job.salary.maxSalary,
                    currency: app.job.salary.currency || 'SAR',
                  }
                : undefined,
              jobType: app.job?.jobType,
            },
            status: (app.status || 'pending') as JobApplication['status'],
            statusHistory: app.statusHistory || [],
            appliedAt: app.appliedAt || app.submittedAt,
            lastUpdated: app.lastUpdated || app.updatedAt,
            notes: app.notes,
            nextSteps: app.nextSteps || [],
          })
        );

        if (isRefresh) {
          setApplications(transformedApplications);
          setOffset(transformedApplications.length);
        } else {
          setApplications(prev => [...prev, ...transformedApplications]);
          setOffset(prev => prev + transformedApplications.length);
        }

        setTotal(totalCount);
        setHasMore(
          transformedApplications.length === limit &&
            offset + transformedApplications.length < totalCount
        );

        setState(transformedApplications.length === 0 ? 'empty' : 'content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
        setIsOffline(false);
        setNetworkError(null);
      } catch (error: any) {
        console.error('[KWD My Applications List] Load error:', error);
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
          const errorMessage =
            error instanceof Error
              ? error.message
              : t(
                  'kwd.app-client.mobile.auto_kwd_my_applications_list.errorLoadMessage'
                );
          setNetworkError(errorMessage);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
        setRefreshing(false);
      }
    },
    [userId, statusFilter, limit, offset, retryCount]
  );

  // Initial load
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadApplications();
    }
  }, []);

  // Reload when status filter changes
  useEffect(() => {
    if (hasLoadedRef.current) {
      setOffset(0);
      setHasMore(true);
      setApplications([]);
      loadApplications(false, true);
    }
  }, [statusFilter]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    loadApplications(false, true);
  }, [loadApplications]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    setOffset(0);
    setHasMore(true);
    loadApplications(true, true);
  }, [loadApplications]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && state === 'content') {
      loadApplications();
    }
  }, [hasMore, state, loadApplications]);

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return t('surfaces.unspecified');
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return t('surfaces.today');
      if (diffDays === 1) return t('surfaces.yesterday');
      if (diffDays < 7) return t('surfaces.daysAgo', { count: diffDays });
      if (diffDays < 30)
        return t('surfaces.weeksAgo', { count: Math.floor(diffDays / 7) });
      if (diffDays < 365)
        return t('surfaces.monthsAgo', { count: Math.floor(diffDays / 30) });
      return date.toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  // Format wage
  const formatWage = (salary?: {
    minSalary?: number;
    maxSalary?: number;
    currency?: string;
  }): string => {
    if (!salary) return t('surfaces.unspecified');
    const currency = salary.currency || 'SAR';
    if (salary.minSalary && salary.maxSalary) {
      return `${salary.minSalary.toLocaleString()} - ${salary.maxSalary.toLocaleString()} ${currency}`;
    }
    if (salary.minSalary) {
      return t('surfaces.salaryFrom', {
        min: salary.minSalary.toLocaleString(),
        currency,
      });
    }
    if (salary.maxSalary) {
      return t('surfaces.salaryTo', {
        max: salary.maxSalary.toLocaleString(),
        currency,
      });
    }
    return t('surfaces.unspecified');
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'under_review':
        return semanticRoles.warning;
      case 'contacted':
      case 'shortlisted':
      case 'interviewed':
        return semanticRoles.info;
      case 'offered':
      case 'accepted':
        return semanticRoles.success;
      case 'rejected':
        return semanticRoles.error;
      case 'completed':
        return semanticRoles.textMuted;
      case 'withdrawn':
        return semanticRoles.textMuted;
      default:
        return semanticRoles.textMuted;
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: t('surfaces.statusPending'),
      under_review: t('surfaces.statusUnderReview'),
      contacted: t('surfaces.statusContacted'),
      shortlisted: t('surfaces.statusShortlisted'),
      interviewed: t('surfaces.statusInterviewed'),
      offered: t('surfaces.statusOffered'),
      accepted: t('surfaces.statusAccepted'),
      rejected: t('surfaces.statusRejected'),
      completed: t('surfaces.statusCompleted'),
      withdrawn: t('surfaces.statusWithdrawn'),
    };
    return statusMap[status] || status;
  };

  // Get status icon
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'under_review':
        return '⏳';
      case 'contacted':
      case 'shortlisted':
        return '📞';
      case 'interviewed':
        return '📅';
      case 'offered':
        return '💼';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'completed':
        return '✔️';
      case 'withdrawn':
        return '🚫';
      default:
        return '📄';
    }
  };

  // Filter applications by status
  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') return applications;
    return applications.filter(app => {
      // Map filter values to actual statuses
      if (statusFilter === 'pending') {
        return app.status === 'pending' || app.status === 'under_review';
      }
      if (statusFilter === 'contacted') {
        return (
          app.status === 'contacted' ||
          app.status === 'shortlisted' ||
          app.status === 'interviewed'
        );
      }
      if (statusFilter === 'accepted') {
        return app.status === 'accepted' || app.status === 'offered';
      }
      if (statusFilter === 'rejected') {
        return app.status === 'rejected';
      }
      if (statusFilter === 'completed') {
        return app.status === 'completed';
      }
      return app.status === statusFilter;
    });
  }, [applications, statusFilter]);

  // Count applications by status
  const statusCounts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter(
        a => a.status === 'pending' || a.status === 'under_review'
      ).length,
      contacted: applications.filter(
        a =>
          a.status === 'contacted' ||
          a.status === 'shortlisted' ||
          a.status === 'interviewed'
      ).length,
      accepted: applications.filter(
        a => a.status === 'accepted' || a.status === 'offered'
      ).length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      completed: applications.filter(a => a.status === 'completed').length,
    };
  }, [applications]);

  // Render application item — بسيط وواضح
  const renderApplicationItem = ({ item }: { item: JobApplication }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() =>
        handleNavigate('KwdApplicationGet', {
          applicationId: item.id,
          jobId: item.job.id,
        })
      }
      activeOpacity={0.7}
      accessibilityLabel={item.job.title}
      accessibilityRole='button'
    >
      {/* Status Badge — بارز في الأعلى */}
      <View
        style={[
          styles.statusBanner,
          {
            backgroundColor: getStatusColor(item.status),
            direction: layoutDirection,
          },
        ]}
      >
        <Text style={styles.statusBannerIcon}>
          {getStatusIcon(item.status)}
        </Text>
        <Text style={styles.statusBannerText}>
          {getStatusText(item.status)}
        </Text>
      </View>

      {/* Job Info */}
      <View style={styles.cardBody}>
        <Text style={[styles.jobTitle, textAlignStart]} numberOfLines={2}>
          {item.job.title}
        </Text>

        {item.job.company?.name && (
          <View style={[styles.companyRow, { direction: layoutDirection }]}>
            <Text style={styles.companyIcon}>🏢</Text>
            <Text style={styles.company}>{item.job.company.name}</Text>
          </View>
        )}

        <View style={[styles.infoGrid, { direction: layoutDirection }]}>
          {item.job.location && (
            <View style={[styles.infoItem, { direction: layoutDirection }]}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{item.job.location}</Text>
            </View>
          )}
          {item.job.salary && (
            <View style={[styles.infoItem, { direction: layoutDirection }]}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>{formatWage(item.job.salary)}</Text>
            </View>
          )}
        </View>

        {/* Date — مختصر */}
        <Text style={[styles.appliedDate, textAlignStart]}>
          {t('surfaces.appliedDate', { date: formatDate(item.appliedAt) })}
        </Text>

        {item.notes && (
          <View style={styles.notesBox}>
            <Text style={[styles.notesText, textAlignStart]} numberOfLines={2}>
              💬 {item.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper
        state='content'
        screenName='auto_kwd_my_applications_list'
        operationName='kwd_my_applications_list'
      >
        <View style={styles.container}>
          <ScreenHeader
            title={t('surfaces.jobApplicationsTitle')}
            subtitle={
              total > 0
                ? t('surfaces.applicationsSubmittedCount', { count: total })
                : undefined
            }
          />
          {/* Status Filters — مبسّط */}
          <View style={styles.filterTabs}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  statusFilter === 'all' && styles.activeFilterTab,
                  { direction: layoutDirection },
                ]}
                onPress={() => setStatusFilter('all')}
                accessibilityLabel={t('surfaces.allCount', {
                  count: statusCounts.all,
                })}
                accessibilityRole='tab'
                accessibilityState={{ selected: statusFilter === 'all' }}
              >
                <Text style={styles.filterTabIcon}>🌟</Text>
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === 'all' && styles.activeFilterText,
                  ]}
                >
                  {t('surfaces.allCount', { count: statusCounts.all })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  statusFilter === 'pending' && styles.activeFilterTab,
                  { direction: layoutDirection },
                ]}
                onPress={() => setStatusFilter('pending')}
                accessibilityLabel={t('surfaces.underReviewCount', {
                  count: statusCounts.pending,
                })}
                accessibilityRole='tab'
                accessibilityState={{ selected: statusFilter === 'pending' }}
              >
                <Text style={styles.filterTabIcon}>⏳</Text>
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === 'pending' && styles.activeFilterText,
                  ]}
                >
                  {t('surfaces.underReviewCount', {
                    count: statusCounts.pending,
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  statusFilter === 'contacted' && styles.activeFilterTab,
                  { direction: layoutDirection },
                ]}
                onPress={() => setStatusFilter('contacted')}
                accessibilityLabel={t('surfaces.contactedCount', {
                  count: statusCounts.contacted,
                })}
                accessibilityRole='tab'
                accessibilityState={{ selected: statusFilter === 'contacted' }}
              >
                <Text style={styles.filterTabIcon}>📞</Text>
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === 'contacted' && styles.activeFilterText,
                  ]}
                >
                  {t('surfaces.contactedCount', {
                    count: statusCounts.contacted,
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  statusFilter === 'accepted' && styles.activeFilterTab,
                  { direction: layoutDirection },
                ]}
                onPress={() => setStatusFilter('accepted')}
                accessibilityLabel={t('surfaces.acceptedCount', {
                  count: statusCounts.accepted,
                })}
                accessibilityRole='tab'
                accessibilityState={{ selected: statusFilter === 'accepted' }}
              >
                <Text style={styles.filterTabIcon}>✅</Text>
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === 'accepted' && styles.activeFilterText,
                  ]}
                >
                  {t('surfaces.acceptedCount', {
                    count: statusCounts.accepted,
                  })}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <FlatList
            data={filteredApplications}
            keyExtractor={item => item.id}
            renderItem={renderApplicationItem}
            contentContainerStyle={scrollContentContainerStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[semanticRoles.primaryCTA]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMore ? (
                <AppLoadingState message={t('states.loading')} />
              ) : filteredApplications.length > 0 ? (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>
                    {t('surfaces.allApplicationsShown')}
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View>
                <AppEmptyState
                  title={t('surfaces.لا_توجد_طلبات_توظيف_حتى_الآن')}
                  message={
                    statusFilter === 'all'
                      ? t('surfaces.ابدأ_بالبحث_عن_وظائف_وتقديم_طلباتك')
                      : t('surfaces.جرب_فئة_أخرى_أو_تحقق_لاحقاً')
                  }
                />
                {statusFilter !== 'all' && (
                  <TouchableOpacity
                    style={styles.clearFilterButton}
                    onPress={() => setStatusFilter('all')}
                    accessibilityLabel={t('common.all')}
                    accessibilityRole='button'
                  >
                    <Text style={styles.clearFilterButtonText}>
                      {t('common.all')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_طلبات_التوظيف')}
      emptyMessage={t('surfaces.لا_توجد_طلبات_توظيف_حتى_الآن')}
      emptyActionText={t('surfaces.البحث_عن_وظائف')}
      onEmptyAction={() => handleNavigate('KwdJobsList')}
      errorMessage={networkError || t('surfaces.failedToLoadApplications')}
      onErrorAction={handleRetry}
      screenName='auto_kwd_my_applications_list'
      operationName='kwd_my_applications_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  filterTabs: {
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.outline,
  },
  filterTabsContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  activeFilterTab: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  filterTabIcon: {
    fontSize: typography.fontSize.md,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  activeFilterText: {
    color: semanticRoles.primaryCTAText,
  },
  applicationsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  applicationCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    marginBottom: BTHWANI_SPACING.md,
    ...elevation.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.xs,
  },
  statusBannerIcon: {
    fontSize: typography.fontSize.lg,
  },
  statusBannerText: {
    color: 'white',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  cardBody: {
    padding: BTHWANI_SPACING.contentH,
  },
  jobTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 24,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.md,
  },
  companyIcon: {
    fontSize: typography.fontSize.sm,
  },
  company: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  infoIcon: {
    fontSize: typography.fontSize.sm,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    fontWeight: typography.fontWeight.medium,
  },
  appliedDate: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  notesBox: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.sm,
  },
  notesText: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  loadingMore: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  endOfList: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  endOfListText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  emptyContainer: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  clearFilterButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  clearFilterButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});

export default auto_kwd_my_applications_list;

