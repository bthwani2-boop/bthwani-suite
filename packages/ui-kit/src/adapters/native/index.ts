export * from './BthMobileScrollView';

export const nativeAdapter = {
  platform: 'native' as const,
  prefersTouchTargets: true,
  supportsHoverInteractions: false
};
