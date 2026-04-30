'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { X, BookTemplate } from 'lucide-react';
import { BannerForm } from './BannerForm';
import { BannerPreview } from './BannerPreview';
import type { DshBannerAdmin } from '../types';
import { getBanners, addBanner, updateBanner } from '../mockBannersStore';
import { addCustomTemplate } from '../customBannerTemplatesStore';
import { computeBannerQualityScore } from '../utils/computeBannerQualityScore';

export type BannerDrawerMode = 'create' | 'edit';

interface BannerDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: BannerDrawerMode;
  /** عند التعديل: البنر المراد تعديله */
  editBanner?: DshBannerAdmin | null;
  /** يُستدعى بعد الحفظ لتنشيط القائمة */
  onSaved?: () => void;
}

const defaultCreateValues: Partial<DshBannerAdmin> = {
  id: '',
  action_type: 'offer',
  aspect_ratio: 'rectangle',
  animation_type: 'slide',
  click_count: 0,
  status: 'draft',
  schedule_type: 'always',
  overlay_enabled: false,
  overlay_side: 'end',
  overlay_width_percent: 40,
  overlay_color: '#000000',
  overlay_opacity: 0.65,
};

export function BannerDrawer({
  open,
  onClose,
  mode,
  editBanner,
  onSaved,
}: BannerDrawerProps) {
  const { t } = useI18n();
  const nextPosition = useMemo(() => getBanners().length + 1, [open]);

  const initialValues = useMemo((): Partial<DshBannerAdmin> => {
    if (mode === 'edit' && editBanner) return { ...editBanner };
    if (mode === 'create' && editBanner) {
      const title = (editBanner.title || '').trim();
      return {
        ...editBanner,
        id: '',
        click_count: 0,
        cap_used: 0,
        status: 'draft',
        title: title ? `${title} (نسخة)` : editBanner.title,
        position: nextPosition,
      };
    }
    return {
      ...defaultCreateValues,
      position: nextPosition,
    };
  }, [mode, editBanner, nextPosition]);

  const [formValues, setFormValues] = useState<Partial<DshBannerAdmin>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [previewDir, setPreviewDir] = useState<'rtl' | 'ltr'>('rtl');
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar');
  const [saveAsTemplateOpen, setSaveAsTemplateOpen] = useState(false);
  const [saveAsTemplateName, setSaveAsTemplateName] = useState('');
  const [customTemplatesVersion, setCustomTemplatesVersion] = useState(0);

  useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [open, initialValues]);

  const handleValuesChange = useCallback((partial: Partial<DshBannerAdmin>) => {
    setFormValues((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSubmit = useCallback(
    (values: DshBannerAdmin) => {
      setSaving(true);
      setTimeout(() => {
        if (mode === 'edit' && values.id) {
          updateBanner(values);
        } else {
          addBanner({ ...values, id: values.id || `b${Date.now()}` });
        }
        setSaving(false);
        onSaved?.();
        onClose();
      }, 400);
    },
    [mode, onSaved, onClose]
  );

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const openSaveAsTemplate = useCallback(() => {
    setSaveAsTemplateName((formValues.title || '').trim() || '');
    setSaveAsTemplateOpen(true);
  }, [formValues.title]);

  const handleSaveAsTemplateConfirm = useCallback(() => {
    const name = saveAsTemplateName.trim() || (formValues.title || '').trim() || t('marketing.banners_save_as_template_default');
    const { id: _id, click_count: _c, ...rest } = formValues;
    addCustomTemplate(name, rest);
    setCustomTemplatesVersion((v) => v + 1);
    setSaveAsTemplateOpen(false);
    setSaveAsTemplateName('');
  }, [saveAsTemplateName, formValues, t]);

  const handleSaveAsTemplateCancel = useCallback(() => {
    setSaveAsTemplateOpen(false);
    setSaveAsTemplateName('');
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className="fixed top-0 end-0 z-50 h-full w-full max-w-lg overflow-y-auto border-s shadow-xl"
        style={{
          backgroundColor: semanticRoles.surface,
          borderColor: semanticRoles.border,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="banner-drawer-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3" style={{ borderColor: semanticRoles.border, backgroundColor: semanticRoles.surface }}>
          <h2 id="banner-drawer-title" className="text-lg font-semibold" style={{ color: semanticRoles.text }}>
            {mode === 'edit' ? t('marketing.banners_form_edit_title') : t('marketing.banners_form_create')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 transition-colors hover:opacity-80"
            style={{ color: semanticRoles.textSecondary }}
            aria-label={t('marketing.banners_form_cancel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* معاينة البنر قبل النشر — قسم بارز لا يُخطئه المستخدم */}
          <section
            className="rounded-xl border-2 p-4"
            style={{
              borderColor: semanticRoles.border,
              backgroundColor: semanticRoles.surfaceSubtle,
            }}
            aria-labelledby="banner-preview-before-publish"
          >
            <h3
              id="banner-preview-before-publish"
              className="text-base font-semibold mb-1"
              style={{ color: semanticRoles.text }}
            >
              {t('marketing.banners_preview_before_publish')}
            </h3>
            <p className="text-sm mb-2" style={{ color: semanticRoles.textSecondary }}>
              {t('marketing.banners_preview_before_publish_hint')}
            </p>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: semanticRoles.textSecondary }}>
                {t('marketing.banners_quality_score')}:
              </span>
              <span className="text-sm font-semibold" style={{ color: semanticRoles.text }}>
                {computeBannerQualityScore(formValues)}/100
              </span>
              <div
                className="h-2 flex-1 max-w-[120px] rounded-full overflow-hidden"
                style={{ backgroundColor: semanticRoles.surfaceSubtle }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${computeBannerQualityScore(formValues)}%`,
                    backgroundColor: semanticRoles.accent,
                  }}
                />
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs" style={{ color: semanticRoles.textSecondary }}>
                {t('marketing.banners_preview_device')}:
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDir('rtl')}
                  className={`rounded px-2 py-1 text-xs font-medium ${previewDir === 'rtl' ? 'opacity-100' : 'opacity-60'}`}
                  style={{
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                    backgroundColor: previewDir === 'rtl' ? semanticRoles.surfaceSubtle : semanticRoles.surface,
                    border: `1px solid ${semanticRoles.border}`,
                  }}
                >
                  {t('marketing.banners_preview_rtl')}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDir('ltr')}
                  className={`rounded px-2 py-1 text-xs font-medium ${previewDir === 'ltr' ? 'opacity-100' : 'opacity-60'}`}
                  style={{
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                    backgroundColor: previewDir === 'ltr' ? semanticRoles.surfaceSubtle : semanticRoles.surface,
                    border: `1px solid ${semanticRoles.border}`,
                  }}
                >
                  {t('marketing.banners_preview_ltr')}
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewLang('ar')}
                  className={`rounded px-2 py-1 text-xs font-medium ${previewLang === 'ar' ? 'opacity-100' : 'opacity-60'}`}
                  style={{
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                    backgroundColor: previewLang === 'ar' ? semanticRoles.surfaceSubtle : semanticRoles.surface,
                    border: `1px solid ${semanticRoles.border}`,
                  }}
                >
                  {t('marketing.banners_preview_ar')}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`rounded px-2 py-1 text-xs font-medium ${previewLang === 'en' ? 'opacity-100' : 'opacity-60'}`}
                  style={{
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                    backgroundColor: previewLang === 'en' ? semanticRoles.surfaceSubtle : semanticRoles.surface,
                    border: `1px solid ${semanticRoles.border}`,
                  }}
                >
                  {t('marketing.banners_preview_en')}
                </button>
              </div>
            </div>

            <div
              className="mx-auto w-[min(100%,320px)] rounded-[2rem] border-4 p-2"
              style={{
                borderColor: semanticRoles.textMuted ?? '#333',
                backgroundColor: semanticRoles.textMuted ?? '#111',
              }}
              role="img"
              aria-label={t('marketing.banners_preview_device')}
            >
              <div dir={previewDir} lang={previewLang} className="rounded-2xl overflow-hidden bg-white">
                <BannerPreview values={formValues} prominent />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t" style={{ borderColor: semanticRoles.border }}>
              <button
                type="button"
                onClick={openSaveAsTemplate}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                  backgroundColor: semanticRoles.surface,
                }}
              >
                <BookTemplate className="h-4 w-4" />
                {t('marketing.banners_save_as_template')}
              </button>
            </div>
          </section>

          {saveAsTemplateOpen && (
            <>
              <div
                className="fixed inset-0 z-[60] bg-black/50"
                aria-hidden
                onClick={handleSaveAsTemplateCancel}
              />
              <div
                className="fixed start-1/2 top-1/2 z-[70] w-[min(100%,320px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 p-4 shadow-xl"
                style={{
                  borderColor: semanticRoles.border,
                  backgroundColor: semanticRoles.surface,
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="save-as-template-title"
              >
                <h3 id="save-as-template-title" className="mb-3 text-sm font-semibold" style={{ color: semanticRoles.text }}>
                  {t('marketing.banners_save_as_template_title')}
                </h3>
                <input
                  type="text"
                  value={saveAsTemplateName}
                  onChange={(e) => setSaveAsTemplateName(e.target.value)}
                  placeholder={t('marketing.banners_save_as_template_placeholder')}
                  className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                  style={{
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                    backgroundColor: semanticRoles.surface,
                  }}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAsTemplateCancel}
                    className="rounded-lg border px-3 py-2 text-xs font-medium"
                    style={{
                      borderColor: semanticRoles.border,
                      color: semanticRoles.text,
                      backgroundColor: semanticRoles.surface,
                    }}
                  >
                    {t('marketing.banners_form_cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAsTemplateConfirm}
                    className="rounded-lg px-3 py-2 text-xs font-medium text-white"
                    style={{ backgroundColor: semanticRoles.accent }}
                  >
                    {t('marketing.banners_save_as_template_confirm')}
                  </button>
                </div>
              </div>
            </>
          )}

          <BannerForm
            initialValues={formValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={mode === 'edit'}
            nextPosition={nextPosition}
            saving={saving}
            onValuesChange={handleValuesChange}
            customTemplatesVersion={customTemplatesVersion}
          />
        </div>
      </aside>
    </>
  );
}
