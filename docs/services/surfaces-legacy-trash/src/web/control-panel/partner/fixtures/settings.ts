/**
 * Fixture for CONTROL PANEL partner settings page.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface PartnerSettings {
  notifications: {
    newOrders: boolean;
    orderUpdates: boolean;
    payments: boolean;
    reviews: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'partners_only' | 'private';
    showContactInfo: boolean;
    allowReviews: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  };
  preferences: {
    language: 'ar' | 'en';
    timezone: string;
    currency: 'SAR' | 'USD';
    dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy';
  };
}

export function buildPartnerSettingsMock(): PartnerSettings {
  return {
    notifications: {
      newOrders: true,
      orderUpdates: true,
      payments: true,
      reviews: false,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'partners_only',
      showContactInfo: false,
      allowReviews: true,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 60,
      loginAlerts: true,
    },
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      currency: 'SAR',
      dateFormat: 'dd/mm/yyyy',
    },
  };
}

