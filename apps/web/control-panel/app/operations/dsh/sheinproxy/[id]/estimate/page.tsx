import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/sheinproxy';

type DshSheinProxyEstimatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxyEstimatePage({ params }: DshSheinProxyEstimatePageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="estimate" />;
}
