import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/sheinproxy';

type DshSheinProxyOfferPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyOfferPage({ params }: DshSheinProxyOfferPageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="offer" />;
}
