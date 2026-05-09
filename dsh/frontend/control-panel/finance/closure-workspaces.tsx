import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
  WebControlPanelWorkspaceTabs,
} from '@bthwani/ui-kit/web';
import { WebControlSurfaceHeader } from '@bthwani/ui-kit/web';
import type { DshUnifiedRecommendation } from '../shared';

type FinanceSurface = 'overview' | 'settlements' | 'cod-reconciliation' | 'refunds' | 'payouts' | 'ledger' | 'risk-audit';

type FinanceRow = {
  id: string;
  amount: string;
  owner: string;
  status: string;
  risk: 'danger' | 'warning' | 'success';
  evidence: string;
  nextAction: string;
  recommendation: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  sla: string;
};

const FINANCE_TABS: ReadonlyArray<{ id: FinanceSurface; label: string }> = [
  { id: 'overview', label: 'النظرة العامة' },
  { id: 'settlements', label: 'التسويات' },
  { id: 'cod-reconciliation', label: 'مطابقة COD' },
  { id: 'refunds', label: 'الاستردادات' },
  { id: 'payouts', label: 'المدفوعات' },
  { id: 'ledger', label: 'دفتر الأستاذ' },
  { id: 'risk-audit', label: 'المخاطر والتدقيق' },
];

const SUB_TABS: Record<FinanceSurface, ReadonlyArray<{ id: string; label: string }>> = {
  overview: [
    { id: 'all', label: 'الكل' },
    { id: 'cash', label: 'النقد' },
    { id: 'risk', label: 'المخاطر' },
  ],
  settlements: [
    { id: 'partners', label: 'الشركاء' },
    { id: 'captains', label: 'الكباتن' },
  ],
  'cod-reconciliation': [
    { id: 'pending', label: 'قيد المطابقة' },
    { id: 'mismatch', label: 'فوارق' },
  ],
  refunds: [
    { id: 'pending', label: 'قيد الانتظار' },
    { id: 'processed', label: 'المعالجة' },
  ],
  payouts: [
    { id: 'partner-payouts', label: 'مستحقات الشركاء' },
    { id: 'captain-payouts', label: 'مستحقات الكباتن' },
  ],
  ledger: [
    { id: 'journal', label: 'القيود اليومية' },
    { id: 'trial-balance', label: 'ميزان المراجعة' },
  ],
  'risk-audit': [
    { id: 'risk', label: 'مخاطر' },
    { id: 'audit', label: 'تدقيق' },
  ],
};

const FINANCE_ROWS: Record<FinanceSurface, ReadonlyArray<FinanceRow>> = {
  overview: [
    { id: 'FIN-001', amount: '١٢٥٬٠٠٠ ر.س', owner: 'مالية العمليات', status: 'مراجعة', risk: 'warning', evidence: 'مطابقة جزئية بين الكشوف', nextAction: 'افتح التسويات', recommendation: 'أغلق التسويات العالقة أولًا', primaryActionLabel: 'فتح التسويات', secondaryActionLabel: 'فتح الأدلة', sla: 'خلال ٢٤ ساعة' },
    { id: 'FIN-002', amount: '٣٤٬٨٠٠ ر.س', owner: 'إدارة المخاطر', status: 'سليم', risk: 'success', evidence: 'لا توجد فوارق', nextAction: 'ابقِ المراقبة نشطة', recommendation: 'لا حاجة للتدخل الآن', primaryActionLabel: 'عرض القيود', secondaryActionLabel: 'فتح التدقيق', sla: 'مباشر' },
  ],
  settlements: [
    { id: 'SET-101', amount: '٤٬٥٠٠ ر.س', owner: 'تسويات الكباتن', status: 'جاهز للصرف', risk: 'success', evidence: 'مطابقة كاملة', nextAction: 'نفّذ التحويل', recommendation: 'اعتمد التسوية ونفّذ التحويل الآن', primaryActionLabel: 'اعتماد', secondaryActionLabel: 'فتح الأدلة', sla: 'خلال ٢٤ ساعة' },
    { id: 'SET-102', amount: '١٢٬٣٠٠ ر.س', owner: 'تسويات الشركاء', status: 'معلّق', risk: 'warning', evidence: 'فارق في الإجمالي', nextAction: 'راجع الفوارق', recommendation: 'لا تصرف قبل حل الفارق', primaryActionLabel: 'مراجعة', secondaryActionLabel: 'إيقاف مؤقت', sla: 'متأخر ٦ ساعات' },
  ],
  'cod-reconciliation': [
    { id: 'COD-201', amount: '١٬٢٠٠ ر.س', owner: 'كابتن فهد', status: 'مكتمل', risk: 'success', evidence: 'تطابق الإيداع', nextAction: 'أرشفة القيد', recommendation: 'أغلق القيد بعد الأرشفة', primaryActionLabel: 'أرشفة', secondaryActionLabel: 'فتح السجل', sla: 'مباشر' },
    { id: 'COD-202', amount: '٨٥٠ ر.س', owner: 'كابتن عمر', status: 'فارق نقدي', risk: 'danger', evidence: 'عجز ١٥٠ ر.س', nextAction: 'افتح تحقيقًا ماليًا', recommendation: 'استخرج سبب العجز قبل الإغلاق', primaryActionLabel: 'فتح التحقيق', secondaryActionLabel: 'فتح الأدلة', sla: 'عاجل' },
  ],
  refunds: [
    { id: 'REF-301', amount: '٣٤٠ ر.س', owner: 'استرداد طلب ٨٨٢١', status: 'بانتظار التأكيد', risk: 'warning', evidence: 'استلام المنتج موثق', nextAction: 'أعد المبلغ للمحفظة', recommendation: 'نفّذ الاسترداد بعد المراجعة', primaryActionLabel: 'إرجاع للمحفظة', secondaryActionLabel: 'فتح الطلب', sla: 'خلال ١٢ ساعة' },
    { id: 'REF-302', amount: '٢٬١٠٠ ر.س', owner: 'نزاع مالي ٩٠١٢', status: 'تحت التدقيق', risk: 'danger', evidence: 'ادعاء بعدم استلام', nextAction: 'تواصل مع الشريك', recommendation: 'أغلق النزاع فقط بعد التحقق', primaryActionLabel: 'تواصل', secondaryActionLabel: 'فتح التدقيق', sla: 'عاجل' },
  ],
  payouts: [
    { id: 'PAY-401', amount: '٨٬٧٠٠ ر.س', owner: 'مستحقات الشركاء', status: 'مجدولة', risk: 'success', evidence: 'ملف الإحالة جاهز', nextAction: 'أطلق الدفعة', recommendation: 'أطلق مستحقات الشركاء المعتمدة', primaryActionLabel: 'إطلاق', secondaryActionLabel: 'فتح الملف', sla: 'خلال ٢٤ ساعة' },
    { id: 'PAY-402', amount: '٥٬١٠٠ ر.س', owner: 'مستحقات الكباتن', status: 'تحتاج مراجعة', risk: 'warning', evidence: 'تعارض في رقم الحساب', nextAction: 'طابق الحسابات', recommendation: 'لا تنفّذ قبل إصلاح الحساب', primaryActionLabel: 'مراجعة الحساب', secondaryActionLabel: 'إيقاف مؤقت', sla: 'خلال ٨ ساعات' },
  ],
  ledger: [
    { id: 'LED-501', amount: '٤٥٬٠٠٠ ر.س', owner: 'قيد يومي', status: 'مغلق', risk: 'success', evidence: 'ميزان متوازن', nextAction: 'أرشفة القيد', recommendation: 'القيد سليم ويمكن أرشفته', primaryActionLabel: 'أرشفة', secondaryActionLabel: 'فتح الميزان', sla: 'مباشر' },
    { id: 'LED-502', amount: '١٩٬٨٠٠ ر.س', owner: 'ميزان المراجعة', status: 'مفتوح', risk: 'warning', evidence: 'تفاوت بسيط', nextAction: 'راجع فرق الميزان', recommendation: 'أغلق الفرق قبل نهاية اليوم', primaryActionLabel: 'مراجعة', secondaryActionLabel: 'فتح التفاصيل', sla: 'خلال ٤ ساعات' },
  ],
  'risk-audit': [
    { id: 'AUD-601', amount: '١٥٬٠٠٠ ر.س', owner: 'شريك X', status: 'اشتباه مرتفع', risk: 'danger', evidence: 'نمط سحب غير معتاد', nextAction: 'أوقف التسويات مؤقتًا', recommendation: 'احمِ النقد حتى يكتمل التحقيق', primaryActionLabel: 'إيقاف', secondaryActionLabel: 'فتح التحقيق', sla: 'فوري' },
    { id: 'AUD-602', amount: '٨٬٤٠٠ ر.س', owner: 'سجل تدقيق', status: 'تحت المراجعة', risk: 'warning', evidence: 'لا يوجد إغلاق كامل', nextAction: 'أكمل الإثبات', recommendation: 'لا ترفع الحالة قبل اكتمال الأدلة', primaryActionLabel: 'أكمال الأدلة', secondaryActionLabel: 'فتح السجل', sla: 'خلال ١٢ ساعة' },
  ],
};

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
  const [selectedId, setSelectedId] = React.useState(FINANCE_ROWS[surface][0]?.id ?? '');
  const rows = React.useMemo(() => {
    const baseRows = FINANCE_ROWS[surface];

    if (!subGroup || subGroup === 'all') {
      return baseRows;
    }

    if (surface === 'settlements') {
      return baseRows.filter((row) => subGroup === 'partners' ? row.owner.includes('الشركاء') : row.owner.includes('الكباتن'));
    }

    if (surface === 'cod-reconciliation') {
      return baseRows.filter((row) => subGroup === 'mismatch' ? row.risk === 'danger' : row.risk !== 'danger');
    }

    if (surface === 'refunds') {
      return baseRows.filter((row) => subGroup === 'processed' ? row.status.includes('تحت') === false : true);
    }

    if (surface === 'payouts') {
      return baseRows.filter((row) => subGroup === 'captain-payouts' ? row.owner.includes('الكباتن') : row.owner.includes('الشركاء'));
    }

    if (surface === 'ledger') {
      return baseRows.filter((row) => subGroup === 'trial-balance' ? row.owner.includes('ميزان') : row.owner.includes('قيد'));
    }

    if (surface === 'risk-audit') {
      return baseRows.filter((row) => subGroup === 'audit' ? row.status.includes('تحت') : row.risk === 'danger');
    }

    return baseRows;
  }, [surface, subGroup]);
  const selectedRow = rows.find((row) => row.id === selectedId) ?? rows[0];

  React.useEffect(() => {
    setSelectedId(rows[0]?.id ?? '');
  }, [surface]);

  return (
    <Box gap={3}>
      <div style={{ display: 'grid', gap: '8px' }}>
        {rows.map((row) => (
          <WebControlPanelDecisionRow
            key={row.id}
            entityId={row.id}
            entityLabel={`${row.owner} · ${row.amount}`}
            status={row.status}
            statusTone={row.risk === 'danger' ? 'danger' : row.risk === 'warning' ? 'warning' : 'success'}
            risk={row.risk === 'danger' ? 'danger' : row.risk === 'warning' ? 'warning' : 'neutral'}
            recommendation={row.recommendation}
            reason={row.evidence}
            sla={`SLA ${row.sla} · الإجراء التالي ${row.nextAction}`}
            primaryAction={{ id: `${row.id}-primary`, label: row.primaryActionLabel, onAction: () => setSelectedId(row.id) }}
            secondaryAction={{ id: `${row.id}-secondary`, label: row.secondaryActionLabel, onAction: () => setSelectedId(row.id) }}
            onInspect={() => setSelectedId(row.id)}
          />
        ))}
      </div>

      <WebControlPanelInspectorShell title={`تفاصيل ${selectedRow?.id ?? ''}`}>
        <Box gap={2}>
          <Text role="bodySm">المالك: {selectedRow?.owner}</Text>
          <Text role="bodySm">القيمة: {selectedRow?.amount}</Text>
          <Text role="bodySm">الحالة: {selectedRow?.status}</Text>
          <Text role="bodySm">الدليل: {selectedRow?.evidence}</Text>
          <Text role="bodySm">الإجراء التالي: {selectedRow?.nextAction}</Text>
          <WebControlPanelRecommendation
            title="توصية مالية"
            reason={selectedRow ? `لماذا؟ ${selectedRow.recommendation} · ما الدليل؟ ${selectedRow.evidence}` : 'اختر صفًا.'}
            confidence={selectedRow?.risk === 'danger' ? 'high' : 'medium'}
            auditTag={selectedRow?.owner ?? 'finance'}
            primaryAction={selectedRow ? { id: `${selectedRow.id}-a`, label: selectedRow.primaryActionLabel } : undefined}
            secondaryAction={selectedRow ? { id: `${selectedRow.id}-b`, label: selectedRow.secondaryActionLabel } : undefined}
          />
          <WebControlPanelActionCluster
            primary={{ id: 'approve', label: 'تنفيذ الآن' }}
            secondary={{ id: 'evidence', label: 'فتح الأدلة' }}
          />
        </Box>
      </WebControlPanelInspectorShell>
    </Box>
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

export function ControlPanelDshRiskAuditScreen({ subGroup }: { subGroup?: string }) {
  return <FinanceSurfaceBoard surface="risk-audit" subGroup={subGroup} />;
}

export default ControlPanelDshFinanceScreen;
