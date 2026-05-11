import React from 'react';
import { View } from 'react-native';
import { Box, Icon, MobileScrollView, Surface, Text, TopBar, safeArea, spacing } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';

type DshPreferencesScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

import { dshPreferenceCards } from '../data/preferences.preview-data';

export type DshPreferencesScreenProps = {
  state?: DshPreferencesScreenState;
  onBack?: () => void;
  onRetry?: () => void;
};


export function PreferencesScreen({ state = 'ready', onBack, onRetry }: DshPreferencesScreenProps) {
  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="تفضيلات التوصيل"
        subtitle="إعدادات خاصة بخدمة DSH فقط"
        onRetry={onRetry}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        variant="surface"
        title="تفضيلات التوصيل"
        trailingAction={onBack ? { id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'رجوع', onPress: onBack } : undefined}
      />

      <MobileScrollView fill padding={2} gap={2} contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}>
        <Surface tone="raised" padding={2} gap={2}>
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm">إعدادات DSH الخاصة بالتوصيل</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              هذه التفضيلات تخص تعليمات التسليم والاستبدال والتنبيهات داخل DSH فقط، ولا تشمل الحساب أو المحفظة أو الأمان.
            </Text>
          </Box>
        </Surface>

        {dshPreferenceCards.map((card) => (
          <Surface key={card.id} tone="raised" padding={2} gap={1}>
            <Box gap={1} style={{ alignItems: 'flex-end' }}>
              <Text role="bodyStrong">{card.title}</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {card.description}
              </Text>
              <Text role="label" style={{ textAlign: 'right' }}>
                {card.value}
              </Text>
            </Box>
          </Surface>
        ))}
      </MobileScrollView>
    </View>
  );
}
