import { DshControlPanelSurfaceHost } from '@bthwani/app-shells/web/control-panel';

type DshOrderChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshOrderChatPage({ params }: DshOrderChatPageProps) {
  const { id } = await params;

  return <DshControlPanelSurfaceHost workspace="orderchat" orderId={id} />;
}
