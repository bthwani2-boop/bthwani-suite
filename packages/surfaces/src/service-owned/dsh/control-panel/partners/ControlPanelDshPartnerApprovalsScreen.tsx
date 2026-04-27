'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { dshPartnerApprovalLanes, dshPartnerIntakeItems, dshPartnerIntakeMetrics, type DshPartnerIntakeItem, type DshPartnerIntakeQueue } from './workflow';

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

function QueueCard({ item, marketingHref }: { item: DshPartnerIntakeItem; marketingHref: string }) {
  return (
    <Box padding={3} gap={2} border radiusToken="xl" background="surfaceRaised">
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

      <Box layoutDirection="row" gap={2} wrap="wrap">
        {item.queue === 'offer-approval' ? (
          <>
            <Button label="اعتماد العرض" tone="secondary" fullWidth={false} onPress={() => undefined} />
            <Button label="رفض" tone="ghost" fullWidth={false} onPress={() => undefined} />
            <Button label="تعديل العرض [TBD]" tone="ghost" fullWidth={false} onPress={() => undefined} />
          </>
        ) : null}

        {item.queue === 'partner-review' ? (
          <>
            <Button label="اعتماد الشريك" tone="secondary" fullWidth={false} onPress={() => undefined} />
            <Button label="إرجاع للميداني" tone="ghost" fullWidth={false} onPress={() => undefined} />
            <Button label="فتح التسويق" tone="ghost" fullWidth={false} onPress={() => window.location.assign(marketingHref)} />
          </>
        ) : null}

        {item.queue === 'marketing-review' ? (
          <Button label="المراجعة النهائية [TBD]" tone="secondary" fullWidth={false} onPress={() => window.location.assign(marketingHref)} />
        ) : null}
      </Box>
    </Box>
  );
}

export function ControlPanelDshPartnerApprovalsScreen({
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  catalogHref = '/operations/dsh/catalogs',
  marketingHref = '/operations/dsh/marketing',
}: ControlPanelDshPartnerApprovalsScreenProps) {
  const router = useRouter();
  const offerApprovalItems = dshPartnerIntakeItems.filter((item) => item.queue === 'offer-approval');
  const partnerReviewItems = dshPartnerIntakeItems.filter((item) => item.queue === 'partner-review');
  const marketingReviewItems = dshPartnerIntakeItems.filter((item) => item.queue === 'marketing-review');

  return (
    <Box gap={4}>
      <WebMissionHeroCard
        badges={['DSH', 'Partners', 'Field Intake']}
        eyebrow="بوابة الشركاء"
        title="طلبات الميدان التي تحتاج قرار الشركاء"
        description="هذا السطح يربط app-field بقسم الشركاء فقط: Offer Pending Approval قبل الزيارة، ثم Partner Review بعد الإرسال، ثم التسويق النهائي [TBD]."
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

      <WebSectionCard title="Offer Pending Approval" description="هذه الطلبات تحتاج اعتماد العرض أو رفضه أو تعديله قبل أن يعود للمندوب Offer Approved.">
        <Box gap={2}>
          {offerApprovalItems.map((item) => (
            <QueueCard key={item.id} item={item} marketingHref={marketingHref} />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="Partner Review" description="بعد الإرسال من نموذج إضافة المتجر ينتقل الطلب إلى هذه queue داخل لوحة الشركاء.">
        <Box gap={2}>
          {partnerReviewItems.map((item) => (
            <QueueCard key={item.id} item={item} marketingHref={marketingHref} />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="سلسلة الموافقة" description="المسار الحاكم يبقى واضحًا بين الميدان والشركاء ثم التسويق.">
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

      <WebSectionCard title="جاهز للتسويق" description="هذه الطلبات اجتازت الشركاء وتنتظر المرحلة التسويقية النهائية [TBD].">
        <Box gap={2}>
          {marketingReviewItems.map((item) => (
            <QueueCard key={item.id} item={item} marketingHref={marketingHref} />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="المسارات الحية" description="يبقى الوصول السريع إلى العمليات والتسويق ظاهرًا بدون تشعيب إضافي.">
        <Box gap={2}>
          <Button label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <Button label="افتح التسويق" tone="secondary" onPress={() => router.push(marketingHref)} />
          <Button label="افتح الكتالوج" tone="ghost" onPress={() => router.push(catalogHref)} />
        </Box>
      </WebSectionCard>

      <WebSectionCard title="عودة سريعة" description="يبقى hub هو المرجع الأعلى لهذا المسار.">
        <Button label="العودة إلى hub" onPress={() => router.push(hubHref)} />
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;