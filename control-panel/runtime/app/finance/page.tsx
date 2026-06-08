import ControlPanelSurfaceHost from '../../../shell/web-entry';

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: Promise<{ workspace?: string; panel?: string; subGroup?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <ControlPanelSurfaceHost
      section="finance"
      financeWorkspace={resolvedSearchParams?.workspace}
      financePanel={resolvedSearchParams?.panel}
      financeSubGroup={resolvedSearchParams?.subGroup}
    />
  );
}
