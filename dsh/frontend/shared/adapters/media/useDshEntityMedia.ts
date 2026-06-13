import React from 'react';
import type { DshMediaAsset } from '../../api/dsh-media-api.client';
import { getDshMediaRuntimeClient } from '../../runtime/ui-only-runtime-clients';

export type DshEntityMediaState = 'loading' | 'idle' | 'offline' | 'disabled' | 'error';

export type DshEntityMediaResult = {
  assets: DshMediaAsset[];
  state: DshEntityMediaState;
  reload: () => void;
};

export function useDshEntityMedia(ownerType: string, ownerId: string | undefined): DshEntityMediaResult {
  const client = React.useMemo(() => getDshMediaRuntimeClient(), []);
  const [assets, setAssets] = React.useState<DshMediaAsset[]>([]);
  const [state, setState] = React.useState<DshEntityMediaState>('loading');
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    if (!ownerId) return;
    if (!client) { setState('disabled'); return; }
    setState('loading');
    client
      .listMedia({ owner_type: ownerType, owner_id: ownerId })
      .then((resp) => { setAssets(resp.items ?? []); setState('idle'); })
      .catch((err: unknown) => {
        const kind = (err as { kind?: string })?.kind;
        setState(kind === 'offline' ? 'offline' : 'error');
      });
  }, [client, ownerType, ownerId, reloadToken]);

  const reload = React.useCallback(() => setReloadToken((t) => t + 1), []);

  return { assets, state, reload };
}
