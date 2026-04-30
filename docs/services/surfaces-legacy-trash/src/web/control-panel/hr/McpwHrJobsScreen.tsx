'use client';

/**
 * McpwHrJobsScreen — Jobs Management
 * Uses fixtures for design seed.
 */

import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import {
  mockJobs,
  JOB_TYPE_LABELS,
  JOB_STATUS_CONFIG,
  JOBS_STATS,
  type JobFixture,
} from './fixtures/jobs';

function JobCard({ title, department, location, type, applicants, postedDate, status }: JobFixture) {
  const statusStyle = JOB_STATUS_CONFIG[status];

  return (
    <div
      style={{
        backgroundColor: '#FFF',
        borderRadius: 16,
        border: '1px solid #E8E8E8',
        padding: 20,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{department}</p>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} color="#9CA3AF" />
          <span style={{ fontSize: 13, color: '#666' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Briefcase size={14} color="#9CA3AF" />
          <span style={{ fontSize: 13, color: '#666' }}>{JOB_TYPE_LABELS[type]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={14} color="#9CA3AF" />
          <span style={{ fontSize: 13, color: '#666' }}>{postedDate}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 10 }}>
        <Users size={18} color="#3B82F6" />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{applicants}</span>
        <span style={{ fontSize: 13, color: '#666' }}>متقدم</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          عرض المتقدمين
        </button>
        <button
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            cursor: 'pointer',
          }}
        >
          <ExternalLink size={16} color="#6B7280" />
        </button>
      </div>
    </div>
  );
}

export default function McpwHrJobsScreen() {
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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }}
            >
              <Briefcase size={28} color="#FFF" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>الوظائف</h1>
              <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                إدارة الوظائف والتوظيف
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
              backgroundColor: '#8B5CF6',
              color: '#FFF',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={18} />
            وظيفة جديدة
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            size={18}
            color="#9CA3AF"
            style={{
              position: 'absolute',
              [isRTL ? 'right' : 'left']: 14,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="البحث عن وظيفة..."
            style={{
              width: '100%',
              padding: '12px 14px',
              paddingInlineStart: 44,
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            fontSize: 14,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <Filter size={18} />
          فلترة
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {JOBS_STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              border: '1px solid #E8E8E8',
              padding: 16,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {mockJobs.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
      </div>
    </div>
  );
}
