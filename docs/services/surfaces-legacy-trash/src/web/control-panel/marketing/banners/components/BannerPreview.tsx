'use client';

import React from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import type { DshBannerAdmin, DshBannerAspectRatio } from '../types';
import { ImagePlus } from 'lucide-react';

const ASPECT_MAP: Record<DshBannerAspectRatio, string> = {
  rectangle: 'aspect-[2/1]',
  square: 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
};

interface BannerPreviewProps {
  /** القيم الحالية للنموذج لمعاينة فورية */
  values: Partial<DshBannerAdmin>;
  /** true = معاينة كبيرة بارزة (قبل النشر) */
  prominent?: boolean;
}

export function BannerPreview({ values, prominent }: BannerPreviewProps) {
  const { t } = useI18n();
  const aspect = values.aspect_ratio ?? 'rectangle';
  const aspectClass = ASPECT_MAP[aspect];
  const accent = values.accent_color?.trim() || undefined;
  const hasOverlay =
    values.partner_logo_url?.trim() ||
    values.offer_badge_text?.trim() ||
    values.offer_detail_text?.trim() ||
    values.partner_name?.trim();

  return (
    <div
      className={`rounded-xl border-2 overflow-hidden ${prominent ? 'ring-2 ring-offset-2' : ''}`}
      style={{
        borderColor: accent ?? semanticRoles.border,
        backgroundColor: semanticRoles.surfaceSubtle,
        ...(prominent ? { boxShadow: '0 4px 14px rgba(0,0,0,0.08)' } : {}),
      }}
    >
      {!prominent && (
        <p
          className="mb-2 text-xs font-medium"
          style={{ color: semanticRoles.textSecondary }}
        >
          {t('marketing.banners_preview_title')}
        </p>
      )}
      <div
        className={`relative w-full ${prominent ? 'max-w-[320px] mx-auto' : 'max-w-[280px]'} ${aspectClass} overflow-hidden rounded-lg bg-gray-100`}
        style={{ backgroundColor: semanticRoles.surfaceSubtle }}
      >
        {values.image_url?.trim() ? (
          <img
            src={values.image_url}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
            <ImagePlus className="h-10 w-10 opacity-40" style={{ color: semanticRoles.textMuted }} />
            <span className="text-center text-xs" style={{ color: semanticRoles.textMuted }}>
              {t('marketing.banners_form_image_url_placeholder')}
            </span>
          </div>
        )}

        {/* منطقة مظللة — جزء من الصورة مظلل بلون خفيف لظهور الشعار وتفاصيل العرض */}
        {values.overlay_enabled && (() => {
          const hex = (values.overlay_color || '#000000').trim().replace(/^#/, '');
          const op = Math.min(1, Math.max(0.1, values.overlay_opacity ?? 0.65));
          const r = hex.length >= 6 ? parseInt(hex.slice(0, 2), 16) : 0;
          const g = hex.length >= 6 ? parseInt(hex.slice(2, 4), 16) : 0;
          const b = hex.length >= 6 ? parseInt(hex.slice(4, 6), 16) : 0;
          const overlayBg = hex.length >= 6 ? `rgba(${r},${g},${b},${op})` : `rgba(0,0,0,${op})`;
          const side = values.overlay_side ?? 'end';
          const widthPct = Math.min(100, Math.max(25, values.overlay_width_percent ?? 40));
          return (
          <div
            className="absolute inset-y-0 flex flex-col justify-between p-2"
            style={{
              ...(side === 'end' ? { insetInlineEnd: 0 } : { insetInlineStart: 0 }),
              width: `${widthPct}%`,
              backgroundColor: overlayBg,
            }}
          >
            <div className="flex flex-1 flex-col justify-start gap-1">
              {values.partner_logo_url?.trim() ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={values.partner_logo_url}
                    alt=""
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {values.partner_name?.trim() ? (
                    <span className="text-xs font-semibold text-white">{values.partner_name}</span>
                  ) : null}
                </div>
              ) : values.partner_name?.trim() ? (
                <span className="text-xs font-semibold text-white">{values.partner_name}</span>
              ) : null}
              {(values.offer_badge_text?.trim() || values.offer_detail_text?.trim()) && (
                <div
                  className="inline-flex max-w-full flex-col self-end rounded-full px-2.5 py-1.5 text-center"
                  style={{
                    backgroundColor: accent || '#FF5A1F',
                    color: '#fff',
                  }}
                >
                  {values.offer_badge_text?.trim() ? (
                    <span className="text-xs font-bold leading-tight">{values.offer_badge_text}</span>
                  ) : null}
                  {values.offer_detail_text?.trim() ? (
                    <span className="mt-0.5 text-[10px] leading-tight opacity-95">
                      {values.offer_detail_text}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* عناصر داخل البنر (بدون منطقة مظللة) — شعار الشريك، شارة العرض، التفاصيل */}
        {hasOverlay && !values.overlay_enabled && (
          <>
            {values.partner_logo_url?.trim() ? (
              <div className="absolute start-2 top-2 flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 shadow">
                <img
                  src={values.partner_logo_url}
                  alt=""
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {values.partner_name?.trim() ? (
                  <span className="text-xs font-semibold text-gray-800">{values.partner_name}</span>
                ) : null}
              </div>
            ) : values.partner_name?.trim() ? (
              <div className="absolute start-2 top-2 rounded-lg bg-white/95 px-2 py-1.5 text-xs font-semibold text-gray-800 shadow">
                {values.partner_name}
              </div>
            ) : null}

            {(values.offer_badge_text?.trim() || values.offer_detail_text?.trim()) && (
              <div
                className="absolute end-2 top-2 flex max-w-[45%] flex-col items-end rounded-full px-2.5 py-1.5 text-center shadow"
                style={{
                  backgroundColor: accent || '#FF5A1F',
                  color: '#fff',
                }}
              >
                {values.offer_badge_text?.trim() ? (
                  <span className="text-xs font-bold leading-tight">{values.offer_badge_text}</span>
                ) : null}
                {values.offer_detail_text?.trim() ? (
                  <span className="mt-0.5 text-[10px] leading-tight opacity-95">
                    {values.offer_detail_text}
                  </span>
                ) : null}
              </div>
            )}
          </>
        )}

        {/* عنوان البنر — أسفل */}
        {values.title?.trim() ? (
          <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1.5 text-xs font-medium text-white">
            {values.title}
          </div>
        ) : null}
      </div>
    </div>
  );
}
