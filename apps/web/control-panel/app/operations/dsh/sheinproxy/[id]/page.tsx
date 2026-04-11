import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/sheinproxy';

type DshSheinProxyRequestPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyRequestPage({ params }: DshSheinProxyRequestPageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="detail" />;
}
