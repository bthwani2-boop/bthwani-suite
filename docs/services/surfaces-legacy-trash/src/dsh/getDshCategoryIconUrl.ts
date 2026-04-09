/**
 * DSH category icons — مسار موحّد من خادم الوسائط (RULE_DEV_MEDIA_LOCAL_SERVER_EXPOGO_MCPW).
 * الأيقونات الفعلية في: C:\Users\b\Documents\bthwaniassets\mock\categories\dsh\
 * الأيقونات الآن بخلفيات شفافة (PNG with alpha) — بدون إطار زجاجي.
 */

import { resolveDevMediaUrl } from '../config';

/** المسار النسبي لأيقونات فئات DSH تحت base الوسائط */
export const DSH_CATEGORY_ICONS_PATH = 'categories/dsh';

/** إصدار للـ cache-bust بعد قص وتحجيم الأيقونات (512×512 موحد) */
const ICON_CACHE_VERSION = 6;

/**
 * يعيد URL صورة أيقونة الفئة من خادم الوسائط.
 * يُستخدم في: الهوم، قائمة الفئات، شاشة تفاصيل الفئة والفرعيات.
 */
export function getDshCategoryIconUrl(categoryId: string): string | null {
  if (!categoryId?.trim()) return null;
  const path = `${DSH_CATEGORY_ICONS_PATH}/${categoryId.trim()}.png`;
  const url = resolveDevMediaUrl(path);
  if (!url) return null;
  return `${url}?v=${ICON_CACHE_VERSION}`;
}
