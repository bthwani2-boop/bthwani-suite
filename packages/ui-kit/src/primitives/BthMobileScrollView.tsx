import React from 'react';
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, type SpacingToken } from '../foundation/tokens';

export type BthMobileScrollViewProps = Omit<ScrollViewProps, 'style' | 'contentContainerStyle'> & {
  children?: React.ReactNode;
  fill?: boolean;
  padding?: SpacingToken;
  gap?: SpacingToken;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function BthMobileScrollView({
  children,
  fill = false,
  padding = 0,
  gap = 0,
  style,
  contentContainerStyle,
  ...scrollProps
}: BthMobileScrollViewProps) {
  return (
    <ScrollView
      {...scrollProps}
      style={[fill ? { flex: 1 } : undefined, style]}
      contentContainerStyle={[
        fill ? { flexGrow: 1 } : undefined,
        { padding: spacing[padding], gap: spacing[gap] },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}