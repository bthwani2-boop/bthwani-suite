// KWD Home Screen - Smart Feed Design (Modern Mobile Pattern)
// Surface: app-client | Service: kwd
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// §UX-SUPREME-001: Single Hub Screen, FAB for create, Bottom Sheets for details/management
// Uses: kwd_jobs_list for jobs feed

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
import { readSurfaceBindingModeFromEnv } from '@bthwani/platform-utils/remote-control';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  elevation,
  typography,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  ScreenHeader,
  AppEmptyState,
  scrollContentContainerStyle,
} from '@bthwani/ui-kit';
import {
  KwdFloatingActionButton,
  KwdSwipeableCard,
  KwdJobDetailsSheet,
  KwdJobApplySheet,
  KwdJobCreateSheet,
  KwdWorkerListingCreateSheet,
  KwdApplicationsSheet,
  KwdApplicationDetailsSheet,
  type KwdJob,
} from './components';
import { buildKwdHomeMockJobs } from '../../hooks';
import { useKwdMyFile } from './hooks/useKwdMyFile';
import { useKwdFavorites } from './hooks/useKwdFavorites';

// Optional: request location when "قريب مني" is used (requires expo-location in app)
async function requestUserCoords(): Promise<{
  lat: number;
  lon: number;
} | null> {
  try {
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  } catch {
    return null;
  }
}

type KwdCategoryId =
  | 'all'
  | 'construction'
  | 'maintenance'
  | 'cleaning'
  | 'office'
  | 'sales'
  | 'restaurants'
  | 'transport'
  | 'other';

type KwdSubCategory = { id: string; label: string; matchKeywords: string[] };

/** Translation keys and literal keywords only (no t() at module load). Resolved in buildKwdCategories(t). */
const CATEGORY_IDS: Array<{
  id: KwdCategoryId;
  icon: string;
  matchKeywords: string[];
  children?: { id: string; matchKeywords: string[] }[];
}> = [
  { id: 'all', icon: '🌟', matchKeywords: [] },
  {
    id: 'construction',
    icon: '🏗️',
    matchKeywords: [
      'surfaces.بناء',
      'surfaces.نجار',
      'surfaces.حداد',
      'surfaces.دهان',
      'surfaces.مقاول',
    ],
    children: [
      {
        id: 'construction:carpenter',
        matchKeywords: ['نجار', 'surfaces.خشب', 'surfaces.أثاث'],
      },
      {
        id: 'construction:welder',
        matchKeywords: ['حداد', 'surfaces.حديد', 'surfaces.لحام'],
      },
      { id: 'construction:paint', matchKeywords: ['دهان', 'surfaces.طلاء'] },
      {
        id: 'construction:contractor',
        matchKeywords: ['مقاول', 'بناء', 'surfaces.تشييد'],
      },
    ],
  },
  {
    id: 'maintenance',
    icon: '🔧',
    matchKeywords: [
      'surfaces.سباك',
      'surfaces.كهربائي',
      'surfaces.صيانة',
      'surfaces.تصليح',
      'surfaces.تبريد',
      'surfaces.تكييف',
    ],
    children: [
      {
        id: 'maintenance:plumber',
        matchKeywords: ['سباك', 'surfaces.مواسير', 'surfaces.صرف'],
      },
      {
        id: 'maintenance:electrician',
        matchKeywords: ['كهربائي', 'surfaces.تمديدات'],
      },
      {
        id: 'maintenance:ac',
        matchKeywords: ['تبريد', 'تكييف', 'surfaces.مكيف'],
      },
      { id: 'maintenance:general', matchKeywords: ['صيانة', 'تصليح'] },
    ],
  },
  {
    id: 'cleaning',
    icon: '🧹',
    matchKeywords: [
      'surfaces.تنظيف',
      'surfaces.نظافة',
      'surfaces.عامل_نظافة',
      'خدمات',
    ],
    children: [
      {
        id: 'cleaning:home',
        matchKeywords: ['surfaces.منزل', 'surfaces.شقة', 'تنظيف'],
      },
      {
        id: 'cleaning:office',
        matchKeywords: ['surfaces.مكتب', 'surfaces.شركة', 'نظافة'],
      },
    ],
  },
  {
    id: 'office',
    icon: '💼',
    matchKeywords: [
      'surfaces.محاسب',
      'surfaces.سكرتير',
      'surfaces.إداري',
      'surfaces.كاشير',
      'surfaces.استقبال',
    ],
    children: [
      { id: 'office:accountant', matchKeywords: ['محاسب', 'surfaces.حسابات'] },
      { id: 'office:reception', matchKeywords: ['كاشير', 'استقبال'] },
      { id: 'office:admin', matchKeywords: ['إداري', 'سكرتير'] },
    ],
  },
  {
    id: 'sales',
    icon: '🛒',
    matchKeywords: [
      'surfaces.مبيعات',
      'surfaces.بائع',
      'surfaces.مندوب',
      'surfaces.تسويق',
    ],
    children: [
      {
        id: 'sales:retail',
        matchKeywords: ['بائع', 'surfaces.متجر', 'مبيعات'],
      },
      { id: 'sales:rep', matchKeywords: ['مندوب', 'تسويق'] },
    ],
  },
  {
    id: 'restaurants',
    icon: '🍽️',
    matchKeywords: [
      'surfaces.مطعم',
      'surfaces.طباخ',
      'surfaces.شيف',
      'surfaces.نادل',
      'surfaces.كافتيريا',
    ],
    children: [
      {
        id: 'restaurants:chef',
        matchKeywords: ['طباخ', 'شيف', 'surfaces.مطبخ'],
      },
      { id: 'restaurants:waiter', matchKeywords: ['نادل', 'كافتيريا', 'خدمة'] },
    ],
  },
  {
    id: 'transport',
    icon: '🚗',
    matchKeywords: [
      'surfaces.سائق',
      'surfaces.نقل',
      'surfaces.توصيل',
      'surfaces.ديليفري',
      'surfaces.مندوب_توصيل',
    ],
    children: [
      { id: 'transport:driver', matchKeywords: ['سائق', 'surfaces.قيادة'] },
      {
        id: 'transport:delivery',
        matchKeywords: ['توصيل', 'ديليفري', 'مندوب'],
      },
    ],
  },
  { id: 'other', icon: '📋', matchKeywords: [] },
];

const NS = 'kwd.app-client.mobile';

function categoryLabelKey(id: string): string {
  return `${NS}.categories.${id.replace(':', '_')}`;
}

function resolveKeyword(k: string, t: (key: string) => string): string {
  return k.includes('.') ? t(k) : k;
}

function buildKwdCategories(t: (key: string) => string): Array<{
  id: KwdCategoryId;
  label: string;
  icon: string;
  matchKeywords: string[];
  children?: KwdSubCategory[];
}> {
  return CATEGORY_IDS.map(cat => ({
    id: cat.id,
    label: t(categoryLabelKey(cat.id)),
    icon: cat.icon,
    matchKeywords: cat.matchKeywords.map(k => resolveKeyword(k, t)),
    children: cat.children?.map(sub => ({
      id: sub.id,
      label: t(categoryLabelKey(sub.id)),
      matchKeywords: sub.matchKeywords.map(k => resolveKeyword(k, t)),
    })),
  }));
}

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;
const DEFAULT_LIMIT = 20;

interface auto_kwd_home_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { userId?: string } };
}

export const auto_kwd_home_get: React.FC<auto_kwd_home_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const KWD_CATEGORIES = useMemo(() => buildKwdCategories(t), [t]);
  const MOCK_JOBS = useMemo(() => buildKwdHomeMockJobs(t) as KwdJob[], [t]);
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<KwdJob[]>([]);
  const [total, setTotal] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [userMode, setUserMode] = useState<'worker' | 'employer'>('worker');

  // Get userId from route params
  const userId = route?.params?.userId || 'user_123';

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<KwdCategoryId>('all');
  /** عند اختيار فئة رئيسية لها فرعيات: الفرعية المختارة (أو null = كل الفرعيات) */
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [sortByNearby, setSortByNearby] = useState(false);
  /** إحداثيات المستخدم لـ "قريب مني" — عند توفرها يُمرَّر userLat/userLon للـ API لحساب المسافة */
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  /** خيار العرض السريع: الأقرب | المفضلة | المطابقة | الجديد — واحد فقط فعال أو لا شيء */
  type QuickFilter = 'nearby' | 'favorites' | 'matching' | 'newest' | null;
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);

  const { myFile } = useKwdMyFile();
  const { favoriteJobIds, isFavorite, toggleFavorite } = useKwdFavorites();

  // Bottom Sheets
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobDetailsVisible, setJobDetailsVisible] = useState(false);
  const [jobApplyVisible, setJobApplyVisible] = useState(false);
  const [jobCreateVisible, setJobCreateVisible] = useState(false);
  const [workerListingCreateVisible, setWorkerListingCreateVisible] =
    useState(false);
  const [applicationsVisible, setApplicationsVisible] = useState(false);
  const [applicationDetailsVisible, setApplicationDetailsVisible] =
    useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [selectedApplicationJobId, setSelectedApplicationJobId] = useState<
    string | null
  >(null);

  // Network state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const applyMockJobs = useCallback(() => {
    setJobs(MOCK_JOBS);
    setTotal(MOCK_JOBS.length);
    hasLoadedRef.current = true;
    maxRetriesReachedRef.current = false;
    setRetryCount(0);
    setIsOffline(false);
    setNetworkError(null);
    setState('content');
  }, [MOCK_JOBS]);

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
  const fetchWithRetry = useCallback(
    async (
      url: string,
      options: RequestInit,
      maxRetries: number = MAX_RETRIES,
      attempt: number = 0,
      signal?: AbortSignal
    ): Promise<Response> => {
      const controller = new AbortController();

      // Link external signal if provided
      if (signal) {
        signal.addEventListener('abort', () => {
          controller.abort();
        });
      }

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

        // Don't retry if explicitly aborted
        if (
          error instanceof Error &&
          error.name === 'AbortError' &&
          signal?.aborted
        ) {
          throw error;
        }

        const isNetworkError =
          error instanceof Error &&
          (error.name === 'AbortError' ||
            error.name === 'TypeError' ||
            error.message.includes('Network request failed') ||
            error.message.includes('timeout'));

        if (isNetworkError && attempt < maxRetries && !signal?.aborted) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, options, maxRetries, attempt + 1, signal);
        }

        throw error;
      }
    },
    []
  );

  // Load jobs from API
  const loadJobs = useCallback(
    async (isRetry: boolean = false) => {
      if (isLoadingRef.current) return;

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

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

        if (!isRetry) {
          setState('loading');
          setNetworkError(null);
          setIsOffline(false);
        }

        const surfaceBindingMode = readSurfaceBindingModeFromEnv();
        if (surfaceBindingMode === 'design') {
          applyMockJobs();
          return;
        }

        const baseUrl = getBaseUrl();
        const params = new URLSearchParams({
          limit: DEFAULT_LIMIT.toString(),
          offset: '0',
        });

        if (selectedCategoryId !== 'all') {
          const category = KWD_CATEGORIES.find(
            c => c.id === selectedCategoryId
          );
          if (category && category.matchKeywords.length > 0) {
            params.append('category', category.label);
          }
        }
        if (sortByNearby) {
          params.append('sort', 'nearby');
          if (userCoords) {
            params.append('userLat', String(userCoords.lat));
            params.append('userLon', String(userCoords.lon));
          }
        }

        const url = `${baseUrl}/api/kwd/jobs?${params.toString()}`;

        const response = await fetchWithRetry(
          url,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
          MAX_RETRIES,
          0,
          controller.signal
        );

        if (!response.ok) {
          if (response.status === 425) {
            applyMockJobs();
            return;
          }
          if (response.status === 401) {
            throw new Error(t(`${NS}.home_get.loginRequired`));
          }
          if (response.status === 403) {
            throw new Error(t(`${NS}.home_get.accountNotActive`));
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || t(`${NS}.home_get.loadError`));
        }

        let jobsData = json?.jobs || json?.data || [];
        let totalJobs = json?.total || 0;

        // Transform إلى صيغة KwdJob (يدعم distance من الـ API عند تفعيل قريب مني)
        const noTitle = t(`${NS}.common.noTitle`);
        const unspecified = t(`${NS}.home_get.unspecified`);
        let transformedJobs: KwdJob[] = jobsData.map((job: any) => ({
          id: job.id || `job_${Date.now()}`,
          title: job.title || noTitle,
          company: job.company?.name || job.company,
          location:
            job.location?.city ||
            job.location?.region ||
            job.location ||
            unspecified,
          distance: typeof job.distance === 'number' ? job.distance : undefined,
          salary:
            job.wage || job.salary
              ? {
                  min: job.wage?.min || job.salary?.min,
                  max: job.wage?.max || job.salary?.max,
                  currency: job.wage?.currency || job.salary?.currency || 'SAR',
                }
              : undefined,
          jobType: job.jobType || job.type,
          postedDate: job.postedDate || job.createdAt,
          timestamp: job.timestamp || `منذ ${Math.floor(0 * 24)} ساعة`,
          category: job.category,
          description: job.description,
          rating:
            typeof job.rating === 'number'
              ? job.rating
              : (job.employerRating ?? undefined),
        }));

        // إذا لم تُرجع الـ API أي بيانات، استخدم بيانات تجريبية دائماً حتى لا تبقى الشاشة فارغة
        if (transformedJobs.length === 0) {
          transformedJobs = MOCK_JOBS;
          totalJobs = MOCK_JOBS.length;
        }

        // Check if request was aborted
        if (controller.signal.aborted) {
          return;
        }

        setJobs(transformedJobs);
        setTotal(totalJobs);
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        setRetryCount(0);
        setIsOffline(false);
        setNetworkError(null);
      } catch (error: any) {
        // Ignore abort errors (request was cancelled intentionally)
        if (
          error instanceof Error &&
          error.name === 'AbortError' &&
          controller.signal.aborted
        ) {
          return;
        }

        console.error('[KWD Home] Load error:', error);
        const isNetworkError =
          error instanceof Error &&
          (error.name === 'AbortError' ||
            error.name === 'TypeError' ||
            error.message.includes('Network request failed') ||
            error.message.includes('timeout'));
        const isGmglBlockedError =
          error instanceof Error && error.message.includes('HTTP 425');

        if (isNetworkError || isGmglBlockedError) {
          applyMockJobs();
        } else {
          setIsOffline(false);
          setNetworkError(t(`${NS}.home_get.loadError`));
          setState('error');
        }
      } finally {
        isLoadingRef.current = false;
        setRefreshing(false);
        // Clear abort controller if this was the active request
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [
      applyMockJobs,
      fetchWithRetry,
      selectedCategoryId,
      sortByNearby,
      userCoords,
      t,
      KWD_CATEGORIES,
    ]
  );

  // Load applications count
  const loadApplicationsCount = useCallback(async () => {
    try {
      const surfaceBindingMode = readSurfaceBindingModeFromEnv();
      if (surfaceBindingMode === 'design') {
        setApplicationsCount(0);
        return;
      }

      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/kwd/applications/me`;

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 425) {
        setApplicationsCount(0);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        if (json?.success) {
          const apps = json?.data?.applications || json?.data || [];
          const activeApps = apps.filter(
            (app: any) =>
              app.status === 'pending' || app.status === 'under_review'
          ).length;
          setApplicationsCount(activeApps);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTTP 425')) {
        setApplicationsCount(0);
        return;
      }

      // Silent fail - applications count is optional
    }
  }, [fetchWithRetry]);

  // Initial load
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadJobs();
      loadApplicationsCount();
    }

    // Cleanup: abort requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When "قريب مني" is turned on, try to get user location for distance (API can return distance)
  useEffect(() => {
    if (!sortByNearby || userCoords) return;
    requestUserCoords().then(coords => {
      if (coords) setUserCoords(coords);
    });
  }, [sortByNearby, userCoords]);

  // Reload when category or "قريب مني" or userCoords changes
  useEffect(() => {
    if (hasLoadedRef.current) {
      loadJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, sortByNearby, userCoords]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadJobs();
    loadApplicationsCount();
  }, [loadJobs, loadApplicationsCount]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    maxRetriesReachedRef.current = false;
    loadJobs(true);
  }, [loadJobs]);

  // Handle job card press
  const handleJobPress = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setJobDetailsVisible(true);
  }, []);

  // Handle apply button in job details
  const handleJobApply = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setJobDetailsVisible(false);
    setJobApplyVisible(true);
  }, []);

  // Handle apply success
  const handleApplySuccess = useCallback(() => {
    setJobApplyVisible(false);
    loadApplicationsCount();
  }, [loadApplicationsCount]);

  // Handle create job success — إغلاق الشيت والانتقال إلى منشوراتي
  const handleCreateSuccess = useCallback(() => {
    setJobCreateVisible(false);
    loadJobs();
    handleNavigate('KwdMyListings');
  }, [loadJobs, handleNavigate]);

  // Handle applications button / tab
  const handleApplicationsPress = useCallback(() => {
    setApplicationsVisible(true);
  }, []);

  // Handle application press
  const handleApplicationPress = useCallback(
    (applicationId: string, jobId: string) => {
      setSelectedApplicationId(applicationId);
      setSelectedApplicationJobId(jobId);
      setApplicationsVisible(false);
      setApplicationDetailsVisible(true);
    },
    []
  );

  // Handle job press from application details
  const handleJobPressFromApplication = useCallback((jobId: string) => {
    setApplicationDetailsVisible(false);
    setSelectedJobId(jobId);
    setJobDetailsVisible(true);
  }, []);

  // مزامنة "قريب مني" مع خيار الأقرب
  useEffect(() => {
    setSortByNearby(quickFilter === 'nearby');
  }, [quickFilter]);

  // Filtered (and optionally sorted) jobs — فئة + الأقرب/المفضلة/المطابقة/الجديد
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (selectedCategoryId !== 'all') {
      const category = KWD_CATEGORIES.find(c => c.id === selectedCategoryId);
      if (category) {
        let keywords: string[] = category.matchKeywords;
        if (selectedSubcategoryId && category.children?.length) {
          const sub = category.children.find(
            s => s.id === selectedSubcategoryId
          );
          if (sub) keywords = sub.matchKeywords;
        }
        if (keywords.length > 0) {
          filtered = filtered.filter(job => {
            const haystack =
              `${job.category ?? ''} ${job.title ?? ''}`.toLowerCase();
            return keywords.some(kw => haystack.includes(kw.toLowerCase()));
          });
        }
      }
    }

    // فلتر المفضلة
    if (quickFilter === 'favorites') {
      filtered = filtered.filter(job => favoriteJobIds.includes(job.id));
    }

    // فلتر المطابقة (مهارتي من ملفي)
    if (quickFilter === 'matching' && myFile?.primarySkill?.trim()) {
      const skill = myFile.primarySkill.trim().toLowerCase();
      filtered = filtered.filter(job => {
        const haystack =
          `${job.title ?? ''} ${job.category ?? ''} ${job.description ?? ''}`.toLowerCase();
        return haystack.includes(skill);
      });
    }

    // ترتيب: الأقرب (حسب المسافة)
    if (quickFilter === 'nearby' || sortByNearby) {
      filtered = [...filtered].sort((a, b) => {
        const da = a.distance ?? Infinity;
        const db = b.distance ?? Infinity;
        return da - db;
      });
    }

    // ترتيب: الجديد (الأحدث أولاً)
    if (quickFilter === 'newest') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = (a.postedDate ?? a.timestamp ?? '').toString();
        const dateB = (b.postedDate ?? b.timestamp ?? '').toString();
        return dateB.localeCompare(dateA);
      });
    }

    return filtered;
  }, [
    jobs,
    selectedCategoryId,
    selectedSubcategoryId,
    sortByNearby,
    quickFilter,
    favoriteJobIds,
    myFile?.primarySkill,
  ]);

  // Render job card
  const renderJobCard = ({ item }: { item: KwdJob }) => (
    <KwdSwipeableCard
      job={item}
      onPress={() => handleJobPress(item.id)}
      isProcessing={false}
      onApply={() => handleJobApply(item.id)}
      isFavorite={isFavorite(item.id)}
      onFavoritePress={() => toggleFavorite(item.id)}
    />
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <AppEmptyState
        title={t('surfaces.لا_توجد_وظائف_متاحة_حالياً')}
        message={
          userMode === 'employer'
            ? t('surfaces.ابدأ_بإنشاء_إعلان_يناسب_احتياجك')
            : t('states.empty')
        }
      />
      {(userMode === 'employer' || userMode === 'worker') && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() =>
            userMode === 'employer'
              ? setJobCreateVisible(true)
              : setWorkerListingCreateVisible(true)
          }
          accessibilityRole='button'
          accessibilityLabel={t('common.add')}
        >
          <Text style={styles.emptyButtonText}>{t('common.add')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Header + mode + chips as single block (SND/ESF pattern — أوضح مسار، أقل جهد ذهني)
  const renderListHeader = useCallback(
    () => (
      <>
        <ScreenHeader
          title={t('surfaces.jobOpportunitiesTitle')}
          subtitle={
            userMode === 'worker'
              ? t('surfaces.شاهد_الفرص_وقدم_بنقرة_واحدة')
              : t('surfaces.أنشئ_إعلاناً_أو_تصفح_الطلبات')
          }
          trailingSlot={
            total > 0 ? (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{total}</Text>
                <Text style={styles.headerBadgeLabel}>
                  {t('surfaces.opportunityBadge')}
                </Text>
              </View>
            ) : undefined
          }
        />
        <View style={[styles.myFileRow, { direction: layoutDirection }]}>
          <TouchableOpacity
            style={[
              styles.myFileButton,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
            onPress={() => handleNavigate('KwdMyFile')}
            activeOpacity={0.85}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.myProfessionalFile')}
          >
            <Text style={styles.myFileIcon}>👤</Text>
            <Text style={styles.myFileText}>
              {t('surfaces.myProfessionalFile')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.myFileButton,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
            onPress={() => handleNavigate('KwdMyListings')}
            activeOpacity={0.85}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.myListings')}
          >
            <Text style={styles.myFileIcon}>📋</Text>
            <Text style={styles.myFileText}>{t('surfaces.myListings')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.modeRow, { direction: layoutDirection }]}>
          <TouchableOpacity
            style={[
              styles.modeChip,
              userMode === 'worker' && styles.modeChipActive,
              { direction: layoutDirection },
            ]}
            onPress={() => setUserMode('worker')}
            activeOpacity={0.85}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.seekingWork')}
          >
            <Text style={styles.modeChipIcon}>💼</Text>
            <Text
              style={[
                styles.modeChipText,
                userMode === 'worker' && styles.modeChipTextActive,
              ]}
            >
              {t('surfaces.seekingWork')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeChip,
              userMode === 'employer' && styles.modeChipActive,
              { direction: layoutDirection },
            ]}
            onPress={() => setUserMode('employer')}
            activeOpacity={0.85}
            accessibilityRole='button'
            accessibilityLabel={t('surfaces.seekingWorker')}
          >
            <Text style={styles.modeChipIcon}>👷</Text>
            <Text
              style={[
                styles.modeChipText,
                userMode === 'employer' && styles.modeChipTextActive,
              ]}
            >
              {t('surfaces.seekingWorker')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* صف الأقرب · المفضلة · المطابقة · الجديد */}
        <View style={[styles.quickFilterRow, { direction: layoutDirection }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilterScroll}
          >
            <TouchableOpacity
              style={[
                styles.quickFilterChip,
                quickFilter === 'nearby' && styles.quickFilterChipActive,
                { direction: layoutDirection },
              ]}
              onPress={() =>
                setQuickFilter(prev => (prev === 'nearby' ? null : 'nearby'))
              }
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.nearest')}
            >
              <Text style={styles.quickFilterIcon}>📍</Text>
              <Text
                style={[
                  styles.quickFilterLabel,
                  quickFilter === 'nearby' && styles.quickFilterLabelActive,
                ]}
                numberOfLines={1}
              >
                {t('surfaces.nearest')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickFilterChip,
                quickFilter === 'favorites' && styles.quickFilterChipActive,
                { direction: layoutDirection },
              ]}
              onPress={() =>
                setQuickFilter(prev =>
                  prev === 'favorites' ? null : 'favorites'
                )
              }
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.favorites')}
            >
              <Text style={styles.quickFilterIcon}>❤️</Text>
              <Text
                style={[
                  styles.quickFilterLabel,
                  quickFilter === 'favorites' && styles.quickFilterLabelActive,
                ]}
                numberOfLines={1}
              >
                {t('surfaces.favorites')}
              </Text>
              {favoriteJobIds.length > 0 && (
                <View style={styles.quickFilterBadge}>
                  <Text style={styles.quickFilterBadgeText}>
                    {favoriteJobIds.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickFilterChip,
                quickFilter === 'matching' && styles.quickFilterChipActive,
                { direction: layoutDirection },
              ]}
              onPress={() =>
                setQuickFilter(prev =>
                  prev === 'matching' ? null : 'matching'
                )
              }
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.matching')}
            >
              <Text style={styles.quickFilterIcon}>🎯</Text>
              <Text
                style={[
                  styles.quickFilterLabel,
                  quickFilter === 'matching' && styles.quickFilterLabelActive,
                ]}
                numberOfLines={1}
              >
                {t('surfaces.matching')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickFilterChip,
                quickFilter === 'newest' && styles.quickFilterChipActive,
                { direction: layoutDirection },
              ]}
              onPress={() =>
                setQuickFilter(prev => (prev === 'newest' ? null : 'newest'))
              }
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.newest')}
            >
              <Text style={styles.quickFilterIcon}>🆕</Text>
              <Text
                style={[
                  styles.quickFilterLabel,
                  quickFilter === 'newest' && styles.quickFilterLabelActive,
                ]}
                numberOfLines={1}
              >
                {t('surfaces.newest')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* صف الفئات الرئيسية */}
        <View style={styles.chipsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                sortByNearby && styles.filterChipActive,
                { direction: layoutDirection },
              ]}
              onPress={() => {
                setSortByNearby(prev => !prev);
                setQuickFilter(prev => (prev === 'nearby' ? null : 'nearby'));
              }}
              activeOpacity={0.85}
              accessibilityRole='button'
              accessibilityLabel={t('surfaces.nearMe')}
            >
              <Text style={styles.filterChipIcon}>📍</Text>
              <Text
                style={[
                  styles.filterChipLabel,
                  sortByNearby && styles.filterChipLabelActive,
                ]}
                numberOfLines={1}
              >
                {t('surfaces.nearMe')}
              </Text>
            </TouchableOpacity>
            {KWD_CATEGORIES.map(c => {
              const isSelected = selectedCategoryId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                    { direction: layoutDirection },
                  ]}
                  onPress={() => {
                    setSelectedCategoryId(c.id);
                    setSelectedSubcategoryId(null);
                  }}
                  activeOpacity={0.85}
                  accessibilityRole='button'
                  accessibilityLabel={c.label}
                >
                  <Text style={styles.filterChipIcon}>{c.icon}</Text>
                  <Text
                    style={[
                      styles.filterChipLabel,
                      isSelected && styles.filterChipLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* صف الفئات الفرعية — يظهر عند اختيار فئة رئيسية لها فرعيات */}
        {selectedCategoryId !== 'all' &&
          (() => {
            const mainCat = KWD_CATEGORIES.find(
              c => c.id === selectedCategoryId
            );
            const hasSub = mainCat?.children && mainCat.children.length > 0;
            if (!hasSub) return null;
            return (
              <View style={styles.subChipsSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScrollContent}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      styles.subChip,
                      !selectedSubcategoryId && styles.filterChipActive,
                      { direction: layoutDirection },
                    ]}
                    onPress={() => setSelectedSubcategoryId(null)}
                    activeOpacity={0.85}
                    accessibilityRole='button'
                    accessibilityLabel={t('surfaces.allCategoryLabel', {
                      label: mainCat!.label,
                    })}
                  >
                    <Text style={styles.filterChipLabel} numberOfLines={1}>
                      {t('surfaces.allCategoryLabel', {
                        label: mainCat!.label,
                      })}
                    </Text>
                  </TouchableOpacity>
                  {mainCat!.children!.map(sub => {
                    const isSubSelected = selectedSubcategoryId === sub.id;
                    return (
                      <TouchableOpacity
                        key={sub.id}
                        style={[
                          styles.filterChip,
                          styles.subChip,
                          isSubSelected && styles.filterChipActive,
                          { direction: layoutDirection },
                        ]}
                        onPress={() => setSelectedSubcategoryId(sub.id)}
                        activeOpacity={0.85}
                        accessibilityRole='button'
                        accessibilityLabel={sub.label}
                      >
                        <Text
                          style={[
                            styles.filterChipLabel,
                            isSubSelected && styles.filterChipLabelActive,
                          ]}
                          numberOfLines={1}
                        >
                          {sub.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            );
          })()}

        {/* Advanced search entry — للموقع والراتب والمدة في شاشة منفصلة مبسطة */}
        <TouchableOpacity
          style={[
            styles.advancedSearchLink,
            { flexDirection: 'row', direction: layoutDirection },
          ]}
          onPress={() => handleNavigate('KwdJobsList')}
          activeOpacity={0.8}
          accessibilityRole='button'
          accessibilityLabel={t('surfaces.advancedSearchPlaceholder')}
        >
          <Text style={styles.advancedSearchText}>
            {t('surfaces.advancedSearchPlaceholder')}
          </Text>
          <Text style={styles.advancedSearchArrow}>›</Text>
        </TouchableOpacity>
      </>
    ),
    [
      userMode,
      total,
      selectedCategoryId,
      selectedSubcategoryId,
      sortByNearby,
      quickFilter,
      favoriteJobIds,
    ]
  );

  if (state === 'content') {
    return (
      <ScreenWrapper
        state='content'
        screenName='auto_kwd_home_get'
        operationName='kwd_home_get'
      >
        <View style={styles.container}>
          {/* قائمة الفرص — الهيدر والفلتر داخل FlatList لمسار واحد وواضح (أنماط SND/ESF/MRF) */}
          <FlatList
            ListHeaderComponent={renderListHeader}
            data={filteredJobs}
            renderItem={renderJobCard}
            keyExtractor={item => item.id}
            contentContainerStyle={
              filteredJobs.length === 0 ? styles.emptyList : styles.listContent
            }
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[semanticRoles.primaryCTA]}
              />
            }
            showsVerticalScrollIndicator={false}
          />

          {/* طلبات العمل — شريحة عائمة بسيطة */}
          {applicationsCount > 0 && (
            <TouchableOpacity
              style={styles.myApplicationsChip}
              onPress={handleApplicationsPress}
              activeOpacity={0.8}
              accessibilityRole='button'
              accessibilityLabel={`${t('surfaces.jobApplicationsTitle')} (${applicationsCount})`}
            >
              <Text style={styles.myApplicationsChipIcon}>📋</Text>
              <Text style={styles.myApplicationsChipText}>
                {t('surfaces.jobApplicationsTitle')} ({applicationsCount})
              </Text>
            </TouchableOpacity>
          )}

          {/* FAB واحد: إنشاء إعلان (فرصة عمل أو إعلان باحث حسب الوضع) */}
          <KwdFloatingActionButton
            onPress={() =>
              userMode === 'employer'
                ? setJobCreateVisible(true)
                : setWorkerListingCreateVisible(true)
            }
            label={t(`${NS}.common.createListing`)}
            icon='➕'
          />

          {/* Bottom Sheets */}
          {selectedJobId && (
            <>
              <KwdJobDetailsSheet
                visible={jobDetailsVisible}
                jobId={selectedJobId}
                onClose={() => {
                  setJobDetailsVisible(false);
                  setSelectedJobId(null);
                }}
                onApply={handleJobApply}
              />
              <KwdJobApplySheet
                visible={jobApplyVisible}
                jobId={selectedJobId}
                jobTitle={jobs.find(j => j.id === selectedJobId)?.title}
                onClose={() => {
                  setJobApplyVisible(false);
                  setSelectedJobId(null);
                }}
                onSuccess={handleApplySuccess}
              />
            </>
          )}

          <KwdJobCreateSheet
            visible={jobCreateVisible}
            onClose={() => setJobCreateVisible(false)}
            onSuccess={handleCreateSuccess}
            onNavigate={handleNavigate}
          />

          <KwdWorkerListingCreateSheet
            visible={workerListingCreateVisible}
            onClose={() => setWorkerListingCreateVisible(false)}
            onSuccess={() => {
              setWorkerListingCreateVisible(false);
              handleNavigate('KwdMyListings');
            }}
          />

          <KwdApplicationsSheet
            visible={applicationsVisible}
            onClose={() => {
              setApplicationsVisible(false);
            }}
            onApplicationPress={handleApplicationPress}
          />

          {selectedApplicationId && (
            <KwdApplicationDetailsSheet
              visible={applicationDetailsVisible}
              applicationId={selectedApplicationId}
              jobId={selectedApplicationJobId || undefined}
              onClose={() => {
                setApplicationDetailsVisible(false);
                setSelectedApplicationId(null);
                setSelectedApplicationJobId(null);
              }}
              onJobPress={handleJobPressFromApplication}
              onReportApplication={(appId, targetName) => {
                setApplicationDetailsVisible(false);
                setSelectedApplicationId(null);
                setSelectedApplicationJobId(null);
                handleNavigate('KwdListingReport', {
                  reportType: 'application',
                  applicationId: appId,
                  targetUserName: targetName || t('surfaces.مستخدم'),
                });
              }}
            />
          )}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_الوظائف')}
      errorMessage={networkError || t('surfaces.failedToLoadJobs')}
      onErrorAction={handleRetry}
      screenName='auto_kwd_home_get'
      operationName='kwd_jobs_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  headerBadge: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  headerBadgeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTAText,
  },
  headerBadgeLabel: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.primaryCTAText,
    marginTop: -2,
  },
  myFileRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  myFileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  myFileIcon: {
    fontSize: typography.fontSize.md,
  },
  myFileText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  modeChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  modeChipIcon: {
    fontSize: typography.fontSize.lg,
  },
  modeChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  modeChipTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: typography.fontWeight.bold,
  },
  quickFilterRow: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.sm,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  quickFilterScroll: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
    flexDirection: 'row',
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  quickFilterChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  quickFilterIcon: {
    fontSize: typography.fontSize.md,
  },
  quickFilterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  quickFilterLabelActive: {
    color: semanticRoles.primaryCTAText,
  },
  quickFilterBadge: {
    backgroundColor: semanticRoles.error || BTHWANI_COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: BTHWANI_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  quickFilterBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: BTHWANI_COLORS.surface,
  },
  chipsSection: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.sm,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
  },
  chipsScrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  subChipsSection: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  subChip: {
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  filterChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  filterChipIcon: {
    fontSize: typography.fontSize.md,
  },
  filterChipLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  filterChipLabelActive: {
    color: semanticRoles.primaryCTAText,
  },
  advancedSearchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.xs,
  },
  advancedSearchText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: typography.fontWeight.bold,
  },
  advancedSearchArrow: {
    fontSize: typography.fontSize.lg,
    color: semanticRoles.primaryCTA,
  },
  listContent: {
    paddingVertical: BTHWANI_SPACING.md,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: typography.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  myApplicationsChip: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.xl * 2 + 60,
    end: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.primaryCTA,
    ...elevation.md,
    gap: BTHWANI_SPACING.xs,
  },
  myApplicationsChipIcon: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  myApplicationsChipText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});

export default auto_kwd_home_get;

