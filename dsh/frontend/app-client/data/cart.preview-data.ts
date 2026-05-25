import type { DshClientState } from './client-state.preview-data';

export type RecommendationProduct = {
  id: string;
  title: string;
  priceLabel: string;
  priceValue: number;
  imageUri?: string;
  description?: string;
};

export type CartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  priceValue?: number;
  qty?: number;
  storeId?: string;
  storeName?: string;
};

export const dshCartRecommendedProductsFixture: RecommendationProduct[] = [
  { id: 'r1', title: 'تفاح طازج', priceLabel: '500', priceValue: 500, imageUri: 'dsh.product.apple.v1' },
  { id: 'r2', title: 'كيس خبز', priceLabel: '100', priceValue: 100, imageUri: 'dsh.product.bread.v1' },
  { id: 'r3', title: 'دجاج بروست', priceLabel: '1,500', priceValue: 1500, imageUri: 'dsh.product.chicken.v1' },
  { id: 'r4', title: 'شوكولاتة فاخرة', priceLabel: '400', priceValue: 400, imageUri: 'dsh.product.choco.v1' },
  { id: 'r5', title: 'كرواسون فرنسي', priceLabel: '300', priceValue: 300, imageUri: 'dsh.product.croissant.v1' },
  { id: 'r6', title: 'حليب طازج', priceLabel: '600', priceValue: 600, imageUri: 'dsh.product.milk.v1' },
  { id: 'r7', title: 'معكرونة إيطالية', priceLabel: '350', priceValue: 350, imageUri: 'dsh.product.pasta.v1' },
  { id: 'r8', title: 'بطاطس رول', priceLabel: '250', priceValue: 250, imageUri: 'dsh.product.roll.v1' },
  { id: 'r9', title: 'سلطة خضراء', priceLabel: '450', priceValue: 450, imageUri: 'dsh.product.salad.v1' },
  { id: 'r10', title: 'زبادي طازج', priceLabel: '150', priceValue: 150, imageUri: 'dsh.product.yogurt.v1' },
];

export const dshCartPreviewFallbackItemsFixture: CartItem[] = [
  { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
  { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
  { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
  { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
];
