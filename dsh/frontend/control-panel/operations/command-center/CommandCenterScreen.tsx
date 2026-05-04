 'use client';

import React from 'react';
import { ControlPanelDshWorkspaceFrame, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { COMMAND_CENTER_PREVIEW } from '../operations.preview-data';

export type CommandCenterScreenProps = {
  hubHref: string;
};

export function CommandCenterScreen({ hubHref }: CommandCenterScreenProps) {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Operations"
      title="Command center"
      description="The single entry point for live orders, dispatch, capacity, exceptions, and audit support."
      badges={['DSH', 'Operations', 'Hub']}
      metaItems={['Canonical workspace', 'Eight screen folders', 'RTL ready']}
      primaryAction={{ label: 'Open live orders', href: '/operations?workspace=live-orders' }}
      secondaryAction={{ label: 'Open dispatch assignment', href: '/operations?workspace=dispatch-assignment' }}
      signals={COMMAND_CENTER_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
      actions={COMMAND_CENTER_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
      disclosures={COMMAND_CENTER_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
      decisionBoard={COMMAND_CENTER_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
      footerNote={`Hub route: ${hubHref}`}
    />
  );
}

export default CommandCenterScreen;