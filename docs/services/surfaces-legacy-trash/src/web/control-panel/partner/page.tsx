'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@bthwani/ui-kit';
import type { PartnerInfo } from './fixtures/partnerInfo';

interface PartnerDashboardProps {}

export default function PartnerDashboard({}: PartnerDashboardProps) {
  const { t, isRTL, currentLanguage } = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const forwardArrow = isRTL ? '\u2190' : '\u2192';
  const copy =
    currentLanguage === 'ar'
      ? {
          loading: 'جاري تحميل البيانات...',
          welcomeSubtitle: 'إدارة شاملة لأعمالك التجارية من مكان واحد',
          partnershipType: 'نوع الشراكة',
          dshType: '🚚 توصيل وتسوق',
          serviceType: '🎭 خدمات',
          totalOrders: 'إجمالي الطلبات',
          totalRevenue: 'إجمالي الإيرادات',
          activeOrders: 'طلبات نشطة',
          rating: 'تقييم العملاء',
          recentOrders: 'الطلبات الأخيرة',
          noRecentOrders: 'لا توجد طلبات حديثة',
          viewAllOrders: 'عرض جميع الطلبات',
          quickActions: 'إجراءات سريعة',
          addProduct: 'إضافة منتج',
          updateStore: 'تحديث المتجر',
          earningsReport: 'تقرير الأرباح',
          settings: 'الإعدادات',
          loadingTab: 'جاري تحميل',
        }
      : {
          loading: 'Loading data...',
          welcomeSubtitle: 'Manage your business from one place',
          partnershipType: 'Partnership type',
          dshType: '🚚 Delivery & shopping',
          serviceType: '🎭 Services',
          totalOrders: 'Total orders',
          totalRevenue: 'Total revenue',
          activeOrders: 'Active orders',
          rating: 'Customer rating',
          recentOrders: 'Recent orders',
          noRecentOrders: 'No recent orders',
          viewAllOrders: 'View all orders',
          quickActions: 'Quick actions',
          addProduct: 'Add product',
          updateStore: 'Update store',
          earningsReport: 'Earnings report',
          settings: 'Settings',
          loadingTab: 'Loading',
        };

  const tabs = useMemo(
    () => [
      { id: 'overview', label: t('web.control panel.partner.page.overview'), icon: '📊' },
      { id: 'orders', label: t('web.control panel.partner.page.orders'), icon: '📦' },
      { id: 'store', label: t('web.control panel.partner.page.store'), icon: '🏪' },
      { id: 'products', label: t('web.control panel.partner.page.products'), icon: '📋' },
      { id: 'earnings', label: t('web.control panel.partner.page.earnings'), icon: '💰' },
      { id: 'settings', label: t('web.control panel.partner.page.settings'), icon: '⚙️' }
    ],
    [t]
  );
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartnerInfo();
  }, []);

  const loadPartnerInfo = async () => {
    try {
      setLoading(true);
      setPartnerInfo(null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Navigate to specific tab route
    switch (tabId) {
      case 'orders':
        router.push('/partner/orders');
        break;
      case 'store':
        router.push('/partner/store');
        break;
      case 'products':
        router.push('/partner/products');
        break;
      case 'earnings':
        router.push('/partner/earnings');
        break;
      case 'settings':
        router.push('/partner/settings');
        break;
      default:
        // Stay on overview
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="text-gray-600" style={{ marginInlineStart: 12 }}>
          {copy.loading}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              مرحباً بك، {partnerInfo?.name || t('surfaces.الشريك')}
            </h1>
            <p className="text-gray-600 mt-1">{copy.welcomeSubtitle}</p>
          </div>
          <div style={{ textAlign: 'end' }}>
            <div className="text-sm text-gray-500">{copy.partnershipType}</div>
            <div className="text-lg font-semibold text-blue-600">
              {partnerInfo?.type === 'DSH' ? copy.dshType : copy.serviceType}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.totalOrders}</p>
              <p className="text-2xl font-bold text-gray-900">
                {partnerInfo?.stats?.totalOrders?.toLocaleString('ar-SA') || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.totalRevenue}</p>
              <p className="text-2xl font-bold text-gray-900">
                {partnerInfo?.stats?.totalRevenue?.toLocaleString('ar-SA') || '0'} ريال
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.activeOrders}</p>
              <p className="text-2xl font-bold text-gray-900">
                {partnerInfo?.stats?.activeOrders || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.rating}</p>
              <p className="text-2xl font-bold text-gray-900">
                {partnerInfo?.stats?.rating || '0'}/5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-6" style={{ gap: 32 }} aria-label={t('common.tabs')}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span style={{ marginInlineEnd: 8 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {copy.recentOrders}
                  </h3>
                  <div className="space-y-3">
                    {/* Load recent orders from API */}
                    <p className="text-sm text-gray-500">{copy.noRecentOrders}</p>
                  </div>
                  <button
                    onClick={() => handleTabChange('orders')}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {`${copy.viewAllOrders} ${forwardArrow}`}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {copy.quickActions}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleTabChange('products')}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">📋</span>
                        <span className="text-sm font-medium">{copy.addProduct}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange('store')}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">🏪</span>
                        <span className="text-sm font-medium">{copy.updateStore}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange('earnings')}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">📊</span>
                        <span className="text-sm font-medium">{copy.earningsReport}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabChange('settings')}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">⚙️</span>
                        <span className="text-sm font-medium">{copy.settings}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {copy.loadingTab} {tabs.find((tab) => tab.id === activeTab)?.label}...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

