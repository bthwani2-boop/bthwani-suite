// ML-052: Ops↔captain messaging workspace skeleton (same as ML-034)
// TODO: implement when CG-031 (GET/POST /dsh/ops/messaging/captain/:captainId) is proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type OpsCaptainMessagingWorkspaceProps = {
  captainId?: string;
  captainName?: string;
  orderId?: string;
};

export function OpsCaptainMessagingWorkspace({
  captainId = '—',
  captainName = 'الكابتن',
  orderId,
}: OpsCaptainMessagingWorkspaceProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>محادثة مع الكابتن</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>أوبريشن ↔ كابتن</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{captainName} — {captainId}{orderId ? ` — طلب ${orderId}` : ''}</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
              <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>واجهة الرسائل معلقة</Text>
              <Text tone="muted">سيظهر هنا سجل المحادثة مع الكابتن بعد ربط CG-031.</Text>
            </Box>
          </Box>
        </div>
      </main>
    </div>
  );
}

export default OpsCaptainMessagingWorkspace;
