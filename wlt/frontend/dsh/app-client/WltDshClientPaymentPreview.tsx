'use client';

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  KeyValueList,
  StateView,
  Surface,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  formatWltYer,
  getWltDshPaymentOptionsPreview,
  resolveWltDshPaymentPreviewState,
  type WltDshPaymentMethod,
} from '../control-panel/financeContracts';

function PaymentOptionCard({
  id,
  titleLabel,
  descriptionLabel,
  isSelected,
  isAvailable,
  availabilityLabel,
  availabilityTone,
  onSelect,
}: {
  id: WltDshPaymentMethod;
  titleLabel: string;
  descriptionLabel: string;
  isSelected: boolean;
  isAvailable: boolean;
  availabilityLabel: string;
  availabilityTone: 'success' | 'warning' | 'info' | 'danger';
  onSelect: (id: WltDshPaymentMethod) => void;
}) {
  const { theme } = useTheme();

  return (
    <Surface
      tone={isSelected ? 'raised' : 'default'}
      padding={3}
      gap={2}
      style={isSelected ? { borderWidth: 2, borderColor: theme.brand } : undefined}
    >
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>
            {titleLabel}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {descriptionLabel}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-start', gap: 6, flexShrink: 0 }}>
          <Badge label={availabilityLabel} tone={availabilityTone} />
          {!isSelected && (
            <Button
              label="Ø§Ø®ØªÙŠØ§Ø±"
              size="sm"
              tone={isAvailable ? 'primary' : 'ghost'}
              fullWidth={false}
              onPress={() => onSelect(id)}
            />
          )}
          {isSelected && (
            <Badge label="Ù…Ø­Ø¯Ø¯" tone="brand" />
          )}
        </View>
      </View>
    </Surface>
  );
}

function WalletBalancePanel({
  walletLinked,
  walletBalanceMinorUnits,
  heldMinorUnits = 0,
  pendingMinorUnits = 0,
}: {
  walletLinked: boolean;
  walletBalanceMinorUnits: number;
  heldMinorUnits?: number;
  pendingMinorUnits?: number;
}) {
  const items = walletLinked
    ? [
        { label: 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…ØªØ§Ø­', value: formatWltYer(walletBalanceMinorUnits), tone: walletBalanceMinorUnits > 0 ? 'success' : 'warning' as const },
        { label: 'Ù…Ø­Ø¬ÙˆØ²', value: heldMinorUnits > 0 ? formatWltYer(heldMinorUnits) : 'Ù„Ø§ ÙŠÙˆØ¬Ø¯', tone: heldMinorUnits > 0 ? 'warning' : 'default' as const },
        { label: 'Ù…Ø¹Ù„Ù‚', value: pendingMinorUnits > 0 ? formatWltYer(pendingMinorUnits) : 'Ù„Ø§ ÙŠÙˆØ¬Ø¯', tone: 'default' as const },
        { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: 'Ù…Ø±ØªØ¨Ø·Ø©', tone: 'success' as const },
      ]
    : [
        { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: 'ØºÙŠØ± Ù…Ø±ØªØ¨Ø·Ø©', tone: 'warning' as const },
      ];

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©
      </Text>
      <KeyValueList dense items={items} />
      {!walletLinked && (
        <StateView
          kind="warning"
          title="Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…Ø±ØªØ¨Ø·Ø©"
          description="Ø§Ø±Ø¨Ø· Ù…Ø­ÙØ¸ØªÙƒ Ù„ØªÙØ¹ÙŠÙ„ Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„Ø¯ÙØ¹ Ù…Ù† Ø§Ù„Ø±ØµÙŠØ¯."
        />
      )}
      {walletLinked && walletBalanceMinorUnits === 0 && (
        <StateView
          kind="warning"
          title="Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© ØµÙØ±"
          description="Ø§Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© Ù„ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¯ÙØ¹ Ù…Ù†Ù‡Ø§."
        />
      )}
    </Surface>
  );
}

function CheckoutSummaryPanel({
  orderTotalMinorUnits,
  walletAmountMinorUnits,
  codAmountMinorUnits,
  isSplitPayment,
  blockingLabel,
  summaryLabel,
  walletBalanceAfterMinorUnits,
}: {
  orderTotalMinorUnits: number;
  walletAmountMinorUnits: number;
  codAmountMinorUnits: number;
  isSplitPayment: boolean;
  blockingLabel?: string;
  summaryLabel: string;
  walletBalanceAfterMinorUnits: number;
}) {
  const items = [
    { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨', value: formatWltYer(orderTotalMinorUnits), tone: 'info' as const },
    ...(walletAmountMinorUnits > 0 ? [{ label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: formatWltYer(walletAmountMinorUnits), tone: 'success' as const }] : []),
    ...(codAmountMinorUnits > 0 ? [{ label: 'Ù†Ù‚Ø¯Ø§Ù‹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formatWltYer(codAmountMinorUnits), tone: 'brand' as const }] : []),
    ...(isSplitPayment ? [{ label: 'Ù†ÙˆØ¹ Ø§Ù„Ø¯ÙØ¹', value: 'Ù…Ø®ØªÙ„Ø· (Ù…Ø­ÙØ¸Ø© + ÙƒØ§Ø´)', tone: 'info' as const }] : []),
    ...(walletAmountMinorUnits > 0 ? [{ label: 'Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¨Ø¹Ø¯ Ø§Ù„Ø¯ÙØ¹', value: formatWltYer(walletBalanceAfterMinorUnits), tone: walletBalanceAfterMinorUnits >= 0 ? 'success' : 'danger' as const }] : []),
  ];

  return (
    <Surface tone="inset" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        Ù…Ù„Ø®Øµ Ø§Ù„Ø¯ÙØ¹
      </Text>
      <KeyValueList dense items={items} />
      {blockingLabel ? (
        <StateView
          kind="warning"
          title="ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡"
          description={blockingLabel}
        />
      ) : (
        <Surface tone="default" padding={2}>
          <Text role="bodySm" style={{ textAlign: 'right' }}>
            {summaryLabel}
          </Text>
        </Surface>
      )}
    </Surface>
  );
}

export type WltDshClientPaymentPreviewProps = {
  orderTotalMinorUnits?: number;
  walletBalanceMinorUnits?: number;
  walletLinked?: boolean;
  selectedMethod?: WltDshPaymentMethod;
  onSelectMethod?: (method: WltDshPaymentMethod) => void;
};

export function WltDshClientPaymentPreview({
  orderTotalMinorUnits = 0,
  walletBalanceMinorUnits = 0,
  walletLinked = false,
  selectedMethod = 'cod',
  onSelectMethod,
}: WltDshClientPaymentPreviewProps) {
  const [method, setMethod] = React.useState<WltDshPaymentMethod>(selectedMethod);
  const options = React.useMemo(() => getWltDshPaymentOptionsPreview(), []);

  const handleSelect = React.useCallback(
    (id: WltDshPaymentMethod) => {
      setMethod(id);
      onSelectMethod?.(id);
    },
    [onSelectMethod],
  );

  const previewState = React.useMemo(
    () => resolveWltDshPaymentPreviewState(method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked),
    [method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked],
  );

  const walletBalanceAfter = walletBalanceMinorUnits - previewState.walletAmountMinorUnits;
  const isSplit = previewState.walletAmountMinorUnits > 0 && previewState.amountDueOnDeliveryMinorUnits > 0;

  return (
    <Box gap={3}>
      <WalletBalancePanel
        walletLinked={walletLinked}
        walletBalanceMinorUnits={walletBalanceMinorUnits}
      />

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          Ø·Ø±Ù‚ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…ØªØ§Ø­Ø©
        </Text>
        <Box gap={2}>
          {options.map((opt) => (
            <PaymentOptionCard
              key={opt.id}
              id={opt.id}
              titleLabel={opt.titleLabel}
              descriptionLabel={opt.descriptionLabel}
              isSelected={method === opt.id}
              isAvailable={opt.isAvailable}
              availabilityLabel={opt.availabilityLabel}
              availabilityTone={opt.availabilityTone === 'error' ? 'danger' : opt.availabilityTone}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </Surface>

      <CheckoutSummaryPanel
        orderTotalMinorUnits={orderTotalMinorUnits}
        walletAmountMinorUnits={previewState.walletAmountMinorUnits}
        codAmountMinorUnits={previewState.amountDueOnDeliveryMinorUnits}
        isSplitPayment={isSplit}
        blockingLabel={previewState.blockingLabel}
        summaryLabel={previewState.summaryLabel}
        walletBalanceAfterMinorUnits={walletBalanceAfter}
      />
    </Box>
  );
}

export default WltDshClientPaymentPreview;
