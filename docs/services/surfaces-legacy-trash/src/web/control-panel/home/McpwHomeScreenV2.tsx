'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Headphones,
  Package,
  RefreshCw,
  ShieldCheck,
  Target,
  Truck,
} from 'lucide-react';

import {
  CommandPalette,
  useCommandPalette,
} from '../components/CommandPalette';
import McpwOverviewRuntimeLayout from '../components/McpwOverviewRuntimeLayout';
import type {
  OverviewActivityItem,
  OverviewAlertItem,
  OverviewInsightItem,
  OverviewKpiItem,
  OverviewQueueAction,
  WorkspaceLaunchItem,
} from '../components/CommandCenterPrimitivesRuntime';
import { useKPIData, useWorkQueueData } from '../hooks/useWorkQueueData';
import useDirection from '../hooks/useDirection';
import {
  getRecentTelemetryEvents,
  trackMcpwTelemetry,
  type McpwTelemetryEvent,
} from '../utils/mcpwTelemetry';

type QueuePriority = 'critical' | 'high' | 'normal';

const PERIOD_OPTIONS = [
  { id: 'today', label: 'اليوم' },
  { id: 'week', label: 'هذا الأسبوع' },
  { id: 'month', label: 'هذا الشهر' },
] as const;

const FALLBACK_ACTIONS: OverviewQueueAction[] = [
  {
    id: 'critical-payouts',
    title: 'مدفوعات متأخرة تحتاج اعتماد',
    description: 'طلبات تجاوزت زمن المعالجة وتحتاج قرارًا فوريًا.',
    priority: 'critical',
    href: '/finance/payouts?status=pending',
    icon: DollarSign,
    owner: 'المالية',
    dueLabel: 'خلال 15 دقيقة',
    count: 7,
  },
  {
    id: 'high-support',
    title: 'تذاكر دعم حرجة غير مغلقة',
    description: 'بلاغات عالية التأثير تحتاج إجراء قبل التصعيد.',
    priority: 'high',
    href: '/support/dsh-chat',
    icon: Headphones,
    owner: 'الدعم',
    dueLabel: 'خلال 30 دقيقة',
    count: 4,
  },
  {
    id: 'normal-fleet',
    title: 'مراجعة توفر الكباتن للمناوبات',
    description: 'فجوة بسيطة في التغطية المتوقعة خلال الفترة المقبلة.',
    priority: 'normal',
    href: '/fleet/availability',
    icon: Truck,
    owner: 'الأسطول',
    dueLabel: 'اليوم',
  },
  {
    id: 'normal-catalog',
    title: 'منتجات ببيانات غير مكتملة',
    description: 'تحسين جودة العرض قبل إطلاق حملات نهاية الأسبوع.',
    priority: 'normal',
    href: '/product-catalog',
    icon: Package,
    owner: 'الكتالوج',
    dueLabel: 'اليوم',
    count: 12,
  },
];

const EMPTY_PRIMARY_ACTION: OverviewQueueAction = {
  id: 'open-operations',
  title: 'مسار التشغيل الأساسي جاهز',
  description:
    'لا توجد عناصر حرجة الآن، ويمكنك الدخول مباشرة إلى العمليات أو مراجعة آخر النشاط.',
  priority: 'normal',
  href: '/operations',
  icon: Package,
  owner: 'العمليات',
  dueLabel: 'الآن',
};

const WORKSPACE_CARDS: WorkspaceLaunchItem[] = [
  {
    id: 'workspace-operations',
    title: 'العمليات',
    subtitle: 'الطلبات، التوزيع، وإعادة التعيين في مساحة تنفيذ مباشرة.',
    href: '/operations/dsh/orders',
    icon: Package,
    tone: 'indigo',
  },
  {
    id: 'workspace-finance',
    title: 'المالية',
    subtitle: 'المدفوعات والتسويات والسجل المالي عالي الأولوية.',
    href: '/finance/payouts',
    icon: DollarSign,
    tone: 'green',
  },
  {
    id: 'workspace-support',
    title: 'الدعم',
    subtitle: 'المحادثات والتصعيدات الحرجة بنقرة واحدة.',
    href: '/support/dsh-chat',
    icon: Headphones,
    tone: 'amber',
  },
  {
    id: 'workspace-fleet',
    title: 'الأسطول',
    subtitle: 'الجاهزية والتغطية التشغيلية ومراقبة الكباتن.',
    href: '/fleet/availability',
    icon: Truck,
    tone: 'blue',
  },
  {
    id: 'workspace-analytics',
    title: 'التحليلات',
    subtitle: 'رؤية الاتجاهات والانحرافات قبل أن تصبح مشكلة.',
    href: '/analytics/dsh-orders',
    icon: BarChart3,
    tone: 'indigo',
  },
  {
    id: 'workspace-governance',
    title: 'الحوكمة',
    subtitle: 'السياسات والحراس وإدارة المخاطر من واجهة واحدة.',
    href: '/governance/policies',
    icon: ShieldCheck,
    tone: 'slate',
  },
];

function trackInteraction(eventId: string, target: string) {
  trackMcpwTelemetry(eventId, {
    target,
    href: target,
    surface: 'control-panel-overview',
  });
}

function resolvePriority(priority: string | undefined): QueuePriority {
  if (priority === 'critical' || priority === 'high') return priority;
  return 'normal';
}

function formatRelativeTime(timestamp: string): string {
  const deltaMs = Date.now() - new Date(timestamp).getTime();

  if (!Number.isFinite(deltaMs) || deltaMs < 0) return 'الآن';

  const minutes = Math.round(deltaMs / 60000);
  if (minutes <= 1) return 'الآن';
  if (minutes < 60) return `قبل ${minutes} دقيقة`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;

  const days = Math.round(hours / 24);
  return `قبل ${days} يوم`;
}

function describeTelemetryEvent(event: McpwTelemetryEvent) {
  const target =
    typeof event.target === 'string'
      ? event.target
      : typeof event.payload.target === 'string'
        ? event.payload.target
        : undefined;

  if (event.eventName.startsWith('overview:primary-cta')) {
    return {
      title: 'تم فتح المسار الرئيسي',
      description:
        'المستخدم اتجه مباشرة إلى الإجراء الأعلى أولوية من نظرة عامة واحدة.',
      href: target,
      tone: 'success' as const,
    };
  }

  if (event.eventName.startsWith('queue-action:')) {
    return {
      title: 'تم تنفيذ عنصر من مركز الانتباه',
      description:
        'أحد الصفوف عالية الأولوية انتقل من الشاشة مباشرة إلى مسار التنفيذ.',
      href: target,
      tone: 'critical' as const,
    };
  }

  if (event.eventName.startsWith('focus-kpi:')) {
    return {
      title: 'تم فتح عرض مفلتر من شريط التركيز',
      description:
        'النظرة العامة قادت المستخدم من المؤشر مباشرة إلى شاشة المتابعة.',
      href: target,
      tone: 'info' as const,
    };
  }

  if (event.eventName.startsWith('workspace:')) {
    return {
      title: 'دخول سريع إلى مساحة عمل',
      description:
        'تم استئناف العمل من بطاقة launch دون المرور بمستويات إضافية.',
      href: target,
      tone: 'success' as const,
    };
  }

  if (event.eventName === 'overview:refresh') {
    return {
      title: 'تم تحديث مركز القيادة',
      description:
        'أُعيد تحميل المؤشرات وقائمة التنفيذ للحالة التشغيلية الحالية.',
      href: undefined,
      tone: 'info' as const,
    };
  }

  if (event.eventName === 'overview:command-open') {
    return {
      title: 'فتح البحث والأوامر',
      description:
        'تم استدعاء command search من السطح الرئيسي لتقليل التنقل اليدوي.',
      href: undefined,
      tone: 'neutral' as const,
    };
  }

  if (event.eventName === 'overview:period-filter') {
    return {
      title: 'تغيير فترة القراءة',
      description: 'تم تعديل الإطار الزمني دون مغادرة لوحة القيادة.',
      href: undefined,
      tone: 'warning' as const,
    };
  }

  return {
    title: 'نشاط حديث على اللوحة',
    description: 'تمت خطوة تشغيلية من شاشة النظرة العامة.',
    href: target,
    tone: 'neutral' as const,
  };
}

export default function McpwHomeScreenV2() {
  const { currentLanguage } = useI18n();
  const { isRTL } = useDirection();
  const {
    isOpen: isCommandPaletteOpen,
    open: openCommandPalette,
    close: closeCommandPalette,
  } = useCommandPalette();
  const {
    items: workQueueItems,
    isLoading: isWorkLoading,
    error: workError,
    source: workSource,
    lastUpdatedAt: workUpdatedAt,
    refetch: refetchWorkQueue,
  } = useWorkQueueData();
  const {
    kpis,
    isLoading: isKpisLoading,
    source: kpiSource,
    lastUpdatedAt: kpiUpdatedAt,
    refetch: refetchKpis,
  } = useKPIData();

  const [period, setPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]['id']>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [lastRefreshAt, setLastRefreshAt] = useState<string | null>(null);

  const locale = currentLanguage === 'en' ? 'en-US' : 'ar-SA';
  const usesFallbackQueue = workSource === 'fallback';
  const usesHybridData = workSource === 'hybrid' || kpiSource === 'hybrid';
  const hasLiveKpis =
    kpiSource !== 'fallback' && kpis.totalOrders.value !== '—';
  const hardError = workError ?? null;
  const visibleHardError = hardError && !isErrorDismissed ? hardError : null;
  const selectedPeriodLabel =
    PERIOD_OPTIONS.find(option => option.id === period)?.label ?? 'اليوم';
  const surfaceModeLabel = usesFallbackQueue
    ? 'وضع مرجعي ذكي'
    : usesHybridData
      ? 'ربط مباشر جزئي'
      : 'بيانات مباشرة';
  const surfaceModeValue = usesFallbackQueue
    ? 'مرجعي'
    : usesHybridData
      ? 'هجين'
      : 'حي';
  const surfaceModeTone = usesFallbackQueue
    ? ('warning' as const)
    : usesHybridData
      ? ('info' as const)
      : ('success' as const);

  const recordInteraction = useCallback((eventId: string, target: string) => {
    trackInteraction(eventId, target);
    setTelemetryTick(prev => prev + 1);
  }, []);

  useEffect(() => {
    setIsErrorDismissed(false);
  }, [hardError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCommandRequest = () => {
      openCommandPalette();
      recordInteraction('overview:command-open', 'topbar-search');
    };

    window.addEventListener(
      'control panel:command-search-requested',
      handleCommandRequest
    );

    return () => {
      window.removeEventListener(
        'control panel:command-search-requested',
        handleCommandRequest
      );
    };
  }, [openCommandPalette, recordInteraction]);

  const kpiCards = useMemo<OverviewKpiItem[]>(() => {
    if (!hasLiveKpis) {
      return [
        {
          key: 'in-progress',
          title: 'قيد التنفيذ',
          subtitle: 'مقارنة بالفترة السابقة',
          value: 312,
          trend: 6,
          positive: true,
          href: '/operations/dsh/orders',
          icon: Package,
          tone: 'orange',
        },
        {
          key: 'critical-issues',
          title: 'مشاكل حرجة',
          subtitle: 'تحتاج قرارًا مباشرًا',
          value: 7,
          trend: 12,
          positive: false,
          href: '/support/dsh-chat',
          icon: AlertTriangle,
          tone: 'red',
        },
        {
          key: 'new-requests',
          title: 'طلبات جديدة',
          subtitle: 'منذ بداية اليوم',
          value: 128,
          trend: 9,
          positive: true,
          href: '/operations/dsh',
          icon: Truck,
          tone: 'blue',
        },
        {
          key: 'sla',
          title: 'الالتزام SLA',
          subtitle: 'آخر 24 ساعة',
          value: '97.3%',
          trend: 2,
          positive: true,
          href: '/analytics/dsh-orders',
          icon: CheckCircle2,
          tone: 'green',
        },
      ];
    }

    return [
      {
        key: 'total-orders',
        title: 'إجمالي الطلبات',
        subtitle: 'قراءة مباشرة من السطح الحالي',
        value: kpis.totalOrders.value,
        trend: kpis.totalOrders.trend,
        positive: kpis.totalOrders.isPositive,
        href: '/operations/dsh/orders',
        icon: Package,
        tone: 'orange',
      },
      {
        key: 'issues',
        title: 'مشاكل حرجة',
        subtitle: 'تنبيهات تحتاج قرارًا مباشرًا',
        value: kpis.issues.value,
        trend: kpis.issues.trend,
        positive: kpis.issues.isPositive,
        href: '/support/dsh-chat',
        icon: AlertTriangle,
        tone: 'red',
      },
      {
        key: 'in-progress',
        title: 'قيد التنفيذ',
        subtitle: 'الطلبات النشطة الآن',
        value: kpis.inProgress.value,
        trend: kpis.inProgress.trend,
        positive: kpis.inProgress.isPositive,
        href: '/operations/dsh',
        icon: Truck,
        tone: 'blue',
      },
      {
        key: 'completed',
        title: 'مكتملة',
        subtitle: 'نسبة الإنجاز الحالية',
        value: kpis.completedOrders.value,
        trend: kpis.completedOrders.trend,
        positive: kpis.completedOrders.isPositive,
        href: '/analytics/dsh-orders',
        icon: CheckCircle2,
        tone: 'green',
      },
    ];
  }, [hasLiveKpis, kpis]);

  const actionItems = useMemo<OverviewQueueAction[]>(() => {
    if (usesFallbackQueue) return FALLBACK_ACTIONS;
    if (workQueueItems.length === 0) return [];

    return workQueueItems.slice(0, 4).map((item, index) => {
      const href = item.href || '/operations/dsh/orders';
      const countFromBadge =
        typeof item.badge === 'string' && /^\d+$/.test(item.badge)
          ? Number(item.badge)
          : undefined;

      return {
        id: item.id,
        title: item.title,
        description: item.description || 'يحتاج متابعة تشغيلية.',
        priority: resolvePriority(item.priority),
        href,
        icon: item.icon,
        owner: index === 0 ? 'المالية' : index === 1 ? 'الدعم' : 'العمليات',
        dueLabel:
          index === 0
            ? 'خلال 15 دقيقة'
            : index === 1
              ? 'خلال 30 دقيقة'
              : 'اليوم',
        count: countFromBadge,
      };
    });
  }, [usesFallbackQueue, workQueueItems]);

  const criticalCount = actionItems.filter(
    item => item.priority === 'critical'
  ).length;
  const primaryAction =
    actionItems[0] ??
    (usesFallbackQueue ? FALLBACK_ACTIONS[0] : EMPTY_PRIMARY_ACTION);

  const activityItems = useMemo<OverviewActivityItem[]>(() => {
    const recentEvents = getRecentTelemetryEvents(5).map((event, index) => {
      const mapped = describeTelemetryEvent(event);
      return {
        id: `${event.eventName}-${index}`,
        title: mapped.title,
        description: mapped.description,
        href: mapped.href,
        tone: mapped.tone,
        meta: formatRelativeTime(event.at),
      };
    });

    if (recentEvents.length > 0) return recentEvents;

    return [
      {
        id: 'fallback-activity-1',
        title: usesFallbackQueue ? 'الوضع المرجعي مفعّل' : 'السطح جاهز للتنفيذ',
        description: usesFallbackQueue
          ? 'المؤشرات المرجعية تعمل لتبقى الشاشة قابلة للاستخدام حتى قبل اكتمال كل مصادر البيانات.'
          : 'اللوحة تقرأ الحالة الحالية وتبقي المسار الأعلى أولوية في أعلى الشاشة.',
        meta: `الفترة الحالية: ${selectedPeriodLabel}`,
        tone: usesFallbackQueue ? 'warning' : 'success',
      },
      {
        id: 'fallback-activity-2',
        title: 'جاهزية التنقل السريع',
        description:
          'كل المسارات الأساسية يمكن الوصول إليها من نفس الشاشة بنقرة واحدة أو اثنتين كحد أقصى.',
        meta: 'مسار ثابت',
        tone: 'info',
      },
    ];
  }, [selectedPeriodLabel, telemetryTick, usesFallbackQueue]);

  const overviewInsights = useMemo<OverviewInsightItem[]>(() => {
    const dataMode = usesFallbackQueue
      ? 'بعض المسارات ما تزال تعتمد الوضع المرجعي الذكي حتى اكتمال الربط الشامل.'
      : workSource === 'hybrid' || kpiSource === 'hybrid'
        ? 'جزء من الإشارات حي الآن، والسطح يحافظ على الوضوح دون إخفاء مستوى الجاهزية.'
        : 'السطح يقرأ الإشارات الحية ويعيد ترتيب القرار الأعلى أولوية تلقائيًا.';

    return [
      {
        id: 'next-best-action',
        title: 'الإجراء التالي المقترح',
        description:
          criticalCount > 0
            ? `ابدأ من ${primaryAction.title} لتخفيض الضغط الحرِج قبل الانتقال إلى المسارات الثانوية.`
            : `لا يوجد حرج مباشر الآن؛ افتح ${primaryAction.title} للاستمرار من المسار التشغيلي الأساسي.`,
        tone: criticalCount > 0 ? 'critical' : 'success',
      },
      {
        id: 'data-mode',
        title: 'حالة القراءة الحالية',
        description: dataMode,
        tone: usesFallbackQueue ? 'warning' : 'info',
      },
      {
        id: 'click-budget',
        title: 'ميزانية النقر',
        description:
          'المسار الرئيسي، المؤشرات، والتنقل السريع ما يزالون ضمن نقرة واحدة أو اثنتين من هذه الشاشة.',
        tone: 'neutral',
      },
    ];
  }, [
    criticalCount,
    kpiSource,
    primaryAction.title,
    usesFallbackQueue,
    workSource,
  ]);

  const healthSignals = useMemo(() => {
    const updateStamp = workUpdatedAt || kpiUpdatedAt || lastRefreshAt;

    return [
      {
        id: 'queue-source',
        label: 'قائمة التنفيذ',
        detail: usesFallbackQueue
          ? 'تعمل في وضع مرجعي ذكي'
          : workSource === 'hybrid'
            ? 'مرتبطة جزئيًا بمصادر مباشرة'
            : 'مرتبطة بمصدر مباشر',
        status: usesFallbackQueue
          ? 'attention'
          : workSource === 'hybrid'
            ? 'attention'
            : 'stable',
      },
      {
        id: 'kpi-source',
        label: 'مؤشرات الأداء',
        detail: hasLiveKpis
          ? 'قراءة حية مفعلة'
          : 'قيم مرجعية منضبطة حتى اكتمال البيانات',
        status: hasLiveKpis ? 'stable' : 'attention',
      },
      {
        id: 'command-layer',
        label: 'طبقة الأوامر',
        detail: 'بحث وأوامر متاحان من الهيدر ونفس النظرة العامة.',
        status: 'stable',
      },
      {
        id: 'last-update',
        label: 'آخر تحديث',
        detail: updateStamp
          ? formatRelativeTime(updateStamp)
          : 'لم يتم جلب تحديث حي بعد',
        status: updateStamp ? 'stable' : 'attention',
      },
    ] as const;
  }, [
    hasLiveKpis,
    kpiUpdatedAt,
    lastRefreshAt,
    usesFallbackQueue,
    workSource,
    workUpdatedAt,
  ]);

  const alertItems = useMemo<OverviewAlertItem[]>(() => {
    const nextAlerts: OverviewAlertItem[] = [];

    if (criticalCount > 0) {
      nextAlerts.push({
        id: 'critical-pressure',
        title: 'ضغط حرج مفتوح الآن',
        description: `هناك ${criticalCount} عنصرًا حرِجًا يحتاج معالجة فورية من أعلى الشاشة.`,
        href: primaryAction.href,
        actionLabel: 'انتقل إلى المسار الحرج',
        tone: 'critical',
      });
    }

    if (usesFallbackQueue) {
      nextAlerts.push({
        id: 'fallback-active',
        title: 'الوضع المرجعي فعّال',
        description:
          'السطح ما يزال قابلاً للتنفيذ، لكن بعض الإشارات لا تعتمد على ربط حي كامل بعد.',
        href: '/operations',
        actionLabel: 'افتح العمليات',
        tone: 'warning',
      });
    }

    if (!hasLiveKpis) {
      nextAlerts.push({
        id: 'kpi-reference',
        title: 'شريط التركيز يستخدم قيمًا منضبطة',
        description:
          'المؤشرات العليا مستقرة بصريًا الآن، لكنها ستصبح أعمق فور اكتمال كل مصادر القراءة.',
        href: '/analytics/dsh-orders',
        actionLabel: 'افتح التحليلات',
        tone: 'info',
      });
    }

    if (visibleHardError) {
      nextAlerts.push({
        id: 'hard-error',
        title: 'يوجد خطأ يحتاج مراجعة',
        description: visibleHardError,
        tone: 'critical',
      });
    }

    if (nextAlerts.length === 0) {
      nextAlerts.push({
        id: 'all-clear',
        title: 'الوضع الحالي منخفض الضجيج',
        description:
          'لا توجد تنبيهات مرتفعة الآن، ويمكنك استئناف العمل من أي مساحة تشغيلية مباشرة.',
        tone: 'success',
      });
    }

    return nextAlerts.slice(0, 3);
  }, [
    criticalCount,
    hasLiveKpis,
    primaryAction.href,
    usesFallbackQueue,
    visibleHardError,
  ]);

  const lastUpdatedLabel = useMemo(() => {
    const stamp = workUpdatedAt || kpiUpdatedAt || lastRefreshAt;
    return stamp ? formatRelativeTime(stamp) : 'بدون تحديث حي';
  }, [kpiUpdatedAt, lastRefreshAt, workUpdatedAt]);

  const heroSignalCards = useMemo(
    () => [
      {
        id: 'pressure',
        icon: AlertTriangle,
        label: 'الضغط الحالي',
        value: criticalCount > 0 ? criticalCount : 'هادئ',
        detail:
          criticalCount > 0
            ? 'عناصر تحتاج قرارًا فوريًا من أعلى الصفحة.'
            : 'لا يوجد ضغط حرج مفتوح الآن.',
        tone: criticalCount > 0 ? ('critical' as const) : ('success' as const),
      },
      {
        id: 'route',
        icon: Target,
        label: 'أفضل مسار',
        value: primaryAction.owner,
        detail: `ابدأ من ${primaryAction.title} قبل التفرع إلى بقية المسارات.`,
        tone: criticalCount > 0 ? ('warning' as const) : ('info' as const),
      },
      {
        id: 'source',
        icon: ShieldCheck,
        label: 'نمط القراءة',
        value: surfaceModeValue,
        detail: 'المؤشرات ومركز الانتباه يلتزمان بمستوى الجاهزية الفعلي نفسه.',
        tone: surfaceModeTone,
      },
      {
        id: 'sync',
        icon: RefreshCw,
        label: 'آخر تحديث',
        value: lastUpdatedLabel,
        detail: 'آخر مزامنة مرئية لهذه الواجهة دون مغادرة السطح.',
        tone:
          lastUpdatedLabel === 'بدون تحديث حي'
            ? ('warning' as const)
            : ('neutral' as const),
      },
    ],
    [
      criticalCount,
      lastUpdatedLabel,
      primaryAction.owner,
      primaryAction.title,
      surfaceModeTone,
      surfaceModeValue,
    ]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsErrorDismissed(false);
    recordInteraction('overview:refresh', '/');

    try {
      await Promise.all([refetchWorkQueue(), refetchKpis()]);
      setLastRefreshAt(new Date().toISOString());
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
      <McpwOverviewRuntimeLayout
        isRTL={isRTL}
        isRefreshing={isRefreshing}
        selectedPeriodLabel={selectedPeriodLabel}
        surfaceModeLabel={surfaceModeLabel}
        surfaceModeValue={surfaceModeValue}
        surfaceModeTone={surfaceModeTone}
        lastUpdatedLabel={lastUpdatedLabel}
        period={period}
        periodOptions={PERIOD_OPTIONS}
        onPeriodChange={periodId => {
          setPeriod(periodId as (typeof PERIOD_OPTIONS)[number]['id']);
          recordInteraction('overview:period-filter', periodId);
        }}
        onOpenCommandPalette={() => {
          openCommandPalette();
          recordInteraction('overview:command-open', 'command-palette');
        }}
        onRefresh={() => {
          void handleRefresh();
        }}
        primaryAction={primaryAction}
        criticalCount={criticalCount}
        heroSignalCards={heroSignalCards}
        overviewInsights={overviewInsights}
        healthSignals={[...healthSignals]}
        visibleHardError={visibleHardError}
        onDismissError={() => setIsErrorDismissed(true)}
        usesFallbackQueue={usesFallbackQueue}
        locale={locale}
        kpiCards={kpiCards}
        isKpisLoading={isKpisLoading}
        actionItems={actionItems}
        isWorkLoading={isWorkLoading}
        alertItems={alertItems}
        workspaceCards={WORKSPACE_CARDS}
        activityItems={activityItems}
        onNavigate={recordInteraction}
      />
    </>
  );
}

