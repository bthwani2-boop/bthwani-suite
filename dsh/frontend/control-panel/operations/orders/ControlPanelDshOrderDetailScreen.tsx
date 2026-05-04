'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { Box,
  Button,
  StateView,
  Text
} from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from '../../shared';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
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
  onOpenOrderChat?: (orderId: string) => void;
};

export function ControlPanelDshOrderDetailScreen({
  orderId,
  state = 'ready',
  ordersHref = '/operations?workspace=orders',
  hubHref = '/operations',
  supportHref = '/support',
  arrivalBellHref = '/operations?workspace=bell',
  reassignHref = '/operations?workspace=reassign',
  embedded = false,
  showHeader = true,
  onOpenOrderChat,
}: ControlPanelDshOrderDetailScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const order = getSampleDshOrder(dshText, orderId);
  const resolvedState = state === 'ready' && !order ? 'empty' : state;

  if (resolvedState !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, resolvedState, orderId);

    return (
      <WebPageFrame
        eyebrow={dshText.orderDetail.pageEyebrow}
        title={`${dshText.orderDetail.pageTitlePrefix} ${orderId}`}
        description={dshText.orderDetail.unavailableDescription}
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <StateView {...stateCopy} onActionPress={() => router.push(ordersHref)} />
      </WebPageFrame>
    );
  }

  if (!order) {
    return null;
  }

  const arrivalTimeline = getSampleDshOrderArrivalTimeline(dshText, orderId);
  const actionPlan = getSampleDshOrderActionPlan(dshText, orderId);

  return (
    <WebPageFrame
      eyebrow={dshText.orderDetail.pageEyebrow}
      title={`${dshText.orderDetail.pageTitlePrefix} ${order.id}`}
      description={dshText.orderDetail.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <ControlPanelDshDecisionBoard
          title="Order detail board"
          purpose="Keep the order decision, blocker, and next step visible before any handoff."
          primaryDecision={actionPlan.primaryLabel}
          nextAction={actionPlan.secondaryLabel}
          blockers={order.notes}
          ownerSurface="operations"
          evidenceHint={`${order.statusLabel} · ${order.captainLabel} · ${order.createdLabel}`}
          routeHint={ordersHref}
          decisionTone={order.statusTone === 'success' ? 'best' : 'warning'}
        />

        <WebMissionHeroCard
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
          <WebSignalCard title={dshText.orderDetail.signals.status} value={order.statusLabel} description={dshText.orderDetail.signals.statusDescription} tone="best" />
          <WebSignalCard title={dshText.orderDetail.signals.destination} value={order.destinationLabel} description={dshText.orderDetail.signals.destinationDescription} />
          <WebSignalCard title={dshText.orderDetail.signals.eta} value={order.eta} description={dshText.orderDetail.signals.etaDescription} />
          <WebSignalCard title={dshText.orderDetail.signals.amount} value={order.amount} description={dshText.orderDetail.signals.amountDescription} />
        </div>

        <WebSectionCard title={dshText.orderDetail.identityTitle} description={dshText.orderDetail.identityDescription}>
          <div className={styles.cardGrid}>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.routeLabel}</Text>
              <Text role="bodySm" tone="muted">{order.route}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.finalDestinationLabel}</Text>
              <Text role="bodySm" tone="muted">{order.destinationLabel}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.noteLabel}</Text>
              <Text role="bodySm" tone="muted">{order.notes}</Text>
            </Box>
          </div>
        </WebSectionCard>

        <WebSectionCard title={dshText.orderDetail.arrivalTitle} description={dshText.orderDetail.arrivalDescription}>
          <div className={styles.cardGrid}>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.arrivedLabel}</Text>
              <Text role="bodySm" tone="muted">{arrivalTimeline?.arrivedLabel ?? dshText.orderDetail.noArrivalData}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.ringLogLabel}</Text>
              <Text role="bodySm" tone="muted">{arrivalTimeline ? `${arrivalTimeline.ringCount} ${dshText.orderDetail.ringAttempts}, ${arrivalTimeline.lastRingLabel}` : dshText.orderDetail.noRingsYet}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.acknowledgementLabel}</Text>
              <Text role="bodySm" tone="muted">{arrivalTimeline?.acknowledgedLabel ?? dshText.orderDetail.noAcknowledgementYet}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.cooldownLabel}</Text>
              <Text role="bodySm" tone="muted">{arrivalTimeline?.cooldownLabel ?? dshText.orderDetail.unavailable}</Text>
              <Text role="bodySm" tone="muted">{arrivalTimeline?.blockReason ?? dshText.orderDetail.noCurrentBlock}</Text>
            </Box>
          </div>
        </WebSectionCard>

        <WebSectionCard title={dshText.orderDetail.decisionTitle} description={dshText.orderDetail.decisionDescription}>
          <div className={styles.cardGrid}>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.primaryActionLabel}</Text>
              <Text role="bodySm">{actionPlan.primaryLabel}</Text>
              <Text role="bodySm" tone="muted">{actionPlan.primaryDescription}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.secondaryActionLabel}</Text>
              <Text role="bodySm">{actionPlan.secondaryLabel}</Text>
              <Text role="bodySm" tone="muted">{actionPlan.secondaryDescription}</Text>
            </Box>
            <Box padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <Text role="bodyStrong">{dshText.orderDetail.supportPathLabel}</Text>
              <Text role="bodySm">{actionPlan.supportLabel}</Text>
              <Text role="bodySm" tone="muted">{actionPlan.supportDescription}</Text>
            </Box>
          </div>
          <div className={`${styles.actionRow} ${styles.actionRowSpaced}`}>
            <Button label={dshText.orderDetail.openArrivalBellWorkspace} tone="secondary" fullWidth={false} onPress={() => router.push(arrivalBellHref)} />
            <Button label={dshText.orderDetail.openReassignWorkspace} tone="secondary" fullWidth={false} onPress={() => router.push(reassignHref)} />
            {!embedded ? <Button label={actionPlan.supportLabel} tone="secondary" fullWidth={false} onPress={() => router.push(supportHref)} /> : null}
          </div>
        </WebSectionCard>

        <WebSectionCard title="تواصل الطلب" description="افتح المسار المختصر للمحادثة المرتبطة بنفس الطلب.">
          <Box gap={2}>
            <Text role="bodySm" tone="muted">
              الرسائل المختصرة والمرفقات الخفيفة تبقى داخل orderchat حتى الإغلاق.
            </Text>
            <Button
              label="فتح تواصل الطلب"
              tone="secondary"
              fullWidth={false}
              onPress={() => {
                if (onOpenOrderChat) {
                  onOpenOrderChat(order.id);
                  return;
                }

                router.push(`${ordersHref}/${order.id}/orderchat`);
              }}
            />
          </Box>
        </WebSectionCard>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshOrderDetailScreen;
