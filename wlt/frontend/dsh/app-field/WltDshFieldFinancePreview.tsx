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
  spacing,
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
    <Box gap={2} paddingY={2} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[3] }}>
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
    <Box gap={3} paddingY={2}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        ملخص العمولات المالية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'عمولات معتمدة', value: snapshot.totalCommissionLabel, tone: 'success' },
          { label: 'عمولات معلقة', value: snapshot.pendingCommissionsLabel, tone: 'warning' },
          { label: 'عمولات مرفوضة', value: snapshot.rejectedCommissionsLabel, tone: 'error' },
          { label: 'المتاجر المؤهلة', value: String(snapshot.eligibleFilesCount), tone: 'default' as const },
          { label: 'آخر صرف', value: snapshot.lastPayoutLabel, tone: 'info' },
          { label: 'تاريخ آخر صرف', value: snapshot.lastPayoutDate, tone: 'default' as const },
          { label: 'موعد الصرف القادم', value: snapshot.nextPayoutDate, tone: 'default' as const },
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
        title="مالية الميداني"
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
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box padding={4} gap={4}>
          <CommissionSummary snapshot={snapshot} />

          {commissionRecords.length > 0 && (
            <Box gap={3} paddingY={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                عمولات الاستقطاب المعتمدة
              </Text>
              <Box gap={0}>
                {commissionRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          {pendingRecords.length > 0 && (
            <Box gap={3} paddingY={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                عمولات قيد المراجعة
              </Text>
              <Box gap={0}>
                {pendingRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
              <StateView
                kind="warning"
                title="في انتظار الاعتماد"
                description="هذه العمولات مرتبطة بمتاجر لم يكتمل اعتمادها بعد. ستُحتسب عند إتمام الاعتماد."
              />
            </Box>
          )}

          {rejectedRecords.length > 0 && (
            <Box gap={3} paddingY={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                عمولات مرفوضة / موقوفة
              </Text>
              <Box gap={0}>
                {rejectedRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          {payoutRecords.length > 0 && (
            <Box gap={3} paddingY={2}>
              <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
                سجل الصرف
              </Text>
              <Box gap={0}>
                {payoutRecords.map((r) => <RecordRow key={r.id} record={r} />)}
              </Box>
            </Box>
          )}

          <Divider />

          <Box gap={2} paddingY={2}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              الإجراءات المالية
            </Text>
            <StateView
              kind="info"
              title="الصرف يتطلب اكتمال الربط"
              description="يمكن متابعة حالة العمولات هنا. الصرف الفعلي يتم في موعد الدورة المالية."
            />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default WltDshFieldFinancePreview;
