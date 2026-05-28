import { CatalogMainCategory } from '../catalog';

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
