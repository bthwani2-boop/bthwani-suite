import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
  useDirection,
  useTheme,
  Divider,
  ActionStrip,
  spacing,
} from '@bthwani/ui-kit';
import type { WltDshPartnerWalletTransaction } from './wlt-dsh-partner.adapter';
import { useWltDshPartnerWalletPreview } from './useWltDshPartnerWalletPreview';
import { getWltDshPartnerCommissionLabel, getWltDshPartnerOperationalModeCommission } from './wlt-dsh-partner.ui-copy';
import {
  getWltDshStoreDeliveryFinancePreview,
  getWltDshOrderCommissionBreakdown,
  type WltDshFulfillmentMode,
  type WltDshOrderLineItemApplicability,
} from '../control-panel/financeContracts';

type PartnerDshWalletViewState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'no-transactions';
type PartnerDshWalletActionId = 'expanded-wallet' | 'settlements' | 'report';
type PartnerDshTransactionTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type WalletTabId = 'summary' | 'cycle' | 'transactions' | 'modes' | 'courier';

type ServiceModeInput = {
  id: string;
  enabled: boolean;
};

export type PartnerDshWalletTransaction = WltDshPartnerWalletTransaction;

export type PartnerDshWalletBridgeProps = {
  state?: PartnerDshWalletViewState;
  financialActionsDisabled?: boolean;
  branchLabel?: string;
  activeZoneLabel?: string;
  serviceModes?: readonly ServiceModeInput[];
  transactions?: readonly PartnerDshWalletTransaction[];
  onBack?: () => void;
  onOpenExpandedWallet?: () => void;
  onOpenSettlementReview?: () => void;
  onOpenFinancialReport?: () => void;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
};

type WalletStateCopy = {
  stateId?: 'loading' | 'empty' | 'recoverableError' | 'offline';
  title: string;
  description: string;
  actionLabel?: string;
};

const screenBottomInset = 132;



function resolveStateCopy(state: Exclude<PartnerDshWalletViewState, 'ready' | 'no-transactions'>): WalletStateCopy {
  if (state === 'loading') {
    return {
      stateId: 'loading',
      title: 'Ø¬Ø§Ø± ØªØ¬Ù‡ÙŠØ² Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©',
      description: 'Ù†Ø±ØªØ¨ Ø§Ù„Ø±ØµÙŠØ¯ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ§Øª ÙˆØ¢Ø®Ø± Ø§Ù„Ø­Ø±ÙƒØ§Øª Ø¯Ø§Ø®Ù„ Ù…Ø³Ø§Ø­Ø© ÙˆØ§Ø­Ø¯Ø© Ù„Ù„Ø´Ø±ÙŠÙƒ.',
      actionLabel: 'Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty',
      title: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ø§Ù„ÙŠØ© Ø§Ù„Ø¢Ù†',
      description: 'Ø³ØªØ¸Ù‡Ø± Ù‡Ù†Ø§ Ø­Ø±ÙƒØ© Ø§Ù„Ø±ØµÙŠØ¯ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ§Øª ÙˆØ§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø¹Ù†Ø¯ ØªÙˆÙØ±Ù‡Ø§ Ù„Ù‡Ø°Ø§ Ø§Ù„ÙØ±Ø¹.',
      actionLabel: 'Ø§Ù„Ø¹ÙˆØ¯Ø©',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline',
      title: 'Ø§Ù„Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ØºÙŠØ± Ù…ØªØµÙ„Ø©',
      description: 'Ø£Ø¹Ø¯ Ø§Ù„Ø§ØªØµØ§Ù„ Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø±ØµÙŠØ¯ ÙˆØ§Ù„ØªØ­ØµÙŠÙ„ ÙˆØ¢Ø®Ø± Ø§Ù„Ø­Ø±ÙƒØ§Øª Ø¨Ø¯ÙˆÙ† Ù…ØºØ§Ø¯Ø±Ø© Ù…Ø³Ø§Ø­Ø© Ø§Ù„Ø´Ø±ÙŠÙƒ.',
      actionLabel: 'Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©',
    };
  }

  return {
    stateId: 'recoverableError',
    title: 'ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©',
    description: 'Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹ Ø§Ù„Ù…Ù„Ø®Øµ ÙˆØ§Ù„Ø­Ø±ÙƒØ§Øª Ù…Ù† Ù†ÙØ³ Ø§Ù„Ù…Ø³Ø§Ø±.',
    actionLabel: 'Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©',
  };
}

function resolveToneColor(
  theme: ReturnType<typeof useTheme>['theme'],
  tone: PartnerDshTransactionTone | undefined,
) {
  if (tone === 'success') return theme.success;
  if (tone === 'warning') return theme.warning;
  if (tone === 'danger') return theme.danger;
  if (tone === 'info') return theme.info;
  return theme.brand;
}

function resolveBranchShortLabel(branchLabel?: string) {
  if (!branchLabel) return 'Ø§Ù„ÙØ±Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ';
  const segments = branchLabel.split('ØŒ').map((s) => s.trim()).filter(Boolean);
  return segments.at(-1) ?? branchLabel;
}

function resolveLinkedScopeLabel(activeZoneLabel?: string, branchLabel?: string) {
  const branchShortLabel = resolveBranchShortLabel(branchLabel);
  if (!activeZoneLabel) return branchShortLabel;
  const primaryZone = activeZoneLabel.split('/').map((s) => s.trim()).filter(Boolean)[0];
  return primaryZone ? `${primaryZone} / ${branchShortLabel}` : branchShortLabel;
}

function resolveServiceModeEnabled(
  serviceModes: readonly ServiceModeInput[] | undefined,
  modeId: 'pickup' | 'partner_delivery' | 'bthwani_delivery',
  fallback: boolean,
) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    if (modeId === 'partner_delivery') {
      return (
        mode.id === 'partner_delivery' ||
        mode.id === 'partner delivery' ||
        mode.id === 'delivery' ||
        mode.id === 'store-delivery' ||
        mode.id === 'store delivery'
      );
    }
    return mode.id === 'bthwani_delivery' || mode.id === 'scheduled' || mode.id === 'seconds';
  });
  return matched?.enabled ?? fallback;
}

function formatApplicability(app: WltDshOrderLineItemApplicability) {
  if (app.applies) {
    if (app.label.endsWith('â€” WLT')) return 'ØªÙØ­Ø¯Ø¯ Ø¨ÙˆØ§Ø³Ø·Ø© WLT runtime';
    if (app.label.endsWith('â€” Ø­Ø³Ø¨ Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ù…ØªØ¬Ø±')) return 'Ø­Ø³Ø¨ Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ù…ØªØ¬Ø±';
    if (app.label.endsWith('â€” Ø­Ø³Ø¨ Ø§ØªÙØ§Ù‚ Ø§Ù„Ù…ØªØ¬Ø±')) return 'Ø­Ø³Ø¨ Ø§ØªÙØ§Ù‚ Ø§Ù„Ù…ØªØ¬Ø±';
    return app.label;
  }
  return app.reason;
}





// â”€â”€â”€ Financial stream card â€” Ø¨Ø·Ø§Ù‚Ø© Ø­Ø±ÙƒØ© Ù…Ø§Ù„ÙŠØ© Ù…Ø¹ ØªÙØ§ØµÙŠÙ„ inline â”€â”€
function FinancialStreamCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: WltDshPartnerWalletTransaction;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const { direction } = useDirection();

  const detailItems = [
    { label: 'Ù†ÙˆØ¹ Ø§Ù„Ø­Ø±ÙƒØ©', value: item.kindLabel ?? item.kind ?? 'â€”' },
    { label: 'Ø§Ù„Ù…ØµØ¯Ø±', value: item.sourceOrderLabel ?? item.settlementCycleLabel ?? 'â€”' },
    { label: 'Ø£Ø«Ø± Ø§Ù„ØªØ³ÙˆÙŠØ©', value: item.includedInNetSettlementLabel ?? 'â€”' },
    ...(item.sourceTruthLabel
      ? [{ label: 'Ù…ØµØ¯Ø± Ø§Ù„Ø­Ù‚ÙŠÙ‚Ø©', value: `${item.sourceTruthLabel} / ${item.runtimeBindingLabel ?? 'ØºÙŠØ± Ù…Ø±Ø¨ÙˆØ· Ø¨Ø¹Ø¯'}` }]
      : []),
    { label: 'Ø§Ù„Ø³ÙŠØ§Ø³Ø©', value: item.policyLabel ?? 'â€”' },
    ...(item.isStoreCourierCompensation
      ? [{ label: 'Ù…Ù„Ø§Ø­Ø¸Ø©', value: 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± Ø¯Ø§Ø®Ù„ÙŠ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±ØŒ ÙˆÙ„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ.' }]
      : []),
    ...(item.isCaptainPayout
      ? [{ label: 'Ù…Ù„Ø§Ø­Ø¸Ø©', value: 'Ù‡Ø°Ø§ Ø§Ù„Ø¨Ù†Ø¯ ÙŠØ®Øµ ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ ÙÙ‚Ø· â€” Ù„Ø§ ÙŠØªØ¹Ù„Ù‚ Ø¨Ø§Ù„Ø´Ø±ÙŠÙƒ Ù…Ø¨Ø§Ø´Ø±Ø©.' }]
      : []),
    { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: item.statusLabel ?? 'Ù…ÙƒØªÙ…Ù„' },
    { label: 'Ø±Ù‚Ù… Ø§Ù„Ù…Ø±Ø¬Ø¹ÙŠØ©', value: item.id },
    { label: 'Ø§Ù„ØªÙˆÙ‚ÙŠØª', value: item.timeLabel },
  ].filter((d) => d.value && d.value !== 'â€”');

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Ø±Ø£Ø³ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© */}
      <Pressable onPress={onToggle} accessibilityRole="button">
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 10,
            gap: 10,
          }}
        >
          {/* Ø£ÙŠÙ‚ÙˆÙ†Ø© + Ù†Øµ (ÙƒØªÙ„Ø© ÙˆØ§Ø­Ø¯Ø© Ø¹Ù„Ù‰ Ø§Ù„ÙŠÙ…ÙŠÙ† RTL) */}
          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Icon name={item.icon} size={20} tone="brand" />
            <View style={{ flex: 1, gap: 3 }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }} numberOfLines={1}>
                {item.subtitle}
              </Text>
              {item.kindLabel ? (
                <Badge label={item.kindLabel} tone="default" />
              ) : null}
            </View>
          </View>

          {/* Ø§Ù„Ù…Ø¨Ù„Øº + Ø§Ù„Ø­Ø§Ù„Ø© + chevron (Ø¹Ù„Ù‰ Ø§Ù„ÙŠØ³Ø§Ø± ÙÙŠ RTL) */}
          <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, minWidth: 80 }}>
            <Text
              role="bodyStrong"
              style={{ color: resolveToneColor(theme, item.amountTone), textAlign: direction === 'rtl' ? 'left' : 'right' }}
              numberOfLines={1}
            >
              {item.amountLabel}
            </Text>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
              {item.statusLabel ? (
                <Badge label={item.statusLabel} tone={item.statusTone ?? 'default'} />
              ) : null}
            </View>
          </View>

          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
        </View>
      </Pressable>

      {/* Ø§Ù„ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ù†Ø³Ø¯Ù„Ø© Ø¯Ø§Ø®Ù„ Ù†ÙØ³ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© */}
      {isExpanded ? (
        <Box paddingY={2} gap={2}>
          <Divider />
          <KeyValueList dense items={detailItems} />
          {item.previewNoticeLabel ? (
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: 6 }}>
              {item.previewNoticeLabel}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </View>
  );
}

// â”€â”€â”€ ØªØ¨ÙˆÙŠØ¨ Ø§Ù„Ù…Ù„Ø®Øµ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SummaryTab({
  partnerPreview,
  storeDeliveryPreview,
  openAction,
}: {
  partnerPreview: ReturnType<typeof useWltDshPartnerWalletPreview>['partnerPreview'];
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
  openAction: (id: PartnerDshWalletActionId) => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Box gap={4}>
      {/* Cohesive Premium summary block */}
      <Surface
        tone="raised"
        padding={3}
        style={{
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 6,
          }}
        >
          {/* Column 1: ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ© */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ©
            </Text>
            <Text role="titleSm" style={{ color: theme.success, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.netSettlementLabel}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 32, backgroundColor: theme.line }} />

          {/* Column 2: Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª
            </Text>
            <Text role="titleSm" style={{ color: theme.info, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.grossSalesLabel}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, height: 32, backgroundColor: theme.line }} />

          {/* Column 3: Ø§Ù„ØªØ³ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© */}
          <View style={{ flex: 1, gap: 4, paddingHorizontal: 8 }}>
            <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              Ø§Ù„ØªØ³ÙˆÙŠØ© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©
            </Text>
            <Text role="titleSm" style={{ color: theme.warning, textAlign: direction === 'rtl' ? 'right' : 'left', fontWeight: 'bold' }} numberOfLines={1}>
              {partnerPreview.nextSettlementLabel}
            </Text>
          </View>
        </View>
      </Surface>

      {/* Ù…Ù„Ø§Ø­Ø¸Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠØ© - Notice Compact */}
      <Surface
        tone="warning"
        padding={2}
        border={false}
        style={{ borderRadius: 8 }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }}>
          <Icon name="warning" tone="warning" size={14} />
          <Text role="caption" tone="warning" style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
            Ù…Ø¹Ø§ÙŠÙ†Ø© Ù…Ø§Ù„ÙŠØ© â€” Ù„ÙŠØ³Øª ØªØ³ÙˆÙŠØ© Ù…Ù†ÙØ°Ø©
          </Text>
        </View>
      </Surface>

      {/* Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ù…Ø¶ØºÙˆØ·Ø© - Ø£Ø²Ø±Ø§Ø± Ø¹Ù…Ù„ÙŠØ© Ø£Ù†ÙŠÙ‚Ø© Ø¨Ø¬Ø§Ù†Ø¨ Ø¨Ø¹Ø¶Ù‡Ø§ */}
      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 12, marginTop: 4 }}>
        <Button
          label="ØªÙ†Ø²ÙŠÙ„ Ù…Ù„Ø®Øµ Ù…Ø§Ù„ÙŠ"
          tone="secondary"
          icon={<Icon name="download-outline" size={16} tone="brand" />}
          size="sm"
          fullWidth
          style={{ flex: 1 }}
          onPress={() => openAction('report')}
        />
        <Button
          label="ÙØªØ­ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø§Ù„Ù…ÙˆØ³Ø¹Ø©"
          tone="secondary"
          icon={<Icon name="wallet-outline" size={16} tone="brand" />}
          size="sm"
          fullWidth
          style={{ flex: 1 }}
          onPress={() => openAction('expanded-wallet')}
        />
      </View>
    </Box>
  );
}

// â”€â”€â”€ ØªØ¨ÙˆÙŠØ¨ Ø§Ù„ØªØ³ÙˆÙŠØ© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CycleTab({
  partnerPreview,
  storeDeliveryPreview,
}: {
  partnerPreview: ReturnType<typeof useWltDshPartnerWalletPreview>['partnerPreview'];
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
}) {
  return (
    <Box gap={4}>
      <KeyValueList
        dense
        items={[
          { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª', value: partnerPreview.grossSalesLabel, tone: 'info' },
          { label: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©', value: `-${partnerPreview.platformCommissionLabel}`, tone: 'warning' },
          { label: 'Ø®ØµÙˆÙ…Ø§Øª ÙˆØ§Ø³ØªØ±Ø¯Ø§Ø¯Ø§Øª', value: `-${partnerPreview.deductionsLabel}`, tone: 'warning' },
          { label: 'Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±', value: `+${storeDeliveryPreview.totalFeeLabel}`, tone: 'success' },
          { label: 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±', value: `-${storeDeliveryPreview.totalCompensationLabel}`, tone: 'warning' },
          { label: 'ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ©', value: partnerPreview.netSettlementLabel, tone: 'success' },
        ]}
      />
      <Divider />
      <KeyValueList
        dense
        items={[
          { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©', value: partnerPreview.cycleStatus, tone: 'success' },
          { label: 'ØªØ§Ø±ÙŠØ® Ø¨Ø¯Ø¡ Ø§Ù„Ø¯ÙˆØ±Ø©', value: partnerPreview.cycleStartDate },
          { label: 'ØªØ§Ø±ÙŠØ® Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø¯ÙˆØ±Ø©', value: partnerPreview.cycleEndDate },
          { label: 'Ù…ÙˆØ¹Ø¯ Ø§Ù„ØµØ±Ù Ø§Ù„Ù‚Ø§Ø¯Ù…', value: partnerPreview.nextPayoutDate, tone: 'info' },
        ]}
      />
    </Box>
  );
}

// â”€â”€â”€ ØªØ¨ÙˆÙŠØ¨ Ø§Ù„Ø­Ø±ÙƒØ§Øª â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TransactionsTab({
  visibleTransactions,
  selectedTransactionId,
  onToggle,
}: {
  visibleTransactions: readonly WltDshPartnerWalletTransaction[];
  selectedTransactionId: string | null;
  onToggle: (id: string) => void;
}) {
  if (visibleTransactions.length === 0) {
    return (
      <Box padding={4}>
        <StateView
          stateId="empty"
          title="Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­Ø±ÙƒØ§Øª Ù…Ø§Ù„ÙŠØ© Ø¨Ø¹Ø¯"
          description="Ø¹Ù†Ø¯ ÙˆØµÙˆÙ„ Ø£ÙˆÙ„ ØªØ³ÙˆÙŠØ© Ø£Ùˆ Ø¹Ù…ÙˆÙ„Ø© Ø³ØªØ¸Ù‡Ø± Ù‡Ù†Ø§."
        />
      </Box>
    );
  }

  return (
    <Box gap={0}>
      {visibleTransactions.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <Divider />}
          <FinancialStreamCard
            item={item}
            isExpanded={selectedTransactionId === item.id}
            onToggle={() => onToggle(item.id)}
          />
        </React.Fragment>
      ))}
    </Box>
  );
}

// â”€â”€â”€ ØªØ¨ÙˆÙŠØ¨ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª â€” ÙƒÙ„ mode Ø¨Ø·Ø§Ù‚Ø© Ù…Ø§Ù„ÙŠØ© Ù…Ø³ØªÙ‚Ù„Ø© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type CommissionModeId = 'pickup' | 'partner_delivery' | 'bthwani_delivery';

function CommissionModeCard({
  id,
  title,
  icon,
  enabled,
  percentage,
  serviceModes,
  isExpanded,
  onToggle,
}: {
  id: CommissionModeId;
  title: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  enabled: boolean;
  percentage: string;
  serviceModes?: readonly ServiceModeInput[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const modeId: WltDshFulfillmentMode =
    id === 'pickup' ? 'pickup' : id === 'partner_delivery' ? 'partner_delivery' : 'bthwani_delivery';
  const breakdown = getWltDshOrderCommissionBreakdown(modeId);

  const modeDetails = (() => {
    if (id === 'pickup') {
      return {
        deliveryFeeNote: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ â€” Ø§Ø³ØªÙ„Ø§Ù… Ù…Ø¨Ø§Ø´Ø± Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±',
        courierNote: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…ÙˆØµÙ„',
        captainNote: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” Ù„Ø§ ÙŠÙˆØ¬Ø¯ ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„ÙˆØ¶Ø¹',
        netImpact: 'Ø§Ù„Ø´Ø±ÙŠÙƒ ÙŠØ³ØªÙ„Ù… ÙƒØ§Ù…Ù„ Ù‚ÙŠÙ…Ø© Ø§Ù„Ø·Ù„Ø¨ Ù…Ø·Ø±ÙˆØ­Ù‹Ø§ Ù…Ù†Ù‡Ø§ Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©',
        captainPayoutApplies: false,
      };
    }
    if (id === 'partner_delivery') {
      return {
        deliveryFeeNote: 'Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„: ÙŠØ¯ÙØ¹Ù‡Ø§ Ø§Ù„Ø¹Ù…ÙŠÙ„ â€” ØªØ°Ù‡Ø¨ Ù„Ù„Ù…ØªØ¬Ø± Ø­Ø³Ø¨ Ø§Ù„Ø³ÙŠØ§Ø³Ø©',
        courierNote: 'Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± â€” ÙŠÙØ¯ÙØ¹ Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±',
        captainNote: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” Ø§Ù„Ù…ÙˆØµÙ„ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø± ÙˆÙ„ÙŠØ³ Ù…Ù† Ø¨Ø«ÙˆØ§Ù†ÙŠ',
        netImpact: 'Ø§Ù„Ø´Ø±ÙŠÙƒ: Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨ + Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„ âˆ’ Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©. Ø§Ù„ØªØ¹ÙˆÙŠØ¶ Ø¯Ø§Ø®Ù„ÙŠ Ù„Ù„Ù…ÙˆØµÙ„.',
        captainPayoutApplies: false,
      };
    }
    return {
      deliveryFeeNote: 'Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„: ÙŠØ¯ÙØ¹Ù‡Ø§ Ø§Ù„Ø¹Ù…ÙŠÙ„ â€” Ø­Ø³Ø¨ ØªØ³Ø¹ÙŠØ± Ø¨Ø«ÙˆØ§Ù†ÙŠ',
      courierNote: 'ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ â€” ØªØ³ÙˆÙŠØ© WLT captain payout',
      captainNote: 'ÙŠÙ†Ø·Ø¨Ù‚ â€” Ø§Ù„ÙƒØ§Ø¨ØªÙ† ÙŠØ­ØµÙ„ Ø¹Ù„Ù‰ WLT payout Ù…Ø³ØªÙ‚Ù„ Ø¹Ù† ØªØ³ÙˆÙŠØ© Ø§Ù„Ø´Ø±ÙŠÙƒ',
      netImpact: 'Ø§Ù„Ø´Ø±ÙŠÙƒ: Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨ âˆ’ Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ© âˆ’ Ø±Ø³ÙˆÙ… ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ (Ø­Ø³Ø¨ Ø¹Ù‚Ø¯ WLT)',
      captainPayoutApplies: true,
    };
  })();

  return (
    <View style={{ overflow: 'hidden', opacity: enabled ? 1 : 0.65 }}>
      {/* Ø±Ø£Ø³ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© */}
      <Pressable onPress={onToggle} accessibilityRole="button">
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Icon name={icon} size={20} tone={enabled ? 'brand' : 'soft'} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
                {title}
              </Text>
              <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                <Badge
                  label={enabled ? 'Ù…ÙØ¹Ù‘Ù„' : 'ØºÙŠØ± Ù†Ø´Ø·'}
                  tone={enabled ? 'success' : 'warning'}
                />
                <Text role="caption" tone="muted">â€¢ {percentage}</Text>
              </View>
            </View>
          </View>
          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
        </View>
      </Pressable>

      {/* Ø§Ù„ØªÙØ§ØµÙŠÙ„ */}
      {isExpanded ? (
        <Box paddingY={2} gap={3}>
          <Divider />
          <KeyValueList
            dense
            items={[
              { label: 'Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„', value: modeDetails.deliveryFeeNote },
              { label: 'Ø¹Ø¨Ø¡ Ø§Ù„Ù…ÙˆØµÙ„', value: modeDetails.courierNote },
              { label: 'ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ', value: modeDetails.captainNote },
              { label: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©', value: formatApplicability(breakdown.platformCommission) },
              { label: 'Ù…Ø³ØªØ­Ù‚Ø§Øª Ø§Ù„ÙƒØ§Ø¨ØªÙ† (WLT)', value: modeDetails.captainPayoutApplies ? formatApplicability(breakdown.captainPayout) : 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚' },
              { label: 'Ø£Ø«Ø± ØµØ§ÙÙŠ Ø§Ù„Ø´Ø±ÙŠÙƒ', value: modeDetails.netImpact },
              { label: 'ØµØ§ÙÙŠ Ù…Ø³ØªØ­Ù‚Ø§Øª Ø§Ù„Ù…ØªØ¬Ø±', value: formatApplicability(breakdown.partnerNet) },
            ]}
          />
          {/* CTA */}
          {id === 'partner_delivery' ? (
            <Button label="Ø¥Ø¹Ø¯Ø§Ø¯ ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±" tone="secondary" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
          ) : id === 'bthwani_delivery' && !enabled ? (
            <Button label="Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø³ÙŠØ§Ø³Ø©" tone="ghost" size="sm" icon={<Icon name="document-text-outline" size={16} tone="brand" />} />
          ) : (
            <Button label="Ø¹Ø±Ø¶ Ø§Ù„Ø­Ø±ÙƒØ§Øª Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø©" tone="ghost" size="sm" icon={<Icon name="swap-horizontal-outline" size={16} tone="brand" />} />
          )}
        </Box>
      ) : null}
    </View>
  );
}

function ModesTab({
  serviceModes,
}: {
  serviceModes?: readonly ServiceModeInput[];
}) {
  const [expandedModeId, setExpandedModeId] = React.useState<CommissionModeId | null>(null);

  const modes: { id: CommissionModeId; title: string; icon: React.ComponentProps<typeof Icon>['name']; defaultEnabled: boolean }[] = [
    { id: 'pickup', title: 'Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ù†ÙØ³ÙŠ', icon: 'hand-left-outline', defaultEnabled: true },
    { id: 'partner_delivery', title: 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±', icon: 'storefront-outline', defaultEnabled: true },
    { id: 'bthwani_delivery', title: 'ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ', icon: 'bicycle-outline', defaultEnabled: false },
  ];

  return (
    <Box gap={2}>
      <Text role="caption" tone="muted" style={{ textAlign: 'right', marginBottom: 4 }}>
        ÙƒÙ„ ÙˆØ¶Ø¹ ØªØ´ØºÙŠÙ„ ÙŠØ­Ù…Ù„ Ø£Ø«Ø±Ù‹Ø§ Ù…Ø§Ù„ÙŠÙ‹Ø§ Ù…Ø®ØªÙ„ÙÙ‹Ø§. Ø§Ø¶ØºØ· Ù„Ø±Ø¤ÙŠØ© ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø© ÙˆØ£Ø«Ø± Ø§Ù„ØªØ³ÙˆÙŠØ©.
      </Text>
      {modes.map((mode, index) => {
        const enabled = resolveServiceModeEnabled(serviceModes, mode.id, mode.defaultEnabled);
        const percentage = getWltDshPartnerCommissionLabel(getWltDshPartnerOperationalModeCommission(mode.id));
        return (
          <React.Fragment key={mode.id}>
            {index > 0 && <Divider />}
            <CommissionModeCard
              id={mode.id}
              title={mode.title}
              icon={mode.icon}
              enabled={enabled}
              percentage={percentage}
              serviceModes={serviceModes}
              isExpanded={expandedModeId === mode.id}
              onToggle={() => setExpandedModeId(expandedModeId === mode.id ? null : mode.id)}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
}

// â”€â”€â”€ ØªØ¨ÙˆÙŠØ¨ ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø± â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourierTab({
  storeDeliveryPreview,
  direction,
}: {
  storeDeliveryPreview: ReturnType<typeof getWltDshStoreDeliveryFinancePreview>;
  direction: 'rtl' | 'ltr';
}) {
  const hasPolicy = storeDeliveryPreview.totalFeeLabel !== 'Ù  Ø±.ÙŠ';

  if (!hasPolicy) {
    return (
      <Box gap={4}>
        <StateView
          stateId="empty"
          title="Ù„Ù… ÙŠØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø³ÙŠØ§Ø³Ø© ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø± Ø¨Ø¹Ø¯"
          description="Ø­Ø¯Ø¯ Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ù„ØªÙØ¹ÙŠÙ„ ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø± ÙˆØªØªØ¨Ø¹ Ø§Ù„Ø±Ø³ÙˆÙ… ÙˆØ§Ù„ØªØ¹ÙˆÙŠØ¶Ø§Øª."
        />
        <Button label="Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±" tone="primary" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
      </Box>
    );
  }

  return (
    <Box gap={4}>
      {/* Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© */}
      <KeyValueList
        dense
        items={[
          { label: 'Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ø§Ù„Ù†Ø´Ø·Ø©', value: 'ØªÙˆØµÙŠÙ„ Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù„Ø¹Ù…ÙŠÙ„', tone: 'success' },
          { label: 'Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„', value: 'Ù…Ø³ØªØ­Ù‚Ø© Ù…Ù† Ø§Ù„Ø¹Ù…ÙŠÙ„ â€” ØªØ°Ù‡Ø¨ Ù„Ù„Ù…ØªØ¬Ø± Ø­Ø³Ø¨ Ø§Ù„Ø³ÙŠØ§Ø³Ø©' },
          { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…Ø­ØµÙ„Ø©', value: storeDeliveryPreview.totalFeeLabel, tone: 'success' },
          { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ù…Ø³ØªØ­Ù‚Ø§Øª Ù…ÙˆØµÙ„ÙŠ Ø§Ù„Ù…ØªØ¬Ø±', value: storeDeliveryPreview.totalCompensationLabel, tone: 'warning' },
          { label: 'ØªØ³ÙˆÙŠØ© Ø§Ù„ÙƒØ§Ø¨ØªÙ† ØªÙ†Ø·Ø¨Ù‚ØŸ', value: 'Ù„Ø§ â€” Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± ÙŠÙØ³ÙˆÙŽÙ‘Ù‰ Ø¯Ø§Ø®Ù„ÙŠØ§Ù‹' },
        ]}
      />

      {/* ØªÙ†Ø¨ÙŠÙ‡ Ø§Ù„ÙØµÙ„ Ø§Ù„Ù…Ø§Ù„ÙŠ */}
      <Surface tone="warning" padding={3} gap={2} style={{ borderRadius: 10 }}>
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="warning" tone="warning" size={16} />
          <Text role="bodySm" tone="warning" style={{ flex: 1, textAlign: 'right' }}>
            ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± Ø¯Ø§Ø®Ù„ÙŠ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±ØŒ ÙˆÙ„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ. Ù„Ø§ ØªØ®Ù„Ø· Ø¨ÙŠÙ† Ø§Ù„Ø§Ø«Ù†ÙŠÙ†.
          </Text>
        </View>
      </Surface>

      {/* CTA */}
      <Button label="Ø¥Ø¹Ø¯Ø§Ø¯ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±" tone="ghost" size="sm" icon={<Icon name="settings-outline" size={16} tone="brand" />} />
    </Box>
  );
}

// â”€â”€â”€ Ø§Ù„Ø´Ø§Ø´Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PartnerDshWalletBridgeView({
  state = 'ready',
  financialActionsDisabled = false,
  branchLabel = 'ÙØ±Ø¹ Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ†',
  activeZoneLabel = 'Ø§Ù„ÙŠØ§Ø³Ù…ÙŠÙ† / Ø§Ù„Ù†Ø¯Ù‰',
  serviceModes,
  transactions,
  onBack,
  onOpenExpandedWallet,
  onOpenSettlementReview,
  onOpenFinancialReport,
  dshAuthBearerToken,
  dshClientId,
}: PartnerDshWalletBridgeProps) {
  const { direction } = useDirection();
  const { partnerPreview, previewTransactions } = useWltDshPartnerWalletPreview(dshClientId || undefined, dshAuthBearerToken);
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);
  const [expandedSection, setExpandedSection] = React.useState<WalletTabId | null>('summary');

  const linkedScopeLabel = React.useMemo(
    () => resolveLinkedScopeLabel(activeZoneLabel, branchLabel),
    [activeZoneLabel, branchLabel],
  );
  const storeDeliveryPreview = React.useMemo(() => getWltDshStoreDeliveryFinancePreview(), []);

  const sourceTransactions = transactions ?? previewTransactions;
  const visibleTransactions = state === 'no-transactions' ? [] : sourceTransactions;

  function openAction(actionId: PartnerDshWalletActionId) {
    if (actionId === 'expanded-wallet' && onOpenExpandedWallet) {
      onOpenExpandedWallet();
    } else if (actionId === 'settlements' && onOpenSettlementReview) {
      onOpenSettlementReview();
    } else if (actionId === 'report' && onOpenFinancialReport) {
      onOpenFinancialReport();
    }
  }

  // Ø­Ø§Ù„Ø© Ø§Ù„Ø®Ø·Ø£ / Ø§Ù„ØªØ­Ù…ÙŠÙ„ / Ø§Ù„ÙØ±Ø§Øº
  if (state !== 'ready' && state !== 'no-transactions') {
    const stateCopy = resolveStateCopy(state);
    return (
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: screenBottomInset }}>
        <TopBar
          variant="secondary"
          title="Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆØ§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={
            onBack
              ? {
                  id: 'back',
                  icon: <Icon name="arrow-back" size={24} tone="brand" />,
                  mirrorInRtl: true,
                  accessibilityLabel: 'Ø±Ø¬ÙˆØ¹',
                  onPress: onBack,
                }
              : undefined
          }
        />
        <StateView {...stateCopy} onActionPress={onBack} />
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView
      fill
      gap={0}
      contentContainerStyle={{ paddingBottom: screenBottomInset }}
    >
      {/* Header Ù…Ø®ØªØµØ± */}
      <TopBar
        variant="secondary"
        title="Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆØ§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©"
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'Ø±Ø¬ÙˆØ¹',
                onPress: onBack,
              }
            : undefined
        }
      />

      {/* Ø§Ù„ÙØ±Ø¹ / Ø§Ù„Ù†Ø·Ø§Ù‚ */}
      <View
        style={{
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Icon name="location-outline" size={14} tone="soft" />
        <Text role="caption" tone="soft" numberOfLines={1} style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
          {linkedScopeLabel}
        </Text>
      </View>

      {/* Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£Ù‚Ø³Ø§Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ø§Ù„Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø·ÙŠ â€” Ø¨Ù†Ù…Ø· ØµÙØ­Ø© Ø·Ù„Ø¨Ø§ØªÙŠ */}
      <Box padding={4}>
        {/* 1. Ø§Ù„Ù…Ù„Ø®Øµ Ø§Ù„Ù…Ø§Ù„ÙŠ */}
        <ActionStrip
          icon="receipt-outline"
          title="Ø§Ù„Ù…Ù„Ø®Øµ Ø§Ù„Ù…Ø§Ù„ÙŠ"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${partnerPreview.netSettlementLabel} â€¢ ØµØ§ÙÙŠ Ø§Ù„ØªØ³ÙˆÙŠØ© â€¢ Ø±ÙŠØ§Ù„ ÙŠÙ…Ù†ÙŠ`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="Ù†Ø´Ø·" tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#Ø§Ù„Ù…Ø­ÙØ¸Ø©</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'summary'}
          onPress={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'summary' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <SummaryTab
            partnerPreview={partnerPreview}
            storeDeliveryPreview={storeDeliveryPreview}
            openAction={openAction}
          />
        </ActionStrip>

        {/* 2. Ø¯ÙˆØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠØ© */}
        <ActionStrip
          icon="receipt-outline"
          title="Ø¯ÙˆØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠØ©"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${partnerPreview.cycleStartDate} Ø¥Ù„Ù‰ ${partnerPreview.cycleEndDate}`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label={partnerPreview.cycleStatus} tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#Ø§Ù„ØªØ³ÙˆÙŠØ©</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'cycle'}
          onPress={() => setExpandedSection(expandedSection === 'cycle' ? null : 'cycle')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'cycle' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <CycleTab
            partnerPreview={partnerPreview}
            storeDeliveryPreview={storeDeliveryPreview}
          />
        </ActionStrip>

        {/* 3. Ø§Ù„Ø­Ø±ÙƒØ§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ© */}
        <ActionStrip
          icon="receipt-outline"
          title="Ø¢Ø®Ø± Ø§Ù„Ø­Ø±ÙƒØ§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {visibleTransactions.length === 1 ? 'Ø­Ø±ÙƒØ© Ù…Ø§Ù„ÙŠØ© ÙˆØ§Ø­Ø¯Ø© Ù…Ø³Ø¬Ù„Ø©' : `${visibleTransactions.length} Ø­Ø±ÙƒØ§Øª Ù…Ø§Ù„ÙŠØ© Ù…Ø³Ø¬Ù„Ø©`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="Ù…Ø­Ø¯Ø«" tone="default" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#Ø³Ø¬Ù„_Ø§Ù„Ø­Ø±ÙƒØ§Øª</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'transactions'}
          onPress={() => setExpandedSection(expandedSection === 'transactions' ? null : 'transactions')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'transactions' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <TransactionsTab
            visibleTransactions={visibleTransactions}
            selectedTransactionId={selectedTransactionId}
            onToggle={(id) => setSelectedTransactionId(selectedTransactionId === id ? null : id)}
          />
        </ActionStrip>

        {/* 4. Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© */}
        <ActionStrip
          icon="receipt-outline"
          title="Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ©"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ© Ø­Ø³Ø¨ Ø£ÙˆØ¶Ø§Ø¹ Ø§Ù„ØªÙˆØµÙŠÙ„ ÙˆØ§Ù„Ø§Ø³ØªÙ„Ø§Ù…
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="Ù£ Ø£ÙˆØ¶Ø§Ø¹ ØªØ´ØºÙŠÙ„" tone="default" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'modes'}
          onPress={() => setExpandedSection(expandedSection === 'modes' ? null : 'modes')}
          hideDivider={false}
          trailingAction={
            <Icon name={expandedSection === 'modes' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <ModesTab serviceModes={serviceModes} />
        </ActionStrip>

        {/* 5. ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø± */}
        <ActionStrip
          icon="receipt-outline"
          title="ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±"
          subtitle={
            <View style={{ alignItems: 'flex-end', gap: spacing[1], marginTop: 2 }}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {`${storeDeliveryPreview.totalFeeLabel} Ø±Ø³ÙˆÙ… Ù…Ø­ØµÙ„Ø© â€¢ ${storeDeliveryPreview.totalCompensationLabel} ØªØ¹ÙˆÙŠØ¶Ø§Øª`}
              </Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <Badge label="Ø³ÙŠØ§Ø³Ø© Ù†Ø´Ø·Ø©" tone="success" />
                <Text role="bodySm" tone="muted" style={{ fontSize: 11 }}>#ØªÙˆØµÙŠÙ„_Ø§Ù„Ù…ØªØ¬Ø±</Text>
              </View>
            </View>
          }
          expanded={expandedSection === 'courier'}
          onPress={() => setExpandedSection(expandedSection === 'courier' ? null : 'courier')}
          hideDivider={true}
          trailingAction={
            <Icon name={expandedSection === 'courier' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
          }
        >
          <CourierTab storeDeliveryPreview={storeDeliveryPreview} direction={direction} />
        </ActionStrip>
      </Box>
    </MobileScrollView>
  );
}

export default PartnerDshWalletBridgeView;
