// Dev/demo fixtures for partner staff management and analytics.
// Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

/** Header title mock until profile/session name is loaded from API (app-partner shell may override). */
export const PARTNER_APP_HEADER_DISPLAY_NAME_FIXTURE = 'متجر الأمل';

/**
 * Navigation scope when the partner works across every linked store (no single `storeId`).
 * Not a real store id from the API.
 */
export const PARTNER_ALL_STORES_SCOPE = '__partner_all_stores__';

/** Rich store hero + registration fields for partner profile screen (dev until API shapes exist). */
export type PartnerProfileSubscriptionChipKey =
  | 'pro'
  | 'free_delivery'
  | 'priority';

/** Delivery mode keys for Hero display (i18n in component). */
export type PartnerProfileDeliveryModeKey =
  | 'pickup'
  | 'inhouse'
  | 'third_party';

export interface PartnerProfileHeroFixture {
  avatarUrl: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  deliveryMinutesMin: number;
  deliveryMinutesMax: number;
  showPriceMatch: boolean;
  followersCount: number;
  subscriptionChipKeys: PartnerProfileSubscriptionChipKey[];
  /** ساعات العمل — e.g. "9:00 - 22:00" */
  workingHoursSummary?: string;
  /** أوضاع التوصيل — keys for i18n */
  deliveryModeKeys?: PartnerProfileDeliveryModeKey[];
}

export interface PartnerProfileScreenFixture {
  hero: PartnerProfileHeroFixture;
  email: string;
  phone: string;
  registration_number: string;
  tax_number: string;
}

export function buildPartnerProfileScreenFixture(): PartnerProfileScreenFixture {
  return {
    hero: {
      avatarUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
      isOpen: true,
      rating: 5.0,
      reviewCount: 2102,
      deliveryMinutesMin: 40,
      deliveryMinutesMax: 60,
      showPriceMatch: true,
      followersCount: 15200,
      subscriptionChipKeys: ['pro', 'free_delivery', 'priority'],
      workingHoursSummary: '9:00 - 22:00',
      deliveryModeKeys: ['pickup', 'inhouse', 'third_party'],
    },
    email: 'store@example.com',
    phone: '+966501234567',
    registration_number: '1234567890',
    tax_number: '9876543210',
  };
}

export type PartnerShiftDay =
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat';

export interface PartnerStaffFixture {
  name: string;
  phone: string;
  email?: string;
  role: 'owner' | 'manager' | 'supervisor' | 'employee';
  permissions: string[];
  shifts: Array<{
    day: PartnerShiftDay;
    from: string;
    to: string;
    days?: PartnerShiftDay[];
    repeat?: 'daily' | 'weekly' | 'monthly';
  }>;
  active: boolean;
  invitedAt: string;
  activatedAt?: string | null;
}

export interface PartnerStaffAnalyticsFixture {
  totalOrders: number;
  successfulOrders: number;
  rejectedOrders: number;
  topEmployeePhone: string | null;
  byEmployee: Array<{
    employeePhone: string;
    acceptedCount: number;
    deliveredCount: number;
    successRate: number;
  }>;
}

export interface PartnerIssueQueueFixtureItem {
  id: string;
  orderId: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface PartnerAudienceInsightsFixture {
  followersCount: number;
  repeatCustomers: number;
  newCustomers: number;
  conversionRate: number;
  topTimeWindows: Array<{ label: string; orders: number }>;
}

export type {
  PartnerStoreSwitcherFixtureItem,
} from '../partnerStoreSwitcherFixtures';
export { buildPartnerStoresFixture } from '../partnerStoreSwitcherFixtures';

export function buildPartnerStaffFixture(): PartnerStaffFixture[] {
  return [
    {
      name: 'سارة عبدالقادر',
      phone: '+966500000111',
      email: 'staff.one@partner.dev',
      role: 'supervisor',
      permissions: ['manage_orders', 'manage_staff'],
      shifts: [
        {
          day: 'sun',
          from: '08:00',
          to: '16:00',
          days: ['sun', 'thu'],
          repeat: 'weekly',
        },
      ],
      active: true,
      invitedAt: '2026-03-01T08:00:00Z',
      activatedAt: '2026-03-01T08:05:00Z',
    },
    {
      name: 'محمد سامي',
      phone: '+966500000222',
      email: 'staff.two@partner.dev',
      role: 'employee',
      permissions: ['manage_orders'],
      shifts: [
        {
          day: 'mon',
          from: '16:00',
          to: '23:00',
          days: ['mon'],
          repeat: 'daily',
        },
      ],
      active: true,
      invitedAt: '2026-03-02T08:00:00Z',
      activatedAt: '2026-03-02T08:10:00Z',
    },
    {
      name: 'هند القحطاني',
      phone: '+966500000333',
      email: 'staff.three@partner.dev',
      role: 'employee',
      permissions: ['manage_orders', 'manage_finances'],
      shifts: [
        {
          day: 'tue',
          from: '09:00',
          to: '17:00',
          days: ['tue', 'fri'],
          repeat: 'weekly',
        },
      ],
      active: false,
      invitedAt: '2026-03-03T08:00:00Z',
      activatedAt: null,
    },
  ];
}

export function buildPartnerStaffAnalyticsFixture(): PartnerStaffAnalyticsFixture {
  return {
    totalOrders: 142,
    successfulOrders: 131,
    rejectedOrders: 11,
    topEmployeePhone: '+966500000222',
    byEmployee: [
      {
        employeePhone: '+966500000111',
        acceptedCount: 44,
        deliveredCount: 40,
        successRate: 90.9,
      },
      {
        employeePhone: '+966500000222',
        acceptedCount: 58,
        deliveredCount: 56,
        successRate: 96.6,
      },
      {
        employeePhone: '+966500000333',
        acceptedCount: 20,
        deliveredCount: 17,
        successRate: 85.0,
      },
    ],
  };
}

export function buildPartnerIssueQueueFixture(): PartnerIssueQueueFixtureItem[] {
  return [
    {
      id: 'issue-1',
      orderId: 'ORD-1021',
      title: 'نقص عنصر من الطلب',
      severity: 'high',
      status: 'open',
      createdAt: '2026-03-18T12:10:00Z',
    },
    {
      id: 'issue-2',
      orderId: 'ORD-1020',
      title: 'تأخير كبير في التسليم',
      severity: 'medium',
      status: 'in_progress',
      createdAt: '2026-03-18T11:25:00Z',
    },
    {
      id: 'issue-3',
      orderId: 'ORD-1017',
      title: 'اختلاف في الفاتورة',
      severity: 'low',
      status: 'resolved',
      createdAt: '2026-03-18T09:40:00Z',
    },
  ];
}

export function buildPartnerAudienceInsightsFixture(): PartnerAudienceInsightsFixture {
  return {
    followersCount: 2840,
    repeatCustomers: 613,
    newCustomers: 192,
    conversionRate: 38.4,
    topTimeWindows: [
      { label: '12:00 - 14:00', orders: 87 },
      { label: '18:00 - 20:00', orders: 123 },
      { label: '21:00 - 23:00', orders: 66 },
    ],
  };
}

