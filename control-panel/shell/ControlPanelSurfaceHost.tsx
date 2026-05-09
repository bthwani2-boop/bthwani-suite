"use client";

import {
  DshControlPanelSurfaceHost,
  ControlPanelDshCatalogScreen,
  ControlPanelDshMarketingScreen,
  ControlPanelDshPartnerApprovalsScreen,
} from '../composition';
import { WltDshFinanceControlPanelContent } from '../../wlt/frontend/control-panel/finance/WltDshFinanceControlPanelPreview';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDirection, useUiText, Box, Button } from '@bthwani/ui-kit';
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
  WebControlPanelShell,
  WebControlPanelTopBar,
  WebControlPanelRail,
  WebControlPanelStage,
  WebControlPanelSectionHeader,
  WebControlPanelSignalStrip,
  WebControlPanelKpiTile,
  WebControlPanelCommandCard,
  WebControlPanelDecisionQueue,
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
          case 'operations':
            return null;
          case 'finance':
            return {
              eyebrow: 'مالي',
              title: 'غرفة التحكم المالي',
              description: 'مراقبة التدفقات والتسويات في وضع preview فقط.',
              primaryAction: {
                id: 'finance-primary',
                label: 'فتح المطابقة',
                description: '',
                footerLabel: 'انتقال',
                badge: 'Preview',
                tone: 'primary',
                onAction: () => setSelectedServiceId('wlt'),
              },
              kpis: [
                {
                  id: 'finance-services',
                  title: 'مرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'مسارات التحكم المالي المتصلة بهذا السطح.',
                  tone: 'brand',
                },
                {
                  id: 'finance-live',
                  title: 'حية الآن',
                  value: String(liveCoverageCount),
                  description: 'مسارات يمكن قراءتها فوراً دون قفزات إضافية.',
                  tone: 'best',
                },
                {
                  id: 'finance-reference',
                  title: 'مرجعية',
                  value: String(referenceCoverageCount),
                  description: 'مسارات محفوظة كمرجع بلا ادعاء تشغيل.',
                },
              ],
              quickActionsTitle: '',
              quickActionsDescription: '',
              quickActions: [],
              disclosureTitle: '',
              disclosureDescription: '',
              disclosureItems: [],
            };
          case 'community-services':
            return {
              eyebrow: 'Community services',
              title: panelText.surfaceTitles['community-services'],
              description: 'حوكمة مختصرة',
              primaryAction: {
                id: 'community-services-primary',
                label: 'افتح خدمات المجتمع',
                description: '',
                footerLabel: 'فتح',
                href: '/community-services',
                badge: 'حي',
                tone: 'primary',
              },
              kpis: [
                {
                  id: 'community-services-services',
                  title: 'المساحات المرتبطة',
                  value: String(sectionServiceIds.length),
                  description: 'الخدمات التي تستهلك حوكمة المجتمع من هذا السطح.',
                  tone: 'brand',
                },
                {
                  id: 'community-services-live',
                  title: 'بوابات حية',
                  value: '3',
                  description: 'خدمات المجتمع، شركاء، وتسويق قابلة للفتح مباشرة.',
                  tone: 'best',
                },
                {
                  id: 'community-services-ready',
                  title: 'جاهز للتشغيل',
                  value: String(liveCoverageCount),
                  description: 'مساحات يمكن متابعتها الآن دون تكرار الشرح.',
                },
                {
                  id: 'community-services-reference',
                  title: 'مرجعي',
                  value: String(referenceCoverageCount),
                  description: 'تغطية مرئية أقل بروزًا من القرار الأساسي.',
                },
              ],
              quickActionsTitle: 'مفاتيح',
              quickActionsDescription: 'أزرار',
              quickActions: [
                {
                  id: 'community-services-open',
                  label: 'خدمات المجتمع DSH',
                  description: 'إدارة الفئات والمنتجات من المسار الحي المباشر.',
                  footerLabel: 'فتح مباشر',
                  href: '/community-services',
                  badge: 'حي',
                  tone: 'primary',
                },
                {
                  id: 'community-services-partners',
                  label: 'بوابة الشركاء',
                  description: 'مراجعة الإدخالات قبل انتقالها إلى المسار النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/partners',
                  badge: 'مراجعة',
                },
                {
                  id: 'community-services-marketing',
                  label: 'التسويق',
                  description: 'اعتماد الرسائل والعرض قبل النشر النهائي.',
                  footerLabel: 'فتح مباشر',
                  href: '/marketing',
                  badge: 'اعتماد',
                },
                {
                  id: 'community-services-overview',
                  label: 'العودة للنظرة العامة',
                  description: 'ارجع بسرعة إلى مركز القرار بدل التنقل عبر شاشات وسيطة.',
                  footerLabel: 'فتح القسم',
                  href: '/dashboard',
                },
              ],
              disclosureTitle: 'تغطية خدمات المجتمع حسب الخدمة',
              disclosureDescription: 'التحويل بين الخدمات يبقى ثانويًا حتى لا ينافس بوابات الحوكمة الأساسية.',
              disclosureItems: buildServiceDisclosureItems('community-services'),
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
              ],
              quickActionsTitle: '',
              quickActionsDescription: '',
              quickActions: [],
              disclosureTitle: '',
              disclosureDescription: '',
              disclosureItems: [],
            };
          default:
            return null;
        }
      })()
    : null;

  return (
    <WebControlPanelShell
      topBar={
        <WebControlPanelTopBar
          title={panelText.brandLabel}
          subtitle={shellCopy.title}
          actions={
            <Box layoutDirection="row" gap={2}>
              {controlPanelRuntimeData.services.map((service) => (
                <Button
                  key={service.id}
                  label={getServiceLabel(uiText, service.id)}
                  tone={selectedServiceId === service.id ? 'brand' : 'secondary'}
                  size="sm"
                  onAction={() => setSelectedServiceId(service.id)}
                />
              ))}
              <Button
                label={panelText.filters.allServices}
                tone={isAllFilterActive ? 'brand' : 'secondary'}
                size="sm"
                onAction={() => setSelectedServiceId(allServiceTabId)}
              />
            </Box>
          }
          trailing={
            <Box layoutDirection="row" gap={3} align="center">
              <WebControlActionButton id="search" label="🔍" onAction={handleSearchClick} />
              <WebControlActionButton id="refresh" label="↻" onAction={handleRefreshClick} />
              <WebControlActionButton id="alerts" label={`🔔 ${alertCount}`} onAction={handleAlertClick} tone={alertCount > 0 ? 'primary' : 'secondary'} />
            </Box>
          }
        />
      }
      rail={
        <WebControlPanelRail>
          <Box gap={1}>
            {railItems.map((item) => (
              <Button
                key={item.id}
                label={item.label}
                tone={item.active ? 'brand' : 'secondary'}
                onAction={() => {
                  const matchedSection = primarySectionIds.find((sectionId) => `/${sectionId}` === item.id);
                  if (matchedSection) {
                    const nextHref = `/${matchedSection}` as PrimarySectionHref;
                    setActiveSectionHref(nextHref);
                    router.push(sectionRouteMap[matchedSection]);
                  }
                }}
                style={{
                  justifyContent: 'flex-start',
                  backgroundColor: item.active ? 'rgba(255, 80, 13, 0.15)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  textAlign: direction === 'rtl' ? 'right' : 'left'
                }}
              />
            ))}
          </Box>
        </WebControlPanelRail>
      }
    >
      <WebControlPanelStage>
        <div className={styles.stageStack} dir={direction}>
          {phaseOneBlueprint ? (
            <>
              <WebControlPanelSectionHeader
                title={phaseOneBlueprint.title}
                description={phaseOneBlueprint.description}
                actions={
                  <Button
                    label={phaseOneBlueprint.primaryAction.label}
                    tone="brand"
                    onAction={resolveActionHandler(
                      phaseOneBlueprint.primaryAction.href,
                      phaseOneBlueprint.primaryAction.onAction,
                    )}
                  />
                }
              />

              <WebControlPanelSignalStrip>
                {phaseOneBlueprint.kpis.map((kpi) => (
                  <WebControlPanelKpiTile
                    key={kpi.id}
                    label={kpi.title}
                    value={kpi.value}
                    icon={kpi.id.includes('alerts') ? 'alert-circle' : 'activity'}
                    trend={kpi.tone === 'best' ? { value: '12%', positive: true } : undefined}
                  />
                ))}
              </WebControlPanelSignalStrip>

              {activeSectionId === 'dashboard' ? (
                <WebSectionCard
                  title="النظرة التنفيذية"
                  description="ملخص استراتيجي لنبض المنصة وغرفة القيادة."
                >
                  <div className={styles.dashboardHeroCard}>
                    <div className={styles.dashboardHeroEyebrow}>BThwani Premium Command Center 2026</div>
                    <h2 className={styles.dashboardHeroTitle}>غرفة قيادة تنفيذية بنبرة هادئة وكثافة قرار أعلى.</h2>
                    <p className={styles.dashboardHeroDescription}>
                      هذا السطح لم يعد مجرد overview عام. تم رفعه ليصبح طبقة قيادة تقرأ نبض المنصة،
                      وتوضح أين يبدأ القرار الآن، وما الذي يجب أن يبقى في الخلفية دون ضوضاء بصرية.
                    </p>
                  </div>
                </WebSectionCard>
              ) : null}

              {scopedSectionUnavailable ? (
                <WebControlPanelEmptyState
                  title="الخدمة المختارة لا تغطي هذا القسم"
                  description="بدّل إلى خدمة مناسبة أو أعد العرض إلى كل المساحات حتى لا تبقى الصفحة فارغة بسبب فلتر غير مطابق."
                  icon="alert-circle"
                  actionLabel="عرض كل المساحات"
                  onAction={() => setSelectedServiceId(allServiceTabId)}
                />
              ) : (
                <>
                  {phaseOneBlueprint.quickActions.length > 0 ? (
                    <Box gap={4}>
                      <WebControlPanelSectionHeader title={phaseOneBlueprint.quickActionsTitle} />
                      <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
                        {phaseOneBlueprint.quickActions.map((action) => (
                          <WebControlPanelCommandCard
                            key={action.id}
                            title={action.label}
                            description={action.description}
                            icon={action.tone === 'primary' ? 'zap' : 'layers'}
                            badge={action.badge}
                            onPress={resolveActionHandler(action.href, action.onAction)}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : null}

                  {phaseOneBlueprint.disclosureItems.length > 0 ? (
                    <Box gap={4} style={{ marginTop: 24 }}>
                      <WebControlPanelSectionHeader title={phaseOneBlueprint.disclosureTitle} />
                      <WebControlPanelDecisionQueue
                        title="Blockers & Risks"
                        items={phaseOneBlueprint.disclosureItems.map(item => ({
                          id: item.id,
                          title: item.label,
                          meta: item.description,
                          status: item.badge || 'Pending',
                        }))}
                      />
                    </Box>
                  ) : null}
                </>
              )}
            </>
          ) : null}

          {activeSectionId === 'finance' ? (
            <div className={styles.financeSurfaceSlot}>
              <WltDshFinanceControlPanelContent />
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
          <WebSectionCard
            title={panelText.surfaceTitles.partners}
            description={panelText.surfaceDescriptions.partners}
          >
            <ControlPanelDshPartnerApprovalsScreen hubHref="/partners" operationsHref="/partners" />
          </WebSectionCard>
        ) : null}

        {activeSectionId === 'catalogs' ? (
          <WebSectionCard
            title={panelText.surfaceTitles.catalogs}
            description={panelText.surfaceDescriptions.catalogs}
          >
            <ControlPanelDshCatalogScreen />
          </WebSectionCard>
        ) : null}

        {isMarketingSection ? (
          <div className={styles.marketingSurfaceSlot}>
            <ControlPanelDshMarketingScreen hubHref="/marketing" operationsHref="/operations" />
          </div>
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


        </div>
      </WebControlPanelStage>
    </WebControlPanelShell>
  );
}

export default ControlPanelSurfaceHost;
