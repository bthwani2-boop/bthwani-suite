/**
 * قوالب بنرات جاهزة — ضغطة واحدة تملأ جزءاً كبيراً من الحقول.
 * Smart Templates: خصم، مطعم، خدمة، عرض سريع.
 */
import type { DshBannerAdmin } from '../types';

export type BannerTemplateId = 'discount' | 'restaurant' | 'service' | 'quick';

export interface BannerTemplate {
  id: string;
  /** اسم القالب (للقوالب المخصصة فقط؛ المدمجة تستخدم i18n) */
  name?: string;
  /** قيم تُطبَّق على النموذج (بدون id) */
  apply: Partial<Omit<DshBannerAdmin, 'id'>>;
}

export const BANNER_TEMPLATES: BannerTemplate[] = [
  {
    id: 'discount',
    apply: {
      action_type: 'offer',
      offer_badge_text: 'خصم 50%',
      offer_detail_text: 'كود: SAVE50',
      accent_color: '#FF5A1F',
      aspect_ratio: 'rectangle',
      animation_type: 'slide',
    },
  },
  {
    id: 'restaurant',
    apply: {
      action_type: 'main_category',
      action_target: 'restaurants',
      title: 'عروض المطاعم',
      offer_badge_text: 'توصيل سريع',
      accent_color: '#E85D04',
      aspect_ratio: 'rectangle',
      animation_type: 'slide',
    },
  },
  {
    id: 'service',
    apply: {
      action_type: 'category',
      title: 'خدمات',
      offer_badge_text: 'احصل الآن',
      accent_color: '#0D9488',
      aspect_ratio: 'rectangle',
      animation_type: 'slide',
    },
  },
  {
    id: 'quick',
    apply: {
      action_type: 'offer',
      offer_badge_text: 'عرض محدود',
      accent_color: '#7C3AED',
      aspect_ratio: 'rectangle',
      animation_type: 'slide',
    },
  },
];
