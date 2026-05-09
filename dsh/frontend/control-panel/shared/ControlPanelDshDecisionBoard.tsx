import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard, WebControlPanelRecommendation } from '@bthwani/ui-kit/web';
import { type DshUnifiedRecommendation, getDshRecommendationSeverityLabel } from './dshRecommendationModel';

export type ControlPanelDshDecisionBoardProps = {
  title: string;
  purpose: string;
  primaryDecision: string;
  nextAction: string;
  blockers: string;
  ownerSurface: string;
  evidenceHint: string;
  routeHint: string;
  decisionTone?: React.ComponentProps<typeof WebSignalCard>['tone'];
  recommendation?: DshUnifiedRecommendation;
};

export function ControlPanelDshDecisionBoard({
  title,
  purpose,
  primaryDecision,
  nextAction,
  blockers,
  ownerSurface,
  evidenceHint,
  routeHint,
  decisionTone = 'brand',
  recommendation,
}: ControlPanelDshDecisionBoardProps) {
  const unifiedRecommendation = recommendation ?? {
    id: `${ownerSurface}-${title}`,
    surface: ownerSurface,
    severity: decisionTone === 'danger' ? 'high' : decisionTone === 'warning' ? 'medium' : 'low',
    confidence: 'high',
    affectedEntity: ownerSurface,
    reason: blockers,
    evidence: evidenceHint,
    nextAction,
    owner: ownerSurface,
    expectedImpact: purpose,
    primaryActionLabel: 'تنفيذ الآن',
    secondaryActionLabel: 'فتح الأدلة',
  };

  return (
    <WebSectionCard title={title} description={purpose}>
      <Box gap={2}>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="القرار الأساسي" value={primaryDecision} description="ما الذي يجب أن يحسمه هذا السطح الآن." tone={decisionTone} />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="الإجراء التالي" value={nextAction} description="ما يجب تنفيذه الآن." tone="warning" />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="العوائق" value={blockers} description="ما الذي ما زال يمنع الإغلاق أو التنفيذ." tone="danger" />
          </Box>
          <Box style={{ flexGrow: 1, flexBasis: 220 }}>
            <WebSignalCard title="السطح المالك" value={ownerSurface} description="السطح المسؤول عن القرار." tone="best" />
          </Box>
        </Box>

        <WebControlPanelRecommendation
          title="توصية النظام الموحدة"
          reason={`لماذا؟ ${unifiedRecommendation.reason} · ما الدليل؟ ${unifiedRecommendation.evidence} · ما الأثر المتوقع؟ ${unifiedRecommendation.expectedImpact}`}
          confidence={unifiedRecommendation.confidence}
          auditTag={getDshRecommendationSeverityLabel(unifiedRecommendation.severity)}
          primaryAction={{ id: `${unifiedRecommendation.id}-primary`, label: unifiedRecommendation.primaryActionLabel }}
          secondaryAction={{ id: `${unifiedRecommendation.id}-secondary`, label: unifiedRecommendation.secondaryActionLabel }}
        />

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text role="caption" tone="muted">ما الدليل؟</Text>
            <Text role="bodySm">{evidenceHint}</Text>
          </Box>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text role="caption" tone="muted">مسار الواجهة</Text>
            <Text role="bodySm">{routeHint}</Text>
          </Box>
          <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 220 }}>
            <Text role="caption" tone="muted">من المالك؟</Text>
            <Text role="bodySm">{unifiedRecommendation.owner}</Text>
          </Box>
        </Box>
      </Box>
    </WebSectionCard>
  );
}

export default ControlPanelDshDecisionBoard;
