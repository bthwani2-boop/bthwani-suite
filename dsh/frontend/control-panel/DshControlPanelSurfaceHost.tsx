"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ControlPanelDshOperationsScreen,
  normalizeOperationsLocation,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from './operations';
import { ControlPanelDshClosureDashboardScreen } from './dashboard';
import { ControlPanelDshSupportHubScreen } from './support/SupportHubScreens';
import { ControlPanelDshFinanceHubScreen } from './finance';
import type { CanonicalFinanceGroupId, FinancePanelId } from '../../../wlt/frontend/dsh/control-panel/models/financeRouting.types';
import { ControlPanelDshCatalogScreen } from './catalogs/catalogs.screen';
import { ControlPanelDshPartnerApprovalsScreen } from './partners/ControlPanelDshPartnerApprovalsScreen';
import { ControlPanelDshMarketingScreen } from './marketing/ControlPanelDshMarketingScreen';
import { ControlPanelDshPlatformScreen } from './platform/ControlPanelDshPlatformScreen';
import { ControlPanelDshAdministrationScreen } from './administration/ControlPanelDshAdministrationScreen';
import { ControlPanelHrScreen } from './hr/ControlPanelHrScreen';
import type { DshControlPanelSectionId } from './shared/dsh-control-panel-governance.map';

import { PlatformVarsProvider, FeatureFlagProvider } from '../platform';

export type DshControlPanelSurfaceHostProps = {
  section?: DshControlPanelSectionId;
  workspace?: AnyOperationsWorkspaceId;
  orderId?: string;
  orderOverlayMode?: OperationsPanelId;
  financeGroup?: CanonicalFinanceGroupId;
  financePanel?: FinancePanelId;
};

export function DshControlPanelSurfaceHost(props: DshControlPanelSurfaceHostProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshControlPanelSurfaceHostInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshControlPanelSurfaceHostInner({
  section = 'operations',
  workspace = 'overview',
  orderId,
  orderOverlayMode,
  financeGroup = 'financial-command-center',
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

  if (section === 'dashboard') {
    return <ControlPanelDshClosureDashboardScreen />;
  }

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

  if (section === 'hr') {
    return <ControlPanelHrScreen />;
  }

  return null;
}

export default DshControlPanelSurfaceHost;
