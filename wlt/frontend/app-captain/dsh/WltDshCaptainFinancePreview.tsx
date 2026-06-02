'use client';

import React from 'react';
import { View } from 'react-native';
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
} from '@bthwani/ui-kit';
import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinancePreviewRecord,
} from '../../control-panel/dsh/financeContracts';
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

function EligibilitySection({ snapshot }: { snapshot: WltCaptainFinanceSnapshot }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        أهلية استقبال الطلبات
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'الرصيد الضامن الحالي', value: snapshot.eligibilityBalanceLabel, tone: snapshot.isEligible ? 'success' : 'warning' },
          { label: 'الحد الأدنى المطلوب', value: snapshot.minimumEligibilityLabel, tone: 'info' },
          { label: 'الحالة', value: snapshot.isEligible ? 'مؤهل لاستقبال الطلبات' : 'غير مؤهل — رصيد غير كافٍ', tone: snapshot.isEligible ? 'success' : 'warning' },
          ...(snapshot.hasEligibilityBlock ? [{ label: 'المبلغ المطلوب للتأهل', value: snapshot.eligibilityShortfallLabel, tone: 'warning' as const }] : []),
        ]}
      />
      {snapshot.hasEligibilityBlock ? (
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
          <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>غير مؤهل لاستقبال الطلبات</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
            {snapshot.eligibilityBlockReason}
          </Text>
        </Box>
      ) : null}
      <Box gap={2} paddingVertical={1}>
        <Button
          label={snapshot.hasEligibilityBlock
            ? `اشحن ${snapshot.eligibilityShortfallLabel} للتأهل`
            : 'شحن رصيد إضافي'}
          tone={snapshot.hasEligibilityBlock ? 'primary' : 'ghost'}
          fullWidth
          disabled
          onPress={() => {
            // Blocked: requires WLT runtime/API integration (CONTRACT_SCAFFOLD_PREVIEW_ONLY).
          }}
        />
        <Text role="caption" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          يتطلب ربط WLT runtime لتفعيل الشحن الفعلي — غير متاح في وضع المعاينة.
        </Text>
      </Box>
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
        تحصيل الدفع عند الاستلام — ذمة مستحقة
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'المبلغ المحصّل — ذمة قائمة', value: snapshot.codLiabilityLabel, tone: 'warning' },
          { label: 'الإيداع المعلّق', value: snapshot.settlementLabel, tone: 'warning' },
          { label: 'دورة التسوية', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'الإجراء التالي', value: 'إيداع المبلغ بالبنك قبل موعد التسوية', tone: 'info' as const },
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
        <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>إيداع COD مطلوب</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          المبلغ المحصّل ذمة مستحقة على الكابتن حتى يتم الإيداع والمطابقة.
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
        الأرباح والمكاسب التشغيلية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'إجمالي الأرباح', value: snapshot.earningsLabel, tone: 'success' },
          { label: 'المدفوعات المتوقعة', value: snapshot.pendingPayoutLabel, tone: 'warning' },
          { label: 'دورة الأرباح', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'موعد الدفع', value: snapshot.cycleLabel, tone: 'info' as const },
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

function SettlementSection({ snapshot }: { snapshot: WltCaptainFinanceSnapshot }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingVertical={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        التسوية والدورة المالية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'مبلغ التسوية', value: snapshot.settlementLabel, tone: 'info' },
          { label: 'الدورة', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'الإجراء التالي', value: 'إيداع COD + مراجعة الأرباح قبل الإغلاق', tone: 'info' as const },
        ]}
      />
      <Box
        gap={1}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRightWidth: isRtl ? 4 : 0,
          borderLeftWidth: isRtl ? 0 : 4,
          borderRightColor: isRtl ? theme.brand : undefined,
          borderLeftColor: isRtl ? undefined : theme.brand,
        }}
      >
        <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>التسوية يتطلب اكتمال الإيداع</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          يجب إيداع جميع ذمم COD قبل إغلاق دورة التسوية وصرف المستحقات.
        </Text>
      </Box>
    </Box>
  );
}

export type WltDshCaptainFinancePreviewProps = {
  section?: WltCaptainFinanceSection;
  onBack?: () => void;
};

export function WltDshCaptainFinancePreview({
  section = 'eligibility',
  onBack,
}: WltDshCaptainFinancePreviewProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const {
    snapshot,
    allRecords,
  } = useWltDshCaptainFinancePreview(section);

  const [expandedSection, setExpandedSection] = React.useState<WltCaptainFinanceSection | null>('eligibility');

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="مالية الكابتن"
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box padding={0} gap={0}>
          {/* 1. الأهلية والشحن */}
          <ActionStrip
            icon="shield-checkmark-outline"
            title="الأهلية والشحن"
            subtitle={snapshot.isEligible ? `مؤهل لاستقبال الطلبات · الرصيد: ${snapshot.eligibilityBalanceLabel}` : `غير مؤهل — الرصيد: ${snapshot.eligibilityBalanceLabel}`}
            expanded={expandedSection === 'eligibility'}
            onPress={() => setExpandedSection(expandedSection === 'eligibility' ? null : 'eligibility')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'eligibility' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <EligibilitySection snapshot={snapshot} />
          </ActionStrip>

          {/* 2. ذمة COD */}
          <ActionStrip
            icon="wallet-outline"
            title="ذمة COD"
            subtitle={`الذمة القائمة: ${snapshot.codLiabilityLabel}`}
            expanded={expandedSection === 'cod-liability'}
            onPress={() => setExpandedSection(expandedSection === 'cod-liability' ? null : 'cod-liability')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'cod-liability' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <CodLiabilitySection snapshot={snapshot} records={allRecords.filter((r) => r.kind === 'captain-cod-liability')} />
          </ActionStrip>

          {/* 3. الأرباح */}
          <ActionStrip
            icon="trending-up-outline"
            title="الأرباح"
            subtitle={`إجمالي الأرباح: ${snapshot.earningsLabel}`}
            expanded={expandedSection === 'earnings'}
            onPress={() => setExpandedSection(expandedSection === 'earnings' ? null : 'earnings')}
            hideDivider={false}
            trailingAction={
              <Icon name={expandedSection === 'earnings' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <EarningsSection snapshot={snapshot} records={allRecords.filter((r) => r.kind === 'captain-earning')} />
          </ActionStrip>

          {/* 4. التسوية */}
          <ActionStrip
            icon="sync-outline"
            title="التسوية"
            subtitle={`دورة التسوية الحالية: ${snapshot.cycleLabel} · المبلغ: ${snapshot.settlementLabel}`}
            expanded={expandedSection === 'settlement'}
            onPress={() => setExpandedSection(expandedSection === 'settlement' ? null : 'settlement')}
            hideDivider={true}
            trailingAction={
              <Icon name={expandedSection === 'settlement' ? 'chevron-up' : 'chevron-down'} tone="muted" size={18} />
            }
          >
            <SettlementSection snapshot={snapshot} />
          </ActionStrip>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default WltDshCaptainFinancePreview;
