/**
 * WLT-owned field agent finance preview component.
 *
 * PREVIEW ONLY — no real commission payout, no real transfer, no API.
 * Composable: mount inside any field finance surface.
 * Contract state: CONTRACT_TBD — real finance flows blocked.
 */

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Icon,
  KeyValueList,
  MobileScrollView,
  StateView,
  Surface,
  Text,
  TopBar,
} from '@bthwani/ui-kit';
import {
  type WltDshFinancePreviewRecord,
  type WltFieldFinanceSnapshot,
} from '../../shared/finance/dshFinancePreview';
import { useWltDshFieldFinancePreview } from './useWltDshFieldFinancePreview';

const PREVIEW_NOTICE =
  'هذا عرض تجريبي فقط — لا يوجد صرف عمولة حقيقي ولا تحويل فعلي حتى يُرفع وضع CONTRACT_TBD.';

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

function CommissionSummary({ snapshot }: { snapshot: WltFieldFinanceSnapshot }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        ملخص العمولات المالية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'إجمالي العمولات', value: snapshot.totalCommissionLabel, tone: 'success' },
          { label: 'الملفات المؤهلة', value: String(snapshot.eligibleFilesCount) },
          { label: 'آخر صرف', value: snapshot.lastPayoutLabel, tone: 'info' },
          { label: 'تاريخ الصرف', value: snapshot.lastPayoutDate },
          { label: 'العقد', value: snapshot.contractState, tone: 'warning' },
        ]}
      />
    </Surface>
  );
}

function CommissionRecords({
  commissionRecords,
  payoutRecords,
}: {
  commissionRecords: readonly WltDshFinancePreviewRecord[];
  payoutRecords: readonly WltDshFinancePreviewRecord[];
}) {
  return (
    <>
      {commissionRecords.length > 0 && (
        <Surface tone="raised" padding={3} gap={3}>
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
            عمولات الاستقطاب
          </Text>
          <Box gap={2}>
            {commissionRecords.map((r) => <RecordRow key={r.id} record={r} />)}
          </Box>
        </Surface>
      )}

      {payoutRecords.length > 0 && (
        <Surface tone="raised" padding={3} gap={3}>
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
            سجل الصرف
          </Text>
          <Box gap={2}>
            {payoutRecords.map((r) => <RecordRow key={r.id} record={r} />)}
          </Box>
        </Surface>
      )}
    </>
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
    payoutRecords,
  } = useWltDshFieldFinancePreview(storeIds);

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 120 }}>
      <TopBar
        variant="secondary"
        title="مالية الميداني — WLT Preview"
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

      <CommissionSummary snapshot={snapshot} />

      <CommissionRecords commissionRecords={commissionRecords} payoutRecords={payoutRecords} />

      <Surface tone="inset" padding={3} gap={2}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          الإجراءات المالية للميداني
        </Text>
        <StateView
          kind="warning"
          title="الصرف والتحويل مقفلان — CONTRACT_TBD"
          description="لا يمكن تنفيذ صرف أو تحويل حتى يُربط الـ API المالي المعتمد."
        />
      </Surface>

      <PreviewBanner />
    </MobileScrollView>
  );
}

export default WltDshFieldFinancePreview;
