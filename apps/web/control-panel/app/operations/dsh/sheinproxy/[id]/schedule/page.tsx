import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/surfaces/dsh/control-panel/operations/dsh/sheinproxy';

type DshSheinProxySchedulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxySchedulePage({ params }: DshSheinProxySchedulePageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="schedule" />;
}
