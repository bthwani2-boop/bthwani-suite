// SND Requests List Screen - Services on Demand Requests
// Surface: app-client | Service: snd
// §30 States: Loading / Error / Empty / Success / Content
// Operation: snd_requests_list (GET /api/snd/requests)

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

function getRequiredBaseUrl(): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error('SND_APP_CLIENT_API_BASE_URL_MISSING');
  }
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
  Alert,
} from 'react-native';
import {
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  BTHWANI_COLORS,
  BTHWANI_TYPOGRAPHY,
} from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import { ScreenHeader, scrollContentContainerStyle } from '@bthwani/ui-kit';
import { SndInterestQuickComposeSheet, type InterestData } from './components';
import {
  classifySndRuntimeFailure,
  isSndRetriableFailure,
  sanitizeSndRuntimeMessage,
  type SndRuntimeFailureKind,
} from './sndRuntimeFailures';
import {
  SND_INTERACTIVE_HIT_SLOP,
  SND_MIN_TOUCH_TARGET,
} from './sndAccessibility';

const typography = BTHWANI_TYPOGRAPHY;
const SND_NEUTRAL_SURFACE = '#f5f7fa';
const SND_NEUTRAL_BORDER = '#d8e3ef';

function getServiceMark(label?: string | null) {
  const normalized = label?.trim();
  return normalized ? normalized.charAt(0) : 'س';
}

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface SndRequest {
  id: string;
  requestId: string;
  serviceType: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  location?: {
    city?: string;
    region?: string;
  };
}

interface auto_snd_requests_listProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

function getRequestCardTone(status: SndRequest['status']) {
  switch (status) {
    case 'pending':
      return {
        border: BTHWANI_COLORS.accent,
        chipBg: BTHWANI_COLORS.warningSubtle,
        chipText: BTHWANI_COLORS.accentDark,
        footerBg: BTHWANI_COLORS.accentTint,
        footerText: BTHWANI_COLORS.accentDark,
      };
    case 'in_progress':
      return {
        border: BTHWANI_COLORS.primary,
        chipBg: BTHWANI_COLORS.primaryTint,
        chipText: BTHWANI_COLORS.primary,
        footerBg: BTHWANI_COLORS.linkBlue,
        footerText: BTHWANI_COLORS.primary,
      };
    case 'completed':
      return {
        border: BTHWANI_COLORS.emerald700,
        chipBg: BTHWANI_COLORS.successSubtle,
        chipText: BTHWANI_COLORS.onSuccess,
        footerBg: BTHWANI_COLORS.successSubtle,
        footerText: BTHWANI_COLORS.onSuccess,
      };
    default:
      return {
        border: BTHWANI_COLORS.dangerDark,
        chipBg: BTHWANI_COLORS.dangerTint,
        chipText: BTHWANI_COLORS.dangerDark,
        footerBg: BTHWANI_COLORS.dangerTint,
        footerText: BTHWANI_COLORS.dangerDark,
      };
  }
}

function getRequestsFailureCopy(
  kind: SndRuntimeFailureKind,
  fallback?: string | null
) {
  switch (kind) {
    case 'offline':
      return {
        title: 'السجل غير متاح دون اتصال',
        body: 'احتفظنا بآخر حالة للشاشة إن وجدت. أعد المحاولة عند عودة الاتصال.',
      };
    case 'forbidden':
      return {
        title: 'لا يمكنك فتح سجل الطلبات الآن',
        body: 'هذا الحساب لا يملك صلاحية قراءة سجل طلبات سند في الوقت الحالي.',
      };
    case 'config':
      return {
        title: 'ربط سجل سند غير مكتمل',
        body: 'عنوان API المطلوب غير مضبوط حاليًا، لذلك لا يمكن تحميل السجل الحي.',
      };
    case 'upstream':
      return {
        title: 'خدمة سجل سند غير متاحة',
        body: sanitizeSndRuntimeMessage(
          fallback,
          'تعذر الوصول إلى خدمة سجل سند حاليًا. حاول مرة أخرى لاحقًا.'
        ),
      };
    default:
      return {
        title: 'تعذر تحميل السجل',
        body: sanitizeSndRuntimeMessage(
          fallback,
          'حدث خطأ أثناء تحميل سجل طلبات سند.'
        ),
      };
  }
}

export const auto_snd_requests_list: React.FC<auto_snd_requests_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { direction, directionStyle, rowStyle, textAlignStartStyle, t } =
    useDirection();
  const minimumDescriptionLength = 50;
  const arrowChar = direction === 'rtl' ? '←' : '→';
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<SndRequest[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [failureKind, setFailureKind] = useState<SndRuntimeFailureKind | null>(
    null
  );
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);

  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const lastCreatedRequestIdRef = useRef<string | null>(null);

  const requestStats = useMemo(
    () => ({
      total: requests.length,
      active: requests.filter(
        request =>
          request.status === 'pending' || request.status === 'in_progress'
      ).length,
      closed: requests.filter(
        request =>
          request.status === 'completed' || request.status === 'cancelled'
      ).length,
    }),
    [requests]
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

  const handleGoHome = useCallback(() => {
    handleNavigate('SndHome');
  }, [handleNavigate]);

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

      try {
        isLoadingRef.current = true;

        if (!isRetry) {
          setState('loading');
          setNetworkError(null);
          setFailureKind(null);
          setIsOffline(false);
        }

        const baseUrl = getBaseUrl();
        if (!baseUrl) {
          setRequests([]);
          setFailureKind('config');
          setNetworkError(
            'عنوان API الخاص بسند غير مضبوط حاليًا، لذلك لا يمكن تحميل سجل الطلبات.'
          );
          setState('error');
          setIsOffline(false);
          return;
        }
        const url = `${baseUrl}/api/snd/requests`;

        const response = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setRequests([]);
            setFailureKind('forbidden');
            setNetworkError(
              'لا تملك صلاحية قراءة سجل طلبات سند من هذا الحساب.'
            );
            setState('error');
            setIsOffline(false);
            return;
          }

          if (response.status === 404) {
            setRequests([]);
            setFailureKind(null);
            setNetworkError(null);
            setState('empty');
            setIsOffline(false);
            return;
          }

          const responseFailureKind = classifySndRuntimeFailure({
            status: response.status,
          });

          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage =
              errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            // Ignore
          }
          setFailureKind(responseFailureKind);
          setNetworkError(errorMessage);
          setIsOffline(false);

          if (requests.length === 0) {
            setState('error');
          }
          return;
        }

        setIsOffline(false);
        setNetworkError(null);
        setFailureKind(null);

        const json = await response.json();

        if (!json?.success) {
          setFailureKind('upstream');
          setNetworkError(
            json?.error || t('surfaces.snd.requests_list.l211_ar_1')
          );

          if (requests.length === 0) {
            setState('error');
          }
          return;
        }

        // Transform API response to SndRequest format
        const requestsData = json?.data?.requests || json?.data || [];

        const transformedRequests: SndRequest[] = requestsData.map(
          (req: any) => {
            // Format timestamp
            let timestamp = t('surfaces.snd.requests_list.l219_ar_1');
            if (req.createdAt || req.created_at) {
              const created = new Date(req.createdAt || req.created_at);
              const now = new Date();
              const diffMinutes = Math.floor(
                (now.getTime() - created.getTime()) / 60000
              );
              if (diffMinutes < 1)
                timestamp = t('surfaces.snd.requests_list.l224_ar_1');
              else if (diffMinutes < 60) timestamp = `منذ ${diffMinutes} دقيقة`;
              else if (diffMinutes < 1440)
                timestamp = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
              else timestamp = `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
            }

            // Extract location
            let location = t('surfaces.snd.requests_list.l231_ar_1');
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
              id: req.id || req.requestId || `REQ-${Date.now()}-${0}`,
              requestId: req.requestId || req.id || `REQ-${Date.now()}`,
              serviceType:
                req.serviceType ||
                req.service_type ||
                t('surfaces.snd.requests_list.l245_ar_1'),
              serviceName:
                req.serviceName ||
                req.service_name ||
                req.serviceType ||
                t('surfaces.snd.requests_list.l246_ar_1'),
              description:
                req.description ||
                req.requestDescription ||
                t('snd.app-client.mobile.auto_snd_requests_list.noDescription'),
              status: (
                req.status || 'pending'
              ).toLowerCase() as SndRequest['status'],
              createdAt:
                req.createdAt || req.created_at || new Date().toISOString(),
              updatedAt: req.updatedAt || req.updated_at,
              location: req.location,
            };
          }
        );

        setRequests(transformedRequests);
        setFailureKind(null);
        setState(transformedRequests.length === 0 ? 'empty' : 'content');
        hasLoadedRef.current = true;
      } catch (error: any) {
        const nextFailureKind = classifySndRuntimeFailure({ error });
        const isNetworkErr = nextFailureKind === 'offline';

        setFailureKind(nextFailureKind);
        setNetworkError(
          error instanceof Error && error.message.length > 0
            ? error.message
            : t('surfaces.حدث_خطأ_أثناء_تحميل_إبداءات_الاهتمام')
        );
        setIsOffline(isNetworkErr);

        if (requests.length === 0) {
          setRequests([]);
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
      }
    },
    [requests.length, t]
  );

  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadData();
    }
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true).finally(() => {
      setRefreshing(false);
    });
  }, [loadData]);

  const handleRetry = useCallback(() => {
    setFailureKind(null);
    loadData(true);
  }, [loadData]);

  const openCreateSheet = useCallback(() => {
    setIsCreateSheetVisible(true);
  }, []);

  const handleCreateRequest = useCallback(
    async (data: InterestData) => {
      lastCreatedRequestIdRef.current = null;

      const baseUrl = getRequiredBaseUrl();
      const response = await fetchWithRetry(`${baseUrl}/api/snd/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceType: data.serviceType,
          description: data.description,
          location: data.location,
          preferredTime: data.preferredTime,
          urgency: data.urgency,
          contactMethod: data.contactMethod,
          contactInfo:
            data.contactMethod !== 'in_app' ? data.contactInfo : undefined,
          budget: data.budget,
          timeline: data.timeline,
          metadata: {
            domain: 'SND',
            createdAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error ||
            errorData?.message ||
            `HTTP ${response.status}: فشل في إرسال الطلب`
        );
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(
          json?.error ||
            json?.message ||
            t('surfaces.فشل_في_إرسال_إبداء_الاهتمام')
        );
      }

      lastCreatedRequestIdRef.current =
        json?.data?.request?.id ||
        json?.data?.id ||
        json?.data?.requestId ||
        null;

      if (!lastCreatedRequestIdRef.current) {
        await loadData(true);
      }
    },
    [fetchWithRetry, loadData, t]
  );

  const handleCreateSuccess = useCallback(() => {
    const createdRequestId = lastCreatedRequestIdRef.current;
    lastCreatedRequestIdRef.current = null;
    setIsCreateSheetVisible(false);

    if (createdRequestId) {
      handleNavigate('SndRequestGet', { requestId: createdRequestId });
      return;
    }

    void loadData(true);
  }, [handleNavigate, loadData]);

  const getStatusLabel = (status: SndRequest['status']) => {
    switch (status) {
      case 'pending':
        return t('surfaces.snd.requests_list.l294_ar_1');
      case 'in_progress':
        return t('surfaces.snd.requests_list.l296_ar_1');
      case 'completed':
        return t('surfaces.snd.requests_list.l298_ar_1');
      case 'cancelled':
        return t('surfaces.snd.requests_list.l300_ar_1');
      default:
        return status;
    }
  };

  const getStatusColor = (status: SndRequest['status']) => {
    switch (status) {
      case 'pending':
        return semanticRoles.warning;
      case 'in_progress':
        return semanticRoles.info;
      case 'completed':
        return semanticRoles.success;
      case 'cancelled':
        return semanticRoles.error;
      default:
        return semanticRoles.textMuted;
    }
  };

  const renderRequestItem = ({ item }: { item: SndRequest }) => {
    const tone = getRequestCardTone(item.status);
    const timestamp = item.createdAt
      ? (() => {
          const created = new Date(item.createdAt);
          const now = new Date();
          const diffMinutes = Math.floor(
            (now.getTime() - created.getTime()) / 60000
          );
          if (diffMinutes < 1) return t('surfaces.snd.requests_list.l326_ar_1');
          if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
          if (diffMinutes < 1440)
            return `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
          return `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
        })()
      : '';

    return (
      <TouchableOpacity
        style={[styles.requestCard, { borderColor: tone.border + '24' }]}
        onPress={() =>
          handleNavigate('SndRequestGet', { requestId: item.requestId })
        }
        accessibilityRole='button'
        accessibilityLabel={`فتح طلب ${item.serviceName}`}
        accessibilityHint='يفتح التفاصيل الكاملة لهذا الطلب'
        hitSlop={SND_INTERACTIVE_HIT_SLOP}
        activeOpacity={0.7}
      >
        <View style={[styles.requestRow, rowStyle]}>
          <View
            style={[
              styles.requestIconOrb,
              {
                backgroundColor: SND_NEUTRAL_SURFACE,
                borderColor: SND_NEUTRAL_BORDER,
              },
            ]}
          >
            <Text style={{ fontSize: 13, fontWeight: '700' }}>
              {getServiceMark(item.serviceName)}
            </Text>
          </View>

          <View style={styles.requestBody}>
            <View style={[styles.requestMetaRow, rowStyle]}>
              <Text
                style={[styles.requestServiceName, textAlignStartStyle]}
                numberOfLines={1}
              >
                {item.serviceName}
              </Text>
              <Text style={styles.requestTimestamp}>{timestamp}</Text>
            </View>

            <View style={[styles.requestMetaChips, directionStyle]}>
              <View
                style={[
                  styles.requestStateChip,
                  {
                    backgroundColor: tone.chipBg,
                    borderColor: tone.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.requestStateChipText,
                    { color: tone.chipText },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>

              <View style={styles.requestIdChip}>
                <Text style={styles.requestIdChipText}>#{item.requestId}</Text>
              </View>
            </View>

            <Text
              style={[styles.requestDescription, textAlignStartStyle]}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            <View style={[styles.requestFootRow, rowStyle]}>
              <Text style={styles.requestLocation} numberOfLines={1}>
                {item.location?.city ||
                  item.location?.region ||
                  'بدون موقع محدد'}
              </Text>
              <Text style={[styles.requestActionHint, { color: '#243b53' }]}>
                فتح {arrowChar}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const failureCopy = failureKind
    ? getRequestsFailureCopy(failureKind, networkError)
    : null;
  const shouldRetryFailure = isSndRetriableFailure(failureKind);
  const failureActionLabel = shouldRetryFailure
    ? 'إعادة المحاولة'
    : 'العودة إلى الرئيسية';

  if (state === 'content' && requests.length > 0) {
    return (
      <ScreenWrapper state='content'>
        <>
          <View style={styles.container}>
            <ScreenHeader
              title={t('surfaces.snd.requests_list.l371_ar_1')}
              subtitle={t('surfaces.snd.requests_list.l372_ar_1')}
            />

            <View style={styles.summaryCard}>
              <View style={[styles.summaryTopRow, rowStyle]}>
                <View style={styles.summaryTopCopy}>
                  <View style={styles.summaryBrandPill}>
                    <Text style={styles.summaryBrandPillText}>سجل سند</Text>
                  </View>

                  <Text style={[styles.summaryTitle, textAlignStartStyle]}>
                    {requestStats.active > 0
                      ? 'سجل الطلبات الجارية جاهز للمتابعة'
                      : 'سجل طلباتك في عرض أوضح'}
                  </Text>
                  <Text style={[styles.summarySubtitle, textAlignStartStyle]}>
                    هذه الشاشة مخصصة للمتابعة وفتح التفاصيل، والطلب الجديد يبقى
                    خيارًا سريعًا ثانويًا من نفس المسار.
                  </Text>
                </View>

                <View style={styles.summaryTopAside}>
                  <View style={styles.summaryAccentOrb}>
                    <Text style={styles.summaryAccentOrbText}>
                      {requestStats.total}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.summarySecondaryAction}
                    onPress={openCreateSheet}
                    accessibilityRole='button'
                    accessibilityLabel={t('surfaces.snd.createRequest')}
                    accessibilityHint='يفتح مسار الطلب السريع مع بقاء السجل هو المسار الأساسي هنا'
                    hitSlop={SND_INTERACTIVE_HIT_SLOP}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.summarySecondaryActionText}>
                      طلب سريع
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.summaryMetricsRow, directionStyle]}>
                <View style={styles.summaryMetric}>
                  <Text style={styles.summaryMetricValue}>
                    {requestStats.active}
                  </Text>
                  <Text style={styles.summaryMetricLabel}>مفتوحة</Text>
                </View>
                <View style={styles.summaryMetric}>
                  <Text style={styles.summaryMetricValue}>
                    {requestStats.closed}
                  </Text>
                  <Text style={styles.summaryMetricLabel}>مغلقة</Text>
                </View>
                <View style={styles.summaryMetric}>
                  <Text style={styles.summaryMetricValue}>
                    {requestStats.total}
                  </Text>
                  <Text style={styles.summaryMetricLabel}>إجمالي</Text>
                </View>
              </View>
            </View>

            {failureCopy ? (
              <View
                style={[
                  styles.statusBanner,
                  shouldRetryFailure
                    ? styles.statusBannerWarning
                    : styles.statusBannerBlocking,
                ]}
              >
                <Text style={[styles.statusBannerTitle, textAlignStartStyle]}>
                  {failureCopy.title}
                </Text>
                <Text style={[styles.statusBannerText, textAlignStartStyle]}>
                  {failureCopy.body}
                </Text>
                <TouchableOpacity
                  style={styles.statusBannerAction}
                  onPress={shouldRetryFailure ? handleRetry : handleGoHome}
                  accessibilityRole='button'
                  accessibilityLabel={failureActionLabel}
                  accessibilityHint='ينفذ الإجراء التصحيحي دون فتح مسار جديد'
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                  activeOpacity={0.75}
                >
                  <Text style={styles.statusBannerActionText}>
                    {failureActionLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <FlatList
              data={requests}
              renderItem={renderRequestItem}
              keyExtractor={item => item.id}
              contentContainerStyle={[
                scrollContentContainerStyle,
                styles.listContent,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {t('surfaces.snd.requests_list.l394_ar_1')}
                  </Text>
                </View>
              }
            />
          </View>

          <SndInterestQuickComposeSheet
            visible={isCreateSheetVisible}
            onClose={() => setIsCreateSheetVisible(false)}
            onSubmit={handleCreateRequest}
            onSuccess={handleCreateSuccess}
            minimumDescriptionLength={minimumDescriptionLength}
          />
        </>
      </ScreenWrapper>
    );
  }

  if (state === 'empty') {
    return (
      <ScreenWrapper state='empty'>
        <>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
              {t('surfaces.snd.requests_list.l408_ar_1')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('surfaces.snd.requests_list.l409_ar_1')}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={openCreateSheet}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.snd.createRequest')}
              accessibilityHint='يفتح مسار الطلب السريع عندما لا يوجد سجل بعد'
              hitSlop={SND_INTERACTIVE_HIT_SLOP}
              activeOpacity={0.7}
            >
              <Text style={styles.createButtonText}>
                {t('surfaces.snd.requests_list.l416_ar_1')}
              </Text>
            </TouchableOpacity>
          </View>

          <SndInterestQuickComposeSheet
            visible={isCreateSheetVisible}
            onClose={() => setIsCreateSheetVisible(false)}
            onSubmit={handleCreateRequest}
            onSuccess={handleCreateSuccess}
            minimumDescriptionLength={minimumDescriptionLength}
          />
        </>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.snd.requests_list.l422_ar_1')}
      errorMessage={
        failureCopy?.body ||
        networkError ||
        t('surfaces.فشل_في_تحميل_قائمة_إبداءات_الاهتمام')
      }
      errorActionText={failureActionLabel}
      onErrorAction={shouldRetryFailure ? handleRetry : handleGoHome}
      screenName='auto_snd_requests_list'
      operationName='snd_requests_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: BTHWANI_BORDER.hairline,
    borderBlockEndColor: semanticRoles.outline,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  createButton: {
    backgroundColor: BTHWANI_COLORS.accent,
    minHeight: SND_MIN_TOUCH_TARGET,
    paddingVertical: BTHWANI_SPACING.sm + 2,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  createButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  summaryCard: {
    marginHorizontal: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: '#ffffff',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
  },
  summaryTopRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  summaryTopAside: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  summaryTopCopy: {
    flex: 1,
  },
  summaryBrandPill: {
    borderRadius: BTHWANI_RADIUS.full,
    alignSelf: 'flex-start',
    backgroundColor: '#eef4fa',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
  },
  summaryBrandPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  summaryAccentOrb: {
    width: BTHWANI_SPACING[40] + BTHWANI_SPACING.md,
    height: BTHWANI_SPACING[40] + BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#173f73',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#295183',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAccentOrbText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  summarySecondaryAction: {
    minHeight: SND_MIN_TOUCH_TARGET,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs + 4,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
    backgroundColor: '#f7fafd',
  },
  summarySecondaryActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  summaryTitle: {
    marginTop: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  summarySubtitle: {
    marginTop: BTHWANI_SPACING.xs,
    fontSize: typography.fontSize.sm,
    color: '#60758c',
    lineHeight: typography.lineHeightPx.sm,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  summaryMetric: {
    flex: 1,
    minWidth: 84,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: '#f7fafd',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
  },
  summaryMetricValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  summaryMetricLabel: {
    marginTop: 2,
    fontSize: typography.fontSize.xs,
    color: '#60758c',
  },
  statusBanner: {
    marginHorizontal: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.xs,
  },
  statusBannerWarning: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffd6bd',
  },
  statusBannerBlocking: {
    backgroundColor: '#f7fafd',
    borderColor: '#d8e3ef',
  },
  statusBannerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  statusBannerText: {
    fontSize: typography.fontSize.xs,
    color: '#60758c',
    lineHeight: typography.lineHeightPx.xs,
  },
  statusBannerAction: {
    alignSelf: 'flex-start',
    marginTop: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#173f73',
    minHeight: SND_MIN_TOUCH_TARGET,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs + 4,
    justifyContent: 'center',
  },
  statusBannerActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  listContent: {
    padding: BTHWANI_SPACING.md,
  },
  requestCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  requestRow: {
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
  },
  requestIconOrb: {
    width: 48,
    height: 48,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
  },
  requestBody: {
    flex: 1,
    minWidth: 0,
  },
  requestMetaRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  requestMetaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    marginTop: BTHWANI_SPACING.xs,
  },
  requestStateChip: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: BTHWANI_BORDER.hairline,
  },
  requestStateChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  requestIdChip: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  requestIdChipText: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  requestServiceName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    minWidth: 0,
    flex: 1,
  },
  requestDescription: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.sm,
    lineHeight: typography.lineHeightPx.sm,
    minWidth: 0,
  },
  requestTimestamp: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  requestFootRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  requestLocation: {
    fontSize: typography.fontSize.xs,
    flex: 1,
    color: semanticRoles.textMuted,
  },
  requestActionHint: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: typography.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xl,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
});

export default auto_snd_requests_list;

