/**
 * KWD shared categories — نفس الفئات في التقديم السريع، إنشاء إعلان "أبحث عن عمل"، وإنشاء إعلان فرص العمل.
 * Multi-select optional everywhere.
 * Labels come from i18n: kwd.app-client.mobile.categories.*
 */

export type KwdCategoryId =
  | 'construction'
  | 'maintenance'
  | 'cleaning'
  | 'office'
  | 'sales'
  | 'restaurants'
  | 'transport'
  | 'other';

export interface KwdCategoryItem {
  id: KwdCategoryId;
  label: string;
  icon: string;
}

const NS = 'kwd.app-client.mobile.categories';
const KWD_MAIN_CATEGORIES_IDS: { id: KwdCategoryId; icon: string }[] = [
  { id: 'construction', icon: '🏗️' },
  { id: 'maintenance', icon: '🔧' },
  { id: 'cleaning', icon: '🧹' },
  { id: 'office', icon: '💼' },
  { id: 'sales', icon: '🛒' },
  { id: 'restaurants', icon: '🍽️' },
  { id: 'transport', icon: '🚗' },
  { id: 'other', icon: '📋' },
];

/** Returns main categories with labels from i18n. Use in components with useMemo(() => getKwdMainCategories(t), [t]). */
export function getKwdMainCategories(t: (key: string) => string): KwdCategoryItem[] {
  return KWD_MAIN_CATEGORIES_IDS.map(({ id, icon }) => ({
    id,
    label: t(`${NS}.${id}`),
    icon,
  }));
}

