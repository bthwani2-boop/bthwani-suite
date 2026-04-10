"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BthWebCommandCenterFrame,
  BthWebMissionHeroCard,
  BthWebRailServiceList,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { controlPanelRuntimeData } from './runtime.data';
import styles from './control-panel-shell.module.css';

const primarySections = [
  { href: '/dashboard', label: 'النظرة العامة', description: 'فهم الحالة خلال ثوانٍ وبدء أفضل إجراء بنفس روح بقية اللوحات.' },
  { href: '/operations', label: 'العمليات', description: 'تنفيذ، مرور تشغيلي، وإدارة الاختناقات من مسار واضح.' },
  { href: '/finance', label: 'المالية', description: 'مراقبة مالية، تسويات، وتحكم تشغيلي موحد.' },
  { href: '/catalogs', label: 'الكتالوجات', description: 'حوكمة الخدمات والمنتجات والبنية التشغيلية.' },
  { href: '/support', label: 'الدعم', description: 'طوابير الدعم، التصعيدات، واستعادة تجربة العميل.' },
  { href: '/partners', label: 'الشركاء', description: 'جاهزية الشركاء والتنسيق التشغيلي عبر المسارات.' },
  { href: '/marketing', label: 'التسويق', description: 'إدارة حملات النمو دون كسر هيكل التشغيل المركزي.' },
  { href: '/control', label: 'لوحة التحكم', description: 'حوكمة المنصة، الإدارة، وإطار التحكم الداخلي.' },
] as const;

const controlSubSections = [
  { href: '/control/platform', label: 'المنصة', description: 'ضبط الأدوات وحدود التشغيل التقني.' },
  { href: '/control/administration', label: 'الإدارة', description: 'مسارات الإدارة الداخلية وقرارات التشغيل.' },
  { href: '/control/governance', label: 'الحوكمة', description: 'الأدلة والسياسات وحراس الامتثال.' },
  { href: '/control/hr', label: 'الموارد البشرية', description: 'تشغيل الأشخاص والجاهزية التنظيمية.' },
] as const;

type ControlPanelSectionId = 'dashboard' | 'operations' | 'finance' | 'catalogs' | 'support' | 'partners' | 'marketing' | 'control';
type ControlPanelSubSectionId = 'platform' | 'administration' | 'governance' | 'hr';

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
};

function resolveShellCopy(section?: ControlPanelSectionId, subsection?: ControlPanelSubSectionId) {
  if (!section) {
    return {
      title: 'النظرة العامة',
      description: 'افهم الحالة خلال ثوانٍ، وابدأ من أفضل إجراء مقترح بنفس روح بقية لوحات MCPW.',
      activeHref: undefined,
    };
  }

  if (section !== 'control') {
    const activeSection = primarySections.find((item) => item.href === `/${section}`);

    return {
      title: activeSection?.label ?? 'لوحة التحكم',
      description: activeSection?.description ?? 'واجهة تحكم مركزية.',
      activeHref: activeSection?.href,
    };
  }

  if (!subsection) {
    return {
      title: 'لوحة التحكم',
      description: 'مجال التحكم الداخلي للمنصة والإدارة والحوكمة والأشخاص.',
      activeHref: '/control',
    };
  }

  const activeSubSection = controlSubSections.find((item) => item.href === `/control/${subsection}`);

  return {
    title: `${activeSubSection?.label ?? subsection}`,
    description: activeSubSection?.description ?? 'قسم فرعي ضمن لوحة التحكم.',
    activeHref: activeSubSection?.href,
  };
}

const topFilterItems = [
  { id: 'period-today', label: 'اليوم' },
  { id: 'state-all', label: 'All' },
  { id: 'mode-kpi', label: 'K%' },
] as const;

type TopFilterId = (typeof topFilterItems)[number]['id'];
type PrimarySectionHref = (typeof primarySections)[number]['href'];
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
  status: service.status,
})) as ReadonlyArray<{ id: string; label: string; status: string }>;

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

function resolveRailItems(activeHref?: string) {
  return primarySections.map((item) => ({
    id: item.href,
    label: item.label,
    description: item.description,
    active: item.href === activeHref,
    badge: item.href === '/dashboard' ? 'فتح مساحة الخدمة' : undefined,
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

export function ControlPanelSurfaceHost({ section, subsection }: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const [activeTopFilterId, setActiveTopFilterId] = React.useState<TopFilterId>('period-today');
  const [languageChip, setLanguageChip] = React.useState<'EN' | 'AR'>('EN');
  const [alertCount, setAlertCount] = React.useState(1);
  const [serviceQuery, setServiceQuery] = React.useState('');
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(railServiceItems[0]?.id ?? '');
  const [activeSectionHref, setActiveSectionHref] = React.useState<PrimarySectionHref>(() => {
    if (section) {
      return `/${section}` as PrimarySectionHref;
    }
    return '/dashboard';
  });
  const shellCopy = resolveShellCopy(section, subsection);
  const railItems = resolveRailItems(activeSectionHref);
  const topFilters = topFilterItems.map((item) => ({
    ...item,
    active: item.id === activeTopFilterId,
  }));
  const activeControlHref = section === 'control' && subsection ? `/control/${subsection}` : undefined;
  const isAllFilterActive = activeTopFilterId === 'state-all';
  const selectedServiceMeta = controlPanelRuntimeData.services.find((service) => service.id === selectedServiceId) ?? controlPanelRuntimeData.services[0];
  const serviceSections = selectedServiceMeta?.sections ?? [];
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
    ? serviceLeadMission
      ? {
          missionTitle: serviceLeadMission.title,
          missionDescription: serviceLeadMission.description,
          owner: serviceLeadMission.owner,
          dueLabel: serviceLeadMission.due,
          countLabel: String(serviceSections.length || 1),
        }
      : resolveFallbackMission(selectedServiceMeta?.label ?? 'الخدمة')
    : selectedSectionMission
      ? {
          missionTitle: selectedSectionMission.title,
          missionDescription: selectedSectionMission.description,
          owner: selectedSectionMission.owner,
          dueLabel: selectedSectionMission.due,
          countLabel: String(sectionServiceIds.length || 1),
        }
      : resolveFallbackMission(activeSectionLabel);
  const heroPrimaryAction = section === 'operations'
    ? { label: 'افتح DSH hub', href: '/operations/dsh' }
    : { label: 'معالجة عاجل (1)', href: '/finance' };
  const heroSecondaryAction = section === 'operations'
    ? { label: 'لوحة التحكم', href: '/dashboard' }
    : { label: 'افتح العمليات', href: '/operations' };
  const handleBrandClick = React.useCallback(() => {
    setActiveSectionHref('/dashboard');
    setActiveTopFilterId('period-today');
    router.push('/dashboard');
  }, [router]);

  const handleSearchClick = React.useCallback(() => {
    setActiveTopFilterId('state-all');
  }, []);

  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleLanguageClick = React.useCallback(() => {
    setLanguageChip((prev) => (prev === 'EN' ? 'AR' : 'EN'));
  }, []);

  const handleAlertClick = React.useCallback(() => {
    setActiveTopFilterId('state-all');
    setAlertCount(0);
  }, []);

  return (
    <BthWebCommandCenterFrame
      brandLabel="لوحة التحكم"
      surfaceTitle={shellCopy.title}
      surfaceSubtitle={shellCopy.description}
      topFilters={topFilters}
      onTopFilterSelect={(filterId) => {
        const matchedFilter = topFilterItems.find((item) => item.id === filterId);
        if (matchedFilter) {
          setActiveTopFilterId(matchedFilter.id);
        }
      }}
      onRailItemSelect={(itemId) => {
        const matchedSection = primarySections.find((item) => item.href === itemId);
        if (matchedSection) {
          setActiveSectionHref(matchedSection.href);
          setActiveTopFilterId('period-today');
          router.push(sectionRouteMap[matchedSection.href.replace('/', '') as ControlPanelSectionId]);
        }
      }}
      onBrandClick={handleBrandClick}
      onSearchClick={handleSearchClick}
      onRefreshClick={handleRefreshClick}
      onLanguageClick={handleLanguageClick}
      onAlertClick={handleAlertClick}
      railTitle="لوحة التحكم"
      railStatusLabel={isAllFilterActive ? 'All' : 'Filtered'}
      railItems={railItems}
      railSupplementary={
        isAllFilterActive ? (
          <BthWebRailServiceList
            title="قائمة الخدمات"
            searchPlaceholder="بحث سريع..."
            searchValue={serviceQuery}
            onSearchChange={setServiceQuery}
            selectedServiceId={selectedServiceId}
            onServiceSelect={(serviceId) => setSelectedServiceId(serviceId)}
            items={railServiceItems}
          />
        ) : null
      }
      languageLabel={languageChip}
      alertCountLabel={String(alertCount)}
      refreshLabel="تحديث"
      searchPlaceholder="بحث عن أمر سريع"
    >
      <div className={styles.stageStack}>
        <section className={styles.priorityPanel}>
          <BthWebMissionHeroCard
            badges={[
              `الفترة: ${activeTopFilterId === 'period-today' ? 'اليوم' : activeTopFilterId === 'state-all' ? 'All' : 'K%'}`,
              isAllFilterActive ? `الخدمة: ${selectedServiceMeta?.label ?? 'N/A'}` : `القسم: ${activeSectionHref.replace('/', '')}`,
              'آخر تحديث: مباشر',
            ]}
            eyebrow="المهمة الموصى بها الآن"
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
                    ? selectedServiceMeta?.label ?? 'N/A'
                    : activeSectionLabel
                  : signal.id === 'pressure'
                    ? isAllFilterActive
                      ? String(serviceSections.length || 1)
                      : String(sectionServiceIds.length || 1)
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
              {isAllFilterActive ? 'الأقسام المرتبطة بالخدمة' : 'الخدمات المرتبطة بالقسم'}
            </h4>
            <div className={styles.contextList}>
              {(isAllFilterActive ? serviceSections : sectionServiceNames).map((item) => (
                <span key={item} className={styles.contextChip}>
                  {item}
                </span>
              ))}
              {(isAllFilterActive ? serviceSections : sectionServiceNames).length === 0 ? (
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