/**
 * CONTROL PANEL Operations Hub Surface
 * 
 * Architecture Rule: §86 SSoT - Screen logic in packages/surfaces only
 * This surface is used by apps/web/control panel/app/operations/page.tsx as a thin wrapper
 */

import Link from 'next/link';

export function OperationsHubSurface() {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            لوحة العمليات - BTHWANI
          </h1>
          <p className="text-xl text-gray-600">
            إدارة العمليات والأنشطة اليومية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* DSH Operations */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div style={{ marginInlineStart: 20 }}>
                  <h3 className="text-lg font-medium text-gray-900">عمليات DSH</h3>
                  <p className="text-sm text-gray-600">إدارة الطلبات والمتاجر</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/operations/dsh"
                  className="btn btn-primary w-full"
                >
                  عرض عمليات DSH
                </Link>
              </div>
            </div>
          </div>

          {/* KNZ Operations */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div style={{ marginInlineStart: 20 }}>
                  <h3 className="text-lg font-medium text-gray-900">عمليات KNZ</h3>
                  <p className="text-sm text-gray-600">إدارة الإعلانات والقوائم</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/operations/knz"
                  className="btn btn-success w-full"
                >
                  عرض عمليات KNZ
                </Link>
              </div>
            </div>
          </div>

          {/* Other Operations */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div style={{ marginInlineStart: 20 }}>
                  <h3 className="text-lg font-medium text-gray-900">عمليات أخرى</h3>
                  <p className="text-sm text-gray-600">المحافظ والمطالبات</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/operations/other"
                  className="btn btn-secondary w-full"
                >
                  عرض العمليات الأخرى
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
            العودة للوحة التحكم الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

