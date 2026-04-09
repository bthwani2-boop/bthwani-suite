// SND Request Get Screen - Request Details
// Surface: app-client | Service: snd
// §30 States: Loading / Error / Empty / Success / Content
// Operation: snd_request_get (GET /api/snd/requests/{request_id})

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  BTHWANI_TYPOGRAPHY,
  BTHWANI_COLORS,
  colorTokens,
} from '@bthwani/ui-kit';
import { ScreenHeader, scrollContentContainerStyle } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
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
  location?: string;
  preferredTime?: string;
  urgency?: 'low' | 'medium' | 'high';
  contactMethod?: 'phone' | 'whatsapp' | 'in_app';
  contactInfo?: string;
  budget?: string;
  timeline?: string;
  createdAt: string;
  updatedAt?: string;
}

interface auto_snd_request_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { requestId?: string } };
}

function mapApiRequestToDetail(
  request: Record<string, any>,
  fallbackRequestId: string
): SndRequest {
  const metadata = request.metadata || {};

  return {
    id: request.id || request.requestId || fallbackRequestId,
    requestId: request.requestId || request.id || fallbackRequestId,
    serviceType:
      request.serviceType ||
      metadata.serviceType ||
      metadata.service_type ||
      'other',
    serviceName:
      request.serviceName ||
      metadata.serviceName ||
      metadata.service_name ||
      request.serviceType ||
      metadata.serviceType ||
      'خدمة سند',
    description:
      request.description ||
      metadata.description ||
      'لا يوجد وصف إضافي لهذا الطلب.',
    status: (
      request.status ||
      metadata.status ||
      'pending'
    ).toLowerCase() as SndRequest['status'],
    location: request.location || metadata.location || metadata.location?.city,
    preferredTime:
      request.preferredTime ||
      metadata.preferredTime ||
      metadata.preferred_time,
    urgency: (request.urgency || metadata.urgency) as
      | 'low'
      | 'medium'
      | 'high'
      | undefined,
    contactMethod:
      request.contactMethod ||
      metadata.contactMethod ||
      metadata.contact_method ||
      undefined,
    contactInfo:
      request.contactInfo || metadata.contactInfo || metadata.contact_info,
    budget: request.budget || metadata.budget,
    timeline: request.timeline || metadata.timeline,
    createdAt:
      request.createdAt || metadata.createdAt || new Date().toISOString(),
    updatedAt: request.updatedAt || metadata.updatedAt,
  };
}

function getRequestDetailFailureCopy(
  kind: SndRuntimeFailureKind,
  fallback?: string | null
) {
  switch (kind) {
    case 'offline':
      return {
        body: 'تفاصيل الطلب غير متاحة دون اتصال. أعد المحاولة عند عودة الشبكة.',
      };
    case 'forbidden':
      return {
        body: 'هذا الحساب لا يملك صلاحية عرض تفاصيل هذا الطلب الآن. يمكنك الرجوع إلى السجل بأمان.',
      };
    case 'not_found':
      return {
        body: 'لم نعد نجد هذا الطلب ضمن السجل الحالي. ارجع إلى قائمة الطلبات لاختيار طلب آخر.',
      };
    case 'config':
      return {
        body: 'عنوان API الخاص بسند غير مضبوط حاليًا، لذلك لا يمكن فتح التفاصيل الحية.',
      };
    case 'upstream':
      return {
        body: sanitizeSndRuntimeMessage(
          fallback,
          'خدمة تفاصيل سند لا تستجيب حاليًا. حاول مرة أخرى لاحقًا.'
        ),
      };
    default:
      return {
        body: sanitizeSndRuntimeMessage(
          fallback,
          'تعذر تحميل تفاصيل الطلب في سند حاليًا.'
        ),
      };
  }
}

export const auto_snd_request_get: React.FC<auto_snd_request_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const [state, setState] = useState<ScreenState>('loading');
  const [requestData, setRequestData] = useState<SndRequest | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [failureKind, setFailureKind] = useState<SndRuntimeFailureKind | null>(
    null
  );
  const [retryCount, setRetryCount] = useState(0);
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const { directionStyle, textAlignStartStyle, t } = useDirection();
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Get requestId from route params
  const requestId = route?.params?.requestId || '';

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

  const loadRequest = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) {
        return;
      }

      if (maxRetriesReachedRef.current && !isRetry) {
        setRequestData(null);
        setState('content');
        return;
      }

      if (maxRetriesReachedRef.current && isRetry) {
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
      }

      if (!requestId) {
        setFailureKind('not_found');
        setNetworkError('لم نعد نجد هذا الطلب ضمن المسار الحالي.');
        setState('error');
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
          setFailureKind('config');
          setNetworkError(
            'عنوان API الخاص بسند غير مضبوط حاليًا، لذلك لا يمكن فتح تفاصيل الطلب.'
          );
          setState('error');
          setIsOffline(false);
          return;
        }
        const url = `${baseUrl}/api/snd/requests/${requestId}`;

        const response = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setFailureKind('forbidden');
            setNetworkError(
              'لا تملك صلاحية عرض تفاصيل هذا الطلب في الوقت الحالي.'
            );
            setState('error');
            setIsOffline(false);
            return;
          }

          if (response.status === 404) {
            setFailureKind('not_found');
            setNetworkError('هذا الطلب لم يعد موجودًا ضمن سجل سند الحالي.');
            setState('error');
            setIsOffline(false);
            return;
          }

          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage =
              errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            // Ignore
          }
          throw new Error(errorMessage);
        }

        setIsOffline(false);
        setNetworkError(null);
        setFailureKind(null);
        setRetryCount(0);

        const json = await response.json();

        if (!json?.success) {
          setFailureKind('upstream');
          setNetworkError(
            json?.error ||
              json?.message ||
              t('surfaces.snd.request_get.l196_ar_1')
          );
          setState('error');
          return;
        }

        const transformedRequest = mapApiRequestToDetail(
          json?.data || {},
          requestId
        );

        setRequestData(transformedRequest);
        setFailureKind(null);
        hasLoadedRef.current = true;
        setState('content');
      } catch (error: any) {
        const nextFailureKind = classifySndRuntimeFailure({ error });
        setFailureKind(nextFailureKind);
        setState('error');
        setNetworkError(
          error?.message || t('surfaces.حدث_خطأ_أثناء_تحميل_إبداء_الاهتمام')
        );
        setIsOffline(nextFailureKind === 'offline');
      } finally {
        isLoadingRef.current = false;
      }
    },
    [requestId, t]
  );

  useEffect(() => {
    if (!hasLoadedRef.current && requestId) {
      loadRequest();
    }
  }, [requestId, loadRequest]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    setFailureKind(null);
    loadRequest(true);
  }, [loadRequest]);

  const handleBackToRequests = useCallback(() => {
    handleNavigate('SndRequests');
  }, [handleNavigate]);

  const handleCancelRequest = useCallback(() => {
    if (!requestData) {
      return;
    }

    Alert.alert(
      t('surfaces.تأكيد_الإلغاء'),
      'سيتم إلغاء هذا الطلب من شاشة التفاصيل مباشرة.',
      [
        { text: t('surfaces.snd.home_get.l487_ar_1'), style: 'cancel' },
        {
          text: t('surfaces.snd.home_get.l489_ar_1'),
          style: 'destructive',
          onPress: async () => {
            if (submittingCancel) {
              return;
            }

            setSubmittingCancel(true);

            try {
              const baseUrl = getBaseUrl();
              if (!baseUrl) {
                throw new Error('SND_APP_CLIENT_API_BASE_URL_MISSING');
              }
              const response = await fetchWithRetry(
                `${baseUrl}/api/snd/requests/${requestData.requestId}/status`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ status: 'cancelled' }),
                  credentials: 'include',
                }
              );

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                  errorData?.error ||
                    errorData?.message ||
                    `HTTP ${response.status}: فشل في إلغاء الطلب`
                );
              }

              const json = await response.json();
              if (!json?.success) {
                throw new Error(
                  json?.error || json?.message || 'فشل في إلغاء الطلب'
                );
              }

              setRequestData(
                mapApiRequestToDetail(json?.data || {}, requestData.requestId)
              );
              Alert.alert('تم الإلغاء', 'تم إلغاء الطلب بنجاح.');
            } catch (error: any) {
              const cancelFailureKind = classifySndRuntimeFailure({ error });
              const cancelMessage =
                cancelFailureKind === 'config'
                  ? 'إعداد الاتصال غير مكتمل حاليًا، لذلك تعذر إلغاء الطلب. بقيت على شاشة التفاصيل ويمكنك المحاولة لاحقًا.'
                  : cancelFailureKind === 'offline'
                    ? 'تعذر إلغاء الطلب بسبب الاتصال. بقيت على شاشة التفاصيل ويمكنك إعادة المحاولة عند عودة الشبكة.'
                    : cancelFailureKind === 'forbidden'
                      ? 'لا توجد صلاحية كافية لإلغاء هذا الطلب الآن. بقيت على شاشة التفاصيل دون فقدان السياق.'
                      : error?.message || 'تعذر إلغاء الطلب من شاشة التفاصيل.';
              Alert.alert('فشل الإلغاء', cancelMessage);
            } finally {
              setSubmittingCancel(false);
            }
          },
        },
      ]
    );
  }, [fetchWithRetry, requestData, submittingCancel, t]);

  const getStatusColor = (status: SndRequest['status']) => {
    switch (status) {
      case 'pending':
        return semanticRoles.stateWarning.icon;
      case 'in_progress':
        return semanticRoles.stateInfo.icon;
      case 'completed':
        return semanticRoles.stateSuccess.icon;
      case 'cancelled':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: SndRequest['status']) => {
    switch (status) {
      case 'pending':
        return t('surfaces.snd.request_get.l263_ar_1');
      case 'in_progress':
        return t('surfaces.snd.request_get.l265_ar_1');
      case 'completed':
        return t('surfaces.snd.request_get.l267_ar_1');
      case 'cancelled':
        return t('surfaces.snd.request_get.l269_ar_1');
      default:
        return status;
    }
  };

  const getUrgencyColor = (urgency?: 'low' | 'medium' | 'high') => {
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

  const getUrgencyText = (urgency?: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'low':
        return t('surfaces.snd.request_get.l291_ar_1');
      case 'medium':
        return t('surfaces.snd.request_get.l293_ar_1');
      case 'high':
        return t('surfaces.snd.request_get.l295_ar_1');
      default:
        return t('surfaces.snd.request_get.l297_ar_1');
    }
  };

  const getStatusTheme = (status: SndRequest['status']) => {
    switch (status) {
      case 'pending':
        return {
          surface: BTHWANI_COLORS.primary,
          border: BTHWANI_COLORS.primaryBlue,
          onSurface: BTHWANI_COLORS.onPrimary,
          subtext: BTHWANI_COLORS.surfaceOverlay90,
          badgeBg: BTHWANI_COLORS.surfaceOverlay12,
          badgeBorder: BTHWANI_COLORS.surfaceOverlay35,
          badgeText: BTHWANI_COLORS.onPrimary,
          glowOne: BTHWANI_COLORS.surfaceOverlay12,
          glowTwo: BTHWANI_COLORS.accentTint,
        };
      case 'in_progress':
        return {
          surface: BTHWANI_COLORS.primaryBlue,
          border: BTHWANI_COLORS.primary,
          onSurface: BTHWANI_COLORS.onPrimary,
          subtext: BTHWANI_COLORS.surfaceOverlay90,
          badgeBg: BTHWANI_COLORS.surfaceOverlay12,
          badgeBorder: BTHWANI_COLORS.surfaceOverlay35,
          badgeText: BTHWANI_COLORS.onPrimary,
          glowOne: BTHWANI_COLORS.surfaceOverlay12,
          glowTwo: BTHWANI_COLORS.infoSubtle,
        };
      case 'completed':
        return {
          surface: BTHWANI_COLORS.successBg,
          border: BTHWANI_COLORS.emerald700,
          onSurface: BTHWANI_COLORS.emerald700,
          subtext: BTHWANI_COLORS.slate600,
          badgeBg: BTHWANI_COLORS.successSubtle,
          badgeBorder: BTHWANI_COLORS.successSubtle,
          badgeText: BTHWANI_COLORS.onSuccess,
          glowOne: BTHWANI_COLORS.successSubtle,
          glowTwo: BTHWANI_COLORS.surfaceOverlay25,
        };
      default:
        return {
          surface: BTHWANI_COLORS.dangerTint,
          border: BTHWANI_COLORS.dangerDark,
          onSurface: BTHWANI_COLORS.dangerDark,
          subtext: BTHWANI_COLORS.redShort,
          badgeBg: BTHWANI_COLORS.surfaceOverlay95,
          badgeBorder: BTHWANI_COLORS.dangerTint,
          badgeText: BTHWANI_COLORS.dangerDark,
          glowOne: BTHWANI_COLORS.surfaceOverlay25,
          glowTwo: BTHWANI_COLORS.dangerTint,
        };
    }
  };

  const getContactMethodText = (
    contactMethod?: SndRequest['contactMethod']
  ) => {
    if (contactMethod === 'in_app') return t('surfaces.داخل_التطبيق');
    if (contactMethod === 'whatsapp') return t('surfaces.واتساب');
    if (contactMethod === 'phone') return t('surfaces.اتصال_هاتفي');
    return 'غير محدد';
  };

  const getBudgetText = (budget?: string) => {
    if (!budget) return null;
    if (budget === 'under_1000') return t('surfaces.أقل_من_1000_ريال');
    if (budget === '1000_5000') return t('surfaces.1000_5000_ريال');
    if (budget === '5000_10000') return t('surfaces.5000_10000_ريال');
    if (budget === 'over_10000') return t('surfaces.أكثر_من_10000_ريال');
    return budget;
  };

  const getTimelineText = (timeline?: string) => {
    if (!timeline) return null;
    if (timeline === 'urgent') return t('surfaces.عاجل_خلال_أسبوع');
    if (timeline === 'soon') return t('surfaces.قريب_خلال_شهر');
    if (timeline === 'flexible') return t('surfaces.مرن_لا_يوجد_موعد_محدد');
    return timeline;
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
      if (diffMinutes < 1) return t('surfaces.snd.request_get.l307_ar_1');
      if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
      if (diffMinutes < 1440) return `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
      return `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
    } catch {
      return timestamp;
    }
  };

  if (state === 'content' && requestData) {
    const statusTheme = getStatusTheme(requestData.status);
    const detailItems = [
      requestData.location
        ? {
            key: 'location',
            label: t('surfaces.snd.request_get.l341_ar_1'),
            value: requestData.location,
          }
        : null,
      requestData.preferredTime
        ? {
            key: 'preferredTime',
            label: t('surfaces.snd.request_get.l348_ar_1'),
            value: requestData.preferredTime,
          }
        : null,
      {
        key: 'urgency',
        label: t('surfaces.snd.request_get.l354_ar_1'),
        value: getUrgencyText(requestData.urgency),
      },
      requestData.contactMethod
        ? {
            key: 'contact',
            label: 'وسيلة التواصل',
            value: `${getContactMethodText(requestData.contactMethod)}${requestData.contactInfo ? ` - ${requestData.contactInfo}` : ''}`,
          }
        : null,
      getBudgetText(requestData.budget)
        ? {
            key: 'budget',
            label: t('surfaces.snd.request_get.l374_ar_1'),
            value: getBudgetText(requestData.budget) as string,
          }
        : null,
      getTimelineText(requestData.timeline)
        ? {
            key: 'timeline',
            label: t('surfaces.snd.request_get.l386_ar_1'),
            value: getTimelineText(requestData.timeline) as string,
          }
        : null,
    ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;

    return (
      <ScreenWrapper state='content'>
        <ScrollView
          style={styles.container}
          contentContainerStyle={scrollContentContainerStyle}
        >
          <ScreenHeader
            title={t('surfaces.snd.request_get.l321_ar_1')}
            subtitle={`#${requestData.requestId}`}
          />

          <View style={styles.statusCard}>
            <View
              style={[
                styles.statusCardHero,
                {
                  backgroundColor: statusTheme.surface,
                  borderColor: statusTheme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.statusCardGlowPrimary,
                  { backgroundColor: statusTheme.glowOne },
                ]}
              />
              <View
                style={[
                  styles.statusCardGlowSecondary,
                  { backgroundColor: statusTheme.glowTwo },
                ]}
              />

              <View style={[styles.statusHeroTopRow, directionStyle]}>
                <View style={styles.statusHeroIdentityRow}>
                  <View
                    style={[
                      styles.statusHeroServiceOrb,
                      {
                        backgroundColor: SND_NEUTRAL_SURFACE,
                        borderColor: SND_NEUTRAL_BORDER,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>
                      {getServiceMark(requestData.serviceName)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusHeroBadge,
                      {
                        backgroundColor: statusTheme.badgeBg,
                        borderColor: statusTheme.badgeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusHeroBadgeText,
                        { color: statusTheme.badgeText },
                      ]}
                    >
                      {getStatusText(requestData.status)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusHeroRequestIdPill,
                    {
                      backgroundColor: statusTheme.badgeBg,
                      borderColor: statusTheme.badgeBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusHeroRequestIdText,
                      { color: statusTheme.badgeText },
                    ]}
                  >
                    #{requestData.requestId}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.serviceType,
                  textAlignStartStyle,
                  { color: statusTheme.onSurface },
                ]}
              >
                {requestData.serviceName}
              </Text>
              <Text
                style={[
                  styles.statusHeroSubtitle,
                  textAlignStartStyle,
                  { color: statusTheme.subtext },
                ]}
              >
                هذا هو الملخص الواضح لطلبك الآن: الحالة الحالية، وقت الإنشاء،
                وأهم التفاصيل التي سيُبنى عليها التنفيذ لاحقًا.
              </Text>

              <View style={[styles.statusHeroFactsRow, directionStyle]}>
                <View
                  style={[
                    styles.statusHeroFact,
                    { backgroundColor: statusTheme.badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusHeroFactValue,
                      { color: statusTheme.onSurface },
                    ]}
                  >
                    {formatTimestamp(requestData.createdAt)}
                  </Text>
                  <Text
                    style={[
                      styles.statusHeroFactLabel,
                      { color: statusTheme.subtext },
                    ]}
                  >
                    وقت الإنشاء
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusHeroFact,
                    { backgroundColor: statusTheme.badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusHeroFactValue,
                      { color: statusTheme.onSurface },
                    ]}
                  >
                    {getUrgencyText(requestData.urgency)}
                  </Text>
                  <Text
                    style={[
                      styles.statusHeroFactLabel,
                      { color: statusTheme.subtext },
                    ]}
                  >
                    الأولوية
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusHeroFact,
                    { backgroundColor: statusTheme.badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusHeroFactValue,
                      { color: statusTheme.onSurface },
                    ]}
                  >
                    {requestData.serviceName}
                  </Text>
                  <Text
                    style={[
                      styles.statusHeroFactLabel,
                      { color: statusTheme.subtext },
                    ]}
                  >
                    فئة الخدمة
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={[styles.sectionTitle, textAlignStartStyle]}>
              {t('surfaces.snd.request_get.l336_ar_1')}
            </Text>
            <View style={styles.descriptionCard}>
              <Text style={[styles.descriptionLabel, textAlignStartStyle]}>
                وصف الطلب
              </Text>
              <Text style={[styles.description, textAlignStartStyle]}>
                {requestData.description}
              </Text>
            </View>

            <View style={styles.detailGrid}>
              {detailItems.map(item => (
                <View key={item.key} style={styles.detailInfoCard}>
                  <Text style={[styles.detailInfoLabel, textAlignStartStyle]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.detailInfoValue, textAlignStartStyle]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {requestData.status === 'pending' && (
            <View style={styles.actionsCard}>
              <Text style={[styles.actionsTitle, textAlignStartStyle]}>
                الإجراء المتاح الآن
              </Text>
              <Text style={[styles.actionsSubtitle, textAlignStartStyle]}>
                الطلب ما زال في حالة انتظار، لذلك يبقى الإلغاء هو الإجراء الوحيد
                هنا. ستبقى داخل شاشة التفاصيل نفسها بعد التنفيذ أو الفشل.
              </Text>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  submittingCancel && styles.actionButtonDisabled,
                ]}
                onPress={handleCancelRequest}
                disabled={submittingCancel}
                accessibilityRole='button'
                accessibilityLabel='إلغاء الطلب الآن'
                accessibilityHint='يبقيك داخل شاشة التفاصيل مع رسالة صريحة عند النجاح أو الفشل'
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>
                  {submittingCancel ? 'جاري الإلغاء...' : 'إلغاء الطلب الآن'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('SndRequests')}
            accessibilityRole='button'
            accessibilityLabel='العودة إلى سجل الطلبات'
            accessibilityHint='يعيدك إلى شاشة السجل دون فقدان الطلبات الأخرى'
            hitSlop={SND_INTERACTIVE_HIT_SLOP}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>
              {t('surfaces.snd.back_to_requests')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  const failureCopy = failureKind
    ? getRequestDetailFailureCopy(failureKind, networkError)
    : null;
  const shouldRetryFailure = isSndRetriableFailure(failureKind);

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_تفاصيل_إبداء_الاهتمام')}
      errorMessage={
        failureCopy?.body ||
        networkError ||
        t('surfaces.فشل_في_تحميل_تفاصيل_إبداء_الاهتمام')
      }
      errorActionText={
        shouldRetryFailure ? 'إعادة المحاولة' : 'العودة إلى الطلبات'
      }
      onErrorAction={shouldRetryFailure ? handleRetry : handleBackToRequests}
      screenName='auto_snd_request_get'
      operationName='snd_request_get'
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
  requestId: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  statusCard: {
    margin: BTHWANI_SPACING.lg,
  },
  statusCardHero: {
    position: 'relative',
    overflow: 'hidden',
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  statusCardGlowPrimary: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: BTHWANI_RADIUS.full,
    top: -56,
    left: -36,
  },
  statusCardGlowSecondary: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: BTHWANI_RADIUS.full,
    bottom: -28,
    right: -18,
  },
  statusHeroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  statusHeroIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  statusHeroServiceOrb: {
    width: 44,
    height: 44,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
  },
  statusHeroBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: BTHWANI_BORDER.hairline,
  },
  statusHeroBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  statusHeroRequestIdPill: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: BTHWANI_BORDER.hairline,
  },
  statusHeroRequestIdText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  serviceType: {
    marginTop: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
    minWidth: 0,
  },
  statusHeroSubtitle: {
    marginTop: BTHWANI_SPACING.xs,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeightPx.sm,
  },
  statusHeroFactsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  statusHeroFact: {
    flex: 1,
    minWidth: 110,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  statusHeroFactValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  statusHeroFactLabel: {
    marginTop: 2,
    fontSize: typography.fontSize.xs,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginStart: BTHWANI_SPACING.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  requestTime: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  detailsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  descriptionCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
    marginBottom: BTHWANI_SPACING.md,
  },
  descriptionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    lineHeight: typography.lineHeightPx.md,
    minWidth: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  detailGrid: {
    gap: BTHWANI_SPACING.sm,
  },
  detailInfoCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
  },
  detailInfoLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  detailInfoValue: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: typography.lineHeightPx.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.textMuted,
    minWidth: 84,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
    minWidth: 0,
  },
  urgencyBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  actionsCard: {
    margin: BTHWANI_SPACING.lg,
    marginTop: 0,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
  },
  actionsTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  actionsSubtitle: {
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.sm,
  },
  cancelButton: {
    backgroundColor: BTHWANI_COLORS.dangerDark,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  cancelText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.md,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.outline,
  },
  backText: {
    color: semanticRoles.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
});

export default auto_snd_request_get;

