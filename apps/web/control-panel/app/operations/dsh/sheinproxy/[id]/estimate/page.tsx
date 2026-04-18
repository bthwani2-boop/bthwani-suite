import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/app-shells/web/control-panel';

type DshSheinProxyEstimatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyEstimatePage({ params }: DshSheinProxyEstimatePageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="estimate" />;
}
