import { DshControlPanelSurfaceHost } from '@bthwani/surfaces/dsh/control-panel';

type DshOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshOrderDetailPage({ params }: DshOrderDetailPageProps) {
  const { id } = await params;

  return <DshControlPanelSurfaceHost workspace="order-detail" orderId={id} />;
}