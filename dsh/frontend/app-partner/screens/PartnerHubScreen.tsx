import React from 'react';
import { Pressable, Switch as RNSwitch, View, Share, BackHandler } from 'react-native';
import {
  AppearanceOptionCard,
  Badge,
  Box,
  Button,
  Chip,
  colorPalette,
  Divider,
  Icon,
  KeyValueList,
  MobileCommandSectionList,
  MobileScrollView,
  MobileStickyPrimaryAction,
  ModernPremiumHeader,
  StateView,
  Surface,
  Text,
  TextField,
  useDirection,
  useTheme,
  StoreHero,
  TopBar,
  ListItem,
} from '@bthwani/ui-kit';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import {
  getWltDshPartnerCommissionLabel,
  getWltDshPartnerOperationalModeCommission,
  wltDshPartnerUiCopy,
} from '../../../../wlt/frontend/dsh/app-partner/wlt-dsh-partner.ui-copy';
import { useAppPartnerAppearance } from '../../../../app-partner/shell/appearance';
import { canonicalPreviewStores, getCanonicalPreviewStoreCard } from '../../data/canonical.preview-data';
import { mapPublishStageToPartnerActivationStatus, resolveDshStoreClientVisibility } from '../../shared/dsh-client-visibility.model';
import { dshPromotionCandidates, type DshPromotionCandidate } from '../../shared/workflow';
import { WltDshPartnerBridge, wltDshPartnerPreviewData } from '../../../../wlt/frontend/dsh/app-partner';
import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';
import type { DshPartnerHubSurfaceProps, PartnerHubSection } from '../dsh-partner.types';
import { getDshControlPanelGovernanceEntry, resolveDshControlPanelSectionLabel } from '../../shared';
import {
  partnerTeamPreviewMembers,
  partnerCoveragePreviewZones,
  dshPartnerAnalyticsPreview,
  type PartnerTeamMember,
  type PartnerCoverageZone,
  type PartnerTeamStatus,
  type PartnerTeamRole,
  type PartnerCoverageZoneStatus,
} from '../../data';
import {
  getDshPartnerJourneyStep,
  resolveDshPartnerLifecycleStageLabel,
  type DshPartnerLifecycleStage,
} from '../../shared/dsh-partner-onboarding-journey.map';
import { getDshPartnerActivationStatusLabel } from '../../shared/dsh-partner-activation.model';
import { resolveDshImageSource } from '../../shared/resolve-dsh-image-source';
import { InventoryCatalogScreen } from './InventoryCatalogScreen';
import { PromotionsScreen } from './PromotionsScreen';
import { StoreProfileScreen } from './StoreProfileScreen';

type PartnerOperationalMode = {
  id: DshFulfillmentDeliveryMode;
  title: string;
  subtitle: string;
  commission: string;
  enabled: boolean;
};

type HubNavigationItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  section: Exclude<PartnerHubSection, 'hub'>;
};

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'info';
};

type NotificationPreferenceId =
  | 'orders'
  | 'operations'
  | 'inventory'
  | 'finance'
  | 'marketing'
  | 'system'
  | 'sound'
  | 'dailyDigest'
  | 'priorityOnly';

type NotificationPreferenceState = Record<NotificationPreferenceId, boolean>;



function resolveTeamStatusTone(status: PartnerTeamStatus): 'success' | 'warning' | 'info' | 'danger' {
  if (status === 'active') return 'success';
  if (status === 'paused') return 'warning';
  if (status === 'invited') return 'info';
  if (status === 'review-needed') return 'warning';
  return 'danger';
}

function resolveTeamRoleTone(role: PartnerTeamRole): 'brand' | 'info' | 'success' | 'default' {
  if (role === 'owner') return 'brand';
  if (role === 'supervisor') return 'info';
  if (role === 'courier') return 'success';
  return 'default';
}

function resolveZoneStatusTone(status: PartnerCoverageZoneStatus): 'success' | 'warning' | 'danger' {
  if (status === 'active') return 'success';
  if (status === 'pending') return 'warning';
  return 'danger';
}

function resolveMemberActionLabel(member: PartnerTeamMember): string {
  if (member.status === 'active') return member.role === 'supervisor' ? 'ØªØ¹Ø·ÙŠÙ„' : 'Ø¹Ø±Ø¶ Ø§Ù„Ø¯ÙˆØ±';
  if (member.status === 'paused') return 'Ø¥Ø¹Ø§Ø¯Ø© ØªÙØ¹ÙŠÙ„';
  if (member.status === 'invited') return 'Ø¥Ø¹Ø§Ø¯Ø© Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¯Ø¹ÙˆØ©';
  if (member.status === 'blocked') return 'Ø·Ù„Ø¨ Ù…Ø±Ø§Ø¬Ø¹Ø©';
  return 'Ø¥Ø±Ø³Ø§Ù„ Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©';
}

const defaultOperationalModes: readonly PartnerOperationalMode[] = [
  { id: 'pickup', title: 'Ø§Ø³ØªÙ„Ù… Ø¨Ù†ÙØ³Ùƒ', subtitle: 'Ø§Ø³ØªÙ„Ø§Ù… Ù…Ù† Ø§Ù„ÙØ±Ø¹ Ù…Ø¨Ø§Ø´Ø±Ø©.', commission: getWltDshPartnerOperationalModeCommission('pickup'), enabled: true },
  { id: 'partner_delivery', title: 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±', subtitle: 'Ù‚Ù†Ø§Ø© ØªÙˆØµÙŠÙ„ Ø¯Ø§Ø®Ù„ÙŠØ© Ø¨Ù…ÙˆØµÙ„ Ø§Ù„Ø´Ø±ÙŠÙƒ.', commission: getWltDshPartnerOperationalModeCommission('partner_delivery'), enabled: true },
  { id: 'bthwani_delivery', title: 'ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ', subtitle: 'ØªÙˆØµÙŠÙ„ Ø¹Ø¨Ø± ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ.', commission: getWltDshPartnerOperationalModeCommission('bthwani_delivery'), enabled: false },
] as const;

const partnerHubBottomInset = 144;

const defaultNotificationPreferences: NotificationPreferenceState = {
  orders: true,
  operations: true,
  inventory: true,
  finance: true,
  marketing: false,
  system: true,
  sound: true,
  dailyDigest: false,
  priorityOnly: false,
};

const partnerAppearanceOptions: ReadonlyArray<{
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

const hubNavigationItems: readonly HubNavigationItem[] = [
  {
    id: 'profile',
    title: 'Ù…Ù„Ù Ø§Ù„Ù…ØªØ¬Ø±',
    description: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±ØŒ Ø§Ù„Ù‡ÙˆÙŠØ©ØŒ Ø§Ù„Ø¸Ù‡ÙˆØ±ØŒ Ø§Ù„ÙØ±Ø¹ØŒ ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ ÙÙŠ Ù…Ø³Ø§Ø­Ø© ÙˆØ§Ø­Ø¯Ø©.',
    icon: 'storefront-outline',
    section: 'profile',
  },
  {
    id: 'wallet',
    title: wltDshPartnerUiCopy.walletSectionTitle,
    description: wltDshPartnerUiCopy.walletSectionDescription,
    icon: 'wallet-outline',
    section: 'wallet',
  },
  {
    id: 'operations',
    title: 'Ø§Ù„Ù…ØªØ¬Ø± ÙˆØ§Ù„ÙØ±ÙŠÙ‚',
    description: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±ØŒ Ø§Ù„ØªÙˆØµÙŠÙ„ØŒ Ø§Ù„ÙØ±ÙŠÙ‚ØŒ ÙˆÙ…Ù†Ø§Ø·Ù‚ Ø§Ù„ØªØºØ·ÙŠØ©.',
    icon: 'people-outline',
    section: 'operations',
  },
  {
    id: 'inventory',
    title: 'Ø§Ù„Ù…Ø®Ø²ÙˆÙ† ÙˆØ§Ù„ÙƒØªØ§Ù„ÙˆØ¬',
    description: 'Ø¨Ø­Ø« Ø£ÙˆÙ„Ù‹Ø§ØŒ Ø¥Ø¶Ø§ÙØ© Ø°ÙƒÙŠØ©ØŒ Ø£Ø³Ø¹Ø§Ø± ÙˆÙ…Ø®Ø²ÙˆÙ† Ø¨Ø¯ÙˆÙ† ØªÙƒØ±Ø§Ø±.',
    icon: 'cube-outline',
    section: 'inventory',
  },
  {
    id: 'analytics',
    title: 'Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª ÙˆØ§Ù„Ù†Ù…Ùˆ ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚',
    description: 'Ø§Ù„Ø£Ø¯Ø§Ø¡ØŒ Ø§Ù„ÙØ±ØµØŒ Ø§Ù„Ø¹Ø±ÙˆØ¶ØŒ Ø§Ù„Ø§Ø´ØªØ±Ø§ÙƒØŒ ÙˆØ§Ù„ØªÙˆØµÙŠØ§Øª Ø§Ù„Ø¹Ù…Ù„ÙŠØ©.',
    icon: 'trending-up-outline',
    section: 'analytics',
  },
  {
    id: 'settings',
    title: 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª',
    description: 'Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡Ø§ØªØŒ Ø§Ù„Ù„ØºØ©ØŒ Ø§Ù„ØªÙØ¶ÙŠÙ„Ø§ØªØŒ ÙˆØ¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±.',
    icon: 'settings-outline',
    section: 'settings',
  },
] as const;

const sectionCopy: Record<Exclude<PartnerHubSection, 'hub'>, { title: string; description: string; icon: React.ComponentProps<typeof Icon>['name'] }> = {
  profile: {
    title: 'Ù…Ù„Ù Ø§Ù„Ù…ØªØ¬Ø±',
    description: 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±ØŒ Ø§Ù„Ù‡ÙˆÙŠØ©ØŒ Ø§Ù„Ø¸Ù‡ÙˆØ±ØŒ Ø§Ù„ÙØ±Ø¹ØŒ ÙˆØ§Ù„Ù†Ø·Ø§Ù‚ ÙÙŠ Ù…Ø³Ø§Ø­Ø© ÙˆØ§Ø­Ø¯Ø©.',
    icon: 'storefront-outline',
  },
  operations: {
    title: 'Ø§Ù„Ù…ØªØ¬Ø± ÙˆØ§Ù„ÙØ±ÙŠÙ‚',
    description: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±ØŒ Ø§Ù„ØªÙˆØµÙŠÙ„ØŒ Ø§Ù„ÙØ±ÙŠÙ‚ØŒ ÙˆÙ…Ù†Ø§Ø·Ù‚ Ø§Ù„ØªØºØ·ÙŠØ©.',
    icon: 'people-outline',
  },
  inventory: {
    title: 'Ø§Ù„Ù…Ø®Ø²ÙˆÙ† ÙˆØ§Ù„ÙƒØªØ§Ù„ÙˆØ¬',
    description: 'Ø¨Ø­Ø« Ø£ÙˆÙ„Ù‹Ø§ØŒ Ø¥Ø¶Ø§ÙØ© Ø°ÙƒÙŠØ©ØŒ Ø£Ø³Ø¹Ø§Ø± ÙˆÙ…Ø®Ø²ÙˆÙ† Ø¨Ø¯ÙˆÙ† ØªÙƒØ±Ø§Ø±.',
    icon: 'cube-outline',
  },
  wallet: {
    title: wltDshPartnerUiCopy.walletSectionTitle,
    description: wltDshPartnerUiCopy.walletSectionDescription,
    icon: 'wallet-outline',
  },
  analytics: {
    title: 'Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª ÙˆØ§Ù„Ù†Ù…Ùˆ ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚',
    description: 'Ø§Ù„Ø£Ø¯Ø§Ø¡ØŒ Ø§Ù„ÙØ±ØµØŒ Ø§Ù„Ø¹Ø±ÙˆØ¶ØŒ Ø§Ù„Ø§Ø´ØªØ±Ø§ÙƒØŒ ÙˆØ§Ù„ØªÙˆØµÙŠØ§Øª Ø§Ù„Ø¹Ù…Ù„ÙŠØ©.',
    icon: 'trending-up-outline',
  },
  settings: {
    title: 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª',
    description: 'Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡Ø§ØªØŒ Ø§Ù„Ù„ØºØ©ØŒ Ø§Ù„ØªÙØ¶ÙŠÙ„Ø§ØªØŒ ÙˆØ¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±.',
    icon: 'settings-outline',
  },
};

type PromotionIntentState = 'ready' | 'empty' | 'pending' | 'blocked';

function resolvePromotionIntentStateMeta(state: PromotionIntentState) {
  if (state === 'pending') {
    return {
      stateId: 'empty' as const,
      title: 'Ø·Ù„Ø¨ Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©',
      description: 'Ø§Ù„Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ÙŠØ© Ù…Ø³Ø¬Ù„Ø© Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙˆØªÙ†ØªØ¸Ø± Ù…ÙˆØ§Ø¡Ù…Ø© Ø§Ù„ØªØ³ÙˆÙŠÙ‚ Ø£Ùˆ Ø§Ù„Ø´Ø±ÙŠÙƒ.',
      actionLabel: 'ØªØ­Ø¯ÙŠØ« Ø§Ù„Ù†ÙŠØ©',
    };
  }

  if (state === 'blocked') {
    return {
      stateId: 'blockingError' as const,
      title: 'Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù†ÙŠØ© Ø§Ù„Ø¢Ù†',
      description: 'Ø§Ù„Ø¹Ù†ØµØ± Ø§Ù„Ù…Ø®ØªØ§Ø± ØºÙŠØ± Ø¬Ø§Ù‡Ø² Ù„Ù„ØªØ±ÙˆÙŠØ¬ Ø£Ùˆ ÙŠØ­ØªØ§Ø¬ Ù…Ø¹Ø§Ù„Ø¬Ø© Ù‚Ø¨Ù„ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„.',
      actionLabel: 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ©',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù†Ø§ØµØ± Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ±ÙˆÙŠØ¬',
      description: 'Ø£Ø¶Ù Ù…Ù†ØªØ¬Ù‹Ø§ Ø£Ùˆ Ù…ØªØ¬Ø±Ù‹Ø§ Ù…Ù†Ø§Ø³Ø¨Ù‹Ø§ Ø«Ù… Ø£Ø¹Ø¯ ÙØªØ­ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„ØªØ±ÙˆÙŠØ¬ÙŠ.',
      actionLabel: 'Ø§Ø®ØªÙŠØ§Ø± Ø¹Ù†ØµØ±',
    };
  }

  return {
    stateId: 'loading' as const,
    title: 'Ù…Ø³Ø§Ø± Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ø¶ÙŠØ±',
    description: 'Ù†Ø¬Ù‡Ø² Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø´Ø±ÙŠÙƒ Ù„Ø§Ù„ØªÙ‚Ø§Ø· Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù‚Ø¨Ù„ ØªØ³Ù„ÙŠÙ…Ù‡Ø§ Ù„Ù„ØªØ³ÙˆÙŠÙ‚.',
    actionLabel: 'ÙØªØ­ Ø§Ù„Ù…Ø³Ø§Ø±',
  };
}

function PromotionCandidateRow({
  item,
  selected,
  onPress,
}: {
  item: DshPromotionCandidate;
  selected: boolean;
  onPress: () => void;
}) {
  const tone = item.eligibility === 'eligible' ? 'success' : item.eligibility === 'review' ? 'warning' : 'danger';

  const statusLabel =
    item.status === 'draft' ? 'Ù…Ø³ÙˆØ¯Ø©' :
    item.status === 'partner-review' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„' :
    item.status === 'marketing-ready' ? 'Ù…Ø¹ØªÙ…Ø¯ ÙˆÙ…Ø¤Ù‡Ù„' :
    'Ù…Ø±ÙÙˆØ¶';

  const statusTone =
    item.status === 'marketing-ready' ? 'success' :
    item.status === 'partner-review' ? 'warning' :
    item.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Surface tone="default" padding={3} gap={2} style={{ borderWidth: 1, borderColor: selected ? colorPalette.brand : undefined }}>
      <Box gap={1}>
        <Text role="bodyStrong">{item.title}</Text>
        <Text role="bodySm" tone="muted">{item.subtitle}</Text>
      </Box>

      <Box gap={1}>
        <Text role="caption" tone="muted">{item.availability}</Text>
        <Text role="caption" tone="muted">{item.offerHint}</Text>
      </Box>

      <Box layoutDirection="row" style={{ flexWrap: 'wrap' }} gap={2}>
        <Chip label={item.kind === 'product' ? 'Ù…Ù†ØªØ¬' : 'Ù…ØªØ¬Ø±'} tone="brand" selected />
        <Chip label={item.eligibility === 'eligible' ? 'Ù…Ø¤Ù‡Ù„' : item.eligibility === 'review' ? 'ØªØ­Øª Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©' : 'Ù…Ø­Ø¬ÙˆØ¨'} tone={tone} />
        <Chip label={statusLabel} tone={statusTone} />
      </Box>

      <Button label={selected ? 'Ø§Ù„Ø¹Ù†ØµØ± Ù…ÙØªÙˆØ­' : 'Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¹Ù†ØµØ±'} tone={selected ? 'secondary' : 'ghost'} fullWidth={false} onPress={onPress} />
    </Surface>
  );
}

function PromotionIntentPanel({
  storeName,
  branchLabel,
  activeZoneLabel,
  todayHoursLabel,
}: {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
}) {
  const { direction } = useDirection();
  const [selectedId, setSelectedId] = React.useState<string>(dshPromotionCandidates[0]?.id ?? '');
  const [offerTitle, setOfferTitle] = React.useState('Ø¹Ø±Ø¶ Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹');
  const [offerNote, setOfferNote] = React.useState('Ø®ØµÙ… Ù‚ØµÙŠØ± Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø£Ø¹Ù„Ù‰ Ø·Ù„Ø¨Ù‹Ø§ Ù…Ø¹ Ø¥Ø¨Ø±Ø§Ø² ÙˆØ§Ø¶Ø­.');
  const [actionMessage, setActionMessage] = React.useState('Ø§Ù„Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ÙŠØ© Ù…Ø­Ù„ÙŠØ© Ø­ØªÙ‰ ÙŠØªÙ… ØªØ³Ù„ÙŠÙ…Ù‡Ø§ Ù„Ù„ØªØ³ÙˆÙŠÙ‚.');

  const selectedItem = dshPromotionCandidates.find((item) => item.id === selectedId) ?? dshPromotionCandidates[0];

  const statusLabel =
    selectedItem?.status === 'draft' ? 'Ù…Ø³ÙˆØ¯Ø©' :
    selectedItem?.status === 'partner-review' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ø¥Ø±Ø³Ø§Ù„' :
    selectedItem?.status === 'marketing-ready' ? 'Ù…Ø¹ØªÙ…Ø¯ ÙˆÙ…Ø¤Ù‡Ù„' :
    'Ù…Ø±ÙÙˆØ¶';
  const statusTone =
    selectedItem?.status === 'marketing-ready' ? 'success' :
    selectedItem?.status === 'partner-review' ? 'warning' :
    selectedItem?.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Box gap={4}>
      <Box gap={3} paddingY={2}>
        <Text role="label" tone="muted">Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ Ù…Ù† Ø§Ù„Ø´Ø±ÙŠÙƒ</Text>
        <Text role="titleSm">Ø§Ø®ØªØ± Ù…Ù†ØªØ¬Ù‹Ø§ Ø£Ùˆ Ù…ØªØ¬Ø±Ù‹Ø§ Ù‚Ø§Ø¨Ù„Ù‹Ø§ Ù„Ù„ØªØ±ÙˆÙŠØ¬ Ø«Ù… Ø¬Ù‡Ù‘Ø² Ø§Ù„Ø·Ù„Ø¨ Ù„Ù„ØªØ³ÙˆÙŠÙ‚</Text>
        <Text role="bodySm" tone="muted">
          Ù‡Ø°Ù‡ Ø§Ù„Ø´Ø§Ø´Ø© ØªÙ„ØªÙ‚Ø· Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ ÙÙ‚Ø·: Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¹Ù†ØµØ±ØŒ ÙˆØµÙ Ø§Ù„Ø¹Ø±Ø¶ØŒ ÙˆØªØ­Ø¯ÙŠØ¯ Ø­Ø§Ù„Ø© Ø§Ù„Ø¥Ø±Ø³Ø§Ù„.
        </Text>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          <Chip label={storeName} tone="brand" />
          <Chip label={branchLabel} tone="info" />
          <Chip label={activeZoneLabel} tone="success" />
          <Chip label={todayHoursLabel} tone="warning" />
        </Box>
      </Box>

      <Divider />

      <Box gap={3} paddingY={2}>
        <Text role="titleSm">Ø§Ù„Ø¹Ù†Ø§ØµØ± Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ±ÙˆÙŠØ¬</Text>
        <Box gap={2}>
          {dshPromotionCandidates.map((item) => (
            <PromotionCandidateRow key={item.id} item={item} selected={item.id === selectedItem?.id} onPress={() => setSelectedId(item.id)} />
          ))}
        </Box>
      </Box>

      <Divider />

      <Box gap={3} paddingY={2}>
        <Text role="titleSm">ØªÙØ§ØµÙŠÙ„ Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬</Text>
        <KeyValueList
          dense
          items={[
            { label: 'Ø§Ù„Ø¹Ù†ØµØ± Ø§Ù„Ù…Ø®ØªØ§Ø±', value: selectedItem?.title ?? 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯' },
            { label: 'Ø§Ù„Ù†ÙˆØ¹', value: selectedItem?.kind === 'store' ? 'Ù…ØªØ¬Ø±' : 'Ù…Ù†ØªØ¬', tone: 'brand' },
            { label: 'Ø§Ù„Ø£Ù‡Ù„ÙŠØ©', value: selectedItem?.eligibility === 'eligible' ? 'Ù…Ø¤Ù‡Ù„' : selectedItem?.eligibility === 'review' ? 'ØªØ­Øª Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©' : 'Ù…Ø­Ø¬ÙˆØ¨', tone: selectedItem?.eligibility === 'eligible' ? 'success' : selectedItem?.eligibility === 'review' ? 'warning' : 'danger' },
            { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: statusLabel, tone: statusTone },
          ]}
        />

        <Box gap={2}>
          <TextField label="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶" value={offerTitle} onChangeText={setOfferTitle} placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶" />
          <TextField label="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ù†ÙŠØ©" value={offerNote} onChangeText={setOfferNote} placeholder="ÙˆØµÙ Ù…Ø®ØªØµØ± Ù„Ù„Ø¹Ø±Ø¶ Ø£Ùˆ Ø³Ø¨Ø¨ Ø§Ù„ØªØ±ÙˆÙŠØ¬" multiline />
        </Box>

        <Box padding={3} gap={2} style={{ backgroundColor: colorPalette.line + '11', borderRadius: 12 }}>
          <Text role="bodyStrong">Ø¢Ø®Ø± Ø±Ø³Ø§Ù„Ø©</Text>
          <Text role="bodySm" tone="muted">{actionMessage}</Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="ØªØ£ÙƒÙŠØ¯ Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬" tone="primary" fullWidth={false} onPress={() => setActionMessage(`ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ù†ÙŠØ©: ${offerTitle}`)} />
          <Button label="Ø·Ù„Ø¨ Ø¥Ø¨Ø±Ø§Ø² ÙÙŠ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" tone="secondary" fullWidth={false} onPress={() => setActionMessage(`Ø·Ù„Ø¨ Ø¥Ø¨Ø±Ø§Ø²: ${selectedItem?.title ?? 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯'}`)} />
          <Button label="ØªÙ…ÙŠÙŠØ² Ø§Ù„Ù…Ù†ØªØ¬" tone="ghost" fullWidth={false} onPress={() => setActionMessage(`ØªÙ… ÙˆØ¶Ø¹ Ø§Ù„Ø¹Ù†ØµØ± Ø¶Ù…Ù† Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ØªØ±ÙˆÙŠØ¬: ${selectedItem?.title ?? 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯'}`)} />
        </Box>
      </Box>

      <MobileStickyPrimaryAction
        label="Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨ Ø§Ù„ØªØ±ÙˆÙŠØ¬"
        helperText="Ø§Ù„Ù†ÙŠØ© Ø§Ù„ØªØ±ÙˆÙŠØ¬ÙŠØ© Ù…Ø­Ù„ÙŠØ© ÙˆØªØ°Ù‡Ø¨ Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ÙÙˆØ± Ø¥Ø±Ø³Ø§Ù„Ù‡Ø§."
        onPress={() => setActionMessage(`ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ù†ÙŠØ©: ${offerTitle}`)}
      />
    </Box>
  );
}

function SummaryCell({ label, value, tone = 'default' }: Omit<SummaryItem, 'id'>) {
  const { theme } = useTheme();
  const accentColor =
    tone === 'success'
      ? theme.success
      : tone === 'warning'
        ? theme.warning
        : tone === 'brand'
          ? theme.brand
          : tone === 'info'
            ? theme.info
            : theme.lineStrong;

  return (
    <Box
      padding={3}
      gap={1}
      style={{ flex: 1, minWidth: 96, borderBottomWidth: 2, borderBottomColor: accentColor }}
    >
      <Text role="caption" tone="muted" numberOfLines={1} align="start">
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={1} align="start">
        {value}
      </Text>
    </Box>
  );
}

function SettingsOptionRow({
  title,
  subtitle,
  icon,
  value,
  onValueChange,
  onPress,
  last = false,
  disabled = false,
  compact = false,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  value?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  onPress?: () => void;
  last?: boolean;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const isSwitchRow = typeof value === 'boolean' && typeof onValueChange === 'function';

  return (
    <Pressable
      accessibilityRole={isSwitchRow ? undefined : 'button'}
      accessibilityLabel={title}
      accessibilityState={isSwitchRow ? undefined : { disabled }}
      disabled={disabled}
      onPress={isSwitchRow ? undefined : onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: compact ? 10 : 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: theme.line,
          opacity: disabled ? 0.56 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: rowDirection, alignItems: 'center' }}>
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: compact ? 10 : 12, flexShrink: 1, minWidth: 0 }}>
          {compact ? (
            <Icon name={icon} size={18} tone={isSwitchRow && value ? 'brand' : 'default'} style={{ flexShrink: 0 }} />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surfaceInset,
                borderWidth: 1,
                borderColor: theme.line,
                flexShrink: 0,
              }}
            >
              <Icon name={icon} size={17} tone={isSwitchRow && value ? 'brand' : 'default'} />
            </View>
          )}

          <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              {title}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {isSwitchRow ? (
          <RNSwitch
            disabled={disabled}
            value={value}
            onValueChange={onValueChange}
            thumbColor={value ? theme.brandContrast : theme.surfaceRaised}
            trackColor={{ false: theme.lineStrong, true: theme.brand }}
            ios_backgroundColor={theme.lineStrong}
          />
        ) : (
          <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
        )}
      </View>
    </Pressable>
  );
}

/** Section shell â€” no TopBar/back button; hardware back handles navigation.
 * Section title is displayed inline as a visual header inside the content. */
function HubSectionShell({
  title,
  icon,
  onBack,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onBack: () => void;
  children?: React.ReactNode;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

  React.useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      {/* Visual section title â€” no back button, hardware back handles it */}
      <View
        style={{
          flexDirection: rowDirection,
          alignItems: 'center',
          gap: 12,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.brandSurface,
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={18} tone="brand" />
        </View>
        <Text
          role="titleSm"
          style={{ textAlign: direction === 'rtl' ? 'right' : 'left', flex: 1 }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {children}
      </View>
    </MobileScrollView>
  );
}

/** Premium nav row: icon + title + subtitle on the content side, chevron on the action side. RTL-correct. */
function HubNavRow({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: rowDirection,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
        gap: 12,
        borderWidth: 1,
        borderColor: theme.line,
      })}
    >
      {/* Icon + Text cluster â€” stays together on the content side */}
      <View
        style={{
          flexDirection: rowDirection,
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
            alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start',
          }}
        >
          <Text
            role="bodyStrong"
            numberOfLines={1}
            style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
          >
            {title}
          </Text>
          <Text
            role="bodySm"
            tone="muted"
            numberOfLines={2}
            style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
          >
            {description}
          </Text>
        </View>
      </View>

      {/* Chevron â€” always on the action/opposite side */}
      <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
    </Pressable>
  );
}


function resolveServiceModeEnabled(serviceModes: readonly { id: string; enabled: boolean }[] | undefined, modeId: PartnerOperationalMode['id'], fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    // transitional aliases: legacy `delivery` plus textual `store delivery` / `partner delivery`
    // all map to canonical `partner_delivery` which is displayed as "ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±".
    if (modeId === 'partner_delivery') {
      return mode.id === 'partner_delivery'
        || mode.id === 'partner delivery'
        || mode.id === 'delivery'
        || mode.id === 'store-delivery'
        || mode.id === 'store delivery';
    }
    // transitional aliases: legacy 'scheduled' / 'seconds' map to bthwani_delivery
    return mode.id === 'bthwani_delivery' || mode.id === 'scheduled' || mode.id === 'seconds';
  });

  return matched?.enabled ?? fallback;
}

function OperationsModeRow({
  mode,
  selected,
  onPress,
}: {
  mode: PartnerOperationalMode;
  selected: boolean;
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mode.title}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
        },
      ]}
    >
      <View
        style={{
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? theme.brandSurface : theme.surfaceInset,
              borderWidth: 1,
              borderColor: selected ? theme.brand : theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline'} size={16} tone={selected ? 'brand' : 'default'} />
          </View>

          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text role="bodyStrong" align="start" numberOfLines={1}>
              {mode.title}
            </Text>
            <Text role="bodySm" tone="muted" align="start" numberOfLines={1}>
              {mode.subtitle}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, marginEnd: 10 }}>
          <Chip label={mode.enabled ? 'Ù…ÙØ¹Ù‘Ù„' : 'ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„'} tone={mode.enabled ? 'success' : 'warning'} />
          <Text role="caption" tone="muted">
            {getWltDshPartnerCommissionLabel(mode.commission)}
          </Text>
        </View>

        <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
      </View>
    </Pressable>
  );
}

function OperationsPanel({
  branchLabel,
  cityLabel,
  storeName,
  todayHoursLabel,
  storeOpen,
  activeZoneLabel,
  serviceModes,
  onBack,
  onOpenStoreCourierSetup,
  listingEnabled,
  storeVisibility,
  visibilityLabel,
}: {
  branchLabel: string;
  cityLabel: string;
  storeName: string;
  todayHoursLabel: string;
  storeOpen: boolean;
  activeZoneLabel: string;
  serviceModes: readonly { id: string; label: string; description: string; enabled: boolean }[];
  onBack: () => void;
  onOpenStoreCourierSetup?: () => void;
  listingEnabled: boolean;
  storeVisibility: ReturnType<typeof resolveDshStoreClientVisibility>;
  visibilityLabel: string;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const teamMembers = partnerTeamPreviewMembers;
  const coverageZones = partnerCoveragePreviewZones;
  const [selectedModeId, setSelectedModeId] = React.useState<PartnerOperationalMode['id']>('pickup');
  const [modeOverrides, setModeOverrides] = React.useState<Partial<Record<PartnerOperationalMode['id'], boolean>>>({});
  const [teamPanelOpen, setTeamPanelOpen] = React.useState(false);
  const [coveragePanelOpen, setCoveragePanelOpen] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>(teamMembers.find((member) => member.role === 'supervisor')?.id ?? teamMembers[0]?.id ?? '');
  const [selectedZoneId, setSelectedZoneId] = React.useState<string>(coverageZones.find((zone) => zone.status === 'active')?.id ?? coverageZones[0]?.id ?? '');
  const [inviteDraft, setInviteDraft] = React.useState('');
  const [lastSaveLabel, setLastSaveLabel] = React.useState<string | null>(null);

  const resolvedModes = React.useMemo(
    () =>
      defaultOperationalModes.map((mode) => ({
        ...mode,
        enabled: modeOverrides[mode.id] ?? resolveServiceModeEnabled(serviceModes, mode.id, mode.enabled),
      })),
    [modeOverrides, serviceModes],
  );

  const activeModesCount = resolvedModes.filter((mode) => mode.enabled).length;
      const activeSupervisorCount = teamMembers.filter((member) => member.role === 'supervisor' && member.status === 'active').length;
      const activeTeamCount = teamMembers.filter((member) => member.status === 'active').length;
      const pausedTeamCount = teamMembers.filter((member) => member.status === 'paused').length;
      const invitedTeamCount = teamMembers.filter((member) => member.status === 'invited').length;
      const blockedTeamCount = teamMembers.filter((member) => member.status === 'blocked').length;
      const reviewTeamCount = teamMembers.filter((member) => member.status === 'review-needed').length;
      const activeZoneCount = coverageZones.filter((zone) => zone.status === 'active').length;
      const pendingZoneCount = coverageZones.filter((zone) => zone.status === 'pending').length;
      const blockedZoneCount = coverageZones.filter((zone) => zone.status === 'blocked').length;
      const teamRoleSummary = `Ù…Ø§Ù„Ùƒ ${teamMembers.filter((member) => member.role === 'owner').length} Â· Ù…Ø´Ø±Ù ${teamMembers.filter((member) => member.role === 'supervisor').length} Â· Ù…ÙˆØ¸Ù ${teamMembers.filter((member) => member.role === 'staff').length} Â· Ù…ÙˆØµÙ„ ${teamMembers.filter((member) => member.role === 'courier').length}`;
      const teamStatusSummary = `Ù†Ø´Ø· ${activeTeamCount} Â· Ù…ÙˆÙ‚ÙˆÙ ${pausedTeamCount} Â· Ù…Ø¯Ø¹Ùˆ ${invitedTeamCount} Â· Ù…Ø­Ø¸ÙˆØ± ${blockedTeamCount} Â· Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ${reviewTeamCount}`;
      const zoneStatusSummary = `Ù†Ø´Ø·Ø© ${activeZoneCount} Â· Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ${pendingZoneCount} Â· Ù…Ø­Ø¬ÙˆØ¨Ø© ${blockedZoneCount}`;

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 160 }}>
      <TopBar
        variant="secondary"
        title="Ø§Ù„Ù…ØªØ¬Ø± ÙˆØ§Ù„ÙØ±ÙŠÙ‚"
        subtitle={`${storeName} Â· ${branchLabel}`}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'Ø±Ø¬ÙˆØ¹',
          onPress: onBack,
        }}
      />

      <Box gap={3} paddingY={2}>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <Box style={{ gap: 2, flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
            <Text role="label" tone="muted" align="start">
              Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ©
            </Text>
            <Text role="titleSm" align="start">
              {storeName}
            </Text>
            <Text role="bodySm" tone="muted" align="start">
              {branchLabel} Â· {cityLabel}
            </Text>
          </Box>
          <Badge label={storeOpen ? 'Ù…ÙØªÙˆØ­ Ø§Ù„Ø¢Ù†' : 'Ù…ØºÙ„Ù‚ Ø§Ù„Ø¢Ù†'} tone={storeOpen ? 'success' : 'warning'} />
        </Box>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <SummaryCell label="Ø§Ù„Ø­Ø§Ù„Ø©" value={storeOpen ? 'Ù…ÙØªÙˆØ­' : 'Ù…ØºÙ„Ù‚'} tone={storeOpen ? 'success' : 'warning'} />
          <SummaryCell label="Ø§Ù„Ø¸Ù‡ÙˆØ±" value={visibilityLabel} tone={listingEnabled ? 'brand' : 'warning'} />
          <SummaryCell label="Ø§Ù„Ø£ÙˆØ¶Ø§Ø¹" value={`${activeModesCount}/3`} tone={activeModesCount > 0 ? 'info' : 'warning'} />
        </Box>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label={`Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„: ${todayHoursLabel}`} tone="default" selected />
          <Chip label={`Ø§Ù„ØªØºØ·ÙŠØ©: ${zoneStatusSummary}`} tone="default" selected />
          {onOpenStoreCourierSetup ? (
            <Button label="Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±" tone="brand" size="sm" fullWidth={false} onPress={onOpenStoreCourierSetup} />
          ) : null}
        </Box>

        <Text role="caption" tone="muted" align="start">
          UI_PREVIEW_ONLY Â· Ø§Ù„ØªÙ†ÙÙŠØ° Ø§Ù„Ù…Ø­Ù„ÙŠ Ù‡Ù†Ø§. Ø§Ù„ØªØ³Ø¹ÙŠØ± ÙˆØ§Ù„ØªØ³ÙˆÙŠØ§Øª Ù…Ø±ÙƒØ²ÙŠÙ‹Ø§ ÙÙŠ WLT/Finance.
        </Text>
      </Box>

      <Divider />

      <Box gap={3} paddingY={2}>
        <Text role="bodyStrong" align="start">Ø§Ù„Ø¸Ù‡ÙˆØ± ÙˆÙ†Ù‚Ø§Ø· Ø§Ù„Ø®Ø¯Ù…Ø©</Text>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label={`Ø§Ù„Ø¸Ù‡ÙˆØ±: ${visibilityLabel}`} tone={listingEnabled ? 'success' : 'warning'} />
          <Chip label={`Ø§Ù„Ù†Ø·Ø§Ù‚: ${branchLabel}`} tone="default" />
          <Chip label={`Ø§Ù„Ù…Ù†Ø·Ù‚Ø©: ${activeZoneLabel}`} tone="default" />
          <Chip label={`Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡: ${storeVisibility.visible ? 'Ø¸Ø§Ù‡Ø±' : 'Ù…Ø­Ø¬ÙˆØ¨'}`} tone={storeVisibility.visible ? 'success' : 'warning'} />
          <Chip label={`Ø§Ù„Ø­Ø§Ù„Ø©: ${getDshPartnerActivationStatusLabel(storeVisibility.activationStatus)}`} tone={storeVisibility.visible ? 'success' : 'warning'} />
        </Box>

        <Box gap={1} style={{ marginTop: 4 }}>
          {storeVisibility.checklist.map((check) => (
            <Box key={check.id} style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
              <Icon
                name={check.satisfied ? 'checkmark-circle-outline' : 'close-circle-outline'}
                size={16}
                tone={check.satisfied ? 'success' : 'danger'}
              />
              <Text role="bodySm" tone={check.satisfied ? 'default' : 'danger'} align="start" style={{ flex: 1 }}>
                {check.label}
                {!check.satisfied && check.blockedReason ? ` â€” ${check.blockedReason}` : ''}
              </Text>
              <Badge label={check.satisfied ? 'Ù…ÙƒØªÙ…Ù„' : 'ØºÙŠØ± Ù…ÙƒØªÙ…Ù„'} tone={check.satisfied ? 'success' : 'danger'} />
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      {/* 4) Flat Operational Modes Row List with inline expansion */}
      <Box gap={3} paddingY={2}>
        <Text role="bodyStrong" align="start">
          Ø£ÙˆØ¶Ø§Ø¹ Ø§Ù„Ø®Ø¯Ù…Ø©
        </Text>
        <Box gap={0}>
          {resolvedModes.map((mode) => {
            const isSelected = mode.id === selectedModeId;
            return (
              <Box key={mode.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '33' }}>
                <Pressable
                  onPress={() => setSelectedModeId(isSelected ? '' : mode.id)}
                  style={({ pressed }) => ({
                    flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 4,
                    backgroundColor: pressed ? theme.surfaceInset : undefined,
                  })}
                >
                  <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <Icon
                      name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline'}
                      size={18}
                      tone={isSelected ? 'brand' : 'default'}
                    />
                    <Box style={{ gap: 2, alignItems: 'flex-start', flex: 1 }}>
                      <Text role="bodyStrong" align="start">{mode.title}</Text>
                      <Text role="bodySm" tone="muted" align="start">{mode.subtitle}</Text>
                    </Box>
                  </Box>
                  <Box style={{ alignItems: 'center', flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 8, marginEnd: 8 }}>
                    <Box style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 2 }}>
                      <Badge label={mode.enabled ? 'Ù…ÙØ¹Ù‘Ù„' : 'ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„'} tone={mode.enabled ? 'success' : 'warning'} />
                      <Text role="caption" tone="muted">
                        {getWltDshPartnerCommissionLabel(mode.commission)}
                      </Text>
                    </Box>
                    <Icon name={isSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={16} />
                  </Box>
                </Pressable>

                {isSelected && (
                  <Box paddingHorizontal={4} paddingBottom={3} gap={2} style={{ paddingTop: 2 }}>
                    <Text role="caption" tone="muted" align="start">
                      Ø­Ø§Ù„Ø© Ø§Ù„ÙˆØ¶Ø¹: {mode.enabled ? 'Ù†Ø´Ø· ÙˆÙŠØ³ØªÙ‚Ø¨Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª' : 'Ù…ÙˆÙ‚Ù Ù…Ø¤Ù‚ØªÙ‹Ø§'}.
                    </Text>
                    <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 8 }}>
                      <Button
                        label={mode.enabled ? 'Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„ÙˆØ¶Ø¹' : 'ØªÙØ¹ÙŠÙ„ Ø§Ù„ÙˆØ¶Ø¹'}
                        tone="secondary"
                        size="sm"
                        fullWidth={false}
                        onPress={() => {
                          setModeOverrides((current) => ({
                            ...current,
                            [mode.id]: !mode.enabled,
                          }));
                        }}
                      />
                      {mode.id === 'partner_delivery' && onOpenStoreCourierSetup ? (
                        <Button
                          label="Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±"
                          tone="brand"
                          size="sm"
                          fullWidth={false}
                          onPress={onOpenStoreCourierSetup}
                        />
                      ) : null}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider />

      {/* 5) Flat Team Section with inline expansion */}
      <Box gap={3} paddingY={2}>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ gap: 2, alignItems: 'flex-start' }}>
            <Text role="bodyStrong" align="start">Ø§Ù„ÙØ±ÙŠÙ‚</Text>
            <Text role="caption" tone="muted" align="start">{teamRoleSummary} Â· {teamStatusSummary}</Text>
          </Box>
          <Button
            label={teamPanelOpen ? 'Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡' : 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ÙØ±ÙŠÙ‚'}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setTeamPanelOpen((current) => !current)}
          />
        </Box>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <SummaryCell label="Ù†Ø´Ø·" value={String(activeTeamCount)} tone="success" />
          <SummaryCell label="Ù…ÙˆÙ‚ÙˆÙ" value={String(pausedTeamCount)} tone="warning" />
          <SummaryCell label="Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©" value={String(reviewTeamCount)} tone="info" />
        </Box>

        {teamPanelOpen && (
          <Box gap={3} style={{ paddingHorizontal: 4, marginTop: 4 }}>
            <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="information-circle-outline" size={14} tone="muted" />
              <Text role="caption" tone="muted" align="start" style={{ flex: 1 }}>
                UI_PREVIEW_ONLY Â· Ø§Ù„Ø£Ø¯ÙˆØ§Ø± ÙˆØ§Ù„Ø¯Ø¹ÙˆØ§Øª Ù‡Ù†Ø§ Ù…Ø­Ù„ÙŠØ© Ø­ØªÙ‰ ÙŠØªØµÙ„ Control Panel.
              </Text>
            </Box>

            <Box gap={0}>
              {teamMembers.map((member) => {
                const isMemberSelected = selectedMemberId === member.id;
                const roleTone = resolveTeamRoleTone(member.role);
                const statusTone = resolveTeamStatusTone(member.status);
                const memberActionLabel = resolveMemberActionLabel(member);
                const isLastSupervisor = member.role === 'supervisor' && member.status === 'active' && activeSupervisorCount <= 1;

                return (
                  <Box key={member.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '22', paddingVertical: 8 }}>
                    <Pressable
                      onPress={() => setSelectedMemberId(isMemberSelected ? '' : member.id)}
                      style={({ pressed }) => ({
                        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: pressed ? theme.surfaceInset : undefined,
                        padding: 4,
                      })}
                    >
                      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 }}>
                        <Icon
                          name={member.role === 'courier' ? 'bicycle-outline' : member.role === 'owner' ? 'shield-checkmark-outline' : member.role === 'supervisor' ? 'person-circle-outline' : 'person-outline'}
                          size={16}
                          tone={roleTone}
                        />
                        <Box style={{ gap: 2, flexShrink: 1, minWidth: 0 }}>
                          <Text role="bodyStrong" align="start">{member.name}</Text>
                          <Text role="caption" tone="muted" align="start">{member.branchAssignment}</Text>
                        </Box>
                      </Box>
                      <Box style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 2, marginStart: 8 }}>
                        <Badge label={member.roleLabel} tone={roleTone} />
                        <Badge label={member.statusLabel} tone={statusTone} />
                        <Text role="caption" tone="muted">{memberActionLabel}</Text>
                      </Box>
                      <Icon name={isMemberSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={14} style={{ marginStart: 8 }} />
                    </Pressable>

                    {isMemberSelected && (
                      <Box paddingHorizontal={4} paddingTop={2} gap={2}>
                        <KeyValueList
                          dense
                          items={[
                            { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: member.statusLabel, tone: statusTone },
                            { label: 'ØªØ¹ÙŠÙŠÙ† Ø§Ù„ÙØ±Ø¹', value: member.branchAssignment },
                            { label: 'Ù…Ù„Ø®Øµ Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ§Øª', value: member.permissionsSummary },
                            { label: 'Ø¥Ø³Ù†Ø§Ø¯ Ø§Ù„ØªÙˆØµÙŠÙ„', value: member.deliveryAssignment },
                            { label: 'Ø¯ÙˆØ±Ø© Ø§Ù„Ø¯Ø¹ÙˆØ©', value: member.inviteLifecycle },
                            { label: 'Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©/Ø§Ù„Ø£Ø«Ø±', value: member.operationalImpact },
                          ]}
                        />
                        <Text role="bodySm" tone="muted" align="start">
                          {member.auditNote}
                        </Text>
                        {isLastSupervisor ? (
                          <Text role="caption" tone="warning" align="start">
                            Ù„Ø§ ÙŠÙ…ÙƒÙ† ØªØ¹Ø·ÙŠÙ„ Ø¢Ø®Ø± Ù…Ø´Ø±Ù.
                          </Text>
                        ) : null}
                        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                          <Button
                            label={memberActionLabel}
                            tone={member.status === 'blocked' ? 'secondary' : 'brand'}
                            size="sm"
                            fullWidth={false}
                            disabled={isLastSupervisor}
                            onPress={() => {
                              if (isLastSupervisor) {
                                setLastSaveLabel('Ù„Ø§ ÙŠÙ…ÙƒÙ† ØªØ¹Ø·ÙŠÙ„ Ø¢Ø®Ø± Ù…Ø´Ø±Ù.');
                                return;
                              }

                              setLastSaveLabel(`${memberActionLabel}: ${member.name}`);
                            }}
                          />
                          <Button
                            label={member.status === 'invited' ? 'Ø¥Ø¹Ø§Ø¯Ø© Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¯Ø¹ÙˆØ©' : member.status === 'blocked' ? 'Ø·Ù„Ø¨ Ù…Ø±Ø§Ø¬Ø¹Ø©' : 'Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ§Øª'}
                            tone="secondary"
                            size="sm"
                            fullWidth={false}
                            onPress={() => {
                              setLastSaveLabel(`${member.statusLabel}: ${member.name}`);
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box gap={3} style={{ marginTop: 8 }}>
              <TextField
                label="Ø§Ø³Ù… Ø§Ù„Ø¹Ø¶Ùˆ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯"
                placeholder="Ù…Ø«Ø§Ù„: staff@bthwani.sa"
                value={inviteDraft}
                onChangeText={setInviteDraft}
                hint="UI_PREVIEW_ONLY Â· Ø¥Ù†Ø´Ø§Ø¡ Ø¯Ø¹ÙˆØ© Ù…Ø­Ù„ÙŠØ© Ø­ØªÙ‰ ÙŠØªØµÙ„ Ù…Ø³Ø§Ø± Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ."
              />
              <Button
                label="Ø¥Ø¶Ø§ÙØ© Ø¹Ø¶Ùˆ"
                tone="secondary"
                size="sm"
                fullWidth={false}
                onPress={() => {
                  if (!inviteDraft.trim()) {
                    return;
                  }

                  setLastSaveLabel(`Ø¯Ø¹ÙˆØ© Ù…Ø­Ù„ÙŠØ©: ${inviteDraft.trim()}`);
                  setInviteDraft('');
                }}
              />
              {lastSaveLabel && (
                <Text role="caption" tone="success" align="start">
                  {lastSaveLabel}
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {/* 6) Flat Coverage Zones Section with inline expansion */}
      <Box gap={3} paddingY={2}>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ gap: 2, alignItems: 'flex-start' }}>
            <Text role="bodyStrong" align="start">Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„ØªØºØ·ÙŠØ©</Text>
            <Text role="caption" tone="muted" align="start">{zoneStatusSummary}</Text>
          </Box>
          <Button
            label={coveragePanelOpen ? 'Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ù…Ù†Ø§Ø·Ù‚' : 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ù†Ø§Ø·Ù‚'}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setCoveragePanelOpen((current) => !current)}
          />
        </Box>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <SummaryCell label="Ù†Ø´Ø·Ø©" value={String(activeZoneCount)} tone="success" />
          <SummaryCell label="Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©" value={String(pendingZoneCount)} tone="warning" />
          <SummaryCell label="Ù…Ø­Ø¬ÙˆØ¨Ø©" value={String(blockedZoneCount)} tone="danger" />
        </Box>

        {coveragePanelOpen && (
          <Box gap={3} style={{ paddingHorizontal: 4, marginTop: 4 }}>
            <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="information-circle-outline" size={14} tone="warning" />
              <Text role="caption" tone="warning" align="start" style={{ flex: 1 }}>
                Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ ØªÙØ¯Ø§Ø± Ù…Ø±ÙƒØ²ÙŠÙ‹Ø§ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… ÙˆWLT/Finance. Ø§Ù„Ø´Ø±ÙŠÙƒ ÙŠØ·Ù„Ø¨ Ù…Ø±Ø§Ø¬Ø¹Ø© ÙÙ‚Ø· ÙˆÙ„Ø§ ÙŠØ¨Ø¯Ù„ Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ù…Ø­Ù„ÙŠÙ‹Ø§.
              </Text>
            </Box>

            <Text role="bodySm" tone="muted" align="start">
              {`Ø§Ù„Ù†Ø·Ø§Ù‚ Ø§Ù„Ø­Ø§Ù„ÙŠ: ${activeZoneLabel}`}
            </Text>

            <Box gap={0}>
              {coverageZones.map((zone) => {
                const isZoneSelected = selectedZoneId === zone.id;
                const statusTone = resolveZoneStatusTone(zone.status);

                return (
                  <Box key={zone.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '22', paddingVertical: 8 }}>
                    <Pressable
                      onPress={() => setSelectedZoneId(isZoneSelected ? '' : zone.id)}
                      style={({ pressed }) => ({
                        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: pressed ? theme.surfaceInset : undefined,
                        padding: 4,
                      })}
                    >
                      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 }}>
                        <Icon name="location-outline" size={16} tone="brand" />
                        <Box style={{ gap: 2, flexShrink: 1, minWidth: 0 }}>
                          <Text role="bodyStrong" align="start">{zone.name}</Text>
                          <Text role="caption" tone="muted" align="start">{zone.branchRelation}</Text>
                        </Box>
                      </Box>
                      <Box style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 2, marginStart: 8 }}>
                        <Badge label={zone.statusLabel} tone={statusTone} />
                        <Text role="caption" tone="muted">{zone.reviewActionLabel}</Text>
                      </Box>
                      <Icon name={isZoneSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={14} style={{ marginStart: 8 }} />
                    </Pressable>

                    {isZoneSelected && (
                      <Box paddingHorizontal={4} paddingTop={2} gap={2}>
                        <KeyValueList
                          dense
                          items={[
                            { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: zone.statusLabel, tone: statusTone },
                            { label: 'Ø§Ù„ÙØ±Ø¹ Ø§Ù„Ù…Ø±ØªØ¨Ø·', value: zone.branchRelation },
                            { label: 'ÙˆØ¶Ø¹ Ø§Ù„Ø®Ø¯Ù…Ø©', value: zone.serviceModeRelation },
                            { label: 'Ù…Ø±Ø¬Ø¹ Ø§Ù„ØªØ³Ø¹ÙŠØ±', value: zone.pricingReference },
                            { label: 'Ù…Ø±Ø¬Ø¹ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø©', value: zone.commissionReference },
                            { label: 'Ù…Ø±Ø¬Ø¹ Ø§Ù„ØªØ³ÙˆÙŠØ©', value: zone.payoutReference },
                          ]}
                        />
                        <Text role="bodySm" tone="muted" align="start">
                          {zone.policySummary}
                        </Text>
                        <Text role="bodySm" tone="muted" align="start">
                          {zone.policyReason}
                        </Text>
                        <Text role="caption" tone="muted" align="start">
                          {zone.operationalImpact}
                        </Text>
                        <Text role="caption" tone="muted" align="start">
                          {zone.auditNote}
                        </Text>
                        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                          <Button
                            label={zone.reviewActionLabel}
                            tone="primary"
                            size="sm"
                            fullWidth={false}
                            onPress={() => setLastSaveLabel(`Ø·Ù„Ø¨ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù…Ù†Ø·Ù‚Ø©: ${zone.name}`)}
                          />
                          <Button
                            label="ÙØªØ­ Ø§Ù„Ø£Ø«Ø± Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ"
                            tone="secondary"
                            size="sm"
                            fullWidth={false}
                            onPress={() => setLastSaveLabel(zone.operationalImpact)}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <MobileStickyPrimaryAction
        label="Ø­ÙØ¸ Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª"
        helperText={lastSaveLabel ? `Ø¢Ø®Ø± Ø­ÙØ¸: ${lastSaveLabel}` : 'Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª ØªØ­ÙØ¸ Ù…Ù† Ù†ÙØ³ Ø§Ù„ØµÙØ­Ø©.'}
        onPress={() => setLastSaveLabel(new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }))}
      />
    </MobileScrollView>
  );
}

/** Analytics view-model â€” preview/seed data only.
 * No customer PII. Summary metrics only per on-demand retrieval contract.
 * Designed for later real-data binding without layout changes. */


function AnalyticsInsightMetric({ label, value, tone = 'default', icon }: { label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'info'; icon: React.ComponentProps<typeof Icon>['name'] }) {
  const { theme } = useTheme();
  const { direction } = useDirection();
  const accentColor = tone === 'brand' ? theme.brand : tone === 'success' ? theme.success : tone === 'info' ? theme.info : theme.lineStrong;

  return (
    <Box
      padding={3}
      gap={1}
      style={{ flex: 1, minWidth: 140, borderBottomWidth: 2, borderBottomColor: accentColor }}
    >
      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={14} tone={tone} />
        <Text role="caption" tone="muted" numberOfLines={1} style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
          {label}
        </Text>
      </View>
      <Text role="titleSm" tone={tone} numberOfLines={1} align="start">
        {value}
      </Text>
    </Box>
  );
}

function AnalyticsInsightsPanel({ storeName }: { storeName: string }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const d = dshPartnerAnalyticsPreview;

  return (
    <Box gap={4}>
      {/* Summary headline */}
      <Box gap={2} paddingY={2}>
        <Text role="label" tone="muted" align="start">
          Ù…Ù„Ø®Øµ Ø§Ù„Ø£Ø¯Ø§Ø¡ â€” {storeName}
        </Text>
        <Text role="bodySm" tone="muted" align="start">
          Ù…Ø¤Ø´Ø±Ø§Øª Ù…ÙˆØ¬Ø²Ø© Ù„Ù„ØªÙØ§Ø¹Ù„ ÙˆØ§Ù„Ù†Ù…Ùˆ. Ù„Ø§ ØªØªØ¶Ù…Ù† Ø¨ÙŠØ§Ù†Ø§Øª Ø¹Ù…Ù„Ø§Ø¡ ØªÙØµÙŠÙ„ÙŠØ©.
        </Text>
      </Box>

      <Divider />

      {/* Engagement metrics grid */}
      <Box gap={3} paddingY={2}>
        <Text role="bodyStrong" align="start">Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„ØªÙØ§Ø¹Ù„</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="Ø­ÙØ¸ Ø§Ù„Ù…ØªØ¬Ø± ÙÙŠ Ø§Ù„Ù…ÙØ¶Ù„Ø©" value={d.storeFavoritesCount.toLocaleString('ar')} tone="brand" icon="heart-outline" />
          <AnalyticsInsightMetric label="Ù…ØªØ§Ø¨Ø¹Ùˆ Ø§Ù„Ù…ØªØ¬Ø±" value={d.followersCount.toLocaleString('ar')} tone="info" icon="people-outline" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="Ø­ÙØ¸ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ÙÙŠ Ø§Ù„Ù…ÙØ¶Ù„Ø©" value={d.productFavoritesCount.toLocaleString('ar')} tone="success" icon="bookmark-outline" />
          <AnalyticsInsightMetric label="Ø¹Ø¯Ø¯ Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª" value={d.totalRatings.toLocaleString('ar')} tone="default" icon="star-half-outline" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="Ù…ØªÙˆØ³Ø· Ø§Ù„ØªÙ‚ÙŠÙŠÙ…" value={`${d.averageRating} â­`} tone="brand" icon="star" />
        </View>
      </Box>

      <Divider />

      {/* Top products */}
      <Box gap={3} paddingY={2}>
        <Text role="bodyStrong" align="start">Ø£Ø¨Ø±Ø² Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª</Text>
        <KeyValueList
          dense
          items={[
            { label: 'Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ù‹Ø§', value: `${d.topOrderedProduct.name} (${d.topOrderedProduct.ordersCount} Ø·Ù„Ø¨)`, tone: 'brand' },
            { label: 'Ø§Ù„Ø£ÙƒØ«Ø± ØªÙØ¶ÙŠÙ„Ù‹Ø§', value: `${d.topFavoritedProduct.name} (${d.topFavoritedProduct.favoritesCount} Ø­ÙØ¸)`, tone: 'success' },
            { label: 'Ø§Ù„Ø£Ø¹Ù„Ù‰ Ù…Ø´Ø§Ù‡Ø¯Ø©', value: `${d.topViewedProduct.name} (${d.topViewedProduct.viewsCount} Ù…Ø´Ø§Ù‡Ø¯Ø©)`, tone: 'info' },
          ]}
        />
      </Box>

      <Divider />

      {/* Opportunity spotlight */}
      <Box
        padding={3}
        gap={2}
        style={{ backgroundColor: theme.warning + '11', borderRadius: 12 }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="bulb-outline" size={18} tone="warning" />
          <Text role="bodyStrong" tone="warning">ÙØ±ØµØ© ØªØ³ÙˆÙŠÙ‚ÙŠØ©</Text>
        </View>
        <Text role="bodySm" align="start">
          <Text role="bodySm" tone="default">{d.opportunityProduct.name}: </Text>
          {d.opportunityProduct.insight}
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'Ø§Ù„Ù…ÙØ¶Ù„Ø§Øª', value: String(d.opportunityProduct.favoritesCount), tone: 'success' },
            { label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„ÙØ¹Ù„ÙŠØ©', value: String(d.opportunityProduct.ordersCount), tone: 'warning' },
          ]}
        />
      </Box>

      <Divider />

      {/* Smart recommendation */}
      <Box
        padding={3}
        gap={2}
        style={{ backgroundColor: theme.brand + '11', borderRadius: 12 }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="trending-up-outline" size={18} tone="brand" />
          <Text role="bodyStrong" tone="brand">ØªÙˆØµÙŠØ© Ø°ÙƒÙŠØ©</Text>
        </View>
        <Text role="bodySm" align="start">{d.smartRecommendation}</Text>
        <Button
          label="ÙØ¹Ù‘Ù„ Ø§Ù„Ø¹Ø±Ø¶"
          tone="primary"
          fullWidth={false}
          onPress={() => {/* promotion intent â€” UI only, no backend */}}
        />
      </Box>

      {/* Promotion intent panel below */}
      <PromotionIntentPanel
        storeName={storeName}
        branchLabel="Ø§Ù„ÙŠØ±Ù…ÙˆÙƒ Â· Ø§Ù„Ø±ÙŠØ§Ø¶"
        activeZoneLabel="Ø§Ù„ÙŠØ±Ù…ÙˆÙƒ"
        todayHoursLabel="09:00 - 23:00"
      />
    </Box>
  );
}

export function DshPartnerHubSurface(props: DshPartnerHubSurfaceProps) {

  const {
    state = 'ready',
    section,
    onSectionChange,
    storeName = 'Ù…ØªØ¬Ø± Ø§Ù„ÙØ®Ø§Ù…Ø©',
    branchLabel = 'Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ ÙØ±Ø¹ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†',
    cityLabel = 'Ø§Ù„Ø±ÙŠØ§Ø¶',
    managerLabel = 'Ø®Ø§Ù„Ø¯',
    todayHoursLabel = '09:00 - 23:00',
    storeOpen = true,
    listingEnabled = true,
    activeZoneLabel = 'Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ† / Ø§Ù„Ù†Ø¯Ù‰',
    activeOrdersCount = 13,
    serviceModes = [],
    onOpenOrdersBoard,
    onOpenOrdersSearch,
    onOpenStoreScope,
    onOpenSupportDirectory,
    onOpenWalletHub,
    onOpenBell,
    onOpenOperationalFlow,
    onOpenSupportScreen,
    onOpenStoreCourierSetup,
    onToggleAvailability,
    canonicalStoreId,
    dshAuthBearerToken,
    dshClientId,
    // ML-T1: partner lifecycle stage for readiness status summary (read-only, summary-only per on-demand contract)
    partnerLifecycleStage = 'partner-review' as DshPartnerLifecycleStage,
  } = props as DshPartnerHubSurfaceProps & { partnerLifecycleStage?: DshPartnerLifecycleStage; dshAuthBearerToken?: string | null; dshClientId?: string | null };

  const [isAvailable, setIsAvailable] = React.useState<boolean>(storeOpen);

  const { direction } = useDirection();
  const { theme } = useTheme();
  const partnersGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('partners'), []);
  const catalogsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('catalogs'), []);
  const marketingGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('marketing'), []);
  const financeGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('finance'), []);
  // ML-T1: journey map reference â€” summary-only; details on-demand per on-demand contract
  const partnerStatusStep = React.useMemo(() => getDshPartnerJourneyStep('partner-status-visibility'), []);
  const {
    hydrated: appearanceHydrated,
    mode: appearanceMode,
    setMode: setAppearanceMode,
  } = useAppPartnerAppearance();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('hub');
  const [notificationPreferences, setNotificationPreferences] = React.useState<NotificationPreferenceState>(defaultNotificationPreferences);
  const [showAdvancedNotifications, setShowAdvancedNotifications] = React.useState<boolean>(false);
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;
  const activeCanonicalStore = React.useMemo(() => {
    const activeCanonicalStoreId = canonicalStoreId ?? canonicalPreviewStores[0]?.id;
    return activeCanonicalStoreId ? getCanonicalPreviewStoreCard(activeCanonicalStoreId) : undefined;
  }, [canonicalStoreId]);
  const resolvedActiveZoneLabel = activeCanonicalStore?.zoneLabel ?? activeZoneLabel;

  const [selectedModeId, setSelectedModeId] = React.useState<string>('pickup');
  const resolvedStoreName = activeCanonicalStore?.storeName ?? storeName;
  const resolvedCityLabel = activeCanonicalStore?.cityLabel ?? cityLabel;
  const resolvedBranchLabel = activeCanonicalStore?.branchLabel ?? branchLabel;
  const resolvedManagerLabel = activeCanonicalStore?.managerName ?? managerLabel;
  const resolvedTodayHoursLabel = activeCanonicalStore?.operatingHoursLabel ?? todayHoursLabel;
  const [branchContact] = React.useState('011 555 0123');

  const activeHubNavigationItems = React.useMemo(() => {
    return hubNavigationItems.filter((item) => item.id !== 'profile');
  }, []);

  const storeVisibility = React.useMemo(() => {
    return resolveDshStoreClientVisibility({
      publishStage: activeCanonicalStore?.publishStage,
      activationStatus: mapPublishStageToPartnerActivationStatus(activeCanonicalStore?.publishStage),
      catalogPublished: listingEnabled,
      deliveryModesReady: serviceModes.some((mode) => mode.enabled),
      serviceabilityAvailable: true,
      storeOpen: isAvailable,
    });
  }, [listingEnabled, activeCanonicalStore?.publishStage, serviceModes, isAvailable]);

  const visibilityLabel = listingEnabled ? 'Ù…ÙØ¹Ù‘Ù„' : 'Ù…ÙˆÙ‚ÙˆÙ';

  const enabledNotificationChannelsCount = React.useMemo(
    () => ['orders', 'operations', 'inventory', 'finance', 'marketing', 'system'].filter((key) => notificationPreferences[key as NotificationPreferenceId]).length,
    [notificationPreferences],
  );

  function updateNotificationPreference(preferenceId: NotificationPreferenceId, nextValue: boolean) {
    setNotificationPreferences((current) => ({
      ...current,
      [preferenceId]: nextValue,
    }));
  }

  function openOrderAlerts() {
    onOpenOperationalFlow?.('order-alerts');
    onOpenBell?.();
  }

  function openOperationsDirectory() {
    onOpenOperationalFlow?.('order-issue-queue');
    onOpenSupportDirectory?.();
    onOpenSupportScreen?.('order-issue-queue');
  }

  const openOrdersSearch = React.useCallback(() => {
    if (onOpenOrdersSearch) {
      onOpenOrdersSearch();
      return;
    }

    onOpenOrdersBoard?.();
  }, [onOpenOrdersBoard, onOpenOrdersSearch]);

  const summaryItems = React.useMemo<readonly SummaryItem[]>(
    () => [
      { id: 'store-status', label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±', value: isAvailable ? 'Ù…ÙØªÙˆØ­ Ø§Ù„Ø¢Ù†' : 'Ù…ØºÙ„Ù‚ Ø§Ù„Ø¢Ù†', tone: isAvailable ? 'success' : 'warning' },
      { id: 'active-orders', label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©', value: String(activeOrdersCount), tone: 'brand' },
      { id: 'hours', label: 'Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„', value: resolvedTodayHoursLabel, tone: 'info' },
    ],
    [activeOrdersCount, resolvedTodayHoursLabel, isAvailable],
  );

  if (state !== 'ready') {
    const stateId = state === 'loading' ? 'loading' : state === 'empty' ? 'empty' : state === 'offline' ? 'offline' : 'blockingError';

    return (
      <StateView
        stateId={stateId}
        title="Ù…Ø±ÙƒØ² Ø­Ø³Ø§Ø¨ Ø§Ù„Ø´Ø±ÙŠÙƒ"
        description="Ù†Ø¬Ù‡Ø² Ø§Ù„Ø¢Ù† Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„ØªÙ†Ù‚Ù„ Ø§Ù„Ø®Ø§Øµ Ø¨Ø§Ù„Ø­Ø³Ø§Ø¨. Ø³ÙŠØ¨Ù‚Ù‰ Ø§Ù„Ù…Ø³Ø§Ø± ÙˆØ§Ø¶Ø­Ù‹Ø§ ÙˆÙ…Ø¶ØºÙˆØ·Ù‹Ø§ Ø­ØªÙ‰ ÙŠÙƒØªÙ…Ù„ Ø§Ù„ØªØ­Ù…ÙŠÙ„."
        actionLabel={onOpenOrdersBoard ? 'ÙØªØ­ Ø§Ù„Ø·Ù„Ø¨Ø§Øª' : undefined}
        onActionPress={onOpenOrdersBoard}
      />
    );
  }

  if (activeSection !== 'hub') {
    if (activeSection === 'profile') {
      return (
        <HubSectionShell title={sectionCopy.profile.title} description={sectionCopy.profile.description} icon={sectionCopy.profile.icon} onBack={() => updateSection('hub')}>
          <StoreProfileScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            cityLabel={resolvedCityLabel}
            managerLabel={resolvedManagerLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            storeOpen={storeOpen}
            listingEnabled={listingEnabled}
            canonicalStoreId={activeCanonicalStore?.id}
            sourceRecordId={activeCanonicalStore?.sourceRecordId}
            deliveryReadinessLabel={activeCanonicalStore?.deliveryReadinessLabel}
            coverageSummary={activeCanonicalStore?.coverageSummary}
            publishStage={activeCanonicalStore?.publishStage}
            activationStatus={mapPublishStageToPartnerActivationStatus(activeCanonicalStore?.publishStage)}
            serviceModes={serviceModes}
            onOpenStoreScope={onOpenStoreScope}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <HubSectionShell title={sectionCopy.analytics.title} description={sectionCopy.analytics.description} icon={sectionCopy.analytics.icon} onBack={() => updateSection('hub')}>
          <AnalyticsInsightsPanel storeName={resolvedStoreName} />
        </HubSectionShell>
      );
    }

    if (activeSection === 'wallet') {
      return (
        <WltDshPartnerBridge
          branchLabel={resolvedBranchLabel}
          activeZoneLabel={resolvedActiveZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
          onOpenExpandedWallet={onOpenWalletHub}
          onOpenSettlementReview={onOpenWalletHub}
          onOpenFinancialReport={onOpenWalletHub}
          dshAuthBearerToken={dshAuthBearerToken}
          dshClientId={dshClientId}
        />
      );
    }

    if (activeSection === 'settings') {
      const primaryNotificationRows = [
        {
          id: 'orders' as const,
          title: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ø·Ù„Ø¨Ø§Øª',
          subtitle: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©ØŒ Ø§Ù„ØªØ£Ø®ÙŠØ±ØŒ ÙˆØ­Ø§Ù„Ø§Øª Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø© ÙˆØ§Ù„Ø¥ÙØ±Ø§Ø¬.',
          icon: 'receipt-outline' as const,
          value: notificationPreferences.orders,
        },
        {
          id: 'operations' as const,
          title: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„ØªØ´ØºÙŠÙ„',
          subtitle: 'Ø§Ù„ÙØ±Ø¹ØŒ Ø§Ù„ÙØ±ÙŠÙ‚ØŒ Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„ØŒ ÙˆØ§Ù„ØªÙˆØµÙŠØ§Øª Ø§Ù„Ø³Ø±ÙŠØ¹Ø© Ù„Ù„ÙˆØ±Ø¯ÙŠØ§Øª.',
          icon: 'people-outline' as const,
          value: notificationPreferences.operations,
        },
        {
          id: 'inventory' as const,
          title: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ù…Ø®Ø²ÙˆÙ†',
          subtitle: 'Ø§Ù„Ù†ÙˆØ§Ù‚ØµØŒ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ù…Ù†Ø®ÙØ¶Ø© Ø§Ù„ÙƒÙ…ÙŠØ©ØŒ ÙˆØªØºÙŠÙŠØ±Ø§Øª Ø§Ù„Ø¬Ø§Ù‡Ø²ÙŠØ©.',
          icon: 'cube-outline' as const,
          value: notificationPreferences.inventory,
        },
        {
          id: 'finance' as const,
          title: wltDshPartnerUiCopy.financeNotificationTitle,
          subtitle: wltDshPartnerUiCopy.financeNotificationSubtitle,
          icon: 'wallet-outline' as const,
          value: notificationPreferences.finance,
        },
      ];

      const secondaryNotificationRows = [
        {
          id: 'marketing' as const,
          title: 'Ø§Ù„ØªØ³ÙˆÙŠÙ‚ ÙˆØ§Ù„Ù†Ù…Ùˆ',
          subtitle: 'Ø§Ù„Ø¹Ø±ÙˆØ¶ ÙˆØ§Ù„ØªÙˆØµÙŠØ§Øª Ø§Ù„Ù…ÙˆØ³Ù…ÙŠØ© ÙˆØ§Ù„ÙØ±Øµ Ø§Ù„Ù…Ù‚ØªØ±Ø­Ø© Ù„Ù„Ù†Ù…Ùˆ.',
          icon: 'megaphone-outline' as const,
          value: notificationPreferences.marketing,
        },
        {
          id: 'system' as const,
          title: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ù†Ø¸Ø§Ù…',
          subtitle: 'Ø§Ù„Ù‡ÙˆÙŠØ©ØŒ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§ØªØŒ ÙˆØ­Ø§Ù„Ø© Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ø¹Ø§Ù… Ù„Ù„Ø­Ø³Ø§Ø¨.',
          icon: 'shield-checkmark-outline' as const,
          value: notificationPreferences.system,
        },
        {
          id: 'sound' as const,
          title: 'Ø§Ù„ØµÙˆØª ÙˆØ§Ù„Ø§Ù‡ØªØ²Ø§Ø²',
          subtitle: 'ØªÙØ¹ÙŠÙ„ Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„Ø³Ù…Ø¹ÙŠ ÙˆØ§Ù„Ø§Ù‡ØªØ²Ø§Ø²ÙŠ Ø¹Ù†Ø¯ ÙˆØ¬ÙˆØ¯ Ø­Ø¯Ø« Ù…Ù‡Ù….',
          icon: 'volume-high-outline' as const,
          value: notificationPreferences.sound,
        },
        {
          id: 'dailyDigest' as const,
          title: 'Ù…Ù„Ø®Øµ ÙŠÙˆÙ…ÙŠ Ù…Ø®ØªØµØ±',
          subtitle: 'Ø§Ø³ØªÙ„Ø§Ù… Ù…Ù„Ø®Øµ ÙŠÙˆÙ…ÙŠ Ù…ÙˆØ­Ù‘Ø¯ Ø¨Ø¯Ù„ ÙØªØ­ Ø£ÙƒØ«Ø± Ù…Ù† Ø´Ø§Ø´Ø© Ù…Ù†ÙØµÙ„Ø©.',
          icon: 'calendar-outline' as const,
          value: notificationPreferences.dailyDigest,
        },
        {
          id: 'priorityOnly' as const,
          title: 'Ø§Ù„Ø¹Ø§Ø¬Ù„Ø© ÙÙ‚Ø·',
          subtitle: 'ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„ØªØ´ÙˆÙŠØ´ ÙˆØ¥Ø¨Ø±Ø§Ø² Ø§Ù„Ø­Ø§Ù„Ø§Øª Ø°Ø§Øª Ø§Ù„Ø£ÙˆÙ„ÙˆÙŠØ© Ø§Ù„Ø¹Ø§Ù„ÙŠØ© ÙÙ‚Ø·.',
          icon: 'flash-outline' as const,
          value: notificationPreferences.priorityOnly,
        },
      ];

      const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

      return (
        <HubSectionShell title={sectionCopy.settings.title} description={sectionCopy.settings.description} icon={sectionCopy.settings.icon} onBack={() => updateSection('hub')}>
          <Box gap={4}>
            {/* Appearance Section */}
            <Box padding={0} gap={0}>
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
                  <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
                    <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
                      Ø§Ù„Ù…Ø¸Ù‡Ø±
                    </Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
                      ÙØ§ØªØ­ Ø£Ø¨ÙŠØ¶ Ø£Ùˆ Ø¯Ø§ÙƒÙ† Ø²Ø¬Ø§Ø¬ÙŠ
                  </Text>
                  </View>
                </View>

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
                    <Text
                      role="bodyStrong"
                      style={{
                        fontSize: 12,
                        color: appearanceMode === 'lightPremium' ? theme.brandContrast : theme.text,
                      }}
                    >
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
                    <Text
                      role="bodyStrong"
                      style={{
                        fontSize: 12,
                        color: appearanceMode === 'darkGlass' ? theme.brandContrast : theme.text,
                      }}
                    >
                      Ø¯Ø§ÙƒÙ†
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Box>

            <Divider />

            {/* Current Preferences */}
            <Box padding={0} gap={0}>
              <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                Ø§Ù„ØªÙØ¶ÙŠÙ„Ø§Øª Ø§Ù„Ø­Ø§Ù„ÙŠØ©
              </Text>
              {[
                { label: 'Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡', value: notificationPreferences.priorityOnly ? 'Ø§Ù„Ø¹Ø§Ø¬Ù„Ø© ÙÙ‚Ø·' : 'ÙƒÙ„ Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡Ø§Øª', tone: (notificationPreferences.priorityOnly ? 'warning' : 'success') as const },
                { label: 'Ø§Ù„ØµÙˆØª ÙˆØ§Ù„Ø§Ù‡ØªØ²Ø§Ø²', value: notificationPreferences.sound ? 'Ù…ÙØ¹Ù‘Ù„' : 'Ù…ÙˆÙ‚ÙˆÙ', tone: (notificationPreferences.sound ? 'success' : 'warning') as const },
                { label: 'Ø§Ù„Ù…Ù„Ø®Øµ Ø§Ù„ÙŠÙˆÙ…ÙŠ', value: notificationPreferences.dailyDigest ? 'Ù…ÙØ¹Ù‘Ù„' : 'Ù…ÙˆÙ‚ÙˆÙ', tone: (notificationPreferences.dailyDigest ? 'info' : 'default') as const },
                { label: 'Ø§Ù„Ø¸Ù‡ÙˆØ± ÙÙŠ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©', value: listingEnabled ? 'Ù…ÙØ¹Ù„' : 'Ù…ÙˆÙ‚ÙˆÙ', tone: (listingEnabled ? 'success' : 'warning') as const },
                { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±', value: storeOpen ? 'Ù…ÙØªÙˆØ­ Ø§Ù„Ø¢Ù†' : 'Ù…ØºÙ„Ù‚ Ø§Ù„Ø¢Ù†', tone: (storeOpen ? 'success' : 'warning') as const },
                { label: 'Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„', value: todayHoursLabel, tone: 'default' as const },
              ].map((item, index, arr) => (
                <View
                  key={item.label}
                  style={{
                    flexDirection: rowDirection,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: theme.surface,
                    borderBottomWidth: index === arr.length - 1 ? 0 : 1,
                    borderBottomColor: theme.line,
                  }}
                >
                  <Text role="body" style={{ color: theme.text }}>
                    {item.label}
                  </Text>
                  <Chip label={item.value} tone={item.tone} />
                </View>
              ))}
            </Box>

            <Divider />

            {/* Notification Preferences */}
            <Box padding={0} gap={0}>
              <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª
              </Text>
              {primaryNotificationRows.map((item) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  value={item.value}
                  onValueChange={(nextValue) => updateNotificationPreference(item.id, nextValue)}
                  compact={true}
                  last={false}
                />
              ))}

              <Pressable
                onPress={() => setShowAdvancedNotifications(!showAdvancedNotifications)}
                style={({ pressed }) => ({
                  flexDirection: rowDirection,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor: pressed ? theme.surfaceInset : theme.surface,
                  borderBottomWidth: showAdvancedNotifications ? 1 : 0,
                  borderBottomColor: theme.line,
                })}
              >
                <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 10, flexShrink: 1, minWidth: 0 }}>
                  <Icon name="options-outline" size={18} tone="default" style={{ flexShrink: 0 }} />
                  <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
                    <Text role="bodyStrong" style={{ color: theme.brand, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                      Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ù…ØªÙ‚Ø¯Ù…Ø©
                    </Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                      Ø¥Ø¯Ø§Ø±Ø© Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„ØµÙˆØªØŒ Ø§Ù„Ù…Ù„Ø®ØµØ§Øª ÙˆØ§Ù„ØªØ³ÙˆÙŠÙ‚
                    </Text>
                  </View>
                </View>
                <Icon name={showAdvancedNotifications ? "chevron-down-outline" : "chevron-forward-outline"} mirrored tone="muted" size={18} />
              </Pressable>

              {showAdvancedNotifications && secondaryNotificationRows.map((item, index, arr) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  value={item.value}
                  onValueChange={(nextValue) => updateNotificationPreference(item.id, nextValue)}
                  compact={true}
                  last={index === arr.length - 1}
                />
              ))}
            </Box>

            <Divider />

            {/* Quick Access */}
            <Box padding={0} gap={0}>
              <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                Ø§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹
              </Text>
              {[
                {
                  id: 'order-alerts',
                  title: 'ÙØªØ­ ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ø·Ù„Ø¨',
                  icon: 'notifications-outline' as const,
                  onPress: openOrderAlerts,
                },
                {
                  id: 'branch-scope',
                  title: 'Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙØ±Ø¹',
                  icon: 'git-branch-outline' as const,
                  onPress: onOpenStoreScope,
                },
                {
                  id: 'operations-directory',
                  title: 'Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
                  icon: 'headset-outline' as const,
                  onPress: openOperationsDirectory,
                },
              ].map((item, index, arr) => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  style={({ pressed }) => ({
                    flexDirection: rowDirection,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: pressed ? theme.surfaceInset : theme.surface,
                    borderBottomWidth: index === arr.length - 1 ? 0 : 1,
                    borderBottomColor: theme.line,
                  })}
                >
                  <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 10, flexShrink: 1, minWidth: 0 }}>
                    <Icon name={item.icon} size={18} tone="default" style={{ flexShrink: 0 }} />
                    <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                      {item.title}
                    </Text>
                  </View>
                  <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
                </Pressable>
              ))}
            </Box>

            {/* Safe area spacer for bottom navigation */}
            <View style={{ height: 140 }} />
          </Box>
        </HubSectionShell>
      );
    }

    if (activeSection === 'inventory') {
      return (
        <HubSectionShell title={sectionCopy.inventory.title} description={sectionCopy.inventory.description} icon={sectionCopy.inventory.icon} onBack={() => updateSection('hub')}>
          <InventoryCatalogScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            canonicalStoreId={activeCanonicalStore?.id}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'operations') {
      return (
        <OperationsPanel
          branchLabel={resolvedBranchLabel}
          cityLabel={resolvedCityLabel}
          storeName={resolvedStoreName}
          todayHoursLabel={resolvedTodayHoursLabel}
          storeOpen={isAvailable}
          activeZoneLabel={resolvedActiveZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
          onOpenStoreCourierSetup={onOpenStoreCourierSetup}
          listingEnabled={listingEnabled}
          storeVisibility={storeVisibility}
          visibilityLabel={visibilityLabel}
        />
      );
    }

    const copy = sectionCopy[activeSection as Exclude<PartnerHubSection, 'hub'>];

    return (
      <HubSectionShell
        title={copy.title}
        description={copy.description}
        icon={copy.icon}
        onBack={() => updateSection('hub')}
      />
    );
  }

  return (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      <MobileScrollView fill padding={0} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
        <StoreHero
          coverImage={resolveDshImageSource(activeCanonicalStore?.imageUri || 'dsh.store.malqa.cover.v1')}
          logoImage={resolveDshImageSource(activeCanonicalStore?.logoImageUri || 'dsh.store.malqa.logo.v1')}
          name={resolvedStoreName}
          locationLabel={`${resolvedBranchLabel} Â· ${resolvedActiveZoneLabel}`}
          isOpen={isAvailable}
          hasBthwaniPro={activeCanonicalStore?.hasBthwaniPro ?? true}
          distanceLabel={activeCanonicalStore?.distanceLabel || '1.8 ÙƒÙ…'}
          deliveryTimeLabel={activeCanonicalStore?.deliveryLabel || resolvedTodayHoursLabel}
          rating={activeCanonicalStore?.rating || 4.9}
          contactNumber={branchContact}
          onSearchPress={openOrdersSearch}
          serviceModesBehavior="readonly"
          deliveryModes={defaultOperationalModes.map((mode) => ({
            id: mode.id,
            label: mode.title,
            icon: mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline',
          }))}
          selectedMode={selectedModeId}
          onModeChange={(id) => setSelectedModeId(id)}
          topOppositeAction={
            <Pressable
              onPress={onOpenStoreScope}
              style={({ pressed }) => [
                {
                  flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: pressed ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙØ±Ø¹"
            >
              <Icon name="git-branch-outline" size={14} color={theme.textInverse} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textInverse, fontFamily: 'Outfit-Bold' }}>
                Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙØ±Ø¹
              </Text>
            </Pressable>
          }
        />

        <Box padding={4} gap={4}>
          {/* 1) Wallet Balance Block */}
          <Box gap={2} paddingY={2}>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
                <Text role="caption" tone="muted">Ø±ØµÙŠØ¯ Ø§Ù„Ù…ØªØ¬Ø± Ø§Ù„Ø­Ø§Ù„ÙŠ</Text>
                <Text role="titleLg" tone="brand">{wltDshPartnerPreviewData.wallet.balanceLabel}</Text>
              </View>
              <Button
                label="Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø­ÙØ¸Ø©"
                tone="secondary"
                fullWidth={false}
                onPress={() => updateSection('wallet')}
              />
            </View>
          </Box>

          <Divider />
          {/* 4) Main Sections Nav â€” icon + title + subtitle + chevron, RTL-correct */}
          <View style={{ gap: 8 }}>
            {activeHubNavigationItems.map((item) => (
              <HubNavRow
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onPress={() => updateSection(item.section)}
              />
            ))}
          </View>
        </Box>
      </MobileScrollView>
    </Box>
  );
}

export type PartnerHomeScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerHomeScreen(props: PartnerHomeScreenProps) {
  return <DshPartnerHubSurface {...props} section="hub" />;
}

export type OperationsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function OperationsScreen(props: OperationsScreenProps) {
  return <DshPartnerHubSurface {...props} section="operations" />;
}

export type PartnerSettingsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerSettingsScreen(props: PartnerSettingsScreenProps) {
  return <DshPartnerHubSurface {...props} section="settings" />;
}
