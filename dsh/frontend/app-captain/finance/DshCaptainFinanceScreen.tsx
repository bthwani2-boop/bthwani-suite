import React from 'react';
import { Box, Button, KeyValueList, MobileScrollView, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';
import { getDshCaptainFinancePreview } from '../../shared/finance/dshFinancePreviewModel';
import type { DshCaptainFinanceScreenState, DshCaptainFinanceSnapshot } from './dshCaptainFinanceModel';

export type DshCaptainFinanceScreenProps = {
  section?: 'cod-balance' | 'earnings' | 'settlement';
  state?: DshCaptainFinanceScreenState;
  snapshot?: DshCaptainFinanceSnapshot;
  onBack?: () => void;
  onRetry?: () => void;
};

const captainPreview = getDshCaptainFinancePreview();

const demoSnapshot: DshCaptainFinanceSnapshot = {
  codBalanceLabel: captainPreview.codBalanceLabel,
  earningsLabel: captainPreview.earningsLabel,
  settlementLabel: captainPreview.settlementLabel,
  pendingPayoutLabel: captainPreview.pendingPayoutLabel,
  cycleLabel: captainPreview.cycleLabel,
};

function CodBalanceSection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainFinanceSnapshot }) {
  return (
    <Surface tone="brand" gap={3}>
      <SectionHeader title="رصيد الدفع عند الاستلام" subtitle="راجع رصيد الدفع عند الاستلام والتسوية المعلّقة." />
      <KeyValueList
        items={[
          { label: 'المحصّل اليوم', value: snapshot.codBalanceLabel, tone: 'info' },
          { label: 'الإيداع المعلّق', value: snapshot.settlementLabel, tone: 'warning' },
          { label: 'الفارق', value: '0 ر.س', tone: 'success' },
        ]}
      />
    </Surface>
  );
}

function EarningsSection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainFinanceSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="الأرباح" subtitle="لقطة قصيرة للأرباح التشغيلية حتى لا يضيع السياق." />
      <KeyValueList
        items={[
          { label: 'إجمالي الأرباح', value: snapshot.earningsLabel, tone: 'brand' },
          { label: 'المدفوعات المتوقعة', value: snapshot.pendingPayoutLabel ?? 'أسبوعي' },
          { label: 'دورة الأرباح', value: snapshot.cycleLabel ?? 'الحالية' },
        ]}
      />
    </Surface>
  );
}

function SettlementSection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainFinanceSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="التسوية" subtitle="حافظ على التدفق النقدي واضحًا ومختصرًا." />
      <Text role="bodySm" tone="muted">
        {snapshot.settlementLabel} تحتاج متابعة قبل الإغلاق المالي النهائي.
      </Text>
    </Surface>
  );
}

function renderFinanceState(state: DshCaptainFinanceScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل المالية" description="يبقى الرصيد مرئيًا بمجرد توفر بيانات المسار." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد بيانات مالية" description="أعد التحميل عند وصول بيانات COD أو التسوية." actionLabel={onRetry ? 'إعادة التحميل' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'error') {
    return <StateView stateId="recoverableError" title="تعذر تحميل المالية" description="حاول مرة أخرى من دون مغادرة صفحة الكابتن المالية." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  return null;
}

export function DshCaptainFinanceScreen({
  section = 'cod-balance',
  state = 'ready',
  snapshot = demoSnapshot,
  onBack,
  onRetry,
}: DshCaptainFinanceScreenProps) {
  if (state !== 'ready') {
    return (
      <MobileScrollView padding={4} gap={4}>
        {renderFinanceState(state, onRetry)}
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">المالية</Text>
        <Text role="bodyMd" tone="muted">
          مالية الكابتن مختصرة إلى الرصيد والأرباح والتسوية.
        </Text>
      </Box>

      {section === 'cod-balance' ? <CodBalanceSection snapshot={snapshot} /> : null}
      {section === 'earnings' ? <EarningsSection snapshot={snapshot} /> : null}
      {section === 'settlement' ? <SettlementSection snapshot={snapshot} /> : null}

      {section === 'cod-balance' ? <EarningsSection snapshot={snapshot} /> : null}
      {section === 'cod-balance' ? <SettlementSection snapshot={snapshot} /> : null}

      <Button label="العودة" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}

export function DshCaptainCodBalanceScreen(props: Omit<DshCaptainFinanceScreenProps, 'section'> = {}) {
  return <DshCaptainFinanceScreen {...props} section="cod-balance" />;
}

export default DshCaptainFinanceScreen;
