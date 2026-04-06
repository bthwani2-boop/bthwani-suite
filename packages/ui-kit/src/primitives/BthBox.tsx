import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useDirection, useTheme } from '../hooks';
import {
  borders,
  radius,
  spacing,
  shadowByElevation,
  type BorderToken,
  type ElevationToken,
  type RadiusToken,
  type SpacingToken
} from '../foundation/tokens';
import { resolveLogicalPadding, resolveRowDirection } from '../foundation/direction';

export type BthBoxBackground =
  | 'surface'
  | 'surfaceRaised'
  | 'surfaceInset'
  | 'background'
  | 'backgroundAlt'
  | 'brand'
  | 'brandSurface'
  | 'successSurface'
  | 'warningSurface'
  | 'dangerSurface'
  | 'infoSurface'
  | 'overlaySoft'
  | 'disabledSurface';

export type BthBoxBorderTone = 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type BthBoxProps = {
  children?: React.ReactNode;
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  paddingStart?: SpacingToken;
  paddingEnd?: SpacingToken;
  gap?: SpacingToken;
  radiusToken?: RadiusToken;
  background?: BthBoxBackground;
  elevationToken?: ElevationToken;
  border?: boolean;
  borderToken?: BorderToken;
  borderTone?: BthBoxBorderTone;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  layoutDirection?: 'column' | 'row';
  reversed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthBox({
  children,
  padding = 0,
  paddingX,
  paddingY,
  paddingStart,
  paddingEnd,
  gap = 0,
  radiusToken = 'none',
  background,
  elevationToken = 'flat',
  border = false,
  borderToken = 'hairline',
  borderTone = 'line',
  align,
  justify,
  layoutDirection = 'column',
  reversed = false,
  style
}: BthBoxProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const backgroundColor = background ? theme[background] : undefined;
  const resolvedPaddingX = paddingX ?? padding;
  const resolvedPaddingY = paddingY ?? padding;
  const resolvedPaddingStart = paddingStart ?? resolvedPaddingX;
  const resolvedPaddingEnd = paddingEnd ?? resolvedPaddingX;
  const borderColor = {
    line: theme.line,
    lineStrong: theme.lineStrong,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info
  }[borderTone];

  return (
    <View
      style={[
        {
          paddingTop: spacing[resolvedPaddingY],
          paddingBottom: spacing[resolvedPaddingY],
          ...resolveLogicalPadding(direction, spacing[resolvedPaddingStart], spacing[resolvedPaddingEnd]),
          gap: spacing[gap],
          borderRadius: radius[radiusToken],
          backgroundColor,
          borderWidth: border ? borders[borderToken] : 0,
          borderColor: border ? borderColor : undefined,
          alignItems: align,
          justifyContent: justify,
          flexDirection: layoutDirection === 'row' ? resolveRowDirection(direction, reversed) : 'column'
        },
        shadowByElevation[elevationToken],
        style
      ]}
    >
      {children}
    </View>
  );
}
