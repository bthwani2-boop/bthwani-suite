'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import type { EarningsData } from '../fixtures/earnings';

interface PartnerEarningsProps {}

export default function PartnerEarnings({}: PartnerEarningsProps) {
  const { t, isRTL, currentLanguage } = useI18n();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);

  const copy =
    currentLanguage === 'ar'
      ? {
          loading: 'جاري تحميل بيانات الأرباح...',
          notFound: 'لم يتم العثور على بيانات الأرباح',
          headerTitle: 'تقرير الأرباح',
          headerSubtitle: 'مراقبة وتحليل أرباحك المالية',
          totalEarningsLabel: 'إجمالي الأرباح',
          periodLabel: 'الفترة الزمنية:',
          cardTotal: 'إجمالي الأرباح',
          cardPending: 'أرباح معلقة',
          cardPaid: 'أرباح مدفوعة',
          performanceTitle: 'إحصائيات الأداء',
          statTotalOrders: 'إجمالي الطلبات',
          statAvgOrder: 'متوسط قيمة الطلب',
          statSatisfaction: 'رضا العملاء',
          statDelivery: 'متوسط وقت التوصيل',
          statDeliveryUnit: 'دقيقة',
          txTitle: 'سجل المعاملات المالية',
          noTx: 'لا توجد معاملات في هذه الفترة',
          exportTitle: 'تصدير التقارير',
          exportPdf: '📊 تصدير PDF',
          exportExcel: '📈 تصدير Excel',
          exportEmail: '📧 إرسال بالبريد الإلكتروني',
        }
      : {
          loading: 'Loading earnings data...',
          notFound: 'No earnings data found',
          headerTitle: 'Earnings report',
          headerSubtitle: 'Monitor and analyze your earnings',
          totalEarningsLabel: 'Total earnings',
          periodLabel: 'Period:',
          cardTotal: 'Total earnings',
          cardPending: 'Pending earnings',
          cardPaid: 'Paid earnings',
          performanceTitle: 'Performance statistics',
          statTotalOrders: 'Total orders',
          statAvgOrder: 'Average order value',
          statSatisfaction: 'Customer satisfaction',
          statDelivery: 'Average delivery time',
          statDeliveryUnit: 'min',
          txTitle: 'Transaction history',
          noTx: 'No transactions for this period',
          exportTitle: 'Export reports',
          exportPdf: '📊 Export PDF',
          exportExcel: '📈 Export Excel',
          exportEmail: '📧 Send by email',
        };
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadEarnings();
  }, [selectedPeriod]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      setEarnings(null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return t('surfaces.طلب');
      case 'bonus': return 'مكافأة';
      case 'penalty': return t('surfaces.غرامة');
      case 'refund': return t('surfaces.استرداد');
      default: return type;
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  if (!earnings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{copy.notFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{copy.headerTitle}</h1>
            <p className="text-gray-600 mt-1">{copy.headerSubtitle}</p>
          </div>
          <div style={{ textAlign: 'end' }}>
            <div className="text-sm text-gray-500">{copy.totalEarningsLabel}</div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(earnings.totalEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center" style={{ gap: 16 }}>
          <span className="text-sm font-medium text-gray-700">{copy.periodLabel}</span>
          {[
            { id: 'today', label: t('web.control panel.partner.earnings.page.today') },
            { id: 'week', label: t('web.control panel.partner.earnings.page.thisWeek') },
            { id: 'month', label: t('web.control panel.partner.earnings.page.thisMonth') },
            { id: 'year', label: t('web.control panel.partner.earnings.page.thisYear') }
          ].map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedPeriod === period.id
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.cardTotal}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.cardPending}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.pendingEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div style={{ marginInlineStart: 16 }}>
              <p className="text-sm font-medium text-gray-600">{copy.cardPaid}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.paidEarnings)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">{copy.performanceTitle}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{earnings.stats.totalOrders}</div>
            <div className="text-sm text-gray-600">{copy.statTotalOrders}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(earnings.stats.averageOrderValue)}</div>
            <div className="text-sm text-gray-600">{copy.statAvgOrder}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{earnings.stats.customerSatisfaction}/5</div>
            <div className="text-sm text-gray-600">{copy.statSatisfaction}</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {earnings.stats.deliveryTime} {copy.statDeliveryUnit}
            </div>
            <div className="text-sm text-gray-600">{copy.statDelivery}</div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{copy.txTitle}</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {earnings.transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">{copy.noTx}</p>
            </div>
          ) : (
            earnings.transactions.map(transaction => (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center" style={{ gap: 12 }}>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                        {transaction.status === 'paid' ? t('surfaces.مدفوع') :
                         transaction.status === 'pending' ? 'معلق' : 'ملغي'}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-600" style={{ gap: 16 }}>
                      <span>{getTransactionTypeLabel(transaction.type)}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'end' }}>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'penalty' || transaction.type === 'refund'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {transaction.type === 'penalty' || transaction.type === 'refund' ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{copy.exportTitle}</h2>

        <div className="flex" style={{ gap: 16 }}>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            {copy.exportPdf}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            {copy.exportExcel}
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700">
            {copy.exportEmail}
          </button>
        </div>
      </div>
    </div>
  );
}

