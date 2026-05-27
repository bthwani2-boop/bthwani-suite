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
import {
  ControlPanelDshPlatformScreen,
  ControlPanelDshAdministrationScreen,
} from '../../dsh/frontend/control-panel';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDirection, useUiText, type BThwaniAppearanceMode } from '@bthwani/ui-kit';
import {
  WebCommandCenterFrame,
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
import { useControlPanelAppearance } from './appearance';
import styles from './control-panel-shell.module.css';

const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'community-services', 'support'] as const;
const hiddenSectionIds = ['catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  operationsWorkspace?: AnyOperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: OperationsPanelId;
  financeWorkspace?: string;
  financePanel?: string;
};

const allServiceTabId = 'all-services';

type ShellCommandStatus = {
  kind: 'ready' | 'search' | 'refresh' | 'alert' | 'filter' | 'blocked';
  label: string;
  description: string;
};

const renderedSectionIds = [
  'dashboard',
  'operations',
  'finance',
  'community-services',
  'support',
  'partners',
  'catalogs',
  'marketing',
  'platform',
  'administration',
] as const satisfies readonly ControlPanelSectionId[];

function hasRenderableSection(sectionId: ControlPanelSectionId) {
  return (renderedSectionIds as readonly string[]).includes(sectionId);
}

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
  const [commandStatus, setCommandStatus] = React.useState<ShellCommandStatus>({
    kind: 'ready',
    label: 'جاهز',
    description: 'الشل جاهز، وكل إجراء علوي يجب أن يترك أثرًا ظاهرًا داخل هذا الشريط.',
  });
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
      return sectionId === activeSectionId || serviceMeta.sections.includes(sectionId);
    });
  }, [activeSectionHref, isAllFilterActive, panelText, selectedServiceId, activeSectionId]);



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
  const activeMission = controlPanelRuntimeData.missions.find((mission) => (
    mission.sectionId === activeSectionId && !mission.placeholder
  ));
  const activeSectionRuntime = controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === activeSectionId);
  const activeSectionServiceIds = activeSectionRuntime?.serviceIds ?? [];
  const liveSectionServiceCount = activeSectionServiceIds.filter((serviceId) => {
    const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);
    return serviceMeta && !serviceMeta.placeholder;
  }).length;
  const hasPrimarySectionContent = hasRenderableSection(activeSectionId);
  const sectionOwnershipLabel = activeMission
    ? `owner:${activeMission.ownerSectionId} / flow:${activeMission.flowId}`
    : 'owner:TBD / flow:TBD';
  const sectionCoverageLabel = activeSectionServiceIds.length > 0
    ? `${liveSectionServiceCount}/${activeSectionServiceIds.length} live services`
    : 'لا توجد خدمات مرتبطة';
  const shellStatusClassName = [
    styles.shellContractStatusPill,
    commandStatus.kind === 'blocked' ? styles.shellContractStatusPillBlocked : '',
    commandStatus.kind === 'alert' ? styles.shellContractStatusPillAlert : '',
  ].join(' ');

  const handleBrandClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setActiveSectionHref('/dashboard');
    router.push('/dashboard');
  }, [router]);

  const handleSearchClick = React.useCallback(() => {
    setCommandStatus({
      kind: 'search',
      label: 'بحث القسم',
      description: `تم تفعيل بحث الشل داخل ${shellCopy.title}. لا يتم إنشاء route جديد؛ التفاصيل يجب أن تبقى داخل tabs/drawers/split panes الخاصة بالقسم.`,
    });
  }, [shellCopy.title]);

  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((currentCount) => (currentCount > 0 ? currentCount - 1 : 0));
    setCommandStatus({
      kind: 'refresh',
      label: 'تحديث محلي',
      description: `تم تحديث حالة الشل للقسم ${shellCopy.title} بدون API/backend/runtime mutation.`,
    });
  }, [shellCopy.title]);

  const handleAlertClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setAlertCount(0);
    setCommandStatus({
      kind: 'alert',
      label: 'تمت مراجعة التنبيهات',
      description: 'تمت إعادة فلتر الخدمات إلى الكل وتصفير مؤشر التنبيه داخل الشل.',
    });
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
      onTopFilterSelect={(serviceId) => {
        setSelectedServiceId(serviceId);
        const nextLabel = serviceId === allServiceTabId
          ? panelText.filters.allServices
          : getServiceLabel(uiText, serviceId);
        const serviceMeta = serviceId === allServiceTabId ? undefined : controlPanelRuntimeData.services.find(s => s.id === serviceId);
        const isSectionOutsideFilter = serviceMeta && !serviceMeta.sections.includes(activeSectionId);
        setCommandStatus({
          kind: 'filter',
          label: 'فلتر الخدمات',
          description: isSectionOutsideFilter
            ? 'القسم الحالي خارج فلتر الخدمة، بقي القسم ثابتًا ويمكن الانتقال يدويًا من rail.'
            : `تم حصر rail على ${nextLabel} مع الحفاظ على section ثابت وعدم إنشاء route إضافي.`,
        });
      }}
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
        <section className={styles.shellContractStrip} aria-live="polite">
          <nav className={styles.shellContractBreadcrumbs} aria-label="مسار لوحة التحكم">
            <span>{panelText.brandLabel}</span>
            <span aria-hidden="true">/</span>
            <strong>{shellCopy.title}</strong>
          </nav>

          <div className={styles.shellContractStatusCluster}>
            <span className={shellStatusClassName}>{commandStatus.label}</span>
            <span className={styles.shellContractStatusText}>{commandStatus.description}</span>
            <span className={styles.shellContractMeta}>{sectionOwnershipLabel}</span>
            <span className={styles.shellContractMeta}>{sectionCoverageLabel}</span>
          </div>
        </section>

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

        {activeSectionId === 'platform' ? (
          <ControlPanelDshPlatformScreen />
        ) : null}

        {activeSectionId === 'administration' ? (
          <ControlPanelDshAdministrationScreen />
        ) : null}

        {activeSectionId === 'support' ? (
          <ControlPanelDshSupportQueueScreen />
        ) : null}

        {!hasPrimarySectionContent ? (
          <section className={styles.shellBoundaryState} role="status" aria-label="حالة حدود القسم">
            <span className={styles.shellBoundaryEyebrow}>حدود القسم</span>
            <h2 className={styles.shellBoundaryTitle}>{shellCopy.title}</h2>
            <p className={styles.shellBoundaryDescription}>
              هذا route موجود في خريطة الشل، لكنه لا يملك workspace قابلًا للعرض داخل العقد الحالي.
              لذلك لا يتم عرض واجهة ساكنة تدّعي التشغيل. يجب تحويل تفاصيله إلى tab/drawer/split pane داخل المالك الصحيح قبل اعتباره مغلقًا.
            </p>
            <button
              type="button"
              className={styles.shellBoundaryAction}
              onClick={() => {
                setCommandStatus({
                  kind: 'blocked',
                  label: 'قسم غير مكتمل',
                  description: `${shellCopy.title} يحتاج owner/workspace مثبت قبل تفعيل شاشة مستقلة.`,
                });
                router.push('/administration');
              }}
            >
              فتح الإدارة كمالك مؤقت
            </button>
          </section>
        ) : null}

      </div>
    </WebCommandCenterFrame>
    </div>
    </>
  );
}

export default ControlPanelSurfaceHost;
