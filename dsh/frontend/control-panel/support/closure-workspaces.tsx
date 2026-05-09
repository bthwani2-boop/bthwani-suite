import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem } from '../shared';
import styles from '../operations/dsh-surface.module.css';

type SupportLane = 'order' | 'partner' | 'captain' | 'field';

function buildSupportItems(kind: 'queue' | 'dispute') {
  const lanes: readonly SupportLane[] = ['order', 'partner', 'captain', 'field'];
  return lanes.map((lane) => ({
    id: `${kind}-${lane}`,
    title: `${lane === 'order' ? 'طلب' : lane === 'partner' ? 'شريك' : lane === 'captain' ? 'كابتن' : 'ميداني'} ${kind === 'dispute' ? 'نزاع' : 'دعم'}`,
    status: lane === 'order' ? 'نشط' : 'جاهز',
    ownerSurface: 'support',
    blocker: kind === 'dispute' ? 'يجب تأكيد الأدلة والملكية.' : 'خصص مالكًا واختر السطح المرتبط.',
    evidence: `إثبات سطح ${lane} المرتبط`,
    primaryActionLabel: kind === 'dispute' ? 'حل محلي' : 'فرز',
    secondaryActionLabel: 'تعيين مالك',
    evidenceActionLabel: `فتح ${lane} المرتبط`,
    tone: lane === 'order' ? 'brand' : lane === 'partner' ? 'best' : lane === 'captain' ? 'warning' : 'warning',
  })) satisfies readonly ControlPanelDshActionQueueItem[];
}

function SupportQueueBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: 'queue' | 'dispute';
}) {
  const items = buildSupportItems(kind);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [note, setNote] = React.useState('جاهز للفرز');
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box gap={4} style={{ padding: '16px' }}>
            <ControlPanelDshActionQueue
              title={title}
              purpose={purpose}
              items={items}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              primaryAction={(item) => { setSelectedId(item.id); setNote(`${item.primaryActionLabel}: ${item.title}`); }}
              secondaryAction={(item) => { setSelectedId(item.id); setNote(`${item.secondaryActionLabel}: ${item.title}`); }}
              evidenceAction={(item) => { setSelectedId(item.id); setNote(`${item.evidenceActionLabel}: ${item.title}`); }}
            />

            <ControlPanelDshWorkspaceFrame
              eyebrow={kind === 'queue' ? 'صف الدعم' : 'حل النزاعات'}
              title={title}
              description="صف دعم مرتبط بـ DSH مع الفرز والتعيين وحل الأسطح المرتبطة."
              badges={['support', kind]}
              metaItems={[selected?.status ?? 'مفتوح', note]}
              decisionBoard={{
                title: `لوحة ${title}`,
                purpose,
                primaryDecision: selected?.status ?? 'مفتوح',
                nextAction: note,
                blockers: selected?.blocker ?? 'اختر مسار المشكلة.',
                ownerSurface: 'support',
                evidenceHint: selected?.evidence ?? 'إثبات السطح المرتبط',
                routeHint: '/operations?workspace=issues',
                decisionTone: kind === 'dispute' ? 'warning' : 'danger',
              }}
              primaryAction={{ label: 'فتح المشكلات', href: '/operations?workspace=issues' }}
              secondaryAction={{ label: 'فتح الأدلة', href: '/operations?workspace=evidence' }}
              signals={[
                { id: `${kind}-open`, title: 'مفتوح', value: 'مرئي', description: 'مسار المشكلة المفتوح.', tone: 'warning' },
                { id: `${kind}-assigned`, title: 'معين', value: 'محلي', description: 'مسار المالك المعين.', tone: 'best' },
                { id: `${kind}-linked`, title: 'مرتبط', value: 'مرئي', description: 'مسار السطح المرتبط.', tone: 'brand' },
                { id: `${kind}-escalated`, title: 'مصعد', value: 'متتبع', description: 'مسار التصعيد.', tone: 'danger' },
              ]}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export function ControlPanelDshSupportHubScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('queue');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('order');

  const PRIMARY_TABS = [
    { id: 'queue', label: 'صفوف الدعم' },
    { id: 'disputes', label: 'حل النزاعات' },
    { id: 'feedback', label: 'الآراء والملاحظات' },
    { id: 'intelligence', label: 'الذكاء والدعم التنبؤي' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    queue: [
      { id: 'order', label: 'دعم الطلبات' },
      { id: 'partner', label: 'دعم الشركاء' },
      { id: 'captain', label: 'دعم الكباتن' },
      { id: 'field', label: 'دعم الميدان' },
    ],
    disputes: [
      { id: 'active', label: 'نزاعات نشطة' },
      { id: 'review', label: 'تحت المراجعة' },
      { id: 'closed', label: 'الأرشيف' },
    ],
    feedback: [
      { id: 'clients', label: 'العملاء' },
      { id: 'partners', label: 'الشركاء' },
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
    if (activeTab === 'queue' || activeTab === 'disputes') {
      return (
        <SupportQueueBoard
          title={activeTab === 'queue' ? 'صف دعم عابر للأسطح' : 'دورة حياة النزاع'}
          purpose={activeTab === 'queue' ? 'ابقِ الدعم مرتبطًا بالمشكلات المتعلقة بـ DSH.' : 'ابقِ النزاع في سياق مرتبط بـ DSH.'}
          kind={activeTab === 'queue' ? 'queue' : 'dispute'}
        />
      );
    }
    return (
      <Box padding={6} alignItems="center" justifyContent="center" style={{ minHeight: '400px' }}>
        <Text role="titleMd" tone="muted">قريباً: {activeTab} / {activeSubTab}</Text>
      </Box>
    );
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Support Command Deck */}
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
            🎧
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>دعم DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#DCFCE7', color: '#16A34A', borderRadius: '4px', fontWeight: '800' }}>مباشر</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>إدارة المشكلات، النزاعات، وجودة التجربة</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {[
              { label: 'تذاكر مفتوحة', value: '٤٢' },
              { label: 'نزاعات معلقة', value: '١٨' },
              { label: 'متوسط الحل', value: '١٤ دقيقة' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue}>{m.value}</span>
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

export function ControlPanelDshSupportQueueScreen() {
  return <ControlPanelDshSupportHubScreen />;
}

export function ControlPanelDshDisputeResolutionScreen() {
  return <ControlPanelDshSupportHubScreen />;
}

export default ControlPanelDshSupportQueueScreen;
