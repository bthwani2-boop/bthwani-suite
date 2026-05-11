import type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';

export type DshRoute =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'preferences'
  | 'notifications'
  | 'store-items'
  | 'cart-get'
  | 'favorite-toggle'
  | 'favorites-list'
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
  renderApprovedVideoReelsViewer?: (props: DshHomeApprovedVideoReelsViewerProps) => React.ReactNode;
};

export type DshSurfaceHostProps = DshClientSurfaceProps;

export type { DshClientState } from './data/client-state.preview-data';
export type {
	DshClientBindingError,
	DshClientCartLine,
	DshClientCartSnapshot,
	DshClientTrackingTimelineItem,
	DshClientWalletImpactVisibility,
	DshClientWalletVisibility,
} from './contracts/dsh-client-binding.contracts';
