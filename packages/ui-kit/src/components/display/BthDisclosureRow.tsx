import React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { BthBox, BthSurface, BthText } from '../../primitives';

export type BthDisclosureRowProps = {
  title: string;
  subtitle?: string;
  expanded?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BthDisclosureRow({ title, subtitle, expanded = false, onPress, children, style }: BthDisclosureRowProps) {
  return (
    <BthSurface
      tone={expanded ? 'raised' : 'default'}
      padding={2}
      gap={expanded ? 2 : 1}
      style={style}
    >
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onPress}>
        <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
          <BthBox gap={1} style={{ flex: 1 }}>
            <BthText role="bodyStrong" numberOfLines={1}>
              {title}
            </BthText>
            {subtitle ? (
              <BthText role="bodySm" tone="muted" numberOfLines={1}>
                {subtitle}
              </BthText>
            ) : null}
          </BthBox>

          <BthText role="bodyStrong" tone={expanded ? 'brand' : 'soft'}>
            {expanded ? '▾' : '▸'}
          </BthText>
        </BthBox>
      </Pressable>

      {expanded ? <BthBox gap={1}>{children}</BthBox> : null}
    </BthSurface>
  );
}

export default BthDisclosureRow;