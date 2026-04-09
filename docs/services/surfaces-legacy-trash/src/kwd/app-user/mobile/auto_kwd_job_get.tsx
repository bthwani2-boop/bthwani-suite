// KWD Job Get Screen - Job Details using entity_get (unified)
// Surface: app-client | Service: kwd
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// Uses: entity_get (unified) with domain=KWD, entityType=job

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
import { ScreenHeader, scrollContentContainerStyle } from '@bthwani/ui-kit';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface Job {
  id: string;
  title: string;
  company?: {
    name: string;
    logoUrl?: string;
    industry?: string;
    companySize?: string;
  };
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
  jobType?: string;
  experienceLevel?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description?: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  postedDate?: string;
  applicationDeadline?: string;
  applicantsCount?: number;
  status?: string;
}

interface auto_kwd_job_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { jobId?: string; fromMyListings?: boolean } };
}

export const auto_kwd_job_get: React.FC<auto_kwd_job_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
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
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  // Get jobId and fromMyListings from route params
  const jobId = route?.params?.jobId || 'job_123456';
  const isOwner = route?.params?.fromMyListings === true;

  // Owner: listing status (active/closed) and update/delete
  const [listingStatus, setListingStatus] = useState<'active' | 'closed'>(
    'active'
  );
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Load job details from API using entity_get (unified)
  const loadJob = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) return;

      if (maxRetriesReachedRef.current && !isRetry) {
        setJob(null);
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
        // Use entity_get unified operation with domain=KWD, entityType=job
        const params = new URLSearchParams({
          domain: 'KWD',
          entityType: 'job',
        });
        const url = `${baseUrl}/api/entities/${jobId}?${params.toString()}`;

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
            throw new Error(
              t('kwd.app-client.mobile.auto_kwd_job_get.accountNotActive')
            );
          }
          if (response.status === 404) {
            throw new Error(t('surfaces.jobNotFound'));
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || t(`${NS}.job_get.loadError`));
        }

        // Transform API response to Job format
        const entity = json?.entity || json?.data || {};
        const jobData: Job = {
          id: entity.id || jobId,
          title: entity.title || entity.name || t(`${NS}.common.noTitle`),
          company: entity.company
            ? {
                name: entity.company.name || t(`${NS}.home_get.unspecified`),
                logoUrl: entity.company.logoUrl,
                industry: entity.company.industry,
                companySize: entity.company.companySize,
              }
            : undefined,
          location: entity.location
            ? {
                city: entity.location.city,
                region: entity.location.region,
                country: entity.location.country,
              }
            : undefined,
          jobType: entity.jobType || entity.type,
          experienceLevel: entity.experienceLevel,
          salary:
            entity.salary || entity.wage
              ? {
                  min: entity.salary?.min || entity.wage?.min,
                  max: entity.salary?.max || entity.wage?.max,
                  currency:
                    entity.salary?.currency || entity.wage?.currency || 'SAR',
                }
              : undefined,
          description: entity.description || entity.details,
          requirements: entity.requirements || [],
          benefits: entity.benefits || [],
          skills: entity.skills || [],
          postedDate: entity.postedDate || entity.createdAt,
          applicationDeadline: entity.applicationDeadline || entity.deadline,
          applicantsCount: entity.applicantsCount || entity.applicants,
          status: entity.status,
        };

        setJob(jobData);
        if (entity.status === 'closed') setListingStatus('closed');
        else setListingStatus('active');
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
        setIsOffline(false);
        setNetworkError(null);
      } catch (error: any) {
        console.error('[KWD Job Get] Load error:', error);
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
          setNetworkError(t(`${NS}.job_get.cannotConnect`));

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
              : t(`${NS}.job_get.loadError`);
          setNetworkError(errorMessage);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
        setRefreshing(false);
      }
    },
    [jobId, retryCount, t]
  );

  // Initial load
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadJob();
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadJob();
  }, [loadJob]);

  // Owner: change listing status (active/closed)
  const handleStatusChange = useCallback(
    async (newStatus: 'active' | 'closed') => {
      if (!job?.id || statusUpdating) return;
      setStatusUpdating(true);
      try {
        const baseUrl = getBaseUrl();
        const res = await rawFetch(`${baseUrl}/api/kwd/jobs/${job.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          setListingStatus(newStatus);
          setJob(prev => (prev ? { ...prev, status: newStatus } : null));
        } else {
          const err = await res.json().catch(() => ({}));
          Alert.alert(
            t(`${NS}.job_get.alert`),
            err?.error || t(`${NS}.job_get.updateStatusFail`)
          );
        }
      } catch {
        Alert.alert(
          t(`${NS}.job_get.alert`),
          t(`${NS}.job_get.updateStatusFail`)
        );
      } finally {
        setStatusUpdating(false);
      }
    },
    [job?.id, statusUpdating, t]
  );

  // Owner: delete listing
  const handleDelete = useCallback(() => {
    if (!job?.id) return;
    Alert.alert(
      t(`${NS}.job_get.deleteTitle`),
      t(`${NS}.job_get.deleteMessage`),
      [
        { text: t(`${NS}.job_get.cancel`), style: 'cancel' },
        {
          text: t(`${NS}.job_get.delete`),
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const baseUrl = getBaseUrl();
              const res = await rawFetch(`${baseUrl}/api/kwd/jobs/${job.id}`, {
                method: 'DELETE',
                credentials: 'include',
              });
              if (res.ok) {
                handleNavigate('KwdMyListings');
              } else {
                const err = await res.json().catch(() => ({}));
                Alert.alert(
                  t(`${NS}.job_get.alert`),
                  err?.error || t(`${NS}.job_get.deleteFail`)
                );
              }
            } catch {
              Alert.alert(
                t(`${NS}.job_get.alert`),
                t(`${NS}.job_get.deleteFail`)
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  }, [job?.id, handleNavigate, t]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    loadJob(true);
  }, [loadJob]);

  // Format location
  const formatLocation = (location?: {
    city?: string;
    region?: string;
    country?: string;
  }): string => {
    if (!location) return t('surfaces.unspecified');
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(', ') : t('surfaces.unspecified');
  };

  // Format wage
  const formatWage = (salary?: {
    min?: number;
    max?: number;
    currency?: string;
  }): string => {
    if (!salary) return t('surfaces.unspecified');
    const currency = salary.currency || 'SAR';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
    }
    if (salary.min) {
      return `${t('surfaces.salaryFrom')} ${salary.min.toLocaleString()} ${currency}`;
    }
    if (salary.max) {
      return `${t('surfaces.salaryTo')} ${salary.max.toLocaleString()} ${currency}`;
    }
    return t('surfaces.unspecified');
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

  // Format experience level
  const formatExperienceLevel = (level?: string): string => {
    const levelMap: Record<string, string> = {
      entry_level: t('surfaces.experienceLevelEntry'),
      mid_level: t('surfaces.experienceLevelMid'),
      senior_level: t('surfaces.experienceLevelSenior'),
      executive: t('surfaces.experienceLevelExecutive'),
    };
    return level ? levelMap[level] || level : t('surfaces.unspecified');
  };

  if (state === 'content' && job) {
    return (
      <ScreenWrapper
        state='content'
        screenName='auto_kwd_job_get'
        operationName='kwd_job_get'
      >
        <View style={styles.container}>
          <ScreenHeader title={job.title} subtitle={job.company?.name} />
          <View style={styles.heroCard}>
            <View
              style={[styles.essentialsGrid, { direction: layoutDirection }]}
            >
              <View
                style={[styles.essentialBox, { direction: layoutDirection }]}
              >
                <Text style={styles.essentialIcon}>📍</Text>
                <Text style={styles.essentialLabel}>
                  {t('surfaces.locationLabel')}
                </Text>
                <Text style={styles.essentialValue}>
                  {formatLocation(job.location)}
                </Text>
              </View>

              <View
                style={[styles.essentialBox, { direction: layoutDirection }]}
              >
                <Text style={styles.essentialIcon}>💰</Text>
                <Text style={styles.essentialLabel}>
                  {t('surfaces.wageLabel')}
                </Text>
                <Text style={styles.essentialValue}>
                  {formatWage(job.salary)}
                </Text>
              </View>

              {job.jobType && (
                <View
                  style={[styles.essentialBox, { direction: layoutDirection }]}
                >
                  <Text style={styles.essentialIcon}>⏰</Text>
                  <Text style={styles.essentialLabel}>
                    {t('surfaces.jobTypeLabel')}
                  </Text>
                  <Text style={styles.essentialValue}>
                    {formatJobType(job.jobType)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Description — مختصر */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={scrollContentContainerStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[semanticRoles.primaryCTA]}
              />
            }
          >
            {job.description && (
              <View style={styles.descriptionCard}>
                <Text style={[styles.sectionTitle, textAlignStart]}>
                  {t('surfaces.opportunityDetailsTitle')}
                </Text>
                <Text style={[styles.description, textAlignStart]}>
                  {job.description}
                </Text>
              </View>
            )}

            {/* Requirements — مختصرة فقط إذا مهمة */}
            {job.requirements && job.requirements.length > 0 && (
              <View style={styles.requirementsCard}>
                <Text style={[styles.sectionTitle, textAlignStart]}>
                  {t('surfaces.requirementsTitle')}
                </Text>
                {job.requirements.slice(0, 5).map((req, index) => (
                  <View
                    key={index}
                    style={[
                      styles.requirementRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={styles.requirementBullet}>✓</Text>
                    <Text style={[styles.requirementText, textAlignStart]}>
                      {req}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* إدارة الإعلان — لصاحب الإعلان فقط (من منشوراتي) */}
            {isOwner && (
              <View style={styles.ownerSection}>
                <Text style={[styles.sectionTitle, textAlignStart]}>
                  {t('kwd.manage_listing')}
                </Text>
                <View
                  style={[
                    styles.statusToggleRow,
                    { direction: layoutDirection },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.statusToggleBtn,
                      listingStatus === 'active' &&
                        styles.statusToggleBtnActive,
                    ]}
                    onPress={() => handleStatusChange('active')}
                    disabled={statusUpdating}
                    accessibilityLabel={t('kwd.listing_status_active')}
                    accessibilityRole='button'
                  >
                    <Text
                      style={[
                        styles.statusToggleText,
                        listingStatus === 'active' &&
                          styles.statusToggleTextActive,
                      ]}
                    >
                      {t('kwd.listing_status_active')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusToggleBtn,
                      listingStatus === 'closed' &&
                        styles.statusToggleBtnActive,
                    ]}
                    onPress={() => handleStatusChange('closed')}
                    disabled={statusUpdating}
                    accessibilityLabel={t('kwd.listing_status_closed')}
                    accessibilityRole='button'
                  >
                    <Text
                      style={[
                        styles.statusToggleText,
                        listingStatus === 'closed' &&
                          styles.statusToggleTextActive,
                      ]}
                    >
                      {t('kwd.listing_status_closed')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.ownerActionsRow,
                    { direction: layoutDirection },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.ownerActionButton}
                    onPress={() =>
                      handleNavigate('KwdMyListings', {
                        highlightListingId: job.id,
                      })
                    }
                    accessibilityLabel={t(`${NS}.job_get.edit`)}
                    accessibilityRole='button'
                  >
                    <Text style={styles.ownerActionButtonText}>
                      {t(`${NS}.job_get.edit`)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.ownerActionButton,
                      styles.ownerActionButtonDanger,
                    ]}
                    onPress={handleDelete}
                    disabled={deleting}
                    accessibilityLabel={t(
                      'kwd.app-client.mobile.auto_kwd_job_get.deleteListing'
                    )}
                    accessibilityRole='button'
                  >
                    <Text style={styles.ownerActionButtonText}>
                      {deleting
                        ? t(
                            'kwd.app-client.mobile.auto_kwd_job_get.deleteListing'
                          )
                        : t(
                            'kwd.app-client.mobile.auto_kwd_job_get.deleteListing'
                          )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Report link — لغير صاحب الإعلان */}
            {!isOwner && (
              <TouchableOpacity
                style={styles.reportLink}
                onPress={() =>
                  handleNavigate('KwdListingReport', {
                    listingId: job.id,
                    jobId: job.id,
                    jobTitle: job.title,
                    companyName: job.company?.name,
                  })
                }
                accessibilityLabel={t(`${NS}.job_get.reportListing`)}
                accessibilityRole='button'
              >
                <Text style={styles.reportLinkText}>
                  ⚠️ {t(`${NS}.job_get.reportListing`)}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Fixed Apply Button — لغير صاحب الإعلان فقط */}
          {!isOwner && (
            <View style={styles.fixedFooter}>
              <TouchableOpacity
                style={styles.primaryApplyButton}
                onPress={() => handleNavigate('KwdJobApply', { jobId: job.id })}
                activeOpacity={0.8}
                accessibilityLabel={t('common.submit')}
                accessibilityRole='button'
              >
                <Text style={styles.primaryApplyIcon}>⚡</Text>
                <Text style={styles.primaryApplyText}>
                  {t('surfaces.quickApplyLabel')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_الوظيفة')}
      errorMessage={networkError || t('surfaces.failedToLoadJobDetails')}
      onErrorAction={handleRetry}
      screenName='auto_kwd_job_get'
      operationName='entity_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  heroCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  essentialsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  essentialBox: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  essentialIcon: {
    fontSize: typography.fontSize['2xl'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  essentialLabel: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
    fontWeight: typography.fontWeight.bold,
  },
  essentialValue: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  requirementsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  requirementBullet: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.success,
    marginEnd: BTHWANI_SPACING.sm,
    fontWeight: typography.fontWeight.bold,
  },
  requirementText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  ownerSection: {
    margin: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  statusToggleBtn: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  statusToggleBtnActive: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  statusToggleText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.textMuted,
  },
  statusToggleTextActive: {
    color: semanticRoles.primaryCTA,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  ownerActionButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
  },
  ownerActionButtonDanger: {
    backgroundColor: semanticRoles.error,
  },
  ownerActionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTAText,
  },
  reportLink: {
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  reportLinkText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.error,
    fontWeight: typography.fontWeight.bold,
  },
  fixedFooter: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderBlockStartWidth: 1,
    borderBlockStartColor: semanticRoles.border,
    ...elevation.lg,
  },
  primaryApplyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.xl,
    gap: BTHWANI_SPACING.sm,
  },
  primaryApplyIcon: {
    fontSize: typography.fontSize['2xl'],
  },
  primaryApplyText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});

export default auto_kwd_job_get;

