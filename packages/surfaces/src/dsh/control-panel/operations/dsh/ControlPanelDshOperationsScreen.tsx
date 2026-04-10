'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthStateView, BthText } from '@bthwani/ui-kit';
import {
  BthWebCommandCenterFrame,
  BthWebMissionHeroCard,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';

type ControlPanelDshOperationsScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type DshWorkbenchId =
  | 'overview'
  | 'orders'
  | 'reassign'
  | 'peak-mode'
  | 'zone-set'
  | 'sheinproxy'
  | 'arrival-bell';

type TopFilterId = 'today' | 'queue' | 'peak';

type DshWorkbench = {
  id: DshWorkbenchId;
  label: string;
  description: string;
  routeHint: string;
  statusLabel: string;
  liveHref?: string;
};

const topFilterItems = [
  { id: 'today', label: 'اليوم' },
  { id: 'queue', label: 'الطابور' },
  { id: 'peak', label: 'الذروة' },
] as const;

const dshWorkbenches = [
  {
    id: 'overview',
    label: 'نظرة DSH',
    description: 'لقطة أولى للحالة والانتقالات الآمنة قبل الدخول في أي route فرعي.',
    routeHint: '/operations/dsh',
    statusLabel: 'حي',
  },
  {
    id: 'orders',
    label: 'إدارة الطلبات',
    description: 'الطابور المركزي للطلبات والتفاصيل المرتبطة بها.',
    routeHint: '/operations/dsh/orders',
    statusLabel: 'حي',
    liveHref: '/operations/dsh/orders',
  },
  {
    id: 'reassign',
    label: 'إعادة التوزيع',
    description: 'تحويل الطلبات بين الموارد المتاحة بدون كسر المسار الحالي.',
    routeHint: '/operations/dsh/reassign',
    statusLabel: 'حي',
    liveHref: '/operations/dsh/reassign',
  },
  {
    id: 'peak-mode',
    label: 'وضع الذروة',
    description: 'تشغيل مرن عندما ترتفع الحركة وتحتاج سعة إضافية.',
    routeHint: '/operations/dsh/peak-mode',
    statusLabel: 'حي',
    liveHref: '/operations/dsh/peak-mode',
  },
  {
    id: 'zone-set',
    label: 'نطاق التوصيل',
    description: 'تقييد النطاقات وتشغيلها بوضوح تشغيلي أعلى.',
    routeHint: '/operations/dsh/zone-set',
    statusLabel: 'قيد الربط',
  },
  {
    id: 'sheinproxy',
    label: 'SheinProxy',
    description: 'مسار الوساطة والطلبات الخاصة بعرض proxy DSH.',
    routeHint: '/operations/dsh/sheinproxy',
    statusLabel: 'قيد الربط',
  },
  {
    id: 'arrival-bell',
    label: 'جرس الوصول',
    description: 'إعدادات الوصول والتنبيهات الحية عند الاقتراب من التسليم.',
    routeHint: '/operations/dsh/arrival-bell',
    statusLabel: 'حي',
    liveHref: '/operations/dsh/arrival-bell',
  },
] as const satisfies ReadonlyArray<DshWorkbench>;

function resolveTopFilterWorkbench(filterId: TopFilterId): DshWorkbenchId {
  if (filterId === 'queue') {
    return 'orders';
  }

  if (filterId === 'peak') {
    return 'peak-mode';
  }

  return 'overview';
}

function resolveWorkbenchLiveHref(workbenchId: DshWorkbenchId) {
  if (workbenchId === 'orders') {
    return '/operations/dsh/orders';
  }

  if (workbenchId === 'reassign') {
    return '/operations/dsh/reassign';
  }

  if (workbenchId === 'peak-mode') {
    return '/operations/dsh/peak-mode';
  }

  if (workbenchId === 'arrival-bell') {
    return '/operations/dsh/arrival-bell';
  }

  return undefined;
}

function resolveStateCopy(state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'جار تجهيز سطح DSH',
      description: 'الهيكل مرئي الآن، وسيبقى المسار محفوظًا حتى تكتمل البيانات أو الروابط التالية.',
      actionLabel: 'العودة إلى العمليات',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد عناصر مفعلة بعد',
      description: 'هذا slice ما يزال في وضع baseline، ويمكنك الرجوع إلى العمليات العامة أو إعادة البناء في slice لاحق.',
      actionLabel: 'العودة إلى العمليات',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح مؤقتًا',
      description: 'السطح يبقى واضحًا، لكن تفعيل child routes مؤجل حتى تعود الشبكة أو يكتمل الربط.',
      actionLabel: 'العودة إلى العمليات',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'المسار غير مفعّل بعد',
      description: 'هذا الهبوط محفوظ كجزء من خطة wave لكنه لا يفتح child routes قبل slice الربط التالي.',
      actionLabel: 'العودة إلى العمليات',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل سطح DSH',
    description: 'يمكنك العودة إلى المسار الآمن أو إعادة المحاولة بعد تثبيت البيئة الحالية.',
    actionLabel: 'إعادة المحاولة',
  };
}

function resolveWorkbenchTitle(workbench: DshWorkbench) {
  return workbench.id === 'overview' ? 'مركز تشغيل DSH' : `${workbench.label} DSH`;
}

function resolveWorkbenchSubtitle(workbench: DshWorkbench, filterLabel: string, languageChip: 'AR' | 'EN') {
  if (languageChip === 'EN') {
    return `${workbench.description} The current slice stays honest: only the safe routes are live for now.`;
  }

  return `${workbench.description} هذا slice يبقى صريحًا: ${filterLabel} هو السياق الحالي، والمسارات الآمنة فقط هي المفعلة الآن ضمن واجهة القيادة.`;
}

function renderStateView(
  state: Exclude<ControlPanelDshOperationsScreenState, 'ready'>,
  onActionPress: () => void,
) {
  const stateCopy = resolveStateCopy(state);

  return (
    <BthStateView
      {...stateCopy}
      onActionPress={onActionPress}
    />
  );
}

export type ControlPanelDshOperationsScreenProps = {
  state?: ControlPanelDshOperationsScreenState;
  fallbackHref?: string;
};

export function ControlPanelDshOperationsScreen({
  state = 'ready',
  fallbackHref = '/operations',
}: ControlPanelDshOperationsScreenProps) {
  const router = useRouter();
  const [activeFilterId, setActiveFilterId] = React.useState<TopFilterId>('today');
  const [activeWorkbenchId, setActiveWorkbenchId] = React.useState<DshWorkbenchId>('overview');
  const [languageChip, setLanguageChip] = React.useState<'AR' | 'EN'>('AR');
  const [refreshCount, setRefreshCount] = React.useState(1);
  const [alertCount, setAlertCount] = React.useState(1);

  const activeWorkbench = dshWorkbenches.find((item) => item.id === activeWorkbenchId) ?? dshWorkbenches[0];
  const activeFilter = topFilterItems.find((item) => item.id === activeFilterId) ?? topFilterItems[0];
  const plannedWorkbenches = dshWorkbenches.filter((item) => item.id !== 'overview');
  const topFilters = topFilterItems.map((item) => ({
    ...item,
    active: item.id === activeFilterId,
  }));
  const railItems = dshWorkbenches.map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description,
    active: item.id === activeWorkbenchId,
    badge: item.id === 'overview' ? 'حي' : item.id === 'orders' || item.id === 'arrival-bell' || item.id === 'reassign' || item.id === 'peak-mode' ? 'مباشر' : 'مخطط',
  }));
  const readyForSelection = state === 'ready';

  const heroTitle = resolveWorkbenchTitle(activeWorkbench);
  const heroSubtitle = resolveWorkbenchSubtitle(activeWorkbench, activeFilter.label, languageChip);

  const handleTopFilterSelect = (filterId: string) => {
    const matchedFilter = topFilterItems.find((item) => item.id === filterId);

    if (!matchedFilter) {
      return;
    }

    setActiveFilterId(matchedFilter.id);
    setActiveWorkbenchId(resolveTopFilterWorkbench(matchedFilter.id));
  };

  const handleRailSelect = (workbenchId: string) => {
    const matchedWorkbench = dshWorkbenches.find((item) => item.id === workbenchId);

    if (!matchedWorkbench) {
      return;
    }

    setActiveWorkbenchId(matchedWorkbench.id);

    const liveHref = resolveWorkbenchLiveHref(matchedWorkbench.id);

    if (liveHref) {
      router.push(liveHref);
      return;
    }

    if (matchedWorkbench.id === 'orders' || matchedWorkbench.id === 'sheinproxy') {
      setActiveFilterId('queue');
    } else if (matchedWorkbench.id === 'peak-mode') {
      setActiveFilterId('peak');
    } else {
      setActiveFilterId('today');
    }
  };

  const handleBrandClick = () => {
    router.push('/dashboard');
  };

  const handleSearchClick = () => {
    setActiveFilterId('queue');
    setActiveWorkbenchId('orders');
  };

  const handleRefreshClick = () => {
    setRefreshCount((previousValue) => previousValue + 1);
  };

  const handleLanguageClick = () => {
    setLanguageChip((previousValue) => (previousValue === 'AR' ? 'EN' : 'AR'));
  };

  const handleAlertClick = () => {
    setAlertCount(0);
    setActiveFilterId('queue');
    setActiveWorkbenchId('sheinproxy');
  };

  const stageContent = readyForSelection ? (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[
          `/operations/dsh`,
          `الفترة: ${activeFilter.label}`,
          `اللغة: ${languageChip}`,
        ]}
        eyebrow="الهبوط الرئيسي"
        title={heroTitle}
        description={heroSubtitle}
        metaItems={[
          `المسار الآمن: ${fallbackHref}`,
          `المسارات المخططة: ${plannedWorkbenches.length}`,
          `آخر تحديث مرئي: ${refreshCount}`,
        ]}
        primaryAction={{ label: 'افتح العمليات العامة', href: fallbackHref }}
        secondaryAction={{ label: 'لوحة التحكم', href: '/dashboard' }}
      />

      <BthBox gap={2}>
        <BthWebSignalCard
          title="المجال المختار"
          value={activeWorkbench.label}
          description="التبديل داخل هذا hub يبقى محليًا حتى تكتمل روابط child routes لاحقًا."
          tone="best"
        />
        <BthWebSignalCard
          title="المسارات المخططة"
          value={String(plannedWorkbenches.length)}
          description="هذه الروابط موثقة الآن لكنها ليست مفعلة بعد لتجنب أي navigation كاذب."
        />
        <BthWebSignalCard
          title="الانتقال الآمن"
          value={fallbackHref}
          description="الرجوع إلى العمليات العامة هو الخروج الوحيد الحي في هذا slice."
        />
        <BthWebSignalCard
          title="التنبيهات النشطة"
          value={String(alertCount)}
          description="مؤشر مرئي بسيط يحافظ على وجود feedback واضح دون إدخال state runtime مبكر."
        />
      </BthBox>

      <BthWebSectionCard
        title="المسارات المخططة"
        description="كل عنصر هنا يعرّف route لاحقًا، لكنه يبقى غير قابل للنقر حتى لا يتحول هذا slice إلى وعد غير مكتمل."
      >
        <BthBox gap={2}>
          {plannedWorkbenches.map((workbench) => (
            <BthBox
              key={workbench.id}
              padding={3}
              gap={1}
              border
              radiusToken="xl"
              background="surfaceRaised"
            >
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{workbench.label}</BthText>
                <BthText role="caption" tone="brand">
                  {workbench.statusLabel}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {workbench.routeHint}
              </BthText>
              <BthText role="caption" tone="soft">
                {workbench.description}
              </BthText>
              {workbench.id === 'orders' || workbench.id === 'arrival-bell' || workbench.id === 'reassign' || workbench.id === 'peak-mode' ? (
                <BthButton
                  label={workbench.id === 'orders' ? 'افتح الطلبات' : workbench.id === 'arrival-bell' ? 'افتح جرس الوصول' : workbench.id === 'reassign' ? 'افتح إعادة التوزيع' : 'افتح وضع الذروة'}
                  tone="primary"
                  size="sm"
                  fullWidth={false}
                  onPress={() =>
                    router.push(
                      resolveWorkbenchLiveHref(workbench.id) ??
                        (workbench.id === 'arrival-bell'
                          ? '/operations/dsh/arrival-bell'
                          : workbench.id === 'reassign'
                            ? '/operations/dsh/reassign'
                            : workbench.id === 'peak-mode'
                              ? '/operations/dsh/peak-mode'
                            : '/operations/dsh/orders'),
                    )
                  }
                />
              ) : null}
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard
        title="حراسة الانتقال"
        description="السطح الحالي صريح: لا يوجد child navigation مكسور، ولا روابط نصف جاهزة، ولا انتقالات runtime مخفية."
      >
        <BthBox gap={2}>
          <BthBox
            padding={3}
            gap={1}
            border
            radiusToken="xl"
            background="surfaceRaised"
          >
            <BthText role="bodyStrong">المسار الحالي</BthText>
            <BthText role="bodySm" tone="muted">
              /operations/dsh
            </BthText>
          </BthBox>
          <BthBox
            padding={3}
            gap={1}
            border
            radiusToken="xl"
            background="surfaceRaised"
          >
            <BthText role="bodyStrong">الرجوع الآمن</BthText>
            <BthText role="bodySm" tone="muted">
              {fallbackHref}
            </BthText>
          </BthBox>
          <BthBox
            padding={3}
            gap={1}
            border
            radiusToken="xl"
            background="surfaceRaised"
          >
            <BthText role="bodyStrong">القياس المرئي</BthText>
            <BthText role="bodySm" tone="muted">
              تحديثات {refreshCount} · تنبيهات {alertCount} · لغة {languageChip}
            </BthText>
          </BthBox>
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  ) : (
    renderStateView(state, () => {
      router.push(fallbackHref);
    })
  );

  return (
    <BthWebCommandCenterFrame
      brandLabel="لوحة التحكم"
      surfaceTitle={readyForSelection ? heroTitle : 'مركز تشغيل DSH'}
      surfaceSubtitle={readyForSelection ? heroSubtitle : 'السطح غير جاهز بعد لكن مسار الرجوع الآمن يبقى واضحًا.'}
      topFilters={topFilters}
      onTopFilterSelect={readyForSelection ? handleTopFilterSelect : undefined}
      onBrandClick={handleBrandClick}
      onSearchClick={readyForSelection ? handleSearchClick : undefined}
      onRefreshClick={readyForSelection ? handleRefreshClick : undefined}
      onLanguageClick={readyForSelection ? handleLanguageClick : undefined}
      onAlertClick={readyForSelection ? handleAlertClick : undefined}
      railTitle="DSH"
      railStatusLabel={readyForSelection ? 'مرحلة أولى' : state}
      railItems={railItems}
      onRailItemSelect={readyForSelection ? handleRailSelect : undefined}
      railSupplementary={
        <BthWebSectionCard
          title="حارس المسار"
          description="السطح لا يفتح child routes قبل تثبيتها، لذلك يبقى الخروج الوحيد الحي واضحًا وآمنًا."
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">المسار الحالي</BthText>
              <BthText role="bodySm" tone="muted">
                /operations/dsh
              </BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الخروج الآمن</BthText>
              <BthText role="bodySm" tone="muted">
                {fallbackHref}
              </BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>
      }
    >
      {stageContent}
    </BthWebCommandCenterFrame>
  );
}

export function DshOperationsHubSurface(props: ControlPanelDshOperationsScreenProps = {}) {
  return <ControlPanelDshOperationsScreen {...props} />;
}

export default ControlPanelDshOperationsScreen;