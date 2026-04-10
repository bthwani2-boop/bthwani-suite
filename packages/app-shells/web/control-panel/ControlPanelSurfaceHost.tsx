"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthWebCommandCenterFrame,
  BthWebMissionHeroCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDirection, useUiText } from '@bthwani/ui-kit';
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const sectionConfig = [
  { href: '/dashboard', id: 'dashboard' },
  { href: '/operations', id: 'operations' },
  { href: '/finance', id: 'finance' },
  { href: '/catalogs', id: 'catalogs' },
  { href: '/support', id: 'support' },
  { href: '/partners', id: 'partners' },
  { href: '/marketing', id: 'marketing' },
  { href: '/control', id: 'control' },
] as const;

const controlSubSectionConfig = [
  { href: '/control/platform', id: 'platform' },
  { href: '/control/administration', id: 'administration' },
  { href: '/control/governance', id: 'governance' },
  { href: '/control/hr', id: 'hr' },
] as const;

type ControlPanelSectionId = 'dashboard' | 'operations' | 'finance' | 'catalogs' | 'support' | 'partners' | 'marketing' | 'control';
type ControlPanelSubSectionId = 'platform' | 'administration' | 'governance' | 'hr';

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
};

function resolveSectionHref(section: ControlPanelSectionId) {
  return `/${section}` as const;
}

type PrimarySectionHref = (typeof sectionConfig)[number]['href'];
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
  partners: '/partners',
  marketing: '/marketing',
  control: '/control',
};
const railServiceItems = controlPanelRuntimeData.services.map((service) => ({
  id: service.id,
  label: service.label,
  statusKind: service.statusKind,
})) as ReadonlyArray<{ id: string; label: string; statusKind: string }>;

const overviewSignals = [
  {
    id: 'best-path',
    tone: 'best' as const,
    title: 'أفضل مسار',
    value: 'المالية',
    description: 'ابدأ من مدفوعات متأخرة تحتاج اعتماد قبل التفرع إلى بقية المسارات.',
  },
  {
    id: 'pressure',
    tone: 'danger' as const,
    title: 'الضغط الحالي',
    value: '1',
    description: 'عناصر تحتاج قرارًا فوريًا من أعلى الصفحة.',
  },
  {
    id: 'live-refresh',
    tone: 'neutral' as const,
    title: 'آخر تحديث',
    value: 'بدون تحديث حي',
    description: 'آخر مزامنة مرئية لهذه الواجهة دون مغادرة السطح.',
  },
  {
    id: 'mode',
    tone: 'neutral' as const,
    title: 'نمط القراءة',
    value: 'مرجعي',
    description: 'المؤشرات تركّز الانتباه بالزمن لمستوى الجاهزية الفعلي.',
  },
] as const;

type MissionCardView = {
  missionTitle: string;
  missionDescription: string;
  owner: string;
  dueLabel: string;
  countLabel: string;
};

function resolveRailItems(
  activeHref: string,
  sectionNames: Record<ControlPanelSectionId, string>,
  sectionDescriptions: Record<ControlPanelSectionId, string>,
  dashboardBadge: string,
) {
  return sectionConfig.map((item) => ({
    id: item.href,
    href: item.href,
    label: sectionNames[item.id],
    description: sectionDescriptions[item.id],
    active: item.href === activeHref,
    badge: item.href === '/dashboard' ? dashboardBadge : undefined,
  }));
}

function resolveFallbackMission(activeSectionLabel: string): MissionCardView {
  return {
    missionTitle: `مهمة ${activeSectionLabel}`,
    missionDescription: `لا يوجد flow.meta مرتبط مباشرة بهذا القسم حتى الآن.`,
    owner: activeSectionLabel,
    dueLabel: 'غير معرف في flow.meta',
    countLabel: '1',
  };
}

function resolveShellCopy(section?: ControlPanelSectionId, subsection?: ControlPanelSubSectionId) {
  if (!section) {
    return {
      title: 'BThwani Control Panel',
      description:
        'A governed control surface with centralized web framing, shared baseline styling, and route-level composition only.',
      activeHref: undefined,
    };
  }

  if (section !== 'control') {
    switch (section) {
      case 'dashboard':
        return {
          title: 'Overview',
          description: 'Understand the state in seconds and start the best recommended action.',
          activeHref: '/dashboard',
        };
      case 'operations':
        return {
          title: 'Operations',
          description: 'Execution, operational flow, and bottleneck management from a clear path.',
          activeHref: '/operations',
        };
      case 'finance':
        return {
          title: 'Finance',
          description: 'Financial monitoring, settlements, and unified operational control.',
          activeHref: '/finance',
        };
      case 'catalogs':
        return {
          title: 'Catalogs',
          description: 'Governance of services, products, and operational structure.',
          activeHref: '/catalogs',
        };
      case 'support':
        return {
          title: 'Support',
          description: 'Support queues, escalations, and customer experience recovery.',
          activeHref: '/support',
        };
      case 'partners':
        return {
          title: 'Partners',
          description: 'Partner readiness and operational coordination across paths.',
          activeHref: '/partners',
        };
      case 'marketing':
        return {
          title: 'Marketing',
          description: 'Managing growth campaigns without breaking the centralized operational structure.',
          activeHref: '/marketing',
        };
      default:
        return {
          title: 'Control Panel',
          description: 'Platform governance, administration, and internal control framework.',
          activeHref: '/control',
        };
    }
  }

  if (!subsection) {
    return {
      title: 'Control',
      description:
        'Internal control domain for platform-level oversight, administration, governance, and people operations.',
      activeHref: '/control',
    };
  }

  switch (subsection) {
    case 'platform':
      return {
        title: 'Control / Platform',
        description: 'Adjust tools and technical operational boundaries.',
        activeHref: '/control/platform',
      };
    case 'administration':
      return {
        title: 'Control / Administration',
        description: 'Internal administration paths and operational decisions.',
        activeHref: '/control/administration',
      };
    case 'governance':
      return {
        title: 'Control / Governance',
        description: 'Evidence, policies, and compliance guards.',
        activeHref: '/control/governance',
      };
    case 'hr':
      return {
        title: 'Control / Human Resources',
        description: 'People operations and organizational readiness.',
        activeHref: '/control/hr',
      };
    default:
      return {
        title: 'Control',
        description: 'Control subsection shell.',
        activeHref: '/control',
      };
  }
}

export function ControlPanelSurfaceHost({ section, subsection }: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const [languageChip, setLanguageChip] = React.useState<'EN' | 'AR'>('EN');
  const [alertCount, setAlertCount] = React.useState(1);
  const [lastRailSelection, setLastRailSelection] = React.useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(allServiceTabId);
  const [activeSectionHref, setActiveSectionHref] = React.useState<PrimarySectionHref>(() => {
    if (section) {
      return `/${section}` as PrimarySectionHref;
    }
    return '/dashboard';
  });
  const activeSectionFromRail = activeSectionHref.replace('/', '') as ControlPanelSectionId;
  const shellCopy = resolveShellCopy(activeSectionFromRail, activeSectionFromRail === 'control' ? subsection : undefined);
  const railItems = resolveRailItems(activeSectionHref).filter((item) => item.id !== activeSectionHref);
  const topFilters = [
    {
      id: allServiceTabId,
      label: 'All',
      metaLabel: 'كل مساحات العمل',
      icon: '▦',
      active: selectedServiceId === allServiceTabId,
    },
    ...controlPanelRuntimeData.services.map((service) => ({
      id: service.id,
      label: service.label,
      metaLabel: service.placeholder ? 'مرجعي' : `${service.sections.length}`,
      icon: serviceIconMap[service.id] ?? '◦',
      active: selectedServiceId === service.id,
    })),
  ];
  const activeControlHref = section === 'control' && subsection ? `/control/${subsection}` : undefined;
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const selectedServiceMeta = isAllFilterActive
    ? undefined
    : controlPanelRuntimeData.services.find((service) => service.id === selectedServiceId);
  const serviceSections = selectedServiceMeta?.sections ?? [];
  const serviceSectionLabels = serviceSections.map((sectionId) => (
    controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === sectionId)?.label ?? sectionId
  ));
  const sectionIdFromHref = activeSectionHref.replace('/', '');
  const selectedSectionMeta = controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === sectionIdFromHref);
  const selectedSectionMission = controlPanelRuntimeData.missions.find((mission) => mission.sectionId === sectionIdFromHref);
  const sectionServiceIds = selectedSectionMeta?.serviceIds ?? [];
  const sectionServiceNames = sectionServiceIds
    .map((serviceId) => controlPanelRuntimeData.services.find((service) => service.id === serviceId)?.label)
    .filter(Boolean) as string[];
  const serviceLeadMission = serviceSections
    .map((serviceSectionId) => controlPanelRuntimeData.missions.find((mission) => mission.sectionId === serviceSectionId))
    .find(Boolean);
  const activeSectionLabel = selectedSectionMeta?.label ?? sectionIdFromHref;
  const activeMission = isAllFilterActive
    ? selectedSectionMission
      ? {
          missionTitle: selectedSectionMission.title,
          missionDescription: selectedSectionMission.description,
          owner: selectedSectionMission.owner,
          dueLabel: selectedSectionMission.due,
          countLabel: String(sectionServiceIds.length || 1),
        }
      : resolveFallbackMission(activeSectionLabel)
    : serviceLeadMission
      ? {
          missionTitle: serviceLeadMission.title,
          missionDescription: serviceLeadMission.description,
          owner: serviceLeadMission.owner,
          dueLabel: serviceLeadMission.due,
          countLabel: String(serviceSectionLabels.length || 1),
        }
      : resolveFallbackMission(selectedServiceMeta?.label ?? 'الخدمة');
  const heroPrimaryAction = section === 'operations'
    ? { label: 'افتح DSH hub', href: '/operations/dsh' }
    : { label: 'معالجة عاجل (1)', href: '/finance' };
  const heroSecondaryAction = section === 'operations'
    ? { label: 'لوحة التحكم', href: '/dashboard' }
    : { label: 'افتح العمليات', href: '/operations' };
  const handleBrandClick = React.useCallback(() => {
    setActiveSectionHref('/dashboard');
    setSelectedServiceId(allServiceTabId);
    router.push('/dashboard');
  }, [router]);

  const handleSearchClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
  }, []);

  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleLanguageClick = React.useCallback(() => {
    setLanguageChip((prev) => (prev === 'EN' ? 'AR' : 'EN'));
  }, []);

  const handleAlertClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setAlertCount(0);
  }, []);

  React.useEffect(() => {
    const nextHref: PrimarySectionHref = section ? (`/${section}` as PrimarySectionHref) : '/dashboard';
    setActiveSectionHref(nextHref);
  }, [section]);

  return (
    <BthWebCommandCenterFrame
      brandLabel="لوحة التحكم"
      surfaceTitle={shellCopy.title}
      surfaceSubtitle={shellCopy.description}
      showHero={false}
      topFilters={topFilters}
      onTopFilterSelect={(filterId) => {
        setSelectedServiceId(filterId);
      }}
      onRailItemSelect={(itemId) => {
        const matchedSection = primarySections.find((item) => item.href === itemId);
        if (matchedSection) {
          setActiveSectionHref(matchedSection.href);
          setLastRailSelection(matchedSection.label);
          router.push(sectionRouteMap[matchedSection.href.replace('/', '') as ControlPanelSectionId]);
        }
      }}
      onBrandClick={handleBrandClick}
      onSearchClick={handleSearchClick}
      onRefreshClick={handleRefreshClick}
      onLanguageClick={handleLanguageClick}
      onAlertClick={handleAlertClick}
      railTitle="لوحة التحكم"
      railStatusLabel={isAllFilterActive ? `All${lastRailSelection ? ` · ${lastRailSelection}` : ''}` : `${selectedServiceMeta?.label ?? 'SERVICE'} · خدمة`}
      railItems={railItems}
      railSupplementary={null}
      languageLabel={languageChip}
      alertCountLabel={String(alertCount)}
      refreshLabel="تحديث"
      searchPlaceholder="بحث عن أمر سريع"
    >
      <div className={styles.stageStack}>
        <section className={styles.missionDockHeader}>
          <p className={styles.missionDockEyebrow}>لوحة التحكم</p>
          <h1 className={styles.missionDockTitle}>{shellCopy.title}</h1>
          <p className={styles.missionDockSubtitle}>
            {isAllFilterActive
              ? `عرض شامل للخدمات ضمن ${shellCopy.title}`
              : `الخدمة النشطة: ${selectedServiceMeta?.label ?? 'N/A'}`}
          </p>
        </section>

        <section className={styles.priorityPanel}>
          <BthWebMissionHeroCard
            dense
            badges={[
              `الخدمة: ${isAllFilterActive ? 'All' : selectedServiceMeta?.label ?? 'N/A'}`,
              isAllFilterActive ? `القسم: ${activeSectionHref.replace('/', '')}` : `الأقسام: ${serviceSectionLabels.length}`,
              'آخر تحديث: مباشر',
            ]}
            eyebrow={`${shellCopy.title} · المهمة الموصى بها الآن`}
            title={activeMission.missionTitle}
            description={activeMission.missionDescription}
            metaItems={[
              `المالك: ${activeMission.owner}`,
              activeMission.dueLabel,
              `عدد العناصر: ${activeMission.countLabel}`,
            ]}
            secondaryAction={heroSecondaryAction}
            primaryAction={heroPrimaryAction}
          />

          <div className={styles.signalGrid}>
            {overviewSignals.map((signal) => {
              const dynamicValue =
                signal.id === 'best-path'
                  ? isAllFilterActive
                    ? activeSectionLabel
                    : selectedServiceMeta?.label ?? 'N/A'
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
              {isAllFilterActive ? 'الخدمات المرتبطة بالقسم' : 'الأقسام المرتبطة بالخدمة'}
            </h4>
            <div className={styles.contextList}>
              {(isAllFilterActive ? sectionServiceNames : serviceSectionLabels).map((item) => (
                <span key={item} className={styles.contextChip}>
                  {item}
                </span>
              ))}
              {(isAllFilterActive ? sectionServiceNames : serviceSectionLabels).length === 0 ? (
                <span className={styles.contextChipMuted}>لا توجد عناصر مرتبطة حاليًا.</span>
              ) : null}
            </div>
          </section>
        </section>

        <section className={styles.subsectionPanel}>
          <div className={styles.subsectionHeader}>
            <h3 className={styles.subsectionTitle}>أقسام لوحة التحكم</h3>
            <p className={styles.subsectionDescription}>الأقسام الفرعية محفوظة ضمن shell مركزي مع نفس الهوية البصرية.</p>
          </div>
          <div className={styles.subsectionGrid}>
            {controlSubSections.map((item) => {
              const isActive = item.href === activeControlHref;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={[styles.subsectionLink, isActive ? styles.subsectionLinkActive : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <strong className={styles.subsectionLinkLabel}>{item.label}</strong>
                  <span className={styles.subsectionLinkDescription}>{item.description}</span>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </BthWebCommandCenterFrame>
  );
}

export default ControlPanelSurfaceHost;
