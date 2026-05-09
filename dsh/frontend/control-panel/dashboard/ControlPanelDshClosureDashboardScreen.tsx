import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard, WebControlDisclosureItem } from '@bthwani/ui-kit/web';
import { ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus, getDshClosureItemsBySurface } from '../shared';

function countByStatus(status: 'closed' | 'needs-evidence' | 'needs-ui-flow' | 'blocked') {
  return getDshClosureItemsByStatus(status).length;
}

export function ControlPanelDshClosureDashboardScreen() {
  const surfaceCounts = {
    client: getDshClosureItemsBySurface('client').length,
    partner: getDshClosureItemsBySurface('partner').length,
    captain: getDshClosureItemsBySurface('captain').length,
    field: getDshClosureItemsBySurface('field').length,
    'control-panel': getDshClosureItemsBySurface('control-panel').length,
  } as const;

  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="لوحة الإغلاق"
      title="مصفوفة جاهزية DSH"
      description="لقطة واحدة توضح ما هو مغلق، وما يحتاج أدلة (Evidence)، وما يحتاج مسارات واجهة (UI flow) قبل الخروج النهائي."
      badges={['DSH', 'إغلاق', 'جاهزية']}
      primaryAction={{ label: 'فتح الأدلة', href: '/control?tab=governance' }}
      secondaryAction={{ label: 'حالة الحماية', href: '/operations?workspace=guard-status' }}
      signals={[
        { id: 'surface-client', title: 'العميل', value: String(surfaceCounts.client), description: 'عناصر إغلاق العميل', tone: 'brand' },
        { id: 'surface-partner', title: 'الشريك', value: String(surfaceCounts.partner), description: 'عناصر إغلاق الشريك', tone: 'brand' },
        { id: 'surface-captain', title: 'الكابتن', value: String(surfaceCounts.captain), description: 'عناصر إغلاق الكابتن', tone: 'warning' },
        { id: 'surface-field', title: 'الميدان', value: String(surfaceCounts.field), description: 'عناصر إغلاق الميدان', tone: 'warning' },
        { id: 'surface-control', title: 'لوحة التحكم', value: String(surfaceCounts['control-panel']), description: 'عناصر إغلاق اللوحة', tone: 'best' },
      ]}
    />
  );
}

export function ControlPanelDshClosureEvidenceStream() {
  return (
    <WebSectionCard title="تدفق أدلة الإغلاق" description="كل عنصر يمثل وحدة إغلاق يمكن توجيهها لمساحة العمل المناسبة.">
      <Box gap={2}>
        {DSH_CROSS_SURFACE_CLOSURE_MAP.map((item) => (
          <WebControlDisclosureItem
            key={`${item.surfaceId}-${item.area}`}
            id={`${item.surfaceId}-${item.area}`}
            label={`${item.surfaceId} / ${item.title}`}
            description={item.description}
            badge={item.status}
            href={item.routeHint}
          />
        ))}
      </Box>
      <Text role="bodySm" tone="muted">
        هذه اللوحة للعرض فقط ولا تقوم بتغيير حالة النظام الفعلية.
      </Text>
    </WebSectionCard>
  );
}

export default ControlPanelDshClosureDashboardScreen;
