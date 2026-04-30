/**
 * مخزن القوالب المخصصة (من بنرات المستخدم) — في الذاكرة حتى ربط API.
 * تحويل بنر جيد إلى قالب لاستخدامه في البنرات التالية.
 */
import type { DshBannerAdmin } from './types';

export interface CustomBannerTemplate {
  id: string;
  name: string;
  apply: Partial<Omit<DshBannerAdmin, 'id' | 'click_count'>>;
}

let store: CustomBannerTemplate[] = [];

export function getCustomTemplates(): CustomBannerTemplate[] {
  return [...store];
}

export function addCustomTemplate(
  name: string,
  apply: Partial<Omit<DshBannerAdmin, 'id' | 'click_count'>>
): CustomBannerTemplate {
  const id = `custom-${Date.now()}`;
  const template: CustomBannerTemplate = { id, name: name.trim() || id, apply };
  store = [...store, template];
  return template;
}
