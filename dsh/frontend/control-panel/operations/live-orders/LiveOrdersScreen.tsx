'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { LIVE_ORDERS_PREVIEW } from '../operations.preview-data';

export type LiveOrdersScreenProps = { hubHref: string; };

export function LiveOrdersScreen({ hubHref }: LiveOrdersScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(LIVE_ORDERS_PREVIEW.orders[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الطلبات الحية</Text>
        <Text role="bodySm" tone="muted">قائمة الطلبات وتفاصيل التنفيذ والدردشة</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة الطلبات"
        purpose="مراقبة الطلبات الحية وتوجيهها للمسار الصحيح"
        items={LIVE_ORDERS_PREVIEW.orders as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=command-center')}
        evidenceAction={() => window.location.assign('/operations?workspace=audit-support-sla')}
      />
    </Box>
  );
}

export default LiveOrdersScreen;
