'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import type { PartnerSettings } from '../fixtures/settings';
import {
  PreferenceScreenLayout,
  PreferenceSection,
  PreferenceCard,
  PreferenceRow,
} from '../../components/preferences/PreferencePrimitives.web';

interface PartnerSettingsProps {}

export default function PartnerSettings({}: PartnerSettingsProps) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<PartnerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setSettings(null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      
      // await api.put('/api/partners/current/settings', settings);

      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      alert('فشل في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationSetting = (key: keyof PartnerSettings['notifications'], value: boolean) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    } : null);
  };

  const updatePrivacySetting = (key: keyof PartnerSettings['privacy'], value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    } : null);
  };

  const updateSecuritySetting = (key: keyof PartnerSettings['security'], value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    } : null);
  };

  const updatePreferenceSetting = (key: keyof PartnerSettings['preferences'], value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">جاري تحميل الإعدادات...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <PreferenceScreenLayout title="الإعدادات">
        <PreferenceSection>
          <PreferenceCard>
            <p className="text-sm text-gray-500 text-center py-6">
              لم يتم العثور على الإعدادات
            </p>
          </PreferenceCard>
        </PreferenceSection>
      </PreferenceScreenLayout>
    );
  }

  return (
    <PreferenceScreenLayout
      title="الإعدادات"
      subtitle="تخصيص تجربتك وإعدادات الأمان"
    >
      <PreferenceSection title="إعدادات الإشعارات">
        <PreferenceCard>
          <div className="space-y-3">
            {[
              { key: 'newOrders', label: t('web.control panel.partner.settings.page.newOrders'), description: t('web.control panel.partner.settings.page.notifyNewOrder') },
              { key: 'orderUpdates', label: t('web.control panel.partner.settings.page.notifyNewOrder'), description: t('web.control panel.partner.settings.page.notifyOrderStatusChange') },
              { key: 'payments', label: t('web.control panel.partner.settings.page.notifyOrderStatusChange'), description: t('web.control panel.partner.settings.page.notifyPaymentReceived') },
              { key: 'reviews', label: t('web.control panel.partner.settings.page.ratings'), description: t('web.control panel.partner.settings.page.notifyPaymentReceived') },
              { key: 'marketing', label: t('web.control panel.partner.settings.page.ratings'), description: t('web.control panel.partner.settings.page.offersAndDiscounts') }
            ].map(notification => (
              <PreferenceRow
                key={notification.key}
                title={notification.label}
                subtitle={notification.description}
                trailingSlot={
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                      onChange={(e) => updateNotificationSetting(notification.key as keyof typeof settings.notifications, e.target.checked)}
                    />
                    <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                      settings.notifications[notification.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notifications[notification.key as keyof typeof settings.notifications] ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </div>
                  </label>
                }
              />
            ))}
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection title="إعدادات الخصوصية">
        <PreferenceCard>
          <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رؤية الملف الشخصي
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">عام (مرئي للجميع)</option>
              <option value="partners_only">للشركاء فقط</option>
              <option value="private">خاص (غير مرئي)</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">عرض معلومات الاتصال</h3>
                <p className="text-sm text-gray-600">السماح للعملاء برؤية رقم الهاتف والبريد الإلكتروني</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.privacy.showContactInfo}
                  onChange={(e) => updatePrivacySetting('showContactInfo', e.target.checked)}
                />
                <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                  settings.privacy.showContactInfo ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.privacy.showContactInfo ? 'translate-x-4' : 'translate-x-0'
                  }`}></span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">السماح بالتقييمات</h3>
                <p className="text-sm text-gray-600">السماح للعملاء بتقييم خدماتك</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.privacy.allowReviews}
                  onChange={(e) => updatePrivacySetting('allowReviews', e.target.checked)}
                />
                <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                  settings.privacy.allowReviews ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.privacy.allowReviews ? 'translate-x-4' : 'translate-x-0'
                  }`}></span>
                </div>
              </label>
            </div>
          </div>
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection title="إعدادات الأمان">
        <PreferenceCard>
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">المصادقة الثنائية</h3>
              <p className="text-sm text-gray-600">إضافة طبقة إضافية من الأمان لحسابك</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.security.twoFactorEnabled}
                onChange={(e) => updateSecuritySetting('twoFactorEnabled', e.target.checked)}
              />
              <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                settings.security.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.security.twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}></span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مهلة الجلسة (دقائق)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="15">15 دقيقة</option>
              <option value="30">30 دقيقة</option>
              <option value="60">ساعة واحدة</option>
              <option value="120">ساعتين</option>
              <option value="480">8 ساعات</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">تنبيهات تسجيل الدخول</h3>
              <p className="text-sm text-gray-600">إشعار عند تسجيل الدخول من جهاز جديد</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.security.loginAlerts}
                onChange={(e) => updateSecuritySetting('loginAlerts', e.target.checked)}
              />
              <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                settings.security.loginAlerts ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.security.loginAlerts ? 'translate-x-4' : 'translate-x-0'
                }`}></span>
              </div>
            </label>
          </div>
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection title="التفضيلات">
        <PreferenceCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => updatePreferenceSetting('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة الزمنية
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => updatePreferenceSetting('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
              <option value="Europe/London">لندن (GMT+0)</option>
              <option value="America/New_York">نيويورك (GMT-5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العملة
            </label>
            <select
              value={settings.preferences.currency}
              onChange={(e) => updatePreferenceSetting('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="EUR">يورو (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تنسيق التاريخ
            </label>
            <select
              value={settings.preferences.dateFormat}
              onChange={(e) => updatePreferenceSetting('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dd/mm/yyyy">يوم/شهر/سنة (31/12/2026)</option>
              <option value="mm/dd/yyyy">شهر/يوم/سنة (12/31/2026)</option>
            </select>
          </div>
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <PreferenceSection title="إجراءات الحساب">
        <PreferenceCard>
          <div className="space-y-4">
          <button className="w-full md:w-auto px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700">
            🔄 تغيير كلمة المرور
          </button>

          <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            📱 إدارة الأجهزة المتصلة
          </button>

          <button className="w-full md:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            💾 تصدير بياناتي
          </button>

          <button className="w-full md:w-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
            🚪 حذف الحساب
          </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-lg">⚠️</span>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-yellow-800">
                تحذير مهم
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  حذف الحساب سيؤدي إلى فقدان جميع البيانات والطلبات والأرباح.
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
          </div>
          </div>
        </PreferenceCard>
      </PreferenceSection>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </PreferenceScreenLayout>
  );
}

