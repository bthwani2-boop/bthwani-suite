import React from 'react';
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

  const getStageStyle = (stage: ApprovalStage) => {
    switch (stage) {
      case 'marketing-review': return { bg: '#FEF3C7', fg: '#D97706', label: 'قيد المراجعة التسويقية' };
      case 'marketing-approved': return { bg: '#DBEAFE', fg: '#1D4ED8', label: 'معتمد تسويقياً' };
      case 'catalog-adopted': return { bg: '#DCFCE7', fg: '#16A34A', label: 'أُرسل للكتالوج' };
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
      case 'store': return 'بيانات متجر';
      case 'video': return 'فيديو';
      case 'banner': return 'بنر';
      case 'promo': return 'برومو';
      default: return type;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#FAFAFA', height: '100%', direction: 'rtl', overflowY: 'auto' }}>
      <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>🎯</span>
        <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: 600 }}>مراجعة التسويق: يتم هنا فحص العروض والصور والنصوص وتحويلها إلى الكتالوج النهائي (SSOT).</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.filter(i => ['marketing-review', 'marketing-approved', 'needs-fix', 'rejected', 'catalog-adopted'].includes(i.stage)).map(item => {
          const sStyle = getStageStyle(item.stage);
          const policy = isPartnerOwnedException(item.stage, item.entityType) ? 'partner-owned-exception' : 'catalog-owned-media';

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A2F5C' }}>{item.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 700 }}>{entityLabel(item.entityType)}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F3E8FF', color: '#7E22CE', fontWeight: 700 }}>من: {item.source}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}>{item.id}</span>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>السياسة: {policy}</span>
                  <span style={{ backgroundColor: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', color: '#0369A1', fontWeight: 700 }}>الهدف: الكتالوج</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 8px', borderRadius: '6px', backgroundColor: sStyle.bg, color: sStyle.fg, fontSize: '11px', fontWeight: 800, minWidth: '100px' }}>
                  {sStyle.label}
                </div>

                {item.stage === 'marketing-review' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleAction(item.id, 'approve')} style={{ border: 'none', backgroundColor: '#0369A1', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>اعتماد</button>
                    <button onClick={() => handleAction(item.id, 'fix')} style={{ border: '1px solid #F59E0B', backgroundColor: 'transparent', color: '#F59E0B', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>تعديل</button>
                    <button onClick={() => handleAction(item.id, 'reject')} style={{ border: '1px solid #EF4444', backgroundColor: 'transparent', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>رفض</button>
                  </div>
                )}

                {item.stage === 'marketing-approved' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleAction(item.id, 'catalog')} style={{ border: 'none', backgroundColor: '#16A34A', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>إرسال للكتالوج 🚀</button>
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
