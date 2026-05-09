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
import { CommandCenterScreen } from './CommandCenterScreen';
import { LiveOrdersScreen } from './LiveOrdersScreen';
import { DispatchAssignmentScreen } from './DispatchAssignmentScreen';
import { ControlPanelDshSheinProxyScreen } from './ControlPanelDshSheinProxyScreen';
import { AwnakScreen } from './AwnakScreen';
import { CaptainOperationsScreen } from './CaptainOperationsScreen';
import { PartnerStoresScreen } from './PartnerStoresScreen';
import { AreaCapacityScreen } from './AreaCapacityScreen';
import { ExceptionsEscalationsScreen } from './ExceptionsEscalationsScreen';
import { AuditSupportSlaScreen } from './AuditSupportSlaScreen';
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
      {/* 1. Header Area - Compact Command Center */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#0A2F5C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)' }}>
            ⚙️
          </div>
          <div>
            <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>عمليات DSH</h1>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>مراقبة وتنفيذ الطلبات الحية</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {OPERATIONS_PULSE_METRICS.slice(0, 4).map((metric) => (
              <div key={metric.id} className={styles.commandKpi} style={{ minWidth: '100px', padding: '4px 10px' }}>
                <span className={styles.commandKpiLabel}>{METRIC_ARABIC[metric.title] || metric.title}</span>
                <span className={styles.commandKpiValue} style={{ fontSize: '14px' }}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Operations Tabs - Cockpit Navigation */}
      <nav className={styles.navigationCockpit}>
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

      {/* 3. Main Active Area */}
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
