import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export default function CaptainHomeSurface() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: semanticRoles.textPrimary }}>
          {t('captain.app_title')}
        </h1>
        <p className="text-xl text-center mb-12" style={{ color: semanticRoles.textSecondary }}>
          {t('captain.app_subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('captain.trips')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('captain.trips_desc')}</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('captain.earnings')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('captain.earnings_desc')}</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>{t('captain.support')}</h3>
            <p style={{ color: semanticRoles.textSecondary }}>{t('captain.support_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
