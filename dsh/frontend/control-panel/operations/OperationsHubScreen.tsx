'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StateView, Text, useDirection, Badge, Box } from '@bthwani/ui-kit';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from './operations.fixtures';
import { resolveOperationsStateCopy, type OperationsViewState } from './operations.state';
import type { CanonicalOperationsGroupId, OperationsPanelId } from './operations.types';
import { CommandCenterScreen } from './command-center/CommandCenterScreen';
import { LiveOrdersScreen } from './live-orders/LiveOrdersScreen';
import { DispatchAssignmentScreen } from './dispatch-assignment/DispatchAssignmentScreen';
import { CaptainOperationsScreen } from './captain-operations/CaptainOperationsScreen';
import { PartnerStoresScreen } from './partner-stores/PartnerStoresScreen';
import { AreaCapacityScreen } from './area-capacity/AreaCapacityScreen';
import { ExceptionsEscalationsScreen } from './exceptions-escalations/ExceptionsEscalationsScreen';
import { AuditSupportSlaScreen } from './audit-support-sla/AuditSupportSlaScreen';
import styles from './dsh-surface.module.css';

export type ControlPanelDshOperationsScreenProps = {
  group?: CanonicalOperationsGroupId;
  orderId?: string;
  panel?: OperationsPanelId;
  state?: OperationsViewState;
  fallbackHref?: string;
};

const SCREEN_RENDERERS: Record<CanonicalOperationsGroupId, React.ComponentType<{ hubHref: string }>> = {
  'command-center': CommandCenterScreen,
  'live-orders': LiveOrdersScreen,
  'dispatch-assignment': DispatchAssignmentScreen,
  'captain-operations': CaptainOperationsScreen,
  'partner-stores': PartnerStoresScreen,
  'area-capacity': AreaCapacityScreen,
  'exceptions-escalations': ExceptionsEscalationsScreen,
  'audit-support-sla': AuditSupportSlaScreen,
};

const METRIC_ARABIC: Record<string, string> = {
  'Open orders': 'الطلبات المفتوحة',
  'Dispatch risk': 'خطر الإسناد',
  'Captain cover': 'تغطية الكباتن',
  'Escalations': 'الاستثناءات',
  'Area capacity': 'ضغط المناطق',
  'SLA risk': 'SLA risk',
};

export function ControlPanelDshOperationsScreen({
  group = 'command-center',
  orderId,
  panel,
  state = 'ready',
  fallbackHref = '/operations',
}: ControlPanelDshOperationsScreenProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const [activeGroup, setActiveGroup] = React.useState<CanonicalOperationsGroupId>(group);

  React.useEffect(() => {
    setActiveGroup(group);
  }, [group]);

  const activeGroupMeta = getOperationsGroupMeta(activeGroup);
  const hubHref = buildOperationsHref(activeGroup, { orderId, panel });
  const ActiveScreen = SCREEN_RENDERERS[activeGroup];

  if (state !== 'ready') {
    return (
      <div style={{ padding: 24 }} dir="rtl">
        <StateView {...resolveOperationsStateCopy(state)} onActionPress={() => router.push(fallbackHref)} />
      </div>
    );
  }

  return (
    <div className={styles.cockpitShell} dir="rtl">
      {/* A) Compact Header Row */}
      <header className={styles.cockpitHeader}>
        <div className={styles.cockpitHeaderMain}>
          <Box gap={1}>
            <h1>غرفة عمليات DSH</h1>
            <Text role="bodySm" tone="muted">مراقبة وتنفيذ الطلبات الحية</Text>
          </Box>
          <Badge label="Live Pulse" tone="success" style={{ height: 20, fontSize: 10 }} />
          <Badge label="Preview" tone="warning" style={{ height: 20, fontSize: 10 }} />

          <nav className={styles.cockpitExternalLinks}>
            {NON_OPERATIONS_SECTION_SHORTCUTS.map(link => (
              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); router.push(link.href); }}>
                {link.id === 'finance' ? 'المالية' :
                 link.id === 'catalogs' ? 'الكتالوجات' :
                 link.id === 'marketing' ? 'التسويق' : 'الشركاء'}
              </a>
            ))}
          </nav>
        </div>
        <div className={styles.cockpitActions}>
          <button className={styles.cockpitTab} style={{ backgroundColor: '#FF500D', color: 'white' }}>فتح الطلبات الحية</button>
          <button className={styles.cockpitTab} style={{ border: '1px solid #0A2F5C' }}>إسناد/توزيع</button>
        </div>
      </header>

      {/* B) Pulse Strip (Compact Metrics) */}
      <div className={styles.cockpitPulseStrip}>
        {OPERATIONS_PULSE_METRICS.slice(0, 6).map((metric) => (
          <div key={metric.id} className={styles.cockpitMetric}>
            <span className={styles.cockpitMetricTitle}>{METRIC_ARABIC[metric.title] || metric.title}</span>
            <span className={styles.cockpitMetricValue}>{metric.value}</span>
          </div>
        ))}
      </div>

      {/* C) Screen Switcher (Compact Tabs) */}
      <div className={styles.cockpitSwitcher}>
        {OPERATIONS_CANONICAL_GROUPS.map((item) => {
          const isSelected = item.id === activeGroup;
          return (
            <button
              key={item.id}
              className={`${styles.cockpitTab} ${isSelected ? styles.cockpitTabActive : ''}`}
              onClick={() => {
                setActiveGroup(item.id);
                router.push(buildOperationsHref(item.id, { orderId, panel }));
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* D) Main Cockpit Grid (Cockpit Shell Layout) */}
      <main className={styles.cockpitMainGrid}>
        {/* E) Active Screen (Main Panel) */}
        <section className={styles.cockpitActivePanel}>
          <div className={styles.cockpitScrollArea}>
            <ActiveScreen hubHref={hubHref} />
          </div>
        </section>

        {/* F) Decision Rail (Side Rail) */}
        <aside className={styles.cockpitDecisionRail}>
          <Text role="bodyStrong" style={{ color: '#0A2F5C', fontSize: 15 }}>لوحة قرار العمليات</Text>
          <Text role="bodySm" tone="muted" style={{ marginTop: 6, lineHeight: 1.4 }}>
            {activeGroupMeta.description}
          </Text>

          <div className={styles.cockpitQuickActions}>
            <Text role="bodySm" style={{ fontWeight: 600, marginBottom: 4 }}>إجراءات سريعة</Text>
            <button className={styles.cockpitActionButton}>
              {activeGroup === 'command-center' ? 'فتح غرفة القيادة' : `متابعة ${activeGroupMeta.label}`}
            </button>
            <button className={`${styles.cockpitActionButton} ${styles.cockpitActionButtonSecondary}`}>
              توزيع المهام
            </button>
          </div>

          <Box style={{ marginTop: 'auto', paddingTop: 20 }}>
            <Text role="bodySm" tone="muted">BThwani Premium 2026</Text>
          </Box>
        </aside>
      </main>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
