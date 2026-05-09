import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSegmentedTabs } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, getDshClosureItemsByStatus } from '../shared';

type GuardFilter = 'pass' | 'warn' | 'blocked';

export function ControlPanelDshControlHubScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('governance');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('all');

  const PRIMARY_TABS = [
    { id: 'governance', label: 'تدقيق الحوكمة' },
    { id: 'guards', label: 'حالة الحماية' },
    { id: 'audit', label: 'سجل العمليات' },
    { id: 'security', label: 'الأمن والوصول' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    governance: [
      { id: 'all', label: 'الكل' },
      { id: 'pending', label: 'بانتظار التدقيق' },
      { id: 'approved', label: 'معتمد' },
    ],
    guards: [
      { id: 'pass', label: 'PASS' },
      { id: 'warn', label: 'WARN' },
      { id: 'blocked', label: 'BLOCKED' },
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
    if (activeTab === 'governance') {
      return <ControlPanelDshGovernanceEvidenceScreen />;
    }
    if (activeTab === 'guards') {
      return <ControlPanelDshGuardStatusScreen />;
    }
    return (
      <Box padding={6} alignItems="center" justifyContent="center" style={{ minHeight: '400px' }}>
        <Text role="titleMd" tone="muted">قريباً: {activeTab} / {activeSubTab}</Text>
      </Box>
    );
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Control Command Deck */}
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
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>حوكمة DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>مستوى الأمان: عالٍ</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>إدارة معايير الحماية، الحوكمة، وسجلات التدقيق المركزية</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {[
              { label: 'حواجز مفعلة', value: '١٢' },
              { label: 'تنبيهات أمنية', value: '٠', tone: 'success' },
              { label: 'سجلات اليوم', value: '١,٤٠٠' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue} style={m.tone === 'success' ? { color: '#16A34A' } : {}}>{m.value}</span>
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

import styles from '../operations/dsh-surface.module.css';

export function ControlPanelDshGovernanceEvidenceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Governance evidence"
      title="DSH evidence matrix"
      description="A compact evidence matrix for closure state, surface coverage, and guard results."
      badges={['governance', 'evidence']}
      metaItems={['closure state', 'surface coverage', 'guard results']}
      decisionBoard={{
        title: 'Evidence closure board',
        purpose: 'Keep proof gaps visible before a surface is called closed.',
        primaryDecision: 'Close the evidence gap or leave the surface blocked.',
        nextAction: 'Open guard status and capture the missing proof.',
        blockers: 'Missing evidence and UI-flow cleanup still remain.',
        ownerSurface: 'control',
        evidenceHint: 'closure items, guard results, and route proof',
        routeHint: '/operations?workspace=guard-status',
        decisionTone: 'danger',
      }}
      primaryAction={{ label: 'Open guard status', href: '/operations?workspace=guard-status' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'closed', title: 'Closed', value: String(getDshClosureItemsByStatus('closed').length), description: 'Closed items are already proven.', tone: 'best' },
        { id: 'needs-evidence', title: 'Needs evidence', value: String(getDshClosureItemsByStatus('needs-evidence').length), description: 'Items waiting for evidence proof.', tone: 'warning' },
        { id: 'needs-ui-flow', title: 'Needs UI flow', value: String(getDshClosureItemsByStatus('needs-ui-flow').length), description: 'Items needing flow cleanup.', tone: 'warning' },
        { id: 'blocked', title: 'Blocked', value: String(getDshClosureItemsByStatus('blocked').length), description: 'Items blocked outside closure scope.', tone: 'danger' },
      ]}
    />
  );
}

export function ControlPanelDshGuardStatusScreen() {
  const grouped = {
    closed: getDshClosureItemsByStatus('closed'),
    needsEvidence: getDshClosureItemsByStatus('needs-evidence'),
    needsUiFlow: getDshClosureItemsByStatus('needs-ui-flow'),
    blocked: getDshClosureItemsByStatus('blocked'),
  } as const;
  const [activeFilter, setActiveFilter] = React.useState<GuardFilter>('warn');
  const [reviewedIds, setReviewedIds] = React.useState<ReadonlySet<string>>(new Set());
  const selectedItems = activeFilter === 'pass'
    ? grouped.closed
    : activeFilter === 'blocked'
      ? grouped.blocked
      : [...grouped.needsEvidence, ...grouped.needsUiFlow];
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(selectedItems[0] ? `${selectedItems[0].surfaceId}-${selectedItems[0].area}` : null);

  React.useEffect(() => {
    setSelectedItemId(selectedItems[0] ? `${selectedItems[0].surfaceId}-${selectedItems[0].area}` : null);
  }, [activeFilter]);

  const queueItems = selectedItems.map((item) => {
    const id = `${item.surfaceId}-${item.area}`;
    return {
      id,
      title: `${item.surfaceId} / ${item.title}`,
      status: item.status.toUpperCase(),
      ownerSurface: 'control',
      blocker: item.description,
      evidence: reviewedIds.has(id) ? 'Reviewed locally' : 'Open evidence required',
      primaryActionLabel: 'Mark reviewed locally',
      secondaryActionLabel: 'Open blocker',
      evidenceActionLabel: 'Open evidence',
      tone: item.status === 'closed' ? 'best' : item.status === 'blocked' ? 'danger' : item.status === 'needs-evidence' ? 'warning' : 'warning',
    } as const;
  });

  const selectedQueueItem = queueItems.find((item) => item.id === selectedItemId) ?? queueItems[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Guard status"
        title="DSH guard status"
        description="DSH-related guards only, with PASS/WARN/BLOCKED style summaries."
        badges={['guards']}
        metaItems={['PASS', 'WARN', 'BLOCKED']}
        decisionBoard={{
          title: 'Guard decision board',
          purpose: 'Expose guard verdicts with the reason and the next step.',
          primaryDecision: 'Pass the surface, warn on review, or block it.',
          nextAction: activeFilter === 'blocked' ? 'Open blocker and evidence' : 'Mark reviewed locally and reopen evidence if needed.',
          blockers: 'Blocked items and proof gaps remain visible here.',
          ownerSurface: 'control',
          evidenceHint: selectedQueueItem ? selectedQueueItem.evidence : 'guard verdicts and closure-map rows',
          routeHint: '/operations?workspace=evidence',
          decisionTone: activeFilter === 'blocked' ? 'danger' : activeFilter === 'pass' ? 'best' : 'warning',
        }}
        primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: 'pass', title: 'PASS', value: String(grouped.closed.length), description: 'Closed items that already pass closure.', tone: 'best' },
          { id: 'warn', title: 'WARN', value: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), description: 'Items needing proof or UI cleanup.', tone: 'warning' },
          { id: 'blocked', title: 'BLOCKED', value: String(grouped.blocked.length), description: 'Items blocked outside the current scope.', tone: 'danger' },
        ]}
      />

      <WebSectionCard title="Guard filters" description="Filter the closure map by verdict, then mark a row reviewed locally.">
        <WebSegmentedTabs
          ariaLabel="Guard filters"
          items={[
            { id: 'pass', label: 'PASS', metaLabel: String(grouped.closed.length), active: activeFilter === 'pass' },
            { id: 'warn', label: 'WARN', metaLabel: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), active: activeFilter === 'warn' },
            { id: 'blocked', label: 'BLOCKED', metaLabel: String(grouped.blocked.length), active: activeFilter === 'blocked' },
          ]}
          onSelect={(itemId) => setActiveFilter(itemId as GuardFilter)}
        />
        <ControlPanelDshActionQueue
          title="Guard rows"
          purpose="Review the selected verdict row, open the blocker, or open evidence."
          items={queueItems}
          selectedId={selectedItemId}
          onSelect={setSelectedItemId}
          primaryAction={(item) => setReviewedIds((current) => new Set([...current, item.id]))}
          secondaryAction={() => setActiveFilter('blocked')}
          evidenceAction={() => setActiveFilter('warn')}
        />
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshControlHubScreen;
