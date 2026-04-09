/**
 * DSH partner store switcher demo data (mobile header).
 * Lives outside `fixtures` so Metro/Hermes always resolves the named export reliably.
 */

export interface PartnerStoreSwitcherFixtureItem {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
}

export function buildPartnerStoresFixture(): PartnerStoreSwitcherFixtureItem[] {
  return [
    {
      id: 'store-dsh-001',
      name: 'الفخامة 1',
      city: 'الرياض',
      isActive: true,
    },
    { id: 'store-dsh-002', name: 'الفخامة 2', city: 'جدة', isActive: false },
    {
      id: 'store-dsh-003',
      name: 'الفخامة 3',
      city: 'الدمام',
      isActive: false,
    },
  ];
}
