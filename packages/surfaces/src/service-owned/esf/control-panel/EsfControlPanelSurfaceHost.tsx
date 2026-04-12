"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard } from '@bthwani/ui-kit/web';
import { sectionCatalog } from './catalogs';
import { sectionMeta } from './catalogs/section-meta';
import { flowMeta } from './catalogs/_flow-id_/flow-meta';

export type EsfControlPanelSurfaceHostProps = {
  hubHref?: string;
};

export function EsfControlPanelSurfaceHost({ hubHref = '/dashboard' }: EsfControlPanelSurfaceHostProps) {
  const router = useRouter();

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
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

      <BthWebSectionCard title="Catalog definition" description="The section stays anchored to the service-owned catalog structure that ships with ESF.">
        <BthBox gap={2}>
          <BthText role="bodySm" tone="muted">
            Active section: {sectionMeta.id}
          </BthText>
          <BthText role="bodySm" tone="muted">
            Flow owner: {flowMeta.owner}
          </BthText>
          <BthText role="bodySm" tone="muted">
            Catalog items: {sectionCatalog.join(', ')}
          </BthText>
          <BthBox layoutDirection="row" gap={2}>
            <BthButton label="Back to hub" onPress={() => router.push(hubHref)} />
            <BthButton label="Open catalogs" tone="secondary" onPress={() => router.push('/catalogs')} />
          </BthBox>
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default EsfControlPanelSurfaceHost;
