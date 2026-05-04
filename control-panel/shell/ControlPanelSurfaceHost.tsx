"use client";

import {
  DshControlPanelSurfaceHost,
  ControlPanelDshMarketingScreen,
  ControlPanelDshPartnerApprovalsScreen,
  useDshControlPanelText,
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
  WebSegmentedTabs,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  buildOperationsHref,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from '../../dsh/frontend/control-panel/operations';
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'catalogs', 'support'] as const;
const hiddenSectionIds = ['community-services', 'partners', 'marketing', 'control'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;
const controlSubSectionIds = ['platform', 'administration', 'hr'] as const;
const dshLiveWorkbenchIds = ['orders', 'reassign', 'peakMode', 'arrivalBell'] as const;
const dshPlannedWorkbenchIds = ['sheinProxy', 'zoneSet', 'dashboard', 'captain-ops', 'field-ops', 'issues', 'serviceability', 'guard-status', 'evidence', 'dispatch', 'live-tracking', 'exceptions', 'sla', 'audit', 'partner-prep', 'handoff', 'proof-review', 'capacity'] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type ControlPanelSubSectionId = (typeof controlSubSectionIds)[number];
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
  subsection?: ControlPanelSubSectionId;
  operationsWorkspace?: AnyOperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: OperationsPanelId;
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

const compactSectionDescriptions: Record<PhaseOneSectionId, string> = {
  dashboard: 'نظرة سريعة',
  operations: 'حالة التشغيل',
  finance: 'المركز المالي',
  catalogs: 'حوكمة الكتالوج',
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

function getSectionServiceIds(sectionId: string) {
  return controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === sectionId)?.serviceIds ?? [];
}

function countLiveCoverage(serviceIds: readonly string[]) {
  return serviceIds.filter((serviceId) => {
    const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);
    return serviceMeta && !serviceMeta.placeholder;
  }).length;
}

function buildControlHref(subsection?: ControlPanelSubSectionId) {
  if (!subsection) {
    return '/control';
  }

  const searchParams = new URLSearchParams();
  searchParams.set('tab', subsection);
  return `/control?${searchParams.toString()}`;
}

function resolveRailItems(activeHref: PrimarySectionHref, panelText: ControlPanelText) {
  const iconMap: Record<string, string> = {
    dashboard: '⬡',
    operations: '◈',
    finance: '⌬',
    catalogs: '◳',
    support: '◌',
    'community-services': '◍',
    partners: '⌂',
    marketing: '⌁',
    control: '⚙',
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
      children: sectionId === 'control' ? [
        { id: '/control?tab=platform', label: 'المنصة', href: '/control?tab=platform' },
        { id: '/control?tab=administration', label: 'الإدارة', href: '/control?tab=administration' },
        { id: '/control?tab=hr', label: 'الموارد البشرية', href: '/control?tab=hr' },
      ] : undefined,
    };
  });
}

const SidebarOverrides = () => (
  <style>{`
    .ui-web-command-center-root {
      --rail-width: 72px !important;
    }
    .ui-web-command-center__rail {
      overflow: visible !important;
      padding: 16px 8px !important;
      align-items: center;
    }
    .ui-web-command-center__rail-item {
      position: relative;
      width: 44px;
      height: 44px;
      justify-content: center;
      padding: 0 !important;
      overflow: visible !important;
    }
    .ui-web-command-center__rail-item span:nth-child(2) {
      position: absolute;
      right: 100%;
      margin-right: 8px;
      opacity: 0;
      pointer-events: none;
      background: #0A2F5C;
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(10, 47, 92, 0.15);
      transition: opacity 0.15s ease, transform 0.15s ease;
      transform: translateX(-4px);
      z-index: 1000;
    }
    [dir="rtl"] .ui-web-command-center__rail-item span:nth-child(2) {
      right: auto;
      left: 100%;
      margin-right: 0;
      margin-left: 8px;
      transform: translateX(4px);
    }
    .ui-web-command-center__rail-item:hover span:nth-child(2) {
      opacity: 1;
      transform: translateX(0);
    }
    .ui-web-command-center__rail-item span:nth-child(3) {
      display: none !important; /* Hide badge on narrow rail */
    }
    .ui-web-command-center__rail-section-title {
      display: none;
    }
    .ui-web-command-center__rail-back {
      padding: 8px;
      font-size: 0;
    }
    .ui-web-command-center__rail-back::before {
      content: '←';
      font-size: 16px;
    }
  `}</style>
);

export function ControlPanelSurfaceHost({
  section,
  subsection,
  operationsWorkspace = 'overview',
  operationsOrderId,
  operationsOverlayMode,
}: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const dshText = useDshControlPanelText();
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
  const isOperationsSection = activeSectionId === 'operations';
  const isMarketingSection = activeSectionId === 'marketing';
  const isCommunityServicesSection = activeSectionId === 'community-services';
  const activeControlSubsection = isControlSection ? subsection : undefined;
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const shellCopy = resolveShellCopy(panelText, activeSectionId, activeControlSubsection);
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
      id: 'db-catalogs',
      label: 'حوكمة المحتوى',
      description: 'اعتماد النشرات والكتالوجات الجديدة قبل البث.',
      footerLabel: 'اعتماد',
      href: '/catalogs',
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
          case 'operations':
            return null;
          case 'finance':
            return {
              eyebrow: 'مالي',
              title: panelText.surfaceTitles.finance,
              description: 'عرض مالي',
              primaryAction: {
                id: 'finance-primary',
                label: 'تركيز WLT',
                description: '',
                footerLabel: 'تصفية',
                badge: 'موصى',
                tone: 'primary',
                onAction: () => setSelectedServiceId('wlt'),
              },
              kpis: [
                {
                  id: 'finance-services',
                  title: 'المساحات المرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'كل مساحة تحمل مسارًا ماليًا داخل اللوحة.',
                  tone: 'brand',
                },
                {
                  id: 'finance-live',
                  title: 'جاهز للتشغيل',
                  value: String(liveCoverageCount),
                  description: 'مسارات يمكن التركيز عليها الآن دون قفزات إضافية.',
                  tone: 'best',
                },
                {
                  id: 'finance-reference',
                  title: 'مرجعي',
                  value: String(referenceCoverageCount),
                  description: 'مسارات تبقى ظاهرة بدون ادعاء جاهزية أعلى من الواقع.',
                },
                {
                  id: 'finance-links',
                  title: 'مخارج سريعة',
                  value: '2',
                  description: 'عودة مباشرة للنظرة العامة أو الدعم.',
                },
              ],
              quickActionsTitle: 'إجراءات',
              quickActionsDescription: 'أزرار',
              quickActions: [
                {
                  id: 'finance-focus-wlt',
                  label: 'تركيز على WLT',
                  description: 'فلترة الصفحة إلى المسار المالي الموصى به الآن.',
                  footerLabel: 'تصفية فورية',
                  badge: 'مباشر',
                  tone: 'primary',
                  onAction: () => setSelectedServiceId('wlt'),
                },
                {
                  id: 'finance-overview',
                  label: 'العودة للنظرة العامة',
                  description: 'انتقال سريع لإعادة ترتيب الأولويات قبل الحسم التالي.',
                  footerLabel: 'فتح القسم',
                  href: '/dashboard',
                },
                {
                  id: 'finance-support',
                  label: 'تنسيق الدعم',
                  description: 'افتح الدعم عندما يحتاج القرار المالي إلى استعادة تجربة العميل.',
                  footerLabel: 'فتح القسم',
                  href: '/support',
                },
                {
                  id: 'finance-operations',
                  label: 'العودة للعمليات',
                  description: 'اربط القرار المالي بمسار التنفيذ المباشر بدون مغادرة الشريط الحاكم.',
                  footerLabel: 'فتح القسم',
                  href: '/operations',
                },
              ],
              disclosureTitle: 'تغطية مالية حسب الخدمة',
              disclosureDescription: 'التحويل بين الخدمات يبقى أقل بروزًا من الإجراء الأول.',
              disclosureItems: buildServiceDisclosureItems('finance'),
            };
          case 'catalogs':
            return {
              eyebrow: 'كتالوج',
              title: panelText.surfaceTitles.catalogs,
              description: 'حوكمة مختصرة',
              primaryAction: {
                id: 'catalogs-primary',
                label: 'افتح الكتالوج',
                description: '',
                footerLabel: 'فتح',
                href: '/catalogs',
                badge: 'حي',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'catalogs-services',
                  title: 'المساحات المرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'الخدمات التي تستهلك حوكمة الكتالوج من هذا السطح.',
                  tone: 'brand',
                },
                {
                  id: 'catalogs-live',
                  title: 'بوابات حية',
                  value: '3',
                  description: 'كتالوج، شركاء، وتسويق قابلة للفتح مباشرة.',
                  tone: 'best',
                },
                {
                  id: 'catalogs-ready',
                  title: 'جاهز للتشغيل',
                  value: String(liveCoverageCount),
                  description: 'مساحات يمكن متابعتها الآن دون تكرار الشرح.',
                },
                {
                  id: 'catalogs-reference',
                  title: 'مرجعي',
                  value: String(referenceCoverageCount),
                  description: 'تغطية مرئية أقل بروزًا من القرار الأساسي.',
                },
              ],
              quickActionsTitle: 'مفاتيح',
              quickActionsDescription: 'أزرار',
              quickActions: [
                {
                  id: 'catalogs-open',
                  label: 'كتالوج DSH',
                  description: 'إدارة الفئات والمنتجات من المسار الحي المباشر.',
                  footerLabel: 'فتح مباشر',
                  href: '/catalogs',
                  badge: 'حي',
                  tone: 'primary',
                },
                {
                  id: 'catalogs-partners',
                  label: 'بوابة الشركاء',
                  description: 'مراجعة الإدخالات قبل انتقالها إلى الكتالوج النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/partners',
                  badge: 'مراجعة',
                },
                {
                  id: 'catalogs-marketing',
                  label: 'التسويق',
                  description: 'اعتماد الرسائل والعرض قبل النشر النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/marketing',
                  badge: 'اعتماد',
                },
                {
                  id: 'catalogs-overview',
                  label: 'العودة للنظرة العامة',
                  description: 'ارجع بسرعة إلى مركز القرار بدل التنقل عبر شاشات وسيطة.',
                  footerLabel: 'فتح القسم',
                  href: '/dashboard',
                },
              ],
              disclosureTitle: 'تغطية الكتالوج حسب الخدمة',
              disclosureDescription: 'التحويل بين الخدمات يبقى ثانويًا حتى لا ينافس بوابات الحوكمة الأساسية.',
              disclosureItems: buildServiceDisclosureItems('catalogs'),
            };
          case 'support':
            return {
              eyebrow: 'استعادة تجربة العميل',
              title: panelText.surfaceTitles.support,
              description: 'دعم مختصر',
              primaryAction: {
                id: 'support-primary',
                label: 'ابدأ من الطلبات',
                description: '',
                footerLabel: 'فتح',
                href: buildOperationsHref('orders'),
                badge: 'حي',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'support-services',
                  title: 'المساحات المرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'خدمات يمكن ربط الدعم بها من هذا السطح.',
                  tone: 'brand',
                },
                {
                  id: 'support-live',
                  title: 'جاهز للتصعيد',
                  value: String(liveCoverageCount),
                  description: 'مسارات يمكن تحويل التركيز إليها الآن.',
                  tone: 'best',
                },
                {
                  id: 'support-pressure',
                  title: 'تصعيدات مرئية',
                  value: String(alertCount),
                  description: 'إشارة مختصرة تحافظ على أولوية الدعم واضحة.',
                  tone: alertCount > 0 ? 'danger' : 'neutral',
                },
                {
                  id: 'support-recovery',
                  title: 'مخرج آمن',
                  value: '2',
                  description: 'عودة سريعة للنظرة العامة أو العمليات.',
                },
              ],
              quickActionsTitle: 'إجراءات',
              quickActionsDescription: 'أزرار سريعة',
              quickActions: [
                {
                  id: 'support-orders',
                  label: 'طلبات قابلة للتصعيد',
                  description: 'افتح الصف التشغيلي الأقرب للحسم بدل التدرج عبر صفحات وصفية.',
                  footerLabel: 'فتح مباشر',
                  href: buildOperationsHref('orders'),
                  badge: 'حي',
                  tone: 'primary',
                },
                {
                  id: 'support-arb',
                  label: 'حصر العرض على ARB',
                  description: 'تركيز الصفحة على المساحة الأنسب حاليًا للدعم.',
                  footerLabel: 'تصفية فورية',
                  badge: 'مباشر',
                  onAction: () => setSelectedServiceId('arb'),
                },
                {
                  id: 'support-operations',
                  label: 'العودة للعمليات',
                  description: 'انتقال سريع إذا احتاج التصعيد إلى قرار تشغيلي أولًا.',
                  footerLabel: 'فتح القسم',
                  href: '/operations',
                },
                {
                  id: 'support-overview',
                  label: 'العودة للنظرة العامة',
                  description: 'استخدمها عندما تحتاج إعادة ترتيب الأولويات قبل المتابعة.',
                  footerLabel: 'فتح القسم',
                  href: '/dashboard',
                },
              ],
              disclosureTitle: 'تغطية الدعم حسب الخدمة',
              disclosureDescription: 'الخدمات الداعمة تبقى مرئية لكن أقل بروزًا من مسار triage الأساسي.',
              disclosureItems: buildServiceDisclosureItems('support'),
            };
          default:
            return null;
        }
      })()
    : null;

  return (
    <>
      <SidebarOverrides />
      <WebCommandCenterFrame
      brandLabel={panelText.brandLabel}
      surfaceTitle="لوحة التحكم"
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
      railStatusLabel={isAllFilterActive ? panelText.filters.allServices : selectedServiceLabel}
      railItems={railItems}
      railSupplementary={null}
      alertCountLabel={String(alertCount)}
    >
      <div className={styles.stageStack} dir={direction}>
        {phaseOneBlueprint ? (
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


            {activeSectionId === 'dashboard' ? (
              <WebSectionCard
                title="النظرة التنفيذية"
                description="ملخص استراتيجي لنبض المنصة وغرفة القيادة."
              >
                <div className={styles.dashboardHeroCard}>
                  <div className={styles.dashboardHeroEyebrow}>BThwani Premium Control Room 2026</div>
                  <h2 className={styles.dashboardHeroTitle}>غرفة قيادة تنفيذية بنبرة هادئة وكثافة قرار أعلى.</h2>
                  <p className={styles.dashboardHeroDescription}>
                    هذا السطح لم يعد مجرد overview عام. تم رفعه ليصبح طبقة قيادة تقرأ نبض المنصة،
                    وتوضح أين يبدأ القرار الآن، وما الذي يجب أن يبقى في الخلفية دون ضوضاء بصرية.
                  </p>
                </div>
              </WebSectionCard>
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

                  <details className={styles.disclosure}>
                    <summary className={styles.disclosureSummary}>
                      <span>{phaseOneBlueprint.disclosureTitle}</span>
                      <span className={styles.disclosureHint}>{phaseOneBlueprint.disclosureDescription}</span>
                    </summary>
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
                  </details>
                </WebSectionCard>

              </>
            )}
          </>
        ) : null}

        {isOperationsSection ? (
          <DshControlPanelSurfaceHost
            workspace={operationsWorkspace}
            orderId={operationsOrderId}
            orderOverlayMode={operationsOverlayMode}
          />
        ) : null}

        {activeSectionId === 'partners' ? (
          <WebSectionCard
            title={panelText.surfaceTitles.partners}
            description={panelText.surfaceDescriptions.partners}
          >
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref="/partners" />
          </WebSectionCard>
        ) : null}

        {isMarketingSection ? (
          <WebSectionCard
            title={panelText.surfaceTitles.marketing}
            description={panelText.surfaceDescriptions.marketing}
          >
            <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />
          </WebSectionCard>
        ) : null}

        {isControlSection ? (
          <WebSectionCard
            title={panelText.ui.subsectionTitle}
            description={panelText.ui.subsectionDescription}
          >
              <WebSegmentedTabs
                ariaLabel={panelText.ui.subsectionTitle}
                items={controlSubSectionIds.map((subsectionId) => ({
                  id: subsectionId,
                  label: panelText.subSections[subsectionId],
                  active: activeControlSubsection === subsectionId,
                }))}
                onSelect={(subsectionId) => {
                  if ((controlSubSectionIds as readonly string[]).includes(subsectionId)) {
                    router.push(buildControlHref(subsectionId as ControlPanelSubSectionId));
                  }
                }}
              />
              <div className={styles.sectionGrid}>
                {controlSubSectionIds.map((subsectionId) => {
                  const href = buildControlHref(subsectionId);
                  const isActive = subsectionId === activeControlSubsection;

                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(event) => {
                      event.preventDefault();
                      router.push(href);
                    }}
                    className={[styles.sectionLink, isActive ? styles.sectionLinkActive : ''].filter(Boolean).join(' ')}
                  >
                    <strong className={styles.sectionLinkLabel}>{panelText.subSections[subsectionId]}</strong>
                    <span className={styles.sectionLinkDescription}>{panelText.subSectionDescriptions[subsectionId]}</span>
                  </a>
                );
              })}
            </div>
          </WebSectionCard>
        ) : null}

        {isCommunityServicesSection ? (
          <>
            <WebControlSurfaceHeader
              chips={[
                { label: shellCopy.title, tone: 'brand' },
                { label: `${liveCoverageCount} حي`, tone: 'accent' },
                { label: `${referenceCoverageCount} مرجعي`, tone: 'neutral' },
              ]}
              title={shellCopy.title}
              description={shellCopy.description}
              actions={[
                { label: 'فتح الدعم', href: '/support', tone: 'primary' },
                { label: 'فتح العمليات', href: '/operations', tone: 'secondary' },
              ]}
            />

            <div className={styles.metricsStrip}>
              <WebSignalCard
                title="الخدمات المتصلة"
                value={String(sectionServiceIds.length)}
                description="الخدمات التي تظهر داخل هذا القسم من الشريط العلوي والحوكمة المشتركة."
                tone="brand"
              />
              <WebSignalCard
                title="المسارات الحية"
                value={String(liveCoverageCount)}
                description="خدمات متصلة فعليًا ويمكن تثبيت تركيزها من نفس الصفحة."
                tone="best"
              />
              <WebSignalCard
                title="المراجع المؤجلة"
                value={String(referenceCoverageCount)}
                description="تظل مرئية كمرجع بدون تضخيم route depth قبل الجاهزية."
              />
            </div>

            <WebSectionCard
              title="مساحات الخدمة المتصلة"
              description="اختر خدمة مرتبطة بهذا القسم أو ثبت تركيزها من الشريط العلوي بدل الوقوع في fallback عام."
            >
              <div className={styles.disclosureBody}>
                {communityServiceItems.map((item) => (
                  <WebControlDisclosureItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    description={item.description}
                    badge={item.badge}
                    onAction={item.onAction}
                  />
                ))}
              </div>
            </WebSectionCard>

            <WebSectionCard
              title="أقرب المسارات الحية"
              description="بدل فتح صفحة فارغة، انتقل مباشرة إلى أقرب مساحة تشغيل أو دعم مرتبطة بهذا القسم."
            >
              <div className={styles.actionGrid}>
                <WebControlActionCard
                  id="community-support"
                  title="الدعم"
                  description="افتح مسار الدعم عندما تكون الخدمة المجتمعية بحاجة إلى تصعيد أو متابعة مباشرة."
                  footerLabel="فتح القسم"
                  href="/support"
                  badge="حي"
                  tone="primary"
                  onAction={() => router.push('/support')}
                />
                <WebControlActionCard
                  id="community-operations"
                  title="العمليات"
                  description="ارجع إلى مسار العمليات إذا كانت الحالة تحتاج قرارًا تشغيليًا سريعًا من نفس الغرفة."
                  footerLabel="فتح القسم"
                  href="/operations"
                  onAction={() => router.push('/operations')}
                />
              </div>
            </WebSectionCard>
          </>
        ) : null}

        {!phaseOneBlueprint && activeSectionId !== 'partners' && activeSectionId !== 'marketing' && !isControlSection && !isCommunityServicesSection && !isOperationsSection ? (
          <WebSectionCard title={shellCopy.title} description={shellCopy.description}>
            <div className={styles.actionGrid}>
              <WebControlActionCard
                id="fallback-dashboard"
                title="العودة للنظرة العامة"
                description="هذا القسم خارج نطاق Phase 1، لذلك تبقى العودة للغرفة الأساسية هي المسار الأول."
                footerLabel="فتح القسم"
                href="/dashboard"
                badge="Phase 1"
                tone="primary"
                onAction={() => router.push('/dashboard')}
              />
              <WebControlActionCard
                id="fallback-operations"
                title="الانتقال للعمليات"
                description="افتح أقرب مسار تنفيذي حي بدل توسيع هذه الصفحة في هذه المرحلة."
                footerLabel="فتح القسم"
                href="/operations"
                onAction={() => router.push('/operations')}
              />
            </div>
          </WebSectionCard>
        ) : null}
      </div>
    </WebCommandCenterFrame>
    </>
  );
}

export default ControlPanelSurfaceHost;



