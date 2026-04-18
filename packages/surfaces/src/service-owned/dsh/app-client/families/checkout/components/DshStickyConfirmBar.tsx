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
        <BthBox layoutDirection="row" gap={2}>
          <BthBox>
            <BthText role="caption" tone="muted">{totalLabel}</BthText>
            <BthText role="titleLg">{totalValue}</BthText>
          </BthBox>
          <BthBox>
            <BthButton label={processing ? 'جارٍ المعالجة…' : primaryLabel} onPress={onPrimary} />
          </BthBox>
        </BthBox>
        {onSecondary ? (
          <BthButton label={secondaryLabel} tone="secondary" onPress={onSecondary} />
        ) : null}
      </BthBox>
    </BthSurface>
  );
}
