// MRF Home Screen - Lost & Found Service (ESF-Inspired Design)
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Smart Feed Design (Modern Mobile Pattern) - Based on ESF

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import { readSurfaceBindingModeFromEnv } from '@bthwani/platform-utils/remote-control';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';
import {
  MrfFloatingActionButton,
  MrfFilterChipsBar,
  MrfSwipeableCard,
  MrfReportMiniDetailsSheet,
  MrfReportQuickComposeSheet,
  MrfCriticalReportPopup,
  MrfNotificationBadge,
  type MrfReport,
} from './components';
import { MrfBottomSheet } from './components/MrfBottomSheet';
import { buildMrfHomeReportsListMock } from '../../fixtures/homeReports';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_home_getProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

export const auto_mrf_home_get: React.FC<auto_mrf_home_getProps> = ({
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
  const [lastClaimedReport, setLastClaimedReport] = useState<MrfReport | null>(null);

  // Notification system
  const [unreadReportsIds, setUnreadReportsIds] = useState<Set<string>>(new Set());
  const [criticalPopupReport, setCriticalPopupReport] = useState<MrfReport | null>(null);
  const [shownCriticalReports, setShownCriticalReports] = useState<Set<string>>(new Set());

  // Service flags - check if MRF service is enabled
  const [serviceEnabled, setServiceEnabled] = useState<boolean | null>(null);
  const [serviceFlagsError, setServiceFlagsError] = useState<string | null>(null);
  
  // Network and connection state
  const [isOffline, setIsOffline] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Refs to prevent infinite loops
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const maxRetriesReachedRef = useRef(false);

  // Filters
  const [filterReportType, setFilterReportType] = useState<'missing' | 'found' | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'resolved' | 'closed' | 'all'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'low' | 'medium' | 'high' | 'all'>('all');
  const [showReportTypePicker, setShowReportTypePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Search scope and radius
  const [searchScope, setSearchScope] = useState<'city' | 'radius' | 'all'>('city');
  const [searchRadius, setSearchRadius] = useState<number>(5); // Default 5 km
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showSearchScopePicker, setShowSearchScopePicker] = useState(false);

  // User location (should come from user context/API)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 24.7136,
    lng: 46.6753, // Riyadh coordinates
  });
  
  // Initialize userCoordinates from userLocation when component mounts
  useEffect(() => {
    if (userLocation && !userCoordinates) {
      setUserCoordinates(userLocation);
    }
  }, [userLocation]);

  // API data - loaded from backend
  const [allReports, setAllReports] = useState<MrfReport[]>([]);

  // Check service flags on startup
  useEffect(() => {
    let isMounted = true;
    const checkServiceFlags = async () => {
      if (!isMounted) return;
      try {
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/config/service-flags`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await rawFetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (!isMounted) return;

        if (!response.ok) {
          setServiceEnabled(true); // Default to enabled
          return;
        }

        const data = await response.json();
        if (!isMounted) return;

        const mrfEnabled = data?.services?.mrf?.enabled ?? true;
        setServiceEnabled(mrfEnabled);
        setIsOffline(false);

        if (!mrfEnabled) {
          setServiceFlagsError(t('surfaces.خدمة_MRF_معطلة_حالياً'));
        } else {
          setServiceFlagsError(null);
        }
      } catch (error) {
        if (!isMounted) return;
        setServiceEnabled(true); // Default to enabled on error
      }
    };

    checkServiceFlags();
    return () => { isMounted = false; };
  }, []);

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
    if (filterLocation) {
      filtered = filtered.filter(r => 
        r.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }
    if (filterCategory) {
      // Assuming reports have category field
      filtered = filtered.filter(r => 
        (r as any).category?.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    // Sort by urgency (high first), then by timestamp (newest first)
    filtered.sort((a, b) => {
      const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;
      return 0; // Keep original order if urgency is equal
    });

    return filtered;
  }, [allReports, filterReportType, filterStatus, filterUrgency, filterLocation, filterCategory]);

  // Calculate unread reports count
  const unreadReportsCount = useMemo(() => {
    return filteredReports.filter(req => 
      unreadReportsIds.has(req.id) && req.status === 'active'
    ).length;
  }, [filteredReports, unreadReportsIds]);

  // Check for critical reports that need popup (<2km + high urgency)
  useEffect(() => {
    if (criticalPopupReport) return;

    const criticalReport = filteredReports.find(req => {
      const isHighUrgency = req.urgency === 'high';
      const isClose = req.distance !== undefined && req.distance < 2;
      const notShownBefore = !shownCriticalReports.has(req.id);
      const isActive = req.status === 'active';
      
      return isHighUrgency && isClose && notShownBefore && isActive;
    });

    if (criticalReport) {
      setCriticalPopupReport(criticalReport);
      setShownCriticalReports(prev => new Set([...prev, criticalReport.id]));
    }
  }, [filteredReports, criticalPopupReport, shownCriticalReports]);

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
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const loadData = useCallback(async (isRetry: boolean = false) => {
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

    const surfaceBindingMode = readSurfaceBindingModeFromEnv();

    try {
      isLoadingRef.current = true;
      
      if (!isRetry) {
        setState('loading');
        setNetworkError(null);
        setIsOffline(false);
      }

      if (surfaceBindingMode === 'design') {
        const mockReports = buildMrfHomeReportsListMock(t);
        setAllReports(mockReports);
        setUnreadReportsIds(prev => {
          const newSet = new Set(prev);
          mockReports.forEach((req: MrfReport) => {
            if (req.status === 'active') {
              newSet.add(req.id);
            }
          });
          return newSet;
        });
        setIsOffline(false);
        setNetworkError(null);
        setRetryCount(0);
        setState('content');
        hasLoadedRef.current = true;
        maxRetriesReachedRef.current = false;
        isLoadingRef.current = false;
        return;
      }
      
      const baseUrl = getBaseUrl();
      // Use mrf_reports_list (dedicated operation) - same pattern as ESF
      // Note: entity_activity_get endpoint is not available in backend, so we use mrf_reports_list
      
      // Build query parameters with search scope support
      const params = new URLSearchParams({
        limit: '100',
        offset: '0',
      });

      // Add search scope parameters
      if (searchScope === 'radius' && userCoordinates) {
        params.append('lat', userCoordinates.lat.toString());
        params.append('lng', userCoordinates.lng.toString());
        params.append('radius', searchRadius.toString());
        params.append('searchScope', 'radius');
      } else if (searchScope === 'city' && filterLocation) {
        params.append('location', filterLocation);
        params.append('searchScope', 'city');
      } else {
        params.append('searchScope', 'all');
      }

      // Add other filters
      if (filterReportType !== 'all') {
        params.append('reportType', filterReportType);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const url = `${baseUrl}/api/mrf/reports?${params.toString()}`;

      console.log(`[MRF Home] Loading data from: ${url} (mrf_reports_list)`);

      let reportsResponse: Response;
      try {
        reportsResponse = await fetchWithRetry(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        console.log(`[MRF Home] Response status: ${reportsResponse.status}`);
      } catch (fetchError: any) {
        console.error(`[MRF Home] Fetch error:`, fetchError);
        throw fetchError;
      }

      if (!reportsResponse.ok) {
        console.error(`[MRF Home] HTTP error: ${reportsResponse.status} ${reportsResponse.statusText}`);
        
        if (reportsResponse.status === 401 || reportsResponse.status === 403) {
          setNetworkError('يرجى تسجيل الدخول للوصول إلى هذه الصفحة');
          setState('error');
          setIsOffline(false);
          return;
        }

        if (reportsResponse.status === 503) {
          try {
            const errorData = await reportsResponse.json();
            console.error(`[MRF Home] Service disabled:`, errorData);
            if (errorData?.error_code === 'SERVICE_DISABLED' || errorData?.error?.includes('disabled')) {
              setServiceEnabled(false);
              setServiceFlagsError('خدمة MRF معطلة حالياً');
              setState('error');
              setIsOffline(false);
              return;
            }
          } catch (parseError) {
            console.error(`[MRF Home] Failed to parse 503 error:`, parseError);
            setServiceEnabled(false);
            setServiceFlagsError('خدمة MRF معطلة حالياً');
            setState('error');
            setIsOffline(false);
            return;
          }
        }

        let errorMessage = `HTTP ${reportsResponse.status}`;
        try {
          const errorData = await reportsResponse.json();
          console.error(`[MRF Home] Error response:`, errorData);
          errorMessage = errorData?.error || errorData?.message || errorData?.error_code || errorMessage;
        } catch (parseError) {
          console.error(`[MRF Home] Failed to parse error response:`, parseError);
          // Ignore
        }
        throw new Error(errorMessage);
      }

      setIsOffline(false);
      setNetworkError(null);
      setRetryCount(0);

      const reportsJson = await reportsResponse.json();
      console.log(`[MRF Home] Parsed response:`, { success: reportsJson?.success, hasData: !!reportsJson?.data, reportsCount: reportsJson?.data?.reports?.length || 0 });

      if (!reportsJson?.success) {
        const errorMsg = reportsJson?.error || reportsJson?.message || t('surfaces.فشل_في_تحميل_البلاغات');
        console.error(`[MRF Home] API returned success=false:`, errorMsg);
        throw new Error(errorMsg);
      }

      // Transform mrf_reports_list response to MrfReport format
      // mrf_reports_list returns: { success: true, data: { reports: [...], total: number } }
      const reportsData = reportsJson?.data?.reports || reportsJson?.data || [];
      console.log(`[MRF Home] Parsed reports: ${reportsData.length}`);

      const transformedReports: MrfReport[] = reportsData.map((req: any) => {
        // Calculate distance if location available
        let distance: number | undefined;
        if (userLocation && req.location?.coordinates?.lat && req.location?.coordinates?.lng) {
          const lat1 = userLocation.lat;
          const lng1 = userLocation.lng;
          const lat2 = req.location.coordinates.lat;
          const lng2 = req.location.coordinates.lng;
          // Simple distance calculation (Haversine would be better)
          distance = Math.sqrt(
            Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
          ) * 111; // Approximate km
        }

        // Format timestamp
        let timestamp = t('surfaces.الآن');
        if (req.reportedAt || req.createdAt) {
          const created = new Date(req.reportedAt || req.createdAt);
          const now = new Date();
          const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
          if (diffMinutes < 1) timestamp = t('mrf.app-client.mobile.auto_mrf_home_get.timestampNow');
          else if (diffMinutes < 60) timestamp = `منذ ${diffMinutes} دقيقة`;
          else if (diffMinutes < 1440) timestamp = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
          else timestamp = `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
        }

        // Extract location
        let location = t('surfaces.موقع_غير_محدد');
        if (req.location) {
          if (typeof req.location === 'string') {
            location = req.location;
          } else if (req.location.city && req.location.region) {
            location = `${req.location.city}، ${req.location.region}`;
          } else if (req.location.city) {
            location = req.location.city;
          } else if (req.location.region) {
            location = req.location.region;
          } else if (req.location.address) {
            location = req.location.address;
          }
        }

        const transformedReport = {
          id: req.id || req.reportId || req.report_id || `RPT-${Date.now()}-${0}`,
          title: req.title || t('mrf.app-client.mobile.auto_mrf_home_get.reportNoTitle'),
          reportType: (req.reportType || req.report_type || 'missing').toLowerCase() as 'missing' | 'found',
          status: (req.status || 'active').toLowerCase() as 'active' | 'resolved' | 'closed',
          location,
          timestamp,
          urgency: (req.urgency || req.priority || 'medium').toLowerCase() as 'low' | 'medium' | 'high',
          distance,
          attachments: req.attachments || [],
          category: (req.category || req.categoryId || '') as string,
        };
        
        // Debug: Log attachments if available
        if (transformedReport.attachments && transformedReport.attachments.length > 0) {
          console.log(`[MRF Home] Report ${transformedReport.id} has ${transformedReport.attachments.length} attachments:`, transformedReport.attachments);
        }
        
        return transformedReport;
      });

      console.log(`[MRF Home] Transformed reports: ${transformedReports.length}`);
      setAllReports(transformedReports);

      // Mark all current reports as unread initially
      setUnreadReportsIds(prev => {
        const newSet = new Set(prev);
        transformedReports.forEach((req: MrfReport) => {
          if (req.status === 'active') {
            newSet.add(req.id);
          }
        });
        return newSet;
      });

      console.log(`[MRF Home] Data loaded successfully`);
      setState('content');
      hasLoadedRef.current = true;
      maxRetriesReachedRef.current = false;
    } catch (error: any) {
      console.error(`[MRF Home] Load error:`, error);
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      console.error(`[MRF Home] Load error: [${error}] isNetworkError: ${isNetworkError}`);

      if (isNetworkError) {
        setIsOffline(true);
        setNetworkError('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.');
        
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);

        if (surfaceBindingMode === 'partial') {
          console.warn(
            '[MRF Home] partial binding: '
          );
          const mockReports = buildMrfHomeReportsListMock(t);
          setAllReports(mockReports);
          setUnreadReportsIds(prev => {
            const newSet = new Set(prev);
            mockReports.forEach((req: MrfReport) => {
              if (req.status === 'active') {
                newSet.add(req.id);
              }
            });
            return newSet;
          });
          setNetworkError(null);
          setState('content');
          hasLoadedRef.current = true;
          maxRetriesReachedRef.current = false;
          return;
        }
        
        const isDevMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true' || process.env.NODE_ENV === 'development';
        
        if (isDevMode && newRetryCount >= 2) {
          console.warn(`[MRF Home] Dev mode: Showing empty state after network failure (retries: ${newRetryCount})`);
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
        const errorMessage = error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_home_get.errorLoadMessage');
        setNetworkError(errorMessage);
        setState('error');
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [userLocation, serviceEnabled, retryCount, t]);

  // Load data only once on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !isLoadingRef.current && !maxRetriesReachedRef.current) {
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

  // 1-click claim action (for found reports)
  const handleQuickClaim = useCallback(async (report: MrfReport) => {
    if (processingReport) return;
    
    setProcessingReport(report.id);
    setLastClaimedReport(report);
    
    // Mark as read when claimed
    setUnreadReportsIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(report.id);
      return newSet;
    });
    
    try {
      // Call entity_create with entityType=claim, domain=MRF
      const response = await fetchWithRetry(
        `${getBaseUrl()}/api/entities`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            entityType: 'claim',
            domain: 'MRF',
            reportId: report.id,
            claimDetails: `مطالبة على البلاغ ${report.id}`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في إنشاء المطالبة');
      }
      
      // Show undo snackbar (5 seconds)
      setTimeout(() => {
        setLastClaimedReport(null);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to claim report:', error);
      Alert.alert(
        t('surfaces.خطأ'),
        error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_home_get.errorCreateClaimMessage')
      );
      setLastClaimedReport(null);
    } finally {
      setProcessingReport(null);
    }
  }, [processingReport]);

  // Undo last claim
  const handleUndoClaim = useCallback(() => {
    if (lastClaimedReport) {
      setLastClaimedReport(null);
    }
  }, [lastClaimedReport]);

  // Open details in mini bottom sheet
  const handleViewDetails = useCallback((report: MrfReport) => {
    setSelectedReport(report);
    setMiniDetailsVisible(true);
    
    // Mark as read when viewing details
    setUnreadReportsIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(report.id);
      return newSet;
    });
  }, []);

  // Handle Quick Compose submit
  const handleQuickComposeSubmit = useCallback(async (data: any) => {
    try {
      const requestBody = {
        reportType: data.reportType,
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        attachments: data.attachments,
        lastSeenAt: data.lastSeenAt, // ISO date string
      };

      // Per roadmap: mrf_report_create is a dedicated operation (not unified)
      // So we use /api/mrf/reports POST (correct for report creation)
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
      
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_home_get.successTitle'), t('mrf.app-client.mobile.auto_mrf_home_get.successTitle'));
      setQuickComposeVisible(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to create report:', error);
      Alert.alert(
        'خطأ',
        error instanceof Error ? error.message : t('mrf.app-client.mobile.auto_mrf_home_get.errorPublishMessage')
      );
    }
  }, [loadData]);

  // Helper functions
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return semanticRoles.stateSuccess.icon;
      case 'medium': return semanticRoles.stateWarning.icon;
      case 'high': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low': return t('mrf.app-client.mobile.auto_mrf_home_get.priorityLow');
      case 'medium': return t('mrf.app-client.mobile.auto_mrf_home_get.priorityMedium');
      case 'high': return t('mrf.app-client.mobile.auto_mrf_home_get.priorityHigh');
      default: return urgency;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return '🔍';
      case 'found': return '✅';
      default: return '📋';
    }
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'missing': return t('surfaces.مفقود');
      case 'found': return t('surfaces.تم_العثور_عليه');
      default: return type;
    }
  };

  /** صورة البطاقة: من المرفق أولاً، وإلا من المجلد الخارجي (قاعدة DEV_MEDIA) */
  const getReportCardImageUri = (report: MrfReport): string => {
    const firstAttachment = report.attachments?.[0];
    if (firstAttachment?.url) {
      const url = firstAttachment.url;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      const baseUrl = getBaseUrl();
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    if (firstAttachment?.attachmentId) {
      return `${getBaseUrl()}/api/platform/attachments/${firstAttachment.attachmentId}`;
    }
    const fallbackPath = report.reportType === 'found'
      ? 'mrf/reports/placeholder_found_001.jpg'
      : 'mrf/reports/placeholder_missing_001.jpg';
    return resolveDevMediaUrl(fallbackPath) || '';
  };

  const renderReportCard = ({ item, index }: { item: MrfReport; index: number }) => {
    const isProcessing = processingReport === item.id;
    const canClaim = item.reportType === 'found' && item.status === 'active' && !isProcessing;
    const isTopMatch = index === 0 && filteredReports.length > 0;
    const isUnread = unreadReportsIds.has(item.id);
    const cardImageUri = getReportCardImageUri(item);

    const cardContent = (
      <View style={styles.cardContent}>
        {/* صورة البلاغ في أعلى البطاقة — من المرفق أو المجلد الخارجي (قاعدة DEV_MEDIA) */}
        <View style={styles.cardImageContainer}>
          {cardImageUri ? (
            <Image
              source={{ uri: cardImageUri }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.cardImagePlaceholderIcon}>{getReportTypeIcon(item.reportType)}</Text>
            </View>
          )}
          {item.attachments && item.attachments.length > 1 && (
            <View style={styles.cardImageBadge}>
              <Text style={styles.cardImageBadgeText}>+{item.attachments.length - 1}</Text>
            </View>
          )}
        </View>
        {/* Report Type Badge + Main Info */}
        <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={[styles.reportTypeBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
            <Text style={styles.reportTypeIcon}>{getReportTypeIcon(item.reportType)}</Text>
          </View>
          <View style={styles.cardInfo}>
            {isTopMatch && (
              <View style={styles.topMatchBadge}>
                <Text style={styles.topMatchText}>⭐ أقرب بلاغ مطابق الآن</Text>
              </View>
            )}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            {item.distance !== undefined && (
              <Text style={styles.cardDistance}>📏 {item.distance.toFixed(1)} كم</Text>
            )}
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) + '20' }]}>
            <Text style={[styles.urgencyText, { color: getUrgencyColor(item.urgency) }]}>
              {getUrgencyText(item.urgency)}
            </Text>
          </View>
        </View>

        {/* Footer: Time + Action */}
        <View style={[styles.cardFooter, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.cardTime}>{item.timestamp}</Text>
          {canClaim && (
            <TouchableOpacity
              style={[styles.claimButton, isProcessing && styles.claimButtonDisabled]}
              onPress={(e) => {
                e.stopPropagation();
                handleQuickClaim(item);
              }}
              disabled={isProcessing}
            >
              <Text style={styles.claimButtonText}>
                {isProcessing ? 'جاري...' : t('surfaces.مطالبة')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );

    // Use SwipeableCard for swipeable actions
    if (canClaim) {
      return (
        <MrfSwipeableCard
          report={item}
          onPress={() => handleViewDetails(item)}
          onClaim={handleQuickClaim}
          canClaim={canClaim}
          isProcessing={isProcessing}
          getUrgencyColor={getUrgencyColor}
          getUrgencyText={getUrgencyText}
        >
          {cardContent}
          {isUnread && <View style={styles.unreadIndicator} />}
        </MrfSwipeableCard>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.reportCard, 
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

  const renderEmptyState = () => {
    if (serviceEnabled === false) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚫</Text>
          <Text style={styles.emptyTitle}>{t('mrf.app-client.mobile.auto_mrf_home_get.emptyTitleServiceOff')}</Text>
          <Text style={styles.emptySubtitle}>
            {serviceFlagsError || t('surfaces.خدمة_MRF_معطلة_حالياً_يرجى_المحاولة')}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>{t('mrf.app-client.mobile.auto_mrf_home_get.emptyTitleNoReports')}</Text>
        <Text style={styles.emptySubtitle}>
          {t('mrf.app-client.mobile.auto_mrf_home_get.emptySubtitleNoReports')}
        </Text>
      </View>
    );
  };

  // Hide service if disabled
  if (serviceEnabled === false) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={serviceFlagsError || t('mrf.app-client.mobile.auto_mrf_home_get.emptyTitleServiceOff')}
        screenName="auto_mrf_home_get"
        operationName="mrf_home_get"
      />
    );
  }

  // Show offline screen if loading and offline
  if (state === 'loading' && isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_home_get.emptyTitleNoConnection')}
        onErrorAction={() => {
          setRetryCount(0);
          loadData(true);
        }}
        screenName="auto_mrf_home_get"
        operationName="mrf_home_get"
      />
    );
  }

  // Show offline state if network error
  if (isOffline && (state === 'error' || state === 'loading')) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={networkError || t('mrf.app-client.mobile.auto_mrf_home_get.emptyTitleNoConnection')}
        onErrorAction={() => {
          setRetryCount(0);
          loadData(true);
        }}
        screenName="auto_mrf_home_get"
        operationName="mrf_home_get"
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
        screenName="auto_mrf_home_get"
        operationName="mrf_home_get"
      />
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          {/* A) Compact Header */}
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.headerTitle}>{t('mrf.app-client.mobile.auto_mrf_home_get.headerTitle')}</Text>
            {/* Notification Badge - Only shows when there are unread reports */}
            <View style={styles.notificationIconContainer}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <MrfNotificationBadge count={unreadReportsCount} visible={unreadReportsCount > 0} />
            </View>
          </View>

          {/* B) Sticky Control Bar */}
          <MrfFilterChipsBar
            reportType={filterReportType}
            location={filterLocation}
            category={filterCategory}
            status={filterStatus}
            urgency={filterUrgency}
            onReportTypePress={() => {
              // Cycle through: all -> missing -> found -> all
              const types: Array<'all' | 'missing' | 'found'> = ['all', 'missing', 'found'];
              const currentIndex = types.indexOf(filterReportType);
              setFilterReportType(types[(currentIndex + 1) % types.length]);
            }}
            onLocationPress={() => {
              setShowSearchScopePicker(true);
            }}
            onCategoryPress={() => {
              setShowCategoryPicker(true);
            }}
            onStatusPress={() => {
              const statuses: Array<'all' | 'active' | 'resolved' | 'closed'> = ['all', 'active', 'resolved', 'closed'];
              const currentIndex = statuses.indexOf(filterStatus);
              setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
            }}
            onUrgencyPress={() => {
              const urgencies: Array<'all' | 'low' | 'medium' | 'high'> = ['all', 'low', 'medium', 'high'];
              const currentIndex = urgencies.indexOf(filterUrgency);
              setFilterUrgency(urgencies[(currentIndex + 1) % urgencies.length]);
            }}
          />

          {/* C) Feed - Reports */}
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
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
            label={t('mrf.app-client.mobile.auto_mrf_home_get.reportMissingTitle')}
            icon="🔍"
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
          onClaim={handleQuickClaim}
          onViewFull={(report) => {
            if (navigation?.navigate) {
              navigation.navigate('MrfReportGet' as any, { reportId: report.id });
            } else if (onNavigate) {
              onNavigate('MrfReportGet', { reportId: report.id });
            }
            setMiniDetailsVisible(false);
            setSelectedReport(null);
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
          initialData={selectedReport ? {
            reportType: selectedReport.reportType,
            title: selectedReport.title,
            description: (selectedReport as any).description || '',
            location: { city: selectedReport.location.split('،')[0] || undefined },
            category: (selectedReport as any).category,
          } : undefined}
          isEditMode={!!selectedReport}
        />

        {/* Search Scope Picker Bottom Sheet */}
        <MrfBottomSheet
          visible={showSearchScopePicker}
          onClose={() => setShowSearchScopePicker(false)}
          height="medium"
          title={t('mrf.app-client.mobile.auto_mrf_home_get.searchScopeLabel')}
          showHandle={true}
          enableSwipeDown={true}
        >
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.searchScopeOption,
                searchScope === 'city' && styles.searchScopeOptionActive
              ]}
              onPress={() => {
                setSearchScope('city');
                setShowSearchScopePicker(false);
                loadData();
              }}
            >
              <Text style={styles.searchScopeIcon}>🏙️</Text>
              <View style={styles.searchScopeTextContainer}>
                <Text style={styles.searchScopeLabel}>{t('mrf.app-client.mobile.auto_mrf_home_get.searchScopeLabelCity')}</Text>
                <Text style={styles.searchScopeDescription}>عرض البلاغات في نفس المدينة فقط (بدون تحديد مسافة دقيقة)</Text>
              </View>
              {searchScope === 'city' && <Text style={styles.searchScopeCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchScopeOption,
                searchScope === 'radius' && styles.searchScopeOptionActive
              ]}
              onPress={() => {
                setSearchScope('radius');
                // Use userLocation as coordinates if available
                if (userLocation) {
                  setUserCoordinates(userLocation);
                }
                setShowSearchScopePicker(false);
                loadData();
              }}
            >
              <Text style={styles.searchScopeIcon}>📏</Text>
              <View style={styles.searchScopeTextContainer}>
                <Text style={styles.searchScopeLabel}>نطاق {searchRadius} كيلومتر</Text>
                <Text style={styles.searchScopeDescription}>عرض البلاغات في دائرة نصف قطر {searchRadius} كيلومتر من موقعك الحالي</Text>
              </View>
              {searchScope === 'radius' && <Text style={styles.searchScopeCheck}>✓</Text>}
            </TouchableOpacity>

            <View style={styles.radiusSelectorContainer}>
              <Text style={styles.radiusLabel}>اختر نطاق البحث بالكيلومتر:</Text>
              <Text style={styles.radiusHint}>
                سيتم عرض البلاغات في دائرة نصف قطر {searchRadius} كم من موقعك
              </Text>
              <View style={[styles.radiusOptions, { flexDirection: 'row', direction: layoutDirection }]}>
                {[5, 10, 25, 50].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusOption,
                      searchRadius === radius && styles.radiusOptionActive
                    ]}
                    onPress={() => {
                      setSearchRadius(radius);
                      if (searchScope === 'radius') {
                        loadData();
                      }
                    }}
                  >
                    <Text style={[
                      styles.radiusOptionText,
                      searchRadius === radius && styles.radiusOptionTextActive
                    ]}>
                      {radius} كم
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.searchScopeOption,
                searchScope === 'all' && styles.searchScopeOptionActive
              ]}
              onPress={() => {
                setSearchScope('all');
                setShowSearchScopePicker(false);
                loadData();
              }}
            >
              <Text style={styles.searchScopeIcon}>🌍</Text>
              <View style={styles.searchScopeTextContainer}>
                <Text style={styles.searchScopeLabel}>{t('mrf.app-client.mobile.auto_mrf_home_get.searchScopeLabelAll')}</Text>
                <Text style={styles.searchScopeDescription}>{t('mrf.app-client.mobile.auto_mrf_home_get.searchScopeDescriptionAll')}</Text>
              </View>
              {searchScope === 'all' && <Text style={styles.searchScopeCheck}>✓</Text>}
            </TouchableOpacity>
          </ScrollView>
        </MrfBottomSheet>

        {/* Category Picker Bottom Sheet */}
        <MrfBottomSheet
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          height="medium"
          title={t('mrf.app-client.mobile.auto_mrf_home_get.selectCategoryLabel')}
          showHandle={true}
          enableSwipeDown={true}
        >
          <ScrollView style={{ flex: 1 }}>
            {[
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.filterAll'), value: '', icon: '🔍' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryPhone'), value: 'phone', icon: '📱' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryWallet'), value: 'wallet', icon: '💼' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryKeys'), value: 'keys', icon: '🔑' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryBag'), value: 'bag', icon: '👜' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryDocument'), value: 'document', icon: '📄' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryIdCard'), value: 'id_card', icon: '🪪' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryGlasses'), value: 'glasses', icon: '👓' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryWatch'), value: 'watch', icon: '⌚' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryElectronics'), value: 'electronics', icon: '💻' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryClothing'), value: 'clothing', icon: '👕' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryShoes'), value: 'shoes', icon: '👟' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryPet'), value: 'pet', icon: '🐾' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryBike'), value: 'bicycle', icon: '🚲' },
              { label: t('mrf.app-client.mobile.auto_mrf_home_get.categoryOther'), value: 'other', icon: '📦' },
            ].map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  {
                    padding: BTHWANI_SPACING.md,
                    borderBlockEndWidth: 1,
                    borderBlockEndColor: semanticRoles.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                  filterCategory === category.value && {
                    backgroundColor: semanticRoles.primaryCTA + '20',
                  },
                ]}
                onPress={() => {
                  setFilterCategory(category.value);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'], marginEnd: BTHWANI_SPACING.sm }}>
                  {category.icon}
                </Text>
                <Text
                  style={{
                    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
                    fontWeight: filterCategory === category.value ? '700' : '500',
                    color: filterCategory === category.value ? semanticRoles.primaryCTA : semanticRoles.text,
                    flex: 1,
                  }}
                >
                  {category.label}
                </Text>
                {filterCategory === category.value && (
                  <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl, color: semanticRoles.primaryCTA }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </MrfBottomSheet>

        {/* Critical Report Popup - Only for critical reports <2km */}
        <MrfCriticalReportPopup
          visible={!!criticalPopupReport}
          report={criticalPopupReport}
          onClaim={handleQuickClaim}
          onDismiss={() => setCriticalPopupReport(null)}
        />

        {/* Undo Snackbar */}
        {lastClaimedReport && (
          <View style={[styles.snackbar, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.snackbarText}>
              تم إنشاء مطالبة على البلاغ {lastClaimedReport.id}
            </Text>
            <TouchableOpacity
              style={styles.snackbarButton}
              onPress={handleUndoClaim}
            >
              <Text style={styles.snackbarButtonText}>{t('mrf.app-client.mobile.auto_mrf_home_get.snackbarButtonText')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_البلاغات')}
      errorMessage={t('mrf.app-client.mobile.auto_mrf_home_get.errorMessageLoad')}
      onErrorAction={handleErrorRetry}
      screenName="auto_mrf_home_get"
      operationName="mrf_home_get"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
    minHeight: 56,
  },
  headerTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    flex: 1,
  },
  notificationIconContainer: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
  },
  // C) Feed — هامش سفلي كافٍ لتفادي تداخل زر الإبلاغ (FAB) مع آخر البطاقات
  listContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl * 5, // Space for FAB (no overlap with last cards)
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
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: semanticRoles.stateError.icon,
  },
  unreadIndicator: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticRoles.stateError.icon,
  },
  topMatchCard: {
    borderWidth: 2,
    borderColor: semanticRoles.stateWarning.icon,
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
  reportTypeImageBadge: {
    overflow: 'hidden',
    backgroundColor: semanticRoles.surfaceSubtle,
    position: 'relative',
  },
  reportTypeImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  reportTypeImageBadgeOverlay: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    backgroundColor: 'BTHWANI_COLORS.overlay70',
    borderBottomRightRadius: 28,
    borderTopLeftRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
  },
  reportTypeImageBadgeText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  cardInfo: {
    flex: 1,
  },
  topMatchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.stateWarning.icon + '20',
    marginBottom: BTHWANI_SPACING.xs,
  },
  topMatchText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.stateWarning.icon,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
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
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardDistance: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.stateInfo.icon,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
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
  cardImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
    marginBottom: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    backgroundColor: 'BTHWANI_COLORS.overlay70',
    borderRadius: 999,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  cardImageBadgeText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  cardImagePlaceholderIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['4xl'],
    opacity: 0.3,
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
  claimButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  claimButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
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
    backgroundColor: semanticRoles.stateSuccess.icon,
    marginTop: BTHWANI_SPACING.md,
  },
  emptyButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  snackbarText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.text,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
  },
  snackbarButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  snackbarButtonText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  searchScopeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  searchScopeOptionActive: {
    backgroundColor: semanticRoles.primaryCTA + '15',
    borderColor: semanticRoles.primaryCTA,
  },
  searchScopeIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    marginEnd: BTHWANI_SPACING.md,
  },
  searchScopeTextContainer: {
    flex: 1,
  },
  searchScopeLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  searchScopeDescription: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: 16,
  },
  searchScopeCheck: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  radiusSelectorContainer: {
    padding: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  radiusLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  radiusHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    fontStyle: 'italic',
  },
  radiusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  radiusOption: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minWidth: 60,
    alignItems: 'center',
  },
  radiusOptionActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  radiusOptionText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
    color: semanticRoles.text,
  },
  radiusOptionTextActive: {
    color: semanticRoles.surface,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
});

export default auto_mrf_home_get;

