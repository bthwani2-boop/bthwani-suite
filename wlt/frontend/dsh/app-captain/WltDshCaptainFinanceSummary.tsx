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
  radius,
} from '@bthwani/ui-kit';
import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinanceSummaryRecord,
} from '../control-panel/financeContracts';
import { useWltDshCaptainFinanceSummary } from './useWltDshCaptainFinanceSummary';

function RecordRow({ record }: { record: WltDshFinanceSummaryRecord }) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const amountTone = record.tone === 'positive' ? 'success'
    : record.tone === 'negative' ? 'danger'
    : 'info';

  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const alignSide = direction === 'rtl' ? 'flex-end' : 'flex-start';
  const oppositeAlignSide = direction === 'rtl' ? 'flex-start' : 'flex-end';
  const oppositeTextAlign = direction === 'rtl' ? 'left' : 'right';

  return (
    <Box gap={2} paddingY={2} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
      <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: spacing[3] }}>
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
          <Badge label={record.statusLabel} tone={record.statusTone === 'error' ? 'danger' : record.statusTone} />
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
  records?: readonly WltDshFinanceSummaryRecord[];
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
    { id: 'card' as const, label: 'بطاقة ائتمانية' },
    { id: 'karimi' as const, label: 'بنك الكريمي' },
    { id: 'one_cash' as const, label: 'ONE كاش' },
    { id: 'saba' as const, label: 'سباكاش' },
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
    <Box gap={3} paddingY={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        أهلية استقبال الطلبات
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'الرصيد الضامن الحالي', value: snapshot.eligibilityBalanceLabel, tone: snapshot.isEligible ? 'success' : 'warning' },
          { label: 'الحد الأدنى المطلوب', value: snapshot.minimumEligibilityLabel, tone: 'info' },
          { label: 'الحالة', value: snapshot.isEligible ? 'مؤهل لاستقبال الطلبات' : 'غير مؤهل — رصيد غير كافٍ', tone: snapshot.isEligible ? 'success' : 'warning' },
          ...(snapshot.eligibilityShortfallMinorUnits > 0 ? [{ label: 'المبلغ المطلوب للتأهل', value: snapshot.eligibilityShortfallLabel, tone: 'warning' as const }] : []),
        ]}
      />

      {snapshot.eligibilityShortfallMinorUnits > 0 && !showTopUpForm && !success ? (
        <Box
          gap={1}
          style={{
            paddingVertical: spacing[2],
            paddingHorizontal: spacing[3],
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

      {success && (
        <StateView
          kind="success"
          title="تم شحن الرصيد بنجاح!"
          description="تم تحديث الرصيد الضامن الخاص بك وأصبحت جاهزاً للعمل."
        />
      )}

      {showTopUpForm ? (
        <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: radius.sm2, borderWidth: 1, borderColor: theme.line }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>إجراء شحن رصيد الضامن</Text>

          <TextField
            label="مبلغ الشحن (ر.ي)"
            value={topUpAmountText}
            onChangeText={setTopUpAmountText}
            placeholder="أدخل مبلغ الشحن..."
            keyboardType="numeric"
            style={{ textAlign: 'right' }}
          />

          <Box gap={1}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>وسيلة الشحن</Text>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {paymentMethods.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMethod(m.id)}
                  style={{
                    paddingHorizontal: spacing[3],
                    paddingVertical: 6,
                    borderRadius: radius.xs2,
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

          <Box layoutDirection="row" gap={2} style={{ flexDirection: 'row-reverse', marginTop: spacing[2] }}>
            <Button
              label="تأكيد عملية الشحن"
              tone="primary"
              loading={loading}
              disabled={loading || !topUpAmountText}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={handleConfirmTopUp}
            />
            <Button
              label="إلغاء"
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
          <Box gap={2} paddingY={1}>
            <Button
              label={snapshot.eligibilityShortfallMinorUnits > 0
                ? `اشحن ${snapshot.eligibilityShortfallLabel} للتأهل`
                : 'شحن رصيد إضافي'}
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
        <Box gap={2} style={{ marginTop: spacing[2] }}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>سجل عمليات الشحن الأخيرة</Text>
          {records.map((r) => <RecordRow key={r.id} record={r} />)}
        </Box>
      )}
    </Box>
  );
}

function CodLiabilitySection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinanceSummaryRecord[] }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingY={2}>
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
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[3],
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

function EarningsSection({ snapshot, records }: { snapshot: WltCaptainFinanceSnapshot; records: readonly WltDshFinanceSummaryRecord[] }) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  return (
    <Box gap={3} paddingY={2}>
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
    <Box gap={3} paddingY={2}>
      <Text role="label" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
        التسوية والدورة المالية
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'أرباح معلقة للتسوية', value: snapshot.pendingPayoutLabel, tone: snapshot.pendingPayoutMinorUnits > 0 ? 'warning' : 'default' },
          { label: 'مبلغ التسوية المدفوع', value: snapshot.settlementLabel, tone: 'success' },
          { label: 'الدورة', value: snapshot.cycleLabel, tone: 'default' as const },
        ]}
      />

      {success && (
        <StateView
          kind="success"
          title="تم طلب التسوية بنجاح!"
          description="تم إرسال طلب الصرف وجاري تحويل أرباحك إلى حسابك البنكي المعتمد."
        />
      )}

      {snapshot.pendingPayoutMinorUnits > 0 ? (
        !success && (
          <Box gap={2} paddingY={1}>
            <Button
              label={`طلب تسوية المستحقات (${snapshot.pendingPayoutLabel})`}
              tone="primary"
              loading={loading}
              disabled={loading}
              fullWidth
              onPress={handleRequestSettlement}
            />
            <Text role="caption" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              سيتم معالجة الطلب وصرف الأرباح لحسابك البنكي مباشرة.
            </Text>
          </Box>
        )
      ) : (
        !success && (
          <Box
            gap={1}
            style={{
              paddingVertical: spacing[2],
              paddingHorizontal: spacing[3],
              borderRightWidth: isRtl ? 4 : 0,
              borderLeftWidth: isRtl ? 0 : 4,
              borderRightColor: isRtl ? theme.success : undefined,
              borderLeftColor: isRtl ? undefined : theme.success,
            }}
          >
            <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>لا يوجد مستحقات معلقة</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              تم تسوية وصرف جميع الأرباح المحتسبة للأسبوع الحالي.
            </Text>
          </Box>
        )
      )}

      <Box
        gap={1}
        style={{
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[3],
          borderRightWidth: isRtl ? 4 : 0,
          borderLeftWidth: isRtl ? 0 : 4,
          borderRightColor: isRtl ? theme.brand : undefined,
          borderLeftColor: isRtl ? undefined : theme.brand,
          marginTop: spacing[1],
        }}
      >
        <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>ذمة COD والتسوية</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
          يجب مطابقة وإيداع جميع ذمم COD المستحقة لتجنب تعليق الدورة المالية القادمة.
        </Text>
      </Box>
    </Box>
  );
}

export type WltDshCaptainFinanceSummaryProps = {
  section?: WltCaptainFinanceSection;
  onBack?: () => void;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
};

export function WltDshCaptainFinanceSummary({
  section = 'eligibility',
  onBack,
  dshAuthBearerToken,
  dshClientId,
}: WltDshCaptainFinanceSummaryProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const {
    snapshot,
    allRecords,
    topUp,
    requestSettlement,
    resetFinance,
  } = useWltDshCaptainFinanceSummary(section, dshClientId, dshAuthBearerToken);

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
            <EligibilitySection
              snapshot={snapshot}
              records={allRecords.filter((r) => r.kind === 'captain-eligibility-topup')}
              onTopUp={topUp}
            />
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
            <SettlementSection
              snapshot={snapshot}
              onRequestSettlement={requestSettlement}
            />
          </ActionStrip>

          {/* Developer Reset Section */}
          <Box padding={4} style={{ marginTop: spacing[6], paddingHorizontal: spacing[4] }}>
            <Button
              label="إعادة تعيين بيانات المعاينة"
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

export default WltDshCaptainFinanceSummary;
