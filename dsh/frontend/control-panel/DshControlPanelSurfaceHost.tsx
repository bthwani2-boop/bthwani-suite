"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ControlPanelDshOperationsScreen,
  normalizeOperationsLocation,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from './operations';
import { ControlPanelDshSupportHubScreen } from './support/SupportHubScreens';
import { ControlPanelDshFinanceHubScreen } from './finance/FinanceHubScreen';
import type { CanonicalFinanceGroupId, FinancePanelId } from './finance/finance.types';
import { ControlPanelDshCatalogScreen } from './catalogs/catalogs.screen';
import { ControlPanelDshPartnerApprovalsScreen } from './partners/ControlPanelDshPartnerApprovalsScreen';
import { ControlPanelDshMarketingScreen } from './marketing/ControlPanelDshMarketingScreen';
import { ControlPanelDshPlatformScreen } from './platform/ControlPanelDshPlatformScreen';
import { ControlPanelDshAdministrationScreen } from './administration/ControlPanelDshAdministrationScreen';
import type { DshControlPanelSectionId } from './shared/dsh-control-panel-governance.map';

export type DshControlPanelSurfaceHostProps = {
  section?: DshControlPanelSectionId;
  workspace?: AnyOperationsWorkspaceId;
  orderId?: string;
  orderOverlayMode?: OperationsPanelId;
  financeGroup?: CanonicalFinanceGroupId;
  financePanel?: FinancePanelId;
};

export function DshControlPanelSurfaceHost({
  section = 'operations',
  workspace = 'overview',
  orderId,
  orderOverlayMode,
  financeGroup = 'overview',
  financePanel,
}: DshControlPanelSurfaceHostProps) {
  const router = useRouter();
  const normalizedLocation = section === 'operations'
    ? normalizeOperationsLocation(workspace, orderOverlayMode)
    : null;

  React.useEffect(() => {
    if (normalizedLocation?.kind === 'redirect') {
      router.push(normalizedLocation.href);
    }
  }, [normalizedLocation, router]);

  if (section === 'operations') {
    if (normalizedLocation?.kind === 'redirect') {
      return null;
    }

    return (
      <ControlPanelDshOperationsScreen
        group={normalizedLocation?.group ?? 'command-center'}
        orderId={orderId}
        panel={normalizedLocation?.panel}
        fallbackHref="/operations"
      />
    );
  }

  if (section === 'support') {
    return <ControlPanelDshSupportHubScreen />;
  }

  if (section === 'finance') {
    return <ControlPanelDshFinanceHubScreen group={financeGroup} panel={financePanel} fallbackHref="/finance" />;
  }

  if (section === 'catalogs') {
    return <ControlPanelDshCatalogScreen />;
  }

  if (section === 'partners') {
    return <ControlPanelDshPartnerApprovalsScreen />;
  }

  if (section === 'marketing') {
    return <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />;
  }

  if (section === 'platform') {
    return <ControlPanelDshPlatformScreen />;
  }

  if (section === 'administration') {
    return <ControlPanelDshAdministrationScreen />;
  }

  return null;
}

export default DshControlPanelSurfaceHost;
