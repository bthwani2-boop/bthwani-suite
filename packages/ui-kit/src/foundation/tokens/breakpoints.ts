import { rawBreakpointScale } from './source';

export const breakpoints = rawBreakpointScale;

export type BreakpointToken = keyof typeof breakpoints;