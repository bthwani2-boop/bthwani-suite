/**
 * تقييم جودة البنر قبل النشر (0–100) — قواعد ثابتة بدون ML.
 * يُعرض في قسم المعاينة لمساعدة المستخدم على اتخاذ القرار.
 */
import type { DshBannerAdmin } from '../types';

const WEIGHTS = {
  image_url: 25,
  title: 15,
  partner_or_logo: 15,
  offer_badge: 15,
  accent_color: 10,
  action_type: 10,
  action_target_when_required: 10,
} as const;

export function computeBannerQualityScore(values: Partial<DshBannerAdmin>): number {
  let score = 0;
  if (values.image_url?.trim()) score += WEIGHTS.image_url;
  if (values.title?.trim()) score += WEIGHTS.title;
  if (values.partner_name?.trim() || values.partner_logo_url?.trim()) score += WEIGHTS.partner_or_logo;
  if (values.offer_badge_text?.trim()) score += WEIGHTS.offer_badge;
  if (values.accent_color?.trim()) score += WEIGHTS.accent_color;
  if (values.action_type) score += WEIGHTS.action_type;
  const needsTarget = [
    'main_category',
    'category',
    'sub_category',
    'store',
    'external',
    'store_category',
    'product',
  ].includes(values.action_type ?? '');
  if (!needsTarget || values.action_target?.trim()) score += WEIGHTS.action_target_when_required;
  return Math.min(100, score);
}
