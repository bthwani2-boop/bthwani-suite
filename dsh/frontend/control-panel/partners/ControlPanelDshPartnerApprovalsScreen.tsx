import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow } from '@bthwani/ui-kit/web';
import { getPartnerIntakeItems } from '../../shared/workflow';
import {
  ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';
import styles from '../operations/dsh-surface.module.css';

function PartnerApprovalCard({ item, onAction }: { item: ApprovalRecord; onAction: (id: string, action: 'approve' | 'reject' | 'fix') => void }) {
  const tone = (item.stage === 'marketing-review' || item.stage === 'approved') ? 'success' :
               (item.stage === 'needs-fix') ? 'danger' :
               (item.stage === 'partner-submitted' || item.stage === 'field-submitted') ? 'warning' : 'neutral';

  return (
    <WebControlPanelDecisionRow
      entityId={item.id}
      entityLabel={item.title}
      status={translateStage(item.stage)}
      statusTone={tone === 'danger' ? 'danger' : tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'neutral'}
      risk={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'neutral'}
      recommendation="مراجعة المستندات"
      reason="البيانات المرفوعة مكتملة وتطابق المعايير الأولية لمنصة بثواني."
      sla={translateEntityType(item.entityType)}
      primaryAction={['partner-submitted', 'field-submitted', 'partner-review'].includes(item.stage) ? {
        label: 'قبول للمراجعة',
        onAction: () => onAction(item.id, 'approve')
      } : undefined}
      secondaryAction={['partner-submitted', 'field-submitted', 'partner-review'].includes(item.stage) ? {
        label: 'طلب تعديل',
        onAction: () => onAction(item.id, 'fix')
      } : {
        label: 'رفض',
        onAction: () => onAction(item.id, 'reject')
      }}
    />
  );
}

export function ControlPanelDshPartnerHubScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('inbox');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('registration');
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);

  const refresh = () => setItems(getPartnerIntakeItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'fix') => {
    if (action === 'approve') {
      moveApprovalRecordToStage(id, 'marketing-review', 'control-panel-partners', 'قبول للمراجعة التسويقية');
    } else if (action === 'reject') {
      moveApprovalRecordToStage(id, 'rejected', 'control-panel-partners', 'رفض');
    } else if (action === 'fix') {
      moveApprovalRecordToStage(id, 'needs-fix', 'control-panel-partners', 'طلب تعديل');
    }
    refresh();
  };

  const PRIMARY_TABS = [
    { id: 'inbox', label: 'الوارد الجديد' },
    { id: 'eligibility', label: 'أهلية الترويج' },
    { id: 'topology', label: 'مسارات الخدمة' },
    { id: 'contracts', label: 'إدارة العقود والامتثال' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    inbox: [
      { id: 'registration', label: 'طلبات التسجيل' },
      { id: 'modifications', label: 'تعديل البيانات' },
      { id: 'complaints', label: 'شكاوى الشركاء' },
    ],
    eligibility: [
      { id: 'promotions', label: 'العروض الترويجية' },
      { id: 'loyalty', label: 'برامج الولاء' },
    ],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

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
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>شركاء DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>مراجعة الشريك</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>حوكمة الشركاء، التغطية، وأهلية الترويج</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>شركاء نشطون</span>
              <span className={styles.commandKpiValue}>١,٢٥٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>طلبات معلقة</span>
              <span className={styles.commandKpiValue} style={{ color: '#D97706' }}>٢٨</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>تغطية المناطق</span>
              <span className={styles.commandKpiValue} style={{ color: '#16A34A' }}>٨٤٪</span>
            </div>
          </div>
        </div>
      </header>

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

      {SECONDARY_TABS[activeTab] && (
        <div className={styles.filterDock}>
          {SECONDARY_TABS[activeTab].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSubTab(s.id)}
              className={styles.operationsTab}
              style={{
                backgroundColor: s.id === activeSubTab ? 'rgba(255, 80, 13, 0.1)' : 'transparent',
                color: s.id === activeSubTab ? '#FF500D' : '#64748B',
                borderColor: s.id === activeSubTab ? 'rgba(255, 80, 13, 0.2)' : 'transparent',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box padding={4} gap={4}>
            {activeTab === 'inbox' && activeSubTab === 'registration' ? (
              <Box gap={3}>
                {items.length === 0 ? (
                  <Box padding={8} align="center" background="surfaceRaised" radiusToken="lg">
                    <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
                  </Box>
                ) : (
                  items.map((item) => (
                    <PartnerApprovalCard key={item.id} item={item} onAction={handleAction} />
                  ))
                )}
              </Box>
            ) : (
              <Box padding={6} align="center" background="surfaceRaised" radiusToken="lg" gap={2}>
                <Box align="center" gap={1}>
                  <Text role="titleSm" style={{ color: '#0A2F5C', fontWeight: '800' }}>هذه اللوحة تعرض الآن صفوف التفعيل والمراجعة</Text>
                  <Text tone="muted">يمكن التبديل بين التبويبات الفرعية لفرز الطلبات حسب السطح والمراجعة والإسناد.</Text>
                </Box>
              </Box>
            )}
          </Box>
        </div>
      </main>
    </div>
  );
}

export function ControlPanelDshPartnerApprovalsScreen() {
  return <ControlPanelDshPartnerHubScreen />;
}

export default ControlPanelDshPartnerApprovalsScreen;
