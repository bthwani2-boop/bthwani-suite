'use client';

import { useCallback, useEffect, useState } from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { X, Save, Sparkles } from 'lucide-react';
import type { DshPromoBoxAdmin, DshPromoBoxActionType } from '../types';
import {
  PROMO_BOX_ACTION_TYPES,
  SUGGESTED_BG_COLORS,
  SUGGESTED_BADGE_COLORS,
  SUGGESTED_ICONS,
  DSH_SCREENS,
  MAX_ACTIVE_PROMO_BOXES,
} from '../types';
import { addPromoBox, updatePromoBox, getActivePromoBoxCount } from '../mockPromoBoxStore';

export type PromoBoxDrawerMode = 'create' | 'edit';

interface PromoBoxDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: PromoBoxDrawerMode;
  editPromo: DshPromoBoxAdmin | null;
  onSaved: () => void;
}

const defaultPromo: Omit<DshPromoBoxAdmin, 'id' | 'created_at' | 'updated_at'> = {
  icon: '🎁',
  badge: 'عرض',
  badge_color: '#FF500D',
  title: '',
  subtitle: '',
  action_type: 'screen',
  action_target: 'DshOffersGet',
  bg_color: '#0A2F5C',
  text_color: '#FFFFFF',
  is_active: false,
  priority: 99,
  status: 'draft',
};

export function PromoBoxDrawer({ open, onClose, mode, editPromo, onSaved }: PromoBoxDrawerProps) {
  const [form, setForm] = useState(defaultPromo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && editPromo) {
        setForm({
          icon: editPromo.icon,
          badge: editPromo.badge,
          badge_color: editPromo.badge_color,
          title: editPromo.title,
          subtitle: editPromo.subtitle,
          action_type: editPromo.action_type,
          action_target: editPromo.action_target,
          bg_color: editPromo.bg_color,
          text_color: editPromo.text_color,
          is_active: editPromo.is_active,
          priority: editPromo.priority,
          status: editPromo.status,
          starts_at: editPromo.starts_at,
          ends_at: editPromo.ends_at,
        });
      } else if (mode === 'create' && editPromo) {
        setForm({
          ...defaultPromo,
          icon: editPromo.icon,
          badge: editPromo.badge,
          badge_color: editPromo.badge_color,
          title: editPromo.title + ' (نسخة)',
          subtitle: editPromo.subtitle,
          action_type: editPromo.action_type,
          action_target: editPromo.action_target,
          bg_color: editPromo.bg_color,
          text_color: editPromo.text_color,
        });
      } else {
        setForm(defaultPromo);
      }
    }
  }, [open, mode, editPromo]);

  const handleChange = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!form.title.trim()) {
      alert('العنوان مطلوب');
      return;
    }
    if (!form.badge.trim()) {
      alert('نص الشارة مطلوب');
      return;
    }

    if (form.is_active && form.status === 'published') {
      const currentActive = getActivePromoBoxCount();
      const isAlreadyActive = mode === 'edit' && editPromo?.is_active && editPromo?.status === 'published';
      if (!isAlreadyActive && currentActive >= MAX_ACTIVE_PROMO_BOXES) {
        alert(`الحد الأقصى للإعلانات النشطة هو ${MAX_ACTIVE_PROMO_BOXES}.`);
        return;
      }
    }

    setSaving(true);
    setTimeout(() => {
      if (mode === 'edit' && editPromo) {
        updatePromoBox({
          ...editPromo,
          ...form,
        });
      } else {
        addPromoBox(form);
      }
      setSaving(false);
      onSaved();
      onClose();
    }, 300);
  }, [form, mode, editPromo, onSaved, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div
        className="relative ms-auto flex h-full w-full max-w-xl flex-col overflow-hidden shadow-2xl"
        style={{ backgroundColor: semanticRoles.surface }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: semanticRoles.border }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5" style={{ color: semanticRoles.accent }} />
            <h2 className="text-lg font-semibold" style={{ color: semanticRoles.text }}>
              {mode === 'edit' ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-black/5"
          >
            <X className="h-5 w-5" style={{ color: semanticRoles.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Live Preview */}
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                معاينة مباشرة
              </label>
              <div
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ backgroundColor: form.bg_color }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span className="text-2xl">{form.icon}</span>
                </div>
                <div className="flex-1">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: form.badge_color }}
                  >
                    {form.badge || 'شارة'}
                  </span>
                  <p className="mt-1 text-sm font-bold" style={{ color: form.text_color }}>
                    {form.title || 'العنوان الرئيسي'}
                  </p>
                  <p className="text-xs opacity-80" style={{ color: form.text_color }}>
                    {form.subtitle || 'العنوان الفرعي'}
                  </p>
                </div>
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                الأيقونة
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange('icon', icon)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-colors"
                    style={{
                      borderColor: form.icon === icon ? semanticRoles.accent : semanticRoles.border,
                      backgroundColor: form.icon === icon ? `${semanticRoles.accent}15` : 'transparent',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="أو أدخل إيموجي مخصص"
                className="mt-2 w-full rounded-lg border px-3 py-2 text-center text-xl"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                maxLength={4}
              />
            </div>

            {/* Badge */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                  نص الشارة
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => handleChange('badge', e.target.value)}
                  placeholder="مثل: برو، جديد، تخفيضات"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                  maxLength={20}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                  لون الشارة
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_BADGE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleChange('badge_color', c.value)}
                      className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.value,
                        borderColor: form.badge_color === c.value ? '#fff' : 'transparent',
                        boxShadow: form.badge_color === c.value ? '0 0 0 2px ' + c.value : 'none',
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                العنوان الرئيسي *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="مثل: توصيل شبه مجاني"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                maxLength={50}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                العنوان الفرعي
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="مثل: اشترك الآن!"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                maxLength={50}
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                لون الخلفية
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_BG_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleChange('bg_color', c.value)}
                    className="h-10 w-10 rounded-lg border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      borderColor: form.bg_color === c.value ? '#fff' : 'transparent',
                      boxShadow: form.bg_color === c.value ? '0 0 0 2px ' + c.value : 'none',
                    }}
                    title={c.label}
                  />
                ))}
              </div>
              <input
                type="color"
                value={form.bg_color}
                onChange={(e) => handleChange('bg_color', e.target.value)}
                className="mt-2 h-10 w-full cursor-pointer rounded-lg"
              />
            </div>

            {/* Action Type & Target */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                  نوع الإجراء
                </label>
                <select
                  value={form.action_type}
                  onChange={(e) => handleChange('action_type', e.target.value as DshPromoBoxActionType)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                >
                  {PROMO_BOX_ACTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === 'screen'
                        ? 'شاشة داخلية'
                        : t === 'url'
                          ? 'رابط خارجي'
                          : t === 'deeplink'
                            ? 'ديب لينك'
                            : 'اشتراك برو'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                  {form.action_type === 'screen' ? 'الشاشة المستهدفة' : 'الرابط'}
                </label>
                {form.action_type === 'screen' || form.action_type === 'subscription' ? (
                  <select
                    value={form.action_target}
                    onChange={(e) => handleChange('action_target', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                  >
                    {DSH_SCREENS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="url"
                    value={form.action_target}
                    onChange={(e) => handleChange('action_target', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
                  />
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: semanticRoles.text }}>
                ترتيب الظهور (الأقل = الأولوية الأعلى)
              </label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => handleChange('priority', parseInt(e.target.value) || 1)}
                min={1}
                max={99}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}
              />
            </div>

            {/* Status & Active */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.status === 'published'}
                  onChange={(e) => handleChange('status', e.target.checked ? 'published' : 'draft')}
                  className="h-5 w-5 rounded accent-orange-500"
                />
                <span className="text-sm" style={{ color: semanticRoles.text }}>
                  نشر الإعلان
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="h-5 w-5 rounded accent-orange-500"
                />
                <span className="text-sm" style={{ color: semanticRoles.text }}>
                  تفعيل في الصندوق الدوار
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t px-6 py-4"
          style={{ borderColor: semanticRoles.border }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            style={{ borderColor: semanticRoles.border, color: semanticRoles.text }}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: semanticRoles.accent }}
          >
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  );
}
