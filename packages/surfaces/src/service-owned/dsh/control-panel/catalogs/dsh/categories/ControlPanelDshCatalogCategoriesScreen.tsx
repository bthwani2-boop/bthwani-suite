'use client';

import React from 'react';
import { BthBox, BthText } from '@bthwani/ui-kit';
import { BthWebSectionCard } from '@bthwani/ui-kit/web';
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
    <BthWebSectionCard
      title="الفئات الخفيفة"
      description="تمثيل خفيف للفئات يظهر في الكتالوج، بينما تبقى الشاشة التشغيلية الأساسية في app-client."
    >
      <BthBox gap={3}>
        {categoryNodes.map((node) => (
          <BthBox key={node.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthBox layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
              <BthText role="bodyStrong">{node.label}</BthText>
              <BthText role="caption" tone="success">{node.countLabel}</BthText>
            </BthBox>
            <BthText role="bodySm" tone="muted">{node.summary}</BthText>
            <BthText role="caption" tone="muted">
              {resolveCategoryOwnerLabel(node.owner)} · {node.stage}
            </BthText>
          </BthBox>
        ))}
      </BthBox>
    </BthWebSectionCard>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;