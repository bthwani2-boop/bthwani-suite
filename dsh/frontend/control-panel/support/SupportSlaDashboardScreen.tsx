// ML-048: CP support SLA dashboard screen skeleton
// ML-035: AuditTrailDetailPanel wired here as the audit surface for SLA events
// BLOCKED_BY_CONTRACT: populate with real SLA metrics once CG-032 READ+STREAM is proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlPanelKpiStrip } from '@bthwani/ui-kit/web';
import { AuditTrailDetailPanel } from './AuditTrailDetailPanel';
import styles from '../shared/control-panel-surface.module.css';

export function SupportSlaDashboardScreen() {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>لوحة SLA للدعم</h1>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>مراقبة مستويات الخدمة عبر جميع التذاكر</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={4}>
            <WebControlPanelKpiStrip
              items={[
                { id: 'within-sla', label: 'ضمن SLA', value: '—', tone: 'success' },
                { id: 'breach-risk', label: 'خطر انتهاك', value: '—', tone: 'warning' },
                { id: 'breached', label: 'منتهك', value: '—', tone: 'danger' },
                { id: 'avg-resolve', label: 'متوسط الحل', value: '—', tone: 'neutral' },
              ]}
            />
            <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
              <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>بيانات SLA معلقة</Text>
              <Text tone="muted">سيتم ملء هذه اللوحة بعد ربط CG-032 لمقاييس SLA.</Text>
            </Box>
            {/* ML-035: audit trail panel for SLA events */}
            <AuditTrailDetailPanel auditTag="support-sla" />
          </Box>
        </div>
      </main>
    </div>
  );
}

export default SupportSlaDashboardScreen;
