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
import { ControlPanelDshOrderChatScreen } from '../orderchat';
import { ControlPanelDshDecisionBoard } from '../../shared';
import { useDshControlPanelText } from '../shared/dshControlPanelText';
import { ControlPanelDshOrderDetailScreen } from './ControlPanelDshOrderDetailScreen';
import { getSampleDshOrders } from './order-fixtures';
import styles from '../dsh-surface.module.css';

type ControlPanelDshOrdersScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
type OrdersOverlayMode = 'detail' | 'chat';

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
  initialSelectedOrderId?: string | null;
  initialOverlayMode?: OrdersOverlayMode | null;
};

export function ControlPanelDshOrdersScreen({
  state = 'ready',
  hubHref = '/operations',
  operationsHref = '/operations',
  embedded = false,
  showHeader = true,
  initialSelectedOrderId = null,
  initialOverlayMode = null,
}: ControlPanelDshOrdersScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const orders = React.useMemo(() => getSampleDshOrders(dshText), [dshText]);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(initialSelectedOrderId);
  const [overlayMode, setOverlayMode] = React.useState<OrdersOverlayMode>(initialOverlayMode ?? 'detail');
  const assignedCount = orders.filter((order) => order.statusTone === 'success').length;
  const openCount = orders.filter((order) => order.statusTone === 'brand').length;
  const reviewCount = orders.filter((order) => order.statusTone === 'warning').length;

  React.useEffect(() => {
    setSelectedOrderId(initialSelectedOrderId);
  }, [initialSelectedOrderId]);

  React.useEffect(() => {
    if (initialOverlayMode) {
      setOverlayMode(initialOverlayMode);
    }
  }, [initialOverlayMode]);

  const selectedOrderLabel = selectedOrderId ?? dshText.orders.openDetail;
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;
  const handleOpenOrderDetail = React.useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setOverlayMode('detail');
  }, []);

  const handleOpenOrderChat = React.useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setOverlayMode('chat');
  }, []);

  const handleCloseSheet = React.useCallback(() => {
    setSelectedOrderId(null);
    setOverlayMode('detail');
  }, []);

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
        <ControlPanelDshDecisionBoard
          title="Orders decision board"
          purpose="Keep queue, detail, and chat decisions on one compact operational surface."
          primaryDecision={selectedOrder ? `${selectedOrder.id} · ${selectedOrder.statusLabel}` : 'Select an order to continue'}
          nextAction={selectedOrder ? (overlayMode === 'chat' ? 'Open the chat overlay' : 'Open order detail') : 'Choose an order from the queue'}
          blockers={selectedOrder ? selectedOrder.statusLabel : 'No selected order'}
          ownerSurface="operations"
          evidenceHint="selected order, timeline, and overlay context"
          routeHint="/operations?workspace=orders"
          decisionTone={selectedOrder?.statusTone === 'danger' ? 'danger' : selectedOrder?.statusTone === 'success' ? 'best' : 'warning'}
        />

        <WebMissionHeroCard
          badges={['/operations?workspace=orders', dshText.common.live, `${dshText.orders.badgesLabel}: ${orders.length}`]}
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
                    onPress={() => handleOpenOrderDetail(order.id)}
                  />
                </Box>
              </Box>
            ))}
          </div>
        </WebSectionCard>
        <SheetFrame
          visible={!!selectedOrderId}
          title={selectedOrderId ? `${overlayMode === 'chat' ? 'تواصل الطلب' : dshText.orders.openDetail}: ${selectedOrderLabel}` : dshText.orders.openDetail}
          onClose={handleCloseSheet}
        >
          {selectedOrderId ? (
            overlayMode === 'chat' ? (
              <ControlPanelDshOrderChatScreen
                embedded
                showHeader={false}
                orderId={selectedOrderId}
                ordersHref="/operations?workspace=orders"
              />
            ) : (
              <ControlPanelDshOrderDetailScreen
                embedded
                showHeader={false}
                orderId={selectedOrderId}
                hubHref="/operations"
                ordersHref="/operations?workspace=orders"
                onOpenOrderChat={handleOpenOrderChat}
              />
            )
          ) : null}
        </SheetFrame>
      </div>
    </WebPageFrame>
  );
}

export default ControlPanelDshOrdersScreen;
