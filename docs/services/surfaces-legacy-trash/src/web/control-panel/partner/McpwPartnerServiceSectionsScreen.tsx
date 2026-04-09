'use client';

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import { Handshake } from 'lucide-react';

const services = ['dsh', 'knz', 'amn', 'wlt', 'arb'] as const;

export default function McpwPartnerServiceSectionsScreen() {
  const { isRTL } = useI18n();
  return (
    <div className="w-full max-w-full min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="mb-4 flex items-center gap-3">
        <Handshake className="h-6 w-6 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-900">شركاء الخدمات الأساسية</h2>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        قسم الشركاء المرتبط بخدمات KNZ/DSH/AMN/WLT/ARB داخل لوحة التحكم.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {services.map((svc) => (
          <Link
            key={svc}
            href={`/partner?svc=${svc}`}
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:shadow-sm"
          >
            {svc.toUpperCase()} — فتح قسم الشركاء
          </Link>
        ))}
      </div>
    </div>
  );
}
