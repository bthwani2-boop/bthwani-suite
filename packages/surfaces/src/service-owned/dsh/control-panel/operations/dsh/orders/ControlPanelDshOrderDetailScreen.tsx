'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthStateView, BthText, useDshControlPanelText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  getSampleDshOrder,
  getSampleDshOrderActionPlan,
  getSampleDshOrderArrivalTimeline,
} from './order-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshOrderDetailScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(
  text: ReturnType<typeof useDshControlPanelText>,
  state: Exclude<ControlPanelDshOrderDetailScreenState, 'ready'>,
  orderId: string,
) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: `${text.orderDetail.stateLoadingTitlePrefix} ${orderId}`,
      description: text.orderDetail.stateLoadingDescription,
      actionLabel: text.orderDetail.backToOrders,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'notFound' as const,
      title: `${text.orderDetail.stateEmptyTitlePrefix} ${orderId} ${text.orderDetail.stateEmptyTitleSuffix}`,
      description: text.orderDetail.stateEmptyDescription,
      actionLabel: text.orderDetail.backToOrders,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.orderDetail.stateOfflineTitle,
      description: text.orderDetail.stateOfflineDescription,
      actionLabel: text.orderDetail.backToOrders,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.orderDetail.stateDisabledTitle,
      description: text.orderDetail.stateDisabledDescription,
      actionLabel: text.orderDetail.backToOrders,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.orderDetail.stateErrorTitle,
    description: text.orderDetail.stateErrorDescription,
    actionLabel: text.orderDetail.backToOrders,
  };
}

export type ControlPanelDshOrderDetailScreenProps = {
  orderId: string;
  state?: ControlPanelDshOrderDetailScreenState;
  ordersHref?: string;
  hubHref?: string;
  supportHref?: string;
  arrivalBellHref?: string;
  reassignHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshOrderDetailScreen({
  orderId,
  state = 'ready',
  ordersHref = '/operations/dsh/orders',
  hubHref = '/operations/dsh',
  supportHref = '/support',
  arrivalBellHref = '/operations/dsh/arrival-bell',
  reassignHref = '/operations/dsh/reassign',
  embedded = false,
  showHeader = true,
}: ControlPanelDshOrderDetailScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const order = getSampleDshOrder(dshText, orderId);
  const resolvedState = state === 'ready' && !order ? 'empty' : state;

  if (resolvedState !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, resolvedState, orderId);

    return (
      <BthWebPageFrame
        eyebrow={dshText.orderDetail.pageEyebrow}
        title={`${dshText.orderDetail.pageTitlePrefix} ${orderId}`}
        description={dshText.orderDetail.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(ordersHref)} />
      </BthWebPageFrame>
    );
  }

  if (!order) {
    return null;
  }

  const arrivalTimeline = getSampleDshOrderArrivalTimeline(dshText, orderId);
  const actionPlan = getSampleDshOrderActionPlan(dshText, orderId);

  return (
    <BthWebPageFrame
      eyebrow={dshText.orderDetail.pageEyebrow}
      title={`${dshText.orderDetail.pageTitlePrefix} ${order.id}`}
      description={dshText.orderDetail.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
          badges={[order.id, order.statusLabel, order.eta]}
          eyebrow={dshText.orderDetail.heroEyebrow}
          title={order.customer}
          description={order.route}
          metaItems={[
            `${dshText.orderDetail.signals.amount}: ${order.amount}`,
            `Created: ${order.createdLabel}`,
            `Captain: ${order.captainLabel}`,
          ]}
          primaryAction={{ label: actionPlan.primaryLabel, href: hubHref }}
          secondaryAction={{ label: dshText.orderDetail.backToOrders, href: ordersHref }}
        />

        <div className={styles.signalGrid}>
          <BthWebSignalCard title={dshText.orderDetail.signals.status} value={order.statusLabel} description={dshText.orderDetail.signals.statusDescription} tone="best" />
          <BthWebSignalCard title={dshText.orderDetail.signals.destination} value={order.destinationLabel} description={dshText.orderDetail.signals.destinationDescription} />
          <BthWebSignalCard title={dshText.orderDetail.signals.eta} value={order.eta} description={dshText.orderDetail.signals.etaDescription} />
          <BthWebSignalCard title={dshText.orderDetail.signals.amount} value={order.amount} description={dshText.orderDetail.signals.amountDescription} />
        </div>

        <BthWebSectionCard title={dshText.orderDetail.identityTitle} description={dshText.orderDetail.identityDescription}>
          <div className={styles.cardGrid}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.routeLabel}</BthText>
              <BthText role="bodySm" tone="muted">{order.route}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.finalDestinationLabel}</BthText>
              <BthText role="bodySm" tone="muted">{order.destinationLabel}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.noteLabel}</BthText>
              <BthText role="bodySm" tone="muted">{order.notes}</BthText>
            </BthBox>
          </div>
        </BthWebSectionCard>

        <BthWebSectionCard title={dshText.orderDetail.arrivalTitle} description={dshText.orderDetail.arrivalDescription}>
          <div className={styles.cardGrid}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.arrivedLabel}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.arrivedLabel ?? dshText.orderDetail.noArrivalData}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.ringLogLabel}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline ? `${arrivalTimeline.ringCount} ${dshText.orderDetail.ringAttempts}, ${arrivalTimeline.lastRingLabel}` : dshText.orderDetail.noRingsYet}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.acknowledgementLabel}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.acknowledgedLabel ?? dshText.orderDetail.noAcknowledgementYet}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.cooldownLabel}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.cooldownLabel ?? dshText.orderDetail.unavailable}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.blockReason ?? dshText.orderDetail.noCurrentBlock}</BthText>
            </BthBox>
          </div>
        </BthWebSectionCard>

        <BthWebSectionCard title={dshText.orderDetail.decisionTitle} description={dshText.orderDetail.decisionDescription}>
          <div className={styles.cardGrid}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.primaryActionLabel}</BthText>
              <BthText role="bodySm">{actionPlan.primaryLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.primaryDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.secondaryActionLabel}</BthText>
              <BthText role="bodySm">{actionPlan.secondaryLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.secondaryDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">{dshText.orderDetail.supportPathLabel}</BthText>
              <BthText role="bodySm">{actionPlan.supportLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.supportDescription}</BthText>
            </BthBox>
          </div>
          <div className={`${styles.actionRow} ${styles.actionRowSpaced}`}>
            <BthButton label={dshText.orderDetail.openArrivalBellWorkspace} tone="secondary" fullWidth={false} onPress={() => router.push(arrivalBellHref)} />
            <BthButton label={dshText.orderDetail.openReassignWorkspace} tone="secondary" fullWidth={false} onPress={() => router.push(reassignHref)} />
            {!embedded ? <BthButton label={actionPlan.supportLabel} tone="secondary" fullWidth={false} onPress={() => router.push(supportHref)} /> : null}
          </div>
        </BthWebSectionCard>
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshOrderDetailScreen;