'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebControlDisclosureItem, WebMissionHeroCard, WebSectionCard, WebSegmentedTabs, WebSignalCard } from '@bthwani/ui-kit/web';
import { getCanonicalPreviewProductCard, getCanonicalPreviewStoreCard } from '../../shared/catalog/dshStoreProductCardModel';
import { ControlPanelDshDecisionBoard } from '../shared';
import { DshPartnerPromotionEligibilityScreen } from './DshPartnerPromotionEligibilityScreen';
import { dshPartnerApprovalLanes, dshPartnerIntakeItems, dshPartnerIntakeMetrics, type DshPartnerIntakeItem, type DshPartnerIntakeQueue } from './workflow';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshPartnerApprovalsScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  catalogHref?: string;
  marketingHref?: string;
};

function resolveQueueLabel(queue: DshPartnerIntakeQueue) {
  if (queue === 'offer-approval') return 'اعتماد العرض';
  if (queue === 'partner-review') return 'Partner Review';
  return 'جاهز للتسويق';
}

function resolveQueueTone(queue: DshPartnerIntakeQueue): 'warning' | 'info' | 'success' {
  if (queue === 'offer-approval') return 'warning';
  if (queue === 'partner-review') return 'info';
  return 'success';
}

function resolveSourceLabel(source: DshPartnerIntakeItem['source']) {
  return source === 'app-field' ? 'app-field' : 'app-partner';
}

function resolveCanonicalSourceLabel(source: DshPartnerIntakeItem['canonicalSource']) {
  if (!source) return 'source TBD';
  if (source === 'control-panel-partners') return 'partners';
  return source;
}

function resolveCanonicalStageLabel(stage: DshPartnerIntakeItem['canonicalStage'] | string | undefined) {
  if (!stage) return 'stage TBD';
  if (stage === 'field-draft') return 'field-draft';
  if (stage === 'field-submitted') return 'field-submitted';
  if (stage === 'partner-review') return 'partner-review';
  if (stage === 'marketing-review') return 'marketing-review';
  return 'published-preview';
}

function resolvePrimaryActionLabel(queue: DshPartnerIntakeQueue) {
  if (queue === 'offer-approval') return 'العودة للعمليات';
  if (queue === 'partner-review') return 'افتح الكتالوج';
  return 'فتح التسويق';
}

function resolveSecondaryActionLabel(queue: DshPartnerIntakeQueue) {
  if (queue === 'offer-approval') return 'افتح الكتالوج';
  if (queue === 'partner-review') return 'افتح التسويق';
  return 'العودة للعمليات';
}

type PartnerSurfaceLane = {
  id: string;
  title: string;
  sourceLabel: string;
  reviewLabel: string;
  downstreamLabel: string;
  downstreamHref: string;
  description: string;
  badgeLabel: string;
};

const partnerSurfaceLanes: readonly PartnerSurfaceLane[] = [
  {
    id: 'partner-entry',
    title: 'مدخل الشريك والوثائق',
    sourceLabel: 'app-partner entry + doc-upload + intake-start + store-nomination + video-upload',
    reviewLabel: 'يمر أولًا عبر partners لالتقاط الطلب والملف قبل أي اعتماد لاحق.',
    downstreamLabel: 'العمليات',
    downstreamHref: '/operations',
    description: 'كل مسار إدخال أو ملف هوية أو فيديو أو ترشيح متجر يدخل من هنا قبل أن يُفكك إلى قرار تشغيلي.',
    badgeLabel: 'Onboarding',
  },
  {
    id: 'partner-orders',
    title: 'الطلبات والتسليم',
    sourceLabel: 'app-partner orders + order-chat + order-alerts + order-sla-risk',
    reviewLabel: 'شركاء يتحكمون في قبول الطلبات وتغيير الحالة قبل تمريرها للسطح التشغيلي.',
    downstreamLabel: 'العمليات',
    downstreamHref: '/operations',
    description: 'الطلبات، الحوارات، والتنبيهات لا تخرج مباشرة من التطبيق إلى السطح النهائي؛ يجب أن تمر عبر لوحة الشركاء أولًا.',
    badgeLabel: 'Orders',
  },
  {
    id: 'partner-operations',
    title: 'العمليات والفريق',
    sourceLabel: 'app-partner operations + profile + type-switch',
    reviewLabel: 'تثبيت حالة المتجر، الفريق، ومناطق التغطية قبل تفعيل أي تغيير تشغيلي.',
    downstreamLabel: 'العمليات',
    downstreamHref: '/operations',
    description: 'الملف التشغيلي، التغطية، والحالة التشغيلية تُراجع هنا ثم تنطلق إلى سطح التشغيل المناسب.',
    badgeLabel: 'Operations',
  },
  {
    id: 'partner-inventory',
    title: 'المخزون والكتالوج',
    sourceLabel: 'app-partner inventory + items-upsert + inventory-adjust + inventory-update',
    reviewLabel: 'أي إضافة أو تعديل في المخزون يمر من partners قبل الكتالوج النهائي.',
    downstreamLabel: 'الكتالوجات',
    downstreamHref: '/catalogs',
    description: 'تحديثات المخزون والمنتجات لا تُعامل كحقيقة نهائية حتى تعبر هذه البوابة.',
    badgeLabel: 'Catalog',
  },
  {
    id: 'partner-finance',
    title: 'المحفظة والتسويات',
    sourceLabel: 'app-partner wallet + partner-finance-bridge + partner-settlement-summary + partner-commission-summary',
    reviewLabel: 'كل حركة مالية أو تسوية تمر هنا قبل أن تُعرض في المسار المالي المعني.',
    downstreamLabel: 'المالية',
    downstreamHref: '/finance',
    description: 'المستحقات، التسويات، والعمولات تُراجع داخل partners ثم تنتقل للمركز المالي.',
    badgeLabel: 'Finance',
  },
  {
    id: 'partner-growth',
    title: 'النمو والتسويق',
    sourceLabel: 'app-partner analytics + promotion intent + featured requests',
    reviewLabel: 'العرض أو البانر أو النية الترويجية لا تُرسل مباشرة للتسويق دون أهلية.',
    downstreamLabel: 'التسويق',
    downstreamHref: '/marketing',
    description: 'العروض والظهور والعناصر القابلة للترويج تمر هنا أولًا ثم تتجه إلى التسويق عند الجاهزية.',
    badgeLabel: 'Marketing',
  },
  {
    id: 'partner-settings',
    title: 'الإعدادات وتبديل النوع',
    sourceLabel: 'app-partner settings + notifications + language + service-type switch',
    reviewLabel: 'الإعدادات والسلوك التشغيلي تُراجع هنا قبل فتح السطح الإداري أو التقني.',
    downstreamLabel: 'المنصة',
    downstreamHref: '/platform',
    description: 'تغييرات التفضيلات والتنبيهات ونوع الخدمة تبقى داخل partners حتى تُوجَّه للمنصة المعنية.',
    badgeLabel: 'Settings',
  },
  {
    id: 'partner-support',
    title: 'الإشارات والاعتراضات',
    sourceLabel: 'order-issue-queue + support handoff + exceptions',
    reviewLabel: 'أي طلب أو مشكلة تخرج من الشريك يجب أن تُؤرخ هنا قبل التصعيد.',
    downstreamLabel: 'الدعم',
    downstreamHref: '/support',
    description: 'الاعتراضات والتنبيهات ومشاكل الطلبات لا تنتقل مباشرة للدعم دون مرور partners كمرجع قرار.',
    badgeLabel: 'Support',
  },
] as const;

function PartnerSurfaceLaneCard({
  lane,
  hubHref,
  onOpenDownstream,
}: {
  lane: PartnerSurfaceLane;
  hubHref: string;
  onOpenDownstream: (href: string) => void;
}) {
  return (
    <WebSectionCard title={lane.title} description={lane.description}>
      <Box gap={3}>
        <Text role="bodySm" tone="muted">
          {lane.sourceLabel}
        </Text>
        <Text role="bodySm">
          {lane.reviewLabel}
        </Text>

        <WebControlDisclosureItem
          id={lane.id}
          label="المرور الحاكم"
          description={lane.reviewLabel}
          badge={lane.badgeLabel}
          onAction={() => onOpenDownstream(lane.downstreamHref)}
        />

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label={`افتح ${lane.downstreamLabel}`} tone="secondary" fullWidth={false} onPress={() => onOpenDownstream(lane.downstreamHref)} />
          <Button label="ابق في partners" tone="ghost" fullWidth={false} onPress={() => onOpenDownstream(hubHref)} />
        </Box>
      </Box>
    </WebSectionCard>
  );
}

function QueueCard({
  item,
  active,
  onSelect,
}: {
  item: DshPartnerIntakeItem;
  active: boolean;
  onSelect: () => void;
}) {
  const canonicalStore = item.canonicalStoreId ? getCanonicalPreviewStoreCard(item.canonicalStoreId) : undefined;
  const canonicalProduct = item.canonicalProductId ? getCanonicalPreviewProductCard(item.canonicalProductId) : undefined;
  const previewStoreLabel = canonicalStore?.storeName ?? '[TBD]';
  const previewStage = canonicalStore?.publishStage ?? canonicalProduct?.publishStage ?? item.canonicalStage;
  const previewSource = canonicalStore?.source ?? canonicalProduct?.source ?? item.canonicalSource;
  const previewMeta = [
    resolveCanonicalStageLabel(previewStage),
    canonicalProduct?.name,
    canonicalProduct?.priceLabel,
    resolveCanonicalSourceLabel(previewSource),
  ].filter(Boolean).join(' · ');

  return (
    <Box padding={3} gap={2} border radiusToken="xl" background="surfaceRaised" style={{ borderColor: active ? 'rgba(255, 80, 13, 0.35)' : undefined }}>
      <Box layoutDirection="row" justify="space-between" align="center">
        <Text role="bodyStrong">{item.storeName}</Text>
        <Text role="caption" tone={resolveQueueTone(item.queue)}>
          {item.fieldStatusLabel}
        </Text>
      </Box>

      <Text role="bodySm" tone="muted">
        {item.categoryLabel} · {item.ownerLabel} · {item.submittedAt} · {resolveSourceLabel(item.source)}
      </Text>

      <Text role="bodySm" tone="muted">
        {item.note}
      </Text>

      <Text role="caption" tone="soft">
        {`canonical: ${previewStoreLabel}`}
      </Text>

      <Text role="caption" tone="soft">
        {previewMeta || 'canonical: [TBD]'}
      </Text>

      <Text role="bodySm">{item.nextStep}</Text>

      <Box>
        <Button label={active ? 'التفاصيل مفتوحة' : 'فتح التفاصيل'} tone={active ? 'secondary' : 'ghost'} fullWidth={false} onPress={onSelect} />
      </Box>
    </Box>
  );
}

export function ControlPanelDshPartnerApprovalsScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  catalogHref = '/catalogs',
  marketingHref = '/marketing',
}: ControlPanelDshPartnerApprovalsScreenProps) {
  const router = useRouter();
  const queueItems = React.useMemo(() => ({
    'offer-approval': dshPartnerIntakeItems.filter((item) => item.queue === 'offer-approval'),
    'partner-review': dshPartnerIntakeItems.filter((item) => item.queue === 'partner-review'),
    'marketing-review': dshPartnerIntakeItems.filter((item) => item.queue === 'marketing-review'),
  }), []);
  const [activeQueue, setActiveQueue] = React.useState<DshPartnerIntakeQueue>('offer-approval');
  const [selectedItemId, setSelectedItemId] = React.useState<string>(queueItems['offer-approval'][0]?.id ?? '');

  const activeItems = queueItems[activeQueue];
  const selectedItem = activeItems.find((item) => item.id === selectedItemId) ?? activeItems[0] ?? queueItems['offer-approval'][0];
  const decisionState = selectedItem ?? activeItems[0];

  React.useEffect(() => {
    if (!activeItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(activeItems[0]?.id ?? '');
    }
  }, [activeItems, selectedItemId]);

  const queueTabs = [
    { id: 'offer-approval', label: 'اعتماد العرض', metaLabel: String(queueItems['offer-approval'].length), active: activeQueue === 'offer-approval' },
    { id: 'partner-review', label: 'مراجعة الشريك', metaLabel: String(queueItems['partner-review'].length), active: activeQueue === 'partner-review' },
    { id: 'marketing-review', label: 'جاهز للتسويق', metaLabel: String(queueItems['marketing-review'].length), active: activeQueue === 'marketing-review' },
  ] as const;

  const handlePrimaryAction = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.queue === 'offer-approval') {
      router.push(operationsHref);
      return;
    }

    if (selectedItem.queue === 'partner-review') {
      router.push(catalogHref);
      return;
    }

    if (selectedItem.queue === 'marketing-review') {
      router.push(marketingHref);
    }
  };

  const handleSecondaryAction = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.queue === 'offer-approval') {
      router.push(catalogHref);
      return;
    }

    if (selectedItem.queue === 'partner-review') {
      router.push(marketingHref);
      return;
    }

    if (selectedItem.queue === 'marketing-review') {
      router.push(operationsHref);
    }
  };

  return (
    <Box gap={4}>
      <ControlPanelDshDecisionBoard
        title="Partner approval board"
        purpose="Keep partner intake, document readiness, and handoff routes in one place."
        primaryDecision={decisionState ? resolvePrimaryActionLabel(decisionState.queue) : 'Review partner intake'}
        nextAction={decisionState ? resolveSecondaryActionLabel(decisionState.queue) : 'Open the active queue'}
        blockers={decisionState ? decisionState.note : 'No active partner item selected.'}
        ownerSurface="partners"
        evidenceHint="partner intake record, queue state, and handoff proof"
        routeHint={decisionState ? (decisionState.queue === 'offer-approval' ? operationsHref : decisionState.queue === 'partner-review' ? catalogHref : marketingHref) : operationsHref}
        decisionTone={decisionState?.queue === 'offer-approval' ? 'warning' : decisionState?.queue === 'marketing-review' ? 'best' : 'brand'}
      />

      <WebMissionHeroCard
        badges={['DSH', 'Partners', 'Field Intake']}
        eyebrow="بوابة الشركاء"
        title="طلبات الميدان التي تحتاج قرار الشركاء"
        description="غرفة قرار واحدة لطلبات الشركاء: اختر queue، راجع العنصر، ثم نفّذ الإجراء الأساسي من نفس الصفحة بدون التنقل بين أقسام طويلة."
        metaItems={dshPartnerIntakeMetrics.map((metric) => `${metric.label}: ${metric.value}`)}
        primaryAction={{ label: 'افتح التسويق', href: marketingHref }}
        secondaryAction={{ label: 'افتح الكتالوج', href: catalogHref }}
      />

      <Box gap={2}>
        {dshPartnerIntakeMetrics.map((metric, index) => (
          <WebSignalCard
            key={metric.id}
            title={metric.label}
            value={String(metric.value)}
            description={metric.description}
            tone={index === 0 ? 'best' : undefined}
          />
        ))}
      </Box>

      <WebSectionCard
        title="بوابة مسارات app-partner"
        description="كل ما يخرج من app-partner يمر من partners أولًا ثم ينتقل إلى السطح النهائي بعد قرار الحوكمة المناسب."
      >
        <Box gap={3}>
          {partnerSurfaceLanes.map((lane) => (
            <PartnerSurfaceLaneCard
              key={lane.id}
              lane={lane}
              hubHref={hubHref}
              onOpenDownstream={(href) => router.push(href)}
            />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="قائمة القرار" description="اختر queue واحدة فقط، ثم افتح العنصر المطلوب من نفس السياق دون تمرير طويل.">
        <Box gap={3}>
          <WebSegmentedTabs
            ariaLabel="قوائم قرارات الشركاء"
            items={queueTabs}
            onSelect={(queueId) => {
              const nextQueue = queueId as DshPartnerIntakeQueue;
              setActiveQueue(nextQueue);
              setSelectedItemId(queueItems[nextQueue][0]?.id ?? '');
            }}
          />

          <div className={styles.partnersDecisionGrid}>
            <div className={styles.partnersQueueList}>
              {activeItems.map((item) => (
                <QueueCard
                  key={item.id}
                  item={item}
                  active={item.id === selectedItem?.id}
                  onSelect={() => setSelectedItemId(item.id)}
                />
              ))}
            </div>

            <div className={styles.partnersDecisionPanel}>
              <Box padding={3} gap={3} border radiusToken="xl" background="surfaceRaised">
                {selectedItem ? (
                  <>
                    <Box gap={1}>
                      <Text role="bodyStrong">{selectedItem.storeName}</Text>
                      <Text role="bodySm" tone="muted">
                        {resolveQueueLabel(selectedItem.queue)} · {selectedItem.categoryLabel} · {selectedItem.ownerLabel}
                      </Text>
                    </Box>

                    <Box gap={1}>
                      <Text role="bodySm">{selectedItem.note}</Text>
                      <Text role="bodySm" tone="muted">{selectedItem.nextStep}</Text>
                      <Text role="caption" tone="soft">{selectedItem.submittedAt} · {resolveSourceLabel(selectedItem.source)}</Text>
                    </Box>

                    <Box gap={2}>
                      <Button label={resolvePrimaryActionLabel(selectedItem.queue)} tone="primary" onPress={handlePrimaryAction} />
                      <Button label={resolveSecondaryActionLabel(selectedItem.queue)} tone="secondary" onPress={handleSecondaryAction} />
                      <Button label="فتح التسويق" tone="ghost" onPress={() => router.push(marketingHref)} />
                    </Box>
                  </>
                ) : (
                  <Text role="bodySm" tone="muted">لا توجد عناصر في هذه queue حاليًا.</Text>
                )}
              </Box>
            </div>
          </div>
        </Box>
      </WebSectionCard>

      <WebSectionCard title="سلسلة الموافقة" description="المسار الحاكم يبقى ظاهرًا كمرجع مختصر بدل توزيعه على عدة sections طويلة.">
        <Box gap={2}>
          {dshPartnerApprovalLanes.map((lane) => (
            <Box key={lane.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{lane.title}</Text>
              <Text role="bodySm" tone="muted">
                {lane.description}
              </Text>
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="أهلية الترويج" description="أهلية الشريك والمتجر قبل تمرير أي عرض إلى التسويق أو البانر النهائي.">
        <DshPartnerPromotionEligibilityScreen marketingHref={marketingHref} catalogHref={catalogHref} />
      </WebSectionCard>

      <WebSectionCard title="المسارات الحية" description="إبقاء العمليات والكتالوج والتسويق في نقرة واحدة دون تكرار CTA داخل كل بطاقة.">
        <Box gap={2}>
          <Button label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <Button label="افتح التسويق" tone="secondary" onPress={() => router.push(marketingHref)} />
          <Button label="افتح الكتالوج" tone="ghost" onPress={() => router.push(catalogHref)} />
        </Box>
      </WebSectionCard>

      <Button label="العودة إلى hub" tone="ghost" onPress={() => router.push(hubHref)} />
    </Box>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
