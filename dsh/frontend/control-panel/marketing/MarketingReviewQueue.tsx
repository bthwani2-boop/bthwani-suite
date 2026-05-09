'use client';

import React from 'react';
import { Box, Button, Surface, Text, Chip, ListItem } from '@bthwani/ui-kit';
import { getMarketingReviewItems, approveMediaReviewItem, requestMediaFix, rejectMediaReviewItem, sendMediaToCatalog } from '../../shared/marketing-review-store';
import { ApprovalRecord, ApprovalStage, isPartnerOwnedException } from '../../shared/workflow';

export function MarketingReviewQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);

  const refresh = () => setItems(getMarketingReviewItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, action: 'approve' | 'reject' | 'fix' | 'catalog') => {
    if (action === 'approve') {
      approveMediaReviewItem(id);
    } else if (action === 'reject') {
      rejectMediaReviewItem(id);
    } else if (action === 'fix') {
      requestMediaFix(id);
    } else if (action === 'catalog') {
      sendMediaToCatalog(id);
    }
    refresh();
  };

  const getStageMeta = (stage: ApprovalStage) => {
    switch (stage) {
      case 'marketing-review': return { tone: 'warning', label: 'قيد المراجعة التسويقية' };
      case 'marketing-approved': return { tone: 'brand', label: 'معتمد تسويقياً' };
      case 'catalog-adopted': return { tone: 'success', label: 'أُرسل للكتالوج' };
      case 'needs-fix': return { tone: 'danger', label: 'يتطلب تعديل' };
      case 'rejected': return { tone: 'default', label: 'مرفوض' };
      default: return { tone: 'default', label: stage };
    }
  };

  const entityLabel = (type: string) => {
    switch (type) {
      case 'product': return 'منتج جديد';
      case 'product-media': return 'صورة منتج';
      case 'category-suggestion': return 'فئة';
      case 'partner-offer': return 'عرض شريك';
      case 'store': return 'بيانات متجر';
      case 'video': return 'فيديو';
      case 'banner': return 'بنر';
      case 'promo': return 'برومو';
      default: return type;
    }
  };

  return (
    <Box dir="rtl" gap={4} padding={4} style={{ height: '100%', overflowY: 'auto' }}>
      <Surface tone="info" padding={3} layoutDirection="row" align="center" gap={3}>
        <Text style={{ fontSize: '20px' }}>🎯</Text>
        <Text role="caption" style={{ fontWeight: 600 }}>مراجعة التسويق: يتم هنا فحص العروض والصور والنصوص وتحويلها إلى الكتالوج النهائي.</Text>
      </Surface>

      <Box gap={2}>
        {items.filter(i => ['marketing-review', 'marketing-approved', 'needs-fix', 'rejected', 'catalog-adopted'].includes(i.stage)).map(item => {
          const meta = getStageMeta(item.stage);
          const policy = isPartnerOwnedException(item.stage, item.entityType) ? 'استثناء شريك' : 'وسائط كتالوج';

          return (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${entityLabel(item.entityType)} · من: ${item.source}`}
              badgeLabel={meta.label}
              badgeTone={meta.tone as any}
              meta={(
                <Box align="flex-end" gap={2}>
                  <Box layoutDirection="row" align="center" gap={2}>
                    <Box dir="ltr" paddingX={2} background="surfaceInset" radiusToken="xs">
                      <Text role="caption" style={{ fontSize: 10, fontFamily: 'monospace' }}>{item.id}</Text>
                    </Box>
                    <Chip label={`السياسة: ${policy}`} size="sm" tone="default" />
                  </Box>
                  {item.stage === 'marketing-review' && (
                    <Box layoutDirection="row" gap={1}>
                      <Button label="اعتماد" size="sm" tone="brand" onPress={() => handleAction(item.id, 'approve')} />
                      <Button label="تعديل" size="sm" tone="warning" onPress={() => handleAction(item.id, 'fix')} />
                      <Button label="رفض" size="sm" tone="danger" onPress={() => handleAction(item.id, 'reject')} />
                    </Box>
                  )}
                  {item.stage === 'marketing-approved' && (
                    <Button label="إرسال للكتالوج 🚀" size="sm" tone="success" onPress={() => handleAction(item.id, 'catalog')} />
                  )}
                </Box>
              )}
            />
          );
        })}
      </Box>
    </Box>
  );
}
