// Canonical location: dsh/frontend/shared/client/dsh-client-screen-registry.ts
// Authority: dsh/frontend/shared/client — client screen registry contract.
// No JSX. No ui-kit. No Tamagui.

import type { DshClientRouteId } from './dsh-client-routes';

export type DshClientScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'not-found';

export type DshClientScreenRegistryStatus =
  | 'ACTIVE'
  | 'STUB'
  | 'DEPRECATED';

export type DshClientScreenRegistryItem = {
  readonly routeId: DshClientRouteId;
  readonly label: string;
  readonly status: DshClientScreenRegistryStatus;
  readonly requiresAuth: boolean;
};

export const dshClientScreenRegistry: readonly DshClientScreenRegistryItem[] = [
  { routeId: 'home',                   label: 'الرئيسية',            status: 'ACTIVE', requiresAuth: false },
  { routeId: 'entry',                  label: 'البداية',             status: 'ACTIVE', requiresAuth: false },
  { routeId: 'my-space',               label: 'حسابي',               status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'notifications',          label: 'الإشعارات',           status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'store-get',              label: 'المتجر',               status: 'ACTIVE', requiresAuth: false },
  { routeId: 'store-items',            label: 'عناصر المتجر',        status: 'ACTIVE', requiresAuth: false },
  { routeId: 'cart-get',               label: 'السلة',               status: 'ACTIVE', requiresAuth: false },
  { routeId: 'checkout-intent',        label: 'الدفع',               status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'checkout-failure',       label: 'فشل الدفع',           status: 'ACTIVE', requiresAuth: false },
  { routeId: 'orders-list',            label: 'طلباتي',              status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'tracking',               label: 'تتبع الطلب',          status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'bell',                   label: 'الإشعارات الفورية',   status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'benefits',               label: 'المزايا',             status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'conversation-workspace', label: 'المحادثات',           status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'order-issue-workspace',  label: 'مشكلة الطلب',         status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'proxy-workspace',        label: 'الوكالة',             status: 'STUB',   requiresAuth: true  },
  { routeId: 'listing-status-update',  label: 'تحديث الحالة',        status: 'STUB',   requiresAuth: true  },
  { routeId: 'appearance',             label: 'المظهر',              status: 'ACTIVE', requiresAuth: false },
  { routeId: 'addresses-location',     label: 'العناوين',            status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'identity',               label: 'الهوية',              status: 'ACTIVE', requiresAuth: true  },
  { routeId: 'preferences',            label: 'التفضيلات',           status: 'ACTIVE', requiresAuth: false },
  { routeId: 'zone-set',               label: 'المنطقة',             status: 'STUB',   requiresAuth: false },
  { routeId: 'service-settings',       label: 'إعدادات الخدمة',      status: 'STUB',   requiresAuth: true  },
  { routeId: 'wlt-home',               label: 'المحفظة',             status: 'ACTIVE', requiresAuth: true  },
] as const;
