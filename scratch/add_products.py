import os

path = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/catalog.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_products = """  {
    id: 'prd-grocery-water',
    name: 'مياه شرب معبأة 40 قارورة',
    sku: 'BTH-GRO-BV-004',
    measurementUnit: '1 كرتون',
    categoryPath: { main: 'grocery', sub: 'grocery_beverages' },
    price: 15.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner', 'marketing'],
    emojiFallback: '💧',
  },
  {
    id: 'prd-grocery-tomato',
    name: 'طماطم بلدي 1 كجم',
    sku: 'BTH-GRO-FR-005',
    measurementUnit: '1 كجم',
    categoryPath: { main: 'grocery', sub: 'grocery_vegetables_fruits' },
    price: 6.50,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🍅',
  },
  {
    id: 'prd-electronics-airpods',
    name: 'سماعات بلوتوث لاسلكية',
    sku: 'BTH-ELE-003',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'electronics', sub: 'accessories' },
    price: 450.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    sourceSurface: 'partner',
    surfaces: ['client', 'partner'],
    emojiFallback: '🎧',
  },
  {
    id: 'prd-spare-tires',
    name: 'كفر سيارة مقاس 17',
    sku: 'BTH-SPR-003',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'spare_parts', sub: 'tires' },
    price: 450.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🛞',
  },
  {
    id: 'prd-sweets-baklava',
    name: 'صحن بقلاوة مشكل 1 كجم',
    sku: 'BTH-SWT-003',
    measurementUnit: '1 صحن',
    categoryPath: { main: 'sweets_juices', sub: 'sweets' },
    price: 120.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    sourceSurface: 'partner',
    surfaces: ['client', 'partner'],
    emojiFallback: '🥞',
  },
  {
    id: 'prd-honey-gifts',
    name: 'صندوق هدايا عسل مشكل',
    sku: 'BTH-DAT-003',
    measurementUnit: '1 صندوق',
    categoryPath: { main: 'honey_dates', sub: 'gifts' },
    price: 350.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'marketing-review',
    sourceSurface: 'catalog',
    surfaces: ['partner', 'marketing'],
    emojiFallback: '🎁',
  }
];"""

content = content.replace('];\n\n// --- Metrics ---', ',\n' + new_products + '\n\n// --- Metrics ---')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added more products to catalog.ts successfully.")
