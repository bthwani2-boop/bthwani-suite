'use client';

import { BTHWANI_COLORS } from '@bthwani/ui-kit';

function McpwDshOperationsScreen() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: BTHWANI_COLORS.info, borderRadius: '4px' }}></div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>لوحة عمليات توصيل وتسوق</h1>
          <p style={{ color: BTHWANI_COLORS.onSurfaceMuted, margin: 0 }}>إدارة طلبات توصيل وتسوق والعمليات المرتبطة</p>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>العمليات المتاحة</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <a
            href="/operations/dsh/sheinproxy"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>طلبات SHEIN بالوكالة</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>إدارة طلبات الشراء من شي إن (Proxy)</span>
          </a>
          <a
            href="/operations/dsh/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>طلبات عونك (طلب يدوي)</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>متابعة طلبات عونك اليدوية ضمن قائمة الطلبات</span>
          </a>
          <a
            href="/operations/dsh/orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>إدارة الطلبات</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>إدارة جميع الطلبات</span>
          </a>
          <a
            href="/operations/dsh/reassign"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>إعادة تعيين التوصيل</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>إعادة تعيين توصيلة لكابتن آخر</span>
          </a>
          <a
            href="/operations/dsh/zone-set"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>نطاق التوصيل</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>تعيين نطاق التوصيل للمتجر</span>
          </a>
          <a
            href="/operations/dsh/peak-mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>وضع الذروة</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>السماح بعدة طلبات للكابتن في ساعات الذروة</span>
          </a>
          <a
            href="/operations/dsh/arrival-bell"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BTHWANI_COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: '500' }}>جرس الوصول</span>
            <span style={{ fontSize: '14px', color: BTHWANI_COLORS.onSurfaceMuted }}>إعدادات جرس الوصول (VAR_*) وتايملاين الطلب</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default McpwDshOperationsScreen;
