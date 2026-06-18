import type { DshHomeBannerActionType } from './dsh-home-types';
import type { DshHomeCategory } from './dsh-home-types';

export function resolveHomeCategoryContext(
  categoryItems: DshHomeCategory[],
  targetId?: string,
): { categoryId: string; subcategoryId: string | null } | null {
  if (!targetId) return null;

  for (const item of categoryItems) {
    if (item.id === targetId) {
      return { categoryId: item.id, subcategoryId: null };
    }
    if (item.subcategories) {
      for (const sub of item.subcategories) {
        if (sub.id === targetId) {
          return { categoryId: item.id, subcategoryId: sub.id };
        }
      }
    }
  }

  return null;
}

export function resolveHomePromoPublishStage(status: string) {
  return status === 'published' ? 'published-preview' : 'draft';
}

export function normalizeHomePromoActionType(actionType?: string | null): DshHomeBannerActionType | undefined {
  const normalized = (actionType ?? '').trim();

  if (
    normalized === 'main_category' ||
    normalized === 'sub_category' ||
    normalized === 'store' ||
    normalized === 'external' ||
    normalized === 'store_category' ||
    normalized === 'product' ||
    normalized === 'subscription'
  ) {
    return normalized;
  }

  if (normalized === 'open_store') return 'store';
  if (normalized === 'open_category') return 'main_category';
  if (normalized === 'open_product') return 'product';
  if (normalized === 'open_search') return 'external';
  if (normalized === 'open_benefits') return 'subscription';
  if (normalized === 'open_service') return 'external';

  return undefined;
}