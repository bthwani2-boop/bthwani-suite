import { ControlPanelDshOrderDetailScreen } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/orders';

type DshOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshOrderDetailPage({ params }: DshOrderDetailPageProps) {
  const { id } = await params;

  return <ControlPanelDshOrderDetailScreen orderId={id} />;
}