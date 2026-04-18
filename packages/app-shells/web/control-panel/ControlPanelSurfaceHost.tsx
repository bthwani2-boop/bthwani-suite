"use client";

import { useDshControlPanelText, ControlPanelDshCatalogScreen, ControlPanelDshPartnerApprovalsScreen, ControlPanelDshMarketingScreen } from '@bthwani/surfaces/control-panel';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthBox,
  BthButton,
  BthText,
  useDirection,
  useUiText,
} from '@bthwani/ui-kit';
import {
  BthWebCommandCenterFrame,
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSegmentedTabs,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const primarySectionIds = ['dashboard', 'operations', 'finance', 'catalogs', 'support', 'community-services', 'partners', 'marketing', 'control'] as const;
const controlSubSectionIds = ['platform', 'administration', 'governance', 'hr'] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type ControlPanelSubSectionId = (typeof controlSubSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];
type ControlPanelSignalId = 'best-path' | 'pressure' | 'live-refresh' | 'mode';

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
};

type MissionCardView = {
  missionTitle: string;
  missionDescription: string;
  owner: string;
  dueLabel: string;
  countLabel: string;
};

type SignalView = {
  id: ControlPanelSignalId;
  tone: 'best' | 'danger' | 'neutral';
  title: string;
  description: string;
  value: string;
};

const allServiceTabId = 'all-services';
const serviceIconMap: Record<string, string> = {
  dsh: '◈',
  knz: '⌂',
  amn: '◍',
  arb: '⌁',
  wlt: '◳',
  kwd: '⌘',
  esf: '◌',
  mrf: '◰',
  snd: '◔',
};

const sectionRouteMap: Record<ControlPanelSectionId, PrimarySectionHref> = {
  dashboard: '/dashboard',
  operations: '/operations',
  finance: '/finance',
  catalogs: '/catalogs',
  support: '/support',
  'community-services': '/community-services',
  partners: '/partners',
  marketing: '/marketing',
  control: '/control',
};

function getServiceLabel(uiText: ReturnType<typeof useUiText>, serviceId: string) {
  const serviceNames = (uiText as unknown as { serviceNames?: Record<string, string> }).serviceNames ?? {};
  return serviceNames[serviceId as keyof typeof serviceNames] ?? serviceId.toUpperCase();
}

function resolveShellCopy(
  panelText: ControlPanelText,
  section: ControlPanelSectionId,
  subsection?: ControlPanelSubSectionId,
) {
  if (section !== 'control') {
    return {
      title: panelText.surfaceTitles[section],
      description: panelText.surfaceDescriptions[section],
    };
  }

  if (!subsection) {
    return {
      title: panelText.surfaceTitles.control,
      description: panelText.descriptions.controlDefault,
    };
  }

  return {
    title: panelText.subSections[subsection],
    description: panelText.subSectionDescriptions[subsection],
  };
}

function resolveRailItems(activeHref: PrimarySectionHref, panelText: ControlPanelText) {
  return primarySectionIds
    .map((sectionId) => {
      const href = `/${sectionId}` as PrimarySectionHref;

      return {
        id: href,
        href,
        label: panelText.surfaceTitles[sectionId],
        description: panelText.surfaceDescriptions[sectionId],
        active: href === activeHref,
        badge: href === '/dashboard' ? panelText.ui.openServiceSpace : undefined,
      };
    });
}

function resolveSignals(panelText: ControlPanelText): ReadonlyArray<SignalView> {
  return [
    {
      id: 'best-path',
      tone: 'best',
      title: panelText.signals.bestPath.title,
      description: panelText.signals.bestPath.description,
      value: panelText.ui.defaultTitle,
    },
    {
      id: 'pressure',
      tone: 'danger',
      title: panelText.signals.pressure.title,
      description: panelText.signals.pressure.description,
      value: '1',
    },
    {
      id: 'live-refresh',
      tone: 'neutral',
      title: panelText.signals.liveRefresh.title,
      description: panelText.signals.liveRefresh.description,
      value: panelText.ui.liveRefreshValue,
    },
    {
      id: 'mode',
      tone: 'neutral',
      title: panelText.signals.mode.title,
      description: panelText.signals.mode.description,
      value: panelText.ui.readingModeValue,
    },
  ];
}

function resolveFallbackMission(activeSectionLabel: string, panelText: ControlPanelText): MissionCardView {
  return {
    missionTitle: `${panelText.ui.fallbackMissionTitle} ${activeSectionLabel}`,
    missionDescription: panelText.ui.fallbackMissionDescription,
    owner: activeSectionLabel,
    dueLabel: panelText.ui.fallbackDueLabel,
    countLabel: '1',
  };
}

function resolvePrimaryAction(activeSectionId: ControlPanelSectionId, panelText: ControlPanelText) {
  if (activeSectionId === 'operations') {
    return { label: panelText.ui.primaryAction, href: '/operations/dsh/sheinproxy' };
  }

  return { label: panelText.ui.primaryAction, href: '/finance' };
}

function resolveSecondaryAction(activeSectionId: ControlPanelSectionId, panelText: ControlPanelText) {
  if (activeSectionId === 'operations') {
    return { label: panelText.ui.secondaryActionDefault, href: '/dashboard' };
  }

  return { label: panelText.ui.secondaryAction, href: '/operations' };
}

export function ControlPanelSurfaceHost({ section, subsection }: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const dshText = useDshControlPanelText();
  const marketingCopy = panelText.marketing;
  const [alertCount, setAlertCount] = React.useState(1);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(allServiceTabId);
  const [activeSectionHref, setActiveSectionHref] = React.useState<PrimarySectionHref>(() => (
    section ? (`/${section}` as PrimarySectionHref) : '/dashboard'
  ));

  React.useEffect(() => {
    setActiveSectionHref(section ? (`/${section}` as PrimarySectionHref) : '/dashboard');
  }, [section]);

  const activeSectionId = activeSectionHref.slice(1) as ControlPanelSectionId;
  const isControlSection = activeSectionId === 'control';
  const isMarketingSection = activeSectionId === 'marketing';
  const shellCopy = resolveShellCopy(panelText, activeSectionId, isControlSection ? subsection : undefined);
  const railItems = resolveRailItems(activeSectionHref, panelText);
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const selectedServiceMeta = isAllFilterActive
    ? undefined
    : controlPanelRuntimeData.services.find((service) => service.id === selectedServiceId);
  const selectedServiceLabel = selectedServiceMeta ? getServiceLabel(uiText, selectedServiceMeta.id) : panelText.filters.allServices;
  const serviceSections = selectedServiceMeta?.sections ?? [];
  const serviceSectionLabels = serviceSections.map((sectionId) => panelText.surfaceTitles[sectionId as ControlPanelSectionId] ?? sectionId);
  const selectedSectionMeta = controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === activeSectionId);
  const selectedSectionMission = controlPanelRuntimeData.missions.find((mission) => mission.sectionId === activeSectionId);
  const sectionServiceIds = selectedSectionMeta?.serviceIds ?? [];
  const sectionServiceNames = sectionServiceIds.map((serviceId) => getServiceLabel(uiText, serviceId));
  const serviceLeadMission = serviceSections
    .map((serviceSectionId) => controlPanelRuntimeData.missions.find((mission) => mission.sectionId === serviceSectionId))
    .find(Boolean);
  const activeSectionLabel = panelText.surfaceTitles[activeSectionId] ?? activeSectionId;
  const activeMission = isAllFilterActive
    ? selectedSectionMission
      ? {
          missionTitle: `${panelText.ui.fallbackMissionTitle} ${activeSectionLabel}`,
          missionDescription: `${panelText.ui.missionDockAll} ${shellCopy.title}`,
          owner: activeSectionLabel,
          dueLabel: selectedSectionMission.dueKind === 'missing' ? panelText.ui.fallbackDueLabel : panelText.ui.definedDueLabel,
          countLabel: String(sectionServiceIds.length || 1),
        }
      : resolveFallbackMission(activeSectionLabel, panelText)
    : serviceLeadMission
      ? {
          missionTitle: `${panelText.ui.fallbackMissionTitle} ${selectedServiceLabel}`,
          missionDescription: `${panelText.ui.missionDockActive} ${selectedServiceLabel}`,
          owner: selectedServiceLabel,
          dueLabel: serviceLeadMission.dueKind === 'missing' ? panelText.ui.fallbackDueLabel : panelText.ui.definedDueLabel,
          countLabel: String(serviceSectionLabels.length || 1),
        }
      : resolveFallbackMission(selectedServiceLabel, panelText);
  const topFilters = [
    {
      id: allServiceTabId,
      label: panelText.filters.allServices,
      metaLabel: panelText.filters.allServicesMeta,
      icon: '▦',
      active: isAllFilterActive,
    },
    ...controlPanelRuntimeData.services.map((service) => ({
      id: service.id,
      label: getServiceLabel(uiText, service.id),
      metaLabel: service.placeholder ? panelText.filters.reference : `${service.sections.length}`,
      icon: serviceIconMap[service.id] ?? '◦',
      active: selectedServiceId === service.id,
    })),
  ];
  const heroPrimaryAction = resolvePrimaryAction(activeSectionId, panelText);
  const heroSecondaryAction = resolveSecondaryAction(activeSectionId, panelText);
  const signalCards = resolveSignals(panelText);
  const activeControlHref = isControlSection && subsection ? `/control/${subsection}` : undefined;
  const contextItems = isAllFilterActive ? sectionServiceNames : serviceSectionLabels;

  const handleBrandClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setActiveSectionHref('/dashboard');
    router.push('/dashboard');
  }, [router]);

  const handleSearchClick = React.useCallback(() => undefined, []);

  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((currentCount) => (currentCount > 0 ? currentCount - 1 : 0));
  }, []);

  const handleAlertClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setAlertCount(0);
  }, []);

  return (
    <BthWebCommandCenterFrame
      brandLabel={panelText.brandLabel}
      surfaceTitle={shellCopy.title}
      surfaceSubtitle={shellCopy.description}
      showHero={false}
      topFilters={topFilters}
      onTopFilterSelect={setSelectedServiceId}
      onRailItemSelect={(itemId) => {
        const matchedSection = primarySectionIds.find((sectionId) => `/${sectionId}` === itemId);

        if (!matchedSection) {
          return;
        }

        const nextHref = `/${matchedSection}` as PrimarySectionHref;
        setActiveSectionHref(nextHref);
        router.push(sectionRouteMap[matchedSection]);
      }}
      onBrandClick={handleBrandClick}
      onSearchClick={handleSearchClick}
      onRefreshClick={handleRefreshClick}
      onAlertClick={handleAlertClick}
      railTitle={panelText.brandLabel}
      railStatusLabel={isAllFilterActive ? panelText.filters.allServices : selectedServiceLabel}
      railItems={railItems}
      railSupplementary={null}
      alertCountLabel={String(alertCount)}
    >
      <div className={styles.stageStack} dir={direction}>
        {!isMarketingSection ? (
          <>
            <section className={styles.missionDockHeader}>
              <p className={styles.missionDockEyebrow}>{panelText.brandLabel}</p>
              <h1 className={styles.missionDockTitle}>{shellCopy.title}</h1>
              <p className={styles.missionDockSubtitle}>
                {isAllFilterActive
                  ? `${panelText.ui.missionDockAll} ${shellCopy.title}`
                  : `${panelText.ui.missionDockActive} ${selectedServiceLabel}`}
              </p>
            </section>

            <section className={styles.priorityPanel}>
              <BthWebMissionHeroCard
                dense
                badges={[
                  `${panelText.ui.serviceBadge} ${isAllFilterActive ? panelText.filters.allServices : selectedServiceLabel}`,
                  isAllFilterActive
                    ? `${panelText.ui.sectionBadge} ${activeSectionLabel}`
                    : `${panelText.ui.sectionsBadge} ${serviceSectionLabels.length}`,
                  panelText.ui.lastUpdate,
                ]}
                eyebrow={`${shellCopy.title} · ${panelText.ui.missionEyebrow}`}
                title={activeMission.missionTitle}
                description={activeMission.missionDescription}
                metaItems={[
                  `${panelText.ui.serviceLabel}: ${activeMission.owner}`,
                  activeMission.dueLabel,
                  `${panelText.ui.sectionsBadge} ${activeMission.countLabel}`,
                ]}
                primaryAction={heroPrimaryAction}
                secondaryAction={heroSecondaryAction}
              />

              <div className={styles.signalGrid}>
                {signalCards.map((signal) => {
                  const dynamicValue =
                    signal.id === 'best-path'
                      ? isAllFilterActive
                        ? activeSectionLabel
                        : selectedServiceLabel
                      : signal.id === 'pressure'
                        ? isAllFilterActive
                          ? String(sectionServiceIds.length || 1)
                          : String(serviceSectionLabels.length || 1)
                        : signal.value;

                  return (
                    <BthWebSignalCard
                      key={signal.id}
                      title={signal.title}
                      value={dynamicValue}
                      description={signal.description}
                      tone={signal.tone}
                    />
                  );
                })}
              </div>

              <section className={styles.contextPanel}>
                <h4 className={styles.contextTitle}>
                  {isAllFilterActive ? panelText.ui.contextTitleSection : panelText.ui.contextTitleService}
                </h4>
                <div className={styles.contextList}>
                  {contextItems.map((item) => (
                    <span key={item} className={styles.contextChip}>
                      {item}
                    </span>
                  ))}
                  {contextItems.length === 0 ? (
                    <span className={styles.contextChipMuted}>{panelText.ui.noItems}</span>
                  ) : null}
                </div>
              </section>
            </section>
          </>
        ) : null}

        {activeSectionId === 'marketing' ? (
          <section className={styles.subsectionPanel}>
            <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />
          </section>
        ) : null}

        {activeSectionId === 'operations' ? (
          <section className={styles.subsectionPanel}>
            <div className={styles.subsectionHeader}>
              <h3 className={styles.subsectionTitle}>{dshText.hub.workbenches.sheinProxy.label}</h3>
              <p className={styles.subsectionDescription}>{dshText.hub.workbenches.sheinProxy.description}</p>
            </div>
            <BthWebSectionCard
              title={dshText.hub.workbenches.sheinProxy.label}
              description={dshText.hub.workbenches.sheinProxy.description}
            >
              <BthBox gap={2}>
                <BthText role="bodySm" tone="muted">
                  {dshText.hub.workbenches.sheinProxy.routeHint}
                </BthText>
                <BthButton
                  label={panelText.openSheinProxy}
                  tone="primary"
                  onPress={() => router.push('/operations/dsh/sheinproxy')}
                />
              </BthBox>
            </BthWebSectionCard>
          </section>
        ) : null}

        {activeSectionId === 'catalogs' ? (
          <section className={styles.subsectionPanel}>
            <div className={styles.subsectionHeader}>
              <h3 className={styles.subsectionTitle}>{panelText.surfaceTitles.catalogs}</h3>
              <p className={styles.subsectionDescription}>{panelText.surfaceDescriptions.catalogs}</p>
            </div>
            <ControlPanelDshCatalogScreen hubHref="/catalogs" operationsHref="/operations/dsh/catalogs" />
          </section>
        ) : null}

        {activeSectionId === 'partners' ? (
          <section className={styles.subsectionPanel}>
            <div className={styles.subsectionHeader}>
              <h3 className={styles.subsectionTitle}>{panelText.surfaceTitles.partners}</h3>
              <p className={styles.subsectionDescription}>{panelText.surfaceDescriptions.partners}</p>
            </div>
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref="/operations/dsh/partners" />
          </section>
        ) : null}

        {isControlSection ? (
          <section className={styles.subsectionPanel}>
            <div className={styles.subsectionHeader}>
              <h3 className={styles.subsectionTitle}>{panelText.ui.subsectionTitle}</h3>
              <p className={styles.subsectionDescription}>{panelText.ui.subsectionDescription}</p>
            </div>
            <BthWebSegmentedTabs
              ariaLabel={panelText.ui.subsectionTitle}
              items={controlSubSectionIds.map((subsectionId) => ({
                id: subsectionId,
                label: panelText.subSections[subsectionId],
                active: subsection === subsectionId,
              }))}
              onSelect={(subsectionId) => {
                router.push(`/control/${subsectionId}`);
              }}
            />
            <div className={styles.subsectionGrid}>
              {controlSubSectionIds.map((subsectionId) => {
                const href = `/control/${subsectionId}`;
                const isActive = href === activeControlHref;

                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(event) => {
                      event.preventDefault();
                      router.push(href);
                    }}
                    className={[styles.subsectionLink, isActive ? styles.subsectionLinkActive : '']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <strong className={styles.subsectionLinkLabel}>{panelText.subSections[subsectionId]}</strong>
                    <span className={styles.subsectionLinkDescription}>{panelText.subSectionDescriptions[subsectionId]}</span>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </BthWebCommandCenterFrame>
  );
}

export default ControlPanelSurfaceHost;
