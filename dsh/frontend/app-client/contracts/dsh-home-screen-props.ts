import type {
  DshHomeCategory,
  DshHomeGetPromo,
  DshHomeGetStore,
  DshHomeRecentOrder,
  DshServiceId,
} from './dsh-home-types';
import type { HomePromoRecord, MarketingVideoRecord } from 'contracts/dsh-marketing-types';

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  categories?: DshHomeCategory[];
  promos?: DshHomeGetPromo[];
  homePromos?: HomePromoRecord[];
  stores?: DshHomeGetStore[];
  recentOrders?: DshHomeRecentOrder[];
  approvedVideoShorts?: MarketingVideoRecord[];
  onBack?: () => void;
  onOpenEntry?: () => void;
  onOpenMySpace?: () => void;
  onOpenNotifications?: () => void;
  onOpenCart?: () => void;
  onOpenWallet?: () => void;
  onOpenService?: (serviceId: DshServiceId) => void;
  onOpenList?: () => void;
  onOpenCategory?: (categoryId: string) => void;
  onOpenDiscovery?: () => void;
  onOpenStoreCategory?: (storeId: string, categoryId: string) => void;
  onOpenProduct?: (storeId: string, itemId: string) => void;
  onOpenBenefits?: (screenId?: string) => void;
  onOpenFavorites?: () => void;
  favoriteOverrides?: Record<string, boolean>;
  onToggleFavorite?: (storeId: string) => void;
  onOpenSearch?: () => void;
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onOpenStore?: (storeId: string) => void;
  onPromoClick?: (promoId: string) => void;
  onPromoImpression?: (promoId: string) => void;
  onVideoCtaClick?: (itemId: string) => void;
  onVideoImpression?: (itemId: string) => void;
  onOpenSheinInfo?: () => void;
  sheinInlineVisible?: boolean;
  onCloseSheinInline?: () => void;
  awnakInlineVisible?: boolean;
  onCloseAwnakInline?: () => void;
  onRegisterBackHandler?: (handler: (() => boolean) | null) => void;
  renderApprovedVideoReelsViewer?: (props: any) => React.ReactNode;
  onRetry?: () => void;
  notificationCount?: number;
  cartCount?: number;
  serviceDialTrigger?: number;
  searchAutoOpenToken?: number;
};
