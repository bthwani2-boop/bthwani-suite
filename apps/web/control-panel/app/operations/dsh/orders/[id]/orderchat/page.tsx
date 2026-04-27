import { DshControlPanelSurfaceHost } from '@bthwani/app-shells/web/control-panel';

type DshRoutePageProps = {
  readonly params: Promise<{
    readonly id: string;
  }>;
};

export default async function DshOrderChatPage({ params }: DshRoutePageProps) {
  const { id } = await params;

  return <DshControlPanelSurfaceHost workspace="orderchat" orderId={id} />;
}
