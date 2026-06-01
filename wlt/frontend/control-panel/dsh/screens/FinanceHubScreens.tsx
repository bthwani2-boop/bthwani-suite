'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelCompactPager,
  WebControlPanelDenseHeader,
  WebControlPanelStatusTag,
  WebControlPanelWorkbench,
} from '@bthwani/ui-kit/web';
import {
  getAdaptedFinanceControlPanelRows,
  type DshFinancePreviewRow,
  type DshFinancePreviewSurface,
} from '../adapters/dshFinanceFixture.adapter';
import { getWltControlPanelFinancePreview } from '../financeContracts';
import { WltBoundaryBanner } from '../components/WltBoundaryBanner';
import { buildDshWltFinanceBoundaryRecord } from '../../../../../dsh/frontend/shared/dshFinancePreviewModel';
import { getFinanceApiBinding } from '../adapters/finance.api-matrix';
import { DailyReconciliationWorkbench } from './DailyReconciliationWorkbench';
import { WltDshFieldCommissionStatement } from '../components/WltDshFieldCommissionStatement';
import { WltDshStoreSettlementStatement } from '../components/WltDshStoreSettlementStatement';
import { WltDshPartnerStatement } from '../components/WltDshPartnerStatement';
import { WltDshAccountStatement } from '../components/WltDshAccountStatement';
import { WltDshCaptainStatement } from '../components/WltDshCaptainStatement';
import { normalizeFinanceLocation } from '../constants/finance.registry';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

type FinanceSurface = DshFinancePreviewSurface;
type FinanceRow = DshFinancePreviewRow;

const FINANCE_ROWS = getAdaptedFinanceControlPanelRows();

// Arabic translations for sources and actions (Staff Mode)
const EXPECTED_SOURCE_AR: Record<string, string> = {
  'order-invoice': 'فاتورة الطلب المعتمدة',
  'settlement-cycle': 'دورة التسوية التشغيلية',
  'commission-schedule': 'جدول العمولات المعتمد',
  'eligibility-calc': 'حسبة أهلية الكابتن',
  'preview-seed': 'مصدر معاينة تجريبي',
};

const ACTUAL_SOURCE_AR: Record<string, string> = {
  'bank-deposit': 'حوالة إيداع بنكي',
  'wallet-debit': 'خصم رصيد المحفظة',
  'cash-bag-delivery': 'حقيبة النقدية الموردة',
  'pos-receipt': 'إيصال دفع رقمي',
  'preview-seed': 'مصدر معاينة تجريبي',
};

const EVIDENCE_SOURCE_AR: Record<string, string> = {
  'bank-statement': 'كشف حساب بنكي رسمي',
  'pos-log': 'سجل العمليات الرقمية',
  'audit-entry': 'سجل التدقيق المالي',
  'receipt-upload': 'مستند إثبات الإيداع',
  'none': 'لا توجد أدلة مرفوعة',
};

const EVENT_KIND_LABEL: Record<string, string> = {
  'client-payment': 'دفع عميل',
  'wallet-payment': 'دفع محفظة',
  'cash-on-delivery': 'COD كاش',
  'partner-settlement': 'تسوية شريك',
  'store-delivery-fee': 'رسوم توصيل متجر',
  'store-courier-compensation': 'عمولة موصل',
  'captain-earning': 'أرباح كابتن',
  'captain-cod-liability': 'COD كابتن',
  'captain-eligibility-topup': 'شحن رصيد كابتن',
  'field-commission': 'عمولة ميدانية',
  'field-commission-pending': 'عمولة معلقة',
  'field-commission-rejected': 'عمولة مرفوضة',
  'field-payout': 'صرف للميداني',
  'refund-adjustment': 'تعديل استرداد',
  'platform-commission': 'عمولة المنصة',
  'reconciliation-export': 'تصدير مطابقة',
};

function resolveSurfaceDomain(surface: FinanceSurface): string {
  if (surface === 'settlements') return 'settlement';
  if (surface === 'payouts') return 'payout';
  if (surface === 'captain-eligibility') return 'captain-eligibility';
  if (surface === 'refunds') return 'refund';
  if (surface === 'cod-reconciliation') return 'cod-liability';
  if (surface === 'ledger') return 'ledger-journal';
  if (surface === 'risk-audit') return 'risk-audit';
  if (surface === 'overview') return 'platform-fee';
  if (surface === 'captain-finance') return 'settlement';
  if (surface === 'store-delivery-finance') return 'store-delivery-fee';
  return 'platform-fee';
}

function resolveSurfaceLabel(surface: FinanceSurface) {
  if (surface === 'overview') return 'النظرة العامة';
  if (surface === 'settlements') return 'التسويات والمدفوعات';
  if (surface === 'cod-reconciliation') return 'COD والكاش';
  if (surface === 'refunds') return 'الاستردادات';
  if (surface === 'captain-eligibility') return 'أهلية الكابتن';
  if (surface === 'payouts') return 'المدفوعات البنكية';
  if (surface === 'ledger') return 'دفتر الأستاذ';
  if (surface === 'captain-finance') return 'مالية الكباتن';
  if (surface === 'store-delivery-finance') return 'توصيل المتاجر';
  return 'الفروقات والتدقيق';
}

function resolveSurfaceDescription(surface: FinanceSurface) {
  if (surface === 'overview') return 'ملخص اليوم المالي وتدقيق إغلاق الحسابات الحالية.';
  if (surface === 'settlements') return 'مراجعة تسويات المتاجر، الكباتن، الميدانيين وتوصيل المتاجر.';
  if (surface === 'cod-reconciliation') return 'مطابقة المبالغ المحصلة يدوياً من الكباتن مع الطلبات المنفذة.';
  if (surface === 'refunds') return 'صف الاستردادات والنزاعات والطلبات المرجوعة للعملاء.';
  if (surface === 'captain-eligibility') return 'مراقبة رصيد الضمان للأهلية التشغيلية.';
  if (surface === 'payouts') return 'تحضير الحوالات البنكية وصرف المستحقات عبر WLT.';
  if (surface === 'ledger') return 'دفتر القيود اليومية وميزان المراجعة العام.';
  if (surface === 'captain-finance') return 'مراقبة حركات ذمم الكباتن.';
  if (surface === 'store-delivery-finance') return 'تدقيق عمولات توصيل المتاجر الداخلي.';
  return 'متابعة الفروقات والعمليات المعلقة التي تمنع إغلاق اليوم.';
}

function resolveRowTone(row: FinanceRow) {
  if (row.risk === 'danger') return 'danger' as const;
  if (row.risk === 'warning') return 'warning' as const;
  if (row.varianceMinorUnits !== 0 || row.evidenceStatus !== 'complete') return 'warning' as const;
  return 'success' as const;
}

function resolveToneColor(tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral') {
  if (tone === 'danger') return 'var(--bth-danger-text)';
  if (tone === 'warning') return 'var(--bth-warning-text)';
  if (tone === 'success') return 'var(--bth-success-text)';
  if (tone === 'info') return 'var(--bth-info-text)';
  return 'var(--bth-control-panel-text-muted)';
}

export function FinanceSurfaceBoard({
  surface,
  subGroup,
  technicalAuditMode = false,
}: {
  surface: FinanceSurface;
  subGroup?: string;
  technicalAuditMode?: boolean;
}) {
  const router = useRouter();
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const rows = React.useMemo(() => {
    // Dynamic subgroup mapping for sub-filter panels.
    if (surface === 'cod-reconciliation') {
      if (subGroup === 'captain-eligibility') return FINANCE_ROWS['captain-eligibility'];
      if (subGroup === 'captain-finance') return FINANCE_ROWS['captain-finance'];
    }
    if (surface === 'settlements') {
      if (subGroup === 'store-delivery') return FINANCE_ROWS['store-delivery-finance'];
    }

    const baseRows = FINANCE_ROWS[surface];
    const wltPreview = getWltControlPanelFinancePreview();

    if (!subGroup || subGroup === 'all') return baseRows;

    if (surface === 'overview' && subGroup === 'daily-close') {
      return baseRows;
    }

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
      if (subGroup === 'partners') return baseRows.filter((row) => row.actorType === 'partner');
      if (subGroup === 'stores') return baseRows.filter((row) => row.actorType === 'partner');
      if (subGroup === 'captains') return baseRows.filter((row) => row.actorType === 'captain');
      if (subGroup === 'field') return baseRows.filter((row) => row.actorType === 'field');
    }

    if (surface === 'cod-reconciliation') {
      if (subGroup === 'mismatch') return baseRows.filter((row) => row.varianceMinorUnits !== 0);
      if (subGroup === 'collected') return baseRows.filter((row) => row.reconciliationStatus === 'matched' || row.reconciliationStatus === 'closed');
      if (subGroup === 'pending') return baseRows.filter((row) => row.reconciliationStatus === 'unmatched');
    }

    if (surface === 'refunds') {
      if (subGroup === 'pending') return baseRows.filter((row) => row.reconciliationStatus === 'unmatched');
      if (subGroup === 'processed') return baseRows.filter((row) => row.reconciliationStatus === 'matched' || row.reconciliationStatus === 'closed');
      if (subGroup === 'rejected') return baseRows.filter((row) => row.reconciliationStatus === 'disputed');
    }

    if (surface === 'ledger') {
      if (subGroup === 'trial-balance') return baseRows.filter((row) => row.eventKind === 'reconciliation-export');
      if (subGroup === 'journal') return baseRows.filter((row) => row.eventKind === 'platform-commission');
    }

    return baseRows;
  }, [surface, subGroup]);

  const [blockedAction, setBlockedAction] = React.useState<string | null>(null);
  const [blockedRowId, setBlockedRowId] = React.useState<string | null>(null);
  const criticalCount = rows.filter((row) => row.risk === 'danger').length;
  const warningCount = rows.filter((row) => row.risk === 'warning').length;

  const handleAction = (row: FinanceRow, label: string) => {
    if (label.includes('تسويات') || label.includes('التسويات')) {
      router.push('/finance?workspace=settlements-payouts');
    } else if (label.includes('القيود') || label.includes('القيد') || label.includes('ميزان') || label.includes('الميزان')) {
      router.push('/finance?workspace=ledger');
    } else if (label.includes('التدقيق') || label.includes('تدقيق') || label.includes('المخاطر')) {
      router.push('/finance?workspace=variances');
    } else if (label.includes('الاسترداد') || label.includes('استرداد')) {
      router.push('/finance?workspace=refunds');
    } else {
      setBlockedAction(label);
      setBlockedRowId(row.id);
    }
  };

  React.useEffect(() => {
    setExpandedRowId(null);
    setBlockedAction(null);
    setBlockedRowId(null);
  }, [rows, surface]);

  return (
    <WebControlPanelWorkbench
      header={
        <WebControlPanelDenseHeader
          eyebrow="العملة: ر.ي (ريال يمني)"
          title={`غرفة عمل ${resolveSurfaceLabel(surface)}`}
          description={resolveSurfaceDescription(surface)}
          metrics={[
            { id: 'rows-count', label: 'العناصر المتاحة', value: String(rows.length) },
            { id: 'critical-count', label: 'فوارق حرجة', value: String(criticalCount) },
            { id: 'warning-count', label: 'تحتاج مراجعة', value: String(warningCount) },
          ]}
        />
      }
      main={
        <Box gap={3} style={{ width: '100%' }}>
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap', direction: 'rtl' }}>
            <WebControlPanelStatusTag label={resolveSurfaceLabel(surface)} tone="info" />
            <WebControlPanelStatusTag label={subGroup ? `الفرعي: ${subGroup}` : 'كافة السجلات'} tone="neutral" />
            {technicalAuditMode && <WebControlPanelStatusTag label="معاينة فقط (WLT)" tone="warning" />}
          </Box>

          {rows.length === 0 ? (
            <Box padding={6} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Text role="titleSm" tone="muted" style={{ fontWeight: '700', textAlign: 'center' }}>لا توجد سجلات حالية</Text>
              <Text role="bodySm" tone="soft" style={{ textAlign: 'center', lineHeight: 22 }}>
                لا توجد حركات مالية مطابقة لهذا التبويب الفرعي حالياً في بيئة المعاينة.
              </Text>
            </Box>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, direction: 'rtl', width: '100%' }}>
              <div className={wltStyles.cardTitleRow}>
                <span style={{ fontSize: 13, fontWeight: '700', color: 'var(--bth-control-panel-text)' }}>
                  قائمة البنود المالية المعلقة ({rows.length} بند)
                </span>
                <span style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)' }}>
                  اضغط على أي بطاقة لتنسدل منها التفاصيل والمطابقة المالية فوراً.
                </span>
              </div>

              {rows.map((row) => {
                const isExpanded = expandedRowId === row.id;
                const rowTone = resolveRowTone(row);
                const borderToneColor = resolveToneColor(rowTone);

                return (
                  <div
                    key={row.id}
                    className={`${wltStyles.accordionCard} ${isExpanded ? wltStyles.accordionCardExpanded : ''}`}
                    style={{
                      borderRight: `5px solid ${borderToneColor}`,
                    }}
                  >
                    {/* Header Row (Always Visible) */}
                    <div
                      onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                      className={`${wltStyles.accordionCardHeader} ${isExpanded ? wltStyles.accordionCardHeaderExpanded : ''}`}
                      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Right info (Title, Actor, ID) */}
                      <div className={wltStyles.infoGroupRight}>
                        <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', fontWeight: '700' }}>
                          {row.id}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 14, fontWeight: '700', color: 'var(--bth-control-panel-text)' }}>
                            {row.owner}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--bth-control-panel-text-muted)', marginTop: 2 }}>
                            {EVENT_KIND_LABEL[row.eventKind] || row.eventKind} · {row.evidence}
                          </span>
                        </div>
                      </div>

                      {/* Left info (Amount, Status, Chevron) */}
                      <div className={wltStyles.infoGroupLeft}>
                        <div className={wltStyles.amountAndStatus}>
                          <span className={wltStyles.amountLabel}>
                            {row.amount}
                          </span>
                          <span style={{ fontSize: 11, color: borderToneColor, fontWeight: '700', marginTop: 2 }}>
                            {row.status}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                            color: 'var(--bth-control-panel-text-muted)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s',
                          }}
                        >
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Inline Expanded Panel (Accordion Drawer) */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '20px 24px',
                          borderTop: '1px solid var(--bth-control-panel-border)',
                          background: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {/* Dynamic Statement / Workbench Detail per Actor Type */}
                        <div style={{ marginBottom: 16 }}>
                          {(() => {
                            if (row.actorType === 'field') {
                              return (
                                <WltDshFieldCommissionStatement
                                  agentId={row.sourceFieldAgentId}
                                  technicalAuditMode={technicalAuditMode}
                                />
                              );
                            }
                            if (row.actorType === 'partner') {
                              return (
                                <WltDshPartnerStatement
                                  technicalAuditMode={technicalAuditMode}
                                />
                              );
                            }
                            if (row.actorType === 'captain') {
                              return (
                                <WltDshCaptainStatement
                                  captainId={row.sourceCaptainId}
                                  technicalAuditMode={technicalAuditMode}
                                />
                              );
                            }
                            return (
                              <WltDshAccountStatement
                                actorId={row.actorType === 'client' ? 'CUS-553' : 'DSH-PLATFORM'}
                                technicalAuditMode={technicalAuditMode}
                              />
                            );
                          })()}
                        </div>

                        {/* OpenAPI Matrix Bindings (Technical Mode Only) */}
                        {technicalAuditMode && (() => {
                          const binding = getFinanceApiBinding(normalizeFinanceLocation(surface).group);
                          if (!binding) return null;
                          return (
                            <Box padding={2} background="surfaceInset" radiusToken="sm" gap={1} style={{ marginTop: 12, direction: 'rtl' }}>
                              <Text role="caption" tone="muted" style={{ fontWeight: '700', textAlign: 'right' }}>WLT OpenAPI Binding Matrix [P7]</Text>
                              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{binding.httpMethod} {binding.wltEndpoint} · operationId: {binding.operationId} · endpoint: {binding.endpointStatus === 'exact' ? '✓ exact' : '⚠ placeholder'}</Text>
                            </Box>
                          );
                        })()}

                        {/* Recommendation Text Block */}
                        <div style={{ marginTop: 16, background: 'var(--bth-control-panel-surface-raised)', border: '1px solid var(--bth-control-panel-border)', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--bth-control-panel-text)' }}>
                            💡 <strong>توصية المطابقة والمراجعة:</strong> {row.recommendation}
                          </span>
                          {technicalAuditMode && (
                            <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 4, fontWeight: '700', color: 'var(--bth-control-panel-text-muted)' }}>
                              CONTRACT_SCAFFOLD_PREVIEW_ONLY
                            </span>
                          )}
                        </div>

                        {/* Allowed Action Handoff Feedback Block */}
                        {blockedAction && blockedRowId === row.id && (
                          (() => {
                            if (blockedAction === 'مراجعة وتدقيق') {
                              return (
                                <Box padding={3} background="warningSurface" radiusToken="md" border borderTone="warning" gap={2} style={{ direction: 'rtl', marginTop: 12 }}>
                                  <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', fontWeight: '700' }}>[معاينة تجريبية] مراجعة بند مالي</Text>
                                  <Text role="caption" style={{ textAlign: 'right', lineHeight: 18 }}>
                                    تم تسجيل رغبة مراجعة البند بنجاح محلياً. لم يتم إرسال طلب ترحيل لعدم ربط API الخادم المالي الفعلي.
                                  </Text>
                                  <Button label="موافق" size="sm" tone="ghost" onPress={() => setBlockedAction(null)} />
                                </Box>
                              );
                            }
                            return (
                              <Box padding={3} background="dangerSurface" radiusToken="md" border borderTone="danger" gap={2} style={{ direction: 'rtl', marginTop: 12 }}>
                                <Text role="bodyStrong" tone="danger" style={{ textAlign: 'right', fontWeight: '700' }}>الإجراء مقيد تشغيلياً</Text>
                                <Text role="caption" tone="danger" style={{ textAlign: 'right', lineHeight: 18 }}>
                                  الإجراء "{blockedAction}" للكيان المالي {row.id} غير متاح من واجهة DSH حالياً.
                                  كافة حركات الصرف والتحويل الحقيقي تنفذ من Ledger المركزي التابع لـ WLT.
                                </Text>
                                <Button label="فهمت" size="sm" tone="ghost" onPress={() => setBlockedAction(null)} />
                              </Box>
                            );
                          })()
                        )}

                        {/* Action Cluster (Single Source of actions at bottom of card expansion) */}
                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
                          <WebControlPanelActionCluster
                            primary={{ id: `${row.id}-action-review`, label: 'تحضير مراجعة البند', onAction: () => handleAction(row, 'مراجعة وتدقيق') }}
                            secondary={{ id: `${row.id}-action-evidence`, label: 'عرض أدلة المطابقة', onAction: () => handleAction(row, 'فتح الأدلة') }}
                          />
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Box>
      }
      inspector={null} // Completely eliminated the side inspector pane! All layout is full-width, clean, and accordion-driven.
    />
  );
}

export function ControlPanelDshFinanceScreen({ technicalAuditMode }: { technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="overview" technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshSettlementScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="settlements" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCodReconciliationScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="cod-reconciliation" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshRefundQueueScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="refunds" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCaptainEligibilityScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="captain-eligibility" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshPayoutsScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="payouts" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshRiskAuditScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="risk-audit" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshCaptainFinanceScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="captain-finance" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshStoreDeliveryFinanceScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="store-delivery-finance" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export function ControlPanelDshLedgerScreen({ subGroup, technicalAuditMode }: { subGroup?: string; technicalAuditMode: boolean }) {
  return <FinanceSurfaceBoard surface="ledger" subGroup={subGroup} technicalAuditMode={technicalAuditMode} />;
}

export default ControlPanelDshFinanceScreen;
