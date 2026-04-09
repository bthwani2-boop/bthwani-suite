'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import type { Order } from '../fixtures/orders';

interface PartnerOrdersProps {}

export default function PartnerOrders({}: PartnerOrdersProps) {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setOrders([]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject' | 'prepare' | 'ready' | 'complete') => {
    try {
      
      // await api.post(`/api/entities/${orderId}/action`, {
      //   domain: 'DSH',
      //   action: action,
      //   partnerId: 'currentPartnerId'
      // });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: action === 'accept' ? 'accepted' :
                       action === 'prepare' ? 'preparing' :
                       action === 'ready' ? 'ready' :
                       action === 'complete' ? 'completed' : order.status
              }
            : order
        )
      );

      // Show success message
      alert(`تم ${getActionLabel(action)} الطلب بنجاح`);

    } catch (error) {
      alert(`فشل في ${getActionLabel(action)} الطلب`);
    }
  };

  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'accept': return 'قبول';
      case 'reject': return 'رفض';
      case 'prepare': return t('surfaces.تحضير');
      case 'ready': return t('surfaces.تجهيز');
      case 'complete': return 'إكمال';
      default: return action;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending': return t('surfaces.في_الانتظار');
      case 'accepted': return 'مقبول';
      case 'preparing': return t('surfaces.قيد_التحضير');
      case 'ready': return t('surfaces.جاهز');
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'active') return ['accepted', 'preparing', 'ready'].includes(order.status);
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">جاري تحميل الطلبات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
            <p className="text-gray-600 mt-1">عرض وإدارة جميع الطلبات الواردة</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">إجمالي الطلبات</div>
            <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">فلترة:</span>
          {[
            { id: 'all', label: t('web.control panel.partner.orders.page.allOrders'), count: orders.length },
            { id: 'pending', label: t('web.control panel.partner.orders.page.waiting'), count: orders.filter(o => o.status === 'pending').length },
            { id: 'active', label: t('web.control panel.partner.orders.page.active'), count: orders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status)).length },
            { id: 'completed', label: t('web.control panel.partner.orders.page.completed'), count: orders.filter(o => o.status === 'completed').length }
          ].map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === filterOption.id
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {filter === 'all' ? t('surfaces.جميع_الطلبات') :
             filter === 'pending' ? t('surfaces.الطلبات_في_الانتظار') :
             filter === 'active' ? t('surfaces.الطلبات_النشطة') : t('surfaces.الطلبات_المكتملة')}
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">لا توجد طلبات في هذه الفئة</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        طلب #{order.id}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">العميل:</span> {order.customerName}
                      </div>
                      <div>
                        <span className="font-medium">الهاتف:</span> {order.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">المبلغ:</span> {order.totalAmount.toFixed(2)} ريال
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">المنتجات:</div>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {item.name} (x{item.quantity}) - {item.price.toFixed(2)} ريال
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOrderAction(order.id, 'accept')}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                          قبول الطلب
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'reject')}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                        >
                          رفض الطلب
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'prepare')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      >
                        بدء التحضير
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'ready')}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
                      >
                        الطلب جاهز
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleOrderAction(order.id, 'complete')}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                      >
                        تم التسليم
                      </button>
                    )}

                    <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

