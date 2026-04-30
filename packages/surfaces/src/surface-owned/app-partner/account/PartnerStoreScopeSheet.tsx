import React from 'react';
import { Box, Button, Icon, SheetFrame, Text } from '@bthwani/ui-kit';

export type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

type PartnerStoreScopeSheetProps = {
  visible: boolean;
  onClose: () => void;
  options: readonly PartnerStoreScopeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function PartnerStoreScopeSheet({
  visible,
  onClose,
  options,
  selectedId,
  onSelect,
}: PartnerStoreScopeSheetProps) {
  return (
    <SheetFrame visible={visible} title="اختيار المتجر أو الفرع" onClose={onClose}>
      <Text role="bodySm" tone="muted">
        اختر نطاق العمل الذي تريد تشغيله الآن داخل لوحة الشريك.
      </Text>

      <Box gap={2}>
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <Button
              key={option.id}
              label={option.label}
              tone={selected ? 'primary' : 'secondary'}
              leadingAccessory={<Icon name="storefront-outline" size={16} color={selected ? '#FFFFFF' : '#0A2F5C'} />}
              trailingAccessory={selected ? <Icon name="checkmark-circle" size={16} color="#FFFFFF" /> : undefined}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
            />
          );
        })}
      </Box>
    </SheetFrame>
  );
}

export default PartnerStoreScopeSheet;
