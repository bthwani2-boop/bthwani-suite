'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
// Phase 2: DSH Flow Registry consumption — escalation flow catalog from central registry SSoT.
// DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521
import { getDshEscalationFlows } from '../../shared/dsh-flow-registry';

export type ExceptionsEscalationsScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function ExceptionsEscalationsScreen({
  hubHref: _hubHref,
  subGroup: _subGroup,
}: ExceptionsEscalationsScreenProps) {
  const preview = EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW;
  // Phase 2: registry escalation catalog — read-only reference, no mutation.
  const escalationFlowCatalog = getDshEscalationFlows();

  const summaryKpi = [
    { id: 'open', label: 'مفتوحة', value: String(preview.summary.open), tone: 'danger' as const },
    { id: 'escalate', label: 'تصعيد', value: String(preview.summary.escalate), tone: 'warning' as const },
    { id: 'resolve', label: 'حل', value: String(preview.summary.resolve), tone: 'neutral' as const },
    { id: 'close', label: 'إغلاق', value: String(preview.summary.close), tone: 'success' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>الاستثناءات والتصعيد</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box gap={2} style={{}}>
        {preview.exceptions.map((exc) => (
          <WebControlPanelDecisionRow
            key={exc.id}
            entityId={exc.id}
            entityLabel={exc.type}
            status={exc.severity}
            statusTone={TONE_MAP[exc.statusTone] ?? 'neutral'}
            risk={exc.statusTone === 'danger' ? 'danger' : exc.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={exc.suggestedAction}
            reason={exc.note}
            sla={`البداية: ${exc.startTime} | المالك: ${exc.currentOwner}`}
            primaryAction={{
              id: 'resolve',
              label: exc.resolutionPath === 'حل' ? 'حل الاستثناء' : 'تصعيد',
              onAction: () => { /* resolve/escalate — wired to live queue in Phase 3 */ },
            }}
            secondaryAction={{
              id: 'close',
              label: 'إغلاق السجل',
              onAction: () => { /* close record — wired to live queue in Phase 3 */ },
            }}
          />
        ))}
      </Box>

      {/* Phase 2: registry escalation catalog — read-only reference.
          All flows with an escalationOwner registered in the central DSH registry.
          Finance-preview flows shown as reference-only (visibility: hidden-compat, no mutation). */}
      <div className={styles.escalationCatalogSection}>
        <div className={styles.surfaceSectionHeader}>
          <h3 className={styles.surfaceSectionTitle}>
            {`سجل تدفقات التصعيد المركزي (${escalationFlowCatalog.length})`}
          </h3>
        </div>
        <Box gap={1} style={{}}>
          {escalationFlowCatalog.map((flow) => (
            <div key={flow.id} className={styles.escalationCatalogRow}>
              <span className={styles.escalationCatalogId}>{flow.id}</span>
              <span className={styles.escalationCatalogMeta}>{flow.ownerSurface}</span>
              <span className={styles.escalationCatalogDomain}>{flow.domain}</span>
              <span className={styles.escalationCatalogVisibility}>{flow.visibility}</span>
              <span className={styles.escalationCatalogPolicy}>{flow.onDemandPolicy}</span>
              {flow.financialImpact === true && (
                <span className={styles.escalationCatalogBadgeFinance}>مالي</span>
              )}
            </div>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default ExceptionsEscalationsScreen;
