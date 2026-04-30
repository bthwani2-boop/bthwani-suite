// Support Hub Surface - CONTROL PANEL Support Hub
// Part of Surfaces Package - UI screen implementation
// Compliance: §REPO-001 §2.4.2 - Surfaces Package Specification

'use client';

import Link from 'next/link';
import { DshSupportChatScreen, ArbPartnerBookingsListScreen } from './index';

export function SupportHubSurface() {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            الدعم والمساعدة - BTHWANI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            إدارة الشكاوى والاستفسارات والدعم الفني
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* DSH Support Chat */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">دردشة الدعم - DSH</h3>
                  <p className="text-sm text-gray-600">الدردشة المباشرة مع عملاء DSH</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/support/dsh-chat"
                  className="btn btn-primary w-full"
                >
                  فتح الدردشة
                </Link>
              </div>
            </div>
          </div>

          {/* ARB Partner Bookings */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="mr-5">
                  <h3 className="text-lg font-medium text-gray-900">حجوزات شركاء ARB</h3>
                  <p className="text-sm text-gray-600">قائمة حجوزات شركاء ARB</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/support/arb-bookings"
                  className="btn btn-success w-full"
                >
                  عرض الحجوزات
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

