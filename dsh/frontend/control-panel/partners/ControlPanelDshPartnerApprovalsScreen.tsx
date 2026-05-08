'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PartnerTopologyLane } from './PartnerTopologyLane';
import { DshPartnerPromotionEligibilityScreen } from './DshPartnerPromotionEligibilityScreen';
import { dshPartnerIntakeMetrics } from './workflow';
import { getPartnerIntakeItems } from '../../shared/partner-intake-store';
import {
  ApprovalRecord,
  ApprovalStage,
  resolveNextOwner,
  moveApprovalRecordToStage,
} from '../../shared/workflow';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshPartnerApprovalsScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  catalogHref?: string;
  marketingHref?: string;
  initialTab?: 'inbox' | 'promotion' | 'topology';
};

const METRIC_ARABIC: Record<string, string> = {
  'Offer Pending Approval': 'بانتظار العرض',
  'Partner Review': 'مراجعة الشريك',
  'جاهز للتسويق': 'جاهز للتسويق',
};

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

  const getStageStyle = (stage: ApprovalStage) => {
    switch (stage) {
      case 'partner-submitted':
      case 'field-submitted': return { bg: '#FEF3C7', fg: '#D97706', label: 'مُقدم جديد' };
      case 'partner-review': return { bg: '#DBEAFE', fg: '#1D4ED8', label: 'قيد المراجعة' };
      case 'needs-fix': return { bg: '#FEF2F2', fg: '#DC2626', label: 'يتطلب تعديل' };
      case 'rejected': return { bg: '#F1F5F9', fg: '#475569', label: 'مرفوض' };
      case 'marketing-review': return { bg: '#DCFCE7', fg: '#16A34A', label: 'مُحوّل للتسويق' };
      case 'marketing-approved': return { bg: '#DBEAFE', fg: '#1D4ED8', label: 'معتمد تسويقياً' };
      case 'catalog-adopted': return { bg: '#DCFCE7', fg: '#16A34A', label: 'في الكتالوج' };
      case 'client-visible': return { bg: '#DCFCE7', fg: '#166534', label: 'ظاهر للعميل' };
      default: return { bg: '#F1F5F9', fg: '#475569', label: stage };
    }
  };

  const entityLabel = (type: string) => {
    switch (type) {
      case 'product': return 'منتج';
      case 'product-media': return 'صورة';
      case 'category-suggestion': return 'فئة';
      case 'partner-offer': return 'عرض';
      case 'store': return 'متجر';
      default: return type;
    }
  };

  const canAct = (stage: ApprovalStage) =>
    ['partner-submitted', 'field-submitted', 'partner-review'].includes(stage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#FAFAFA', minHeight: '100%', direction: 'rtl' }}>
      <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>🛡️</span>
        <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: 600 }}>بوابة المراجعة الأولى (Intake Gate): بعد القبول ينتقل إلى التسويق، ولا يظهر في العميل بعد.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(item => {
          const sStyle = getStageStyle(item.stage);
          const nextOwner = resolveNextOwner(item.stage);
          const trail = item.auditTrail || [];

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C' }}>{item.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 700 }}>{entityLabel(item.entityType)}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F3E8FF', color: '#7E22CE', fontWeight: 700 }}>{item.source === 'app-field' ? 'ميداني' : 'شريك'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
                  <span>تاريخ التقديم: {new Date(item.submittedAt).toLocaleDateString('ar-SA')}</span>
                  <span>•</span>
                  <span>المالك: {nextOwner === 'control-panel-marketing' ? 'التسويق' : nextOwner === 'control-panel-partners' ? 'الشركاء' : nextOwner === 'control-panel-catalog' ? 'الكتالوج' : nextOwner}</span>
                  {trail.length > 0 && (
                    <>
                      <span>•</span>
                      <span style={{ color: '#0369A1', fontWeight: 700 }}>سجل: {trail.length} حركة</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', borderRadius: '6px', backgroundColor: sStyle.bg, color: sStyle.fg, fontSize: '11px', fontWeight: 800, minWidth: '100px' }}>
                  {sStyle.label}
                </div>

                {canAct(item.stage) && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleAction(item.id, 'approve')} style={{ border: 'none', backgroundColor: '#10B981', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>قبول للمراجعة التسويقية</button>
                    <button onClick={() => handleAction(item.id, 'fix')} style={{ border: '1px solid #F59E0B', backgroundColor: 'transparent', color: '#F59E0B', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>طلب تعديل</button>
                    <button onClick={() => handleAction(item.id, 'reject')} style={{ border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>رفض</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ControlPanelDshPartnerApprovalsScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  catalogHref = '/catalogs',
  marketingHref = '/marketing',
  initialTab = 'inbox',
}: ControlPanelDshPartnerApprovalsScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [inboxCount, setInboxCount] = React.useState(0);

  React.useEffect(() => {
    setInboxCount(getPartnerIntakeItems().length);
  }, []);

  const TABS = [
    { id: 'inbox', label: 'الوارد من الشريك والميداني', count: inboxCount.toString() },
    { id: 'promotion', label: 'أهلية الترويج', count: '3' },
    { id: 'topology', label: 'مسارات الخدمة', count: '6' },
  ] as const;

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'inbox':
        return <CompactPartnerIntakeQueue />;
      case 'promotion':
        return <DshPartnerPromotionEligibilityScreen marketingHref={marketingHref} catalogHref={catalogHref} />;
      case 'topology':
        return <PartnerTopologyLane />;
      default:
        return <CompactPartnerIntakeQueue />;
    }
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <h1>بوابة الشركاء (Intake Gate)</h1>
          <p>المراجعة الأولى لكل الوارد من الحقل والشركاء</p>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {dshPartnerIntakeMetrics.map((metric) => (
              <div key={metric.id} className={styles.operationsPulseItem}>
                <span>{METRIC_ARABIC[metric.label] || metric.label}</span>
                <span>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Operations Tabs */}
      <nav className={styles.operationsTabs}>
        {TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span style={{
                marginRight: '8px',
                fontSize: '10px',
                backgroundColor: isSelected ? '#FF500D' : 'rgba(10,47,92,0.1)',
                color: isSelected ? '#fff' : '#0A2F5C',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 3. Main Active Area */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          {renderActiveLane()}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
