import { rawMotionScale } from './source';

export const motion = rawMotionScale;

export type MotionToken = keyof typeof motion;
