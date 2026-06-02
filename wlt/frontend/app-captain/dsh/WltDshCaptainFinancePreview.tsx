'use client';

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
} from '../../control-panel/dsh/financeContracts';
import { useWltDshCaptainFinancePreview } from './useWltDshCaptainFinancePreview';

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
    </Surface>
  );
}

function EligibilitySection({ snapshot }: { snapshot: WltCaptainFinanceSnapshot }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
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
        <StateView
          kind="warning"
          title="غير مؤهل لاستقبال الطلبات"
          description={snapshot.eligibilityBlockReason}
        />
      ) : null}
      <Surface tone="inset" padding={3} gap={2}>
        <Button
          label={snapshot.hasEligibilityBlock
            ? `اشحن ${snapshot.eligibilityShortfallLabel} للتأهل`
            : 'شحن رصيد إضافي'}
          tone={snapshot.hasEligibilityBlock ? 'primary' : 'ghost'}
          fullWidth
          onPress={() => {}}
        />
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
          يتطلب ربط مالي لتفعيل الشحن الفعلي.
        </Text>
      </Surface>
    </Surface>
  );
}

function CodLiabilitySection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinancePreviewRecord[] }) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
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
      <StateView
        kind="warning"
        title="إيداع COD مطلوب"
        description="المبلغ المحصّل ذمة مستحقة على الكابتن حتى يتم الإيداع والمطابقة."
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
          { label: 'دورة الأرباح', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'موعد الدفع', value: snapshot.cycleLabel, tone: 'info' as const },
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
          { label: 'الدورة', value: snapshot.cycleLabel, tone: 'default' as const },
          { label: 'الإجراء التالي', value: 'إيداع COD + مراجعة الأرباح قبل الإغلاق', tone: 'info' as const },
        ]}
      />
      <StateView
        kind="info"
        title="التسوية يتطلب اكتمال الإيداع"
        description="يجب إيداع جميع ذمم COD قبل إغلاق دورة التسوية وصرف المستحقات."
      />
    </Surface>
  );
}

export type WltDshCaptainFinancePreviewProps = {
  section?: WltCaptainFinanceSection;
  onBack?: () => void;
};

const SECTION_LABELS: Record<WltCaptainFinanceSection, string> = {
  eligibility: 'الأهلية والشحن',
  'cod-liability': 'ذمة COD',
  earnings: 'الأرباح',
  settlement: 'التسوية',
};

export function WltDshCaptainFinancePreview({
  section = 'eligibility',
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
        title="مالية الكابتن"
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

      <Surface tone="raised" padding={3} gap={2}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          القسم الحالي
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
          {availableSections.map((s) => (
            <Button
              key={s}
              label={SECTION_LABELS[s]}
              tone={activeSection === s ? 'primary' : 'ghost'}
              size="sm"
              fullWidth={false}
              onPress={() => setActiveSection(s)}
            />
          ))}
        </View>
      </Surface>

      {activeSection === 'eligibility' && <EligibilitySection snapshot={snapshot} />}
      {activeSection === 'cod-liability' && <CodLiabilitySection snapshot={snapshot} records={records} />}
      {activeSection === 'earnings' && <EarningsSection snapshot={snapshot} records={records} />}
      {activeSection === 'settlement' && <SettlementSection snapshot={snapshot} />}
    </MobileScrollView>
  );
}

export default WltDshCaptainFinancePreview;
