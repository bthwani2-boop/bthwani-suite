import type {
  DshCaptainRoute,
  DshCaptainCommandTarget,
} from '../shared';

export type { DshCaptainRoute, DshCaptainCommandTarget };

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
} from '../shared/client-state';

export type {
  DshCaptainFinanceSnapshot,
  DshCaptainOperationsSnapshot,
  DshCaptainOrderActionPayload,
  DshCaptainOrderSnapshot,
  DshCaptainProfileSnapshot,
  DshCaptainProofPayload,
} from './contracts/dshCaptainBinding.contracts';
