'use client';

/**
 * SkeletonScreen — Modern Professional Placeholder
 * 
 * REDESIGNED: Clean, modern cards with icons and better visual hierarchy
 */

import type { LucideIcon } from 'lucide-react';
import { Activity, ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';

interface SkeletonScreenProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showComingSoon?: boolean;
  primaryAction?: React.ReactNode;
  sections?: Array<{
    title: string;
    description?: string;
    items?: Array<{
      label: string;
      href?: string;
      description?: string;
      icon?: LucideIcon;
      count?: number;
      color?: string;
    }>;
  }>;
}

export function SkeletonScreen({
  title,
  subtitle,
  icon: Icon = Activity,
  showComingSoon = true,
  primaryAction,
  sections = [],
}: SkeletonScreenProps) {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Page Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
            }}
          >
            <Icon size={24} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {primaryAction}
      </div>

      {/* Coming Soon Banner */}
      {showComingSoon && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            border: '1px solid #FED7AA',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} color="#FFF" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#9A3412', margin: 0 }}>
              قيد التطوير
            </h3>
            <p style={{ fontSize: 13, color: '#C2410C', margin: '2px 0 0' }}>
              هذه الصفحة قيد التطوير وسيتم إضافة المحتوى قريباً
            </p>
          </div>
        </div>
      )}

      {/* Sections */}
      {sections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {sections.map((section, index) => (
            <div key={index}>
              <h2 
                style={{ 
                  fontSize: 17, 
                  fontWeight: 600, 
                  color: '#1A1A1A', 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {section.title}
              </h2>
              
              {section.description && (
                <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                  {section.description}
                </p>
              )}

              {section.items && section.items.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}
                >
                  {section.items.map((item, itemIndex) => {
                    const ItemIcon = item.icon || Activity;
                    const color = item.color || '#F97316';
                    
                    const cardContent = (
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 16,
                          padding: 20,
                          border: '1px solid #E5E5E5',
                          transition: 'all 0.2s ease',
                          cursor: item.href ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 16,
                        }}
                        onMouseEnter={(e) => {
                          if (item.href) {
                            e.currentTarget.style.borderColor = color;
                            e.currentTarget.style.boxShadow = `0 4px 16px ${color}20`;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E5E5E5';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Icon */}
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
                          <ItemIcon size={22} style={{ color }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                              {item.label}
                            </h3>
                            {item.count !== undefined && (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: color,
                                  backgroundColor: `${color}12`,
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                }}
                              >
                                {item.count}
                              </span>
                            )}
                          </div>
                          
                          {item.description && (
                            <p style={{ fontSize: 13, color: '#666', margin: '6px 0 0', lineHeight: 1.5 }}>
                              {item.description}
                            </p>
                          )}

                          {item.href && (
                            <div 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 4, 
                                marginTop: 12,
                                fontSize: 13,
                                fontWeight: 500,
                                color: color,
                              }}
                            >
                              <span>عرض</span>
                              <DirectionalIcon icon={ChevronLeft} mirrorInRTL={true} size={16} style={{ transform: isRTL ? 'rotate(0)' : 'rotate(180deg)' }}  />
                            </div>
                          )}
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link 
                          key={itemIndex} 
                          href={item.href}
                          style={{ textDecoration: 'none' }}
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return <div key={itemIndex}>{cardContent}</div>;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
