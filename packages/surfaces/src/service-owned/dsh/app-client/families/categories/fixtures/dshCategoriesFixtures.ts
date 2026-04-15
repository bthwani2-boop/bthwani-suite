export type DshCategorySubcategoryFixture = {
  id: string;
  label: string;
  subtitle: string;
};

export type DshCategoryFixture = {
  id: string;
  label: string;
  subtitle: string;
  subcategories: DshCategorySubcategoryFixture[];
};

export const dshCategoryFixtures: DshCategoryFixture[] = [
  {
    id: 'restaurants',
    label: 'Restaurants',
    subtitle: 'Food, ready meals, and dining options',
    subcategories: [],
  },
  {
    id: 'grocery',
    label: 'Grocery',
    subtitle: 'Produce, meat, bakery, and daily bundles',
    subcategories: [
      { id: 'grocery_vegetables_fruits', label: 'Vegetables & Fruits', subtitle: 'Fresh produce and chilled items' },
      { id: 'grocery_meat_fish_chicken', label: 'Meat, Fish & Chicken', subtitle: 'Protein and chilled selection' },
      { id: 'grocery_roasted_spices', label: 'Roasted Spices', subtitle: 'Pantry spices and seasoning' },
      { id: 'grocery_bakeries', label: 'Bakeries', subtitle: 'Bread, pastries, and daily baking' },
      { id: 'grocery_deals_bundle', label: 'Deals & Bundles', subtitle: 'Curated grocery bundles and offers' },
    ],
  },
  {
    id: 'sweets_juices',
    label: 'Sweets & Juices',
    subtitle: 'Fresh juices, desserts, and ice cream',
    subcategories: [
      { id: 'sweets_juices_fresh', label: 'Fresh Juices', subtitle: 'Cold-pressed and blended drinks' },
      { id: 'sweets_juices_sweets', label: 'Sweets', subtitle: 'Desserts, cakes, and pastries' },
      { id: 'sweets_juices_icecream', label: 'Ice Cream', subtitle: 'Frozen desserts and tubs' },
    ],
  },
  {
    id: 'anaqati',
    label: 'Anaqati',
    subtitle: 'Perfumes, accessories, and clothing',
    subcategories: [
      { id: 'anaqati_perfumes', label: 'Perfumes', subtitle: 'Fragrance and scent selections' },
      { id: 'anaqati_accessories_beauty', label: 'Accessories & Beauty', subtitle: 'Personal care and beauty items' },
      { id: 'anaqati_clothing', label: 'Clothing', subtitle: 'Wearables and apparel' },
    ],
  },
  {
    id: 'bthwani_store',
    label: 'Bthwani Store',
    subtitle: 'Pharmacy and daily essentials',
    subcategories: [],
  },
  {
    id: 'home_projects',
    label: 'Home Projects',
    subtitle: 'Electronics and home projects',
    subcategories: [],
  },
  {
    id: 'awnak',
    label: 'Awnak',
    subtitle: 'Local services and errands',
    subcategories: [],
  },
  {
    id: 'gas_refill',
    label: 'Gas Refill',
    subtitle: 'Refill, repair, and purchase',
    subcategories: [
      { id: 'gas_refill_refill', label: 'Refill', subtitle: 'Cylinder refill and delivery' },
      { id: 'gas_refill_repair', label: 'Repair', subtitle: 'Service and safety checks' },
      { id: 'gas_refill_buy', label: 'Buy Refill', subtitle: 'New refill units and swap' },
    ],
  },
  {
    id: 'shein',
    label: 'Shein',
    subtitle: 'Home and fashion delivery',
    subcategories: [],
  },
  {
    id: 'spare_parts',
    label: 'Spare Parts',
    subtitle: 'Parts, repairs, and accessories',
    subcategories: [],
  },
  {
    id: 'honey_dates',
    label: 'Honey & Dates',
    subtitle: 'Specialty products and local gifts',
    subcategories: [],
  },
  {
    id: 'electronics',
    label: 'Electronics',
    subtitle: 'Books, devices, and media',
    subcategories: [],
  },
];

export const dshCategoryListFixtures = dshCategoryFixtures.map((category) => ({
  id: category.id,
  label: category.label,
  subtitle: category.subtitle,
  countLabel: category.subcategories.length > 0 ? `${category.subcategories.length} subcategories` : 'Main category',
}));

export function getDshCategoryFixture(categoryId: string) {
  return dshCategoryFixtures.find((category) => category.id === categoryId) ?? null;
}
export const DSH_CATEGORY_ICONS: Record<string, string> = {
  restaurants: '🍽️',
  grocery: '🛒',
  sweets_juices: '🧃',
  anaqati: '✨',
  bthwani_store: '🏥',
  home_projects: '🏠',
  awnak: '🧰',
  gas_refill: '🧯',
  shein: '🛍️',
  spare_parts: '🧩',
  honey_dates: '🍯',
  electronics: '💻',
};
