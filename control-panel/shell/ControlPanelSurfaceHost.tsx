"use client";

import {
  DshControlPanelSurfaceHost,
  ControlPanelDshCatalogScreen,
  ControlPanelDshMarketingScreen,
  ControlPanelDshPartnerApprovalsScreen,
  ControlPanelDshSupportQueueScreen,
  ControlPanelDshClosureDashboardScreen,
  ControlPanelDshFinanceHubScreen,
} from "../composition";
import {
  ControlPanelDshPlatformScreen,
  ControlPanelDshAdministrationScreen,
} from "../../dsh/frontend/control-panel";
import { ControlPanelHrScreen } from "../../dsh/frontend/control-panel/hr/ControlPanelHrScreen";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useDirection,
  useUiText,
  useUiLanguage,
  type BThwaniAppearanceMode,
} from "@bthwani/ui-kit";
import { WebCommandCenterFrame, type WebSearchItem } from "@bthwani/ui-kit/web";
import {
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from "../../dsh/frontend/control-panel/operations";
import type {
  CanonicalFinanceGroupId,
  FinancePanelId,
} from "../../wlt/frontend/dsh/control-panel/models/financeRouting.types";
import {
  normalizeFinanceLocation,
} from "../../wlt/frontend/dsh/control-panel/constants/finance.registry";
import { controlPanelRuntimeData } from "./runtime.data";
import { useControlPanelAppearance } from "./appearance";
import type { ControlPanelUiGrammar } from "./ui-grammar-contract";
import styles from "./control-panel-shell.module.css";

const phaseOneSectionIds = [
  "dashboard",
  "operations",
  "finance",
  "community-services",
  "support",
] as const;
const hiddenSectionIds = [
  "catalogs",
  "partners",
  "marketing",
  "platform",
  "administration",
  "hr",
] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>["controlPanel"];

export type ControlPanelSurfaceHostProps = {
  section?: ControlPanelSectionId;
  operationsWorkspace?: AnyOperationsWorkspaceId;
  operationsOrderId?: string;
  operationsOverlayMode?: OperationsPanelId;
  financeWorkspace?: string;
  financePanel?: string;
  financeSubGroup?: string;
};

const allServiceTabId = "all-services";

type ShellCommandStatus = {
  kind: "ready" | "search" | "refresh" | "alert" | "filter" | "blocked";
  label: string;
  description: string;
};

const renderedSectionIds = [
  "dashboard",
  "operations",
  "finance",
  "community-services",
  "support",
  "partners",
  "catalogs",
  "marketing",
  "platform",
  "administration",
  "hr",
] as const satisfies readonly ControlPanelSectionId[];

function hasRenderableSection(sectionId: ControlPanelSectionId) {
  return (renderedSectionIds as readonly string[]).includes(sectionId);
}

const sectionRouteMap: Record<ControlPanelSectionId, PrimarySectionHref> = {
  dashboard: "/dashboard",
  operations: "/operations",
  finance: "/finance",
  "community-services": "/community-services",
  support: "/support",
  partners: "/partners",
  catalogs: "/catalogs",
  marketing: "/marketing",
  platform: "/platform",
  administration: "/administration",
  hr: "/hr",
};

const compactSectionDescriptions: Record<PhaseOneSectionId, string> = {
  dashboard: "نظرة سريعة",
  operations: "حالة التشغيل",
  finance: "المركز المالي",
  "community-services": "خدمات المجتمع",
  support: "دعم قابل للتصعيد",
};

const appearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: "lightPremium",
    title: "فاتح أبيض",
    description: "سطح واضح بإضاءة هادئة وحقول عالية القراءة.",
  },
  {
    mode: "darkGlass",
    title: "داكن زجاجي",
    description: "سطح داكن بطبقات أعمق وتباين مريح للمتابعة.",
  },
] as const;

function isPhaseOneSection(
  sectionId: ControlPanelSectionId,
): sectionId is PhaseOneSectionId {
  return (phaseOneSectionIds as readonly string[]).includes(sectionId);
}

function getServiceLabel(
  uiText: ReturnType<typeof useUiText>,
  serviceId: string,
) {
  const serviceNames =
    (uiText as unknown as { serviceNames?: Record<string, string> })
      .serviceNames ?? {};
  return (
    serviceNames[serviceId as keyof typeof serviceNames] ??
    serviceId.toUpperCase()
  );
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

function resolveRailItems(
  activeHref: PrimarySectionHref,
  panelText: ControlPanelText,
) {
  const iconMap: Record<string, string> = {
    dashboard: "⌂",
    operations: "◎",
    finance: "¤",
    "community-services": "◌",
    support: "☏",
    partners: "▣",
    catalogs: "⌗",
    marketing: "▤",
    platform: "⚙",
    administration: "⚙",
    hr: "◐",
  };

  const visibleSections = primarySectionIds;

  return visibleSections.map((sectionId) => {
    const href = `/${sectionId}` as PrimarySectionHref;
    const description = isPhaseOneSection(sectionId)
      ? compactSectionDescriptions[sectionId]
      : panelText.surfaceDescriptions[sectionId];

    return {
      id: href,
      href,
      label: panelText.surfaceTitles[sectionId],
      icon: iconMap[sectionId] ?? "•",
      active: href === activeHref,
    };
  });
}

export function ControlPanelSurfaceHost({
  section,
  operationsWorkspace = "overview",
  operationsOrderId,
  operationsOverlayMode,
  financeWorkspace,
  financePanel,
  financeSubGroup,
}: ControlPanelSurfaceHostProps) {
  const router = useRouter();
  const { direction } = useDirection();
  const uiText = useUiText();
  const { hydrated, mode, setMode } = useControlPanelAppearance();
  const { language, toggleLanguage } = useUiLanguage();
  const panelText = uiText.controlPanel;
  const resolvedLanguageLabel = panelText.ui.languageLabel;
  const [alertCount, setAlertCount] = React.useState(1);
  const [selectedServiceId, setSelectedServiceId] =
    React.useState<string>(allServiceTabId);
  const [activeSectionHref, setActiveSectionHref] =
    React.useState<PrimarySectionHref>(() =>
      section ? (`/${section}` as PrimarySectionHref) : "/dashboard",
    );
  const [isAppearanceMenuOpen, setIsAppearanceMenuOpen] = React.useState(false);
  const [commandStatus, setCommandStatus] = React.useState<ShellCommandStatus>({
    kind: "ready",
    label: "جاهز",
    description:
      "الشل جاهز، وكل إجراء علوي يجب أن يترك أثرًا ظاهرًا داخل هذا الشريط.",
  });
  const appearanceMenuRef = React.useRef<HTMLDivElement | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");

  // Normalize search queries to handle common Arabic character variation
  const normalizeSearchText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[أإآا]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/[ىي]/g, "ي");
  };

  const searchIndex = React.useMemo(() => {
    const items: Array<WebSearchItem & { searchTerms: string[]; type: "section" | "service" | "action"; key: string }> = [];

    const iconMap: Record<string, string> = {
      dashboard: "⌂",
      operations: "◎",
      finance: "¤",
      "community-services": "◌",
      support: "☏",
      partners: "▣",
      catalogs: "⌗",
      marketing: "▤",
      platform: "⚙",
      administration: "⚙",
      hr: "◐",
    };

    // 1. Sections index
    primarySectionIds.forEach((sectionId) => {
      const sectionTitle = panelText.surfaceTitles[sectionId] || sectionId;
      const sectionDesc = isPhaseOneSection(sectionId)
        ? compactSectionDescriptions[sectionId]
        : panelText.surfaceDescriptions[sectionId] || "";

      const searchTerms = [
        sectionId.toLowerCase(),
        sectionTitle.toLowerCase(),
        sectionDesc.toLowerCase(),
      ];

      // Arabic & English synonym matching helpers
      if (sectionId === "dashboard") searchTerms.push("dsh", "لوحه القياده", "الرئيسيه", "النظره العامه", "dashboard");
      if (sectionId === "operations") searchTerms.push("العمليات", "التشغيل", "حاله التشغيل", "operations");
      if (sectionId === "finance") searchTerms.push("wlt", "الماليه", "ماليه", "المركز المالي", "حسابات", "finance");
      if (sectionId === "community-services") searchTerms.push("knz", "kwd", "esf", "mrf", "snd", "خدمات المجتمع", "المجتمع", "الخدمات المجتمعيه", "community");
      if (sectionId === "support") searchTerms.push("الدعم", "دعم فني", "المساعده", "تذاكر", "support");
      if (sectionId === "partners") searchTerms.push("الشركاء", "شركاء", "الموافقه على الشركاء", "partners");
      if (sectionId === "catalogs") searchTerms.push("الكتالوجات", "المنتجات", "المتاجر", "catalogs", "catalog");
      if (sectionId === "marketing") searchTerms.push("التسويق", "تسويق", "العروض", "الحملات", "marketing");
      if (sectionId === "platform") searchTerms.push("المنصه", "منصه", "اعدادات المنصه", "platform");
      if (sectionId === "administration") searchTerms.push("الاداره", "اداره", "النظام", "administration", "admin");
      if (sectionId === "hr") searchTerms.push("الموارد البشريه", "موارد بشريه", "طاقم العمل", "وظائف", "hr");

      items.push({
        id: `section:${sectionId}`,
        type: "section",
        key: sectionId,
        label: sectionTitle,
        description: sectionDesc,
        meta: "قسم لوحة التحكم",
        icon: iconMap[sectionId] ?? "•",
        searchTerms,
      });
    });

    // 2. Services index
    controlPanelRuntimeData.services.forEach((service) => {
      const serviceLabel = getServiceLabel(uiText, service.id);
      const serviceDesc = service.placeholder ? "خدمة مرجعية" : "خدمة نشطة";
      const statusLabel = service.placeholder ? "مرجعي" : "نشط";
      const searchTerms = [
        service.id.toLowerCase(),
        serviceLabel.toLowerCase(),
        statusLabel,
      ];

      if (service.id === "dsh") searchTerms.push("dashboard", "لوحه القياده", "لوحه التحكم");
      if (service.id === "arb") searchTerms.push("عرب");
      if (service.id === "amn") searchTerms.push("امن");
      if (service.id === "wlt") searchTerms.push("finance", "الماليه", "محفظه");
      if (service.id === "knz") searchTerms.push("كنز");
      if (service.id === "kwd") searchTerms.push("كويت");
      if (service.id === "esf") searchTerms.push("ايسف");
      if (service.id === "mrf") searchTerms.push("مرف");
      if (service.id === "snd") searchTerms.push("سند");

      items.push({
        id: `service:${service.id}`,
        type: "service",
        key: service.id,
        label: serviceLabel,
        description: serviceDesc,
        meta: `خدمة (${statusLabel})`,
        tone: service.placeholder ? "neutral" : "success",
        icon: service.placeholder ? "◌" : "⚡",
        searchTerms,
      });
    });

    // 3. Actions index
    items.push({
      id: "action:refresh",
      type: "action",
      key: "refresh",
      label: "تحديث الشل",
      description: "تحديث حالة لوحة التحكم وتصفير التنبيهات محلياً",
      meta: "إجراء الشل",
      tone: "warning",
      icon: "↻",
      searchTerms: ["refresh", "reload", "تحديث", "اعاده تحميل"],
    });

    items.push({
      id: "action:alerts",
      type: "action",
      key: "alerts",
      label: "مراجعة التنبيهات",
      description: "عرض التنبيهات وتصفير المؤشر",
      meta: "إجراء الشل",
      tone: "danger",
      icon: "🔔",
      searchTerms: ["alerts", "notifications", "تنبيهات", "التنبيهات"],
    });

    items.push({
      id: "action:dashboard",
      type: "action",
      key: "dashboard",
      label: "لوحة القيادة الرئيسية",
      description: "الرجوع إلى شاشة لوحة القيادة وتصفير الفلاتر",
      meta: "إجراء الشل",
      tone: "success",
      icon: "⌂",
      searchTerms: ["dashboard", "الرئيسية", "لوحة القيادة", "الرئيسيه", "لوحه القياده"],
    });

    items.push({
      id: "action:appearance",
      type: "action",
      key: "appearance",
      label: "تبديل المظهر",
      description: "تبديل مظهر الواجهة بين الفاتح والداكن الزجاجي",
      meta: "إجراء الشل",
      icon: "◐",
      searchTerms: ["appearance", "theme", "dark", "light", "مظهر", "تغيير المظهر", "داكن", "فاتح"],
    });

    return items;
  }, [panelText, uiText]);

  const filteredSearchResults = React.useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return [];

    const matches = searchIndex.filter((item) => {
      return item.searchTerms.some((term: string) => {
        const normalizedTerm = normalizeSearchText(term);
        return normalizedTerm.includes(query);
      });
    });

    const currentActiveSectionId = activeSectionHref.slice(1) as ControlPanelSectionId;

    return [...matches].sort((a, b) => {
      if (a.type === "section" && a.key === currentActiveSectionId) return -1;
      if (b.type === "section" && b.key === currentActiveSectionId) return 1;

      if (a.type === "section" && b.type !== "section") return -1;
      if (b.type === "section" && a.type !== "section") return 1;

      if (a.type === "service" && b.type === "service") {
        const aService = controlPanelRuntimeData.services.find((s) => s.id === a.key);
        const bService = controlPanelRuntimeData.services.find((s) => s.id === b.key);
        const aLive = aService && aService.statusKind === "live" && !aService.placeholder;
        const bLive = bService && bService.statusKind === "live" && !bService.placeholder;
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
      }

      if (a.type === "service" && b.type === "action") return -1;
      if (b.type === "service" && a.type === "action") return 1;

      return 0;
    });
  }, [searchIndex, searchQuery, activeSectionHref]);

  React.useEffect(() => {
    setActiveSectionHref(
      section ? (`/${section}` as PrimarySectionHref) : "/dashboard",
    );
  }, [section]);

  const activeSectionId = activeSectionHref.slice(1) as ControlPanelSectionId;
  const isOperationsSection = activeSectionId === "operations";
  const isMarketingSection = activeSectionId === "marketing";
  const isAllFilterActive = selectedServiceId === allServiceTabId;
  const shellCopy = resolveShellCopy(panelText, activeSectionId);
  const railItems = React.useMemo(() => {
    const allItems = resolveRailItems(activeSectionHref, panelText);
    if (isAllFilterActive) return allItems;

    const serviceMeta = controlPanelRuntimeData.services.find(
      (s) => s.id === selectedServiceId,
    );
    if (!serviceMeta) return allItems;

    return allItems.filter((item) => {
      const sectionId = item.id.slice(1) as ControlPanelSectionId;
      return (
        sectionId === activeSectionId ||
        serviceMeta.sections.includes(sectionId)
      );
    });
  }, [
    activeSectionHref,
    isAllFilterActive,
    panelText,
    selectedServiceId,
    activeSectionId,
  ]);

  React.useEffect(() => {
    if (!isAppearanceMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!appearanceMenuRef.current?.contains(event.target as Node)) {
        setIsAppearanceMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isAppearanceMenuOpen]);

  const selectedServiceMeta = isAllFilterActive
    ? undefined
    : controlPanelRuntimeData.services.find(
        (service) => service.id === selectedServiceId,
      );
  const selectedServiceLabel = selectedServiceMeta
    ? getServiceLabel(uiText, selectedServiceMeta.id)
    : panelText.filters.allServices;
  const activeAppearance =
    appearanceOptions.find((option) => option.mode === mode) ??
    appearanceOptions[0];

  const activeMission = controlPanelRuntimeData.missions.find(
    (mission) => mission.sectionId === activeSectionId && !mission.placeholder,
  );
  const activeSectionRuntime = controlPanelRuntimeData.sections.find(
    (sectionEntry) => sectionEntry.id === activeSectionId,
  );
  const activeSectionServiceIds = activeSectionRuntime?.serviceIds ?? [];
  const liveSectionServiceCount = activeSectionServiceIds.filter(
    (serviceId) => {
      const serviceMeta = controlPanelRuntimeData.services.find(
        (service) => service.id === serviceId,
      );
      return serviceMeta && !serviceMeta.placeholder;
    },
  ).length;


  const handleBrandClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setActiveSectionHref("/dashboard");
    router.push("/dashboard");
  }, [router]);

  const handleSearchClick = React.useCallback(() => {
    setCommandStatus({
      kind: "search",
      label: "بحث القسم",
      description: `تم تفعيل بحث الشل داخل ${shellCopy.title}. لا يتم إنشاء route جديد؛ التفاصيل يجب أن تبقى داخل tabs/drawers/split panes الخاصة بالقسم.`,
    });
  }, [shellCopy.title]);

  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((currentCount) => (currentCount > 0 ? currentCount - 1 : 0));
    setCommandStatus({
      kind: "refresh",
      label: "تحديث محلي",
      description: `تم تحديث حالة الشل للقسم ${shellCopy.title} بدون API/backend/runtime mutation.`,
    });
  }, [shellCopy.title]);

  const handleAlertClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setAlertCount(0);
    setCommandStatus({
      kind: "alert",
      label: "تمت مراجعة التنبيهات",
      description:
        "تمت إعادة فلتر الخدمات إلى الكل وتصفير مؤشر التنبيه داخل الشل.",
    });
  }, []);

  const handleSearchResultSelect = React.useCallback(
    (id: string) => {
      const [type, key] = id.split(":");

      if (type === "section") {
        const sectionId = key as ControlPanelSectionId;
        const nextHref = sectionRouteMap[sectionId];
        setActiveSectionHref(nextHref);
        router.push(nextHref);
        const sectionTitle = panelText.surfaceTitles[sectionId] || sectionId;
        setCommandStatus({
          kind: "search",
          label: "انتقال سريع",
          description: `تم الانتقال سريعًا إلى قسم "${sectionTitle}" عبر موجه الأوامر.`,
        });
        setSearchQuery("");
      } else if (type === "service") {
        const serviceId = key;
        setSelectedServiceId(serviceId);
        const serviceMeta = controlPanelRuntimeData.services.find(
          (s) => s.id === serviceId,
        );
        const serviceLabel = serviceMeta
          ? getServiceLabel(uiText, serviceMeta.id)
          : serviceId.toUpperCase();

        const isSectionInService =
          serviceMeta && serviceMeta.sections.includes(activeSectionId);
        if (!isSectionInService && serviceMeta && serviceMeta.sections.length > 0) {
          const targetSection = serviceMeta.sections[0] as ControlPanelSectionId;
          const nextHref = sectionRouteMap[targetSection];
          setActiveSectionHref(nextHref);
          router.push(nextHref);
          const targetTitle =
            panelText.surfaceTitles[targetSection] || targetSection;
          setCommandStatus({
            kind: "filter",
            label: `خدمة ${serviceLabel}`,
            description: `تم تصفية الشل على الخدمة ${serviceLabel} والانتقال لقسمها الأول "${targetTitle}".`,
          });
        } else {
          setCommandStatus({
            kind: "filter",
            label: `تصفية الخدمة: ${serviceLabel}`,
            description: `تم حصر لوحة التحكم على الخدمة ${serviceLabel}.`,
          });
        }
        setSearchQuery("");
      } else if (type === "action") {
        if (key === "refresh") {
          handleRefreshClick();
        } else if (key === "alerts") {
          handleAlertClick();
        } else if (key === "dashboard") {
          handleBrandClick();
        } else if (key === "appearance") {
          const nextMode = mode === "lightPremium" ? "darkGlass" : "lightPremium";
          setMode(nextMode);
          setCommandStatus({
            kind: "ready",
            label: "تغيير المظهر",
            description: `تم تبديل المظهر إلى ${
              nextMode === "darkGlass" ? "الداكن الزجاجي" : "الفاتح الأبيض"
            } عبر البحث الذكي.`,
          });
        }
        setSearchQuery("");
      }
    },
    [
      router,
      activeSectionId,
      panelText,
      uiText,
      mode,
      setMode,
      handleRefreshClick,
      handleAlertClick,
      handleBrandClick,
    ],
  );

  const railSupplementary = React.useMemo(() => {
    return (
      <div className={styles.railSupplementaryCard}>
        <div className={styles.railSupplementaryRow}>
          <span className={styles.railSupplementaryLabel}>المالك والتدفق</span>
          <span className={styles.railSupplementaryVal}>
            {activeMission
              ? `${activeMission.ownerSectionId} / ${activeMission.flowId}`
              : "لا يوجد"}
          </span>
        </div>
        <div className={styles.railSupplementaryRow}>
          <span className={styles.railSupplementaryLabel}>الخدمات النشطة</span>
          <span className={styles.railSupplementaryVal}>
            {liveSectionServiceCount}/{activeSectionServiceIds.length}
          </span>
        </div>
        <div className={styles.railSupplementaryRow}>
          <span className={styles.railSupplementaryLabel}>الأمر النشط</span>
          <span className={styles.railSupplementaryVal}>
            {commandStatus.label}
          </span>
        </div>
      </div>
    );
  }, [activeMission, liveSectionServiceCount, activeSectionServiceIds, commandStatus.label]);

  const profileControl = (
    <div className={styles.appearanceMenu} ref={appearanceMenuRef}>
      <button
        type="button"
        className={styles.appearanceMenuTrigger}
        aria-expanded={isAppearanceMenuOpen}
        aria-haspopup="menu"
        aria-label="الملف الشخصي والإعدادات"
        title="الملف الشخصي والإعدادات"
        onClick={() => setIsAppearanceMenuOpen((current) => !current)}
      >
        <span className={styles.appearanceMenuTriggerAvatar} aria-hidden="true">
          ب
        </span>
      </button>

      {isAppearanceMenuOpen ? (
        <div
          className={styles.appearanceMenuPopover}
          role="menu"
          aria-label="الملف الشخصي والإعدادات"
        >
          {/* User profile section */}
          <div className={styles.profileUserInfoSection}>
            <div className={styles.profileUserAvatarLarge}>ب</div>
            <div className={styles.profileUserDetails}>
              <strong className={styles.profileUserName}>بدر الثواني</strong>
              <span className={styles.profileUserRole}>مدير النظام</span>
              <span className={styles.profileUserJob}>مدير التطوير والعمليات</span>
            </div>
          </div>

          <hr className={styles.profileMenuDivider} />

          {/* Quick Info & Language preferences */}
          <div className={styles.profilePreferenceSection}>
            <span className={styles.profileSectionHeading}>اللغة المفضلة</span>
            <div className={styles.profileLangSegmented}>
              <button
                type="button"
                className={[
                  styles.profileLangTab,
                  language === "ar" ? styles.profileLangTabActive : "",
                ].join(" ")}
                onClick={() => {
                  if (language !== "ar") {
                    toggleLanguage();
                    setIsAppearanceMenuOpen(false);
                  }
                }}
              >
                العربية
              </button>
              <button
                type="button"
                className={[
                  styles.profileLangTab,
                  language === "en" ? styles.profileLangTabActive : "",
                ].join(" ")}
                onClick={() => {
                  if (language !== "en") {
                    toggleLanguage();
                    setIsAppearanceMenuOpen(false);
                  }
                }}
              >
                English
              </button>
            </div>
          </div>

          <hr className={styles.profileMenuDivider} />

          {/* Appearance Section */}
          <div className={styles.profilePreferenceSection}>
            <span className={styles.profileSectionHeading}>مظهر الشل</span>
            <div className={styles.profileLangSegmented}>
              {appearanceOptions.map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  className={[
                    styles.profileLangTab,
                    mode === option.mode ? styles.profileLangTabActive : "",
                  ].join(" ")}
                  onClick={() => {
                    setMode(option.mode);
                    setIsAppearanceMenuOpen(false);
                  }}
                >
                  {option.title}
                </button>
              ))}
            </div>
          </div>

          <hr className={styles.profileMenuDivider} />

          {/* Additional Info / Extras */}
          <div className={styles.profileExtraSection}>
            <div className={styles.profileExtraItem}>
              <span>حالة النظام:</span>
              <span className={styles.profileStatusIndicator}>
                متصل بالشبكة
                <span className={styles.profilePulseDot} />
              </span>
            </div>
            <div className={styles.profileExtraItem}>
              <span>معرف الجلسة:</span>
              <code className={styles.profileSessionId}>18e1d781</code>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/*
        This Shell adheres to ControlPanelUiGrammar:
        - Density: standard for shell, sub-sections can use compact.
        - Hero Policy: showHero={false} is enforced.
        - Direction: respects useDirection() from UI kit.
      */}
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
            const nextLabel =
              serviceId === allServiceTabId
                ? panelText.filters.allServices
                : getServiceLabel(uiText, serviceId);
            const serviceMeta =
              serviceId === allServiceTabId
                ? undefined
                : controlPanelRuntimeData.services.find(
                    (s) => s.id === serviceId,
                  );
            const isSectionOutsideFilter =
              serviceMeta && !serviceMeta.sections.includes(activeSectionId);
            setCommandStatus({
              kind: "filter",
              label: "فلتر الخدمات",
              description: isSectionOutsideFilter
                ? "القسم الحالي خارج فلتر الخدمة، بقي القسم ثابتًا ويمكن الانتقال يدويًا من rail."
                : `تم حصر rail على ${nextLabel} مع الحفاظ على section ثابت وعدم إنشاء route إضافي.`,
            });
          }}
          onRailItemSelect={(itemId) => {
            const matchedSection = primarySectionIds.find(
              (sectionId) => `/${sectionId}` === itemId,
            );

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
          railStatusLabel={
            isAllFilterActive
              ? panelText.filters.allServices
              : selectedServiceLabel
          }
          railItems={railItems}
          railSupplementary={railSupplementary}
          alertCountLabel={String(alertCount)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={filteredSearchResults as unknown as WebSearchItem[]}
          onSearchResultSelect={handleSearchResultSelect}
          searchHint="ابحث عن قسم، خدمة، أو إجراء (مثال: DSH, المالية, العمليات...)"
          searchEmptyLabel="لا توجد نتائج مطابقة لبحثك"
        >
          <div className={styles.stageStack} dir={direction}>


            {activeSectionId === "dashboard" ? (
              <ControlPanelDshClosureDashboardScreen />
            ) : null}

            {activeSectionId === "finance" ? (
              (() => {
                const normalized = normalizeFinanceLocation(financeWorkspace, financePanel);
                return (
                  <ControlPanelDshFinanceHubScreen
                    group={normalized.group}
                    panel={normalized.panel}
                    subGroup={financeSubGroup ?? normalized.subGroup}
                  />
                );
              })()
            ) : null}

            {isOperationsSection ? (
              <DshControlPanelSurfaceHost
                workspace={operationsWorkspace}
                orderId={operationsOrderId}
                orderOverlayMode={operationsOverlayMode}
              />
            ) : null}

            {activeSectionId === "partners" ? (
              <ControlPanelDshPartnerApprovalsScreen />
            ) : null}

            {activeSectionId === "catalogs" ? (
              <ControlPanelDshCatalogScreen />
            ) : null}

            {isMarketingSection ? (
              <ControlPanelDshMarketingScreen
                hubHref="/marketing"
                operationsHref="/operations"
              />
            ) : null}

            {activeSectionId === "platform" ? (
              <ControlPanelDshPlatformScreen />
            ) : null}

            {activeSectionId === "administration" ? (
              <ControlPanelDshAdministrationScreen />
            ) : null}

            {activeSectionId === "hr" ? <ControlPanelHrScreen /> : null}

            {activeSectionId === "support" ? (
              <ControlPanelDshSupportQueueScreen />
            ) : null}

            {!hasRenderableSection(activeSectionId) ? (
              <section
                className={styles.shellBoundaryState}
                role="status"
                aria-label="حالة حدود القسم"
              >
                <span className={styles.shellBoundaryEyebrow}>حدود القسم</span>
                <h2 className={styles.shellBoundaryTitle}>{shellCopy.title}</h2>
                <p className={styles.shellBoundaryDescription}>
                  هذا route موجود في خريطة الشل، لكنه لا يملك workspace قابلًا
                  للعرض داخل العقد الحالي. لذلك لا يتم عرض واجهة ساكنة تدّعي
                  التشغيل. يجب تحويل تفاصيله إلى tab/drawer/split pane داخل
                  المالك الصحيح قبل اعتباره مغلقًا.
                </p>
                <button
                  type="button"
                  className={styles.shellBoundaryAction}
                  onClick={() => {
                    setCommandStatus({
                      kind: "blocked",
                      label: "قسم غير مكتمل",
                      description: `${shellCopy.title} يحتاج owner/workspace مثبت قبل تفعيل شاشة مستقلة.`,
                    });
                    router.push("/administration");
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
