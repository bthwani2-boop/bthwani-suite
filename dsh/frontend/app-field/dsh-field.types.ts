export type DshFieldRoute =
  | 'stores'
  | 'onboarding'
  | 'visit'
  | 'account'
  | 'profile'
  | 'history'
  | 'finance'
  | 'readiness-escalation'
  | 'document-upload';

export type DshFieldRouteState =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'visit'; storeId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'finance' }
  | { kind: 'readiness-escalation'; storeId: string }
  | { kind: 'document-upload'; storeId: string };

export type DshFieldCommandTarget = DshFieldRoute;

export type DshFieldNavigationCommand = {
  token: number;
  target: DshFieldCommandTarget;
  storeId?: string;
};

export type DshFieldSurfaceProps = {
  command?: DshFieldNavigationCommand;
  onExit?: () => void;
};

export type DshFieldSurfaceHostProps = DshFieldSurfaceProps;
