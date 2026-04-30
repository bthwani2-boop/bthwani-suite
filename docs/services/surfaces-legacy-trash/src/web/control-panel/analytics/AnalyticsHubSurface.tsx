/**
 * CONTROL PANEL Analytics Hub Surface
 * 
 * Architecture Rule: §86 SSoT - Screen logic in packages/surfaces only
 * This surface is used by apps/web/control panel/app/analytics/page.tsx as a thin wrapper
 */

import Link from 'next/link';
import { AmnCaptainEarningsScreen } from '@bthwani/surfaces/control panel/analytics';

export function AnalyticsHubSurface() {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            لوحة التحليلات - BTHWANI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            التقارير والإحصائيات والتحليلات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Captain Earnings Analytics */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">أرباح الكباتن</h3>
                  <p className="text-sm text-gray-600">تحليل أرباح كباتن AMN</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/analytics/captain-earnings"
                  className="btn btn-success w-full"
                >
                  عرض الأرباح
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">تحليلات الأداء</h3>
                  <p className="text-sm text-gray-600">مؤشرات الأداء والإنتاجية</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/analytics/performance"
                  className="btn btn-primary w-full"
                >
                  عرض الأداء
                </Link>
              </div>
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">تحليلات الإيرادات</h3>
                  <p className="text-sm text-gray-600">تحليل الإيرادات والمبيعات</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/analytics/revenue"
                  className="btn btn-secondary w-full"
                >
                  عرض الإيرادات
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="btn btn-outline"
          >
            ← العودة للوحة التحكم الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

