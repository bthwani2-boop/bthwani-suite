// PartnerMobileSurface - Mobile Surface Aggregator for Partner App
// §86 §87 SSoT in surfaces; dynamic route map; theme tokens for UX
// §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
// Supports DSH and ARB partner operations
// DSH: انبثاق طلب جديد — استطلاع GET partner/orders/pending، عرض تفاصيل + قبول/رفض في مودال

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  AppState,
  BackHandler,
  Modal,
  type AppStateStatus,
  Alert,
} from 'react-native';
// Use main entry so Metro resolves react-native export and loads ErrorBoundary.tsx (not ErrorBoundary.web.tsx with <h2>)
import { ErrorBoundary } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import {
  getPartnerPendingOrders,
  partnerOrderAction,
} from '@bthwani/api-clients/dsh/dsh-orders-api';
import { usePartnerType } from './PartnerTypeContext';
import { PartnerTypeSelectScreen } from '../../partner/PartnerTypeSelectScreen';
import { PartnerHomeScreen } from '../../partner/PartnerHomeScreen';
import {
  getPartnerScreenComponent,
  getPartnerDefaultRoute,
  ROUTE_HOME,
  ROUTE_PARTNER_TYPE_SELECT,
} from './partnerRouteMap';
import {
  PartnerTopAppBar,
  type PartnerState,
  type PartnerTopBarState,
  type PartnerStatus,
  type GPSStatus,
} from './components';
import { PartnerSessionUiProvider } from './PartnerSessionUiContext';
import { CaptainBottomSheetAlert } from '../app-captain/components';
import { FirstLaunchScreen } from '../components/FirstLaunchScreen';
import { TouchDebugOverlay } from '../components/TouchDebugOverlay';
import { PartnerWalletHubSheet } from '../../partner/PartnerWalletHubSheet';
import { useFirstLaunchSeen } from '../components/useFirstLaunchSeen';
import {
  PARTNER_APP_HEADER_DISPLAY_NAME_FIXTURE,
  PARTNER_ALL_STORES_SCOPE,
} from '../../dsh/fixtures/partnerStaff';
import { buildPartnerStoresFixture } from '../../dsh/partnerStoreSwitcherFixtures';

const DSH_PENDING_ORDERS_POLL_MS = 15000;

/** §UX-SUPREME-001: Action screens shown as Modal overlay (ضمن شاشة أخرى) */
const ACTION_MODAL_SCREENS: readonly string[] = [
  'dsh_partner_order_accept',
  'dsh_partner_order_reject',
  'dsh_partner_order_handoff',
];

type PendingOrderAlert = {
  id: string;
  restaurant: string;
  total: number;
  itemsCount: number;
  orderTime: string;
};

export interface MobileSurfaceProps {
  navigation?: any;
  theme?: any;
  platform?: 'mobile';
  /** Partner name in header (optional; shell may supply from profile/session) */
  partnerDisplayName?: string;
}

// Inner component that uses the context
const PartnerMobileSurfaceInner: React.FC<MobileSurfaceProps> = ({
  navigation: injectedNavigation,
  theme,
  platform = 'mobile',
  partnerDisplayName: partnerDisplayNameProp,
}) => {
  const { t } = useI18n();
  const { partnerType, isLoading } = usePartnerType();
  const NS = 'mobile.app-partner.PartnerMobileSurface';
  const [currentScreen, setCurrentScreen] = useState<string>(
    getPartnerDefaultRoute()
  );
  const [previousScreen, setPreviousScreen] = useState<string>(
    getPartnerDefaultRoute()
  );
  const [navigationParams, setNavigationParams] = useState<Record<string, unknown>>({});
  const currentScreenRef = useRef(currentScreen);
  const previousScreenRef = useRef(previousScreen);
  const partnerTypeRef = useRef(partnerType);

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    previousScreenRef.current = previousScreen;
  }, [previousScreen]);

  useEffect(() => {
    partnerTypeRef.current = partnerType;
  }, [partnerType]);

  // Partner state management
  const [partnerState, setPartnerState] = useState<PartnerState>('idle');
  const [partnerStatus, setPartnerStatus] =
    useState<PartnerStatus>('available');
  const [gpsStatus, setGpsStatus] = useState<GPSStatus>('on');
  const [taskInfo, setTaskInfo] = useState<
    { title: string; subtitle?: string } | undefined
  >();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [walletSheetVisible, setWalletSheetVisible] = useState(false);

  // DSH: انبثاق طلب جديد — استطلاع طلبات معلقة، أول طلب جديد يُعرض في مودال مع قبول/رفض
  const [lastPendingOrderIds, setLastPendingOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [newOrderAlert, setNewOrderAlert] = useState<PendingOrderAlert | null>(
    null
  );
  const [partnerOrderActionLoading, setPartnerOrderActionLoading] =
    useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const hasCompletedFirstPartnerPollRef = useRef(false);

  const partnerStores = useMemo(
    () => (partnerType === 'dsh' ? buildPartnerStoresFixture() : []),
    [partnerType],
  );

  const resolvedBaseDisplayName = useMemo(
    () =>
      typeof partnerDisplayNameProp === 'string' &&
      partnerDisplayNameProp.trim().length > 0
        ? partnerDisplayNameProp.trim()
        : PARTNER_APP_HEADER_DISPLAY_NAME_FIXTURE,
    [partnerDisplayNameProp],
  );

  const [activeStoreScope, setActiveStoreScope] = useState<string>(
    PARTNER_ALL_STORES_SCOPE,
  );

  // Reset to home when partner type changes
  useEffect(() => {
    if (partnerType) {
      setCurrentScreen(ROUTE_HOME);
      setPreviousScreen(ROUTE_HOME);
      setNavigationParams({});
    }
  }, [partnerType]);

  // DSH: prevent Android hardware back from exiting the app when we have a previous screen.
  // Action modal screens: back closes modal and returns to Home.
  const isActionModalRef = useRef(false);
  useEffect(() => {
    isActionModalRef.current =
      partnerType === 'dsh' && ACTION_MODAL_SCREENS.includes(currentScreen);
  }, [partnerType, currentScreen]);

  useEffect(() => {
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (partnerTypeRef.current !== 'dsh') return false;

        const curr = currentScreenRef.current;
        const prev = previousScreenRef.current;

        if (!prev || curr === ROUTE_HOME || curr === ROUTE_PARTNER_TYPE_SELECT) {
          return false;
        }

        if (isActionModalRef.current) {
          setCurrentScreen(ROUTE_HOME);
          setPreviousScreen(ROUTE_HOME);
          setNavigationParams({});
          return true;
        }

        setCurrentScreen(prev);
        setPreviousScreen(curr);
        if (prev === ROUTE_HOME || prev === ROUTE_PARTNER_TYPE_SELECT) {
          setNavigationParams({});
        }
        return true;
      }
    );

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (partnerType !== 'dsh') return;
    setActiveStoreScope(PARTNER_ALL_STORES_SCOPE);
  }, [partnerType]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  // DSH: استطلاع طلبات في انتظار الشريك — عند ظهور طلب جديد (بعد أول استطلاع) نعرضه في انبثاق
  useEffect(() => {
    if (partnerType !== 'dsh') return;
    if (appState !== 'active') return;
    hasCompletedFirstPartnerPollRef.current = false;
    const poll = async () => {
      try {
        const list = (await getPartnerPendingOrders()) as PendingOrderAlert[];
        const ids = new Set(list.map(o => o.id));
        const isFirstPoll = !hasCompletedFirstPartnerPollRef.current;
        if (isFirstPoll) hasCompletedFirstPartnerPollRef.current = true;
        setLastPendingOrderIds(prev => {
          const added = list.find(o => !prev.has(o.id));
          if (added && !isFirstPoll) setNewOrderAlert(added);
          return ids;
        });
      } catch {
        // ignore
      }
    };
    poll();
    const t = setInterval(poll, DSH_PENDING_ORDERS_POLL_MS);
    return () => clearInterval(t);
  }, [partnerType, appState]);

  /** Center header title. For DSH the default is store-scope ("كل الفروع"),
   *  but profile/settings/support routes must show the current screen title to avoid UI "duplication". */
  const hubHeaderDisplayName = useMemo(() => {
    if (partnerType !== 'dsh') return resolvedBaseDisplayName;

    // Profile/settings routes: replace store-scope title with screen-appropriate titles.
    if (currentScreen === 'PartnerProfile') {
      return t('partner.PartnerProfileScreen.hubTitle');
    }
    if (
      currentScreen === 'platform_partner_profile_get' ||
      currentScreen === 'dsh_partner_profile_get'
    ) {
      return t('dsh.app-partner.mobile.auto_dsh_partner_profile_get.screenTitle');
    }
    if (currentScreen === 'platform_partner_settings') {
      return t('partner.PartnerProfileScreen.settings');
    }
    if (currentScreen === 'platform_partner_notifications') {
      return t('partner.PartnerNotificationsScreen.title');
    }
    if (currentScreen === 'platform_partner_support') {
      return t('partner.PartnerProfileScreen.support');
    }

    // Default DSH header for the home hub: selected store name or «كل المتاجر».
    if (activeStoreScope === PARTNER_ALL_STORES_SCOPE) {
      return t('partner.PartnerHomeScreen.allStoresChip');
    }

    const branchName = partnerStores.find(
      s => s.id === activeStoreScope,
    )?.name?.trim();
    return branchName && branchName.length > 0 ? branchName : resolvedBaseDisplayName;
  }, [
    activeStoreScope,
    currentScreen,
    partnerStores,
    partnerType,
    resolvedBaseDisplayName,
    t,
  ]);

  const adapterNavigate = (name: string, params?: Record<string, unknown>) => {
    const Component = getPartnerScreenComponent(name);
    const effectiveParams =
      name === ROUTE_HOME || name === ROUTE_PARTNER_TYPE_SELECT
        ? {}
        : params ?? {};
    if (Component) {
      setPreviousScreen(currentScreen);
      setCurrentScreen(name);
      setNavigationParams(effectiveParams);
    } else {
      setPreviousScreen(currentScreen);
      setCurrentScreen(ROUTE_HOME);
      setNavigationParams({});
    }
  };

  const baseNav = { navigate: adapterNavigate };
  const actionModalNav = {
    navigate: (name: string, params?: Record<string, unknown>) => {
      if (name === 'dsh_partner_orders_list' || name === ROUTE_HOME) {
        adapterNavigate(ROUTE_HOME, {});
      } else {
        adapterNavigate(name, params);
      }
    },
  };
  const navProps = { navigation: baseNav };

  const shouldShowTopBar =
    currentScreen !== ROUTE_PARTNER_TYPE_SELECT && partnerType !== null;
  const handlePartnerAccept = async () => {
    if (!newOrderAlert || partnerOrderActionLoading) return;
    setPartnerOrderActionLoading(true);
    try {
      await partnerOrderAction(newOrderAlert.id, 'accept');
      setNewOrderAlert(null);
    } catch (e) {
      Alert.alert(t(`${NS}.error`), e instanceof Error ? e.message : t(`${NS}.failedToAcceptRequest`));
    } finally {
      setPartnerOrderActionLoading(false);
    }
  };
  const handlePartnerReject = async () => {
    if (!newOrderAlert || partnerOrderActionLoading) return;
    setPartnerOrderActionLoading(true);
    try {
      await partnerOrderAction(newOrderAlert.id, 'reject');
      setNewOrderAlert(null);
    } catch (e) {
      Alert.alert(t(`${NS}.error`), e instanceof Error ? e.message : t(`${NS}.failedToRejectRequest`));
    } finally {
      setPartnerOrderActionLoading(false);
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

  // Show type selection screen if no partner type is selected
  if (!partnerType) {
    return (
      <ErrorBoundary>
        <PartnerTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  // Handle navigation to type select screen
  if (currentScreen === ROUTE_PARTNER_TYPE_SELECT) {
    return (
      <ErrorBoundary>
        <PartnerTypeSelectScreen navigation={navProps.navigation} />
      </ErrorBoundary>
    );
  }

  const searchRoute =
    partnerType === 'arb' ? 'arb_partner_bookings_list' : 'dsh_partner_orders_list';

  // Get the screen component for current route
  const ScreenComponent = getPartnerScreenComponent(currentScreen);
  const isActionModal =
    partnerType === 'dsh' && ACTION_MODAL_SCREENS.includes(currentScreen);

  const BaseScreenComponent =
    isActionModal && previousScreen && previousScreen !== currentScreen
      ? getPartnerScreenComponent(previousScreen)
      : null;

  const renderBaseScreen = () => {
    if (previousScreen === ROUTE_HOME || !BaseScreenComponent) {
      return (
        <PartnerHomeScreen
          navigation={navProps.navigation}
          partnerType={partnerType}
          isLoading={false}
        />
      );
    }
    return (
      <BaseScreenComponent
        navigation={navProps.navigation}
        route={{ params: {} }}
        partnerType={partnerType}
      />
    );
  };

  const renderScreen = () => {
    if (currentScreen === ROUTE_HOME || !ScreenComponent) {
      return (
        <PartnerHomeScreen
          navigation={navProps.navigation}
          partnerType={partnerType}
          isLoading={false}
        />
      );
    }

    if (isActionModal) {
      const ActionComponent = ScreenComponent;
      const actionNav = { navigate: actionModalNav.navigate };
      return (
        <>
          <View style={styles.baseScreenUnderlay}>{renderBaseScreen()}</View>
          <Modal
            visible={true}
            animationType="slide"
            transparent={false}
            onRequestClose={() => actionModalNav.navigate(ROUTE_HOME)}
          >
            <ActionComponent
              navigation={actionNav}
              route={{ params: navigationParams }}
              partnerType={partnerType}
            />
          </Modal>
        </>
      );
    }

    return (
      <ScreenComponent
        navigation={navProps.navigation}
        route={{ params: navigationParams }}
        partnerType={partnerType}
      />
    );
  };

  // Render with navigation components (no bottom tab bar — map/tasks live in Home hub)
  return (
    <ErrorBoundary>
      <PartnerSessionUiProvider
        value={{
          partnerDisplayName: hubHeaderDisplayName,
          partnerStatus,
          gpsStatus,
          partnerStores,
          activeStoreScope,
          setActiveStoreScope,
          openWalletSheet: () => setWalletSheetVisible(true),
        }}
      >
        <View style={styles.container}>
          <TouchDebugOverlay surfaceId='app-partner' currentScreen={currentScreen} />
          {shouldShowTopBar && (
            <PartnerTopAppBar
              partnerDisplayName={hubHeaderDisplayName}
              partnerState={partnerState as PartnerTopBarState}
              taskInfo={taskInfo}
              onProfilePress={() => adapterNavigate('PartnerProfile')}
              onSearchPress={() => adapterNavigate(searchRoute)}
              onLedgerPress={() => setWalletSheetVisible(true)}
              onNotificationsPress={() => adapterNavigate('platform_partner_notifications')}
              notificationsBadgeCount={notificationCount}
              profileActionBadgeCount={0}
              onSOSPress={
                partnerState === 'issue'
                  ? () => adapterNavigate('platform_partner_support')
                  : undefined
              }
              dshStoreSwitcher={
                partnerType === 'dsh' && partnerStores.length > 0
                  ? {
                      stores: partnerStores,
                      activeScope: activeStoreScope,
                      onSelectScope: setActiveStoreScope,
                      allStoresScope: PARTNER_ALL_STORES_SCOPE,
                    }
                  : undefined
              }
            />
          )}

          <View style={styles.screenContainer}>{renderScreen()}</View>

          <PartnerWalletHubSheet
            visible={walletSheetVisible}
            onRequestClose={() => setWalletSheetVisible(false)}
            onNavigate={(screen) => {
              setWalletSheetVisible(false);
              adapterNavigate(screen);
            }}
          />

          {partnerType === 'dsh' && newOrderAlert && (
            <CaptainBottomSheetAlert
              visible={true}
              title={t(`${NS}.newRequest`)}
              message={`${newOrderAlert.restaurant} — ${newOrderAlert.total} ر.س — ${newOrderAlert.itemsCount} صنف`}
              primaryAction={{
                label: partnerOrderActionLoading
                  ? t(`${NS}.loading`)
                  : t(`${NS}.accept`),
                onPress: () => {
                  if (!partnerOrderActionLoading) handlePartnerAccept();
                },
              }}
              secondaryAction={{
                label: t(`${NS}.reject`),
                onPress: () => {
                  if (!partnerOrderActionLoading) handlePartnerReject();
                },
              }}
              onDismiss={() => {
                if (!partnerOrderActionLoading) setNewOrderAlert(null);
              }}
            />
          )}
        </View>
      </PartnerSessionUiProvider>
    </ErrorBoundary>
  );
};

const APP_PARTNER_FIRST_LAUNCH_KEY = 'app-partner';

// Main component - PartnerTypeProvider is provided by Shell
export const PartnerMobileSurface: React.FC<MobileSurfaceProps> = props => {
  const {
    hasSeen,
    setSeen,
    isLoading: firstLaunchLoading,
  } = useFirstLaunchSeen(APP_PARTNER_FIRST_LAUNCH_KEY);

  if (firstLaunchLoading) return null;
  if (hasSeen === false) {
    return <FirstLaunchScreen onContinue={setSeen} />;
  }
  return <PartnerMobileSurfaceInner {...props} />;
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
  baseScreenUnderlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
});


