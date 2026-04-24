'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
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
    <Box gap={4}>
      <WebMissionHeroCard
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

      <WebSectionCard title="طلبات معلقة" description="هذه هي العناصر التي لا تزال داخل queue الشركاء وتنتظر القرار الأول.">
        <Box gap={2}>
          {dshPartnerIntakeItems.filter((item) => item.stage !== 'published').map((item) => (
            <Box key={item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">{item.productName}</Text>
                <Text role="caption" tone={item.stage === 'pending-partner' ? 'warning' : 'success'}>
                  {item.stage === 'pending-partner' ? 'مراجعة أولية' : 'مراجعة تسويقية'}
                </Text>
              </Box>
              <Text role="bodySm" tone="muted">
                {item.categoryLabel} · {item.ownerLabel} · {item.submittedAt}
              </Text>
              <Text role="bodySm" tone="muted">
                {item.note}
              </Text>
              <Box layoutDirection="row" gap={2}>
                <Button label="اعتماد" tone="secondary" fullWidth={false} onPress={() => router.push(catalogHref)} />
                <Button label="راجع التسويق" tone="ghost" fullWidth={false} onPress={() => router.push(marketingHref)} />
              </Box>
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="سلسلة الموافقة" description="لا يظهر المنتج في الكتالوج إلا بعد مرور واضح على كل بوابة.">
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

      <WebSectionCard title="المخرجات المنشورة" description="هذه العناصر أصبحت مرئية في الكتالوج النهائي لكل الشركاء.">
        <Box gap={2}>
          {dshPartnerIntakeItems.filter((item) => item.stage === 'published').map((item) => (
            <Box key={item.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">{item.productName}</Text>
                <Text role="caption" tone="success">
                  منشور
                </Text>
              </Box>
              <Text role="bodySm" tone="muted">
                {item.categoryLabel} · {item.note}
              </Text>
            </Box>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard title="المسارات الحية" description="من هنا يمكن الرجوع إلى العمليات أو الذهاب مباشرة إلى الكتالوج.">
        <Box gap={2}>
          <Button label="الرجوع إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          <Button label="افتح الكتالوج" tone="secondary" onPress={() => router.push(catalogHref)} />
          <Button label="افتح التسويق" tone="ghost" onPress={() => router.push(marketingHref)} />
        </Box>
      </WebSectionCard>

      <WebSectionCard title="عودة سريعة" description="يبقى المركز الحاكم ظاهرًا حتى لا تضيع بوابة المراجعة.">
        <Button label="العودة إلى hub" onPress={() => router.push(hubHref)} />
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
