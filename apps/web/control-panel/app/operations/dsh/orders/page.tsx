import { DshControlPanelSurfaceHost } from '@bthwani/app-shells/web/control-panel';

type DshOrdersPageProps = {
  readonly searchParams?: Promise<{
    readonly orderId?: string;
    readonly panel?: string;
  }>;
};

export default async function DshOrdersPage({ searchParams }: DshOrdersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const orderId = typeof resolvedSearchParams?.orderId === 'string' ? resolvedSearchParams.orderId : undefined;
  const orderOverlayMode = resolvedSearchParams?.panel === 'chat' ? 'chat' : resolvedSearchParams?.panel === 'detail' ? 'detail' : undefined;

  return <DshControlPanelSurfaceHost workspace="orders" orderId={orderId} orderOverlayMode={orderOverlayMode} />;
}
