import React from 'react';
import { Pressable, View } from 'react-native';
import { Badge, Box, colorPalette, Icon, Text, useDirection, useTheme, withAlpha,
  radius,
  spacing,
} from '@bthwani/ui-kit';
import {
  resolveFieldCompletionPercent,
  resolveFieldStoreLifecycleLabel,
  resolveFieldStoreNextActionLabel,
  resolveFieldStoreStatusLabel,
  resolveFieldStoreStatusTone,
  type FieldStoreFile,
} from '../../shared';

type FieldStoreCardProps = {
  store: FieldStoreFile;
  onPress: () => void;
};

export function FieldStoreCard({ store, onPress }: FieldStoreCardProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const progress = resolveFieldCompletionPercent(store.draft);

  return (
    <Pressable onPress={onPress}>
      <Box
        paddingY={3}
        gap={3}
        style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
          <Box gap={2} style={{ flex: 1, alignItems: 'flex-end' }}>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: spacing[2] }}>
              <Badge label={resolveFieldStoreStatusLabel(store)} tone={resolveFieldStoreStatusTone(store)} />
              <Badge label={`اكتمال ${progress}%`} tone="brand" />
            </View>
            <Text role="titleSm" style={{ textAlign: 'right' }}>{store.name}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{store.location}</Text>
          </Box>

          <View style={{ backgroundColor: colorPalette.brand, padding: spacing[2], borderRadius: radius.pill }}>
            <Icon name="arrow-forward" size={16} color={colorPalette.white} />
          </View>
        </View>

        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>المرحلة الحالية</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{store.stageLabelOverride ?? resolveFieldStoreLifecycleLabel(store)}</Text>
        </Box>

        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: spacing[3], flexWrap: 'wrap' }}>
          <Box gap={1} style={{ flex: 1, minWidth: 128, alignItems: 'flex-end' }}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>الخطوة التالية</Text>
            <Text role="bodySm" style={{ textAlign: 'right' }}>{resolveFieldStoreNextActionLabel(store)}</Text>
          </Box>
          <Box gap={1} style={{ flex: 1, minWidth: 128, alignItems: 'flex-end' }}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>آخر تحديث / موعد</Text>
            <Text role="bodySm" style={{ textAlign: 'right' }}>{store.lastUpdatedLabel} · {store.nextVisitLabel}</Text>
          </Box>
        </View>
      </Box>
    </Pressable>
  );
}

export default FieldStoreCard;
