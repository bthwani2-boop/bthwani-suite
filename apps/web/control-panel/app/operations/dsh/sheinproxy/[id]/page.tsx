import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/app-shells/web/control-panel';

type DshSheinProxyRequestPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyRequestPage({ params }: DshSheinProxyRequestPageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="detail" />;
}
