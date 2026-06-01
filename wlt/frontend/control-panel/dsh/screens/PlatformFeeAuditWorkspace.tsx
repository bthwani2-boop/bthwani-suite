// P0-07: CP platform fee audit workspace — WLT bridge, view-only.
// DSH displays WLT-owned platform fee data. No fee computation or mutation inside DSH.
import React from 'react';
import { Box, KeyValueList } from '@bthwani/ui-kit';
import styles from '../../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import { WltBoundaryBanner } from '../components/WltBoundaryBanner';
import { buildDshWltFinanceBoundaryRecord } from '../../../../../dsh/frontend/shared/dshFinancePreviewModel';

export type PlatformFeeAuditWorkspaceProps = {
  orderId?: string;
};

export function PlatformFeeAuditWorkspace({ orderId = '—' }: PlatformFeeAuditWorkspaceProps) {
  const boundaryRecord = buildDshWltFinanceBoundaryRecord({
    domain: 'platform-fee',
    contractStatus: 'pending_contract',
    affectedActor: 'عمليات DSH',
    affectedEntityId: orderId !== '—' ? orderId : undefined,
    auditVisibilityRequired: false,
  });

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>تدقيق رسوم المنصة</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>WLT — عرض فقط</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>طلب {orderId}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <WltBoundaryBanner record={boundaryRecord} />
            <KeyValueList
              items={[
                { label: 'رسوم الخدمة', value: '— WLT' },
                { label: 'رسوم التوصيل', value: '— WLT' },
                { label: 'رسوم ضريبية', value: '— WLT' },
                { label: 'الإجمالي', value: '— WLT' },
              ]}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default PlatformFeeAuditWorkspace;
