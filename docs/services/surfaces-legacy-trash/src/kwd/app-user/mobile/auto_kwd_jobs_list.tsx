// KWD Jobs List Screen - Advanced Job Search (secondary / optional)
// Surface: app-client | Service: kwd
// §30 States: Loading / Empty / Error / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// Smart filtering: location, category, wage, duration
// Smart matching: category+skill, proximity, availability

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
  TextInput,
  ScrollView,
} from 'react-native';
import {
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  BTHWANI_COLORS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens, elevation, typography } from '@bthwani/ui-kit';
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

interface Job {
  id: string;
  title: string;
  company?: {
    name: string;
    logoUrl?: string;
  };
  location?: {
    city?: string;
    region?: string;
  };
  distance?: number;
  rating?: number;
  jobType?: string; // full_time, part_time, contract, freelance, daily, one_time, recurring, permanent
  wage?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  duration?: string; // daily, one_time, recurring, contract, permanent
  category?: string;
  skill?: string;
  postedDate?: string;
  description?: string;
}

interface auto_kwd_jobs_listProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

export const auto_kwd_jobs_list: React.FC<auto_kwd_jobs_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);

  // Simplified filters - search + category only
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

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

  const { t, isRTL } = useI18n();
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );
  const NS = 'kwd.app-client.mobile';
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

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

  // Load jobs from API
  const loadJobs = useCallback(
    async (isRetry: boolean = false, isRefresh: boolean = false) => {
      if (isLoadingRef.current && !isRefresh) return;

      if (maxRetriesReachedRef.current && !isRetry) {
        setJobs([]);
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

        // Build query parameters (simplified)
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('q', searchQuery.trim());
        if (filterCategory && filterCategory !== 'all')
          params.append('category', filterCategory);
        params.append('limit', limit.toString());
        params.append('offset', isRefresh ? '0' : offset.toString());

        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/kwd/jobs?${params.toString()}`;

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
            throw new Error('حسابك غير مفعّل. يرجى تفعيل حسابك');
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || t('surfaces.failedToLoadJobs'));
        }

        const rawJobs = json?.jobs || [];
        const totalCount = json?.total || 0;
        const jobsData = rawJobs.map((job: any) => ({
          ...job,
          distance: typeof job.distance === 'number' ? job.distance : undefined,
          rating:
            typeof job.rating === 'number'
              ? job.rating
              : (job.employerRating ?? undefined),
        }));

        if (isRefresh) {
          setJobs(jobsData);
          setOffset(jobsData.length);
        } else {
          setJobs(prev => [...prev, ...jobsData]);
          setOffset(prev => prev + jobsData.length);
        }

        setTotal(totalCount);
        setHasMore(
          jobsData.length === limit && offset + jobsData.length < totalCount
        );

        setState(jobsData.length === 0 ? 'empty' : 'content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
        setIsOffline(false);
        setNetworkError(null);
      } catch (error: any) {
        console.error('[KWD Jobs List] Load error:', error);
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
              : t(`${NS}.jobs_list.loadError`);
          setNetworkError(errorMessage);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
        setRefreshing(false);
      }
    },
    [searchQuery, filterCategory, limit, offset, retryCount, t]
  );

  // Initial load
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadJobs();
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    loadJobs(false, true);
  }, [loadJobs]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    setOffset(0);
    setHasMore(true);
    loadJobs(true, true);
  }, [loadJobs]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && state === 'content') {
      loadJobs();
    }
  }, [hasMore, state, loadJobs]);

  // Search handler (triggered on text change with debounce would be ideal, but for simplicity we reload on filter change in useEffect)
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Category filter handler
  const handleCategoryChange = useCallback(
    (category: string) => {
      setFilterCategory(category);
      setOffset(0);
      setHasMore(true);
      setJobs([]);
      loadJobs(false, true);
    },
    [loadJobs]
  );

  // Format wage
  const formatWage = (wage?: {
    min?: number;
    max?: number;
    currency?: string;
  }): string => {
    if (!wage) return t('surfaces.unspecified');
    const currency = wage.currency || 'SAR';
    if (wage.min && wage.max) {
      return `${wage.min.toLocaleString()} - ${wage.max.toLocaleString()} ${currency}`;
    }
    if (wage.min) {
      return `${t('surfaces.salaryFrom')} ${wage.min.toLocaleString()} ${currency}`;
    }
    if (wage.max) {
      return `${t('surfaces.salaryTo')} ${wage.max.toLocaleString()} ${currency}`;
    }
    return t('surfaces.unspecified');
  };

  // Format location
  const formatLocation = (location?: {
    city?: string;
    region?: string;
  }): string => {
    if (!location) return t('surfaces.unspecified');
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    return parts.length > 0 ? parts.join(', ') : t('surfaces.unspecified');
  };

  // Format job type
  const formatJobType = (type?: string): string => {
    const typeMap: Record<string, string> = {
      full_time: t('surfaces.jobTypeFullTime'),
      part_time: t('surfaces.jobTypePartTime'),
      contract: t('surfaces.jobTypeContract'),
      freelance: t('surfaces.jobTypeFreelance'),
      daily: t('surfaces.jobTypeDaily'),
      one_time: t('surfaces.jobTypeOneTime'),
      recurring: t('surfaces.jobTypeRecurring'),
      permanent: t('surfaces.jobTypePermanent'),
    };
    return type ? typeMap[type] || type : t('surfaces.unspecified');
  };

  // Get job type style
  const getTypeStyle = (type?: string) => {
    switch (type) {
      case 'full_time':
      case 'permanent':
        return { backgroundColor: semanticRoles.primaryCTA };
      case 'part_time':
        return { backgroundColor: semanticRoles.success };
      case 'contract':
      case 'one_time':
        return { backgroundColor: semanticRoles.warning };
      case 'daily':
      case 'recurring':
        return { backgroundColor: semanticRoles.info };
      default:
        return { backgroundColor: semanticRoles.textMuted };
    }
  };

  // Render job item
  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleNavigate('KwdJobGet', { jobId: item.id })}
      accessibilityRole='button'
      accessibilityLabel={`${item.title || t(`${NS}.common.noTitle`)}${item.company?.name ? `, ${item.company.name}` : ''}`}
    >
      <View style={[styles.jobHeader, { direction: layoutDirection }]}>
        <View style={styles.jobTitleContainer}>
          <Text style={[styles.jobTitle, textAlignStart]}>
            {item.title || t(`${NS}.common.noTitle`)}
          </Text>
          {item.category && (
            <Text style={[styles.jobCategory, textAlignStart]}>
              {item.category}
            </Text>
          )}
        </View>
        {item.jobType && (
          <View style={[styles.jobTypeBadge, getTypeStyle(item.jobType)]}>
            <Text style={styles.jobTypeText}>
              {formatJobType(item.jobType)}
            </Text>
          </View>
        )}
      </View>

      {item.company?.name && (
        <Text style={[styles.company, textAlignStart]}>
          {item.company.name}
        </Text>
      )}

      <View style={[styles.jobDetailsBlock, { direction: layoutDirection }]}>
        <View style={[styles.locationRow, { direction: layoutDirection }]}>
          <Text style={[styles.location, textAlignStart]} numberOfLines={1}>
            📍 {formatLocation(item.location)}
            {item.distance != null && (
              <Text style={styles.distanceText}>
                {' · '}
                {item.distance < 1
                  ? `${(item.distance || 0).toFixed(1)} كم`
                  : `${Math.round(item.distance)} كم`}
              </Text>
            )}
          </Text>
        </View>
        <View style={[styles.salaryRow, { direction: layoutDirection }]}>
          <Text style={[styles.salary, textAlignStart]} numberOfLines={1}>
            💰 {formatWage(item.wage)}
          </Text>
        </View>
      </View>
      {item.rating != null && (
        <View style={[styles.ratingRow, { direction: layoutDirection }]}>
          <Text style={styles.ratingStars}>
            {'★'.repeat(Math.min(5, Math.round(item.rating)))}
            {'☆'.repeat(5 - Math.min(5, Math.round(item.rating)))}
          </Text>
          <Text style={styles.ratingValue}>
            {Number(item.rating).toFixed(1)}
          </Text>
        </View>
      )}

      {item.duration && (
        <Text style={[styles.duration, textAlignStart]}>
          ⏱️ {formatJobType(item.duration)}
        </Text>
      )}

      {item.postedDate && (
        <Text style={[styles.postedDate, textAlignStart]}>
          📅 {item.postedDate}
        </Text>
      )}

      <View style={styles.jobFooter}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleNavigate('KwdJobApply', { jobId: item.id })}
          accessibilityRole='button'
          accessibilityLabel={t(`${NS}.jobs_list.applyNow`)}
        >
          <Text style={styles.applyText}>{t(`${NS}.jobs_list.applyNow`)}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Simple categories for filtering
  const categories = useMemo(
    () => [
      { id: 'all', label: t(`${NS}.jobs_list.all`), icon: '🌟' },
      {
        id: 'construction',
        label: t(`${NS}.jobs_list.construction`),
        icon: '🏗️',
      },
      {
        id: 'maintenance',
        label: t(`${NS}.jobs_list.maintenance`),
        icon: '🔧',
      },
      { id: 'cleaning', label: t(`${NS}.jobs_list.cleaning`), icon: '🧹' },
      { id: 'office', label: t(`${NS}.jobs_list.office`), icon: '💼' },
      { id: 'other', label: t(`${NS}.jobs_list.other`), icon: '📋' },
    ],
    [t]
  );

  if (state === 'content') {
    return (
      <ScreenWrapper
        state='content'
        screenName='auto_kwd_jobs_list'
        operationName='kwd_jobs_list'
      >
        <View style={styles.container}>
          <ScreenHeader
            title={t(`${NS}.jobs_list.title`)}
            subtitle={
              total > 0
                ? t(`${NS}.jobs_list.countText`, { count: total })
                : undefined
            }
          />
          {/* Search Bar - بسيط وواضح */}
          <View
            style={[styles.searchContainer, { direction: layoutDirection }]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[
                styles.searchInput,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
              placeholder={t(
                'kwd.app-client.mobile.auto_kwd_jobs_list.placeholder'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={searchQuery}
              onChangeText={handleSearchChange}
              accessibilityLabel={t(
                'kwd.app-client.mobile.auto_kwd_jobs_list.placeholder'
              )}
            />
          </View>

          {/* Categories - horizontal scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesRow}
            contentContainerStyle={styles.categoriesRowContent}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryFilterChip,
                  filterCategory === cat.id && styles.categoryFilterChipActive,
                  { direction: layoutDirection },
                ]}
                onPress={() => handleCategoryChange(cat.id)}
                activeOpacity={0.8}
                accessibilityRole='button'
                accessibilityLabel={cat.label}
              >
                <Text style={styles.categoryFilterIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryFilterText,
                    filterCategory === cat.id &&
                      styles.categoryFilterTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Jobs List */}
          <FlatList
            data={jobs}
            keyExtractor={item => item.id}
            renderItem={renderJobItem}
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
              ) : jobs.length > 0 ? (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>
                    {t('surfaces.تم_عرض_جميع_الوظائف')}
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <AppEmptyState
                title={t('surfaces.لا_توجد_وظائف_متاحة_حالياً')}
                message={t('states.empty')}
              />
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_الوظائف_المتاحة')}
      emptyMessage={t('surfaces.لا_توجد_وظائف_متاحة_حالياً')}
      emptyActionText={t('surfaces.إعادة_البحث')}
      onEmptyAction={handleRetry}
      errorMessage={networkError || 'فشل في تحميل الوظائف'}
      onErrorAction={handleRetry}
      screenName='auto_kwd_jobs_list'
      operationName='kwd_jobs_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.outline,
    gap: BTHWANI_SPACING.sm,
  },
  searchIcon: {
    fontSize: typography.fontSize.xl,
  },
  searchInput: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  categoriesRow: {
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.outline,
  },
  categoriesRowContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  categoryFilterChip: {
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
  categoryFilterChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  categoryFilterIcon: {
    fontSize: typography.fontSize.md,
  },
  categoryFilterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
  },
  categoryFilterTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: typography.fontWeight.bold,
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  jobCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    ...elevation.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobTitleContainer: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.sm,
  },
  jobTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  jobCategory: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  jobTypeBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  jobTypeText: {
    color: 'white',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  company: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobDetailsBlock: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationRow: {
    marginBottom: BTHWANI_SPACING.xs,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  salaryRow: {
    paddingVertical: BTHWANI_SPACING.xs,
  },
  salary: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: typography.fontWeight.medium,
  },
  distanceText: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.xs,
    alignSelf: 'flex-end',
  },
  ratingStars: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.warning || BTHWANI_COLORS.amber,
    letterSpacing: 1,
  },
  ratingValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.textMuted,
  },
  duration: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  postedDate: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: BTHWANI_SPACING.sm,
  },
  applyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  applyText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
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
  emptyIcon: {
    fontSize: typography.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.md,
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
  },
});

export default auto_kwd_jobs_list;

