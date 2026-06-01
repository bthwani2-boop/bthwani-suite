import ControlPanelSurfaceHost from '../../../shell/web-entry';

export default function FinancePage({
  searchParams,
}: {
  searchParams?: { workspace?: string; panel?: string };
}) {
  return (
    <ControlPanelSurfaceHost
      section="finance"
      financeWorkspace={searchParams?.workspace}
      financePanel={searchParams?.panel}
    />
  );
}
