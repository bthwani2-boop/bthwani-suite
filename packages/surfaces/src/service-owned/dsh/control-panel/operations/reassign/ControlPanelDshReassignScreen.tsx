'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Badge,
  StateView,
  Text,
  StatCard,
} from '@bthwani/ui-kit';
import {
  WebPageFrame,
  WebSectionCard,
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

function resolvePriorityTone(priority: string): 'brand' | 'success' | 'warning' | 'danger' {
  if (priority === 'عاجلة' || priority === 'Urgent') return 'danger';
  if (priority === 'عادية' || priority === 'Normal') return 'success';
  return 'warning';
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

  const urgentCount = summary.urgentCases;
  const blockedCount = summary.blockedCases;
  const hasUrgent = urgentCount > 0;

  return (
    <WebPageFrame
      eyebrow={dshText.reassign.pageEyebrow}
      title={dshText.reassign.pageTitle}
      description={dshText.reassign.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.reassignWorkspace}>
        {/* ===== Metrics Strip ===== */}
        <div className={styles.reassignMetricsStrip}>
          <StatCard
            label={dshText.reassign.signals.active}
            value={String(summary.activeCases)}
            tone="brand"
          />
          <StatCard
            label={dshText.reassign.signals.urgent}
            value={String(summary.urgentCases)}
            tone={hasUrgent ? 'danger' : 'default'}
          />
          <StatCard
            label={dshText.reassign.signals.blocked}
            value={String(summary.blockedCases)}
            tone={blockedCount > 0 ? 'warning' : 'default'}
          />
          <StatCard
            label={dshText.reassign.signals.fallbacks}
            value={String(summary.readyFallbacks)}
            tone="success"
          />
        </div>

        {/* ===== Context Summary ===== */}
        <div className={styles.reassignContextBar}>
          <div className={styles.reassignContextMain}>
            <Text role="caption" tone={hasUrgent ? 'danger' : 'brand'}>
              {dshText.reassign.heroEyebrow}
            </Text>
            <Text role="titleSm">
              {dshText.reassign.heroTitle}
            </Text>
            <Text role="bodySm" tone="muted">
              {dshText.reassign.heroDescription}
            </Text>
          </div>
          <div className={styles.reassignContextActions}>
            <Button
              label={dshText.common.openOperationsWorkspace}
              tone="primary"
              size="sm"
              fullWidth={false}
              onPress={() => router.push(hubHref)}
            />
            <Button
              label={dshText.common.openOrders}
              tone="ghost"
              size="sm"
              fullWidth={false}
              onPress={() => router.push(ordersHref)}
            />
          </div>
        </div>

        {/* ===== Reassign Candidates ===== */}
        <WebSectionCard
          title={dshText.reassign.candidatesTitle}
          description={dshText.reassign.candidatesDescription}
        >
          <div className={styles.reassignCandidatesGrid}>
            {candidates.map((candidate) => (
              <div key={candidate.deliveryId} className={styles.reassignCandidateCard}>
                <Box
                  padding={4}
                  gap={2}
                  border
                  radiusToken="xl"
                  background="surfaceRaised"
                >
                  <div className={styles.reassignCandidateHeader}>
                    <Text role="label" tone="soft">{candidate.deliveryId}</Text>
                    <Badge
                      label={candidate.statusLabel}
                      tone={candidate.tone as 'brand' | 'success' | 'warning' | 'danger'}
                    />
                  </div>
                  <Text role="bodyStrong">{candidate.orderId}</Text>
                  <div className={styles.reassignCandidateMeta}>
                    <Text role="caption" tone="soft">
                      {candidate.reasonLabel}
                    </Text>
                    <Text role="caption" tone={resolvePriorityTone(candidate.priorityLabel)}>
                      {candidate.priorityLabel}
                    </Text>
                    <Text role="caption" tone="muted">
                      {dshText.reassign.currentCaptainLabel}: {candidate.currentCaptain}
                    </Text>
                    <Text role="caption" tone="muted">
                      {dshText.reassign.fallbackCaptainLabel}: {candidate.fallbackCaptain}
                    </Text>
                  </div>
                  <Text role="bodySm" tone="muted">
                    {candidate.note}
                  </Text>
                  <Button
                    label={dshText.common.openOperationsWorkspace}
                    tone="primary"
                    size="sm"
                    fullWidth={false}
                    onPress={() => router.push(hubHref)}
                  />
                </Box>
              </div>
            ))}
          </div>
        </WebSectionCard>

        {/* ===== Decision Logic ===== */}
        <WebSectionCard
          title={dshText.reassign.decisionTitle}
          description={dshText.reassign.decisionDescription}
        >
          <div className={styles.reassignDecisionGrid}>
            <div className={styles.reassignDecisionCard}>
              <Box
                padding={4}
                gap={2}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <Text role="bodyStrong" tone="brand">
                  {dshText.reassign.primaryDecisionTitle}
                </Text>
                <Text role="bodySm" tone="muted">
                  {dshText.reassign.primaryDecisionDescription}
                </Text>
                <div className={styles.reassignDecisionAction}>
                  <Button
                    label={dshText.reassign.primaryDecisionLabel}
                    tone="primary"
                    size="sm"
                    fullWidth={false}
                    onPress={() => router.push(hubHref)}
                  />
                </div>
              </Box>
            </div>
            <div className={styles.reassignDecisionCard}>
              <Box
                padding={4}
                gap={2}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <Text role="bodyStrong" tone="success">
                  {dshText.reassign.secondaryDecisionTitle}
                </Text>
                <Text role="bodySm" tone="muted">
                  {dshText.reassign.secondaryDecisionDescription}
                </Text>
                <div className={styles.reassignDecisionAction}>
                  <Button
                    label={dshText.reassign.secondaryDecisionLabel}
                    tone="secondary"
                    size="sm"
                    fullWidth={false}
                    onPress={() => router.push(ordersHref)}
                  />
                </div>
              </Box>
            </div>
            <div className={styles.reassignDecisionCard}>
              <Box
                padding={4}
                gap={2}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <Text role="bodyStrong" tone="danger">
                  {dshText.reassign.supportDecisionTitle}
                </Text>
                <Text role="bodySm" tone="muted">
                  {dshText.reassign.supportDecisionDescription}
                </Text>
                <div className={styles.reassignDecisionAction}>
                  <Button
                    label={dshText.reassign.supportDecisionLabel}
                    tone="danger"
                    size="sm"
                    fullWidth={false}
                    onPress={() => router.push(supportHref)}
                  />
                </div>
              </Box>
            </div>
          </div>
        </WebSectionCard>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshReassignScreen;