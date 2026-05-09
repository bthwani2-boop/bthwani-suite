import React from 'react';
import { Box, Button, Text, ListItem } from '@bthwani/ui-kit';
import { WebCompactSurfaceHeader } from '@bthwani/ui-kit/web';
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

  const pendingCount = items.filter(i => i.stage === 'marketing-approved').length;
  const badgeToneMap: Record<'default' | 'brand' | 'success' | 'danger', 'neutral' | 'success' | 'warning' | 'danger'> = {
    default: 'neutral',
    brand: 'neutral',
    success: 'success',
    danger: 'danger',
  };

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <WebCompactSurfaceHeader
        title="اعتماد الكتالوج الموحد"
        description="اعتماد العناصر النهائية لتصبح جزءًا من الكتالوج. لا يظهر للعميل إلا بعد التفعيل النهائي."
        metrics={[{ id: 'pending', title: 'بانتظار الاعتماد', value: String(pendingCount) }]}
      />
      <Box gap={2} style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', backgroundColor: '#F8FAFC' }}>
        {items.filter(i => ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(i.stage)).map(item => {
          const sStyle = getStageStyle(item.stage);

          return (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${translateEntityType(item.entityType)} · المصدر: ${translateOwner(item.source)}`}
              badgeLabel={sStyle.label}
              badgeTone={badgeToneMap[sStyle.tone]}
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
                      <Button label="تفعيل للعميل" tone="brand" size="sm" onClick={() => handleAction(item.id, 'visible')} />
                      <Button label="إعادة" tone="danger" size="sm" onClick={() => handleAction(item.id, 'fix')} />
                    </Box>
                  )}
                </Box>
              }
            />
          );
        })}
      </Box>
    </div>
  );
}
