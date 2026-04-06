import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../hooks';
import { radius, spacing, shadowByElevation, type RadiusToken, type SpacingToken, type ElevationToken } from '../foundation/tokens';

export type BthBoxProps = {
  children?: React.ReactNode;
  padding?: SpacingToken;
  gap?: SpacingToken;
  radiusToken?: RadiusToken;
  background?: 'surface' | 'background' | 'backgroundAlt' | 'brand' | 'successSurface' | 'warningSurface' | 'dangerSurface' | 'infoSurface';
  elevationToken?: ElevationToken;
  border?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthBox({
  children,
  padding = 0,
  gap = 0,
  radiusToken = 'none',
  background,
  elevationToken = 'flat',
  border = false,
  style
}: BthBoxProps) {
  const { theme } = useTheme();
  const backgroundColor = background ? theme[background] : undefined;

  return (
    <View
      style={[
        {
          padding: spacing[padding],
          gap: spacing[gap],
          borderRadius: radius[radiusToken],
          backgroundColor,
          borderWidth: border ? 1 : 0,
          borderColor: border ? theme.line : undefined
        },
        shadowByElevation[elevationToken],
        style
      ]}
    >
      {children}
    </View>
  );
}
