// Canonical location: dsh/frontend/app-client/dsh-client.routes.ts
// Authority: dsh/frontend/app-client — client surface routing contract.
// No JSX. No ui-kit. No Tamagui.

export type DshClientRouteId =
  | 'home'
  | 'entry'
  | 'my-space'
  | 'notifications'
  | 'store-get'
  | 'store-items'
  | 'cart-get'
  | 'checkout-intent'
  | 'checkout-failure'
  | 'orders-list'
  | 'tracking'
  | 'bell'
  | 'benefits'
  | 'conversation-workspace'
  | 'order-issue-workspace'
  | 'proxy-workspace'
  | 'listing-status-update'
  | 'appearance'
  | 'addresses-location'
  | 'identity'
  | 'preferences'
  | 'zone-set'
  | 'service-settings'
  | 'wlt-home';

export type DshClientLegacyRoute = DshClientRouteId;

export type DshClientRouteRecord = {
  readonly id: DshClientRouteId;
  readonly label: string;
  readonly defaultEntry: boolean;
};

export const dshClientRoutes: readonly DshClientRouteRecord[] = [
  { id: 'home',                   label: 'الرئيسية',            defaultEntry: true  },
  { id: 'entry',                  label: 'البداية',             defaultEntry: false },
  { id: 'my-space',               label: 'حسابي',               defaultEntry: false },
  { id: 'notifications',          label: 'الإشعارات',           defaultEntry: false },
  { id: 'store-get',              label: 'المتجر',               defaultEntry: false },
  { id: 'store-items',            label: 'عناصر المتجر',        defaultEntry: false },
  { id: 'cart-get',               label: 'السلة',               defaultEntry: false },
  { id: 'checkout-intent',        label: 'الدفع',               defaultEntry: false },
  { id: 'checkout-failure',       label: 'فشل الدفع',           defaultEntry: false },
  { id: 'orders-list',            label: 'طلباتي',              defaultEntry: false },
  { id: 'tracking',               label: 'تتبع الطلب',          defaultEntry: false },
  { id: 'bell',                   label: 'الإشعارات الفورية',   defaultEntry: false },
  { id: 'benefits',               label: 'المزايا',             defaultEntry: false },
  { id: 'conversation-workspace', label: 'المحادثات',           defaultEntry: false },
  { id: 'order-issue-workspace',  label: 'مشكلة الطلب',         defaultEntry: false },
  { id: 'proxy-workspace',        label: 'الوكالة',             defaultEntry: false },
  { id: 'listing-status-update',  label: 'تحديث الحالة',        defaultEntry: false },
  { id: 'appearance',             label: 'المظهر',              defaultEntry: false },
  { id: 'addresses-location',     label: 'العناوين',            defaultEntry: false },
  { id: 'identity',               label: 'الهوية',              defaultEntry: false },
  { id: 'preferences',            label: 'التفضيلات',           defaultEntry: false },
  { id: 'zone-set',               label: 'المنطقة',             defaultEntry: false },
  { id: 'service-settings',       label: 'إعدادات الخدمة',      defaultEntry: false },
  { id: 'wlt-home',               label: 'المحفظة',             defaultEntry: false },
] as const;
