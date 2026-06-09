import React from 'react';
import { BackHandler, Platform, Pressable, Switch as RNSwitch, View } from 'react-native';
import { useAppCaptainAppearance } from '../../../app-captain/shell/appearance';

// Dynamic safe-area insets loader: avoids hard import so Metro won't fail when
// `react-native-safe-area-context` isn't installed in some environments.
let useSafeAreaInsets: () => { top: number; bottom: number; left: number; right: number } = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
try {
  // hide from static analysis so bundlers that can't resolve the package won't fail
  // eslint-disable-next-line no-eval
  const r: any = eval('require');
  const safe = r('react-native-safe-area-context');
  if (safe && typeof safe.useSafeAreaInsets === 'function') {
    useSafeAreaInsets = safe.useSafeAreaInsets;
  }
} catch (err) {
  // fallback is already a zero-insets function
}
import { Badge, BottomNavBar, Box, Button, colorPalette, Divider, Icon, KeyValueList, ListItem, MobileScrollView, MobileWorkspaceHeader, ModernPremiumHeader, shadowPresets, SheetFrame, StateView, Surface, Text, TextField, TopBar, useTheme, withAlpha } from '@bthwani/ui-kit';
import type { DshCaptainBellEvent } from '../shared/dsh-order-journey.model';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import { wltDshCaptainUiCopy } from '../../../wlt/frontend/dsh/app-captain/wlt-dsh-captain.ui-copy';
import { DshEntryScreen } from './screens/DshCaptainEntryScreen';
import {
  CaptainDeliveryConfirmSheet,
  CaptainOrderDetailScreen,
  CaptainOrdersInboxScreen,
  CaptainPickupConfirmSheet,
  DshCaptainBellScreen,
  DshCaptainOrderAcceptScreen,
  DshCaptainOrderChatScreen,
  DshCaptainOrderDeliverScreen,
  DshCaptainOrderDetailsScreen,
  DshCaptainOrderGetScreen,
  DshCaptainOrderPickupScreen,
  DshCaptainOrdersListScreen,
  DshCaptainOrdersOffersListScreen,
  DshCaptainProofUploadScreen,
} from './screens/DshCaptainOrdersScreen';
import {
  DshCaptainSupportDirectoryScreen,
  DshCaptainChatReadAckScreen,
  DshCaptainChatSendScreen,
} from './screens/DshCaptainOperationsScreen';
import { DshCaptainCodBalanceScreen, DshCaptainFinanceScreen } from './screens/DshCaptainFinanceScreen';
import {
  DshCaptainProfileGetScreen,
  DshCaptainTierEvaluateScreen,
  DshCaptainTierInfoScreen,
} from './screens/DshCaptainProfileScreen';
import { DshCaptainMapScreen } from './screens/DshCaptainMapScreen';
import { DshCaptainPickupDropoffScreen } from './screens/DshCaptainPickupDropoffScreen';
import { DshCaptainPoDSubmissionScreen } from './screens/DshCaptainPoDSubmissionScreen';
import type {
  DshCaptainCommandTarget,
  DshCaptainRoute,
  DshCaptainSurfaceProps,
} from './dsh-captain.types';
import {
  getCaptainLifecycleForOrderStage,
  isCaptainInboxVisibleForMode,
} from './dsh-captain.navigation-bridge';
import {
  isModeVisibleInCaptainInbox,
  isCaptainPodRequiredForMode,
  isCaptainCodCollectorForMode,
} from '../shared/dsh-fulfillment-surface-visibility';
import {
  resolveDshOrderApiBaseUrl,
  createDshOrderLifecycleHttpClient,
  PlatformVarsProvider,
  FeatureFlagProvider,
  usePlatformVars,
} from '../shared';
import { OfferDeclineSheet } from './sheets';

type CaptainOrderDetailSummary = React.ComponentProps<typeof CaptainOrderDetailScreen>['summary'];
type CaptainOrdersInboxScreenState = NonNullable<React.ComponentProps<typeof CaptainOrdersInboxScreen>>['state'];
type CaptainSupportRoute =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-liability'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

type CaptainServiceType = 'dsh' | 'amn';
type CaptainAvailabilityStatus = 'available' | 'unavailable' | 'break' | 'planned-leave';
type CaptainGpsStatus = 'ready' | 'limited' | 'offline' | 'disabled';
type ActiveOrderPhase = 'pickup' | 'delivery';
// Two strictly-separated modes. store_courier_mode hides all BThwani captain state.
type CaptainAppMode = 'bthwani_captain_mode' | 'store_courier_mode';
type StoreCourierStage = 'ready_for_pickup' | 'picked_up' | 'out_for_delivery' | 'delivery_failed' | 'delivered';
type DshCaptainPodState = NonNullable<React.ComponentProps<typeof DshCaptainPoDSubmissionScreen>['state']>;

const CAPTAIN_POD_PREVIEW_MEDIA_KEY = 'dsh.proof.delivery.preview.v1';
const CAPTAIN_POD_PLACEHOLDER_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+kG7wAAAAASUVORK5CYII=';
const DSH_CAPTAIN_PREVIEW_ID = 'CAP-0041';

const CAPTAIN_BOTTOM_NAV_ROUTES = new Set<DshCaptainRoute>([
  'home', 'map', 'inbox', 'account', 'account-finance', 'account-orders',
  'account-profile', 'account-docs', 'account-shifts', 'account-support',
  'support-directory', 'support-screen',
]);

function getRouteForCommandTarget(target: DshCaptainCommandTarget): DshCaptainRoute {
  if (target === 'entry') {
    return 'entry';
  }

  if (target === 'inbox') {
    return 'inbox';
  }

  if (target === 'detail') {
    return 'detail';
  }

  if (target === 'orderchat') {
    return 'orderchat';
  }

  if (target === 'bell') {
    return 'bell';
  }

  if (target === 'support-directory') {
    return 'support-directory';
  }

  if (target === 'account-orders') {
    return 'account-orders';
  }

  if (target === 'pickup-dropoff') {
    return 'pickup-dropoff';
  }

  if (target === 'pod-submission') {
    return 'pod-submission';
  }

  return 'home';
}

type CompactOrderChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  side: 'start' | 'end';
};

const defaultDetailByOrderId: Record<string, CaptainOrderDetailSummary> = {
  'captain-order-9021': {
    orderId: 'captain-order-9021',
    pickupLabel: 'Burger Lab - فرع حطين',
    dropoffLabel: 'حي العليا، طريق الملك فهد',
    etaLabel: 'مدة الوصول إلى الاستلام: 8 دقائق',
    currentStageLabel: 'في الطريق إلى الاستلام',
    nextActionLabel: 'أكد الاستلام بعد التقاط الطلب',
  },
  'captain-order-9024': {
    orderId: 'captain-order-9024',
    pickupLabel: 'Green Bowl - فرع الياسمين',
    dropoffLabel: 'طريق الملك فهد، الحي الشمالي',
    etaLabel: 'مدة الوصول إلى الاستلام: 15 دقيقة',
    currentStageLabel: 'في قائمة الإرسال',
    nextActionLabel: 'ابدأ المسار وأكد الاستلام عند الوصول',
  },
};

const compactOrderChatSeed: CompactOrderChatMessage[] = [
  {
    id: 'compact-msg-1',
    sender: 'العميل',
    text: 'أبقي التحديثات قصيرة لو سمحت، وأنا جاهز عند الوصول.',
    time: '09:12',
    side: 'start',
  },
  {
    id: 'compact-msg-2',
    sender: 'الكابتن',
    text: 'تم. أنا الآن في الطريق إلى الاستلام.',
    time: '09:13',
    side: 'end',
  },
  {
    id: 'compact-msg-3',
    sender: 'العميل',
    text: 'أخبرني قبل دقيقة من الوصول.',
    time: '09:14',
    side: 'start',
  },
];

const captainDisplayName = 'الكابتن عبدالله السبيعي';

const captainAppearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'واجهة فاتحة واضحة، والزجاج يظهر فقط فيما يحدده المطور أثناء مراجعة الشاشات',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'مظهر داكن فاخر مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري',
  },
] as const;

const availabilityStatusMeta: Record<
  CaptainAvailabilityStatus,
  {
    label: string;
    description: string;
    chipTone: 'success' | 'warning' | 'default';
    orderBadgeLabel: string;
  }
> = {
  available: {
    label: 'متاح',
    description: 'جاهز الآن لاستقبال الطلبات والتنقل مباشرة إلى مناطق الطلب.',
    chipTone: 'success',
    orderBadgeLabel: 'نشط',
  },
  unavailable: {
    label: 'غير متاح',
    description: 'تم إيقاف استقبال الطلبات مؤقتًا حتى إعادة التفعيل.',
    chipTone: 'warning',
    orderBadgeLabel: 'موقوف',
  },
  break: {
    label: 'استراحة',
    description: 'استراحة قصيرة محلية بلا أي ربط تشغيلي خارجي.',
    chipTone: 'warning',
    orderBadgeLabel: 'استراحة',
  },
  'planned-leave': {
    label: 'إجازة مخططة',
    description: 'إدارة الإجازات والغياب ما زالت قيد الربط مع عمليات الأسطول وتظهر هنا كمتابعة محلية فقط.',
    chipTone: 'default',
    orderBadgeLabel: 'إجازة',
  },
};

const gpsStatusMeta: Record<
  CaptainGpsStatus,
  {
    label: string;
    description: string;
    chipTone: 'success' | 'warning' | 'default';
  }
> = {
  ready: {
    label: 'GPS جاهز',
    description: 'إشارة الموقع مستقرة محليًا ويمكن عرض الخريطة التجريبية بثقة.',
    chipTone: 'success',
  },
  limited: {
    label: 'GPS محدود',
    description: 'الإشارة متاحة جزئيًا ويجب التعامل معها كإرشاد تقريبي فقط.',
    chipTone: 'warning',
  },
  offline: {
    label: 'GPS دون اتصال',
    description: 'تعذر تحديث الموقع الآن. المسار يعمل كمعاينة محلية حتى تعود الإشارة.',
    chipTone: 'warning',
  },
  disabled: {
    label: 'GPS معطل',
    description: 'الموقع مغلق من الجهاز ويحتاج تفعيل الإذن من إعدادات الهاتف قبل استخدام الخريطة.',
    chipTone: 'default',
  },
};

type MapHeatZone = {
  id: string;
  size: number;
  color: string;
  label: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const demandHeatZones: readonly MapHeatZone[] = [
  { id: 'demand-1', top: 58, right: 34, size: 164, color: withAlpha(colorPalette.brand, 0.20), label: 'طلب مرتفع' },
  { id: 'demand-2', top: 188, left: 26, size: 118, color: withAlpha(colorPalette.brand, 0.14), label: 'ذروة قريبة' },
  { id: 'demand-3', bottom: 108, right: 96, size: 146, color: 'rgba(255, 133, 75, 0.16)', label: 'متاجر نشطة' },
] satisfies readonly MapHeatZone[];

const captainHeatZones: readonly MapHeatZone[] = [
  { id: 'captain-1', top: 128, left: 112, size: 132, color: withAlpha(colorPalette.brandStrong, 0.14), label: 'كباتن أكثر' },
  { id: 'captain-2', bottom: 138, left: 154, size: 104, color: withAlpha(colorPalette.brandStrong, 0.10), label: 'تغطية قريبة' },
] satisfies readonly MapHeatZone[];

function CompactOrderChatBubble({ message }: { message: CompactOrderChatMessage }) {
  const isOutbound = message.side === 'end';

  return (
    <Surface tone={isOutbound ? 'brand' : 'raised'} padding={2} gap={1} radiusToken="lg" border={false}>
      <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
        <Badge label={message.sender} tone={isOutbound ? 'brand' : 'default'} />
        <Text role="caption" tone={isOutbound ? 'inverse' : 'muted'}>{message.time}</Text>
      </Box>
      <Text role="bodySm" tone={isOutbound ? 'inverse' : 'default'}>
        {message.text}
      </Text>
    </Surface>
  );
}

function CaptainAccountNavRow({
  title,
  subtitle,
  icon,
  badgeLabel,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  badgeLabel?: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: pressed ? theme.surfaceInset : 'transparent',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.line + '22',
      })}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.brandSurface,
            borderWidth: 1,
            borderColor: theme.brand + '33',
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={20} tone="brand" />
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 0,
            gap: 2,
            alignItems: 'flex-end',
          }}
        >
          <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
            <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
              {title}
            </Text>
            {badgeLabel ? <Badge label={badgeLabel} tone="brand" /> : null}
          </Box>
          <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right' }}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
    </Pressable>
  );
}

function resolveRuntimeOrderId(orderId: string): string {
  return orderId.startsWith('captain-order-') ? orderId.replace('captain-order-', '') : orderId;
}

export function DshCaptainSurface(props: DshCaptainSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshCaptainSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshCaptainSurfaceInner({ command, captainId = DSH_CAPTAIN_PREVIEW_ID }: DshCaptainSurfaceProps) {
  const { theme } = useTheme();
  const { dshAuthBearerToken, dshClientId } = usePlatformVars();
  const {
    hydrated: appearanceHydrated,
    mode: appearanceMode,
    setMode: setAppearanceMode,
  } = useAppCaptainAppearance();
  const insets = useSafeAreaInsets();
  const [activeServiceType, setActiveServiceType] = React.useState<CaptainServiceType>('dsh');
  const [route, setRoute] = React.useState<DshCaptainRoute>(() => getRouteForCommandTarget(command.target));
  const [inboxState, setInboxState] = React.useState<CaptainOrdersInboxScreenState>('ready');
  const [activeOrderId, setActiveOrderId] = React.useState<string>('captain-order-9021');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<CaptainSupportRoute>('orders-list');
  const [isPickupSheetVisible, setIsPickupSheetVisible] = React.useState(false);
  const [isDeliverySheetVisible, setIsDeliverySheetVisible] = React.useState(false);
  const [captainAvailabilityStatus, setCaptainAvailabilityStatus] = React.useState<CaptainAvailabilityStatus>('available');
  const [gpsStatus, setGpsStatus] = React.useState<CaptainGpsStatus>('limited');
  const [activeOrderExpanded, setActiveOrderExpanded] = React.useState(false);
  const [activeOrderPhase, setActiveOrderPhase] = React.useState<ActiveOrderPhase>('pickup');
  const [captainAppMode, setCaptainAppMode] = React.useState<CaptainAppMode>('bthwani_captain_mode');
  const isStoreCourierMode = captainAppMode === 'store_courier_mode';
  // SSoT: bthwani_delivery orders are visible in captain inbox; partner_delivery and pickup are not.
  // SSoT: bthwani_delivery is the only mode visible in captain inbox
  const bthwaniDeliveryVisibleInInbox = isModeVisibleInCaptainInbox('bthwani_delivery') && isCaptainInboxVisibleForMode('bthwani_delivery');
  // PoD required only in bthwani_delivery mode; store_courier_mode skips it
  const captainPodRequired = !isStoreCourierMode && isCaptainPodRequiredForMode('bthwani_delivery');
  const captainCollectsCod = !isStoreCourierMode && isCaptainCodCollectorForMode('bthwani_delivery');
  const showCaptainBottomNav = isStoreCourierMode
    ? route === 'home' || route === 'account'
    : CAPTAIN_BOTTOM_NAV_ROUTES.has(route);
  const [activeOrderDraft, setActiveOrderDraft] = React.useState('');
  const [activeOrderMessages, setActiveOrderMessages] = React.useState<CompactOrderChatMessage[]>(compactOrderChatSeed);
  const [storeCourierStage, setStoreCourierStage] = React.useState<StoreCourierStage>('ready_for_pickup');
  const [captainPodState, setCaptainPodState] = React.useState<DshCaptainPodState>('ready');
  const [captainPodPhotoUri, setCaptainPodPhotoUri] = React.useState<string | undefined>();
  const [captainPodMediaKey, setCaptainPodMediaKey] = React.useState<string | undefined>();
  const [isDeclineSheetVisible, setIsDeclineSheetVisible] = React.useState(false);
  const [declineSheetState, setDeclineSheetState] = React.useState<'ready' | 'loading' | 'success' | 'error'>('ready');
  const [declineOrderId, setDeclineOrderId] = React.useState<string>('');
  const [pickupSheetState, setPickupSheetState] = React.useState<'ready' | 'loading' | 'success' | 'error'>('ready');

  const apiBaseUrl = React.useMemo(() => resolveDshOrderApiBaseUrl(), []);
  const orderLifecycleClient = React.useMemo(() => createDshOrderLifecycleHttpClient(apiBaseUrl), [apiBaseUrl]);

  const handleAcceptTask = React.useCallback(async (orderId: string) => {
    const rawOrderId = resolveRuntimeOrderId(orderId);
    try {
      setInboxState('offer-accepting');
      await orderLifecycleClient.acceptTask(rawOrderId, { captain_id: captainId });
      setInboxState('offer-accepted');
      setActiveOrderId(orderId);
      setRoute('detail');
      setInboxState('ready');
    } catch (err) {
      console.error("Failed to accept task", err);
      setInboxState('error');
    }
  }, [captainId, orderLifecycleClient]);

  const handleDeclineConfirm = React.useCallback(async (orderId: string, reason: string) => {
    const rawOrderId = resolveRuntimeOrderId(orderId);
    try {
      setDeclineSheetState('loading');
      await orderLifecycleClient.declineTask(rawOrderId, { captain_id: captainId, reason });
      setDeclineSheetState('success');
      setTimeout(() => {
        setIsDeclineSheetVisible(false);
        setDeclineSheetState('ready');
        setRoute('inbox');
      }, 1000);
    } catch (err) {
      console.error("Failed to decline task", err);
      setDeclineSheetState('error');
    }
  }, [captainId, orderLifecycleClient]);
  const routeHistoryRef = React.useRef<DshCaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  const activeSummary = defaultDetailByOrderId[activeOrderId] ?? defaultDetailByOrderId['captain-order-9021']!;
  const activeOrderDisplayId = resolveRuntimeOrderId(activeSummary.orderId);
  const orderChatState = inboxState === 'delivered' ? 'readOnly' : 'active';
  const isCaptainAvailable = captainAvailabilityStatus === 'available';
  const isGpsEnabled = gpsStatus !== 'disabled';
  const currentAvailabilityMeta = availabilityStatusMeta[captainAvailabilityStatus];
  const currentGpsMeta = gpsStatusMeta[gpsStatus];

  // Binary toggle: available <-> unavailable (owner decision)
  const cycleAvailabilityStatus = React.useCallback(() => {
    setCaptainAvailabilityStatus((current) => (current === 'available' ? 'unavailable' : 'available'));
  }, []);

  // Simple GPS toggle: ready <-> disabled. No sheet/screen opened by toggle.
  const cycleGpsStatus = React.useCallback(() => {
    setGpsStatus((current) => (current === 'ready' ? 'disabled' : 'ready'));
  }, []);

  const goBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      setRoute(previousRoute);
      return true;
    }

    if (route !== 'home') {
      setRoute('home');
      return true;
    }

    return false;
  }, [route]);

  React.useEffect(() => {
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];

    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (!command) {
      return;
    }

    const nextRoute = getRouteForCommandTarget(command.target);
    routeHistoryRef.current = [nextRoute];
    routeTransitionFromBackRef.current = false;
    setRoute(nextRoute);
  }, [command?.target, command?.token]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return goBack();
    });

    return () => subscription.remove();
  }, [goBack]);

  React.useEffect(() => {
    if (inboxState !== 'ready') {
      return;
    }

    setActiveOrderExpanded(false);
    setActiveOrderPhase('pickup');
    setActiveOrderDraft('');
    setActiveOrderMessages(compactOrderChatSeed);
  }, [activeOrderId, inboxState]);

  React.useEffect(() => {
    setCaptainPodState('ready');
    setCaptainPodPhotoUri(undefined);
    setCaptainPodMediaKey(undefined);
  }, [activeOrderId]);

  React.useEffect(() => {
    if (captainAppMode !== 'store_courier_mode') {
      setStoreCourierStage('ready_for_pickup');
      setCaptainPodState('ready');
      setCaptainPodPhotoUri(undefined);
      setCaptainPodMediaKey(undefined);
    }
  }, [captainAppMode]);

  const openOrderDetail = React.useCallback((orderId: string) => {
    setActiveOrderId(orderId);
    setRoute('detail');
  }, []);

  const openCaptainAccount = React.useCallback(() => {
    setRoute('account');
  }, []);

  const openCaptainAccountSection = React.useCallback((sectionRoute: DshCaptainRoute) => {
    setRoute(sectionRoute);
  }, []);

  const openSupportDirectory = React.useCallback(() => {
    setRoute('support-directory');
  }, []);

  const capturePodPhotoPreview = React.useCallback(() => {
    setCaptainPodPhotoUri(CAPTAIN_POD_PLACEHOLDER_URI);
    setCaptainPodMediaKey(CAPTAIN_POD_PREVIEW_MEDIA_KEY);
    setCaptainPodState('ready');
  }, []);

  const confirmPodSubmission = React.useCallback(async () => {
    if (!captainPodPhotoUri || !captainPodMediaKey) {
      return;
    }

    setCaptainPodState('loading');

    try {
      const rawOrderId = resolveRuntimeOrderId(activeOrderId);

      // DSH-SLICE-005E: submit proof-of-delivery. Transitions ARRIVED → DELIVERED.
      // WLT BOUNDARY: no payout mutation here. Payout is WLT responsibility post-DELIVERED.
      await orderLifecycleClient.deliverOrder(rawOrderId, {
        captain_id: captainId,
        pod_media_key: captainPodMediaKey,
      });

      setCaptainPodState('success');

      if (captainAppMode === 'store_courier_mode') {
        setStoreCourierStage('delivered');
        setInboxState('delivered');
      }
    } catch (err) {
      console.error("Failed to confirm delivery API call:", err);
      setCaptainPodState('error');
    }
  }, [activeOrderId, captainAppMode, captainId, captainPodMediaKey, captainPodPhotoUri, orderLifecycleClient]);

  const reportPodFailure = React.useCallback(async () => {
    const rawOrderId = resolveRuntimeOrderId(activeOrderId);

    try {
      // DSH-SLICE-005F: report delivery failure. Transitions ARRIVED → RETURNING_TO_STORE.
      // WLT BOUNDARY: no financial mutation. wlt_refund_trigger_ref (if any) is bridge ref only.
      await orderLifecycleClient.failDelivery(rawOrderId, {
        captain_id: captainId,
        failure_reason: 'CLIENT_UNREACHABLE',
        return_required: true,
      });

      setCaptainPodState('retry-required');

      if (captainAppMode === 'store_courier_mode') {
        setStoreCourierStage('delivery_failed');
      }
    } catch (err) {
      console.error("Failed to report delivery failure API call:", err);
      setCaptainPodState('error');
    }
  }, [activeOrderId, captainAppMode, captainId, orderLifecycleClient]);

  const openCaptainSupportScreen = React.useCallback((screenId: CaptainSupportRoute) => {
    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  }, []);

  const expandActiveOrder = React.useCallback(() => {
    setActiveOrderExpanded(true);
  }, []);

  const collapseActiveOrder = React.useCallback(() => {
    setActiveOrderExpanded(false);
  }, []);

  const confirmPickup = React.useCallback(async () => {
    const rawOrderId = resolveRuntimeOrderId(activeOrderId);
    try {
      setPickupSheetState('loading');
      await orderLifecycleClient.confirmPickup(rawOrderId, { captain_id: captainId });
      setPickupSheetState('success');
      setTimeout(() => {
        setIsPickupSheetVisible(false);
        setPickupSheetState('ready');
        setActiveOrderPhase('delivery');
        setActiveOrderMessages((current) => [
          ...current,
          {
            id: `compact-msg-${current.length + 1}`,
            sender: 'النظام',
            text: 'تم تأكيد الاستلام. المرحلة التالية هي التسليم.',
            time: 'الآن',
            side: 'start',
          },
        ]);
      }, 1000);
    } catch (err) {
      console.error("Failed to confirm pickup", err);
      setPickupSheetState('error');
    }
  }, [activeOrderId, captainId, orderLifecycleClient]);

  const confirmDelivery = React.useCallback(async () => {
    const rawOrderId = resolveRuntimeOrderId(activeOrderId);

    try {
      await orderLifecycleClient.deliverOrder(rawOrderId, { captain_id: captainId });
      setInboxState('delivered');
      setActiveOrderExpanded(false);
    } catch (err) {
      console.error("Failed to confirm delivery", err);
      setCaptainPodState('error');
    }
  }, [activeOrderId, captainId, orderLifecycleClient]);

  const sendQuickMessage = React.useCallback(() => {
    const text = activeOrderDraft.trim();

    if (!text) {
      return;
    }

    setActiveOrderMessages((current) => [
      ...current,
      {
        id: `compact-msg-${current.length + 1}`,
        sender: 'الكابتن',
        text,
        time: 'الآن',
        side: 'end',
      },
    ]);
    setActiveOrderDraft('');
  }, [activeOrderDraft]);

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    const nextType: CaptainServiceType = typeId === 'amn' ? 'amn' : 'dsh';
    setActiveServiceType(nextType);
    setRoute('home');
    setInboxState('ready');
    setActiveOrderId('captain-order-9021');
    setActiveOrderExpanded(false);
    setIsPickupSheetVisible(false);
    setIsDeliverySheetVisible(false);
  }, []);

  const captainEntryState = inboxState === 'loading' ? 'loading' : inboxState === 'empty' ? 'empty' : 'ready';

  const renderCaptainFlow = () => {
    if (route === 'entry') {
      return (
        <DshEntryScreen
          state={captainEntryState}
          onOpenOffersPress={() => setRoute('inbox')}
          onOpenExecutionPress={() => setRoute('detail')}
          onOpenProofCapturePress={() => {
            setActiveOrderId('captain-order-9021');
            setIsDeliverySheetVisible(true);
            setRoute('detail');
          }}
        />
      );
    }

    if (route === 'inbox') {
      // SSoT: only bthwani_delivery orders are visible in captain inbox
      if (!bthwaniDeliveryVisibleInInbox) {
        return null;
      }
      return (
        <CaptainOrdersInboxScreen
          state={inboxState}
          onRetry={() => setInboxState('ready')}
          onOpenOrder={openOrderDetail}
          onOpenNextOrder={openOrderDetail}
        />
      );
    }

    if (route === 'detail') {
      return (
        <>
          <Box gap={3}>
            <CaptainOrderDetailScreen
              summary={activeSummary}
              onConfirmPickup={() => setIsPickupSheetVisible(true)}
              onConfirmDelivery={() => setIsDeliverySheetVisible(true)}
              onOpenNextOrder={() => setRoute('inbox')}
              onRetry={() => setRoute('detail')}
            />
            <Button label="فتح تواصل الطلب" tone="secondary" fullWidth={false} onPress={() => setRoute('orderchat')} />
            <Button label="مرحلة الاستلام والتسليم" tone="secondary" fullWidth={false} onPress={() => setRoute('pickup-dropoff')} />
          </Box>

          <CaptainPickupConfirmSheet
            visible={isPickupSheetVisible}
            orderTitle={activeSummary.orderId}
            state={pickupSheetState}
            onConfirm={confirmPickup}
            onCancel={() => {
              setIsPickupSheetVisible(false);
              setPickupSheetState('ready');
            }}
          />

          <CaptainDeliveryConfirmSheet
            visible={isDeliverySheetVisible}
            orderTitle={activeSummary.orderId}
            onConfirm={() => {
              setIsDeliverySheetVisible(false);
              setInboxState('delivered');
              setRoute('inbox');
            }}
            onCancel={() => setIsDeliverySheetVisible(false)}
          />

          <OfferDeclineSheet
            visible={isDeclineSheetVisible}
            offerId={declineOrderId}
            state={declineSheetState}
            onConfirmDecline={(offerId, reason) => handleDeclineConfirm(offerId, reason)}
            onClose={() => setIsDeclineSheetVisible(false)}
          />
        </>
      );
    }

    if (route === 'bell') {
      return (
        <DshCaptainBellScreen
          onOpenInbox={() => setRoute('inbox')}
          onOpenNextOrder={() => openOrderDetail(activeOrderId)}
          onRetry={() => setRoute('bell')}
        />
      );
    }

    if (route === 'orderchat') {
      return (
        <DshCaptainOrderChatScreen
          orderId={activeSummary.orderId}
          pickupLabel={activeSummary.pickupLabel}
          dropoffLabel={activeSummary.dropoffLabel}
          state={orderChatState}
        />
      );
    }

    if (route === 'map') {
      return (
        <DshCaptainMapScreen
          orderId={activeOrderId}
          captainId={captainId}
          onBack={() => setRoute('detail')}
          orderLifecycleClient={orderLifecycleClient}
        />
      );
    }

    if (route === 'pickup-dropoff') {
      return (
        <DshCaptainPickupDropoffScreen
          mode="pickup"
          orderId={activeOrderId}
          storeName={activeSummary.pickupLabel}
          customerName="العميل"
          address={activeSummary.dropoffLabel}
          itemsCount={3}
          onConfirm={() => setRoute('pod-submission')}
          onReportIssue={() => setRoute('inbox')}
          onBack={goBack}
          onRingBell={() => {
            // UI_PREVIEW_ONLY: bell event stub — no runtime dispatch, value is not used
            void ({ orderId: activeOrderId, captainId, timestamp: new Date().toISOString(), proximityState: 'bell_rang' } satisfies DshCaptainBellEvent);
          }}
        />
      );
    }

    if (route === 'pod-submission' && captainPodRequired) {
      return (
        <DshCaptainPoDSubmissionScreen
          state={captainPodState}
          orderId={activeOrderId}
          onCapturePhoto={capturePodPhotoPreview}
          onConfirm={confirmPodSubmission}
          onReportFailure={reportPodFailure}
          onRetry={() => {
            setCaptainPodState('ready');
          }}
          onBack={captainPodState === 'success'
            ? () => {
                setCaptainPodState('ready');
                setRoute('home');
              }
            : goBack}
          photoUri={captainPodPhotoUri}
        />
      );
    }

    return null;
  };

  const renderCaptainAccountShell = (title: string, subtitle: string, content: React.ReactNode) => {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar
          variant="surface"
          title={title}
          subtitle={subtitle}
        />
        <Box style={{ flex: 1, paddingBottom: showCaptainBottomNav ? 80 : 0 }}>
          <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 32 }}>
            <Box padding={4} gap={4}>
              {content}
            </Box>
          </MobileScrollView>
        </Box>
        {showCaptainBottomNav && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            {captainBottomNavBar}
          </View>
        )}
      </View>
    );
  };

  const captainAccountNavItems = React.useMemo(() => [
    {
      title: 'بيانات الكابتن',
      subtitle: 'الهوية، النوع، والحالة الحالية.',
      badgeLabel: 'مباشر',
      icon: 'person-outline' as const,
      onPress: () => openCaptainAccountSection('account-profile'),
    },
    {
      title: wltDshCaptainUiCopy.financeTitle,
      subtitle: wltDshCaptainUiCopy.financeSubtitle,
      badgeLabel: wltDshCaptainUiCopy.financeBadgeLabel,
      icon: 'wallet-outline' as const,
      onPress: () => openCaptainAccountSection('account-finance'),
    },
    {
      title: 'الطلبات',
      subtitle: 'الطلب النشط والسجل المختصر.',
      badgeLabel: 'نشط',
      icon: 'receipt-outline' as const,
      onPress: () => openCaptainAccountSection('account-orders'),
    },
    {
      title: 'الوثائق والتقييم',
      subtitle: 'الملفات، التقييم، والمستوى.',
      badgeLabel: 'جاهز',
      icon: 'document-text-outline' as const,
      onPress: () => openCaptainAccountSection('account-docs'),
    },
    {
      title: 'الدوام / الإجازات',
      subtitle: 'الحضور وجدول اليوم وخطة الإجازة.',
      badgeLabel: 'اليوم',
      icon: 'calendar-outline' as const,
      onPress: () => openCaptainAccountSection('account-shifts'),
    },
    {
      title: 'الإعدادات',
      subtitle: 'المظهر، وضع التطبيق، والتفضيلات.',
      badgeLabel: 'محلي',
      icon: 'settings-outline' as const,
      onPress: () => openCaptainAccountSection('account-support'),
    },
    {
      title: 'الدعم',
      subtitle: 'دليل مسارات DSH وقنوات المساندة.',
      badgeLabel: 'مفتوح',
      icon: 'help-circle-outline' as const,
      onPress: () => openSupportDirectory(),
    },
  ], [openCaptainAccountSection, openSupportDirectory]);


  const renderCaptainAccountRootScreen = () => {
    return (
      <Box gap={4}>
        {/* Profile Card & Quick Stats Grid */}
        <Box gap={4}>
          {/* User Profile Header */}
          <Box layoutDirection="row" align="center" gap={3} style={{ flexDirection: 'row-reverse' }}>
            {/* Avatar Container */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.brandSurface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.brand + '44',
              }}
            >
              <Icon name="person" size={28} tone="brand" />
            </View>

            {/* Name & Title */}
            <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
              <Text role="titleSm" style={{ color: theme.text }}>{captainDisplayName}</Text>
              <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                <Badge label="كابتن DSH" tone="success" />
                <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
              </Box>
            </View>
          </Box>

          <Divider />

          {/* Quick Stats Grid */}
          <Box layoutDirection="row" gap={3} style={{ flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">التقييم</Text>
              <Text role="bodyStrong" tone="info">4.9 ★</Text>
            </View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">المستوى</Text>
              <Text role="bodyStrong" tone="brand">Elite 3</Text>
            </View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">{wltDshCaptainUiCopy.summaryLabel}</Text>
              <Text role="bodyStrong" tone="success">{wltDshCaptainUiCopy.walletBalanceLabel}</Text>
            </View>
          </Box>
        </Box>

        <Divider />

        {/* Navigation List — flush rows, no gap between items */}
        <Box gap={0}>
          {captainAccountNavItems.map((item) => (
            <CaptainAccountNavRow
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              badgeLabel={item.badgeLabel}
              icon={item.icon}
              onPress={item.onPress}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderCaptainAccountSectionPage = (title: string, subtitle: string, items: React.ComponentProps<typeof KeyValueList>['items'], footerNote?: string) => {
    return renderCaptainAccountShell(
      title,
      subtitle,
      <Box gap={4}>
        <KeyValueList items={items} />
        {footerNote ? (
          <>
            <Divider />
            <Text role="bodySm" tone="muted" align="end">
              {footerNote}
            </Text>
          </>
        ) : null}
      </Box>
    );
  };

  const renderCaptainAccountFinanceScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <View style={{ flex: 1, paddingBottom: showCaptainBottomNav ? 80 : 0 }}>
          <DshCaptainFinanceScreen
            onBack={() => setRoute('account')}
            dshAuthBearerToken={dshAuthBearerToken}
            dshClientId={dshClientId}
          />
        </View>
        {showCaptainBottomNav && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            {captainBottomNavBar}
          </View>
        )}
      </View>
    );
  };

  const renderCaptainAccountProfileScreen = () => {
    const items = [
      { label: 'الاسم', value: captainDisplayName },
      { label: 'النوع', value: 'DSH', tone: 'success' },
      { label: 'الحالة', value: currentAvailabilityMeta.label, tone: currentAvailabilityMeta.chipTone === 'success' ? 'success' : 'warning' },
      { label: 'المنطقة', value: 'المنطقة الوسطى' },
      { label: 'التقييم', value: '4.9 / 5', tone: 'info' },
      { label: 'المستوى', value: 'Elite 3', tone: 'brand' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('بيانات الكابتن', 'الهوية والحالة والملف التشغيلي', items);
  };

  const renderCaptainAccountOrdersScreen = () => {
    const items = [
      { label: 'الطلب النشط', value: `#${activeOrderDisplayId}`, tone: 'success' },
      { label: 'المتجر', value: 'Burger Lab', tone: 'brand' },
      { label: 'المرحلة الحالية', value: activeSummary.currentStageLabel, tone: 'info' },
      { label: 'الاستلام', value: activeSummary.pickupLabel },
      { label: 'التسليم', value: activeSummary.dropoffLabel },
      { label: 'الخطوة التالية', value: activeSummary.nextActionLabel, tone: 'warning' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('الطلبات', 'الطلب النشط والسجل المختصر', items, 'السجل التاريخي الكامل يبقى read-only إلى أن يثبت مصدر الأرشفة التشغيلي.');
  };

  const renderCaptainAccountDocsScreen = () => {
    const items = [
      { label: 'الوثائق', value: '3 ملفات محلية', tone: 'success' },
      { label: 'التقييم', value: '4.9 / 5', tone: 'info' },
      { label: 'المستوى', value: 'Elite 3', tone: 'brand' },
      { label: 'حالة المراجعة', value: 'جاهز للمراجعة' },
      { label: 'الاعتماد الحقيقي', value: 'قيد الربط', tone: 'warning' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('الوثائق والتقييم', 'الملفات والمستوى وجاهزية الاعتماد', items, 'ربط الوثائق الحقيقي ينتظر مصدر الاعتماد المركزي ويظهر هنا كمتابعة جاهزية فقط.');
  };

  const renderCaptainAccountShiftsScreen = () => {
    const items = [
      { label: 'حالة الدوام', value: isCaptainAvailable ? 'متاح اليوم' : 'غير متاح اليوم', tone: isCaptainAvailable ? 'success' : 'warning' },
      { label: 'جدول اليوم', value: 'صباحي', tone: 'brand' },
      { label: 'الإجازة القادمة', value: 'قيد المراجعة' },
      { label: 'آخر تحديث', value: 'الآن', tone: 'info' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('الدوام / الإجازات', 'الحضور وجدول اليوم وخطة الإجازة', items, 'طلب الإجازة الحقيقي ينتظر ربط إدارة الأسطول ويظهر هنا كمعاينة حالة فقط.');
  };


  const renderCaptainAccountSupportScreen = () => {
    const rowDirection = 'row-reverse' as const;

    // Appearance row — inline segmented toggle identical to Partner settings
    const appearanceRow = (
      <View
        style={{
          flexDirection: rowDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: theme.surface,
        }}
      >
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12, flexShrink: 1, minWidth: 0 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name="color-palette-outline" size={17} tone="default" />
          </View>
          <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: 'flex-end' }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>المظهر</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
              {appearanceHydrated ? 'فاتح أبيض أو داكن زجاجي' : 'جارٍ الاستعادة...'}
            </Text>
          </View>
        </View>

        {/* Segmented pill toggle */}
        <View
          style={{
            flexDirection: rowDirection,
            backgroundColor: theme.surfaceInset,
            borderRadius: 12,
            padding: 3,
            borderWidth: 1,
            borderColor: theme.line,
            gap: 4,
          }}
        >
          <Pressable
            onPress={() => setAppearanceMode('lightPremium')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9,
              backgroundColor: appearanceMode === 'lightPremium' ? theme.brand : 'transparent',
            }}
          >
            <Text role="bodyStrong" style={{ fontSize: 12, color: appearanceMode === 'lightPremium' ? theme.brandContrast : theme.text }}>
              فاتح
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAppearanceMode('darkGlass')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9,
              backgroundColor: appearanceMode === 'darkGlass' ? theme.brand : 'transparent',
            }}
          >
            <Text role="bodyStrong" style={{ fontSize: 12, color: appearanceMode === 'darkGlass' ? theme.brandContrast : theme.text }}>
              داكن
            </Text>
          </Pressable>
        </View>
      </View>
    );

    // App mode row — flat pressable with switch
    const appModeRow = (
      <View
        style={{
          flexDirection: rowDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.line,
        }}
      >
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12, flexShrink: 1, minWidth: 0 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name="storefront-outline" size={17} tone="default" />
          </View>
          <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: 'flex-end' }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>وضع موصل المتجر</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={2}>
              {captainAppMode === 'store_courier_mode'
                ? 'مفعّل — طلبات المتجر فقط'
                : 'غير مفعّل — الوضع الافتراضي'}
            </Text>
          </View>
        </View>
        <RNSwitch
          value={captainAppMode === 'store_courier_mode'}
          onValueChange={(next) => {
            setCaptainAppMode(next ? 'store_courier_mode' : 'bthwani_captain_mode');
            setRoute('home');
          }}
          thumbColor={captainAppMode === 'store_courier_mode' ? theme.brandContrast : theme.surfaceRaised}
          trackColor={{ false: theme.lineStrong, true: theme.brand }}
          ios_backgroundColor={theme.lineStrong}
        />
      </View>
    );

    // Quick access rows removed — الدعم is now a standalone account nav item
    return renderCaptainAccountShell(
      'الإعدادات',
      'المظهر، وضع التطبيق، والتفضيلات المحلية',
      <Box gap={4}>
        {/* Appearance + App mode — flat rows */}
        <Box padding={0} gap={0}>
          {appearanceRow}
          {appModeRow}
        </Box>
      </Box>
    );
  };

  const goToInbox = React.useCallback(() => setRoute('inbox'), []);
  const resetInboxState = React.useCallback(() => setInboxState('ready'), []);
  const toggleActiveOrderExpandedCb = React.useCallback(() => setActiveOrderExpanded((c) => !c), []);

  const homeTicker = React.useMemo(() => {
    if (!isCaptainAvailable) {
      return {
        statusLabel: currentAvailabilityMeta.label,
        message: currentAvailabilityMeta.description,
        onPress: cycleAvailabilityStatus,
        marquee: false,
      };
    }
    if (inboxState === 'loading') {
      return {
        statusLabel: 'تحميل',
        message: 'جارٍ تجهيز حركة الكابتن وطبقة الحرارة التجريبية على الخريطة.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    if (inboxState === 'error') {
      return {
        statusLabel: 'تنبيه',
        message: 'تعذر تحميل الطلب النشط. أعد المحاولة أو افتح صندوق الطلبات.',
        onPress: resetInboxState,
        marquee: false,
      };
    }
    if (inboxState === 'empty') {
      return {
        statusLabel: 'انتظار',
        message: 'لا يوجد طلب نشط الآن. ابقَ على الخريطة وانتظر الحركة التالية.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    if (inboxState === 'delivered') {
      return {
        statusLabel: 'مغلق',
        message: 'تم تسليم الطلب الأخير. افتح صندوق الطلبات لالتقاط الحركة التالية.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    return {
      statusLabel: `#${activeOrderDisplayId}`,
      message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`,
      onPress: toggleActiveOrderExpandedCb,
      marquee: false,
    };
  }, [
    isCaptainAvailable,
    inboxState,
    currentAvailabilityMeta,
    cycleAvailabilityStatus,
    activeOrderDisplayId,
    activeSummary,
    goToInbox,
    resetInboxState,
    toggleActiveOrderExpandedCb,
  ]);

  const storeCourierMeta = React.useMemo(() => {
    if (storeCourierStage === 'picked_up') {
      return {
        badgeLabel: 'تم الاستلام',
        badgeTone: 'brand' as const,
        stageLabel: 'الطلب معك ويحتاج بدء التوصيل',
        distanceLabel: '1.6 كم',
        helperText: 'أكّد بدء التوصيل قبل الوصول إلى العميل.',
      };
    }

    if (storeCourierStage === 'out_for_delivery') {
      return {
        badgeLabel: 'في الطريق',
        badgeTone: 'warning' as const,
        stageLabel: 'الطلب في الطريق إلى العميل',
        distanceLabel: '0.9 كم',
        helperText: 'بعد الوصول افتح إثبات التسليم أو صنّف الحالة كتعذر توصيل.',
      };
    }

    if (storeCourierStage === 'delivery_failed') {
      return {
        badgeLabel: 'تعذر التوصيل',
        badgeTone: 'danger' as const,
        stageLabel: 'الحالة تحتاج دعمًا أو إعادة محاولة',
        distanceLabel: '—',
        helperText: 'افتح الدعم لتسجيل الاستثناء أو أعد المحاولة بعد التواصل مع العميل.',
      };
    }

    if (storeCourierStage === 'delivered') {
      return {
        badgeLabel: 'مسلّم',
        badgeTone: 'success' as const,
        stageLabel: 'تم التسليم وتوثيق الإثبات',
        distanceLabel: '—',
        helperText: 'يمكنك العودة للسجل أو مراجعة إثبات التسليم عند الحاجة.',
      };
    }

    return {
      badgeLabel: 'جاهز للاستلام',
      badgeTone: 'success' as const,
      stageLabel: 'جاهز للاستلام من الفرع',
      distanceLabel: '2.3 كم',
      helperText: 'هذا الطلب يخص وضع موصل المتجر فقط ولا يشارك طابور كابتن بثواني.',
    };
  }, [storeCourierStage]);

  const markStoreCourierPickedUp = React.useCallback(() => {
    setStoreCourierStage('picked_up');
    setActiveOrderPhase('delivery');
  }, []);

  const markStoreCourierOutForDelivery = React.useCallback(() => {
    setStoreCourierStage('out_for_delivery');
    setActiveOrderPhase('delivery');
  }, []);

  const openStoreCourierProof = React.useCallback(() => {
    setCaptainPodState('ready');
    // SSoT: 'proof' order stage → captain route via dsh-captain.navigation-bridge
    const proofRoute = getCaptainLifecycleForOrderStage('proof', isStoreCourierMode).captainRoute;
    setRoute(proofRoute);
  }, [isStoreCourierMode]);

  const markStoreCourierDeliveryFailed = React.useCallback(() => {
    setStoreCourierStage('delivery_failed');
    openSupportDirectory();
  }, [openSupportDirectory]);

  const topBar = (
    <ModernPremiumHeader
      title={isStoreCourierMode ? 'موصل المتجر' : captainDisplayName}
      locationLabel={isStoreCourierMode ? 'وضع موصل المتجر — طلبات المتجر فقط' : wltDshCaptainUiCopy.topBarLocationLabel}
      actions={[
        {
          id: 'account',
          icon: <Icon name="person-outline" size={20} color={colorPalette.white} />,
          accessibilityLabel: 'الحساب',
          onPress: openCaptainAccount,
        },
        { id: 'search', icon: <Icon name="search-outline" size={20} color={colorPalette.white} />, accessibilityLabel: 'البحث', onPress: openSupportDirectory },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={20} color={colorPalette.white} />,
          badgeCount: 2,
          accessibilityLabel: 'الإشعارات',
          onPress: () => setRoute('bell'),
        },
        // Wallet action is BThwani-captain-only — hidden in store_courier_mode
        ...(isStoreCourierMode ? [] : [{
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={20} color={colorPalette.white} />,
          accessibilityLabel: wltDshCaptainUiCopy.walletAccessibilityLabel,
          onPress: () => openCaptainSupportScreen('cod-liability'),
        }]),
      ]}
      tickerStatus={
        isStoreCourierMode
          ? 'موصل المتجر'
          : homeTicker?.statusLabel
      }
      tickerMessage={
        isStoreCourierMode
          ? 'انتظر تعيين الطلب التالي من المتجر.'
          : homeTicker?.message
      }
      onTickerPress={
        isStoreCourierMode
          ? undefined
          : homeTicker?.onPress
      }
      direction="rtl"
    />
  );

  const routeHeaderMeta: Record<string, { title: string; subtitle: string }> = {
    entry: { title: 'بوابة التنفيذ', subtitle: 'ابدأ من الفرز والقبول قبل الخروج للميدان.' },
    inbox: { title: 'صندوق الطلبات', subtitle: 'الطلب النشط أولًا ثم بقية الصف.' },
    detail: { title: 'تفاصيل الطلب', subtitle: 'راجع الطلب قبل التنفيذ أو التسليم.' },
    orderchat: { title: 'تواصل الطلب', subtitle: 'مراسلات قصيرة مرتبطة بالطلب النشط.' },
    map: { title: 'خريطة المهمة', subtitle: 'عرض المسار وتبديل المراحل.' },
    'pickup-dropoff': { title: 'الاستلام والتسليم', subtitle: 'مراحل التسليم من الاستلام حتى إثبات التسليم.' },
    'pod-submission': { title: 'إثبات التسليم', subtitle: 'التقاط صورة الإثبات وإرسالها لإغلاق الطلب.' },
  };

  const renderHomeOrderPanel = () => {
    const panelPadding = activeOrderExpanded ? 3 : 2;
    const panelMinHeightStyle = !activeOrderExpanded ? { minHeight: 72 } : {};
    const activeOrderCompactRouteLabel = 'Burger Lab → العميل';
    const activeOrderStageLabel = activeOrderPhase === 'pickup' ? activeSummary.currentStageLabel : 'في الطريق إلى التسليم';
    const activeOrderNextActionLabel = activeOrderPhase === 'pickup' ? activeSummary.nextActionLabel : 'أكد التسليم بعد الوصول إلى العميل';

    if (!isCaptainAvailable) {
      return (
        <Surface
          tone="raised"
          padding={panelPadding}
          gap={3}
          radiusToken="xl"
          style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}
        >
          <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
          <Box gap={1}>
            <Text role="bodyStrong">الواجهة متوقفة حتى يعود الكابتن للتوفر</Text>
            <Text role="bodySm" tone="muted">
              {currentAvailabilityMeta.description}
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} tone="success" label="تبديل الحالة" onPress={cycleAvailabilityStatus} />
            <Button size="sm" fullWidth={false} tone="ghost" label="فتح الطلبات" onPress={() => setRoute('inbox')} />
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'loading') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={shadowPresets.overlay}
        >
          <Badge label="تحميل" tone="info" />
          <Box gap={1}>
            <Text role="bodyStrong">الخريطة قيد التحضير</Text>
            <Text role="bodySm" tone="muted">
              سيظهر الطلب النشط هنا عندما تكتمل بيانات التشغيل المحلية.
            </Text>
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'error') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={shadowPresets.overlay}
        >
          <Badge label="تنبيه" tone="danger" />
          <Box gap={1}>
            <Text role="bodyStrong">تعذر تحميل الطلب النشط</Text>
            <Text role="bodySm" tone="muted">
              أعد المحاولة من نفس البطاقة أو افتح صندوق الطلبات لمراجعة الصف الحالي.
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} label="إعادة المحاولة" onPress={() => setInboxState('ready')} />
            <Button size="sm" fullWidth={false} tone="ghost" label="صندوق الطلبات" onPress={() => setRoute('inbox')} />
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'empty') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={shadowPresets.overlay}
        >
          <Badge label="انتظار" tone="warning" />
          <Box gap={1}>
            <Text role="bodyStrong">لا يوجد طلب نشط</Text>
            <Text role="bodySm" tone="muted">
              ابقَ على الخريطة حتى تصل الحركة التالية. التاريخ والحساب يظهران كملخص read-only إلى أن يصل المصدر المركزي.
            </Text>
            <Text role="caption" tone="muted">
              التواصل بعد الإغلاق يبقى read-only مؤقتًا حتى يحدد التحكم المركزي نافذة الاحتفاظ بالمحادثة.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} label="فتح الطلبات" onPress={() => setRoute('inbox')} />
        </Surface>
      );
    }

    if (inboxState === 'delivered') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={2}
          radiusToken="xl"
          style={shadowPresets.overlay}
        >
          <Badge label="مغلق" tone="default" />
          <Box gap={1}>
            <Text role="bodyStrong">لا يوجد طلب نشط</Text>
            <Text role="bodySm" tone="muted">
              تم إغلاق الطلب. التاريخ والحساب يظهران كملخص read-only إلى أن يصل مصدر الأرشفة المركزي.
            </Text>
            <Text role="caption" tone="muted">
              التواصل هنا أصبح read-only بعد مدة احتفاظ يحددها التحكم المركزي.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} tone="ghost" label="عرض صندوق الطلبات" onPress={() => setRoute('inbox')} />
        </Surface>
      );
    }

    return (
      activeOrderExpanded ? (
        <Surface
          tone="raised"
          padding={panelPadding}
          gap={3}
          radiusToken="xl"
          style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}
        >
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Box gap={1} style={{ flex: 1 }}>
              <Text role="caption" tone="muted">
                الطلب النشط
              </Text>
              <Box layoutDirection="row" align="center" gap={2}>
                <Badge label={currentAvailabilityMeta.orderBadgeLabel} tone={currentAvailabilityMeta.chipTone} />
                <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
              </Box>
            </Box>
            <Button size="sm" fullWidth={false} tone="ghost" label="طي" onPress={collapseActiveOrder} />
          </Box>

          <Box gap={2}>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                الاستلام
              </Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
                {activeSummary.pickupLabel}
              </Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                التسليم
              </Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
                {activeSummary.dropoffLabel}
              </Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                المرحلة
              </Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
                {activeOrderStageLabel}
              </Text>
            </Box>
            <Text role="caption" tone="muted">
              {activeOrderNextActionLabel}
            </Text>
          </Box>

          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {activeOrderPhase === 'pickup' ? (
              <Button size="sm" fullWidth={false} tone="success" label="تأكيد الاستلام" onPress={confirmPickup} />
            ) : (
              <Button size="sm" fullWidth={false} tone="primary" label="تأكيد التسليم" onPress={confirmDelivery} />
            )}
            <Button size="sm" fullWidth={false} tone="ghost" label="خريطة المهمة" onPress={() => setRoute('map')} />
          </Box>

          <Surface tone="inset" padding={2} gap={2} radiusToken="lg">
            <Box gap={1}>
              <Text role="caption" tone="muted">
                مراسلة مختصرة
              </Text>
              <Text role="bodySm" tone="muted">
                رسائل قصيرة فقط، مباشرة داخل نفس البطاقة، من دون scroll إضافي.
              </Text>
            </Box>

            <Box gap={2}>
              {activeOrderMessages.slice(-2).map((message) => (
                <CompactOrderChatBubble key={message.id} message={message} />
              ))}
            </Box>

            <Box gap={2}>
              <TextField
                value={activeOrderDraft}
                onChangeText={setActiveOrderDraft}
                placeholder="اكتب رسالة مختصرة..."
                multiline
                numberOfLines={2}
                style={{ minHeight: 68, textAlignVertical: 'top' }}
              />
              <Box layoutDirection="row" justify="space-between" align="center" gap={2} style={{ flexWrap: 'wrap' }}>
                <Text role="caption" tone="muted">
                  الحوار يبقى compact داخل البطاقة.
                </Text>
                <Button size="sm" fullWidth={false} label="إرسال" onPress={sendQuickMessage} disabled={!activeOrderDraft.trim()} />
              </Box>
            </Box>
          </Surface>
        </Surface>
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel="توسيع الطلب النشط" onPress={expandActiveOrder} style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}>
          <Surface
            tone="raised"
            padding={panelPadding}
            gap={2}
            radiusToken="xl"
            style={{ ...shadowPresets.overlay, ...panelMinHeightStyle }}
          >
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Box gap={1} style={{ flex: 1 }}>
                <Text role="caption" tone="muted">
                  الطلب النشط
                </Text>
                <Box layoutDirection="row" align="center" gap={2}>
                  <Badge label="نشط" tone="success" />
                  <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
                </Box>
              </Box>
              <Button size="sm" fullWidth={false} tone="secondary" label="توسيع" onPress={expandActiveOrder} />
            </Box>

            <Text role="bodySm" numberOfLines={1} tone="muted">
              {activeOrderCompactRouteLabel}
            </Text>

            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                {activeSummary.etaLabel}
              </Text>
            </Box>
          </Surface>
        </Pressable>
      )
    );
  };

  const renderStoreCourierHomeScreen = () => (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: showCaptainBottomNav ? (Platform.OS === 'android' ? 112 : 80) + 16 : insets.bottom + 16 }}>
      {/* ─── Mode badge ───────────────────────────────────────────────── */}
      <Surface tone="raised" padding={3} gap={2} radiusToken="xl">
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Box gap={1}>
            <Text role="bodyStrong">وضع موصل المتجر</Text>
            <Text role="bodySm" tone="muted">تُعرض فقط الطلبات المسندة إليك من المتجر.</Text>
          </Box>
          <Badge label="نشط" tone="success" />
        </Box>
      </Surface>

      {/* ─── Assigned store order + simple actions ────────────────────── */}
      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <Text role="label" tone="muted">الطلب المسند</Text>
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Text role="bodyStrong">ORD-4401</Text>
          <Badge label={storeCourierMeta.badgeLabel} tone={storeCourierMeta.badgeTone} />
        </Box>
        <KeyValueList
          items={[
            { label: 'المتجر', value: 'فرع الياسمين' },
            { label: 'المرحلة', value: storeCourierMeta.stageLabel },
            { label: 'المسافة', value: storeCourierMeta.distanceLabel },
          ]}
        />
        <Surface tone="inset" padding={2} gap={1} radiusToken="lg">
          <Text role="caption" tone="muted">{storeCourierMeta.helperText}</Text>
        </Surface>
        <Box gap={2}>
          {storeCourierStage === 'ready_for_pickup' ? (
            <>
              <Button label="استلام من الفرع" tone="success" onPress={markStoreCourierPickedUp} />
              <Button label="فتح الدعم" tone="secondary" onPress={openSupportDirectory} />
            </>
          ) : null}
          {storeCourierStage === 'picked_up' ? (
            <>
              <Button label="بدأ التوصيل" tone="primary" onPress={markStoreCourierOutForDelivery} />
              <Button label="الرجوع إلى الاستلام" tone="secondary" onPress={() => setStoreCourierStage('ready_for_pickup')} />
            </>
          ) : null}
          {storeCourierStage === 'out_for_delivery' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="تم التوصيل" tone="ghost" onPress={openStoreCourierProof} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="تعذر التوصيل" tone="danger" onPress={markStoreCourierDeliveryFailed} />
              </Box>
            </Box>
          ) : null}
          {storeCourierStage === 'delivery_failed' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="إعادة المحاولة" tone="secondary" onPress={() => setStoreCourierStage('out_for_delivery')} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="الدعم" tone="danger" onPress={openSupportDirectory} />
              </Box>
            </Box>
          ) : null}
          {storeCourierStage === 'delivered' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="عرض إثبات التسليم" tone="secondary" onPress={openStoreCourierProof} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="فتح السجل" tone="ghost" onPress={() => openCaptainAccountSection('account-orders')} />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Surface>

      {/* ─── Store earnings (policy-conditional — shown when compensation applies) ── */}
      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <Text role="label" tone="muted">مستحقاتي من المتجر</Text>
        <KeyValueList
          items={[
            { label: 'اليوم', value: '45 ريال' },
            { label: 'هذا الأسبوع', value: '210 ريال' },
            { label: 'نوع الاستحقاق', value: 'مبلغ ثابت لكل توصيلة' },
          ]}
        />
        <Surface tone="inset" padding={2} gap={1} radiusToken="lg">
          <Text role="caption" tone="muted">هذا المبلغ من المتجر مباشرةً — ليس تسوية كابتن بثواني.</Text>
        </Surface>
      </Surface>
    </MobileScrollView>
  );

  const renderHomeScreen = () => (
    <Box style={{ flex: 1, position: 'relative' }}>
      {/* Map area - occupies remaining screen space */}
      <Surface tone="inset" padding={0} gap={0} radiusToken="xl" style={{ flex: 1, overflow: 'hidden', borderColor: theme.lineStrong }}>
        <Box style={{ flex: 1, backgroundColor: theme.surfaceSecondary, overflow: 'hidden' }}>
          <Box style={{ position: 'absolute', inset: 0, backgroundColor: withAlpha(colorPalette.white, 0.12) }} />
          <Box style={{ position: 'absolute', top: 78, left: 40, width: 7, height: 222, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.10) }} />
          <Box style={{ position: 'absolute', top: 136, left: 40, right: 74, height: 7, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.08) }} />
          <Box style={{ position: 'absolute', top: 214, right: 58, width: 148, height: 7, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.08), transform: [{ rotate: '-18deg' }] }} />
          <Box style={{ position: 'absolute', bottom: 122, left: 92, right: 42, height: 7, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.06), transform: [{ rotate: '14deg' }] }} />

          {demandHeatZones.map((zone) => (
            <Box
              key={zone.id}
              style={{
                position: 'absolute',
                width: zone.size,
                height: zone.size,
                borderRadius: zone.size / 2,
                backgroundColor: zone.color,
                borderWidth: 1,
                borderColor: withAlpha(colorPalette.brand, 0.12),
                ...(zone.top != null ? { top: zone.top } : {}),
                ...(zone.bottom != null ? { bottom: zone.bottom } : {}),
                ...(zone.left != null ? { left: zone.left } : {}),
                ...(zone.right != null ? { right: zone.right } : {}),
              }}
            />
          ))}

          {captainHeatZones.map((zone) => (
            <Box
              key={zone.id}
              style={{
                position: 'absolute',
                width: zone.size,
                height: zone.size,
                borderRadius: zone.size / 2,
                backgroundColor: zone.color,
                borderWidth: 1,
                borderColor: withAlpha(colorPalette.brandStrong, 0.12),
                ...(zone.top != null ? { top: zone.top } : {}),
                ...(zone.bottom != null ? { bottom: zone.bottom } : {}),
                ...(zone.left != null ? { left: zone.left } : {}),
                ...(zone.right != null ? { right: zone.right } : {}),
              }}
            />
          ))}

          {/* Map marker remains a visual point inside the map. */}
          <Box style={{ position: 'absolute', top: 182, left: 148, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colorPalette.brandStrong, borderWidth: 4, borderColor: colorPalette.white }} />
          </Box>

          {/* Soft map-edge controls overlay for availability, GPS, and map keys. */}
          <Box style={{ position: 'absolute', left: 8, right: 8, top: 4, zIndex: 9999, elevation: 20 }}>
            <Surface
              tone="inset"
              padding={1}
              gap={1}
              radiusToken="xl"
              style={{
                alignSelf: 'stretch',
                ...shadowPresets.raised,
              }}
            >
              <Box layoutDirection="row" align="center" gap={1} style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Box layoutDirection="row" align="center" gap={1} paddingX={1} paddingY={1} radiusToken="pill" background="surfaceRaised" border borderTone="line">
                  <Text role="caption" tone={isCaptainAvailable ? 'success' : 'warning'} weight="semibold" numberOfLines={1}>
                    {currentAvailabilityMeta.label}
                  </Text>
                  <RNSwitch
                    value={isCaptainAvailable}
                    onValueChange={(nextValue) => setCaptainAvailabilityStatus(nextValue ? 'available' : 'unavailable')}
                    thumbColor={isCaptainAvailable ? theme.brandContrast : theme.surfaceRaised}
                    trackColor={{ false: theme.lineStrong, true: theme.brand }}
                    ios_backgroundColor={theme.lineStrong}
                  />
                </Box>

                <Box layoutDirection="row" align="center" gap={1} paddingX={1} paddingY={1} radiusToken="pill" background="surfaceRaised" border borderTone="line">
                  <Text role="caption" tone="muted" weight="semibold" numberOfLines={1}>
                    GPS
                  </Text>
                  <RNSwitch
                    value={isGpsEnabled}
                    onValueChange={(nextValue) => setGpsStatus(nextValue ? 'ready' : 'disabled')}
                    thumbColor={isGpsEnabled ? theme.brandContrast : theme.surfaceRaised}
                    trackColor={{ false: theme.lineStrong, true: theme.brand }}
                    ios_backgroundColor={theme.lineStrong}
                  />
                </Box>

                <Box layoutDirection="row" align="center" gap={1} paddingX={1} paddingY={1} radiusToken="pill" background="surfaceRaised" border borderTone="line">
                  <Box layoutDirection="row" align="center" gap={1}>
                    <Box style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brand, 0.95) }} />
                    <Text role="caption" tone="muted" weight="semibold" numberOfLines={1}>
                      فرص طلبات
                    </Text>
                  </Box>
                  <Box layoutDirection="row" align="center" gap={1}>
                    <Box style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.95) }} />
                    <Text role="caption" tone="muted" weight="semibold" numberOfLines={1}>
                      تجمع كباتن
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Surface>
          </Box>
        </Box>
      </Surface>

      {/* Order card pinned overlay keeps the map first while staying clear of the bottom bar. */}
      <Box style={{ position: 'absolute', left: 12, right: 12, bottom: showCaptainBottomNav ? (Platform.OS === 'android' ? 112 : 80) + 12 : insets.bottom + 16 }}>{renderHomeOrderPanel()}</Box>
    </Box>
  );

  /* GPS sheet removed: GPS toggles are local-only and do not open sheets (Phase A) */

  if (activeServiceType === 'amn') {
    return (
      <Box style={{ flex: 1 }} background="background">
        <MobileWorkspaceHeader
          title="AMN — قيد الربط"
          description="هذا المسار غير نشط داخل DSH حاليًا ولا ينافس السياق التنفيذي الحالي."
          icon="alert-circle-outline"
          backLabel="العودة إلى DSH"
          onBack={() => handleSelectServiceType('dsh')}
        />
        <Surface
          tone="raised"
          padding={0}
          gap={0}
          radiusToken="none"
          border={false}
          style={{
            flex: 1,
            marginTop: -2,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            overflow: 'hidden',
          }}
        >
          <MobileScrollView fill padding={4} gap={4}>
            <StateView
              stateId="warning"
              title="AMN غير نشط داخل هذا السطح"
              description="DSH هو السياق التنفيذي النشط، بينما يظهر AMN هنا كمرجع read-only حتى يكتمل الربط المعتمد."
              actionLabel="العودة إلى DSH"
              onActionPress={() => handleSelectServiceType('dsh')}
            />
            <Surface tone="inset" padding={4} gap={2} radiusToken="xl">
              <Text role="bodyStrong">لا نضيف أي binding جديد هنا.</Text>
              <Text role="bodySm" tone="muted">
                AMN حاضر هنا كمرجع read-only غير نشط، ولا ينبغي أن يزاحم DSH في هذا السطح.
              </Text>
            </Surface>
          </MobileScrollView>
        </Surface>
      </Box>
    );
  }

  let captainBottomActiveId = '';
  if (isStoreCourierMode) {
    captainBottomActiveId = route === 'home' ? 'my-orders' : route === 'account' ? 'profile' : '';
  } else {
    if (route === 'inbox' || route === 'account-orders') {
      captainBottomActiveId = 'orders';
    } else if (route === 'account-finance') {
      captainBottomActiveId = 'wallet';
    } else if (route === 'support-directory' || route === 'support-screen') {
      captainBottomActiveId = 'support';
    } else if (
      route === 'account' ||
      route === 'account-profile' ||
      route === 'account-docs' ||
      route === 'account-shifts' ||
      route === 'account-support'
    ) {
      captainBottomActiveId = 'profile';
    }
  }

  // store_courier_mode: no wallet launcher, no BThwani orders tab
  const captainBottomNavBar = isStoreCourierMode ? (
    <BottomNavBar
      activeId={captainBottomActiveId}
      direction="rtl"
      launcherLabel="طلباتي"
      launcherIcon="receipt-outline"
      launcherActive={route === 'home'}
      onLauncherPress={() => setRoute('home')}
      onSelect={(id: string) => {
        if (id === 'history') openCaptainAccountSection('account-orders');
        if (id === 'earnings') openCaptainAccountSection('account-finance');
        if (id === 'support') openSupportDirectory();
        if (id === 'profile') openCaptainAccount();
      }}
      items={[
        { id: 'history', label: 'السجل', icon: 'time-outline', activeIcon: 'time' },
        { id: 'support', label: 'الدعم', icon: 'help-circle-outline', activeIcon: 'help-circle' },
        { id: 'earnings', label: 'مستحقاتي', icon: 'cash-outline', activeIcon: 'cash' },
        { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
      ]}
    />
  ) : (
    <BottomNavBar
      activeId={captainBottomActiveId}
      direction="rtl"
      launcherLabel="الخريطة"
      launcherIcon="map-outline"
      launcherActive={route === 'home' || route === 'map'}
      onLauncherPress={() => setRoute('home')}
      onSelect={(id: string) => {
        if (id === 'orders') setRoute('inbox');
        if (id === 'wallet') openCaptainAccountSection('account-finance');
        if (id === 'support') openSupportDirectory();
        if (id === 'profile') openCaptainAccount();
      }}
      items={[
        { id: 'orders', label: 'الطلبات', icon: 'receipt-outline', activeIcon: 'receipt' },
        { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' },
        { id: 'support', label: 'الدعم', icon: 'help-circle-outline', activeIcon: 'help-circle' },
        { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
      ]}
    />
  );

  if (route !== 'home') {
    if (route === 'account-finance') {
      return renderCaptainAccountFinanceScreen();
    }

    if (route === 'account-profile') {
      return renderCaptainAccountProfileScreen();
    }

    if (route === 'account-orders') {
      return renderCaptainAccountOrdersScreen();
    }

    if (route === 'account-docs') {
      return renderCaptainAccountDocsScreen();
    }

    if (route === 'account-shifts') {
      return renderCaptainAccountShiftsScreen();
    }

    if (route === 'account-support') {
      return renderCaptainAccountSupportScreen();
    }

    if (route === 'account') {
      return renderCaptainAccountShell(
        'حساب الكابتن',
        'ملف التشغيل والمالية والدوام',
        renderCaptainAccountRootScreen()
      );
    }

    if (route === 'support-directory') {
      return renderCaptainAccountShell(
        'دليل الدعم',
        'كل مسارات DSH المتبقية في مكان واحد',
        <DshCaptainSupportDirectoryScreen onOpenScreen={(screenId) => openCaptainSupportScreen(screenId as CaptainSupportRoute)} />
      );
    }

    if (route === 'support-screen') {
      let supportScreenContent: React.ReactNode = null;
      switch (selectedSupportScreen) {
        case 'chat-read-ack': supportScreenContent = <DshCaptainChatReadAckScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />; break;
        case 'chat-send': supportScreenContent = <DshCaptainChatSendScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />; break;
        // SSoT: COD screen only shown when captain collects COD (bthwani_delivery, not store_courier_mode)
        case 'cod-liability':
          supportScreenContent = captainCollectsCod ? (
            <DshCaptainCodBalanceScreen
              onBack={openSupportDirectory}
              onRetry={openSupportDirectory}
              dshAuthBearerToken={dshAuthBearerToken}
              dshClientId={dshClientId}
            />
          ) : null;
          break;
        case 'order-accept':
          supportScreenContent = (
            <DshCaptainOrderAcceptScreen
              orderId={activeOrderId}
              onBack={openSupportDirectory}
              onAccept={handleAcceptTask}
              onDecline={(id) => {
                setDeclineOrderId(id);
                setIsDeclineSheetVisible(true);
              }}
            />
          );
          break;
        case 'order-deliver': supportScreenContent = <DshCaptainOrderDeliverScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('proof-upload')} />; break;
        case 'order-details': supportScreenContent = <DshCaptainOrderDetailsScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />; break;
        case 'order-get': supportScreenContent = <DshCaptainOrderGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />; break;
        case 'order-pickup': supportScreenContent = <DshCaptainOrderPickupScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('order-deliver')} />; break;
        case 'orders-list': supportScreenContent = <DshCaptainOrdersListScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('orders-offers-list')} />; break;
        case 'orders-offers-list': supportScreenContent = <DshCaptainOrdersOffersListScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('order-accept')} />; break;
        case 'profile-get': supportScreenContent = <DshCaptainProfileGetScreen onBack={openSupportDirectory} onRetry={openSupportDirectory} />; break;
        case 'proof-upload': supportScreenContent = <DshCaptainProofUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />; break;
        case 'tier-evaluate': supportScreenContent = <DshCaptainTierEvaluateScreen onBack={openSupportDirectory} onRetry={openSupportDirectory} />; break;
        case 'tier-info': supportScreenContent = <DshCaptainTierInfoScreen onBack={openSupportDirectory} onRetry={openSupportDirectory} />; break;
        default: supportScreenContent = null;
      }
      return renderCaptainAccountShell(
        selectedSupportScreen === 'cod-liability' ? 'ذمة الدفع عند الاستلام' : 'الدعم',
        'المسار المفتوح من الدليل',
        supportScreenContent
      );
    }

    if (route === 'bell') {
      return renderCaptainAccountShell(
        'الإشعارات',
        'تنبيهات الطلبات الجديدة دون ضجيج',
        <DshCaptainBellScreen
          onOpenInbox={goToInbox}
          onOpenNextOrder={() => openOrderDetail(activeOrderId)}
          onRetry={() => setRoute('bell')}
        />
      );
    }

    const meta = routeHeaderMeta[route];
    const content: React.ReactNode = renderCaptainFlow();

    // Flat layout — identical to renderCaptainAccountShell, no rounded container
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        {meta && (
          <TopBar
            variant="surface"
            title={meta.title}
            subtitle={meta.subtitle}
          />
        )}
        <View style={{ flex: 1, paddingBottom: showCaptainBottomNav ? 80 : 0 }}>
          <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 32 }}>
            <Box padding={4} gap={4}>
              {content}
            </Box>
          </MobileScrollView>
        </View>
        {showCaptainBottomNav && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            {captainBottomNavBar}
          </View>
        )}
      </View>
    );
  }

  return (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      {topBar}
      <Box
        background="background"
        padding={0}
        gap={0}
        radiusToken="none"
        border={false}
        style={{
          flex: 1,
          marginTop: -2,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          paddingBottom: showCaptainBottomNav ? (Platform.OS === 'android' ? 112 : 80) : 0,
        }}
      >
        {isStoreCourierMode ? renderStoreCourierHomeScreen() : renderHomeScreen()}
      </Box>
      {showCaptainBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          {captainBottomNavBar}
        </View>
      )}
    </Box>
  );
}

export { DshCaptainSurface as DshSurfaceHost };
export default DshCaptainSurface;
