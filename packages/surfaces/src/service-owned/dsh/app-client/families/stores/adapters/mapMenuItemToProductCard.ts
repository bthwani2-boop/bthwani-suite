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
    // Keep the image URI available but explicitly opt-out of showing it here
    // so the product-card renders the original colored/text placeholder.
    // This makes it easy to re-enable the images later (either by changing
    // this flag or reverting the commit).
    imageUri: item.imageUri,
    showImage: false,
    price: item.priceLabel ? { label: item.priceLabel, value: item.priceValue ?? extractPriceValue(item.priceLabel) } : undefined,
    oldPrice: item.oldPriceLabel ? { label: item.oldPriceLabel, value: item.oldPriceValue ?? extractPriceValue(item.oldPriceLabel) } : undefined,
    discountLabel: item.discountLabel,
    badges: [item.categoryLabel, item.statusLabel].filter(Boolean) as string[],
    isFavorited: false,
  };
}
