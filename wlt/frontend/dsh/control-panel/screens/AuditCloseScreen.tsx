'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import { buildWltFinancialCenter } from '../../shared/read-models';
import { buildWltAuditPackPreview } from '../../shared/contracts';
import { WLT_MAKER_CHECKER_STATE_LABELS } from '../../shared/contracts';
import { getWltCloseGateSubledgers } from '../../shared/contracts';
import {
  buildWltRuntimeFinancialCenter,
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
} from '../../shared/adapters';
export function AuditCloseScreen(_props: { hubHref: string; subGroup?: string }) {
  const businessDate = new Date().toISOString().split('T')[0]!;
  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void loadWltDshFinanceRuntimeReadModel().then((result) => {
      if (!cancelled) setRuntimeFinance(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const center = React.useMemo(() => {
    if (runtimeFinance?.state === 'runtime') {
      return buildWltRuntimeFinancialCenter(businessDate, runtimeFinance.data);
    }
    return buildWltFinancialCenter(businessDate, []);
  }, [businessDate, runtimeFinance]);

  const auditEntries = React.useMemo(() => {
    const blockingVarianceByEntryId = new Map(
      center.blockingVariances.map((variance) => [variance.entryId, variance.varianceMinorUnits]),
    );

    return center.allEntries.map((entry) => ({
      id: entry.id,
      evidenceStatus: entry.status === 'blocked' ? 'missing' : entry.isPending ? 'partial' : 'complete',
      workflowState:
        entry.status === 'posted'
          ? 'approved'
          : entry.status === 'pending'
            ? 'checked'
            : entry.status === 'disputed'
              ? 'review_required'
              : 'blocked_wlt',
      varianceMinorUnits: blockingVarianceByEntryId.get(entry.id) ?? 0,
      evidenceSource: 'audit-entry',
      bankDepositRef: entry.sourceRef,
    })) as ReadonlyArray<{
      id: string;
      evidenceStatus: 'complete' | 'partial' | 'missing';
      workflowState: string;
      varianceMinorUnits: number;
      evidenceSource: string;
      bankDepositRef?: string;
      cashBagRef?: string;
    }>;
  }, [center]);

  const expectedTotalMinorUnits = React.useMemo(
    () => center.allEntries.reduce((sum, entry) => sum + entry.amountMinorUnits, 0),
    [center],
  );
  const blockingVarianceTotalMinorUnits = React.useMemo(
    () => center.blockingVariances.reduce((sum, variance) => sum + variance.varianceMinorUnits, 0),
    [center],
  );
  const actualTotalMinorUnits = expectedTotalMinorUnits - blockingVarianceTotalMinorUnits;

  const auditPack = React.useMemo(() =>
    buildWltAuditPackPreview({
      businessDate,
      expectedTotalMinorUnits,
      actualTotalMinorUnits,
      entries: auditEntries,
    }),
    [actualTotalMinorUnits, auditEntries, businessDate, expectedTotalMinorUnits],
  );

  const closeGateSubledgers = React.useMemo(() => getWltCloseGateSubledgers(), []);
  const isReadyForClose = auditPack.status === 'reviewed' || auditPack.status === 'approved';

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <div style={{ padding: '6px 12px', background: 'var(--bth-warning-surface)', border: '1px solid var(--bth-warning-border)', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--bth-warning-text)', fontWeight: '700' }}>
          {runtimeFinance?.state === 'runtime'
            ? `WLT runtime audit preparation · ${runtimeFinance.data.baseUrl} · ${runtimeFinance.data.closeStatus.status}`
            : `Fallback preview · ${runtimeFinance?.state === 'blocked' ? runtimeFinance.error : 'loading runtime'}`}
        </span>
      </div>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={1}>
        <Text role="titleMd" weight="bold">التدقيق والإغلاق اليومي</Text>
        <Text role="bodySm" tone="soft">
          حزمة التدقيق المالي اليومي — نتيجة من المركز المالي + كشوف الحسابات + دورات التسوية.
          الإغلاق الفعلي يُنفّذه WLT runtime فقط.
        </Text>
      </Box>

      {/* Audit Pack Status */}
      <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text role="titleSm" weight="bold">حزمة الإغلاق · {auditPack.closingRunId}</Text>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 5,
            color: isReadyForClose ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
            background: isReadyForClose ? 'var(--bth-success-surface)' : 'var(--bth-warning-surface)',
          }}>
            {auditPack.status === 'preparing' ? 'جار التحضير' :
             auditPack.status === 'ready_for_review' ? 'جاهز للمراجعة' : 'مراجعة مكتملة'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { label: 'الإجمالي المتوقع', value: auditPack.expectedTotalLabel, ok: true },
            { label: 'الإجمالي الفعلي', value: auditPack.actualTotalLabel, ok: true },
            { label: 'الفارق', value: auditPack.varianceTotalLabel, ok: auditPack.varianceTotalMinorUnits === 0 },
            { label: 'استثناءات', value: `${auditPack.exceptions.length} بند`, ok: auditPack.exceptions.length === 0 },
          ].map(({ label, value, ok }) => (
            <div key={label} style={{ padding: '10px 12px', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: 7, background: 'var(--bthwani-control-panel-surface)' }}>
              <div style={{ fontSize: 10, color: 'var(--bthwani-control-panel-text-muted)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: ok ? 'var(--bth-success-text)' : 'var(--bth-danger-text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </Box>

      {/* Close Gate Subledgers */}
      <Box gap={2}>
        <Text role="titleSm" weight="bold">دفاتر الأستاذ المساعدة — شروط الإغلاق</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {closeGateSubledgers.map((sub) => (
            <Box key={sub.id} padding={2} background="surfaceInset" radiusToken="md" border borderTone="line" gap={1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="label" weight="bold">{sub.label}</Text>
                <code style={{ fontSize: 9, background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 3 }}>{sub.controlAccountCode}</code>
              </div>
              <Text role="caption" tone="muted">{sub.description}</Text>
            </Box>
          ))}
        </div>
      </Box>

      {/* Exceptions */}
      {auditPack.exceptions.length > 0 && (
        <Box gap={2}>
          <Text role="titleSm" weight="bold" style={{ color: 'var(--bth-danger-text)' }}>
            استثناءات تمنع الإغلاق ({auditPack.exceptions.length})
          </Text>
          {auditPack.exceptions.map((ex) => (
            <div key={ex.entryId} style={{ padding: '8px 12px', background: 'var(--bth-danger-surface)', border: '1px solid var(--bth-danger-border)', borderRadius: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <code style={{ fontSize: 10, fontWeight: 700 }}>{ex.entryId}</code>
                <span style={{ fontSize: 11, marginRight: 8, color: 'var(--bth-danger-text)' }}>{ex.reason}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--bth-danger-text)', color: 'var(--bthwani-brand-contrast)' }}>
                {ex.severity === 'blocking' ? 'حاجب' : 'تحذير'}
              </span>
            </div>
          ))}
        </Box>
      )}

      {/* Maker-Checker status */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleSm" weight="bold">مسار Maker-Checker</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {auditPack.approvals.slice(0, 5).map((ap) => (
            <div key={ap.entryId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bthwani-control-panel-surface)', borderRadius: radius.xs, border: '1px solid var(--bthwani-control-panel-border)' }}>
              <code style={{ fontSize: 10 }}>{ap.entryId}</code>
              <span style={{ fontSize: 10, fontWeight: 700, color: ap.state === 'approved' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' }}>
                {WLT_MAKER_CHECKER_STATE_LABELS[ap.state as keyof typeof WLT_MAKER_CHECKER_STATE_LABELS] ?? ap.state}
              </span>
            </div>
          ))}
          {auditPack.approvals.length > 5 && (
            <Text role="caption" tone="muted">+ {auditPack.approvals.length - 5} بند آخر</Text>
          )}
        </div>
      </Box>

      <Box padding={3} background="surfaceInset" radiusToken="md" gap={1} style={{ direction: 'rtl' }}>
        <Text role="bodySm" tone="soft">
          لا يُنفَّذ ترحيل فعلي من هذه الشاشة. الإغلاق الفعلي يُنفّذ من محرك المحاسبة عند اكتمال جميع الشروط.
        </Text>
      </Box>
    </Box>
  );
}
