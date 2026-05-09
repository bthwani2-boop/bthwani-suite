import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlActionCard, WebControlDisclosureItem, WebControlSurfaceHeader, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from './ControlPanelDshDecisionBoard';
import type { DshUnifiedRecommendation } from './dshRecommendationModel';

type WorkspaceSignal = {
  id: string;
  title: string;
  value: string;
  description: string;
  tone?: React.ComponentProps<typeof WebSignalCard>['tone'];
};

type WorkspaceAction = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  tone?: 'primary' | 'secondary';
  onAction?: () => void;
};

type WorkspaceDisclosure = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  onAction?: () => void;
};

export type ControlPanelDshWorkspaceFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  badges?: readonly string[];
  metaItems?: readonly string[];
  primaryAction?: { label: string; href?: string; onAction?: () => void };
  secondaryAction?: { label: string; href?: string; onAction?: () => void };
  signals?: readonly WorkspaceSignal[];
  actions?: readonly WorkspaceAction[];
  disclosures?: readonly WorkspaceDisclosure[];
  decisionBoard?: {
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
  footerNote?: string;
};

export function ControlPanelDshWorkspaceFrame({
  eyebrow,
  title,
  description,
  badges = ['DSH'],
  metaItems = [],
  primaryAction,
  secondaryAction,
  signals = [],
  actions = [],
  disclosures = [],
  decisionBoard,
  footerNote,
}: ControlPanelDshWorkspaceFrameProps) {
  return (
    <Box gap={3} dir="rtl">
      <WebControlSurfaceHeader
        chips={badges.map((badge, index) => ({ id: `${badge}-${index}`, label: index === 0 ? `${eyebrow} · ${badge}` : badge, tone: index === 0 ? 'brand' : 'accent' }))}
        title={title}
        description={description}
        actions={[
          ...(primaryAction ? [{ id: `${title}-primary`, label: primaryAction.label, href: primaryAction.href, onAction: primaryAction.onAction, tone: 'primary' as const }] : []),
          ...(secondaryAction ? [{ id: `${title}-secondary`, label: secondaryAction.label, href: secondaryAction.href, onAction: secondaryAction.onAction, tone: 'secondary' as const }] : []),
        ]}
      />

      {metaItems.length ? (
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {metaItems.map((item) => (
            <Box key={item} padding={2} border radiusToken="lg" background="surfaceRaised" style={{ flexGrow: 1, flexBasis: 180 }}>
              <Text role="caption" tone="muted">{item}</Text>
            </Box>
          ))}
        </Box>
      ) : null}

      {signals.length ? (
        <Box gap={2}>
          {signals.map((signal) => (
            <WebSignalCard key={signal.id} title={signal.title} value={signal.value} description={signal.description} tone={signal.tone} />
          ))}
        </Box>
      ) : null}

      {decisionBoard ? (
        <ControlPanelDshDecisionBoard
          title={decisionBoard.title}
          purpose={decisionBoard.purpose}
          primaryDecision={decisionBoard.primaryDecision}
          nextAction={decisionBoard.nextAction}
          blockers={decisionBoard.blockers}
          ownerSurface={decisionBoard.ownerSurface}
          evidenceHint={decisionBoard.evidenceHint}
          routeHint={decisionBoard.routeHint}
          decisionTone={decisionBoard.decisionTone}
          recommendation={decisionBoard.recommendation}
        />
      ) : null}

      {actions.length ? (
        <WebSectionCard title="الخطوات السريعة" description="حافظ على الواجهة قصيرة وقرارها واضحًا.">
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {actions.map((action) => (
              <Box key={action.id} style={{ flexGrow: 1, flexBasis: 240 }}>
                <WebControlActionCard
                  id={action.id}
                  title={action.label}
                  description={action.description}
                  footerLabel={action.badge ?? 'فتح'}
                  href={action.href}
                  tone={action.tone}
                  onAction={action.onAction}
                />
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      ) : null}

      {disclosures.length ? (
        <WebSectionCard title="التفاصيل المتدرجة" description="افتح ما تحتاجه فقط، واترك باقي السطح مطويًا.">
          <Box gap={2}>
            {disclosures.map((item) => (
              <WebControlDisclosureItem
                key={item.id}
                id={item.id}
                label={item.label}
                description={item.description}
                href={item.href}
                badge={item.badge}
                onAction={item.onAction}
              />
            ))}
          </Box>
        </WebSectionCard>
      ) : null}

      {footerNote ? <Text role="bodySm" tone="muted">{footerNote}</Text> : null}
    </Box>
  );
}

export default ControlPanelDshWorkspaceFrame;
