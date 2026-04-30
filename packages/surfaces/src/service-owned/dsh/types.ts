export type DshSurface =
  | 'app-client'
  | 'app-partner'
  | 'app-captain'
  | 'app-field'
  | 'control-panel';

export type Phase12PreviewRoute = {
  id: string;
  candidateId: string;
  phase: 'Phase 12';
  status: 'placeholder';
};

export type Phase12FixtureLocation = {
  candidateId: string;
  canonicalTarget: string;
  surface: DshSurface;
  phase: 'Phase 12';
  mode: 'fixtures-only';
  location: string;
  status: 'declared';
};