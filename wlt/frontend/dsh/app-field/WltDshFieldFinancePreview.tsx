'use client';

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Text,
  TopBar,
  useTheme,
} from '@bthwani/ui-kit';
import type {
  WltDshFinancePreviewRecord,
  WltFieldFinanceSnapshot,
} from '../control-panel/financeContracts';
import { useWltDshFieldFinancePreview } from './useWltDshFieldFinancePreview';

function RecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const { theme } = useTheme();
  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'error'
    : 'info';

  return (
    <Box gap={2} paddingVertical={2} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>
            {record.title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
            {record.subtitle}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {record.timeLabel}
          </Text>
          {record.holdReason ? (
            <Text role="caption" tone="warning" style={{ textAlign: 'right' }}>
              {record.holdReason}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-start', gap: 5, flexShrink: 0 }}>
          <Text role="bodyStrong" tone={amountTone} style={{ textAlign: 'left' }}>
            {record.amountLabel}
          </Text>
          <Badge label={record.statusLabel} tone={record.statusTone} />
        </View>
      </View>
    </Box>
  );
}

function CommissionSummary({ snapshot }: { snapshot: WltFieldFinanceSnapshot }) {
  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        Ù…Ù„Ø®Øµ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'Ø¹Ù…ÙˆÙ„Ø§Øª Ù…Ø¹ØªÙ…Ø¯Ø©', value: snapshot.totalCommissionLabel, tone: 'success' },
          { label: 'Ø¹Ù…ÙˆÙ„Ø§Øª Ù…Ø¹Ù„Ù‚Ø©', value: snapshot.pendingCommissionsLabel, tone: 'warning' },
          { label: 'Ø¹Ù…ÙˆÙ„Ø§Øª Ù…Ø±ÙÙˆØ¶Ø©', value: snapshot.rejectedCommissionsLabel, tone: 'error' },
          { label: 'Ø§Ù„Ù…ØªØ§Ø¬Ø± Ø§Ù„Ù…Ø¤Ù‡Ù„Ø©', value: String(snapshot.eligibleFilesCount), tone: 'default' as const },
          { label: 'Ø¢Ø®Ø± ØµØ±Ù', value: snapshot.lastPayoutLabel, tone: 'info' },
          { label: 'ØªØ§Ø±ÙŠØ® Ø¢Ø®Ø± ØµØ±Ù', value: snapshot.lastPayoutDate, tone: 'default' as const },
          { label: 'Ù…ÙˆØ¹Ø¯ Ø§Ù„ØµØ±Ù Ø§Ù„Ù‚Ø§Ø¯Ù…', value: snapshot.nextPayoutDate, tone: 'default' as const },
        ]}
      />
    </Box>
  );
}

export type WltDshFieldFinancePreviewProps = {
  storeIds?: string[];
  onBack?: () => void;
};

export function WltDshFieldFinancePreview({
  storeIds,
  onBack,
}: WltDshFieldFinancePreviewProps) {
  const {
    snapshot,
    commissionRecords,
    pendingRecords,
    rejectedRecords,
    payoutRecords,
  } = useWltDshFieldFinancePreview(storeIds);

  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="Ù…Ø§Ù„ÙŠØ© Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠ"
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
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box padding={4} gap={4}>
          <CommissionSummary snapshot={snapshot} />

          {commissionRecords.length > 0 && (
            <Box gap={3} paddingVertical={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                Ø¹Ù…ÙˆÙ„Ø§Øª Ø§Ù„Ø§Ø³ØªÙ‚Ø·Ø§Ø¨ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©
              </Text>
              <Box gap={0}>
                {commissionRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          {pendingRecords.length > 0 && (
            <Box gap={3} paddingVertical={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                Ø¹Ù…ÙˆÙ„Ø§Øª Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©
              </Text>
              <Box gap={0}>
                {pendingRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
              <StateView
                kind="warning"
                title="ÙÙŠ Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯"
                description="Ù‡Ø°Ù‡ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ù…ØªØ§Ø¬Ø± Ù„Ù… ÙŠÙƒØªÙ…Ù„ Ø§Ø¹ØªÙ…Ø§Ø¯Ù‡Ø§ Ø¨Ø¹Ø¯. Ø³ØªÙØ­ØªØ³Ø¨ Ø¹Ù†Ø¯ Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯."
              />
            </Box>
          )}

          {rejectedRecords.length > 0 && (
            <Box gap={3} paddingVertical={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                Ø¹Ù…ÙˆÙ„Ø§Øª Ù…Ø±ÙÙˆØ¶Ø© / Ù…ÙˆÙ‚ÙˆÙØ©
              </Text>
              <Box gap={0}>
                {rejectedRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          {payoutRecords.length > 0 && (
            <Box gap={3} paddingVertical={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                Ø³Ø¬Ù„ Ø§Ù„ØµØ±Ù
              </Text>
              <Box gap={0}>
                {payoutRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          <Divider />

          <Box gap={2} paddingVertical={2}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©
            </Text>
            <StateView
              kind="info"
              title="Ø§Ù„ØµØ±Ù ÙŠØªØ·Ù„Ø¨ Ø§ÙƒØªÙ…Ø§Ù„ Ø§Ù„Ø±Ø¨Ø·"
              description="ÙŠÙ…ÙƒÙ† Ù…ØªØ§Ø¨Ø¹Ø© Ø­Ø§Ù„Ø© Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ù‡Ù†Ø§. Ø§Ù„ØµØ±Ù Ø§Ù„ÙØ¹Ù„ÙŠ ÙŠØªÙ… ÙÙŠ Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©."
            />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default WltDshFieldFinancePreview;
