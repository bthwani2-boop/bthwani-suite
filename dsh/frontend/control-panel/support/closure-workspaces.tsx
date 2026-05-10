import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelActionCluster,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
  WebControlPanelKpiStrip,
  WebControlPanelSubTabs,
  WebControlPanelWorkspaceTabs,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';

type SupportTab = 'queue' | 'disputes' | 'feedback' | 'escalation' | 'sla-risk';
type SupportLane = 'الطلبات' | 'الشركاء' | 'الكباتن' | 'الميدان';

type SupportRow = {
  id: string;
  surface: string;
  title: string;
  status: string;
  severity: 'danger' | 'warning' | 'success';
  slaAge: string;
  owner: string;
  blocker: string;
  evidence: string;
  nextAction: string;
  recommendation: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

function resolveCommitmentLabel() {
  return 'خطر الالتزام';
}

const PRIMARY_TABS: ReadonlyArray<{ id: SupportTab; label: string }> = [
  { id: 'queue', label: 'صفوف الدعم' },
  { id: 'disputes', label: 'النزاعات' },
  { id: 'feedback', label: 'الآراء' },
  { id: 'escalation', label: 'التصعيد' },
  { id: 'sla-risk', label: resolveCommitmentLabel() },
];

const SECONDARY_TABS: Record<SupportTab, ReadonlyArray<{ id: SupportLane | 'الكل'; label: string }>> = {
  queue: [
    { id: 'الكل', label: 'الكل' },
    { id: 'الطلبات', label: 'الطلبات' },
    { id: 'الشركاء', label: 'الشركاء' },
    { id: 'الكباتن', label: 'الكباتن' },
    { id: 'الميدان', label: 'الميدان' },
  ],
  disputes: [{ id: 'الكل', label: 'الكل' }],
  feedback: [{ id: 'الكل', label: 'الكل' }],
  escalation: [{ id: 'الكل', label: 'الكل' }],
  'sla-risk': [{ id: 'الكل', label: 'الكل' }],
};

const SUPPORT_ROWS: ReadonlyArray<SupportRow> = [
  {
    id: 'SUP-401',
    surface: 'الطلبات',
    title: 'تأخر تسليم طلب',
    status: 'نشط',
    severity: 'warning',
    slaAge: '15 دقيقة',
    owner: 'تشغيل الطلبات',
    blocker: 'انتظار إثبات الاستلام',
    evidence: 'سجل رنين + صورة الاستلام',
    nextAction: 'أعد فتح الطلب واطلب الإثبات',
    recommendation: 'ابدأ من إثبات الاستلام ثم أعد الإسناد إذا استمر التأخير',
    primaryActionLabel: 'فتح الطلب',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-402',
    surface: 'الشركاء',
    title: 'نزاع شريك على فاتورة',
    status: 'تحت المراجعة',
    severity: 'warning',
    slaAge: '32 دقيقة',
    owner: 'دعم الشركاء',
    blocker: 'فاتورة غير مطابقة',
    evidence: 'نسخة الفاتورة + سجل التحصيل',
    nextAction: 'طابق الفاتورة مع سجل التحصيل',
    recommendation: 'أغلق النزاع فقط بعد مراجعة الفاتورة والسجل',
    primaryActionLabel: 'مراجعة الشريك',
    secondaryActionLabel: 'فتح الأدلة',
  },
  {
    id: 'SUP-403',
    surface: 'الكباتن',
    title: 'تذكرة كابتن حول تعطل المسار',
    status: 'تحتاج حل',
    severity: 'danger',
    slaAge: '5 دقائق',
    owner: 'دعم الكباتن',
    blocker: 'تعطل في الإشارة والاتصال',
    evidence: 'مراسلات الدعم + سجل الجهاز',
    nextAction: 'اعرض كابتن بديل وفعّل التصعيد',
    recommendation: 'لا تغلق التذكرة قبل تعيين بديل أو حل الاتصال',
    primaryActionLabel: 'إسناد بديل',
    secondaryActionLabel: 'فتح التصعيد',
  },
  {
    id: 'SUP-404',
    surface: 'الميدان',
    title: 'تأخر زيارة ميدانية',
    status: 'مراقبة',
    severity: 'success',
    slaAge: '47 دقيقة',
    owner: 'الميدان',
    blocker: 'بانتظار تأكيد الزيارة',
    evidence: 'إثبات الموعد + سجل الحضور',
    nextAction: 'ثبّت الموعد أو أغلقها مع دليل',
    recommendation: 'أغلق الحالة فقط بعد تأكيد الحضور أو تغيير الموعد',
    primaryActionLabel: 'تثبيت الموعد',
    secondaryActionLabel: 'فتح الأدلة',
  },
];

function filterRows(tab: SupportTab, lane: string) {
  return SUPPORT_ROWS.filter((row) => {
    if (tab === 'queue') {
      return lane === 'الكل' || row.surface === lane;
    }

    if (tab === 'disputes') {
      return row.status.includes('مراجعة') || row.status.includes('تحتاج');
    }

    if (tab === 'feedback') {
      return row.surface === 'الطلبات' || row.surface === 'الشركاء';
    }

    if (tab === 'escalation') {
      return row.severity === 'danger';
    }

    return row.slaAge.includes('دقيقة') || row.slaAge.includes('47');
  });
}

export function ControlPanelDshSupportHubScreen() {
  const [activeTab, setActiveTab] = React.useState<SupportTab>('queue');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('الكل');
  const [selectedId, setSelectedId] = React.useState<string>(SUPPORT_ROWS[0]?.id ?? '');

  React.useEffect(() => {
    setActiveSubTab(SECONDARY_TABS[activeTab][0]?.id ?? 'الكل');
  }, [activeTab]);

  const rows = filterRows(activeTab, activeSubTab);
  const selectedRow = rows.find((row) => row.id === selectedId) ?? rows[0] ?? SUPPORT_ROWS[0];

  return (
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderRadius: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 2, backgroundColor: '#FFFFFF', transform: 'translate(-50%, -50%)' }} />
            </div>
          </div>
          <Box gap={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em', color: '#0A2F5C', fontWeight: 800 }}>دعم DSH</h1>
              <Box paddingX={1.5} paddingY={0.5} background="warning" radiusToken="xs">
                 <Text role="caption" style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '9px' }}>غرفة قيادة</Text>
              </Box>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#64748B' }}>صفوف دعم، نزاعات، تصعيد، وخطر الالتزام</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>صفوف مفتوحة</span>
              <span className={styles.commandKpiValue}>١٧</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نزاعات</span>
              <span className={styles.commandKpiValue} style={{ color: '#FF500D' }}>٩</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>{resolveCommitmentLabel()}</span>
              <span className={styles.commandKpiValue} style={{ color: '#DC2626' }}>٣</span>
            </div>
          </div>
        </div>
      </header>

      <WebControlPanelKpiStrip
        items={[
          { id: 'queue', label: 'صفوف الدعم', value: String(rows.length), tone: 'neutral' },
          { id: 'selected', label: 'المحدد', value: selectedRow?.id ?? '—', tone: 'warning' },
          { id: 'owner', label: 'المالك', value: selectedRow?.owner ?? '—', tone: 'success' },
        ]}
      />

      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={PRIMARY_TABS.map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeTab }))}
          ariaLabel="صفوف الدعم"
          onSelect={(id) => setActiveTab(id as SupportTab)}
        />
      </nav>

      <div className={styles.filterDock} style={{ backgroundColor: '#F8FAFC' }}>
        <WebControlPanelSubTabs
          items={SECONDARY_TABS[activeTab].map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeSubTab }))}
          ariaLabel="فلاتر الدعم"
          onSelect={(id) => setActiveSubTab(id)}
        />
      </div>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0, overflowY: 'auto' }}>
              <Text role="titleSm">صفوف {activeTab === 'queue' ? 'الدعم' : activeTab === 'disputes' ? 'النزاعات' : activeTab === 'feedback' ? 'الآراء' : activeTab === 'escalation' ? 'التصعيد' : resolveCommitmentLabel()}</Text>
              <Box gap={2}>
                  {rows.map((row) => (
                    <WebControlPanelDecisionRow
                      key={row.id}
                      entityId={row.id}
                      entityLabel={`${row.surface} · ${row.title}`}
                      status={row.status}
                      statusTone={row.severity === 'danger' ? 'danger' : row.severity === 'warning' ? 'warning' : 'success'}
                      risk={row.severity === 'danger' ? 'danger' : row.severity === 'warning' ? 'warning' : 'neutral'}
                      recommendation={row.recommendation}
                      reason={row.blocker}
                      sla={`زمن الالتزام ${row.slaAge} · المالك ${row.owner}`}
                      primaryAction={{ id: `${row.id}-primary`, label: row.primaryActionLabel, onAction: () => setSelectedId(row.id) }}
                      secondaryAction={{ id: `${row.id}-secondary`, label: row.secondaryActionLabel, onAction: () => setSelectedId(row.id) }}
                      onInspect={() => setSelectedId(row.id)}
                    />
                  ))}
                </Box>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                <Text role="titleSm">تفاصيل {selectedRow?.id ?? ''}</Text>
                <Box gap={2}>
                  <div style={{ padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                    <Text role="caption" tone="muted">السطح: {selectedRow?.surface}</Text>
                    <Text role="caption" tone="muted">المالك: {selectedRow?.owner}</Text>
                    <Text role="caption" tone="muted">العائق: {selectedRow?.blocker}</Text>
                    <Text role="caption" tone="muted">الدليل: {selectedRow?.evidence}</Text>
                    <Text role="caption" tone="muted">الإجراء التالي: {selectedRow?.nextAction}</Text>
                  </div>
                  <WebControlPanelRecommendation
                    title="توصية الدعم"
                    reason={selectedRow ? `لماذا؟ ${selectedRow.recommendation} · ما الدليل؟ ${selectedRow.evidence}` : 'اختر صفًا.'}
                    confidence="high"
                    auditTag={selectedRow?.owner ?? 'support'}
                    primaryAction={selectedRow ? { id: `${selectedRow.id}-a`, label: selectedRow.primaryActionLabel } : undefined}
                    secondaryAction={selectedRow ? { id: `${selectedRow.id}-b`, label: selectedRow.secondaryActionLabel } : undefined}
                  />
                  <WebControlPanelActionCluster
                    primary={{ id: 'open-queue', label: 'فتح الصف' }}
                    secondary={{ id: 'open-evidence', label: 'فتح الأدلة' }}
                  />
                </Box>
              </div>
            </div>
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
