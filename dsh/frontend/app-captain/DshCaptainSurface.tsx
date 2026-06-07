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
import { Badge, BottomNavBar, Box, Button, colorPalette, Divider, Icon, KeyValueList, ListItem, MobileScrollView, MobileWorkspaceHeader, ModernPremiumHeader, SheetFrame, StateView, Surface, Text, TextField, TopBar, useTheme, withAlpha } from '@bthwani/ui-kit';
import type { DshCaptainBellEvent } from '../../shared/dsh-order-journey.model';
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
    pickupLabel: 'Burger Lab - ÙØ±Ø¹ Ø­Ø·ÙŠÙ†',
    dropoffLabel: 'Ø­ÙŠ Ø§Ù„Ø¹Ù„ÙŠØ§ØŒ Ø·Ø±ÙŠÙ‚ Ø§Ù„Ù…Ù„Ùƒ ÙÙ‡Ø¯',
    etaLabel: 'Ù…Ø¯Ø© Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…: 8 Ø¯Ù‚Ø§Ø¦Ù‚',
    currentStageLabel: 'ÙÙŠ Ø§Ù„Ø·Ø±ÙŠÙ‚ Ø¥Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
    nextActionLabel: 'Ø£ÙƒØ¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ø¹Ø¯ Ø§Ù„ØªÙ‚Ø§Ø· Ø§Ù„Ø·Ù„Ø¨',
  },
  'captain-order-9024': {
    orderId: 'captain-order-9024',
    pickupLabel: 'Green Bowl - ÙØ±Ø¹ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†',
    dropoffLabel: 'Ø·Ø±ÙŠÙ‚ Ø§Ù„Ù…Ù„Ùƒ ÙÙ‡Ø¯ØŒ Ø§Ù„Ø­ÙŠ Ø§Ù„Ø´Ù…Ø§Ù„ÙŠ',
    etaLabel: 'Ù…Ø¯Ø© Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…: 15 Ø¯Ù‚ÙŠÙ‚Ø©',
    currentStageLabel: 'ÙÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¥Ø±Ø³Ø§Ù„',
    nextActionLabel: 'Ø§Ø¨Ø¯Ø£ Ø§Ù„Ù…Ø³Ø§Ø± ÙˆØ£ÙƒØ¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø¹Ù†Ø¯ Ø§Ù„ÙˆØµÙˆÙ„',
  },
};

const compactOrderChatSeed: CompactOrderChatMessage[] = [
  {
    id: 'compact-msg-1',
    sender: 'Ø§Ù„Ø¹Ù…ÙŠÙ„',
    text: 'Ø£Ø¨Ù‚ÙŠ Ø§Ù„ØªØ­Ø¯ÙŠØ«Ø§Øª Ù‚ØµÙŠØ±Ø© Ù„Ùˆ Ø³Ù…Ø­ØªØŒ ÙˆØ£Ù†Ø§ Ø¬Ø§Ù‡Ø² Ø¹Ù†Ø¯ Ø§Ù„ÙˆØµÙˆÙ„.',
    time: '09:12',
    side: 'start',
  },
  {
    id: 'compact-msg-2',
    sender: 'Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
    text: 'ØªÙ…. Ø£Ù†Ø§ Ø§Ù„Ø¢Ù† ÙÙŠ Ø§Ù„Ø·Ø±ÙŠÙ‚ Ø¥Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….',
    time: '09:13',
    side: 'end',
  },
  {
    id: 'compact-msg-3',
    sender: 'Ø§Ù„Ø¹Ù…ÙŠÙ„',
    text: 'Ø£Ø®Ø¨Ø±Ù†ÙŠ Ù‚Ø¨Ù„ Ø¯Ù‚ÙŠÙ‚Ø© Ù…Ù† Ø§Ù„ÙˆØµÙˆÙ„.',
    time: '09:14',
    side: 'start',
  },
];

const captainDisplayName = 'Ø§Ù„ÙƒØ§Ø¨ØªÙ† Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡ Ø§Ù„Ø³Ø¨ÙŠØ¹ÙŠ';

const captainAppearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'ÙØ§ØªØ­ Ø£Ø¨ÙŠØ¶',
    description: 'ÙˆØ§Ø¬Ù‡Ø© ÙØ§ØªØ­Ø© ÙˆØ§Ø¶Ø­Ø©ØŒ ÙˆØ§Ù„Ø²Ø¬Ø§Ø¬ ÙŠØ¸Ù‡Ø± ÙÙ‚Ø· ÙÙŠÙ…Ø§ ÙŠØ­Ø¯Ø¯Ù‡ Ø§Ù„Ù…Ø·ÙˆØ± Ø£Ø«Ù†Ø§Ø¡ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø´Ø§Ø´Ø§Øª',
  },
  {
    mode: 'darkGlass',
    title: 'Ø¯Ø§ÙƒÙ† Ø²Ø¬Ø§Ø¬ÙŠ',
    description: 'Ù…Ø¸Ù‡Ø± Ø¯Ø§ÙƒÙ† ÙØ§Ø®Ø± Ù…Ø¹ Ø­ÙˆØ§Ù Ø²Ø¬Ø§Ø¬ÙŠØ© ÙˆØ·Ø¨Ù‚Ø§Øª ÙˆØ§Ø¶Ø­Ø© Ø¨Ø¯ÙˆÙ† Ø¥Ø²Ø¹Ø§Ø¬ Ø¨ØµØ±ÙŠ',
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
    label: 'Ù…ØªØ§Ø­',
    description: 'Ø¬Ø§Ù‡Ø² Ø§Ù„Ø¢Ù† Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª ÙˆØ§Ù„ØªÙ†Ù‚Ù„ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¥Ù„Ù‰ Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„Ø·Ù„Ø¨.',
    chipTone: 'success',
    orderBadgeLabel: 'Ù†Ø´Ø·',
  },
  unavailable: {
    label: 'ØºÙŠØ± Ù…ØªØ§Ø­',
    description: 'ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ù…Ø¤Ù‚ØªÙ‹Ø§ Ø­ØªÙ‰ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„ØªÙØ¹ÙŠÙ„.',
    chipTone: 'warning',
    orderBadgeLabel: 'Ù…ÙˆÙ‚ÙˆÙ',
  },
  break: {
    label: 'Ø§Ø³ØªØ±Ø§Ø­Ø©',
    description: 'Ø§Ø³ØªØ±Ø§Ø­Ø© Ù‚ØµÙŠØ±Ø© Ù…Ø­Ù„ÙŠØ© Ø¨Ù„Ø§ Ø£ÙŠ Ø±Ø¨Ø· ØªØ´ØºÙŠÙ„ÙŠ Ø®Ø§Ø±Ø¬ÙŠ.',
    chipTone: 'warning',
    orderBadgeLabel: 'Ø§Ø³ØªØ±Ø§Ø­Ø©',
  },
  'planned-leave': {
    label: 'Ø¥Ø¬Ø§Ø²Ø© Ù…Ø®Ø·Ø·Ø©',
    description: 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¥Ø¬Ø§Ø²Ø§Øª ÙˆØ§Ù„ØºÙŠØ§Ø¨ Ù…Ø§ Ø²Ø§Ù„Øª Ù‚ÙŠØ¯ Ø§Ù„Ø±Ø¨Ø· Ù…Ø¹ Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø£Ø³Ø·ÙˆÙ„ ÙˆØªØ¸Ù‡Ø± Ù‡Ù†Ø§ ÙƒÙ…ØªØ§Ø¨Ø¹Ø© Ù…Ø­Ù„ÙŠØ© ÙÙ‚Ø·.',
    chipTone: 'default',
    orderBadgeLabel: 'Ø¥Ø¬Ø§Ø²Ø©',
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
    label: 'GPS Ø¬Ø§Ù‡Ø²',
    description: 'Ø¥Ø´Ø§Ø±Ø© Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ù…Ø³ØªÙ‚Ø±Ø© Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙˆÙŠÙ…ÙƒÙ† Ø¹Ø±Ø¶ Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ø¨Ø«Ù‚Ø©.',
    chipTone: 'success',
  },
  limited: {
    label: 'GPS Ù…Ø­Ø¯ÙˆØ¯',
    description: 'Ø§Ù„Ø¥Ø´Ø§Ø±Ø© Ù…ØªØ§Ø­Ø© Ø¬Ø²Ø¦ÙŠÙ‹Ø§ ÙˆÙŠØ¬Ø¨ Ø§Ù„ØªØ¹Ø§Ù…Ù„ Ù…Ø¹Ù‡Ø§ ÙƒØ¥Ø±Ø´Ø§Ø¯ ØªÙ‚Ø±ÙŠØ¨ÙŠ ÙÙ‚Ø·.',
    chipTone: 'warning',
  },
  offline: {
    label: 'GPS Ø¯ÙˆÙ† Ø§ØªØµØ§Ù„',
    description: 'ØªØ¹Ø°Ø± ØªØ­Ø¯ÙŠØ« Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¢Ù†. Ø§Ù„Ù…Ø³Ø§Ø± ÙŠØ¹Ù…Ù„ ÙƒÙ…Ø¹Ø§ÙŠÙ†Ø© Ù…Ø­Ù„ÙŠØ© Ø­ØªÙ‰ ØªØ¹ÙˆØ¯ Ø§Ù„Ø¥Ø´Ø§Ø±Ø©.',
    chipTone: 'warning',
  },
  disabled: {
    label: 'GPS Ù…Ø¹Ø·Ù„',
    description: 'Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ù…ØºÙ„Ù‚ Ù…Ù† Ø§Ù„Ø¬Ù‡Ø§Ø² ÙˆÙŠØ­ØªØ§Ø¬ ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¥Ø°Ù† Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù‡Ø§ØªÙ Ù‚Ø¨Ù„ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø®Ø±ÙŠØ·Ø©.',
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
  { id: 'demand-1', top: 58, right: 34, size: 164, color: withAlpha(colorPalette.brand, 0.20), label: 'Ø·Ù„Ø¨ Ù…Ø±ØªÙØ¹' },
  { id: 'demand-2', top: 188, left: 26, size: 118, color: withAlpha(colorPalette.brand, 0.14), label: 'Ø°Ø±ÙˆØ© Ù‚Ø±ÙŠØ¨Ø©' },
  { id: 'demand-3', bottom: 108, right: 96, size: 146, color: 'rgba(255, 133, 75, 0.16)', label: 'Ù…ØªØ§Ø¬Ø± Ù†Ø´Ø·Ø©' },
] satisfies readonly MapHeatZone[];

const captainHeatZones: readonly MapHeatZone[] = [
  { id: 'captain-1', top: 128, left: 112, size: 132, color: withAlpha(colorPalette.brandStrong, 0.14), label: 'ÙƒØ¨Ø§ØªÙ† Ø£ÙƒØ«Ø±' },
  { id: 'captain-2', bottom: 138, left: 154, size: 104, color: withAlpha(colorPalette.brandStrong, 0.10), label: 'ØªØºØ·ÙŠØ© Ù‚Ø±ÙŠØ¨Ø©' },
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

      // DSH-SLICE-005E: submit proof-of-delivery. Transitions ARRIVED â†’ DELIVERED.
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
      // DSH-SLICE-005F: report delivery failure. Transitions ARRIVED â†’ RETURNING_TO_STORE.
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
            sender: 'Ø§Ù„Ù†Ø¸Ø§Ù…',
            text: 'ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…. Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„ØªØ§Ù„ÙŠØ© Ù‡ÙŠ Ø§Ù„ØªØ³Ù„ÙŠÙ….',
            time: 'Ø§Ù„Ø¢Ù†',
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
        sender: 'Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
        text,
        time: 'Ø§Ù„Ø¢Ù†',
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
            <Button label="ÙØªØ­ ØªÙˆØ§ØµÙ„ Ø§Ù„Ø·Ù„Ø¨" tone="secondary" fullWidth={false} onPress={() => setRoute('orderchat')} />
            <Button label="Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… ÙˆØ§Ù„ØªØ³Ù„ÙŠÙ…" tone="secondary" fullWidth={false} onPress={() => setRoute('pickup-dropoff')} />
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
          customerName="Ø§Ù„Ø¹Ù…ÙŠÙ„"
          address={activeSummary.dropoffLabel}
          itemsCount={3}
          onConfirm={() => setRoute('pod-submission')}
          onReportIssue={() => setRoute('inbox')}
          onBack={goBack}
          onRingBell={() => {
            // UI_PREVIEW_ONLY: bell event stub â€” no runtime dispatch, value is not used
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
      title: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
      subtitle: 'Ø§Ù„Ù‡ÙˆÙŠØ©ØŒ Ø§Ù„Ù†ÙˆØ¹ØŒ ÙˆØ§Ù„Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©.',
      badgeLabel: 'Ù…Ø¨Ø§Ø´Ø±',
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
      title: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª',
      subtitle: 'Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø· ÙˆØ§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø®ØªØµØ±.',
      badgeLabel: 'Ù†Ø´Ø·',
      icon: 'receipt-outline' as const,
      onPress: () => openCaptainAccountSection('account-orders'),
    },
    {
      title: 'Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ ÙˆØ§Ù„ØªÙ‚ÙŠÙŠÙ…',
      subtitle: 'Ø§Ù„Ù…Ù„ÙØ§ØªØŒ Ø§Ù„ØªÙ‚ÙŠÙŠÙ…ØŒ ÙˆØ§Ù„Ù…Ø³ØªÙˆÙ‰.',
      badgeLabel: 'Ø¬Ø§Ù‡Ø²',
      icon: 'document-text-outline' as const,
      onPress: () => openCaptainAccountSection('account-docs'),
    },
    {
      title: 'Ø§Ù„Ø¯ÙˆØ§Ù… / Ø§Ù„Ø¥Ø¬Ø§Ø²Ø§Øª',
      subtitle: 'Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ¬Ø¯ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ… ÙˆØ®Ø·Ø© Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©.',
      badgeLabel: 'Ø§Ù„ÙŠÙˆÙ…',
      icon: 'calendar-outline' as const,
      onPress: () => openCaptainAccountSection('account-shifts'),
    },
    {
      title: 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª',
      subtitle: 'Ø§Ù„Ù…Ø¸Ù‡Ø±ØŒ ÙˆØ¶Ø¹ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ØŒ ÙˆØ§Ù„ØªÙØ¶ÙŠÙ„Ø§Øª.',
      badgeLabel: 'Ù…Ø­Ù„ÙŠ',
      icon: 'settings-outline' as const,
      onPress: () => openCaptainAccountSection('account-support'),
    },
    {
      title: 'Ø§Ù„Ø¯Ø¹Ù…',
      subtitle: 'Ø¯Ù„ÙŠÙ„ Ù…Ø³Ø§Ø±Ø§Øª DSH ÙˆÙ‚Ù†ÙˆØ§Øª Ø§Ù„Ù…Ø³Ø§Ù†Ø¯Ø©.',
      badgeLabel: 'Ù…ÙØªÙˆØ­',
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
                <Badge label="ÙƒØ§Ø¨ØªÙ† DSH" tone="success" />
                <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
              </Box>
            </View>
          </Box>

          <Divider />

          {/* Quick Stats Grid */}
          <Box layoutDirection="row" gap={3} style={{ flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">Ø§Ù„ØªÙ‚ÙŠÙŠÙ…</Text>
              <Text role="bodyStrong" tone="info">4.9 â˜…</Text>
            </View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">Ø§Ù„Ù…Ø³ØªÙˆÙ‰</Text>
              <Text role="bodyStrong" tone="brand">Elite 3</Text>
            </View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}>
              <Text role="caption" tone="muted">{wltDshCaptainUiCopy.summaryLabel}</Text>
              <Text role="bodyStrong" tone="success">{wltDshCaptainUiCopy.walletBalanceLabel}</Text>
            </View>
          </Box>
        </Box>

        <Divider />

        {/* Navigation List â€” flush rows, no gap between items */}
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
      { label: 'Ø§Ù„Ø§Ø³Ù…', value: captainDisplayName },
      { label: 'Ø§Ù„Ù†ÙˆØ¹', value: 'DSH', tone: 'success' },
      { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: currentAvailabilityMeta.label, tone: currentAvailabilityMeta.chipTone === 'success' ? 'success' : 'warning' },
      { label: 'Ø§Ù„Ù…Ù†Ø·Ù‚Ø©', value: 'Ø§Ù„Ù…Ù†Ø·Ù‚Ø© Ø§Ù„ÙˆØ³Ø·Ù‰' },
      { label: 'Ø§Ù„ØªÙ‚ÙŠÙŠÙ…', value: '4.9 / 5', tone: 'info' },
      { label: 'Ø§Ù„Ù…Ø³ØªÙˆÙ‰', value: 'Elite 3', tone: 'brand' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ÙƒØ§Ø¨ØªÙ†', 'Ø§Ù„Ù‡ÙˆÙŠØ© ÙˆØ§Ù„Ø­Ø§Ù„Ø© ÙˆØ§Ù„Ù…Ù„Ù Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ', items);
  };

  const renderCaptainAccountOrdersScreen = () => {
    const items = [
      { label: 'Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·', value: `#${activeOrderDisplayId}`, tone: 'success' },
      { label: 'Ø§Ù„Ù…ØªØ¬Ø±', value: 'Burger Lab', tone: 'brand' },
      { label: 'Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©', value: activeSummary.currentStageLabel, tone: 'info' },
      { label: 'Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: activeSummary.pickupLabel },
      { label: 'Ø§Ù„ØªØ³Ù„ÙŠÙ…', value: activeSummary.dropoffLabel },
      { label: 'Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„ØªØ§Ù„ÙŠØ©', value: activeSummary.nextActionLabel, tone: 'warning' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('Ø§Ù„Ø·Ù„Ø¨Ø§Øª', 'Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø· ÙˆØ§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø®ØªØµØ±', items, 'Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠ Ø§Ù„ÙƒØ§Ù…Ù„ ÙŠØ¨Ù‚Ù‰ read-only Ø¥Ù„Ù‰ Ø£Ù† ÙŠØ«Ø¨Øª Ù…ØµØ¯Ø± Ø§Ù„Ø£Ø±Ø´ÙØ© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ.');
  };

  const renderCaptainAccountDocsScreen = () => {
    const items = [
      { label: 'Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚', value: '3 Ù…Ù„ÙØ§Øª Ù…Ø­Ù„ÙŠØ©', tone: 'success' },
      { label: 'Ø§Ù„ØªÙ‚ÙŠÙŠÙ…', value: '4.9 / 5', tone: 'info' },
      { label: 'Ø§Ù„Ù…Ø³ØªÙˆÙ‰', value: 'Elite 3', tone: 'brand' },
      { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©', value: 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©' },
      { label: 'Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ', value: 'Ù‚ÙŠØ¯ Ø§Ù„Ø±Ø¨Ø·', tone: 'warning' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ ÙˆØ§Ù„ØªÙ‚ÙŠÙŠÙ…', 'Ø§Ù„Ù…Ù„ÙØ§Øª ÙˆØ§Ù„Ù…Ø³ØªÙˆÙ‰ ÙˆØ¬Ø§Ù‡Ø²ÙŠØ© Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯', items, 'Ø±Ø¨Ø· Ø§Ù„ÙˆØ«Ø§Ø¦Ù‚ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ ÙŠÙ†ØªØ¸Ø± Ù…ØµØ¯Ø± Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ ÙˆÙŠØ¸Ù‡Ø± Ù‡Ù†Ø§ ÙƒÙ…ØªØ§Ø¨Ø¹Ø© Ø¬Ø§Ù‡Ø²ÙŠØ© ÙÙ‚Ø·.');
  };

  const renderCaptainAccountShiftsScreen = () => {
    const items = [
      { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ø¯ÙˆØ§Ù…', value: isCaptainAvailable ? 'Ù…ØªØ§Ø­ Ø§Ù„ÙŠÙˆÙ…' : 'ØºÙŠØ± Ù…ØªØ§Ø­ Ø§Ù„ÙŠÙˆÙ…', tone: isCaptainAvailable ? 'success' : 'warning' },
      { label: 'Ø¬Ø¯ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ…', value: 'ØµØ¨Ø§Ø­ÙŠ', tone: 'brand' },
      { label: 'Ø§Ù„Ø¥Ø¬Ø§Ø²Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©', value: 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©' },
      { label: 'Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«', value: 'Ø§Ù„Ø¢Ù†', tone: 'info' },
    ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

    return renderCaptainAccountSectionPage('Ø§Ù„Ø¯ÙˆØ§Ù… / Ø§Ù„Ø¥Ø¬Ø§Ø²Ø§Øª', 'Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ¬Ø¯ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ… ÙˆØ®Ø·Ø© Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©', items, 'Ø·Ù„Ø¨ Ø§Ù„Ø¥Ø¬Ø§Ø²Ø© Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ ÙŠÙ†ØªØ¸Ø± Ø±Ø¨Ø· Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø£Ø³Ø·ÙˆÙ„ ÙˆÙŠØ¸Ù‡Ø± Ù‡Ù†Ø§ ÙƒÙ…Ø¹Ø§ÙŠÙ†Ø© Ø­Ø§Ù„Ø© ÙÙ‚Ø·.');
  };


  const renderCaptainAccountSupportScreen = () => {
    const rowDirection = 'row-reverse' as const;

    // Appearance row â€” inline segmented toggle identical to Partner settings
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
            <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>Ø§Ù„Ù…Ø¸Ù‡Ø±</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
              {appearanceHydrated ? 'ÙØ§ØªØ­ Ø£Ø¨ÙŠØ¶ Ø£Ùˆ Ø¯Ø§ÙƒÙ† Ø²Ø¬Ø§Ø¬ÙŠ' : 'Ø¬Ø§Ø±Ù Ø§Ù„Ø§Ø³ØªØ¹Ø§Ø¯Ø©...'}
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
              ÙØ§ØªØ­
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
              Ø¯Ø§ÙƒÙ†
            </Text>
          </Pressable>
        </View>
      </View>
    );

    // App mode row â€” flat pressable with switch
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
            <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>ÙˆØ¶Ø¹ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={2}>
              {captainAppMode === 'store_courier_mode'
                ? 'Ù…ÙØ¹Ù‘Ù„ â€” Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…ØªØ¬Ø± ÙÙ‚Ø·'
                : 'ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„ â€” Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ'}
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

    // Quick access rows removed â€” Ø§Ù„Ø¯Ø¹Ù… is now a standalone account nav item
    return renderCaptainAccountShell(
      'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª',
      'Ø§Ù„Ù…Ø¸Ù‡Ø±ØŒ ÙˆØ¶Ø¹ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ØŒ ÙˆØ§Ù„ØªÙØ¶ÙŠÙ„Ø§Øª Ø§Ù„Ù…Ø­Ù„ÙŠØ©',
      <Box gap={4}>
        {/* Appearance + App mode â€” flat rows */}
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
        statusLabel: 'ØªØ­Ù…ÙŠÙ„',
        message: 'Ø¬Ø§Ø±Ù ØªØ¬Ù‡ÙŠØ² Ø­Ø±ÙƒØ© Ø§Ù„ÙƒØ§Ø¨ØªÙ† ÙˆØ·Ø¨Ù‚Ø© Ø§Ù„Ø­Ø±Ø§Ø±Ø© Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø©.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    if (inboxState === 'error') {
      return {
        statusLabel: 'ØªÙ†Ø¨ÙŠÙ‡',
        message: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·. Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ø£Ùˆ Ø§ÙØªØ­ ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª.',
        onPress: resetInboxState,
        marquee: false,
      };
    }
    if (inboxState === 'empty') {
      return {
        statusLabel: 'Ø§Ù†ØªØ¸Ø§Ø±',
        message: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø¨ Ù†Ø´Ø· Ø§Ù„Ø¢Ù†. Ø§Ø¨Ù‚ÙŽ Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø© ÙˆØ§Ù†ØªØ¸Ø± Ø§Ù„Ø­Ø±ÙƒØ© Ø§Ù„ØªØ§Ù„ÙŠØ©.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    if (inboxState === 'delivered') {
      return {
        statusLabel: 'Ù…ØºÙ„Ù‚',
        message: 'ØªÙ… ØªØ³Ù„ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø£Ø®ÙŠØ±. Ø§ÙØªØ­ ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ù„Ø§Ù„ØªÙ‚Ø§Ø· Ø§Ù„Ø­Ø±ÙƒØ© Ø§Ù„ØªØ§Ù„ÙŠØ©.',
        onPress: goToInbox,
        marquee: false,
      };
    }
    return {
      statusLabel: `#${activeOrderDisplayId}`,
      message: `${activeSummary.currentStageLabel} Â· ${activeSummary.etaLabel}`,
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
        badgeLabel: 'ØªÙ… Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
        badgeTone: 'brand' as const,
        stageLabel: 'Ø§Ù„Ø·Ù„Ø¨ Ù…Ø¹Ùƒ ÙˆÙŠØ­ØªØ§Ø¬ Ø¨Ø¯Ø¡ Ø§Ù„ØªÙˆØµÙŠÙ„',
        distanceLabel: '1.6 ÙƒÙ…',
        helperText: 'Ø£ÙƒÙ‘Ø¯ Ø¨Ø¯Ø¡ Ø§Ù„ØªÙˆØµÙŠÙ„ Ù‚Ø¨Ù„ Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„.',
      };
    }

    if (storeCourierStage === 'out_for_delivery') {
      return {
        badgeLabel: 'ÙÙŠ Ø§Ù„Ø·Ø±ÙŠÙ‚',
        badgeTone: 'warning' as const,
        stageLabel: 'Ø§Ù„Ø·Ù„Ø¨ ÙÙŠ Ø§Ù„Ø·Ø±ÙŠÙ‚ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„',
        distanceLabel: '0.9 ÙƒÙ…',
        helperText: 'Ø¨Ø¹Ø¯ Ø§Ù„ÙˆØµÙˆÙ„ Ø§ÙØªØ­ Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø£Ùˆ ØµÙ†Ù‘Ù Ø§Ù„Ø­Ø§Ù„Ø© ÙƒØªØ¹Ø°Ø± ØªÙˆØµÙŠÙ„.',
      };
    }

    if (storeCourierStage === 'delivery_failed') {
      return {
        badgeLabel: 'ØªØ¹Ø°Ø± Ø§Ù„ØªÙˆØµÙŠÙ„',
        badgeTone: 'danger' as const,
        stageLabel: 'Ø§Ù„Ø­Ø§Ù„Ø© ØªØ­ØªØ§Ø¬ Ø¯Ø¹Ù…Ù‹Ø§ Ø£Ùˆ Ø¥Ø¹Ø§Ø¯Ø© Ù…Ø­Ø§ÙˆÙ„Ø©',
        distanceLabel: 'â€”',
        helperText: 'Ø§ÙØªØ­ Ø§Ù„Ø¯Ø¹Ù… Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø§Ø³ØªØ«Ù†Ø§Ø¡ Ø£Ùˆ Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ø¨Ø¹Ø¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ø§Ù„Ø¹Ù…ÙŠÙ„.',
      };
    }

    if (storeCourierStage === 'delivered') {
      return {
        badgeLabel: 'Ù…Ø³Ù„Ù‘Ù…',
        badgeTone: 'success' as const,
        stageLabel: 'ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙˆØªÙˆØ«ÙŠÙ‚ Ø§Ù„Ø¥Ø«Ø¨Ø§Øª',
        distanceLabel: 'â€”',
        helperText: 'ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø³Ø¬Ù„ Ø£Ùˆ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
      };
    }

    return {
      badgeLabel: 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù…',
      badgeTone: 'success' as const,
      stageLabel: 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù… Ù…Ù† Ø§Ù„ÙØ±Ø¹',
      distanceLabel: '2.3 ÙƒÙ…',
      helperText: 'Ù‡Ø°Ø§ Ø§Ù„Ø·Ù„Ø¨ ÙŠØ®Øµ ÙˆØ¶Ø¹ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± ÙÙ‚Ø· ÙˆÙ„Ø§ ÙŠØ´Ø§Ø±Ùƒ Ø·Ø§Ø¨ÙˆØ± ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ.',
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
    // SSoT: 'proof' order stage â†’ captain route via dsh-captain.navigation-bridge
    const proofRoute = getCaptainLifecycleForOrderStage('proof', isStoreCourierMode).captainRoute;
    setRoute(proofRoute);
  }, [isStoreCourierMode]);

  const markStoreCourierDeliveryFailed = React.useCallback(() => {
    setStoreCourierStage('delivery_failed');
    openSupportDirectory();
  }, [openSupportDirectory]);

  const topBar = (
    <ModernPremiumHeader
      title={isStoreCourierMode ? 'Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±' : captainDisplayName}
      locationLabel={isStoreCourierMode ? 'ÙˆØ¶Ø¹ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± â€” Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…ØªØ¬Ø± ÙÙ‚Ø·' : wltDshCaptainUiCopy.topBarLocationLabel}
      locationIcon={
        isStoreCourierMode
          ? <Icon name="storefront-outline" size={14} color={colorPalette.white} />
          : <Icon name="wallet-outline" size={14} color={colorPalette.white} />
      }
      actions={[
        {
          id: 'account',
          icon: <Icon name="person-outline" size={20} color={colorPalette.white} />,
          accessibilityLabel: 'Ø§Ù„Ø­Ø³Ø§Ø¨',
          onPress: openCaptainAccount,
        },
        { id: 'search', icon: <Icon name="search-outline" size={20} color={colorPalette.white} />, accessibilityLabel: 'Ø§Ù„Ø¨Ø­Ø«', onPress: openSupportDirectory },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={20} color={colorPalette.white} />,
          badgeCount: 2,
          accessibilityLabel: 'Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª',
          onPress: () => setRoute('bell'),
        },
        // Wallet action is BThwani-captain-only â€” hidden in store_courier_mode
        ...(isStoreCourierMode ? [] : [{
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={20} color={colorPalette.white} />,
          accessibilityLabel: wltDshCaptainUiCopy.walletAccessibilityLabel,
          onPress: () => openCaptainSupportScreen('cod-liability'),
        }]),
      ]}
      ticker={
        isStoreCourierMode
          ? { statusLabel: 'Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±', message: 'Ø§Ù†ØªØ¸Ø± ØªØ¹ÙŠÙŠÙ† Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„ØªØ§Ù„ÙŠ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±.', marquee: false }
          : homeTicker
      }
      direction="rtl"
    />
  );

  const routeHeaderMeta: Record<string, { title: string; subtitle: string }> = {
    entry: { title: 'Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„ØªÙ†ÙÙŠØ°', subtitle: 'Ø§Ø¨Ø¯Ø£ Ù…Ù† Ø§Ù„ÙØ±Ø² ÙˆØ§Ù„Ù‚Ø¨ÙˆÙ„ Ù‚Ø¨Ù„ Ø§Ù„Ø®Ø±ÙˆØ¬ Ù„Ù„Ù…ÙŠØ¯Ø§Ù†.' },
    inbox: { title: 'ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª', subtitle: 'Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø· Ø£ÙˆÙ„Ù‹Ø§ Ø«Ù… Ø¨Ù‚ÙŠØ© Ø§Ù„ØµÙ.' },
    detail: { title: 'ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨', subtitle: 'Ø±Ø§Ø¬Ø¹ Ø§Ù„Ø·Ù„Ø¨ Ù‚Ø¨Ù„ Ø§Ù„ØªÙ†ÙÙŠØ° Ø£Ùˆ Ø§Ù„ØªØ³Ù„ÙŠÙ….' },
    orderchat: { title: 'ØªÙˆØ§ØµÙ„ Ø§Ù„Ø·Ù„Ø¨', subtitle: 'Ù…Ø±Ø§Ø³Ù„Ø§Øª Ù‚ØµÙŠØ±Ø© Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·.' },
    map: { title: 'Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù…Ù‡Ù…Ø©', subtitle: 'Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø³Ø§Ø± ÙˆØªØ¨Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø±Ø§Ø­Ù„.' },
    'pickup-dropoff': { title: 'Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… ÙˆØ§Ù„ØªØ³Ù„ÙŠÙ…', subtitle: 'Ù…Ø±Ø§Ø­Ù„ Ø§Ù„ØªØ³Ù„ÙŠÙ… Ù…Ù† Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø­ØªÙ‰ Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ….' },
    'pod-submission': { title: 'Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ…', subtitle: 'Ø§Ù„ØªÙ‚Ø§Ø· ØµÙˆØ±Ø© Ø§Ù„Ø¥Ø«Ø¨Ø§Øª ÙˆØ¥Ø±Ø³Ø§Ù„Ù‡Ø§ Ù„Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ø·Ù„Ø¨.' },
  };

  const renderHomeOrderPanel = () => {
    const panelPadding = activeOrderExpanded ? 3 : 2;
    const panelMinHeightStyle = !activeOrderExpanded ? { minHeight: 72 } : {};
    const activeOrderCompactRouteLabel = 'Burger Lab â†’ Ø§Ù„Ø¹Ù…ÙŠÙ„';
    const activeOrderStageLabel = activeOrderPhase === 'pickup' ? activeSummary.currentStageLabel : 'ÙÙŠ Ø§Ù„Ø·Ø±ÙŠÙ‚ Ø¥Ù„Ù‰ Ø§Ù„ØªØ³Ù„ÙŠÙ…';
    const activeOrderNextActionLabel = activeOrderPhase === 'pickup' ? activeSummary.nextActionLabel : 'Ø£ÙƒØ¯ Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø¨Ø¹Ø¯ Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…ÙŠÙ„';

    if (!isCaptainAvailable) {
      return (
        <Surface
          tone="raised"
          padding={panelPadding}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4, ...panelMinHeightStyle }}
        >
          <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
          <Box gap={1}>
            <Text role="bodyStrong">Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© Ù…ØªÙˆÙ‚ÙØ© Ø­ØªÙ‰ ÙŠØ¹ÙˆØ¯ Ø§Ù„ÙƒØ§Ø¨ØªÙ† Ù„Ù„ØªÙˆÙØ±</Text>
            <Text role="bodySm" tone="muted">
              {currentAvailabilityMeta.description}
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} tone="success" label="ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø§Ù„Ø©" onPress={cycleAvailabilityStatus} />
            <Button size="sm" fullWidth={false} tone="ghost" label="ÙØªØ­ Ø§Ù„Ø·Ù„Ø¨Ø§Øª" onPress={() => setRoute('inbox')} />
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
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="ØªØ­Ù…ÙŠÙ„" tone="info" />
          <Box gap={1}>
            <Text role="bodyStrong">Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ø¶ÙŠØ±</Text>
            <Text role="bodySm" tone="muted">
              Ø³ÙŠØ¸Ù‡Ø± Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø· Ù‡Ù†Ø§ Ø¹Ù†Ø¯Ù…Ø§ ØªÙƒØªÙ…Ù„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ù…Ø­Ù„ÙŠØ©.
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
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="ØªÙ†Ø¨ÙŠÙ‡" tone="danger" />
          <Box gap={1}>
            <Text role="bodyStrong">ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·</Text>
            <Text role="bodySm" tone="muted">
              Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ù† Ù†ÙØ³ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© Ø£Ùˆ Ø§ÙØªØ­ ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØµÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} label="Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©" onPress={() => setInboxState('ready')} />
            <Button size="sm" fullWidth={false} tone="ghost" label="ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª" onPress={() => setRoute('inbox')} />
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
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="Ø§Ù†ØªØ¸Ø§Ø±" tone="warning" />
          <Box gap={1}>
            <Text role="bodyStrong">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø¨ Ù†Ø´Ø·</Text>
            <Text role="bodySm" tone="muted">
              Ø§Ø¨Ù‚ÙŽ Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ø­ØªÙ‰ ØªØµÙ„ Ø§Ù„Ø­Ø±ÙƒØ© Ø§Ù„ØªØ§Ù„ÙŠØ©. Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø­Ø³Ø§Ø¨ ÙŠØ¸Ù‡Ø±Ø§Ù† ÙƒÙ…Ù„Ø®Øµ read-only Ø¥Ù„Ù‰ Ø£Ù† ÙŠØµÙ„ Ø§Ù„Ù…ØµØ¯Ø± Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.
            </Text>
            <Text role="caption" tone="muted">
              Ø§Ù„ØªÙˆØ§ØµÙ„ Ø¨Ø¹Ø¯ Ø§Ù„Ø¥ØºÙ„Ø§Ù‚ ÙŠØ¨Ù‚Ù‰ read-only Ù…Ø¤Ù‚ØªÙ‹Ø§ Ø­ØªÙ‰ ÙŠØ­Ø¯Ø¯ Ø§Ù„ØªØ­ÙƒÙ… Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ Ù†Ø§ÙØ°Ø© Ø§Ù„Ø§Ø­ØªÙØ§Ø¸ Ø¨Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø©.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} label="ÙØªØ­ Ø§Ù„Ø·Ù„Ø¨Ø§Øª" onPress={() => setRoute('inbox')} />
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
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="Ù…ØºÙ„Ù‚" tone="default" />
          <Box gap={1}>
            <Text role="bodyStrong">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø¨ Ù†Ø´Ø·</Text>
            <Text role="bodySm" tone="muted">
              ØªÙ… Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ø·Ù„Ø¨. Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø­Ø³Ø§Ø¨ ÙŠØ¸Ù‡Ø±Ø§Ù† ÙƒÙ…Ù„Ø®Øµ read-only Ø¥Ù„Ù‰ Ø£Ù† ÙŠØµÙ„ Ù…ØµØ¯Ø± Ø§Ù„Ø£Ø±Ø´ÙØ© Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.
            </Text>
            <Text role="caption" tone="muted">
              Ø§Ù„ØªÙˆØ§ØµÙ„ Ù‡Ù†Ø§ Ø£ØµØ¨Ø­ read-only Ø¨Ø¹Ø¯ Ù…Ø¯Ø© Ø§Ø­ØªÙØ§Ø¸ ÙŠØ­Ø¯Ø¯Ù‡Ø§ Ø§Ù„ØªØ­ÙƒÙ… Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} tone="ghost" label="Ø¹Ø±Ø¶ ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„Ø·Ù„Ø¨Ø§Øª" onPress={() => setRoute('inbox')} />
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
          style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4, ...panelMinHeightStyle }}
        >
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Box gap={1} style={{ flex: 1 }}>
              <Text role="caption" tone="muted">
                Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·
              </Text>
              <Box layoutDirection="row" align="center" gap={2}>
                <Badge label={currentAvailabilityMeta.orderBadgeLabel} tone={currentAvailabilityMeta.chipTone} />
                <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
              </Box>
            </Box>
            <Button size="sm" fullWidth={false} tone="ghost" label="Ø·ÙŠ" onPress={collapseActiveOrder} />
          </Box>

          <Box gap={2}>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…
              </Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
                {activeSummary.pickupLabel}
              </Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                Ø§Ù„ØªØ³Ù„ÙŠÙ…
              </Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
                {activeSummary.dropoffLabel}
              </Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">
                Ø§Ù„Ù…Ø±Ø­Ù„Ø©
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
              <Button size="sm" fullWidth={false} tone="success" label="ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…" onPress={confirmPickup} />
            ) : (
              <Button size="sm" fullWidth={false} tone="primary" label="ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªØ³Ù„ÙŠÙ…" onPress={confirmDelivery} />
            )}
            <Button size="sm" fullWidth={false} tone="ghost" label="Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù…Ù‡Ù…Ø©" onPress={() => setRoute('map')} />
          </Box>

          <Surface tone="inset" padding={2} gap={2} radiusToken="lg">
            <Box gap={1}>
              <Text role="caption" tone="muted">
                Ù…Ø±Ø§Ø³Ù„Ø© Ù…Ø®ØªØµØ±Ø©
              </Text>
              <Text role="bodySm" tone="muted">
                Ø±Ø³Ø§Ø¦Ù„ Ù‚ØµÙŠØ±Ø© ÙÙ‚Ø·ØŒ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¯Ø§Ø®Ù„ Ù†ÙØ³ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø©ØŒ Ù…Ù† Ø¯ÙˆÙ† scroll Ø¥Ø¶Ø§ÙÙŠ.
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
                placeholder="Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„Ø© Ù…Ø®ØªØµØ±Ø©..."
                multiline
                numberOfLines={2}
                style={{ minHeight: 68, textAlignVertical: 'top' }}
              />
              <Box layoutDirection="row" justify="space-between" align="center" gap={2} style={{ flexWrap: 'wrap' }}>
                <Text role="caption" tone="muted">
                  Ø§Ù„Ø­ÙˆØ§Ø± ÙŠØ¨Ù‚Ù‰ compact Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø©.
                </Text>
                <Button size="sm" fullWidth={false} label="Ø¥Ø±Ø³Ø§Ù„" onPress={sendQuickMessage} disabled={!activeOrderDraft.trim()} />
              </Box>
            </Box>
          </Surface>
        </Surface>
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel="ØªÙˆØ³ÙŠØ¹ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·" onPress={expandActiveOrder} style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}>
          <Surface
            tone="raised"
            padding={panelPadding}
            gap={2}
            radiusToken="xl"
            style={{ shadowColor: colorPalette.black, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4, ...panelMinHeightStyle }}
          >
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Box gap={1} style={{ flex: 1 }}>
                <Text role="caption" tone="muted">
                  Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù†Ø´Ø·
                </Text>
                <Box layoutDirection="row" align="center" gap={2}>
                  <Badge label="Ù†Ø´Ø·" tone="success" />
                  <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
                </Box>
              </Box>
              <Button size="sm" fullWidth={false} tone="secondary" label="ØªÙˆØ³ÙŠØ¹" onPress={expandActiveOrder} />
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
      {/* â”€â”€â”€ Mode badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Surface tone="raised" padding={3} gap={2} radiusToken="xl">
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Box gap={1}>
            <Text role="bodyStrong">ÙˆØ¶Ø¹ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±</Text>
            <Text role="bodySm" tone="muted">ØªÙØ¹Ø±Ø¶ ÙÙ‚Ø· Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…Ø³Ù†Ø¯Ø© Ø¥Ù„ÙŠÙƒ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±.</Text>
          </Box>
          <Badge label="Ù†Ø´Ø·" tone="success" />
        </Box>
      </Surface>

      {/* â”€â”€â”€ Assigned store order + simple actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <Text role="label" tone="muted">Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù…Ø³Ù†Ø¯</Text>
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Text role="bodyStrong">ORD-4401</Text>
          <Badge label={storeCourierMeta.badgeLabel} tone={storeCourierMeta.badgeTone} />
        </Box>
        <KeyValueList
          items={[
            { label: 'Ø§Ù„Ù…ØªØ¬Ø±', value: 'ÙØ±Ø¹ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†' },
            { label: 'Ø§Ù„Ù…Ø±Ø­Ù„Ø©', value: storeCourierMeta.stageLabel },
            { label: 'Ø§Ù„Ù…Ø³Ø§ÙØ©', value: storeCourierMeta.distanceLabel },
          ]}
        />
        <Surface tone="inset" padding={2} gap={1} radiusToken="lg">
          <Text role="caption" tone="muted">{storeCourierMeta.helperText}</Text>
        </Surface>
        <Box gap={2}>
          {storeCourierStage === 'ready_for_pickup' ? (
            <>
              <Button label="Ø§Ø³ØªÙ„Ø§Ù… Ù…Ù† Ø§Ù„ÙØ±Ø¹" tone="success" onPress={markStoreCourierPickedUp} />
              <Button label="ÙØªØ­ Ø§Ù„Ø¯Ø¹Ù…" tone="secondary" onPress={openSupportDirectory} />
            </>
          ) : null}
          {storeCourierStage === 'picked_up' ? (
            <>
              <Button label="Ø¨Ø¯Ø£ Ø§Ù„ØªÙˆØµÙŠÙ„" tone="primary" onPress={markStoreCourierOutForDelivery} />
              <Button label="Ø§Ù„Ø±Ø¬ÙˆØ¹ Ø¥Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…" tone="secondary" onPress={() => setStoreCourierStage('ready_for_pickup')} />
            </>
          ) : null}
          {storeCourierStage === 'out_for_delivery' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="ØªÙ… Ø§Ù„ØªÙˆØµÙŠÙ„" tone="ghost" onPress={openStoreCourierProof} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="ØªØ¹Ø°Ø± Ø§Ù„ØªÙˆØµÙŠÙ„" tone="danger" onPress={markStoreCourierDeliveryFailed} />
              </Box>
            </Box>
          ) : null}
          {storeCourierStage === 'delivery_failed' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©" tone="secondary" onPress={() => setStoreCourierStage('out_for_delivery')} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="Ø§Ù„Ø¯Ø¹Ù…" tone="danger" onPress={openSupportDirectory} />
              </Box>
            </Box>
          ) : null}
          {storeCourierStage === 'delivered' ? (
            <Box layoutDirection="row" gap={2}>
              <Box style={{ flex: 1 }}>
                <Button label="Ø¹Ø±Ø¶ Ø¥Ø«Ø¨Ø§Øª Ø§Ù„ØªØ³Ù„ÙŠÙ…" tone="secondary" onPress={openStoreCourierProof} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Button label="ÙØªØ­ Ø§Ù„Ø³Ø¬Ù„" tone="ghost" onPress={() => openCaptainAccountSection('account-orders')} />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Surface>

      {/* â”€â”€â”€ Store earnings (policy-conditional â€” shown when compensation applies) â”€â”€ */}
      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <Text role="label" tone="muted">Ù…Ø³ØªØ­Ù‚Ø§ØªÙŠ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±</Text>
        <KeyValueList
          items={[
            { label: 'Ø§Ù„ÙŠÙˆÙ…', value: '45 Ø±ÙŠØ§Ù„' },
            { label: 'Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹', value: '210 Ø±ÙŠØ§Ù„' },
            { label: 'Ù†ÙˆØ¹ Ø§Ù„Ø§Ø³ØªØ­Ù‚Ø§Ù‚', value: 'Ù…Ø¨Ù„Øº Ø«Ø§Ø¨Øª Ù„ÙƒÙ„ ØªÙˆØµÙŠÙ„Ø©' },
          ]}
        />
        <Surface tone="inset" padding={2} gap={1} radiusToken="lg">
          <Text role="caption" tone="muted">Ù‡Ø°Ø§ Ø§Ù„Ù…Ø¨Ù„Øº Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø± Ù…Ø¨Ø§Ø´Ø±Ø©Ù‹ â€” Ù„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ.</Text>
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
                shadowColor: colorPalette.black,
                shadowOpacity: 0.05,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 5 },
                elevation: 2,
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
                      ÙØ±Øµ Ø·Ù„Ø¨Ø§Øª
                    </Text>
                  </Box>
                  <Box layoutDirection="row" align="center" gap={1}>
                    <Box style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: withAlpha(colorPalette.brandStrong, 0.95) }} />
                    <Text role="caption" tone="muted" weight="semibold" numberOfLines={1}>
                      ØªØ¬Ù…Ø¹ ÙƒØ¨Ø§ØªÙ†
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
          title="AMN â€” Ù‚ÙŠØ¯ Ø§Ù„Ø±Ø¨Ø·"
          description="Ù‡Ø°Ø§ Ø§Ù„Ù…Ø³Ø§Ø± ØºÙŠØ± Ù†Ø´Ø· Ø¯Ø§Ø®Ù„ DSH Ø­Ø§Ù„ÙŠÙ‹Ø§ ÙˆÙ„Ø§ ÙŠÙ†Ø§ÙØ³ Ø§Ù„Ø³ÙŠØ§Ù‚ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ Ø§Ù„Ø­Ø§Ù„ÙŠ."
          icon="alert-circle-outline"
          backLabel="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ DSH"
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
              title="AMN ØºÙŠØ± Ù†Ø´Ø· Ø¯Ø§Ø®Ù„ Ù‡Ø°Ø§ Ø§Ù„Ø³Ø·Ø­"
              description="DSH Ù‡Ùˆ Ø§Ù„Ø³ÙŠØ§Ù‚ Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ Ø§Ù„Ù†Ø´Ø·ØŒ Ø¨ÙŠÙ†Ù…Ø§ ÙŠØ¸Ù‡Ø± AMN Ù‡Ù†Ø§ ÙƒÙ…Ø±Ø¬Ø¹ read-only Ø­ØªÙ‰ ÙŠÙƒØªÙ…Ù„ Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ù…Ø¹ØªÙ…Ø¯."
              actionLabel="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ DSH"
              onActionPress={() => handleSelectServiceType('dsh')}
            />
            <Surface tone="inset" padding={4} gap={2} radiusToken="xl">
              <Text role="bodyStrong">Ù„Ø§ Ù†Ø¶ÙŠÙ Ø£ÙŠ binding Ø¬Ø¯ÙŠØ¯ Ù‡Ù†Ø§.</Text>
              <Text role="bodySm" tone="muted">
                AMN Ø­Ø§Ø¶Ø± Ù‡Ù†Ø§ ÙƒÙ…Ø±Ø¬Ø¹ read-only ØºÙŠØ± Ù†Ø´Ø·ØŒ ÙˆÙ„Ø§ ÙŠÙ†Ø¨ØºÙŠ Ø£Ù† ÙŠØ²Ø§Ø­Ù… DSH ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø³Ø·Ø­.
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
      launcherLabel="Ø·Ù„Ø¨Ø§ØªÙŠ"
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
        { id: 'history', label: 'Ø§Ù„Ø³Ø¬Ù„', icon: 'time-outline', activeIcon: 'time' },
        { id: 'support', label: 'Ø§Ù„Ø¯Ø¹Ù…', icon: 'help-circle-outline', activeIcon: 'help-circle' },
        { id: 'earnings', label: 'Ù…Ø³ØªØ­Ù‚Ø§ØªÙŠ', icon: 'cash-outline', activeIcon: 'cash' },
        { id: 'profile', label: 'Ø­Ø³Ø§Ø¨ÙŠ', icon: 'person-outline', activeIcon: 'person' },
      ]}
    />
  ) : (
    <BottomNavBar
      activeId={captainBottomActiveId}
      direction="rtl"
      launcherLabel="Ø§Ù„Ø®Ø±ÙŠØ·Ø©"
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
        { id: 'orders', label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª', icon: 'receipt-outline', activeIcon: 'receipt' },
        { id: 'wallet', label: 'Ø§Ù„Ù…Ø­ÙØ¸Ø©', icon: 'wallet-outline', activeIcon: 'wallet' },
        { id: 'support', label: 'Ø§Ù„Ø¯Ø¹Ù…', icon: 'help-circle-outline', activeIcon: 'help-circle' },
        { id: 'profile', label: 'Ø­Ø³Ø§Ø¨ÙŠ', icon: 'person-outline', activeIcon: 'person' },
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
        'Ø­Ø³Ø§Ø¨ Ø§Ù„ÙƒØ§Ø¨ØªÙ†',
        'Ù…Ù„Ù Ø§Ù„ØªØ´ØºÙŠÙ„ ÙˆØ§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ø¯ÙˆØ§Ù…',
        renderCaptainAccountRootScreen()
      );
    }

    if (route === 'support-directory') {
      return renderCaptainAccountShell(
        'Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¯Ø¹Ù…',
        'ÙƒÙ„ Ù…Ø³Ø§Ø±Ø§Øª DSH Ø§Ù„Ù…ØªØ¨Ù‚ÙŠØ© ÙÙŠ Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯',
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
        selectedSupportScreen === 'cod-liability' ? 'Ø°Ù…Ø© Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…' : 'Ø§Ù„Ø¯Ø¹Ù…',
        'Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ù…ÙØªÙˆØ­ Ù…Ù† Ø§Ù„Ø¯Ù„ÙŠÙ„',
        supportScreenContent
      );
    }

    if (route === 'bell') {
      return renderCaptainAccountShell(
        'Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª',
        'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ø¯ÙˆÙ† Ø¶Ø¬ÙŠØ¬',
        <DshCaptainBellScreen
          onOpenInbox={goToInbox}
          onOpenNextOrder={() => openOrderDetail(activeOrderId)}
          onRetry={() => setRoute('bell')}
        />
      );
    }

    const meta = routeHeaderMeta[route];
    const content: React.ReactNode = renderCaptainFlow();

    // Flat layout â€” identical to renderCaptainAccountShell, no rounded container
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
