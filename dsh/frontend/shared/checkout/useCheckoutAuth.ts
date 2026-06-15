// Canonical location: dsh/frontend/shared/checkout/useCheckoutAuth.ts
// Authority: dsh/frontend/shared/checkout — derives checkout auth credentials from
// bearer-token-first → clientId-first precedence.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type DshCheckoutAuth =
  | { bearerToken: string; clientId?: never }
  | { clientId: string; bearerToken?: never }
  | Record<never, never>;

export type UseCheckoutAuthProps = {
  authToken?: string;
  dshAuthBearerToken?: string;
  devClientId?: string;
  dshClientId?: string;
};

export function useCheckoutAuth({
  authToken,
  dshAuthBearerToken,
  devClientId,
  dshClientId,
}: UseCheckoutAuthProps): DshCheckoutAuth {
  return React.useMemo<DshCheckoutAuth>(() => {
    const bearerToken = (authToken ?? dshAuthBearerToken ?? undefined)?.trim();
    if (bearerToken) return { bearerToken };
    const clientId = (devClientId ?? dshClientId ?? '').trim();
    return clientId ? { clientId } : {};
  }, [authToken, dshAuthBearerToken, devClientId, dshClientId]);
}
