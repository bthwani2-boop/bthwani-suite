import React from 'react';
import { View } from 'react-native';
import { Badge, Box, Card, Icon, Surface, Text, useDirection } from '@bthwani/ui-kit';
import {
  resolveFieldCompletionPercent,
  resolveFieldStoreLifecycleLabel,
  resolveFieldStoreNextActionLabel,
  resolveFieldStoreStatusLabel,
  resolveFieldStoreStatusTone,
  type FieldStoreFile,
} from '../data/field-stores.preview-data';

type FieldStoreCardProps = {
  store: FieldStoreFile;
  onPress: () => void;
};

export function FieldStoreCard({ store, onPress }: FieldStoreCardProps) {
  const { direction } = useDirection();
  const progress = resolveFieldCompletionPercent(store.draft);

  return (
    <Card
      tone="raised"
      padding={4}
      gap={3}
      onPress={onPress}
      style={{ borderWidth: 1, borderColor: 'rgba(255, 80, 13, 0.16)' }}
    >
      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Box gap={2} style={{ flex: 1, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge label={resolveFieldStoreStatusLabel(store)} tone={resolveFieldStoreStatusTone(store)} />
            <Badge label={`اكتمال ${progress}%`} tone="brand" />
          </View>
          <Text role="titleSm" style={{ textAlign: 'right' }}>{store.name}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{store.location}</Text>
        </Box>

        <Surface tone="brand" padding={2} radiusToken="pill" border={false}>
          <Icon name="arrow-forward" size={20} color="#FFFFFF" />
        </Surface>
      </View>

      <Box gap={1} style={{ alignItems: 'flex-end' }}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>المرحلة الحالية</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{store.stageLabelOverride ?? resolveFieldStoreLifecycleLabel(store)}</Text>
      </Box>

      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 12, flexWrap: 'wrap' }}>
        <Box gap={1} style={{ flex: 1, minWidth: 128, alignItems: 'flex-end' }}>
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>الخطوة التالية</Text>
          <Text role="bodySm" style={{ textAlign: 'right' }}>{resolveFieldStoreNextActionLabel(store)}</Text>
        </Box>
        <Box gap={1} style={{ flex: 1, minWidth: 128, alignItems: 'flex-end' }}>
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>آخر تحديث / موعد</Text>
          <Text role="bodySm" style={{ textAlign: 'right' }}>{store.lastUpdatedLabel} · {store.nextVisitLabel}</Text>
        </Box>
      </View>
    </Card>
  );
}

export default FieldStoreCard;
