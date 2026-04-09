'use client';

/**
 * McpwHrPayrollScreen — Payroll Management
 * Uses fixtures for design seed.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Banknote,
  ArrowLeft,
  Download,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { PAYROLL_STATS, mockRecentPayrolls } from './fixtures/payroll';

export default function McpwHrPayrollScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Link
        href="/hr"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#6B7280',
          textDecoration: 'none',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        <DirectionalIcon icon={ArrowLeft} mirrorInRTL={true} size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}  />
        الموارد البشرية
      </Link>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
              }}
            >
              <Banknote size={28} color="#FFF" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>الرواتب</h1>
              <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                إدارة الرواتب والمكافآت
              </p>
            </div>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#22C55E',
              color: '#FFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={18} />
            تصدير التقرير
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {PAYROLL_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: '#FFF',
                borderRadius: 16,
                border: '1px solid #E8E8E8',
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: '#666', margin: '2px 0 0' }}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: 16, border: '1px solid #E8E8E8', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>سجل الرواتب</h2>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFF',
              fontSize: 13,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <Calendar size={16} />
            اختيار الفترة
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 13, fontWeight: 600, color: '#6B7280' }}>الشهر</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 13, fontWeight: 600, color: '#6B7280' }}>الإجمالي</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 13, fontWeight: 600, color: '#6B7280' }}>الموظفين</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 13, fontWeight: 600, color: '#6B7280' }}>الحالة</th>
              <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 13, fontWeight: 600, color: '#6B7280' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentPayrolls.map((payroll, i) => (
              <tr key={i} style={{ borderTop: '1px solid #E8E8E8' }}>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{payroll.month}</td>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#374151' }}>{payroll.total}</td>
                <td style={{ padding: '16px 24px', fontSize: 14, color: '#374151' }}>{payroll.employees}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                    <CheckCircle2 size={14} />
                    مكتمل
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#FFF',
                      fontSize: 12,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
