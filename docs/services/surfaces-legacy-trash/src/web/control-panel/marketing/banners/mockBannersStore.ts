/**
 * In-memory store for DSH banners until API is connected.
 * Both list and form pages use this so edit loads correct data.
 * لا يحتوي على بيانات تجريبية — يُهيَّأ من fixtures/banners فقط.
 */
import type { DshBannerAdmin } from './types';
import { getDshBannersAdminSeed } from './fixtures/banners';

let store: DshBannerAdmin[] = [...getDshBannersAdminSeed()];

export function getBanners(): DshBannerAdmin[] {
  return [...store];
}

export function getBannerById(id: string): DshBannerAdmin | null {
  return store.find((b) => b.id === id) ?? null;
}

export function addBanner(banner: DshBannerAdmin): void {
  const id = banner.id || `b${Date.now()}`;
  store = [...store, {
    ...banner,
    id,
    click_count: banner.click_count ?? 0,
    cap_used: banner.cap_used ?? 0,
    view_count: banner.view_count ?? 0,
  }];
}

/** تسجيل نقرة على بنر (للتحديث عند ربط تحليلات حقيقية). إن وُجد cap_quantity يزيد cap_used. */
export function recordBannerClick(id: string): void {
  const idx = store.findIndex((b) => b.id === id);
  if (idx >= 0) {
    const b = store[idx];
    const newClickCount = (b.click_count ?? 0) + 1;
    const capQuantity = b.cap_quantity;
    const newCapUsed = capQuantity != null ? (b.cap_used ?? 0) + 1 : b.cap_used;
    store = store.slice(0, idx).concat([{
      ...b,
      click_count: newClickCount,
      cap_used: newCapUsed,
    }], store.slice(idx + 1));
  }
}

export function updateBanner(banner: DshBannerAdmin): void {
  const idx = store.findIndex((b) => b.id === banner.id);
  if (idx >= 0) {
    const existing = store[idx];
    const merged = {
      ...existing,
      ...banner,
      click_count: banner.click_count ?? existing.click_count ?? 0,
      cap_used: banner.cap_used ?? existing.cap_used,
      view_count: banner.view_count ?? existing.view_count ?? 0,
    };
    store = store.slice(0, idx).concat([merged], store.slice(idx + 1));
  }
}

export function removeBanner(id: string): void {
  store = store.filter((b) => b.id !== id);
}
