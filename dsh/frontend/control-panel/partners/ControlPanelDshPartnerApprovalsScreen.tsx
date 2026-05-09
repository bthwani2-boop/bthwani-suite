'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { getPartnerIntakeItems } from '../../shared/partner-intake-store';
import {
  ApprovalRecord,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';

import styles from '../operations/dsh-surface.module.css';
import { OperationsSuggestionCard } from '../operations/operations.ui';

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function PartnerApprovalCard({ item, onAction }: { item: ApprovalRecord; onAction: (id: string, action: 'approve' | 'reject' | 'fix') => void }) {
  const meta = {
    label: translateStage(item.stage),
    tone: (item.stage === 'marketing-review' || item.stage === 'approved') ? 'success' :
          (item.stage === 'needs-fix') ? 'danger' :
          (item.stage === 'partner-submitted' || item.stage === 'field-submitted') ? 'warning' : 'brand'
  };

  const statusClassName = meta.tone === 'success' ? styles.liveOrdersStatusBest :
                         meta.tone === 'warning' ? styles.liveOrdersStatusWarning :
                         meta.tone === 'danger' ? styles.liveOrdersStatusDanger : styles.liveOrdersStatusBrand;

  const cardClassName = [
    styles.liveOrdersOrderCard,
    meta.tone === 'danger' ? styles.liveOrdersOrderCardDanger : '',
    meta.tone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClassName}>
      <div className={styles.liveOrdersOrderMeta}>
        <div className={styles.liveOrdersOrderTopRow}>
          <span className={styles.liveOrdersOrderId}>{item.id}</span>
          <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{meta.label}</span>
          <span className={styles.liveOrdersRingHint}>{translateEntityType(item.entityType)}</span>
        </div>
        <div className={styles.liveOrdersDestination}>{item.title}</div>
        <div className={styles.liveOrdersMetaText}>المصدر: {translateOwner(item.source)}</div>
        <div className={styles.liveOrdersNoteText}>تاريخ التقديم: {new Date().toLocaleDateString('ar-SA')}</div>
      </div>

      <OperationsSuggestionCard
        label="توصية النظام: مراجعة المستندات"
        reason="البيانات المرفوعة مكتملة وتطابق المعايير الأولية لشبكة BThwani."
        confidence="high"
        actions={(
          <div className={styles.liveOrdersActionGrid}>
            {['partner-submitted', 'field-submitted', 'partner-review'].includes(item.stage) && (
              <>
                <button className={styles.liveOrdersActionPrimary} onClick={() => onAction(item.id, 'approve')}>قبول للمراجعة</button>
                <button className={styles.liveOrdersActionSecondary} onClick={() => onAction(item.id, 'fix')}>طلب تعديل</button>
              </>
            )}
            {item.stage === 'marketing-review' && (
              <button className={styles.liveOrdersActionPrimary} disabled style={{ opacity: 0.6 }}>في انتظار التسويق</button>
            )}
          </div>
        )}
      >
        <span className={styles.liveOrdersSuggestionChip}>جاهز للمعالجة</span>
      </OperationsSuggestionCard>

      <div className={styles.liveOrdersOrderActions}>
        <div className={styles.liveOrdersTimelineTitle}>المسار الزمني للطلب</div>
        <div className={styles.liveOrdersTimelineList}>
          <div>• استلام البيانات</div>
          <div>• التحقق من المصدر</div>
          <div>• في انتظار القرار</div>
        </div>
        <div className={styles.liveOrdersPlanWrap}>
          <span className={styles.liveOrdersPlanChip}>مراجعة قانونية</span>
          <span className={styles.liveOrdersPlanChip}>أهلية الترويج</span>
        </div>
        <div className={styles.liveOrdersActionGrid} style={{ marginTop: 'auto' }}>
           <button className={styles.liveOrdersActionSecondary} onClick={() => onAction(item.id, 'reject')}>رفض</button>
           <button className={styles.liveOrdersActionSecondary}>عرض السجل</button>
        </div>
      </div>
    </div>
  );
}

function CompactPartnerIntakeQueue() {
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

  return (
    <div className={styles.liveOrdersScreen}>
      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>قائمة طلبات الشركاء ({items.length})</h2>
        <button className={styles.liveOrdersFilterButton}>تحديث القائمة</button>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Text tone="muted">لا توجد طلبات واردة حالياً</Text>
          </div>
        ) : (
          items.map(item => (
            <PartnerApprovalCard key={item.id} item={item} onAction={handleAction} />
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────

export function ControlPanelDshPartnerHubScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('inbox');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('registration');

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

  const renderContent = () => {
    if (activeTab === 'inbox' && activeSubTab === 'registration') {
      return <CompactPartnerIntakeQueue />;
    }
    return (
      <Box padding={6} alignItems="center" justifyContent="center" style={{ minHeight: '400px' }}>
        <Text role="titleMd" tone="muted">قريباً: {activeTab} / {activeSubTab}</Text>
      </Box>
    );
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Partners Command Deck */}
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
            🤝
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
            {[
              { label: 'شركاء نشطون', value: '١,٢٥٤' },
              { label: 'طلبات معلقة', value: '٢٨' },
              { label: 'تغطية المناطق', value: '٨٤٪' }
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

export function ControlPanelDshPartnerApprovalsScreen() {
  return <ControlPanelDshPartnerHubScreen />;
}

export default ControlPanelDshPartnerApprovalsScreen;
