/**
 * Fixture for CONTROL PANEL partner products page.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number;
  allergens: string[];
}

export function buildPartnerProductsMock(t: TFunction): Product[] {
  return [
    {
      id: 'prod_1',
      name: 'برجر كلاسيكي',
      description: t('web.control panel.partner.products.page.mockItemBurger'),
      price: 25,
      category: 'أطباق رئيسية',
      imageUrl: undefined,
      isAvailable: true,
      isVegetarian: false,
      isSpicy: false,
      preparationTime: 15,
      allergens: [t('surfaces.لحم'), t('surfaces.جبن')],
    },
    {
      id: 'prod_2',
      name: 'بيتزا مارغريتا',
      description: t('web.control panel.partner.products.page.mockItemPizza'),
      price: 32,
      category: 'أطباق رئيسية',
      imageUrl: undefined,
      isAvailable: true,
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 20,
      allergens: ['جبن', t('surfaces.قمح')],
    },
    {
      id: 'prod_3',
      name: t('surfaces.سلطة_خضراء'),
      description: t('web.control panel.partner.products.page.mockItemSalad'),
      price: 15,
      category: 'سلطات',
      imageUrl: undefined,
      isAvailable: true,
      isVegetarian: true,
      isSpicy: false,
      preparationTime: 5,
      allergens: [],
    },
  ];
}

