/**
 * DSH Stores List — shared types only. No react-native.
 * Used by DshStoresList (RN) and DshStoresListWeb (DOM); web entry imports from here only.
 */

export interface DshStoreItem {
  id: string;
  name: string;
  address?: string;
  description?: string;
  price?: number;
}

export interface DshStoresListProps {
  getStores: () => Promise<DshStoreItem[]>;
  onBack: () => void;
  /** Optional: navigate to store items when a store is pressed (app-client Phase 2) */
  onStorePress?: (store: DshStoreItem) => void;
}

/** DSH Categories List — dsh_categories_list. Shared types only. */
export interface DshCategoryItem {
  id: string;
  name: string;
  slug?: string;
  parent_id?: string;
}

export interface DshCategoriesListProps {
  getCategories: () => Promise<DshCategoryItem[]>;
  onBack: () => void;
  onCategoryPress?: (category: DshCategoryItem) => void;
}

/** DSH Category Detail — dsh_category_get. Shared types only. */
export interface DshCategoryDetailItem extends DshCategoryItem {
  subcategories?: DshCategoryItem[];
  item_count?: number;
}

export interface DshCategoryDetailProps {
  getCategory: (id: string) => Promise<DshCategoryDetailItem | null>;
  categoryId: string;
  onBack: () => void;
}

/** DSH Partner Orders List — dsh_partner_orders_list. Shared types only. */
export interface DshPartnerOrderItem {
  id: string;
  status?: string;
  created_at?: string;
  total?: number;
  customer_name?: string;
}

export interface DshPartnerOrdersListProps {
  getOrders: () => Promise<DshPartnerOrderItem[]>;
  onBack: () => void;
}

/** DSH Home Banners List — dsh_home_banners_list. Shared types only. */
export interface DshBannerItem {
  id: string;
  title?: string;
  image_url?: string;
  position?: string;
}

export interface DshBannersListProps {
  getBanners: () => Promise<DshBannerItem[]>;
  onBack: () => void;
}

/** DSH Customer Addresses List — dsh_customer_addresses_list. Shared types only. */
export interface DshCustomerAddressItem {
  id: string;
  label?: string;
  address_line?: string;
  city?: string;
  is_default?: boolean;
}

export interface DshCustomerAddressesListProps {
  getAddresses: () => Promise<DshCustomerAddressItem[]>;
  onBack: () => void;
}

/** DSH Customer Profile — dsh_customer_profile_get / dsh_customer_profile_update. Shared types only. */
export interface DshCustomerProfileItem {
  customer_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface DshCustomerProfileDetailProps {
  getProfile: (customerId: string) => Promise<DshCustomerProfileItem | null>;
  initialCustomerId?: string;
  onBack: () => void;
  onEdit?: (customerId: string) => void;
}

export interface DshCustomerProfileUpdateProps {
  getProfile: (customerId: string) => Promise<DshCustomerProfileItem | null>;
  updateProfile: (customerId: string, data: Partial<Omit<DshCustomerProfileItem, 'customer_id'>>) => Promise<void>;
  customerId: string;
  onBack: () => void;
  onSuccess?: () => void;
}

/** DSH Customer Preferences — dsh_customer_preferences_get. Shared types only. */
export interface DshCustomerPreferencesItem {
  notifications?: boolean;
  language?: string;
  [key: string]: unknown;
}

export interface DshCustomerPreferencesDetailProps {
  getPreferences: () => Promise<DshCustomerPreferencesItem | null>;
  onBack: () => void;
}

/** DSH Cart Price — dsh_cart_price. Shared types only. */
export interface DshCartPriceItem {
  subtotal?: number;
  delivery_fee?: number;
  tax?: number;
  total?: number;
  currency?: string;
  subtotal_amount?: number;
  delivery_amount?: number;
  tax_amount?: number;
  total_amount?: number;
  [key: string]: unknown;
}

export interface DshCartPriceProps {
  getCartPrice: (params: {
    cart_id: string;
    delivery_location?: { latitude?: number; longitude?: number };
    coupon_code?: string;
    include_delivery_fee?: boolean;
  }) => Promise<DshCartPriceItem | null>;
  onBack: () => void;
}

/** DSH Checkout Payment Method Select — dsh_checkout_payment_method_select. Shared types only. */
export interface DshCheckoutPaymentMethodSelectProps {
  selectPaymentMethod: (params: { payment_method_id: string; order_id: string }) => Promise<void>;
  onBack: () => void;
}

/** DSH Store Items List — dsh_store_items_list. Shared types only. */
export interface DshStoreItemsListProps {
  state: 'loading' | 'normal' | 'empty' | 'error';
  items: DshStoreItem[];
  errorMessage?: string;
  storeName?: string;
  onBack?: () => void;
  onRetry?: () => void;
  onItemPress?: (item: DshStoreItem) => void;
}

