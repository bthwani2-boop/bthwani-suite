// Canonical location: dsh/frontend/shared/notifications/client-notifications.model.ts
// Authority: dsh/frontend/shared/notifications — client bell, signal events, operation screen.
// No JSX. No ui-kit. No Tamagui.

import { useDshClientBellState } from '../discovery/useDshClientBellState';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';

type CheckoutAuth = { bearerToken?: string; clientId?: string };

type UseDshClientNotificationsModelOptions = {
  route: DshRoute;
  dshApiBaseUrl: string | undefined;
  checkoutAuth: CheckoutAuth;
  setRoute: (route: DshRoute) => void;
};

export function useDshClientNotificationsModel(options: UseDshClientNotificationsModelOptions) {
  return useDshClientBellState(options);
}
