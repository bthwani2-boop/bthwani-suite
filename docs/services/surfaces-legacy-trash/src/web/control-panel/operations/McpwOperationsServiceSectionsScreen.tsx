'use client';

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import { Layers } from 'lucide-react';

const services = [
  { id: 'dsh', label: 'DSH', href: '/operations/dsh' },
  { id: 'knz', label: 'KNZ', href: '/operations?svc=knz' },
  { id: 'amn', label: 'AMN', href: '/operations?svc=amn' },
  { id: 'wlt', label: 'WLT', href: '/operations?svc=wlt' },
  { id: 'arb', label: 'ARB', href: '/operations?svc=arb' },
];

export default function McpwOperationsServiceSectionsScreen() {
  const { isRTL } = useI18n();
  return (
    <div className="w-full max-w-full min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="mb-4 flex items-center gap-3">
        <Layers className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-900">عمليات الخدمات الأساسية</h2>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        ربط مباشر للخدمات KNZ/DSH/AMN/WLT/ARB ضمن قسم العمليات في لوحة التحكم.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-900 hover:border-orange-300 hover:shadow-sm"
          >
            {service.label} — فتح قسم العمليات
          </Link>
        ))}
      </div>
    </div>
  );
}
