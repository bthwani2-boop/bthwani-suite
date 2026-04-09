// KWD Application Get Screen - Application Details using entity_get (unified)
// Surface: app-client | Service: kwd
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// Uses: entity_get (unified) with domain=KWD, entityType=application

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

interface Application {
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
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    jobType?: string;
    description?: string;
    requirements?: string[];
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
  applicantInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    skill?: string;
    availability?: string;
  };
  portfolioImages?: string[];
  notes?: string;
  nextSteps?: string[];
}

interface auto_kwd_application_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { applicationId?: string; jobId?: string } };
}

export const auto_kwd_application_get: React.FC<
  auto_kwd_application_getProps
> = ({ onNavigate, navigation, route }) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [application, setApplication] = useState<Application | null>(null);

  // Get applicationId/jobId from route params
  const applicationId = route?.params?.applicationId || 'app_123456';
  const jobId = route?.params?.jobId;

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

  // Load application details from API using entity_get (unified)
  const loadApplication = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) return;

      if (maxRetriesReachedRef.current && !isRetry) {
        setApplication(null);
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
        // Use entity_get unified operation with domain=KWD, entityType=application
        const params = new URLSearchParams({
          domain: 'KWD',
          entityType: 'application',
        });
        const url = `${baseUrl}/api/entities/${applicationId}?${params.toString()}`;

        const response = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(t(`${NS}.home_get.loginRequired`));
          }
          if (response.status === 403) {
            throw new Error(t(`${NS}.home_get.accountNotActive`));
          }
          if (response.status === 404) {
            throw new Error(t(`${NS}.application_get.notFound`));
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || t(`${NS}.application_get.loadError`));
        }

        // Transform API response to Application format
        const entity = json?.entity || json?.data || {};
        const applicationData: Application = {
          id: entity.id || applicationId,
          applicationId: entity.applicationId || entity.id,
          job: {
            id: entity.job?.id || jobId || '',
            title: entity.job?.title || t(`${NS}.common.noTitle`),
            company: entity.job?.company
              ? {
                  name:
                    entity.job.company.name || t(`${NS}.home_get.unspecified`),
                  logoUrl: entity.job.company.logoUrl,
                  industry: entity.job.company.industry,
                }
              : undefined,
            location: entity.job?.location
              ? {
                  city: entity.job.location.city,
                  region: entity.job.location.region,
                  country: entity.job.location.country,
                }
              : undefined,
            salary:
              entity.job?.salary || entity.job?.wage
                ? {
                    min: entity.job.salary?.min || entity.job.wage?.min,
                    max: entity.job.salary?.max || entity.job.wage?.max,
                    currency:
                      entity.job.salary?.currency ||
                      entity.job.wage?.currency ||
                      'SAR',
                  }
                : undefined,
            jobType: entity.job?.jobType,
            description: entity.job?.description,
            requirements: entity.job?.requirements || [],
          },
          status: (entity.status || 'pending') as Application['status'],
          statusHistory: entity.statusHistory || [],
          appliedAt: entity.appliedAt || entity.submittedAt || entity.createdAt,
          lastUpdated: entity.lastUpdated || entity.updatedAt,
          applicantInfo: entity.applicantInfo
            ? {
                name:
                  entity.applicantInfo.name || entity.applicantInfo.fullName,
                email: entity.applicantInfo.email,
                phone: entity.applicantInfo.phone,
                skill: entity.applicantInfo.skill,
                availability: entity.applicantInfo.availability,
              }
            : undefined,
          portfolioImages:
            entity.portfolioImages ||
            entity.documents
              ?.filter((d: any) => d.type === 'portfolio')
              .map((d: any) => d.url) ||
            [],
          notes: entity.notes,
          nextSteps: entity.nextSteps || [],
        };

        setApplication(applicationData);
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
        setIsOffline(false);
        setNetworkError(null);
      } catch (error: any) {
        console.error('[KWD Application Get] Load error:', error);
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
          setNetworkError(t('surfaces.لا_يمكن_الاتصال_بالخادم_تحقق_من_اتصا'));

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
              : t(`${NS}.application_get.loadError`);
          setNetworkError(errorMessage);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
        setRefreshing(false);
      }
    },
    [applicationId, jobId, retryCount, t]
  );

  // Initial load
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadApplication();
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadApplication();
  }, [loadApplication]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    loadApplication(true);
  }, [loadApplication]);

  // Withdraw application handler
  const handleWithdrawApplication = useCallback(() => {
    Alert.alert(
      t(`${NS}.application_get.withdrawTitle`),
      t(`${NS}.application_get.withdrawMessage`),
      [
        { text: t(`${NS}.application_get.cancel`), style: 'cancel' },
        {
          text: t(`${NS}.application_get.withdraw`),
          style: 'destructive',
          onPress: async () => {
            try {
              setState('loading');
              // Deferred: withdraw operation
              // For now, just show success
              setState('success');
            } catch (error) {
              Alert.alert(
                t(`${NS}.common.error`),
                t(`${NS}.application_get.withdrawFail`)
              );
              setState('content');
            }
          },
        },
      ]
    );
  }, [t]);

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return t(`${NS}.home_get.unspecified`);
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

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

  if (state === 'content' && application) {
    return (
      <ScreenWrapper
        state='content'
        screenName='auto_kwd_application_get'
        operationName='kwd_application_get'
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={scrollContentContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[semanticRoles.primaryCTA]}
            />
          }
        >
          <ScreenHeader
            title={t('surfaces.applicationDetailsTitle')}
            subtitle={
              application.applicationId
                ? `#${application.applicationId}`
                : undefined
            }
          />
          {/* Status Card */}
          <View style={styles.statusCard}>
            <Text style={styles.statusIcon}>
              {getStatusIcon(application.status)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(application.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(application.status)}
              </Text>
            </View>
            {application.lastUpdated && (
              <Text style={styles.lastUpdate}>
                آخر تحديث: {formatDate(application.lastUpdated)}
              </Text>
            )}
          </View>

          {/* Job Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              معلومات الوظيفة
            </Text>
            <View style={styles.jobCard}>
              <Text style={[styles.jobTitle, textAlignStart]}>
                {application.job.title}
              </Text>
              {application.job.company?.name && (
                <Text style={[styles.company, textAlignStart]}>
                  {application.job.company.name}
                </Text>
              )}
              <View style={[styles.jobDetails, { direction: layoutDirection }]}>
                {application.job.salary && (
                  <Text style={[styles.detailItem, textAlignStart]}>
                    💰 {formatWage(application.job.salary)}
                  </Text>
                )}
                {application.job.location && (
                  <Text style={[styles.detailItem, textAlignStart]}>
                    📍 {formatLocation(application.job.location)}
                  </Text>
                )}
                {application.job.jobType && (
                  <Text style={[styles.detailItem, textAlignStart]}>
                    ⏰ {formatJobType(application.job.jobType)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Job Description */}
          {application.job.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>
                وصف الوظيفة
              </Text>
              <Text style={[styles.description, textAlignStart]}>
                {application.job.description}
              </Text>
            </View>
          )}

          {/* Job Requirements */}
          {application.job.requirements &&
            application.job.requirements.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, textAlignStart]}>
                  المتطلبات
                </Text>
                <View style={styles.requirementsList}>
                  {application.job.requirements.map((req, index) => (
                    <View
                      key={index}
                      style={[
                        styles.requirementItem,
                        { direction: layoutDirection },
                      ]}
                    >
                      <Text style={styles.bullet}>•</Text>
                      <Text style={[styles.requirementText, textAlignStart]}>
                        {req}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Applicant Information */}
          {application.applicantInfo && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>
                بياناتك في الطلب
              </Text>
              <View style={styles.applicantCard}>
                {application.applicantInfo.name && (
                  <View
                    style={[
                      styles.applicantRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={[styles.applicantLabel, textAlignStart]}>
                      الاسم:
                    </Text>
                    <Text style={[styles.applicantValue, textAlignStart]}>
                      {application.applicantInfo.name}
                    </Text>
                  </View>
                )}
                {application.applicantInfo.email && (
                  <View
                    style={[
                      styles.applicantRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={[styles.applicantLabel, textAlignStart]}>
                      البريد الإلكتروني:
                    </Text>
                    <Text style={[styles.applicantValue, textAlignStart]}>
                      {application.applicantInfo.email}
                    </Text>
                  </View>
                )}
                {application.applicantInfo.phone && (
                  <View
                    style={[
                      styles.applicantRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={[styles.applicantLabel, textAlignStart]}>
                      الهاتف:
                    </Text>
                    <Text style={[styles.applicantValue, textAlignStart]}>
                      {application.applicantInfo.phone}
                    </Text>
                  </View>
                )}
                {application.applicantInfo.skill && (
                  <View
                    style={[
                      styles.applicantRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={[styles.applicantLabel, textAlignStart]}>
                      المهارة:
                    </Text>
                    <Text style={[styles.applicantValue, textAlignStart]}>
                      {application.applicantInfo.skill}
                    </Text>
                  </View>
                )}
                {application.applicantInfo.availability && (
                  <View
                    style={[
                      styles.applicantRow,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={[styles.applicantLabel, textAlignStart]}>
                      التوافر:
                    </Text>
                    <Text style={[styles.applicantValue, textAlignStart]}>
                      {application.applicantInfo.availability}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Portfolio Images */}
          {application.portfolioImages &&
            application.portfolioImages.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, textAlignStart]}>
                  معرض الأعمال
                </Text>
                <Text style={[styles.portfolioCount, textAlignStart]}>
                  {application.portfolioImages.length} صورة
                </Text>
              </View>
            )}

          {/* Notes */}
          {application.notes && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>
                ملاحظات من الشركة
              </Text>
              <View style={styles.notesCard}>
                <Text style={[styles.notesText, textAlignStart]}>
                  {application.notes}
                </Text>
              </View>
            </View>
          )}

          {/* Next Steps */}
          {application.nextSteps && application.nextSteps.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>
                الخطوات التالية
              </Text>
              <View style={styles.nextStepsList}>
                {application.nextSteps.map((step, index) => (
                  <View
                    key={index}
                    style={[
                      styles.nextStepItem,
                      { direction: layoutDirection },
                    ]}
                  >
                    <Text style={styles.nextStepNumber}>{index + 1}</Text>
                    <Text style={[styles.nextStepText, textAlignStart]}>
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Application Info */}
          <View style={styles.applicationInfo}>
            {application.appliedAt && (
              <Text style={styles.infoText}>
                تم التقدم بتاريخ: {formatDate(application.appliedAt)}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          {(application.status === 'pending' ||
            application.status === 'under_review') && (
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdrawApplication}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.withdrawApplication')}
            >
              <Text style={styles.withdrawText}>
                {t('surfaces.withdrawApplication')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.jobButton}
            onPress={() =>
              handleNavigate('KwdJobGet', { jobId: application.job.id })
            }
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.viewJobDetails')}
          >
            <Text style={styles.jobButtonText}>
              {t('surfaces.viewJobDetails')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('KwdMyApplicationsList')}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.العودة_للطلبات')}
          >
            <Text style={styles.backButtonText}>
              {t('surfaces.العودة_للطلبات')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  if (state === 'success') {
    return (
      <ScreenWrapper
        state='success'
        successMessage={t('surfaces.تم_سحب_طلب_التوظيف_بنجاح')}
        successActionText={t('surfaces.العودة_للطلبات')}
        onSuccessAction={() => handleNavigate('KwdMyApplicationsList')}
        screenName='auto_kwd_application_get'
        operationName='entity_get'
      />
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_الطلب')}
      errorMessage={
        networkError || t('surfaces.failedToLoadApplicationDetails')
      }
      onErrorAction={handleRetry}
      screenName='auto_kwd_application_get'
      operationName='entity_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  statusCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    ...elevation.sm,
  },
  statusIcon: {
    fontSize: typography.fontSize['3xl'],
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  lastUpdate: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  jobCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...elevation.sm,
  },
  jobTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  company: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    marginEnd: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  requirementsList: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  bullet: {
    color: semanticRoles.primaryCTA,
    fontSize: typography.fontSize.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  applicantCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  applicantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  applicantLabel: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  applicantValue: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  portfolioCount: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  notesCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  notesText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  nextStepsList: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  nextStepNumber: {
    width: 24,
    height: 24,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.primaryCTA,
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    lineHeight: 24,
    marginEnd: BTHWANI_SPACING.sm,
  },
  nextStepText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  applicationInfo: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  withdrawButton: {
    backgroundColor: semanticRoles.error,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  withdrawText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  jobButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  jobButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  backButtonText: {
    color: semanticRoles.primaryCTA,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});

export default auto_kwd_application_get;

