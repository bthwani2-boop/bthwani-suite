'use client';

import React from 'react';
import { View, Pressable } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
  useTheme,
  useDirection,
  spacing,
  ActionStrip,
  TextField,
} from '@bthwani/ui-kit';
import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinancePreviewRecord,
} from '../control-panel/financeContracts';
import { useWltDshCaptainFinancePreview } from './useWltDshCaptainFinancePreview';

function RecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'error'
    : 'info';

  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const alignSide = direction === 'rtl' ? 'flex-end' : 'flex-start';
  const oppositeAlignSide = direction === 'rtl' ? 'flex-start' : 'flex-end';
  const oppositeTextAlign = direction === 'rtl' ? 'left' : 'right';

  return (
    <Box gap={2} paddingVertical={2} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
      <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 3, alignItems: alignSide }}>
          <Text role="bodyStrong" style={{ textAlign }} numberOfLines={1}>
            {record.title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign }} numberOfLines={1}>
            {record.subtitle}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign }}>
            {record.timeLabel}
          </Text>
          {record.holdReason ? (
            <Text role="caption" tone="warning" style={{ textAlign }}>
              {record.holdReason}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: oppositeAlignSide, gap: 5, flexShrink: 0 }}>
          <Text role="bodyStrong" tone={amountTone} style={{ textAlign: oppositeTextAlign }}>
            {record.amountLabel}
          </Text>
          <Badge label={record.statusLabel} tone={record.statusTone} />
        </View>
      </View>
    </Box>
  );
}

function EligibilitySection({
  snapshot,
  records = [],
  onTopUp,
}: {
  snapshot: WltCaptainFinanceSnapshot;
  records?: readonly WltDshFinancePreviewRecord[];
  onTopUp: (amountMinorUnits: number) => Promise<any>;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  const [showTopUpForm, setShowTopUpForm] = React.useState(false);
  const [topUpAmountText, setTopUpAmountText] = React.useState(
    snapshot.eligibilityShortfallMinorUnits > 0
      ? String(snapshot.eligibilityShortfallMinorUnits / 100)
      : '2000'
  );
  const [selectedMethod, setSelectedMethod] = React.useState<'card' | 'karimi' | 'one_cash' | 'saba'>('card');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const paymentMethods = [
    { id: 'card' as const, label: 'Ø¨Ø·Ø§Ù‚Ø© Ø§Ø¦ØªÙ…Ø§Ù†ÙŠØ©' },
    { id: 'karimi' as const, label: 'Ø¨Ù†Ùƒ Ø§Ù„ÙƒØ±ÙŠÙ…ÙŠ' },
    { id: 'one_cash' as const, label: 'ONE ÙƒØ§Ø´' },
    { id: 'saba' as const, label: 'Ø³Ø¨Ø§ÙƒØ§Ø´' },
  ];

  const handleConfirmTopUp = async () => {
    const amountVal = parseFloat(topUpAmountText);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setLoading(true);
    // Simulate gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      await onTopUp(amountVal * 100);
      setSuccess(true);
      setShowTopUpForm(false);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        Ø£Ù‡Ù„ÙŠØ© Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù† Ø§Ù„Ø­Ø§Ù„ÙŠ', value: snapshot.eligibilityBalanceLabel, tone: snapshot.isEligible ? 'success' : 'warning' },
          { label: 'Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨', value: snapshot.minimumEligibilityLabel, tone: 'info' },
          { label: 'Ø§Ù„Ø­Ø§Ù„Ø©', value: snapshot.isEligible ? 'Ù…Ø¤Ù‡Ù„ Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª' : 'ØºÙŠØ± Ù…Ø¤Ù‡Ù„ â€” Ø±ØµÙŠØ¯ ØºÙŠØ± ÙƒØ§ÙÙ', tone: snapshot.isEligible ? 'success' : 'warning' },
          ...(snapshot.eligibilityShortfallMinorUnits > 0 ? [{ label: 'Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ Ù„Ù„ØªØ£Ù‡Ù„', value: snapshot.eligibilityShortfallLabel, tone: 'warning' as const }] : []),
        ]}
      />

      {snapshot.eligibilityShortfallMinorUnits > 0 && !showTopUpForm && !success ? (
        <Box
          gap={1}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRightWidth: isRtl ? 4 : 0,
            borderLeftWidth: isRtl ? 0 : 4,
            borderRightColor: isRtl ? theme.warning : undefined,
            borderLeftColor: isRtl ? undefined : theme.warning,
          }}
        >
          <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>ØºÙŠØ± Ù…Ø¤Ù‡Ù„ Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
            {snapshot.eligibilityBlockReason}
          </Text>
        </Box>
      ) : null}

      {success && (
        <StateView
          kind="success"
          title="ØªÙ… Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯ Ø¨Ù†Ø¬Ø§Ø­!"
          description="ØªÙ… ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù† Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ ÙˆØ£ØµØ¨Ø­Øª Ø¬Ø§Ù‡Ø²Ø§Ù‹ Ù„Ù„Ø¹Ù…Ù„."
        />
      )}

      {showTopUpForm ? (
        <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 12, borderWidth: 1, borderColor: theme.line }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>Ø¥Ø¬Ø±Ø§Ø¡ Ø´Ø­Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù†</Text>

          <TextField
            label="Ù…Ø¨Ù„Øº Ø§Ù„Ø´Ø­Ù† (Ø±.ÙŠ)"
            value={topUpAmountText}
            onChangeText={setTopUpAmountText}
            placeholder="Ø£Ø¯Ø®Ù„ Ù…Ø¨Ù„Øº Ø§Ù„Ø´Ø­Ù†..."
            keyboardType="numeric"
            style={{ textAlign: 'right' }}
          />

          <Box gap={1}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>ÙˆØ³ÙŠÙ„Ø© Ø§Ù„Ø´Ø­Ù†</Text>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {paymentMethods.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMethod(m.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: selectedMethod === m.id ? theme.brand : theme.surfaceInset,
                    borderWidth: 1,
                    borderColor: selectedMethod === m.id ? theme.brand : theme.line,
                  }}
                >
                  <Text role="bodySm" style={{ color: selectedMethod === m.id ? theme.brandContrast : theme.text }}>
                    {m.label}
                  </Text>
                </Pressable>
              ))}
            </Box>
          </Box>

          <Box layoutDirection="row" gap={2} style={{ flexDirection: 'row-reverse', marginTop: 8 }}>
            <Button
              label="ØªØ£ÙƒÙŠØ¯ Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø´Ø­Ù†"
              tone="primary"
              loading={loading}
              disabled={loading || !topUpAmountText}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={handleConfirmTopUp}
            />
            <Button
              label="Ø¥Ù„ØºØ§Ø¡"
              tone="secondary"
              disabled={loading}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setShowTopUpForm(false)}
            />
          </Box>
        </Surface>
      ) : (
        !success && (
          <Box gap={2} paddingVertical={1}>
            <Button
              label={snapshot.eligibilityShortfallMinorUnits > 0
                ? `Ø§Ø´Ø­Ù† ${snapshot.eligibilityShortfallLabel} Ù„Ù„ØªØ£Ù‡Ù„`
                : 'Ø´Ø­Ù† Ø±ØµÙŠØ¯ Ø¥Ø¶Ø§ÙÙŠ'}
              tone={snapshot.eligibilityShortfallMinorUnits > 0 ? 'primary' : 'ghost'}
              fullWidth
              onPress={() => {
                setTopUpAmountText(
                  snapshot.eligibilityShortfallMinorUnits > 0
                    ? String(snapshot.eligibilityShortfallMinorUnits / 100)
                    : '2000'
                );
                setShowTopUpForm(true);
              }}
            />
          </Box>
        )
      )}

      {records.length > 0 && (
        <Box gap={2} style={{ marginTop: 8 }}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>Ø³Ø¬Ù„ Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø´Ø­Ù† Ø§Ù„Ø£Ø®ÙŠØ±Ø©</Text>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      )}
    </Box>
  );
}

function CodLiabilitySection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinancePreviewRecord[] }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        ØªØ­ØµÙŠÙ„ Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… â€” Ø°Ù…Ø© Ù…Ø³ØªØ­Ù‚Ø©
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø­ØµÙ‘Ù„ â€” Ø°Ù…Ø© Ù‚Ø§Ø¦Ù…Ø©', value: snapshot.codLiabilityLabel, tone: 'warning' },
          { label: 'Ø§Ù„Ø¥ÙŠØ¯Ø§Ø¹ Ø§Ù„Ù…Ø¹Ù„Ù‘Ù‚', value: snapshot.settlementLabel, tone: 'warning' },
          { label: 'Ø¯ÙˆØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠØ©', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ù„ØªØ§Ù„ÙŠ', value: 'Ø¥ÙŠØ¯Ø§Ø¹ Ø§Ù„Ù…Ø¨Ù„Øº Ø¨Ø§Ù„Ø¨Ù†Ùƒ Ù‚Ø¨Ù„ Ù…ÙˆØ¹Ø¯ Ø§Ù„ØªØ³ÙˆÙŠØ©', tone: 'info' as const },
        ]}
      />
      {records.length > 0 ? (
        <Box gap={2}>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      ) : null}
      <Box
        gap={1}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRightWidth: isRtl ? 4 : 0,
          borderLeftWidth: isRtl ? 0 : 4,
          borderRightColor: isRtl ? theme.warning : undefined,
          borderLeftColor: isRtl ? undefined : theme.warning,
        }}
      >
        <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>Ø¥ÙŠØ¯Ø§Ø¹ COD Ù…Ø·Ù„ÙˆØ¨</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø­ØµÙ‘Ù„ Ø°Ù…Ø© Ù…Ø³ØªØ­Ù‚Ø© Ø¹Ù„Ù‰ Ø§Ù„ÙƒØ§Ø¨ØªÙ† Ø­ØªÙ‰ ÙŠØªÙ… Ø§Ù„Ø¥ÙŠØ¯Ø§Ø¹ ÙˆØ§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø©.
        </Text>
      </Box>
    </Box>
  );
}

function EarningsSection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinancePreviewRecord[] }) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ ÙˆØ§Ù„Ù…ÙƒØ§Ø³Ø¨ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ©
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­', value: snapshot.earningsLabel, tone: 'success' },
          { label: 'Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª Ø§Ù„Ù…ØªÙˆÙ‚Ø¹Ø©', value: snapshot.pendingPayoutLabel, tone: 'warning' },
          { label: 'Ø¯ÙˆØ±Ø© Ø§Ù„Ø£Ø±Ø¨Ø§Ø­', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø¯ÙØ¹', value: snapshot.cycleLabel, tone: 'info' as const },
        ]}
      />
      {records.length > 0 ? (
        <Box gap={2}>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      ) : null}
    </Box>
  );
}

function SettlementSection({
  snapshot,
  onRequestSettlement,
}: {
  snapshot: WltCaptainFinanceSnapshot;
  onRequestSettlement: () => Promise<any>;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleRequestSettlement = async () => {
    setLoading(true);
    // Simulate approval processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      await onRequestSettlement();
      setSuccess(true);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        Ø§Ù„ØªØ³ÙˆÙŠØ© ÙˆØ§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'Ø£Ø±Ø¨Ø§Ø­ Ù…Ø¹Ù„Ù‚Ø© Ù„Ù„ØªØ³ÙˆÙŠØ©', value: snapshot.pendingPayoutLabel, tone: snapshot.pendingPayoutMinorUnits > 0 ? 'warning' : 'default' },
          { label: 'Ù…Ø¨Ù„Øº Ø§Ù„ØªØ³ÙˆÙŠØ© Ø§Ù„Ù…Ø¯ÙÙˆØ¹', value: snapshot.settlementLabel, tone: 'success' },
          { label: 'Ø§Ù„Ø¯ÙˆØ±Ø©', value: snapshot.cycleLabel, tone: 'default' as const },
        ]}
      />

      {success && (
        <StateView
          kind="success"
          title="ØªÙ… Ø·Ù„Ø¨ Ø§Ù„ØªØ³ÙˆÙŠØ© Ø¨Ù†Ø¬Ø§Ø­!"
          description="ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨ Ø§Ù„ØµØ±Ù ÙˆØ¬Ø§Ø±ÙŠ ØªØ­ÙˆÙŠÙ„ Ø£Ø±Ø¨Ø§Ø­Ùƒ Ø¥Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ø¨Ù†ÙƒÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯."
        />
      )}

      {snapshot.pendingPayoutMinorUnits > 0 ? (
        !success && (
          <Box gap={2} paddingVertical={1}>
            <Button
              label={`Ø·Ù„Ø¨ ØªØ³ÙˆÙŠØ© Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø§Øª (${snapshot.pendingPayoutLabel})`}
              tone="primary"
              loading={loading}
              disabled={loading}
              fullWidth
              onPress={handleRequestSettlement}
            />
            <Text role="caption" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              Ø³ÙŠØªÙ… Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø·Ù„Ø¨ ÙˆØµØ±Ù Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ Ù„Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ø¨Ù†ÙƒÙŠ Ù…Ø¨Ø§Ø´Ø±Ø©.
            </Text>
          </Box>
        )
      ) : (
        !success && (
          <Box
            gap={1}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRightWidth: isRtl ? 4 : 0,
              borderLeftWidth: isRtl ? 0 : 4,
              borderRightColor: isRtl ? theme.success : undefined,
              borderLeftColor: isRtl ? undefined : theme.success,
            }}
          >
            <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø³ØªØ­Ù‚Ø§Øª Ù…Ø¹Ù„Ù‚Ø©</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              ØªÙ… ØªØ³ÙˆÙŠØ© ÙˆØµØ±Ù Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ Ø§Ù„Ù…Ø­ØªØ³Ø¨Ø© Ù„Ù„Ø£Ø³Ø¨ÙˆØ¹ Ø§Ù„Ø­Ø§Ù„ÙŠ.
            </Text>
          </Box>
        )
      )}

      <Box
        gap={1}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRightWidth: isRtl ? 4 : 0,
          borderLeftWidth: isRtl ? 0 : 4,
          borderRightColor: isRtl ? theme.brand : undefined,
          borderLeftColor: isRtl ? undefined : theme.brand,
          marginTop: 4,
        }}
      >
        <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>Ø°Ù…Ø© COD ÙˆØ§Ù„ØªØ³ÙˆÙŠØ©</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          ÙŠØ¬Ø¨ Ù…Ø·Ø§Ø¨Ù‚Ø© ÙˆØ¥ÙŠØ¯Ø§Ø¹ Ø¬Ù…ÙŠØ¹ Ø°Ù…Ù… COD Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø© Ù„ØªØ¬Ù†Ø¨ ØªØ¹Ù„ÙŠÙ‚ Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©.
        </Text>
      </Box>
    </Box>
  );
}

export type WltDshCaptainFinancePreviewProps = {
  section?: WltCaptainFinanceSection;
  onBack?: () => void;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
};

export function WltDshCaptainFinancePreview({
  section = 'eligibility',
  onBack,
  dshAuthBearerToken,
  dshClientId,
}: WltDshCaptainFinancePreviewProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const {
    snapshot,
    allRecords,
    topUp,
    requestSettlement,
    resetFinance,
  } = useWltDshCaptainFinancePreview(section, dshClientId, dshAuthBearerToken);

  const [expandedSection, setExpandedSection] = React.useState<WltCaptainFinanceSection | null>('eligibility');

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="Ù…Ø§Ù„ÙŠØ© Ø§Ù„ÙƒØ§Ø¨ØªÙ†"
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box padding={0} gap={0}>
          {/* 1. Ø§Ù„Ø£Ù‡Ù„ÙŠØ© ÙˆØ§Ù„Ø´Ø­Ù† */}
          <ActionStrip
            icon="shield-checkmark-outline"
            title="Ø§Ù„Ø£Ù‡Ù„ÙŠØ© ÙˆØ§Ù„Ø´Ø­Ù†"
            subtitle={snapshot.isEligible ? `Ù…Ø¤Ù‡Ù„ Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Â· Ø§Ù„Ø±ØµÙŠØ¯: ${snapshot.eligibilityBalanceLabel}` : `ØºÙŠØ± Ù…Ø¤Ù‡Ù„ â€” Ø§Ù„Ø±ØµÙŠØ¯: ${snapshot.eligibilityBalanceLabel}`}
            expanded={expandedSection === 'eligibility'}
            onPress={() => setExpandedSection(expandedSection === 'eligibility' ? null : 'eligibility')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'eligibility' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <EligibilitySection
              snapshot={snapshot}
              records={allRecords.filter((r) => r.kind === 'captain-eligibility-topup')}
              onTopUp={topUp}
            />
          </ActionStrip>

          {/* 2. Ø°Ù…Ø© COD */}
          <ActionStrip
            icon="wallet-outline"
            title="Ø°Ù…Ø© COD"
            subtitle={`Ø§Ù„Ø°Ù…Ø© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©: ${snapshot.codLiabilityLabel}`}
            expanded={expandedSection === 'cod-liability'}
            onPress={() => setExpandedSection(expandedSection === 'cod-liability' ? null : 'cod-liability')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'cod-liability' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <CodLiabilitySection snapshot={snapshot} records={allRecords.filter((r) => r.kind === 'captain-cod-liability')} />
          </ActionStrip>

          {/* 3. Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ */}
          <ActionStrip
            icon="trending-up-outline"
            title="Ø§Ù„Ø£Ø±Ø¨Ø§Ø­"
            subtitle={`Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­: ${snapshot.earningsLabel}`}
            expanded={expandedSection === 'earnings'}
            onPress={() => setExpandedSection(expandedSection === 'earnings' ? null : 'earnings')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'earnings' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <EarningsSection snapshot={snapshot} records={allRecords.filter((r) => r.kind === 'captain-earning')} />
          </ActionStrip>

          {/* 4. Ø§Ù„ØªØ³ÙˆÙŠØ© */}
          <ActionStrip
            icon="sync-outline"
            title="Ø§Ù„ØªØ³ÙˆÙŠØ©"
            subtitle={`Ø¯ÙˆØ±Ø© Ø§Ù„ØªØ³ÙˆÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©: ${snapshot.cycleLabel} Â· Ø§Ù„Ù…Ø¨Ù„Øº: ${snapshot.settlementLabel}`}
            expanded={expandedSection === 'settlement'}
            onPress={() => setExpandedSection(expandedSection === 'settlement' ? null : 'settlement')}
            hideDivider={true}
            trailingAction={
              <Icon name={expandedSection === 'settlement' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <SettlementSection
              snapshot={snapshot}
              onRequestSettlement={requestSettlement}
            />
          </ActionStrip>

          {/* Developer Reset Section */}
          <Box padding={4} style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Button
              label="Ø¥Ø¹Ø§Ø¯Ø© ØªØ¹ÙŠÙŠÙ† Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø©"
              tone="ghost"
              size="sm"
              onPress={async () => {
                await resetFinance();
              }}
            />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default WltDshCaptainFinancePreview;
