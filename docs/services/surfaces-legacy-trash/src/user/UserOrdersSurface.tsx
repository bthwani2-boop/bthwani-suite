import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';

// User Orders Surface - طلبات المستخدم
export default function UserOrdersSurface() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: semanticRoles.textPrimary }}>
          طلباتي
        </h1>

        <div className="space-y-4">
          {/* مثال على طلب */}
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: semanticRoles.textPrimary }}>
                  طلب توصيل طعام
                </h3>
                <p className="text-sm mt-1" style={{ color: semanticRoles.textSecondary }}>
                  من مطعم الرياض - إلى حي العليا
                </p>
                <p className="text-sm mt-2" style={{ color: semanticRoles.textTertiary }}>
                  الحالة: قيد التوصيل
                </p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold" style={{ color: semanticRoles.textPrimary }}>
                  45 ريال
                </p>
                <p className="text-sm" style={{ color: semanticRoles.textSecondary }}>
                  15 دقيقة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
