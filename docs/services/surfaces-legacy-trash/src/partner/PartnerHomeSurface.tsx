import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';

// Partner Home Surface - دمج من webapp
export default function PartnerHomeSurface() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: semanticRoles.textPrimary }}>
          لوحة تحكم الشريك
        </h1>
        <p className="text-xl text-center mb-12" style={{ color: semanticRoles.textSecondary }}>
          إدارة أعمالك وطلباتك
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>الطلبات</h3>
            <p style={{ color: semanticRoles.textSecondary }}>إدارة طلبات العملاء</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>المتجر</h3>
            <p style={{ color: semanticRoles.textSecondary }}>إدارة منتجاتك</p>
          </div>
          <div className="card p-6" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: semanticRoles.textPrimary }}>المالية</h3>
            <p style={{ color: semanticRoles.textSecondary }}>تتبع الإيرادات والمدفوعات</p>
          </div>
        </div>
      </div>
    </div>
  );
}
