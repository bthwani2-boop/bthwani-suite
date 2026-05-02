'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshDecisionBoard, type ControlPanelDshActionQueueItem } from '../../shared';
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
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(categoryNodes[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('Ready for category triage');
  const queueItems = categoryNodes.map((node) => ({
    id: node.id,
    title: node.label,
    status: node.countLabel,
    ownerSurface: resolveCategoryOwnerLabel(node.owner),
    blocker: node.summary,
    evidence: `${node.stage} · ${node.kind}`,
    primaryActionLabel: 'Request fix',
    secondaryActionLabel: 'Approve category',
    evidenceActionLabel: 'Open evidence',
    tone: node.owner === 'catalog' ? 'brand' : node.owner === 'partner' ? 'warning' : 'best',
  })) satisfies readonly ControlPanelDshActionQueueItem[];
  const selectedItem = queueItems.find((item) => item.id === selectedCategoryId) ?? queueItems[0];

  return (
    <Box gap={4}>
      <ControlPanelDshDecisionBoard
        title="Category governance board"
        purpose="Keep category ownership, handoff, and publish readiness in one operational read."
        primaryDecision={selectedItem?.status ?? 'Review category'}
        nextAction={lastAction}
        blockers={selectedItem?.blocker ?? 'Category conflicts, handoff gaps, and readiness checks remain visible.'}
        ownerSurface="catalogs"
        evidenceHint={selectedItem?.evidence ?? 'category ownership, stage, and handoff proof'}
        routeHint="/operations?workspace=catalogs"
        decisionTone="brand"
      />

      <ControlPanelDshActionQueue
        title="الفئات التشغيلية"
        purpose="اختر الفئة ثم نفذ approve أو request fix أو evidence من نفس السطح."
        items={queueItems}
        selectedId={selectedCategoryId}
        onSelect={(id) => setSelectedCategoryId(id)}
        primaryAction={(item) => { setSelectedCategoryId(item.id); setLastAction(`طلب إصلاح: ${item.title}`); }}
        secondaryAction={(item) => { setSelectedCategoryId(item.id); setLastAction(`اعتماد محلي: ${item.title}`); }}
        evidenceAction={(item) => { setSelectedCategoryId(item.id); setLastAction(`فتح الدليل: ${item.title}`); }}
      />

      <WebSectionCard
        title="ملخص الفئات"
        description="ملخص سريع للحالات الحالية بعد القرار المحلي."
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
            </Box>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;
