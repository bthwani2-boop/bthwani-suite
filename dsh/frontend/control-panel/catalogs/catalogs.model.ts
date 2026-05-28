export type FilterType = 'all' | 'active' | 'review' | 'conflict' | 'master' | 'partner' | 'needs-link' | 'needs-image';

export const initialColumnFilters = {
  name: [],
  category: [],
  classification: [],
  sku: [],
  price: [],
  policy: [],
  status: [],
  source: [],
  categoryMode: [],
} satisfies Record<string, string[]>;

export type CatalogFilterColumnId = keyof typeof initialColumnFilters;
