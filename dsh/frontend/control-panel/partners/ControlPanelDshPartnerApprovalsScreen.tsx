import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import { getPartnerIntakeItems } from '../../shared/partner-intake-store';
import {
  ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';

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
    <Box gap={0} style={{ flex: 1 }}>
      {/* 1. Header Area */}
      <Box padding={4} background="surface" style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(10,47,92,0.08)' }} layoutDirection="row" justify="space-between" align="center">
        <Box gap={1}>
          <Box layoutDirection="row" align="center" gap={2}>
            <Text role="titleMd" style={{ color: '#0A2F5C', fontWeight: '800' }}>شركاء DSH</Text>
            <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>مراجعة الشريك</span>
          </Box>
          <Text role="caption" tone="muted">حوكمة الشركاء، التغطية، وأهلية الترويج</Text>
        </Box>

        <WebControlPanelKpiStrip
          items={[
            { id: 'active', label: 'شركاء نشطون', value: '١,٢٥٤', tone: 'neutral' },
            { id: 'pending', label: 'طلبات معلقة', value: '٢٨', tone: 'warning' },
            { id: 'coverage', label: 'تغطية المناطق', value: '٨٤٪', tone: 'success' }
          ]}
        />
      </Box>

      {/* 2. Navigation */}
      <WebControlPanelWorkspaceTabs
        items={PRIMARY_TABS.map(t => ({ id: t.id, label: t.label, active: t.id === activeTab }))}
        onSelect={setActiveTab}
      />

      {SECONDARY_TABS[activeTab] && (
        <WebControlPanelSubTabs
          items={SECONDARY_TABS[activeTab].map(s => ({ id: s.id, label: s.label, active: s.id === activeSubTab }))}
          onSelect={setActiveSubTab}
        />
      )}

      {/* 3. Content */}
      <Box padding={4} gap={4} style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'inbox' && activeSubTab === 'registration' ? (
          <Box gap={3}>
            {items.length === 0 ? (
              <Box padding={8} align="center" background="surfaceRaised" radiusToken="lg">
                <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
              </Box>
            ) : (
              items.map(item => (
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
    </Box>
  );
}

export function ControlPanelDshPartnerApprovalsScreen() {
  return <ControlPanelDshPartnerHubScreen />;
}

export default ControlPanelDshPartnerApprovalsScreen;
