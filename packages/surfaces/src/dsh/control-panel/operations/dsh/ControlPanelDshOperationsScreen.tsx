'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthBox,
  BthButton,
  BthStateView,
  BthText,
  formatDshWorkbenchSubtitle,
  useDshControlPanelText,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import {
  BthWebCommandCenterFrame,
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import styles from './dsh-surface.module.css';

type ControlPanelDshOperationsScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

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

function getWorkbenchText(text: ReturnType<typeof useDshControlPanelText>, workbenchId: DshWorkbenchId) {
  if (workbenchId === 'peak-mode') {
    return text.hub.workbenches.peakMode;
  }

  if (workbenchId === 'zone-set') {
    return text.hub.workbenches.zoneSet;
  }

  if (workbenchId === 'arrival-bell') {
    return text.hub.workbenches.arrivalBell;
  }

  if (workbenchId === 'sheinproxy') {
    return text.hub.workbenches.sheinProxy;
  }

  return text.hub.workbenches[workbenchId];
}

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
      liveHref: '/operations/dsh/arrival-bell',
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
    return '/operations/dsh/arrival-bell';
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
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.hub.stateLoadingTitle,
      description: text.hub.stateLoadingDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.hub.stateEmptyTitle,
      description: text.hub.stateEmptyDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.hub.stateOfflineTitle,
      description: text.hub.stateOfflineDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.hub.stateDisabledTitle,
      description: text.hub.stateDisabledDescription,
      actionLabel: text.common.openGeneralOperations,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.hub.stateErrorTitle,
    description: text.hub.stateErrorDescription,
    actionLabel: text.common.openGeneralOperations,
  };
}

function resolveWorkbenchTitle(text: ReturnType<typeof useDshControlPanelText>, workbench: DshWorkbench) {
  return workbench.id === 'overview' ? text.hub.rootTitle : workbench.label;
}

function resolveWorkbenchSubtitle(text: ReturnType<typeof useDshControlPanelText>, workbench: DshWorkbench, filterLabel: string) {
  return formatDshWorkbenchSubtitle(text, workbench.description, filterLabel);
}

function renderStateView(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>,
  onActionPress: () => void,
) {
  const stateCopy = resolveStateCopy(text, state);

  return (
    <BthStateView
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
  const heroSubtitle = resolveWorkbenchSubtitle(dshText, activeWorkbench, activeFilter.label);
  const sheinProxyActionLabel = 'openSheinProxy' in dshText.common
    ? dshText.common.openSheinProxy
    : dshText.hub.actions.openPeakMode;

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
      <BthWebMissionHeroCard
        badges={[
          `/operations/dsh`,
          `${dshText.common.period}: ${activeFilter.label}`,
          `${dshText.common.language}: ${languageChip}`,
        ]}
        eyebrow={dshText.hub.rootEyebrow}
        title={heroTitle}
        description={heroSubtitle}
        metaItems={[
          `${dshText.common.safePath}: ${fallbackHref}`,
          `${dshText.hub.plannedRoutesTitle}: ${plannedWorkbenchCount}`,
          `${dshText.common.visibleUpdate}: ${refreshCount}`,
        ]}
        primaryAction={{ label: dshText.common.openGeneralOperations, href: fallbackHref }}
        secondaryAction={{ label: dshText.common.controlPanel, href: '/dashboard' }}
      />

      <div className={styles.signalGrid}>
        <BthWebSignalCard
          title={dshText.hub.selectedScopeTitle}
          value={activeWorkbench.label}
          description={dshText.hub.selectedScopeDescription}
          tone="best"
        />
        <BthWebSignalCard
          title={dshText.hub.plannedRoutesTitle}
          value={String(plannedWorkbenchCount)}
          description={dshText.hub.plannedRoutesDescription}
        />
        <BthWebSignalCard
          title={dshText.hub.safeTransitionTitle}
          value={fallbackHref}
          description={dshText.hub.safeTransitionDescription}
        />
        <BthWebSignalCard
          title={dshText.common.activeAlerts}
          value={String(alertCount)}
          description={dshText.hub.activeAlertsDescription}
        />
      </div>

      <BthWebSectionCard
        title={dshText.hub.workbenchesTitle}
        description={dshText.hub.workbenchesDescription}
      >
        <div className={styles.cardGrid}>
          {dshWorkbenches.filter((workbench) => workbench.id !== 'overview').map((workbench) => (
            <div key={workbench.id} className={styles.compactCard}>
              <BthBox
                padding={3}
                gap={1}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <div className={styles.workbenchHeader} dir={direction}>
                  <BthText role="bodyStrong">{workbench.label}</BthText>
                  <BthText role="caption" tone={workbench.liveHref ? 'success' : 'brand'}>
                    {workbench.liveHref ? dshText.common.live : workbench.statusLabel}
                  </BthText>
                </div>
                <BthText role="bodySm" tone="muted">
                  {workbench.description}
                </BthText>
                <BthText role="caption" tone="soft">
                  {workbench.routeHint}
                </BthText>
                {workbench.liveHref ? (
                  <BthButton
                    label={
                      workbench.id === 'orders'
                        ? dshText.hub.actions.openOrders
                        : workbench.id === 'sheinproxy'
                          ? sheinProxyActionLabel
                        : workbench.id === 'arrival-bell'
                          ? dshText.hub.actions.openArrivalBell
                          : workbench.id === 'reassign'
                            ? dshText.hub.actions.openReassign
                            : dshText.hub.actions.openPeakMode
                    }
                    tone="primary"
                    size="sm"
                    fullWidth={false}
                    onPress={() => router.push(workbench.liveHref!)}
                  />
                ) : null}
              </BthBox>
            </div>
          ))}
        </div>
      </BthWebSectionCard>
    </div>
  ) : (
    renderStateView(dshText, state, () => {
      router.push(fallbackHref);
    })
  );

  return (
    <BthWebCommandCenterFrame
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
      railStatusLabel={readyForSelection ? dshText.hub.railStatusReady : state}
      railItems={railItems}
      onRailItemSelect={readyForSelection ? handleRailSelect : undefined}
      railSupplementary={
        <BthWebSectionCard
          title={dshText.common.routeGuard}
          description={dshText.common.routeGuardDescription}
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.common.currentPath}</BthText>
              <BthText role="bodySm" tone="muted">
                /operations/dsh
              </BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.common.safeExit}</BthText>
              <BthText role="bodySm" tone="muted">
                {fallbackHref}
              </BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      }
    >
      {stageContent}
    </BthWebCommandCenterFrame>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;