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
