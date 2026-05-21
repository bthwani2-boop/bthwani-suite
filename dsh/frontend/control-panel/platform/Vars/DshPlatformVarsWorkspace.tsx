'use client';

import React from 'react';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
import {
  DSH_PLATFORM_AUDIT_PREVIEW,
  DSH_PLATFORM_OPERATIONAL_VARS,
  DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  DSH_PLATFORM_SCOPE_PRECEDENCE,
  DSH_PLATFORM_SIMULATION_PREVIEW,
  DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
} from './vars.preview';
import type {
  DshPlatformProviderControlRecord,
  DshPlatformVarRecord,
  DshPlatformVarScope,
  DshPlatformVarStatus,
} from './vars.types';
import styles from './dsh-platform-vars.module.css';

type VarsDomainId = 'dsh' | 'wlt' | 'provider' | 'policy';

const STATUS_LABELS: Record<DshPlatformVarStatus, string> = {
  'preview-only': 'Preview only — UI',
  'contract-needed': 'Contract needed',
  'ready-for-binding': 'Ready for binding',
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
      { id: 'precedence', label: 'طبقات precedence', value: String(DSH_PLATFORM_SCOPE_PRECEDENCE.length), tone: 'neutral' as const },
      { id: 'simulation', label: 'سيناريوهات preview', value: String(DSH_PLATFORM_SIMULATION_PREVIEW.length), tone: 'warning' as const },
      { id: 'audit', label: 'مراجع audit', value: String(DSH_PLATFORM_AUDIT_PREVIEW.length), tone: 'success' as const },
      { id: 'blocked', label: 'محجوب عن mutation', value: String(blockedScenarios), tone: 'danger' as const },
    ];
  }

  const records = resolveDomainRecords(domain);
  return [
    { id: 'total', label: 'العناصر المرئية', value: String(records.length), tone: 'neutral' as const },
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
          <span className={styles.chip}>{`mutationAllowed: ${String(record.mutationAllowed)}`}</span>
        </div>
      </div>

      <div className={styles.valueGrid}>
        <div className={styles.valueCard}>
          <div className={styles.valueLabel}>current_value_label</div>
          <div className={styles.valueText}>{record.currentPreviewValue}</div>
        </div>
        <div className={styles.valueCard}>
          <div className={styles.valueLabel}>proposed_value_label</div>
          <div className={styles.valueText}>{record.proposedPreviewValue ?? 'لا يوجد proposal بعد'}</div>
        </div>
      </div>

      <div className={styles.summaryLine}>{record.effectSummary}</div>

      <div className={styles.chipRow}>
        <span className={styles.chip}>{`simulation: ${linkedScenarios.length}`}</span>
        <span className={styles.chip}>{`audit_required: ${record.auditRequired ? 'yes' : 'no'}`}</span>
        <span className={styles.chip}>{`surfaces: ${record.affectedSurfaces.length}`}</span>
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
  const [activeDomain, setActiveDomain] = React.useState<VarsDomainId>('dsh');
  const [activeScope, setActiveScope] = React.useState<string>('all');
  const [selectedVarId, setSelectedVarId] = React.useState<string | null>(DSH_PLATFORM_OPERATIONAL_VARS[0]?.id ?? null);

  React.useEffect(() => {
    setActiveScope('all');
    setSelectedVarId(resolveDomainRecords(activeDomain)[0]?.id ?? null);
  }, [activeDomain]);

  const domainRecords = sortRecordsByScope(resolveDomainRecords(activeDomain));
  const filteredRecords = activeScope === 'all'
    ? domainRecords
    : domainRecords.filter((record) => record.scope === (activeScope as DshPlatformVarScope));
  const selectedVar = filteredRecords.find((record) => record.id === selectedVarId)
    ?? filteredRecords[0]
    ?? domainRecords[0]
    ?? null;
  const scopeTabs = resolveScopeTabs(domainRecords, activeScope);
  const domainTabs = [
    { id: 'dsh', label: 'DSH operational', badge: '', active: activeDomain === 'dsh' },
    { id: 'wlt', label: 'WLT bridge', badge: '', active: activeDomain === 'wlt' },
    { id: 'provider', label: 'Provider control', badge: '', active: activeDomain === 'provider' },
    { id: 'policy', label: 'precedence + audit', badge: '', active: activeDomain === 'policy' },
  ];
  const linkedScenarios = selectedVar ? resolveLinkedScenarios(selectedVar) : [];
  const linkedAudits = selectedVar ? resolveLinkedAuditEntries(selectedVar) : [];

  return (
    <Box gap={4}>
      <WebSectionCard
        title="سياسات المتغيرات والمنفذين"
        description="مساحة قراءة وتحليل فقط. تعرض الملكية وprecedence والجسور والـ rollback preview بدون أي simulation/apply/provider switching داخل DSH."
      >
        <Box gap={4}>
          <Surface tone="warning" padding={3} radiusToken="xl" border>
            <Text role="bodySm" tone="warning" style={{ lineHeight: 1.6 }}>
              mutationAllowed = false. هذه الشاشة summary-first وتفتح التفاصيل عند الطلب فقط. أي قرار مالي يبقى في WLT، وأي provider control هنا يبقى preview/reference حتى تثبت عقود التشغيل والربط.
            </Text>
          </Surface>

          <WebControlPanelKpiStrip items={resolveDomainKpis(activeDomain)} />

          <Box gap={2}>
            <Text role="titleMd">المجال النشط</Text>
            <WebControlPanelWorkspaceTabs
              ariaLabel="المجال النشط"
              items={domainTabs}
              onSelect={(id: string) => setActiveDomain(id as VarsDomainId)}
            />
          </Box>

          {activeDomain === 'policy' ? (
            <div className={styles.policyStack}>
              <div className={styles.policySection}>
                <div className={styles.sectionTitle}>precedence lattice</div>
                <div className={styles.policyGrid}>
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
                <div className={styles.sectionTitle}>simulation preview</div>
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
                <div className={styles.sectionTitle}>audit / rollback preview</div>
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
            <>
              <Box gap={2}>
                <Text role="titleMd">طبقة النطاق</Text>
                <WebControlPanelWorkspaceTabs
                  ariaLabel="طبقة النطاق"
                  items={scopeTabs}
                  onSelect={(id: string) => setActiveScope(id)}
                />
              </Box>

              {activeDomain === 'wlt' ? (
                <Surface tone="default" padding={3} radiusToken="xl" border>
                  <Text role="bodySm" tone="muted" style={{ lineHeight: 1.6 }}>
                    جميع عناصر WLT هنا bridge-only. الشاشة تعرض current/proposed previews لمساعدة القرار داخل DSH، لكنها لا تنشئ rollback مالي ولا truth محاسبي ولا settlement mutation.
                  </Text>
                </Surface>
              ) : null}

              {activeDomain === 'provider' ? (
                <Surface tone="default" padding={3} radiusToken="xl" border>
                  <Text role="bodySm" tone="muted" style={{ lineHeight: 1.6 }}>
                    provider controls هنا مرجعية فقط: تعرض priority وfallback وtest result وrollback target من دون أي live switching.
                  </Text>
                </Surface>
              ) : null}

              <div className={styles.varsSplit}>
                <div className={styles.varsList}>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <VarCard
                        key={record.id}
                        record={record}
                        active={selectedVar?.id === record.id}
                        onSelect={() => setSelectedVarId(record.id)}
                      />
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      لا توجد عناصر لهذه الطبقة حاليًا. غيّر المجال أو طبقة precedence لمراجعة بقية السياسات.
                    </div>
                  )}
                </div>

                <div className={styles.detailPanel}>
                  {selectedVar ? (
                    <>
                      <div className={styles.detailHeader}>
                        <div className={styles.detailTitle}>{selectedVar.label}</div>
                        <div className={styles.cardCode}>{`${selectedVar.id} · ${selectedVar.key}`}</div>
                      </div>

                      <div className={styles.detailFieldGrid}>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>var_id</div>
                          <div className={styles.detailValue}>{selectedVar.id}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>var_key</div>
                          <div className={styles.detailValue}>{selectedVar.key}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>owner</div>
                          <div className={styles.detailValue}>{selectedVar.owner}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>scope</div>
                          <div className={styles.detailValue}>{selectedVar.scope}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>precedence</div>
                          <div className={styles.detailValue}>{resolvePrecedenceSummary(selectedVar)}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>current_value_label</div>
                          <div className={styles.detailValue}>{selectedVar.label}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>proposed_value_label</div>
                          <div className={styles.detailValue}>{selectedVar.proposedPreviewValue ?? 'لا يوجد proposal بعد'}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>risk</div>
                          <div className={styles.detailValue}>{RISK_LABELS[selectedVar.risk]}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>binding_status</div>
                          <div className={styles.detailValue}>{STATUS_LABELS[selectedVar.status]}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>affected_surfaces</div>
                          <div className={styles.detailValue}>{selectedVar.affectedSurfaces.join('، ')}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>audit_required</div>
                          <div className={styles.detailValue}>{resolveAuditRequirementLabel(selectedVar, linkedAudits)}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>mutation_allowed</div>
                          <div className={styles.detailValue}>{String(selectedVar.mutationAllowed)}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>current_preview</div>
                          <div className={styles.detailValue}>{selectedVar.currentPreviewValue}</div>
                        </div>
                        <div className={styles.detailField}>
                          <div className={styles.detailLabel}>proposed_preview</div>
                          <div className={styles.detailValue}>{selectedVar.proposedPreviewValue ?? 'لا يوجد proposal بعد'}</div>
                        </div>
                      </div>

                      <div className={styles.detailSection}>
                        <div className={styles.detailLabel}>provider_effect</div>
                        <div className={styles.detailValue}>{resolveProviderEffect(selectedVar)}</div>
                      </div>

                      <div className={styles.detailSection}>
                        <div className={styles.detailLabel}>simulation_impact</div>
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
                        <div className={styles.detailLabel}>rollback_preview</div>
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
                          <div className={styles.detailLabel}>provider detail</div>
                          <div className={styles.detailFieldGrid}>
                            <div className={styles.detailField}>
                              <div className={styles.detailLabel}>priority</div>
                              <div className={styles.detailValue}>{selectedVar.priority}</div>
                            </div>
                            <div className={styles.detailField}>
                              <div className={styles.detailLabel}>fallback</div>
                              <div className={styles.detailValue}>{selectedVar.fallback}</div>
                            </div>
                            <div className={styles.detailField}>
                              <div className={styles.detailLabel}>test_result</div>
                              <div className={styles.detailValue}>{selectedVar.testResult}</div>
                            </div>
                            <div className={styles.detailField}>
                              <div className={styles.detailLabel}>rollback_target</div>
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
            </>
          )}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformVarsWorkspace;
