import { rawSafeAreaScale } from './source';

export const safeArea = rawSafeAreaScale;

export type SafeAreaToken = keyof typeof safeArea;