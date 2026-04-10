export * from './BthWebPageFrame';
export * from './BthWebSectionCard';
export * from './BthWebCommandCenterFrame';
export * from './BthWebCommandStrip';
export * from './BthWebMissionHeroCard';
export * from './BthWebSignalCard';
export * from './BthWebRailServiceList';

export const webAdapter = {
  platform: 'web' as const,
  prefersTouchTargets: true,
  supportsHoverInteractions: true
};
