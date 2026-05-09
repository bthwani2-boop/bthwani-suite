'use client';

import React from 'react';
import { Box, Button, Surface, Text, Chip, Tabs, ListItem, KeyValueList } from '@bthwani/ui-kit';
import { getPartnerIntakeItems } from '../../shared/partner-intake-store';
import {
  ApprovalRecord,
  ApprovalStage,
  moveApprovalRecordToStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';

import styles from '../operations/dsh-surface.module.css';

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function CompactPartnerIntakeQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const refresh = () => setItems(getPartnerIntakeItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);

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

  const getStageMeta = (stage: ApprovalStage) => {
    const label = translateStage(stage);
    switch (stage) {
      case 'partner-submitted':
      case 'field-submitted': return { tone: 'warning', label };
      case 'partner-review': return { tone: 'brand', label };
      case 'needs-fix': return { tone: 'danger', label };
      case 'rejected': return { tone: 'default', label };
      case 'marketing-review': return { tone: 'success', label };
      default: return { tone: 'default', label };
    }
  };

  return (
    <Box layoutDirection="row" gap={4} style={{ flex: 1, minHeight: 0 }}>
      <Surface tone="raised" padding={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(10,47,92,0.08)', borderRadius: '12px' }}>
        <Box padding={3} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', backgroundColor: '#F8FAFC' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: '#0A2F5C' }}>الطلبات الواردة ({items.length})</Text>
        </Box>
        <Box style={{ flex: 1 }} padding={2}>
          <Box style={{ overflowY: 'auto', flex: 1 }}>
            {items.map(item => {
              const meta = getStageMeta(item.stage);
              const isSelected = item.id === selectedId;
              return (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={translateOwner(item.source)}
                  onPress={() => setSelectedId(item.id)}
                  selected={isSelected}
                  badgeLabel={meta.label}
                  badgeTone={meta.tone as any}
                />
              );
            })}
          </Box>
        </Box>
      </Surface>

      <Surface tone="raised" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
        {selected ? (
          <Box padding={4} gap={4} style={{ flex: 1, overflowY: 'auto' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box>
                <Text role="titleSm" style={{ textAlign: 'right', fontWeight: '900', color: '#0A2F5C' }}>{selected.title}</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>المعرف: <Text dir="ltr" style={{ fontWeight: 800 }}>{selected.id}</Text></Text>
              </Box>
              <Chip label={getStageMeta(selected.stage).label} tone={getStageMeta(selected.stage).tone as any} selected />
            </Box>

            <Surface tone="inset" padding={4} gap={2} style={{ backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
              <Text role="caption" tone="muted" style={{ fontWeight: 800, textAlign: 'right' }}>ملخص البيانات</Text>
              <KeyValueList
                items={[
                  { label: 'المصدر', value: translateOwner(selected.source) },
                  { label: 'النوع', value: translateEntityType(selected.entityType) },
                  { label: 'تاريخ التقديم', value: new Date().toLocaleDateString('ar-SA') },
                ]}
              />
            </Surface>

            {['partner-submitted', 'field-submitted', 'partner-review'].includes(selected.stage) && (
              <Box gap={3}>
                <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الإجراءات المتاحة</Text>
                <Box layoutDirection="row" gap={2}>
                  <Button style={{ flex: 2 }} label="قبول للمراجعة التسويقية" tone="brand" onPress={() => handleAction(selected.id, 'approve')} />
                  <Button style={{ flex: 1 }} label="طلب تعديل" tone="warning" onPress={() => handleAction(selected.id, 'fix')} />
                  <Button style={{ flex: 1 }} label="رفض" tone="danger" onPress={() => handleAction(selected.id, 'reject')} />
                </Box>
              </Box>
            )}

            {selected.stage === 'marketing-review' && (
              <Surface tone="success" padding={3} style={{ borderRadius: '10px', borderLeftWidth: 4, borderLeftColor: '#16A34A' }}>
                <Text role="caption" style={{ fontWeight: 800 }}>تم تحويل الطلب لفريق التسويق للمراجعة النهائية بنجاح.</Text>
              </Surface>
            )}
          </Box>
        ) : (
          <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text tone="muted">يرجى اختيار طلب لمراجعته</Text>
          </Box>
        )}
      </Surface>
    </Box>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────

export function ControlPanelDshPartnerApprovalsScreen() {
  const [activeTab, setActiveTab] = React.useState<'inbox' | 'promotion' | 'topology'>('inbox');

  const TABS = [
    { id: 'inbox', label: 'الوارد الجديد' },
    { id: 'promotion', label: 'أهلية الترويج' },
    { id: 'topology', label: 'مسارات الخدمة' },
  ] as const;

  const PULSE_METRICS = [
    { label: 'طلبات جديدة', value: '12', color: '#0A2F5C' },
    { label: 'قيد المراجعة', value: '5', color: '#D97706' },
    { label: 'مكتمل', value: '140', color: '#16A34A' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Partner Hub */}
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
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#DCFCE7', color: '#16A34A', borderRadius: '4px', fontWeight: '800' }}>استقبال نشط</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>إدارة قبول الشركاء وحوكمة البيانات الموردة</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {PULSE_METRICS.map((metric) => (
              <div key={metric.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{metric.label}</span>
                <span className={styles.commandKpiValue} style={{ color: metric.color }}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Cockpit Navigation */}
      <nav className={styles.navigationCockpit}>
        {TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Main Panel */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box style={{ padding: '16px', flex: 1, minHeight: 0 }}>
            {activeTab === 'inbox' ? (
              <CompactPartnerIntakeQueue />
            ) : (
              <Box align="center" justify="center" style={{ flex: 1, padding: '40px' }}>
                <Text tone="muted">هذا الجزء قيد التطوير المتقدم...</Text>
              </Box>
            )}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
