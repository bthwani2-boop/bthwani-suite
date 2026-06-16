// Canonical location: dsh/frontend/shared/partner/partner-profile.model.ts
// Authority: dsh/frontend/shared/partner — partner surface routes and sections.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshPartnerRoute, PartnerHubSection } from '../contracts/partner.types';

export type { PartnerRuntimeProfile } from '../contracts/partner.types';
export { buildPartnerProfileFromScope } from '../contracts/partner.adapters';

export function usePartnerProfileModel(initialRoute: DshPartnerRoute = 'inbox') {
  const [route, setRoute] = React.useState<DshPartnerRoute>(initialRoute);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');

  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);

  const openAccountHub = React.useCallback((section: PartnerHubSection) => {
    setAccountHubSection(section);
    setRoute('home');
  }, []);

  const openWalletHub = React.useCallback(() => openAccountHub('wallet'), [openAccountHub]);
  const openInventoryManagement = React.useCallback(() => setRoute('inventory-management'), []);
  const openStoreCourier = React.useCallback(() => setRoute('store-courier'), []);

  const goBackToHub = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry');
      return;
    }
    openAccountHub('hub');
  }, [openAccountHub]);

  React.useEffect(() => {
    const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route !== prev) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [route]);

  return {
    route,
    setRoute,
    accountHubSection,
    setAccountHubSection,
    openAccountHub,
    openWalletHub,
    openInventoryManagement,
    openStoreCourier,
    goBackToHub,
    routeHistoryRef,
    routeTransitionFromBackRef,
  };
}
