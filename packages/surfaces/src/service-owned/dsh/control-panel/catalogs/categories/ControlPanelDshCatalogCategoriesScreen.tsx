'use client';

import React from 'react';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../../shared';
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
    <Box gap={4}>
      <ControlPanelDshDecisionBoard
        title="Category governance board"
        purpose="Keep category ownership, handoff, and publish readiness in one operational read."
        primaryDecision="Approve the category, request a fix, or hand it off for review."
        nextAction="Open the owning surface or blocker evidence for the selected category."
        blockers="Category conflicts, handoff gaps, and readiness checks remain visible."
        ownerSurface="catalogs"
        evidenceHint="category ownership, stage, and handoff proof"
        routeHint="/operations?workspace=catalogs"
        decisionTone="brand"
      />

      <WebSectionCard
        title="الفئات التشغيلية"
        description="تمثيل الفئات هنا صار بوابة قرار خفيفة مع إجراءات مباشرة بدل ملخص ثابت فقط."
      >
        <Box gap={3}>
          {categoryNodes.map((node) => (
            <Box key={node.id} padding={3} gap={2} border radiusToken="xl" background="surfaceRaised">
              <Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Text role="bodyStrong">{node.label}</Text>
                <Text role="caption" tone="success">{node.countLabel}</Text>
              </Box>
              <Text role="bodySm" tone="muted">{node.summary}</Text>
              <Text role="caption" tone="muted">
                {resolveCategoryOwnerLabel(node.owner)} · {node.stage}
              </Text>
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Button label="طلب إصلاح" tone="secondary" fullWidth={false} onPress={() => undefined} />
                <Button label="فتح الدليل" tone="ghost" fullWidth={false} onPress={() => undefined} />
              </Box>
            </Box>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;
