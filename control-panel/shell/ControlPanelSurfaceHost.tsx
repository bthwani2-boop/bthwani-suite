"use client";

import {
  DshControlPanelSurfaceHost,
  ControlPanelDshCatalogScreen,
  ControlPanelDshMarketingScreen,
  ControlPanelDshPartnerApprovalsScreen,
  ControlPanelDshSupportQueueScreen,
  ControlPanelDshClosureDashboardScreen,
  ControlPanelDshFinanceHubScreen,
} from '../composition';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDirection, useUiText, type BThwaniAppearanceMode } from '@bthwani/ui-kit';
import {
  WebCommandCenterFrame,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from '../../dsh/frontend/control-panel/operations';
import type {
  CanonicalFinanceGroupId,
  FinancePanelId,
} from '../../dsh/frontend/control-panel/finance/finance.types';
import { controlPanelRuntimeData } from './runtime.data';
import { ControlPanelAppearanceScreen } from './ControlPanelAppearanceScreen';
import { useControlPanelAppearance } from './appearance';
import styles from './control-panel-shell.module.css';

const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'community-services', 'support'] as const;
const hiddenSectionIds = ['catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];
type SignalTone = React.ComponentProps<typeof WebSignalCard>['tone'];

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  operationsWorkspace?: AnyOperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: OperationsPanelId;
  financeWorkspace?: string;
  financePanel?: string;
};

const allServiceTabId = 'all-services';

const sectionRouteMap: Record<ControlPanelSectionId, PrimarySectionHref> = {
  dashboard: '/dashboard',
  operations: '/operations',
  finance: '/finance',
  'community-services': '/community-services',
  support: '/support',
  partners: '/partners',
  catalogs: '/catalogs',
  marketing: '/marketing',
  platform: '/platform',
  administration: '/administration',
  hr: '/hr',
};

const compactSectionDescriptions: Record<PhaseOneSectionId, string> = {
  dashboard: 'نظرة سريعة',
  operations: 'حالة التشغيل',
  finance: 'المركز المالي',
  'community-services': 'خدمات المجتمع',
  support: 'دعم قابل للتصعيد',
};

const appearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'سطح واضح بإضاءة هادئة وحقول عالية القراءة.',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'سطح داكن بطبقات أعمق وتباين مريح للمتابعة.',
  },
] as const;

function isPhaseOneSection(sectionId: ControlPanelSectionId): sectionId is PhaseOneSectionId {
  return (phaseOneSectionIds as readonly string[]).includes(sectionId);
}

function getServiceLabel(uiText: ReturnType<typeof useUiText>, serviceId: string) {
  const serviceNames = (uiText as unknown as { serviceNames?: Record<string, string> }).serviceNames ?? {};
  return serviceNames[serviceId as keyof typeof serviceNames] ?? serviceId.toUpperCase();
}

function resolveShellCopy(
  panelText: ControlPanelText,
  section: ControlPanelSectionId,
) {
  return {
    title: panelText.surfaceTitles[section],
    description: panelText.surfaceDescriptions[section],
  };
}

function getSectionServiceIds(sectionId: string) {
  return controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === sectionId)?.serviceIds ?? [];
}

function countLiveCoverage(serviceIds: readonly string[]) {
  return serviceIds.filter((serviceId) => {
    const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);
    return serviceMeta && !serviceMeta.placeholder;
  }).length;
}

function resolveRailItems(activeHref: PrimarySectionHref, panelText: ControlPanelText) {
  const iconMap: Record<string, string> = {
    dashboard: '⌂',
    operations: '◎',
    finance: '¤',
    'community-services': '◌',
    support: '☏',
    partners: '▣',
    catalogs: '⌗',
    marketing: '▤',
    platform: '⚙',
    administration: '⚙',
    hr: '◐',
  };

  return primarySectionIds.map((sectionId) => {
    const href = `/${sectionId}` as PrimarySectionHref;
    const description = isPhaseOneSection(sectionId)
      ? compactSectionDescriptions[sectionId]
      : panelText.surfaceDescriptions[sectionId];

    return {
      id: href,
      href,
      label: panelText.surfaceTitles[sectionId],
      icon: iconMap[sectionId] ?? '•',
      active: href === activeHref,
    };
  });
}

export function ControlPanelSurfaceHost({
  section,
  operationsWorkspace = 'overview',
  operationsOrderId,
  operationsOverlayMode,
  financeWorkspace,
  financePanel,
}: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const uiText = useUiText();
  const { hydrated, mode, setMode } = useControlPanelAppearance();
  const panelText = uiText.controlPanel;
  const [alertCount, setAlertCount] = React.useState(1);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(allServiceTabId);
  const [activeSectionHref, setActiveSectionHref] = React.useState<PrimarySectionHref>(() => (
    section ? (`/${section}` as PrimarySectionHref) : '/dashboard'
  ));
  const [isAppearanceMenuOpen, setIsAppearanceMenuOpen] = React.useState(false);
  const appearanceMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setActiveSectionHref(section ? (`/${section}` as PrimarySectionHref) : '/dashboard');
  }, [section]);

  const activeSectionId = activeSectionHref.slice(1) as ControlPanelSectionId;
  const isOperationsSection = activeSectionId === 'operations';
  const isMarketingSection = activeSectionId === 'marketing';
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const shellCopy = resolveShellCopy(panelText, activeSectionId);
  const railItems = React.useMemo(() => {
    const allItems = resolveRailItems(activeSectionHref, panelText);
    if (isAllFilterActive) return allItems;

    const serviceMeta = controlPanelRuntimeData.services.find((s) => s.id === selectedServiceId);
    if (!serviceMeta) return allItems;

    return allItems.filter((item) => {
      const sectionId = item.id.slice(1) as ControlPanelSectionId;
      return serviceMeta.sections.includes(sectionId);
    });
  }, [activeSectionHref, isAllFilterActive, panelText, selectedServiceId]);

  React.useEffect(() => {
    if (isAllFilterActive) return;
    const serviceMeta = controlPanelRuntimeData.services.find((s) => s.id === selectedServiceId);
    if (!serviceMeta) return;

    if (!serviceMeta.sections.includes(activeSectionId)) {
      const firstAvailableSection = serviceMeta.sections[0];
      if (firstAvailableSection) {
        const nextHref = `/${firstAvailableSection}` as PrimarySectionHref;
        setActiveSectionHref(nextHref);
        router.push(sectionRouteMap[firstAvailableSection as ControlPanelSectionId]);
      }
    }
  }, [selectedServiceId, isAllFilterActive, activeSectionId, router]);

  React.useEffect(() => {
    if (!isAppearanceMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!appearanceMenuRef.current?.contains(event.target as Node)) {
        setIsAppearanceMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isAppearanceMenuOpen]);

  const selectedServiceMeta = isAllFilterActive
    ? undefined
    : controlPanelRuntimeData.services.find((service) => service.id === selectedServiceId);
  const selectedServiceLabel = selectedServiceMeta ? getServiceLabel(uiText, selectedServiceMeta.id) : panelText.filters.allServices;
  const activeAppearance = appearanceOptions.find((option) => option.mode === mode) ?? appearanceOptions[0];

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

  const profileControl = (
    <div className={styles.appearanceMenu} ref={appearanceMenuRef}>
      <button
        type="button"
        className={styles.appearanceMenuTrigger}
        aria-expanded={isAppearanceMenuOpen}
        aria-haspopup="menu"
        aria-label={`المظهر الحالي: ${activeAppearance.title}`}
        title={`المظهر الحالي: ${activeAppearance.title}`}
        onClick={() => setIsAppearanceMenuOpen((current) => !current)}
      >
        <span className={styles.appearanceMenuTriggerAvatar} aria-hidden="true">
          {mode === 'darkGlass' ? '◐' : '◌'}
        </span>
      </button>

      {isAppearanceMenuOpen ? (
        <div className={styles.appearanceMenuPopover} role="menu" aria-label="اختيار مظهر لوحة التحكم">
          <div className={styles.appearanceMenuHeader}>
            <span className={styles.appearanceMenuEyebrow}>مظهر الشل</span>
            <strong className={styles.appearanceMenuCurrent}>
              {hydrated ? activeAppearance.title : 'جارٍ استعادة التفضيل...'}
            </strong>
          </div>

          <div className={styles.appearanceMenuOptions}>
            {appearanceOptions.map((option) => (
              <button
                key={option.mode}
                type="button"
                role="menuitemradio"
                aria-checked={mode === option.mode}
                className={[
                  styles.appearanceMenuOption,
                  mode === option.mode ? styles.appearanceMenuOptionActive : '',
                ].join(' ')}
                onClick={() => {
                  setMode(option.mode);
                  setIsAppearanceMenuOpen(false);
                }}
              >
                <span className={styles.appearanceMenuOptionTitle}>{option.title}</span>
                <span className={styles.appearanceMenuOptionDescription}>{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div className={styles.controlPanelRailOverrides}>
      <WebCommandCenterFrame
      brandLabel={panelText.brandLabel}
      surfaceTitle="لوحة القيادة"
      surfaceSubtitle={shellCopy.title}
      showHero={false}
      profileControl={profileControl}
      topFilters={[
        {
          id: allServiceTabId,
          label: panelText.filters.allServices,
          active: isAllFilterActive,
        },
        ...controlPanelRuntimeData.services.map((service) => ({
          id: service.id,
          label: getServiceLabel(uiText, service.id),
          active: selectedServiceId === service.id,
        })),
      ]}
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
      railNavigationLabel={shellCopy.title}
      railStatusLabel={isAllFilterActive ? panelText.filters.allServices : selectedServiceLabel}
      railItems={railItems}
      railSupplementary={null}
      alertCountLabel={String(alertCount)}
    >
      <div className={styles.stageStack} dir={direction}>
        {activeSectionId === 'dashboard' ? (
          <ControlPanelDshClosureDashboardScreen />
        ) : null}

        {activeSectionId === 'finance' ? (
          <ControlPanelDshFinanceHubScreen
            group={financeWorkspace as CanonicalFinanceGroupId}
            panel={financePanel as FinancePanelId}
          />
        ) : null}

        {isOperationsSection ? (
          <DshControlPanelSurfaceHost
            workspace={operationsWorkspace}
            orderId={operationsOrderId}
            orderOverlayMode={operationsOverlayMode}
          />
        ) : null}

        {activeSectionId === 'partners' ? (
          <ControlPanelDshPartnerApprovalsScreen />
        ) : null}

        {activeSectionId === 'catalogs' ? (
          <ControlPanelDshCatalogScreen />
        ) : null}

        {isMarketingSection ? (
          <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />
        ) : null}

        {activeSectionId === 'support' ? (
          <ControlPanelDshSupportQueueScreen />
        ) : null}

        {activeSectionId === 'platform' ? (
          <ControlPanelAppearanceScreen />
        ) : null}
      </div>
    </WebCommandCenterFrame>
    </div>
    </>
  );
}

export default ControlPanelSurfaceHost;
