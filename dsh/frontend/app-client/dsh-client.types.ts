import type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';
import type { DshRoute as SharedDshRoute } from '../shared/contracts/dsh-client-binding.contracts';

export type DshRoute = SharedDshRoute;

export type DshCommandTarget = 'home' | 'orders-list' | 'tracking' | 'bell' | 'create-order' | 'cart-get';

export type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
};

export type DshClientSurfaceProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
  authToken?: string;
  devClientId?: string;
  renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
};


export type { DshClientState } from 'state-machines/client-state';
export type {
	DshClientBindingError,
	DshClientCartLine,
	DshClientCartSnapshot,
	DshClientTrackingTimelineItem,
	DshClientWalletImpactVisibility,
	DshClientWalletVisibility,
} from './contracts/dsh-client-binding.contracts';
