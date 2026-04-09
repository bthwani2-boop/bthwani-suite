// SND Home Screen - Service Discovery Hub
// Surface: app-client | Service: snd
// §30 States: Loading / Error / Empty / Success / Content
// §UX-SUPREME-001: Primary service hub with embedded create and secondary history follow-up

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
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import {
  AppText,
  ScreenState,
  ScreenWrapper,
  semanticRoles,
} from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  BTHWANI_TYPOGRAPHY,
} from '@bthwani/ui-kit';
import {
  SndInterestMiniDetailsSheet,
  SndSwipeableCard,
  type InterestData,
  type SndInterest,
} from './components';
import { SndServiceDetailWithFormSheet } from './components/SndServiceDetailWithFormSheet';
import { buildSndHomeMockServices } from '../../hooks';
import {
  SND_CLIENT_CATEGORIES_VAR_KEY,
  SND_SERVICE_ENABLED_VAR_KEY,
  buildDefaultSndClientCategories,
  filterEnabledSndClientCategories,
  mergeSndClientCategories,
  parseRuntimeBoolean,
} from '../../hooks/sndClientCatalog';
import {
  classifySndRuntimeFailure,
  isSndRetriableFailure,
  sanitizeSndRuntimeMessage,
  type SndRuntimeFailureKind,
} from './sndRuntimeFailures';
import {
  SND_INTERACTIVE_HIT_SLOP,
  SND_MIN_TOUCH_TARGET,
  useSndReducedMotion,
} from './sndAccessibility';

const typography = BTHWANI_TYPOGRAPHY;

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;
const SND_NEUTRAL_SURFACE = '#f5f7fa';
const SND_NEUTRAL_SURFACE_ACTIVE = '#eef2f6';
const SND_NEUTRAL_BORDER = '#d8e3ef';
const SND_NEUTRAL_BORDER_ACTIVE = '#c7d2de';
const SND_NEUTRAL_TEXT = '#243b53';

function getServiceMark(label?: string | null) {
  const normalized = label?.trim();
  return normalized ? normalized.charAt(0) : 'س';
}

interface auto_snd_home_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

function getHomeHistoryFailureCopy(
  kind: SndRuntimeFailureKind,
  t: TranslateFn,
  fallback?: string | null
) {
  switch (kind) {
    case 'offline':
      return {
        eyebrow: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.offline.eyebrow'
        ),
        title: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.offline.title'
        ),
        body: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.offline.body'
        ),
      };
    case 'forbidden':
      return {
        eyebrow: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.forbidden.eyebrow'
        ),
        title: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.forbidden.title'
        ),
        body: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.forbidden.body'
        ),
      };
    case 'config':
      return {
        eyebrow: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.config.eyebrow'
        ),
        title: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.config.title'
        ),
        body: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.config.body'
        ),
      };
    case 'upstream':
      return {
        eyebrow: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.upstream.eyebrow'
        ),
        title: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.upstream.title'
        ),
        body: sanitizeSndRuntimeMessage(
          fallback,
          t(
            'snd.app-client.mobile.auto_snd_home_get.historyError.upstream.body'
          )
        ),
      };
    default:
      return {
        eyebrow: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.default.eyebrow'
        ),
        title: t(
          'snd.app-client.mobile.auto_snd_home_get.historyError.default.title'
        ),
        body: sanitizeSndRuntimeMessage(
          fallback,
          t('snd.app-client.mobile.auto_snd_home_get.historyError.default.body')
        ),
      };
  }
}

export const auto_snd_home_get: React.FC<auto_snd_home_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const {
    alignItemsStartStyle,
    textAlignStartStyle,
    resolveGridVisualOrder,
    resolveMobileReadingLayout,
    currentLanguage,
    t,
  } = useDirection();
  const { width } = useWindowDimensions();
  const reduceMotion = useSndReducedMotion();
  const [state, setState] = useState<ScreenState>('loading');

  const defaultServicesList = useMemo(
    () => buildSndHomeMockServices(t, currentLanguage),
    [currentLanguage, t]
  );

  const [interests, setInterests] = useState<SndInterest[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<SndInterest | null>(
    null
  );
  const [miniDetailsVisible, setMiniDetailsVisible] = useState(false);

  // Services state
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [visibleServiceIndex, setVisibleServiceIndex] = useState(0);
  const [serviceDetailWithFormVisible, setServiceDetailWithFormVisible] =
    useState(false);
  const [isServiceDisabled, setIsServiceDisabled] = useState(false);

  // Network and connection state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [historyFailureKind, setHistoryFailureKind] =
    useState<SndRuntimeFailureKind | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent infinite loops
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);
  const lastCreatedRequestIdRef = useRef<string | null>(null);
  const gridEntrance = useRef(new Animated.Value(0)).current;
  const activePulse = useRef(new Animated.Value(0)).current;

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

  const loadInterests = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) return;

      if (maxRetriesReachedRef.current && !isRetry) {
        setInterests([]);
        setState('content');
        setIsOffline(true);
        setHistoryFailureKind('offline');
        setNetworkError(t('surfaces.snd.failed_to_load_interests'));
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
          setHistoryFailureKind(null);
          setIsOffline(false);
        }

        const baseUrl = getBaseUrl();
        if (!baseUrl) {
          setInterests([]);
          setState('content');
          setHistoryFailureKind('config');
          setNetworkError(
            'عنوان API الخاص بسند غير مضبوط حاليًا، لذلك أبقينا الواجهة على وضع الاكتشاف فقط.'
          );
          setIsOffline(false);
          return;
        }
        const url = `${baseUrl}/api/snd/home?limit=20`;

        const response = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setInterests([]);
            setHistoryFailureKind('forbidden');
            setNetworkError(
              'لا تملك صلاحية قراءة سجل طلبات سند من هذه الشاشة الآن.'
            );
            setState('content');
            setIsOffline(false);
            return;
          }

          if (response.status === 404) {
            setInterests([]);
            setNetworkError(null);
            setHistoryFailureKind(null);
            setState('content');
            setIsOffline(false);
            return;
          }

          const failureKind = classifySndRuntimeFailure({
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
          setInterests([]);
          setHistoryFailureKind(failureKind);
          setNetworkError(errorMessage);
          setState('content');
          setIsOffline(false);
          return;
        }

        setIsOffline(false);
        setNetworkError(null);
        setHistoryFailureKind(null);
        setRetryCount(0);

        const json = await response.json();

        if (!json?.success) {
          setInterests([]);
          setHistoryFailureKind('upstream');
          setNetworkError(
            typeof json?.error === 'string' && json.error.length > 0
              ? json.error
              : t('surfaces.snd.failed_to_load_interests')
          );
          setState('content');
          setIsOffline(false);
          return;
        }

        // Transform API response to SndInterest format
        const requestsData = json?.data?.requests || json?.data || [];

        const transformedInterests: SndInterest[] = requestsData.map(
          (req: any) => {
            const metadata = req.metadata || {};
            return {
              id: req.id || req.requestId || `REQ-${Date.now()}-${0}`,
              requestId: req.requestId || req.id || `REQ-${Date.now()}`,
              serviceType:
                metadata.serviceType ||
                metadata.service_type ||
                t('surfaces.snd.home_get.l306_ar_1'),
              serviceName:
                metadata.serviceName ||
                metadata.service_name ||
                metadata.serviceType ||
                t('surfaces.snd.home_get.l311_ar_1'),
              description:
                metadata.description ||
                req.description ||
                t('snd.app-client.mobile.auto_snd_home_get.noDescriptionLabel'),
              status: (
                metadata.status ||
                req.status ||
                'pending'
              ).toLowerCase() as SndInterest['status'],
              location:
                metadata.location ||
                req.location ||
                t('surfaces.snd.home_get.l321_ar_1'),
              preferredTime: metadata.preferredTime || metadata.preferred_time,
              urgency: (metadata.urgency || 'medium') as
                | 'low'
                | 'medium'
                | 'high',
              contactMethod:
                metadata.contactMethod || metadata.contact_method || 'in_app',
              contactInfo: metadata.contactInfo || metadata.contact_info,
              budget: metadata.budget,
              timeline: metadata.timeline,
              createdAt:
                req.createdAt || metadata.createdAt || new Date().toISOString(),
              updatedAt: req.updatedAt || metadata.updatedAt,
            };
          }
        );

        setInterests(transformedInterests);
        hasLoadedRef.current = true;
        setNetworkError(null);
        setHistoryFailureKind(null);
        setState('content');
      } catch (error: any) {
        const failureKind = classifySndRuntimeFailure({ error });
        const isNetworkErr = failureKind === 'offline';

        setInterests([]);
        setState('content');
        setHistoryFailureKind(failureKind);
        if (isNetworkErr) {
          setRetryCount(prev => Math.min(prev + 1, MAX_RETRIES));
          maxRetriesReachedRef.current = retryCount + 1 >= MAX_RETRIES;
          setIsOffline(true);
          setNetworkError(t('surfaces.snd.failed_to_load_interests'));
        } else {
          setIsOffline(false);
          setNetworkError(
            error instanceof Error && error.message.length > 0
              ? error.message
              : t('surfaces.snd.failed_to_load_interests')
          );
        }
      } finally {
        isLoadingRef.current = false;
      }
    },
    [retryCount, t]
  );

  // Load available services
  const loadAvailableServices = useCallback(async () => {
    const defaultCategories = buildDefaultSndClientCategories(
      t,
      currentLanguage
    );

    try {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        setIsServiceDisabled(false);
        setAvailableServices(defaultServicesList);
        return;
      }

      const [serviceFlagResponse, categoriesResponse] = await Promise.all([
        fetchWithRetry(
          `${baseUrl}/api/infra/runtime-vars/${encodeURIComponent(
            SND_SERVICE_ENABLED_VAR_KEY
          )}/resolve`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        ),
        fetchWithRetry(
          `${baseUrl}/api/infra/runtime-vars/${encodeURIComponent(
            SND_CLIENT_CATEGORIES_VAR_KEY
          )}/resolve`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        ),
      ]);

      let serviceEnabledValue: unknown = true;
      if (serviceFlagResponse.ok) {
        const serviceFlagData = await serviceFlagResponse.json();
        serviceEnabledValue = serviceFlagData?.value;
      }

      let categoryConfigValue: unknown = undefined;
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        categoryConfigValue = categoriesData?.value;
      }

      const serviceEnabled = parseRuntimeBoolean(serviceEnabledValue, true);
      const mergedCategories = filterEnabledSndClientCategories(
        mergeSndClientCategories(
          defaultCategories,
          categoryConfigValue,
          t,
          currentLanguage
        )
      );

      setIsServiceDisabled(!serviceEnabled);
      setAvailableServices(
        serviceEnabled
          ? mergedCategories.map(category => ({
              id: category.id,
              name: category.name,
              icon: '',
              description: category.description,
            }))
          : []
      );
    } catch (error) {
      setIsServiceDisabled(false);
      setAvailableServices(defaultServicesList);
    }
  }, [currentLanguage, defaultServicesList, fetchWithRetry, t]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadInterests();
      loadAvailableServices();
    }
  }, []); // Remove loadInterests from dependencies to avoid infinite loop

  useEffect(() => {
    if (availableServices.length === 0) {
      if (visibleServiceIndex !== 0) {
        setVisibleServiceIndex(0);
      }
      return;
    }

    if (visibleServiceIndex >= availableServices.length) {
      setVisibleServiceIndex(0);
    }
  }, [availableServices.length, visibleServiceIndex]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    setHistoryFailureKind(null);
    loadInterests(true);
  }, [loadInterests]);

  // Stats calculation
  const stats = useMemo(() => {
    const active = interests.filter(
      i => i.status === 'pending' || i.status === 'in_progress'
    ).length;
    const total = interests.length;
    const completed = interests.filter(i => i.status === 'completed').length;
    return { active, total, completed };
  }, [interests]);

  const featuredInterest = useMemo(() => {
    if (interests.length === 0) {
      return null;
    }

    const sorted = [...interests].sort((left, right) => {
      const leftDate = new Date(left.updatedAt || left.createdAt).getTime();
      const rightDate = new Date(right.updatedAt || right.createdAt).getTime();
      return rightDate - leftDate;
    });

    return (
      sorted.find(
        interest =>
          interest.status === 'pending' || interest.status === 'in_progress'
      ) || sorted[0]
    );
  }, [interests]);

  const hasHistory = stats.total > 0;
  const readingLayout = useMemo(
    () => resolveMobileReadingLayout(width),
    [resolveMobileReadingLayout, width]
  );
  const isStackedSectionHeader =
    readingLayout.sectionHeaderLayout === 'stacked';
  const orderedAvailableServices = useMemo(
    () => resolveGridVisualOrder(availableServices, readingLayout.gridColumns),
    [availableServices, readingLayout.gridColumns, resolveGridVisualOrder]
  );
  const activeServiceId = availableServices[visibleServiceIndex]?.id ?? null;

  useEffect(() => {
    if (availableServices.length === 0) {
      gridEntrance.setValue(0);
      return;
    }

    if (reduceMotion) {
      gridEntrance.setValue(1);
      return;
    }

    gridEntrance.setValue(0);
    Animated.timing(gridEntrance, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [availableServices.length, gridEntrance, reduceMotion]);

  useEffect(() => {
    if (availableServices.length === 0) {
      activePulse.setValue(0);
      return;
    }

    if (reduceMotion) {
      activePulse.setValue(0);
      return;
    }

    activePulse.setValue(0);
    Animated.sequence([
      Animated.timing(activePulse, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(activePulse, {
        toValue: 0,
        duration: 220,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    activePulse,
    availableServices.length,
    reduceMotion,
    visibleServiceIndex,
  ]);

  // Handle interest creation
  const handleCreateInterest = useCallback(
    async (data: InterestData) => {
      try {
        const baseUrl = getRequiredBaseUrl();
        const url = `${baseUrl}/api/snd/requests`;

        const requestBody = {
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
        };

        const response = await rawFetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.error ||
              errorData?.message ||
              `HTTP ${response.status}: فشل في إرسال إبداء الاهتمام`
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

        // Refresh interests list
        await loadInterests(true);

        Alert.alert(
          t('snd.app-client.mobile.auto_snd_home_get.successSubmitMessage'),
          t('snd.app-client.mobile.auto_snd_home_get.successSubmitMessage')
        );
      } catch (error: any) {
        throw error;
      }
    },
    [loadInterests]
  );

  // Handle swipe left (view details)
  const handleSwipeLeft = useCallback((interest: SndInterest) => {
    setSelectedInterest(interest);
    setMiniDetailsVisible(true);
  }, []);

  // Handle card press
  const handleCardPress = useCallback((interest: SndInterest) => {
    setSelectedInterest(interest);
    setMiniDetailsVisible(true);
  }, []);

  // Status helpers
  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return t('surfaces.قيد_الانتظار_اهتمام');
      case 'in_progress':
        return t('surfaces.جاري_المعالجة');
      case 'completed':
        return t('surfaces.snd.home_get.l574_ar_1');
      case 'cancelled':
        return t('surfaces.snd.home_get.l576_ar_1');
      default:
        return status;
    }
  }, []);

  const formatTimestamp = useCallback(
    (timestamp: string) => {
      if (!timestamp) return '';
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor(
          (now.getTime() - date.getTime()) / 60000
        );
        if (diffMinutes < 1) return t('surfaces.snd.home_get.time_just_now');
        if (diffMinutes < 60)
          return t('surfaces.snd.time_ago.minutes', { count: diffMinutes });
        if (diffMinutes < 1440)
          return t('surfaces.snd.time_ago.hours', {
            count: Math.floor(diffMinutes / 60),
          });
        return t('surfaces.snd.time_ago.days', {
          count: Math.floor(diffMinutes / 1440),
        });
      } catch {
        return timestamp;
      }
    },
    [t]
  );

  // Render interest card
  const renderInterestCard = useCallback(
    ({ item }: { item: SndInterest }) => {
      return (
        <SndSwipeableCard
          interest={item}
          onPress={() => handleCardPress(item)}
          onSwipeLeft={handleSwipeLeft}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text
                  style={[styles.serviceName, textAlignStartStyle]}
                  numberOfLines={1}
                >
                  {item.serviceName}
                </Text>
                <Text style={[styles.requestId, textAlignStartStyle]}>
                  #{item.requestId}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>

            <Text
              style={[styles.description, textAlignStartStyle]}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.createdAt)}
              </Text>
            </View>
          </View>
        </SndSwipeableCard>
      );
    },
    [handleCardPress, handleSwipeLeft, formatTimestamp]
  );

  // Handle service selection - Open unified sheet
  const handleServiceSelect = useCallback((service: any) => {
    setSelectedService(service);
    setServiceDetailWithFormVisible(true);
  }, []);

  // Render services grid — compact paged grid without vertical scroll
  const renderServicesDeck = useCallback(() => {
    if (isServiceDisabled) {
      return (
        <View
          style={[
            styles.servicesDeckSection,
            styles.serviceDisabledPanel,
            styles.serviceDisabledPanelStart,
          ]}
        >
          <View style={styles.serviceDisabledBadge}>
            <Text style={styles.serviceDisabledBadgeText}>الخدمة متوقفة</Text>
          </View>
          <Text style={[styles.serviceDisabledTitle, textAlignStartStyle]}>
            سند غير متاح حاليًا في واجهة العميل
          </Text>
          <Text style={[styles.serviceDisabledText, textAlignStartStyle]}>
            تم تعطيل الخدمة من لوحة التحكم، لذلك أُخفيت الفئات وإجراءات الطلب
            إلى أن تتم إعادة التفعيل.
          </Text>
        </View>
      );
    }

    if (availableServices.length === 0) return null;

    const totalServices = availableServices.length;
    const accentColor = SND_NEUTRAL_TEXT;
    const gridTranslateY = gridEntrance.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    });
    const activeScale = activePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.035],
    });
    const activeGlowOpacity = activePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.16, 0.26],
    });

    return (
      <View style={styles.servicesDeckSection}>
        <View
          style={[
            styles.servicesDeckHeaderRow,
            hasHistory
              ? styles.servicesDeckHeaderRowSpread
              : styles.servicesDeckHeaderRowCompact,
            isStackedSectionHeader ? styles.servicesDeckHeaderRowStacked : null,
          ]}
        >
          <View
            style={[
              styles.servicesDeckHeaderLead,
              hasHistory ? styles.servicesDeckHeaderLeadFill : null,
              isStackedSectionHeader
                ? styles.servicesDeckHeaderLeadStacked
                : null,
            ]}
          >
            <View style={styles.servicesDeckHeaderCopy}>
              <AppText style={styles.servicesSectionEyebrow}>
                {t('snd.app-client.mobile.auto_snd_home_get.sectionEyebrow')}
              </AppText>
              <AppText style={styles.servicesDeckTitle}>
                {t('snd.app-client.mobile.auto_snd_home_get.sectionTitle')}
              </AppText>
            </View>
            <View
              style={[
                styles.servicesDeckCountPill,
                {
                  backgroundColor: accentColor + '14',
                  borderColor: accentColor + '30',
                },
              ]}
            >
              <AppText
                style={[styles.servicesDeckCountText, { color: accentColor }]}
                textAlign='center'
              >
                {totalServices}
              </AppText>
            </View>
          </View>

          {hasHistory ? (
            <View
              style={[
                styles.servicesDeckHeaderActions,
                styles.servicesDeckHeaderActionsEnd,
              ]}
            >
              <TouchableOpacity
                style={styles.servicesDeckSecondaryAction}
                onPress={() => handleNavigate('SndRequests')}
                accessibilityRole='button'
                accessibilityLabel={t(
                  'snd.app-client.mobile.auto_snd_home_get.openHistoryLabel'
                )}
                accessibilityHint={t(
                  'snd.app-client.mobile.auto_snd_home_get.openHistoryHint'
                )}
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.85}
              >
                <AppText
                  style={styles.servicesDeckSecondaryActionText}
                  textAlign='center'
                >
                  {t('snd.app-client.mobile.auto_snd_home_get.openHistory')}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <Animated.View
          style={[
            styles.servicesGrid,
            {
              opacity: gridEntrance,
              transform: [{ translateY: gridTranslateY }],
            },
          ]}
        >
          {orderedAvailableServices.map(service => {
            const isActive = service.id === activeServiceId;
            const isStartAligned = readingLayout.serviceCardAlign === 'start';

            return (
              <Animated.View
                key={service.id}
                style={[
                  styles.serviceGridTileShell,
                  { width: `${readingLayout.gridItemWidthPercent}%` },
                  isActive ? { transform: [{ scale: activeScale }] } : null,
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.serviceGridTile,
                    { minHeight: readingLayout.cardMinHeight },
                    {
                      borderColor: isActive
                        ? SND_NEUTRAL_BORDER_ACTIVE
                        : SND_NEUTRAL_BORDER,
                      backgroundColor: isActive
                        ? SND_NEUTRAL_SURFACE_ACTIVE
                        : '#ffffff',
                    },
                  ]}
                  onPress={() => {
                    const serviceIndex = availableServices.findIndex(
                      candidate => candidate.id === service.id
                    );
                    setVisibleServiceIndex(
                      serviceIndex >= 0 ? serviceIndex : 0
                    );
                    handleServiceSelect(service);
                  }}
                  accessibilityRole='button'
                  accessibilityLabel={service.name}
                  accessibilityHint='يفتح نموذج الطلب الرئيسي لهذه الفئة'
                  accessibilityState={{ selected: isActive }}
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                  activeOpacity={0.88}
                >
                  {isActive ? (
                    <Animated.View
                      pointerEvents='none'
                      style={[
                        styles.serviceGridTileGlow,
                        {
                          backgroundColor: SND_NEUTRAL_BORDER_ACTIVE,
                          opacity: activeGlowOpacity,
                        },
                      ]}
                    />
                  ) : null}

                  <View style={styles.serviceGridTileTopRow}>
                    <View
                      style={[
                        styles.serviceGridIconOrb,
                        {
                          width: readingLayout.serviceCardIconSize,
                          height: readingLayout.serviceCardIconSize,
                        },
                        {
                          backgroundColor: isActive
                            ? SND_NEUTRAL_SURFACE_ACTIVE
                            : SND_NEUTRAL_SURFACE,
                          borderColor: isActive
                            ? SND_NEUTRAL_BORDER_ACTIVE
                            : SND_NEUTRAL_BORDER,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700' }}>
                        {getServiceMark(service.name)}
                      </Text>
                    </View>

                    {isActive && readingLayout.serviceCardShowStatusPill ? (
                      <View
                        style={[
                          styles.serviceGridStatusPill,
                          { backgroundColor: '#ffffffd9' },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.serviceGridStatusText,
                            { color: SND_NEUTRAL_TEXT },
                          ]}
                          textAlign='center'
                        >
                          {t('snd.app-client.mobile.auto_snd_home_get.serviceReady')}
                        </AppText>
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={[styles.serviceGridCopyBlock, alignItemsStartStyle]}
                  >
                    <Text
                      style={[
                        styles.serviceGridName,
                        textAlignStartStyle,
                        isStartAligned ? styles.serviceGridNameStart : null,
                      ]}
                      numberOfLines={readingLayout.primaryTextLines}
                    >
                      {service.name}
                    </Text>
                    <AppText
                      style={[
                        styles.serviceGridSubtitle,
                        textAlignStartStyle,
                        isStartAligned ? styles.serviceGridSubtitleStart : null,
                      ]}
                      numberOfLines={readingLayout.secondaryTextLines}
                    >
                      {isActive
                        ? t(
                            'snd.app-client.mobile.auto_snd_home_get.servicePrimaryPath'
                          )
                        : t(
                            'snd.app-client.mobile.auto_snd_home_get.serviceAvailableNow'
                          )}
                    </AppText>
                  </View>

                  <View style={styles.serviceGridFooterRow}>
                    <View
                      style={[
                        styles.serviceGridFooterCopy,
                        alignItemsStartStyle,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.serviceGridFooterText,
                          { color: SND_NEUTRAL_TEXT },
                        ]}
                      >
                        {isActive
                          ? t(
                              'snd.app-client.mobile.auto_snd_home_get.serviceStartRequest'
                            )
                          : t(
                              'snd.app-client.mobile.auto_snd_home_get.serviceSelectCategory'
                            )}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.serviceGridSelectedDot,
                        {
                          backgroundColor: isActive
                            ? SND_NEUTRAL_TEXT
                            : SND_NEUTRAL_BORDER,
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {hasHistory ? (
          <View style={styles.inlineHistoryBar}>
            <View style={styles.inlineHistoryCopy}>
              <AppText style={[styles.inlineHistoryTitle, textAlignStartStyle]}>
                {stats.active > 0
                  ? t(
                      'snd.app-client.mobile.auto_snd_home_get.historyActiveRequests',
                      { count: stats.active }
                    )
                  : t('snd.app-client.mobile.auto_snd_home_get.historyPrevious')}
              </AppText>
              {featuredInterest ? (
                <AppText
                  style={[styles.inlineHistoryHint, textAlignStartStyle]}
                  numberOfLines={1}
                >
                  {`${t('snd.app-client.mobile.auto_snd_home_get.historyLatestPrefix')} ${featuredInterest.serviceName}`}
                </AppText>
              ) : null}
            </View>

            {featuredInterest ? (
              <TouchableOpacity
                style={styles.inlineHistoryAction}
                onPress={() =>
                  handleNavigate('SndRequestGet', {
                    requestId: featuredInterest.requestId,
                  })
                }
                accessibilityRole='button'
                accessibilityLabel={t(
                  'snd.app-client.mobile.auto_snd_home_get.historyLatestLabel'
                )}
                accessibilityHint={t(
                  'snd.app-client.mobile.auto_snd_home_get.historyLatestHint'
                )}
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.82}
              >
                <AppText style={styles.inlineHistoryActionText} textAlign='center'>
                  {t('snd.app-client.mobile.auto_snd_home_get.historyLatestButton')}
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }, [
    availableServices,
    activePulse,
    featuredInterest,
    gridEntrance,
    handleServiceSelect,
    handleNavigate,
    hasHistory,
    isServiceDisabled,
    readingLayout.cardMinHeight,
    readingLayout.serviceCardAlign,
    readingLayout.serviceCardIconSize,
    readingLayout.serviceCardShowStatusPill,
    readingLayout.gridItemWidthPercent,
    readingLayout.gridColumns,
    readingLayout.primaryTextLines,
    readingLayout.secondaryTextLines,
    stats.active,
    t,
    alignItemsStartStyle,
    textAlignStartStyle,
    visibleServiceIndex,
  ]);

  const renderRequestsPanel = useCallback(() => {
    const hasInterestLoadError = Boolean(historyFailureKind);

    if (!hasInterestLoadError) {
      return null;
    }

    const failureCopy = getHomeHistoryFailureCopy(historyFailureKind!, t, networkError);
    const showRetryAction = isSndRetriableFailure(historyFailureKind);

    return (
      <View
        style={[
          styles.activityPanel,
          styles.activityPanelError,
          styles.activityPanelStart,
        ]}
      >
        <AppText style={[styles.activityPanelEyebrow, textAlignStartStyle]}>
          {failureCopy.eyebrow}
        </AppText>
        <AppText style={[styles.activityPanelTitle, textAlignStartStyle]}>
          {failureCopy.title}
        </AppText>
        <AppText
          style={[styles.activityPanelText, textAlignStartStyle]}
          numberOfLines={2}
        >
          {failureCopy.body}
        </AppText>
        {showRetryAction ? (
          <TouchableOpacity
            style={styles.activityPanelPrimaryAction}
            onPress={handleRetry}
            accessibilityRole='button'
            accessibilityLabel={t('common.retry')}
            accessibilityHint={t(
              'snd.app-client.mobile.auto_snd_home_get.historyRetryHint'
            )}
            hitSlop={SND_INTERACTIVE_HIT_SLOP}
            activeOpacity={0.85}
          >
            <AppText style={styles.activityPanelPrimaryActionText} textAlign='center'>
              {t('common.retry')}
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [
    handleRetry,
    historyFailureKind,
    networkError,
    t,
    textAlignStartStyle,
  ]);

  // Always use 'content' state and handle empty manually
  if (state === 'content' || state === 'empty') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={styles.fixedViewport}>
            {renderServicesDeck()}
            {renderRequestsPanel()}
          </View>

          {/* Unified Service Detail with Form Sheet */}
          <SndServiceDetailWithFormSheet
            visible={serviceDetailWithFormVisible}
            service={selectedService}
            onClose={() => {
              setServiceDetailWithFormVisible(false);
              setSelectedService(null);
            }}
            onSubmit={handleCreateInterest}
            onSuccess={() => {
              const createdRequestId = lastCreatedRequestIdRef.current;
              lastCreatedRequestIdRef.current = null;
              setServiceDetailWithFormVisible(false);
              setSelectedService(null);
              if (createdRequestId) {
                handleNavigate('SndRequestGet', {
                  requestId: createdRequestId,
                });
                return;
              }
              loadInterests(true);
            }}
          />

          {/* Mini Details Sheet */}
          <SndInterestMiniDetailsSheet
            visible={miniDetailsVisible}
            onClose={() => {
              setMiniDetailsVisible(false);
              setSelectedInterest(null);
            }}
            interest={selectedInterest}
            onViewFull={interest => {
              handleNavigate('SndRequestGet', {
                requestId: interest.requestId,
              });
            }}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.snd.loading_interests')}
      errorMessage={networkError || t('surfaces.snd.failed_to_load_interests')}
      onErrorAction={handleRetry}
      screenName='auto_snd_home_get'
      operationName='snd_home_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  fixedViewport: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  servicesDeckSection: {
    flex: 1,
    minHeight: 0,
  },
  servicesDeckHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.xs,
  },
  servicesDeckHeaderRowSpread: {
    justifyContent: 'space-between',
  },
  servicesDeckHeaderRowCompact: {
    justifyContent: 'flex-start',
  },
  servicesDeckHeaderRowStacked: {
    alignItems: 'stretch',
  },
  servicesDeckHeaderLead: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    alignItems: 'center',
    minWidth: 0,
  },
  servicesDeckHeaderLeadFill: {
    flex: 1,
  },
  servicesDeckHeaderLeadStacked: {
    alignItems: 'flex-start',
  },
  servicesDeckHeaderCopy: {
    minWidth: 0,
    flexShrink: 1,
  },
  servicesDeckHeaderActions: {
    gap: BTHWANI_SPACING.xs,
  },
  servicesDeckHeaderActionsEnd: {
    alignItems: 'flex-end',
  },
  servicesSectionEyebrow: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTA,
    marginBottom: 4,
  },
  servicesDeckTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  servicesDeckCountPill: {
    minWidth: 62,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: BTHWANI_BORDER.hairline,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#eff4fa',
    borderColor: '#d6e1ef',
  },
  servicesDeckCountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  servicesDeckSecondaryAction: {
    minHeight: SND_MIN_TOUCH_TARGET,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d6e1ef',
    backgroundColor: '#ffffff',
    paddingHorizontal: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicesDeckSecondaryActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: BTHWANI_SPACING.sm,
    columnGap: BTHWANI_SPACING.sm,
  },
  serviceGridTileShell: {
    width: '31%',
  },
  serviceGridTile: {
    minHeight: 114,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  serviceGridTileGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BTHWANI_RADIUS.xl,
  },
  serviceGridTileTopRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.xs,
  },
  serviceGridIconOrb: {
    width: 42,
    height: 42,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
  },
  serviceGridStatusPill: {
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serviceGridStatusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  serviceGridCopyBlock: {
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
    marginTop: BTHWANI_SPACING.xs,
    justifyContent: 'center',
    gap: 4,
  },
  serviceGridName: {
    minWidth: 0,
    width: '100%',
    alignSelf: 'stretch',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
    lineHeight: typography.lineHeightPx.sm,
    textAlign: 'center',
  },
  serviceGridNameStart: {
    lineHeight: 22,
  },
  serviceGridSubtitle: {
    minWidth: 0,
    width: '100%',
    alignSelf: 'stretch',
    fontSize: 10,
    color: '#57708b',
    textAlign: 'center',
  },
  serviceGridSubtitleStart: {
    lineHeight: 16,
  },
  serviceDisabledPanel: {
    justifyContent: 'center',
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
    backgroundColor: '#ffffff',
    paddingHorizontal: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.lg,
  },
  serviceDisabledPanelStart: {
    alignItems: 'flex-start',
  },
  serviceDisabledBadge: {
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#fff1e8',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#ffd0b8',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    marginBottom: BTHWANI_SPACING.sm,
  },
  serviceDisabledBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#b65b1c',
  },
  serviceDisabledTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  serviceDisabledText: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.sm,
  },
  serviceGridFooterRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  serviceGridFooterCopy: {
    flex: 1,
    minWidth: 0,
  },
  serviceGridFooterText: {
    minWidth: 0,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  serviceGridSelectedDot: {
    width: 8,
    height: 8,
    borderRadius: BTHWANI_RADIUS.full,
  },
  inlineHistoryBar: {
    flexDirection: 'row',
    marginTop: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d8e3ef',
    backgroundColor: '#ffffff',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  inlineHistoryCopy: {
    flex: 1,
  },
  inlineHistoryTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  inlineHistoryHint: {
    marginTop: 4,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  inlineHistoryAction: {
    minHeight: SND_MIN_TOUCH_TARGET,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs + 4,
    backgroundColor: '#173f73',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineHistoryActionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  servicesDeckSignalsRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  servicesDeckSignalPill: {
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#f4f8fc',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d7e4f1',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 6,
  },
  servicesDeckSignalText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: '#23466f',
  },
  servicesDeckHint: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.xs,
  },
  activityPanel: {
    backgroundColor: '#ffffff',
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  activityPanelError: {
    borderColor: semanticRoles.stateError.icon + '30',
  },
  activityPanelStart: {
    alignItems: 'flex-start',
  },
  activityPanelEyebrow: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTA,
    marginBottom: 4,
  },
  activityPanelHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  activityPanelCopy: {
    flex: 1,
  },
  activityPanelTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  activityPanelText: {
    marginTop: 4,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.xs,
  },
  activityPanelPrimaryAction: {
    marginTop: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    minHeight: SND_MIN_TOUCH_TARGET,
    paddingVertical: BTHWANI_SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityPanelPrimaryActionText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  cardContent: {
    padding: BTHWANI_SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.sm,
  },
  serviceName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    minWidth: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  requestId: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
    lineHeight: typography.lineHeightPx.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  location: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
  },
});

export default auto_snd_home_get;

