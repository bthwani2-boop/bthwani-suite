import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// User Profile Surface - ملف المستخدم الشخصي
export default function UserProfileSurface() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen" style={{ backgroundColor: semanticRoles.surface }}>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: semanticRoles.textPrimary }}>
          الملف الشخصي
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8" style={{ backgroundColor: semanticRoles.surfaceElevated }}>
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: semanticRoles.textPrimary }}>
                  أحمد محمد
                </h2>
                <p style={{ color: semanticRoles.textSecondary }}>ahmed@example.com</p>
                <p style={{ color: semanticRoles.textSecondary }}>+966 50 123 4567</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: semanticRoles.textPrimary }}>
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  style={{
                    backgroundColor: semanticRoles.surface,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.textPrimary
                  }}
                  defaultValue="أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: semanticRoles.textPrimary }}>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border rounded-lg"
                  style={{
                    backgroundColor: semanticRoles.surface,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.textPrimary
                  }}
                  defaultValue="+966 50 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: semanticRoles.textPrimary }}>
                  العنوان
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg h-24"
                  style={{
                    backgroundColor: semanticRoles.surface,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.textPrimary
                  }}
                  placeholder={t('user.UserProfileSurface.placeholder')}
                />
              </div>

              <button
                className="w-full py-3 px-6 rounded-lg font-medium"
                style={{
                  backgroundColor: semanticRoles.primary,
                  color: semanticRoles.onPrimary
                }}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
