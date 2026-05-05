export type DshCaptainProfileScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainProfileSection = 'profile-get' | 'tier-info' | 'tier-evaluate';

export type DshCaptainProfileSnapshot = {
  displayName: string;
  tierLabel: string;
  readinessLabel: string;
};
