'use client';

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import { Box } from 'lucide-react';

const services = ['dsh', 'knz', 'amn', 'wlt', 'arb'] as const;

export default function McpwProductCatalogServiceSectionsScreen() {
  const { isRTL } = useI18n();
  return (
    <div className="w-full max-w-full min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="mb-4 flex items-center gap-3">
        <Box className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">كتالوج الخدمات الأساسية</h2>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        شاشة أقسام الكتالوج المرتبطة بخدمات KNZ/DSH/AMN/WLT/ARB.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {services.map((svc) => (
          <Link
            key={svc}
            href={`/product-catalog?svc=${svc}`}
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-900 hover:border-blue-300 hover:shadow-sm"
          >
            {svc.toUpperCase()} — فتح كتالوج المنتجات
          </Link>
        ))}
      </div>
    </div>
  );
}
