import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import {
  WebControlDisclosureItem,
  WebControlPanelKpiStrip,
  WebControlPanelActionCluster,
  WebCompactSurfaceHeader,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import { ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, DSH_CROSS_SURFACE_JOURNEYS, getDshClosureItemsByStatus, getDshClosureItemsBySurface } from '../shared';

import styles from '../shared/control-panel-surface.module.css';

export function ControlPanelDshClosureHubScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<string>('readiness');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('all');

  const PRIMARY_TABS = [
    { id: 'readiness', label: 'حالة الجاهزية' },
    { id: 'evidence', label: 'تدفق الأدلة' },
    { id: 'ui-flows', label: 'مسارات الواجهة' },
    { id: 'protection', label: 'الحماية والامتثال' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    readiness: [
      { id: 'all', label: 'الكل' },
      { id: 'client', label: 'العميل' },
      { id: 'partner', label: 'الشريك' },
      { id: 'captain', label: 'الكابتن' },
      { id: 'field', label: 'الميدان' },
    ],
    evidence: [
      { id: 'recent', label: 'الأحدث' },
      { id: 'pending', label: 'بانتظار المراجعة' },
    ],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === 'readiness') {
      return <ControlPanelDshClosureDashboardScreen />;
    }
    if (activeTab === 'evidence') {
      return <ControlPanelDshClosureEvidenceStream />;
    }
    return (
      <Box gap={2}>
        <WebControlPanelRecommendation
          title="لوحة الجاهزية"
          reason={`التبويب الحالي: ${activeTab} · التصفية: ${activeSubTab} · افتح الأدلة أو الحماية لإكمال الإغلاق.`}
          confidence="medium"
          auditTag="إغلاق DSH"
          primaryAction={{ id: 'open-evidence', label: 'فتح الأدلة', onAction: () => setActiveTab('evidence') }}
          secondaryAction={{ id: 'open-protection', label: 'حالة الحماية', onAction: () => setActiveTab('protection') }}
        />
        <Text role="bodySm" tone="muted">يعرض هذا التبويب حالة الإغلاق الحالية بدون أي لوحة قراءة فقط.</Text>
      </Box>
    );
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Closure Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <span className={styles.surfaceHeaderGlyphLabel}>إ</span>
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>إغلاق DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <Text role="caption" className={styles.surfaceHeaderBadgeText}>مرحلة الجاهزية</Text>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>حوكمة الإغلاق النهائي ومصفوفة الجاهزية العابرة للأسطح</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'مكتمل', value: '١٠٠٪', tone: 'success' },
              { label: 'بانتظار دليل', value: '٠', tone: 'success' },
              { label: 'معطّل', value: '٠', tone: 'success' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs */}
      <nav className={styles.navigationDock}>
        {PRIMARY_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.surfaceTab} ${tab.id === activeTab ? styles.surfaceTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. Secondary Tabs */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
          {SECONDARY_TABS[activeTab].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={styles.surfaceTab}
              style={{
                backgroundColor: sub.id === activeSubTab ? theme.brandSurface : 'transparent',
                color: sub.id === activeSubTab ? theme.brand : theme.textMuted,
                borderColor: sub.id === activeSubTab ? theme.lineStrong : 'transparent',
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 4. Main Panel */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4}>
            {renderContent()}
          </Box>
        </div>
      </main>
    </div>
  );
}

function getSurfaceLabel(id: string) {
  switch (id) {
    case 'app-client': return 'تطبيق العميل';
    case 'app-partner': return 'تطبيق الشريك';
    case 'app-captain': return 'تطبيق الكابتن';
    case 'app-field': return 'تطبيق الميدان';
    case 'control-panel': return 'لوحة التحكم';
    default: return id;
  }
}

export function ControlPanelDshClosureDashboardScreen() {
  const surfaceCounts = {
    client: getDshClosureItemsBySurface('app-client').length,
    partner: getDshClosureItemsBySurface('app-partner').length,
    captain: getDshClosureItemsBySurface('app-captain').length,
    field: getDshClosureItemsBySurface('app-field').length,
    'control-panel': getDshClosureItemsBySurface('control-panel').length,
  } as const;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <WebControlPanelKpiStrip items={[
        { id: 'surface-client', label: 'العميل', value: String(surfaceCounts.client), tone: 'success' },
        { id: 'surface-partner', label: 'الشريك', value: String(surfaceCounts.partner), tone: 'success' },
        { id: 'surface-captain', label: 'الكابتن', value: String(surfaceCounts.captain), tone: 'success' },
        { id: 'surface-field', label: 'الميدان', value: String(surfaceCounts.field), tone: 'success' },
        { id: 'surface-control', label: 'لوحة التحكم', value: String(surfaceCounts['control-panel']), tone: 'success' },
      ]} />
      <div style={{ padding: '0 14px 8px' }}>
        <div className={styles.surfaceInfoCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
            <span className={styles.surfaceInfoCardTitle}>مصفوفة جاهزية DSH</span>
            <span className={styles.surfaceInfoCardDescription}>لقطة واحدة توضح ما هو مغلق، وما يحتاج أدلة، وما يحتاج مسارات واجهة قبل الخروج النهائي.</span>
          </div>
          <WebControlPanelActionCluster
            primary={{ id: 'evidence', label: 'فتح الأدلة' }}
            secondary={{ id: 'protection', label: 'حالة الحماية' }}
          />
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <Text role="titleSm" style={{ marginBottom: 8 }}>إشارات عابرة للأسطح</Text>
        <div style={{  gap: '8px' }}>
          {DSH_CROSS_SURFACE_JOURNEYS.map((journey) => (
            <WebControlPanelRecommendation
              key={journey.id}
              title={journey.entityLabel ?? journey.id}
              reason={journey.reason}
              confidence={journey.confidence}
              auditTag={journey.lifecycleStep}
              primaryAction={{ id: journey.id, label: journey.primaryActionLabel }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ControlPanelDshClosureEvidenceStream() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WebCompactSurfaceHeader
        title="تدفق أدلة الإغلاق"
        description="كل عنصر يمثل وحدة إغلاق يمكن توجيهها لمساحة العمل المناسبة."
      />
      <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {DSH_CROSS_SURFACE_CLOSURE_MAP.map((item) => (
          <WebControlDisclosureItem
            key={`${item.surfaceId}-${item.area}`}
            id={`${item.surfaceId}-${item.area}`}
            label={`${getSurfaceLabel(item.surfaceId)} / ${item.title}`}
            description={item.description}
            badge={item.status === 'closed' ? 'مكتمل' : item.status === 'needs-evidence' ? 'يحتاج دليل' : item.status === 'needs-ui-flow' ? 'يحتاج فلو' : 'محجوب'}
            href={item.routeHint}
          />
        ))}
      </div>
      <div className={styles.surfaceFootnote} style={{ padding: '0 14px 8px' }}>
        هذه اللوحة للعرض فقط ولا تقوم بتغيير حالة النظام الفعلية.
      </div>
    </div>
  );
}

export default ControlPanelDshClosureHubScreen;
