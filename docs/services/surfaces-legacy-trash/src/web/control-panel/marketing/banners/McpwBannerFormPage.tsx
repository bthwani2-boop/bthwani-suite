'use client';

/**
 * CONTROL PANEL — نموذج إنشاء/تعديل بنر واحد.
 * نقرتان: فتح النموذج + حفظ. Smart Defaults: action_type=offer، position=آخر.
 */
import { useCallback, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import { BannerForm } from './components/BannerForm';
import type { DshBannerAdmin } from './types';
import { getBannerById, getBanners, addBanner, updateBanner } from './mockBannersStore';
import { ImagePlus } from 'lucide-react';

export function McpwBannerFormPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : null;
  const isEdit = !!id;

  const banner = useMemo(() => (id ? getBannerById(id) : null), [id]);
  const nextPosition = useMemo(() => getBanners().length + 1, []);

  const [saving, setSaving] = useState(false);

  const initialValues: Partial<DshBannerAdmin> = useMemo(() => {
    if (banner) return banner;
    return {
      action_type: 'offer',
      position: nextPosition,
    };
  }, [banner, nextPosition]);

  const handleSubmit = useCallback(
    (values: DshBannerAdmin) => {
      setSaving(true);
      setTimeout(() => {
        if (isEdit && values.id) {
          updateBanner(values);
        } else {
          addBanner({ ...values, id: values.id || `b${Date.now()}` });
        }
        setSaving(false);
        router.push('/marketing/banners');
      }, 400);
    },
    [isEdit, router]
  );

  const handleCancel = useCallback(() => {
    router.push('/marketing/banners');
  }, [router]);

  if (isEdit && id && !banner) {
    return (
      <SectionScreenTemplate
        title={t('marketing.banners_form_edit_title')}
        subtitle={t('marketing.banners_page_subtitle')}
        icon={ImagePlus}
      >
        <p className="py-6 text-sm" style={{ color: semanticRoles.textSecondary } as React.CSSProperties}>
          {t('marketing.banners_not_found')}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium"
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.text,
            backgroundColor: semanticRoles.surface,
          }}
        >
          {t('marketing.banners_form_cancel')}
        </button>
      </SectionScreenTemplate>
    );
  }

  const pageTitle = isEdit ? t('marketing.banners_form_edit_title') : t('marketing.banners_form_title');

  return (
    <SectionScreenTemplate
      title={pageTitle}
      subtitle={t('marketing.banners_page_subtitle')}
      icon={ImagePlus}
    >
      <div className="max-w-2xl">
        <BannerForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={isEdit}
          nextPosition={nextPosition}
          saving={saving}
        />
      </div>
    </SectionScreenTemplate>
  );
}

