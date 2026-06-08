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

export type DshListingStatusUpdateScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

const LISTING_STATUSES = [
  { id: 'active', name: 'نشط', desc: 'المنتج يظهر للعملاء ومتاح للشراء فوراً', tone: 'success' },
  { id: 'hidden', name: 'مخفي', desc: 'المنتج لا يظهر في الكتالوج للعملاء', tone: 'warning' },
  { id: 'unavailable', name: 'غير متوفر مؤقتًا', desc: 'المنتج يظهر لكنه معلم كغير متوفر', tone: 'danger' },
] as const;

export function DshListingStatusUpdateScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshListingStatusUpdateScreenProps) {
  const { theme } = useTheme();
  const [selectedStatusId, setSelectedStatusId] = React.useState<'active' | 'hidden' | 'unavailable'>('active');

  const handleConfirm = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="حالة إدراج الكتالوج"
        subtitle="تحديث وتعديل حالة إظهار المنتج للعملاء"
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
          يرجى تحديد حالة ظهور المنتج في كتالوج المتجر للعملاء.
        </Text>

        <Box gap={3}>
          {LISTING_STATUSES.map((status) => {
            const isSelected = selectedStatusId === status.id;
            return (
              <ListItem
                key={status.id}
                title={status.name}
                subtitle={status.desc}
                badgeLabel={isSelected ? 'محدد حالياً' : undefined}
                badgeTone={status.tone}
                onPress={() => setSelectedStatusId(status.id)}
              />
            );
          })}
        </Box>

        <Box gap={3} style={{ marginTop: spacing[4] }}>
          <Button
            tone="primary"
            label="تأكيد وتحديث الحالة"
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

export default DshListingStatusUpdateScreen;
