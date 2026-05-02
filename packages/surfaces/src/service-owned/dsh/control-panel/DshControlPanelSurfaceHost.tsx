"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, useUiText } from '@bthwani/ui-kit';
import { WebControlActionCard, WebControlDisclosureItem, WebMissionHeroCard, WebSectionCard, WebSegmentedTabs, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshCatalogApprovalScreen, ControlPanelDshCatalogScreen, ControlPanelDshListingGovernanceScreen } from './catalogs';
import { ControlPanelDshGovernanceEvidenceScreen, ControlPanelDshGuardStatusScreen } from './control';
import { ControlPanelDshFinanceScreen, ControlPanelDshSettlementScreen, ControlPanelDshCodReconciliationScreen, ControlPanelDshRefundQueueScreen } from './finance';
import { ControlPanelDshMarketingApprovalScreen, ControlPanelDshMarketingScreen, ControlPanelDshVideoSubmissionsReviewScreen } from './marketing';
import { ControlPanelDshOrdersScreen } from './operations/orders';
import { ControlPanelDshSheinProxyScreen } from './operations/sheinproxy';
import { ControlPanelDshReassignScreen } from './operations/reassign';
import { ControlPanelDshPeakModeScreen } from './operations/peak-mode';
import { ControlPanelDshBellScreen } from './operations/bell';
import { ControlPanelDshZoneSetScreen } from './operations/zone-set';
import { ControlPanelDshCaptainOperationsScreen, ControlPanelDshFieldOperationsScreen, ControlPanelDshIssueQueueScreen, ControlPanelDshServiceabilityScreen } from './operations';
import { ControlPanelDshPartnerActivationScreen, ControlPanelDshPartnerApprovalsScreen, ControlPanelDshPartnerDocumentReviewScreen } from './partners';
import { ControlPanelDshSupportQueueScreen, ControlPanelDshDisputeResolutionScreen } from './support';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus } from './shared';
import { useDshControlPanelText } from './operations/shared/dshControlPanelText';

type DshWorkspaceId =
  | 'overview'
  | 'dashboard'
  | 'captain-ops'
  | 'field-ops'
  | 'finance'
  | 'settlements'
  | 'cod'
  | 'refunds'
  | 'issues'
  | 'serviceability'
  | 'guard-status'
  | 'evidence'
  | 'orders'
  | 'order-detail'
  | 'orderchat'
  | 'partners'
  | 'catalogs'
  | 'marketing'
  | 'sheinproxy'
  | 'reassign'
  | 'peak-mode'
  | 'bell'
  | 'arrival-bell'
  | 'zone-set';

type DshControlPanelSurfaceHostProps = {
  workspace?: DshWorkspaceId;
  orderId?: string;
  orderOverlayMode?: 'detail' | 'chat';
};

type WorkspaceTab = {
  id: DshWorkspaceId;
  label: string;
  description: string;
};

const workspaceTabs: readonly WorkspaceTab[] = [
  { id: 'overview', label: 'Overview', description: 'Safe entry point' },
  { id: 'dashboard', label: 'Dashboard', description: 'Closure matrix' },
  { id: 'captain-ops', label: 'Captain ops', description: 'Captain readiness' },
  { id: 'field-ops', label: 'Field ops', description: 'Visit and onboarding' },
  { id: 'finance', label: 'Finance', description: 'Settlement summary' },
  { id: 'settlements', label: 'Settlements', description: 'Partner and captain payouts' },
  { id: 'cod', label: 'COD', description: 'Collected and pending' },
  { id: 'refunds', label: 'Refunds', description: 'Refund queue' },
  { id: 'issues', label: 'Issues', description: 'Support and dispute lanes' },
  { id: 'serviceability', label: 'Serviceability', description: 'Zones and coverage' },
  { id: 'guard-status', label: 'Guard status', description: 'PASS/WARN/BLOCKED' },
  { id: 'evidence', label: 'Evidence', description: 'Closure evidence matrix' },
  { id: 'orders', label: 'Orders', description: 'Current queue' },
  { id: 'partners', label: 'Partners', description: 'Activation and docs' },
  { id: 'catalogs', label: 'Catalogs', description: 'Approval and governance' },
  { id: 'marketing', label: 'Marketing', description: 'Approval and video review' },
  { id: 'sheinproxy', label: 'Manual assignment', description: 'Platform batch lane' },
  { id: 'reassign', label: 'Reassign', description: 'Re-route orders' },
  { id: 'peak-mode', label: 'Peak mode', description: 'Capacity mode' },
  { id: 'bell', label: 'Bell', description: 'Arrival notifications' },
  { id: 'zone-set', label: 'Zone set', description: 'Boundary policy' },
];

function buildOperationsHref(
  workspace: DshWorkspaceId = 'overview',
  options?: { orderId?: string; panel?: 'detail' | 'chat' },
) {
  const searchParams = new URLSearchParams();
  if (workspace !== 'overview') {
    searchParams.set('workspace', workspace);
  }
  if (options?.orderId) {
    searchParams.set('orderId', options.orderId);
  }
  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }
  const query = searchParams.toString();
  return query ? `/operations?${query}` : '/operations';
}

function normalizeWorkspace(workspace: DshWorkspaceId) {
  if (workspace === 'arrival-bell') {
    return 'bell' as const;
  }

  return workspace;
}

function renderOrdersOverlay(workspace: DshWorkspaceId, orderId?: string) {
  const selectedOrderId = orderId ?? 'ORD-24020';
  const overlayMode = workspace === 'orderchat' ? 'chat' : 'detail';

  return (
    <ControlPanelDshOrdersScreen
      embedded
      showHeader={false}
      hubHref={buildOperationsHref('overview')}
      operationsHref="/operations"
      initialSelectedOrderId={selectedOrderId}
      initialOverlayMode={overlayMode}
    />
  );
}

function OverviewWorkspace() {
  const overviewSignals = [
    { id: 'closed', title: 'Closed', value: String(getDshClosureItemsByStatus('closed').length), description: 'Closed closure items are proven.', tone: 'best' as const },
    { id: 'needs-evidence', title: 'Needs evidence', value: String(getDshClosureItemsByStatus('needs-evidence').length), description: 'Proof still missing or incomplete.', tone: 'warning' as const },
    { id: 'needs-ui-flow', title: 'Needs UI flow', value: String(getDshClosureItemsByStatus('needs-ui-flow').length), description: 'UI cleanup still required.', tone: 'warning' as const },
    { id: 'blocked', title: 'Blocked', value: String(getDshClosureItemsByStatus('blocked').length), description: 'Outside scope blockers remain visible.', tone: 'danger' as const },
  ];

  return (
    <Box gap={4}>
      <WebMissionHeroCard
        badges={['DSH', 'operations', 'overview']}
        eyebrow="DSH operations hub"
        title="DSH overview"
        description="Live routes open directly, while the closure workspaces remain visible without pretending to be ready."
        metaItems={[
          `${DSH_CROSS_SURFACE_CLOSURE_MAP.length} closure items`,
          `${getDshClosureItemsByStatus('closed').length} closed`,
          `${getDshClosureItemsByStatus('needs-evidence').length} need evidence`,
        ]}
        primaryAction={{ label: 'Open dashboard', href: buildOperationsHref('dashboard') }}
        secondaryAction={{ label: 'Open orders', href: buildOperationsHref('orders') }}
      />

      <Box gap={2}>
        {overviewSignals.map((signal) => (
          <WebSignalCard key={signal.id} title={signal.title} value={signal.value} description={signal.description} tone={signal.tone} />
        ))}
      </Box>

      <WebSectionCard title="Live routes" description="These routes stay directly reachable and readable.">
        <Box gap={2}>
          {[
            { id: 'overview-dashboard', label: 'Closure dashboard', description: 'The closure matrix and evidence stream.', href: buildOperationsHref('dashboard') },
            { id: 'overview-captain', label: 'Captain ops', description: 'Availability, proof review, and COD exceptions.', href: buildOperationsHref('captain-ops') },
            { id: 'overview-field', label: 'Field ops', description: 'Visits, activation, and geo pin review.', href: buildOperationsHref('field-ops') },
            { id: 'overview-finance', label: 'Finance', description: 'Settlement, COD, and refund visibility.', href: buildOperationsHref('finance') },
            { id: 'overview-issues', label: 'Issues', description: 'Support queue and dispute resolution.', href: buildOperationsHref('issues') },
          ].map((item) => (
            <WebControlActionCard
              key={item.id}
              id={item.id}
              title={item.label}
              description={item.description}
              footerLabel="Open"
              href={item.href}
            />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="Closure evidence" description="A short read on what remains closed or needs attention.">
        <Box gap={2}>
          {workspaceTabs
            .filter((tab) => tab.id !== 'overview')
            .map((tab) => (
              <WebControlDisclosureItem
                key={tab.id}
                id={tab.id}
                label={tab.label}
                description={tab.description}
                href={buildOperationsHref(tab.id)}
              />
            ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

function DashboardWorkspace() {
  const dashboardItems = React.useMemo(() => (
    DSH_CROSS_SURFACE_CLOSURE_MAP.slice(0, 6).map((item) => {
      const tone = item.status === 'closed' ? 'best' : item.status === 'blocked' ? 'danger' : 'warning';
      return {
        id: `${item.surfaceId}-${item.area}`,
        title: `${item.surfaceId} / ${item.title}`,
        status: item.status.toUpperCase(),
        ownerSurface: item.surfaceId,
        blocker: item.description,
        evidence: item.routeHint,
        primaryActionLabel: 'Mark reviewed locally',
        secondaryActionLabel: 'Open blocker',
        evidenceActionLabel: 'Open evidence',
        tone,
      };
    })
  ), []);
  const [selectedItemId, setSelectedItemId] = React.useState(dashboardItems[0]?.id ?? null);
  const [reviewedIds, setReviewedIds] = React.useState<ReadonlySet<string>>(new Set());
  const [filter, setFilter] = React.useState<'all' | 'open' | 'blocked'>('all');

  const selectedItems = dashboardItems.filter((item) => {
    if (filter === 'blocked') {
      return item.tone === 'danger';
    }
    if (filter === 'open') {
      return item.tone !== 'danger';
    }
    return true;
  });
  const selectedItem = selectedItems.find((item) => item.id === selectedItemId) ?? selectedItems[0] ?? dashboardItems[0];
  const reviewedCount = reviewedIds.size;

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Dashboard"
        title="Actionable closure dashboard"
        description="A compact local control room for evidence routing, blocker review, and reviewed-state transitions."
        badges={['dashboard', 'closure']}
        metaItems={[`${reviewedCount} reviewed locally`, `${selectedItems.length} visible rows`]}
        decisionBoard={{
          title: 'Dashboard decision board',
          purpose: 'Keep closure rows selectable and routeable instead of leaving the dashboard as a read-only summary.',
          primaryDecision: selectedItem ? selectedItem.status : 'Review the dashboard rows',
          nextAction: filter === 'blocked' ? 'Open blocker or evidence for the selected row.' : 'Mark the selected row reviewed locally.',
          blockers: selectedItem?.blocker ?? 'Select a dashboard row.',
          ownerSurface: 'control',
          evidenceHint: selectedItem?.evidence ?? 'dashboard evidence rows',
          routeHint: '/operations?workspace=evidence',
          decisionTone: filter === 'blocked' ? 'danger' : 'warning',
        }}
        primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'Open guard status', href: '/operations?workspace=guard-status' }}
        signals={[
          { id: 'reviewed', title: 'Reviewed locally', value: String(reviewedCount), description: 'Rows already acknowledged in this surface.', tone: 'best' },
          { id: 'open', title: 'Open rows', value: String(selectedItems.length), description: 'Selectable closure rows visible now.', tone: 'warning' },
          { id: 'blocked', title: 'Blocked rows', value: String(DASHBOARD_BLOCKED_COUNT), description: 'Rows that still need blocker attention.', tone: 'danger' },
        ]}
      />

      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Button label="All" tone={filter === 'all' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setFilter('all')} />
        <Button label="Open" tone={filter === 'open' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setFilter('open')} />
        <Button label="Blocked" tone={filter === 'blocked' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setFilter('blocked')} />
      </Box>

      <ControlPanelDshActionQueue
        title="Dashboard evidence queue"
        purpose="Mark a closure row locally, jump to its blocker, or open the evidence lane."
        items={selectedItems}
        selectedId={selectedItemId}
        onSelect={setSelectedItemId}
        primaryAction={(item) => setReviewedIds((current) => new Set([...current, item.id]))}
        secondaryAction={(item) => {
          setSelectedItemId(item.id);
          setFilter('blocked');
        }}
        evidenceAction={(item) => {
          setSelectedItemId(item.id);
          setFilter('open');
        }}
      />

      <WebSectionCard title="Route evidence" description="Use direct links for the workspaces that still need a handoff.">
        <Box gap={2}>
          <WebControlDisclosureItem id="guard-status" label="Guard status" description="PASS/WARN/BLOCKED rows and local review state." href="/operations?workspace=guard-status" />
          <WebControlDisclosureItem id="evidence" label="Evidence stream" description="The closure evidence lane for surfaces and route proof." href="/operations?workspace=evidence" />
          <WebControlDisclosureItem id="orders" label="Orders" description="The operational queue for the selected order." href="/operations?workspace=orders" />
        </Box>
      </WebSectionCard>
    </Box>
  );
}

const DASHBOARD_BLOCKED_COUNT = getDshClosureItemsByStatus('blocked').length;

function renderWorkspace(workspace: DshWorkspaceId, orderId?: string, orderOverlayMode?: 'detail' | 'chat') {
  const normalizedWorkspace = normalizeWorkspace(workspace);

  switch (normalizedWorkspace) {
    case 'overview':
      return <OverviewWorkspace />;
    case 'dashboard':
      return <DashboardWorkspace />;
    case 'captain-ops':
      return <ControlPanelDshCaptainOperationsScreen />;
    case 'field-ops':
      return <ControlPanelDshFieldOperationsScreen />;
    case 'finance':
      return <ControlPanelDshFinanceScreen />;
    case 'settlements':
      return <ControlPanelDshSettlementScreen />;
    case 'cod':
      return <ControlPanelDshCodReconciliationScreen />;
    case 'refunds':
      return <ControlPanelDshRefundQueueScreen />;
    case 'issues':
      return (
        <Box gap={4}>
          <ControlPanelDshSupportQueueScreen />
          <ControlPanelDshDisputeResolutionScreen />
        </Box>
      );
    case 'serviceability':
      return <ControlPanelDshServiceabilityScreen />;
    case 'guard-status':
      return <ControlPanelDshGuardStatusScreen />;
    case 'evidence':
      return <ControlPanelDshGovernanceEvidenceScreen />;
    case 'orders':
      return (
        <ControlPanelDshOrdersScreen
          embedded
          showHeader={false}
          hubHref={buildOperationsHref('overview')}
          operationsHref="/operations"
          initialSelectedOrderId={orderId ?? null}
          initialOverlayMode={orderOverlayMode ?? null}
        />
      );
    case 'order-detail':
    case 'orderchat':
      return renderOrdersOverlay(normalizedWorkspace, orderId);
    case 'partners':
      return (
        <Box gap={4}>
          <ControlPanelDshPartnerApprovalsScreen
            hubHref={buildOperationsHref('overview')}
            operationsHref="/operations"
            catalogHref={buildOperationsHref('catalogs')}
            marketingHref={buildOperationsHref('marketing')}
          />
          <ControlPanelDshPartnerActivationScreen />
          <ControlPanelDshPartnerDocumentReviewScreen />
        </Box>
      );
    case 'catalogs':
      return (
        <Box gap={4}>
          <ControlPanelDshCatalogScreen
            hubHref={buildOperationsHref('overview')}
            operationsHref="/operations"
            partnersHref={buildOperationsHref('partners')}
            marketingHref={buildOperationsHref('marketing')}
          />
          <ControlPanelDshCatalogApprovalScreen />
          <ControlPanelDshListingGovernanceScreen />
        </Box>
      );
    case 'marketing':
      return (
        <Box gap={4}>
          <ControlPanelDshMarketingScreen hubHref={buildOperationsHref('overview')} operationsHref="/operations" />
          <ControlPanelDshMarketingApprovalScreen />
          <ControlPanelDshVideoSubmissionsReviewScreen />
        </Box>
      );
    case 'sheinproxy':
      return (
        <ControlPanelDshSheinProxyScreen
          hubHref={buildOperationsHref('overview')}
          operationsHref="/operations"
          supportHref="/support"
        />
      );
    case 'reassign':
      return <ControlPanelDshReassignScreen embedded showHeader={false} hubHref={buildOperationsHref('overview')} ordersHref={buildOperationsHref('orders')} />;
    case 'peak-mode':
      return <ControlPanelDshPeakModeScreen embedded showHeader={false} hubHref={buildOperationsHref('overview')} ordersHref={buildOperationsHref('orders')} />;
    case 'bell':
      return <ControlPanelDshBellScreen embedded showHeader={false} hubHref={buildOperationsHref('overview')} ordersHref={buildOperationsHref('orders')} />;
    case 'zone-set':
      return <ControlPanelDshZoneSetScreen embedded showHeader={false} hubHref={buildOperationsHref('overview')} ordersHref={buildOperationsHref('orders')} />;
    case 'arrival-bell':
      return null;
    default:
      return <OverviewWorkspace />;
  }
}

export function DshControlPanelSurfaceHost({
  workspace = 'overview',
  orderId,
  orderOverlayMode,
}: DshControlPanelSurfaceHostProps) {
  const router = useRouter();
  const uiText = useUiText();
  useDshControlPanelText();
  const normalizedWorkspace = normalizeWorkspace(workspace);

  const tabs = workspaceTabs.map((item) => ({
    id: item.id,
    label: item.label,
    active: normalizeWorkspace(item.id) === normalizedWorkspace,
  }));

  return (
    <Box gap={4}>
      <WebSegmentedTabs
        ariaLabel={uiText.controlPanel.surfaceTitles.operations}
        items={tabs}
        onSelect={(workspaceId) => {
          const nextWorkspace = workspaceId as DshWorkspaceId;
          router.push(buildOperationsHref(nextWorkspace));
        }}
      />

      {renderWorkspace(workspace, orderId, orderOverlayMode)}
    </Box>
  );
}

export default DshControlPanelSurfaceHost;
