import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { BthBox, BthSurface, BthText } from '../../primitives';
import { BthButton } from '../actions/BthButton';

export type BthOptionRowProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthOptionRow({ title, subtitle, actionLabel, onAction, style }: BthOptionRowProps) {
  return (
    <BthSurface tone="inset" padding={2} gap={0} style={style}>
      <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
        <BthBox gap={1} style={{ flex: 1 }}>
          <BthText role="bodyStrong" numberOfLines={1}>
            {title}
          </BthText>
          {subtitle ? (
            <BthText role="bodySm" tone="muted" numberOfLines={2}>
              {subtitle}
            </BthText>
          ) : null}
        </BthBox>

        {actionLabel ? <BthButton label={actionLabel} size="sm" tone="secondary" fullWidth={false} onPress={onAction} /> : null}
      </BthBox>
    </BthSurface>
  );
}
