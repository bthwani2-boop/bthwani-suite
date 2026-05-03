import ControlPanelSurfaceHost from '../../../shell/web-entry';

type OperationsWorkspaceId = 'overview' | 'dashboard' | 'captain-ops' | 'field-ops' | 'finance' | 'settlements' | 'cod' | 'refunds' | 'issues' | 'serviceability' | 'guard-status' | 'evidence' | 'orders' | 'partners' | 'catalogs' | 'marketing' | 'sheinproxy' | 'reassign' | 'peak-mode' | 'bell' | 'zone-set';

type OperationsPageProps = {
  readonly searchParams?: Promise<{
    readonly workspace?: string;
    readonly orderId?: string;
    readonly panel?: string;
  }>;
};

const operationsWorkspaceIds = new Set<OperationsWorkspaceId>([
  'overview',
  'dashboard',
  'captain-ops',
  'field-ops',
  'finance',
  'settlements',
  'cod',
  'refunds',
  'issues',
  'serviceability',
  'guard-status',
  'evidence',
  'orders',
  'partners',
  'catalogs',
  'marketing',
  'sheinproxy',
  'reassign',
  'peak-mode',
  'bell',
  'zone-set',
]);

export default async function OperationsPage({ searchParams }: OperationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const workspaceParam = resolvedSearchParams?.workspace;
  const operationsWorkspace = workspaceParam && operationsWorkspaceIds.has(workspaceParam as OperationsWorkspaceId)
    ? (workspaceParam as OperationsWorkspaceId)
    : 'overview';
  const operationsOrderId = typeof resolvedSearchParams?.orderId === 'string' ? resolvedSearchParams.orderId : undefined;
  const operationsOverlayMode = resolvedSearchParams?.panel === 'chat'
    ? 'chat'
    : resolvedSearchParams?.panel === 'detail'
      ? 'detail'
      : undefined;

  return (
    <ControlPanelSurfaceHost
      section="operations"
      operationsWorkspace={operationsWorkspace}
      operationsOrderId={operationsOrderId}
      operationsOverlayMode={operationsOverlayMode}
    />
  );
}
