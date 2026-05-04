import { redirect } from 'next/navigation';
import ControlPanelSurfaceHost from '../../../shell/web-entry';
import {
  normalizeOperationsLocation,
} from '../../../../dsh/frontend/control-panel/operations/operations.registry';
import type { CanonicalOperationsGroupId } from '../../../../dsh/frontend/control-panel/operations/operations.types';

type OperationsPageProps = {
  readonly searchParams?: Promise<{
    readonly workspace?: string;
    readonly orderId?: string;
    readonly panel?: string;
  }>;
};

export default async function OperationsPage({ searchParams }: OperationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const normalizedLocation = normalizeOperationsLocation(resolvedSearchParams?.workspace, resolvedSearchParams?.panel);

  if (normalizedLocation.kind === 'redirect') {
    redirect(normalizedLocation.href);
  }

  const operationsWorkspace: CanonicalOperationsGroupId = normalizedLocation.group;
  const operationsOrderId = typeof resolvedSearchParams?.orderId === 'string' ? resolvedSearchParams.orderId : undefined;
  const operationsOverlayMode = normalizedLocation.panel;

  return (
    <ControlPanelSurfaceHost
      section="operations"
      operationsWorkspace={operationsWorkspace}
      operationsOrderId={operationsOrderId}
      operationsOverlayMode={operationsOverlayMode}
    />
  );
}
