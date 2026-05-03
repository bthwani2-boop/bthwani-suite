'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline } from './catalog';
import { ControlPanelDshCatalogCategoriesScreen } from './categories';
import { ControlPanelDshDecisionBoard } from '../shared';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/operations?workspace=partners',
  marketingHref = '/operations?workspace=marketing',
}: ControlPanelDshCatalogScreenProps) {
  const router = useRouter();

  return (
    <Box gap={4}>
      <ControlPanelDshDecisionBoard
        title="Catalog operational board"
        purpose="Keep approval, quality, and readiness in a compact control-room read."
        primaryDecision="Approve, hold, or send the item back to the owning surface."
        nextAction="Open partner review or marketing review for the selected lane."
        blockers="Price anomalies, duplicates, and inventory gaps remain visible."
        ownerSurface="catalogs"
        evidenceHint="catalog approval proof, quality signals, and readiness handoff"
        routeHint={operationsHref}
        decisionTone="warning"
      />

      <WebMissionHeroCard
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

      <Box gap={2}>
        <WebSignalCard
          title="مراجعات الشركاء"
          value={String(dshCatalogMetrics.pendingPartnerReviews)}
          description="طلبات جديدة تنتظر قبول البوابة الأولى."
          tone="best"
        />
        <WebSignalCard
          title="مراجعات التسويق"
          value={String(dshCatalogMetrics.pendingMarketingReviews)}
          description="عناصر اجتازت الشركاء وتنتظر الاعتماد التسويقي."
        />
        <WebSignalCard
          title="الكتالوج المنشور"
          value={String(dshCatalogMetrics.approvedProducts)}
          description="كل ما هو متاح الآن لكل الشركاء."
        />
      </Box>

      <WebSectionCard title="الفئات السيادية" description="الفئات الرئيسية والفرعية تُدار من هنا فقط، وليس من الشريك أو الميداني.">
        <Box gap={2}>
          {dshCatalogNodes.filter((node) => node.kind !== 'approved-product').map((node) => (
            <Box key={node.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">{node.label}</Text>
                <Text role="caption" tone="success">
                  {node.countLabel}
                </Text>
              </Box>
              <Text role="bodySm" tone="muted">
                {node.summary}
              </Text>
              <Button
                label="افتح الكتالوج"
                tone="secondary"
                fullWidth={false}
                onPress={() => router.push(hubHref)}
              />
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="الجاهزية والجودة" description="إشارة سريعة لما إذا كانت البطاقة جاهزة للنشر أو تحتاج إصلاحًا قبل المراجعة النهائية.">
        <Box gap={2}>
          <WebSignalCard
            title="Product/listing quality"
            value="Tracked"
            description="الانحرافات والجودة تبقى ظاهرة قبل النشر."
            tone="brand"
          />
          <WebSignalCard
            title="Partner catalog readiness"
            value="Open"
            description="جاهزية الشركاء للنشر النهائي أو الرد تبقى واضحة."
            tone="warning"
          />
        </Box>
      </WebSectionCard>

      <ControlPanelDshCatalogCategoriesScreen />

      <WebSectionCard title="رحلة النشر" description="كل بطاقة تمر عبر نفس السلسلة: إدخال، شراكات، تسويق، ثم نشر نهائي.">
        <Box gap={2}>
          {dshCatalogPipeline.map((step, index) => (
            <Box key={step.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">{step.title}</Text>
                <Text role="caption" tone={index < 2 ? 'warning' : 'success'}>
                  {step.statusLabel}
                </Text>
              </Box>
              <Text role="bodySm" tone="muted">
                {step.description}
              </Text>
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="المسارات الحية" description="يفتح الكتالوج الرجوع إلى العمليات أو المراجعة دون كسر التسلسل.">
        <Box gap={2}>
          <Button label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <Button label="بوابة الشركاء" tone="secondary" onPress={() => router.push(partnersHref)} />
          <Button label="التسويق" tone="ghost" onPress={() => router.push(marketingHref)} />
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshCatalogScreen;
