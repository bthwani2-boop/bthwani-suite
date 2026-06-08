'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';
import {
  DSH_PLATFORM_AUDIT_PREVIEW,
  DSH_PLATFORM_OPERATIONAL_VARS,
  DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  DSH_PLATFORM_SCOPE_PRECEDENCE,
  DSH_PLATFORM_SIMULATION_PREVIEW,
  DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
} from '../../../data/platform.preview-data';
import type {
  DshPlatformProviderControlRecord,
  DshPlatformVarRecord,
  DshPlatformVarScope,
  DshPlatformVarStatus,
} from './vars.types';
import styles from './dsh-platform-vars.module.css';

type VarsDomainId = 'dsh' | 'wlt' | 'provider' | 'policy';

const DOMAIN_TABS: { id: VarsDomainId; label: string }[] = [
  { id: 'dsh',      label: 'عمليات DSH' },
  { id: 'wlt',      label: 'جسر WLT' },
  { id: 'provider', label: 'المزودين' },
  { id: 'policy',   label: 'الأسبقية' },
];

const STATUS_BADGE: Record<DshPlatformVarStatus, { label: string; cls: string }> = {
  'ready-for-binding': { label: 'جاهز للربط', cls: styles.badgeBinding },
  'contract-needed':   { label: 'يحتاج عقد',  cls: styles.badgeContract },
  'preview-only':      { label: 'معاينة فقط', cls: styles.badgePreview  },
};

const RISK_DOT: Record<DshPlatformVarRecord['risk'], string> = {
  low:       styles.riskLow,
  medium:    styles.riskMedium,
  high:      styles.riskHigh,
  financial: styles.riskFinancial,
};

const RISK_LABEL: Record<DshPlatformVarRecord['risk'], string> = {
  low:       'منخفضة',
  medium:    'متوسطة',
  high:      'عالية',
  financial: 'مالية',
};

const STATUS_LABEL: Record<DshPlatformVarStatus, string> = {
  'ready-for-binding': 'جاهز للربط الفني',
  'contract-needed':   'بانتظار عقد Backend',
  'preview-only':      'معاينة محلية فقط',
};

const SCOPE_ORDER = new Map(DSH_PLATFORM_SCOPE_PRECEDENCE.map((l) => [l.scope, l.order]));

function isProviderRecord(r: DshPlatformVarRecord): r is DshPlatformProviderControlRecord {
  return 'providerId' in r;
}

function resolveDomainRecords(domain: VarsDomainId): readonly DshPlatformVarRecord[] {
  if (domain === 'dsh')      return DSH_PLATFORM_OPERATIONAL_VARS;
  if (domain === 'wlt')      return DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS;
  if (domain === 'provider') return DSH_PLATFORM_PROVIDER_CONTROL_VARS;
  return [];
}

function sortByScope(records: readonly DshPlatformVarRecord[]): DshPlatformVarRecord[] {
  return [...records].sort((a, b) => {
    const ao = SCOPE_ORDER.get(a.scope) ?? 999;
    const bo = SCOPE_ORDER.get(b.scope) ?? 999;
    return ao !== bo ? ao - bo : a.label.localeCompare(b.label, 'ar');
  });
}

function resolveDomainKpis(domain: VarsDomainId) {
  if (domain === 'policy') {
    const blocked = DSH_PLATFORM_SIMULATION_PREVIEW.filter((s) => s.blockedReason.length > 0).length;
    return [
      { id: 'p', label: 'طبقات', value: String(DSH_PLATFORM_SCOPE_PRECEDENCE.length), cls: '' },
      { id: 's', label: 'سيناريوهات', value: String(DSH_PLATFORM_SIMULATION_PREVIEW.length), cls: styles.kpiCellWarning },
      { id: 'a', label: 'تدقيق', value: String(DSH_PLATFORM_AUDIT_PREVIEW.length), cls: styles.kpiCellSuccess },
      { id: 'b', label: 'محجوب', value: String(blocked), cls: styles.kpiCellDanger },
    ];
  }
  const records = resolveDomainRecords(domain);
  return [
    { id: 'total',    label: 'إجمالي',    value: String(records.length),                                                                         cls: '' },
    { id: 'binding',  label: 'جاهز',      value: String(records.filter((r) => r.status === 'ready-for-binding').length),                          cls: styles.kpiCellSuccess },
    { id: 'contract', label: 'يحتاج عقد', value: String(records.filter((r) => r.status === 'contract-needed').length),                            cls: styles.kpiCellWarning },
    { id: 'wlt',      label: 'WLT',        value: String(records.filter((r) => r.owner === 'WLT').length),                                         cls: styles.kpiCellDanger },
  ];
}

/* ─── QUICK-PICK OPTIONS PER VAR KEY ─── */
const QUICK_PICKS: Record<string, string[]> = {
  VAR_DSH_VISIBILITY_REGION_SANAA:        ['مفعّل', 'مفعّل مع القيود', 'مخفي'],
  VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE:     ['5,000 ريال', '10,000 ريال', '15,000 ريال', '20,000 ريال'],
  VAR_DSH_PARTNER_ACCEPTANCE_TIMEOUT_SECS:['45 ثانية', '60 ثانية', '90 ثانية'],
  VAR_DSH_DISPATCH_SEARCH_RADIUS_KM:      ['2.5 كم', '3.5 كم', '5.0 كم'],
  VAR_DSH_PARTNER_SETTLEMENT_SCHEDULE:    ['يومياً 10:00 ص', 'كل أحد 10:00 ص', 'كل ثلاثاء 10:00 ص'],
};

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
        <span className={styles.varRowValuePreview}>{record.currentPreviewValue}</span>
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
export function DshPlatformVarsWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();

  const [activeDomain, setActiveDomain] = React.useState<VarsDomainId>('dsh');
  const [activeScope,  setActiveScope]  = React.useState<string>('all');
  const [selectedId,   setSelectedId]   = React.useState<string | null>(
    DSH_PLATFORM_OPERATIONAL_VARS[0]?.id ?? null
  );

  const [varsState, setVarsState] = React.useState<
    Record<string, { current: string; proposed: string | null; status: DshPlatformVarStatus }>
  >(() => {
    const init: Record<string, any> = {};
    const all = [
      ...DSH_PLATFORM_OPERATIONAL_VARS,
      ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
      ...DSH_PLATFORM_PROVIDER_CONTROL_VARS,
    ];
    for (const v of all) {
      init[v.id] = {
        current:  v.currentPreviewValue,
        proposed: v.proposedPreviewValue ?? null,
        status:   v.status,
      };
    }
    return init;
  });

  const [editVal,     setEditVal]     = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const getLive = (v: DshPlatformVarRecord) => {
    const s = varsState[v.id];
    if (!s) return { ...v, currentPreviewValue: v.currentPreviewValue, proposedPreviewValue: v.proposedPreviewValue ?? null };
    return { ...v, currentPreviewValue: s.current, proposedPreviewValue: s.proposed };
  };

  /* reset on domain change */
  React.useEffect(() => {
    setActiveScope('all');
    setShowConfirm(null);
    const records = resolveDomainRecords(activeDomain);
    const first = records[0] ?? null;
    setSelectedId(first?.id ?? null);
    if (first) {
      const live = getLive(first);
      setEditVal(live.proposedPreviewValue ?? '');
    } else {
      setEditVal('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  /* reset on var change */
  React.useEffect(() => {
    setShowConfirm(null);
    if (!selectedId) return;
    const all = [
      ...DSH_PLATFORM_OPERATIONAL_VARS,
      ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
      ...DSH_PLATFORM_PROVIDER_CONTROL_VARS,
    ];
    const found = all.find((r) => r.id === selectedId);
    if (found) {
      const live = getLive(found);
      setEditVal(live.proposedPreviewValue ?? '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const domainRecords   = sortByScope(resolveDomainRecords(activeDomain));
  const filteredRecords = activeScope === 'all'
    ? domainRecords
    : domainRecords.filter((r) => r.scope === (activeScope as DshPlatformVarScope));

  const rawSelected  = filteredRecords.find((r) => r.id === selectedId) ?? filteredRecords[0] ?? domainRecords[0] ?? null;
  const selectedVar  = rawSelected ? getLive(rawSelected) : null;

  const scopes = Array.from(new Set(domainRecords.map((r) => r.scope)));
  const orderedScopes = DSH_PLATFORM_SCOPE_PRECEDENCE.map((l) => l.scope).filter((s) => scopes.includes(s));

  const linkedScenarios = selectedVar ? DSH_PLATFORM_SIMULATION_PREVIEW.filter((s) => s.relatedKeys.includes(selectedVar.key)) : [];
  const linkedAudits    = selectedVar ? DSH_PLATFORM_AUDIT_PREVIEW.filter((e) => e.targetKey === selectedVar.key) : [];
  const kpis            = resolveDomainKpis(activeDomain);
  const quickPicks      = selectedVar ? (QUICK_PICKS[selectedVar.key] ?? []) : [];

  const handleConfirm = (action: string) => {
    if (!selectedVar) return;
    const prev = varsState[selectedVar.id] ?? {
      current: selectedVar.currentPreviewValue, proposed: selectedVar.proposedPreviewValue ?? null, status: selectedVar.status,
    };

    let nextCurrent  = prev.current;
    let nextProposed = prev.proposed;
    let nextStatus   = prev.status;

    if (action === 'save-proposed') {
      nextProposed = editVal || null;
    } else if (action === 'apply') {
      if (prev.proposed) { nextCurrent = prev.proposed; nextProposed = null; }
    } else if (action === 'rollback') {
      nextCurrent = selectedVar.currentPreviewValue;
      nextProposed = null;
    } else if (action === 'simulate-contract') {
      nextStatus = 'ready-for-binding';
    }

    setVarsState((prev) => ({
      ...prev,
      [selectedVar.id]: { current: nextCurrent, proposed: nextProposed, status: nextStatus },
    }));
    addAuditEvent({
      action: `تعديل معاينة (${selectedVar.label}): ${action}`,
      operator: 'Ahmed.Sharif',
      status: action === 'rollback' ? 'danger' : 'success',
      oldValue: prev.current,
      newValue: nextCurrent,
      reason: 'محاكاة مسار المعاينة المحلية',
      scope: selectedVar.scope,
      impact: selectedVar.effectSummary,
      rollbackAvailable: true,
    });
    setShowConfirm(null);
  };

  const hasProposed = Boolean(selectedVar?.proposedPreviewValue);

  return (
    <Box gap={4}>
      <WebSectionCard
        title="إدارة المتغيرات والسياسات"
        description="مراجعة وتعديل سياسات المنصة ومتغيراتها التشغيلية. كل تغيير يخضع للتدقيق ولا يُطبَّق على الخوادم الحية."
      >
        <div className={styles.varsSplit}>

          {/* ─── LEFT RAIL ─── */}
          <div className={styles.varsList}>

            {/* Domain tab bar */}
            <div className={styles.domainTabBar}>
              {DOMAIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.domainTab} ${activeDomain === tab.id ? styles.domainTabActive : ''}`.trim()}
                  onClick={() => setActiveDomain(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

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
                    {DSH_PLATFORM_SIMULATION_PREVIEW.map((s) => (
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
                    {DSH_PLATFORM_AUDIT_PREVIEW.map((e) => (
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
                    <span className={styles.valueBoxNumber}>{selectedVar.currentPreviewValue}</span>
                  </div>
                  <div className={styles.valueArrow}>←</div>
                  <div className={`${styles.valueBox} ${hasProposed ? styles.valueBoxActive : ''}`.trim()}>
                    <span className={styles.valueBoxLabel}>المقترح</span>
                    {hasProposed ? (
                      <span className={`${styles.valueBoxNumber} ${styles.valueBoxNumberNew}`}>
                        {selectedVar.proposedPreviewValue}
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

                  <input
                    type="text"
                    className={styles.valueInput}
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    placeholder="أو اكتب قيمة مخصصة..."
                    disabled={showConfirm !== null}
                  />

                  {/* Action bar */}
                  <div className={styles.actionBar}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      disabled={showConfirm !== null}
                      onClick={() => setShowConfirm('save-proposed')}
                    >
                      حفظ المقترح
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      disabled={showConfirm !== null || !hasProposed}
                      onClick={() => setShowConfirm('apply')}
                    >
                      تطبيق المقترح ←
                    </button>
                  </div>

                  <div className={styles.actionBar}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      disabled={showConfirm !== null}
                      onClick={() => setShowConfirm('simulate-contract')}
                    >
                      محاكاة مطابقة العقد
                    </button>
                    <button
                      type="button"
                      className={styles.btnDanger}
                      disabled={showConfirm !== null}
                      onClick={() => setShowConfirm('rollback')}
                    >
                      تراجع عن المعاينة
                    </button>
                  </div>
                </div>

                {/* Confirm banner */}
                {showConfirm && (
                  <div className={styles.confirmBanner}>
                    <div className={styles.confirmText}>
                      {showConfirm === 'apply'
                        ? `تطبيق "${selectedVar.proposedPreviewValue}" كقيمة حالية في المعاينة — هذا تغيير محلي فقط وليس تحديثاً للخوادم.`
                        : showConfirm === 'rollback'
                        ? 'التراجع عن المعاينة وإعادة القيمة إلى حالتها الأصلية.'
                        : showConfirm === 'simulate-contract'
                        ? 'محاكاة مطابقة العقد — سيتغير الوضع إلى "جاهز للربط الفني".'
                        : 'حفظ القيمة المقترحة في حقل المعاينة.'}
                    </div>
                    <div className={styles.confirmActions}>
                      <button type="button" className={styles.btnPrimary} onClick={() => handleConfirm(showConfirm)}>
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
                {isProviderRecord(selectedVar) && (
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
