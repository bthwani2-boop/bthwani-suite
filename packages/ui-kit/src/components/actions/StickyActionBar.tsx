import React from 'react';
import { View, Platform } from 'react-native';
import { BthButton } from './BthButton';
import { BthSurface } from '../../primitives';
import { spacing, safeArea } from '../../foundation/tokens';
import { BthText } from '../../primitives';

export type StickyActionBarProps = {
  primaryLabel: string;
  primaryOnPress: () => void;
  secondaryLabel?: string;
  secondaryOnPress?: () => void;
  total?: string;
  fixed?: boolean; // whether consumer wants the bar fixed to the viewport bottom
};

export function StickyActionBar({
  primaryLabel,
  primaryOnPress,
  secondaryLabel,
  secondaryOnPress,
  total,
  fixed = false
}: StickyActionBarProps) {
  const containerStyle: any = {
    width: '100%',
    paddingTop: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: undefined,
  };

  if (fixed) {
    containerStyle.position = 'absolute';
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.bottom = 0;
    // Respect safe area inset at bottom
    try {
      containerStyle.paddingBottom = spacing[4] + (safeArea.comfortable ?? 0);
    } catch {
      // ignore token issues in unusual runtimes
    }
  }

  return (
    <BthSurface style={containerStyle} elevationToken="raised" radiusToken="none" border={false}>
      <View style={{ gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <View style={{ flex: 1 }}>
            {secondaryLabel ? (
              <BthButton tone="secondary" label={secondaryLabel} onPress={secondaryOnPress} />
            ) : null}
          </View>

          <View style={{ flex: 2 }}>
            <BthButton label={primaryLabel + (total ? ` — ${total}` : '')} onPress={primaryOnPress} />
          </View>
        </View>
      </View>
    </BthSurface>
  );
}

export default StickyActionBar;
