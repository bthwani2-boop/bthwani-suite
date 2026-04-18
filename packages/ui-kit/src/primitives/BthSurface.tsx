import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { BthBox } from './BthBox';
import type { BorderToken, ElevationToken, RadiusToken, SpacingToken } from '../foundation/tokens';

export type BthSurfaceTone = 'default' | 'raised' | 'inset' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type BthSurfaceProps = {
  children?: React.ReactNode;
  padding?: SpacingToken;
  gap?: SpacingToken;
  radiusToken?: RadiusToken;
  elevationToken?: ElevationToken;
  tone?: BthSurfaceTone;
  border?: boolean;
  borderToken?: BorderToken;
  borderTone?: 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  style?: StyleProp<ViewStyle>;
};

export function BthSurface({
  children,
  padding = 5,
  gap = 3,
  radiusToken = 'xl',
  elevationToken,
  tone = 'default',
  border = true,
  borderToken = 'hairline',
  borderTone,
  style
}: BthSurfaceProps) {
  const toneMap = {
    default: { background: 'surface' as const, borderTone: 'line' as const, elevationToken: 'flat' as const },
    raised: { background: 'surfaceRaised' as const, borderTone: 'lineStrong' as const, elevationToken: 'raised' as const },
    inset: { background: 'surfaceInset' as const, borderTone: 'line' as const, elevationToken: 'flat' as const },
    brand: { background: 'brandSurface' as const, borderTone: 'brand' as const, elevationToken: 'flat' as const },
    success: { background: 'successSurface' as const, borderTone: 'success' as const, elevationToken: 'flat' as const },
    warning: { background: 'warningSurface' as const, borderTone: 'warning' as const, elevationToken: 'flat' as const },
    danger: { background: 'dangerSurface' as const, borderTone: 'danger' as const, elevationToken: 'flat' as const },
    info: { background: 'infoSurface' as const, borderTone: 'info' as const, elevationToken: 'flat' as const }
  } as const;

  const toneConfig = (toneMap as any)[tone] ?? toneMap.default;
  if ((process.env.NODE_ENV ?? '') !== 'production' && !(tone in toneMap)) {
    // eslint-disable-next-line no-console
    console.warn(`BthSurface: unknown tone \"${String(tone)}\" — falling back to 'default'`);
  }

  return (
    <BthBox
      padding={padding}
      gap={gap}
      radiusToken={radiusToken}
      elevationToken={elevationToken ?? toneConfig.elevationToken}
      background={toneConfig.background}
      border={border}
      borderToken={borderToken}
      borderTone={borderTone ?? toneConfig.borderTone}
      style={style}
    >
      {children}
    </BthBox>
  );
}
