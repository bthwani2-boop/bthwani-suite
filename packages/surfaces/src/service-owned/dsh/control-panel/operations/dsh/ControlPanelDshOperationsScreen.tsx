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
} from '@bthwani/ui-kit';
import {
  WebCommandCenterFrame,
  WebMissionHeroCard,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
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
    {
      id: 'overview',
      ...text.hub.workbenches.overview,
    },
    {
      id: 'orders',
      ...text.hub.workbenches.orders,
      liveHref: '/operations/dsh/orders',
    },
    {
      id: 'reassign',
      ...text.hub.workbenches.reassign,
      liveHref: '/operations/dsh/reassign',
    },
    {
      id: 'peak-mode',
      ...text.hub.workbenches.peakMode,
      liveHref: '/operations/dsh/peak-mode',
    },
    {
      id: 'zone-set',
      ...text.hub.workbenches.zoneSet,
    },
    {
      id: 'sheinproxy',
      ...text.hub.workbenches.sheinProxy,
    },
    {
      id: 'arrival-bell',
      ...text.hub.workbenches.arrivalBell,
      liveHref: '/operations/dsh/bell',
    },
  ] as const;
}

function resolveTopFilterWorkbench(filterId: TopFilterId): DshWorkbenchId {
  if (filterId === 'queue') {
    return 'orders';
  }

  if (filterId === 'peak') {
    return 'peak-mode';
  }

  return 'overview';
}

function resolveWorkbenchLiveHref(workbenchId: DshWorkbenchId) {
  if (workbenchId === 'orders') {
    return '/operations/dsh/orders';
  }

  if (workbenchId === 'reassign') {
    return '/operations/dsh/reassign';
  }

  if (workbenchId === 'peak-mode') {
    return '/operations/dsh/peak-mode';
  }

  if (workbenchId === 'arrival-bell') {
     return '/operations/dsh/bell';
  }

  if (workbenchId === 'sheinproxy') {
    return '/operations/dsh/sheinproxy';
  }

  return undefined;
}

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>,
) {
  return resolveDshStateCopy(text, state);
}

function resolveWorkbenchTitle(text: ReturnType<typeof useDshControlPanelText>, workbench: DshWorkbench) {
  return workbench.id === 'overview' ? text.hub.rootTitle : workbench.label;
}

function resolveWorkbenchSubtitle(workbench: DshWorkbench, filterLabel: string, locale: 'ar' | 'en') {
  return formatDshWorkbenchSubtitle(workbench.description, filterLabel, locale);
}

function resolveWorkbenchActionLabel(text: ReturnType<typeof useDshControlPanelText>, workbenchId: DshWorkbenchId) {
  if (workbenchId === 'orders') {
    return text.hub.actions.openOrders;
  }

  if (workbenchId === 'arrival-bell') {
    return text.hub.actions.openArrivalBell;
  }

  if (workbenchId === 'reassign') {
    return text.hub.actions.openReassign;
  }

  return text.hub.actions.openPeakMode;
}

function renderStateView(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>,
  onActionPress: () => void,
) {
  const stateCopy = resolveStateCopy(text, state);

  return (
    <StateView
      {...stateCopy}
      onActionPress={onActionPress}
    />
  );
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

  const heroTitle = resolveWorkbenchTitle(dshText, activeWorkbench);
  const heroSubtitle = resolveWorkbenchSubtitle(activeWorkbench, activeFilter.label, language as 'ar' | 'en');

  const handleTopFilterSelect = (filterId: string) => {
    const matchedFilter = topFilterItems.find((item) => item.id === filterId);

    if (!matchedFilter) {
      return;
    }

    setActiveFilterId(matchedFilter.id);
    setActiveWorkbenchId(resolveTopFilterWorkbench(matchedFilter.id));
  };

  const handleRailSelect = (workbenchId: string) => {
    const matchedWorkbench = dshWorkbenches.find((item) => item.id === workbenchId);

    if (!matchedWorkbench) {
      return;
    }

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

  const handleBrandClick = () => {
    router.push('/dashboard');
  };

  const handleSearchClick = () => {
    setActiveFilterId('queue');
    setActiveWorkbenchId('orders');
  };

  const handleRefreshClick = () => {
    setRefreshCount((previousValue) => previousValue + 1);
  };

  const handleAlertClick = () => {
    setAlertCount(0);
    setActiveFilterId('queue');
    setActiveWorkbenchId('orders');
  };

  const stageContent = readyForSelection ? (
    <div className={styles.stack}>
      <WebMissionHeroCard
        compact
        badges={[
          dshText.common.live,
          `${dshText.common.period}: ${activeFilter.label}`,
          languageChip,
        ]}
        eyebrow={dshText.hub.rootEyebrow}
        title={heroTitle}
        description={heroSubtitle}
        metaItems={[
          `${dshText.common.activeAlerts}: ${alertCount}`,
          `${dshText.hub.plannedRoutesTitle}: ${plannedWorkbenchCount}`,
        ]}
        primaryAction={{ label: dshText.hub.actions.openOrders, href: '/operations/dsh/orders' }}
        secondaryAction={{ label: dshText.common.openGeneralOperations, href: fallbackHref }}
      />

      <div className={styles.signalGrid}>
        <WebSignalCard
          title={dshText.hub.selectedScopeTitle}
          value={activeWorkbench.label}
          description={dshText.hub.selectedScopeDescription}
          tone="brand"
        />
        <WebSignalCard
          title={dshText.hub.plannedRoutesTitle}
          value={String(plannedWorkbenchCount)}
          description={dshText.hub.plannedRoutesDescription}
          tone="warning"
        />
        <WebSignalCard
          title={dshText.hub.safeTransitionTitle}
          value={String(liveWorkbenchCount)}
          description={dshText.hub.safeTransitionDescription}
          tone="best"
        />
        <WebSignalCard
          title={dshText.common.activeAlerts}
          value={String(alertCount)}
          description={dshText.hub.activeAlertsDescription}
          tone={alertCount > 0 ? 'danger' : 'neutral'}
        />
      </div>

      <WebSectionCard
        title={dshText.hub.quickActionsTitle}
        description={dshText.hub.quickActionsDescription}
      >
        <div className={styles.actionRow} dir={direction}>
          {liveWorkbenchActions.map((workbench) => (
            <Button
              key={workbench.id}
              label={resolveWorkbenchActionLabel(dshText, workbench.id)}
              tone={workbench.id === 'orders' ? 'primary' : 'secondary'}
              size="sm"
              fullWidth={false}
              onPress={() => router.push(workbench.liveHref!)}
            />
          ))}
        </div>
      </WebSectionCard>

      <WebSectionCard
        title={dshText.hub.workbenchesTitle}
        description={dshText.hub.workbenchesDescription}
      >
        <div className={styles.cardGrid}>
          {dshWorkbenches.filter((workbench) => workbench.id !== 'overview').map((workbench) => (
            <div key={workbench.id} className={styles.compactCard}>
              <Box
                padding={3}
                gap={2}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <div className={styles.workbenchHeader} dir={direction}>
                  <Text role="bodyStrong">{workbench.label}</Text>
                  <Badge
                    label={workbench.liveHref ? dshText.common.live : workbench.statusLabel}
                    tone={workbench.liveHref ? 'success' : 'warning'}
                    size="sm"
                  />
                </div>
                <Text role="bodySm" tone="muted">
                  {workbench.description}
                </Text>
                <Text role="caption" tone="soft">
                  {workbench.routeHint}
                </Text>
                {workbench.liveHref ? (
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
          ))}
        </div>
      </WebSectionCard>
    </div>
  ) : (
    renderStateView(dshText, state, () => {
      router.push(fallbackHref);
    })
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
