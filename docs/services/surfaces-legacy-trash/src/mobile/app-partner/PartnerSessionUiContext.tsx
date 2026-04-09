/**
 * Live partner UI state for Account hub + DSH store scope — supplied by PartnerMobileSurface.
 */

import React, { createContext, useContext } from 'react';
import {
  PARTNER_APP_HEADER_DISPLAY_NAME_FIXTURE,
  PARTNER_ALL_STORES_SCOPE,
} from '../../dsh/fixtures/partnerStaff';
import type { PartnerStoreSwitcherFixtureItem } from '../../dsh/partnerStoreSwitcherFixtures';
import type { GPSStatus, PartnerStatus } from './components/PartnerStateChip';

export { PARTNER_ALL_STORES_SCOPE };

export interface PartnerSessionUiValue {
  partnerDisplayName: string;
  partnerStatus: PartnerStatus;
  gpsStatus: GPSStatus;
  /** DSH multi-store (empty when not DSH) */
  partnerStores: PartnerStoreSwitcherFixtureItem[];
  /** Store id from `partnerStores` or PARTNER_ALL_STORES_SCOPE */
  activeStoreScope: string;
  setActiveStoreScope: (scope: string) => void;
  /** §UX-SUPREME-001: Opens wallet hub sheet — all financial items in one place */
  openWalletSheet?: () => void;
}

const defaultValue: PartnerSessionUiValue = {
  partnerDisplayName: PARTNER_APP_HEADER_DISPLAY_NAME_FIXTURE,
  partnerStatus: 'available',
  gpsStatus: 'on',
  partnerStores: [],
  activeStoreScope: PARTNER_ALL_STORES_SCOPE,
  setActiveStoreScope: () => {},
  openWalletSheet: undefined,
};

export const PartnerSessionUiContext =
  createContext<PartnerSessionUiValue>(defaultValue);

export function usePartnerSessionUi(): PartnerSessionUiValue {
  return useContext(PartnerSessionUiContext);
}

export interface PartnerSessionUiProviderProps {
  value: PartnerSessionUiValue;
  children: React.ReactNode;
}

export const PartnerSessionUiProvider: React.FC<
  PartnerSessionUiProviderProps
> = ({ value, children }) => (
  <PartnerSessionUiContext.Provider value={value}>
    {children}
  </PartnerSessionUiContext.Provider>
);
