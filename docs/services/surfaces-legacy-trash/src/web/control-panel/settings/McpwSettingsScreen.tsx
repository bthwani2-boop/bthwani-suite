'use client';
import { DirectionalIcon } from '@bthwani/ui-kit';

/**
 * McpwSettingsScreen — System Settings
 * Smart, smooth, modern design.
 */

import { useI18n } from '@bthwani/ui-kit/i18n';
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Key,
  Mail,
  Smartphone,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { McpwSectionHeader } from '../components/McpwDesignSystem';

function SettingSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-[17px] font-bold text-gray-900">{title}</h2>
        <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  iconColor,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
        isClickable ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={20} color={iconColor} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900">{title}</p>
          {description && <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {action ?? (isClickable && <DirectionalIcon icon={ChevronLeft} mirrorInRTL={true} size={20} className="text-gray-300 "  />)}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full border-0 cursor-pointer transition-colors duration-200 relative ${
        enabled ? 'bg-emerald-500' : 'bg-gray-200'
      }`}
    >
      <div
        className="w-6 h-6 rounded-full bg-white absolute top-0.5 shadow-sm transition-all duration-200"
        style={{ insetInlineStart: enabled ? 22 : 2 } as React.CSSProperties}
      />
    </button>
  );
}

export default function McpwSettingsScreen() {
  const { isRTL } = useI18n();

  return (
    <div className="w-full max-w-full min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <McpwSectionHeader
        title="الإعدادات"
        subtitle="تخصيص إعدادات النظام والحساب"
        icon={<Settings size={28} color="#FFF" strokeWidth={2} />}
        gradientFrom="#64748B"
        gradientTo="#475569"
        shadowColor="rgba(100, 116, 139, 0.3)"
      />

      {/* Profile Settings */}
      <SettingSection title="الحساب" description="إدارة معلومات حسابك الشخصي">
        <SettingRow
          icon={User}
          iconColor="#3B82F6"
          title="معلومات الحساب"
          description="الاسم والبريد الإلكتروني ورقم الهاتف"
          onClick={() => {}}
        />
        <SettingRow
          icon={Key}
          iconColor="#8B5CF6"
          title="كلمة المرور والأمان"
          description="تغيير كلمة المرور والمصادقة الثنائية"
          onClick={() => {}}
        />
        <SettingRow
          icon={Mail}
          iconColor="#EC4899"
          title="البريد الإلكتروني"
          description="إعدادات البريد والإشعارات"
          onClick={() => {}}
        />
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="الإشعارات" description="تحكم في إشعارات النظام">
        <SettingRow
          icon={Bell}
          iconColor="#F59E0B"
          title="إشعارات سطح المكتب"
          description="تفعيل الإشعارات على المتصفح"
          action={<Toggle enabled={true} onChange={() => {}} />}
        />
        <SettingRow
          icon={Smartphone}
          iconColor="#22C55E"
          title="إشعارات الهاتف"
          description="إرسال إشعارات للتطبيق"
          action={<Toggle enabled={true} onChange={() => {}} />}
        />
        <SettingRow
          icon={Mail}
          iconColor="#3B82F6"
          title="إشعارات البريد"
          description="إرسال ملخص يومي بالبريد"
          action={<Toggle enabled={false} onChange={() => {}} />}
        />
      </SettingSection>

      {/* Appearance */}
      <SettingSection title="المظهر" description="تخصيص مظهر الواجهة">
        <SettingRow
          icon={Globe}
          iconColor="#06B6D4"
          title="اللغة"
          description="العربية"
          onClick={() => {}}
        />
        <SettingRow
          icon={Palette}
          iconColor="#8B5CF6"
          title="المظهر"
          action={
            <div className="flex gap-2">
              {[
                { icon: Sun, label: 'فاتح', active: true },
                { icon: Moon, label: 'داكن', active: false },
                { icon: Monitor, label: 'تلقائي', active: false },
              ].map((mode, i) => (
                <button
                  key={i}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                    mode.active
                      ? 'border-2 border-blue-500 bg-blue-50 text-blue-600'
                      : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <mode.icon size={16} />
                  {mode.label}
                </button>
              ))}
            </div>
          }
        />
      </SettingSection>

      {/* Security */}
      <SettingSection title="الأمان" description="إعدادات الأمان والخصوصية">
        <SettingRow
          icon={Shield}
          iconColor="#EF4444"
          title="المصادقة الثنائية"
          description="تفعيل طبقة حماية إضافية"
          action={<Toggle enabled={false} onChange={() => {}} />}
        />
        <SettingRow
          icon={Database}
          iconColor="#6366F1"
          title="سجل النشاط"
          description="عرض سجل تسجيل الدخول والنشاط"
          onClick={() => {}}
        />
      </SettingSection>
    </div>
  );
}
