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
      <Surface tone="raised" padding={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box padding={3} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>طلبات الواردة ({items.length})</Text>
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

      <Surface tone="raised" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '16px' }}>
        {selected ? (
          <Box padding={4} gap={4} style={{ flex: 1, overflowY: 'auto' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Box>
                <Text role="titleSm" style={{ textAlign: 'right' }}>{selected.title}</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>المعرف: <Text dir="ltr" style={{ fontWeight: 800 }}>{selected.id}</Text></Text>
              </Box>
              <Chip label={getStageMeta(selected.stage).label} tone={getStageMeta(selected.stage).tone as any} selected />
            </Box>

            <Surface tone="inset" padding={4} gap={2}>
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
                <Text role="bodyStrong">الإجراءات المتاحة</Text>
                <Box layoutDirection="row" gap={2}>
                  <Button style={{ flex: 2 }} label="قبول للمراجعة التسويقية ✓" tone="brand" onPress={() => handleAction(selected.id, 'approve')} />
                  <Button style={{ flex: 1 }} label="طلب تعديل ✏️" tone="warning" onPress={() => handleAction(selected.id, 'fix')} />
                  <Button style={{ flex: 1 }} label="رفض ✕" tone="danger" onPress={() => handleAction(selected.id, 'reject')} />
                </Box>
              </Box>
            )}

            {selected.stage === 'marketing-review' && (
              <Surface tone="success" padding={3} style={{ borderRadius: '12px' }}>
                <Text role="caption" style={{ fontWeight: 800 }}>✅ تم تحويل الطلب لفريق التسويق للمراجعة النهائية.</Text>
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

  return (
    <Box dir="rtl" gap={4} padding={4} style={{ height: '100%', overflow: 'hidden' }}>
      <Box>
        <Text role="titleLg" style={{ fontWeight: 900, textAlign: 'right' }}>بوابة استقبال طلبات الشركاء</Text>
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>المراجعة الأولى لكل الوارد من الحقل والشركاء</Text>
      </Box>

      <Surface tone="raised" padding={2}>
        <Tabs<'inbox' | 'promotion' | 'topology'>
          items={[
            { value: 'inbox', label: 'الوارد الجديد' },
            { value: 'promotion', label: 'أهلية الترويج' },
            { value: 'topology', label: 'مسارات الخدمة' },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
          variant="pill"
        />
      </Surface>

      <Box style={{ flex: 1, minHeight: 0 }}>
        {activeTab === 'inbox' ? (
          <CompactPartnerIntakeQueue />
        ) : (
          <Box align="center" justify="center" style={{ flex: 1 }}>
            <Text tone="muted">هذا الجزء قيد التطوير...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ControlPanelDshPartnerApprovalsScreen;
