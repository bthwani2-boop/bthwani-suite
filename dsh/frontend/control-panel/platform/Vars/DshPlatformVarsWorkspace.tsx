'use client';

import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { usePlatformAuditState } from '../usePlatformAuditState';
import type {
  DshPlatformVarScope,
  DshPlatformVarStatus,
} from './vars.types';
import {
  PLATFORM_VAR_STATUS_BADGE,
  PLATFORM_VAR_RISK_CSS_CLASS,
  PLATFORM_VAR_RISK_LABEL,
  PLATFORM_VAR_STATUS_LABEL,
  PLATFORM_VAR_QUICK_PICKS,
  isPlatformDesignVar,
} from '../../../shared/platform/platform-vars.policy';
import {
  DSH_PLATFORM_AUDIT_LOG,
  DSH_PLATFORM_OPERATIONAL_VARS,
  DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  DSH_PLATFORM_SCOPE_PRECEDENCE,
  DSH_PLATFORM_POLICY_SCENARIOS,
  resolvePlatformVarsDomainRecords,
  sortPlatformVarsByScope,
  resolvePlatformVarsDomainKpis,
  resolvePlatformVarsFilteredScopes,
  isProviderVarRecord,
  type VarsDomainId,
} from '../../../shared/platform/platform-vars.view-model';
import { usePlatformVarsSession } from '../../../shared/platform/platform-vars.session';
import styles from './dsh-platform-vars.module.css';

const DOMAIN_TABS: { id: VarsDomainId; label: string }[] = [
  { id: 'dsh',      label: 'عمليات DSH' },
  { id: 'wlt',      label: 'جسر WLT' },
  { id: 'provider', label: 'المزودين' },
  { id: 'design',   label: 'سياسات الهوية' },
  { id: 'policy',   label: 'الأسبقية' },
];

const STATUS_BADGE: Record<DshPlatformVarStatus, { label: string; cls: string }> = {
  'runtime-bound':       { label: PLATFORM_VAR_STATUS_BADGE['runtime-bound'].label,       cls: styles[PLATFORM_VAR_STATUS_BADGE['runtime-bound'].cssClass] },
  'contract-required':   { label: PLATFORM_VAR_STATUS_BADGE['contract-required'].label,   cls: styles[PLATFORM_VAR_STATUS_BADGE['contract-required'].cssClass] },
  'read-only-reference': { label: PLATFORM_VAR_STATUS_BADGE['read-only-reference'].label, cls: styles[PLATFORM_VAR_STATUS_BADGE['read-only-reference'].cssClass] },
  'disabled-by-policy':  { label: PLATFORM_VAR_STATUS_BADGE['disabled-by-policy'].label,  cls: styles[PLATFORM_VAR_STATUS_BADGE['disabled-by-policy'].cssClass] },
};

const RISK_DOT: Record<DshPlatformVarRecord['risk'], string> = {
  low:       styles[PLATFORM_VAR_RISK_CSS_CLASS.low],
  medium:    styles[PLATFORM_VAR_RISK_CSS_CLASS.medium],
  high:      styles[PLATFORM_VAR_RISK_CSS_CLASS.high],
  financial: styles[PLATFORM_VAR_RISK_CSS_CLASS.financial],
};

const RISK_LABEL: Record<DshPlatformVarRecord['risk'], string> = PLATFORM_VAR_RISK_LABEL;

const STATUS_LABEL: Record<DshPlatformVarStatus, string> = PLATFORM_VAR_STATUS_LABEL;


const QUICK_PICKS = PLATFORM_VAR_QUICK_PICKS;

/* ─── VAR ROW (compact list item) ─── */
function VarRow({
  record,
  active,
  onSelect,
}: {
  record: DshPlatformVarRecord;
  active: boolean;
  onSelect: () => void;
}) {
  const badge = STATUS_BADGE[record.status];
  return (
    <button
      type="button"
      className={`${styles.varRow} ${active ? styles.varRowActive : ''}`.trim()}
      onClick={onSelect}
    >
      <div className={styles.varRowTop}>
        <span className={styles.varRowName}>{record.label}</span>
        <span className={`${styles.varRowBadge} ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className={styles.varRowMeta}>
        <div className={`${styles.riskDot} ${RISK_DOT[record.risk]}`} title={`مخاطرة ${RISK_LABEL[record.risk]}`} />
        <span className={styles.varRowMetaItem}>{record.owner}</span>
        <div className={styles.varRowDot} />
        <span className={styles.varRowMetaItem}>{record.scope}</span>
        <div className={styles.varRowDot} />
        <span className={styles.varRowValueCurrent}>{record.currentValue}</span>
      </div>
    </button>
  );
}

/* ─── POLICY REFERENCE CARD ─── */
function RefCard({ title, desc, footer }: { title: string; desc: string; footer?: string }) {
  return (
    <div className={styles.referenceCard}>
      <div className={styles.referenceTitle}>{title}</div>
      <div className={styles.referenceText}>{desc}</div>
      {footer ? <div className={styles.referenceFooter}>{footer}</div> : null}
    </div>
  );
}

/* ─── MAIN ─── */
export function DshPlatformVarsWorkspace({ activeDomainFilter }: { activeDomainFilter: VarsDomainId }) {
  const { addAuditEvent } = usePlatformAuditState();
  const { getLive, editVal, setEditVal, showConfirm, setShowConfirm, confirmSaveProposed } =
    usePlatformVarsSession(addAuditEvent);

  const activeDomain = activeDomainFilter;
  const [activeScope,  setActiveScope]  = React.useState<string>('all');
  const [selectedId,   setSelectedId]   = React.useState<string | null>(
    DSH_PLATFORM_OPERATIONAL_VARS[0]?.id ?? null
  );

  /* reset on domain change */
  React.useEffect(() => {
    setActiveScope('all');
    setShowConfirm(null);
    const records = resolvePlatformVarsDomainRecords(activeDomain);
    const first = records[0] ?? null;
    setSelectedId(first?.id ?? null);
    setEditVal(first ? (getLive(first).proposedValue ?? '') : '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  /* reset on var change */
  React.useEffect(() => {
    setShowConfirm(null);
    if (!selectedId) return;
    const all = [
      ...DSH_PLATFORM_OPERATIONAL_VARS,
      ...DSH_PLATFORM_PROVIDER_CONTROL_VARS,
    ];
    const found = all.find((r) => r.id === selectedId);
    if (found) setEditVal(getLive(found).proposedValue ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const domainRecords   = sortPlatformVarsByScope(resolvePlatformVarsDomainRecords(activeDomain));
  const filteredRecords = activeScope === 'all'
    ? domainRecords
    : domainRecords.filter((r) => r.scope === (activeScope as DshPlatformVarScope));

  const rawSelected  = filteredRecords.find((r) => r.id === selectedId) ?? filteredRecords[0] ?? domainRecords[0] ?? null;
  const selectedVar  = rawSelected ? getLive(rawSelected) : null;

  const orderedScopes = resolvePlatformVarsFilteredScopes(domainRecords);

  const linkedScenarios = selectedVar ? DSH_PLATFORM_POLICY_SCENARIOS.filter((s) => s.relatedKeys.includes(selectedVar.key)) : [];
  const linkedAudits    = selectedVar ? DSH_PLATFORM_AUDIT_LOG.filter((e) => e.targetKey === selectedVar.key) : [];
  const kpiCssClasses = { warning: styles.kpiCellWarning, success: styles.kpiCellSuccess, danger: styles.kpiCellDanger };
  const kpis          = resolvePlatformVarsDomainKpis(activeDomain, kpiCssClasses);
  const quickPicks      = selectedVar ? (QUICK_PICKS[selectedVar.key] ?? []) : [];

  const hasProposed = Boolean(selectedVar?.proposedValue);
  const isDesignVar = selectedVar ? isPlatformDesignVar(selectedVar.key) : false;
  const isValidDesignVal = isDesignVar ? (QUICK_PICKS[selectedVar?.key ?? ''] ?? []).includes(editVal) : true;

  return (
    <Box gap={4}>
      <WebSectionCard
        title="إدارة المتغيرات والسياسات"
        description="مراجعة وتعديل سياسات المنصة ومتغيراتها التشغيلية. كل تغيير يخضع للتدقيق ولا يُطبَّق على الخوادم الحية."
      >
        <div className={styles.varsSplit}>

          {/* ─── LEFT RAIL ─── */}
          <div className={styles.varsList}>

            {/* KPIs + scope filter */}
            <div className={styles.listHeader}>
              <div className={styles.kpiRow}>
                {kpis.map((k) => (
                  <div key={k.id} className={`${styles.kpiCell} ${k.cls}`.trim()}>
                    <span className={styles.kpiValue}>{k.value}</span>
                    <span className={styles.kpiLabel}>{k.label}</span>
                  </div>
                ))}
              </div>

              {activeDomain !== 'policy' && (
                <div className={styles.scopeTabsRow}>
                  <button
                    type="button"
                    className={`${styles.scopeTab} ${activeScope === 'all' ? styles.scopeTabActive : ''}`.trim()}
                    onClick={() => setActiveScope('all')}
                  >
                    الكل
                  </button>
                  {orderedScopes.map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      className={`${styles.scopeTab} ${activeScope === scope ? styles.scopeTabActive : ''}`.trim()}
                      onClick={() => setActiveScope(scope)}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List items */}
            {activeDomain === 'policy' ? (
              <div className={styles.policyStack}>
                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>طبقات الأسبقية</div>
                  <div className={styles.referenceList}>
                    {DSH_PLATFORM_SCOPE_PRECEDENCE.map((layer) => (
                      <RefCard
                        key={layer.id}
                        title={`${layer.order}. ${layer.title}`}
                        desc={`${layer.description} ${layer.ownerGuard}`}
                        footer={layer.note}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>سيناريوهات المحاكاة</div>
                  <div className={styles.referenceList}>
                    {DSH_PLATFORM_POLICY_SCENARIOS.map((s) => (
                      <RefCard
                        key={s.id}
                        title={s.title}
                        desc={`${s.expectedImpact} ${s.guardrail}`}
                        footer={s.blockedReason}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>التدقيق وخطة الرجوع</div>
                  <div className={styles.referenceList}>
                    {DSH_PLATFORM_AUDIT_LOG.map((e) => (
                      <RefCard
                        key={e.id}
                        title={e.title}
                        desc={`${e.event} · ${e.stateLabel} · ${e.evidenceHint}`}
                        footer={e.rollbackHint}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <VarRow
                  key={record.id}
                  record={getLive(record)}
                  active={selectedVar?.id === record.id}
                  onSelect={() => setSelectedId(record.id)}
                />
              ))
            ) : (
              <div className={styles.emptyState} style={{ margin: 16 }}>
                لا توجد عناصر لهذه الطبقة. غيّر المجال أو طبقة الأسبقية.
              </div>
            )}
          </div>

          {/* ─── RIGHT DETAIL PANEL ─── */}
          <div className={styles.detailPanel}>
            {!selectedVar || activeDomain === 'policy' ? (
              <div className={styles.detailEmpty}>
                {activeDomain === 'policy'
                  ? 'اختر مجالاً آخر لعرض تفاصيل متغير وأدوات التعديل.'
                  : 'اختر عنصراً من القائمة لعرض التفاصيل وأدوات التعديل.'}
              </div>
            ) : (
              <>
                {/* Hero header */}
                <div className={styles.detailHero}>
                  <div className={styles.detailHeroTop}>
                    <div className={styles.detailTitle}>{selectedVar.label}</div>
                    <span className={styles.detailOwnerBadge}>{selectedVar.owner}</span>
                  </div>
                  <div className={styles.detailKeyCode} dir="ltr">{selectedVar.key}</div>
                  <div className={styles.detailSummaryText}>{selectedVar.effectSummary}</div>
                </div>

                {/* Value comparison */}
                <div className={styles.valueCompareRow}>
                  <div className={styles.valueBox}>
                    <span className={styles.valueBoxLabel}>الحالي</span>
                    <span className={styles.valueBoxNumber}>{selectedVar.currentValue}</span>
                  </div>
                  <div className={styles.valueArrow}>←</div>
                  <div className={`${styles.valueBox} ${hasProposed ? styles.valueBoxActive : ''}`.trim()}>
                    <span className={styles.valueBoxLabel}>المقترح</span>
                    {hasProposed ? (
                      <span className={`${styles.valueBoxNumber} ${styles.valueBoxNumberNew}`}>
                        {selectedVar.proposedValue}
                      </span>
                    ) : (
                      <span className={styles.valueBoxNumberEmpty}>لا يوجد مقترح</span>
                    )}
                  </div>
                </div>

                {/* Edit controls */}
                <div className={styles.detailControls}>
                  <span className={styles.controlsLabel}>تعديل القيمة المقترحة</span>

                  {quickPicks.length > 0 && (
                    <div className={styles.quickPickRow}>
                      {quickPicks.map((val) => (
                        <button
                          key={val}
                          type="button"
                          className={`${styles.quickPickBtn} ${editVal === val ? styles.quickPickBtnSelected : ''}`.trim()}
                          onClick={() => setEditVal(val)}
                          disabled={showConfirm !== null}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {isDesignVar ? (
                    <div className={styles.validationNotice}>
                      ⚠️ يُسمح بالاختيار من القوالب المعتمدة فقط لسياسات التصميم لمنع الانحراف البصري.
                    </div>
                  ) : (
                    <input
                      type="text"
                      className={styles.valueInput}
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      placeholder="أو اكتب قيمة مخصصة..."
                      disabled={showConfirm !== null}
                    />
                  )}

                  {/* Action bar */}
                  <div className={styles.actionBar}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      disabled={showConfirm !== null || !isValidDesignVal}
                      onClick={() => setShowConfirm('save-proposed')}
                    >
                      حفظ المقترح
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      disabled={true}
                      title="يتطلب عقد Backend موثق — غير مفعّل حالياً"
                      onClick={() => setShowConfirm('apply')}
                    >
                      تطبيق المقترح ←
                    </button>
                  </div>

                  <div className={styles.actionBar}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      disabled={true}
                      title="التعليم بالعقد يتطلب مسار Backend موثق — غير مفعّل حالياً"
                      onClick={() => setShowConfirm('mark-contract-ready')}
                    >
                      تعليمه كمرتبط بالعقد
                    </button>
                    <button
                      type="button"
                      className={styles.btnDanger}
                      disabled={true}
                      title="الرجوع يتطلب مسار Backend موثق — غير مفعّل حالياً"
                      onClick={() => setShowConfirm('rollback')}
                    >
                      الرجوع للقيمة الموثقة
                    </button>
                  </div>
                </div>

                {/* Confirm banner */}
                {showConfirm === 'save-proposed' && (
                  <div className={styles.confirmBanner}>
                    <div className={styles.confirmText}>
                      {'حفظ القيمة المقترحة بانتظار اعتماد عقد التشغيل (محلي فقط — لا يُطبَّق على الخوادم).'}
                    </div>
                    <div className={styles.confirmActions}>
                      <button type="button" className={styles.btnPrimary} onClick={() => selectedVar && confirmSaveProposed(selectedVar, editVal)}>
                        تأكيد
                      </button>
                      <button type="button" className={styles.btnSecondary} onClick={() => setShowConfirm(null)}>
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className={styles.metaSection}>
                  <span className={styles.metaSectionTitle}>تفاصيل المتغير</span>
                  <div className={styles.metaGrid}>
                    <div className={styles.metaCell}>
                      <span className={styles.metaCellLabel}>الجاهزية</span>
                      <span className={styles.metaCellValue}>{STATUS_LABEL[selectedVar.status]}</span>
                    </div>
                    <div className={styles.metaCell}>
                      <span className={styles.metaCellLabel}>مستوى المخاطرة</span>
                      <span className={styles.metaCellValue}>{RISK_LABEL[selectedVar.risk]}</span>
                    </div>
                    <div className={styles.metaCell}>
                      <span className={styles.metaCellLabel}>النطاق</span>
                      <span className={styles.metaCellValue}>{selectedVar.scope}</span>
                    </div>
                    <div className={styles.metaCell}>
                      <span className={styles.metaCellLabel}>التدقيق</span>
                      <span className={styles.metaCellValue}>
                        {selectedVar.auditRequired || linkedAudits.length > 0
                          ? `مطلوب (${linkedAudits.length} snapshot)`
                          : 'غير مطلوب'}
                      </span>
                    </div>
                    <div className={`${styles.metaCell}`} style={{ gridColumn: 'span 2' }}>
                      <span className={styles.metaCellLabel}>المعرّف التقني</span>
                      <span className={`${styles.metaCellValue} ${styles.metaCellValueCode}`} dir="ltr">
                        {selectedVar.key}
                      </span>
                    </div>
                  </div>

                  {/* Affected surfaces */}
                  {selectedVar.affectedSurfaces.length > 0 && (
                    <>
                      <span className={styles.metaCellLabel}>الأسطح المتأثرة</span>
                      <div className={styles.surfaceChipsRow}>
                        {selectedVar.affectedSurfaces.map((s) => (
                          <span key={s} className={styles.surfaceChip}>{s}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Rollback hint */}
                <div style={{ padding: '0 24px' }}>
                  <div className={styles.rollbackHint}>
                    <span className={styles.rollbackHintIcon}>↩</span>
                    <span className={styles.rollbackHintText}>{selectedVar.auditRollbackHint}</span>
                  </div>
                </div>

                {/* Scenarios */}
                {linkedScenarios.length > 0 && (
                  <div className={styles.metaSection}>
                    <span className={styles.metaSectionTitle}>سيناريوهات الأثر المرتبطة</span>
                    {linkedScenarios.map((s) => (
                      <div key={s.id} className={styles.scenarioItem}>
                        <div className={styles.scenarioTitle}>{s.title}</div>
                        <div className={styles.scenarioText}>{s.expectedImpact}</div>
                        {s.blockedReason ? (
                          <div className={styles.scenarioText} style={{ color: 'var(--bthwani-danger)' }}>
                            {s.blockedReason}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {/* Provider details */}
                {isProviderVarRecord(selectedVar) && (
                  <div className={styles.metaSection}>
                    <span className={styles.metaSectionTitle}>تفاصيل المزود</span>
                    <div className={styles.metaGrid}>
                      <div className={styles.metaCell}>
                        <span className={styles.metaCellLabel}>الأولوية</span>
                        <span className={styles.metaCellValue}>{selectedVar.priority}</span>
                      </div>
                      <div className={styles.metaCell}>
                        <span className={styles.metaCellLabel}>البديل</span>
                        <span className={styles.metaCellValue}>{selectedVar.fallback}</span>
                      </div>
                      <div className={styles.metaCell}>
                        <span className={styles.metaCellLabel}>نتيجة الفحص</span>
                        <span className={styles.metaCellValue}>{selectedVar.testResult}</span>
                      </div>
                      <div className={styles.metaCell}>
                        <span className={styles.metaCellLabel}>هدف الرجوع</span>
                        <span className={styles.metaCellValue}>{selectedVar.rollbackTarget}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformVarsWorkspace;
