"use client";

import {
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
const dshPlannedWorkbenchIds = ['sheinProxy', 'zoneSet'] as const;

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

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
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
  dashboard: 'ملخص قرار سريع يفتح القسم الصحيح من أول مستوى بدون تشتيت.',
  operations: 'الضغط الحالي والمسارات الحية والتنبيهات في لوحة تشغيل واحدة.',
  finance: 'مراقبة مالية مختصرة مع تركيز فوري على المسار الجاهز للتشغيل.',
  catalogs: 'حوكمة عملية للمنتجات والفئات ومسارات المراجعة والنشر.',
  support: 'تصعيدات واضحة واستعادة سريعة لتجربة العميل من أقرب مسار فعلي.',
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

export function ControlPanelSurfaceHost({ section, subsection }: ControlPanelSurfaceHostProps) {
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
  const isMarketingSection = activeSectionId === 'marketing';
  const isCommunityServicesSection = activeSectionId === 'community-services';
  const activeControlHref = isControlSection && subsection ? `/control/${subsection}` : undefined;
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const shellCopy = resolveShellCopy(panelText, activeSectionId, isControlSection ? subsection : undefined);
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
  const communityServiceItems = React.useMemo(() => (
    sectionServiceIds.map((serviceId) => {
      const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);

      return {
        id: `community-${serviceId}`,
        label: getServiceLabel(uiText, serviceId),
        description: serviceMeta?.placeholder
          ? 'يبقى ظاهرًا كمرجع داخل هذا القسم حتى لا يتشعب المسار قبل الجاهزية.'
          : 'خدمة متصلة بهذا القسم ويمكن تثبيت تركيزها من نفس الغرفة دون فتح route جديد.',
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
        description: serviceMeta?.placeholder
          ? 'يبقى ظاهرًا كمرجع في هذه المرحلة بدون رفعه إلى مسار أول.'
          : 'متصل فعليًا بهذه الصفحة ويمكن تحويل العرض إليه بنقرة واحدة.',
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
      description: compactSectionDescriptions[sectionId],
      footerLabel: 'فتح القسم',
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
              description: 'لوحة قرار قصيرة تضع العمليات والمالية والكتالوجات والدعم في أول نظرة، وتؤجل أي تفاصيل أقل أولوية إلى طبقة ثانوية.',
              primaryAction: {
                id: 'dashboard-primary',
                label: 'ابدأ من العمليات',
                description: 'أقرب مسار فعلي للحسم الآن.',
                footerLabel: 'فتح مباشر',
                href: '/operations',
                badge: 'الموصى به الآن',
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
              quickActionsTitle: 'الأقسام الأساسية',
              quickActionsDescription: 'كل بطاقة تنقلك إلى القسم الصحيح من أول مستوى وبحد أقصى نقرتين.',
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
              eyebrow: 'غرفة القرار الحالية',
              title: panelText.surfaceTitles.operations,
              description: 'الضغط الحالي ومسارات التنفيذ الحية والتنبيهات موضوعة في سطح واحد، مع جعل الطلبات المسار الأول وترك التوسعات في طبقة أقل بروزًا.',
              primaryAction: {
                id: 'operations-primary',
                label: 'افتح الطلبات',
                description: dshText.hub.workbenches.orders.description,
                footerLabel: 'فتح مباشر',
                href: dshText.hub.workbenches.orders.routeHint,
                badge: 'المسار الأول',
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
              quickActionsTitle: 'المسارات السريعة',
              quickActionsDescription: 'العمل الأساسي يبدأ من هنا بنقرة واحدة بدل التمرير داخل وصف طويل.',
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
              eyebrow: 'تشغيل مالي موحد',
              title: panelText.surfaceTitles.finance,
              description: 'الصفحة المالية أصبحت قراءة مختصرة لمسار التشغيل الجاهز، مع دفع المسارات المرجعية إلى طبقة ثانوية بدل تكديس الشرح في أول الشاشة.',
              primaryAction: {
                id: 'finance-primary',
                label: 'حصر العرض على WLT',
                description: 'المساحة الجاهزة حاليًا للمتابعة المالية.',
                footerLabel: 'تصفية فورية',
                badge: 'الموصى به الآن',
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
              quickActionsTitle: 'إجراءات سريعة',
              quickActionsDescription: 'الإجراء الأساسي هو تركيز القراءة على المسار الجاهز، ثم التنقل إلى أقرب قرار داعم.',
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
              eyebrow: 'حوكمة المنتجات',
              title: panelText.surfaceTitles.catalogs,
              description: 'الكتالوج أصبح بوابة قرار قصيرة: افتح المسار الحي، راجع الشركاء أو التسويق، واترك التفاصيل التفصيلية لما بعد الدخول للمسار المختار.',
              primaryAction: {
                id: 'catalogs-primary',
                label: 'افتح كتالوج DSH',
                description: 'المسار الحي الأقرب لحوكمة الفئات والمنتجات.',
                footerLabel: 'فتح مباشر',
                href: '/operations/dsh/catalogs',
                badge: 'المسار الأول',
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
              quickActionsTitle: 'مفاتيح الحوكمة',
              quickActionsDescription: 'أهم ثلاث بوابات تُفتح من أول الشاشة بدل دفنها داخل محتوى طويل.',
              quickActions: [
                {
                  id: 'catalogs-open',
                  label: 'كتالوج DSH',
                  description: 'إدارة الفئات والمنتجات من المسار الحي المباشر.',
                  footerLabel: 'فتح مباشر',
                  href: '/operations/dsh/catalogs',
                  badge: 'حي',
                  tone: 'primary',
                },
                {
                  id: 'catalogs-partners',
                  label: 'بوابة الشركاء',
                  description: 'مراجعة الإدخالات قبل انتقالها إلى الكتالوج النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/operations/dsh/partners',
                  badge: 'مراجعة',
                },
                {
                  id: 'catalogs-marketing',
                  label: 'التسويق',
                  description: 'اعتماد الرسائل والعرض قبل النشر النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/operations/dsh/marketing',
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
              description: 'الدعم صار مسار triage مختصرًا: ابدأ من أقرب صف تشغيلي، بدّل إلى المساحة المقترحة، واترك التفاصيل غير العاجلة داخل disclosure.',
              primaryAction: {
                id: 'support-primary',
                label: 'ابدأ triage من الطلبات',
                description: 'أقرب مسار فعلي للتصعيد والاستعادة داخل هذه المرحلة.',
                footerLabel: 'فتح مباشر',
                href: '/operations/dsh/orders',
                badge: 'المسار الأول',
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
              quickActionsTitle: 'Quick triage',
              quickActionsDescription: 'كل بطاقة تقلل التفرع وتبقي القرار في نقرة أو نقرتين.',
              quickActions: [
                {
                  id: 'support-orders',
                  label: 'طلبات قابلة للتصعيد',
                  description: 'افتح الصف التشغيلي الأقرب للحسم بدل التدرج عبر صفحات وصفية.',
                  footerLabel: 'فتح مباشر',
                  href: '/operations/dsh/orders',
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
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref="/operations/dsh/partners" />
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
                active: subsection === subsectionId,
              }))}
              onSelect={(subsectionId) => {
                router.push(`/control/${subsectionId}`);
              }}
            />
            <div className={styles.sectionGrid}>
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



