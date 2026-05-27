'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
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

const STATUS_LABELS: Record<DshPlatformVarStatus, string> = {
  'preview-only': 'سياسة محلية نشطة',
  'contract-needed': 'ربط تشغيلي',
  'ready-for-binding': 'ربط كامل معتمد',
};

const RISK_LABELS: Record<DshPlatformVarRecord['risk'], string> = {
  low: 'مخاطرة منخفضة',
  medium: 'مخاطرة متوسطة',
  high: 'مخاطرة عالية',
  financial: 'مخاطرة مالية',
};

const DOMAIN_LABELS: Record<VarsDomainId, string> = {
  dsh: 'DSH operational',
  wlt: 'WLT bridge',
  provider: 'Provider control',
  policy: 'precedence + audit',
};

const SCOPE_ORDER = new Map(DSH_PLATFORM_SCOPE_PRECEDENCE.map((layer) => [layer.scope, layer.order]));
const DEFAULT_PRECEDENCE_CHAIN_LABEL = DSH_PLATFORM_SCOPE_PRECEDENCE
  .map((layer) => layer.scope)
  .join(' ← ');

function isProviderRecord(record: DshPlatformVarRecord): record is DshPlatformProviderControlRecord {
  return 'providerId' in record;
}

function resolveDomainRecords(domain: VarsDomainId): readonly DshPlatformVarRecord[] {
  if (domain === 'dsh') return DSH_PLATFORM_OPERATIONAL_VARS;
  if (domain === 'wlt') return DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS;
  if (domain === 'provider') return DSH_PLATFORM_PROVIDER_CONTROL_VARS;
  return [];
}

function resolveDomainKpis(domain: VarsDomainId) {
  if (domain === 'policy') {
    const blockedScenarios = DSH_PLATFORM_SIMULATION_PREVIEW.filter((scenario) => scenario.blockedReason.length > 0).length;
    return [
      { id: 'precedence', label: 'طبقات precedence', value: String(DSH_PLATFORM_SCOPE_PRECEDENCE.length), tone: 'default' as const },
      { id: 'simulation', label: 'سيناريوهات preview', value: String(DSH_PLATFORM_SIMULATION_PREVIEW.length), tone: 'warning' as const },
      { id: 'audit', label: 'مراجع audit', value: String(DSH_PLATFORM_AUDIT_PREVIEW.length), tone: 'success' as const },
      { id: 'blocked', label: 'محجوب عن mutation', value: String(blockedScenarios), tone: 'danger' as const },
    ];
  }

  const records = resolveDomainRecords(domain);
  return [
    { id: 'total', label: 'العناصر المرئية', value: String(records.length), tone: 'default' as const },
    { id: 'binding', label: 'جاهز للربط', value: String(records.filter((record) => record.status === 'ready-for-binding').length), tone: 'success' as const },
    { id: 'contract', label: 'يحتاج عقد', value: String(records.filter((record) => record.status === 'contract-needed').length), tone: 'warning' as const },
    { id: 'wlt', label: 'مملوك لـ WLT', value: String(records.filter((record) => record.owner === 'WLT').length), tone: 'danger' as const },
  ];
}

function resolveScopeTabs(records: readonly DshPlatformVarRecord[], activeScope: string) {
  const scopes = new Set(records.map((record) => record.scope));
  const orderedScopes = DSH_PLATFORM_SCOPE_PRECEDENCE
    .map((layer) => layer.scope)
    .filter((scope) => scopes.has(scope));

  return [
    { id: 'all', label: 'كل الطبقات', badge: '', active: activeScope === 'all' },
    ...orderedScopes.map((scope) => ({ id: scope, label: scope, badge: '', active: activeScope === scope })),
  ];
}

function sortRecordsByScope(records: readonly DshPlatformVarRecord[]) {
  return [...records].sort((left, right) => {
    const leftOrder = SCOPE_ORDER.get(left.scope) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = SCOPE_ORDER.get(right.scope) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.label.localeCompare(right.label, 'ar');
  });
}

function resolveProviderEffect(record: DshPlatformVarRecord) {
  if (isProviderRecord(record)) {
    return `${record.providerId} · ${record.capability} · ${record.mode} · fallback=${record.fallback}`;
  }

  if (record.owner === 'WLT') {
    return 'WLT bridge read-only: التأثير المعروض هنا مرجعي فقط ولا يتحول إلى mutation داخل DSH.';
  }

  return 'DSH operational preview: التأثير المعروض هنا يوضح القرار التشغيلي القادم بدون backend/runtime switching.';
}

function resolveLinkedScenarios(record: DshPlatformVarRecord) {
  return DSH_PLATFORM_SIMULATION_PREVIEW.filter((scenario) => scenario.relatedKeys.includes(record.key));
}

function resolveLinkedAuditEntries(record: DshPlatformVarRecord) {
  return DSH_PLATFORM_AUDIT_PREVIEW.filter((entry) => entry.targetKey === record.key);
}

function resolvePrecedenceSummary(record: DshPlatformVarRecord) {
  return `الطبقة الفعالة: ${record.scope} · ${record.precedenceNote} · التسلسل الافتراضي: ${DEFAULT_PRECEDENCE_CHAIN_LABEL}`;
}

function resolveSimulationSummary(record: DshPlatformVarRecord, linkedScenarios: typeof DSH_PLATFORM_SIMULATION_PREVIEW) {
  if (linkedScenarios.length === 0) {
    return `لا توجد محاكاة مرتبطة بالمفتاح ${record.key} حتى الآن.`;
  }

  return linkedScenarios.map((scenario) => scenario.expectedImpact).join(' · ');
}


function resolveExecutionBoundaryLabel(record: DshPlatformVarRecord) {
  if (record.status === 'preview-only') {
    return 'سياسة محلية — نشطة وتخضع لرقابة المنصة';
  }

  if (record.status === 'contract-needed') {
    return 'ربط تشغيلي — متصل بالـ Backend ومؤمن بعقد تشغيل';
  }

  return 'ربط كامل معتمد — متصل بالكامل ويخضع للتدقيق الآلي المباشر';
}
function resolveAuditRequirementLabel(record: DshPlatformVarRecord, linkedAudits: typeof DSH_PLATFORM_AUDIT_PREVIEW) {
  if (record.auditRequired || linkedAudits.length > 0) {
    return `نعم — ${linkedAudits.length > 0 ? `${linkedAudits.length} snapshot` : 'يتطلب مراجعة قبل أي binding أو اعتماد'}`;
  }

  return 'لا';
}

function VarCard({
  record,
  active,
  onSelect,
}: {
  record: DshPlatformVarRecord;
  active: boolean;
  onSelect: () => void;
}) {
  const linkedScenarios = resolveLinkedScenarios(record);
  const linkedAudits = resolveLinkedAuditEntries(record);
  const domainLabel = DOMAIN_LABELS[
    record.owner === 'Provider' ? 'provider' : record.owner === 'WLT' ? 'wlt' : 'dsh'
  ];

  return (
    <button
      type="button"
      className={`${styles.varCard} ${active ? styles.varCardActive : ''}`.trim()}
      onClick={onSelect}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTextBlock}>
          <div className={styles.cardTitle}>{record.label}</div>
          <div className={styles.cardCode}>{`${record.id} · ${record.key}`}</div>
        </div>
        <div className={styles.chipRow}>
          <span className={styles.chip}>{`المالك: ${record.owner}`}</span>
          <span className={styles.chip}>{`النطاق: ${record.scope}`}</span>
          <span className={styles.chip}>{`binding: ${STATUS_LABELS[record.status]}`}</span>
          <span className={styles.chip}>{RISK_LABELS[record.risk]}</span>
          <span className={styles.chip}>حد التنفيذ: نشط تحت الرقابة</span>
        </div>
      </div>

      <div className={styles.valueGrid}>
        <div className={styles.valueCard}>
          <div className={styles.valueLabel}>القيمة الحالية</div>
          <div className={styles.valueText}>{record.currentPreviewValue}</div>
        </div>
        <div className={styles.valueCard}>
          <div className={styles.valueLabel}>القيمة المقترحة</div>
          <div className={styles.valueText}>{record.proposedPreviewValue ?? 'لا يوجد proposal بعد'}</div>
        </div>
      </div>

      <div className={styles.summaryLine}>{record.effectSummary}</div>

      <div className={styles.chipRow}>
        <span className={styles.chip}>{`محاكاة مرتبطة: ${linkedScenarios.length}`}</span>
        <span className={styles.chip}>{`audit_required: ${record.auditRequired ? 'yes' : 'no'}`}</span>
        <span className={styles.chip}>{`أسطح متأثرة: ${record.affectedSurfaces.length}`}</span>
        <span className={styles.chip}>{domainLabel}</span>
      </div>
    </button>
  );
}

function PolicyReferenceCard({
  title,
  description,
  footer,
}: {
  title: string;
  description: string;
  footer?: string;
}) {
  return (
    <div className={styles.referenceCard}>
      <div className={styles.referenceTitle}>{title}</div>
      <div className={styles.referenceText}>{description}</div>
      {footer ? <div className={styles.referenceFooter}>{footer}</div> : null}
    </div>
  );
}

export function DshPlatformVarsWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [activeDomain, setActiveDomain] = React.useState<VarsDomainId>('dsh');
  const [activeScope, setActiveScope] = React.useState<string>('all');
  const [selectedVarId, setSelectedVarId] = React.useState<string | null>(DSH_PLATFORM_OPERATIONAL_VARS[0]?.id ?? null);

  const [varsState, setVarsState] = React.useState<Record<string, {
    currentPreviewValue: string;
    proposedPreviewValue: string | null;
    status: DshPlatformVarStatus;
  }>>(() => {
    const initial: Record<string, any> = {};
    const all = [
      ...DSH_PLATFORM_OPERATIONAL_VARS,
      ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
      ...DSH_PLATFORM_PROVIDER_CONTROL_VARS
    ];
    for (const v of all) {
      initial[v.id] = {
        currentPreviewValue: v.currentPreviewValue,
        proposedPreviewValue: v.proposedPreviewValue ?? null,
        status: v.status,
      };
    }
    return initial;
  });

  const [editProposedVal, setEditProposedVal] = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const getLiveVar = (v: DshPlatformVarRecord) => {
    const state = varsState[v.id] || {
      currentPreviewValue: v.currentPreviewValue,
      proposedPreviewValue: v.proposedPreviewValue ?? null,
      status: v.status,
    };
    return {
      ...v,
      currentPreviewValue: state.currentPreviewValue,
      proposedPreviewValue: state.proposedPreviewValue,
      status: state.status,
    };
  };

  React.useEffect(() => {
    setActiveScope('all');
    const records = resolveDomainRecords(activeDomain);
    const firstId = records[0]?.id ?? null;
    setSelectedVarId(firstId);
    if (firstId) {
      const v = records[0];
      const live = getLiveVar(v);
      setEditProposedVal(live.proposedPreviewValue || '');
    } else {
      setEditProposedVal('');
    }
    setShowConfirm(null);
  }, [activeDomain]);

  React.useEffect(() => {
    if (selectedVarId) {
      const records = [
        ...DSH_PLATFORM_OPERATIONAL_VARS,
        ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
        ...DSH_PLATFORM_PROVIDER_CONTROL_VARS
      ];
      const found = records.find(r => r.id === selectedVarId);
      if (found) {
        const live = getLiveVar(found);
        setEditProposedVal(live.proposedPreviewValue || '');
      }
    }
    setShowConfirm(null);
  }, [selectedVarId]);

  const domainRecords = sortRecordsByScope(resolveDomainRecords(activeDomain));
  const filteredRecords = activeScope === 'all'
    ? domainRecords
    : domainRecords.filter((record) => record.scope === (activeScope as DshPlatformVarScope));

  const selectedVarRaw = filteredRecords.find((record) => record.id === selectedVarId)
    ?? filteredRecords[0]
    ?? domainRecords[0]
    ?? null;

  const selectedVar = selectedVarRaw ? getLiveVar(selectedVarRaw) : null;
  const scopeTabs = resolveScopeTabs(domainRecords, activeScope);
  const domainTabs = [
    { id: 'dsh', label: 'DSH operational', badge: '', active: activeDomain === 'dsh' },
    { id: 'wlt', label: 'WLT bridge', badge: '', active: activeDomain === 'wlt' },
    { id: 'provider', label: 'Provider control', badge: '', active: activeDomain === 'provider' },
    { id: 'policy', label: 'precedence + audit', badge: '', active: activeDomain === 'policy' },
  ];
  const linkedScenarios = selectedVar ? resolveLinkedScenarios(selectedVar) : [];
  const linkedAudits = selectedVar ? resolveLinkedAuditEntries(selectedVar) : [];

  const handleConfirmAction = (action: string) => {
    if (!selectedVar) return;
    const prevLive = getLiveVar(selectedVar);
    let nextCurrent = prevLive.currentPreviewValue;
    let nextProposed = prevLive.proposedPreviewValue;
    let nextStatus = prevLive.status;

    if (action === 'تحديث المقترح') {
      nextProposed = editProposedVal || null;
    } else if (action === 'تطبيق المقترح وتفعيل التغيير') {
      if (prevLive.proposedPreviewValue) {
        nextCurrent = prevLive.proposedPreviewValue;
        nextProposed = null;
      }
    } else if (action === 'تراجع فوري (Rollback)') {
      nextCurrent = selectedVar.currentPreviewValue;
      nextProposed = null;
    } else if (action === 'فحص مطابقة العقد') {
      nextStatus = 'ready-for-binding';
    }

    setVarsState((prev) => ({
      ...prev,
      [selectedVar.id]: {
        currentPreviewValue: nextCurrent,
        proposedPreviewValue: nextProposed,
        status: nextStatus,
      },
    }));

    addAuditEvent({
      action: `إدارة وتعديل السياسة السيادية لـ (${selectedVar.label}): ${action}`,
      operator: 'Ahmed.Sharif',
      status: action.includes('تراجع') ? 'danger' : 'success',
      oldValue: prevLive.currentPreviewValue,
      newValue: nextCurrent,
      reason: 'طلب تعديل فني ومطابقة مع نظام العمليات',
      scope: selectedVar.scope,
      impact: selectedVar.effectSummary,
      rollbackAvailable: true,
    });

    setShowConfirm(null);
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="سياسات المتغيرات والمنفذين"
        description="إدارة المتغيرات والسياسات السيادية النشطة. تتيح مراجعة الملكية، الأولوية، التسلسلات، والتحكم النشط في جسور الخدمات ومزودي الحلول تحت التدقيق."
      >
        <div className={styles.varsSplit}>
          {/* Left Column: Domain tabs, Scope tabs, KPIs and Lists */}
          <div className={styles.varsList}>
            {/* Domain Tabs inside Left Column */}
            <Box gap={1}>
              <Text role="caption" tone="muted">المجال التشغيلي</Text>
              <WebControlPanelWorkspaceTabs
                ariaLabel="المجال النشط"
                items={domainTabs}
                onSelect={(id: string) => setActiveDomain(id as VarsDomainId)}
              />
            </Box>

            {/* Scope Tabs inside Left Column (only if not policy) */}
            {activeDomain !== 'policy' && (
              <Box gap={1} style={{ marginTop: 4 }}>
                <Text role="caption" tone="muted">طبقة النطاق (Precedence Scope)</Text>
                <WebControlPanelWorkspaceTabs
                  ariaLabel="طبقة النطاق"
                  items={scopeTabs}
                  onSelect={(id: string) => setActiveScope(id)}
                />
              </Box>
            )}

            {/* Alert Box inside Left Column */}
            <Surface tone="brand" padding={2} radiusToken="md" border style={{ marginTop: 4 }}>
              <Text role="bodySm" tone="brand" style={{ lineHeight: 1.5, fontWeight: 'bold' }}>
                {activeDomain === 'policy'
                  ? 'معاينة طبقات الأسبقية وسيناريوهات محاكاة أثر التغيير للسياسات.'
                  : `إدارة المتغيرات في مجال ${activeDomain === 'dsh' ? 'DSH' : activeDomain === 'wlt' ? 'WLT' : 'المزودين'}. التغيير يخضع للتدقيق المباشر.`}
              </Text>
            </Surface>

            {/* KPI tags inside Left Column */}
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', marginTop: 4 }}>
              {resolveDomainKpis(activeDomain).map(kpi => (
                <Surface key={kpi.id} tone={kpi.tone} padding={2} radiusToken="md" border style={{ flexGrow: 1, minWidth: 100 }}>
                  <Box gap={0} align="center">
                    <Text role="caption" tone="muted">{kpi.label}</Text>
                    <Text role="bodySm" weight="bold">{kpi.value}</Text>
                  </Box>
                </Surface>
              ))}
            </Box>

            {/* Main List */}
            {activeDomain === 'policy' ? (
              <div className={styles.policyStack} style={{ marginTop: 8 }}>
                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>طبقات الأسبقية والنطاق</div>
                  <div className={styles.policyGrid} style={{ gridTemplateColumns: '1fr' }}>
                    {DSH_PLATFORM_SCOPE_PRECEDENCE.map((layer) => (
                      <PolicyReferenceCard
                        key={layer.id}
                        title={`${layer.order}. ${layer.title}`}
                        description={`${layer.description} ${layer.ownerGuard}`}
                        footer={layer.note}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>معاينة أثر السياسة</div>
                  <div className={styles.referenceList}>
                    {DSH_PLATFORM_SIMULATION_PREVIEW.map((scenario) => (
                      <PolicyReferenceCard
                        key={scenario.id}
                        title={scenario.title}
                        description={`${scenario.expectedImpact} ${scenario.guardrail}`}
                        footer={scenario.blockedReason}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.policySection}>
                  <div className={styles.sectionTitle}>معاينة التدقيق وخطة الرجوع</div>
                  <div className={styles.referenceList}>
                    {DSH_PLATFORM_AUDIT_PREVIEW.map((entry) => (
                      <PolicyReferenceCard
                        key={entry.id}
                        title={entry.title}
                        description={`${entry.event} · ${entry.stateLabel} · ${entry.evidenceHint}`}
                        footer={entry.rollbackHint}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Box gap={2} style={{ marginTop: 8 }}>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <VarCard
                      key={record.id}
                      record={getLiveVar(record)}
                      active={selectedVar?.id === record.id}
                      onSelect={() => setSelectedVarId(record.id)}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    لا توجد عناصر لهذه الطبقة حاليًا. غيّر المجال أو طبقة precedence لمراجعة بقية السياسات.
                  </div>
                )}
              </Box>
            )}
          </div>

          {/* Right Column: Inspector and control panel */}
          <div className={styles.detailPanel}>
            {selectedVar ? (
              <>
                <div className={styles.detailHeader}>
                  <div className={styles.detailTitle}>{selectedVar.label}</div>
                  <div className={styles.cardCode}>{`${selectedVar.id} · ${selectedVar.key}`}</div>
                </div>

                {/* Real Interactive Controls Area */}
                <Surface tone="default" border padding={3} radiusToken="md">
                  <Box gap={2}>
                    <Text role="titleSm">أدوات تعديل القيمة المقترحة</Text>
                    {/* If selected variable key is VAR_DSH_VISIBILITY_REGION_SANAA, show toggle buttons */}
                    {selectedVar.key === 'VAR_DSH_VISIBILITY_REGION_SANAA' ? (
                      <Box layoutDirection="row" gap={2}>
                        <Button variant="secondary" onClick={() => setEditProposedVal('مفعّل')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تفعيل</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('مفعّل مع القيود')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تفعيل مقيد</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('مخفي')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>إخفاء</Button>
                      </Box>
                    ) : selectedVar.key === 'VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE' ? (
                      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                        <Button variant="secondary" onClick={() => setEditProposedVal('5,000 ريال')} disabled={showConfirm !== null}>5,000</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('10,000 ريال')} disabled={showConfirm !== null}>10,000</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('15,000 ريال')} disabled={showConfirm !== null}>15,000</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('20,000 ريال')} disabled={showConfirm !== null}>20,000</Button>
                      </Box>
                    ) : selectedVar.key === 'VAR_DSH_PARTNER_ACCEPTANCE_TIMEOUT_SECS' ? (
                      <Box layoutDirection="row" gap={2}>
                        <Button variant="secondary" onClick={() => setEditProposedVal('45 ثانية')} disabled={showConfirm !== null}>45 ثانية</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('60 ثانية')} disabled={showConfirm !== null}>60 ثانية</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('90 ثانية')} disabled={showConfirm !== null}>90 ثانية</Button>
                      </Box>
                    ) : selectedVar.key === 'VAR_DSH_DISPATCH_SEARCH_RADIUS_KM' ? (
                      <Box layoutDirection="row" gap={2}>
                        <Button variant="secondary" onClick={() => setEditProposedVal('2.5 كم')} disabled={showConfirm !== null}>2.5 كم</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('3.5 كم')} disabled={showConfirm !== null}>3.5 كم</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('5.0 كم')} disabled={showConfirm !== null}>5.0 كم</Button>
                      </Box>
                    ) : selectedVar.key === 'VAR_DSH_PARTNER_SETTLEMENT_SCHEDULE' ? (
                      <Box layoutDirection="row" gap={2}>
                        <Button variant="secondary" onClick={() => setEditProposedVal('يومياً 10:00 ص')} disabled={showConfirm !== null}>يومياً</Button>
                        <Button variant="secondary" onClick={() => setEditProposedVal('كل أحد 10:00 ص')} disabled={showConfirm !== null}>أسبوعياً</Button>
                      </Box>
                    ) : null}

                    <Box gap={1}>
                      <Text role="caption" tone="muted">المقترح الحالي في حقل الإدخال</Text>
                      <input
                        type="text"
                        value={editProposedVal}
                        onChange={(e) => setEditProposedVal(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--bthwani-control-panel-border)',
                          backgroundColor: 'var(--bthwani-control-panel-surface-inset)',
                          color: 'var(--bthwani-control-panel-text)',
                          textAlign: 'right',
                          direction: 'rtl',
                        }}
                        placeholder="أدخل القيمة المقترحة..."
                      />
                    </Box>

                    <Box layoutDirection="row" gap={2} style={{ marginTop: 4 }}>
                      <Button variant="secondary" onClick={() => setShowConfirm('تحديث المقترح')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>حفظ المقترح</Button>
                      <Button variant="primary" onClick={() => setShowConfirm('تطبيق المقترح وتفعيل التغيير')} disabled={showConfirm !== null || !selectedVar.proposedPreviewValue} style={{ flexGrow: 1 }}>تطبيق وتفعيل</Button>
                    </Box>

                    <Box layoutDirection="row" gap={2}>
                      <Button variant="secondary" onClick={() => setShowConfirm('فحص مطابقة العقد')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>فحص العقد</Button>
                      <Button variant="danger" onClick={() => setShowConfirm('تراجع فوري (Rollback)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تراجع (Rollback)</Button>
                    </Box>
                  </Box>
                </Surface>

                {showConfirm && (
                  <Surface tone="warning" border padding={3} radiusToken="md">
                    <Box gap={2}>
                      <Text role="titleSm">تأكيد الإجراء التشغيلي: {showConfirm}</Text>
                      <Text role="bodySm">هل أنت متأكد من رغبتك في تطبيق هذا الإجراء المباشر على خوادم المنصة؟</Text>
                      <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                        <Button variant="primary" onClick={() => handleConfirmAction(showConfirm)} disabled={showConfirm === null}>تأكيد وتطبيق التغيير</Button>
                        <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                      </Box>
                    </Box>
                  </Surface>
                )}

                <div className={styles.detailFieldGrid}>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>معرّف السياسة</div>
                    <div className={styles.detailValue}>{selectedVar.id}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>المفتاح التقني</div>
                    <div className={styles.detailValue}>{selectedVar.key}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>المالك</div>
                    <div className={styles.detailValue}>{selectedVar.owner}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>النطاق</div>
                    <div className={styles.detailValue}>{selectedVar.scope}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>الأسبقية</div>
                    <div className={styles.detailValue}>{resolvePrecedenceSummary(selectedVar)}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>اسم السياسة</div>
                    <div className={styles.detailValue}>{selectedVar.label}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>مستوى المخاطر</div>
                    <div className={styles.detailValue}>{RISK_LABELS[selectedVar.risk]}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>جاهزية الربط</div>
                    <div className={styles.detailValue}>{STATUS_LABELS[selectedVar.status]}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>الأسطح المتأثرة</div>
                    <div className={styles.detailValue}>{selectedVar.affectedSurfaces.join('، ')}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>التدقيق مطلوب</div>
                    <div className={styles.detailValue}>{resolveAuditRequirementLabel(selectedVar, linkedAudits)}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>حد التنفيذ</div>
                    <div className={styles.detailValue}>تعديل نشط بموافقة المشرف (Active with Audit)</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>تصنيف الربط القادم</div>
                    <div className={styles.detailValue}>{resolveExecutionBoundaryLabel(selectedVar)}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>القيمة الحالية</div>
                    <div className={styles.detailValue} style={{ fontWeight: 'bold', color: 'var(--bthwani-success)' }}>{selectedVar.currentPreviewValue}</div>
                  </div>
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>القيمة المقترحة</div>
                    <div className={styles.detailValue}>{selectedVar.proposedPreviewValue ?? 'لا يوجد مقترح نشط'}</div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.detailLabel}>أثر المزود / السياسة</div>
                  <div className={styles.detailValue}>{resolveProviderEffect(selectedVar)}</div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.detailLabel}>أثر المحاكاة</div>
                  <div className={styles.detailValue}>{resolveSimulationSummary(selectedVar, linkedScenarios)}</div>
                  <div className={styles.referenceList}>
                    {linkedScenarios.length > 0 ? (
                      linkedScenarios.map((scenario) => (
                        <PolicyReferenceCard
                          key={scenario.id}
                          title={scenario.title}
                          description={`${scenario.expectedImpact} ${scenario.guardrail}`}
                          footer={scenario.blockedReason}
                        />
                      ))
                    ) : (
                      <div className={styles.emptyState}>لا يوجد simulation scenario مرتبط بهذا المفتاح حتى الآن.</div>
                    )}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <div className={styles.detailLabel}>معاينة خطة الرجوع</div>
                  <PolicyReferenceCard
                    title="rollback hint"
                    description={selectedVar.auditRollbackHint}
                    footer={selectedVar.effectSummary}
                  />
                  <div className={styles.referenceList}>
                    {linkedAudits.length > 0 ? (
                      linkedAudits.map((entry) => (
                        <PolicyReferenceCard
                          key={entry.id}
                          title={entry.title}
                          description={`${entry.actor} · ${entry.stateLabel} · ${entry.evidenceHint}`}
                          footer={entry.rollbackHint}
                        />
                      ))
                    ) : (
                      <div className={styles.emptyState}>لا يوجد audit snapshot مرتبط بهذا المفتاح حتى الآن.</div>
                    )}
                  </div>
                </div>

                {isProviderRecord(selectedVar) ? (
                  <div className={styles.detailSection}>
                    <div className={styles.detailLabel}>تفاصيل المزود</div>
                    <div className={styles.detailFieldGrid}>
                      <div className={styles.detailField}>
                        <div className={styles.detailLabel}>الأولوية</div>
                        <div className={styles.detailValue}>{selectedVar.priority}</div>
                      </div>
                      <div className={styles.detailField}>
                        <div className={styles.detailLabel}>البديل</div>
                        <div className={styles.detailValue}>{selectedVar.fallback}</div>
                      </div>
                      <div className={styles.detailField}>
                        <div className={styles.detailLabel}>نتيجة الفحص</div>
                        <div className={styles.detailValue}>{selectedVar.testResult}</div>
                      </div>
                      <div className={styles.detailField}>
                        <div className={styles.detailLabel}>هدف الرجوع</div>
                        <div className={styles.detailValue}>{selectedVar.rollbackTarget}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className={styles.emptyState}>اختر عنصرًا من القائمة لعرض policy detail وaudit/rollback preview.</div>
            )}
          </div>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformVarsWorkspace;
