import type {
  CatalogMainCategory,
  CatalogMainClassification,
  CatalogProductMaster,
  CatalogSubCategory,
  CatalogSubClassification,
} from './catalogs.data';
import type { CatalogPreviewProposal } from './catalog-workspace.types';

// Helper to recursively filter the Category & Classification Tree
export function filterCategoryTree(categories: CatalogMainCategory[], query: string): CatalogMainCategory[] {
  if (!query) return categories;
  const q = query.toLowerCase().trim();
  return categories.map(cat => {
    const catMatches = cat.label.toLowerCase().includes(q) || (cat.subtitle?.toLowerCase().includes(q) ?? false);
    const filteredSubs = cat.subcategories.map(sub => {
      const subMatches = sub.label.toLowerCase().includes(q) || (sub.subtitle?.toLowerCase().includes(q) ?? false);
      const filteredMainClassifs = (sub.mainClassifications || []).map(mc => {
        const mcMatches = mc.label.toLowerCase().includes(q);
        const filteredSubClassifs = (mc.subClassifications || []).filter(sc => {
          return sc.label.toLowerCase().includes(q);
        });
        if (mcMatches || filteredSubClassifs.length > 0) {
          return { ...mc, subClassifications: filteredSubClassifs };
        }
        return null;
      }).filter((x): x is NonNullable<typeof x> => Boolean(x));

      if (subMatches || filteredMainClassifs.length > 0) {
        return { ...sub, mainClassifications: filteredMainClassifs };
      }
      return null;
    }).filter((x): x is NonNullable<typeof x> => Boolean(x));

    if (catMatches || filteredSubs.length > 0) {
      return { ...cat, subcategories: filteredSubs };
    }
    return null;
  }).filter((x): x is CatalogMainCategory => Boolean(x));
}

export type CatalogProductPreviewPatch = Partial<
  Pick<
    CatalogProductMaster,
    | 'name'
    | 'sku'
    | 'gtin'
    | 'barcode'
    | 'price'
    | 'mediaPolicy'
    | 'approvalStage'
    | 'imageUri'
    | 'mediaKey'
    | 'conflictReason'
  >
> & {
  categoryPath?: CatalogProductMaster['categoryPath'];
};

export function cloneCatalogCategories(categories: readonly CatalogMainCategory[]): CatalogMainCategory[] {
  return categories.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      mainClassifications: subcategory.mainClassifications?.map((classification) => ({
        ...classification,
        subClassifications: classification.subClassifications ? [...classification.subClassifications] : [],
      })) ?? [],
    })),
  }));
}

export function applyCatalogProductPreviewPatches(
  products: readonly CatalogProductMaster[],
  patches: Readonly<Record<string, CatalogProductPreviewPatch>>,
): CatalogProductMaster[] {
  return products.map((product) => {
    const patch = patches[product.id];
    if (!patch) return product;

    return {
      ...product,
      ...patch,
      categoryPath: patch.categoryPath ? { ...product.categoryPath, ...patch.categoryPath } : product.categoryPath,
    };
  });
}

export function mergeCatalogProductPreviewPatch(
  patches: Readonly<Record<string, CatalogProductPreviewPatch>>,
  productId: string,
  patch: CatalogProductPreviewPatch,
): Record<string, CatalogProductPreviewPatch> {
  const previous = patches[productId];
  return {
    ...patches,
    [productId]: {
      ...previous,
      ...patch,
      categoryPath: patch.categoryPath
        ? { ...previous?.categoryPath, ...patch.categoryPath }
        : previous?.categoryPath,
    },
  };
}

export function appendCatalogPreviewProposal(
  proposals: readonly CatalogPreviewProposal[],
  proposal: CatalogPreviewProposal,
): CatalogPreviewProposal[] {
  return [proposal, ...proposals.slice(0, 9)];
}

export function toggleReadonlyStringSet(values: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(values);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function hasDuplicateCatalogLabel(label: string, list: readonly { label: string }[]): boolean {
  const normalized = label.trim().toLowerCase();
  return list.some((item) => item.label.trim().toLowerCase() === normalized);
}

export function createPreviewMainCategory(id: string, label: string, subtitle: string): CatalogMainCategory {
  return {
    id,
    label,
    subtitle,
    subcategories: [],
    emojiFallback: label[0] ?? '📦',
    defaultMediaPolicy: 'catalog-owned-media',
    categoryMode: 'catalog-based',
  };
}

export function createPreviewSubCategory(id: string, label: string, subtitle: string): CatalogSubCategory {
  return {
    id,
    label,
    subtitle,
    mainClassifications: [],
  };
}

export function createPreviewMainClassification(id: string, label: string): CatalogMainClassification {
  return {
    id,
    label,
    subClassifications: [],
  };
}

export function createPreviewSubClassification(id: string, label: string): CatalogSubClassification {
  return { id, label };
}
