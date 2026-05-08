import React from 'react';
import { Box, Button, Surface, Text, Chip, ListItem } from '@bthwani/ui-kit';
import {
  getCatalogAdoptionItems,
  adoptCatalogCentral,
  adoptCatalogException,
  activateClientVisible,
  returnToMarketing,
  rejectFromCatalog,
} from '../../shared/catalog-adoption-store';
import { ApprovalRecord, ApprovalStage, translateStage, translateEntityType, translateOwner } from '../../shared/workflow';

export function CatalogAdoptionQueue() {
  const [items, setItems] = React.useState<ApprovalRecord[]>([]);

  const refresh = () => setItems(getCatalogAdoptionItems());

  React.useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, action: 'adopt-central' | 'adopt-exception' | 'visible' | 'reject' | 'fix') => {
    const item = items.find(i => i.id === id);
    if (!item) return;

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
    const label = translateStage(stage);
    switch (stage) {
      case 'marketing-approved': return { tone: 'default' as const, label };
      case 'catalog-adopted': return { tone: 'brand' as const, label };
      case 'client-visible': return { tone: 'success' as const, label };
      case 'needs-fix': return { tone: 'danger' as const, label };
      case 'rejected': return { tone: 'default' as const, label };
      default: return { tone: 'default' as const, label };
    }
  };

  return (
    <Box dir="rtl" gap={4} padding={4} style={{ backgroundColor: '#F8FAFC', height: '100%', overflowY: 'auto' }}>
      <Surface tone="brand" padding={3} style={{ borderRadius: '12px', border: '1px solid #BAE6FD', backgroundColor: '#F0F9FF' }}>
        <Box gap={2}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '24px' }}>📦</Text>
            <Text role="bodyStrong" style={{ color: '#0369A1' }}>بوابة اعتماد الكتالوج الموحد</Text>
          </Box>
          <Text role="caption" style={{ color: '#0369A1', fontWeight: 600 }}>يتم هنا اعتماد العناصر النهائية والموافقة عليها لتصبح جزءًا من الكتالوج الموحد. لا يظهر للعميل إلا بعد التفعيل النهائي.</Text>
        </Box>
      </Surface>

      <Box gap={2}>
        {items.filter(i => ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(i.stage)).map(item => {
          const sStyle = getStageStyle(item.stage);

          return (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${translateEntityType(item.entityType)} · المصدر: ${translateOwner(item.source)}`}
              badgeLabel={sStyle.label}
              badgeTone={sStyle.tone as any}
              meta={
                <Box style={{ alignItems: 'flex-end', gap: '8px' }}>
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
              }
            />
          );
        })}
      </Box>
    </Box>
  );
}
