'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { WebCommandCenterFrame } from '@bthwani/ui-kit/web';
import {
  ControlPanelDshOperationsScreen,
  normalizeOperationsLocation,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from '../operations';
import styles from './control-panel-shell.module.css';

const SHELL_NAV_ITEMS = [
  { id: 'operations', label: 'العمليات', icon: '⚙' },
  { id: 'finance', label: 'المالية', icon: '◈' },
  { id: 'catalogs', label: 'الكتالوج', icon: '▦' },
  { id: 'partners', label: 'الشركاء', icon: '◉' },
  { id: 'marketing', label: 'التسويق', icon: '△' },
  { id: 'control', label: 'الحوكمة', icon: '▣' },
] as const;

const SECTION_HREFS: Record<string, string> = {
  operations: '/operations',
  finance: '/finance',
  catalogs: '/catalogs',
  partners: '/partners',
  marketing: '/marketing',
  control: '/control',
};

export type ControlPanelSurfaceHostProps = {
  activeSection?: string;
  workspace?: AnyOperationsWorkspaceId;
  orderId?: string;
  orderOverlayMode?: OperationsPanelId;
};

export function ControlPanelSurfaceHost({
  activeSection = 'operations',
  workspace = 'overview',
  orderId,
  orderOverlayMode,
}: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const normalizedLocation = normalizeOperationsLocation(workspace, orderOverlayMode);

  React.useEffect(() => {
    if (normalizedLocation.kind === 'redirect') {
      router.push(normalizedLocation.href);
    }
  }, [normalizedLocation, router]);

  if (normalizedLocation.kind === 'redirect') return null;

  const navItems = SHELL_NAV_ITEMS.map((section) => ({
    ...section,
    active: section.id === activeSection,
  }));

  return (
    <div className={styles.shell}>
      <WebCommandCenterFrame
        brandLabel="bthwani"
        surfaceTitle="لوحة التحكم"
        railTitle="الأقسام"
        railItems={navItems}
        showHero={false}
        onRailItemSelect={(id) => {
          const href = SECTION_HREFS[id];
          if (href) router.push(href);
        }}
      >
        <ControlPanelDshOperationsScreen
          group={normalizedLocation.group}
          orderId={orderId}
          panel={normalizedLocation.panel}
          fallbackHref="/operations"
        />
      </WebCommandCenterFrame>
    </div>
  );
}

export default ControlPanelSurfaceHost;
