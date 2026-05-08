import React from 'react';
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
      case 'marketing-approved': return { bg: '#FEF3C7', fg: '#D97706', label: 'بانتظار اعتماد الكتالوج' };
      case 'catalog-adopted': return { bg: '#DBEAFE', fg: '#1D4ED8', label: 'تم ضمه للكتالوج (مسودة)' };
      case 'client-visible': return { bg: '#DCFCE7', fg: '#16A34A', label: 'نشط للعميل' };
      case 'needs-fix': return { bg: '#FEF2F2', fg: '#DC2626', label: 'يتطلب تعديل' };
      case 'rejected': return { bg: '#F1F5F9', fg: '#475569', label: 'مرفوض' };
      default: return { bg: '#F1F5F9', fg: '#475569', label: stage };
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#FAFAFA', height: '100%', direction: 'rtl', overflowY: 'auto' }}>
      <div style={{ backgroundColor: '#F0F9FF', padding: '16px', borderRadius: '12px', border: '1px solid #BAE6FD', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <span style={{ fontSize: '16px', color: '#0369A1', fontWeight: 800 }}>بوابة اعتماد الكتالوج (Catalog Adoption Gate)</span>
        </div>
        <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: 600 }}>يتم هنا اعتماد العناصر النهائية والموافقة عليها لتصبح جزءًا من الكتالوج الموحد. لا يظهر للعميل إلا بعد التفعيل (client-visible).</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.filter(i => ['marketing-approved', 'catalog-adopted', 'client-visible', 'needs-fix', 'rejected'].includes(i.stage)).map(item => {
          const sStyle = getStageStyle(item.stage);
          const policy = item.metadata?.mediaPolicy || (item.entityType === 'product-media' ? 'partner-owned-exception' : 'catalog-owned-media');
          const trail = item.auditTrail || [];

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0A2F5C' }}>{item.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800 }}>{entityLabel(item.entityType)}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F3E8FF', color: '#7E22CE', fontWeight: 800 }}>المصدر: {item.source}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}>{item.id}</span>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontWeight: 700, color: typeof policy === 'string' && policy.includes('catalog') ? '#16A34A' : '#D97706' }}>السياسة: {policy}</span>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', color: '#0369A1', fontWeight: 700 }}>التأثير: {item.stage === 'client-visible' ? 'يظهر للعميل' : 'غير مرئي'}</span>
                  {trail.length > 0 && (
                    <span style={{ backgroundColor: '#E0F2FE', padding: '2px 6px', borderRadius: '4px', color: '#0369A1', fontWeight: 700 }}>سجل: {trail.length} حركة</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 10px', borderRadius: '6px', backgroundColor: sStyle.bg, color: sStyle.fg, fontSize: '11px', fontWeight: 800, minWidth: '110px' }}>
                  {sStyle.label}
                </div>

                {item.stage === 'marketing-approved' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleAction(item.id, 'adopt-central')} style={{ border: 'none', backgroundColor: '#10B981', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>اعتماد مركزي</button>
                    <button onClick={() => handleAction(item.id, 'adopt-exception')} style={{ border: 'none', backgroundColor: '#F59E0B', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>استثناء شريك</button>
                    <button onClick={() => handleAction(item.id, 'fix')} style={{ border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>إعادة</button>
                  </div>
                )}

                {item.stage === 'catalog-adopted' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleAction(item.id, 'visible')} style={{ border: 'none', backgroundColor: '#0284C7', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>تفعيل للعميل 🚀</button>
                    <button onClick={() => handleAction(item.id, 'fix')} style={{ border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>إعادة</button>
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
