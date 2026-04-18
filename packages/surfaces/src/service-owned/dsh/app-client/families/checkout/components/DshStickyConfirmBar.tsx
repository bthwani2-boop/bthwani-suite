import React from 'react';
import { BthBox, BthButton, BthSurface, BthText } from '@bthwani/ui-kit';

export type DshStickyConfirmBarProps = {
  totalLabel?: string;
  totalValue?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  processing?: boolean;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export default function DshStickyConfirmBar({
  totalLabel = 'المجموع',
  totalValue,
  primaryLabel = 'تأكيد ودفع',
  secondaryLabel = 'تعديل',
  processing,
  onPrimary,
  onSecondary,
}: DshStickyConfirmBarProps) {
  return (
    <BthSurface tone="inset" gap={3}>
      <BthBox gap={2}>
        <BthBox layoutDirection="row" justify="flex-end">
          <BthBox>
            <BthText role="caption" tone="muted">{totalLabel}</BthText>
            <BthText role="titleLg">{totalValue}</BthText>
          </BthBox>
        </BthBox>

        <BthBox align="center">
          <BthButton
            label={processing ? 'جارٍ المعالجة…' : primaryLabel}
            onPress={onPrimary}
            size="lg"
            fullWidth={false}
            style={{ width: '78%' }}
          />
        </BthBox>

        {onSecondary ? (
          <BthBox>
            <BthButton label={secondaryLabel} tone="secondary" onPress={onSecondary} />
          </BthBox>
        ) : null}
      </BthBox>
    </BthSurface>
  );
}
