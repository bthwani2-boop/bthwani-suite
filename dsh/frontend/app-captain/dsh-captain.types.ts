export type DshCaptainRoute =
  | 'home'
  | 'account'
  | 'account-profile'
  | 'account-finance'
  | 'account-orders'
  | 'account-docs'
  | 'account-shifts'
  | 'account-support'
  | 'entry'
  | 'inbox'
  | 'detail'
  | 'orderchat'
  | 'bell'
  | 'support-directory'
  | 'support-screen'
  | 'pickup-dropoff'
  | 'pod-submission'
  | 'map';

export type DshCaptainCommandTarget =
  | 'home'
  | 'entry'
  | 'inbox'
  | 'detail'
  | 'orderchat'
  | 'bell'
  | 'support-directory'
  | 'account-orders'
  | 'pickup-dropoff'
  | 'pod-submission';

export type DshCaptainNavigationCommand = {
  token: number;
  target: DshCaptainCommandTarget;
};

export type DshCaptainSurfaceProps = {
  command: DshCaptainNavigationCommand;
  captainId?: string;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  walletBalanceLabel?: string;
};


export type {
  DshCaptainState,
  DshCaptainStateGroup,
  DshCaptainStateMeta,
} from '../data/operational-statuses.preview-data';

export type {
  DshCaptainFinanceSnapshot,
  DshCaptainOperationsSnapshot,
  DshCaptainOrderActionPayload,
  DshCaptainOrderSnapshot,
  DshCaptainProfileSnapshot,
  DshCaptainProofPayload,
} from './contracts/dshCaptainBinding.contracts';
