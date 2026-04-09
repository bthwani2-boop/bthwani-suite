import { rawElevationScale, shadowPresets } from './source';

export const elevation = rawElevationScale;

export const shadowByElevation = shadowPresets;

export type ElevationToken = keyof typeof elevation;
