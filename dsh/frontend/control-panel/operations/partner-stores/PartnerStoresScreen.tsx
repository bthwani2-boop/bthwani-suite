'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { PARTNER_STORES_PREVIEW } from '../operations.preview-data';

export type PartnerStoresScreenProps = { hubHref: string; };

export function PartnerStoresScreen({ hubHref }: PartnerStoresScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(PARTNER_STORES_PREVIEW.stores[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>المتاجر والشركاء</Text>
        <Text role="bodySm" tone="muted">متابعة جاهزية المتاجر وضغط التجهيز</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة المتاجر"
        purpose="مراقبة جاهزية الشركاء لتنفيذ الطلبات"
        items={PARTNER_STORES_PREVIEW.stores as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default PartnerStoresScreen;
