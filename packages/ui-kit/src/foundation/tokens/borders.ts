import { rawBorderScale } from './source';

export const borders = rawBorderScale;

export type BorderToken = keyof typeof borders;
