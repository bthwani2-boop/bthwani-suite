'use client';

/**
 * McpwHrReportsScreen — HR Reports
 * Uses fixtures for design seed.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  FileText,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { mockReports, type ReportFixture } from './fixtures/reports';

function ReportCard({ title, description, icon: Icon, color, lastGenerated }: ReportFixture) {
  return (
    <div
      style={{
        backgroundColor: '#FFF',
        borderRadius: 16,
        border: '1px solid #E8E8E8',
        padding: 20,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${color}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={24} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>{description}</p>
          {lastGenerated && (
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '8px 0 0' }}>
              آخر تحديث: {lastGenerated}
            </p>
          )}
        </div>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8 }}>
        <button
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: `${color}12`,
            color: color,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          عرض التقرير
        </button>
        <button
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            cursor: 'pointer',
          }}
        >
          <Download size={16} color="#6B7280" />
        </button>
      </div>
    </div>
  );
}

export default function McpwHrReportsScreen() {
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
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              }}
            >
              <FileText size={28} color="#FFF" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>التقارير</h1>
              <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                تقارير الموارد البشرية والتحليلات
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
              backgroundColor: '#F59E0B',
              color: '#FFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FileText size={18} />
            إنشاء تقرير مخصص
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}
      >
        {mockReports.map((report, i) => (
          <ReportCard key={i} {...report} />
        ))}
      </div>
    </div>
  );
}
