import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebControlDisclosureItem } from '@bthwani/ui-kit/web';
import { ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus, getDshClosureItemsBySurface } from '../shared';

export function ControlPanelDshClosureHubScreen() {
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
      <Box padding={6} alignItems="center" justifyContent="center" style={{ minHeight: '400px' }}>
        <Text role="titleMd" tone="muted">قريباً: {activeTab} / {activeSubTab}</Text>
      </Box>
    );
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Closure Command Deck */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#0A2F5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            🏁
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>إغلاق DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#DCFCE7', color: '#16A34A', borderRadius: '4px', fontWeight: '800' }}>مرحلة الجاهزية</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>حوكمة الإغلاق النهائي ومصفوفة الجاهزية العابرة للأسطح</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {[
              { label: 'مكتمل', value: '٨٢٪', tone: 'success' },
              { label: 'بانتظار دليل', value: '١٤' },
              { label: 'توقف (Blocker)', value: '٣', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue} style={m.tone === 'success' ? { color: '#16A34A' } : m.tone === 'danger' ? { color: '#DC2626' } : {}}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs */}
      <nav className={styles.navigationCockpit}>
        {PRIMARY_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.operationsTab} ${tab.id === activeTab ? styles.operationsTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. Secondary Tabs */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={styles.filterDock} style={{ padding: '4px 14px', minHeight: '36px', backgroundColor: '#F8FAFC' }}>
          {SECONDARY_TABS[activeTab].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={styles.operationsTab}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: sub.id === activeSubTab ? 'rgba(255, 80, 13, 0.1)' : 'transparent',
                color: sub.id === activeSubTab ? '#FF500D' : '#64748B',
                borderColor: sub.id === activeSubTab ? 'rgba(255, 80, 13, 0.2)' : 'transparent',
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 4. Main Panel */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box padding={4}>
            {renderContent()}
          </Box>
        </div>
      </main>
    </div>
  );
}

import styles from '../operations/dsh-surface.module.css';

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

export default ControlPanelDshClosureHubScreen;
