import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export default function UserHomeSurface() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: semanticRoles.textPrimary }}>
          {t('user_home.welcome_platform')}
        </h1>
        <p className="text-xl text-center mb-12" style={{ color: semanticRoles.textSecondary }}>
          {t('user_home.platform_subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('user_home.orders')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('user_home.orders_desc')}</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('user_home.wallet')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('user_home.wallet_desc')}</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('user_home.settings')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('user_home.settings_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
