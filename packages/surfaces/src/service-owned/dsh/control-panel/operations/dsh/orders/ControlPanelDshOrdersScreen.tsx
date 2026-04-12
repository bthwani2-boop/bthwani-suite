'use client';

import React from 'react';
import {
  useRouter } from 'next/navigation';
import { BthBox,
  BthButton,
  BthStateView,
  BthText
} from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
import { getSampleDshOrders } from './order-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshOrdersScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(text: ReturnType<typeof useDshControlPanelText>, state: Exclude<ControlPanelDshOrdersScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: text.orders.stateLoadingTitle,
      description: text.orders.stateLoadingDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: text.orders.stateEmptyTitle,
      description: text.orders.stateEmptyDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: text.orders.stateOfflineTitle,
      description: text.orders.stateOfflineDescription,
      actionLabel: text.common.backToHub,
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: text.orders.stateDisabledTitle,
      description: text.orders.stateDisabledDescription,
      actionLabel: text.common.backToHub,
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: text.orders.stateErrorTitle,
    description: text.orders.stateErrorDescription,
    actionLabel: text.common.backToHub,
  };
}

export type ControlPanelDshOrdersScreenProps = {
  state?: ControlPanelDshOrdersScreenState;
  hubHref?: string;
  operationsHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshOrdersScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshOrdersScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const orders = React.useMemo(() => getSampleDshOrders(dshText), [dshText]);
  const assignedCount = orders.filter((order) => order.statusTone === 'success').length;
  const openCount = orders.filter((order) => order.statusTone === 'brand').length;
  const reviewCount = orders.filter((order) => order.statusTone === 'warning').length;

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <BthWebPageFrame
        eyebrow={dshText.orders.pageEyebrow}
        title={dshText.orders.pageTitle}
        description={dshText.orders.pageDescription}
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
      eyebrow={dshText.orders.pageEyebrow}
      title={dshText.orders.pageTitle}
      description={dshText.orders.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/orders', dshText.common.live, `${dshText.orders.badgesLabel}: ${orders.length}`]}
          eyebrow={dshText.orders.heroEyebrow}
          title={dshText.orders.heroTitle}
          description={dshText.orders.heroDescription}
          metaItems={[
            `${dshText.orders.assignedTitle}: ${assignedCount}`,
            `${dshText.orders.newTitle}: ${openCount}`,
            `${dshText.orders.reviewTitle}: ${reviewCount}`,
          ]}
          primaryAction={{ label: dshText.common.backToHub, href: hubHref }}
          secondaryAction={{ label: dshText.common.operations, href: operationsHref }}
        />

        <div className={styles.signalGrid}>
          <BthWebSignalCard title={dshText.orders.assignedTitle} value={String(assignedCount)} description={dshText.orders.assignedDescription} tone="best" />
          <BthWebSignalCard title={dshText.orders.newTitle} value={String(openCount)} description={dshText.orders.newDescription} />
          <BthWebSignalCard title={dshText.orders.reviewTitle} value={String(reviewCount)} description={dshText.orders.reviewDescription} />
        </div>

        <BthWebSectionCard title={dshText.orders.listTitle} description={dshText.orders.listDescription}>
          <div className={styles.cardGrid}>
            {orders.map((order) => (
              <BthBox key={order.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{order.id}</BthText>
                  <BthText role="caption" tone={order.statusTone}>
                    {order.statusLabel}
                  </BthText>
                </BthBox>
                <BthText role="bodySm" tone="muted">{order.customer}</BthText>
                <BthText role="bodySm" tone="muted">{order.route}</BthText>
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="caption" tone="soft">
                    {dshText.orders.etaPrefix} {order.eta}
                  </BthText>
                  <BthText role="caption" tone="soft">{order.amount}</BthText>
                </BthBox>
                <BthText role="caption" tone="soft">{order.destinationLabel}</BthText>
                <BthBox>
                  <BthButton
                    label={dshText.orders.openDetail}
                    tone="ghost"
                    onPress={() => router.push(`/operations/dsh/orders/${order.id}`)}
                  />
                </BthBox>
              </BthBox>
            ))}
          </div>
        </BthWebSectionCard>
      </div>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshOrdersScreen;