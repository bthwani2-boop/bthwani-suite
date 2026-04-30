'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import type { StoreInfo } from '../fixtures/store';

interface PartnerStoreProps {}

type OpeningHoursEntry = StoreInfo['openingHours'][string];

const defaultOpeningHoursEntry: OpeningHoursEntry = {
  open: '',
  close: '',
  closed: false,
};

export default function PartnerStore({}: PartnerStoreProps) {
  const { t } = useI18n();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StoreInfo>>({});

  useEffect(() => {
    loadStoreInfo();
  }, []);

  const loadStoreInfo = async () => {
    try {
      setLoading(true);
      setStore(null);
      setFormData({});
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      
      // await api.patch('/api/partners/current/store', formData);

      setStore(formData as StoreInfo);
      setEditing(false);
      alert('تم حفظ معلومات المتجر بنجاح');
    } catch (error) {
      alert('فشل في حفظ معلومات المتجر');
    }
  };

  const updateOpeningHours = <K extends keyof OpeningHoursEntry>(
    day: string,
    field: K,
    value: OpeningHoursEntry[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...(prev.openingHours ?? {}),
        [day]: {
          ...(prev.openingHours?.[day] ?? defaultOpeningHoursEntry),
          [field]: value
        }
      }
    }));
  };

  const updateDeliveryZone = (index: number, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones?.map((zone, i) =>
        i === index ? { ...zone, [field]: value } : zone
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">جاري تحميل معلومات المتجر...</span>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على معلومات المتجر</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المتجر</h1>
            <p className="text-gray-600 mt-1">تحديث معلومات المتجر والإعدادات</p>
          </div>
          <div className="flex space-x-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                تعديل المعلومات
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Store Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">حالة المتجر</h2>
            <p className="text-sm text-gray-600 mt-1">
              التحكم فيما إذا كان المتجر يستقبل طلبات جديدة
            </p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mr-3 ${
              store.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {store.isOpen ? 'مفتوح' : 'مغلق'}
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isOpen || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isOpen: e.target.checked }))}
                disabled={!editing}
              />
              <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                formData.isOpen ? 'bg-green-600' : 'bg-gray-300'
              } ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isOpen ? 'translate-x-4' : 'translate-x-0'
                }`}></span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">المعلومات الأساسية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المتجر
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{store.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{store.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            {editing ? (
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{store.description}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{store.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">ساعات العمل</h2>

        <div className="space-y-4">
          {Object.entries(formData.openingHours || {}).map(([day, hours]: [string, any]) => (
            <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900 capitalize">
                {day === 'sunday' ? t('surfaces.الأحد') :
                 day === 'monday' ? t('surfaces.الاثنين') :
                 day === 'tuesday' ? 'الثلاثاء' :
                 day === 'wednesday' ? 'الأربعاء' :
                 day === 'thursday' ? 'الخميس' :
                 day === 'friday' ? 'الجمعة' : 'السبت'}
              </div>

              <div className="flex items-center space-x-4">
                {editing ? (
                  <>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) => updateOpeningHours(day, 'closed', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">مغلق</span>
                    </label>

                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-gray-600">
                    {hours.closed ? 'مغلق' : `${hours.open} - ${hours.close}`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">مناطق التوصيل</h2>

        <div className="space-y-4">
          {formData.deliveryZones?.map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{zone.name}</div>

              {editing ? (
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-xs text-gray-600">رسوم التوصيل</label>
                    <input
                      type="number"
                      value={zone.fee}
                      onChange={(e) => updateDeliveryZone(index, 'fee', parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">الحد الأدنى</label>
                    <input
                      type="number"
                      value={zone.minOrder}
                      onChange={(e) => updateDeliveryZone(index, 'minOrder', parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-right text-sm text-gray-600">
                  <div>رسوم التوصيل: {zone.fee} ريال</div>
                  <div>الحد الأدنى: {zone.minOrder} ريال</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">إحصائيات المتجر</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{store.totalOrders}</div>
            <div className="text-sm text-gray-600">إجمالي الطلبات</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{store.rating}</div>
            <div className="text-sm text-gray-600">متوسط التقييم</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{store.cuisine.join(', ')}</div>
            <div className="text-sm text-gray-600">أنواع المطبخ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
