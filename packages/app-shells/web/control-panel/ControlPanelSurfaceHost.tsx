"use client";

import {
  DshControlPanelSurfaceHost,
  ControlPanelDshMarketingScreen,
  ControlPanelDshPartnerApprovalsScreen,
  useDshControlPanelText,
} from '@bthwani/surfaces/control-panel';
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
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'catalogs', 'support'] as const;
const hiddenSectionIds = ['community-services', 'partners', 'marketing', 'control'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;
const controlSubSectionIds = ['platform', 'administration', 'governance', 'hr'] as const;
const dshLiveWorkbenchIds = ['orders', 'reassign', 'peakMode', 'arrivalBell'] as const;
const dshPlannedWorkbenchIds = ['sheinProxy', 'zoneSet', 'dashboard', 'captain-ops', 'field-ops', 'finance', 'settlements', 'cod', 'refunds', 'issues', 'serviceability', 'guard-status', 'evidence'] as const;
const operationsWorkspaceIds = ['overview', 'dashboard', 'captain-ops', 'field-ops', 'finance', 'settlements', 'cod', 'refunds', 'issues', 'serviceability', 'guard-status', 'evidence', 'orders', 'partners', 'catalogs', 'marketing', 'sheinproxy', 'reassign', 'peak-mode', 'bell', 'zone-set'] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type ControlPanelSubSectionId = (typeof controlSubSectionIds)[number];
type OperationsWorkspaceId = (typeof operationsWorkspaceIds)[number];
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

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
  operationsWorkspace?: OperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: 'detail' | 'chat';
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

function buildOperationsHref(
  workspace: OperationsWorkspaceId = 'overview',
  options?: {
    orderId?: string;
    panel?: 'detail' | 'chat';
  },
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

function buildControlHref(subsection?: ControlPanelSubSectionId) {
  if (!subsection) {
    return '/control';
  }

  const searchParams = new URLSearchParams();
  searchParams.set('tab', subsection);
  return `/control?${searchParams.toString()}`;
}

function resolveRailItems(activeHref: PrimarySectionHref, panelText: ControlPanelText) {
  return primarySectionIds.map((sectionId) => {
    const href = `/${sectionId}` as PrimarySectionHref;
    const description = isPhaseOneSection(sectionId)
      ? compactSectionDescriptions[sectionId]
      : panelText.surfaceDescriptions[sectionId];

    return {
      id: href,
      href,
      label: panelText.surfaceTitles[sectionId],
      description,
      active: href === activeHref,
      badge: href === '/dashboard' ? panelText.ui.openServiceSpace : undefined,
    };
  });
}

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
  const railItems = resolveRailItems(activeSectionHref, panelText);
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
  const contextItems = isAllFilterActive ? sectionServiceNames : serviceSectionLabels;
  const scopedSectionUnavailable = !isAllFilterActive && !serviceSections.includes(activeSectionId);
  const readyMissionCount = controlPanelRuntimeData.missions.filter((mission) => !mission.placeholder).length;
  const liveServiceCount = React.useMemo(
    () => controlPanelRuntimeData.services.filter((service) => !service.placeholder).length,
    [],
  );
  const referenceServiceCount = controlPanelRuntimeData.services.length - liveServiceCount;
  const dashboardSectionSnapshots = React.useMemo(
    () => phaseOneSectionIds.map((sectionId) => {
      const serviceIds = getSectionServiceIds(sectionId);
      const missionMeta = controlPanelRuntimeData.missions.find((mission) => mission.sectionId === sectionId);

      return {
        id: sectionId,
        title: panelText.surfaceTitles[sectionId],
        description: panelText.surfaceDescriptions[sectionId],
        href: sectionRouteMap[sectionId],
        serviceCount: serviceIds.length,
        liveCount: countLiveCoverage(serviceIds),
        missionReady: missionMeta ? !missionMeta.placeholder : false,
      };
    }),
    [panelText.surfaceDescriptions, panelText.surfaceTitles],
  );
  const dashboardPriorityQueue = React.useMemo(
    () => [
      {
        id: 'queue-operations',
        label: panelText.surfaceTitles.operations,
        note: 'الأولوية الأولى لتثبيت الصفوف الحية والاختناقات قبل أي قراءة لاحقة.',
        metric: `${dshLiveWorkbenchIds.length} مسارات حية`,
        href: '/operations',
      },
      {
        id: 'queue-finance',
        label: panelText.surfaceTitles.finance,
        note: 'الطبقة المالية يجب أن تقرأ بعد استقرار النبض التشغيلي لا قبله.',
        metric: `${getSectionServiceIds('finance').length} خدمة مرتبطة`,
        href: '/finance',
      },
      {
        id: 'queue-catalogs',
        label: panelText.surfaceTitles.catalogs,
        note: 'حوكمة النشر والكتالوج تحتاج مساراً واضحاً بعيداً عن ضجيج العمليات.',
        metric: `${getSectionServiceIds('catalogs').length} خدمة مرتبطة`,
        href: '/catalogs',
      },
      {
        id: 'queue-control',
        label: panelText.surfaceTitles.control,
        note: 'طبقة السيادة والحوكمة تبقى مستقلة بصرياً وأهدأ في لهجتها.',
        metric: `${controlSubSectionIds.length} محاور داخلية`,
        href: '/control',
      },
    ],
    [panelText.surfaceTitles],
  );
  const dashboardConstellation = React.useMemo(
    () => controlPanelRuntimeData.services.map((service) => ({
      id: service.id,
      label: getServiceLabel(uiText, service.id),
      sections: service.sections.length,
      statusLabel: service.placeholder ? panelText.filters.reference : panelText.ui.liveRefreshValue,
      isReference: service.placeholder,
    })),
    [panelText.filters.reference, panelText.ui.liveRefreshValue, uiText],
  );
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

  const dashboardCards = phaseOneSectionIds.map((sectionId) => {
    const serviceIds = getSectionServiceIds(sectionId);

    return {
      id: `dashboard-${sectionId}`,
      label: panelText.surfaceTitles[sectionId],
      description: '',
      footerLabel: 'فتح',
      href: sectionRouteMap[sectionId],
      badge: `${serviceIds.length} مساحات`,
      tone: sectionId === 'operations' ? 'primary' : 'secondary',
    } satisfies SectionActionView;
  });

  const phaseOneBlueprint: SectionBlueprint | null = isPhaseOneSection(activeSectionId)
    ? (() => {
        switch (activeSectionId) {
          case 'dashboard':
            return {
              eyebrow: panelText.ui.missionEyebrow,
              title: panelText.surfaceTitles.dashboard,
              description: 'نظرة مختصرة',
              primaryAction: {
                id: 'dashboard-primary',
                label: 'ابدأ من العمليات',
                description: '',
                footerLabel: 'فتح',
                href: '/operations',
                badge: 'موصى',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'dashboard-core',
                  title: 'الأقسام الأساسية',
                  value: String(phaseOneSectionIds.length),
                  description: 'النطاق المغلق لهذه المرحلة فقط.',
                  tone: 'brand',
                },
                {
                  id: 'dashboard-services',
                  title: 'المساحات المتصلة',
                  value: String(controlPanelRuntimeData.services.length),
                  description: 'الخدمات الظاهرة في الشريط العلوي.',
                },
                {
                  id: 'dashboard-ready',
                  title: 'المسارات الجاهزة',
                  value: String(readyMissionCount),
                  description: 'مسارات موصولة فعليًا داخل control-panel.',
                  tone: 'best',
                },
                {
                  id: 'dashboard-alerts',
                  title: 'تحتاج تركيز',
                  value: String(alertCount),
                  description: 'إشارات تحتاج قرارًا أسرع من بقية الصفحة.',
                  tone: alertCount > 0 ? 'danger' : 'neutral',
                },
              ],
              quickActionsTitle: 'أساسيات',
              quickActionsDescription: 'إجراءات سريعة',
              quickActions: dashboardCards,
              disclosureTitle: 'أقسام أقل أولوية في Phase 1',
              disclosureDescription: 'تبقى متاحة لكن لا تنافس القرار الأول.',
              disclosureItems: hiddenSectionIds.map((sectionId) => ({
                id: `hidden-${sectionId}`,
                label: panelText.surfaceTitles[sectionId],
                description: 'يبقى ظاهرًا داخل الشريط الجانبي مع خفض البروز حتى إغلاق المرحلة الحالية.',
                href: sectionRouteMap[sectionId],
                badge: 'خارج النطاق',
              })),
            };
          case 'operations':
            return {
              eyebrow: 'غرفة القرار',
              title: panelText.surfaceTitles.operations,
              description: 'حالة تشغيل',
              primaryAction: {
                id: 'operations-primary',
                label: 'افتح الطلبات',
                description: '',
                footerLabel: 'فتح',
                href: dshText.hub.workbenches.orders.routeHint,
                badge: 'حي',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'operations-services',
                  title: 'المساحات المرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'الخدمات التي تظهر هذه الغرفة ضمن control-panel.',
                  tone: 'brand',
                },
                {
                  id: 'operations-live',
                  title: 'مسارات حية',
                  value: String(dshLiveWorkbenchIds.length),
                  description: 'مهام يمكن فتحها الآن من أول نقرة.',
                  tone: 'best',
                },
                {
                  id: 'operations-planned',
                  title: 'توسعات لاحقة',
                  value: String(dshPlannedWorkbenchIds.length),
                  description: 'تبقى ظاهرة دون أن تزاحم المسار الحي.',
                },
                {
                  id: 'operations-pressure',
                  title: 'الضغط الحالي',
                  value: String(alertCount),
                  description: 'إشارات مرئية تعود للصفر بعد المراجعة.',
                  tone: alertCount > 0 ? 'danger' : 'neutral',
                },
              ],
              quickActionsTitle: 'مسارات',
              quickActionsDescription: 'أزرار سريعة',
              quickActions: dshLiveWorkbenchIds.map((workbenchId) => ({
                id: `operations-${workbenchId}`,
                label: dshText.hub.workbenches[workbenchId].label,
                description: dshText.hub.workbenches[workbenchId].description,
                footerLabel: 'فتح مباشر',
                href: dshText.hub.workbenches[workbenchId].routeHint,
                badge: 'حي',
                tone: workbenchId === 'orders' ? 'primary' : 'secondary',
              })),
              disclosureTitle: 'مسارات أقل أولوية الآن',
              disclosureDescription: 'تظل متاحة بشكل منضبط عبر progressive disclosure.',
              disclosureItems: dshPlannedWorkbenchIds.map((workbenchId) => ({
                id: `operations-disclosure-${workbenchId}`,
                label: dshText.hub.workbenches[workbenchId].label,
                description: `${dshText.hub.workbenches[workbenchId].description} · ${dshText.hub.workbenches[workbenchId].routeHint}`,
                href: dshText.hub.workbenches[workbenchId].routeHint,
                badge: 'قيد التوسعة',
              })),
            };
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
                href: buildOperationsHref('catalogs'),
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
                  href: buildOperationsHref('catalogs'),
                  badge: 'حي',
                  tone: 'primary',
                },
                {
                  id: 'catalogs-partners',
                  label: 'بوابة الشركاء',
                  description: 'مراجعة الإدخالات قبل انتقالها إلى الكتالوج النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: buildOperationsHref('partners'),
                  badge: 'مراجعة',
                },
                {
                  id: 'catalogs-marketing',
                  label: 'التسويق',
                  description: 'اعتماد الرسائل والعرض قبل النشر النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: buildOperationsHref('marketing'),
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
        }
      })()
    : null;

  return (
    <WebCommandCenterFrame
      brandLabel={panelText.brandLabel}
      surfaceTitle={shellCopy.title}
      surfaceSubtitle={shellCopy.description}
      showHero={false}
      topFilters={[
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

            {isOperationsSection ? (
              <WebSectionCard
                title="غرفة العمليات الموحدة"
                description="المسارات الحية أصبحت تعمل داخل workspace واحدة مستقرة داخل قسم العمليات نفسه، مع بقاء المسارات القديمة قابلة للتحويل التوافقي."
              >
                <DshControlPanelSurfaceHost
                  workspace={operationsWorkspace}
                  orderId={operationsOrderId}
                  orderOverlayMode={operationsOverlayMode}
                />
              </WebSectionCard>
            ) : null}

            {activeSectionId === 'dashboard' ? (
              <>
                <section className={styles.dashboardHeroGrid}>
                  <article className={styles.dashboardHeroCard}>
                    <div className={styles.dashboardHeroEyebrow}>BThwani Premium Control Room 2026</div>
                    <h2 className={styles.dashboardHeroTitle}>غرفة قيادة تنفيذية بنبرة هادئة وكثافة قرار أعلى.</h2>
                    <p className={styles.dashboardHeroDescription}>
                      هذا السطح لم يعد مجرد overview عام. تم رفعه ليصبح طبقة قيادة تقرأ نبض المنصة،
                      وتوضح أين يبدأ القرار الآن، وما الذي يجب أن يبقى في الخلفية دون ضوضاء بصرية.
                    </p>
                    <div className={styles.dashboardHeroMeta}>
                      <span className={styles.dashboardHeroMetaChip}>{liveServiceCount} خدمات حية</span>
                      <span className={styles.dashboardHeroMetaChip}>{referenceServiceCount} مراجع منضبطة</span>
                      <span className={styles.dashboardHeroMetaChip}>{readyMissionCount} مسارات جاهزة</span>
                    </div>
                    <div className={styles.dashboardHeroActions}>
                      <a
                        href="/operations"
                        className={styles.dashboardHeroPrimaryAction}
                        onClick={(event) => {
                          event.preventDefault();
                          router.push('/operations');
                        }}
                      >
                        فتح غرفة العمليات
                      </a>
                      <a
                        href="/control"
                        className={styles.dashboardHeroSecondaryAction}
                        onClick={(event) => {
                          event.preventDefault();
                          router.push('/control');
                        }}
                      >
                        طبقة التحكم والحوكمة
                      </a>
                    </div>
                  </article>

                  <article className={styles.dashboardSpotlightCard}>
                    <div className={styles.dashboardSpotlightHeader}>
                      <span className={styles.dashboardSpotlightEyebrow}>Executive Pulse</span>
                      <strong className={styles.dashboardSpotlightValue}>{Math.max(liveServiceCount, 1)}/{controlPanelRuntimeData.services.length}</strong>
                    </div>
                    <p className={styles.dashboardSpotlightTitle}>نسبة الخدمات الحية الظاهرة داخل control-panel</p>
                    <p className={styles.dashboardSpotlightDescription}>
                      القراءة هنا صريحة: ما هو حي فعلاً يملك بروزاً أقوى، وما هو مرجعي يبقى ضمن النظام بدون تضخيم ادعائي.
                    </p>
                    <div className={styles.dashboardSpotlightStats}>
                      <div className={styles.dashboardSpotlightStat}>
                        <span className={styles.dashboardSpotlightStatLabel}>الأولوية</span>
                        <strong className={styles.dashboardSpotlightStatValue}>{panelText.surfaceTitles.operations}</strong>
                      </div>
                      <div className={styles.dashboardSpotlightStat}>
                        <span className={styles.dashboardSpotlightStatLabel}>الجاهزية</span>
                        <strong className={styles.dashboardSpotlightStatValue}>{readyMissionCount}</strong>
                      </div>
                      <div className={styles.dashboardSpotlightStat}>
                        <span className={styles.dashboardSpotlightStatLabel}>التنقل</span>
                        <strong className={styles.dashboardSpotlightStatValue}>RTL ثابت</strong>
                      </div>
                    </div>
                  </article>
                </section>

                <section className={styles.dashboardBoardGrid}>
                  <WebSectionCard
                    title="مناطق القيادة الأساسية"
                    description="كل قسم رئيسي يأخذ وزنه التشغيلي الحقيقي بدل التساوي البصري المصطنع."
                  >
                    <div className={styles.dashboardSectionBoard}>
                      {dashboardSectionSnapshots.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className={styles.dashboardSectionRow}
                          onClick={(event) => {
                            event.preventDefault();
                            router.push(item.href);
                          }}
                        >
                          <div className={styles.dashboardSectionRowMain}>
                            <strong className={styles.dashboardSectionRowTitle}>{item.title}</strong>
                            <span className={styles.dashboardSectionRowDescription}>{item.description}</span>
                          </div>
                          <div className={styles.dashboardSectionRowStats}>
                            <span className={styles.dashboardSectionRowStat}>{item.liveCount}/{item.serviceCount} حي</span>
                            <span className={styles.dashboardSectionRowBadge}>{item.missionReady ? 'جاهز' : 'مرجعي'}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </WebSectionCard>

                  <WebSectionCard
                    title="تسلسل القرار التنفيذي"
                    description="ترتيب الحركة داخل اللوحة يجب أن يكون واضحاً: تشغيل، ثم مال، ثم حوكمة ونشر، ثم سيادة داخلية."
                  >
                    <div className={styles.dashboardPriorityStack}>
                      {dashboardPriorityQueue.map((item, index) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className={styles.dashboardPriorityItem}
                          onClick={(event) => {
                            event.preventDefault();
                            router.push(item.href);
                          }}
                        >
                          <span className={styles.dashboardPriorityIndex}>{index + 1}</span>
                          <div className={styles.dashboardPriorityBody}>
                            <strong className={styles.dashboardPriorityLabel}>{item.label}</strong>
                            <span className={styles.dashboardPriorityNote}>{item.note}</span>
                          </div>
                          <span className={styles.dashboardPriorityMetric}>{item.metric}</span>
                        </a>
                      ))}
                    </div>
                  </WebSectionCard>
                </section>

                <WebSectionCard
                  title="خريطة المساحات داخل المنظومة"
                  description="بدلاً من خرائط زخرفية، هذه constellation عملية توضّح وزن كل مساحة وموقعها داخل control-panel."
                >
                  <div className={styles.constellationGrid}>
                    {dashboardConstellation.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={[
                          styles.constellationCard,
                          item.isReference ? styles.constellationCardReference : styles.constellationCardLive,
                        ].join(' ')}
                        onClick={() => setSelectedServiceId(item.id)}
                      >
                        <span className={styles.constellationCardCode}>{item.label}</span>
                        <strong className={styles.constellationCardValue}>{item.sections}</strong>
                        <span className={styles.constellationCardLabel}>أقسام مرتبطة</span>
                        <span className={styles.constellationCardStatus}>{item.statusLabel}</span>
                      </button>
                    ))}
                  </div>
                </WebSectionCard>
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

                <section className={styles.contextPanel}>
                  <h3 className={styles.contextTitle}>
                    {isAllFilterActive ? panelText.ui.contextTitleSection : panelText.ui.contextTitleService}
                  </h3>
                  <div className={styles.contextList}>
                    {contextItems.map((item) => (
                      <span key={item} className={styles.contextChip}>{item}</span>
                    ))}
                    {contextItems.length === 0 ? (
                      <span className={styles.contextChipMuted}>{panelText.ui.noItems}</span>
                    ) : null}
                  </div>
                </section>
              </>
            )}
          </>
        ) : null}

        {activeSectionId === 'partners' ? (
          <WebSectionCard
            title={panelText.surfaceTitles.partners}
            description={panelText.surfaceDescriptions.partners}
          >
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref={buildOperationsHref('partners')} />
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

        {!phaseOneBlueprint && activeSectionId !== 'partners' && activeSectionId !== 'marketing' && !isControlSection && !isCommunityServicesSection ? (
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
  );
}

export default ControlPanelSurfaceHost;



