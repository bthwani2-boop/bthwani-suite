type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzListingUpdateMock(t: TFunction) {
  return {
    id: 'LST-001',
    currentData: {
      title: t(`${NS_COMMON}.mockListingTitle`),
      price: 3800,
      description: t(`${NS_COMMON}.mockDescription1`),
      category: t(`${NS_COMMON}.categoryElectronics`),
      condition: 'used',
      location: t(`${NS_COMMON}.mockLocationRiyadh`),
    },
    stats: {
      views: 45,
      favorites: 12,
      inquiries: 8,
    },
  };
}


