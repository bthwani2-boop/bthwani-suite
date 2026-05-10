'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelMapCanvas,
  WebControlPanelMapPin,
  WebControlPanelMiniMapZone,
  WebControlPanelRouteLine,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { GEO_HEATMAP_ZONES } from '../control-panel/operations/geo-heatmap.preview-data';

const ZONE_LAYOUT: Record<string, {
  zone: { top: string; right: string; width: string; height: string };
  order: { top: string; right: string };
  captain: { top: string; right: string };
  store: { top: string; right: string };
  routePoints: string;
}> = {
  'N-01': {
    zone: { top: '7%', right: '8%', width: '28%', height: '28%' },
    order: { top: '18%', right: '18%' },
    captain: { top: '31%', right: '33%' },
    store: { top: '42%', right: '11%' },
    routePoints: '82,22 68,33 86,46',
  },
  'E-02': {
    zone: { top: '24%', right: '42%', width: '24%', height: '24%' },
    order: { top: '34%', right: '49%' },
    captain: { top: '44%', right: '62%' },
    store: { top: '55%', right: '45%' },
    routePoints: '54,36 40,46 58,58',
  },
  'C-03': {
    zone: { top: '42%', right: '22%', width: '20%', height: '20%' },
    order: { top: '49%', right: '29%' },
    captain: { top: '58%', right: '38%' },
    store: { top: '67%', right: '24%' },
    routePoints: '73,52 61,59 75,68',
  },
  'S-04': {
    zone: { top: '60%', right: '56%', width: '22%', height: '22%' },
    order: { top: '68%', right: '62%' },
    captain: { top: '76%', right: '73%' },
    store: { top: '84%', right: '58%' },
    routePoints: '41,70 28,77 43,86',
  },
};

export function DshCaptainMapScreen() {
  const [selectedZoneId, setSelectedZoneId] = React.useState(GEO_HEATMAP_ZONES[0]?.id ?? '');
  const selectedZone = GEO_HEATMAP_ZONES.find((z) => z.id === selectedZoneId) ?? GEO_HEATMAP_ZONES[0];
  const selectedZoneLayout = selectedZone ? ZONE_LAYOUT[selectedZone.id] : undefined;

  return (
    <Box gap={3} padding={4} dir="rtl">
      <Box gap={1}>
        <Text role="titleLg">خريطة الكابتن</Text>
        <Text role="bodySm" tone="muted">عرض حي لمناطق الطلبات المرتفعة وتوافر الكباتن.</Text>
      </Box>

      <WebControlPanelMapCanvas
        legend={
          <Box gap={1} layoutDirection="row" wrap>
            <WebControlPanelStatusTag label="طلب مرتفع" tone="danger" />
            <WebControlPanelStatusTag label="مستقر" tone="success" />
          </Box>
        }
      >
        {selectedZoneLayout ? (
          <WebControlPanelRouteLine
            points={selectedZoneLayout.routePoints}
            tone={selectedZone?.severity === 'danger' ? 'danger' : selectedZone?.severity === 'warning' ? 'warning' : 'success'}
          />
        ) : null}
        {GEO_HEATMAP_ZONES.map((zone) => {
          const layout = ZONE_LAYOUT[zone.id];
          if (!layout) return null;

          return (
            <React.Fragment key={zone.id}>
              <WebControlPanelMiniMapZone
                label={zone.name}
                tone={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'success'}
                width={layout.zone.width}
                height={layout.zone.height}
                position={{ top: layout.zone.top, right: layout.zone.right }}
                onSelect={() => setSelectedZoneId(zone.id)}
              />
              <WebControlPanelMapPin
                label={`${zone.demandOrders} طلب`}
                tone={zone.severity === 'danger' ? 'danger' : zone.severity === 'warning' ? 'warning' : 'success'}
                position={layout.order}
                onSelect={() => setSelectedZoneId(zone.id)}
              />
            </React.Fragment>
          );
        })}
      </WebControlPanelMapCanvas>

      {selectedZone && (
        <Box padding={3} border radiusToken="lg" background="surfaceRaised" gap={2}>
          <Text role="bodyStrong">{selectedZone.name}</Text>
          <Text role="bodySm" tone="muted">{selectedZone.recommendedAction}</Text>
          <Box layoutDirection="row" gap={2}>
            <WebControlPanelStatusTag label={`الطلبات: ${selectedZone.demandOrders}`} tone="info" />
            <WebControlPanelStatusTag label={`الكباتن: ${selectedZone.activeCaptains}`} tone="brand" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DshCaptainMapScreen;
