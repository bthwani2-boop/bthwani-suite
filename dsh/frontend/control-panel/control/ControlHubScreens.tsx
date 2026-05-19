import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelSubTabs, WebControlPanelRecommendation } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, getDshClosureItemsByStatus } from '../shared';
import styles from '../shared/control-panel-surface.module.css';

type GuardFilter = 'pass' | 'warn' | 'blocked';

export function ControlPanelDshControlHubScreen() {
  const { theme } = useTheme();
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
      { id: 'pass', label: 'مكتمل' },
      { id: 'warn', label: 'تنبيه' },
      { id: 'blocked', label: 'محجوب' },
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
      <Box gap={2}>
        <WebControlPanelRecommendation
          title="لوحة الحماية"
          reason={`التبويب الحالي: ${activeTab} · التصفية: ${activeSubTab} · افتح الأدلة أو الحواجز للمتابعة.`}
          confidence="medium"
          auditTag="حماية DSH"
          primaryAction={{ id: 'open-evidence', label: 'فتح الدليل', onAction: () => setActiveTab('evidence') }}
          secondaryAction={{ id: 'open-guards', label: 'حالة الحواجز', onAction: () => setActiveTab('guards') }}
        />
        <Text role="bodySm" tone="muted">يعرض هذا التبويب مسار الحماية الحالي بشكل تنفيذي وليس كلوحة قراءة فقط.</Text>
      </Box>
    );
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Control Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <span className={styles.surfaceHeaderGlyphLabel}>ح</span>
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>حوكمة DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>مستوى الأمان: عالٍ</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>إدارة معايير الحماية، الحوكمة، وسجلات التدقيق المركزية</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'حواجز مفعلة', value: '١٢' },
              { label: 'تنبيهات أمنية', value: '٠', tone: 'success' },
              { label: 'سجلات اليوم', value: '١,٤٠٠' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={m.tone === 'success' ? `${styles.commandKpiValue} ${styles.commandKpiValueSuccess}` : styles.commandKpiValue}>{m.value}</span>
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export function ControlPanelDshGovernanceEvidenceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="أدلة الحوكمة"
      title="مصفوفة أدلة DSH"
      description="مصفوفة مضغوطة لحالة الإغلاق، تغطية الأسطح، ونتائج الحواجز."
      badges={['governance', 'evidence']}
      metaItems={['حالة الإغلاق', 'تغطية الأسطح', 'نتائج الحواجز']}
      decisionBoard={{
        title: 'لوحة قرار الأدلة',
        purpose: 'إبقاء فجوات الأدلة مرئية قبل اعتبار السطح مغلقاً.',
        primaryDecision: 'أغلق فجوة الأدلة أو ابقِ السطح محجوباً.',
        nextAction: 'افتح حالة الحواجز واستكمل الدليل الناقص.',
        blockers: 'الأدلة الناقصة ومسارات واجهة المستخدم لا تزال قائمة.',
        ownerSurface: 'control',
        evidenceHint: 'عناصر الإغلاق، نتائج الحواجز، وأدلة المسار',
        routeHint: '/operations?workspace=guard-status',
        decisionTone: 'danger',
      }}
      primaryAction={{ label: 'فتح حالة الحواجز', href: '/operations?workspace=guard-status' }}
      secondaryAction={{ label: 'فتح لوحة المراقبة', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'closed', title: 'مغلق', value: String(getDshClosureItemsByStatus('closed').length), description: 'العناصر المغلقة موثقة بالكامل.', tone: 'best' },
        { id: 'needs-evidence', title: 'يحتاج دليل', value: String(getDshClosureItemsByStatus('needs-evidence').length), description: 'عناصر بانتظار إثبات الدليل.', tone: 'warning' },
        { id: 'needs-ui-flow', title: 'يحتاج مسار واجهة', value: String(getDshClosureItemsByStatus('needs-ui-flow').length), description: 'عناصر تحتاج إصلاح مسار الواجهة.', tone: 'warning' },
        { id: 'blocked', title: 'محجوب', value: String(getDshClosureItemsByStatus('blocked').length), description: 'عناصر محجوبة خارج نطاق الإغلاق الحالي.', tone: 'danger' },
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
      status: item.status === 'closed' ? 'مغلق' : item.status === 'blocked' ? 'محجوب' : item.status === 'needs-evidence' ? 'يحتاج دليل' : 'يحتاج مسار',
      ownerSurface: 'control',
      blocker: item.description,
      evidence: reviewedIds.has(id) ? 'تمت المراجعة محلياً' : 'مطلوب دليل مفتوح',
      primaryActionLabel: 'تأكيد المراجعة',
      secondaryActionLabel: 'فتح العائق',
      evidenceActionLabel: 'فتح الدليل',
      tone: item.status === 'closed' ? 'best' : item.status === 'blocked' ? 'danger' : item.status === 'needs-evidence' ? 'warning' : 'warning',
    } as const;
  });

  const selectedQueueItem = queueItems.find((item) => item.id === selectedItemId) ?? queueItems[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow="حالة الحواجز"
        title="حالة حواجز DSH"
        description="الحواجز المتعلقة بـ DSH فقط، مع ملخصات مكتمل / تنبيه / محجوب."
        badges={['guards']}
        metaItems={['مكتمل', 'تنبيه', 'محجوب']}
        decisionBoard={{
          title: 'لوحة قرار الحواجز',
          purpose: 'كشف قرارات الحواجز مع السبب والخطوة التالية.',
          primaryDecision: 'اقبل السطح، أو حذّر عند المراجعة، أو احجبه.',
          nextAction: activeFilter === 'blocked' ? 'افتح العائق والدليل' : 'أكد المراجعة محلياً وأعد فتح الدليل إذا لزم.',
          blockers: 'العناصر المحجوبة وفجوات الإثبات لا تزال مرئية هنا.',
          ownerSurface: 'control',
          evidenceHint: selectedQueueItem ? selectedQueueItem.evidence : 'قرارات الحواجز وصفوف خريطة الإغلاق',
          routeHint: '/operations?workspace=evidence',
          decisionTone: activeFilter === 'blocked' ? 'danger' : activeFilter === 'pass' ? 'best' : 'warning',
        }}
        primaryAction={{ label: 'فتح الدليل', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'فتح لوحة المراقبة', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: 'pass', title: 'مكتمل', value: String(grouped.closed.length), description: 'العناصر المغلقة التي تجتاز الإغلاق.', tone: 'best' },
          { id: 'warn', title: 'تنبيه', value: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), description: 'عناصر تحتاج إثباتاً أو إصلاح واجهة.', tone: 'warning' },
          { id: 'blocked', title: 'محجوب', value: String(grouped.blocked.length), description: 'عناصر محجوبة خارج النطاق الحالي.', tone: 'danger' },
        ]}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <WebControlPanelSubTabs
          items={[
            { id: 'pass', label: `مكتمل (${grouped.closed.length})`, active: activeFilter === 'pass' },
            { id: 'warn', label: `تنبيه (${grouped.needsEvidence.length + grouped.needsUiFlow.length})`, active: activeFilter === 'warn' },
            { id: 'blocked', label: `محجوب (${grouped.blocked.length})`, active: activeFilter === 'blocked' },
          ]}
          onSelect={(itemId) => setActiveFilter(itemId as GuardFilter)}
          ariaLabel="فلاتر الحواجز"
        />
        <ControlPanelDshActionQueue
          title="صفوف الحواجز"
          purpose="راجع صف القرار المحدد، افتح العائق، أو افتح الدليل."
          items={queueItems}
          selectedId={selectedItemId}
          onSelect={setSelectedItemId}
          primaryAction={(item) => setReviewedIds((current) => new Set([...current, item.id]))}
          secondaryAction={() => setActiveFilter('blocked')}
          evidenceAction={() => setActiveFilter('warn')}
        />
      </div>
    </Box>
  );
}

export default ControlPanelDshControlHubScreen;
