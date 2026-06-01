import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelCompactPager,
  WebControlPanelDecisionRow,
  WebControlPanelDenseHeader,
  WebControlPanelInspectorShell,
  WebControlPanelQueue,
  WebControlPanelRecommendation,
  WebControlPanelStatusTag,
  WebControlPanelWorkbench,
} from '@bthwani/ui-kit/web';
import {
  dshFinanceControlPanelPreviewRows,
  type DshFinancePreviewRow,
  type DshFinancePreviewSurface,
} from '../../data';
import { translateDshRuntimeBindingStatus, type DshUnifiedRecommendation } from '../shared';

type FinanceSurface = DshFinancePreviewSurface;
type FinanceRow = DshFinancePreviewRow;

// WLT bridge — read-only preview. DSH consumes central preview rows for operational awareness only.
const FINANCE_ROWS = dshFinanceControlPanelPreviewRows;

function resolveSurfaceLabel(surface: FinanceSurface) {
  if (surface === 'overview') return 'النظرة العامة';
  if (surface === 'settlements') return 'التسويات';
  if (surface === 'cod-reconciliation') return 'مطابقة COD';
  if (surface === 'refunds') return 'الاستردادات';
  if (surface === 'captain-eligibility') return 'أهلية الكابتن';
  if (surface === 'payouts') return 'المدفوعات';
  if (surface === 'ledger') return 'دفتر الأستاذ';
  if (surface === 'captain-finance') return 'مالية الكباتن';
  if (surface === 'store-delivery-finance') return 'مالية توصيل المتجر';
  return 'المخاطر والتدقيق';
}

function resolveSurfaceDescription(surface: FinanceSurface) {
  if (surface === 'overview') return 'ملخص مالي مضغوط يوضح أهم الصفوف الحرجة والاستحقاقات الحالية (معاينة فقط — مملوكة لـ WLT). العملة: ر.ي';
  if (surface === 'settlements') return 'غرفة مراجعة واعتماد التسويات للشركاء والكباتن والميدانيين (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'cod-reconciliation') return 'مطابقة الدفع عند الاستلام — الفوارق النقدية والتحقيقات المفتوحة. الكابتن مسؤول عن COD كذمة حتى الإيداع (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'refunds') return 'صف الاستردادات والنزاعات وما يرتبط بها من مراجعات (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'captain-eligibility') return 'مراقبة الرصيد الضامن للكباتن — من مؤهل لاستقبال الطلبات ومن يحتاج شحن رصيد (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'payouts') return 'إطلاق المدفوعات ومراقبة التعارضات قبل التحويل (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'ledger') return 'القيود اليومية وميزان المراجعة في غرفة عمل واحدة (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'captain-finance') return 'مراقبة وتدقيق الحركات والذمم المالية الخاصة بكباتن بثواني (bthwani_captain_mode) حصراً (معاينة فقط — مملوكة لـ WLT).';
  if (surface === 'store-delivery-finance') return 'تدقيق عمولات ورسوم توصيل المتاجر (توصيل المتجر الداخلي - store_courier_mode) المنفصلة عن كباتن بثواني (معاينة فقط — مملوكة لـ WLT).';
  return 'مراقبة المخاطر المالية والتدقيق قبل إغلاق اليوم المالي (معاينة فقط — مملوكة لـ WLT).';
}

function resolveRowTone(row: FinanceRow) {
  if (row.risk === 'danger') return 'danger' as const;
  if (row.risk === 'warning') return 'warning' as const;
  return 'success' as const;
}

function resolveRisk(row: FinanceRow) {
  if (row.risk === 'danger') return 'danger' as const;
  if (row.risk === 'warning') return 'warning' as const;
  return 'neutral' as const;
}

function resolveFinanceRowSelection(rows: ReadonlyArray<FinanceRow>, selectedId: string) {
  return rows.find((row) => row.id === selectedId) ?? rows[0];
}

function toUnifiedRecommendation(surface: FinanceSurface, row: FinanceRow): DshUnifiedRecommendation {
  return {
    id: row.id,
    surface,
    severity: row.risk === 'danger' ? 'high' : row.risk === 'warning' ? 'medium' : 'low',
    confidence: row.risk === 'danger' ? 'high' : 'medium',
    affectedEntity: row.owner,
    reason: row.recommendation,
    evidence: row.evidence,
    nextAction: row.nextAction,
    owner: row.owner,
    expectedImpact: `تحسين الوضع المالي المرتبط بـ ${row.owner}`,
    primaryActionLabel: row.primaryActionLabel,
    secondaryActionLabel: row.secondaryActionLabel,
  };
}

function FinanceSurfaceBoard({ surface, subGroup }: { surface: FinanceSurface; subGroup?: string }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState(FINANCE_ROWS[surface][0]?.id ?? '');
  const rows = React.useMemo(() => {
    const baseRows = FINANCE_ROWS[surface];
    if (!subGroup || subGroup === 'all') return baseRows;
    if (surface === 'settlements') {
      if (subGroup === 'captains') return baseRows.filter((row) => row.owner.includes('الكباتن'));
      if (subGroup === 'partners') return baseRows.filter((row) => row.owner.includes('الشركاء'));
      if (subGroup === 'field') return baseRows.filter((row) => row.owner.includes('الميدانيين'));
    }
    if (surface === 'cod-reconciliation') {
      return baseRows.filter((row) => subGroup === 'mismatch' ? row.risk === 'danger' : row.risk !== 'danger');
    }
    if (surface === 'refunds') {
      if (subGroup === 'disputes') return baseRows.filter((row) => row.id === 'REF-302');
      return baseRows.filter((row) => subGroup === 'processed' ? row.status.includes('تحت') === false : true);
    }
    if (surface === 'captain-eligibility') {
      if (subGroup === 'eligible') return baseRows.filter((row) => row.risk === 'success');
      if (subGroup === 'blocked') return baseRows.filter((row) => row.risk === 'danger');
      if (subGroup === 'needs-topup') return baseRows.filter((row) => row.risk === 'warning');
    }
    if (surface === 'payouts') {
      if (subGroup === 'captain-payouts') return baseRows.filter((row) => row.owner.includes('الكباتن'));
      if (subGroup === 'partner-payouts') return baseRows.filter((row) => row.owner.includes('الشركاء'));
      if (subGroup === 'field-payouts') return baseRows.filter((row) => row.owner.includes('الميدانيين'));
    }
    if (surface === 'ledger') {
      if (subGroup === 'trial-balance') return baseRows.filter((row) => row.owner.includes('ميزان'));
      if (subGroup === 'journal') return baseRows.filter((row) => row.owner.includes('قيد'));
      if (subGroup === 'audit-trail') return baseRows.filter((row) => row.id === 'LED-603');
      if (subGroup === 'invoices') return baseRows.filter((row) => row.id === 'LED-604');
      return baseRows;
    }
    if (surface === 'risk-audit') {
      if (subGroup === 'holds') return baseRows.filter((row) => row.id === 'AUD-703');
      if (subGroup === 'suspicious') return baseRows.filter((row) => row.id === 'AUD-701');
      return baseRows.filter((row) => subGroup === 'audit-logs' ? row.status.includes('تحت') : row.risk === 'danger');
    }
    if (surface === 'captain-finance') {
      if (subGroup === 'cod-pending') return baseRows.filter((row) => row.id === 'CF-001');
      if (subGroup === 'payouts') return baseRows.filter((row) => row.id === 'CF-002');
    }
    if (surface === 'store-delivery-finance') {
      if (subGroup === 'compensation') return baseRows.filter((row) => row.id === 'SDF-002');
      if (subGroup === 'retained-fees') return baseRows.filter((row) => row.id === 'SDF-001');
    }
    return baseRows;
  }, [surface, subGroup]);

  const selectedRow = resolveFinanceRowSelection(rows, selectedId);
  const selectedRecommendation = selectedRow ? toUnifiedRecommendation(surface, selectedRow) : undefined;
  const criticalCount = rows.filter((row) => row.risk === 'danger').length;
  const warningCount = rows.filter((row) => row.risk === 'warning').length;

  const handleAction = (label: string) => {
    if (!selectedRow) return;
    if (label.includes('تسويات') || label.includes('التسويات')) {
      router.push('/finance?workspace=settlements');
    } else if (label.includes('القيود') || label.includes('القيد') || label.includes('ميزان') || label.includes('الميزان')) {
      router.push('/finance?workspace=ledger');
    } else if (label.includes('التدقيق') || label.includes('تدقيق') || label.includes('المخاطر')) {
      router.push('/finance?workspace=risk-audit');
    } else if (label.includes('الاسترداد') || label.includes('استرداد')) {
      router.push('/finance?workspace=refunds');
    } else if (label.includes('الأدلة') || label.includes('أدلة') || label.includes('الملف') || label.includes('مستند')) {
      alert(`[بوابة الأدلة المالية WLT - UI_PREVIEW_ONLY]: فتح مرجع الأدلة لـ ${selectedRow.id} فقط. لا يتم جلب أو مطابقة مستندات runtime من DSH.`);
    } else if (label.includes('تحقيق') || label.includes('التحقيق')) {
      alert(`[إدارة المخاطر WLT - UI_PREVIEW_ONLY]: هذا تصنيف مراجعة وتحقيق لـ ${selectedRow.id} فقط. لا يتم إرسال طلب runtime من DSH.`);
    } else {
      alert(`[إجراء مالي WLT - UI_PREVIEW_ONLY]: "${label}" للكيان ${selectedRow.id} يحتاج WLT/API لاحقًا. لا توجد حركة مالية منفذة من DSH.`);
    }
  };

  React.useEffect(() => {
    setSelectedId(rows[0]?.id ?? '');
  }, [rows, surface]);

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="المالية — ر.ي"
          title={`غرفة قيادة ${resolveSurfaceLabel(surface)}`}
          description={resolveSurfaceDescription(surface)}
          metrics={[
            { id: 'rows-count', label: 'الصفوف المعروضة', value: String(rows.length) },
            { id: 'critical-count', label: 'المخاطر الحرجة', value: String(criticalCount) },
            { id: 'warning-count', label: 'تحتاج متابعة', value: String(warningCount) },
          ]}
        />
      }
      main={
        <Box gap={3}>
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            <WebControlPanelStatusTag label={resolveSurfaceLabel(surface)} tone="info" />
            <WebControlPanelStatusTag label={subGroup ? `الفلتر: ${subGroup}` : 'كل الصفوف'} tone="neutral" />
            <WebControlPanelStatusTag label={selectedRow?.owner ?? 'لا يوجد تحديد'} tone={selectedRow ? resolveRowTone(selectedRow) : 'neutral'} />
            <WebControlPanelStatusTag label={translateDshRuntimeBindingStatus('UI_PREVIEW_ONLY')} tone="warning" />
          </Box>

          <WebControlPanelQueue
            title={`صف ${resolveSurfaceLabel(surface)}`}
            meta="كل صف مالي يحتفظ بقرار واحد واضح: مراجعة، اعتماد، أو فتح الأدلة قبل أي حركة لاحقة."
            pager={<WebControlPanelCompactPager page={1} totalPages={1} summaryLabel="المشهد الحالي" />}
          >
            {rows.slice(0, 6).map((row) => (
              <WebControlPanelDecisionRow
                key={row.id}
                entityId={row.id}
                entityLabel={`${row.owner} · ${row.amount}`}
                status={row.status}
                statusTone={resolveRowTone(row)}
                risk={resolveRisk(row)}
                recommendation={row.recommendation}
                reason={row.evidence}
                sla={`زمن الالتزام: ${row.sla} · الإجراء التالي: ${row.nextAction}`}
                primaryAction={{ id: `${row.id}-primary`, label: row.primaryActionLabel, onAction: () => setSelectedId(row.id) }}
                secondaryAction={{ id: `${row.id}-secondary`, label: row.secondaryActionLabel, onAction: () => setSelectedId(row.id) }}
                onInspect={() => setSelectedId(row.id)}
              />
            ))}
          </WebControlPanelQueue>
        </Box>
      }
      inspector={
        <WebControlPanelInspectorShell title={`تفاصيل ${selectedRow?.id ?? ''}`}>
          <Box gap={2}>
            <Text role="bodySm">المالك / الجهة: {selectedRow?.owner}</Text>
            <Text role="bodySm">القيمة (ر.ي): {selectedRow?.amount}</Text>
            <Text role="bodySm">الحالة: {selectedRow?.status}</Text>
            <Text role="bodySm">الدليل: {selectedRow?.evidence}</Text>
            <Text role="bodySm">الإجراء التالي: {selectedRow?.nextAction}</Text>

            <WebControlPanelRecommendation
              title="توصية مالية"
              reason={selectedRow ? `لماذا؟ ${selectedRow.recommendation} · ما الدليل؟ ${selectedRow.evidence}` : 'اختر صفًا.'}
              confidence={selectedRecommendation?.confidence ?? 'medium'}
              auditTag="wlt-finance-bridge"
              primaryAction={selectedRow ? { id: `${selectedRow.id}-rec-primary`, label: selectedRow.primaryActionLabel, onAction: () => handleAction(selectedRow.primaryActionLabel) } : undefined}
              secondaryAction={selectedRow ? { id: `${selectedRow.id}-rec-secondary`, label: selectedRow.secondaryActionLabel, onAction: () => handleAction(selectedRow.secondaryActionLabel) } : undefined}
            />

            <WebControlPanelActionCluster
              primary={{ id: 'finance-primary', label: selectedRow?.primaryActionLabel ?? 'مراجعة', onAction: () => selectedRow && handleAction(selectedRow.primaryActionLabel) }}
              secondary={{ id: 'finance-secondary', label: selectedRow?.secondaryActionLabel ?? 'فتح الأدلة', onAction: () => selectedRow && handleAction(selectedRow.secondaryActionLabel) }}
            />
          </Box>
        </WebControlPanelInspectorShell>
      }
    />
  );
}

export function ControlPanelDshFinanceScreen() {
  return <FinanceSurfaceBoard surface="overview" />;
}

export function ControlPanelDshSettlementScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="settlements" subGroup={subGroup} />;
}

export function ControlPanelDshCodReconciliationScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="cod-reconciliation" subGroup={subGroup} />;
}

export function ControlPanelDshRefundQueueScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="refunds" subGroup={subGroup} />;
}

export function ControlPanelDshCaptainEligibilityScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="captain-eligibility" subGroup={subGroup} />;
}

export function ControlPanelDshPayoutsScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="payouts" subGroup={subGroup} />;
}

export function ControlPanelDshRiskAuditScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="risk-audit" subGroup={subGroup} />;
}

export function ControlPanelDshCaptainFinanceScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="captain-finance" subGroup={subGroup} />;
}

export function ControlPanelDshStoreDeliveryFinanceScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="store-delivery-finance" subGroup={subGroup} />;
}

export default ControlPanelDshFinanceScreen;
