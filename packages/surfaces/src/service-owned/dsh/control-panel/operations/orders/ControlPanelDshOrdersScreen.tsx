'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, StateView, Text, SheetFrame } from '@bthwani/ui-kit';
import {
  WebMissionHeroCard,
  WebPageFrame,
  WebSectionCard,
  WebSignalCard,
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
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const assignedCount = orders.filter((order) => order.statusTone === 'success').length;
  const openCount = orders.filter((order) => order.statusTone === 'brand').length;
  const reviewCount = orders.filter((order) => order.statusTone === 'warning').length;

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(dshText, state);

    return (
      <WebPageFrame
        eyebrow={dshText.orders.pageEyebrow}
        title={dshText.orders.pageTitle}
        description={dshText.orders.pageDescription}
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
      eyebrow={dshText.orders.pageEyebrow}
      title={dshText.orders.pageTitle}
      description={dshText.orders.pageDescription}
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <div className={styles.stack}>
        <WebMissionHeroCard
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
          <WebSignalCard title={dshText.orders.assignedTitle} value={String(assignedCount)} description={dshText.orders.assignedDescription} tone="best" />
          <WebSignalCard title={dshText.orders.newTitle} value={String(openCount)} description={dshText.orders.newDescription} />
          <WebSignalCard title={dshText.orders.reviewTitle} value={String(reviewCount)} description={dshText.orders.reviewDescription} />
        </div>

        <WebSectionCard title={dshText.orders.listTitle} description={dshText.orders.listDescription}>
          <div className={styles.cardGrid}>
            {orders.map((order) => (
              <Box key={order.id} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="bodyStrong">{order.id}</Text>
                  <Text role="caption" tone={order.statusTone}>
                    {order.statusLabel}
                  </Text>
                </Box>
                <Text role="bodySm" tone="muted">{order.customer}</Text>
                <Text role="bodySm" tone="muted">{order.route}</Text>
                <Box layoutDirection="row" justify="space-between" align="center">
                  <Text role="caption" tone="soft">
                    {dshText.orders.etaPrefix} {order.eta}
                  </Text>
                  <Text role="caption" tone="soft">{order.amount}</Text>
                </Box>
                <Text role="caption" tone="soft">{order.destinationLabel}</Text>
                <Box>
                  <Button
                    label={dshText.orders.openDetail}
                    tone="ghost"
                    onPress={() => setSelectedOrderId(order.id)}
                  />
                </Box>
              </Box>
            ))}
          </div>
        </WebSectionCard>
        <SheetFrame
          visible={!!selectedOrderId}
          title={selectedOrderId ? `${dshText.orders.openDetail}: ${selectedOrderId}` : dshText.orders.openDetail}
          onClose={() => setSelectedOrderId(null)}
        >
          {selectedOrderId ? (
            <ControlPanelDshOrderDetailScreen embedded showHeader={false} orderId={selectedOrderId} hubHref="/operations" ordersHref="/operations/dsh/orders" />
          ) : null}
        </SheetFrame>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshOrdersScreen;



