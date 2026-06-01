// P0-07: CP field agent commission workspace — WLT bridge, view-only.
// DSH displays WLT-owned field commission data. No commission computation or payout mutation inside DSH.
// Field agents collect evidence only — no financial activation or settlement from this surface.
import React from 'react';
import { Box, KeyValueList } from '@bthwani/ui-kit';
import styles from '../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import { WltBoundaryBanner } from './WltBoundaryBanner';
import { buildDshWltFinanceBoundaryRecord } from '../../../../dsh/frontend/shared/dshFinancePreviewModel';

export type FieldCommissionWorkspaceProps = {
  fieldAgentId?: string;
  fieldAgentName?: string;
};

export function FieldCommissionWorkspace({
  fieldAgentId = '—',
  fieldAgentName = 'الميداني',
}: FieldCommissionWorkspaceProps) {
  const boundaryRecord = buildDshWltFinanceBoundaryRecord({
    domain: 'field-commission',
    contractStatus: 'pending_contract',
    affectedActor: fieldAgentName,
    affectedEntityId: fieldAgentId !== '—' ? fieldAgentId : undefined,
    auditVisibilityRequired: false,
  });

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>عمولة الميداني</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>WLT — عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{fieldAgentName} — {fieldAgentId}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <WltBoundaryBanner record={boundaryRecord} />
            <KeyValueList
              items={[
                { label: 'إجمالي التفعيلات', value: '— WLT' },
                { label: 'العمولة لكل تفعيل', value: '— WLT' },
                { label: 'إجمالي المكتسب', value: '— WLT' },
                { label: 'المصروف', value: '— WLT' },
              ]}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default FieldCommissionWorkspace;
