import { DshControlPanelSurfaceHost } from '@bthwani/app-shells/web/control-panel';

type DshOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshOrderDetailPage({ params }: DshOrderDetailPageProps) {
  const { id } = await params;

  return <DshControlPanelSurfaceHost section="operations" workspace="order-detail" orderId={id} />;
}