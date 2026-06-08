import React from 'react';
import { View } from 'react-native';
import {
  Box,
  Button,
  Icon,
  ListItem,
  MobileScrollView,
  Text,
  TopBar,
  useTheme,
  spacing,
  safeArea,
} from '@bthwani/ui-kit';
import type { DshOperationScreenState } from '../parts/OperationScreen';

export type DshZoneSetScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

const RIYADH_ZONES = [
  { id: 'yasmin', name: 'حي الياسمين' },
  { id: 'malqa', name: 'حي الملقا' },
  { id: 'narjis', name: 'حي النرجس' },
  { id: 'sahafa', name: 'حي الصحافة' },
  { id: 'yarmouk', name: 'حي اليرموك' },
];

export function DshZoneSetScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshZoneSetScreenProps) {
  const { theme } = useTheme();
  const [selectedZoneId, setSelectedZoneId] = React.useState('yasmin');

  const handleConfirm = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="تحديد النطاق الجغرافي"
        subtitle="اختر نطاق العمل الميداني المعتمد بالرياض"
        actions={onSecondaryAction ? [{
          id: 'back',
          icon: <Icon name="chevron-back" mirrored size={18} />,
          accessibilityLabel: 'العودة',
          onPress: onSecondaryAction,
        }] : []}
      />

      <MobileScrollView
        fill
        padding={4}
        gap={4}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          يرجى تحديد المنطقة الجغرافية التي تغطيها عملياتك الحالية لتلقي الطلبات المناسبة.
        </Text>

        <Box gap={3}>
          {RIYADH_ZONES.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            return (
              <ListItem
                key={zone.id}
                title={zone.name}
                subtitle={isSelected ? 'النطاق النشط حالياً' : 'اضغط لتفعيل هذا النطاق'}
                badgeLabel={isSelected ? 'محدد' : undefined}
                badgeTone={isSelected ? 'brand' : undefined}
                onPress={() => setSelectedZoneId(zone.id)}
              />
            );
          })}
        </Box>

        <Box gap={3} style={{ marginTop: spacing[4] }}>
          <Button
            tone="primary"
            label="تأكيد النطاق المحدد"
            onPress={handleConfirm}
          />
          {onSecondaryAction && (
            <Button
              tone="secondary"
              label="إلغاء والعودة"
              onPress={onSecondaryAction}
            />
          )}
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshZoneSetScreen;
