'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  StateView,
  Text,
  useDirection,
  useUiText,
  Badge,
  StatCard,
} from '@bthwani/ui-kit';
import {
  WebCommandCenterFrame,
  WebSectionCard,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../shared';
import { formatDshWorkbenchSubtitle, useDshControlPanelText, DshScreenState, resolveDshStateCopy } from './shared';
import styles from './dsh-surface.module.css';

type ControlPanelDshOperationsScreenState = DshScreenState;

type DshWorkbenchId =
  | 'overview'
  | 'orders'
  | 'reassign'
  | 'peak-mode'
  | 'zone-set'
  | 'sheinproxy'
  | 'arrival-bell';

type TopFilterId = 'today' | 'queue' | 'peak';

type DshWorkbench = {
  id: DshWorkbenchId;
  label: string;
  description: string;
  routeHint: string;
  statusLabel: string;
  liveHref?: string;
};

function buildTopFilterItems(text: ReturnType<typeof useDshControlPanelText>) {
  return [
    { id: 'today', label: text.hub.topFilters.today },
    { id: 'queue', label: text.hub.topFilters.queue },
    { id: 'peak', label: text.hub.topFilters.peak },
  ] as const;
}

function buildDshWorkbenches(text: ReturnType<typeof useDshControlPanelText>): ReadonlyArray<DshWorkbench> {
  return [
    { id: 'overview', ...text.hub.workbenches.overview },
    { id: 'orders', ...text.hub.workbenches.orders, liveHref: '/operations?workspace=orders' },
    { id: 'reassign', ...text.hub.workbenches.reassign, liveHref: '/operations?workspace=reassign' },
    { id: 'peak-mode', ...text.hub.workbenches.peakMode, liveHref: '/operations?workspace=peak-mode' },
    { id: 'zone-set', ...text.hub.workbenches.zoneSet },
    { id: 'sheinproxy', ...text.hub.workbenches.sheinProxy },
    { id: 'arrival-bell', ...text.hub.workbenches.arrivalBell, liveHref: '/operations?workspace=bell' },
  ] as const;
}

function resolveTopFilterWorkbench(filterId: TopFilterId): DshWorkbenchId {
  if (filterId === 'queue') return 'orders';
  if (filterId === 'peak') return 'peak-mode';
  return 'overview';
}

function resolveWorkbenchLiveHref(workbenchId: DshWorkbenchId) {
  if (workbenchId === 'orders') return '/operations?workspace=orders';
  if (workbenchId === 'reassign') return '/operations?workspace=reassign';
  if (workbenchId === 'peak-mode') return '/operations?workspace=peak-mode';
  if (workbenchId === 'arrival-bell') return '/operations?workspace=bell';
  if (workbenchId === 'sheinproxy') return '/operations?workspace=sheinproxy';
  return undefined;
}

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>,
) {
  return resolveDshStateCopy(text, state);
}

function resolveWorkbenchActionLabel(text: ReturnType<typeof useDshControlPanelText>, workbenchId: DshWorkbenchId) {
  if (workbenchId === 'orders') return text.hub.actions.openOrders;
  if (workbenchId === 'arrival-bell') return text.hub.actions.openArrivalBell;
  if (workbenchId === 'reassign') return text.hub.actions.openReassign;
  return text.hub.actions.openPeakMode;
}

export type ControlPanelDshOperationsScreenProps = {
  state?: ControlPanelDshOperationsScreenState;
  fallbackHref?: string;
};

export function ControlPanelDshOperationsScreen({
  state = 'ready',
  fallbackHref = '/operations',
}: ControlPanelDshOperationsScreenProps) {
  const router = useRouter();
  const uiText = useUiText();
  const dshText = useDshControlPanelText();
  const { direction, language } = useDirection();
  const languageChip = language === 'en' ? dshText.common.enChip : dshText.common.arChip;
  const topFilterItems = React.useMemo(() => buildTopFilterItems(dshText), [dshText]);
  const dshWorkbenches = React.useMemo(() => buildDshWorkbenches(dshText), [dshText]);
  const [activeFilterId, setActiveFilterId] = React.useState<TopFilterId>('today');
  const [activeWorkbenchId, setActiveWorkbenchId] = React.useState<DshWorkbenchId>('overview');
  const [refreshCount, setRefreshCount] = React.useState(1);
  const [alertCount, setAlertCount] = React.useState(1);

  const activeWorkbench = dshWorkbenches.find((item) => item.id === activeWorkbenchId) ?? dshWorkbenches[0];
  const activeFilter = topFilterItems.find((item) => item.id === activeFilterId) ?? topFilterItems[0];
  const plannedWorkbenchCount = dshWorkbenches.filter((item) => !item.liveHref && item.id !== 'overview').length;
  const liveWorkbenchCount = dshWorkbenches.filter((item) => Boolean(item.liveHref)).length;
  const liveWorkbenchActions = dshWorkbenches.filter((item) => Boolean(item.liveHref));

  const topFilters = topFilterItems.map((item) => ({
    ...item,
    active: item.id === activeFilterId,
  }));

  const railItems = dshWorkbenches.map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description,
    active: item.id === activeWorkbenchId,
    badge: item.id === 'overview' ? dshText.common.live : item.liveHref ? dshText.common.liveNow : dshText.common.planned,
  }));

  const readyForSelection = state === 'ready';

  const heroTitle = activeWorkbench.id === 'overview' ? dshText.hub.rootTitle : activeWorkbench.label;
  const heroSubtitle = formatDshWorkbenchSubtitle(activeWorkbench.description, activeFilter.label, language as 'ar' | 'en');
  const currentDecision = activeWorkbench.id === 'overview'
    ? 'Pick the next operational lane'
    : activeWorkbench.id === 'orders'
      ? 'Open orders or inspect the selected order'
      : activeWorkbench.id === 'reassign'
        ? 'Reassign or keep the current captain'
        : activeWorkbench.id === 'peak-mode'
          ? 'Switch the pressure lane or hold'
          : activeWorkbench.id === 'sheinproxy'
            ? 'Review manual assignment batch'
            : activeWorkbench.id === 'arrival-bell'
              ? 'Resolve arrival and ring states'
              : 'Review the active workbench';
  const currentNextAction = activeWorkbench.liveHref ? `Open ${activeWorkbench.label.toLowerCase()}` : activeWorkbench.routeHint;
  const currentBlocker = activeWorkbench.liveHref ? 'Live route is available; decision is purely operational.' : 'Planned lane still needs closure proof.';

  const handleTopFilterSelect = (filterId: string) => {
    const matchedFilter = topFilterItems.find((item) => item.id === filterId);
    if (!matchedFilter) return;
    setActiveFilterId(matchedFilter.id);
    setActiveWorkbenchId(resolveTopFilterWorkbench(matchedFilter.id));
  };

  const handleRailSelect = (workbenchId: string) => {
    const matchedWorkbench = dshWorkbenches.find((item) => item.id === workbenchId);
    if (!matchedWorkbench) return;
    setActiveWorkbenchId(matchedWorkbench.id);
    const liveHref = resolveWorkbenchLiveHref(matchedWorkbench.id);
    if (liveHref) {
      router.push(liveHref);
      return;
    }
    if (matchedWorkbench.id === 'orders' || matchedWorkbench.id === 'sheinproxy') {
      setActiveFilterId('queue');
    } else if (matchedWorkbench.id === 'peak-mode') {
      setActiveFilterId('peak');
    } else {
      setActiveFilterId('today');
    }
  };

  const handleBrandClick = () => router.push('/dashboard');
  const handleSearchClick = () => { setActiveFilterId('queue'); setActiveWorkbenchId('orders'); };
  const handleRefreshClick = () => setRefreshCount((previousValue) => previousValue + 1);
  const handleAlertClick = () => { setAlertCount(0); setActiveFilterId('queue'); setActiveWorkbenchId('orders'); };

  const stageContent = readyForSelection ? (
    <div className={styles.opsWorkspace} dir={direction}>
      {/* ===== Operational Metrics Strip ===== */}
      <div className={styles.metricsStrip}>
        <StatCard
          label={dshText.hub.selectedScopeTitle}
          value={activeWorkbench.label}
          tone="brand"
        />
        <StatCard
          label={dshText.hub.plannedRoutesTitle}
          value={String(plannedWorkbenchCount)}
          tone="warning"
        />
        <StatCard
          label={dshText.hub.safeTransitionTitle}
          value={String(liveWorkbenchCount)}
          tone="success"
        />
        <StatCard
          label={dshText.common.activeAlerts}
          value={String(alertCount)}
          tone={alertCount > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* ===== Context Bar (compact hero replacement) ===== */}
      <div className={styles.contextBar}>
        <div className={styles.contextBarMain}>
          <div className={styles.contextBarEyebrow}>
            <Text role="caption" tone="brand">{dshText.hub.rootEyebrow}</Text>
            <Badge label={`${dshText.common.period}: ${activeFilter.label}`} tone="brand" />
            <Badge label={languageChip} tone="info" />
          </div>
          <Text role="titleMd">{heroTitle}</Text>
          <Text role="bodySm" tone="muted">{heroSubtitle}</Text>
        </div>
        <div className={styles.contextBarActions}>
          <Button
            label={dshText.hub.actions.openOrders}
            tone="primary"
            size="sm"
            fullWidth={false}
            onPress={() => router.push('/operations?workspace=orders')}
          />
          <Button
            label={dshText.common.openGeneralOperations}
            tone="ghost"
            size="sm"
            fullWidth={false}
            onPress={() => router.push(fallbackHref)}
          />
        </div>
      </div>

      <ControlPanelDshDecisionBoard
        title="Operations decision board"
        purpose="Keep the current workbench decision, next action, blockers, owner, evidence, and route hint visible."
        primaryDecision={currentDecision}
        nextAction={currentNextAction}
        blockers={currentBlocker}
        ownerSurface="operations"
        evidenceHint={`${activeWorkbench.routeHint} and workbench state proof`}
        routeHint={activeWorkbench.liveHref ?? `/operations?workspace=${activeWorkbench.id}`}
        decisionTone={activeWorkbench.liveHref ? 'brand' : 'warning'}
      />

      {/* ===== Quick Access Tray ===== */}
      <div className={styles.quickAccessTray} dir={direction}>
        {liveWorkbenchActions.map((workbench) => (
          <Button
            key={workbench.id}
            label={resolveWorkbenchActionLabel(dshText, workbench.id)}
            tone="primary"
            size="sm"
            fullWidth={false}
            onPress={() => router.push(workbench.liveHref!)}
          />
        ))}
      </div>

      {/* ===== Workbench Cards Grid ===== */}
      <WebSectionCard
        title={dshText.hub.workbenchesTitle}
        description={dshText.hub.workbenchesDescription}
      >
        <div className={styles.workbenchGrid}>
          {dshWorkbenches.filter((workbench) => workbench.id !== 'overview').map((workbench) => {
            const isLive = Boolean(workbench.liveHref);
            const badgeTone = isLive ? 'success' : 'warning';
            return (
              <div key={workbench.id} className={styles.workbenchCard}>
                <Box
                  padding={4}
                  gap={2}
                  border
                  radiusToken="xl"
                  background="surfaceRaised"
                >
                  <div className={styles.workbenchCardHeader} dir={direction}>
                    <Text role="bodyStrong">{workbench.label}</Text>
                    <Badge
                      label={isLive ? dshText.common.live : workbench.statusLabel}
                      tone={badgeTone as 'success' | 'warning'}
                    />
                  </div>
                  <Text role="bodySm" tone="muted">
                    {workbench.description}
                  </Text>
                  <Text role="caption" tone="soft">
                    {workbench.routeHint}
                  </Text>
                  {isLive ? (
                    <Button
                      label={resolveWorkbenchActionLabel(dshText, workbench.id)}
                      tone="primary"
                      size="sm"
                      fullWidth={false}
                      onPress={() => router.push(workbench.liveHref!)}
                    />
                  ) : (
                    <Button
                      label={dshText.common.planned}
                      tone="ghost"
                      size="sm"
                      fullWidth={false}
                      disabled
                    />
                  )}
                </Box>
              </div>
            );
          })}
        </div>
      </WebSectionCard>
    </div>
  ) : (
    <div className={styles.stateContainer}>
      <StateView
        {...resolveStateCopy(dshText, state)}
        onActionPress={() => router.push(fallbackHref)}
      />
    </div>
  );

  return (
    <WebCommandCenterFrame
      brandLabel={uiText.controlPanel.brandLabel}
      surfaceTitle={readyForSelection ? heroTitle : dshText.hub.rootTitle}
      surfaceSubtitle={readyForSelection ? heroSubtitle : dshText.hub.unavailableTitle}
      topFilters={topFilters}
      onTopFilterSelect={readyForSelection ? handleTopFilterSelect : undefined}
      onBrandClick={handleBrandClick}
      onSearchClick={readyForSelection ? handleSearchClick : undefined}
      onRefreshClick={readyForSelection ? handleRefreshClick : undefined}
      onAlertClick={readyForSelection ? handleAlertClick : undefined}
      railTitle={dshText.hub.railTitle}
      railStatusLabel={readyForSelection ? `${dshText.common.live}: ${liveWorkbenchCount}` : state}
      railItems={railItems}
      onRailItemSelect={readyForSelection ? handleRailSelect : undefined}
    >
      {stageContent}
    </WebCommandCenterFrame>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;
