'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline } from './catalog';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  partnersHref = '/operations/dsh/partners',
  marketingHref = '/operations/dsh/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const router = useRouter();

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={['DSH', 'Catalog', 'Governance']}
        eyebrow="كتالوج DSH"
        title="الملكية النهائية للفئات والمنتجات"
        description="الفئات الرئيسية والفرعية سيادية هنا، والمنتجات لا تُنشر إلا بعد المرور على مراجعة الشركاء ثم التسويق قبل وصولها إلى الكتالوج النهائي."
        metaItems={[
          `الفئات الرئيسية: ${dshCatalogMetrics.mainCategories}`,
          `الفرعيات: ${dshCatalogMetrics.subCategories}`,
          `المنتجات المنشورة: ${dshCatalogMetrics.approvedProducts}`,
        ]}
        primaryAction={{ label: 'افتح مراجعة الشركاء', href: partnersHref }}
        secondaryAction={{ label: 'افتح التسويق', href: marketingHref }}
      />

      <BthBox gap={2}>
        <BthWebSignalCard
          title="مراجعات الشركاء"
          value={String(dshCatalogMetrics.pendingPartnerReviews)}
          description="طلبات جديدة تنتظر قبول البوابة الأولى."
          tone="best"
        />
        <BthWebSignalCard
          title="مراجعات التسويق"
          value={String(dshCatalogMetrics.pendingMarketingReviews)}
          description="عناصر اجتازت الشركاء وتنتظر الاعتماد التسويقي."
        />
        <BthWebSignalCard
          title="الكتالوج المنشور"
          value={String(dshCatalogMetrics.approvedProducts)}
          description="كل ما هو متاح الآن لكل الشركاء."
        />
      </BthBox>

      <BthWebSectionCard title="الفئات السيادية" description="الفئات الرئيسية والفرعية تُدار من هنا فقط، وليس من الشريك أو الميداني.">
        <BthBox gap={2}>
          {dshCatalogNodes.filter((node) => node.kind !== 'approved-product').map((node) => (
            <BthBox key={node.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{node.label}</BthText>
                <BthText role="caption" tone="success">
                  {node.countLabel}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {node.summary}
              </BthText>
              <BthButton
                label="افتح الكتالوج"
                tone="secondary"
                fullWidth={false}
                onPress={() => router.push(hubHref)}
              />
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="رحلة النشر" description="كل بطاقة تمر عبر نفس السلسلة: إدخال، شراكات، تسويق، ثم نشر نهائي.">
        <BthBox gap={2}>
          {dshCatalogPipeline.map((step, index) => (
            <BthBox key={step.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthBox layoutDirection="row" justify="space-between" align="center">
                <BthText role="bodyStrong">{step.title}</BthText>
                <BthText role="caption" tone={index < 2 ? 'warning' : 'success'}>
                  {step.statusLabel}
                </BthText>
              </BthBox>
              <BthText role="bodySm" tone="muted">
                {step.description}
              </BthText>
            </BthBox>
          ))}
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title="المسارات الحية" description="يفتح الكتالوج الرجوع إلى العمليات أو المراجعة دون كسر التسلسل.">
        <BthBox gap={2}>
          <BthButton label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <BthButton label="بوابة الشركاء" tone="secondary" onPress={() => router.push(partnersHref)} />
          <BthButton label="التسويق" tone="ghost" onPress={() => router.push(marketingHref)} />
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshCatalogScreen;
