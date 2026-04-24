import type { DshStoreFixtureItem } from '../fixtures';
import type { ProductCardProps } from '@bthwani/ui-kit';

function pickSampleBackgroundColor(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('تفاح') || n.includes('apple') || n.includes('gala')) return '#eaf9e6';
  if (n.includes('حليب') || n.includes('milk')) return '#eaf4ff';
  if (n.includes('خبز') || n.includes('bread')) return '#fff6e8';
  return '#f3f4f6';
}

function sampleProductDataUri(name: string) {
  const label = (name || 'منتج').replace(/&/g, '&amp;').slice(0, 18).toUpperCase();
  const bg = pickSampleBackgroundColor(name);
  const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>\n  <rect width='100%' height='100%' rx='36' fill='${bg}' />\n  <text x='50%' y='56%' font-family='Inter, Arial, Helvetica, sans-serif' font-size='88' font-weight='800' fill='#21313a' text-anchor='middle'>${label}</text>\n</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function extractPriceValue(label?: string): number | undefined {
  if (!label) return undefined;
  // Remove currency symbols and non-numeric chars, normalize comma to dot
  const cleaned = label.replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapMenuItemToProductCard(item: DshStoreFixtureItem): ProductCardProps {
  return {
    id: item.id,
    title: item.name ?? '',
    subtitle: item.subtitle,
    // Use a generated inline-SVG placeholder that matches the previous design
    // (colored rounded rect + large uppercase label). This guarantees 100%
    // visual parity with the earlier look while making it trivial to revert.
    imageUri: sampleProductDataUri(item.name),
    showImage: true,
    price: item.priceLabel ? { label: item.priceLabel, value: item.priceValue ?? extractPriceValue(item.priceLabel) } : undefined,
    oldPrice: item.oldPriceLabel ? { label: item.oldPriceLabel, value: item.oldPriceValue ?? extractPriceValue(item.oldPriceLabel) } : undefined,
    discountLabel: item.discountLabel,
    badges: [item.categoryLabel, item.statusLabel].filter(Boolean) as string[],
    isFavorited: false,
  };
}
