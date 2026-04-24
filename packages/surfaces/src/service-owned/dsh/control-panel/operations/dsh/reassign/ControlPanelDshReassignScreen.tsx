'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { Box,
  StateView,
  Text
} from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
import { getDshReassignCandidates, getDshReassignSummary } from './reassign-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshReassignScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(text: ReturnType<typeof useDshControlPanelText>, state: Exclude<ControlPanelDshReassignScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.reassign.stateLoadingTitle,
      description: text.reassign.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.reassign.stateEmptyTitle,
      description: text.reassign.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.reassign.stateOfflineTitle,
      description: text.reassign.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.reassign.stateDisabledTitle,
      description: text.reassign.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.reassign.stateErrorTitle,
    description: text.reassign.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}

export type ControlPanelDshReassignScreenProps = {
  state?: ControlPanelDshReassignScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshReassignScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshReassignScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const summary = React.useMemo(() => getDshReassignSummary(dshText), [dshText]);
  const candidates = React.useMemo(() => getDshReassignCandidates(dshText), [dshText]);

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <WebPageFrame
        eyebrow={dshText.reassign.pageEyebrow}
        title={dshText.reassign.pageTitle}
        description={dshText.reassign.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame
      eyebrow={dshText.reassign.pageEyebrow}
      title={dshText.reassign.pageTitle}
      description={dshText.reassign.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <WebMissionHeroCard
          badges={['/operations/dsh/reassign', dshText.common.live, `${dshText.reassign.signals.active}: ${summary.activeCases}`]}
          eyebrow={dshText.reassign.heroEyebrow}
          title={dshText.reassign.heroTitle}
          description={dshText.reassign.heroDescription}
          metaItems={[
            `${dshText.reassign.signals.urgent}: ${summary.urgentCases}`,
            `${dshText.reassign.signals.blocked}: ${summary.blockedCases}`,
            `${dshText.reassign.signals.fallbacks}: ${summary.readyFallbacks}`,
          ]}
          primaryAction={{ label: dshText.common.openOperationsWorkspace, href: hubHref }}
          secondaryAction={{ label: dshText.common.openOrders, href: ordersHref }}
        />

        <div className={styles.signalGrid}>
          <WebSignalCard title={dshText.reassign.signals.active} value={String(summary.activeCases)} description={dshText.reassign.signals.activeDescription} tone="best" />
          <WebSignalCard title={dshText.reassign.signals.urgent} value={String(summary.urgentCases)} description={dshText.reassign.signals.urgentDescription} />
          <WebSignalCard title={dshText.reassign.signals.blocked} value={String(summary.blockedCases)} description={dshText.reassign.signals.blockedDescription} />
          <WebSignalCard title={dshText.reassign.signals.fallbacks} value={String(summary.readyFallbacks)} description={dshText.reassign.signals.fallbacksDescription} />
        </div>

        <WebSectionCard title={dshText.reassign.candidatesTitle} description={dshText.reassign.candidatesDescription}>
          <div className={styles.cardGrid}>
            {candidates.map((candidate) => (
              <Box key={candidate.deliveryId} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="bodyStrong">{candidate.deliveryId}</Text>
                  <Text role="caption" tone={candidate.tone}>{candidate.statusLabel}</Text>
                </Box>
                <Text role="bodySm">{candidate.orderId}</Text>
                <Text role="caption" tone="soft">{candidate.reasonLabel} · {candidate.priorityLabel}</Text>
                <Text role="bodySm" tone="muted">{dshText.reassign.currentCaptainLabel}: {candidate.currentCaptain}</Text>
                <Text role="bodySm" tone="muted">{dshText.reassign.fallbackCaptainLabel}: {candidate.fallbackCaptain}</Text>
                <Text role="bodySm" tone="muted">{candidate.note}</Text>
              </Box>
            ))}
          </div>
        </WebSectionCard>

        <WebSectionCard title={dshText.reassign.decisionTitle} description={dshText.reassign.decisionDescription}>
          <div className={styles.cardGrid}>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.reassign.primaryDecisionTitle}</Text>
              <Text role="bodySm">{dshText.reassign.primaryDecisionLabel}</Text>
              <Text role="bodySm" tone="muted">{dshText.reassign.primaryDecisionDescription}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.reassign.secondaryDecisionTitle}</Text>
              <Text role="bodySm">{dshText.reassign.secondaryDecisionLabel}</Text>
              <Text role="bodySm" tone="muted">{dshText.reassign.secondaryDecisionDescription}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.reassign.supportDecisionTitle}</Text>
              <Text role="bodySm">{dshText.reassign.supportDecisionLabel}</Text>
              <Text role="bodySm" tone="muted">{dshText.reassign.supportDecisionDescription}</Text>
            </Box>
          </div>
        </WebSectionCard>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshReassignScreen;