export type DshStoreMenuItem = {
  id: string;
  name: string;
  subtitle?: string;
  priceLabel?: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  priceValue?: number;
  oldPriceValue?: number;
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  measurementOptionObjects?: Array<{
    id: string;
    label: string;
    multiplier?: number;
    unit?: string;
  }>;
  imageUri?: string;
  isOffer?: boolean;
  publishStage?: string;
};
