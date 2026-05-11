/**
 * WLT-owned captain finance preview component.
 *
 * PREVIEW ONLY — no real COD settlement, no real payout, no API.
 * Composable: mount inside any captain finance surface.
 * Contract state: CONTRACT_TBD — real finance flows blocked.
 */

import React from 'react';
import { View } from 'react-native';
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
} from '@bthwani/ui-kit';
import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';
import { useWltDshCaptainFinancePreview } from './useWltDshCaptainFinancePreview';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي فقط — لا يوجد تسوية حقيقية ولا صرف فعلي حتى يُرفع وضع CONTRACT_TBD.';

function PreviewBanner() {
  return (
    <Surface tone="inset" padding={3}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10 }}>
        <Icon name="information-circle-outline" size={18} tone="muted" />
        <Text role="bodySm" tone="muted" style={{ flex: 1, textAlign: 'right', lineHeight: 20 }}>
          {PREVIEW_NOTICE}
        </Text>
      </View>
    </Surface>
  );
}

function RecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'error'
    : 'info';

  return (
    <Surface tone="raised" padding={3} gap={2}>
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
        </View>
        <View style={{ alignItems: 'flex-start', gap: 5, flexShrink: 0 }}>
          <Text role="bodyStrong" tone={amountTone} style={{ textAlign: 'left' }}>
            {record.amountLabel}
          </Text>
          <Badge label={record.statusLabel} tone={record.statusTone} />
        </View>
      </View>
    </Surface>
  );
}

function CodBalanceSection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinancePreviewRecord[] }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        رصيد الدفع عند الاستلام (COD)
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'المحصّل الحالي', value: snapshot.codBalanceLabel, tone: 'info' },
          { label: 'الإيداع المعلّق', value: snapshot.settlementLabel, tone: 'warning' },
          { label: 'دورة التسوية', value: snapshot.cycleLabel, tone: 'default' },
          { label: 'العقد', value: snapshot.contractState, tone: 'warning' },
        ]}
      />
      {records.length > 0 ? (
        <Box gap={2}>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      ) : null}
      <StateView
        kind="warning"
        title="تسوية COD مقفلة — CONTRACT_TBD"
        description="لا يمكن تحويل رصيد COD حتى يُربط الـ API المالي."
      />
    </Surface>
  );
}

function EarningsSection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinancePreviewRecord[] }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        الأرباح والمكاسب التشغيلية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'إجمالي الأرباح', value: snapshot.earningsLabel, tone: 'success' },
          { label: 'المدفوعات المتوقعة', value: snapshot.pendingPayoutLabel, tone: 'warning' },
          { label: 'دورة الأرباح', value: snapshot.cycleLabel },
          { label: 'العقد', value: snapshot.contractState, tone: 'warning' },
        ]}
      />
      {records.length > 0 ? (
        <Box gap={2}>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      ) : null}
    </Surface>
  );
}

function SettlementSection({ snapshot }: { snapshot: WltCaptainFinanceSnapshot }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        التسوية والدورة المالية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'مبلغ التسوية', value: snapshot.settlementLabel, tone: 'info' },
          { label: 'الدورة', value: snapshot.cycleLabel },
          { label: 'العقد', value: snapshot.contractState, tone: 'warning' },
        ]}
      />
      <StateView
        kind="warning"
        title="الإغلاق المالي مقفل — CONTRACT_TBD"
        description="تسوية الكابتن تتطلب API مالي لم يُعرَّف بعد."
      />
    </Surface>
  );
}

export type WltDshCaptainFinancePreviewProps = {
  section?: WltCaptainFinanceSection;
  onBack?: () => void;
};

export function WltDshCaptainFinancePreview({
  section = 'cod-balance',
  onBack,
}: WltDshCaptainFinancePreviewProps) {
  const {
    snapshot,
    records,
    activeSection,
    setActiveSection,
    availableSections,
  } = useWltDshCaptainFinancePreview(section);

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 120 }}>
      <TopBar
        variant="secondary"
        title="مالية الكابتن — WLT Preview"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <PreviewBanner />

      <Surface tone="raised" padding={3} gap={2}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          القسم الحالي
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
          {availableSections.map((s) => (
            <Button
              key={s}
              label={s === 'cod-balance' ? 'رصيد COD' : s === 'earnings' ? 'الأرباح' : 'التسوية'}
              tone={activeSection === s ? 'primary' : 'ghost'}
              size="sm"
              fullWidth={false}
              onPress={() => setActiveSection(s)}
            />
          ))}
        </View>
      </Surface>

      {activeSection === 'cod-balance' && <CodBalanceSection snapshot={snapshot} records={records} />}
      {activeSection === 'earnings' && <EarningsSection snapshot={snapshot} records={records} />}
      {activeSection === 'settlement' && <SettlementSection snapshot={snapshot} />}

      <PreviewBanner />
    </MobileScrollView>
  );
}

export default WltDshCaptainFinancePreview;
