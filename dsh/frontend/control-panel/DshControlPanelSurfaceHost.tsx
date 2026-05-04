"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ControlPanelDshOperationsScreen,
  normalizeOperationsLocation,
  type AnyOperationsWorkspaceId,
  type OperationsPanelId,
} from './operations';

export type DshControlPanelSurfaceHostProps = {
  workspace?: AnyOperationsWorkspaceId;
  orderId?: string;
  orderOverlayMode?: OperationsPanelId;
};

export function DshControlPanelSurfaceHost({
  workspace = 'overview',
  orderId,
  orderOverlayMode,
}: DshControlPanelSurfaceHostProps) {
  const router = useRouter();
  const normalizedLocation = normalizeOperationsLocation(workspace, orderOverlayMode);

  React.useEffect(() => {
    if (normalizedLocation.kind === 'redirect') {
      router.push(normalizedLocation.href);
    }
  }, [normalizedLocation, router]);

  if (normalizedLocation.kind === 'redirect') {
    return null;
  }

  return (
    <ControlPanelDshOperationsScreen
      group={normalizedLocation.group}
      orderId={orderId}
      panel={normalizedLocation.panel}
      fallbackHref="/operations"
    />
  );
}

export default DshControlPanelSurfaceHost;
