'use client';

import React from 'react';
import { Box, Text, Button } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { getAdaptedFinanceControlPanelRows, type DshFinancePreviewRow } from '../../data/wallet.preview-data';

type DayLifecycleStage =
  | 'open'
  | 'expected-registered'
  | 'actual-registered'
  | 'reconciliation'
  | 'variances'
  | 'maker-review'
  | 'checker-approval'
  | 'day-close';

const LIFECYCLE_STAGES: ReadonlyArray<{ id: DayLifecycleStage; label: string }> = [
  { id: 'open', label: 'فتح اليوم' },
  { id: 'expected-registered', label: 'تسجيل Expected' },
  { id: 'actual-registered', label: 'تسجيل Actual' },
  { id: 'reconciliation', label: 'المطابقة' },
  { id: 'variances', label: 'الفوارق' },
  { id: 'maker-review', label: 'Maker' },
  { id: 'checker-approval', label: 'Checker' },
  { id: 'day-close', label: 'إغلاق اليوم' },
] as const;

function computeCurrentStage(rows: ReadonlyArray<DshFinancePreviewRow>): DayLifecycleStage {
  if (rows.length === 0) return 'open';
  if (rows.some((r) => r.expectedSource === 'preview-seed' && r.id !== 'FIN-EMPTY-1')) return 'expected-registered';
  if (rows.some((r) => r.actualSource === 'preview-seed' && r.id !== 'FIN-EMPTY-1')) return 'actual-registered';
  if (rows.some((r) => r.reconciliationStatus === 'unmatched')) return 'reconciliation';
  if (rows.some((r) => r.varianceMinorUnits !== 0)) return 'variances';
  if (rows.some((r) => r.evidenceStatus !== 'complete')) return 'maker-review';
  if (rows.some((r) => r.workflowState !== 'checked' && r.workflowState !== 'approved')) return 'maker-review';
  return 'checker-approval';
}

const EVIDENCE_LABEL: Record<DshFinancePreviewRow['evidenceStatus'], string> = {
  complete: 'مكتملة',
  partial: 'جزئية',
  missing: 'ناقصة',
};

const RECONCILIATION_LABEL: Record<DshFinancePreviewRow['reconciliationStatus'], string> = {
  closed: 'مغلق',
  matched: 'مطابق',
  disputed: 'نزاع',
  unmatched: 'غير مطابق',
};

const ALLOWED_ACTION_LABEL: Record<DshFinancePreviewRow['allowedAction'], string> = {
  review: 'مراجعة',
  view_evidence: 'عرض أدلة',
  prepare_decision: 'تحضير قرار',
  none: 'لا إجراء',
};

const WORKFLOW_LABEL: Record<DshFinancePreviewRow['workflowState'], string> = {
  draft: 'مسودة',
  prepared: 'محضّر',
  reviewed: 'تمت المراجعة',
  checked: 'تم الفحص',
  approved: 'معتمد',
  blocked_wlt: 'محظور WLT',
};

const WORKFLOW_TONE: Record<DshFinancePreviewRow['workflowState'], 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  draft: 'neutral',
  prepared: 'info',
  reviewed: 'info',
  checked: 'warning',
  approved: 'success',
  blocked_wlt: 'danger',
};

export function DailyReconciliationWorkbench() {
  const allRows = React.useMemo(() => {
    const surfaces = getAdaptedFinanceControlPanelRows();
    const seen = new Set<string>();
    const combined: DshFinancePreviewRow[] = [];
    for (const surface of [
      surfaces.overview,
      surfaces['cod-reconciliation'],
      surfaces.settlements,
      surfaces.payouts,
      surfaces.refunds,
    ] as const) {
      for (const row of surface) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          combined.push(row);
        }
      }
    }
    return combined;
  }, []);

  const currentStage = computeCurrentStage(allRows);
  const stageIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === currentStage);

  const totalExpected = allRows.reduce((s, r) => s + r.expectedMinorUnits, 0);
  const totalActual = allRows.reduce((s, r) => s + r.actualMinorUnits, 0);
  const totalVariance = totalExpected - totalActual;
  const allEvidenceComplete = allRows.every((r) => r.evidenceStatus === 'complete');
  const gateOpen = totalVariance === 0 && allEvidenceComplete;

  const nonZeroVarianceCount = allRows.filter((r) => r.varianceMinorUnits !== 0).length;
  const incompleteEvidenceCount = allRows.filter((r) => r.evidenceStatus !== 'complete').length;

  return (
    <Box gap={4} style={{ direction: 'rtl', padding: 16, maxWidth: '100%' }}>

      {/* Preview warning */}
      <Box padding={3} background="warningSurface" radiusToken="md" border borderTone="warning" gap={1}>
        <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', fontWeight: '700' }}>
          ⚠️ ورشة مطابقة اليوم المالي — معاينة فقط (PREVIEW_ONLY)
        </Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          WLT لم ينفذ بعد. لا إغلاق حقيقي — بيانات scaffold فقط.
          العملة: ريال يمني (YER) · وصغ = وحدة صغرى · المالك: WLT · DSH: view_only
        </Text>
      </Box>

      {/* Day lifecycle bar */}
      <Box gap={2}>
        <Text role="titleSm" style={{ textAlign: 'right', fontWeight: '700' }}>مراحل اليوم المالي</Text>
        <Box style={{ display: 'flex', flexDirection: 'row-reverse', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isPast = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            return (
              <WebControlPanelStatusTag
                key={stage.id}
                label={`${isPast ? '✓' : isCurrent ? '●' : '○'} ${stage.label}`}
                tone={isPast ? 'success' : isCurrent ? 'info' : 'neutral'}
              />
            );
          })}
        </Box>
      </Box>

      {/* Reconciliation table */}
      <Box gap={2}>
        <Text role="titleSm" style={{ textAlign: 'right', fontWeight: '700' }}>
          جدول المطابقة ({allRows.length} صف)
        </Text>
        <Box background="surfaceInset" radiusToken="md" border borderTone="line" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl', minWidth: 780 }}>
            <thead>
              <tr style={{ background: 'var(--bthwani-control-panel-border)' }}>
                {[
                  'المعرف',
                  'نوع الحركة',
                  'المتوقع (وصغ)',
                  'المصدر المتوقع',
                  'الفعلي (وصغ)',
                  'المصدر الفعلي',
                  'الفارق',
                  'الأدلة',
                  'المطابقة',
                  'سير العمل',
                  'الإجراء',
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '7px 10px',
                      textAlign: 'right',
                      fontSize: 11,
                      fontWeight: '600',
                      color: 'var(--bthwani-control-panel-text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map((row) => {
                const hasVar = row.varianceMinorUnits !== 0;
                const rowBg = hasVar
                  ? 'rgba(220,38,38,0.05)'
                  : row.evidenceStatus !== 'complete'
                  ? 'rgba(202,138,4,0.05)'
                  : 'transparent';

                return (
                  <tr
                    key={row.id}
                    style={{
                      background: rowBg,
                      borderBottom: '1px solid var(--bthwani-control-panel-border)',
                    }}
                  >
                    <td style={{ padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap', fontWeight: '600' }}>
                      {row.id}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>
                      {row.eventKind}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'left', direction: 'ltr' }}>
                      {row.expectedMinorUnits.toLocaleString()}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>
                      {row.expectedSource}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'left', direction: 'ltr' }}>
                      {row.actualMinorUnits.toLocaleString()}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', whiteSpace: 'nowrap' }}>
                      {row.actualSource}
                    </td>
                    <td style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      fontWeight: '700',
                      color: hasVar ? 'var(--bth-danger-text)' : 'var(--bth-success-text)',
                      textAlign: 'left',
                      direction: 'ltr',
                      whiteSpace: 'nowrap',
                    }}>
                      {hasVar ? `${row.varianceMinorUnits.toLocaleString()} ⚠` : '0 ✓'}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap',
                      color: row.evidenceStatus === 'complete' ? 'var(--bth-success-text)'
                        : row.evidenceStatus === 'partial' ? 'var(--bth-warning-text)'
                        : 'var(--bth-danger-text)',
                    }}>
                      {EVIDENCE_LABEL[row.evidenceStatus]}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap' }}>
                      {RECONCILIATION_LABEL[row.reconciliationStatus]}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap' }}>
                      <WebControlPanelStatusTag
                        label={WORKFLOW_LABEL[row.workflowState]}
                        tone={WORKFLOW_TONE[row.workflowState]}
                      />
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11, whiteSpace: 'nowrap', color: 'var(--bthwani-control-panel-text-muted)' }}>
                      {ALLOWED_ACTION_LABEL[row.allowedAction]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Day summary strip */}
      <Box
        padding={3}
        background="surfaceRaised"
        radiusToken="md"
        border
        borderTone="line"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
      >
        {[
          {
            label: 'إجمالي المتوقع',
            value: `${totalExpected.toLocaleString()} وصغ`,
            color: undefined,
          },
          {
            label: 'إجمالي الفعلي',
            value: `${totalActual.toLocaleString()} وصغ`,
            color: undefined,
          },
          {
            label: 'إجمالي الفارق',
            value: totalVariance !== 0 ? `${totalVariance.toLocaleString()} ⚠` : '٠ ✓',
            color: totalVariance !== 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)',
          },
          {
            label: 'الأدلة المكتملة',
            value: `${allRows.filter((r) => r.evidenceStatus === 'complete').length}/${allRows.length}`,
            color: allEvidenceComplete ? 'var(--bth-success-text)' : 'var(--bth-warning-text)',
          },
        ].map(({ label, value, color }) => (
          <Box key={label} gap={1}>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{label}</Text>
            <Text role="titleSm" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: '700', color: color ?? undefined }}>
              {value}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Day close gate */}
      <Box
        padding={4}
        background={gateOpen ? 'successSurface' : 'dangerSurface'}
        radiusToken="lg"
        border
        borderTone={gateOpen ? 'success' : 'danger'}
        gap={2}
      >
        <Text
          role="titleSm"
          tone={gateOpen ? 'success' : 'danger'}
          style={{ textAlign: 'right', fontWeight: '700' }}
        >
          {gateOpen ? '✓ بوابة الإغلاق: مفتوحة — (معاينة فقط)' : '🔴 بوابة الإغلاق: مغلقة'}
        </Text>

        {gateOpen ? (
          <Box gap={2}>
            <Text role="bodySm" tone="success" style={{ textAlign: 'right' }}>
              جميع الفوارق صفر · جميع الأدلة مكتملة.
              يمكن إرسال طلب إغلاق اليوم إلى WLT engine عبر POST /wlt/dsh/control-panel/daily-close.
            </Text>
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              [CONTRACT_SCAFFOLD_PREVIEW_ONLY] — WLT لم ينفذ endpoint الإغلاق بعد. Idempotency-Key مطلوب.
            </Text>
            <Button
              label="إرسال طلب إغلاق اليوم (معاينة — محظور حقيقيًا)"
              size="sm"
              tone="neutral"
              onPress={() => { /* preview only — no real POST */ }}
            />
          </Box>
        ) : (
          <Box gap={1}>
            {nonZeroVarianceCount > 0 ? (
              <Text role="bodySm" tone="danger" style={{ textAlign: 'right' }}>
                • {nonZeroVarianceCount} صف بفارق غير صفري — يجب حل جميع الفوارق
              </Text>
            ) : null}
            {incompleteEvidenceCount > 0 ? (
              <Text role="bodySm" tone="danger" style={{ textAlign: 'right' }}>
                • {incompleteEvidenceCount} صف بأدلة غير مكتملة — يجب رفع جميع الأدلة
              </Text>
            ) : null}
            <Text role="caption" tone="soft" style={{ textAlign: 'right', marginTop: 4 }}>
              WLT endpoint: POST /wlt/dsh/control-panel/daily-close · يرجع 422 عند وجود فوارق أو أدلة ناقصة.
              [CONTRACT_SCAFFOLD_PREVIEW_ONLY]
            </Text>
          </Box>
        )}
      </Box>

      {/* Maker-Checker preview workflow */}
      <Box gap={2}>
        <Text role="titleSm" style={{ textAlign: 'right', fontWeight: '700' }}>
          نموذج Maker-Checker (معاينة — four-eyes)
        </Text>
        <Box padding={3} background="surfaceInset" radiusToken="md" border borderTone="line" gap={2}>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
            أي إغلاق مالي يتطلب four-eyes: Maker يحضّر القرار → Checker يراجع → WLT يعتمد وينفذ.
            لا تنفيذ مالي من DSH في أي مرحلة. سير العمل مشروط بـ varianceMinorUnits === 0 في جميع الصفوف.
          </Text>
          <Box style={{ display: 'flex', flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
            {[
              { step: '١', label: 'Maker — تحضير القرار', done: stageIndex >= 5 },
              { step: '٢', label: 'Checker — مراجعة وفحص', done: stageIndex >= 6 },
              { step: '٣', label: 'WLT engine — تنفيذ الإغلاق', done: false },
            ].map(({ step, label, done }) => (
              <Box
                key={step}
                padding={2}
                background={done ? 'successSurface' : 'surfaceRaised'}
                radiusToken="sm"
                border
                borderTone={done ? 'success' : 'line'}
                gap={1}
              >
                <Text role="caption" tone={done ? 'success' : 'muted'} style={{ textAlign: 'right', whiteSpace: 'nowrap', fontWeight: '600' }}>
                  {done ? '✓' : '○'} {step}) {label}
                </Text>
                <WebControlPanelStatusTag
                  label={done ? 'مكتمل في المعاينة' : '[معاينة — غير منفذ]'}
                  tone={done ? 'success' : 'neutral'}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DailyReconciliationWorkbench;
