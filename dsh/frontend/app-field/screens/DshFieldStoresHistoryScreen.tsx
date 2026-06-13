import React from 'react';
import { View } from 'react-native';
import { Badge, Box, Divider, Icon, MobileScrollView, Text, TopBar, useTheme,
  spacing,
} from '@bthwani/ui-kit';
import { resolveFieldStoreLifecycleLabel, resolveFieldStoreStatusLabel, type FieldStoreFile } from '../../shared/contracts/field-store-model';

type DshFieldStoresHistoryScreenProps = {
  stores: readonly FieldStoreFile[];
  onBack: () => void;
};

export function DshFieldStoresHistoryScreen({ stores, onBack }: DshFieldStoresHistoryScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="سجل المتاجر"
        subtitle="آخر حالة لكل متجر مرتبط بالميدان"
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 96 }}>
        <Box padding={4} gap={0}>
          {stores.map((store, index) => (
            <View key={store.id}>
              {index > 0 && <Divider style={{ marginVertical: 8 }} />}
              <Box gap={2} paddingY={2}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                  <View style={{ flex: 1, gap: 3, alignItems: 'flex-end' }}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                      {store.name}
                    </Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                      {resolveFieldStoreLifecycleLabel(store)}
                    </Text>
                    <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                      {`${resolveFieldStoreStatusLabel(store)} · ${store.lastUpdatedLabel}`}
                    </Text>
                  </View>
                  {store.financeLabel ? (
                    <Badge label={store.financeLabel} tone="brand" />
                  ) : null}
                </View>
              </Box>
            </View>
          ))}
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshFieldStoresHistoryScreen;
