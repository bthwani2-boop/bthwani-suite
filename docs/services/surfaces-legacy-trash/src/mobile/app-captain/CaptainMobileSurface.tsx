// CaptainMobileSurface - Mobile Surface Aggregator for Captain App
// §86 §87 SSoT in surfaces; dynamic route map; theme tokens for UX
// §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
// §UX-SUPREME-001: Action-first, 1-handed operation, Zero distraction

import React, { useState, useEffect, useRef } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  BackHandler,
  type AppStateStatus,
} from 'react-native';
import { ErrorBoundary, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useCaptainType } from './CaptainTypeContext';
import {
  CaptainProfileDisplayProvider,
  useCaptainProfileDisplay,
} from './CaptainProfileDisplayContext';
import { CaptainTypeSelectScreen } from './CaptainTypeSelectScreen';
import { CaptainHomeScreen } from '../../captain/CaptainHomeScreen';
import { CaptainMapScreen } from '../../captain/CaptainMapScreen';
import {
  getCaptainScreenComponent,
  getCaptainDefaultRoute,
  ROUTE_HOME,
  ROUTE_CAPTAIN_TYPE_SELECT,
} from './captainRouteMap';
import {
  CaptainBottomNavigationBar,
  CaptainTopAppBar,
  CaptainTripHUD,
  CaptainBottomSheetAlert,
  CaptainAvailabilitySlider,
  CaptainSmartRequestCard,
  type CaptainState,
  type CaptainTopBarState,
  type RightActionType,
  type CaptainStatus,
  type GPSStatus,
  type TripStage,
  type AvailabilityValue,
  type SmartRequestOffer,
} from './components';
import { FirstLaunchScreen } from '../components/FirstLaunchScreen';
import { TouchDebugOverlay } from '../components/TouchDebugOverlay';
import { useFirstLaunchSeen } from '../components/useFirstLaunchSeen';

const DSH_OFFERS_POLL_INTERVAL_MS = 18000;
function getDshApiBaseUrl(): string {
  const base = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  return base.endsWith('/api') ? base.slice(0, -4) : base;
}

function getApiBaseUrl(): string {
  const base = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  return base.endsWith('/api') ? base.slice(0, -4) : base;
}

export interface MobileSurfaceProps {
  navigation?: any;
  theme?: any;
  platform?: 'mobile';
}

// Inner component that uses the context
const CaptainMobileSurfaceInner: React.FC<MobileSurfaceProps> = ({
  navigation: injectedNavigation,
  theme,
  platform = 'mobile',
}) => {
  const { t } = useI18n();
  const { captainType, isLoading } = useCaptainType();
  const { displayName, setDisplayProfile } = useCaptainProfileDisplay();
  const NS = 'mobile.app-captain.CaptainMobileSurface';
  const [screenStack, setScreenStack] = useState<string[]>([
    getCaptainDefaultRoute(),
  ]);
  const [routeParams, setRouteParams] = useState<Record<string, unknown>>({});
  const [lastOfferIds, setLastOfferIds] = useState<Set<string>>(new Set());
  const [amnLastOfferIds, setAmnLastOfferIds] = useState<Set<string>>(
    new Set()
  );
  const [amnIncomingOffer, setAmnIncomingOffer] =
    useState<SmartRequestOffer | null>(null);
  const [amnOfferResponding, setAmnOfferResponding] = useState(false);
  const amnOfferFirstPollRef = useRef(true);
  const [newOfferAlert, setNewOfferAlert] = useState<{
    id: string;
    restaurant: string;
    total: number;
    itemsCount: number;
    orderTime: string;
  } | null>(null);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const hasCompletedFirstPollRef = useRef(false);
  const offersRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const stackLengthRef = useRef(1);

  const currentScreen = screenStack[screenStack.length - 1];

  // Captain state management
  const [captainState, setCaptainState] = useState<CaptainState>('idle');
  const [captainStatus, setCaptainStatus] =
    useState<CaptainStatus>('available');
  const [gpsStatus, setGpsStatus] = useState<GPSStatus>('on');
  const [signalStrength, setSignalStrength] = useState<number>(4);
  const [tripStage, setTripStage] = useState<TripStage | null>(null);
  const [tripInfo, setTripInfo] = useState<
    { title: string; subtitle?: string } | undefined
  >();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [todayEarnings, setTodayEarnings] = useState<number | null>(null);

  // Smart Status Bar: fetch today's earnings from platform (when captain type set)
  useEffect(() => {
    if (!captainType) return;
    const base = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
    const baseUrl = base.endsWith('/api') ? base.slice(0, -4) : base;
    const url = `${baseUrl}/api/platform/captain/earnings`;
    let cancelled = false;
    (async () => {
      try {
        const res = await rawFetch(url, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (cancelled || !res.ok) return;
        const json = await res.json();
        const data = json?.data ?? json;
        const today = data?.today_earnings ?? data?.todayEarnings;
        if (typeof today === 'number' && !cancelled) setTodayEarnings(today);
      } catch {
        // Leave null so bar does not show "0" when API unavailable
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [captainType]);

  // اسم الكابتن والتقييم للشريط وشاشة الحساب — جلب من واجهة الملف الشخصي
  useEffect(() => {
    if (!captainType) return;
    const base = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
    const baseUrl = base.endsWith('/api') ? base.slice(0, -4) : base;
    const url = `${baseUrl}/api/platform/captain/profile`;
    let cancelled = false;
    (async () => {
      try {
        const res = await rawFetch(url, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (cancelled || !res.ok) return;
        const json = await res.json();
        const data = json?.data ?? json;
        const name = data?.name ?? null;
        const rating = typeof data?.rating === 'number' ? data.rating : null;
        const tier = data?.tier_label ?? data?.tier ?? null;
        if (!cancelled) setDisplayProfile(name, rating, tier ?? undefined);
      } catch {
        // Fallback عند عدم توفر API (تطوير): عرض اسم وتقييم تشجيعي
        if (!cancelled)
          setDisplayProfile(t('surfaces.أحمد_محمد'), 4.8, t('surfaces.فضّي'));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [captainType, setDisplayProfile]);

  // Reset screen when captain type changes: AMN و DSH = الخريطة في صدر الواجهة (نفس الأسلوب)
  useEffect(() => {
    if (captainType === 'amn' || captainType === 'dsh') {
      setScreenStack(['CaptainMap']);
    }
  }, [captainType]);

  // DSH: sync captain state and Trip HUD with current screen (pickup → dropoff → idle)
  useEffect(() => {
    if (captainType !== 'dsh') return;
    if (currentScreen === 'dsh_captain_order_pickup') {
      setCaptainState('pickup');
      setTripStage('arrived');
      setTripInfo({ title: t(`${NS}.pickupFromRestaurant`), subtitle: '' });
    } else if (currentScreen === 'dsh_captain_order_deliver') {
      setCaptainState('dropoff');
      setTripStage('picked');
      setTripInfo({ title: t(`${NS}.deliverToCustomer`), subtitle: '' });
    } else if (
      currentScreen === ROUTE_HOME ||
      currentScreen === 'CaptainMap' ||
      currentScreen === 'dsh_captain_orders_list' ||
      currentScreen === 'dsh_captain_order_details' ||
      currentScreen === 'dsh_captain_order_accept'
    ) {
      setCaptainState('idle');
      setTripStage(null);
      setTripInfo(undefined);
    }
  }, [captainType, currentScreen, t]);

  const defaultRouteForType =
    captainType === 'amn' || captainType === 'dsh' ? 'CaptainMap' : ROUTE_HOME;
  const adapterNavigate = (name: string, params?: Record<string, unknown>) => {
    const Component = getCaptainScreenComponent(name);
    setRouteParams(params ?? {});
    if (Component) {
      setScreenStack(s => [...s, name]);
    } else {
      setScreenStack([defaultRouteForType]);
    }
  };

  const goBack = () => {
    setScreenStack(s => (s.length > 1 ? s.slice(0, -1) : s));
  };

  useEffect(() => {
    stackLengthRef.current = screenStack.length;
  }, [screenStack.length]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stackLengthRef.current > 1) {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const navProps = { navigation: { navigate: adapterNavigate, goBack } };
  const routeProps = { route: { params: routeParams } };

  // تتبع حالة التطبيق (مقدمة/خلفية) — الـ polling فقط عندما التطبيق في المقدمة
  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  // DSH: polling عروض الطلبات لأقرب 5 كباتن؛ فقط عند كون التطبيق في المقدمة؛ لا popup في أول تحميل؛ إعادة محاولة بعد 5s عند الفشل
  useEffect(() => {
    if (captainType !== 'dsh') return;
    if (appState !== 'active') return;
    hasCompletedFirstPollRef.current = false;
    const baseUrl = getDshApiBaseUrl();
    const url = `${baseUrl}/api/dsh/captain/orders/offers?captainId=me`;
    const OFFERS_RETRY_MS = 5000;
    const poll = async () => {
      try {
        const res = await rawFetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
          if (offersRetryTimeoutRef.current)
            clearTimeout(offersRetryTimeoutRef.current);
          offersRetryTimeoutRef.current = setTimeout(poll, OFFERS_RETRY_MS);
          return;
        }
        const json = await res.json();
        const offers = json?.data?.offers ?? [];
        const ids = new Set(
          (offers as { id: string }[]).map((o: { id: string }) => o.id)
        );
        const isFirstPoll = !hasCompletedFirstPollRef.current;
        if (isFirstPoll) hasCompletedFirstPollRef.current = true;
        setLastOfferIds(prev => {
          const next = new Set(ids);
          const added = [...next].find(id => !prev.has(id));
          if (added && isFirstPoll === false) {
            const offer = offers.find((o: { id: string }) => o.id === added);
            if (offer) setNewOfferAlert(offer);
          }
          return next;
        });
      } catch {
        if (offersRetryTimeoutRef.current)
          clearTimeout(offersRetryTimeoutRef.current);
        offersRetryTimeoutRef.current = setTimeout(poll, OFFERS_RETRY_MS);
      }
    };
    poll();
    const pollInterval = setInterval(poll, DSH_OFFERS_POLL_INTERVAL_MS);
    return () => {
      clearInterval(pollInterval);
      if (offersRetryTimeoutRef.current) {
        clearTimeout(offersRetryTimeoutRef.current);
        offersRetryTimeoutRef.current = null;
      }
    };
  }, [captainType, appState]);

  // AMN: polling عروض الرحلات للكابتن؛ فقط عند متاح وفي المقدمة؛ لا عرض في أول تحميل
  const AMN_OFFERS_POLL_INTERVAL_MS = 12000;
  const amnOfferRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (captainType !== 'amn') return;
    if (captainStatus !== 'available') return;
    if (appState !== 'active') return;
    if (captainState !== 'idle') return; // لا عروض عند رحلة نشطة
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/amn/captain/offers?captainId=me`;
    const OFFERS_RETRY_MS = 5000;
    const poll = async () => {
      try {
        const res = await rawFetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-captain-id': 'me' },
        });
        if (!res.ok) {
          if (amnOfferRetryRef.current) clearTimeout(amnOfferRetryRef.current);
          amnOfferRetryRef.current = setTimeout(poll, OFFERS_RETRY_MS);
          return;
        }
        const json = await res.json();
        const rawOffers = json?.offers ?? [];
        const hasActiveTrip = json?.hasActiveTrip === true;
        if (!hasActiveTrip) {
          setAmnIncomingOffer(null);
          setCaptainState(s => (s !== 'idle' ? 'idle' : s));
          setTripStage(null);
          setTripInfo(undefined);
        }
        const offers = Array.isArray(rawOffers) ? rawOffers : [];
        const isFirstPoll = amnOfferFirstPollRef.current;
        if (isFirstPoll) amnOfferFirstPollRef.current = false;
        setAmnLastOfferIds(prev => {
          const next = new Set(
            (offers as { id: string }[]).map((o: { id: string }) => o.id)
          );
          const added = [...next].find((id: string) => !prev.has(id));
          if (added && !isFirstPoll) {
            const raw = offers.find((o: { id: string }) => o.id === added) as
              | {
                  id: string;
                  trip_id?: string;
                  pickup_location?: string;
                  dropoff_location?: string;
                  passenger_id?: string;
                }
              | undefined;
            if (raw) {
              const offer: SmartRequestOffer = {
                id: raw.id,
                trip_id: raw.trip_id ?? raw.id,
                passenger_name: t('surfaces.راكب'),
                pickup_location: raw.pickup_location ?? '—',
                dropoff_location: raw.dropoff_location,
                estimated_fare: undefined,
                distance_km: undefined,
                estimated_duration: undefined,
                rating: undefined,
              };
              setAmnIncomingOffer(offer);
            }
            return new Set([...prev, added]);
          }
          return next;
        });
      } catch {
        if (amnOfferRetryRef.current) clearTimeout(amnOfferRetryRef.current);
        amnOfferRetryRef.current = setTimeout(poll, OFFERS_RETRY_MS);
      }
    };
    poll();
    const pollInterval = setInterval(poll, AMN_OFFERS_POLL_INTERVAL_MS);
    return () => {
      clearInterval(pollInterval);
      if (amnOfferRetryRef.current) {
        clearTimeout(amnOfferRetryRef.current);
        amnOfferRetryRef.current = null;
      }
    };
  }, [captainType, captainStatus, appState, captainState]);

  const handleAmnOfferAccept = () => {
    const offer = amnIncomingOffer;
    if (!offer || amnOfferResponding) return;
    setAmnOfferResponding(true);
    const tripId = offer.trip_id ?? offer.id;
    const baseUrl = getApiBaseUrl();
    rawFetch(`${baseUrl}/api/amn/trip/${tripId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-captain-id': 'me' },
      body: JSON.stringify({ driverId: 'me' }),
    })
      .then(() => {
        setAmnIncomingOffer(null);
        setCaptainState('pickup');
        setTripStage('going_to_pickup');
        setTripInfo({
          title: t(`${NS}.goingToRider`),
          subtitle: offer.pickup_location ?? '',
        });
      })
      .catch(() => {})
      .finally(() => setAmnOfferResponding(false));
  };

  const handleAmnOfferDecline = () => {
    setAmnIncomingOffer(null);
  };

  // Determine right action based on state
  const getRightAction = (): {
    type: RightActionType;
    onPress: () => void;
    badge?: number;
  } => {
    if (captainState === 'issue') {
      return {
        type: 'support',
        onPress: () => adapterNavigate('platform_captain_support'),
      };
    }
    if (
      captainState === 'on_trip' ||
      captainState === 'pickup' ||
      captainState === 'dropoff'
    ) {
      return {
        type: 'call',
        onPress: () => {},
      };
    }
    if (notificationCount > 0) {
      return {
        type: 'bell',
        onPress: () => adapterNavigate(t('surfaces.CaptainNotifications')),
        badge: notificationCount,
      };
    }
    return {
      type: 'account',
      onPress: () => adapterNavigate('CaptainProfile'),
    };
  };

  const shouldShowBottomNav =
    currentScreen !== ROUTE_CAPTAIN_TYPE_SELECT && captainType !== null;
  const shouldShowTopBar =
    currentScreen !== ROUTE_CAPTAIN_TYPE_SELECT && captainType !== null;
  const shouldShowTripHUD =
    (captainState === 'on_trip' ||
      captainState === 'pickup' ||
      captainState === 'dropoff') &&
    tripStage !== null;
  const shouldShowAvailabilitySlider =
    (captainType === 'amn' || captainType === 'dsh') &&
    captainState === 'idle' &&
    shouldShowTopBar;

  const handleAvailabilityChange = (value: AvailabilityValue) => {
    const next: CaptainStatus = value === 'available' ? 'available' : 'stopped';
    setCaptainStatus(next);
    if (captainType === 'amn') {
      const baseUrl = getApiBaseUrl();
      rawFetch(`${baseUrl}/api/amn/captain/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-captain-id': 'me' },
        body: JSON.stringify({ available: value === 'available' }),
      }).catch(() => {});
    } else if (captainType === 'dsh') {
      const baseUrl = getDshApiBaseUrl();
      rawFetch(`${baseUrl}/api/dsh/captain/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: value === 'available' }),
      }).catch(() => {});
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Simple loading indicator */}
        </View>
      </View>
    );
  }

  // Show type selection screen if no captain type is selected
  if (!captainType) {
    return (
      <ErrorBoundary>
        <CaptainTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  // Handle navigation to type select screen
  if (currentScreen === ROUTE_CAPTAIN_TYPE_SELECT) {
    return (
      <ErrorBoundary>
        <CaptainTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  // Get the screen component for current route
  const ScreenComponent = getCaptainScreenComponent(currentScreen);

  const mapOfferToAcceptOrder = (o: typeof newOfferAlert) =>
    o
      ? {
          id: o.id,
          customer_name: t('surfaces.عميل'),
          customer_phone: '',
          pickup_location: t('surfaces.عنوان_الاستلام'),
          delivery_location: t('surfaces.عنوان_التسليم'),
          total_amount: o.total,
          distance_km: 0,
          items_count: o.itemsCount,
          estimated_delivery: o.orderTime,
        }
      : null;

  // If screen is Home or component not found: AMN = Map (Command Screen), DSH = Home
  // State machine: Idle → Incoming (Smart Card) → Pickup → On Trip → Idle
  const renderScreen = () => {
    if (!ScreenComponent && captainType === 'amn') {
      return <CaptainMapScreen navigation={navProps.navigation} />;
    }
    if (captainType === 'amn' && currentScreen === ROUTE_HOME) {
      return <CaptainMapScreen navigation={navProps.navigation} />;
    }
    if (currentScreen === ROUTE_HOME || !ScreenComponent) {
      return (
        <CaptainHomeScreen
          navigation={navProps.navigation}
          captainType={captainType}
          isLoading={false}
        />
      );
    }

    return (
      <ScreenComponent
        navigation={navProps.navigation}
        route={routeProps.route}
      />
    );
  };

  // Render with navigation components
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <TouchDebugOverlay
          surfaceId='app-captain'
          currentScreen={currentScreen}
        />
        {/* Top App Bar */}
        {shouldShowTopBar && (
          <CaptainTopAppBar
            captainState={captainState as CaptainTopBarState}
            captainStatus={captainStatus}
            gpsStatus={gpsStatus}
            signalStrength={signalStrength}
            todayEarnings={todayEarnings}
            tripInfo={tripInfo}
            rightAction={getRightAction()}
            onSOSPress={
              captainState === 'issue'
                ? () => adapterNavigate('platform_captain_support')
                : undefined
            }
            hideAvailabilityChip={shouldShowAvailabilitySlider}
            captainName={displayName}
          />
        )}

        {shouldShowAvailabilitySlider && (
          <View style={styles.availabilityStrip}>
            <CaptainAvailabilitySlider
              value={
                captainStatus === 'available' ? 'available' : 'unavailable'
              }
              onValueChange={handleAvailabilityChange}
            />
          </View>
        )}

        {/* Trip HUD */}
        {shouldShowTripHUD && tripStage && (
          <CaptainTripHUD
            stage={tripStage}
            timeRemaining={tripInfo?.subtitle}
            areaName={tripInfo?.subtitle}
            onViewDetails={() =>
              adapterNavigate(captainType === 'amn' ? 'CaptainMap' : 'Home')
            }
            visible={true}
          />
        )}

        {/* Main Screen Content */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* Bottom Navigation (AMN: 2 tabs only, no center t('surfaces.متاح_الآن'); DSH: full tabs + center) */}
        {shouldShowBottomNav && (
          <CaptainBottomNavigationBar
            currentScreen={currentScreen}
            onNavigate={adapterNavigate}
            captainState={captainState}
            captainType={captainType}
            notificationCount={notificationCount}
            tripStage={tripStage}
          />
        )}

        {/* DSH: popup طلب توصيل جديد — عرض ثم فتح شاشة القبول */}
        {captainType === 'dsh' && newOfferAlert && (
          <CaptainBottomSheetAlert
            visible={true}
            title={t(`${NS}.newDeliveryRequest`)}
            message={`${newOfferAlert.restaurant} — ${newOfferAlert.total} ر.س`}
            primaryAction={{
              label: t(`${NS}.view`),
              onPress: () => {
                const order = mapOfferToAcceptOrder(newOfferAlert);
                setNewOfferAlert(null);
                if (order)
                  adapterNavigate('dsh_captain_order_accept', {
                    orderId: newOfferAlert.id,
                    order,
                  });
              },
            }}
            secondaryAction={{
              label: t(`${NS}.later`),
              onPress: () => setNewOfferAlert(null),
            }}
            onDismiss={() => setNewOfferAlert(null)}
          />
        )}

        {/* AMN: Smart Request Card — ينبثق تلقائياً عند وصول طلب جديد من الـ API (polling) */}
        {captainType === 'amn' && amnIncomingOffer != null && (
          <CaptainSmartRequestCard
            visible={true}
            offer={amnIncomingOffer}
            onAccept={handleAmnOfferAccept}
            onDecline={handleAmnOfferDecline}
            onDismiss={handleAmnOfferDecline}
            loading={amnOfferResponding}
          />
        )}

        {/* Incoming offer UI: driven by real AMN offer API / push; no inline dev data */}
      </View>
    </ErrorBoundary>
  );
};

const APP_CAPTAIN_FIRST_LAUNCH_KEY = 'app-captain';

// Main component - CaptainTypeProvider is provided by Shell
export const CaptainMobileSurface: React.FC<MobileSurfaceProps> = props => {
  const {
    hasSeen,
    setSeen,
    isLoading: firstLaunchLoading,
  } = useFirstLaunchSeen(APP_CAPTAIN_FIRST_LAUNCH_KEY);

  if (firstLaunchLoading) return null;
  if (hasSeen === false) {
    return <FirstLaunchScreen onContinue={setSeen} />;
  }
  return (
    <CaptainProfileDisplayProvider>
      <CaptainMobileSurfaceInner {...props} />
    </CaptainProfileDisplayProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
  },
  availabilityStrip: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  devMockOfferButton: {
    position: 'absolute',
    bottom: 88,
    start: BTHWANI_SPACING.sm,
    paddingVertical: 6,
    paddingHorizontal: BTHWANI_SPACING.sm,
    backgroundColor: 'BTHWANI_COLORS.overlay35',
    borderRadius: 6,
    zIndex: 8,
  },
  devMockOfferButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
});
