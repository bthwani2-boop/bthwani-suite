// ESF Home Screen - Smart Feed Design (Modern Mobile Pattern) — RTL/LTR SAFE + FIXED DIMENSIONS
// Surface: app-client | Service: esf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// §UX-SUPREME-001: Single Hub Screen, FAB for create, Bottom Sheets for details/management
// ENHANCED: Direction-safe layout using useDirection, semantic spacing using BTHWANI_SPACING tokens

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
import { Ionicons } from '@expo/vector-icons';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { type BloodType } from './components/EsfBloodTypePickerSheet';
import { EsfBottomSheet } from './components/EsfBottomSheet';
import { EsfRequestMiniDetailsSheet } from './components/EsfRequestMiniDetailsSheet';
import {
  EsfRequestQuickComposeSheet,
  type RequestData,
} from './components/EsfRequestQuickComposeSheet';
import { EsfSwipeableCard } from './components/EsfSwipeableCard';
import { EsfMyRequestsSheet } from './components/EsfMyRequestsSheet';
import {
  EsfDonationEligibilitySheet,
  DEFAULT_ESF_DONATION_ELIGIBILITY_COPY,
  DEFAULT_ESF_DONATION_ELIGIBILITY_ITEMS,
  type EsfDonationEligibilityCopy,
} from './components/EsfDonationEligibilitySheet';
import { EsfCriticalRequestPopup } from './components/EsfCriticalRequestPopup';
import { EsfHomeSearchBar } from './components/home/EsfHomeSearchBar';
import { EsfRequestCardContent } from './components/home/EsfRequestCardContent';
import { EsfHomeEmptyState } from './components/home/EsfHomeEmptyState';
import { EsfHomeOfflineState } from './components/home/EsfHomeOfflineState';
import { EsfHomeDisabledState } from './components/home/EsfHomeDisabledState';
import { filterAndSortRequests } from './utils/esfFilters';
import type { EsfRequest, EsfUserProfile } from '../../uiTypes';
import {
  createEsfHomeFixturePack,
  type EsfHomeFixtureInsights,
} from '../../fixtures/homeFeed';
import { loadExpoLocation } from '../../../dsh/loadExpoLocation';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000; // Increased for network reliability // 15 seconds (increased to allow for network retries)
const SERVICE_FLAGS_TIMEOUT = 5000; // 5 seconds (non-critical, increased for reliability)
const DEFAULT_RESPONSE_WINDOW_MINUTES = 8;

type EsfHomeSurfaceInsights = EsfHomeFixtureInsights & {
  isDemo: boolean;
  demoLabel?: string;
};

type EsfHomeMode = 'donor' | 'requester';
type DonorSettingPanel = 'bloodType' | 'distance' | null;
type DonorSmartFilter = 'nearest' | 'urgent';
type RequesterSmartFilter = 'nearest' | 'fastest' | 'topRated';

const DONOR_BLOOD_TYPE_OPTIONS: BloodType[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];
const DONOR_DISTANCE_PRESETS = [5, 10, 20] as const;

function parseDonationEligibilityRules(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(item => String(item).trim()).filter(Boolean);
  }

  if (typeof raw === 'string') {
    return raw
      .split(/\r?\n/g)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseDonationEligibilityCopy(
  raw: unknown
): EsfDonationEligibilityCopy {
  const source =
    raw && typeof raw === 'object'
      ? (raw as Partial<Record<keyof EsfDonationEligibilityCopy, unknown>>)
      : {};

  return {
    title:
      typeof source.title === 'string' && source.title.trim().length > 0
        ? source.title.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.title,
    subtitle:
      typeof source.subtitle === 'string' && source.subtitle.trim().length > 0
        ? source.subtitle.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.subtitle,
    note:
      typeof source.note === 'string' && source.note.trim().length > 0
        ? source.note.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.note,
    confirmLabel:
      typeof source.confirmLabel === 'string' &&
      source.confirmLabel.trim().length > 0
        ? source.confirmLabel.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.confirmLabel,
    cancelLabel:
      typeof source.cancelLabel === 'string' &&
      source.cancelLabel.trim().length > 0
        ? source.cancelLabel.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.cancelLabel,
    activatingLabel:
      typeof source.activatingLabel === 'string' &&
      source.activatingLabel.trim().length > 0
        ? source.activatingLabel.trim()
        : DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.activatingLabel,
  };
}

function parsePositiveCount(raw: unknown, fallback: number = 0): number {
  const count = Number(raw);
  if (!Number.isFinite(count)) {
    return fallback;
  }
  return Math.max(0, Math.round(count));
}

function getUrgencyRank(urgency: EsfRequest['urgency']): number {
  switch (urgency) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

function parseNumericLabel(value: string | undefined): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function formatUnitsLabel(units: number | undefined): string {
  const safeUnits = Math.max(0, Math.round(Number(units) || 0));
  if (safeUnits === 1) {
    return '1 وحدة';
  }
  return `${safeUnits} وحدات`;
}

function formatBloodTypeLabel(bloodType: string | undefined): string {
  if (!bloodType) {
    return '—';
  }

  return `\u2066${bloodType}\u2069`;
}

export type EsfHomeFocusParam =
  | 'compose'
  | 'myRequests'
  | 'search'
  | 'settings';

interface auto_esf_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route?: { params?: { esfFocus?: EsfHomeFocusParam } };
  shellSearchVisible?: boolean;
  shellSearchQuery?: string;
  onShellSearchOpen?: () => void;
  shellMyRequestsSignal?: number;
  shellAccountSignal?: number;
  onEsfModeChange?: (mode: EsfHomeMode) => void;
}

export const auto_esf_home_get: React.FC<auto_esf_home_getProps> = ({
  onNavigate,
  navigation,
  route,
  shellSearchVisible,
  shellSearchQuery,
  onShellSearchOpen,
  shellMyRequestsSignal,
  shellAccountSignal,
  onEsfModeChange,
}) => {
  const { t, isRTL } = useI18n();
  const { rowDirection } = useDirection();
  const { height } = useWindowDimensions();
  const debugLog = useCallback((...args: unknown[]) => {
    // Keep dev visibility without triggering user-facing error overlays.
    if (__DEV__) console.log(...args);
  }, []);
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EsfRequest | null>(
    null
  );
  const [miniDetailsVisible, setMiniDetailsVisible] = useState(false);
  const [quickComposeVisible, setQuickComposeVisible] = useState(false);
  const [myRequestsVisible, setMyRequestsVisible] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );
  const [lastAcceptedRequest, setLastAcceptedRequest] =
    useState<EsfRequest | null>(null);

  // Notification system
  const [unreadRequestsIds, setUnreadRequestsIds] = useState<Set<string>>(
    new Set()
  );
  const [criticalPopupRequest, setCriticalPopupRequest] =
    useState<EsfRequest | null>(null);
  const [shownCriticalRequests, setShownCriticalRequests] = useState<
    Set<string>
  >(new Set());

  // Availability toggle - controls whether user receives matching requests
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [availabilityEligibilityVisible, setAvailabilityEligibilityVisible] =
    useState(false);
  const [availabilityConfirming, setAvailabilityConfirming] = useState(false);
  const [donationEligibilityItems, setDonationEligibilityItems] = useState<
    string[]
  >([...DEFAULT_ESF_DONATION_ELIGIBILITY_ITEMS]);
  const [donationEligibilityCopy, setDonationEligibilityCopy] =
    useState<EsfDonationEligibilityCopy>({
      ...DEFAULT_ESF_DONATION_ELIGIBILITY_COPY,
    });
  const [homeInsights, setHomeInsights] =
    useState<EsfHomeSurfaceInsights | null>(null);

  // Service flags - check if ESF service is enabled
  const [serviceEnabled, setServiceEnabled] = useState<boolean | null>(null); // null = checking, true = enabled, false = disabled
  const [serviceFlagsError, setServiceFlagsError] = useState<string | null>(
    null
  );

  // Network and connection state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent infinite loops
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Silent logging flags (to prevent console noise)
  const [hasLoggedServiceFlagsError, setHasLoggedServiceFlagsError] =
    useState(false);
  const [hasLoggedNetworkError, setHasLoggedNetworkError] = useState(false);

  // Filters
  const [filterBloodType, setFilterBloodType] = useState<BloodType | undefined>(
    'O-'
  );
  const [filterDistance, setFilterDistance] = useState<number>(10);
  const [openDonorSetting, setOpenDonorSetting] =
    useState<DonorSettingPanel>(null);
  const [distanceCustomActive, setDistanceCustomActive] = useState(false);
  const [customDistanceDraft, setCustomDistanceDraft] = useState('10');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [feedSearchExpanded, setFeedSearchExpanded] = useState(false);
  const [homeMode, setHomeMode] = useState<EsfHomeMode>('donor');
  const [demoRequesterTick, setDemoRequesterTick] = useState(0);
  const [demoPreviewActive, setDemoPreviewActive] = useState(false);
  const [demoPreviewLabel, setDemoPreviewLabel] = useState<string | null>(null);
  const [headerSettingsVisible, setHeaderSettingsVisible] = useState(false);
  const [serviceLocationLabel, setServiceLocationLabel] = useState('');
  const [serviceLocationSyncing, setServiceLocationSyncing] = useState(false);
  const [donorSmartFilter, setDonorSmartFilter] =
    useState<DonorSmartFilter>('nearest');
  const [requesterSmartFilter, setRequesterSmartFilter] =
    useState<RequesterSmartFilter>('nearest');
  const hasShellSearchControl =
    typeof shellSearchVisible === 'boolean' &&
    typeof shellSearchQuery === 'string';
  const activeFeedSearchQuery = hasShellSearchControl
    ? shellSearchVisible
      ? shellSearchQuery
      : ''
    : feedSearchQuery;

  const handleShellNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      const nav = navigation?.navigate as
        | ((s: string, p?: Record<string, unknown>) => void)
        | undefined;
      if (nav) {
        nav(screen, params);
      } else if (onNavigate) {
        (onNavigate as (s: string, p?: Record<string, unknown>) => void)(
          screen,
          params
        );
      }
    },
    [navigation, onNavigate]
  );

  // User profile (should come from user context/API)
  const [userProfile, setUserProfile] = useState<EsfUserProfile>({
    bloodType: filterBloodType,
    location: { lat: 24.7136, lng: 46.6753 }, // Riyadh coordinates
    maxDistance: filterDistance,
  });

  // API data - loaded from backend
  const [allRequests, setAllRequests] = useState<EsfRequest[]>([]);
  const [myRequests, setMyRequests] = useState<EsfRequest[]>([]);

  const activateDemoPreview = useCallback(() => {
    const pack = createEsfHomeFixturePack('PACK_A_HAPPY');
    setAllRequests(pack.requests);
    setMyRequests(pack.myRequests);
    setDemoRequesterTick(0);
    setDemoPreviewActive(true);
    setDemoPreviewLabel(pack.labelAr);
    setHomeInsights({
      ...pack.insights,
      isDemo: true,
      demoLabel: pack.labelAr,
    });
    setState('content');
  }, []);

  // Check service flags on startup (RULE_OPERATIONAL_EXCELLENCE §4.5)
  // Silent check - failures are non-blocking (default to enabled)
  useEffect(() => {
    let isMounted = true;
    const MAX_SERVICE_FLAGS_RETRIES = 2; // Only 2 retries for service flags (non-critical)

    const checkServiceFlags = async (attempt: number = 0): Promise<void> => {
      if (!isMounted) return;

      try {
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/config/service-flags`;

        // Shorter timeout for service flags (non-critical)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          if (!controller.signal.aborted) {
            controller.abort();
          }
        }, SERVICE_FLAGS_TIMEOUT);

        let response: Response;
        try {
          response = await rawFetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }

        if (!isMounted) return;

        if (!response.ok) {
          // If endpoint doesn't exist yet (404) or server error, default to enabled
          if (response.status === 404 && attempt < MAX_SERVICE_FLAGS_RETRIES) {
            // Retry once for 404 (endpoint might be starting up)
            setTimeout(() => checkServiceFlags(attempt + 1), 2000);
            return;
          }
          // Default to enabled on any error (silent - no console logs)
          if (isMounted) {
            setServiceEnabled(true);
            setIsOffline(false); // Not offline if we got a response
          }
          return;
        }

        const data = await response.json();
        if (!isMounted) return;

        const esfEnabled = data?.services?.esf?.enabled ?? true;
        setServiceEnabled(esfEnabled);
        setIsOffline(false);
        setHasLoggedServiceFlagsError(false); // Reset on success

        if (!esfEnabled) {
          setServiceFlagsError(
            t('esf.app-client.mobile.auto_esf_home_get.serviceDisabledMessage')
          );
        } else {
          setServiceFlagsError(null);
        }
      } catch (error) {
        if (!isMounted) return;

        const isNetworkError =
          error instanceof Error &&
          (error.name === 'AbortError' ||
            error.name === 'TypeError' ||
            error.message.includes('Network request failed') ||
            error.message.includes('timeout') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Failed to fetch'));

        if (isNetworkError && attempt < MAX_SERVICE_FLAGS_RETRIES) {
          // Retry with exponential backoff (silent - no logs)
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          setTimeout(() => checkServiceFlags(attempt + 1), delay);
          return;
        }

        // On final error, default to enabled (COMPLETELY SILENT - no console logs)
        if (isMounted) {
          setServiceEnabled(true);
          // Don't set offline here - service flags check is non-critical
        }
      }
    };

    // Initial check (silent - no console logs for normal operation)
    checkServiceFlags();

    // Refresh service flags every 60 seconds (TTL) - only if online
    const interval = setInterval(() => {
      if (!isOffline && isMounted) {
        checkServiceFlags();
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOffline]);

  useEffect(() => {
    let isMounted = true;

    const loadDonationEligibilityRules = async () => {
      try {
        const response = await rawFetch(`${getBaseUrl()}/api/esf/home`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok || !isMounted) {
          return;
        }

        const json = await response.json();
        const parsedRules = parseDonationEligibilityRules(
          json?.data?.donor_eligibility_rules
        );
        const parsedCopy = parseDonationEligibilityCopy(
          json?.data?.donor_eligibility_copy
        );
        const nextInsights: EsfHomeSurfaceInsights = {
          activeRequests: parsePositiveCount(json?.data?.active_requests, 0),
          readyDonors: parsePositiveCount(json?.data?.available_responders, 0),
          responseWindowMinutes: parsePositiveCount(
            json?.data?.response_window_minutes,
            DEFAULT_RESPONSE_WINDOW_MINUTES
          ),
          isDemo: false,
        };

        if (isMounted && parsedRules.length > 0) {
          setDonationEligibilityItems(parsedRules);
        }

        if (isMounted) {
          setDonationEligibilityCopy(parsedCopy);
        }

        if (isMounted) {
          setHomeInsights(prev => {
            if (
              prev?.isDemo &&
              nextInsights.activeRequests === 0 &&
              nextInsights.readyDonors === 0
            ) {
              return prev;
            }
            return nextInsights;
          });
        }
      } catch (error) {
        if (__DEV__) {
          console.log('[ESF Home] eligibility rules fallback active');
        }
      }
    };

    void loadDonationEligibilityRules();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update donor settings in the local profile model
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      bloodType: filterBloodType,
      maxDistance: filterDistance,
    }));
  }, [filterBloodType, filterDistance]);

  useEffect(() => {
    setCustomDistanceDraft(String(filterDistance));
  }, [filterDistance]);

  useEffect(() => {
    onEsfModeChange?.(homeMode);
  }, [homeMode, onEsfModeChange]);

  useEffect(() => {
    if (
      !demoPreviewActive ||
      homeMode !== 'requester' ||
      myRequests.length <= 1
    ) {
      return;
    }

    const interval = setInterval(() => {
      setDemoRequesterTick(prev => prev + 1);
    }, 9000);

    return () => clearInterval(interval);
  }, [demoPreviewActive, homeMode, myRequests.length]);

  const filteredRequests = useMemo(() => {
    if (!isAvailableNow) {
      return [];
    }

    return filterAndSortRequests(allRequests, userProfile, 'donor');
  }, [allRequests, userProfile, isAvailableNow]);

  const displayRequests = useMemo(() => {
    const q = activeFeedSearchQuery.trim().toLowerCase();
    if (!q) return filteredRequests;
    return filteredRequests.filter(r => {
      const hospital = (r.hospitalName || '').toLowerCase();
      const loc = (r.location || '').toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        loc.includes(q) ||
        hospital.includes(q) ||
        r.bloodType.toLowerCase().includes(q)
      );
    });
  }, [activeFeedSearchQuery, filteredRequests]);

  const donorVisibleRequests = useMemo(() => {
    const items = [...displayRequests];
    if (donorSmartFilter === 'urgent') {
      items.sort((left, right) => {
        const urgencyGap =
          getUrgencyRank(right.urgency) - getUrgencyRank(left.urgency);
        if (urgencyGap !== 0) {
          return urgencyGap;
        }
        return (
          (left.distance ?? Number.POSITIVE_INFINITY) -
          (right.distance ?? Number.POSITIVE_INFINITY)
        );
      });
      return items;
    }

    items.sort((left, right) => {
      const distanceGap =
        (left.distance ?? Number.POSITIVE_INFINITY) -
        (right.distance ?? Number.POSITIVE_INFINITY);
      if (distanceGap !== 0) {
        return distanceGap;
      }
      return getUrgencyRank(right.urgency) - getUrgencyRank(left.urgency);
    });
    return items;
  }, [displayRequests, donorSmartFilter]);

  // Deep-link / legacy route: open hub sections from route params
  useEffect(() => {
    const focus = route?.params?.esfFocus;
    if (focus === 'compose') {
      setHomeMode('requester');
      setSelectedRequest(null);
      setQuickComposeVisible(true);
    } else if (focus === 'myRequests') {
      setHomeMode('requester');
      setMyRequestsVisible(true);
    } else if (focus === 'settings') {
      setHeaderSettingsVisible(true);
    } else if (focus === 'search') {
      setHomeMode('donor');
      if (hasShellSearchControl) {
        onShellSearchOpen?.();
      } else {
        setFeedSearchExpanded(true);
      }
    }
  }, [hasShellSearchControl, onShellSearchOpen, route?.params?.esfFocus]);

  useEffect(() => {
    if ((shellMyRequestsSignal || 0) > 0) {
      setHomeMode('requester');
      setMyRequestsVisible(true);
    }
  }, [shellMyRequestsSignal]);

  useEffect(() => {
    if ((shellAccountSignal || 0) > 0) {
      setHeaderSettingsVisible(true);
    }
  }, [shellAccountSignal]);

  useEffect(() => {
    if (hasShellSearchControl && shellSearchVisible) {
      setHomeMode('donor');
    }
  }, [hasShellSearchControl, shellSearchVisible]);

  useEffect(() => {
    if (feedSearchExpanded) {
      setHomeMode('donor');
    }
  }, [feedSearchExpanded]);

  useEffect(() => {
    if (quickComposeVisible || myRequestsVisible) {
      setHomeMode('requester');
    }
  }, [myRequestsVisible, quickComposeVisible]);

  // Check for critical requests that need popup (<2km + critical) — donors only
  useEffect(() => {
    if (!isAvailableNow || criticalPopupRequest) return;

    const criticalRequest = filteredRequests.find(req => {
      const isCritical = req.urgency === 'critical';
      const isClose = req.distance !== undefined && req.distance < 2;
      const notShownBefore = !shownCriticalRequests.has(req.id);
      const isPending = req.status === 'pending';

      return isCritical && isClose && notShownBefore && isPending;
    });

    if (criticalRequest) {
      setCriticalPopupRequest(criticalRequest);
      setShownCriticalRequests(prev => new Set([...prev, criticalRequest.id]));
    }
  }, [
    filteredRequests,
    isAvailableNow,
    criticalPopupRequest,
    shownCriticalRequests,
  ]);

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
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const loadData = useCallback(
    async (isRetry: boolean = false) => {
      // Prevent multiple simultaneous loads
      if (isLoadingRef.current) {
        return;
      }

      // If max retries reached, don't retry (unless explicitly called as retry)
      if (maxRetriesReachedRef.current && !isRetry) {
        setAllRequests([]);
        setMyRequests([]);
        setState('content');
        return;
      }

      // If max retries reached and this is a retry, reset the flag to allow one more attempt
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
          setHasLoggedNetworkError(false); // Reset on new attempt
        }

        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/esf/requests?limit=100&offset=0`;

        // Load all requests from API with retry logic
        let requestsResponse: Response;
        try {
          requestsResponse = await fetchWithRetry(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
        } catch (fetchError) {
          throw fetchError;
        }

        if (!requestsResponse.ok) {
          // Check for authentication errors
          if (
            requestsResponse.status === 401 ||
            requestsResponse.status === 403
          ) {
            const errorText = await requestsResponse.text();
            setNetworkError(
              t('esf.app-client.mobile.auto_esf_home_get.signInRequiredMessage')
            );
            setState('error');
            setIsOffline(false);
            return;
          }

          // Check for SERVICE_DISABLED response (503)
          if (requestsResponse.status === 503) {
            try {
              const errorData = await requestsResponse.json();
              if (errorData?.error_code === 'SERVICE_DISABLED') {
                setServiceEnabled(false);
                setServiceFlagsError(
                  t('esf.app-client.mobile.auto_esf_home_get.serviceDisabledAlt')
                );
                setState('error');
                setIsOffline(false); // Service disabled is not offline
                return;
              }
            } catch (parseError) {
              // If JSON parsing fails, still treat 503 as service disabled
              setServiceEnabled(false);
              setServiceFlagsError(
                t('esf.app-client.mobile.auto_esf_home_get.serviceDisabledAlt2')
              );
              setState('error');
              setIsOffline(false);
              return;
            }
          }

          // For other errors, try to get error message
          let errorMessage = `HTTP ${requestsResponse.status}`;
          try {
            const errorData = await requestsResponse.json();
            errorMessage =
              errorData?.error || errorData?.message || errorMessage;
          } catch (parseError) {
            const errorText = await requestsResponse.text();
          }
          throw new Error(errorMessage);
        }

        // Success - clear offline state and reset logging flags
        setIsOffline(false);
        setNetworkError(null);
        setRetryCount(0);
        setHasLoggedNetworkError(false); // Reset on success

        const requestsJson = await requestsResponse.json();

        if (!requestsJson?.success) {
          throw new Error(requestsJson?.error || 'فشل في تحميل الطلبات');
        }

        // Transform API response to EsfRequest format
        const requestsData =
          requestsJson?.data?.requests || requestsJson?.data || [];
        const transformedRequests: EsfRequest[] = requestsData.map(
          (req: any) => {
            // Calculate distance if location available
            let distance: number | undefined;
            if (
              userProfile.location &&
              req.coordinates?.lat &&
              req.coordinates?.lng
            ) {
              const lat1 = userProfile.location.lat;
              const lng1 = userProfile.location.lng;
              const lat2 = req.coordinates.lat;
              const lng2 = req.coordinates.lng;
              // Simple distance calculation (Haversine would be better)
              distance =
                Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) *
                111; // Approximate km
            } else if (
              userProfile.location &&
              req.location?.lat &&
              req.location?.lng
            ) {
              const lat1 = userProfile.location.lat;
              const lng1 = userProfile.location.lng;
              const lat2 = req.location.lat;
              const lng2 = req.location.lng;
              distance =
                Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) *
                111;
            }

            // Format timestamp
            let timestamp = t('esf.app-client.mobile.auto_esf_home_get.nowLabel');
            if (req.created_at || req.createdAt) {
              const created = new Date(req.created_at || req.createdAt);
              const now = new Date();
              const diffMinutes = Math.floor(
                (now.getTime() - created.getTime()) / 60000
              );
              if (diffMinutes < 1)
                timestamp = t(
                  'esf.app-client.mobile.auto_esf_home_get.nowLabelAlt'
                );
              else if (diffMinutes < 60) timestamp = `منذ ${diffMinutes} دقيقة`;
              else if (diffMinutes < 1440)
                timestamp = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
              else timestamp = `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
            }

            // Extract blood type from medical_info or emergency_type
            let bloodType = 'O+';
            if (req.medical_info?.blood_type) {
              bloodType = req.medical_info.blood_type;
            } else if (req.blood_type) {
              bloodType = req.blood_type;
            } else if (
              req.emergency_type === 'BLOOD_DONATION' &&
              req.description
            ) {
              // Try to extract from description
              const match = req.description.match(/فصيلة\s+([ABO][+-])/i);
              if (match) bloodType = match[1];
            }

            // Extract units
            let units = 1;
            if (req.medical_info?.units) {
              units = req.medical_info.units;
            } else if (req.units) {
              units = req.units;
            }

            // Extract hospital name
            let hospitalName = t(
              'esf.app-client.mobile.auto_esf_home_get.hospitalLabel'
            );
            if (req.medical_info?.hospital_name) {
              hospitalName = req.medical_info.hospital_name;
            } else if (req.hospital_name) {
              hospitalName = req.hospital_name;
            } else if (req.location?.name) {
              hospitalName = req.location.name;
            }

            // Extract location address
            let location = t(
              'esf.app-client.mobile.auto_esf_home_get.locationNotSpecified'
            );
            if (req.location?.address) {
              location = req.location.address;
            } else if (req.location) {
              location =
                typeof req.location === 'string'
                  ? req.location
                  : t(
                      'esf.app-client.mobile.auto_esf_home_get.locationNotSpecifiedAlt'
                    );
            }

            const rawResponsesCount =
              req.responses_count ??
              req.responsesCount ??
              req.matched_donors_count ??
              req.matchedDonorsCount ??
              req.matched_donors ??
              req.matchedDonors;
            const matchedDonorsRaw =
              req.matched_donors ??
              req.matchedDonors ??
              req.matches ??
              req.assigned_responders;
            const matchedDonors =
              Array.isArray(matchedDonorsRaw) && matchedDonorsRaw.length > 0
                ? matchedDonorsRaw.map((donor: any, index: number) => {
                    const donorDistanceRaw =
                      donor.distance ?? donor.distance_km ?? donor.distanceKm;
                    const donorEtaRaw =
                      donor.eta ?? donor.estimated_time ?? donor.estimatedTime;

                    return {
                      id:
                        donor.match_id ||
                        donor.id ||
                        donor.responder_id ||
                        `MATCH-${index + 1}`,
                      name:
                        donor.name ||
                        donor.donor_name ||
                        donor.responder_name ||
                        `متبرع ${index + 1}`,
                      distance:
                        typeof donorDistanceRaw === 'number'
                          ? `${donorDistanceRaw.toFixed(1)} كم`
                          : typeof donorDistanceRaw === 'string' &&
                              donorDistanceRaw.trim().length > 0
                            ? donorDistanceRaw
                            : '—',
                      eta:
                        typeof donorEtaRaw === 'number'
                          ? `${donorEtaRaw} دقيقة`
                          : typeof donorEtaRaw === 'string' &&
                              donorEtaRaw.trim().length > 0
                            ? donorEtaRaw
                            : '—',
                      donorBloodType:
                        donor.donor_blood_type ||
                        donor.donorBloodType ||
                        donor.blood_type ||
                        donor.bloodType,
                      donorRating:
                        typeof (donor.donor_rating ?? donor.donorRating) ===
                        'number'
                          ? Number(donor.donor_rating ?? donor.donorRating)
                          : undefined,
                    };
                  })
                : undefined;
            const responsesCount =
              typeof rawResponsesCount === 'number'
                ? rawResponsesCount
                : Array.isArray(rawResponsesCount)
                  ? rawResponsesCount.length
                  : matchedDonors?.length;
            const contactMethod =
              req.medical_info?.contact_method ??
              req.contact_method ??
              req.contactPreference;
            const medicalReason =
              req.medical_info?.medical_reason ?? req.medical_reason;
            const medicalReasonLabel =
              req.medical_info?.medical_reason_label ??
              req.medical_reason_label ??
              req.medical_info?.medical_condition ??
              req.patient?.condition;
            const matchId =
              req.match_id ??
              req.matchId ??
              req.current_match_id ??
              req.currentMatchId ??
              req.my_match_id ??
              req.myMatchId ??
              req.assignment_id ??
              req.assignmentId;

            return {
              id: req.request_id || req.id || `REQ-${Date.now()}-${0}`,
              bloodType: bloodType as BloodType,
              units: units,
              status: (req.status || 'pending').toLowerCase() as
                | 'pending'
                | 'matched'
                | 'completed'
                | 'cancelled',
              isMyRequest: Boolean(
                req.is_my_request ?? req.isMyRequest ?? req.mine
              ),
              location: location,
              locationCoords:
                req.coordinates?.lat && req.coordinates?.lng
                  ? { lat: req.coordinates.lat, lng: req.coordinates.lng }
                  : req.location?.lat && req.location?.lng
                    ? { lat: req.location.lat, lng: req.location.lng }
                    : undefined,
              timestamp,
              urgency: (
                req.priority ||
                req.urgency ||
                'normal'
              ).toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
              hospitalName: hospitalName,
              patientName:
                req.medical_info?.patient_name ??
                req.patient_name ??
                req.patient?.name,
              beneficiary:
                req.medical_info?.beneficiary ?? req.beneficiary ?? 'self',
              medicalReason,
              medicalReasonLabel,
              medicalReasonNote:
                req.medical_info?.medical_reason_note ??
                req.medical_reason_note ??
                req.notes,
              contactMethod,
              matchId:
                typeof matchId === 'string' && matchId.trim().length > 0
                  ? matchId
                  : undefined,
              contactInfo:
                req.medical_info?.contact_info ??
                req.contact_info ??
                req.requester?.phone,
              distance,
              responsesCount,
              matchedDonors,
            };
          }
        );

        if (__DEV__ && transformedRequests.length === 0) {
          activateDemoPreview();
          hasLoadedRef.current = true;
          maxRetriesReachedRef.current = false;
          return;
        }

        setDemoPreviewActive(false);
        setDemoPreviewLabel(null);
        setDemoRequesterTick(0);

        setHomeInsights(prev =>
          prev && !prev.isDemo
            ? {
                ...prev,
                activeRequests:
                  prev.activeRequests > 0
                    ? prev.activeRequests
                    : transformedRequests.length,
              }
            : {
                activeRequests: transformedRequests.length,
                readyDonors: 0,
                responseWindowMinutes: DEFAULT_RESPONSE_WINDOW_MINUTES,
                isDemo: false,
              }
        );

        setAllRequests(transformedRequests);

        setMyRequests(transformedRequests.filter(r => Boolean(r.isMyRequest)));

        // Mark all current requests as unread initially
        setUnreadRequestsIds(prev => {
          const newSet = new Set(prev);
          transformedRequests.forEach((req: EsfRequest) => {
            if (req.status === 'pending') {
              newSet.add(req.id);
            }
          });
          return newSet;
        });

        // Always set to content state, even if empty (empty state will be shown)
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
      } catch (error) {
        // Handle different error types
        const isNetworkError =
          error instanceof Error &&
          (error.name === 'AbortError' ||
            error.name === 'TypeError' ||
            error.message.includes('Network request failed') ||
            error.message.includes('timeout') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Failed to fetch'));

        if (isNetworkError) {
          // IMMEDIATELY set offline and error state (no delays)
          setIsOffline(true);
          setNetworkError(
            t('esf.app-client.mobile.auto_esf_home_get.offlineMessage')
          );

          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);

          maxRetriesReachedRef.current = true;
          hasLoadedRef.current = true; // Mark as loaded to prevent further auto-loads
          // Dev UX: show fixtures when networking is disabled, to evaluate UI quality.
          if (__DEV__) {
            activateDemoPreview();
          } else {
            setDemoPreviewActive(false);
            setDemoPreviewLabel(null);
            setDemoRequesterTick(0);
            setAllRequests([]);
            setMyRequests([]);
          }
          setState('content'); // Always show content to enable UI testing
        } else {
          // Non-network error (unexpected errors - log once only)
          setIsOffline(false);
          const errorMessage =
            error instanceof Error
              ? error.message
              : t('esf.app-client.mobile.auto_esf_home_get.errorLoadMessage');
          setNetworkError(errorMessage);

          // Log non-network errors only once (these are unexpected errors)
          if (!hasLoggedNetworkError) {
            setHasLoggedNetworkError(true);
          }

          // Always show empty state for non-auth errors to enable UI testing
          if (!errorMessage.includes('401') && !errorMessage.includes('403')) {
            if (__DEV__) {
              activateDemoPreview();
            } else {
              setDemoPreviewActive(false);
              setDemoPreviewLabel(null);
              setDemoRequesterTick(0);
              setAllRequests([]);
              setMyRequests([]);
            }
            setState('content');
          } else {
            setState('error'); // Only show error for auth issues
          }
        }
      } finally {
        isLoadingRef.current = false;
      }
    },
    [activateDemoPreview, userProfile.location, serviceEnabled]
  );

  // Load data only once on mount
  useEffect(() => {
    // Only load if we haven't loaded yet and not already loading and max retries not reached
    if (
      !hasLoadedRef.current &&
      !isLoadingRef.current &&
      !maxRetriesReachedRef.current
    ) {
      loadData();
    }

    // NOTE: No loadingTimeout needed - fetchWithRetry handles timeouts via AbortController
    // REQUEST_TIMEOUT (20000ms) + retry logic will handle all timeout scenarios
    // Error state will be set by loadData error handler after all retries are exhausted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // WebSocket simulation for real-time notifications
  // In production, this would be a real WebSocket connection
  useEffect(() => {
    if (!isAvailableNow) return;

    // Simulate WebSocket connection
    const simulateNewRequest = () => {
      // Simulate receiving a new critical request every 30 seconds (for testing)
      // In production, this would come from WebSocket
      const interval = setInterval(() => {
        // Only simulate if no critical popup is currently showing
        if (!criticalPopupRequest && 0 > 0.7) {
          const newRequest: EsfRequest = {
            id: `REQ-NEW-${Date.now()}`,
            bloodType: filterBloodType || 'O-',
            units: Math.floor(0 * 3) + 1,
            status: 'pending',
            location: t('esf.app-client.mobile.auto_esf_home_get.mockLocation3'),
            locationCoords: { lat: 24.7136, lng: 46.6753 },
            timestamp: t('esf.app-client.mobile.auto_esf_home_get.nowLabelAlt2'),
            urgency: 'critical',
            hospitalName: t(
              'esf.app-client.mobile.auto_esf_home_get.mockHospital3'
            ),
            distance: 0 * 2, // Random distance < 2km for critical popup
          };

          // Add to requests
          setAllRequests(prev => [newRequest, ...prev]);

          // Mark as unread
          setUnreadRequestsIds(prev => new Set([...prev, newRequest.id]));
        }
      }, 30000); // Every 30 seconds (for testing)

      return () => clearInterval(interval);
    };

    const cleanup = simulateNewRequest();
    return cleanup;
  }, [isAvailableNow, criticalPopupRequest, filterBloodType, t]);

  // Create a safe error handler that respects max retries
  // CRITICAL: This must be defined BEFORE any early return statements to prevent React Hooks violations
  const handleErrorRetry = useCallback(() => {
    if (maxRetriesReachedRef.current) {
      // Reset flags to allow manual retry
      maxRetriesReachedRef.current = false;
      setRetryCount(0);
      loadData(true); // Pass true to indicate this is a manual retry
    } else {
      loadData(true);
    }
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset refs to allow refresh
    maxRetriesReachedRef.current = false;
    hasLoadedRef.current = false;
    setRetryCount(0);
    loadData().finally(() => setRefreshing(false));
  }, [loadData]);

  // 1-click accept action (for donors) with undo
  const handleQuickAccept = useCallback(
    async (request: EsfRequest) => {
      if (processingRequest) return;

      if (!request.matchId) {
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.errorTitle'),
          'لا يمكن تأكيد التبرع من هذه البطاقة قبل إنشاء تطابق فعلي. افتح التفاصيل أو صندوق المطابقات أولاً.'
        );
        return;
      }

      setProcessingRequest(request.id);
      setLastAcceptedRequest(request);

      // Mark as read when accepted
      setUnreadRequestsIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });

      try {
        let response: Response;
        try {
          response = await fetchWithRetry(
            `${getBaseUrl()}/api/esf/matches/${encodeURIComponent(request.matchId)}/accept`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
          );
        } catch (fetchError) {
          debugLog('[ESF Home] Accept match fetch error:', fetchError);
          throw fetchError;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || 'فشل في قبول الطلب');
        }

        // Update request status
        setAllRequests(prev =>
          prev.map(r =>
            r.id === request.id ? { ...r, status: 'matched' as const } : r
          )
        );

        // Show undo snackbar (5 seconds)
        setTimeout(() => {
          setLastAcceptedRequest(null);
        }, 5000);
      } catch (error) {
        debugLog('Failed to accept request:', error);
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.errorTitle'),
          error instanceof Error
            ? error.message
            : t('esf.app-client.mobile.auto_esf_home_get.errorAcceptMessage')
        );
        setLastAcceptedRequest(null);
      } finally {
        setProcessingRequest(null);
      }
    },
    [processingRequest, t]
  );

  // Undo last accept
  const handleUndoAccept = useCallback(() => {
    if (lastAcceptedRequest) {
      // Revert request status
      setAllRequests(prev =>
        prev.map(r =>
          r.id === lastAcceptedRequest.id
            ? { ...r, status: 'pending' as const }
            : r
        )
      );

      setLastAcceptedRequest(null);
    }
  }, [lastAcceptedRequest]);

  // Open details in mini bottom sheet
  const handleViewDetails = useCallback((request: EsfRequest) => {
    setSelectedRequest(request);
    setMiniDetailsVisible(true);

    // Mark as read when viewing details
    setUnreadRequestsIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(request.id);
      return newSet;
    });
  }, []); // Empty deps is correct - this callback doesn't depend on any props or state

  const handleOpenCompose = useCallback(() => {
    setSelectedRequest(null);
    setQuickComposeVisible(true);
  }, []);

  const activeMyRequest =
    myRequests.find(
      request => request.status === 'pending' || request.status === 'matched'
    ) ||
    myRequests[0] ||
    null;
  const requesterDemoPool = useMemo(
    () =>
      myRequests.filter(
        request => request.status === 'pending' || request.status === 'matched'
      ),
    [myRequests]
  );

  const visiblePendingCount = donorVisibleRequests.filter(
    request => request.status === 'pending'
  ).length;

  const previewRequestCount = height >= 880 ? 2 : 1;
  const previewRequests = donorVisibleRequests.slice(0, previewRequestCount);
  const requesterPreviewDonorCount = height >= 880 ? 3 : 2;
  const hiddenOpportunityCount = Math.max(
    donorVisibleRequests.length - previewRequests.length,
    0
  );
  const isCompactHeight = height < 760;
  const readyDonorsCount = homeInsights?.readyDonors ?? 0;
  const responseWindowMinutes =
    homeInsights?.responseWindowMinutes ?? DEFAULT_RESPONSE_WINDOW_MINUTES;
  const closestOpportunityLabel =
    previewRequests[0]?.distance !== undefined
      ? `${previewRequests[0].distance.toFixed(1)} كم`
      : `${responseWindowMinutes} د`;
  const requesterDisplayRequest =
    demoPreviewActive && requesterDemoPool.length > 0
      ? requesterDemoPool[demoRequesterTick % requesterDemoPool.length]
      : activeMyRequest;
  const activeMyRequestDonors = requesterDisplayRequest?.matchedDonors ?? [];
  const requesterVisibleDonors = useMemo(() => {
    const items = [...activeMyRequestDonors];
    switch (requesterSmartFilter) {
      case 'fastest':
        items.sort((left, right) => {
          const etaGap =
            parseNumericLabel(left.eta) - parseNumericLabel(right.eta);
          if (etaGap !== 0) {
            return etaGap;
          }
          return (
            parseNumericLabel(left.distance) - parseNumericLabel(right.distance)
          );
        });
        return items;
      case 'topRated':
        items.sort((left, right) => {
          const ratingGap = (right.donorRating ?? 0) - (left.donorRating ?? 0);
          if (ratingGap !== 0) {
            return ratingGap;
          }
          return (
            parseNumericLabel(left.distance) - parseNumericLabel(right.distance)
          );
        });
        return items;
      default:
        items.sort((left, right) => {
          const distanceGap =
            parseNumericLabel(left.distance) -
            parseNumericLabel(right.distance);
          if (distanceGap !== 0) {
            return distanceGap;
          }
          return parseNumericLabel(left.eta) - parseNumericLabel(right.eta);
        });
        return items;
    }
  }, [activeMyRequestDonors, requesterSmartFilter]);
  const requesterPreviewDonors = requesterVisibleDonors.slice(
    0,
    requesterPreviewDonorCount
  );
  const requesterMatchedDonorsCount =
    requesterVisibleDonors.length > 0
      ? requesterVisibleDonors.length
      : Number(requesterDisplayRequest?.responsesCount ?? 0);
  const nearestRequesterDonor = requesterPreviewDonors[0] ?? null;
  const requesterQueueRequests = useMemo(
    () =>
      myRequests
        .filter(
          request =>
            request.id !== requesterDisplayRequest?.id &&
            (request.status === 'pending' || request.status === 'matched')
        )
        .slice(0, 2),
    [myRequests, requesterDisplayRequest?.id]
  );
  const donorReadinessTitle = isAvailableNow
    ? 'مستعد للتبرع'
    : 'الجاهزية متوقفة';
  const donorReadinessHint = isAvailableNow
    ? 'تستقبل الآن طلبات الدم المطابقة لك.'
    : 'فعّل الاستقبال لعرض أول طلب مطابق.';
  const donorReadinessBadge = isAvailableNow
    ? visiblePendingCount > 0
      ? `${visiblePendingCount} طلبات دم مطابقة`
      : 'بانتظار طلب مطابق'
    : 'فعّل الجاهزية أولًا';
  const isDonorMode = homeMode === 'donor';
  const requesterSignalText = requesterDisplayRequest
    ? readyDonorsCount > 0
      ? `${readyDonorsCount} متبرعًا جاهزًا يغطون الطلب المعروض الآن مع تحديث ذكي للمطابقات.`
      : 'سيظهر هنا عدد المتبرعين الجاهزين لطلبك بمجرد توفرهم.'
    : readyDonorsCount > 0
      ? `${readyDonorsCount} متبرعًا فعّلوا الجاهزية ووافقوا على الاشتراطات.`
      : demoPreviewActive
        ? 'المعاينة التجريبية تعرض تبديلًا حيًا بين الطلبات والمتبرعين الجاهزين.'
        : 'عند توفر متبرعين جاهزين ستظهر هنا قوة التغطية لطالب الدم.';
  const requesterLivePulseText = requesterDisplayRequest
    ? demoPreviewActive && requesterDemoPool.length > 1
      ? `معاينة متحركة ${(demoRequesterTick % requesterDemoPool.length) + 1} من ${requesterDemoPool.length}`
      : `آخر تحديث ${requesterDisplayRequest.timestamp}`
    : demoPreviewActive
      ? 'المعاينة الحية جاهزة لعرض الطلب التالي'
      : 'أنشئ طلبًا لتبدأ المطابقة';

  const filterSummary = [
    filterBloodType || 'كل الفصائل',
    `${filterDistance} كم`,
  ].join(' • ');

  const feedSectionSubtitle = filterSummary;

  const donorHeroBadgeText = isAvailableNow
    ? visiblePendingCount > 0
      ? 'طلبات دم الآن'
      : 'بانتظار طلب'
    : 'متوقف';

  const donorHeroTitle = isAvailableNow
    ? visiblePendingCount > 0
      ? 'طلبات دم مطابقة لك'
      : 'جاهز لأي طلب مطابق'
    : 'فعّل جاهزية التبرع';

  const donorHeroSubtitle = isAvailableNow
    ? visiblePendingCount > 0
      ? 'نرتب طالبي الدم الأقرب حسب الفصيلة والمسافة والأولوية.'
      : 'سيظهر هنا أول طالب دم مطابق بمجرد توفره.'
    : 'فعّل الاستقبال لتبدأ رؤية الفرص المطابقة مباشرة.';

  const donorMetrics = [
    {
      label: 'طلبات الدم',
      value: String(donorVisibleRequests.length),
    },
    {
      label: 'الأقرب',
      value: closestOpportunityLabel,
    },
    {
      label: 'الفصيلة',
      value: previewRequests[0]?.bloodType || filterBloodType || '—',
    },
  ];

  const donorSectionTitle =
    previewRequests.length > 1 ? 'طلبات الدم الأقرب الآن' : 'أقرب طلب دم الآن';

  const donorOpportunityEmptyTitle = isAvailableNow
    ? 'لا توجد طلبات دم مطابقة الآن'
    : 'فرص التبرع متوقفة حتى تعيد التفعيل';

  const donorOpportunityEmptyHint = isAvailableNow
    ? 'بدّل التصفية أو انتظر وصول طلب جديد مطابق.'
    : 'أعد التوفر عندما تكون جاهزًا وسنُظهر أول فرصة مناسبة مباشرة.';

  const requesterSectionEyebrow = requesterDisplayRequest
    ? 'طلب دم نشط'
    : 'طالب دم';
  const requesterSectionTitle = requesterDisplayRequest
    ? 'متابعة طلبك'
    : 'أنشئ طلب دم';
  const requesterSectionText = requesterDisplayRequest
    ? requesterMatchedDonorsCount > 0
      ? `${requesterMatchedDonorsCount} متبرعين مطابقين متاحين الآن لهذا الطلب.`
      : 'نبحث الآن عن أول متبرع مطابق لطلبك.'
    : 'أنشئ طلبك وستظهر المطابقات هنا مباشرة.';
  const requesterSectionBadgeValue = requesterDisplayRequest
    ? String(requesterMatchedDonorsCount)
    : String(readyDonorsCount);
  const requesterSectionBadgeLabel = requesterDisplayRequest
    ? 'متبرعون'
    : 'جاهزون';
  const requesterMetrics = requesterDisplayRequest
    ? [
        {
          label: 'المتبرعون',
          value: String(requesterMatchedDonorsCount),
        },
        {
          label: 'الأقرب',
          value: nearestRequesterDonor?.distance || '—',
        },
        {
          label: 'الوصول',
          value: nearestRequesterDonor?.eta || `${responseWindowMinutes} د`,
        },
      ]
    : [];
  const requesterContextHint = requesterDisplayRequest
    ? requesterMatchedDonorsCount > 0
      ? 'المطابقات الأقرب مرتبة بالمسافة وزمن الوصول.'
      : 'سيظهر هنا أول متبرع مطابق لطلبك بمجرد توفره.'
    : 'بعد إنشاء الطلب ستظهر هنا المطابقات الأقرب لطلبك.';
  const requesterQueueTitle = demoPreviewActive
    ? 'طلباتك الأخرى'
    : 'طلبات أخرى';

  const handleRequesterPrimaryAction = useCallback(() => {
    handleOpenCompose();
  }, [handleOpenCompose]);

  const handleRequesterSecondaryAction = useCallback(() => {
    if (requesterDisplayRequest) {
      handleShellNavigate('EsfRequestGet', {
        requestId: requesterDisplayRequest.id,
      });
      return;
    }

    setMyRequestsVisible(true);
  }, [handleShellNavigate, requesterDisplayRequest]);

  const requesterPrimaryActionLabel = 'اطلب الدم الآن';

  const requesterSecondaryActionLabel = requesterDisplayRequest
    ? 'افتح الطلب المعروض'
    : myRequests.length > 0
      ? 'إدارة طلباتي'
      : null;
  const requesterOpportunityTitle = requesterDisplayRequest
    ? 'المتبرعون الأقرب لطلبك'
    : 'ابدأ بطلب الدم';
  const requesterOpportunitySubtitle = requesterDisplayRequest
    ? requesterMatchedDonorsCount > 0
      ? 'اختر المتبرع الأقرب أو الأسرع، ثم افتح التطابق لمراجعة التواصل والخطوة التالية.'
      : requesterContextHint
    : 'بعد إنشاء الطلب سيتحول هذا القسم إلى قائمة المتبرعين المطابقين.';
  const requesterRequestMeta = requesterDisplayRequest
    ? [
        `الفصيلة ${formatBloodTypeLabel(requesterDisplayRequest.bloodType)}`,
        formatUnitsLabel(requesterDisplayRequest.units),
        requesterDisplayRequest.hospitalName ||
          requesterDisplayRequest.location,
      ].filter(Boolean)
    : [];

  const handleRequesterDonorPress = useCallback(
    (matchId: string) => {
      handleShellNavigate('EsfMatchGet', { matchId });
    },
    [handleShellNavigate]
  );

  const handleSelectRequesterPreview = useCallback(
    (requestId: string) => {
      if (demoPreviewActive && requesterDemoPool.length > 0) {
        const nextIndex = requesterDemoPool.findIndex(
          request => request.id === requestId
        );
        if (nextIndex >= 0) {
          setDemoRequesterTick(nextIndex);
          return;
        }
      }

      handleShellNavigate('EsfRequestGet', { requestId });
    },
    [demoPreviewActive, handleShellNavigate, requesterDemoPool]
  );

  const handleToggleDonorSetting = useCallback(
    (panel: Exclude<DonorSettingPanel, null>) => {
      setOpenDonorSetting(prev => (prev === panel ? null : panel));
      if (panel !== 'distance') {
        setDistanceCustomActive(false);
      }
    },
    []
  );

  const handleBloodTypeSelect = useCallback((bloodType: BloodType) => {
    setFilterBloodType(bloodType);
    setOpenDonorSetting(null);
  }, []);

  const handleDistancePresetSelect = useCallback((distance: number) => {
    setFilterDistance(distance);
    setCustomDistanceDraft(String(distance));
    setDistanceCustomActive(false);
    setOpenDonorSetting(null);
  }, []);

  const handleCustomDistanceApply = useCallback(() => {
    const parsedDistance = Number(customDistanceDraft);
    if (!Number.isFinite(parsedDistance)) {
      setCustomDistanceDraft(String(filterDistance));
      setDistanceCustomActive(false);
      setOpenDonorSetting(null);
      return;
    }

    const nextDistance = Math.min(100, Math.max(1, Math.round(parsedDistance)));
    setFilterDistance(nextDistance);
    setCustomDistanceDraft(String(nextDistance));
    setDistanceCustomActive(false);
    setOpenDonorSetting(null);
  }, [customDistanceDraft, filterDistance]);

  const handleUseCurrentServiceLocation = useCallback(async () => {
    setServiceLocationSyncing(true);
    try {
      const locationModule = await loadExpoLocation();
      if (!locationModule) {
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.infoTitle'),
          'ميزة تحديد الموقع غير متاحة حاليًا في هذا البناء.'
        );
        return;
      }

      const permission =
        await locationModule.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.infoTitle'),
          'يجب السماح بالموقع لتحديث نقطة خدمة ESF.'
        );
        return;
      }

      const position = await locationModule.getCurrentPositionAsync({
        accuracy: locationModule.Accuracy.Balanced,
      });
      const lat = Number(position.coords.latitude.toFixed(4));
      const lng = Number(position.coords.longitude.toFixed(4));

      setUserProfile(prev => ({
        ...prev,
        location: { lat, lng },
      }));
      setServiceLocationLabel(`موقعي الحالي • ${lat}, ${lng}`);
    } catch (error) {
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_home_get.errorTitleAlt'),
        error instanceof Error
          ? error.message
          : 'تعذر تحديد موقع خدمة ESF الآن.'
      );
    } finally {
      setServiceLocationSyncing(false);
    }
  }, [t]);

  // Handle Quick Compose submit (both create and edit)
  const handleQuickComposeSubmit = useCallback(
    async (data: RequestData) => {
      try {
        if (selectedRequest) {
          // EDIT MODE: Update existing request (if API supports it)
          // For now, we'll show an error as edit might not be supported
          Alert.alert(
            t('esf.app-client.mobile.auto_esf_home_get.infoTitle'),
            t('esf.app-client.mobile.auto_esf_home_get.editNotAvailable')
          );
          setQuickComposeVisible(false);
          setSelectedRequest(null);
          return;
        }

        // CREATE MODE: Create new request via API
        const requestBody = {
          emergency_type: 'BLOOD_DONATION',
          priority: data.urgency.toUpperCase(),
          description: `طلب تبرع بالدم - ${data.medicalReasonLabel || 'سبب طبي غير محدد'} - فصيلة ${data.bloodType} - ${data.units} وحدات`,
          location:
            data.location ||
            data.hospitalName ||
            t('esf.app-client.mobile.auto_esf_home_get.locationNotSpecifiedAlt2'),
          coordinates: data.locationCoords || {
            lat: userProfile.location?.lat || 24.7136,
            lng: userProfile.location?.lng || 46.6753,
          },
          medical_info: {
            blood_type: data.bloodType,
            units: data.units,
            hospital_name: data.hospitalName,
            patient_name: data.patientName,
            beneficiary: data.beneficiary || 'self',
            medical_reason: data.medicalReason,
            medical_reason_label: data.medicalReasonLabel,
            medical_reason_note: data.medicalReasonNote,
            contact_method: data.contactMethod,
            contact_info: data.contactInfo,
          },
        };

        let response: Response;
        try {
          response = await fetchWithRetry(`${getBaseUrl()}/api/esf/requests`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
          });
        } catch (fetchError) {
          throw fetchError;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(
            json?.error ||
              t('esf.app-client.mobile.auto_esf_home_get.publishFailed')
          );
        }

        // Reload data to get the new request
        await loadData();

        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.successTitle'),
          t('esf.app-client.mobile.auto_esf_home_get.publishSuccess')
        );
        setHomeMode('requester');
        setQuickComposeVisible(false);
        setSelectedRequest(null);
      } catch (error) {
        debugLog('Failed to create request:', error);
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.errorTitleAlt'),
          error instanceof Error
            ? error.message
            : t('esf.app-client.mobile.auto_esf_home_get.errorPublishMessage')
        );
      }
    },
    [userProfile.location, selectedRequest, loadData]
  );

  // Handle cancel request
  const handleCancelRequest = useCallback(async (request: EsfRequest) => {
    try {
      // Call API to cancel request (if endpoint exists)
      // For now, we'll just update local state
      // In production, this should call DELETE /api/esf/requests/{id} or similar
      setMyRequests(prev => prev.filter(r => r.id !== request.id));
      setAllRequests(prev => prev.filter(r => r.id !== request.id));
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_home_get.doneLabel'),
        t('esf.app-client.mobile.auto_esf_home_get.cancelSuccess')
      );
    } catch (error) {
      debugLog('Failed to cancel request:', error);
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_home_get.errorTitleAlt2'),
        t('esf.app-client.mobile.auto_esf_home_get.cancelFailed')
      );
    }
  }, []);

  // Handle availability toggle
  // ESF_RUNTIME_STABILITY_LOCK: prevent noisy failing mutation while backend/runtime fallback is active.
  const handleAvailabilityToggle = useCallback(
    async (newValue: boolean): Promise<boolean> => {
      if (isOffline || !!networkError) {
        setIsAvailableNow(newValue);
        return true;
      }

      try {
        let response: Response;
        try {
          response = await fetchWithRetry(
            `${getBaseUrl()}/api/esf/me/availability`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                available: newValue,
                status: newValue ? 'AVAILABLE' : 'UNAVAILABLE',
              }),
            }
          );
        } catch (fetchError) {
          debugLog('[ESF Home] Availability toggle fetch error:', fetchError);
          throw fetchError;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || 'فشل في تحديث حالة التوفر');
        }

        setIsAvailableNow(newValue);
        return true;
      } catch (error) {
        debugLog('Failed to update availability:', error);
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_home_get.errorTitleAlt3'),
          error instanceof Error
            ? error.message
            : t(
                'esf.app-client.mobile.auto_esf_home_get.errorUpdateAvailabilityMessage'
              )
        );
        return false;
      }
    },
    [isOffline, networkError, t]
  );

  const handleAvailabilityIntentChange = useCallback(
    (nextValue: boolean) => {
      if (nextValue && !isAvailableNow) {
        setAvailabilityEligibilityVisible(true);
        return;
      }

      void handleAvailabilityToggle(nextValue);
    },
    [handleAvailabilityToggle, isAvailableNow]
  );

  const handleConfirmAvailabilityEnable = useCallback(async () => {
    setAvailabilityConfirming(true);
    const success = await handleAvailabilityToggle(true);
    setAvailabilityConfirming(false);
    if (success) {
      setAvailabilityEligibilityVisible(false);
    }
  }, [handleAvailabilityToggle]);

  // Helper functions (not hooks - can be defined after hooks but before early returns)
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return semanticRoles.stateSuccess.icon;
      case 'medium':
        return semanticRoles.stateWarning.icon;
      case 'high':
        return semanticRoles.stateError.icon;
      case 'critical':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityLow');
      case 'medium':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityMedium');
      case 'high':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityHigh');
      case 'critical':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityCritical');
      default:
        return urgency;
    }
  };

  const renderRequestCard = ({
    item,
    index,
  }: {
    item: EsfRequest;
    index: number;
  }) => {
    const isProcessing = processingRequest === item.id;
    const canAccept =
      item.status === 'pending' && Boolean(item.matchId) && !isProcessing;
    const isTopMatch = index === 0 && displayRequests.length > 0;
    const isUnread = unreadRequestsIds.has(item.id);

    const cardContent = (
      <EsfRequestCardContent
        item={item}
        index={index}
        rowDirection={rowDirection}
        canAccept={canAccept}
        isProcessing={isProcessing}
        onAccept={handleQuickAccept}
      />
    );

    // Use SwipeableCard for swipeable actions
    if (canAccept) {
      return (
        <EsfSwipeableCard
          request={item}
          onPress={() => handleViewDetails(item)}
          onAccept={handleQuickAccept}
          canAccept={canAccept}
          isProcessing={isProcessing}
          getUrgencyColor={getUrgencyColor}
          getUrgencyText={getUrgencyText}
        >
          {cardContent}
          {isUnread && <View style={styles.unreadIndicator} />}
        </EsfSwipeableCard>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.requestCard,
          isTopMatch && styles.topMatchCard,
          isUnread && styles.unreadCard,
        ]}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
        disabled={isProcessing}
      >
        {cardContent}
        {isUnread && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <EsfHomeEmptyState
      viewerRole='donor'
      isAvailableNow={isAvailableNow}
      userProfile={userProfile}
      onEnableAvailability={() => handleAvailabilityIntentChange(true)}
      disableEnableAvailabilityAction={Boolean(isOffline || networkError)}
      fallbackHint={
        Boolean(isOffline || networkError)
          ? 'تعذر حفظ التوفر الآن لأن الاتصال غير متاح. يمكنك متابعة استعراض الواجهة محليًا.'
          : null
      }
    />
  );

  // Hide service if disabled (RULE_OPERATIONAL_EXCELLENCE §4.5)
  if (serviceEnabled === false) {
    return <EsfHomeDisabledState serviceFlagsError={serviceFlagsError} />;
  }

  // CRITICAL: Show offline screen IMMEDIATELY if loading and offline
  // This should be checked BEFORE the content check
  if (state === 'loading' && isOffline) {
    return (
      <EsfHomeOfflineState
        variant='loading'
        networkError={networkError}
        onRetry={() => {
          setRetryCount(0);
          setHasLoggedNetworkError(false);
          loadData(true);
        }}
      />
    );
  }

  // Show offline state if network error (including loading state that failed)
  if (isOffline && (state === 'error' || state === 'loading')) {
    return (
      <EsfHomeOfflineState
        variant='general'
        networkError={networkError}
        onRetry={() => {
          setRetryCount(0);
          setHasLoggedNetworkError(false);
          loadData(true);
        }}
      />
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state='content' contentPadding={false}>
        <View style={styles.container}>
          <View style={[styles.scene, isCompactHeight && styles.sceneCompact]}>
            <View style={styles.modeSwitchCard}>
              <View
                style={[styles.modeSwitchRow, { flexDirection: rowDirection }]}
              >
                <TouchableOpacity
                  style={[
                    styles.modeSwitchButton,
                    isDonorMode && styles.modeSwitchButtonActive,
                  ]}
                  onPress={() => setHomeMode('donor')}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name='water-outline'
                    size={18}
                    color={
                      isDonorMode
                        ? semanticRoles.primaryCTAText
                        : semanticRoles.primaryCTA
                    }
                  />
                  <Text
                    style={[
                      styles.modeSwitchText,
                      isDonorMode && styles.modeSwitchTextActive,
                    ]}
                  >
                    متبرع
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeSwitchButton,
                    !isDonorMode && styles.modeSwitchButtonActive,
                  ]}
                  onPress={() => setHomeMode('requester')}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name='add-circle-outline'
                    size={18}
                    color={
                      !isDonorMode
                        ? semanticRoles.primaryCTAText
                        : semanticRoles.primaryCTA
                    }
                  />
                  <Text
                    style={[
                      styles.modeSwitchText,
                      !isDonorMode && styles.modeSwitchTextActive,
                    ]}
                  >
                    طالب دم
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isDonorMode ? (
              <>
                <View style={styles.hubCard}>
                  <View
                    style={[
                      styles.commandTopRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <View style={styles.commandCopy}>
                      <Text
                        style={[
                          styles.hubTitle,
                          isCompactHeight && styles.hubTitleCompact,
                        ]}
                        numberOfLines={2}
                      >
                        {donorHeroTitle}
                      </Text>
                      <Text
                        style={[
                          styles.hubSubtitle,
                          isCompactHeight && styles.hubSubtitleCompact,
                        ]}
                        numberOfLines={2}
                      >
                        {donorHeroSubtitle}
                      </Text>
                    </View>

                    <View style={styles.heroBadgesRow}>
                      <View
                        style={[
                          styles.heroBadge,
                          !isAvailableNow && styles.heroBadgeMuted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.heroBadgeText,
                            !isAvailableNow && styles.heroBadgeTextMuted,
                          ]}
                        >
                          {donorHeroBadgeText}
                        </Text>
                      </View>

                      {demoPreviewActive ? (
                        <View style={styles.demoBadge}>
                          <Text style={styles.demoBadgeText}>
                            {demoPreviewLabel ||
                              homeInsights?.demoLabel ||
                              'معاينة تجريبية'}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.readinessInlineRow}>
                    <View
                      style={[
                        styles.readinessInlineTopRow,
                        { flexDirection: rowDirection },
                      ]}
                    >
                      <View
                        style={[
                          styles.readinessToggleGroup,
                          { flexDirection: rowDirection },
                        ]}
                      >
                        <Switch
                          value={isAvailableNow}
                          onValueChange={handleAvailabilityIntentChange}
                          disabled={false}
                        />
                        <Text style={styles.readinessInlineTitle}>
                          {donorReadinessTitle}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.readinessInlineActions,
                          { flexDirection: rowDirection },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.donorSettingCard}
                          onPress={() => handleToggleDonorSetting('bloodType')}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.donorSettingLabel}>الفصيلة</Text>
                          <Text style={styles.donorSettingValue}>
                            {filterBloodType || '—'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.donorSettingCard}
                          onPress={() => handleToggleDonorSetting('distance')}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.donorSettingLabel}>النطاق</Text>
                          <Text style={styles.donorSettingValue}>
                            {filterDistance} كم
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.readinessInlineHint}>
                      {isAvailableNow
                        ? donorReadinessBadge
                        : donorReadinessHint}
                    </Text>

                    {openDonorSetting === 'bloodType' ? (
                      <View style={styles.inlineSettingPanel}>
                        <View
                          style={[
                            styles.inlineOptionGrid,
                            { flexDirection: rowDirection },
                          ]}
                        >
                          {DONOR_BLOOD_TYPE_OPTIONS.map(bloodType => {
                            const isSelected = bloodType === filterBloodType;
                            return (
                              <TouchableOpacity
                                key={bloodType}
                                style={[
                                  styles.inlineOptionChip,
                                  isSelected && styles.inlineOptionChipActive,
                                ]}
                                onPress={() => handleBloodTypeSelect(bloodType)}
                                activeOpacity={0.85}
                              >
                                <Text
                                  style={[
                                    styles.inlineOptionText,
                                    isSelected && styles.inlineOptionTextActive,
                                  ]}
                                >
                                  {bloodType}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}

                    {openDonorSetting === 'distance' ? (
                      <View style={styles.inlineSettingPanel}>
                        <View
                          style={[
                            styles.inlineOptionRow,
                            { flexDirection: rowDirection },
                          ]}
                        >
                          {DONOR_DISTANCE_PRESETS.map(distance => {
                            const isSelected = distance === filterDistance;
                            return (
                              <TouchableOpacity
                                key={distance}
                                style={[
                                  styles.inlineOptionChip,
                                  isSelected && styles.inlineOptionChipActive,
                                ]}
                                onPress={() =>
                                  handleDistancePresetSelect(distance)
                                }
                                activeOpacity={0.85}
                              >
                                <Text
                                  style={[
                                    styles.inlineOptionText,
                                    isSelected && styles.inlineOptionTextActive,
                                  ]}
                                >
                                  {distance} كم
                                </Text>
                              </TouchableOpacity>
                            );
                          })}

                          <TouchableOpacity
                            style={[
                              styles.inlineOptionChip,
                              distanceCustomActive &&
                                styles.inlineOptionChipActive,
                            ]}
                            onPress={() => setDistanceCustomActive(true)}
                            activeOpacity={0.85}
                          >
                            <Text
                              style={[
                                styles.inlineOptionText,
                                distanceCustomActive &&
                                  styles.inlineOptionTextActive,
                              ]}
                            >
                              أخرى
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {distanceCustomActive ? (
                          <View
                            style={[
                              styles.customDistanceRow,
                              { flexDirection: rowDirection },
                            ]}
                          >
                            <TouchableOpacity
                              style={styles.customDistanceApplyButton}
                              onPress={handleCustomDistanceApply}
                              activeOpacity={0.85}
                            >
                              <Text style={styles.customDistanceApplyText}>
                                تطبيق
                              </Text>
                            </TouchableOpacity>

                            <TextInput
                              value={customDistanceDraft}
                              onChangeText={setCustomDistanceDraft}
                              keyboardType='number-pad'
                              placeholder='كم'
                              placeholderTextColor={semanticRoles.textMuted}
                              style={styles.customDistanceInput}
                              onSubmitEditing={handleCustomDistanceApply}
                            />
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.heroMetricsRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    {donorMetrics.map(metric => (
                      <View key={metric.label} style={styles.heroMetricCard}>
                        <Text style={styles.heroMetricValue}>
                          {metric.value}
                        </Text>
                        <Text style={styles.heroMetricLabel}>
                          {metric.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {!hasShellSearchControl && feedSearchExpanded ? (
                  <EsfHomeSearchBar
                    value={feedSearchQuery}
                    onChangeText={setFeedSearchQuery}
                  />
                ) : null}

                <View style={styles.opportunityPanel}>
                  <View
                    style={[
                      styles.sectionHeaderRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <View style={styles.sectionHeaderCopy}>
                      <Text style={styles.sectionTitle}>
                        {donorSectionTitle}
                      </Text>
                      <Text style={styles.sectionSubtitle} numberOfLines={1}>
                        {feedSectionSubtitle}
                      </Text>
                    </View>

                    {hiddenOpportunityCount > 0 ? (
                      <View style={styles.sectionCountPill}>
                        <Text style={styles.sectionCountText}>
                          +{hiddenOpportunityCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.smartFilterRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.smartFilterChip,
                        donorSmartFilter === 'nearest' &&
                          styles.smartFilterChipActive,
                      ]}
                      onPress={() => setDonorSmartFilter('nearest')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.smartFilterChipText,
                          donorSmartFilter === 'nearest' &&
                            styles.smartFilterChipTextActive,
                        ]}
                      >
                        الأقرب
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.smartFilterChip,
                        donorSmartFilter === 'urgent' &&
                          styles.smartFilterChipActive,
                      ]}
                      onPress={() => setDonorSmartFilter('urgent')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.smartFilterChipText,
                          donorSmartFilter === 'urgent' &&
                            styles.smartFilterChipTextActive,
                        ]}
                      >
                        الأعلى أولوية
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {previewRequests.length > 0 ? (
                    <View style={styles.spotlightStack}>
                      {previewRequests.map((item, index) => (
                        <React.Fragment key={item.id}>
                          {renderRequestCard({ item, index })}
                        </React.Fragment>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptySpotlightCard}>
                      <Text style={styles.emptySpotlightTitle}>
                        {donorOpportunityEmptyTitle}
                      </Text>
                      <Text style={styles.emptySpotlightHint}>
                        {donorOpportunityEmptyHint}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.requesterSignalCard}>
                  <View
                    style={[
                      styles.requesterPanelHeader,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <View
                      style={[
                        styles.requesterPanelIdentity,
                        { flexDirection: rowDirection },
                      ]}
                    >
                      <View style={styles.requesterIconBadge}>
                        <Ionicons
                          name={
                            requesterDisplayRequest
                              ? 'document-text-outline'
                              : 'add-circle-outline'
                          }
                          size={20}
                          color={semanticRoles.primaryCTA}
                        />
                      </View>

                      <View style={styles.requesterSignalCopy}>
                        <Text style={styles.requesterPanelEyebrow}>
                          {requesterSectionEyebrow}
                        </Text>
                        <Text style={styles.requesterSignalTitle}>
                          {requesterSectionTitle}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requesterSignalBadge}>
                      <Text style={styles.requesterSignalValue}>
                        {requesterSectionBadgeValue}
                      </Text>
                      <Text style={styles.requesterSignalLabel}>
                        {requesterSectionBadgeLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.requesterSignalText}>
                    {requesterSectionText}
                  </Text>

                  <View style={styles.requesterPanelSummaryPill}>
                    <Text style={styles.requesterPanelSummaryText}>
                      {requesterLivePulseText}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.requesterActionsRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.primaryCta}
                      onPress={handleRequesterPrimaryAction}
                      activeOpacity={0.85}
                      accessibilityRole='button'
                      accessibilityLabel={requesterPrimaryActionLabel}
                    >
                      <Text style={styles.primaryCtaText}>
                        {requesterPrimaryActionLabel}
                      </Text>
                    </TouchableOpacity>

                    {requesterSecondaryActionLabel ? (
                      <TouchableOpacity
                        style={styles.secondaryCta}
                        onPress={handleRequesterSecondaryAction}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.secondaryCtaText}>
                          {requesterSecondaryActionLabel}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <View style={styles.opportunityPanel}>
                  <View
                    style={[
                      styles.sectionHeaderRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <View style={styles.sectionHeaderCopy}>
                      <Text style={styles.sectionTitle}>
                        {requesterOpportunityTitle}
                      </Text>
                      <Text style={styles.sectionSubtitle} numberOfLines={2}>
                        {requesterOpportunitySubtitle}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.smartFilterRow,
                      { flexDirection: rowDirection },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.smartFilterChip,
                        requesterSmartFilter === 'nearest' &&
                          styles.smartFilterChipActive,
                      ]}
                      onPress={() => setRequesterSmartFilter('nearest')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.smartFilterChipText,
                          requesterSmartFilter === 'nearest' &&
                            styles.smartFilterChipTextActive,
                        ]}
                      >
                        الأقرب
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.smartFilterChip,
                        requesterSmartFilter === 'fastest' &&
                          styles.smartFilterChipActive,
                      ]}
                      onPress={() => setRequesterSmartFilter('fastest')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.smartFilterChipText,
                          requesterSmartFilter === 'fastest' &&
                            styles.smartFilterChipTextActive,
                        ]}
                      >
                        الأسرع
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.smartFilterChip,
                        requesterSmartFilter === 'topRated' &&
                          styles.smartFilterChipActive,
                      ]}
                      onPress={() => setRequesterSmartFilter('topRated')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.smartFilterChipText,
                          requesterSmartFilter === 'topRated' &&
                            styles.smartFilterChipTextActive,
                        ]}
                      >
                        الأعلى تقييمًا
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {requesterDisplayRequest ? (
                    <View style={styles.requesterOpportunityStack}>
                      <View
                        style={[
                          styles.requesterMetaRow,
                          { flexDirection: rowDirection },
                        ]}
                      >
                        {requesterRequestMeta.map((meta, index) => (
                          <View
                            key={`${meta}-${index}`}
                            style={styles.requesterMetaPill}
                          >
                            <Text style={styles.requesterMetaText}>{meta}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.requesterSummaryCard}>
                        <Text style={styles.requesterSummaryTitle}>
                          {requesterDisplayRequest.medicalReasonLabel ||
                            'سبب طبي غير محدد'}
                        </Text>
                        <Text style={styles.requesterSummaryDetail}>
                          {requesterDisplayRequest.hospitalName ||
                            requesterDisplayRequest.location}
                        </Text>
                        <Text style={styles.requesterSummaryDetail}>
                          {requesterContextHint}
                        </Text>
                      </View>

                      {requesterMetrics.length > 0 ? (
                        <View
                          style={[
                            styles.requesterMetricsRow,
                            { flexDirection: rowDirection },
                          ]}
                        >
                          {requesterMetrics.map(metric => (
                            <View
                              key={metric.label}
                              style={styles.heroMetricCard}
                            >
                              <Text style={styles.heroMetricValue}>
                                {metric.value}
                              </Text>
                              <Text style={styles.heroMetricLabel}>
                                {metric.label}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {requesterPreviewDonors.length > 0 ? (
                        <View style={styles.requesterDonorStack}>
                          {requesterPreviewDonors.map(donor => (
                            <View
                              key={donor.id}
                              style={styles.requesterDonorCard}
                            >
                              <View
                                style={[
                                  styles.requesterDonorHeader,
                                  { flexDirection: rowDirection },
                                ]}
                              >
                                <View style={styles.requesterDonorCopy}>
                                  <Text style={styles.requesterDonorName}>
                                    {donor.name}
                                  </Text>
                                  <Text style={styles.requesterDonorSubline}>
                                    {donor.donorBloodType
                                      ? `فصيلة ${formatBloodTypeLabel(donor.donorBloodType)}`
                                      : 'متبرع مطابق'}
                                  </Text>
                                </View>

                                {donor.donorRating ? (
                                  <View style={styles.requesterDonorRatingPill}>
                                    <Text
                                      style={styles.requesterDonorRatingText}
                                    >
                                      ⭐ {donor.donorRating.toFixed(1)}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>

                              <View
                                style={[
                                  styles.requesterDonorMetaRow,
                                  { flexDirection: rowDirection },
                                ]}
                              >
                                <View style={styles.requesterMetaPill}>
                                  <Text style={styles.requesterMetaText}>
                                    المسافة {donor.distance}
                                  </Text>
                                </View>
                                <View style={styles.requesterMetaPill}>
                                  <Text style={styles.requesterMetaText}>
                                    الوصول {donor.eta}
                                  </Text>
                                </View>
                              </View>

                              <View
                                style={[
                                  styles.requesterDonorFooter,
                                  { flexDirection: rowDirection },
                                ]}
                              >
                                <Text style={styles.requesterDonorHint}>
                                  افتح التطابق لمراجعة قناة التواصل والتفاصيل.
                                </Text>

                                <TouchableOpacity
                                  style={styles.requesterDonorActionButton}
                                  onPress={() =>
                                    handleRequesterDonorPress(donor.id)
                                  }
                                  activeOpacity={0.85}
                                >
                                  <Text style={styles.requesterDonorActionText}>
                                    افتح التطابق
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {requesterQueueRequests.length > 0 ? (
                        <View style={styles.requesterQueueStack}>
                          <Text style={styles.requesterQueueTitle}>
                            {requesterQueueTitle}
                          </Text>
                          <View
                            style={[
                              styles.requesterQueueRow,
                              { flexDirection: rowDirection },
                            ]}
                          >
                            {requesterQueueRequests.map(request => (
                              <TouchableOpacity
                                key={request.id}
                                style={styles.requesterQueueChip}
                                onPress={() =>
                                  handleSelectRequesterPreview(request.id)
                                }
                                activeOpacity={0.85}
                              >
                                <Text style={styles.requesterQueueChipTitle}>
                                  {request.medicalReasonLabel || 'طلب دم'}
                                </Text>
                                <Text style={styles.requesterQueueChipMeta}>
                                  {`${request.timestamp} • ${
                                    request.hospitalName || request.location
                                  }`}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View style={styles.emptySpotlightCard}>
                      <Text style={styles.emptySpotlightTitle}>
                        لا يوجد طلب دم نشط الآن
                      </Text>
                      <Text style={styles.emptySpotlightHint}>
                        اضغط طلب الدم الآن من هذا الوضع، وبعد الإنشاء سيتحول هذا
                        القسم إلى قائمة المتبرعين المطابقين لطلبك.
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        <EsfRequestMiniDetailsSheet
          visible={miniDetailsVisible}
          onClose={() => {
            setMiniDetailsVisible(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onAccept={handleQuickAccept}
          mode='donor'
        />

        <EsfRequestQuickComposeSheet
          visible={quickComposeVisible}
          onClose={() => {
            setQuickComposeVisible(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleQuickComposeSubmit}
          initialData={
            selectedRequest
              ? {
                  bloodType: selectedRequest.bloodType as BloodType,
                  units: selectedRequest.units,
                  urgency: selectedRequest.urgency,
                  hospitalName: selectedRequest.hospitalName || '',
                  location: selectedRequest.location,
                  locationCoords: selectedRequest.locationCoords,
                  patientName: selectedRequest.patientName || '',
                  beneficiary: selectedRequest.beneficiary || 'self',
                  medicalReason: selectedRequest.medicalReason,
                  medicalReasonLabel: selectedRequest.medicalReasonLabel,
                  medicalReasonNote: selectedRequest.medicalReasonNote || '',
                  contactMethod: selectedRequest.contactMethod || 'in_app',
                  contactInfo: selectedRequest.contactInfo || '',
                }
              : undefined
          }
          isEditMode={!!selectedRequest}
        />

        <EsfBottomSheet
          visible={headerSettingsVisible}
          onClose={() => setHeaderSettingsVisible(false)}
          height='large'
          title='إعدادات ESF'
        >
          <View style={styles.esfHeaderSettingsSheet}>
            <View style={styles.esfHeaderSettingsHero}>
              <Text style={styles.esfHeaderSettingsEyebrow}>
                تحكمك السريع من الهيدر البرتقالي
              </Text>
              <Text style={styles.esfHeaderSettingsLead}>
                هذه الإعدادات مخصصة لخدمة اسعفني بالدم فقط ولا تعتمد على الحساب
                الرئيسي.
              </Text>
            </View>

            <View style={styles.esfHeaderSettingsSection}>
              <View
                style={[
                  styles.esfHeaderSettingsRow,
                  { flexDirection: rowDirection },
                ]}
              >
                <View style={styles.esfHeaderSettingsCopy}>
                  <Text style={styles.esfHeaderSettingsTitle}>
                    مستعد للتبرع
                  </Text>
                  <Text style={styles.esfHeaderSettingsHint}>
                    فعّل الجاهزية لتظهر لك طلبات الدم المطابقة مباشرة.
                  </Text>
                </View>
                <Switch
                  value={isAvailableNow}
                  onValueChange={handleAvailabilityIntentChange}
                />
              </View>
            </View>

            <View style={styles.esfHeaderSettingsSection}>
              <Text style={styles.esfHeaderSettingsLabel}>فصيلة المتبرع</Text>
              <View
                style={[
                  styles.esfHeaderSettingsChipRow,
                  { flexDirection: rowDirection },
                ]}
              >
                {DONOR_BLOOD_TYPE_OPTIONS.map(bloodType => {
                  const isSelected = bloodType === filterBloodType;
                  return (
                    <TouchableOpacity
                      key={`header-${bloodType}`}
                      style={[
                        styles.esfHeaderSettingsChip,
                        isSelected && styles.esfHeaderSettingsChipActive,
                      ]}
                      onPress={() => setFilterBloodType(bloodType)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.esfHeaderSettingsChipText,
                          isSelected && styles.esfHeaderSettingsChipTextActive,
                        ]}
                      >
                        {bloodType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.esfHeaderSettingsSection}>
              <Text style={styles.esfHeaderSettingsLabel}>نطاق الاستجابة</Text>
              <View
                style={[
                  styles.esfHeaderSettingsChipRow,
                  { flexDirection: rowDirection },
                ]}
              >
                {DONOR_DISTANCE_PRESETS.map(distance => {
                  const isSelected = distance === filterDistance;
                  return (
                    <TouchableOpacity
                      key={`header-distance-${distance}`}
                      style={[
                        styles.esfHeaderSettingsChip,
                        isSelected && styles.esfHeaderSettingsChipActive,
                      ]}
                      onPress={() => handleDistancePresetSelect(distance)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.esfHeaderSettingsChipText,
                          isSelected && styles.esfHeaderSettingsChipTextActive,
                        ]}
                      >
                        {distance} كم
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={[
                  styles.esfHeaderSettingsCustomRow,
                  { flexDirection: rowDirection },
                ]}
              >
                <TouchableOpacity
                  style={styles.esfHeaderSettingsApplyButton}
                  onPress={handleCustomDistanceApply}
                  activeOpacity={0.85}
                >
                  <Text style={styles.esfHeaderSettingsApplyText}>تطبيق</Text>
                </TouchableOpacity>

                <TextInput
                  value={customDistanceDraft}
                  onChangeText={setCustomDistanceDraft}
                  keyboardType='number-pad'
                  placeholder='اكتب نطاقًا آخر'
                  placeholderTextColor={semanticRoles.textMuted}
                  style={styles.esfHeaderSettingsInput}
                  onSubmitEditing={handleCustomDistanceApply}
                />
              </View>
            </View>

            <View style={styles.esfHeaderSettingsSection}>
              <Text style={styles.esfHeaderSettingsLabel}>موقع خدمة ESF</Text>
              <Text style={styles.esfHeaderSettingsHint}>
                هذا الموقع مستقل عن الحساب الرئيسي ويمكنك تغييره متى أردت.
              </Text>
              <View
                style={[
                  styles.esfHeaderSettingsCustomRow,
                  { flexDirection: rowDirection },
                ]}
              >
                <TouchableOpacity
                  style={styles.esfHeaderSettingsGpsButton}
                  onPress={() => {
                    void handleUseCurrentServiceLocation();
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={
                      serviceLocationSyncing ? 'sync-outline' : 'locate-outline'
                    }
                    size={18}
                    color={semanticRoles.primaryCTAText}
                  />
                </TouchableOpacity>

                <TextInput
                  value={serviceLocationLabel}
                  onChangeText={setServiceLocationLabel}
                  placeholder='حدد نقطة خدمة ESF أو استخدم GPS'
                  placeholderTextColor={semanticRoles.textMuted}
                  style={styles.esfHeaderSettingsInput}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>
          </View>
        </EsfBottomSheet>

        <EsfMyRequestsSheet
          visible={myRequestsVisible}
          onClose={() => setMyRequestsVisible(false)}
          requests={myRequests}
          onEdit={request => {
            setSelectedRequest(request);
            setMyRequestsVisible(false);
            setQuickComposeVisible(true);
          }}
          onCancel={handleCancelRequest}
          onViewDetail={request => {
            setMyRequestsVisible(false);
            handleShellNavigate('EsfRequestGet', { requestId: request.id });
          }}
        />

        {isAvailableNow ? (
          <EsfCriticalRequestPopup
            visible={!!criticalPopupRequest}
            request={criticalPopupRequest}
            onAccept={handleQuickAccept}
            onViewDetails={handleViewDetails}
            onDismiss={() => setCriticalPopupRequest(null)}
          />
        ) : null}

        <EsfDonationEligibilitySheet
          visible={availabilityEligibilityVisible}
          onClose={() => {
            if (!availabilityConfirming) {
              setAvailabilityEligibilityVisible(false);
            }
          }}
          onConfirm={() => {
            void handleConfirmAvailabilityEnable();
          }}
          confirming={availabilityConfirming}
          items={donationEligibilityItems}
          title={donationEligibilityCopy.title}
          subtitle={donationEligibilityCopy.subtitle}
          note={donationEligibilityCopy.note}
          confirmLabel={donationEligibilityCopy.confirmLabel}
          cancelLabel={donationEligibilityCopy.cancelLabel}
          activatingLabel={donationEligibilityCopy.activatingLabel}
        />

        {lastAcceptedRequest && (
          <View style={[styles.snackbar, { flexDirection: rowDirection }]}>
            <Text style={styles.snackbarText}>
              تم قبول الطلب {lastAcceptedRequest.id}
            </Text>
            <TouchableOpacity
              style={styles.snackbarButton}
              onPress={handleUndoAccept}
            >
              <Text style={styles.snackbarButtonText}>تراجع</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScreenWrapper>
    );
  }

  // Fallback: if still loading and offline, show offline screen
  if (state === 'loading' && isOffline) {
    return (
      <ScreenWrapper state='error'>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📡</Text>
          <Text style={styles.emptyTitle}>لا يوجد اتصال</Text>
          <Text style={styles.emptySubtitle}>
            {networkError ||
              t('esf.app-client.mobile.auto_esf_home_get.offlineMessageAlt3')}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => {
              setRetryCount(0);
              setHasLoggedNetworkError(false);
              loadData(true);
            }}
          >
            <Text style={styles.emptyButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(
        'esf.app-client.mobile.auto_esf_home_get.loadingRequestsMessage'
      )}
      errorMessage={t(
        'esf.app-client.mobile.auto_esf_home_get.errorLoadRequestsMessage'
      )}
      onErrorAction={handleErrorRetry}
      screenName='auto_esf_home_get'
      operationName='esf_home_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scene: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: 0,
    paddingBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  sceneCompact: {
    gap: BTHWANI_SPACING.xs + 2,
  },
  modeSwitchCard: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs + 4,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  modeSwitchTitle: {
    fontSize: BTHWANI_SPACING.sm + 1,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  modeSwitchRow: {
    gap: BTHWANI_SPACING.xs + 2,
  },
  modeSwitchButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '33',
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs + 4,
  },
  modeSwitchButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  modeSwitchText: {
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: '800',
  },
  modeSwitchTextActive: {
    color: semanticRoles.primaryCTAText,
  },
  hubCard: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  commandTopRow: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  commandCopy: {
    flex: 1,
    gap: 4,
  },
  sectionIdentityRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  sectionIdentityCopy: {
    flex: 1,
    gap: 2,
  },
  sectionEyebrow: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  heroBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  sectionIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sectionIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA + '14',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '33',
  },
  sectionIconLabel: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.primaryCTA,
    fontWeight: '800',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateSuccess.background,
  },
  heroBadgeMuted: {
    backgroundColor: semanticRoles.stateWarning.background,
  },
  heroBadgeText: {
    color: semanticRoles.stateSuccess.icon,
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
  },
  heroBadgeTextMuted: {
    color: semanticRoles.stateWarning.icon,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateWarning.background,
  },
  demoBadgeText: {
    color: semanticRoles.stateWarning.icon,
    fontSize: BTHWANI_SPACING.sm,
    fontWeight: '800',
  },
  hubTitle: {
    fontSize: BTHWANI_SPACING.xl + 6,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  hubTitleCompact: {
    fontSize: BTHWANI_SPACING.lg + 2,
  },
  hubSubtitle: {
    fontSize: BTHWANI_SPACING.md,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.lg + 2,
  },
  hubSubtitleCompact: {
    fontSize: BTHWANI_SPACING.sm + 1,
    lineHeight: BTHWANI_SPACING.md + 4,
  },
  readinessInlineRow: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  readinessInlineTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  readinessToggleGroup: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs + 2,
  },
  readinessInlineCopy: {
    flex: 1,
    gap: 2,
  },
  readinessInlineActions: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  donorSettingCard: {
    minWidth: 68,
    minHeight: 42,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.xs + 2,
    gap: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donorSettingLabel: {
    fontSize: BTHWANI_SPACING.sm - 2,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  donorSettingValue: {
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  readinessInlineTitle: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  readinessInlineHint: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.md + 2,
  },
  inlineSettingPanel: {
    gap: BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.xs,
  },
  inlineOptionGrid: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  inlineOptionRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  inlineOptionChip: {
    minHeight: 38,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.xs + 2,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineOptionChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  inlineOptionText: {
    fontSize: BTHWANI_SPACING.sm,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  inlineOptionTextActive: {
    color: semanticRoles.primaryCTAText,
  },
  customDistanceRow: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  customDistanceInput: {
    flex: 1,
    minHeight: 42,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.md,
    color: semanticRoles.text,
    textAlign: 'center',
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '700',
  },
  customDistanceApplyButton: {
    minHeight: 42,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  customDistanceApplyText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.sm,
    fontWeight: '800',
  },
  readinessCard: {
    minWidth: 156,
    maxWidth: 174,
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  readinessEyebrow: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  readinessTitle: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  readinessNote: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.md + 2,
  },
  readinessSwitchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  readinessSwitchCopy: {
    flex: 1,
    gap: 2,
  },
  readinessSwitchLabel: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.text,
    fontWeight: '700',
  },
  readinessSwitchValue: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  readinessStatusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.primaryCTA + '14',
  },
  readinessStatusPillText: {
    color: semanticRoles.primaryCTA,
    fontSize: BTHWANI_SPACING.sm - 1,
    fontWeight: '800',
  },
  heroMetricsRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs + 2,
  },
  heroMetricCard: {
    flex: 1,
    minWidth: 84,
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.sm - 1,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: 2,
  },
  heroMetricValue: {
    fontSize: BTHWANI_SPACING.md + 1,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  heroMetricLabel: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  requesterSignalCard: {
    alignItems: 'stretch',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm + 2,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  requesterSignalCopy: {
    flex: 1,
    gap: 2,
  },
  requesterPanelHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  requesterPanelIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: BTHWANI_SPACING.sm,
  },
  requesterIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA + '14',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '33',
  },
  requesterPanelEyebrow: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  requesterSignalTitle: {
    fontSize: BTHWANI_SPACING.md + 2,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  requesterSignalText: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.lg,
  },
  requesterSignalBadge: {
    minWidth: 70,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs + 2,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  requesterSignalValue: {
    fontSize: BTHWANI_SPACING.md + 2,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  requesterSignalLabel: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  requesterPanelSummaryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  requesterPanelSummaryText: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.primaryCTA,
    fontWeight: '800',
  },
  requesterQueueStack: {
    gap: BTHWANI_SPACING.xs + 2,
  },
  requesterQueueTitle: {
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  requesterQueueRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  requesterQueueChip: {
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    gap: 4,
    minWidth: 140,
    maxWidth: '100%',
  },
  requesterQueueChipTitle: {
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  requesterQueueChipMeta: {
    fontSize: BTHWANI_SPACING.sm - 1,
    fontWeight: '700',
    color: semanticRoles.textMuted,
  },
  requesterContextHint: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.md + 2,
  },
  requesterMetricsRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs + 2,
  },
  requesterActionsRow: {
    gap: BTHWANI_SPACING.xs + 2,
    alignItems: 'stretch',
  },
  requesterOpportunityStack: {
    gap: BTHWANI_SPACING.sm,
  },
  requesterDonorStack: {
    gap: BTHWANI_SPACING.xs + 2,
  },
  requesterDonorCard: {
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm + 2,
    gap: BTHWANI_SPACING.xs,
  },
  requesterDonorHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  requesterDonorCopy: {
    flex: 1,
    gap: 2,
  },
  requesterDonorName: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  requesterDonorSubline: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  requesterDonorRatingPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.primaryCTA + '12',
  },
  requesterDonorRatingText: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.primaryCTA,
    fontWeight: '800',
  },
  requesterDonorMetaRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  requesterDonorFooter: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.xs,
  },
  requesterDonorHint: {
    flex: 1,
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.md + 1,
  },
  requesterDonorActionButton: {
    minHeight: 36,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  requesterDonorActionText: {
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.primaryCTAText,
    fontWeight: '800',
  },
  requesterMetaRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  requesterMetaPill: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  requesterMetaText: {
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.text,
    fontWeight: '700',
  },
  requesterSummaryCard: {
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm + 2,
    gap: 4,
  },
  requesterSummaryTitle: {
    fontSize: BTHWANI_SPACING.md + 1,
    color: semanticRoles.text,
    fontWeight: '800',
  },
  requesterSummaryDetail: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.textMuted,
    lineHeight: BTHWANI_SPACING.lg,
  },
  primaryCta: {
    flex: 1.3,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryCtaText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.md + 2,
    fontWeight: '800',
  },
  secondaryCta: {
    flex: 1,
    minHeight: 52,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaText: {
    color: semanticRoles.text,
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '700',
  },
  filterBarShell: {
    gap: BTHWANI_SPACING.sm,
  },
  opportunityPanel: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  sectionHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  smartFilterRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  smartFilterChip: {
    minHeight: 34,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.sm + 2,
    paddingVertical: BTHWANI_SPACING.xs,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartFilterChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  smartFilterChipText: {
    fontSize: BTHWANI_SPACING.sm - 1,
    fontWeight: '700',
    color: semanticRoles.textMuted,
  },
  smartFilterChipTextActive: {
    color: semanticRoles.primaryCTAText,
  },
  readinessRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.md,
  },
  readinessTextWrap: {
    flex: 1,
    paddingEnd: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.xs / 2,
  },
  readinessLabel: {
    color: semanticRoles.text,
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '800',
  },
  readinessHint: {
    color: semanticRoles.textMuted,
    fontSize: BTHWANI_SPACING.sm + 1,
    lineHeight: BTHWANI_SPACING.md + BTHWANI_SPACING.xs,
  },
  sectionTitle: {
    fontSize: BTHWANI_SPACING.lg,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  sectionSubtitle: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.textMuted,
  },
  esfHeaderSettingsSheet: {
    gap: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.lg,
  },
  esfHeaderSettingsHero: {
    borderRadius: BTHWANI_RADIUS.xl,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA + '10',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '20',
    gap: 6,
  },
  esfHeaderSettingsEyebrow: {
    fontSize: BTHWANI_SPACING.sm,
    fontWeight: '800',
    color: semanticRoles.primaryCTA,
  },
  esfHeaderSettingsLead: {
    fontSize: BTHWANI_SPACING.sm + 2,
    lineHeight: BTHWANI_SPACING.lg,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  esfHeaderSettingsSection: {
    borderRadius: BTHWANI_RADIUS.xl,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  esfHeaderSettingsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  esfHeaderSettingsCopy: {
    flex: 1,
    gap: 4,
  },
  esfHeaderSettingsTitle: {
    fontSize: BTHWANI_SPACING.md + 2,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  esfHeaderSettingsLabel: {
    fontSize: BTHWANI_SPACING.sm + 2,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  esfHeaderSettingsHint: {
    fontSize: BTHWANI_SPACING.sm + 1,
    lineHeight: BTHWANI_SPACING.lg,
    color: semanticRoles.textMuted,
  },
  esfHeaderSettingsChipRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  esfHeaderSettingsChip: {
    minHeight: 40,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs + 2,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  esfHeaderSettingsChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  esfHeaderSettingsChipText: {
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  esfHeaderSettingsChipTextActive: {
    color: semanticRoles.primaryCTAText,
  },
  esfHeaderSettingsCustomRow: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  esfHeaderSettingsInput: {
    flex: 1,
    minHeight: 48,
    borderRadius: BTHWANI_RADIUS.full,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.md,
    color: semanticRoles.text,
    fontSize: BTHWANI_SPACING.sm + 2,
    fontWeight: '700',
  },
  esfHeaderSettingsApplyButton: {
    minHeight: 48,
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  esfHeaderSettingsApplyText: {
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
    color: semanticRoles.primaryCTAText,
  },
  esfHeaderSettingsGpsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  sectionCountPill: {
    minWidth: 42,
    height: 42,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  sectionCountText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '800',
  },
  spotlightStack: {
    gap: BTHWANI_SPACING.xs + 2,
  },
  emptySpotlightCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.xs,
  },
  emptySpotlightTitle: {
    fontSize: BTHWANI_SPACING.md + 2,
    fontWeight: '800',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  emptySpotlightHint: {
    fontSize: BTHWANI_SPACING.sm + 1,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    lineHeight: BTHWANI_SPACING.md + 4,
  },
  listContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  requestCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: BTHWANI_SPACING.xs, // 2px equivalent
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: BTHWANI_SPACING.xs / 2, // 4px equivalent
    borderLeftColor: semanticRoles.stateError.icon,
  },
  unreadIndicator: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    width: BTHWANI_SPACING.sm,
    height: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_SPACING.xs / 2,
    backgroundColor: semanticRoles.stateError.icon,
  },
  topMatchCard: {
    borderWidth: BTHWANI_SPACING.xs, // 2px equivalent
    borderColor: semanticRoles.stateWarning.icon,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: BTHWANI_SPACING.xl * 1.6, // ~64px equivalent
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: BTHWANI_SPACING.lg, // ~20px equivalent
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: BTHWANI_SPACING.md, // ~14px equivalent
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    lineHeight: BTHWANI_SPACING.lg, // ~20px equivalent
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
    fontSize: BTHWANI_SPACING.md + BTHWANI_SPACING.xs, // ~16px equivalent
    fontWeight: '700',
  },
  snackbar: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.xl * 2,
    start: BTHWANI_SPACING.lg,
    end: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: BTHWANI_SPACING.xs / 2 },
    shadowOpacity: 0.3,
    shadowRadius: BTHWANI_SPACING.sm,
    elevation: 8,
  },
  snackbarText: {
    flex: 1,
    fontSize: BTHWANI_SPACING.md, // ~14px equivalent
    color: semanticRoles.text,
    fontWeight: '500',
  },
  snackbarButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  snackbarButtonText: {
    fontSize: BTHWANI_SPACING.md, // ~14px equivalent
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
});

export default auto_esf_home_get;

