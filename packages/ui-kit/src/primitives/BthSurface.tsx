import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { BthBox } from './BthBox';
import type { ElevationToken, RadiusToken, SpacingToken } from '../foundation/tokens';

export type BthSurfaceProps = {
  children?: React.ReactNode;
  padding?: SpacingToken;
  gap?: SpacingToken;
  radiusToken?: RadiusToken;
  elevationToken?: ElevationToken;
  border?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthSurface({
  children,
  padding = 4,
  gap = 3,
  radiusToken = 'lg',
  elevationToken = 'raised',
  border = true,
  style
}: BthSurfaceProps) {
  return (
    <BthBox
      padding={padding}
      gap={gap}
      radiusToken={radiusToken}
      elevationToken={elevationToken}
      background="surface"
      border={border}
      style={style}
    >
      {children}
    </BthBox>
  );
}
