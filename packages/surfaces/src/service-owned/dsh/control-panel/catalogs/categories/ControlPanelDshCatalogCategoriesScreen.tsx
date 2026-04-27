'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { dshCatalogNodes } from '../catalog';

function resolveCategoryOwnerLabel(owner: 'catalog' | 'partner' | 'marketing') {
  if (owner === 'partner') {
    return 'بوابة الشركاء';
  }

  if (owner === 'marketing') {
    return 'مراجعة التسويق';
  }

  return 'الكتالوج';
}

export function ControlPanelDshCatalogCategoriesScreen() {
  const categoryNodes = dshCatalogNodes.filter((node) => node.kind !== 'approved-product');

  return (
    <WebSectionCard
      title="الفئات الخفيفة"
      description="تمثيل خفيف للفئات يظهر في الكتالوج، بينما تبقى الشاشة التشغيلية الأساسية في app-client."
    >
      <Box gap={3}>
        {categoryNodes.map((node) => (
          <Box key={node.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Text role="bodyStrong">{node.label}</Text>
              <Text role="caption" tone="success">{node.countLabel}</Text>
            </Box>
            <Text role="bodySm" tone="muted">{node.summary}</Text>
            <Text role="caption" tone="muted">
              {resolveCategoryOwnerLabel(node.owner)} · {node.stage}
            </Text>
          </Box>
        ))}
      </Box>
    </WebSectionCard>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;