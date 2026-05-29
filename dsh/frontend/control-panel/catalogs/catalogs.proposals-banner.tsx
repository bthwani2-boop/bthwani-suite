'use client';

import React from 'react';
import { Box, Button, Surface, Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogPreviewProposal } from './catalogs.model';

type CatalogProposalsBannerProps = {
  pendingProposals: CatalogPreviewProposal[];
  dismissPreviewProposal: () => void;
};

export function CatalogProposalsBanner({ pendingProposals, dismissPreviewProposal }: CatalogProposalsBannerProps) {
  const { theme } = useTheme();

  if (pendingProposals.length === 0 || !pendingProposals[0]) return null;

  const proposal = pendingProposals[0];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        maxWidth: 560,
        width: '90%',
      }}
    >
      <Surface
        tone="raised"
        padding={3}
        gap={2}
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          borderWidth: 2,
          borderColor: proposal.status === 'ready-for-api' ? theme.success : theme.warning,
          borderStyle: 'solid',
        }}
      >
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="caption" style={{ fontWeight: '800', fontSize: 13 }}>
            📋 {proposal.label}
          </Text>
          <Button
            label="✕"
            tone="secondary"
            size="sm"
            onPress={() => dismissPreviewProposal()}
            style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }}
          />
        </Box>
        <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
          {proposal.note}
        </Text>
        <Text role="caption" style={{ fontSize: 10, fontWeight: '600', direction: 'ltr' }}>
          status: {proposal.status} | owner: {proposal.owner}
          {proposal.apiBoundary ? ` | API: ${proposal.apiBoundary}` : ''}
        </Text>
      </Surface>
    </div>
  );
}
