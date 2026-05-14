import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelDenseHeader,
  WebControlPanelLaneTabs,
  WebControlPanelSubTabs,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { getPartnerIntakeItems } from '../../shared/workflow';
import {
  ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
} from '../../shared/workflow';
import styles from '../shared/control-panel-surface.module.css';

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
        id: 'approve',
        label: 'قبول للمراجعة',
        onAction: () => onAction(item.id, 'approve')
      } : undefined}
      secondaryAction={['partner-submitted', 'field-submitted', 'partner-review'].includes(item.stage) ? {
        id: 'fix',
        label: 'طلب تعديل',
        onAction: () => onAction(item.id, 'fix')
      } : {
        id: 'reject',
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
    { id: 'inbox', label: 'الوارد الجديد', active: activeTab === 'inbox' },
    { id: 'eligibility', label: 'أهلية الترويج', active: activeTab === 'eligibility' },
    { id: 'topology', label: 'مسارات الخدمة', active: activeTab === 'topology' },
    { id: 'contracts', label: 'إدارة العقود والامتثال', active: activeTab === 'contracts' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string; active?: boolean }[]> = {
    inbox: [
      { id: 'registration', label: 'طلبات التسجيل', active: activeSubTab === 'registration' },
      { id: 'modifications', label: 'تعديل البيانات', active: activeSubTab === 'modifications' },
      { id: 'complaints', label: 'شكاوى الشركاء', active: activeSubTab === 'complaints' },
    ],
    eligibility: [
      { id: 'promotions', label: 'العروض الترويجية', active: activeSubTab === 'promotions' },
      { id: 'loyalty', label: 'برامج الولاء', active: activeSubTab === 'loyalty' },
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
    <div className={styles.surfaceCockpit} dir="rtl">
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>شركاء DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>مراجعة الشريك</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>حوكمة الشركاء، التغطية، وأهلية الترويج</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>شركاء نشطون</span>
              <span className={styles.commandKpiValue}>١,٢٥٤</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>طلبات معلقة</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>٢٨</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>تغطية المناطق</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>٨٤٪</span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.navigationDock}>
        <WebControlPanelLaneTabs items={PRIMARY_TABS} onSelect={(id) => setActiveTab(id)} />
      </nav>

      <div className={styles.filterDock}>
        {SECONDARY_TABS[activeTab] && (
          <WebControlPanelSubTabs
            items={SECONDARY_TABS[activeTab]}
            onSelect={(id) => setActiveSubTab(id)}
          />
        )}
      </div>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
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
                  <Text role="titleSm" tone="brand" style={{ fontWeight: '800' }}>هذه اللوحة تعرض الآن صفوف التفعيل والمراجعة</Text>
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
