import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/app-shells/web/control-panel';

type DshSheinProxyOfferPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyOfferPage({ params }: DshSheinProxyOfferPageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="offer" />;
}
