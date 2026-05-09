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
} from '@bthwani/ui-kit/web';
import styles from '../operations/dsh-surface.module.css';

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

const PRIMARY_TABS: ReadonlyArray<{ id: SupportTab; label: string }> = [
  { id: 'queue', label: 'صفوف الدعم' },
  { id: 'disputes', label: 'النزاعات' },
  { id: 'feedback', label: 'الآراء' },
  { id: 'escalation', label: 'التصعيد' },
  { id: 'sla-risk', label: 'خطر SLA' },
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
    <div className={styles.operationsCockpit} dir="rtl">
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div className={styles.operationsHeaderIconBox} aria-hidden="true">
            <div style={{ width: 18, height: 18, border: '2px solid #FFFFFF', borderRadius: 4, position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 2, backgroundColor: '#FFFFFF', transform: 'translate(-50%, -50%)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>دعم DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>غرفة قيادة</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>صفوف دعم، نزاعات، تصعيد، وخطر SLA في غرفة واحدة مضغوطة.</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>صفوف مفتوحة</span>
              <span className={styles.commandKpiValue}>١٧</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نزاعات</span>
              <span className={styles.commandKpiValue} style={{ color: '#D97706' }}>٩</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>خطر SLA</span>
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

      <WebControlPanelWorkspaceTabs
        items={PRIMARY_TABS.map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeTab }))}
        ariaLabel="صفوف الدعم"
        onSelect={(id) => setActiveTab(id as SupportTab)}
      />

      <WebControlPanelSubTabs
        items={SECONDARY_TABS[activeTab].map((tab) => ({ id: tab.id, label: tab.label, active: tab.id === activeSubTab }))}
        ariaLabel="فلاتر الدعم"
        onSelect={(id) => setActiveSubTab(id)}
      />

      <div className={styles.filterDock}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>السطح الحالي</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0A2F5C' }}>{activeTab === 'queue' ? 'صفوف الدعم' : activeTab === 'disputes' ? 'النزاعات' : activeTab === 'feedback' ? 'الآراء' : activeTab === 'escalation' ? 'التصعيد' : 'خطر SLA'}</span>
        <span style={{ fontSize: '11px', color: '#64748B' }}>يتم التصفية عبر التبويبات الفرعية فقط.</span>
      </div>

      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box gap={3} className={styles.operationsGridTwoCol}>
            <Box gap={2} className={styles.operationsCompactPanel}>
              <Text role="titleSm">صفوف {activeTab === 'queue' ? 'الدعم' : activeTab === 'disputes' ? 'النزاعات' : activeTab === 'feedback' ? 'الآراء' : activeTab === 'escalation' ? 'التصعيد' : 'خطر SLA'}</Text>
              <div style={{ display: 'grid', gap: '8px' }}>
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
                    sla={`SLA ${row.slaAge} · المالك ${row.owner}`}
                    primaryAction={{ id: `${row.id}-primary`, label: row.primaryActionLabel, onAction: () => setSelectedId(row.id) }}
                    secondaryAction={{ id: `${row.id}-secondary`, label: row.secondaryActionLabel, onAction: () => setSelectedId(row.id) }}
                    onInspect={() => setSelectedId(row.id)}
                  />
                ))}
              </div>
            </Box>

            <WebControlPanelInspectorShell title={`تفاصيل ${selectedRow?.id ?? ''}`}>
              <Box gap={2}>
                <Text role="bodySm">السطح: {selectedRow?.surface}</Text>
                <Text role="bodySm">المالك: {selectedRow?.owner}</Text>
                <Text role="bodySm">العائق: {selectedRow?.blocker}</Text>
                <Text role="bodySm">الدليل: {selectedRow?.evidence}</Text>
                <Text role="bodySm">الإجراء التالي: {selectedRow?.nextAction}</Text>
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
            </WebControlPanelInspectorShell>
          </Box>
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
