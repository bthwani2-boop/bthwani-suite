import React from 'react';
import { Box, Icon, ListItem, MobileScrollView, Surface, TopBar } from '@bthwani/ui-kit';
import { resolveFieldStoreLifecycleLabel, resolveFieldStoreStatusLabel, type FieldStoreFile } from '../stores/dshFieldStoresModel';

type FieldHistoryScreenProps = {
  stores: readonly FieldStoreFile[];
  onBack: () => void;
};

export function FieldHistoryScreen({ stores, onBack }: FieldHistoryScreenProps) {
  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="السجل"
          subtitle="آخر حالة لكل ملف انضمام"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
        />

        <Surface tone="raised" padding={0} gap={0} radiusToken="xl">
          {stores.map((store) => (
            <ListItem
              key={store.id}
              title={store.name}
              subtitle={resolveFieldStoreLifecycleLabel(store)}
              meta={`${resolveFieldStoreStatusLabel(store)} · ${store.lastUpdatedLabel}`}
              badgeLabel={store.financeLabel}
            />
          ))}
        </Surface>
      </MobileScrollView>
    </Box>
  );
}

export default FieldHistoryScreen;
