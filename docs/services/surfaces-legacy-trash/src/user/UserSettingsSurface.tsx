import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export default function UserSettingsSurface() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: semanticRoles.textPrimary }}>
          {t('navigation.settings')}
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>
              {t('preferences.category_notifications')}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span style={{ color: semanticRoles.textPrimary }}>{t('preferences.notifications_orders_title')}</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span style={{ color: semanticRoles.textPrimary }}>{t('preferences.notifications_promotions_title')}</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span style={{ color: semanticRoles.textPrimary }}>{t('preferences.notifications_system_title')}</span>
              </label>
            </div>
          </div>

          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>
              {t('preferences.category_privacy')}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span style={{ color: semanticRoles.textPrimary }}>{t('preferences.location_services_title')}</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span style={{ color: semanticRoles.textPrimary }}>{t('preferences.show_online_activity')}</span>
              </label>
            </div>
          </div>

          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>
              {t('preferences.category_language')}
            </h3>
            <select
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: semanticRoles.surface,
                borderColor: semanticRoles.border,
                color: semanticRoles.textPrimary
              }}
            >
              <option value="ar">{t('preferences.lang_ar')}</option>
              <option value="en">{t('preferences.lang_en')}</option>
            </select>
          </div>

          {/* أزرار العمل */}
          <div className="flex space-x-4">
            <button
              className="flex-1 py-3 px-6 rounded-lg font-medium"
              style={{
                backgroundColor: semanticRoles.primary,
                color: semanticRoles.onPrimary
              }}
            >
              {t('common.save')}
            </button>
            <button
              className="flex-1 py-3 px-6 rounded-lg font-medium border"
              style={{
                borderColor: semanticRoles.error,
                color: semanticRoles.error
              }}
            >
              {t('profile.delete_account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
