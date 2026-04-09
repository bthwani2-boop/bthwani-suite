import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  BackHandler,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';

import {
  ErrorBoundary,
  semanticRoles,
  useFeatureFlag,
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  useDirection,
} from '@bthwani/ui-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './HomeScreen';
import { HeaderIconButton } from './components/HeaderIconButton';
import { ScreenTransition } from '../components/ScreenTransition';
import { TouchDebugOverlay } from '../components/TouchDebugOverlay';

const HEADER_ICON_COLOR = BTHWANI_COLORS.surface;
const HEADER_ICON_SIZE = 24;
const HEADER_ACCENT_COLOR = semanticRoles.accentStrong;

const ROUTE_HOME_FALLBACK = 'Home';
const SND_CANONICAL_ROUTES = new Set([
  'SndHome',
  'SndRequestGet',
  'SndRequests',
]);

type RouteMapModule = {
  getScreenComponent: (routeKey: string) => React.ComponentType<any> | null;
  getDefaultRoute: () => string;
  ROUTE_HOME: string;
};

export interface MobileSurfaceProps {
  navigation?: any;
  theme?: any;
  platform?: 'mobile';
}

export const UserMobileSurface: React.FC<MobileSurfaceProps> = ({
  navigation: injectedNavigation,
  theme,
  platform = 'mobile',
}) => {
  const {
    t,
    alignItemsEndStyle,
    alignItemsStartStyle,
    directionStyle,
    rowStyle,
    textAlignStartStyle,
    resolveMobileHeaderPresentation,
    resolveMobileReadingLayout,
  } = useDirection();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const NS = 'mobile.app-user.UserMobileSurface';
  const [routeMapModule, setRouteMapModule] = useState<RouteMapModule | null>(
    null
  );
  const [screenStack, setScreenStack] = useState<string[]>([
    ROUTE_HOME_FALLBACK,
  ]);
  const [routeParams, setRouteParams] = useState<Record<string, unknown>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [headerSearchVisible, setHeaderSearchVisible] = useState(false);
  const [esfMyRequestsSignal, setEsfMyRequestsSignal] = useState(0);
  const [esfAccountSignal, setEsfAccountSignal] = useState(0);
  const [esfHeaderMode, setEsfHeaderMode] = useState<'donor' | 'requester'>(
    'donor'
  );
  const isSurfaceEnabled = useFeatureFlag('user-mobile-surface-v1');
  const stackLengthRef = useRef(screenStack.length);

  useEffect(() => {
    let cancelled = false;
    import('./routeMap')
      .then(m => {
        if (cancelled) return;
        const getDefaultRouteFn =
          typeof m?.getDefaultRoute === 'function' ? m.getDefaultRoute : null;
        const getScreenComponentFn =
          typeof m?.getScreenComponent === 'function'
            ? m.getScreenComponent
            : null;
        const homeRoute = m?.ROUTE_HOME ?? ROUTE_HOME_FALLBACK;
        if (getDefaultRouteFn && getScreenComponentFn) {
          setRouteMapModule({
            getScreenComponent: getScreenComponentFn,
            getDefaultRoute: getDefaultRouteFn,
            ROUTE_HOME: homeRoute,
          });
          setScreenStack(prev =>
            prev.length === 1 && prev[0] === ROUTE_HOME_FALLBACK
              ? [getDefaultRouteFn()]
              : prev
          );
        }
      })
      .catch(() => {
        if (!cancelled) setRouteMapModule(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ROUTE_HOME = routeMapModule?.ROUTE_HOME ?? ROUTE_HOME_FALLBACK;
  const getScreenComponent = routeMapModule?.getScreenComponent ?? (() => null);
  const getDefaultRoute =
    routeMapModule?.getDefaultRoute ?? (() => ROUTE_HOME_FALLBACK);

  const currentScreen = screenStack[screenStack.length - 1];
  const previousScreen = screenStack[screenStack.length - 2] ?? ROUTE_HOME;
  const isEsfContext = currentScreen.startsWith('Esf');
  const isEsfHomeContext = currentScreen === 'EsfHome';

  const adapterNavigate = (name: string, params?: Record<string, unknown>) => {
    const Component = getScreenComponent(name);

    if (Component) {
      setScreenStack(s => [...s, name]);
      setRouteParams(params ?? {});
    } else {
      setScreenStack([ROUTE_HOME]);
      setRouteParams({});
    }
  };

  const openHeaderSearch = useCallback(() => {
    setHeaderSearchVisible(true);
  }, []);

  const closeHeaderSearch = useCallback(() => {
    setHeaderSearchVisible(false);
    setSearchQuery('');
  }, []);

  const openEsfHeaderSearch = useCallback(() => {
    openHeaderSearch();
    if (!isEsfHomeContext) {
      adapterNavigate('EsfHome', { esfFocus: 'search' });
    }
  }, [adapterNavigate, isEsfHomeContext, openHeaderSearch]);

  const openEsfMyRequests = useCallback(() => {
    if (isEsfHomeContext) {
      setEsfMyRequestsSignal(prev => prev + 1);
      return;
    }

    adapterNavigate('EsfHome', { esfFocus: 'myRequests' });
  }, [adapterNavigate, isEsfHomeContext]);

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

  const getTransitionType = (): 'slide-left' | 'slide-right' | 'fade' => {
    if (currentScreen === ROUTE_HOME || previousScreen === ROUTE_HOME) {
      return 'fade';
    }
    return 'slide-right';
  };

  const navProps = {
    onNavigate: (screen: string, params?: Record<string, unknown>) =>
      adapterNavigate(screen, params),
    navigation: {
      navigate: (screen: string, params?: Record<string, unknown>) =>
        adapterNavigate(screen, params),
      goBack,
    },
  };

  if (!isSurfaceEnabled) {
    return (
      <ErrorBoundary>
        <HomeScreen {...navProps} />
      </ErrorBoundary>
    );
  }

  if (routeMapModule == null) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size='large' color={semanticRoles.primaryCTA} />
        <Text
          style={{
            marginTop: BTHWANI_SPACING.md,
            color: semanticRoles.textMuted,
          }}
        >
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  const Component = getScreenComponent(currentScreen);
  const ScreenComponent = Component ?? HomeScreen;

  const baseProps =
    ScreenComponent === HomeScreen
      ? navProps
      : {
          ...navProps,
          routeKey: currentScreen,
          route: { params: routeParams },
        };
  const screenProps = {
    ...baseProps,
    ...(isEsfHomeContext
      ? {
          shellSearchVisible: headerSearchVisible,
          shellSearchQuery: searchQuery,
          onShellSearchOpen: openEsfHeaderSearch,
          shellMyRequestsSignal: esfMyRequestsSignal,
          shellAccountSignal: esfAccountSignal,
          onEsfModeChange: setEsfHeaderMode,
        }
      : {}),
  };

  const onPrimaryColor =
    theme?.colors?.onPrimary ?? semanticRoles.primaryCTAText;
  const headerBg = theme?.colors?.header ?? semanticRoles.accent;

  const handleSearchToggle = () => {
    if (isEsfContext) {
      if (headerSearchVisible) {
        closeHeaderSearch();
      } else {
        openEsfHeaderSearch();
      }
      return;
    }

    setHeaderSearchVisible(prev => {
      const nextVisible = !prev;
      if (!nextVisible) {
        setSearchQuery('');
      }
      return nextVisible;
    });
  };

  const handleSearchNavigate = () => {
    if (isEsfContext) {
      return;
    }
    if (!searchQuery.trim()) return;
    adapterNavigate('Home');
  };

  const isDshContext = currentScreen.startsWith('Dsh');
  const isSndContext = SND_CANONICAL_ROUTES.has(currentScreen);
  const isWltContext =
    currentScreen === 'WltHome' || currentScreen.startsWith('Wlt');
  const shouldHideHeaderForDshStore = currentScreen.startsWith('DshStore');
  const headerAppName = isEsfContext
    ? 'اسعفني بالدم'
    : isSndContext
      ? 'بثواني'
      : t(`${NS}.header_app_name`);
  const headerTagline = isEsfContext
    ? 'شبكة التبرع الذكية'
    : isSndContext
      ? 'سندك'
      : t(`${NS}.header_tagline`);
  const headerContextText = isEsfContext
    ? esfHeaderMode === 'donor'
      ? 'متبرع'
      : 'طالب دم'
    : t(`${NS}.header_location`);
  const readingLayout = resolveMobileReadingLayout(width);
  const isStackedHeader = readingLayout.headerLayout === 'stacked';
  const isStackedBrand = readingLayout.headerBrandLayout === 'stacked';
  const isInlineBrand = readingLayout.headerBrandLayout === 'inline';
  const hasHeaderActionRail = readingLayout.headerActionsSurface === 'rail';
  const shouldStretchHeaderIdentity = readingLayout.headerIdentityStretch;
  const headerPresentation = resolveMobileHeaderPresentation(
    headerAppName,
    headerTagline
  );
  const headerSearchPlaceholder = isEsfContext
    ? t('esf.app-user.mobile.auto_esf_home_get.feedSearchPlaceholder')
    : t(`${NS}.searchPlaceholder`);
  const titleLeadStyle =
    headerPresentation.titleLeadVariant === 'primary'
      ? styles.headerBrandTextInline
      : styles.headerTaglineInline;
  const titleTailStyle =
    headerPresentation.titleTailVariant === 'primary'
      ? styles.headerBrandTextInline
      : styles.headerTaglineInline;

  const headerIdentity = isWltContext ? (
    <TouchableOpacity
      style={[
        styles.headerRightBlock,
        alignItemsStartStyle,
        !isStackedHeader ? styles.headerRightBlockCompact : null,
        shouldStretchHeaderIdentity ? styles.headerRightBlockStretched : null,
      ]}
      activeOpacity={0.8}
      onPress={() => setScreenStack([ROUTE_HOME])}
    >
      <Text
        style={[
          styles.headerMainTitle,
          { color: onPrimaryColor, fontSize: 20 },
          textAlignStartStyle,
        ]}
        numberOfLines={1}
      >
        {t(`${NS}.wallet_title`)}
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[
        styles.headerRightBlock,
        alignItemsStartStyle,
        !isStackedHeader ? styles.headerRightBlockCompact : null,
        shouldStretchHeaderIdentity ? styles.headerRightBlockStretched : null,
      ]}
      activeOpacity={0.8}
      onPress={() =>
        isDshContext
          ? adapterNavigate('UserAddressesList')
          : setScreenStack([ROUTE_HOME])
      }
    >
      <View
        style={[
          styles.headerTitleBlock,
          alignItemsStartStyle,
          isInlineBrand ? styles.headerTitleBlockInline : null,
          isStackedBrand ? styles.headerTitleBlockStacked : null,
        ]}
      >
        {isInlineBrand ? (
          <View style={[styles.headerInlineTitleRow, rowStyle]}>
            <Text
              style={[
                styles.headerInlineLead,
                titleLeadStyle,
                { color: onPrimaryColor },
              ]}
              numberOfLines={1}
            >
              {headerPresentation.titleLead}
            </Text>
            <Text
              style={[
                styles.headerInlineTail,
                titleTailStyle,
                { color: onPrimaryColor },
              ]}
              numberOfLines={1}
            >
              {headerPresentation.titleTail}
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.headerBrandText,
                { color: onPrimaryColor },
                textAlignStartStyle,
                isStackedBrand ? styles.headerBrandTextStacked : null,
              ]}
              numberOfLines={1}
            >
              {headerAppName}
            </Text>
            <Text
              style={[
                styles.headerTagline,
                { color: onPrimaryColor },
                textAlignStartStyle,
                isStackedBrand ? styles.headerTaglineBlock : null,
              ]}
              numberOfLines={1}
            >
              {headerTagline}
            </Text>
          </>
        )}
      </View>
      <View
        style={[
          styles.headerLocationRow,
          rowStyle,
          !isStackedHeader ? styles.headerLocationRowCompact : null,
        ]}
      >
        <Text
          style={[
            styles.headerLocationText,
            { color: onPrimaryColor },
            textAlignStartStyle,
          ]}
          numberOfLines={1}
        >
          {headerContextText}
        </Text>
        {isEsfContext ? null : <View style={styles.headerPinDot} />}
      </View>
    </TouchableOpacity>
  );

  const headerActionMap = {
    account: (
      <HeaderIconButton
        key='account'
        onPress={() => {
          if (isEsfHomeContext) {
            setEsfAccountSignal(prev => prev + 1);
            return;
          }

          if (isEsfContext) {
            adapterNavigate('EsfHome', { esfFocus: 'settings' });
            return;
          }

          adapterNavigate('UserProfile');
        }}
        accessibilityLabel={isEsfContext ? 'إعدادات ESF' : t(`${NS}.account`)}
      >
        <Ionicons
          name='person-outline'
          size={HEADER_ICON_SIZE}
          color={HEADER_ICON_COLOR}
        />
      </HeaderIconButton>
    ),
    notifications: (
      <HeaderIconButton
        key='notifications'
        onPress={() => adapterNavigate('UserNotificationsList')}
        accessibilityLabel={t(`${NS}.notifications`)}
        badgeCount={5}
        badgeBackgroundColor={HEADER_ACCENT_COLOR}
        badgeBorderColor={BTHWANI_COLORS.surface}
      >
        <Ionicons
          name='notifications-outline'
          size={HEADER_ICON_SIZE}
          color={HEADER_ICON_COLOR}
        />
      </HeaderIconButton>
    ),
    cart: (
      <HeaderIconButton
        key='cart'
        onPress={() =>
          isEsfHomeContext
            ? adapterNavigate('EsfMatchesInbox')
            : isEsfContext
              ? openEsfMyRequests()
              : adapterNavigate('DshCartGet')
        }
        accessibilityLabel={
          isEsfHomeContext
            ? 'فرص التبرع'
            : isEsfContext
              ? 'طلباتي'
              : t(`${NS}.cart`)
        }
      >
        <Ionicons
          name={
            isEsfHomeContext
              ? 'water-outline'
              : isEsfContext
                ? 'document-text-outline'
                : 'cart-outline'
          }
          size={HEADER_ICON_SIZE}
          color={HEADER_ICON_COLOR}
        />
      </HeaderIconButton>
    ),
    search: (
      <HeaderIconButton
        key='search'
        onPress={handleSearchToggle}
        accessibilityLabel={t(`${NS}.search`)}
      >
        <Ionicons
          name='search-outline'
          size={HEADER_ICON_SIZE}
          color={HEADER_ICON_COLOR}
        />
      </HeaderIconButton>
    ),
  } as const;

  const headerActions = (
    <View
      style={[
        styles.headerActions,
        rowStyle,
        isStackedHeader ? alignItemsEndStyle : null,
        !isStackedHeader ? styles.headerActionsCompact : null,
        hasHeaderActionRail ? styles.headerActionsRail : null,
        isStackedHeader ? styles.headerActionsStacked : null,
      ]}
    >
      {headerPresentation.actionOrder.map(
        actionKey => headerActionMap[actionKey]
      )}
    </View>
  );

  return (
    <ErrorBoundary>
      <View style={[styles.container, directionStyle]}>
        {!shouldHideHeaderForDshStore && (
          <>
            <View
              style={[
                styles.header,
                {
                  backgroundColor: headerBg,
                  paddingTop: insets.top,
                  minHeight: readingLayout.headerMinHeight + insets.top,
                  height: 'auto',
                },
              ]}
            >
              <View
                style={[
                  styles.headerGradient,
                  rowStyle,
                  directionStyle,
                  !isStackedHeader ? styles.headerGradientCompact : null,
                  isStackedHeader ? styles.headerGradientStacked : null,
                ]}
              >
                {!headerSearchVisible ? (
                  headerPresentation.childrenOrder === 'actions-first' ? (
                    <>
                      {headerActions}
                      {headerIdentity}
                    </>
                  ) : (
                    <>
                      {headerIdentity}
                      {headerActions}
                    </>
                  )
                ) : (
                  <View style={[styles.searchHeaderContainer, rowStyle]}>
                    <View
                      style={[
                        styles.searchHeaderInputContainer,
                        {
                          backgroundColor: BTHWANI_COLORS.surfaceOverlay20,
                        },
                        rowStyle,
                        directionStyle,
                      ]}
                    >
                      <Ionicons
                        name='search-outline'
                        size={20}
                        color={onPrimaryColor}
                      />
                      <TextInput
                        style={[
                          styles.searchHeaderInput,
                          {
                            color: onPrimaryColor,
                          },
                          textAlignStartStyle,
                        ]}
                        placeholder={headerSearchPlaceholder}
                        placeholderTextColor={onPrimaryColor + 'AA'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                        onSubmitEditing={handleSearchNavigate}
                      />
                      {searchQuery.length > 0 ? (
                        <TouchableOpacity
                          onPress={() => setSearchQuery('')}
                          style={styles.searchClearBtn}
                        >
                          <Ionicons
                            name='close'
                            size={18}
                            color={onPrimaryColor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      style={styles.searchCancelBtn}
                      onPress={handleSearchToggle}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.searchCancelText,
                          { color: onPrimaryColor },
                        ]}
                      >
                        {t('common.cancel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.headerBottomAccent,
                  { backgroundColor: HEADER_ACCENT_COLOR },
                ]}
              />
            </View>
          </>
        )}
        <TouchDebugOverlay surfaceId='app-user' currentScreen={currentScreen} />
        <View style={styles.content}>
          <Suspense
            fallback={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: BTHWANI_SPACING.lg,
                }}
              >
                <ActivityIndicator
                  size='large'
                  color={semanticRoles.primaryCTA}
                />
                <Text
                  style={{
                    marginTop: BTHWANI_SPACING.sm,
                    color: semanticRoles.textMuted,
                  }}
                >
                  {t('common.loading')}
                </Text>
              </View>
            }
          >
            <ScreenTransition
              type={getTransitionType()}
              duration={300}
              visible={true}
            >
              {React.createElement(ScreenComponent, screenProps)}
            </ScreenTransition>
          </Suspense>
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    height: 66,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: 6,
    paddingBottom: 6,
  },
  headerGradientCompact: {
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  headerGradientStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  headerRightBlock: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  headerRightBlockCompact: {
    flexShrink: 1,
  },
  headerRightBlockStretched: {
    width: '100%',
    alignSelf: 'stretch',
  },
  headerTitleBlock: {
    flexDirection: 'column',
    gap: 1,
    width: '100%',
  },
  headerTitleBlockInline: {
    gap: 2,
  },
  headerInlineTitleRow: {
    alignItems: 'baseline',
    gap: 6,
    width: '100%',
  },
  headerInlineLead: {
    flexShrink: 1,
  },
  headerInlineTail: {
    flexShrink: 0,
  },
  headerTitleBlockStacked: {
    gap: 3,
  },
  headerBrandLine: {
    width: '100%',
    alignItems: 'flex-end',
    gap: BTHWANI_SPACING.xs,
  },
  headerBrandText: {
    width: '100%',
  },
  headerBrandTextInline: {
    width: 'auto',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  headerBrandTextStacked: {
    fontSize: 26,
    lineHeight: 30,
  },
  headerMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerTagline: {
    fontSize: 17,
    fontWeight: '600',
    opacity: 0.92,
    letterSpacing: 0.2,
  },
  headerTaglineInline: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  headerTaglineBlock: {
    fontSize: 14,
    opacity: 0.88,
  },
  headerLocationRow: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: BTHWANI_SPACING.xs,
    width: '100%',
    marginTop: 3,
    paddingVertical: 2,
  },
  headerLocationRowCompact: {
    marginTop: 0,
  },
  headerLocationText: {
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.92,
  },
  headerPinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: HEADER_ACCENT_COLOR,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
    flexShrink: 0,
  },
  headerActionsCompact: {
    gap: 0,
  },
  headerActionsRail: {
    alignSelf: 'flex-end',
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 4,
    backgroundColor: BTHWANI_COLORS.surfaceOverlay20,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceOverlay35,
  },
  headerActionsStacked: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  searchHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  searchHeaderInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BTHWANI_COLORS.surfaceOverlay20,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceOverlay35,
  },
  searchHeaderInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: BTHWANI_SPACING.sm,
  },
  searchCancelBtn: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  searchCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerBottomAccent: {
    height: 2,
    width: '100%',
  },
  content: {
    flex: 1,
  },
});

export default UserMobileSurface;
