'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StateView } from '@bthwani/ui-kit';
import {
  buildOperationsHref,
  getOperationsGroupMeta,
  NON_OPERATIONS_SECTION_SHORTCUTS,
  OPERATIONS_CANONICAL_GROUPS,
  resolveOperationsStateCopy,
} from './operations.registry';
import { OPERATIONS_PULSE_METRICS } from './operations.preview-data';
import type { CanonicalOperationsGroupId, OperationsPanelId, OperationsViewState } from './operations.types';
import { CommandCenterScreen } from './command-center/CommandCenterScreen';
import { LiveOrdersScreen } from './live-orders/LiveOrdersScreen';
import { DispatchAssignmentScreen } from './dispatch-assignment/DispatchAssignmentScreen';
import { ControlPanelDshSheinProxyScreen } from './sheinproxy/ControlPanelDshSheinProxyScreen';
import { AwnakScreen } from './awnak/AwnakScreen';
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
  sheinproxy: ControlPanelDshSheinProxyScreen,
  'proxy-shein-awnak': AwnakScreen,
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
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <h1>عمليات DSH</h1>
          <p>مراقبة وتنفيذ الطلبات الحية</p>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {OPERATIONS_PULSE_METRICS.slice(0, 4).map((metric) => (
              <div key={metric.id} className={styles.operationsPulseItem}>
                <span>{METRIC_ARABIC[metric.title] || metric.title}</span>
                <span>{metric.value}</span>
              </div>
            ))}
          </div>


        </div>
      </header>

      {/* 2. Operations Tabs */}
      <nav className={styles.operationsTabs}>
        {OPERATIONS_CANONICAL_GROUPS.map((item) => {
          const isSelected = item.id === activeGroup;
          return (
            <button
              key={item.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => {
                setActiveGroup(item.id);
                router.push(buildOperationsHref(item.id, { orderId, panel }));
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Main Active Area (No side rail) */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <ActiveScreen hubHref={hubHref} />
        </div>
      </main>
    </div>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;

