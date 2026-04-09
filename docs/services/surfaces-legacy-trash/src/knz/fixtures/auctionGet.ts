/**
 * Fixture for KNZ auction get (auto_knz_auction_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface AuctionDetail {
  id: string;
  title: string;
  currentPrice: number;
  minIncrement: number;
  bidsCount: number;
  status: 'open' | 'closed';
  endsAt: string;
  sellerName: string;
  winnerName: string | null;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzAuctionGetMock(t: TFunction, auctionId: string): AuctionDetail {
  return {
    id: auctionId,
    title: t(`${NS_COMMON}.mockListingTitle`),
    currentPrice: 3200,
    minIncrement: 100,
    bidsCount: 12,
    status: auctionId === 'A3' ? 'closed' : 'open',
    endsAt: '2024-03-15 20:00',
    sellerName: 'Seller',
    winnerName: auctionId === 'A3' ? 'Winner' : null,
  };
}

