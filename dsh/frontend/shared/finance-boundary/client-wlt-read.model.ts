import { useWltDshWalletSession } from '../../../../wlt/frontend/dsh/shared';

export function useDshClientWltReadModel(clientId: string | undefined, bearerToken?: string) {
  return useWltDshWalletSession(clientId, bearerToken);
}
