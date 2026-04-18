import { ControlPanelDshSheinProxyRequestScreen } from '@bthwani/app-shells/web/control-panel';

type DshSheinProxySchedulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DshSheinProxySchedulePage({ params }: DshSheinProxySchedulePageProps) {
  const { id } = await params;

  return <ControlPanelDshSheinProxyRequestScreen requestId={id} stage="schedule" />;
}
