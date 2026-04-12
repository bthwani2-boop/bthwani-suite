'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthStateView, BthText, useDshControlPanelText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
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
      <BthWebPageFrame
        eyebrow={dshText.reassign.pageEyebrow}
        title={dshText.reassign.pageTitle}
        description={dshText.reassign.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow={dshText.reassign.pageEyebrow}
      title={dshText.reassign.pageTitle}
      description={dshText.reassign.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
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
          <BthWebSignalCard title={dshText.reassign.signals.active} value={String(summary.activeCases)} description={dshText.reassign.signals.activeDescription} tone="best" />
          <BthWebSignalCard title={dshText.reassign.signals.urgent} value={String(summary.urgentCases)} description={dshText.reassign.signals.urgentDescription} />
          <BthWebSignalCard title={dshText.reassign.signals.blocked} value={String(summary.blockedCases)} description={dshText.reassign.signals.blockedDescription} />
          <BthWebSignalCard title={dshText.reassign.signals.fallbacks} value={String(summary.readyFallbacks)} description={dshText.reassign.signals.fallbacksDescription} />
        </div>

        <BthWebSectionCard title={dshText.reassign.candidatesTitle} description={dshText.reassign.candidatesDescription}>
          <div className={styles.cardGrid}>
            {candidates.map((candidate) => (
              <BthBox key={candidate.deliveryId} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{candidate.deliveryId}</BthText>
                  <BthText role="caption" tone={candidate.tone}>{candidate.statusLabel}</BthText>
                </BthBox>
                <BthText role="bodySm">{candidate.orderId}</BthText>
                <BthText role="caption" tone="soft">{candidate.reasonLabel} · {candidate.priorityLabel}</BthText>
                <BthText role="bodySm" tone="muted">{dshText.reassign.currentCaptainLabel}: {candidate.currentCaptain}</BthText>
                <BthText role="bodySm" tone="muted">{dshText.reassign.fallbackCaptainLabel}: {candidate.fallbackCaptain}</BthText>
                <BthText role="bodySm" tone="muted">{candidate.note}</BthText>
              </BthBox>
            ))}
          </div>
        </BthWebSectionCard>

        <BthWebSectionCard title={dshText.reassign.decisionTitle} description={dshText.reassign.decisionDescription}>
          <div className={styles.cardGrid}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.reassign.primaryDecisionTitle}</BthText>
              <BthText role="bodySm">{dshText.reassign.primaryDecisionLabel}</BthText>
              <BthText role="bodySm" tone="muted">{dshText.reassign.primaryDecisionDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.reassign.secondaryDecisionTitle}</BthText>
              <BthText role="bodySm">{dshText.reassign.secondaryDecisionLabel}</BthText>
              <BthText role="bodySm" tone="muted">{dshText.reassign.secondaryDecisionDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.reassign.supportDecisionTitle}</BthText>
              <BthText role="bodySm">{dshText.reassign.supportDecisionLabel}</BthText>
              <BthText role="bodySm" tone="muted">{dshText.reassign.supportDecisionDescription}</BthText>
            </BthBox>
          </div>
        </BthWebSectionCard>
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshReassignScreen;