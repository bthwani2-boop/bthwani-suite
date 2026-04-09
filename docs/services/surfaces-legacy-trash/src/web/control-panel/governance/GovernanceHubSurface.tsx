// Governance Hub Surface - CONTROL PANEL Governance Hub
// Part of Surfaces Package - UI screen implementation
// Compliance: §REPO-001 §2.4.2 - Surfaces Package Specification

'use client';

import Link from 'next/link';

export function GovernanceHubSurface() {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            لوحة الحكم والإعدادات - BTHWANI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            إدارة المتغيرات التشغيلية والإعدادات النظامية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Runtime Variables */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">المتغيرات التشغيلية</h3>
                  <p className="text-sm text-gray-600">إدارة إعدادات النظام والمتغيرات</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/governance/runtime-vars"
                  className="btn btn-primary w-full"
                >
                  إدارة المتغيرات
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">علامات الميزات</h3>
                  <p className="text-sm text-gray-600">تشغيل وإيقاف الميزات</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/governance/feature-flags"
                  className="btn btn-success w-full"
                >
                  إدارة العلامات
                </Link>
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">إعدادات النظام</h3>
                  <p className="text-sm text-gray-600">تكوين النظام والأمان</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/governance/system-config"
                  className="btn btn-secondary w-full"
                >
                  إعدادات النظام
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

