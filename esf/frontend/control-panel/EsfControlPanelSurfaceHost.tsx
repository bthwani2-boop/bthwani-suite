"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebMissionHeroCard, WebSectionCard } from '@bthwani/ui-kit/web';
import { sectionCatalog } from './community-services';
import { sectionMeta } from './community-services/section-meta';
import { flowMeta } from './community-services/esf-control-panel-community-services-flow/flow-meta';

export type EsfControlPanelSurfaceHostProps = {
  hubHref?: string;
};

export function EsfControlPanelSurfaceHost({ hubHref = '/dashboard' }: EsfControlPanelSurfaceHostProps) {
  const router = useRouter();

  return (
    <Box gap={4}>
      <WebMissionHeroCard
        badges={[sectionMeta.id.toUpperCase(), flowMeta.owner.toUpperCase(), flowMeta.placeholder ? 'Placeholder' : 'Live']}
        eyebrow="ESF / control-panel / community-services"
        title="Community services space"
        description="ESF community-services ownership is now the active route entry for the control-panel community-services surface."
        metaItems={[
          `Section: ${sectionMeta.id}`,
          `Surface: ${sectionMeta.surface}`,
          `Community entries: ${sectionCatalog.length}`,
        ]}
        primaryAction={{ label: 'Back to hub', href: hubHref }}
        secondaryAction={{ label: 'Refresh route', href: '/community-services' }}
      />

      <WebSectionCard title="Community services definition" description="The section stays anchored to the service-owned community-services structure that ships with ESF.">
        <Box gap={2}>
          <Text role="bodySm" tone="muted">
            Active section: {sectionMeta.id}
          </Text>
          <Text role="bodySm" tone="muted">
            Flow owner: {flowMeta.owner}
          </Text>
          <Text role="bodySm" tone="muted">
            Community items: {sectionCatalog.join(', ')}
          </Text>
          <Box layoutDirection="row" gap={2}>
            <Button label="Back to hub" onPress={() => router.push(hubHref)} />
            <Button label="Open community services" tone="secondary" onPress={() => router.push('/community-services')} />
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default EsfControlPanelSurfaceHost;
