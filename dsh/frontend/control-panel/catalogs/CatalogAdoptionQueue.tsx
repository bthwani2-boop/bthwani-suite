import React from 'react';
import { Box, Button, Text, Surface, Chip } from '@bthwani/ui-kit';
import {
  getCatalogAdoptionItems,
  adoptCatalogCentral,
  adoptCatalogException,
  activateClientVisible,
  returnToMarketing,
  rejectFromCatalog,
} from '../../shared/catalog-adoption-store';
import { ApprovalRecord, ApprovalStage } from '../../shared/workflow';

export function CatalogAdoptionQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);

  const refresh = () => setItems(getCatalogAdoptionItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, action: 'adopt-central' | 'adopt-exception' | 'visible' | 'reject' | 'fix') => {
    switch (action) {
      case 'adopt-central':
        adoptCatalogCentral(id);
        break;
      case 'adopt-exception':
        adoptCatalogException(id);
        break;
      case 'visible':
        activateClientVisible(id);
        break;
      case 'fix':
        returnToMarketing(id);
        break;
      case 'reject':
        rejectFromCatalog(id);
        break;
    }
    refresh();
  };

  const getStageStyle = (stage: ApprovalStage) => {
    switch (stage) {
      case 'marketing-approved': return { tone: 'default' as const, label: 'بانتظار اعتماد الكتالوج' };
      case 'catalog-adopted': return { tone: 'brand' as const, label: 'تم ضمه للكتالوج (مسودة)' };
      case 'client-visible': return { tone: 'success' as const, label: 'نشط للعميل' };
      case 'needs-fix': return { tone: 'danger' as const, label: 'يتطلب تعديل' };
      case 'rejected': return { tone: 'default' as const, label: 'مرفوض' };
      default: return { tone: 'default' as const, label: stage };
    }
  };

  const entityLabel = (type: string) => {
    switch (type) {
      case 'product': return 'منتج جديد';
      case 'product-media': return 'صورة منتج';
      case 'category-suggestion': return 'فئة';
      case 'partner-offer': return 'عرض شريك';
      case 'store': return 'متجر';
      default: return type;
    }
  };

  return (
    <Box gap={4} style={{ padding: '16px', backgroundColor: '#F8FAFC', height: '100%', overflowY: 'auto' }} dir="rtl">
      <Surface tone="inset" padding={4} style={{ borderRadius: '12px', border: '1px solid #BAE6FD', backgroundColor: '#F0F9FF' }}>
        <Box gap={2}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '24px' }}>🛡️</Text>
            <Text role="bodyStrong" style={{ color: '#0369A1' }}>بوابة اعتماد الكتالوج (Catalog Adoption Gate)</Text>
          </Box>
          <Text role="caption" style={{ color: '#0369A1', fontWeight: 600 }}>يتم هنا اعتماد العناصر النهائية والموافقة عليها لتصبح جزءًا من الكتالوج الموحد. لا يظهر للعميل إلا بعد التفعيل (client-visible).</Text>
        </Box>
      </Surface>

      <Box gap={3}>
        {items.filter(i => ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(i.stage)).map(item => {
          const sStyle = getStageStyle(item.stage);
          const policy = item.metadata?.mediaPolicy || (item.entityType === 'product-media' ? 'partner-owned-exception' : 'catalog-owned-media');
          const trail = item.auditTrail || [];

          return (
            <Surface key={item.id} padding={4} style={{ borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
              <Box style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <Box gap={2} style={{ flex: 1 }}>
                  <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>{item.title}</Text>
                    <Chip label={entityLabel(item.entityType)} tone="default" />
                    <Chip label={`المصدر: ${item.source}`} tone="default" />
                  </Box>
                  <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Text role="caption" style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}>{item.id}</Text>
                    <Text role="caption" style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontWeight: 700, color: typeof policy === 'string' && policy.includes('catalog') ? '#16A34A' : '#D97706' }}>السياسة: {policy}</Text>
                    <Text role="caption" style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', color: '#0369A1', fontWeight: 700 }}>التأثير: {item.stage === 'client-visible' ? 'يظهر للعميل' : 'غير مرئي'}</Text>
                    {trail.length > 0 && (
                      <Chip label={`سجل: ${trail.length} حركة`} tone="brand" />
                    )}
                  </Box>
                </Box>

                <Box gap={2} style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                  <Chip label={sStyle.label} tone={sStyle.tone as any} />

                  {item.stage === 'marketing-approved' && (
                    <Box style={{ flexDirection: 'row', gap: '4px' }}>
                      <Button label="اعتماد مركزي" tone="primary" size="sm" onClick={() => handleAction(item.id, 'adopt-central')} />
                      <Button label="استثناء شريك" tone="secondary" size="sm" onClick={() => handleAction(item.id, 'adopt-exception')} />
                      <Button label="إعادة" tone="danger" size="sm" onClick={() => handleAction(item.id, 'fix')} />
                    </Box>
                  )}

                  {item.stage === 'catalog-adopted' && (
                    <Box style={{ flexDirection: 'row', gap: '4px' }}>
                      <Button label="تفعيل للعميل 🚀" tone="brand" size="sm" onClick={() => handleAction(item.id, 'visible')} />
                      <Button label="إعادة" tone="danger" size="sm" onClick={() => handleAction(item.id, 'fix')} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Surface>
          );
        })}
      </Box>
    </Box>
  );
}
