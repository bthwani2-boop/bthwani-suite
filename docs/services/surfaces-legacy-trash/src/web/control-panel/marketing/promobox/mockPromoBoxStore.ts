/**
 * Mock in-memory store for PromoBox management.
 * In production, this will be replaced by API calls to the backend.
 */
import type { DshPromoBoxAdmin } from './types';

let promoBoxes: DshPromoBoxAdmin[] = [
  {
    id: 'promo_pro_delivery',
    icon: '👑',
    badge: 'برو',
    badge_color: '#FF500D',
    title: 'توصيل شبه مجاني',
    subtitle: 'اشترك الآن!',
    action_type: 'subscription',
    action_target: 'DshSubscriptionGet',
    bg_color: '#0A2F5C',
    text_color: '#FFFFFF',
    is_active: true,
    priority: 1,
    status: 'published',
    click_count: 1247,
    view_count: 8934,
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-15T14:30:00Z',
  },
  {
    id: 'promo_discounts',
    icon: '🔥',
    badge: 'تخفيضات',
    badge_color: '#EF4444',
    title: 'خصم 30%',
    subtitle: 'على أول طلب',
    action_type: 'screen',
    action_target: 'DshOffersGet',
    bg_color: '#EF4444',
    text_color: '#FFFFFF',
    is_active: true,
    priority: 2,
    status: 'published',
    click_count: 892,
    view_count: 6721,
    created_at: '2026-03-05T09:00:00Z',
    updated_at: '2026-03-14T11:15:00Z',
  },
  {
    id: 'promo_new_stores',
    icon: '🎉',
    badge: 'جديد',
    badge_color: '#10B981',
    title: 'متاجر جديدة',
    subtitle: 'اكتشف الآن',
    action_type: 'screen',
    action_target: 'DshStoresList',
    bg_color: '#10B981',
    text_color: '#FFFFFF',
    is_active: false,
    priority: 3,
    status: 'draft',
    click_count: 0,
    view_count: 0,
    created_at: '2026-03-10T15:00:00Z',
    updated_at: '2026-03-10T15:00:00Z',
  },
  {
    id: 'promo_ramadan',
    icon: '🌙',
    badge: 'رمضان',
    badge_color: '#8B5CF6',
    title: 'عروض رمضان',
    subtitle: 'خصومات حصرية',
    action_type: 'screen',
    action_target: 'DshOffersGet',
    bg_color: '#8B5CF6',
    text_color: '#FFFFFF',
    is_active: false,
    priority: 4,
    status: 'draft',
    starts_at: '2026-03-10T00:00:00Z',
    ends_at: '2026-04-10T23:59:59Z',
    click_count: 0,
    view_count: 0,
    created_at: '2026-03-08T12:00:00Z',
    updated_at: '2026-03-08T12:00:00Z',
  },
];

export function getPromoBoxes(): DshPromoBoxAdmin[] {
  return [...promoBoxes];
}

export function getPromoBoxById(id: string): DshPromoBoxAdmin | undefined {
  return promoBoxes.find((p) => p.id === id);
}

export function addPromoBox(promo: Omit<DshPromoBoxAdmin, 'id' | 'created_at' | 'updated_at'>): DshPromoBoxAdmin {
  const now = new Date().toISOString();
  const newPromo: DshPromoBoxAdmin = {
    ...promo,
    id: `promo_${Date.now()}`,
    created_at: now,
    updated_at: now,
    click_count: 0,
    view_count: 0,
  };
  promoBoxes.push(newPromo);
  return newPromo;
}

export function updatePromoBox(promo: DshPromoBoxAdmin): DshPromoBoxAdmin {
  const index = promoBoxes.findIndex((p) => p.id === promo.id);
  if (index === -1) throw new Error(`PromoBox not found: ${promo.id}`);
  const updated = {
    ...promo,
    updated_at: new Date().toISOString(),
  };
  promoBoxes[index] = updated;
  return updated;
}

export function removePromoBox(id: string): void {
  promoBoxes = promoBoxes.filter((p) => p.id !== id);
}

export function getActivePromoBoxCount(): number {
  return promoBoxes.filter((p) => p.is_active && p.status === 'published').length;
}

export function reorderPromoBoxes(orderedIds: string[]): void {
  orderedIds.forEach((id, index) => {
    const promo = promoBoxes.find((p) => p.id === id);
    if (promo) {
      promo.priority = index + 1;
      promo.updated_at = new Date().toISOString();
    }
  });
}
