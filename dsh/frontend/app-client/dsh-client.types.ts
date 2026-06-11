import type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'wlt-home'
  | 'preferences'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'checkout-intent'
  | 'checkout-failure'
  | 'search'
  | 'store-get'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'listing-status-update'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'service-settings'
  | 'zone-set'
  | 'orders-list'
  | 'addresses-location'
  | 'identity'
  | 'appearance'
  | 'tracking';

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


export type { DshClientState } from '../shared/client-state';
export type {
	DshClientBindingError,
	DshClientCartLine,
	DshClientCartSnapshot,
	DshClientTrackingTimelineItem,
	DshClientWalletImpactVisibility,
	DshClientWalletVisibility,
} from './contracts/dsh-client-binding.contracts';
