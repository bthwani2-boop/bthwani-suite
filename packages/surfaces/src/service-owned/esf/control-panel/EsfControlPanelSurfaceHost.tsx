"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard } from '@bthwani/ui-kit/web';
import { sectionCatalog } from './catalogs';
import { sectionMeta } from './catalogs/section-meta';
import { flowMeta } from './catalogs/esf-control-panel-catalogs-flow/flow-meta';

export type EsfControlPanelSurfaceHostProps = {
  hubHref?: string;
};

export function EsfControlPanelSurfaceHost({ hubHref = '/dashboard' }: EsfControlPanelSurfaceHostProps) {
  const router = useRouter();

  return (
    <Box gap={4}>
      <WebMissionHeroCard
        badges={[sectionMeta.id.toUpperCase(), flowMeta.owner.toUpperCase(), flowMeta.placeholder ? 'Placeholder' : 'Live']}
        eyebrow="ESF / control-panel / catalogs"
        title="Community catalog space"
        description="ESF catalog ownership is now the active route entry for the control-panel catalogs surface."
        metaItems={[
          `Section: ${sectionMeta.id}`,
          `Surface: ${sectionMeta.surface}`,
          `Catalog entries: ${sectionCatalog.length}`,
        ]}
        primaryAction={{ label: 'Back to hub', href: hubHref }}
        secondaryAction={{ label: 'Refresh route', href: '/catalogs' }}
      />

      <WebSectionCard title="Catalog definition" description="The section stays anchored to the service-owned catalog structure that ships with ESF.">
        <Box gap={2}>
          <Text role="bodySm" tone="muted">
            Active section: {sectionMeta.id}
          </Text>
          <Text role="bodySm" tone="muted">
            Flow owner: {flowMeta.owner}
          </Text>
          <Text role="bodySm" tone="muted">
            Catalog items: {sectionCatalog.join(', ')}
          </Text>
          <Box layoutDirection="row" gap={2}>
            <Button label="Back to hub" onPress={() => router.push(hubHref)} />
            <Button label="Open catalogs" tone="secondary" onPress={() => router.push('/catalogs')} />
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default EsfControlPanelSurfaceHost;
