import type { DshStoreFixtureItem } from '../fixtures';
import type { BthProductCardProps } from '@bthwani/ui-kit';

function extractPriceValue(label?: string): number | undefined {
  if (!label) return undefined;
  // Remove currency symbols and non-numeric chars, normalize comma to dot
  const cleaned = label.replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapMenuItemToProductCard(item: DshStoreFixtureItem): BthProductCardProps {
  return {
    id: item.id,
    title: item.name ?? '',
    subtitle: item.subtitle,
    imageUri: item.imageUri,
    price: item.priceLabel ? { label: item.priceLabel, value: item.priceValue ?? extractPriceValue(item.priceLabel) } : undefined,
    oldPrice: item.oldPriceLabel ? { label: item.oldPriceLabel, value: item.oldPriceValue ?? extractPriceValue(item.oldPriceLabel) } : undefined,
    discountLabel: item.discountLabel,
    badges: [item.categoryLabel, item.statusLabel].filter(Boolean) as string[],
    isFavorited: false,
  };
}
