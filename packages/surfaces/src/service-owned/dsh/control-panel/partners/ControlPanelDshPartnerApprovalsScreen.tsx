'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSegmentedTabs, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../shared';
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

function QueueCard({
  item,
  active,
  onSelect,
}: {
  item: DshPartnerIntakeItem;
  active: boolean;
  onSelect: () => void;
}) {
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
  catalogHref = '/operations?workspace=catalogs',
  marketingHref = '/operations?workspace=marketing',
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
