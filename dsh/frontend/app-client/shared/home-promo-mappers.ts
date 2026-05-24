import type { HomePromoRecord } from '../../shared/promo.preview-store';

import type {
  DshHomeBannerActionType,
  DshHomeCategory,
} from '../contracts/dsh-home-types';

export type DshHomeCategoryContext = {
  categoryId: string;
  subcategoryId: string | null;
};

export function normalizeHomePromoActionType(targetType: string): DshHomeBannerActionType | undefined {
  if (targetType === 'category') {
    return 'main_category';
  }

  switch (targetType) {
    case 'main_category':
    case 'sub_category':
    case 'store':
    case 'external':
    case 'store_category':
    case 'product':
    case 'subscription':
      return targetType;
    default:
      return undefined;
  }
}

export function resolveHomePromoPublishStage(status: HomePromoRecord['status']) {
  return status === 'published' ? 'published-preview' : 'draft';
}

export function resolveHomeCategoryContext(
  categories: DshHomeCategory[],
  targetId?: string,
): DshHomeCategoryContext | null {
  if (!targetId) {
    return null;
  }

  const matchedCategory = categories.find((category) => category.id === targetId);
  if (matchedCategory) {
    return { categoryId: matchedCategory.id, subcategoryId: null };
  }

  const parentCategory = categories.find((category) =>
    category.subcategories?.some((subcategory) => subcategory.id === targetId),
  );

  if (parentCategory) {
    return { categoryId: parentCategory.id, subcategoryId: targetId };
  }

  return null;
}
