// ML-053: Item approval section — used within ControlPanelDshCatalogScreen
// BLOCKED_BY_CONTRACT: catalog item approval API not proven
import React from 'react';
import { Box, Button, ListItem, Text } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';

type ItemApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

type CatalogItemApprovalRecord = {
  id: string;
  title: string;
  partnerName: string;
  category: string;
  submittedAt: string;
  status: ItemApprovalStatus;
};

const statusLabel: Record<ItemApprovalStatus, string> = {
  pending: 'بانتظار المراجعة',
  approved: 'معتمد',
  rejected: 'مرفوض',
  'needs-revision': 'يحتاج تعديل',
};

const statusTone: Record<ItemApprovalStatus, 'default' | 'success' | 'danger' | 'warning'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  'needs-revision': 'warning',
};

const demoItems: CatalogItemApprovalRecord[] = [
  { id: 'item-001', title: 'برجر دجاج مقرمش', partnerName: 'مطعم النجوم', category: 'وجبات رئيسية', submittedAt: '2026-05-15', status: 'pending' },
  { id: 'item-002', title: 'بيتزا مارجريتا', partnerName: 'مطبخ البيت', category: 'بيتزا', submittedAt: '2026-05-14', status: 'needs-revision' },
  { id: 'item-003', title: 'سلطة سيزر', partnerName: 'كافيه الصحة', category: 'سلطات', submittedAt: '2026-05-13', status: 'approved' },
];

export type ItemApprovalSectionProps = {
  items?: CatalogItemApprovalRecord[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestRevision?: (id: string) => void;
};

export function ItemApprovalSection({
  items = demoItems,
  onApprove,
  onReject,
  onRequestRevision,
}: ItemApprovalSectionProps) {
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <WebCompactSurfaceHeader
        title="اعتماد عناصر الكتالوج"
        description="مراجعة واعتماد العناصر المقدَّمة من الشركاء قبل نشرها."
        metrics={[{ id: 'pending', title: 'بانتظار الاعتماد', value: String(pendingCount) }]}
      />
      <Box gap={2} style={{ flex: 1, minHeight: 0, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#F8FAFC' }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            subtitle={`${item.partnerName} · ${item.category} · ${item.submittedAt}`}
            badgeLabel={statusLabel[item.status]}
            badgeTone={statusTone[item.status]}
            meta={
              item.status === 'pending' ? (
                <Box style={{ flexDirection: 'row', gap: '4px' }}>
                  <Button label="اعتماد" tone="primary" size="sm" onPress={() => onApprove?.(item.id)} />
                  <Button label="طلب تعديل" tone="secondary" size="sm" onPress={() => onRequestRevision?.(item.id)} />
                  <Button label="رفض" tone="danger" size="sm" onPress={() => onReject?.(item.id)} />
                </Box>
              ) : undefined
            }
          />
        ))}
        {items.length === 0 && (
          <Box padding={6} align="center">
            <Text tone="muted">لا توجد عناصر بانتظار الاعتماد.</Text>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default ItemApprovalSection;
