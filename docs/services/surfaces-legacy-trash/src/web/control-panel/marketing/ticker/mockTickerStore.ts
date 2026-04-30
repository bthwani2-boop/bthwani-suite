import type { DshTickerAdmin } from './types';

let store: DshTickerAdmin[] = [
  {
    id: 't1',
    message: 'المنصة تعمل الآن من ٩ صباحًا حتى ١٢ ليلًا.',
    kind: 'platform',
    severity: 'info',
    status: 'published',
  },
  {
    id: 't2',
    message: 'خصم 20% لمدة 3 ساعات على جميع المطاعم المشاركة.',
    kind: 'promo',
    severity: 'success',
    status: 'published',
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    message: 'قد تكون هناك انقطاعات متقطعة مساء اليوم بسبب صيانة مجدولة.',
    kind: 'platform',
    severity: 'warning',
    status: 'draft',
  },
];

export function getTickers(): DshTickerAdmin[] {
  return [...store];
}

export function addTicker(ticker: DshTickerAdmin): void {
  store = [...store, ticker];
}

export function updateTicker(ticker: DshTickerAdmin): void {
  store = store.map(t => (t.id === ticker.id ? { ...t, ...ticker } : t));
}

export function removeTicker(id: string): void {
  store = store.filter(t => t.id !== id);
}

