import React from 'react';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';

export type ControlPanelDshActionQueueItem = {
  id: string;
  title: string;
  status: string;
  ownerSurface: string;
  blocker: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  evidenceActionLabel: string;
  tone?: React.ComponentProps<typeof WebSignalCard>['tone'];
};

export type ControlPanelDshActionQueueProps = {
  title: string;
  purpose: string;
  items: readonly ControlPanelDshActionQueueItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  primaryAction: (item: ControlPanelDshActionQueueItem) => void;
  secondaryAction: (item: ControlPanelDshActionQueueItem) => void;
  evidenceAction: (item: ControlPanelDshActionQueueItem) => void;
  emptyLabel?: string;
};

export function ControlPanelDshActionQueue({
  title,
  purpose,
  items,
  selectedId,
  onSelect,
  primaryAction,
  secondaryAction,
  evidenceAction,
  emptyLabel = 'No items available',
}: ControlPanelDshActionQueueProps) {
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0] ?? null;

  return (
    <WebSectionCard title={title} description={purpose}>
      <Box gap={3}>
        <Box gap={2}>
          {items.length ? items.map((item) => (
            <Box key={item.id} padding={3} gap={2} border radiusToken="xl" background={item.id === selectedItem?.id ? 'surfaceRaised' : 'surfaceInset'}>
              <Box layoutDirection="row" justify="space-between" align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Text role="bodyStrong">{item.title}</Text>
                <WebSignalCard title="Status" value={item.status} description={item.ownerSurface} tone={item.tone} />
              </Box>
              <Text role="bodySm" tone="muted">{item.blocker}</Text>
              <Text role="caption" tone="muted">{item.evidence}</Text>
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Button label={item.primaryActionLabel} tone="primary" fullWidth={false} onPress={() => primaryAction(item)} />
                <Button label={item.secondaryActionLabel} tone="secondary" fullWidth={false} onPress={() => secondaryAction(item)} />
                <Button label={item.evidenceActionLabel} tone="ghost" fullWidth={false} onPress={() => evidenceAction(item)} />
                <Button label={item.id === selectedItem?.id ? 'Selected' : 'Select'} tone="ghost" fullWidth={false} onPress={() => onSelect(item.id)} />
              </Box>
            </Box>
          )) : <Text role="bodySm" tone="muted">{emptyLabel}</Text>}
        </Box>
      </Box>
    </WebSectionCard>
  );
}

export default ControlPanelDshActionQueue;
