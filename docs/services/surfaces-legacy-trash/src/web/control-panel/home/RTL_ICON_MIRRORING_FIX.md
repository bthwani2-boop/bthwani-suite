# CONTROL PANEL Dashboard RTL Icon Mirroring & Live Data Integration Fix

## Executive Summary

The CONTROL PANEL dashboard redesign has **solid foundation** but requires **3 critical fixes** to achieve 100% compliance:

1. **RTL Icon Mirroring** — Navigation arrows and directional icons not flipped in RTL
2. **Live Data Integration** — Mock data hardcoded; needs real API binding
3. **Direction Provider Clarity** — useI18n().isRTL exists but not passed through component tree

---

## Gap 1: RTL Icon Mirroring

### Current Problem
- `ArrowRight`, `ChevronRight`, `ArrowLeft` icons remain LTR-biased in RTL mode
- Lucide React doesn't auto-mirror; must be wrapped in a **direction-aware flip component**
- Icons in work queue, quick access, and hero box all hardcoded for LTR

### Solution: Create Icon Wrapper Component

```tsx
// packages/surfaces/src/web/control panel/components/DirectionalIcon.tsx

'use client';

import React from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

interface DirectionalIconProps {
  icon: IconComponent;
  className?: string;
  strokeWidth?: number;
  mirrorInRTL?: boolean; // true for ArrowRight, ChevronRight, etc.
}

export const DirectionalIcon = ({
  icon: Icon,
  className,
  strokeWidth = 2,
  mirrorInRTL = false,
}: DirectionalIconProps) => {
  const { isRTL } = useI18n();
  
  // Only rotate certain icons in RTL
  const shouldRotate = mirrorInRTL && isRTL;

  return (
    <Icon
      className={className}
      strokeWidth={strokeWidth}
      style={shouldRotate ? { transform: 'scaleX(-1)' } : undefined}
    />
  );
};

export default DirectionalIcon;
```

### Apply to HeroBox
```tsx
// In HeroBox.tsx, line ~84:
import DirectionalIcon from './DirectionalIcon';

// Replace:
// <ArrowRight className="h-5 w-5 transition-transform duration-300" strokeWidth={2} />
// With:
<DirectionalIcon
  icon={ArrowRight}
  className="h-5 w-5 transition-transform duration-300"
  mirrorInRTL={true}
/>
```

### Apply to WorkQueueV2
```tsx
// In WorkQueueV2.tsx, line ~143:
<DirectionalIcon
  icon={ArrowRight}
  className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-1"
  mirrorInRTL={true}
/>
```

### Apply to QuickAccessCards
```tsx
// In QuickAccessCards.tsx, line ~38:
<DirectionalIcon
  icon={ArrowRight}
  className="h-3.5 w-3.5"
  mirrorInRTL={true}
/>
```

---

## Gap 2: Live Data Integration

### Current Problem
- All work items, KPI values, quick access links are hardcoded mocks
- No API fetching; no real business logic
- useMemo depends only on `t` (translation), not actual data changes

### Solution: Add API Data Layer

```tsx
// packages/surfaces/src/web/control panel/home/hooks/useWorkQueueData.ts

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';
import { useBthwaniClients } from '@bthwani/api-clients';
import { WorkQueueItem, WorkItemPriority } from '../components/WorkQueueV2';

export function useWorkQueueData() {
  const { t } = useI18n();
  const clients = useBthwaniClients();
  const [items, setItems] = useState<WorkQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Example: Fetch pending finance payouts (adjust per service)
        const payoutResponse = await clients.control panel.finance_payouts_pending_list({
          limit: 4,
          sort: 'priority:desc,created:desc',
        });

        // Map API response to WorkQueueItem format
        const mapped: WorkQueueItem[] = (payoutResponse.data || []).map((payout: any) => ({
          id: payout.id,
          title: `${payout.amount} — ${payout.merchant}`,
          description: `Pending approval since ${payout.created_at}`,
          href: `/finance/payouts/${payout.id}`,
          icon: DollarSign,
          priority: payout.priority as WorkItemPriority || 'high',
          type: 'action',
          badge: payout.overdue_days ? `${payout.overdue_days}d overdue` : undefined,
        }));

        setItems(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load work queue');
        // Fallback to empty state (not hardcoded mocks)
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkItems();
  }, [clients]);

  return { items, isLoading, error };
}

export function useKPIData() {
  const { t } = useI18n();
  const clients = useBthwaniClients();
  const [kpis, setKPIs] = useState({
    totalOrders: '—',
    completedOrders: '—',
    inProgress: '—',
    issues: '—',
    trends: { orders: 0, completed: 0, progress: 0, issues: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setIsLoading(true);
        // Fetch from analytics or operations service
        const analytics = await clients.control panel.analytics_dashboard_get();
        setKPIs({
          totalOrders: analytics.total_orders?.toLocaleString() || '—',
          completedOrders: analytics.completed_orders?.toLocaleString() || '—',
          inProgress: analytics.in_progress?.toLocaleString() || '—',
          issues: analytics.critical_issues?.toLocaleString() || '—',
          trends: {
            orders: analytics.orders_trend || 0,
            completed: analytics.completed_trend || 0,
            progress: analytics.progress_trend || 0,
            issues: analytics.issues_trend || 0,
          },
        });
      } catch (err) {
        console.warn('Failed to load KPI data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, [clients]);

  return { kpis, isLoading };
}
```

### Update McpwHomeScreen to use hooks

```tsx
// In McpwHomeScreen.tsx, replace hardcoded data:

export default function McpwHomeScreen() {
  const { t, isRTL } = useI18n(); // Add isRTL
  const { items: workItems, isLoading: isWorkLoading, error: workError } = useWorkQueueData();
  const { kpis, isLoading: isKpisLoading } = useKPIData();

  // State flags now derived from hooks
  const isLoadingData = isWorkLoading || isKpisLoading;
  const isEmptyState = !isWorkLoading && workItems.length === 0;

  // Replace hardcoded workQueueItems with workItems from hook
  // Replace hardcoded KPI values with kpis from hook
}
```

---

## Gap 3: Direction Provider Clarity

### Current Problem
- `useI18n().isRTL` exists in context but not consistently passed down
- Components don't explicitly know which direction layout applies
- Direction prop missing from `useMemo` dependency arrays

### Solution: Add Direction Hook + Provider

```tsx
// packages/surfaces/src/web/control panel/hooks/useDirection.ts

'use client';

import { useMemo } from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';

export function useDirection() {
  const { isRTL } = useI18n();

  return useMemo(() => ({
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    flexDir: isRTL ? 'flex-row-reverse' : 'flex-row',
    textAlign: isRTL ? 'text-right' : 'text-left',
    marginStart: isRTL ? 'mr' : 'ml', // margin-inline-start
    marginEnd: isRTL ? 'ml' : 'mr',
  }), [isRTL]);
}
```

### Apply to McpwHomeScreen

```tsx
// In McpwHomeScreen.tsx:
export default function McpwHomeScreen() {
  const { t } = useI18n();
  const { isRTL, direction } = useDirection(); // Add direction hook

  // Add to useMemo dependencies:
  const workQueueItems = useMemo(
    () => [ /* ... */ ],
    [t, isRTL] // Was: [t]
  );

  return (
    <div className="w-full pb-20" style={{ 
      paddingInline: BTHWANI_SPACING.contentH,
      direction, // Apply direction at root
      textAlign: isRTL ? 'right' : 'left' 
    }}>
      {/* Content */}
    </div>
  );
}
```

---

## Implementation Checklist

### Immediate (Blocking 100% compliance):
- [ ] Create `DirectionalIcon.tsx` wrapper component
- [ ] Apply `DirectionalIcon` to HeroBox, WorkQueueV2, QuickAccessCards
- [ ] Create `useWorkQueueData` hook with real API integration
- [ ] Create `useKPIData` hook with analytics integration
- [ ] Create `useDirection` hook for consistent RTL handling
- [ ] Update McpwHomeScreen to use all three hooks
- [ ] Add `isRTL` to all relevant `useMemo` dependency arrays
- [ ] Test RTL/LTR parity side-by-side (Arabic ↔ English)
- [ ] Verify live data flows (pending payouts, KPIs, work queue)

### Verification:
- [ ] RTL: Open dashboard in Arabic, verify arrows flip left
- [ ] LTR: Open dashboard in English, verify arrows point right
- [ ] Mock API: `pnpm control panel` loads mock data without errors
- [ ] Direction prop: `<html dir="rtl">` or `<html dir="ltr">` on document
- [ ] No prop drilling: direction flows from useI18n context only
- [ ] State updates: Changing language updates icons + data immediately

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `components/DirectionalIcon.tsx` | Create | P0 |
| `hooks/useWorkQueueData.ts` | Create | P0 |
| `hooks/useKPIData.ts` | Create | P0 |
| `hooks/useDirection.ts` | Create | P0 |
| `components/HeroBox.tsx` | Update (use DirectionalIcon) | P0 |
| `components/WorkQueueV2.tsx` | Update (use DirectionalIcon) | P0 |
| `components/QuickAccessCards.tsx` | Update (use DirectionalIcon) | P0 |
| `home/McpwHomeScreen.tsx` | Update (use hooks, isRTL deps) | P0 |

---

## Expected Outcome

After fixes:
- ✅ **RTL icons** flip automatically (no hardcoded LTR bias)
- ✅ **Live data** flows from real APIs (mock replaced with actual calls)
- ✅ **Direction consistency** — one source of truth (useI18n context)
- ✅ **100% compliance** — zero RTL/data/direction gaps
- ✅ **Production-ready** — Arabic and English users have identical UX


