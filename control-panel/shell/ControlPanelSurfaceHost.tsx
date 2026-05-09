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
import { useDirection, useUiText } from '@bthwani/ui-kit';
import {
  WebControlActionButton,
  WebControlActionCard,
  WebCommandCenterFrame,
  WebControlDisclosureItem,
  WebControlSurfaceHeader,
  WebSectionCard,
  WebSignalCard,
  WebCompactSurfaceHeader,
  WebSystemSuggestion,
} from '@bthwani/ui-kit/web';
import {
  buildOperationsHref,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from '../../dsh/frontend/control-panel/operations';
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'community-services', 'support'] as const;
const hiddenSectionIds = ['catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;
const dshLiveWorkbenchIds = ['orders', 'reassign', 'peakMode', 'arrivalBell'] as const;
const dshPlannedWorkbenchIds = ['sheinProxy', 'zoneSet', 'dashboard', 'captain-ops', 'field-ops', 'issues', 'serviceability', 'guard-status', 'evidence', 'dispatch', 'live-tracking', 'exceptions', 'sla', 'audit', 'partner-prep', 'handoff', 'proof-review', 'capacity'] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];
type ActionTone = 'primary' | 'secondary';
type SignalTone = React.ComponentProps<typeof WebSignalCard>['tone'];

type SectionActionView = {
  id: string;
  label: string;
  description: string;
  footerLabel: string;
  href?: string;
  badge?: string;
  tone?: ActionTone;
  onAction?: () => void;
};

type DisclosureItemView = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  onAction?: () => void;
};

type KpiView = {
  id: string;
  title: string;
  value: string;
  description: string;
  tone?: SignalTone;
};

type SectionBlueprint = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: SectionActionView;
  kpis: ReadonlyArray<KpiView>;
  quickActionsTitle: string;
  quickActionsDescription: string;
  quickActions: ReadonlyArray<SectionActionView>;
  disclosureTitle: string;
  disclosureDescription: string;
  disclosureItems: ReadonlyArray<DisclosureItemView>;
};

type WorkbenchMeta = {
  label: string;
  description: string;
  routeHint: string;
  statusLabel: string;
};

const dshWorkbenchMetaFallback: Record<string, WorkbenchMeta> = {
  dispatch: { label: 'Dispatch', description: 'Assignment and captain board', routeHint: '/operations?workspace=dispatch', statusLabel: 'Preview' },
  'live-tracking': { label: 'Live tracking', description: 'Event timeline', routeHint: '/operations?workspace=live-tracking', statusLabel: 'Preview' },
  exceptions: { label: 'Exceptions', description: 'Unified exception queue', routeHint: '/operations?workspace=exceptions', statusLabel: 'Preview' },
  sla: { label: 'SLA', description: 'Delay monitor', routeHint: '/operations?workspace=sla', statusLabel: 'Preview' },
  audit: { label: 'Audit', description: 'Manual action audit', routeHint: '/operations?workspace=audit', statusLabel: 'Preview' },
  'partner-prep': { label: 'Partner prep', description: 'Partner readiness monitor', routeHint: '/operations?workspace=partner-prep', statusLabel: 'Preview' },
  handoff: { label: 'Handoff', description: 'Pickup and dropoff verification', routeHint: '/operations?workspace=handoff', statusLabel: 'Preview' },
  'proof-review': { label: 'Proof review', description: 'Proof asset review', routeHint: '/operations?workspace=proof-review', statusLabel: 'Preview' },
  capacity: { label: 'Capacity', description: 'Area capacity monitor', routeHint: '/operations?workspace=capacity', statusLabel: 'Preview' },
};

function resolveWorkbenchMeta(workbenches: Record<string, WorkbenchMeta>, workbenchId: string): WorkbenchMeta {
  const existingMeta = workbenches[workbenchId];
  return existingMeta ?? dshWorkbenchMetaFallback[workbenchId] ?? {
    label: workbenchId,
    description: 'Preview workspace',
    routeHint: `/operations?workspace=${workbenchId}`,
    statusLabel: 'Preview',
  };
}
export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  operationsWorkspace?: AnyOperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: OperationsPanelId;
  financeWorkspace?: string;
  financePanel?: string;
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
    marketing: '📣',
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
  const panelText = uiText.controlPanel;
  const [alertCount, setAlertCount] = React.useState(1);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(allServiceTabId);
  const [activeSectionHref, setActiveSectionHref] = React.useState<PrimarySectionHref>(() => (
    section ? (`/${section}` as PrimarySectionHref) : '/dashboard'
  ));

  React.useEffect(() => {
    setActiveSectionHref(section ? (`/${section}` as PrimarySectionHref) : '/dashboard');
  }, [section]);

  const activeSectionId = activeSectionHref.slice(1) as ControlPanelSectionId;
  const isOperationsSection = activeSectionId === 'operations';
  const isMarketingSection = activeSectionId === 'marketing';
  const isCommunityServicesSection = activeSectionId === 'community-services';
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
  const selectedServiceMeta = isAllFilterActive
    ? undefined
    : controlPanelRuntimeData.services.find((service) => service.id === selectedServiceId);
  const selectedServiceLabel = selectedServiceMeta ? getServiceLabel(uiText, selectedServiceMeta.id) : panelText.filters.allServices;
  const serviceSections = selectedServiceMeta?.sections ?? [];
  const serviceSectionLabels = serviceSections.map((sectionId) => panelText.surfaceTitles[sectionId as ControlPanelSectionId] ?? sectionId);
  const sectionServiceIds = getSectionServiceIds(activeSectionId);
  const sectionServiceNames = sectionServiceIds.map((serviceId) => getServiceLabel(uiText, serviceId));
  const liveCoverageCount = countLiveCoverage(sectionServiceIds);
  const referenceCoverageCount = sectionServiceIds.length - liveCoverageCount;
  const scopedSectionUnavailable = !isAllFilterActive && !serviceSections.includes(activeSectionId);
  const readyMissionCount = controlPanelRuntimeData.missions.filter((mission) => !mission.placeholder).length;
  const liveServiceCount = React.useMemo(
    () => controlPanelRuntimeData.services.filter((service) => !service.placeholder).length,
    [],
  );
  const referenceServiceCount = controlPanelRuntimeData.services.length - liveServiceCount;
  const communityServiceItems = React.useMemo(() => (
    sectionServiceIds.map((serviceId) => {
      const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);

      return {
        id: `community-${serviceId}`,
        label: getServiceLabel(uiText, serviceId),
        description: serviceMeta?.placeholder ? 'مرجع' : 'متصل',
        badge: serviceMeta?.placeholder ? panelText.filters.reference : panelText.ui.liveRefreshValue,
        onAction: () => setSelectedServiceId(serviceId),
      } satisfies DisclosureItemView;
    })
  ), [panelText.filters.reference, panelText.ui.liveRefreshValue, sectionServiceIds, uiText]);

  const resolveActionHandler = React.useCallback(
    (href?: string, onAction?: () => void) => onAction ?? (href ? () => router.push(href) : undefined),
    [router],
  );

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

  const buildServiceDisclosureItems = React.useCallback((sectionId: PhaseOneSectionId) => (
    getSectionServiceIds(sectionId).map((serviceId) => {
      const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);

      return {
        id: `${sectionId}-${serviceId}`,
        label: getServiceLabel(uiText, serviceId),
        description: serviceMeta?.placeholder ? 'مرجع' : 'متصل',
        badge: serviceMeta?.placeholder ? panelText.filters.reference : panelText.ui.liveRefreshValue,
        onAction: () => setSelectedServiceId(serviceId),
      } satisfies DisclosureItemView;
    })
  ), [panelText.filters.reference, panelText.ui.liveRefreshValue, uiText]);

  const dashboardDecisionBoard: ReadonlyArray<SectionActionView> = [
    {
      id: 'db-operations',
      label: 'تثبيت العمليات الحية',
      description: 'مراجعة الصفوف الحية والاختناقات التشغيلية فوراً.',
      footerLabel: 'انتقال',
      href: '/operations',
      badge: 'أولوية قصوى',
      tone: 'primary',
    },
    {
      id: 'db-finance',
      label: 'مراجعة المركز المالي',
      description: 'التأكد من سلامة التدفقات بعد استقرار النبض التشغيلي.',
      footerLabel: 'تحليل',
      href: '/finance',
      badge: 'منتظم',
      tone: 'secondary',
    },
    {
      id: 'db-community-services',
      label: 'خدمات المجتمع',
      description: 'اعتماد مسارات المجتمع والخدمات الجديدة قبل البث.',
      footerLabel: 'اعتماد',
      href: '/community-services',
      badge: 'انتظار',
      tone: 'secondary',
    },
  ];

  const phaseOneBlueprint: SectionBlueprint | null = isPhaseOneSection(activeSectionId)
    ? (() => {
        switch (activeSectionId) {
          case 'dashboard':
            return {
              eyebrow: 'Executive Pulse',
              title: 'غرفة القيادة',
              description: 'نظرة تنفيذية شاملة تركز على القرار التسييري.',
              primaryAction: {
                id: 'dashboard-primary',
                label: 'فتح غرفة العمليات',
                description: '',
                footerLabel: 'فتح',
                href: '/operations',
                badge: 'Next Action',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'dashboard-live',
                  title: 'الخدمات الحية',
                  value: String(liveServiceCount),
                  description: 'خدمات متصلة فعلياً وتعمل الآن.',
                  tone: 'brand',
                },
                {
                  id: 'dashboard-ready',
                  title: 'المسارات الجاهزة',
                  value: String(readyMissionCount),
                  description: 'مسارات مكتملة الحوكمة.',
                  tone: 'best',
                },
                {
                  id: 'dashboard-alerts',
                  title: 'تنبيهات حرجة',
                  value: String(alertCount),
                  description: 'تحتاج تدخل سريع.',
                  tone: alertCount > 0 ? 'danger' : 'neutral',
                },
              ],
              quickActionsTitle: 'Decision Board',
              quickActionsDescription: 'أهم التحركات الاستراتيجية المطلوبة الآن.',
              quickActions: dashboardDecisionBoard,
              disclosureTitle: 'المخاطر والعوائق (Risks & Blockers)',
              disclosureDescription: 'عناصر قد تؤثر على الأداء إذا لم يتم حسمها.',
              disclosureItems: [
                {
                  id: 'risk-expansion',
                  label: 'توسع Phase 1',
                  description: 'بعض الأقسام لا تزال مرجعية وتحتاج ربط تقني إضافي.',
                  badge: 'مخاطرة منخفضة',
                },
                {
                  id: 'risk-latency',
                  label: 'زمن الاستجابة',
                  description: 'مراقبة استجابة الفلاتر عند العمل بكثافة بيانات عالية.',
                  badge: 'تحت المراقبة',
                },
              ],
            };
          case 'finance':
          case 'support':
          case 'operations':
            return null;
          default:
            return null;
        }
      })()
    : null;

  return (
    <>
      <div className={styles.controlPanelRailOverrides}>
      <WebCommandCenterFrame
      brandLabel={panelText.brandLabel}
      surfaceTitle="لوحة القيادة"
      surfaceSubtitle={shellCopy.title}
      showHero={!isOperationsSection}
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
        {phaseOneBlueprint ? (
          <>
            {activeSectionId === 'finance' ? (
              <WebCompactSurfaceHeader
                title={phaseOneBlueprint.title}
                description={phaseOneBlueprint.description}
                metrics={phaseOneBlueprint.kpis.map((kpi) => ({
                  id: kpi.id,
                  title: kpi.title,
                  value: kpi.value,
                }))}
              />
            ) : (
              <>
                <WebControlSurfaceHeader
                  chips={[
                    { label: panelText.brandLabel, tone: 'accent' },
                    { label: phaseOneBlueprint.eyebrow, tone: 'brand' },
                    { label: isAllFilterActive ? panelText.filters.allServicesMeta : selectedServiceLabel },
                  ]}
                  title={phaseOneBlueprint.title}
                  description={phaseOneBlueprint.description}
                  actions={[
                    {
                      id: phaseOneBlueprint.primaryAction.id,
                      label: phaseOneBlueprint.primaryAction.label,
                      href: phaseOneBlueprint.primaryAction.href,
                      onAction: resolveActionHandler(
                        phaseOneBlueprint.primaryAction.href,
                        phaseOneBlueprint.primaryAction.onAction,
                      ),
                      tone: phaseOneBlueprint.primaryAction.tone,
                    },
                  ]}
                />

                <div className={styles.metricsStrip}>
                  {phaseOneBlueprint.kpis.map((kpi) => (
                    <WebSignalCard
                      key={kpi.id}
                      title={kpi.title}
                      value={kpi.value}
                      description={kpi.description}
                      tone={kpi.tone}
                    />
                  ))}
                </div>
              </>
            )}


            {activeSectionId === 'dashboard' ? (
              <>
            {/* Removed redundant Dashboard Hero and Readiness Matrix */}
              </>
            ) : null}

            {scopedSectionUnavailable ? (
              <section className={styles.statePanel}>
                <h2 className={styles.stateTitle}>الخدمة المختارة لا تغطي هذا القسم</h2>
                <p className={styles.stateDescription}>
                  بدّل إلى خدمة مناسبة أو أعد العرض إلى كل المساحات حتى لا تبقى الصفحة فارغة بسبب فلتر غير مطابق.
                </p>
                <div className={styles.contextList}>
                  {sectionServiceNames.map((serviceName) => (
                    <span key={serviceName} className={styles.contextChip}>{serviceName}</span>
                  ))}
                </div>
                <div className={styles.stateActions}>
                  <WebControlActionButton
                    id="state-reset"
                    label="عرض كل المساحات"
                    tone="primary"
                    onAction={() => setSelectedServiceId(allServiceTabId)}
                  />
                    <WebControlActionButton
                      id="state-dashboard"
                      label="العودة للنظرة العامة"
                      href="/dashboard"
                      tone="secondary"
                      onAction={() => router.push('/dashboard')}
                    />
                  </div>
                </section>
              ) : (
                <>
                  {phaseOneBlueprint.quickActions.length > 0 ? (
                    <WebSectionCard
                      title={phaseOneBlueprint.quickActionsTitle}
                      description={phaseOneBlueprint.quickActionsDescription}
                    >
                      <div className={styles.actionGrid}>
                        {phaseOneBlueprint.quickActions.map((action) => (
                          <WebControlActionCard
                            key={action.id}
                            id={action.id}
                            title={action.label}
                            description={action.description}
                            footerLabel={action.footerLabel}
                            href={action.href}
                            badge={action.badge}
                            tone={action.tone}
                            onAction={resolveActionHandler(action.href, action.onAction)}
                          />
                        ))}
                      </div>
                    </WebSectionCard>
                  ) : null}

                  {phaseOneBlueprint.disclosureItems.length > 0 ? (
                    <WebSectionCard
                      title={phaseOneBlueprint.disclosureTitle}
                      description={phaseOneBlueprint.disclosureDescription}
                    >
                      <div className={styles.disclosureBody}>
                        {phaseOneBlueprint.disclosureItems.map((item) => (
                          <WebControlDisclosureItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            description={item.description}
                            href={item.href}
                            badge={item.badge}
                            onAction={resolveActionHandler(item.href, item.onAction)}
                          />
                        ))}
                      </div>
                    </WebSectionCard>
                  ) : null}
                </>
              )}
          </>
        ) : null}

        {activeSectionId === 'finance' ? (
          <div style={{ marginTop: 16 }}>
            <ControlPanelDshFinanceHubScreen
              group={financeWorkspace as any}
              panel={financePanel as any}
            />
          </div>
        ) : null}

        {isOperationsSection ? (
          <DshControlPanelSurfaceHost
            workspace={operationsWorkspace}
            orderId={operationsOrderId}
            orderOverlayMode={operationsOverlayMode}
          />
        ) : null}

        {activeSectionId === 'partners' ? (
          <div style={{ marginTop: 16 }}>
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref="/partners" />
          </div>
        ) : null}

        {activeSectionId === 'catalogs' ? (
          <div style={{ marginTop: 16 }}>
            <ControlPanelDshCatalogScreen />
          </div>
        ) : null}

        {isMarketingSection ? (
          <div style={{ marginTop: 16 }}>
            <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />
          </div>
        ) : null}

        {activeSectionId === 'support' ? (
          <div style={{ marginTop: 16 }}>
            <ControlPanelDshSupportQueueScreen />
          </div>
        ) : null}


      </div>
    </WebCommandCenterFrame>
    </div>
    </>
  );
}

export default ControlPanelSurfaceHost;
