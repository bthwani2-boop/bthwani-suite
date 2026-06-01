'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { getAdaptedFinanceControlPanelRows } from '../adapters/dshFinanceFixture.adapter';
import { buildWltAuditPackPreview } from '../models/auditPack.types';
import { WLT_MAKER_CHECKER_STATE_LABELS } from '../models/makerChecker.types';
import { getWltCloseGateSubledgers } from '../models/subledger.types';

export function AuditCloseScreen(_: { hubHref: string; subGroup?: string; technicalAuditMode: boolean }) {
  const businessDate = new Date().toISOString().split('T')[0]!;

  const rows = React.useMemo(() => {
    const s = getAdaptedFinanceControlPanelRows();
    return [...s.overview, ...s['cod-reconciliation'], ...s.settlements];
  }, []);

  const auditPack = React.useMemo(() =>
    buildWltAuditPackPreview({
      businessDate,
      expectedTotalMinorUnits: rows.reduce((s, r) => s + r.expectedMinorUnits, 0),
      actualTotalMinorUnits: rows.reduce((s, r) => s + r.actualMinorUnits, 0),
      entries: rows.map((r) => ({
        id: r.id,
        evidenceStatus: r.evidenceStatus,
        workflowState: r.workflowState,
        varianceMinorUnits: r.varianceMinorUnits,
        evidenceSource: r.expectedSource,
        bankDepositRef: r.bankDepositRef,
        cashBagRef: r.cashBagRef,
      })),
    }),
    [rows, businessDate],
  );

  const closeGateSubledgers = React.useMemo(() => getWltCloseGateSubledgers(), []);
  const isReadyForClose = auditPack.status === 'reviewed' || auditPack.status === 'approved';

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={1}>
        <Text role="titleMd" style={{ fontWeight: 700 }}>التدقيق والإغلاق اليومي</Text>
        <Text role="bodySm" tone="soft">
          حزمة التدقيق المالي اليومي — نتيجة من المركز المالي + كشوف الحسابات + دورات التسوية.
          الإغلاق الفعلي يُنفّذه WLT runtime فقط.
        </Text>
      </Box>

      {/* Audit Pack Status */}
      <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={2}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text role="titleSm" style={{ fontWeight: 700 }}>حزمة الإغلاق · {auditPack.closingRunId}</Text>
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
            { label: 'الإجمالي المتوقع', value: auditPack.expectedTotalMinorUnits.toLocaleString() + ' وصغ', ok: true },
            { label: 'الإجمالي الفعلي', value: auditPack.actualTotalMinorUnits.toLocaleString() + ' وصغ', ok: true },
            { label: 'الفارق', value: auditPack.varianceTotalMinorUnits.toLocaleString() + ' وصغ', ok: auditPack.varianceTotalMinorUnits === 0 },
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
        <Text role="titleSm" style={{ fontWeight: 700 }}>دفاتر الأستاذ المساعدة — شروط الإغلاق</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {closeGateSubledgers.map((sub) => (
            <Box key={sub.id} padding={2.5} background="surfaceInset" radiusToken="md" border borderTone="line" gap={1}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="labelSm" style={{ fontWeight: 700 }}>{sub.label}</Text>
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
          <Text role="titleSm" style={{ fontWeight: 700, color: 'var(--bth-danger-text)' }}>
            استثناءات تمنع الإغلاق ({auditPack.exceptions.length})
          </Text>
          {auditPack.exceptions.map((ex) => (
            <div key={ex.entryId} style={{ padding: '8px 12px', background: 'var(--bth-danger-surface)', border: '1px solid var(--bth-danger-border)', borderRadius: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <code style={{ fontSize: 10, fontWeight: 700 }}>{ex.entryId}</code>
                <span style={{ fontSize: 11, marginRight: 8, color: 'var(--bth-danger-text)' }}>{ex.reason}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--bth-danger-text)', color: '#ffffff' }}>
                {ex.severity === 'blocking' ? 'حاجب' : 'تحذير'}
              </span>
            </div>
          ))}
        </Box>
      )}

      {/* Maker-Checker status */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleSm" style={{ fontWeight: 700 }}>مسار Maker-Checker</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {auditPack.approvals.slice(0, 5).map((ap) => (
            <div key={ap.entryId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bthwani-control-panel-surface)', borderRadius: 6, border: '1px solid var(--bthwani-control-panel-border)' }}>
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

      <Box padding={3} background="warningSurface" radiusToken="md" gap={1} style={{ direction: 'rtl' }}>
        <Text role="bodyStrong" style={{ fontWeight: 700 }}>CONTRACT_SCAFFOLD_PREVIEW_ONLY</Text>
        <Text role="bodySm" tone="soft">
          لا يُنفَّذ ترحيل فعلي من هذه الشاشة. WLT runtime يُصدر التوقيع الفعلي ويُنفّذ القيود عند اكتمال جميع الشروط.
        </Text>
      </Box>
    </Box>
  );
}
