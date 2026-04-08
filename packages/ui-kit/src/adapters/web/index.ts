export * from './BthWebPageFrame';
export * from './BthWebSectionCard';

export const webAdapter = {
  platform: 'web' as const,
  prefersTouchTargets: true,
  supportsHoverInteractions: true
};
