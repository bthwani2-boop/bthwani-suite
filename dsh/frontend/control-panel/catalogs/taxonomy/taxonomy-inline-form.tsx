'use client';

import React from 'react';
import { useTheme } from '@bthwani/ui-kit';

type TaxonomyInlineFormProps = {
  /** Title shown above the form */
  title?: string;
  labelPlaceholder?: string;
  subtitlePlaceholder?: string;
  showSubtitle?: boolean;
  value: string;
  subtitleValue?: string;
  onChange: (v: string) => void;
  onSubtitleChange?: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Compact mode hides the title and reduces padding */
  compact?: boolean;
};

export function TaxonomyInlineForm({
  title,
  labelPlaceholder = 'الاسم *',
  subtitlePlaceholder = 'الوصف (اختياري)',
  showSubtitle = true,
  value,
  subtitleValue = '',
  onChange,
  onSubtitleChange,
  onConfirm,
  onCancel,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  compact = false,
}: TaxonomyInlineFormProps) {
  const { theme } = useTheme();
  const padding = compact ? '4px 44px' : '8px 14px';
  const fontSize = compact ? '9px' : '11px';
  const btnFontSize = compact ? '9px' : '10px';

  return (
    <div style={{ padding, borderTop: '1px solid ' + theme.line, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column', gap: compact ? '4px' : '6px' }}>
      {title && !compact && (
        <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brandHeaderBackground }}>{title}</span>
      )}
      <input
        type="text"
        placeholder={labelPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); if (e.key === 'Escape') onCancel(); }}
        autoFocus
        style={{
          padding: compact ? '3px 6px' : '4px 8px',
          borderRadius: '4px',
          border: '1px solid ' + theme.lineStrong,
          direction: 'rtl',
          backgroundColor: theme.surface,
          color: theme.brandHeaderBackground,
          fontSize,
          outline: 'none',
        }}
      />
      {showSubtitle && onSubtitleChange && (
        <input
          type="text"
          placeholder={subtitlePlaceholder}
          value={subtitleValue}
          onChange={(e) => onSubtitleChange(e.target.value)}
          style={{
            padding: compact ? '3px 6px' : '4px 8px',
            borderRadius: '4px',
            border: '1px solid ' + theme.lineStrong,
            direction: 'rtl',
            backgroundColor: theme.surface,
            color: theme.brandHeaderBackground,
            fontSize,
            outline: 'none',
          }}
        />
      )}
      <div style={{ display: 'flex', gap: compact ? '4px' : '6px' }}>
        <button
          onClick={onConfirm}
          style={{ padding: compact ? '2px 8px' : '3px 12px', borderRadius: '4px', fontSize: btnFontSize, fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          style={{ padding: compact ? '2px 8px' : '3px 12px', borderRadius: '4px', fontSize: btnFontSize, fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
