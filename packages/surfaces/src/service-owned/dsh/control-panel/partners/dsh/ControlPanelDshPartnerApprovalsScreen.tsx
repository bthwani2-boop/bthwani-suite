'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';
import { dshPartnerApprovalLanes, dshPartnerIntakeItems, dshPartnerIntakeMetrics } from './workflow';

export type ControlPanelDshPartnerApprovalsScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  catalogHref?: string;
  marketingHref?: string;
};

export function ControlPanelDshPartnerApprovalsScreen({
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  catalogHref = '/operations/dsh/catalogs',
  marketingHref = '/operations/dsh/marketing',
}: ControlPanelDshPartnerApprovalsScreenProps) {
  const router = useRouter();

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={['DSH', 'Partners', 'Intake']}
        eyebrow="بوابة الشركاء"
        title="المراجعة الأولى لطلبات المنتجات"
        description="كل ما يأتي من الميداني أو الشريك يمر هنا أولًا. بعد الموافقة الأولية ينتقل إلى التسويق، ثم إلى الكتالوج النهائي.
        "
        metaItems={[
          `طلبات أولية: ${dshPartnerIntakeMetrics[0].value}`,
          `طلبات تسويقية: ${dshPartnerIntakeMetrics[1].value}`,
          `منشور الآن: ${dshPartnerIntakeMetrics[2].value}`,
        ]}
        primaryAction={{ label: 'افتح الكتالوج', href: catalogHref }}
        secondaryAction={{ label: 'افتح التسويق', href: marketingHref }}
      />

      <BthBox gap={2}>
        {dshPartnerIntakeMetrics.map((metric, index) => (
          <BthWebSignalCard
            key={metric.id}
            title={metric.label}
            value={String(metric.value)}
            description={metric.description}
            tone={index === 0 ? 'best' : undefined}
          />
        ))}
      </BthBox>

      <BthWebSectionCard title="طلبات معلقة" description="هذه هي العناصر التي لا تزال داخل queue الشركاء وتنتظر القرار الأول.">
        <BthBox gap={2}>
          {dshPartnerIntakeItems.filter((item) => item.stage !== 'published').map((item) => (
            <BthBox key={item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.productName}</BthText>
                <BthText role="caption" tone={item.stage === 'pending-partner' ? 'warning' : 'success'}>
                  {item.stage === 'pending-partner' ? 'مراجعة أولية' : 'مراجعة تسويقية'}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {item.categoryLabel} · {item.ownerLabel} · {item.submittedAt}
              </BthText>
              <BthText role="bodySm" tone="muted">
                {item.note}
              </BthText>
              <BthBox layoutDirection="row" gap={2}>
                <BthButton label="اعتماد" tone="secondary" fullWidth={false} onPress={() => router.push(catalogHref)} />
                <BthButton label="راجع التسويق" tone="ghost" fullWidth={false} onPress={() => router.push(marketingHref)} />
              </BthBox>
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="سلسلة الموافقة" description="لا يظهر المنتج في الكتالوج إلا بعد مرور واضح على كل بوابة.">
        <BthBox gap={2}>
          {dshPartnerApprovalLanes.map((lane) => (
            <BthBox key={lane.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{lane.title}</BthText>
              <BthText role="bodySm" tone="muted">
                {lane.description}
              </BthText>
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="المخرجات المنشورة" description="هذه العناصر أصبحت مرئية في الكتالوج النهائي لكل الشركاء.">
        <BthBox gap={2}>
          {dshPartnerIntakeItems.filter((item) => item.stage === 'published').map((item) => (
            <BthBox key={item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{item.productName}</BthText>
                <BthText role="caption" tone="success">
                  منشور
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {item.categoryLabel} · {item.note}
              </BthText>
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="المسارات الحية" description="من هنا يمكن الرجوع إلى العمليات أو الذهاب مباشرة إلى الكتالوج.">
        <BthBox gap={2}>
          <BthButton label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <BthButton label="افتح الكتالوج" tone="secondary" onPress={() => router.push(catalogHref)} />
          <BthButton label="افتح التسويق" tone="ghost" onPress={() => router.push(marketingHref)} />
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="عودة سريعة" description="يبقى المركز الحاكم ظاهرًا حتى لا تضيع بوابة المراجعة.">
        <BthButton label="العودة إلى hub" onPress={() => router.push(hubHref)} />
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
