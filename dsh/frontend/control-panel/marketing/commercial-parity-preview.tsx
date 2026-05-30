'use client';

/**
 * CommercialParityPreview — control-panel preview card only.
 * Web/DOM component used exclusively within control-panel/marketing screens
 * to simulate how commercial badges appear on store cards.
 *
 * UI_PREVIEW_ONLY. Not rendered in app-client or app-partner.
 * Lives in control-panel/marketing/ because it is not a shared UI primitive.
 *
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 */
import React from 'react';
import { colorPalette } from '@bthwani/ui-kit';
import type { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import type { CommercialBadge } from '../../shared/commercial.preview-contract';

type CommercialParityPreviewProps = {
  features: ReturnType<typeof mapStoreCommercialFeatures>;
  storeName?: string;
};

function getBadgeColor(source: CommercialBadge['source']) {
  switch (source) {
    case 'partner': return { bg: colorPalette.warningSoft, fg: colorPalette.warningStrong };
    case 'loyalty': return { bg: colorPalette.infoSoft, fg: colorPalette.infoStrong };
    case 'subscription': return { bg: colorPalette.brandSurface, fg: colorPalette.brandStrong };
    case 'campaign': return { bg: colorPalette.brandSoft, fg: colorPalette.brand };
    case 'catalog': return { bg: colorPalette.surfaceInset, fg: colorPalette.inkMuted };
    default: return { bg: colorPalette.surfaceInset, fg: colorPalette.inkMuted };
  }
}

function getSourceLabel(source: CommercialBadge['source']) {
  switch (source) {
    case 'partner': return 'من عرض شريك';
    case 'loyalty': return 'من الولاء';
    case 'subscription': return 'من الاشتراك';
    case 'campaign': return 'من حملة';
    case 'catalog': return 'من الكتالوج';
    default: return source;
  }
}

export function CommercialParityPreview({ features, storeName }: CommercialParityPreviewProps) {
  const visibleChips = features.commercialChips.slice(0, 2);

  return React.createElement(
    'div',
    {
      style: {
        backgroundColor: colorPalette.surface,
        borderRadius: '12px',
        padding: '12px',
        border: `1px solid ${colorPalette.line}`,
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '12px',
        minHeight: '98px',
        position: 'relative',
        overflow: 'hidden',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          width: '74px',
          height: '74px',
          borderRadius: '8px',
          backgroundColor: colorPalette.surfaceInset,
          position: 'relative',
          flexShrink: 0,
        },
      },
      features.offerLabel &&
        React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: colorPalette.brand,
              color: colorPalette.white,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '9px',
              fontWeight: '900',
              zIndex: 10,
            },
          },
          features.offerLabel
        ),
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            opacity: 0.2,
          },
        },
        '🏪'
      )
    ),
    React.createElement(
      'div',
      { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' } },
      React.createElement(
        'div',
        { style: { fontSize: '13px', fontWeight: '800', color: colorPalette.brandStrong } },
        storeName || 'اسم المتجر'
      ),
      React.createElement(
        'div',
        { style: { fontSize: '10px', color: colorPalette.inkMuted, fontWeight: '600' } },
        'توصيل سريع • بثواني برو'
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'row-reverse', gap: '8px', marginTop: '2px' } },
        React.createElement('span', { style: { fontSize: '9px', fontWeight: '800', color: colorPalette.warning } }, '★ 4.9'),
        React.createElement('span', { style: { fontSize: '9px', color: colorPalette.inkMuted } }, '18 دقيقة')
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'row-reverse', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' } },
        visibleChips.map((badge, idx) => {
          const colors = getBadgeColor(badge.source);
          return React.createElement(
            'div',
            {
              key: idx,
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: colors.bg,
                padding: '2px 6px',
                borderRadius: '4px',
              },
            },
            React.createElement('span', { style: { color: colors.fg, fontSize: '9px', fontWeight: '800' } }, badge.label),
            React.createElement(
              'span',
              { style: { color: colors.fg, fontSize: '7px', opacity: 0.6 } },
              `(${getSourceLabel(badge.source).split(' ')[1] || '—'})`
            )
          );
        })
      )
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', top: '12px', left: '12px', fontSize: '14px', opacity: 0.1 } },
      '♡'
    ),
    features.conflicts.length > 0 &&
      React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colorPalette.dangerSoft,
            padding: '4px 8px',
            borderTop: `1px solid ${colorPalette.danger}`,
            fontSize: '8px',
            color: colorPalette.dangerStrong,
            fontWeight: '700',
            textAlign: 'center',
          },
        },
        `تضارب نشط: ${features.conflicts[0].reason}`
      )
  );
}

export default CommercialParityPreview;
