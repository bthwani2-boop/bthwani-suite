import { DshControlPanelSurfaceHost } from '@bthwani/app-shells/web/control-panel';

type DshRoutePageProps = {
  readonly params: Promise<{
    readonly id: string;
  }>;
};

export default async function DshOrderDetailPage({ params }: DshRoutePageProps) {
  await params;

  return <DshControlPanelSurfaceHost workspace="orders" />;
}
