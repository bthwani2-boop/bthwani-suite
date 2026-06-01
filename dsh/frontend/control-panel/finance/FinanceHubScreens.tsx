import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, Button } from '@bthwani/ui-kit';
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

import { getWltControlPanelFinancePreview } from '../../../../wlt/frontend/shared/finance/dshFinancePreview';

function FinanceSurfaceBoard({ surface, subGroup }: { surface: FinanceSurface; subGroup?: string }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState(FINANCE_ROWS[surface][0]?.id ?? '');
  const rows = React.useMemo(() => {
    const baseRows = FINANCE_ROWS[surface];
    const wltPreview = getWltControlPanelFinancePreview();

    if (!subGroup || subGroup === 'all') return baseRows;

    if (surface === 'overview') {
      if (subGroup === 'inflow') {
        return baseRows.filter((row) => {
          const rec = wltPreview.allRecords.find((r) => r.id === row.id);
          return rec?.tone === 'positive';
        });
      }
      if (subGroup === 'outflow') {
        return baseRows.filter((row) => {
          const rec = wltPreview.allRecords.find((r) => r.id === row.id);
          return rec?.tone === 'negative';
        });
      }
      if (subGroup === 'net') return baseRows;
    }

    if (surface === 'settlements') {
      if (subGroup === 'summary') return baseRows;
      if (subGroup === 'captains') return baseRows.filter((row) => row.owner.includes('كابتن') || row.owner.includes('CAP'));
      if (subGroup === 'partners') return baseRows.filter((row) => row.owner.includes('متجر') || row.owner.includes('شريك') || row.owner.includes('STORE'));
      if (subGroup === 'field') return baseRows.filter((row) => row.owner.includes('ميداني') || row.owner.includes('FLD'));
    }

    if (surface === 'cod-reconciliation') {
      if (subGroup === 'mismatch') return baseRows.filter((row) => row.risk === 'danger');
      if (subGroup === 'collected') return baseRows.filter((row) => row.status.includes('مكتمل') || row.status.includes('تم'));
      if (subGroup === 'pending') return baseRows.filter((row) => !row.status.includes('مكتمل') && !row.status.includes('تم'));
    }

    if (surface === 'refunds') {
      if (subGroup === 'disputes') return baseRows.filter((row) => row.id.includes('REF-302') || row.evidence.includes('نزاع') || row.evidence.includes('ادعاء'));
      if (subGroup === 'pending') return baseRows.filter((row) => row.status.includes('بانتظار'));
      if (subGroup === 'processed') return baseRows.filter((row) => row.status.includes('تمت') || row.status.includes('معالجة'));
      if (subGroup === 'rejected') return baseRows.filter((row) => row.status.includes('مرفوض'));
    }

    if (surface === 'captain-eligibility') {
      if (subGroup === 'eligible') return baseRows.filter((row) => row.risk === 'success');
      if (subGroup === 'blocked') return baseRows.filter((row) => row.risk === 'danger' || row.status.includes('محظور'));
      if (subGroup === 'needs-topup') return baseRows.filter((row) => row.risk === 'warning' || row.status.includes('غير مؤهل'));
    }

    if (surface === 'payouts') {
      if (subGroup === 'captain-payouts') return baseRows.filter((row) => row.owner.includes('كابتن') || row.owner.includes('CAP'));
      if (subGroup === 'partner-payouts') return baseRows.filter((row) => row.owner.includes('متجر') || row.owner.includes('شريك') || row.owner.includes('STORE'));
      if (subGroup === 'field-payouts') return baseRows.filter((row) => row.owner.includes('ميداني') || row.owner.includes('FLD'));
    }

    if (surface === 'ledger') {
      if (subGroup === 'trial-balance') return baseRows.filter((row) => row.owner.includes('ميزان') || row.id.includes('LED-602'));
      if (subGroup === 'journal') return baseRows.filter((row) => row.owner.includes('قيد') || row.id.includes('LED-601'));
      if (subGroup === 'audit-trail') return baseRows.filter((row) => row.id.includes('LED-603'));
      if (subGroup === 'invoices') return baseRows.filter((row) => row.id.includes('LED-604'));
      return baseRows;
    }

    if (surface === 'risk-audit') {
      if (subGroup === 'holds') return baseRows.filter((row) => row.id.includes('AUD-703') || row.id.includes('CF-002'));
      if (subGroup === 'suspicious') return baseRows.filter((row) => row.id.includes('AUD-701'));
      if (subGroup === 'audit-logs') return baseRows.filter((row) => row.id.includes('AUD-702') || row.status.includes('تحت'));
    }

    if (surface === 'captain-finance') {
      if (subGroup === 'cod-pending') return baseRows.filter((row) => row.id.includes('CF-001') || row.id.includes('WLT-COD'));
      if (subGroup === 'payouts') return baseRows.filter((row) => row.id.includes('CF-002') || row.id.includes('WLT-ERN'));
    }

    if (surface === 'store-delivery-finance') {
      if (subGroup === 'compensation') return baseRows.filter((row) => row.id.includes('SDF-002') || row.id.includes('WLT-SCC'));
      if (subGroup === 'retained-fees') return baseRows.filter((row) => row.id.includes('SDF-001') || row.id.includes('WLT-SDF'));
    }

    return baseRows;
  }, [surface, subGroup]);

  const [blockedAction, setBlockedAction] = React.useState<string | null>(null);
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
    } else {
      // For mutations like "اعتماد"، "إطلاق"، "أرشفة" we show a beautiful blocking state inside the inspector drawer instead of silent fail
      setBlockedAction(label);
    }
  };

  React.useEffect(() => {
    setSelectedId(rows[0]?.id ?? '');
    setBlockedAction(null);
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
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap', direction: 'rtl' }}>
            <WebControlPanelStatusTag label={resolveSurfaceLabel(surface)} tone="info" />
            <WebControlPanelStatusTag label={subGroup ? `الفلتر: ${subGroup}` : 'كل الصفوف'} tone="neutral" />
            <WebControlPanelStatusTag label={selectedRow?.owner ?? 'لا يوجد تحديد'} tone={selectedRow ? resolveRowTone(selectedRow) : 'neutral'} />
            <WebControlPanelStatusTag label={translateDshRuntimeBindingStatus('UI_PREVIEW_ONLY')} tone="warning" />
          </Box>

          {rows.length === 0 ? (
            <Box padding={6} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Text role="titleSm" tone="muted" style={{ fontWeight: '700', textAlign: 'center' }}>لا توجد سجلات حالية</Text>
              <Text role="bodySm" tone="soft" style={{ textAlign: 'center', lineHeight: 22 }}>
                لا توجد حركات أو مطالبات مالية مطابقة لهذا الفلتر المحدّد حالياً في بيئة المعاينة.
              </Text>
            </Box>
          ) : (
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
          )}
        </Box>
      }
      inspector={
        <WebControlPanelInspectorShell title={`تفاصيل ${selectedRow?.id ?? ''}`}>
          <Box gap={3}>
            {selectedRow ? (
              <Box gap={2} style={{ direction: 'rtl' }}>
                <Text role="bodySm" style={{ textAlign: 'right' }}><strong>الجهة المالكة:</strong> {selectedRow.owner}</Text>
                <Text role="bodySm" style={{ textAlign: 'right' }}><strong>القيمة المرجعية:</strong> {selectedRow.amount}</Text>
                <Text role="bodySm" style={{ textAlign: 'right' }}><strong>الحالة الحالية:</strong> {selectedRow.status}</Text>
                <Text role="bodySm" style={{ textAlign: 'right' }}><strong>الأدلة والبيانات:</strong> {selectedRow.evidence}</Text>
                <Text role="bodySm" style={{ textAlign: 'right' }}><strong>الإجراء القادم:</strong> {selectedRow.nextAction}</Text>
                <Text role="caption" tone="soft" style={{ textAlign: 'right', marginTop: 8 }}>
                  * العملة ريال يمني (YER). جميع العمليات هنا تتبع لعقد WLT المالي المعلق.
                </Text>
              </Box>
            ) : (
              <Text role="bodySm" tone="muted" style={{ textAlign: 'center' }}>الرجاء اختيار صف مالي لمعاينة تفاصيله.</Text>
            )}

            {blockedAction && selectedRow ? (
              <Box padding={3} background="dangerSurface" radiusToken="md" border borderTone="danger" gap={2} style={{ direction: 'rtl', marginTop: 12 }}>
                <Text role="bodyStrong" tone="danger" style={{ textAlign: 'right', fontWeight: '700' }}>[CONTRACT_TBD] الإجراء مقيّد</Text>
                <Text role="caption" tone="danger" style={{ textAlign: 'right', lineHeight: 18 }}>
                  الإجراء "{blockedAction}" للكيان {selectedRow.id} غير متاح في DSH حالياً.
                  الربط المالي الحقيقي مع WLT API مقفل تشغيلياً بانتظار تفعيل العقد المالي.
                </Text>
                <Button label="فهمت" size="sm" tone="ghost" onPress={() => setBlockedAction(null)} />
              </Box>
            ) : null}

            {selectedRow && (
              <WebControlPanelRecommendation
                title="توصية مالية"
                reason={`لماذا؟ ${selectedRow.recommendation} · ما الدليل؟ ${selectedRow.evidence}`}
                confidence={selectedRecommendation?.confidence ?? 'medium'}
                auditTag="wlt-finance-bridge"
                primaryAction={{ id: `${selectedRow.id}-rec-primary`, label: selectedRow.primaryActionLabel, onAction: () => handleAction(selectedRow.primaryActionLabel) }}
                secondaryAction={{ id: `${selectedRow.id}-rec-secondary`, label: selectedRow.secondaryActionLabel, onAction: () => handleAction(selectedRow.secondaryActionLabel) }}
              />
            )}

            {selectedRow && (
              <WebControlPanelActionCluster
                primary={{ id: 'finance-primary', label: selectedRow.primaryActionLabel, onAction: () => handleAction(selectedRow.primaryActionLabel) }}
                secondary={{ id: 'finance-secondary', label: selectedRow.secondaryActionLabel, onAction: () => handleAction(selectedRow.secondaryActionLabel) }}
              />
            )}
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
