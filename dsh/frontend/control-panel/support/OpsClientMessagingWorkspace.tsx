// ML-050: Ops↔client messaging workspace skeleton (same as ML-032)
// TODO: implement when CG-030 (GET/POST /dsh/ops/messaging/client/:clientId) is proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type OpsClientMessagingWorkspaceProps = {
  clientId?: string;
  clientName?: string;
  orderId?: string;
};

export function OpsClientMessagingWorkspace({
  clientId = '—',
  clientName = 'العميل',
  orderId,
}: OpsClientMessagingWorkspaceProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع العميل</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>أوبريشن ↔ عميل</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{clientName} — {clientId}{orderId ? ` — طلب ${orderId}` : ''}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
              <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>واجهة الرسائل معلقة</Text>
              <Text tone="muted">سيظهر هنا سجل المحادثة مع العميل بعد ربط CG-030.</Text>
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default OpsClientMessagingWorkspace;
